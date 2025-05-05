import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { reviews: true },
  });

  if (!product) return notFound();

  return <ProductClient product={product} />;
}
