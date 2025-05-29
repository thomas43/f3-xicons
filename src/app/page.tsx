// src/app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-f3accent mb-6">F3 Xicons Project Status</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Completed</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Exicon and Lexicon entries displayed with search and tag filtering</li>
          <li>Admin interface for editing and deleting Xicon entries</li>
          <li>Submission page with inline validation and redirect</li>
          <li>Admin submission review with approve/reject support</li>
          <li>Approved submissions are promoted into Xicon entries</li>
          <li>Enum-based filtering by XiconType and SubmissionStatus</li>
          <li>Inline editing in admin Xicon cards with validation and feedback</li>
          <li>Aliased terms display and search highlighting in entries</li>
          <li>Description highlighting matches search terms</li>
          <li>Global styling using Tailwind CSS v4 with F3 accent theming</li>
          <li>Multi-tag filtering with AND/OR logic toggle</li>
          <li>Heroicons replace emoji across cards and status panels</li>
          <li>Global toast system for success/error messages</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">In Progress / TODO</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>CSV export for Xicon and Submission data</li>
          <li>Admin authentication via <code>next-auth</code></li>
          <li>Editable fields on Submission review cards</li>
          <li>Duplicate checking before promoting a submission</li>
          <li>Improved tag management UI and cleanup tooling</li>
          <li>Empty-state visuals for filtered lists (e.g. no results)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Quick Links</h2>
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
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Tech Stack</h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>
            <a href="https://nextjs.org/" target="_blank" className="text-f3accent hover:underline">Next.js 14</a> – App Router, Server Components, Actions
          </li>
          <li>
            <a href="https://tailwindcss.com/docs/installation" target="_blank" className="text-f3accent hover:underline">Tailwind CSS v4</a> – Utility classes and theming
          </li>
          <li>
            <a href="https://www.prisma.io/docs" target="_blank" className="text-f3accent hover:underline">Prisma ORM</a> – Typed PostgreSQL schema + access
          </li>
          <li>
            <a href="https://www.postgresql.org/" target="_blank" className="text-f3accent hover:underline">PostgreSQL</a> – Hosted on GCP
          </li>
          <li>
            <a href="https://fly.io/" target="_blank" className="text-f3accent hover:underline">Fly.io</a> – Hosting platform
          </li>
          <li>
            <a href="https://next-auth.js.org/" target="_blank" className="text-f3accent hover:underline">NextAuth.js</a> – (Planned) Authentication and Admin access
          </li>
        </ul>
      </section>
    </main>
  );
}
