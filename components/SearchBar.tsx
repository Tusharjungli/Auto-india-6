"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmed = query.trim();
      const url = trimmed ? `${pathname}?search=${encodeURIComponent(trimmed)}` : pathname;
      router.replace(url);
    }, 300); // debounce delay

    return () => clearTimeout(delayDebounce);
  }, [query, pathname, router]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for spare parts, filters, brakes..."
        className="w-full px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-black dark:text-white shadow-md focus:outline-none"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
          aria-label="Clear"
        >
          <X size={18} />
        </button>
      )}
      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300" size={18} />
    </div>
  );
}
