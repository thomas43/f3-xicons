// src/components/SubmissionsCard.tsx
"use client";

import { useState, useEffect } from "react";
import { Submission, XiconType } from "@prisma/client";
import { approveSubmission, pendingSubmission, rejectSubmission, promoteSubmissionToXicon, updateSubmission } from "@/lib/submission";
import { useToast } from "@/components/ToastProvider";
import { slugify } from "@/lib/slugify";
import { getExiconEntries, getLexiconEntries } from "@/lib/xicon";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { TagInput } from "@/components/TagInput";
import { MentionTextArea } from "@/components/MentionTextArea";

interface Props {
  submission: Submission;
  onUpdate?: (updated: Submission) => void;
  onDeleteRequested?: (id: string) => void;
}

export default function SubmissionsCard({
  submission,
  onUpdate,
  onDeleteRequested,
}: Props) {
  const { toastSuccess, toastError, toastInfo } = useToast();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    description: string;
    aliasesCsv: string;
    tags: string[];
    videoUrl: string;
  }>({
    name: submission.name ?? "",
    description: submission.description ?? "",
    aliasesCsv: Array.isArray(submission.aliases)
      ? submission.aliases.join(", ")
      : "",
    tags: Array.isArray(submission.tags) ? submission.tags : [],
    videoUrl: submission.videoUrl ?? "",
  });

  const [mentionData, setMentionData] = useState<
    { id: string; display: string }[]
  >([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch mention suggestions when submission.type changes
  useEffect(() => {
    async function fetchMentions() {
      let entries:
        | Awaited<ReturnType<typeof getExiconEntries>>
        | Awaited<ReturnType<typeof getLexiconEntries>> = [];
      if (submission.type === XiconType.exicon) {
        entries = await getExiconEntries();
      } else {
        entries = await getLexiconEntries();
      }
      const seen = new Set<string>();
      const uniqueMentions: { id: string; display: string }[] = [];

      for (const x of entries) {
        const id = slugify(x.name);
        if (!seen.has(id)) {
          seen.add(id);
          uniqueMentions.push({ id, display: x.name });
        }
      }
      setMentionData(uniqueMentions);
    }

    fetchMentions();
  }, [submission.type]);

  // Fetch tag suggestions when submission.type changes
  useEffect(() => {
    async function fetchTags() {
      let entries:
        | Awaited<ReturnType<typeof getExiconEntries>>
        | Awaited<ReturnType<typeof getLexiconEntries>> = [];
      if (submission.type === XiconType.exicon) {
        entries = await getExiconEntries();
      } else {
        entries = await getLexiconEntries();
      }
      const seen = new Set<string>();
      const uniqueTags: string[] = [];

      for (const x of entries) {
        for (const tag of x.tags ?? []) {
          const clean = tag.trim();
          if (clean && !seen.has(clean)) {
            seen.add(clean);
            uniqueTags.push(clean);
          }
        }
      }
      setAvailableTags(uniqueTags);
    }

    fetchTags();
  }, [submission.type]);

  const bgClass = submission.status !== "pending" ? "bg-gray-200" : "bg-white";
  const slug = slugify(submission.name ?? "");

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
      toastInfo("Submission set to pending.");
      onUpdate?.(updated as Submission);
    } catch (err) {
      console.error(err);
      toastError("Failed to set to pending.");
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

  const handleNameChange = (newName: string) =>
    setForm((prev) => ({ ...prev, name: newName }));
  const handleDescriptionChange = (newDesc: string) =>
    setForm((prev) => ({ ...prev, description: newDesc }));
  const handleAliasesCsvChange = (newCsv: string) =>
    setForm((prev) => ({ ...prev, aliasesCsv: newCsv }));
  const handleTagsChange = (newTags: string[]) =>
    setForm((prev) => ({ ...prev, tags: newTags }));
  const handleVideoUrlChange = (newUrl: string) =>
    setForm((prev) => ({ ...prev, videoUrl: newUrl }));

  const handleSave = async () => {
    // 1) Validate required fields
    if (!form.name.trim() || !form.description.trim()) {
      toastError("Name and description are required.");
      return;
    }
    if (form.videoUrl && !/^https?:\/\/.+/.test(form.videoUrl)) {
      toastError("Invalid video URL.");
      return;
    }

    // 2) Build aliases array from CSV
    const aliasesArray = form.aliasesCsv
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    // 3) Construct a full Submission object for updateSubmission()
    const updatedSubmission: Submission = {
      ...submission,
      name: form.name.trim(),
      description: form.description.trim(),
      aliases: aliasesArray,
      tags: form.tags.map((t) => t.trim()).filter(Boolean),
      videoUrl: form.videoUrl.trim() || null,
    };

    try {
      const result = await updateSubmission(updatedSubmission);
      toastSuccess("Changes saved.");
      onUpdate?.(result);
      setEditing(false);
    } catch (err) {
      console.error(err);
      toastError("Failed to save changes.");
    }
  };

  function escapeRegExp(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  function highlight(text: string, query: string) {
    if (!query) return text;
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="highlight-match">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }
  function renderDescriptionWithLinks(text: string) {
    const parts = text.split(/(@[\w\-]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const refName = part.slice(1);
        const refSlug = slugify(refName);
        return (
          <a key={i} href={`#${refSlug}`} className="text-f3link underline">
            @{refName}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className={`border rounded-xl p-4 shadow-sm relative ${bgClass}`} id={slug}>
      <div className="absolute top-2 right-2 flex space-x-2">
        {/* Delete (Trash) if not editing */}
        {onDeleteRequested && !editing && (
          <button
            type="button"
            onClick={() => onDeleteRequested(submission.id)}
            className="text-gray-400 hover:text-red-500"
            title={`Delete submission '${submission.name}'`}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        )}

        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-gray-400 hover:text-blue-500"
            title={`Edit submission '${submission.name}'`}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}

        {editing && (
          <>
            <button
              type="button"
              onClick={handleSave}
              className="text-green-600 hover:text-green-800"
              title="Save changes"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                // Revert form state to original submission values
                setForm({
                  name: submission.name ?? "",
                  description: submission.description ?? "",
                  aliasesCsv: Array.isArray(submission.aliases)
                    ? submission.aliases.join(", ")
                    : "",
                  tags: Array.isArray(submission.tags)
                    ? submission.tags
                    : [],
                  videoUrl: submission.videoUrl ?? "",
                });
                setEditing(false);
              }}
              className="text-gray-400 hover:text-gray-600"
              title="Cancel edit"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="mt-1 block w-full border px-2 py-1 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <MentionTextArea
              value={form.description}
              onChange={handleDescriptionChange}
              suggestions={mentionData}
              placeholder="Use @ to mention related Xicons…"
              className="mt-1 w-full border px-2 py-1 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Aliases (comma-separated)
            </label>
            <input
              type="text"
              value={form.aliasesCsv}
              onChange={(e) => handleAliasesCsvChange(e.target.value)}
              className="mt-1 block w-full border px-2 py-1 rounded text-sm"
              placeholder="e.g. Foo, Bar, Baz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <TagInput
              allTags={availableTags}
              selected={form.tags}
              onChange={handleTagsChange}
              placeholder="Type tag and press Enter…"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Video URL</label>
            <input
              type="url"
              value={form.videoUrl}
              onChange={(e) => handleVideoUrlChange(e.target.value)}
              className="mt-1 block w-full border px-2 py-1 rounded text-sm"
              placeholder="https://example.com/video"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 mb-1">
              <strong>ID:</strong> {submission.id}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              <strong>Type:</strong> {submission.type}
            </div>
            <div className="text-xs text-gray-500 mb-1">
              <strong>Status:</strong>{" "}
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
              </span>
            </div>
            <div className="text-xs text-gray-500">
              <strong>Created:</strong>{" "}
              {new Date(submission.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500 mb-1">ID: {submission.id}</div>
          <h3 className="text-xl font-bold text-f3accent mb-2">
            {submission.name}
          </h3>
          <div className="text-sm text-gray-700 mb-2">
            Description:{" "}
            {renderDescriptionWithLinks(submission.description ?? "")}
          </div>
          <div className="text-sm text-gray-700 mb-2">Slug: {slug}</div>

          {Array.isArray(submission.aliases) && submission.aliases.length > 0 && (
            <div className="text-sm mb-2">
              <span className="font-medium">Aliases:</span>{" "}
              {submission.aliases.join(", ")}
            </div>
          )}

          {Array.isArray(submission.tags) && submission.tags.length > 0 && (
            <div className="text-sm mb-2">
              <span className="font-medium">Tags:</span>{" "}
              {submission.tags.join(", ")}
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

          <div className="flex gap-2">
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
        </>
      )}
    </div>
  );
}
