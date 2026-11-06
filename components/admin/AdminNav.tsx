"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  CalendarDays,
  ClipboardCheck,
  Code2,
  House,
  Megaphone,
  MessageSquare,
  PenLine,
  Trophy,
  Users,
} from "lucide-react";
import { getAdminNavCounts } from "@/app/actions/adminToday";
import { isAbortError } from "@/lib/is-abort-error";

export type AdminNavCounts = { corrections: number; messages: number };

type NavLink = { path: string; label: string; icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>; count?: keyof AdminNavCounts };

const GROUPS: { title: string | null; links: NavLink[] }[] = [
  { title: null, links: [{ path: "", label: "Aujourd'hui", icon: House }] },
  {
    title: "Élèves",
    links: [
      { path: "/eleves", label: "Liste des élèves", icon: Users },
      { path: "/activite", label: "Activité", icon: Activity },
      { path: "/messages", label: "Messagerie", icon: MessageSquare, count: "messages" },
    ],
  },
  {
    title: "Classe",
    links: [
      { path: "/annonces", label: "Annonces", icon: Megaphone },
      { path: "/devoirs", label: "Devoirs et dates", icon: CalendarDays },
    ],
  },
  {
    title: "Évaluer",
    links: [
      { path: "/corrections", label: "Corrections", icon: PenLine, count: "corrections" },
      { path: "/code", label: "Codes réussis", icon: Code2 },
      { path: "/evaluations", label: "Évaluations", icon: ClipboardCheck },
      { path: "/defis", label: "Défis", icon: Trophy },
    ],
  },
];

/**
 * Menu de l'admin, groupé par usage. Colonne à gauche sur grand écran, ligne qui défile en haut sur tablette.
 * `base` permet de rejouer le menu ailleurs que sous /admin ; `counts` évite l'appel serveur des pastilles.
 */
export function AdminNav({ base = "/admin", counts: fixedCounts }: { base?: string; counts?: AdminNavCounts }) {
  const path = usePathname();
  const [counts, setCounts] = useState<AdminNavCounts>(fixedCounts ?? { corrections: 0, messages: 0 });

  // Relu à chaque changement de page : une correction faite ou un fil ouvert fait baisser la pastille.
  useEffect(() => {
    if (fixedCounts) return;
    let alive = true;
    getAdminNavCounts()
      .then((next) => {
        if (alive) setCounts(next);
      })
      .catch((error) => {
        if (!isAbortError(error)) console.error(error);
      });
    return () => {
      alive = false;
    };
  }, [path, fixedCounts]);

  return (
    <nav className="admin-nav" aria-label="Administration">
      {GROUPS.map((group) => (
        <div key={group.title ?? "accueil"} className="admin-nav-group">
          {group.title ? <span className="admin-nav-title">{group.title}</span> : null}
          {group.links.map((link) => {
            const href = `${base}${link.path}`;
            const active = link.path === "" ? path === base : path === href || path.startsWith(`${href}/`);
            const count = link.count ? counts[link.count] : 0;
            const Icon = link.icon;
            return (
              <Link key={link.path} href={href} className={`admin-nav-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
                <Icon size={18} aria-hidden />
                <span>{link.label}</span>
                {count > 0 ? (
                  <i className="admin-nav-count" aria-label={`${count} en attente`}>
                    {count > 99 ? "99+" : count}
                  </i>
                ) : null}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
