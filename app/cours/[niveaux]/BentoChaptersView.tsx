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
  border: string;
  text: string;
  light: string;
};

type Props = {
  chapters: ChapterItem[];
  niveaux: string;
  theme: Theme;
};

export default function BentoChaptersView({ chapters, niveaux, theme }: Props) {
  const [activeChapter, setActiveChapter] = useState<string>(chapters[0]?.name ?? '');

  return (
    <section className="mb-14">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {chapters.map((chapter) => {
          const isActive = chapter.name === activeChapter;
          return (
            <article
              key={chapter.name}
              className={`rounded-3xl border p-5 transition-all duration-300 ${
                isActive
                  ? 'col-span-full shadow-xl'
                  : 'shadow-sm hover:shadow-lg'
              } ${
                chapter.isPrivate
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveChapter(chapter.name)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    chapter.isPrivate ? 'bg-orange-100 text-orange-500' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chapter.isPrivate ? <Zap size={18} fill="currentColor" /> : <LayoutGrid size={18} />}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    {chapter.courses.length} cours
                  </span>
                </div>
                <h2 className={`mt-4 text-lg font-black leading-tight ${
                  chapter.isPrivate ? 'text-orange-700' : 'text-slate-900'
                }`}>
                  {chapter.name}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {isActive ? 'Bloc ouvert' : 'Cliquer pour ouvrir les cours'}
                </p>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  isActive ? 'max-h-[1400px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {chapter.courses.map((cours) => (
                    <Link
                      key={cours.slug}
                      href={cours.href || `/cours/${niveaux}/${cours.slug}`}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        cours.isPrivate
                          ? 'bg-orange-50 border-orange-200 hover:border-orange-400'
                          : `bg-slate-50 border-slate-100 ${theme.border}`
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{cours.icon}</span>
                        <div className="min-w-0">
                          <h3 className={`font-bold text-sm truncate ${
                            cours.isPrivate ? 'text-gray-900 group-hover:text-orange-600' : `text-gray-900 ${theme.text}`
                          }`}>
                            {cours.title}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-1">{cours.description}</p>
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        cours.isPrivate
                          ? 'bg-orange-100 text-orange-400 group-hover:bg-orange-500 group-hover:text-white'
                          : `bg-white text-slate-400 ${theme.light} ${theme.text}`
                      }`}>
                        <ChevronRight size={16} />
                      </div>
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
