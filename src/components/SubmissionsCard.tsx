"use client"

import { Submission } from "@prisma/client";
import { approveSubmission, pendingSubmission, rejectSubmission, promoteSubmissionToXicon } from "@/lib/submission";
import { slugify } from "@/lib/slugify"
import { useState } from "react";

interface Props {
  submission: Submission;
  onUpdate?: (updated: Submission) => void;
}

export default function SubmissionsCard({ submission, onUpdate }: Props) {
  const bgClass =
    submission.status !== "pending" ? "bg-gray-200" : "bg-white";
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const slug = slugify(submission.name);

  const handleApprove = async () => {
    try {
      if (!submission.id) throw new Error("Missing ID");
      const updated = await approveSubmission(submission.id);
      await promoteSubmissionToXicon(submission.id);
      setStatusMsg("Submission approved and promoted.");
      onUpdate?.(updated);
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to approve submission.");
    }
  };
  
  const handlePending = async () => {
    try {
      const updated = await pendingSubmission(submission.id);
      setStatusMsg("Submission pending.");
      onUpdate?.(updated);
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to set pending.");
    }
  };

  const handleReject = async () => {
    try {
      const updated = await rejectSubmission(submission.id);
      setStatusMsg("Submission rejected.");
      onUpdate?.(updated);
    } catch (err) {
      console.error(err);
      setStatusMsg("Failed to reject.");
    }
  };
  
  

  return (
    <div className={`border rounded-xl p-4 shadow-sm ${bgClass}`}>
      {statusMsg && (
        <div className="mt-2 text-sm text-gray-700 bg-gray-200 rounded-md px-3 py-2">
          {statusMsg}
        </div>
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
          }>
      {submission.status}
      </span>{" "}
     | {new Date(submission.createdAt).toLocaleString()}
     </div>

     <button
        type="button"
        onClick={handleApprove}
        className="text-sm px-2 py-1 bg-green-200 hover:bg-green-300 rounded"
      >
      Approve
      </button>
      <button
        type="button"
        onClick={handlePending}
        className="text-sm px-2 py-1 bg-yellow-200 hover:bg-yellow-300 rounded"
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
