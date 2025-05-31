import { getSubmissions } from "@/lib/submission";
import SubmissionsBrowser from "@/components/SubmissionsBrowser";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-900 p-4 mb-6 rounded">
        <p className="font-bold">Warning</p>
        <p>
          This admin page is <span className="underline">not currently protected</span>.
          In production, access should be restricted via <code>next-auth</code>.
        </p>
      </div>

      <SubmissionsBrowser submissions={submissions} />
    </div>
  );
}
