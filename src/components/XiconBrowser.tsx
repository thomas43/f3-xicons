"use client";

import { useState, useMemo } from "react";
import { Xicon, XiconType } from "@prisma/client";
import XiconCard from "./XiconCard";

interface Props {
  entries: Xicon[];
  enableTags?: boolean;
  showTypeFilter?: boolean;
  searchPlaceholder?: string;
  isAdmin?: boolean;
}

export default function XiconBrowser({
  entries,
  enableTags,
  searchPlaceholder = "Search...",
  showTypeFilter = false,
  isAdmin = false,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<XiconType | "all">("all");

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const inTag = !selectedTag || entry.tags.includes(selectedTag);
      const inType = selectedType === "all" || entry.type === selectedType;
      const inSearch =
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        entry.aliases.some((alias) => alias.toLowerCase().includes(search.toLowerCase()));
      return inTag && inType && inSearch;
    });
  }, [entries, search, selectedTag, selectedType]);
  
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

      {showTypeFilter && (
        <div className="border-b pb-4 flex gap-2 flex-wrap mb-4">
            <button onClick={() => setSelectedType("all")} className={`tag ${selectedType === "all" ? "tag-selected" : "tag-unselected"}`}>
            All
            </button>
            <button onClick={() => setSelectedType(XiconType.exicon)} className={`tag ${selectedType === XiconType.exicon ? "tag-selected" : "tag-unselected"}`}>
            Exicon
            </button>
            <button onClick={() => setSelectedType(XiconType.lexicon)} className={`tag ${selectedType === XiconType.lexicon ? "tag-selected" : "tag-unselected"}`}>
            Lexicon
            </button>
        </div>
      )}

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
