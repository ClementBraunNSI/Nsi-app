"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, Zap } from 'lucide-react';

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

export default function ChapterTabsView({ chapters, niveaux, theme }: Props) {
  const [activeTab, setActiveTab] = useState(chapters[0]?.name ?? '');
  const activeChapter = chapters.find((c) => c.name === activeTab) ?? chapters[0];

  if (!activeChapter) return null;

  return (
    <>
      <div className="mb-8 overflow-x-auto">
        <div className="inline-flex min-w-full md:min-w-0 gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
          {chapters.map((chapter) => {
            const isActive = chapter.name === activeChapter.name;
            return (
              <button
                key={chapter.name}
                type="button"
                onClick={() => setActiveTab(chapter.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                  isActive
                    ? chapter.isPrivate
                      ? 'bg-[var(--accent)] text-[var(--accent-fg)] shadow-[var(--shadow)]'
                      : 'bg-[var(--fg)] text-[var(--bg)] shadow-[var(--shadow)]'
                    : 'text-[var(--muted)] hover:bg-[var(--surface-2)]'
                }`}
              >
                {chapter.name}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          {activeChapter.isPrivate ? (
            <Zap className="text-[var(--accent)]" size={20} fill="currentColor" />
          ) : (
            <LayoutGrid className={`${theme.icon}`} size={20} />
          )}
          <h2 className={`text-2xl font-semibold tracking-tight ${activeChapter.isPrivate ? 'text-[var(--accent)]' : 'text-[var(--fg)]'}`}>
            {activeChapter.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeChapter.courses.map((cours) => (
            <Link
              key={cours.slug}
              href={cours.href || `/cours/${niveaux}/${cours.slug}`}
              className={`group flex items-center justify-between p-6 rounded-[var(--radius)] border border-[var(--border)] shadow-[var(--shadow)] transition-colors duration-150 hover:border-[var(--accent)] ${
                cours.isPrivate
                  ? 'bg-[var(--accent-soft)]'
                  : `bg-[var(--surface)] ${theme.border}`
              }`}
            >
              <div className="flex items-start gap-5 min-w-0">
                <span className={`text-4xl ${cours.isPrivate ? 'text-[var(--accent)]' : ''}`}>
                  {cours.icon}
                </span>
                <div className="min-w-0">
                  <h3 className={`font-semibold tracking-tight text-lg transition-colors duration-150 truncate ${
                    cours.isPrivate
                      ? 'text-[var(--fg)] group-hover:text-[var(--accent)]'
                      : `text-[var(--fg)] ${theme.text}`
                  }`}>
                    {cours.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-1 line-clamp-1 group-hover:line-clamp-none">
                    {cours.description}
                  </p>
                  <p className="text-xs text-[var(--subtle)] mt-2 opacity-0 max-h-0 overflow-hidden transition-opacity duration-150 group-hover:opacity-100 group-hover:max-h-10">
                    Clique pour ouvrir le cours et commencer.
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-150 shrink-0 ${
                cours.isPrivate
                  ? 'bg-[var(--accent-soft)] text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]'
                  : 'bg-[var(--surface-2)] text-[var(--subtle)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]'
              }`}>
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
