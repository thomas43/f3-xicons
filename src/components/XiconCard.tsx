"use client";

import { useState } from "react";
import { Xicon } from "@prisma/client";
import { slugify } from "@/lib/slugify";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { deleteXicon, updateXicon } from "@/lib/xicon";

export default function XiconCard({
  entry,
  search,
  isAdmin = false,
}: {
  entry: Xicon;
  search: string;
  isAdmin?: boolean;
}) {
  const slug = slugify(entry.name);
  const [editing, setEditing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: entry.name,
    description: entry.description,
    aliases: entry.aliases.join(", "),
    tags: entry.tags.join(", "),
    references: entry.references.join(", "),
    videoUrl: entry.videoUrl || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const { name, description, videoUrl } = form;

    if (!name.trim() || !description.trim()) {
      setStatusMsg("❌ Name and description are required.");
      return;
    }

    if (videoUrl && !/^https?:\/\/.+/.test(videoUrl)) {
      setStatusMsg("❌ Invalid video URL.");
      return;
    }

    const updated = {
      ...entry,
      name: form.name.trim(),
      description: form.description.trim(),
      aliases: form.aliases.split(",").map((a) => a.trim()).filter(Boolean),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      references: form.references.split(",").map((r) => r.trim()).filter(Boolean),
      videoUrl: form.videoUrl.trim() || null,
    };

    try {
      await updateXicon(updated); // make sure this function exists in `@/lib/xicon`
      setStatusMsg("✅ Saved successfully.");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setStatusMsg("❌ Failed to save.");
    }
  };

  return (
    <div className="border-b pb-4 relative" id={slug}>
      {isAdmin && !editing && (
        <form action={deleteXicon} className="absolute top-2 right-2 space-x-2 flex">
          <input type="hidden" name="id" value={entry.id} />
          <button
            type="submit"
            className="text-gray-400 hover:text-red-500"
            title={`Delete '${entry.name}'`}
          >
            <TrashIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-gray-400 hover:text-blue-500"
            title={`Edit '${entry.name}'`}
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        </form>
      )}

      {isAdmin && editing ? (
        <div className="space-y-2">
          <input
            className="w-full border px-2 py-1 text-sm rounded"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <textarea
            className="w-full border px-2 py-1 text-sm rounded"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <input
            className="w-full border px-2 py-1 text-sm rounded"
            placeholder="Aliases, Comma-separated"
            value={form.aliases}
            onChange={(e) => handleChange("aliases", e.target.value)}
          />
          <input
            className="w-full border px-2 py-1 text-sm rounded"
            placeholder="Tags, Comma-separated"
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
          />
          <input
            className="w-full border px-2 py-1 text-sm rounded"
            placeholder="References, Comma-separated"
            value={form.references}
            onChange={(e) => handleChange("references", e.target.value)}
          />
          <input
            className="w-full border px-2 py-1 text-sm rounded"
            placeholder="Video URL"
            value={form.videoUrl}
            onChange={(e) => handleChange("videoUrl", e.target.value)}
          />

          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800"
              title="Save"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-gray-400 hover:text-gray-600"
              title="Cancel"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          {statusMsg && (
            <div className="text-xs mt-2 text-gray-600">{statusMsg}</div>
          )}
        </div>
      ) : (
        <>
          <h2 className="xicon-heading group">
            <a href={`#${slug}`} className="text-inherit hover:underline">
              {highlight(entry.name, search)}
            </a>
            <a href={`#${slug}`} className="xicon-anchor group-hover:opacity-100" />
          </h2>

          {entry.aliases && entry.aliases.length > 0 && (
            <p className="text-sm italic text-gray-500">
              Also known as: {entry.aliases.join(', ')}
            </p>
          )}

          <p className="xicon-description">
            {renderDescriptionWithLinks(entry.description)}
          </p>

          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag, i) => (
                <span key={i} className="tag-readonly">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isAdmin && (
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <div><strong>ID:</strong> {entry.id}</div>
              <div><strong>Slug:</strong> {slug}</div>
              <div><strong>Type:</strong> {entry.type}</div>
              <div><strong>Created:</strong> {new Date(entry.createdAt).toLocaleString()}</div>
              <div><strong>Updated:</strong> {new Date(entry.updatedAt).toLocaleString()}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function renderDescriptionWithLinks(text: string) {
  const parts = text.split(/(@[\w\s\-]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      const refName = part.slice(1).trim();
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

function highlight(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
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
