// app/admin/submissions/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminSubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-f3accent mb-6">Pending Submissions</h1>

      {submissions.length === 0 ? (
        <p className="text-gray-600">No pending submissions 🎉</p>
      ) : (
        <ul className="space-y-6">
          {submissions.map((submission) => (
            <li
              key={submission.id}
              className="border rounded p-4 bg-white shadow-sm"
            >
              <div className="text-xs uppercase font-semibold text-gray-500 mb-1">
                {submission.type}
              </div>
              <h2 className="text-xl font-bold">{submission.name}</h2>
              <p className="text-gray-700 whitespace-pre-wrap mb-2">
                {submission.description}
              </p>

              {submission.aliases.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>Aliases:</strong> {submission.aliases.join(", ")}
                </div>
              )}
              {submission.tags.length > 0 && (
                <div className="text-sm text-gray-600">
                  <strong>Tags:</strong> {submission.tags.join(", ")}
                </div>
              )}
              {submission.videoUrl && (
                <div className="text-sm text-gray-600">
                  <strong>Video:</strong>{" "}
                  <a href={submission.videoUrl} className="text-blue-600 underline" target="_blank">
                    {submission.videoUrl}
                  </a>
                </div>
              )}

              {/* Action buttons can be wired up later */}
              <div className="mt-4 space-x-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
