"use client";

import { useState, useEffect } from "react";
import { Heart, HeartOff } from "lucide-react";

interface WishlistItem {
  id: string;
  productId: string;
}

export default function WishlistButton({ productId }: { productId: string }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((res) => res.json())
      .then((items: WishlistItem[]) => {
        const inWishlist = items.some((item) => item.productId === productId);
        setIsWishlisted(inWishlist);
        setLoading(false);
      });
  }, [productId]);

  const toggleWishlist = async () => {
    setLoading(true);

    await fetch("/api/wishlist", {
      method: isWishlisted ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setIsWishlisted(!isWishlisted);
    setLoading(false);
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-2 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      {isWishlisted ? <HeartOff className="text-red-500" /> : <Heart />}
    </button>
  );
}
