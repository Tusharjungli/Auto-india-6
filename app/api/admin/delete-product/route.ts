import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const id = formData.get("id")?.toString();

  if (!id) return new NextResponse("Invalid Product ID", { status: 400 });

  await prisma.product.delete({ where: { id } });

  return new NextResponse("Deleted", { status: 200 });
}
