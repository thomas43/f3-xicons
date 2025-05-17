// src/app/lexicon/page.tsx
import { prisma } from "@/lib/prisma";
import XiconBrowser from "@/components/XiconBrowser";

export default async function LexiconPage() {
  const entries = await prisma.xicon.findMany({
    where: { type: "lexicon" },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Lexicon</h1>
      <XiconBrowser entries={entries} enableTags={false} />
    </div>
  );
}
