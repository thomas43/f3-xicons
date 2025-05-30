// src/components/SubmissionForm.tsx
"use client";

import { useTransition, useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";
import { submitEntry } from "@/lib/submission";
import { slugify } from "@/lib/slugify";
import { getExiconEntries, getLexiconEntries } from "@/lib/xicon";
import { MentionTextArea } from "@/components/MentionTextArea";
import { TagInput } from "@/components/TagInput";

export default function SubmissionForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [mentionData, setMentionData] = useState<{ id: string; display: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"exicon"| "lexicon" >("exicon");
  const { toastError, toastSuccess } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const entries = type === "exicon"
        ? await getExiconEntries()
        : await getLexiconEntries();
  
      const seen = new Set<string>();
      const uniqueMentions: { id: string; display: string }[] = [];
  
      for (const x of entries) {
        const id = slugify(x.name);
        if (!seen.has(id)) {
          seen.add(id);
          uniqueMentions.push({ id, display: x.name });
        }
      }
  
      setMentionData(uniqueMentions);
    };
  
    fetch();
  }, [type]);

  useEffect(() => {
    const fetch = async () => {
      const entries = type === "exicon"
        ? await getExiconEntries()
        : await getLexiconEntries();
  
      const seen = new Set<string>();
      const uniqueTags: string[] = [];
  
      for (const x of entries) {
        for (const tag of x.tags ?? []) {
          const clean = tag.trim();
          if (clean && !seen.has(clean)) {
            seen.add(clean);
            uniqueTags.push(clean);
          }
        }
      }
  
      setAvailableTags(uniqueTags);
    };
  
    fetch();
  }, [type]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    data.set("description", description); // append controlled field

    startTransition(async () => {
      try {
        await submitEntry(data);
        toastSuccess("Submission received!");
        setStatus("success");
        form.reset();
        setDescription(""); // clear controlled input
        setTags([]);
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
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "exicon" | "lexicon")}
          className="w-full border p-2 rounded"
          required
        >
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
        <MentionTextArea
          value={description}
          onChange={setDescription}
          suggestions={mentionData}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Aliases (comma-separated)</label>
        <input name="aliases" type="text" className="w-full border p-2 rounded" />
      </div>

      <div>
      <label className="block text-sm font-medium">Tags</label>
        <TagInput allTags={availableTags} selected={tags} onChange={setTags} />
        <input type="hidden" name="tags" value={tags.join(",")} />
      </div>

      <div>
        <label className="block text-sm font-medium">Video URL</label>
        <input name="videoUrl" type="url" className="w-full border p-2 rounded" />
      </div>

      <button
        type="submit"
        className="bg-f3accent text-white py-2 px-4 rounded"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
