// src/components/XiconCard.tsx
import { Xicon } from "@prisma/client";
import { slugify } from "@/lib/slugify";

export default function XiconCard({ entry, query }: { entry: Xicon, query: string }) {
  const slug = slugify(entry.name);

  const renderDescriptionWithLinks = (text: string) => {
    const parts = text.split(/(@[\w\s\-]+)/g);
  
    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const refName = part.slice(1).trim();
        const refSlug = slugify(refName);
        return (
          <a
            key={i}
            href={`#${refSlug}`}
            className="text-f3link underline"
          >
            @{refName}
          </a>
        );
      }
      return <span key={i}>{highlight(part, query)}</span>;
    });
  };  

  return (
    <div className="border-b pb-4" id={slug}>
      <h2 className="xicon-heading group">
        <a href={`#${slug}`} className="text-inherit hover:underline">
            {highlight(entry.name, query)}
        </a>
        <a
            href={`#${slug}`}
            className="xicon-anchor group-hover:opacity-100"
            title="Link to this entry"
        >
        </a>
    </h2>

      <p className="xicon-description">
        {renderDescriptionWithLinks(entry.description)}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, i) => (
            <span
              key={i}
              className="tag-readonly"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function highlight(text: string, query: string) {
    if (!query) return text;
  
    const regex = new RegExp(`(${query})`, 'gi');
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
  