import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import CheckoutButton from "@/components/CheckoutButton";

export default async function CheckoutPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!user) {
    return (
      <main className="min-h-screen p-6">
        <h1 className="text-2xl font-bold">User not found</h1>
      </main>
    );
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
  });

  const detailedCart = await Promise.all(
    cartItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) return null;

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: product.price * item.quantity,
      };
    })
  );

  const validItems = detailedCart.filter((item): item is NonNullable<typeof item> => item !== null);

  const total = validItems.reduce((sum, item) => sum + item.subtotal, 0);

  if (validItems.length === 0) {
    return (
      <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>
        <p>Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* ✅ Delivery Address */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Delivery Address</h2>
        {user.address ? (
          <p className="bg-gray-100 dark:bg-gray-800 p-4 rounded whitespace-pre-line">
            {user.address}
          </p>
        ) : (
          <p className="text-sm text-red-500">
            No address saved. Please{" "}
            <a
              href="/dashboard"
              className="underline text-blue-600 dark:text-blue-400"
            >
              add an address
            </a>{" "}
            before placing your order.
          </p>
        )}
      </section>

      {/* 🛒 Cart Items */}
      <div className="space-y-6">
        {validItems.map((item) => (
          <div key={item.id} className="border-b pb-4 flex justify-between">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                ₹{item.price} × {item.quantity}
              </p>
            </div>
            <p className="font-medium">₹{item.subtotal}</p>
          </div>
        ))}
      </div>

      {/* 💳 Total + Payment */}
      <div className="mt-8 text-right">
        <p className="text-xl font-bold">Total: ₹{total}</p>
        <CheckoutButton total={total} />
      </div>
    </main>
  );
}
