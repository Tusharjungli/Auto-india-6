import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const body = await req.json();

  const items = body.items as {
    productId: string;
    quantity: number;
  }[];

  // Remove previous cart items
  await prisma.cartItem.deleteMany({
    where: { userId: user.id },
  });

  // Insert new cart items
  for (const item of items) {
    await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId: item.productId,
        quantity: item.quantity,
      },
    });
  }

  return NextResponse.json({ status: "ok" });
}
