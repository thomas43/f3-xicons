// src/app/exicon/page.tsx
import { getExiconEntries } from "@/lib/xicon";
import XiconBrowser from "@/components/XiconBrowser";

export default async function ExiconPage() {
  const entries = await getExiconEntries();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Exicon</h1>
      <XiconBrowser entries={entries} />
    </div>
  );
}
