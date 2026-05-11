"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronRight, LayoutGrid, Zap } from "lucide-react";

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

export default function ChaptersPreviewTabs({ chapters, niveaux, theme }: Props) {
  const [activeChapter, setActiveChapter] = useState<string>("");

  return (
    <section className="relative">
      <div className="pointer-events-none absolute -top-8 -left-6 h-36 w-36 rounded-full bg-orange-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -top-4 -right-4 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-10">
        {chapters.map((chapter) => {
          const isOpen = chapter.name === activeChapter;
          return (
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
                onClick={() =>
                  setActiveChapter((prev) => (prev === chapter.name ? "" : chapter.name))
                }
                className="w-full text-left"
                aria-expanded={isOpen}
              >
                <div className="relative h-36 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 p-3">
                  <div className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-orange-100/60 blur-2xl" />
                  <Image
                src={chapterImageFromData(niveaux, chapter.name)}
                    alt={`Illustration ${chapter.name}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-slate-600 border border-slate-100">
                    {chapter.courses.length} cours
                  </span>
                </div>

                <div className="p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {chapter.isPrivate ? (
                        <Zap size={16} className="text-orange-500" fill="currentColor" />
                      ) : (
                        <LayoutGrid size={16} className="text-slate-500" />
                      )}
                      <h2 className={`font-black text-lg leading-tight ${chapter.isPrivate ? "text-orange-700" : "text-slate-900"}`}>
                        {chapter.name}
                      </h2>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
                    />
                  </div>
                  <p className="text-xs text-slate-500">{isOpen ? "Cours affiches" : "Cliquer pour afficher les cours"}</p>
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1200px] opacity-100 pb-4 px-4" : "max-h-0 opacity-0"}`}>
                <div className="space-y-2">
                  {chapter.courses.map((cours) => (
                    <Link
                      key={cours.slug}
                      href={cours.href || `/cours/${niveaux}/${cours.slug}`}
                      className={`group/item flex items-center justify-between rounded-xl border p-3 transition ${
                        cours.isPrivate
                          ? "border-orange-200 bg-white hover:border-orange-400"
                          : `border-slate-200 bg-slate-50 ${theme.border}`
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cours.icon}</span>
                          <p className={`truncate text-sm font-bold ${cours.isPrivate ? "text-slate-900" : `text-slate-900 ${theme.text}`}`}>
                            {cours.title}
                          </p>
                        </div>
                        <p className="truncate text-xs text-slate-500">{cours.description}</p>
                      </div>
                      <ChevronRight className="shrink-0 text-slate-400 transition-transform group-hover/item:translate-x-0.5" size={17} />
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function levelFoxFromNiveau(niveaux: string): string {
  const normalized = niveaux.trim();
  if (["0", "1", "2", "3", "4"].includes(normalized)) {
    return `/images/fox_${normalized}.png`;
  }
  return "/images/fox_2.png";
}

function chapterImageFromData(niveaux: string, chapterName: string): string {
  const normalizedLevel = niveaux.trim();
  const key = normalizeChapterName(chapterName);
  const chapterMapLevel1: Record<string, string> = {
    "photographie numerique": "/images/chapitres/1/chap_photo.png",
    internet: "/images/chapitres/1/chap_internet.png",
    localisation: "/images/chapitres/1/chap_geoloc.png",
    web: "/images/chapitres/1/chap_web.png",
    "reseaux sociaux": "/images/chapitres/1/chap_rsx_sociaux.png",
    "reseaux social": "/images/chapitres/1/chap_rsx_sociaux.png",
    "programmation python": "/images/chapitres/1/chap_python.png",
    "donnees structurees": "/images/chapitres/1/chap_donnees.png",
    "micro-controleurs": "/images/chapitres/1/chap_microcontrol.png",
    microcontroleurs: "/images/chapitres/1/chap_microcontrol.png",
  };

  const chapterMapLevel2: Record<string, string> = {
    "systemes d'exploitation": "/images/chapitres/2/chap_sys.png",
    "systemes d exploitation": "/images/chapitres/2/chap_sys.png",
    "systemes exploitation": "/images/chapitres/2/chap_sys.png",
    "architecture materielle": "/images/chapitres/2/chap_archi.png",
    "dictionnaires et tables": "/images/chapitres/2/chap_dictio.png",
    "reseaux et internet": "/images/chapitres/2/chap_res.png",
    "web et interaction": "/images/chapitres/2/chap_web.png",
    web: "/images/chapitres/2/chap_web.png",
  };

  if (normalizedLevel === "1") {
    return chapterMapLevel1[key] ?? levelFoxFromNiveau(niveaux);
  }
  if (normalizedLevel === "2") {
    return chapterMapLevel2[key] ?? levelFoxFromNiveau(niveaux);
  }

  return levelFoxFromNiveau(niveaux);
}

function normalizeChapterName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
