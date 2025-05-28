import { Submission } from "@prisma/client";
import { approveSubmission, rejectSubmission } from "@/lib/submission";

interface Props {
  submission: Submission;
}

export default function SubmissionsCard({ submission }: Props) {
  const bgClass =
    submission.status !== "pending" ? "bg-gray-200" : "bg-white";

  return (
    <div className={`border rounded-xl p-4 shadow-sm ${bgClass}`}>
      <div className="text-sm text-gray-500 mb-1">ID: {submission.id}</div>
      <h3 className="text-xl font-bold text-f3accent mb-2">{submission.name}</h3>
      <div className="text-sm text-gray-700 mb-2">{submission.description}</div>

      {submission.aliases.length > 0 && (
        <div className="text-sm mb-2">
          <span className="font-medium">Aliases:</span> {submission.aliases.join(", ")}
        </div>
      )}

      {submission.tags.length > 0 && (
        <div className="text-sm mb-2">
          <span className="font-medium">Tags:</span> {submission.tags.join(", ")}
        </div>
      )}

      {submission.videoUrl && (
        <div className="text-sm mb-2">
          <span className="font-medium">Video:</span>{" "}
          <a
            href={submission.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600"
          >
            {submission.videoUrl}
          </a>
        </div>
      )}

      <div className="text-xs text-gray-500 mb-2">
        {submission.type} | {submission.status} | {new Date(submission.createdAt).toLocaleString()}
      </div>

      <form action={approveSubmission} className="inline-block mr-2" >
        <input type="hidden" name="id" value={submission.id} />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700"
        >
          Approve
        </button>
      </form>
      <form action={rejectSubmission}className="inline-block" >
        <input type="hidden" name="id" value={submission.id} />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
        >
          Reject
        </button>
      </form>
    </div>
  );
}
