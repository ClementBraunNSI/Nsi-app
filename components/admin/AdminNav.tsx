"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Élèves" },
  { href: "/admin/activite", label: "Activité" },
  { href: "/admin/messages", label: "Messagerie" },
  { href: "/admin/devoirs", label: "Devoirs" },
];

export function AdminNav() {
  const path = usePathname();

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Administration">
      {LINKS.map((link) => {
        const active = link.href === "/admin" ? path === "/admin" : path.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              active
                ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
