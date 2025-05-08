import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";

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
      cars: true,
    },
  });

  const orders = user?.orders || [];
  const avatarList = [1, 2, 3, 4, 5, 6];

  const suggestions = await prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      OR: [
        { name: { contains: user?.cars?.[0]?.name ?? "", mode: "insensitive" } },
        { name: { contains: user?.cars?.[0]?.model ?? "", mode: "insensitive" } },
      ],
      NOT: {
        id: { in: orders.flatMap((o) => o.items.map((i) => i.productId)) },
      },
    },
    take: 4,
  });

  async function updateProfile(formData: FormData) {
    "use server";
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const phone = formData.get("phone")?.toString();
    const addressLine = formData.get("addressLine")?.toString();
    const city = formData.get("city")?.toString();
    const state = formData.get("state")?.toString();
    const pincode = formData.get("pincode")?.toString();

    if (!name || !email || !phone || phone.length < 10 || !addressLine || !city || !state || !pincode) return;

    await prisma.user.update({
      where: { email: session.user.email! },
      data: {
        name,
        email,
        phone,
        addressLine,
        city,
        state,
        pincode,
      },
    });

    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen px-6 py-8 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* ✅ Profile Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form action={updateProfile} className="space-y-4">
            <input type="text" name="name" required defaultValue={user?.name ?? ""} placeholder="Full Name" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="email" name="email" required defaultValue={user?.email ?? ""} placeholder="Email" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="tel" name="phone" required pattern="[0-9]{10}" defaultValue={user?.phone ?? ""} placeholder="Phone Number" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="text" name="addressLine" required defaultValue={user?.addressLine ?? ""} placeholder="Address Line (Flat/Street)" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="text" name="city" required defaultValue={user?.city ?? ""} placeholder="City" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="text" name="state" required defaultValue={user?.state ?? ""} placeholder="State" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <input type="text" name="pincode" required pattern="[0-9]{6}" defaultValue={user?.pincode ?? ""} placeholder="Pincode" className="w-full p-3 border rounded-md bg-gray-100 dark:bg-gray-800 dark:text-white" />
            <button type="submit" className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition">
              Save Changes
            </button>
          </form>
        </section>

        {/* ✅ Avatar Picker */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Choose Your Avatar</h2>
          <div className="flex flex-wrap gap-4">
            {avatarList.map((num) => {
              const src = `/avatars/${num}.png`;
              const isSelected = user?.image === src;
              return (
                <form key={num} action={async () => {
                  "use server";
                  await prisma.user.update({
                    where: { email: session.user.email! },
                    data: { image: src },
                  });
                }}>
                  <button type="submit" className={`rounded-full overflow-hidden border-4 ${isSelected ? "border-blue-500" : "border-transparent"} transition`}>
                    <Image src={src} alt={`Avatar ${num}`} width={64} height={64} className="rounded-full" />
                  </button>
                </form>
              );
            })}
          </div>
        </section>
      </div>

      {/* 🎯 Suggested Products */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Recommended for Your Car</h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">No suggestions at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestions.map((product) => (
              <a
                key={product.id}
                href={`/products/${product.slug}`}
                className="border p-4 rounded-md bg-gray-100 dark:bg-gray-800 hover:shadow transition"
              >
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">₹{product.price}</p>
                <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">View Product →</p>
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
