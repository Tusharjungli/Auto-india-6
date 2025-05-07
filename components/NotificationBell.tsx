"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    const res = await fetch("/api/user/notifications/mark-read", {
      method: "POST",
    });
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded shadow z-50 text-sm">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <ul className="max-h-60 overflow-auto">
            {notifications.length === 0 ? (
              <li className="p-3 text-gray-500 text-center">No notifications</li>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <li
                  key={n.id}
                  className={`px-3 py-2 border-b border-gray-100 dark:border-gray-800 ${
                    !n.read ? "font-medium" : "text-gray-400"
                  }`}
                >
                  {n.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
