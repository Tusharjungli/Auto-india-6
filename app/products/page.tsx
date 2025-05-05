import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

interface SearchParams {
  search?: string;
  category?: string;
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const { search = "", category } = searchParams;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        category ? { category: category.toLowerCase() } : {},
      ],
    },
  });

  return (
    <main className="min-h-screen py-10 px-4 sm:px-10 bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {category ? `Category: ${category}` : "All Products"}
      </h1>
      <div className="mb-8">
        <SearchBar initialQuery={search} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>
    </main>
  );
}
