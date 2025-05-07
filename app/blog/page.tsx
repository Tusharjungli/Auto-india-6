import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function BlogPage() {
  const posts = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Auto India Blog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition-all"
          >
            {post.imageUrl && (
              <div className="relative w-full h-40 mb-4 rounded overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
