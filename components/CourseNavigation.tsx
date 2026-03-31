"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface CourseNavigationProps {
  prevCourse?: { title: string; slug: string };
  nextCourse?: { title: string; slug: string };
  currentLevel: string;
}

export default function CourseNavigation({ prevCourse, nextCourse, currentLevel }: CourseNavigationProps) {
  if (!prevCourse && !nextCourse) return null;

  return (
    <div className="mt-16 pt-8 border-t border-slate-100 not-prose">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {prevCourse ? (
          <Link 
            href={`/cours/${currentLevel}/${prevCourse.slug}`}
            className="group flex-1 p-6 rounded-2xl border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-2 group-hover:text-orange-500">
              <ChevronLeft size={14} /> Chapitre Précédent
            </div>
            <div className="text-lg font-bold text-slate-800 group-hover:text-orange-700 line-clamp-2">
              {prevCourse.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" /> /* Spacer */
        )}

        {nextCourse ? (
          <Link 
            href={`/cours/${currentLevel}/${nextCourse.slug}`}
            className="group flex-1 p-6 rounded-2xl border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-right"
          >
            <div className="flex items-center justify-end gap-2 text-slate-400 text-xs font-black uppercase tracking-widest mb-2 group-hover:text-orange-500">
              Chapitre Suivant <ChevronRight size={14} />
            </div>
            <div className="text-lg font-bold text-slate-800 group-hover:text-orange-700 line-clamp-2">
              {nextCourse.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" /> /* Spacer */
        )}
      </div>
      
      <div className="text-center mt-8">
        <Link 
          href={`/cours/${currentLevel}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm"
        >
          <BookOpen size={16} /> Retour au sommaire
        </Link>
      </div>
    </div>
  );
}
