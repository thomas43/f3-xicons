// src/app/admin/xicons/page.tsx
import XiconBrowser from "@/components/XiconBrowser";
import { getXiconEntries } from "@/lib/xicon";

export default async function AdminXiconsPage() {
    const entries = await getXiconEntries();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="bg-white dark:bg-white border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6" role="alert">
        <p className="font-bold">Warning</p>
        <p>
          This admin page is <span className="underline">not currently protected</span>.
          Eventually access will be restricted via <code>next-auth</code>.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-f3accent mb-6">Admin: Xicon Entries</h1>
      <p className="mb-6 text-gray-600">
        View and manage all Exicon and Lexicon entries below.
      </p>
      <XiconBrowser
        entries={entries}
        enableTags={true}
        searchPlaceholder="Search Xicon entries..."
        isAdmin={true}
        showTypeFilter = {true}
      />
    </div>
  );
}
