// src/components/SubmissionForm.tsx
"use client";

import { useTransition, useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { submitEntry } from "@/lib/submission";

export default function SubmissionForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {toastError, toastSuccess} = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const form = e.currentTarget; 
    startTransition(async () => {
        try {
            await submitEntry(new FormData(form));
            toastSuccess("Submission received!");
            setStatus("success");
            form.reset(); 
        } catch (err: any) {
            toastError(err.message || "Submission failed");
            setStatus("error");
        }
    });

  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select name="type" className="w-full border p-2 rounded" required>
          <option value="exicon">Exicon</option>
          <option value="lexicon">Lexicon</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input name="name" type="text" className="w-full border p-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea name="description" className="w-full border p-2 rounded" rows={4} required />
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
        <label className="block text-sm font-medium">Video URL</label>
        <input name="videoUrl" type="url" className="w-full border p-2 rounded" />
      </div>

      <button type="submit" className="bg-f3accent text-white py-2 px-4 rounded" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
