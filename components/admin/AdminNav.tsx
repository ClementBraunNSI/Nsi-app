"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Handshake, MessageSquare, PenLine, Users } from "lucide-react";
import { getAdminNavCounts } from "@/app/actions/adminToday";
import { isAbortError } from "@/lib/is-abort-error";

export type AdminNavCounts = { corrections: number; messages: number; bugs: number; grades?: number; live?: boolean };

type Icon = ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
type Section = {
  id: "classes" | "todo" | "plan" | "messages" | "parents";
  path: string;
  label: string;
  hint: string;
  icon: Icon;
  /** Autres pages qui allument cette entrée (fiche d'un élève, page d'une évaluation…). */
  owns: string[];
};

/** Cinq entrées, une par usage. Les autres pages de l'admin restent dans « Autres pages », sous le menu. */
export const ADMIN_SECTIONS: Section[] = [
  { id: "classes", path: "/classes", label: "Classes", hint: "moyennes et classement", icon: Users, owns: ["/eleves"] },
  { id: "todo", path: "/a-corriger", label: "À corriger", hint: "notes à valider", icon: PenLine, owns: [] },
  { id: "plan", path: "/preparer", label: "Préparer", hint: "évaluations et défis", icon: CalendarDays, owns: ["/evaluations", "/defis"] },
  { id: "messages", path: "/messages", label: "Messagerie", hint: "messages des élèves", icon: MessageSquare, owns: [] },
  { id: "parents", path: "/parents", label: "Réunion parents", hint: "bilan de chaque élève", icon: Handshake, owns: [] },
];

/** Pages hors des cinq entrées : toujours à un clic, sans encombrer le menu. */
export const ADMIN_MORE: { path: string; label: string; count?: keyof AdminNavCounts }[] = [
  { path: "/classe", label: "En classe (suivi en direct)", count: "live" },
  { path: "/eleves", label: "Élèves et comptes" },
  { path: "/evaluations", label: "Toutes les évaluations" },
  { path: "/defis", label: "Tous les défis" },
  { path: "/annonces", label: "Annonces" },
  { path: "/devoirs", label: "Devoirs et dates" },
  { path: "/corrections", label: "Réponses écrites", count: "corrections" },
  { path: "/bugs", label: "Bugs signalés", count: "bugs" },
  { path: "/activite", label: "Activité" },
  { path: "/code", label: "Codes réussis" },
];

const under = (path: string, href: string) => path === href || path.startsWith(`${href}/`);

/** Entrée du menu à laquelle appartient l'adresse. */
export function adminSectionOf(path: string, base: string) {
  return ADMIN_SECTIONS.find((section) => [section.path, ...section.owns].some((page) => under(path, `${base}${page}`))) ?? null;
}

/**
 * Menu de l'admin : colonne à gauche sur grand écran, ligne qui défile en haut sur tablette.
 * `base` permet de rejouer le menu ailleurs que sous /admin ; `counts` évite l'appel serveur des pastilles.
 */
export function AdminNav({ base = "/admin", counts: fixedCounts }: { base?: string; counts?: AdminNavCounts }) {
  const path = usePathname();
  const [counts, setCounts] = useState<AdminNavCounts>(fixedCounts ?? { corrections: 0, messages: 0, bugs: 0 });

  // Relu à chaque changement de page : une note validée ou un fil ouvert fait baisser la pastille.
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
  const badge: Partial<Record<Section["id"], number>> = { todo: counts.grades ?? 0, messages: counts.messages };

  return (
    <nav className="admin-nav" aria-label="Administration">
      {ADMIN_SECTIONS.map((section) => {
        const active = current?.id === section.id;
        const Icon = section.icon;
        const count = badge[section.id] ?? 0;
        return (
          <Link key={section.id} href={`${base}${section.path}`} className={`admin-nav-link${active ? " is-active" : ""}`} aria-current={active ? "page" : undefined}>
            <Icon size={18} aria-hidden />
            <span className="admin-nav-text">
              {section.label}
              <small>{section.hint}</small>
            </span>
            {count > 0 ? (
              <i className="admin-nav-count" aria-label={`${count} en attente`}>
                {count > 99 ? "99+" : count}
              </i>
            ) : null}
          </Link>
        );
      })}

      <details className="admin-nav-more" open={!current || undefined}>
        <summary>Autres pages</summary>
        <ul>
          {ADMIN_MORE.map((page) => {
            const active = under(path, `${base}${page.path}`) && !current;
            const value = page.count ? counts[page.count] : undefined;
            return (
              <li key={page.path}>
                <Link href={`${base}${page.path}`} className={active ? "is-active" : ""} aria-current={active ? "page" : undefined}>
                  {page.label}
                  {value === true ? <i className="admin-nav-live" aria-label="Une évaluation est ouverte" /> : null}
                  {typeof value === "number" && value > 0 ? <i className="admin-nav-mini">{value > 99 ? "99+" : value}</i> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </nav>
  );
}
