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
        // add back with qty -1
        for (let i = 0; i < item.quantity - 1; i++) {
          addToCart(item);
        }
      }
    }
  };

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block text-blue-600 dark:text-blue-400 underline">
          Go to Products
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center border-b pb-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, "dec")}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, "inc")}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
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
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-right">
        <p className="text-xl font-bold">Total: ₹{total}</p>

        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={clearCart}
            className="px-6 py-2 border border-gray-400 dark:border-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Clear Cart
          </button>

          <Link
            href="/checkout"
            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition text-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
