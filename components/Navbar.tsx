"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { signOut, useSession } from "next-auth/react";
import useSyncCart from "@/lib/hooks/useSyncCart";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();

  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((acc, i) => acc + i.quantity, 0);

  // ✅ Sync cart to/from DB on login
  useSyncCart();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = storedTheme || (systemPrefersDark ? "dark" : "light");

    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="w-full bg-white dark:bg-black text-black dark:text-white border-b border-gray-300 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link href="/" className="text-xl font-bold tracking-wide">
          Auto India
        </Link>

        <div className="flex items-center space-x-6 text-sm">
          <Link href="/products" className="hover:opacity-80">Products</Link>
          <Link href="/about" className="hover:opacity-80">About</Link>
          <Link href="/contact" className="hover:opacity-80">Contact</Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative hover:opacity-80">
            <ShoppingCart className="w-5 h-5" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {/* 👤 Auth Icon + Dropdown on Click */}
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center gap-2 hover:opacity-80"
              aria-label="User menu"
            >
              <User className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10 w-44 text-sm">
                {session?.user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/wishlist"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-full p-2 border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}
