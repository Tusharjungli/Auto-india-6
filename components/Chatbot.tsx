"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

type Message = {
  from: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I'm a dummy bot for now. Real AI coming soon!" },
      ]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button - Adjusted position to avoid overlap */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-24 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all z-40"
        aria-label="Open Chatbot"
      >
        <Bot className="w-6 h-6" />
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-80 bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-xl flex flex-col overflow-hidden z-50 animate-fade-in">
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white dark:bg-blue-800">
            <h4 className="text-sm font-semibold">AutoBot</h4>
            <button onClick={() => setOpen(false)} aria-label="Close Chat">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto max-h-80 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  msg.from === "user"
                    ? "bg-gray-200 dark:bg-gray-700 self-end text-right"
                    : "bg-gray-100 dark:bg-gray-800 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex p-2 border-t border-gray-300 dark:border-gray-700">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
              placeholder="Type a message..."
            />
            <button onClick={handleSend} className="ml-2 text-blue-600 dark:text-blue-400">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
