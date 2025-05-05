import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const productId = formData.get("productId")?.toString();
  const rating = Number(formData.get("rating"));
  const text = formData.get("text")?.toString();

  if (!productId || !rating || !text || rating < 1 || rating > 5) {
    return new NextResponse("Invalid input", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // ✅ Save review
    await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating,
        text,
      },
    });

    // ✅ Get slug of product for redirect
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { slug: true },
    });

    if (!product?.slug) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // ✅ Redirect using the slug
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.slug}?review=success`, {
      status: 302,
    });
  } catch (err) {
    console.error("❌ Error saving review:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
