"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ChevronRight,
  FileText,
  FlaskConical,
  FolderKanban,
  X,
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

/** Grille 6 colonnes : alternance large / paire / pleine largeur / triple (style mosaïque). */
const MOSAIC_SPANS = [
  "md:col-span-4",
  "md:col-span-2",
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-6",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
] as const;

/** Nuances d'orange pâle pour la mosaïque. */
const MOSAIC_BACKGROUNDS = [
  "bg-[#FFF7ED]",
  "bg-[#FFEDD5]",
  "bg-[#FEF3E8]",
  "bg-[#FFE8D1]",
  "bg-[#FFF4E8]",
  "bg-[#FDEBD6]",
  "bg-[#FFF0E0]",
  "bg-[#FFE4CC]",
] as const;

function mosaicSpan(index: number): string {
  return MOSAIC_SPANS[index % MOSAIC_SPANS.length];
}

function mosaicBackground(index: number, isPrivate: boolean): string {
  if (isPrivate) return "bg-[#FFE0C2]";
  return MOSAIC_BACKGROUNDS[index % MOSAIC_BACKGROUNDS.length];
}

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

export default function ChaptersPreviewTabs({ chapters, niveaux, theme }: Props) {
  const [activeChapter, setActiveChapter] = useState<ChapterItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKind>("all");

  const resources = useMemo(() => {
    if (!activeChapter) return [];

    return activeChapter.courses
      .map((course) => ({
        ...course,
        kind: getResourceKind(course),
      }))
      .sort((a, b) => {
        const order: ResourceKind[] = ["cours", "exercices", "tp", "projet"];
        const kindDiff = order.indexOf(a.kind) - order.indexOf(b.kind);
        return kindDiff || a.title.localeCompare(b.title, "fr");
      });
  }, [activeChapter]);

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

  const filteredResources = activeFilter === "all"
    ? resources
    : resources.filter((course) => course.kind === activeFilter);

  const openChapter = (chapter: ChapterItem) => {
    setActiveChapter(chapter);
    setActiveFilter("all");
  };

  return (
    <section className="relative">
      <div className="grid grid-cols-6 gap-4 pb-10">
        {chapters.map((chapter, index) => {
          const span = mosaicSpan(index);
          const titleSize =
            span === "md:col-span-6"
              ? "text-2xl sm:text-3xl"
              : span === "md:col-span-4"
                ? "text-xl sm:text-2xl"
                : "text-lg sm:text-xl";
          const imageSize =
            span === "md:col-span-4" || span === "md:col-span-6"
              ? "h-24 w-28 sm:h-32 sm:w-36"
              : "h-20 w-24 sm:h-24 sm:w-28";

          return (
          <article
            key={chapter.name}
            className={`group col-span-6 ${span} overflow-hidden rounded-[1.75rem] border transition-all duration-300 ${
              chapter.isPrivate
                ? "border-orange-200/80 hover:border-orange-300"
                : "border-orange-100/70 hover:border-orange-200"
            } ${mosaicBackground(index, chapter.isPrivate)} hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(249,115,22,0.15)]`}
          >
            <button
              type="button"
              onClick={() => openChapter(chapter)}
              className="flex h-full min-h-[9.5rem] w-full items-stretch justify-between gap-3 p-5 text-left sm:min-h-[10.5rem] sm:gap-4 sm:p-6"
            >
              <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
                <div className="mb-2 flex items-center gap-2">
                  {chapter.isPrivate ? (
                    <Zap size={15} className="shrink-0 text-orange-500" fill="currentColor" />
                  ) : null}
                  <h2
                    className={`font-black leading-[1.1] tracking-tight ${titleSize} ${
                      chapter.isPrivate ? "text-orange-900" : "text-slate-900"
                    }`}
                  >
                    {chapter.name}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {chapter.courses.length} ressource{chapter.courses.length > 1 ? "s" : ""}
                </p>
                <span className={`mt-3 inline-flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors ${theme.text}`}>
                  Ouvrir
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </div>

              <div className={`relative shrink-0 self-center ${imageSize}`}>
                <Image
                  src={chapterImageFromData(niveaux, chapter.name)}
                  alt={`Illustration ${chapter.name}`}
                  fill
                  className="object-contain object-right transition-transform duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 40vw, 20vw"
                />
              </div>
            </button>
          </article>
          );
        })}
      </div>

      {activeChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
          <div className="relative flex h-[90vh] max-h-[760px] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_34px_100px_-42px_rgba(15,23,42,0.8)]">
            <button
              type="button"
              onClick={() => setActiveChapter(null)}
              aria-label="Fermer la bulle"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
            >
              <X size={18} />
            </button>

            <div className="flex h-full min-h-0 flex-col">
              <div className="relative shrink-0 overflow-hidden border-b border-orange-100 bg-white p-5 sm:p-7">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(251,146,60,0.16),transparent_38%),radial-gradient(circle_at_100%_10%,rgba(15,23,42,0.08),transparent_28%)]" />
                <div className="relative grid gap-5 pr-12 lg:grid-cols-[1fr_240px] lg:items-center">
                  <div>
                    <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-orange-500">
                      Contenu du chapitre
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                      {activeChapter.name}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                      Retrouve ici les cours, fiches d'exercices, TP et projets associés à ce chapitre.
                    </p>
                  </div>

                  <div className="relative hidden h-36 rounded-[1.4rem] border border-slate-100 bg-slate-50 lg:block">
                    <Image
                      src={chapterImageFromData(niveaux, activeChapter.name)}
                      alt={`Illustration ${activeChapter.name}`}
                      fill
                      className="object-contain p-3"
                      sizes="240px"
                    />
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6">
                <div className="mb-5 flex shrink-0 gap-2 overflow-x-auto pb-1" aria-label="Filtres des ressources">
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

                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  {filteredResources.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
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
                              course.isPrivate ? "border-orange-200 bg-orange-50/60" : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${meta.className}`}>
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
                            <ChevronRight className="shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" size={20} />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
