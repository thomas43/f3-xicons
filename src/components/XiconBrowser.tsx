"use client";

import { useState } from "react";
import XiconCard from "./XiconCard";
import { Xicon } from "@prisma/client";

export default function XiconBrowser({
    entries,
    enableTags = true,
  }: {
    entries: Xicon[];
    enableTags?: boolean;
  }) {
  
  const [query, setQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagMode, setTagMode] = useState<"AND" | "OR">("OR");

  const allTags = Array.from(
    new Set(entries.flatMap((entry) => entry.tags))
  ).sort();

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function matchesTags(entry: Xicon) {
    if (selectedTags.length === 0) return true;
    const tags = entry.tags;

    return tagMode === "AND"
      ? selectedTags.every((tag) => tags.includes(tag))
      : selectedTags.some((tag) => tags.includes(tag));
  }

  const filtered = entries.filter((entry) => {
    const haystack = `${entry.name} ${entry.description} ${entry.aliases.join(" ")}`.toLowerCase();
    const matchesSearch = haystack.includes(query.toLowerCase());
    const matchesTagFilter = matchesTags(entry);
    return matchesSearch && matchesTagFilter;
  });

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {enableTags && allTags.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`text-sm px-3 py-1 rounded-full border ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 border-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Filter mode:{" "}
              <button
                onClick={() =>
                  setTagMode((mode) => (mode === "OR" ? "AND" : "OR"))
                }
                className="underline"
              >
                {tagMode}
              </button>{" "}
              (click to toggle)
            </div>
          </>
        )}
      </div>

      <ul className="space-y-6">
        {filtered.map((entry) => (
          <li key={entry.id}>
            <XiconCard entry={entry} />
          </li>
        ))}
      </ul>
    </div>
  );
}
