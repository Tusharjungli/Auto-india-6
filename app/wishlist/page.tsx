import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export default async function WishlistPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      wishlist: {
        include: { product: true }, // ✅ Include full product details
      },
    },
  });

  const wishlist = user?.wishlist.map((entry) => entry.product) || [];

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
