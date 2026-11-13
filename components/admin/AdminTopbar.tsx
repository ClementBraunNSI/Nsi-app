"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Code2, Plus, Search, Trophy, User, X } from "lucide-react";
import { getAdminSearchIndex, type AdminSearchItem } from "@/app/actions/adminToday";
import { useAdminClass } from "@/components/admin/AdminClassContext";
import { foldText } from "@/lib/revisions";

const CREATE = [
  { label: "Annonce", path: "/annonces#nouvelle" },
  { label: "Devoir de classe", path: "/devoirs#devoirs-classe" },
  { label: "Interro ou DS", path: "/devoirs#interros" },
  { label: "Défi", path: "/defis?nouveau=1" },
  { label: "Évaluation", path: "/evaluations?nouveau=1" },
  { label: "Élève", path: "/eleves?nouveau=1" },
  { label: "Élèves en lot", path: "/eleves?lot=1" },
];

const PAGES: AdminSearchItem[] = [
  { kind: "evaluation", id: "p-classe", label: "En classe", hint: "Suivi en direct", href: "/admin/classe" },
  { kind: "evaluation", id: "p-file", label: "À corriger", hint: "File de corrections", href: "/admin/a-corriger" },
  { kind: "eleve", id: "p-eleves", label: "Liste des élèves", hint: "Élèves", href: "/admin/eleves" },
  { kind: "eleve", id: "p-activite", label: "Activité", hint: "Élèves", href: "/admin/activite" },
  { kind: "exercice", id: "p-code", label: "Codes réussis", hint: "Élèves", href: "/admin/code" },
  { kind: "evaluation", id: "p-semaine", label: "Préparer la semaine", hint: "Préparer", href: "/admin/preparer" },
  { kind: "evaluation", id: "p-annonces", label: "Annonces", hint: "Préparer", href: "/admin/annonces" },
  { kind: "evaluation", id: "p-devoirs", label: "Devoirs et dates", hint: "Préparer", href: "/admin/devoirs" },
  { kind: "defi", id: "p-defis", label: "Défis", hint: "Préparer", href: "/admin/defis" },
  { kind: "evaluation", id: "p-evals", label: "Évaluations", hint: "Préparer", href: "/admin/evaluations" },
  { kind: "evaluation", id: "p-messages", label: "Messagerie", hint: "À corriger", href: "/admin/messages" },
  { kind: "evaluation", id: "p-bugs", label: "Bugs signalés", hint: "À corriger", href: "/admin/bugs" },
];

const KIND = {
  eleve: { label: "Élève", icon: User },
  evaluation: { label: "Évaluation", icon: ClipboardCheck },
  defi: { label: "Défi", icon: Trophy },
  exercice: { label: "Exercice", icon: Code2 },
} as const;

const MAX_RESULTS = 12;

/** Recherche de l'admin (Ctrl K) : élèves d'abord, puis évaluations, défis, pages et exercices. */
function AdminSearch({ base, onClose }: { base: string; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<AdminSearchItem[] | null>(null);
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
    let alive = true;
    getAdminSearchIndex()
      .then((items) => {
        if (alive) setIndex(items);
      })
      .catch(() => {
        if (alive) setIndex([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const results = useMemo(() => {
    const words = foldText(query).split(" ").filter(Boolean);
    const all = [...(index ?? []), ...PAGES.map((page) => ({ ...page, id: page.id, href: page.href.replace("/admin", base) }))];
    if (words.length === 0) return all.filter((item) => item.id.startsWith("p-")).slice(0, MAX_RESULTS);
    const rank = { eleve: 0, evaluation: 1, defi: 2, exercice: 3 } as const;
    return all
      .map((item) => ({ item, text: foldText(`${item.label} ${item.hint}`) }))
      .filter(({ text }) => words.every((word) => text.includes(word)))
      .sort((a, b) => rank[a.item.kind] - rank[b.item.kind] || a.item.label.localeCompare(b.item.label, "fr", { numeric: true }))
      .slice(0, MAX_RESULTS)
      .map(({ item }) => item);
  }, [query, index, base]);

  const open = (item: AdminSearchItem | undefined) => {
    if (!item) return;
    onClose();
    router.push(item.href.startsWith("/admin") ? item.href.replace("/admin", base) : item.href);
  };

  return (
    <div className="admin-find-back" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="admin-find" role="dialog" aria-modal="true" aria-label="Recherche dans l'admin">
        <label className="admin-find-input">
          <Search size={18} aria-hidden />
          <input
            ref={input}
            value={query}
            placeholder="Chercher un élève, un exercice, une évaluation…"
            aria-label="Recherche"
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setCursor((value) => Math.min(value + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setCursor((value) => Math.max(value - 1, 0));
              } else if (event.key === "Enter") {
                open(results[cursor]);
              } else if (event.key === "Escape") {
                onClose();
              }
            }}
          />
          <button type="button" onClick={onClose} aria-label="Fermer la recherche">
            <X size={16} aria-hidden />
          </button>
        </label>
        <ul className="admin-find-list" role="listbox" aria-label="Résultats">
          {results.map((item, position) => {
            const Icon = KIND[item.kind].icon;
            return (
              <li key={`${item.kind}-${item.id}`} role="option" aria-selected={position === cursor}>
                <button type="button" className={position === cursor ? "is-on" : ""} onMouseEnter={() => setCursor(position)} onClick={() => open(item)}>
                  <Icon size={16} aria-hidden />
                  <span>
                    {item.label}
                    <small>{item.hint}</small>
                  </span>
                  <i>{item.id.startsWith("p-") ? "Page" : KIND[item.kind].label}</i>
                </button>
              </li>
            );
          })}
          {results.length === 0 ? <li className="admin-find-empty">{index === null ? "Chargement en cours" : "Aucun résultat."}</li> : null}
        </ul>
        <p className="admin-find-keys">
          <kbd>↑</kbd> <kbd>↓</kbd> choisir · <kbd>Entrée</kbd> ouvrir · <kbd>Échap</kbd> fermer
        </p>
      </div>
    </div>
  );
}

/** Barre du haut de l'admin : la classe affichée (valable sur toutes les pages), la recherche et le menu « Créer ». */
export function AdminTopbar({ base = "/admin" }: { base?: string }) {
  const { selection, choices, select } = useAdminClass();
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const createRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        // Dans l'admin, Ctrl K ouvre cette recherche et non la palette générale du site (écoutée plus bas, sur le document).
        event.stopPropagation();
        setSearching(true);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  useEffect(() => {
    if (!creating) return;
    const close = (event: MouseEvent) => {
      if (!createRef.current?.contains(event.target as Node)) setCreating(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [creating]);

  return (
    <div className="admin-top">
      {choices.length > 1 ? (
        <div className="admin-top-classes" role="group" aria-label="Classe affichée">
          {choices.map((choice) => (
            <button key={choice.value} type="button" aria-pressed={selection === choice.value} onClick={() => select(choice.value)}>
              {choice.label}
            </button>
          ))}
        </div>
      ) : null}
      <button type="button" className="admin-top-search" onClick={() => setSearching(true)}>
        <Search size={16} aria-hidden />
        <span>Chercher un élève, un exercice, une évaluation…</span>
        <kbd>Ctrl</kbd>
        <kbd>K</kbd>
      </button>
      <div className="admin-top-create" ref={createRef}>
        <button type="button" aria-expanded={creating} aria-haspopup="menu" onClick={() => setCreating(!creating)}>
          <Plus size={16} aria-hidden /> Créer
        </button>
        {creating ? (
          <div role="menu" className="admin-top-menu">
            {CREATE.map((item) => (
              <Link key={item.path} role="menuitem" href={`${base}${item.path}`} onClick={() => setCreating(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      {searching ? <AdminSearch base={base} onClose={() => setSearching(false)} /> : null}
    </div>
  );
}
