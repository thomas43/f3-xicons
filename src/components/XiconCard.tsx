"use client";

import { useState, useRef } from "react";
import { Xicon } from "@prisma/client";
import { slugify } from "@/lib/slugify";
import { updateXicon, getExiconEntries, getLexiconEntries } from "@/lib/xicon";
import { useToast } from "@/components/ToastProvider";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { TagInput } from "@/components/TagInput";
import { MentionTextArea } from "@/components/MentionTextArea";

interface Props {
  entry: Xicon;
  search: string;
  isAdmin?: boolean;
  onUpdate?: (updated: Xicon) => void;
  onDeleteRequested?: (id: string) => void;
}

export function XiconCard({
  entry,
  search,
  isAdmin = false,
  onUpdate,
  onDeleteRequested,
}: Props) {
  const { toastSuccess, toastError } = useToast();
  const slug = slugify(entry.name);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: entry.name,
    description: entry.description,
    aliasesCsv: Array.isArray(entry.aliases) ? entry.aliases.join(", ") : "",
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    videoUrl: entry.videoUrl ?? "",
    submittedBy: entry.submittedBy ?? "",
    region: entry.region ?? ""
  });

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [mentionData, setMentionData] = useState<{ id: string; display: string }[]>([]);
  const fetchedTags = useRef(false);

  const startEditing = async () => {
    setEditing(true);

    if (fetchedTags.current) return;
    fetchedTags.current = true;

    const entries = entry.type === "exicon"
      ? await getExiconEntries()
      : await getLexiconEntries();

    const seen = new Set<string>();
    const uniqueTags: string[] = [];
    const uniqueMentions: { id: string; display: string }[] = [];

    for (const x of entries) {
      const id = slugify(x.name);
      if (!seen.has(id)) {
        seen.add(id);
        uniqueMentions.push({ id, display: x.name });
      }
    }

    setMentionData(uniqueMentions);
    //console.log(uniqueMentions);

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
  };

  const handleSave = async () => {
    try {
      const updated = await updateXicon({ 
        ...entry, 
        ...form, 
        aliases: form.aliasesCsv
          .split(",")
          .map((a :string) => a.trim())
          .filter(Boolean), 
          submittedBy: form.submittedBy.trim(),
          region: form.region.trim(),
        });
      
      toastSuccess("Saved!");
      setEditing(false);
      onUpdate?.(updated);
    } catch (err) {
      toastError("Update failed");
    }
  };

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
  

  const renderVideo = () => {
    if (!form.videoUrl) return null;
    const embedUrl = getYouTubeEmbedUrl(form.videoUrl);
    if (!embedUrl) {
      return (
        <a
          href={form.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-f3accent underline"
        >
          {form.videoUrl}
        </a>
      );
    }
    return (
      <iframe
        className="w-full h-64 mb-4"
        src={embedUrl}
        title="Xicon video"
        allowFullScreen
      />
    );
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="border border-gray-300 rounded p-4 mb-4 bg-white shadow-md">
      {editing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Name"
          />

        <div className="flex">
          <MentionTextArea
            value={form.description}
            onChange={(val) => setForm({ ...form, description: val })}
            suggestions={mentionData}
            className="mt-1 w-full border px-2 py-1 rounded text-sm"
          />
        </div>
          <div>
            <label className="block text-sm font-medium">Aliases (comma separated)</label>
            <input
              type="text"
              value={form.aliasesCsv}
              onChange={(e) => setForm({ ...form, aliasesCsv: e.target.value })}
              placeholder="e.g. 8-count body builder, burpee"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tags</label>
            <TagInput
              allTags={availableTags}
              selected={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
            />
            <input type="hidden" name="tags" value={form.tags.join(",")} />
          </div>

          <div>
          <label className="block text-sm font-medium">YouTube video URL</label>
          <input
            type="text"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            placeholder="YouTube video URL"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          </div>

          <div>
            <label className="block text-sm font-medium">Submitted By</label>
            <input
              type="text"
              value={form.submittedBy}
              onChange={(e) => setForm({ ...form, submittedBy: e.target.value })}
              placeholder="Name or F3 Handle"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Region</label>
            <input
              type="text"
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              placeholder="F3 Region"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center"
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded flex items-center"
            >
              <XMarkIcon className="h-4 w-4 mr-1" /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-gray-900" id={slug}>{entry.name}</h2>
            {isAdmin && (
              <div className="flex gap-2">
                <button
                  onClick={startEditing}
                  className="text-gray-500 hover:text-f3accent"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteRequested?.(entry.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
            {renderDescriptionWithLinks(entry.description)}
          </div>
          
          {entry.aliases?.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              <strong>Aliases:</strong> {entry.aliases.join(", ")}
            </p>
          )}
          {entry.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag tag-selected"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {renderVideo()}

          {entry.submittedBy && (
            <p className="text-xs text-gray-500 mt-2">
              <strong>Submitted By:</strong> {entry.submittedBy}
            </p>
          )}
          
          {entry.region && (
            <p className="text-xs text-gray-500 mt-1">
              <strong>Region:</strong> {entry.region}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
