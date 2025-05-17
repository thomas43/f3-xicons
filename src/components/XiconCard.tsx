// src/components/XiconCard.tsx
import { Xicon } from "@prisma/client";
import { slugify } from "@/lib/slugify";

export default function XiconCard({ entry }: { entry: Xicon }) {
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
            className="text-blue-600 underline"
          >
            @{refName}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="border-b pb-4" id={slug}>
      <h2 className="text-xl font-semibold">{entry.name}</h2>
      <p className="text-gray-700 mb-2">
        {renderDescriptionWithLinks(entry.description)}
      </p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

