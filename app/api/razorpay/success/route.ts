import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail"; // ✅ Email utility

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: user.id },
  });

  const items = await Promise.all(
    cartItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return null;

      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    })
  );

  const validItems = items.filter((item): item is NonNullable<typeof item> => item !== null);
  const total = validItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ✅ Reduce stock
  for (const item of validItems) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  // ✅ Save order
  await prisma.order.create({
    data: {
      userId: user.id,
      total,
      items: {
        createMany: { data: validItems },
      },
    },
  });

  // ✅ 🆕 Update user's totalSpent
  await prisma.user.update({
    where: { id: user.id },
    data: {
      totalSpent: {
        increment: total,
      },
    },
  });

  // ✅ Clear cart
  await prisma.cartItem.deleteMany({
    where: { userId: user.id },
  });

  // ✅ Send confirmation email
  await sendMail({
    to: session.user.email!,
    subject: "Your Order Confirmation – Auto India Spare Parts",
    html: `
      <h2>Thank you for your order!</h2>
      <p>Hello ${user.name || "Customer"},</p>
      <p>Your order has been placed successfully. Here are the details:</p>
      <ul>
        ${validItems
          .map(
            (item) =>
              `<li>${item.name} – ₹${item.price} × ${item.quantity} = ₹${
                item.price * item.quantity
              }</li>`
          )
          .join("")}
      </ul>
      <p><strong>Total Paid:</strong> ₹${total}</p>
      <p>We’ll notify you once your items are shipped.</p>
      <p>Thanks for shopping with Auto India Spare Parts!</p>
    `,
  });

  return new NextResponse("Order processed & confirmation email sent", { status: 200 });
}
