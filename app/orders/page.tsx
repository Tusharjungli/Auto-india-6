import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  const orders = user?.orders || [];

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border-b pb-4">
              <div className="mb-2">
                <p className="font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <p className="mt-2 text-right font-bold">Total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
