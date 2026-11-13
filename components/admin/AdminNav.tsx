"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, PenLine, Radio, Users } from "lucide-react";
import { getAdminNavCounts } from "@/app/actions/adminToday";
import { isAbortError } from "@/lib/is-abort-error";

export type AdminNavCounts = { corrections: number; messages: number; bugs: number; grades?: number; live?: boolean };

type Icon = ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
type Section = {
  id: "today" | "live" | "todo" | "students" | "plan";
  path: string;
  label: string;
  hint: string;
  icon: Icon;
  /** Pages rangées dans cette entrée : elles l'allument et forment ses onglets. */
  tabs: { path: string; label: string }[];
};

/** Cinq entrées, rangées par moment de la journée. Les anciennes pages deviennent des onglets de leur entrée. */
export const ADMIN_SECTIONS: Section[] = [
  { id: "today", path: "", label: "Aujourd'hui", hint: "ce qui attend", icon: House, tabs: [] },
  { id: "live", path: "/classe", label: "En classe", hint: "suivi en direct", icon: Radio, tabs: [] },
  {
    id: "todo",
    path: "/a-corriger",
    label: "À corriger",
    hint: "une seule file",
    icon: PenLine,
    tabs: [
      { path: "/a-corriger", label: "File" },
      { path: "/corrections", label: "Réponses écrites" },
      { path: "/messages", label: "Messagerie" },
      { path: "/bugs", label: "Bugs signalés" },
    ],
  },
  {
    id: "students",
    path: "/eleves",
    label: "Élèves",
    hint: "une fiche par élève",
    icon: Users,
    tabs: [
      { path: "/eleves", label: "Liste" },
      { path: "/activite", label: "Activité" },
      { path: "/code", label: "Codes réussis" },
    ],
  },
  {
    id: "plan",
    path: "/preparer",
    label: "Préparer",
    hint: "annonces, devoirs, défis, évaluations",
    icon: CalendarDays,
    tabs: [
      { path: "/preparer", label: "Semaine" },
      { path: "/annonces", label: "Annonces" },
      { path: "/devoirs", label: "Devoirs et dates" },
      { path: "/defis", label: "Défis" },
      { path: "/evaluations", label: "Évaluations" },
    ],
  },
];

const under = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** Entrée du menu à laquelle appartient l'adresse. */
export function adminSectionOf(path: string, base: string) {
  if (path === base) return ADMIN_SECTIONS[0];
  return ADMIN_SECTIONS.find((section) => section.path && (under(path, `${base}${section.path}`) || section.tabs.some((tab) => under(path, `${base}${tab.path}`)))) ?? null;
}

/**
 * Menu de l'admin : colonne à gauche sur grand écran, ligne qui défile en haut sur tablette.
 * `base` permet de rejouer le menu ailleurs que sous /admin ; `counts` évite l'appel serveur des pastilles.
 */
export function AdminNav({ base = "/admin", counts: fixedCounts }: { base?: string; counts?: AdminNavCounts }) {
  const path = usePathname();
  const [counts, setCounts] = useState<AdminNavCounts>(fixedCounts ?? { corrections: 0, messages: 0, bugs: 0 });

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

  const current = adminSectionOf(path, base);
  const todo = counts.corrections + counts.messages + counts.bugs + (counts.grades ?? 0);

  return (
    <nav className="admin-nav" aria-label="Administration">
      {ADMIN_SECTIONS.map((section) => {
        const active = current?.id === section.id;
        const Icon = section.icon;
        return (
          <Link key={section.id} href={`${base}${section.path}`} className={`admin-nav-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={18} aria-hidden />
            <span className="admin-nav-text">
              {section.label}
              <small>{section.hint}</small>
            </span>
            {section.id === "todo" && todo > 0 ? (
              <i className="admin-nav-count" aria-label={`${todo} en attente`}>
                {todo > 99 ? "99+" : todo}
              </i>
            ) : null}
            {section.id === "live" && counts.live ? <i className="admin-nav-live" aria-label="Une évaluation est ouverte" /> : null}
          </Link>
        );
      })}
    </nav>
  );
}

/** Onglets de l'entrée en cours (Liste, Activité, Codes réussis…), au-dessus de la page. */
export function AdminSubnav({ base = "/admin" }: { base?: string }) {
  const path = usePathname();
  const section = adminSectionOf(path, base);
  if (!section || section.tabs.length === 0) return null;
  return (
    <nav className="admin-tabs" aria-label={section.label}>
      {section.tabs.map((tab) => {
        const active = under(path, `${base}${tab.path}`);
        return (
          <Link key={tab.path} href={`${base}${tab.path}`} className={active ? "is-on" : ""} aria-current={active ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
