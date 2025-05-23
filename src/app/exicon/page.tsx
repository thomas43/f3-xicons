// app/exicon/page.tsx
import { getExiconEntries } from "@/lib/xicon";
import XiconBrowser from "@/components/XiconBrowser";

export default async function ExiconPage() {
  const entries = await getExiconEntries();

  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-f3accent mb-6">F3 Exicon</h1>
      <XiconBrowser entries={entries} enableTags={true} searchPlaceholder="Search..." />
    </main>
  );
}
