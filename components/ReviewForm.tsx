"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ReviewForm({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session?.user) return null;

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment, productId }),
    });

    if (res.ok) {
      setRating(5);
      setComment("");
      router.refresh();
    } else {
      alert("Failed to submit review.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submitReview} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="border rounded p-2 dark:bg-gray-800 dark:text-white"
          required
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 && "s"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 resize-none dark:bg-gray-800 dark:text-white"
          rows={4}
          placeholder="Share your thoughts..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
