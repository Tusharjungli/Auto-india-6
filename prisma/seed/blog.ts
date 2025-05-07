import { prisma } from "../../lib/prisma";


async function main() {
  await prisma.blog.createMany({
    data: [
      {
        title: "How to Choose the Right Brake Pads",
        slug: "choose-brake-pads",
        excerpt: "Confused about brake pads? This guide breaks it down for you.",
        imageUrl: "/blog/brake-pads.jpg",
        tags: ["brakes", "safety"],
        content: `
### Understanding Brake Pads
Your vehicle's safety depends on them. Learn how to pick the best type, material, and brand.
        `,
      },
      {
        title: "Which Filters Fit Your Maruti Swift?",
        slug: "filters-for-swift",
        excerpt: "Oil, air, fuel filters — here’s what your Swift really needs.",
        imageUrl: "/blog/swift-filters.jpg",
        tags: ["filters", "maruti", "engine"],
        content: `
### Your Swift's Filters
Maintenance made easy with our breakdown of compatible filters for each variant.
        `,
      },
    ],
  });

  console.log("✅ Blog seeded");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
