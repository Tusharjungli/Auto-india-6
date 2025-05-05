"use client";

import { useCartStore } from "@/lib/store/cartStore";
import type { Product, Review } from "@prisma/client";
import Image from "next/image";
import WishlistButton from "@/components/WishlistButton";
import StarIcon from "@/components/icons/StarIcon";
import {  useState } from "react";
import { useSearchParams } from "next/navigation";

interface Props {
  product: Product & {
    reviews?: Review[];
  };
}

export default function ProductClient({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const reviews = product.reviews ?? [];

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  const [formState, setFormState] = useState({ rating: 5, text: "" });

  const searchParams = useSearchParams();
  const reviewSuccess = searchParams.get("review") === "success";

  return (
    <main className="min-h-screen py-12 px-4 sm:px-10 bg-white text-black dark:bg-black dark:text-white transition">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative w-full h-[350px]">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="rounded-xl object-cover shadow-md"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <WishlistButton productId={product.id} />
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(avgRating)} />
            ))}
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-400">{product.description}</p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">₹{product.price}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">In stock: {product.stock}</p>

          {product.stock > 0 ? (
            <button
              onClick={() => addToCart(product)}
              className="mt-4 px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition"
            >
              Add to Cart
            </button>
          ) : (
            <p className="mt-4 text-red-600 dark:text-red-400 font-medium">Out of Stock</p>
          )}
        </div>
      </div>

      <div className="max-w-2xl mt-12 mx-auto">
        {reviewSuccess && (
          <div className="p-4 bg-green-100 text-green-800 rounded mb-4 border border-green-300">
            ✅ Thank you! Your review has been submitted.
          </div>
        )}
        <h2 className="text-xl font-bold mb-4">Submit a Review</h2>
        <form action={`/api/reviews`} method="POST" className="space-y-4">
          <input type="hidden" name="productId" value={product.id} />

          <div className="flex items-center gap-4">
            <label htmlFor="rating">Rating:</label>
            <select
              name="rating"
              id="rating"
              value={formState.rating}
              onChange={(e) => setFormState((s) => ({ ...s, rating: Number(e.target.value) }))}
              className="p-2 border rounded"
              required
            >
              {[5, 4, 3, 2, 1].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 && "s"}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="text"
            rows={4}
            placeholder="Write your review here..."
            className="w-full p-4 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
            value={formState.text}
            onChange={(e) => setFormState((s) => ({ ...s, text: e.target.value }))}
            required
          />

          <button
            type="submit"
            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition"
          >
            Submit Review
          </button>
        </form>
      </div>
    </main>
  );
}
