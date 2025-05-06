// components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Moon, Sun, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { signOut, useSession } from "next-auth/react";
import useSyncCart from "@/lib/hooks/useSyncCart";
import Image from "next/image";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const items = useCartStore((state) => state.items);
  const totalQty = items.reduce((acc, item) => acc + item.quantity, 0);

  useSyncCart();

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-300 dark:border-gray-800 text-black dark:text-white transition-all">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold tracking-wide hover:opacity-80 transition">
          Auto India
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Products</Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link>

          <Link href="/cart" className="relative hover:opacity-80">
            <ShoppingCart className="w-5 h-5" />
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                {totalQty}
              </span>
            )}
          </Link>

          {/* Avatar dropdown */}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="User menu">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full border border-gray-300 dark:border-gray-700 hover:opacity-90"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-white">
                  {session?.user?.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50 w-44 text-sm">
                {session?.user ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen(false)}>Wishlist</Link>
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
                    <Link href="/login" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen(false)}>Login</Link>
                    <Link href="/register" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setMenuOpen(false)}>Sign up</Link>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-full p-2 border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
          aria-label="Toggle Mobile Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-6 space-y-3 text-sm">
          <Link href="/products" className="block hover:text-blue-600">Products</Link>
          <Link href="/about" className="block hover:text-blue-600">About</Link>
          <Link href="/contact" className="block hover:text-blue-600">Contact</Link>
          <Link href="/cart" className="block hover:text-blue-600">Cart ({totalQty})</Link>
          {session?.user ? (
            <>
              <Link href="/dashboard" className="block hover:text-blue-600">Dashboard</Link>
              <Link href="/wishlist" className="block hover:text-blue-600">Wishlist</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="block text-left hover:text-blue-600">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:text-blue-600">Login</Link>
              <Link href="/register" className="block hover:text-blue-600">Sign up</Link>
            </>
          )}
          <button onClick={toggleTheme} className="block mt-2 hover:text-blue-600">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>
      )}
    </nav>
  );
}
