import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { encode } from "next-auth/jwt";

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return new Response("Email and OTP are required", { status: 400 });
  }

  const tokenRecord = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier: email, token: otp } },
  });

  if (!tokenRecord || tokenRecord.expires < new Date()) {
    return new Response("OTP is invalid or expired", { status: 400 });
  }

  await prisma.verificationToken.delete({
    where: { identifier_token: { identifier: email, token: otp } },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  const jwt = await encode({
    token: { sub: user.id, email: user.email },
    secret: process.env.NEXTAUTH_SECRET!,
    maxAge: 60 * 60 * 24 * 7,
  });

  const cookieStore = await cookies(); // ✅ await added here
  cookieStore.set("next-auth.session-token", jwt, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return new Response("Logged in via OTP", { status: 200 });
}
