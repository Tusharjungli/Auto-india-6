import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await prisma.blog.findUnique({ where: { slug: params.slug } });

  if (!post) return notFound();

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">
        Published on {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </main>
  );
}
