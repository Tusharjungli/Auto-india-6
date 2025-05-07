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
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      
      {/* ✅ Hero with Storytelling */}
      <section className="px-6 py-20 text-center opacity-0 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight max-w-4xl mx-auto">
          Your Car Deserves More Than Just Parts
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          It&apos;s your partner in memories — road trips, first drives, late-night rides. Keep it going with trusted parts from Auto India.
        </p>
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <Link
            href="/products"
            className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-lg hover:opacity-90 active:scale-95 transition-all duration-300"
          >
            Explore Parts
          </Link>
          <Link
            href="#categories"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all duration-300"
          >
            Browse Categories
          </Link>
        </div>
      </section>

      {/* ✅ Search Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-12 opacity-0 animate-fade-in-up">
        <SearchBar />
      </div>

      {/* ✅ Why Auto India */}
      <section className="px-6 py-12 bg-gray-50 dark:bg-gray-900 text-center opacity-0 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6">Why Choose Auto India?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto text-sm">
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-xl dark:hover:shadow-white/10 transition-all">
            🚚 <p className="mt-2 font-medium">Fast & Reliable Delivery</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-xl dark:hover:shadow-white/10 transition-all">
            🛠️ <p className="mt-2 font-medium">100% Genuine Spare Parts</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-xl dark:hover:shadow-white/10 transition-all">
            💳 <p className="mt-2 font-medium">Secure Payments & Easy Checkout</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-gray-800 shadow hover:shadow-xl dark:hover:shadow-white/10 transition-all">
            🤖 <p className="mt-2 font-medium">Smart Search & Support</p>
          </div>
        </div>
      </section>

      {/* ✅ Testimonials */}
      <section className="px-6 py-12 max-w-6xl mx-auto text-center opacity-0 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-all">
            <p>“Found parts for my 2012 Swift. Delivered in 2 days. Amazing!”</p>
            <p className="mt-2 font-medium text-gray-600 dark:text-gray-400">— Ankit, Pune</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-all">
            <p>“Love the clean interface. Made ordering parts feel premium.”</p>
            <p className="mt-2 font-medium text-gray-600 dark:text-gray-400">— Riya, Delhi</p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition-all">
            <p>“Felt like Amazon but for car lovers. Respect.”</p>
            <p className="mt-2 font-medium text-gray-600 dark:text-gray-400">— Tushar, Jaipur</p>
          </div>
        </div>
      </section>

      {/* ✅ Categories */}
      <section id="categories" className="px-6 py-12 text-center opacity-0 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="rounded-2xl backdrop-blur-md bg-white/60 dark:bg-white/5 p-6 text-center border border-gray-300 dark:border-gray-700 shadow-sm hover:shadow-xl dark:hover:shadow-white/10 hover:scale-105 transform transition-all duration-300"
            >
              <span className="text-lg font-semibold capitalize tracking-wide">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
