"use client";

import React, { useState, useRef, useEffect } from "react";

type TagInputProps = {
  allTags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
};

export function TagInput({ allTags, selected, onChange }: TagInputProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const filtered = allTags.filter(
    (tag) => tag.includes(query) && !selected.includes(tag)
  );

  const addTag = (tag: string) => {
    if (!selected.includes(tag)) {
      onChange([...selected, tag]);
    }
    setQuery("");
    setActiveIndex(0);
  };

  const removeTag = (tag: string) => {
    onChange(selected.filter((t) => t !== tag));
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && query.trim() !== "") {
      e.preventDefault();
      addTag(query.trim());
    } else if (e.key === "Backspace" && query === "" && selected.length > 0) {
      removeTag(selected[selected.length - 1]);
    } else if (filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i === 0 ? filtered.length - 1 : i - 1));
      } else if (e.key === "Tab") {
        addTag(filtered[activeIndex]);
        e.preventDefault();
      } else if (e.key === "Escape") {
        setQuery("");
        setActiveIndex(0);
      }
    }
  };

  useEffect(() => {
    const el = dropdownRef.current?.children[activeIndex] as HTMLElement;
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  return (
    <div className="w-full border border-gray-300 rounded p-2">
      <div className="flex flex-wrap gap-2">
        {selected.map((tag) => (
          <span
            key={tag}
            className="tag tag-unselected flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-white hover:text-gray-300"
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 100)}
          className="flex-1 min-w-[150px] focus:outline-none text-sm"
          placeholder="Type to add tags..."
        />
      </div>

      {(query !== "" || focused) && filtered.length > 0 && (
        <ul
          ref={dropdownRef}
          className="mt-2 border rounded bg-white shadow text-sm max-h-32 overflow-y-auto"
        >
          {filtered.map((tag, i) => (
            <li
              key={tag}
              className={`px-3 py-1 cursor-pointer transition-colors duration-75 ${
                i === activeIndex
                  ? "bg-blue-400 text-white"
                  : "hover:bg-blue-100 text-gray-800"
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                addTag(tag);
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}