// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-f3accent mb-6">F3 Xicons Project Status</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">✅ Completed</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>✅ Exicon and Lexicon entries displayed with filtering and search</li>
          <li>✅ Admin interface for editing and deleting Xicon entries</li>
          <li>✅ Submissions page with inline validation and success messages</li>
          <li>✅ Admin view of pending submissions with approve/reject functionality</li>
          <li>✅ Inline editing of entries with validation and status messages</li>
          <li>✅ Enum-based filtering by XiconType and SubmissionStatus</li>
          <li>✅ Global Tailwind 4 styling with accent colors and admin indicators</li>
          <li>✅ Automatic redirect after successful submission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">🧩 In Progress / TODO</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>⬜ CSV generation/export page for Xicon/Submission data</li>
          <li>⬜ Admin authentication using <code>next-auth</code></li>
          <li>⬜ Automatic conversion of approved submissions into Xicon entries</li>
          <li>⬜ Tag management UI for Exicon/Lexicon entries</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">🚀 Quick Links</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>
            <Link href="/exicon" className="text-f3accent hover:underline">Exicon Page</Link>
          </li>
          <li>
            <Link href="/lexicon" className="text-f3accent hover:underline">Lexicon Page</Link>
          </li>
          <li>
            <Link href="/submit" className="text-f3accent hover:underline">Submit a New Xicon</Link>
          </li>
          <li>
            <Link href="/admin/submissions" className="text-f3accent hover:underline">Admin: Review Submissions</Link>
          </li>
          <li>
            <Link href="/admin/xicon" className="text-f3accent hover:underline">Admin: Manage Xicons</Link>
          </li>
        </ul>
      </section>

      <section className="mt-12 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">🧱 Tech Stack</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>
            <a href="https://nextjs.org/" target="_blank" className="text-f3accent hover:underline">Next.js 14</a> – App Router, Server Components, and Actions
          </li>
          <li>
            <a href="https://tailwindcss.com/docs/installation" target="_blank" className="text-f3accent hover:underline">Tailwind CSS v4</a> – Custom utility styling and global theming
          </li>
          <li>
            <a href="https://www.prisma.io/docs" target="_blank" className="text-f3accent hover:underline">Prisma ORM</a> – PostgreSQL schema, models, and type-safe access
          </li>
          <li>
            <a href="https://www.postgresql.org/" target="_blank" className="text-f3accent hover:underline">PostgreSQL</a> – Hosted on GCP, backing data for Xicons and Submissions
          </li>
          <li>
            <a href="https://fly.io/" target="_blank" className="text-f3accent hover:underline">Fly.io</a> – App hosting platform
          </li>
          <li>
            <a href="https://next-auth.js.org/" target="_blank" className="text-f3accent hover:underline">NextAuth.js</a> – (Planned) Authentication and Admin controls
          </li>
        </ul>
      </section>
    </main>
  );
}
