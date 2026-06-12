"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
    className: "bg-orange-50 text-orange-600 border-orange-100",
  },
  exercices: {
    label: "Exercices",
    icon: FileText,
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  tp: {
    label: "TP",
    icon: FlaskConical,
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  projet: {
    label: "Projet",
    icon: FolderKanban,
    className: "bg-zinc-100 text-zinc-800 border-zinc-200",
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
      className={`group overflow-hidden rounded-[1.8rem] border transition-all duration-300 ${
        chapter.isPrivate
          ? "border-orange-200 bg-orange-50/70 shadow-[0_16px_34px_-24px_rgba(249,115,22,0.55)]"
          : "border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)] hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(15,23,42,0.5)]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="block h-full w-full text-left"
      >
        <div className="relative h-32 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-3 sm:h-36">
          <div className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-orange-100/60 blur-2xl" />
          <Image
            src={chapterImageFromData(niveaux, chapter.name)}
            alt={`Illustration ${chapter.name}`}
            fill
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
          <span className="absolute right-3 top-3 rounded-full border border-slate-100 bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600">
            {chapter.courses.length} ressource{chapter.courses.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              {chapter.isPrivate ? (
                <Zap size={16} className="shrink-0 text-orange-500" fill="currentColor" />
              ) : (
                <LayoutGrid size={16} className="shrink-0 text-slate-500" />
              )}
              <h2
                className={`truncate font-black text-lg leading-tight ${
                  chapter.isPrivate ? "text-orange-700" : "text-slate-900"
                }`}
              >
                {chapter.name}
              </h2>
            </div>
            <ChevronRight
              size={18}
              className={`shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 ${theme.text}`}
            />
          </div>
          <p className="text-xs text-slate-500">Afficher ce chapitre</p>
        </div>
      </button>
    </article>
  );
}

export default function ChaptersPreviewTabs({ chapters, niveaux, theme }: Props) {
  const [selectedName, setSelectedName] = useState(chapters[0]?.name ?? "");
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");

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
      <div className="pointer-events-none absolute -top-8 -left-6 h-36 w-36 rounded-full bg-orange-200/35 blur-3xl" />
      <div className="pointer-events-none absolute top-24 -right-4 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />

      {/* Chapitre sélectionné — panneau principal */}
      <article
        className={`relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
          selectedChapter.isPrivate
            ? "border-orange-200 bg-orange-50/40 shadow-[0_24px_60px_-32px_rgba(249,115,22,0.35)]"
            : "border-slate-200 bg-white shadow-[0_24px_60px_-36px_rgba(15,23,42,0.35)]"
        }`}
      >
        <div className="relative overflow-hidden border-b border-orange-100/80 bg-gradient-to-br from-slate-50 via-white to-orange-50/30">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(251,146,60,0.14),transparent_42%),radial-gradient(circle_at_100%_20%,rgba(15,23,42,0.06),transparent_30%)]" />

          <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_minmax(220px,320px)] lg:items-center">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                Chapitre sélectionné
              </p>
              <div className="mb-3 flex items-center gap-2">
                {selectedChapter.isPrivate ? (
                  <Zap size={18} className="text-orange-500" fill="currentColor" />
                ) : (
                  <LayoutGrid size={18} className="text-slate-500" />
                )}
                <h2
                  className={`text-3xl font-black tracking-tight sm:text-4xl ${
                    selectedChapter.isPrivate ? "text-orange-900" : "text-slate-950"
                  }`}
                >
                  {selectedChapter.name}
                </h2>
              </div>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
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
                className="object-contain p-2 transition-transform duration-500"
                sizes="(max-width: 1024px) 80vw, 320px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div
            className="mb-5 flex gap-2 overflow-x-auto pb-1"
            aria-label="Filtres des ressources"
          >
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter.key;
              return (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-black transition ${
                    isActive
                      ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-100"
                      : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  }`}
                >
                  {filter.label}
                  <span className={`ml-2 text-xs ${isActive ? "text-orange-100" : "text-slate-400"}`}>
                    {counts[filter.key]}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredResources.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
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
                    className={`group flex items-center justify-between gap-4 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50/45 hover:shadow-[0_18px_40px_-32px_rgba(15,23,42,0.6)] ${
                      course.isPrivate
                        ? "border-orange-200 bg-orange-50/60"
                        : "border-slate-200 bg-white"
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
                          <span className="text-[11px] font-black uppercase tracking-[0.15em] text-orange-500">
                            {meta.label}
                          </span>
                        </div>
                        <h3 className="truncate text-base font-black text-slate-950 transition-colors group-hover:text-orange-700">
                          {course.title}
                        </h3>
                        <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">
                          {course.description || "Ouvrir cette ressource"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500"
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
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Autres chapitres
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-900">
                Choisir un autre thème
              </h3>
            </div>
            <p className="hidden text-sm text-slate-500 sm:block">
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
