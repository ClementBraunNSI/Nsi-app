"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderKanban,
  LayoutGrid,
  Zap,
} from "lucide-react";
import {
  chapterImageFromData,
  getResourceKind,
  type ResourceKind,
} from "@/lib/chapter-utils";

type CourseItem = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  isPrivate?: boolean;
};

type ChapterItem = {
  name: string;
  courses: CourseItem[];
  isPrivate: boolean;
};

type Theme = {
  icon: string;
  border: string;
  text: string;
  light: string;
};

type Props = {
  chapters: ChapterItem[];
  niveaux: string;
  theme: Theme;
};

type FilterKind = "all" | ResourceKind;

const FILTERS: Array<{ key: FilterKind; label: string }> = [
  { key: "all", label: "Tous" },
  { key: "cours", label: "Cours" },
  { key: "exercices", label: "Exercices" },
  { key: "tp", label: "TP" },
  { key: "projet", label: "Projet" },
];

const KIND_META: Record<ResourceKind, { label: string; icon: typeof BookOpen; className: string }> = {
  cours: {
    label: "Cours",
    icon: BookOpen,
    className: "bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--border)]",
  },
  exercices: {
    label: "Exercices",
    icon: FileText,
    className: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  },
  tp: {
    label: "TP",
    icon: FlaskConical,
    className: "bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)]",
  },
  projet: {
    label: "Projet",
    icon: FolderKanban,
    className: "bg-[var(--surface-2)] text-[var(--fg)] border-[var(--border)]",
  },
};

function ChapterThumbnail({
  chapter,
  niveaux,
  theme,
  onSelect,
}: {
  chapter: ChapterItem;
  niveaux: string;
  theme: Theme;
  onSelect: () => void;
}) {
  return (
    <article
      className={`group overflow-hidden rounded-[var(--radius)] border transition-colors duration-150 ${
        chapter.isPrivate
          ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--accent)]"
      }`}
      style={{ boxShadow: "var(--shadow)" }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block h-full w-full text-left"
      >
        <div className="relative h-32 bg-[var(--surface-2)] p-3 sm:h-36">
          <Image
            src={chapterImageFromData(niveaux, chapter.name)}
            alt={`Illustration ${chapter.name}`}
            fill
            className="object-contain p-2"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <span className="absolute right-3 top-3 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--muted)]">
            {chapter.courses.length} ressource{chapter.courses.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {chapter.isPrivate ? (
                <Zap size={16} className="shrink-0 text-[var(--accent)]" fill="currentColor" />
              ) : (
                <LayoutGrid size={16} className="shrink-0 text-[var(--muted)]" />
              )}
              <h2
                className={`truncate font-semibold text-lg leading-tight tracking-tight ${
                  chapter.isPrivate ? "text-[var(--accent)]" : "text-[var(--fg)]"
                }`}
              >
                {chapter.name}
              </h2>
            </div>
            <ChevronRight
              size={18}
              className={`shrink-0 text-[var(--subtle)] transition-transform duration-150 group-hover:translate-x-1 ${theme.text}`}
            />
          </div>
          <p className="text-xs text-[var(--muted)]">Afficher ce chapitre</p>
        </div>
      </button>
    </article>
  );
}

export default function ChaptersPreviewTabs({ chapters, niveaux, theme }: Props) {
  const [selectedName, setSelectedName] = useState(chapters[0]?.name ?? "");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!chapters.some((chapter) => chapter.name === selectedName)) {
      setSelectedName(chapters[0]?.name ?? "");
      setActiveFilter("all");
    }
  }, [chapters, selectedName]);

  const selectedChapter = useMemo(
    () => chapters.find((chapter) => chapter.name === selectedName) ?? chapters[0] ?? null,
    [chapters, selectedName]
  );

  const otherChapters = useMemo(
    () => chapters.filter((chapter) => chapter.name !== selectedChapter?.name),
    [chapters, selectedChapter]
  );

  const resources = useMemo(() => {
    if (!selectedChapter) return [];

    return selectedChapter.courses
      .map((course) => ({
        ...course,
        kind: getResourceKind(course),
      }))
      .sort((a, b) => {
        const order: ResourceKind[] = ["cours", "exercices", "tp", "projet"];
        const kindDiff = order.indexOf(a.kind) - order.indexOf(b.kind);
        return kindDiff || a.title.localeCompare(b.title, "fr");
      });
  }, [selectedChapter]);

  const counts = useMemo(() => {
    return resources.reduce<Record<FilterKind, number>>(
      (acc, course) => {
        acc.all += 1;
        acc[course.kind] += 1;
        return acc;
      },
      { all: 0, cours: 0, exercices: 0, tp: 0, projet: 0 }
    );
  }, [resources]);

  const filteredResources =
    activeFilter === "all" ? resources : resources.filter((course) => course.kind === activeFilter);

  const selectChapter = (chapter: ChapterItem) => {
    setSelectedName(chapter.name);
    setActiveFilter("all");
  };

  if (!selectedChapter) {
    return null;
  }

  return (
    <section className="relative space-y-10 pb-10">
      {/* Chapitre sélectionné — panneau principal */}
      <article
        className={`relative overflow-hidden rounded-[var(--radius)] border transition-colors duration-150 ${
          selectedChapter.isPrivate
            ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
            : "border-[var(--border)] bg-[var(--surface)]"
        }`}
        style={{ boxShadow: "var(--shadow)" }}
      >
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface-2)]">
          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(220px,320px)] lg:items-center">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-[var(--accent)]">
                Chapitre sélectionné
              </p>
              <div className="mb-3 flex items-center gap-2">
                {selectedChapter.isPrivate ? (
                  <Zap size={18} className="text-[var(--accent)]" fill="currentColor" />
                ) : (
                  <LayoutGrid size={18} className="text-[var(--muted)]" />
                )}
                <h2
                  className={`text-3xl font-semibold tracking-tight sm:text-4xl ${
                    selectedChapter.isPrivate ? "text-[var(--accent)]" : "text-[var(--fg)]"
                  }`}
                >
                  {selectedChapter.name}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
                {selectedChapter.courses.length} ressource
                {selectedChapter.courses.length > 1 ? "s" : ""} — cours, exercices, TP et projets de ce
                chapitre.
              </p>
            </div>

            <div className="relative mx-auto h-44 w-full max-w-sm sm:h-52 lg:mx-0 lg:h-56 lg:max-w-none">
              <Image
                src={chapterImageFromData(niveaux, selectedChapter.name)}
                alt={`Illustration ${selectedChapter.name}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 1024px) 80vw, 320px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div
            className="mb-5 flex gap-1 overflow-x-auto pb-1 rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-1 w-fit max-w-full"
            aria-label="Filtres des ressources"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? "text-[var(--fg)]"
                      : "text-[var(--muted)] hover:text-[var(--accent)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={reduceMotion ? undefined : "chapter-filter-pill"}
                      className="absolute inset-0 rounded-full bg-[var(--surface)] border border-[var(--border)]"
                      style={{ boxShadow: "var(--shadow)" }}
                      transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.4 }}
                    />
                  )}
                  <span className="relative z-10">
                    {filter.label}
                    <span className={`ml-2 text-xs ${isActive ? "text-[var(--accent)]" : "text-[var(--subtle)]"}`}>
                      {counts[filter.key]}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {filteredResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 text-center text-sm font-semibold text-[var(--muted)]">
              Aucun contenu dans cette catégorie pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {filteredResources.map((course) => {
                const meta = KIND_META[course.kind];
                const Icon = meta.icon;
                return (
                  <Link
                    key={`${course.href}-${course.kind}`}
                    href={course.href || `/cours/${niveaux}/${course.slug}`}
                    className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-colors duration-150 hover:border-[var(--accent)] ${
                      course.isPrivate
                        ? "border-[var(--accent)]/40 bg-[var(--accent-soft)]"
                        : "border-[var(--border)] bg-[var(--surface)]"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${meta.className}`}
                      >
                        <Icon size={22} />
                      </span>
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-lg leading-none">{course.icon}</span>
                          <span className="text-[11px] font-semibold text-[var(--accent)]">
                            {meta.label}
                          </span>
                        </div>
                        <h3 className="truncate text-base font-semibold text-[var(--fg)] transition-colors duration-150 group-hover:text-[var(--accent)]">
                          {course.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-sm text-[var(--muted)]">
                          {course.description || "Ouvrir cette ressource"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="shrink-0 text-[var(--subtle)] transition-transform duration-150 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                      size={20}
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </article>

      {/* Autres chapitres — cartes compactes */}
      {otherChapters.length > 0 ? (
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[var(--subtle)]">
                Autres chapitres
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[var(--fg)] tracking-tight">
                Choisir un autre thème
              </h3>
            </div>
            <p className="hidden text-sm text-[var(--muted)] sm:block">
              Clique sur une carte pour l&apos;afficher en haut.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {otherChapters.map((chapter) => (
              <ChapterThumbnail
                key={chapter.name}
                chapter={chapter}
                niveaux={niveaux}
                theme={theme}
                onSelect={() => selectChapter(chapter)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
