import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json([], { status: 200 });
    }
  
    const cart = await prisma.cartItem.findMany({
      where: { user: { email: session.user.email } },
      include: { user: true }, // ensure relation
    });
  
    const products = await Promise.all(
      cart.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
  
        if (!product) return null;
  
        return {
          ...product,
          quantity: item.quantity,
        };
      })
    );
  
    const filtered = products.filter(Boolean); // remove nulls
    return NextResponse.json(filtered);
  }
  

  export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    const body = await req.json();
  
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }
  
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
  
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  
    // 🧠 Define expected item type inline
    type CartItemInput = {
      id: string;
      quantity: number;
    };
  
    const items: CartItemInput[] = body.items;
  
    // ✅ Remove existing
    await prisma.cartItem.deleteMany({ where: { userId: user.id } });
  
    // ✅ Insert new
    await prisma.cartItem.createMany({
      data: items.map((item) => ({
        userId: user.id,
        productId: item.id,
        quantity: item.quantity,
      })),
    });
  
    return NextResponse.json({ success: true });
  }
  
