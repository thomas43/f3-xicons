// src/app/submit/page.tsx
import SubmissionForm from "@/components/SubmissionForm";

export default function SubmitPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-f3accent mb-6">Submit a New Entry</h1>
      <SubmissionForm />
    </main>
  );
}
