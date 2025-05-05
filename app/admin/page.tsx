import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminPage() {
  const session = await requireAuth();

  const adminEmail = "admin@example.com"; // 🔒 Replace with your admin email

  if (session.user.email !== adminEmail) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
      </main>
    );
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Products Table */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 dark:border-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Price</th>
                  <th className="text-left px-4 py-2">Stock</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">₹{product.price}</td>
                    <td className="px-4 py-2">{product.stock}</td>
                    <td className="px-4 py-2 space-x-2">
                      <a
                        href={`/admin/edit/${product.id}`}
                        className="px-2 py-1 text-xs rounded bg-yellow-400 text-black hover:opacity-90"
                      >
                        Edit
                      </a>
                      <DeleteButton productId={product.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add New Product Form */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <form method="POST" action="/api/admin/add-product" className="space-y-4 max-w-md">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            required
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="number"
            name="price"
            placeholder="Price in ₹"
            required
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            required
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <textarea
            name="description"
            placeholder="Description"
            required
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            required
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Product
          </button>
        </form>
      </section>
    </main>
  );
}
