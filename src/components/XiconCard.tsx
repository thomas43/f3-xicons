import { Xicon } from "@prisma/client";
import { slugify } from "@/lib/slugify";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";

export default function XiconCard({
  entry,
  query,
  isAdmin = false,
}: {
  entry: Xicon;
  query: string;
  isAdmin?: boolean;
}) {
  const slug = slugify(entry.name);

  const renderDescriptionWithLinks = (text: string) => {
    const parts = text.split(/(@[\w\s\-]+)/g);

    return parts.map((part, i) => {
      if (part.startsWith("@")) {
        const refName = part.slice(1).trim();
        const refSlug = slugify(refName);
        return (
          <a key={i} href={`#${refSlug}`} className="text-f3link underline">
            @{refName}
          </a>
        );
      }
      return <span key={i}>{highlight(part, query)}</span>;
    });
  };

  return (
    <div className="border-b pb-4 relative" id={slug}>
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <button title="Edit" className="hover:text-black">
            <PencilIcon className="w-4 h-4 text-gray-500" />
          </button>
          <button title="Delete" className="hover:text-red-700">
            <TrashIcon className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}

      <h2 className="xicon-heading group">
        <a href={`#${slug}`} className="text-inherit hover:underline">
          {highlight(entry.name, query)}
        </a>
        <a
          href={`#${slug}`}
          className="xicon-anchor group-hover:opacity-100"
          title="Link to this entry"
        ></a>
      </h2>

      <p className="xicon-description">{renderDescriptionWithLinks(entry.description)}</p>

      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {entry.tags.map((tag, i) => (
            <span key={i} className="tag-readonly">
              {tag}
            </span>
          ))}
        </div>
      )}

      {isAdmin && (
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <div><strong>ID:</strong> {entry.id}</div>
          <div><strong>Slug:</strong> {slug}</div>
          <div><strong>Type:</strong> {entry.type}</div>
          <div><strong>Created:</strong> {new Date(entry.createdAt).toLocaleString()}</div>
          <div><strong>Updated:</strong> {new Date(entry.updatedAt).toLocaleString()}</div>
        </div>
      )}
    </div>
  );
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
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
