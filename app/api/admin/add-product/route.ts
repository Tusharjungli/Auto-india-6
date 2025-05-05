import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = formData.get("imageUrl")?.toString();
  const description = formData.get("description")?.toString();
  const stock = parseInt(formData.get("stock") as string);

  if (!name || !price || !imageUrl || !description || isNaN(stock)) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      price,
      imageUrl,
      description,
      stock,
    },
  });

  return NextResponse.redirect(new URL("/admin", req.url));
}
