"use client";

import { useState, useEffect } from "react";
import { Submission, SubmissionStatus, XiconType } from "@prisma/client";
import SubmissionsCard from "./SubmissionsCard";

type Props = {
  submissions: Submission[];
};

export default function SubmissionsBrowser({ submissions }: Props) {
  const [localSubmissions, setLocalSubmissions] = useState<Submission[]>(submissions);

  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | null>(
    () => (typeof window !== "undefined" ? (localStorage.getItem("statusFilter") as SubmissionStatus) ?? null : null)
  );
  const [typeFilter, setTypeFilter] = useState<XiconType | null>(
    () => (typeof window !== "undefined" ? (localStorage.getItem("typeFilter") as XiconType) ?? null : null)
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
        {/* Status Filter */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">
            Filter by Status:
          </span>
          {Object.values(SubmissionStatus).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s === statusFilter ? null : s)}
              className={`tag ${statusFilter === s ? "tag-selected" : "tag-unselected"}`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setStatusFilter(null)}
            className="text-xs underline text-gray-500"
          >
            Clear
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2">
            Filter by Type:
          </span>
          {Object.values(XiconType).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t === typeFilter ? null : t)}
              className={`tag ${typeFilter === t ? "tag-selected" : "tag-unselected"}`}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => setTypeFilter(null)}
            className="text-xs underline text-gray-500"
          >
            Clear
          </button>
        </div>
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
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
