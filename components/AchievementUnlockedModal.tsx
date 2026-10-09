'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Achievement } from '@/lib/achievements';
import { sheetCourseIdFromAchievement } from '@/lib/sheet-badge-art';
import { AcademyVictoryFox } from '@/components/fox/AcademyVictoryFox';
import { SheetBadgeFox } from '@/components/fox/SheetBadgeFox';

interface AchievementUnlockedModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlockedModal({ achievement, onClose }: AchievementUnlockedModalProps) {
  const Icon = achievement.icon;
  const courseId = sheetCourseIdFromAchievement(achievement.id);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="succes-debloque-titre"
        className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-500 border-4 border-purple-100 relative overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-50 to-transparent -z-10" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <AcademyVictoryFox className="mb-3" />

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-black uppercase tracking-widest mb-4">
          <Icon size={14} />
          Nouveau Succès !
        </div>

        <h2 id="succes-debloque-titre" className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter">
          {achievement.title}
        </h2>

        <p className="text-slate-500 font-medium leading-relaxed">
          {achievement.description}
        </p>

        {courseId && (
          <div className="mt-6 flex justify-center">
            <SheetBadgeFox courseId={courseId} title={achievement.title} size={84} />
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Continue comme ça !
          </p>
        </div>
      </div>
    </div>
  );
}
