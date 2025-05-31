"use client";

import { useState, useMemo, useEffect } from "react";
import { Xicon, XiconType } from "@prisma/client";
import { deleteXicon } from "@/lib/xicon";
import { XiconCard } from "./XiconCard";
import { useToast } from "@/components/ToastProvider";
import { slugify } from "@/lib/slugify";
import { XMarkIcon } from "@heroicons/react/20/solid";

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
  const { toastSuccess, toastError } = useToast();
  const [localEntries, setLocalEntries] = useState(entries);
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagLogic, setTagLogic] = useState<"AND" | "OR">("OR");
  const [selectedType, setSelectedType] = useState<XiconType | "all">("all");

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
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash?.slice(1);
      if (!hash) return;
  
      const match = entries.find((entry) => slugify(entry.name) === hash);
      if (match) {
        setSearch("");
        setSelectedTags([]);
        setSelectedType("all");
  
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);

        // Clear hash after 2 seconds
        setTimeout(() => {
          if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }, 2000);
      }
    };
  
    // Run once on initial load
    handleHashChange();
  
    // Listen for future hash changes
    window.addEventListener("hashchange", handleHashChange);
  
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [entries]);  

  const updateEntry = (updated: Xicon) => {
    setLocalEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  return (
    <div>
    <div className="mb-4">
      <div className="relative w-full">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded text-sm w-full pr-8 h-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-600"
            aria-label="Clear search"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>
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
                toastSuccess(`"Deleted '${entry.name}' successfully."`);
              } catch (err) {
                console.error(err);
                toastError(`"Failed to delete '${entry.name}'."`);
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
