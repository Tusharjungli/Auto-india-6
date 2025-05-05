"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");

  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone,
        category,
        message,
        email: session?.user?.email || null,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTimeout(() => {
      setName("");
      setPhone("");
      setCategory("General");
      setMessage("");
      setIsOpen(false);
      setSubmitted(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-lg hover:scale-105 transition-all z-50"
        aria-label="Open Feedback"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-xl p-4 z-50 animate-fade-in">
          <h3 className="text-lg font-semibold mb-2">We’d love your feedback!</h3>
          <form onSubmit={handleSubmit} className="space-y-3 text-sm">
            <input
              type="text"
              placeholder="Your name "
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <input
              type="text"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <option>General</option>
              <option>UI</option>
              <option>Product</option>
              <option>Bug</option>
              <option>Suggestion</option>
            </select>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your feedback..."
              rows={4}
              required
              className="w-full rounded-md p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 resize-none"
            />
            <button
              type="submit"
              className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded-md hover:opacity-90 transition"
            >
              {submitted ? "Thanks!" : "Submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
