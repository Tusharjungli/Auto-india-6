"use client";

import Link from "next/link";
import type { Product } from "@prisma/client";
import Image from "next/image";


export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block"
    >
      <div className="relative w-full h-48">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">₹{product.price}</p>

        {product.stock < 1 ? (
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mt-2">Out of Stock</p>
        ) : (
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">In Stock</p>
        )}

        <button className="mt-4 w-full py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">
          View Details
        </button>
      </div>
    </Link>
  );
}
