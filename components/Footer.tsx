"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black border-t border-gray-300 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-4 gap-10">
        {/* Company Info */}
        <div className="sm:col-span-1">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
            Auto India Spare Parts
          </h3>
          <p className="leading-relaxed">
            Your trusted source for genuine auto parts across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-medium text-black dark:text-white mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link href="/products" className="hover:text-black dark:hover:text-white hover:underline transition">Products</Link></li>
            <li><Link href="/about" className="hover:text-black dark:hover:text-white hover:underline transition">About</Link></li>
            <li><Link href="/contact" className="hover:text-black dark:hover:text-white hover:underline transition">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>

          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2">
          <h4 className="font-medium text-black dark:text-white mb-2">Subscribe to our Newsletter</h4>
          <p className="text-xs mb-3">Get the latest updates on products and offers.</p>
          <form className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto flex-1 px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-600">
        <p>© {currentYear} Auto India Spare Parts. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="hover:scale-110 transition-transform hover:text-black dark:hover:text-white" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="hover:scale-110 transition-transform hover:text-black dark:hover:text-white" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="hover:scale-110 transition-transform hover:text-black dark:hover:text-white" />
          </a>
          
        </div>
      </div>
    </footer>
  );
}
