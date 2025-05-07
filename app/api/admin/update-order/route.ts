import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMail as sendOrderEmail } from "@/lib/mail";


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  if (session?.user.email !== process.env.ADMIN_EMAIL) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { orderId, status } = body;

  if (!orderId || !status) {
    return new Response("Missing data", { status: 400 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { user: true },
  });

  // ✅ Send notification email to user
  const subject = `Your Auto India order status is now: ${status}`;
  const html = `
    <p>Hi ${updated.user.name || "Customer"},</p>
    <p>Your order <strong>${updated.id}</strong> has been updated to <strong>${status.toUpperCase()}</strong>.</p>
    <p>Thank you for shopping with Auto India Spare Parts.</p>
  `;

  await sendOrderEmail({
    to: updated.user.email,
    subject,
    html,
  });

  return new Response("Order updated and email sent", { status: 200 });
}
