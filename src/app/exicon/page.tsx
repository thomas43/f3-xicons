// app/exicon/page.tsx
import Link from "next/link";
import { getExiconEntries } from "@/lib/xicon";
import XiconBrowser from "@/components/XiconBrowser";

export default async function ExiconPage() {
  const entries = await getExiconEntries();

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
    <div className="flex justify-between items-center mb-2">
      <h1 className="text-3xl font-bold text-f3accent">F3 Exicon</h1>
      <Link
        href="/submit"
        className="text-sm text-f3accent hover:underline"
      >
        Submit a new entry →
      </Link>
    </div>

    <p className="mb-6 text-gray-600">
      A collection of F3 workout exercises. Click a name or search to explore proper form and variations.
    </p>

    <XiconBrowser
      entries={entries}
      enableTags={true}
      searchPlaceholder="Search exercises..."
      isAdmin={false}
      showTypeFilter={false}
    />
  </main>
  );
}
