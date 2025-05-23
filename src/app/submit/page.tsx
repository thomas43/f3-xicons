// app/submit/page.tsx
import { submitEntry } from "@/lib/submission";

export default function SubmitPage() {
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
    </main>
  );
}
