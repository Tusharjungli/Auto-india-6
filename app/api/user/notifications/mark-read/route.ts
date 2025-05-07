import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  await prisma.notification.updateMany({
    where: {
      user: { email: session.user.email },
      read: false,
    },
    data: { read: true },
  });

  return new Response("Marked all as read", { status: 200 });
}
