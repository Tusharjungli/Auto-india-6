import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: { include: { product: true } },
    },
  });

  return NextResponse.json(user?.wishlist || []);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const exists = await prisma.wishlistItem.findFirst({
    where: { userId: user.id, productId },
  });

  if (exists) {
    return new NextResponse("Already in wishlist", { status: 409 });
  }

  await prisma.wishlistItem.create({
    data: {
      userId: user.id,
      productId,
    },
  });

  return new NextResponse("Added to wishlist");
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  await prisma.wishlistItem.deleteMany({
    where: {
      userId: user.id,
      productId,
    },
  });

  return new NextResponse("Removed from wishlist");
}
