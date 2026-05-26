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
  LayoutGrid,
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
      <div className="pointer-events-none absolute -top-8 -left-6 h-36 w-36 rounded-full bg-orange-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -top-4 -right-4 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
        {chapters.map((chapter) => (
          <article
            key={chapter.name}
            className={`group rounded-[1.8rem] border overflow-hidden transition-all duration-300 ${
              chapter.isPrivate
                ? "border-orange-200 bg-orange-50/70 shadow-[0_16px_34px_-24px_rgba(249,115,22,0.55)]"
                : "border-slate-200 bg-white shadow-[0_14px_30px_-24px_rgba(15,23,42,0.45)] hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(15,23,42,0.5)]"
            }`}
          >
            <button
              type="button"
              onClick={() => openChapter(chapter)}
              className="block h-full w-full text-left"
            >
              <div className="relative h-36 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-3">
                <div className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-orange-100/60 blur-2xl" />
                <Image
                  src={chapterImageFromData(niveaux, chapter.name)}
                  alt={`Illustration ${chapter.name}`}
                  fill
                  className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600 border border-slate-100">
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
                    <h2 className={`truncate font-black text-lg leading-tight ${chapter.isPrivate ? "text-orange-700" : "text-slate-900"}`}>
                      {chapter.name}
                    </h2>
                  </div>
                  <ChevronRight
                    size={18}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 ${theme.text}`}
                  />
                </div>
                <p className="text-xs text-slate-500">Ouvrir le chapitre et ses ressources</p>
              </div>
            </button>
          </article>
        ))}
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
