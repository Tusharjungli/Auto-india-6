import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { image } = await req.json();

  if (!image || typeof image !== "string") {
    return new Response("Invalid image", { status: 400 });
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { image },
  });

  return new Response("Avatar updated", { status: 200 });
}
