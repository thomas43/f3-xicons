// src/app/page.tsx
"use client";

import Link from "next/link";
import {
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  GlobeAltIcon,
} from "@heroicons/react/20/solid";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-3xl font-bold text-f3accent mb-6">F3 Xicons – Exicon & Lexicon</h1>

      <section className="mb-8">
        <p className="text-gray-800 text-sm mb-4">
          This project is a complete rebuild of the F3 Exicon and Lexicon using modern web technologies. It includes features for public browsing, contribution via submissions, and a full admin interface for managing content across both collections.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <ShieldCheckIcon className="w-5 h-5 text-f3accent" />
          About the Developer
        </h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          My name is Mac (Thomas), and I serve as the Commz/Data Q for 
          <a href="https://f3northstar.com" target="_blank" className="text-f3accent hover:underline ml-1">F3 North Star</a>, 
          where I built and maintain our region's website.
        </p>
        <p className="text-sm text-gray-800 mt-2 leading-relaxed">
          I'm a software engineer by trade, but I rarely venture into web development. My previous experiences include Express.js, Vue.js, and standard HTML/CSS, so building this app was both a challenge and a blast!
        </p>
        <p className="text-sm text-gray-800 mt-2 leading-relaxed">
          This is my submission for the F3 Hackathon. I hope you like it - and more importantly, I hope it becomes a valuable tool for the greater F3 Nation.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <GlobeAltIcon className="w-5 h-5 text-f3accent" />
          Public Features
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Entries with names, descriptions, aliases, and references</li>
          <li>Search across name, description, and aliases with match highlighting</li>
          <li>Tag filtering (Exicon only) with toggle for AND / OR logic</li>
          <li><code>@mention</code> auto-linking to referenced entries</li>
          <li>Embedded YouTube video support</li>
          <li>Responsive UI for mobile and desktop</li>
          <li>Empty-state visuals for unmatched searches</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <UserPlusIcon className="w-5 h-5 text-f3accent" />
          Submission Features
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Unauthenticated users can submit new Xicons</li>
          <li>Inline validation with success/error feedback</li>
          <li>Supports aliases, tags, and <code>@mention</code> references</li>
          <li>Admin review queue for approval workflow</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-5 h-5 text-f3accent" />
          Admin Features
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Dashboard for Exicon and Lexicon content</li>
          <li>Inline editing with real-time feedback</li>
          <li>Full control over aliases, tags, videos, and descriptions</li>
          <li>Delete entries with confirmation</li>
          <li>Review, edit, approve, or reject submissions</li>
          <li>Duplicate detection before promoting submissions</li>
          <li>CSV export (all or filtered)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CheckCircleIcon className="w-5 h-5 text-f3accent" />
          Judging Criteria Alignment
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li><strong>Look</strong>: Tailwind 4 theme with <a href="https://f3nation.com" target="_blank" className="text-f3accent hover:underline ml-1">f3nation</a>-ish accents/colors as well as <a href="https://heroicons.com" target="_blank" className="text-f3accent hover:underline ml-1">Heroicons</a></li>
          <li><strong>Usability</strong>: Responsive design, intuitive interactions, helpful feedback</li>
          <li><strong>Maintainability</strong>: Built with Next.js, Prisma, and modular components for long-term upkeep</li>
          <li>
            <strong>Cost of Ownership</strong>: Hosted on <a href="https://fly.io" target="_blank" className="text-f3accent hover:underline">Fly.io</a> for pennies/month.
            The app includes a <code>Dockerfile</code> and could easily be deployed to a GCP VM. Database is already running on <strong>GCP Cloud SQL (PostgreSQL)</strong>.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <ClipboardDocumentListIcon className="w-5 h-5 text-f3accent" />
          In Progress / TODO
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>Admin authentication via <code>next-auth</code></li>
          <li>Final CSS cleanup and visual polish</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <ArrowTopRightOnSquareIcon className="w-5 h-5 text-f3accent" />
          Quick Links
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li><Link href="/exicon" className="text-f3accent hover:underline">Exicon Page</Link></li>
          <li><Link href="/lexicon" className="text-f3accent hover:underline">Lexicon Page</Link></li>
          <li><Link href="/submit" className="text-f3accent hover:underline">Submit a New Xicon</Link></li>
          <li><Link href="/admin/submissions" className="text-f3accent hover:underline">Admin: Review Submissions</Link></li>
          <li><Link href="/admin/xicon" className="text-f3accent hover:underline">Admin: Manage Xicons</Link></li>
        </ul>
      </section>

      <section className="mt-12 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <CpuChipIcon className="w-5 h-5 text-f3accent" />
          Tech Stack
        </h2>
        <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
          <li>
            <a href="https://nextjs.org/" target="_blank" className="text-f3accent hover:underline">Next.js 14</a> - App Router, server components, API routes
          </li>
          <li>
            <a href="https://tailwindcss.com/" target="_blank" className="text-f3accent hover:underline">Tailwind CSS v4</a> - Modern utility-first CSS framework
          </li>
          <li>
            <a href="https://www.prisma.io/" target="_blank" className="text-f3accent hover:underline">Prisma ORM</a> - Typed PostgreSQL access and migrations
          </li>
          <li>
            <a href="https://www.postgresql.org/" target="_blank" className="text-f3accent hover:underline">PostgreSQL</a> - GCP-hosted database
          </li>
          <li>
            <a href="https://fly.io/" target="_blank" className="text-f3accent hover:underline">Fly.io</a> - Lightweight app hosting platform
          </li>
          <li>
            <a href="https://next-auth.js.org/" target="_blank" className="text-f3accent hover:underline">NextAuth.js</a> - (Planned) authentication for admin access
          </li>
        </ul>
      </section>
    </main>
  );
}
