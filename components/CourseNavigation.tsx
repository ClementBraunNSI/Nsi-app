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
    <div className="mt-16 pt-8 border-t border-[var(--border)] not-prose">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {prevCourse ? (
          <Link 
            href={`/cours/${currentLevel}/${prevCourse.slug}`}
            className="group flex-1 p-6 rounded-[var(--radius)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors duration-150 text-left"
          >
            <div className="flex items-center gap-2 text-[var(--subtle)] text-xs font-semibold mb-2 group-hover:text-[var(--accent)]">
              <ChevronLeft size={14} /> Chapitre Précédent
            </div>
            <div className="text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] line-clamp-2 tracking-tight">
              {prevCourse.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1" /> /* Spacer */
        )}

        {nextCourse ? (
          <Link 
            href={`/cours/${currentLevel}/${nextCourse.slug}`}
            className="group flex-1 p-6 rounded-[var(--radius)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors duration-150 text-right"
          >
            <div className="flex items-center justify-end gap-2 text-[var(--subtle)] text-xs font-semibold mb-2 group-hover:text-[var(--accent)]">
              Chapitre Suivant <ChevronRight size={14} />
            </div>
            <div className="text-lg font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] line-clamp-2 tracking-tight">
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--surface-2)] text-[var(--muted)] font-semibold hover:bg-[var(--border)] transition-colors text-sm"
        >
          <BookOpen size={16} /> Retour au sommaire
        </Link>
      </div>
    </div>
  );
}
