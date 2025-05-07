import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";
import { randomInt } from "crypto";
import { addMinutes } from "date-fns";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response("Email is required", { status: 400 });
  }

  const otp = randomInt(100000, 999999).toString(); // 6-digit OTP
  const expires = addMinutes(new Date(), 10); // OTP valid for 10 mins

  await prisma.verificationToken.upsert({
    where: { identifier_token: { identifier: email, token: otp } },
    update: { token: otp, expires },
    create: { identifier: email, token: otp, expires },
  });

  await sendMail({
    to: email,
    subject: "Your OTP for Auto India Spare Parts",
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
  });

  return new Response("OTP sent successfully", { status: 200 });
}
