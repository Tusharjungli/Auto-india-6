import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true },
      },
    },
  });

  const orders = user?.orders || [];

  async function updateProfile(formData: FormData) {
    "use server";

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const address = formData.get("address")?.toString();

    if (!name || !email) return;

    await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ✅ Profile Form */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Edit Profile</h2>
        <form action={updateProfile} className="space-y-4 max-w-xl">
          <input
            type="text"
            name="name"
            defaultValue={user?.name ?? ""}
            placeholder="Full Name"
            required
            className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="email"
            name="email"
            defaultValue={user?.email ?? ""}
            placeholder="Email"
            required
            className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="tel"
            name="phone"
            defaultValue={user?.phone ?? ""}
            placeholder="Phone Number"
            className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white"
          />
          <textarea
            name="address"
            defaultValue={user?.address ?? ""}
            rows={4}
            placeholder="Enter your delivery address"
            className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white resize-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* ✅ Recent Orders */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
        {orders.length === 0 ? (
          <p>No recent orders.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border-b pb-3">
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <ul className="ml-4 list-disc">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="text-right font-medium mt-2">Total: ₹{order.total}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-sm">
          <a href="/orders" className="text-blue-600 dark:text-blue-400 underline">View all orders →</a>
        </p>
      </section>
    </main>
  );
}
