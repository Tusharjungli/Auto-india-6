"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";

export default function CartPage() {
  const { items, addToCart, removeFromCart, clearCart } = useCartStore();

  const updateQuantity = (id: string, action: "inc" | "dec") => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    if (action === "inc") {
      addToCart(item);
    } else {
      if (item.quantity === 1) {
        removeFromCart(id);
      } else {
        removeFromCart(id); // remove once
        for (let i = 0; i < item.quantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Your cart is currently empty.</p>
        <Link
          href="/products"
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b pb-4 flex justify-between items-start gap-4 dark:border-gray-700"
          >
            <div className="flex-1">
              <p className="font-semibold text-lg">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ₹{item.price} × {item.quantity}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, "dec")}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, "inc")}
                  className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:opacity-80"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="ml-4 text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="text-right">
              <p className="font-medium">Subtotal:</p>
              <p className="text-lg font-bold">₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t pt-6 text-right">
        <p className="text-xl font-bold mb-2">Total: ₹{total}</p>

        <div className="mt-4 flex flex-col sm:flex-row justify-end items-center gap-4">
          <Link
            href="/products"
            className="text-blue-600 dark:text-blue-400 underline text-sm"
          >
            ← Continue Shopping
          </Link>

          <button
            onClick={clearCart}
            className="px-6 py-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Clear Cart
          </button>

          <Link
            href="/checkout"
            className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
