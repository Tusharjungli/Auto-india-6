import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) return notFound();

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      <form
        method="POST"
        action="/api/admin/update-product"
        className="space-y-4 max-w-lg"
      >
        <input type="hidden" name="id" value={product.id} />

        <input
          type="text"
          name="name"
          defaultValue={product.name}
          required
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="number"
          name="price"
          defaultValue={product.price}
          required
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="text"
          name="imageUrl"
          defaultValue={product.imageUrl}
          required
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <textarea
          name="description"
          defaultValue={product.description || ""}
          required
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="number"
          name="stock"
          defaultValue={product.stock}
          required
          className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
