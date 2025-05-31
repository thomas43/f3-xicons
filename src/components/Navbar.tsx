// src/components/Navbar.tsx
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/exicon", label: "Exicon" },
  { href: "/lexicon", label: "Lexicon" },
  { href: "/submit", label: "Submit" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/xicon", label: "Admin/Xicon" },
  { href: "/admin/submissions", label: "Admin/Submissions" },
];

export function Navbar() {
  return (
    <nav className="w-full bg-gray-100 border-b border-gray-300 p-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-4 text-sm font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-800 hover:text-[color:var(--color-f3accent)] transition"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
