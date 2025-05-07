import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  const session = await requireAuth();

  if (session.user.email !== process.env.ADMIN_EMAIL) {
    return redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: true,
    },
  });

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Admin: All Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border-b pb-4 space-y-2">
            <p className="text-sm text-gray-500">
              Order ID: {order.id} | User: {order.user.email}
            </p>

            {/* ✅ Status dropdown */}
            <label className="text-sm font-medium flex items-center gap-2">
              Status:
              <select
                defaultValue={order.status}
                onChange={async (e) => {
                  await fetch("/api/admin/update-order", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      orderId: order.id,
                      status: e.target.value,
                    }),
                  });
                }}
                className="bg-transparent border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>

            <ul className="ml-4 list-disc mt-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} — ₹{item.price}
                </li>
              ))}
            </ul>

            <p className="text-right mt-2 font-medium">Total: ₹{order.total}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
