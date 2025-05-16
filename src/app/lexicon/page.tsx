import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function LexiconPage() {
  const lexiconEntries = await prisma.xicon.findMany({
    where: { type: "lexicon" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Lexicon</h1>
      <ul className="space-y-4">
        {lexiconEntries.map((entry) => (
          <li key={entry.id} className="border-b pb-2">
            <h2 className="text-xl font-semibold">{entry.name}</h2>
            <p className="text-gray-700">{entry.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
