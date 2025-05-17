// src/components/XiconCard.tsx
import { Xicon } from "@prisma/client";

export default function XiconCard({ entry }: { entry: Xicon }) {
  return (
    <div className="border-b pb-4">
      <h2 className="text-xl font-semibold">{entry.name}</h2>
      <p className="text-gray-700 mb-2">{entry.description}</p>
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
