// app/exicon/page.tsx
import Link from "next/link";
import { getExiconEntries } from "@/lib/xicon";
import XiconBrowser from "@/components/XiconBrowser";

export default async function ExiconPage() {
  const entries = await getExiconEntries();

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-f3accent mb-6">F3 Exicon</h1>
      
      <Link
        href="/submit"
        className="text-sm text-f3accent hover:underline float-right"
      >
        Submit a new entry →
      </Link>

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
