import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 🧹 Clear existing products before seeding
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: "Kia Brake Pads",
        slug: "kia-brake-pads",
        description: "High-quality brake pads for Kia vehicles.",
        price: 2499,
        imageUrl: "/images/kia-brake-pads.jpg",
        stock: 20,
        category: "brakes",
      },
      {
        name: "Hyundai Oil Filter",
        slug: "hyundai-oil-filter",
        description: "Durable oil filter for Hyundai engines.",
        price: 799,
        imageUrl: "/images/hyundai-oil-filter.jpg",
        stock: 35,
        category: "filters",
      },
      {
        name: "Tata Air Filter",
        slug: "tata-air-filter",
        description: "Air filter compatible with Tata models.",
        price: 999,
        imageUrl: "/images/tata-air-filter.jpg",
        stock: 25,
        category: "filters",
      },
    ],
  });

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
