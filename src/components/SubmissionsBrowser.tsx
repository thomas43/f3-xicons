"use client";

import { useState, useEffect } from "react";
import { Submission, SubmissionStatus, XiconType } from "@prisma/client";
import SubmissionsCard from "./SubmissionsCard";
import { deleteSubmission } from "@/lib/submission";
import { useToast } from "@/components/ToastProvider";

type Props = {
  submissions: Submission[];
};

export default function SubmissionsBrowser({ submissions }: Props) {
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions);
  const { toastSuccess, toastError } = useToast(); // ─── instantiate toast

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | null>(
    () =>
      typeof window !== "undefined"
        ? (localStorage.getItem("statusFilter") as SubmissionStatus) ?? null
        : null
  );
  const [typeFilter, setTypeFilter] = useState<XiconType | null>(
    () =>
      typeof window !== "undefined"
        ? (localStorage.getItem("typeFilter") as XiconType) ?? null
        : null
  );

  useEffect(() => {
    if (statusFilter) localStorage.setItem("statusFilter", statusFilter);
    else localStorage.removeItem("statusFilter");
  }, [statusFilter]);

  useEffect(() => {
    if (typeFilter) localStorage.setItem("typeFilter", typeFilter);
    else localStorage.removeItem("typeFilter");
  }, [typeFilter]);

  const filtered = localSubmissions.filter((s) => {
    return (
      (!statusFilter || s.status === statusFilter) &&
      (!typeFilter || s.type === typeFilter)
    );
  });

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-f3accent mb-6">All Submissions</h1>

      <div className="mb-6 space-y-4">
        {/* ...filters as before... */}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-600">No submissions found.</p>
      ) : (
        <ul className="space-y-6">
          {filtered.map((submission) => (
            <li key={submission.id}>
              <SubmissionsCard
                submission={submission}
                onUpdate={(updated: Submission) => {
                  setLocalSubmissions((prev) =>
                    prev.map((s) => (s.id === updated.id ? updated : s))
                  );
                }}
                onDeleteRequested={async (id: string) => {
                  try {
                    await deleteSubmission(id);
                    // Remove from state
                    setLocalSubmissions((prev) => prev.filter((s) => s.id !== id));
                    toastSuccess(`Deleted submission '${submission.name}'.`);
                  } catch (err) {
                    console.error(err);
                    toastError(`Failed to delete submission '${submission.name}'.`);
                  }
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
