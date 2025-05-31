"use client";

import { Submission } from "@prisma/client";
import { approveSubmission, pendingSubmission, rejectSubmission, promoteSubmissionToXicon } from "@/lib/submission";
import { useToast } from "@/components/ToastProvider";
import { slugify } from "@/lib/slugify";
import { TrashIcon } from "@heroicons/react/20/solid"; // ─── Import TrashIcon

interface Props {
  submission: Submission;
  onUpdate?: (updated: Submission) => void;
  onDeleteRequested?: (id: string) => void; // ─── accept this prop
}

export default function SubmissionsCard({ submission, onUpdate, onDeleteRequested }: Props) {
  const { toastSuccess, toastError, toastInfo } = useToast();

  const bgClass = submission.status !== "pending" ? "bg-gray-200" : "bg-white";
  const slug = slugify(submission.name);

  const handleApprove = async () => {
    try {
      if (!submission.id) throw new Error("Missing ID");
      const updated = await approveSubmission(submission.id);
      await promoteSubmissionToXicon(submission.id);
      toastSuccess("Submission approved and promoted.");
      onUpdate?.(updated as Submission);
    } catch (err) {
      console.error(err);
      toastError("Failed to approve submission.");
    }
  };

  const handlePending = async () => {
    try {
      const updated = await pendingSubmission(submission.id);
      toastInfo("Submission pending.");
      onUpdate?.(updated as Submission);
    } catch (err) {
      console.error(err);
      toastError("Failed to set pending.");
    }
  };

  const handleReject = async () => {
    try {
      const updated = await rejectSubmission(submission.id);
      toastInfo("Submission rejected.");
      onUpdate?.(updated as Submission);
    } catch (err) {
      console.error(err);
      toastError("Failed to reject.");
    }
  };

  return (
    <div className={`border rounded-xl p-4 shadow-sm relative ${bgClass}`}>
      {onDeleteRequested && (
        <button
          type="button"
          onClick={() => onDeleteRequested(submission.id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          title={`Delete submission '${submission.name}'`}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      )}

      <div className="text-sm text-gray-500 mb-1">ID: {submission.id}</div>
      <h3 className="text-xl font-bold text-f3accent mb-2">{submission.name}</h3>
      <div className="text-sm text-gray-700 mb-2">Description: {submission.description}</div>
      <div className="text-sm text-gray-700 mb-2">Slug: {slug}</div>

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
        {submission.type} |{" "}
        <span
          className={
            submission.status === "approved"
              ? "text-green-600 font-semibold"
              : submission.status === "rejected"
              ? "text-red-600 font-semibold"
              : "text-yellow-600 font-semibold"
          }
        >
          {submission.status}
        </span>{" "}
        | {new Date(submission.createdAt).toLocaleString()}
      </div>

      <button
        type="button"
        onClick={handleApprove}
        className="text-sm px-2 py-1 bg-green-200 hover:bg-green-300 rounded mr-2"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={handlePending}
        className="text-sm px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded mr-2"
      >
        Pending
      </button>
      <button
        type="button"
        onClick={handleReject}
        className="text-sm px-2 py-1 bg-red-200 hover:bg-red-300 rounded"
      >
        Reject
      </button>
    </div>
  );
}
