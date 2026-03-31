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
        <div className="inline-flex min-w-full md:min-w-0 gap-2 rounded-2xl border border-slate-200 bg-white p-2">
          {chapters.map((chapter) => {
            const isActive = chapter.name === activeChapter.name;
            return (
              <button
                key={chapter.name}
                type="button"
                onClick={() => setActiveTab(chapter.name)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? chapter.isPrivate
                      ? 'bg-orange-500 text-white shadow'
                      : 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
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
            <Zap className="text-orange-500" size={20} fill="currentColor" />
          ) : (
            <LayoutGrid className={`${theme.icon}`} size={20} />
          )}
          <h2 className={`text-2xl font-bold ${activeChapter.isPrivate ? 'text-orange-600' : 'text-gray-800'}`}>
            {activeChapter.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeChapter.courses.map((cours) => (
            <Link
              key={cours.slug}
              href={cours.href || `/cours/${niveaux}/${cours.slug}`}
              className={`group flex items-center justify-between p-6 rounded-3xl transition-all duration-300 ${
                cours.isPrivate
                  ? 'bg-orange-50 border border-orange-200 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1'
                  : `bg-white border border-gray-100 ${theme.border} hover:shadow-xl hover:-translate-y-1`
              }`}
            >
              <div className="flex items-start gap-5 min-w-0">
                <span className={`text-4xl transition-transform duration-300 ${cours.isPrivate ? 'text-orange-500' : ''} group-hover:scale-110 group-hover:-rotate-3`}>
                  {cours.icon}
                </span>
                <div className="min-w-0">
                  <h3 className={`font-bold text-lg transition-colors truncate ${
                    cours.isPrivate
                      ? 'text-gray-900 group-hover:text-orange-600'
                      : `text-gray-900 ${theme.text}`
                  }`}>
                    {cours.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                    {cours.description}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 opacity-0 max-h-0 overflow-hidden transition-all duration-300 group-hover:opacity-100 group-hover:max-h-10">
                    Clique pour ouvrir le cours et commencer.
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${
                cours.isPrivate
                  ? 'bg-orange-100 text-orange-400 group-hover:bg-orange-500 group-hover:text-white'
                  : `bg-slate-50 text-slate-400 ${theme.light} ${theme.text}`
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
