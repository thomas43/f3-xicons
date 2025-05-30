"use client";

import React, { useState, useRef, useEffect } from "react";

type Mention = { id: string; display: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  suggestions: Mention[];
};

export function MentionTextArea({ value, onChange, suggestions }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]); // ref to each <li>

  const [dropdown, setDropdown] = useState<{
    open: boolean;
    options: Mention[];
    position: { top: number; left: number };
    activeWord: string;
    startIndex: number;
  }>({
    open: false,
    options: [],
    position: { top: 0, left: 0 },
    activeWord: "",
    startIndex: -1,
  });

  useEffect(() => {
    itemRefs.current = [];
  }, [dropdown.options]);

  useEffect(() => {
    if (!dropdown.open || dropdown.options.length === 0) return;
  
    requestAnimationFrame(() => {
      const el = itemRefs.current[activeIndex];
      const container = el?.parentElement;
  
      console.log("attempt scroll to activeIndex", activeIndex);
  
      if (el && container) {
        const elTop = el.offsetTop;
        const elBottom = elTop + el.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
  
        if (elTop < containerTop) {
          container.scrollTop = elTop;
        } else if (elBottom > containerBottom) {
          container.scrollTop = elBottom - container.clientHeight;
        }
      }
    });
  }, [activeIndex, dropdown.options.length]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    onChange(input);

    const caret = e.target.selectionStart;
    const textBefore = input.slice(0, caret);
    const match = textBefore.match(/(^|\s)@([\w-]*)$/);

    if (match) {
      const query = match[2].toLowerCase();
      const wordStart = caret - query.length - 1;

      const filtered = suggestions.filter((s) =>
        s.display.toLowerCase().includes(query)
      );

      const rect = e.target.getBoundingClientRect();
      const lineHeight = 20;
      const lines = textBefore.substring(0, wordStart).split("\n");

      setDropdown({
        open: true,
        options: filtered,
        position: {
          top: lines.length * lineHeight,
          left: (lines.at(-1)?.length ?? 0) * 7.5 + 12,
        },
        activeWord: query,
        startIndex: wordStart,
      });
      setActiveIndex(0);
    } else {
      setDropdown((d) => ({ ...d, open: false }));
    }
  };

  const handleSelect = (mention: Mention) => {
    const textarea = textareaRef.current;
    if (!textarea || dropdown.startIndex < 0) return;

    const before = value.slice(0, dropdown.startIndex);
    const after = value.slice(textarea.selectionStart);
    const inserted = `@${mention.id} `;

    const newText = before + inserted + after;
    onChange(newText);
    setDropdown({ ...dropdown, open: false });

    requestAnimationFrame(() => {
      const pos = before.length + inserted.length;
      textarea.setSelectionRange(pos, pos);
      textarea.focus();
    });
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!dropdown.open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % dropdown.options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        i === 0 ? dropdown.options.length - 1 : i - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleSelect(dropdown.options[activeIndex]);
    } else if (e.key === "Escape") {
      setDropdown((d) => ({ ...d, open: false }));
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyEvent}
        rows={4}
        placeholder="Type @ to link to a Xicon"
        className="w-full p-2 border rounded font-mono resize-y"
      />

      {dropdown.open && dropdown.options.length > 0 && (
        <ul
          className="absolute z-50 bg-white border border-gray-300 rounded-xl shadow-md w-72 max-h-48 overflow-y-auto text-sm font-sans"
          style={{ top: dropdown.position.top, left: dropdown.position.left }}
        >
          {dropdown.options.map((opt, i) => (
            <li
              key={opt.id}
              ref={(el) => (itemRefs.current[i] = el)} // attach to index
              className={`px-4 py-2 transition-colors duration-100 cursor-pointer ${
                i === activeIndex
                  ? "bg-f3accent text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent blur
                handleSelect(opt);
              }}
            >
              <span className="font-semibold">{opt.display}</span>{" "}
              <span className="text-gray-400">(@{opt.id})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
