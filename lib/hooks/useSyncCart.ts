"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { useSession } from "next-auth/react";

export default function useSyncCart() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    if (!session?.user?.email || items.length === 0) return;

    // Sync Zustand cart to DB
    const syncCart = async () => {
      await fetch("/api/cart/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });
    };

    syncCart();
  }, [items, session]);
}
