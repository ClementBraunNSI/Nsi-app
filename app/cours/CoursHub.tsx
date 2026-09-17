"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, Search } from "lucide-react";
import { Badge, EmptyState, PageHeader } from "@/components/ui";

export type HubCourse = {
  slug: string;
  title: string;
  chapter: string;
  href: string;
};

export type HubLevel = {
  id: string;
  title: string;
  audience: string;
  description: string;
  image: string;
  featured: boolean;
  courseCount: number;
  chapters: { name: string; count: number }[];
  courses: HubCourse[];
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function prettyLabel(value: string) {
  return value.replace(/_/g, " ");
}

function LevelCard({ level }: { level: HubLevel }) {
  const preview = level.chapters.slice(0, 5);

  return (
    <Link
      href={`/cours/${level.id}`}
      className={`group flex flex-col ${level.featured ? "lg:col-span-2" : ""}`}
    >
      <article
        className={`home-card flex h-full flex-col ${level.featured ? "is-featured" : ""}`}
      >
        <div
          className={`relative w-full bg-[var(--surface-2)] p-4 ${
            level.featured ? "h-44 sm:h-52" : "h-36"
          }`}
        >
          <Image
            src={level.image}
            alt=""
            fill
            className="object-contain p-2"
            sizes={level.featured ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 1024px) 50vw, 25vw"}
          />
          <div className="absolute right-4 top-4 flex flex-wrap justify-end gap-2">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
              {level.audience}
            </span>
            {level.featured && (
              <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-semibold text-[var(--accent-fg)]">
                Parcours principal
              </span>
            )}
          </div>
        </div>

        <div className={`flex flex-1 flex-col ${level.featured ? "p-7" : "p-6"}`}>
          <h2
            className={`mb-2 font-semibold tracking-tight text-[var(--fg)] transition-colors group-hover:text-[var(--accent)] ${
              level.featured ? "text-2xl md:text-3xl" : "text-lg"
            }`}
          >
            {level.title}
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-[var(--muted)]">{level.description}</p>

          <div className="mb-5 flex flex-wrap gap-2">
            {preview.map((chapter) => (
              <span
                key={chapter.name}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]"
              >
                {prettyLabel(chapter.name)}
              </span>
            ))}
            {level.chapters.length > preview.length && (
              <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[11px] font-medium text-[var(--subtle)]">
                +{level.chapters.length - preview.length}
              </span>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
            <span className="text-xs font-semibold text-[var(--subtle)]">
              {level.chapters.length} chapitre{level.chapters.length > 1 ? "s" : ""} · {level.courseCount} ressource
              {level.courseCount > 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--fg)]">
              Entrer
              <ChevronRight
                size={18}
                className="text-[var(--subtle)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function CoursHub({ levels }: { levels: HubLevel[] }) {
  const [query, setQuery] = useState("");
  const needle = normalize(query);

  const results = useMemo(() => {
    if (needle.length < 2) return [];
    return levels.flatMap((level) =>
      level.courses
        .filter((course) => {
          const haystack = normalize(`${course.title} ${course.chapter}`);
          return haystack.includes(needle);
        })
        .map((course) => ({ ...course, levelTitle: level.title, levelId: level.id }))
    );
  }, [levels, needle]);

  const searching = needle.length >= 2;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8">
      <PageHeader
        className="mb-10"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <BookOpen size={16} /> Cours
          </span>
        }
        title="Choisis ta classe"
        description="Un parcours par niveau, avec les cours, exercices et TP au même endroit. Tu peux aussi chercher une notion directement."
      />

      <div className="relative mb-10">
        <Search
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--subtle)]"
          size={20}
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Une notion, un chapitre… (ex. listes, HTML, SQL)"
          className="w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] py-4 pl-14 pr-5 text-base font-medium text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--subtle)] focus:border-[var(--accent)]"
          aria-label="Rechercher un cours"
        />
      </div>

      {searching ? (
        <section aria-live="polite">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
              Résultats
            </h2>
            <p className="text-sm text-[var(--muted)]">
              {results.length} ressource{results.length > 1 ? "s" : ""}
            </p>
          </div>
          {results.length === 0 ? (
            <EmptyState
              icon={<Search size={28} />}
              title="Aucun cours trouvé"
              description="Essaie un mot plus court, ou ouvre directement ta classe ci-dessous."
              action={
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded-xl bg-[var(--fg)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)]"
                >
                  Voir les niveaux
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {results.map((course) => (
                <Link
                  key={`${course.levelId}-${course.href}`}
                  href={course.href}
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-150 hover:border-[var(--accent)]"
                >
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <Badge>{course.levelTitle}</Badge>
                      <span className="text-xs text-[var(--subtle)]">{course.chapter}</span>
                    </div>
                    <h3 className="truncate font-semibold text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                      {course.title}
                    </h3>
                  </div>
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-[var(--subtle)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                  />
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--accent)]">Parcours</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[var(--fg)]">
                Ouvre le niveau qui correspond à ta classe
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {levels.map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
