"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-gray-600 dark:text-gray-400 py-10 border-t border-gray-300 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 text-sm flex flex-col sm:flex-row justify-between">
        <div>
          <h3 className="text-black dark:text-white font-semibold">Auto India Spare Parts</h3>
          <p>Your trusted source for genuine auto parts across India.</p>
        </div>
        <div className="mt-6 sm:mt-0 space-x-4">
          <Link href="/privacy" className="hover:text-black dark:hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-black dark:hover:text-white">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
