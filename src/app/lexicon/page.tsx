// src/app/lexicon/page.tsx
import { prisma } from "@/lib/prisma";
import XiconBrowser from "@/components/XiconBrowser";
import { getLexiconEntries } from "@/lib/xicon";

export default async function LexiconPage() {
  const entries = await getLexiconEntries();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-f3accent mb-6">Lexicon</h1>
      <p className="mb-6 text-gray-600">
        A glossary of F3 terms and lingo. Click terms or search to explore.
      </p>
      <XiconBrowser 
        entries={entries} 
        enableTags={true} 
        searchPlaceholder="Search lexicon terms..."
        isAdmin={false}
        showTypeFilter={false}
      />
    </div>
  );
}
