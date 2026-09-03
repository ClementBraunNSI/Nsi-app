"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

type ColleagueTag = "SNT" | "Première" | "Terminale" | "Outils" | "Bac";

type Colleague = {
  name: string;
  site: string;
  phrase: string;
  tags: ColleagueTag[];
};

const COLLEAGUES: Colleague[] = [
  {
    name: "Lucas Relmy",
    site: "http://lucasrelmynsi.gitlab.io/site_cours/",
    phrase: "Explorez l'informatique avec clarté et structure grâce aux cours organisés de Lucas Relmy.",
    tags: ["Première", "Terminale"],
  },
  {
    name: "Erwan Demerville",
    site: "https://nsi.erwandemerville.fr/",
    phrase: "Maîtrisez la NSI avec des ressources complètes et interactives pour Première et Terminale.",
    tags: ["Première", "Terminale", "Bac"],
  },
  {
    name: "Stéphane Ramstein",
    site: "https://stephane_ramstein.gitlab.io/nsi/",
    phrase: "Le portail complet pour la NSI : cours, outils, orientation et concours.",
    tags: ["Première", "Terminale", "Outils", "Bac"],
  },
  {
    name: "Mathieu Marchand",
    site: "https://mmarchand-nsi.github.io/",
    phrase: "Explorez l'informatique scientifique avec des projets concrets et des outils professionnels.",
    tags: ["Première", "Terminale", "Outils"],
  },
  {
    name: "Nicolas Leal",
    site: "http://www.prof-leal.fr/",
    phrase: "Découvrez le numérique avec curiosité et rigueur pour SNT et NSI.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Théo Quertier",
    site: "https://ge0rgi0.github.io/TAQ/",
    phrase: "TAQ : votre guide structuré pour maîtriser NSI et SNT étape par étape.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Mathieu Cardoso",
    site: "https://profcardoso.github.io/",
    phrase: "Cours NSI-SNT complets avec ressources pratiques et club informatique.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Nicolas Mathieu",
    site: "https://nsi.rocks/nsi",
    phrase: "Une mine d'or de ressources NSI : cours, exercices et projets pour progresser solide comme un roc.",
    tags: ["Première", "Terminale"],
  },
  {
    name: "Timothé Vanoverberghe",
    site: "https://vanoverberghe.github.io/prof/NSI_Tale/index_Tale/",
    phrase: "Cours, TP et entraînements de Terminale NSI, avec des sujets d'épreuve pratique corrigés.",
    tags: ["Terminale", "Bac"],
  },
];

const FILTERS: Array<{ key: "all" | ColleagueTag; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "SNT", label: "SNT" },
  { key: "Première", label: "Première" },
  { key: "Terminale", label: "Terminale" },
  { key: "Outils", label: "Outils" },
  { key: "Bac", label: "Bac" },
];

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ColleagueSites() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const visible = useMemo(
    () => (filter === "all" ? COLLEAGUES : COLLEAGUES.filter((c) => c.tags.includes(filter))),
    [filter]
  );

  return (
    <section className="border-t border-[var(--border)] py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[var(--fg)] mb-3 tracking-tight">
            Sites de collègues
          </h2>
          <p className="text-[var(--muted)] font-medium leading-relaxed">
            D&apos;autres cours, exercices et outils NSI, proposés par des enseignants partout en France.
            Utile aux élèves — et aux collègues qui cherchent des ressources à mutualiser.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" aria-label="Filtrer les sites de collègues">
          {FILTERS.map((item) => {
            const active = filter === item.key;
            const count = item.key === "all" ? COLLEAGUES.length : COLLEAGUES.filter((c) => c.tags.includes(item.key)).length;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {item.label}
                <span className={`ml-2 text-xs ${active ? "text-[var(--accent-fg)]/80" : "text-[var(--subtle)]"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {visible.map((colleague) => (
            <article
              key={colleague.site}
              className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--border)] hover:border-[var(--accent)] transition-colors flex flex-col"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <h3 className="font-semibold text-[var(--fg)] text-lg leading-tight tracking-tight">
                {colleague.name}
              </h3>
              <p className="mt-1 text-xs font-medium text-[var(--accent)] break-all">
                {hostnameOf(colleague.site)}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {colleague.tags.map((tag) => (
                  <span
                    key={`${colleague.name}-${tag}`}
                    className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-[var(--muted)] text-sm leading-relaxed flex-1">
                {colleague.phrase}
              </p>
              <a
                href={colleague.site}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-[var(--accent-fg)] rounded-xl font-semibold hover:opacity-90 transition-opacity text-sm"
              >
                Visiter le site <ExternalLink size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
