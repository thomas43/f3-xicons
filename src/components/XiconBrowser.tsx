"use client";

import { useState, useMemo } from "react";
import { Xicon } from "@prisma/client";
import XiconCard from "./XiconCard";

interface Props {
  entries: Xicon[];
  enableTags: boolean;
  searchPlaceholder?: string;
  isAdmin?: boolean;
}

export default function XiconBrowser({
  entries,
  enableTags,
  searchPlaceholder = "Search...",
  isAdmin = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const inTag = !selectedTag || entry.tags.includes(selectedTag);
      const inSearch =
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        entry.aliases.some((alias) => alias.toLowerCase().includes(search.toLowerCase()));
      return inTag && inSearch;
    });
  }, [entries, search, selectedTag]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded text-sm w-full"
        />
      </div>

      {enableTags && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`tag ${tag === selectedTag ? "tag-selected" : "tag-unselected"}`}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-xs underline text-gray-500"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <XiconCard key={entry.id} entry={entry} isAdmin={isAdmin} search={search} />
        ))}
        {filteredEntries.length === 0 && (
          <div className="text-sm text-gray-500">No matching entries found.</div>
        )}
      </div>
    </div>
  );
}
