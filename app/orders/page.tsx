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
          {orders.map((order) => {
            const placedDate = new Date(order.createdAt);
            const estimatedDelivery = new Date(placedDate);
            estimatedDelivery.setDate(placedDate.getDate() + 5); // 5-day estimate

            return (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-sm">Order ID: <span className="text-xs">{order.id}</span></p>
                    <p className="text-xs text-gray-500">
                      Placed on: {placedDate.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full font-medium">
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-4 text-sm">
                  <span className="text-gray-500">
                    Estimated Delivery: <strong>{estimatedDelivery.toDateString()}</strong>
                  </span>
                  <span className="font-bold">Total: ₹{order.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
