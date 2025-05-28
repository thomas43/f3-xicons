// app/submit/page.tsx
import { submitEntry } from "@/lib/submission";
import { headers } from "next/headers"
import { CheckCircleIcon } from "@heroicons/react/20/solid";


export default async function SubmitPage() {
  const headersList = await headers();
  const referer = headersList.get("referer") || "";
  const submitted = referer.includes("/submit?submitted=true");

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-f3accent mb-6">Submit a New Entry</h1>

      <form action={submitEntry} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select name="type" className="w-full border p-2 rounded" required>
            <option value="exicon">Exicon</option>
            <option value="lexicon">Lexicon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" type="text" required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" required rows={5} className="w-full border p-2 rounded"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Aliases (comma-separated)</label>
          <input name="aliases" type="text" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Tags (comma-separated)</label>
          <input name="tags" type="text" className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Video URL (optional)</label>
          <input name="videoUrl" type="url" className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-f3accent text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
      
      {submitted && (
        <div className="flex items-start gap-2 text-green-700 bg-green-50 border border-green-300 4 px-3 py-2 rounded mt-6 mb-6 text-sm">
          <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />
          <p>Thanks for your submission!</p>
        </div>
      )}
    </main>
  );
}
