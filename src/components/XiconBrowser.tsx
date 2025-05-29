"use client";

import { useState, useMemo, useEffect } from "react";
import { Xicon, XiconType } from "@prisma/client";
import { deleteXicon } from "@/lib/xicon";
import XiconCard from "./XiconCard";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";

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
  const [localEntries, setLocalEntries] = useState(entries);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagLogic, setTagLogic] = useState<"AND" | "OR">("OR");
  const [selectedType, setSelectedType] = useState<XiconType | "all">("all");
  const [deleteStatus, setDeleteStatus] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    localEntries.forEach((entry) => entry.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [localEntries]);

  const filteredEntries = useMemo(() => {
    return localEntries.filter((entry) => {
      const matchesTags =
        selectedTags.length === 0
          ? true
          : tagLogic === "AND"
          ? selectedTags.every((tag) => entry.tags.includes(tag))
          : selectedTags.some((tag) => entry.tags.includes(tag));
  
      const matchesType =
        selectedType === "all" || entry.type === selectedType;
  
      const matchesSearch =
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.description.toLowerCase().includes(search.toLowerCase()) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        entry.aliases.some((alias) =>
          alias.toLowerCase().includes(search.toLowerCase())
        );
  
      return matchesTags && matchesType && matchesSearch;
    });
  }, [localEntries, search, selectedTags, selectedType, tagLogic]);
  
  const updateEntry = (updated: Xicon) => {
    setLocalEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  useEffect(() => {
    if (deleteStatus) {
      const timeout = setTimeout(() => setDeleteStatus(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [deleteStatus]);

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
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {allTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag)
                        ? prev.filter((t) => t !== tag)
                        : [...prev, tag]
                    );
                  }}
                  className={`tag ${isSelected ? "tag-selected" : "tag-unselected"}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="text-sm mb-2">
            Match mode:{" "}
            <button
              onClick={() =>
                setTagLogic(tagLogic === "AND" ? "OR" : "AND")
              }
              className="underline font-semibold"
            >
              {tagLogic}
            </button>
          </div>

          {selectedTags.length > 0 && (
            <button
              onClick={() => setSelectedTags([])}
              className="text-xs underline text-gray-500"
            >
              Clear tag filters
            </button>
          )}
        </div>
      )}

      <div className="space-y-4">
      {deleteStatus && (
        <div className="mb-4 text-sm text-gray-700 bg-gray-200 rounded-md px-3 py-2 flex items-center gap-2">
            {deleteStatus.includes("success") ? (
            <CheckIcon className="h-4 w-4 text-green-600" />
            ) : (
            <XMarkIcon className="h-4 w-4 text-red-500" />
          )}
          <span>{deleteStatus}</span>
        </div>
        )}
        {filteredEntries.map((entry) => (
          <XiconCard 
            key={entry.id} 
            entry={entry} 
            isAdmin={isAdmin} 
            search={search} 
            onUpdate={updateEntry} 
            onDeleteRequested={async (id) => {
              try {
                await deleteXicon({ id });
                setLocalEntries((prev) => prev.filter((e) => e.id !== id));
                setDeleteStatus(`"Deleted '${entry.name}' successfully."`);
              } catch (err) {
                console.error(err);
                setDeleteStatus(`"Failed to delete '${entry.name}'."`);
              }
            }}
          />
        ))}
        {filteredEntries.length === 0 && (
          <div className="text-sm text-gray-500">No matches found.</div>
        )}
      </div>
    </div>
  );
}
