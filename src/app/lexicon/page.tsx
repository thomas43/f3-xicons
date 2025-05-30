// src/app/lexicon/page.tsx
import XiconBrowser from "@/components/XiconBrowser";
import { getLexiconEntries } from "@/lib/xicon";
import Link from "next/link";

export default async function LexiconPage() {
  const entries = await getLexiconEntries();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-f3accent">F3 Lexicon</h1>
        <Link
          href="/submit"
          className="text-sm text-f3accent hover:underline"
        >
          Submit a new entry →
        </Link>
      </div>
    
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
