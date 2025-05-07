import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    return new Response("No user found with that email", { status: 404 });
  }

  const token = randomBytes(32).toString("hex");
  const expires = addHours(new Date(), 1); // valid for 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

  await sendMail({
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 1 hour.</p>`,
  });

  return new Response("Reset email sent", { status: 200 });
}
