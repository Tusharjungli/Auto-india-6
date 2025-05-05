import { requireAuth } from "@/lib/authServer";
import { prisma } from "@/lib/prisma";

export default async function FeedbackAdminPage() {
  await requireAuth();

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen p-6 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">User Feedback</h1>

      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback submitted yet.</p>
      ) : (
        <div className="space-y-6">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-4"
            >
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>{fb.createdAt.toLocaleString()}</span>
                <span>{fb.category || "General"}</span>
              </div>
              <p className="text-md mb-2">
                <span className="font-semibold">Message:</span> {fb.message}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {fb.name && <p><span className="font-medium">Name:</span> {fb.name}</p>}
                {fb.phone && <p><span className="font-medium">Phone:</span> {fb.phone}</p>}
                {fb.email && <p><span className="font-medium">Email:</span> {fb.email}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
