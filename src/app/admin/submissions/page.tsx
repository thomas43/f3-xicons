import { getSubmissions } from "@/lib/submission";
import SubmissionsBrowser from "@/components/SubmissionsBrowser";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();
  return <SubmissionsBrowser submissions={submissions} />;
}
