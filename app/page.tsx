import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const categories = [
  { name: "Brakes", slug: "brakes" },
  { name: "Filters", slug: "filters" },
  { name: "Engine", slug: "engine" },
  { name: "Accessories", slug: "accessories" },
];

export default function Home() {
  return (
    <section className="min-h-screen bg-white dark:bg-black text-black dark:text-white py-10 px-6">
      <h1 className="text-4xl font-bold text-center mb-4">Auto India Spare Parts</h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Search or explore by category</p>

      <div className="mb-12">
        <SearchBar />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="rounded-2xl backdrop-blur-md bg-white/60 dark:bg-white/5 p-6 text-center border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            <span className="text-lg font-semibold capitalize tracking-wide">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
