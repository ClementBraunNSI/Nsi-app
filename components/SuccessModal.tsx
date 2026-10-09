'use client';

import React, { useEffect } from 'react';
import { PartyPopper, X } from 'lucide-react';
import { AcademyVictoryFox } from '@/components/fox/AcademyVictoryFox';
import { SheetBadgeFox } from '@/components/fox/SheetBadgeFox';

interface SuccessModalProps {
  courseTitle: string;
  courseId?: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

export default function SuccessModal({ courseTitle, courseId, onConfirm, onDismiss }: SuccessModalProps) {
  const dismiss = onDismiss ?? onConfirm;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="succes-fiche-titre"
        className="bg-white rounded-[3rem] p-8 sm:p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 border border-orange-100 relative"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>

        <AcademyVictoryFox className="mb-2" />

        <h2 id="succes-fiche-titre" className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">
          Félicitations !
        </h2>
        <p className="text-slate-500 mb-6 leading-relaxed font-medium">
          Tous les exercices de la fiche sont validés : <br/>
          <span className="font-bold text-orange-600 text-lg italic underline decoration-orange-200">&quot;{courseTitle}&quot;</span>
          <br />Tu obtiens le badge, et un succès lié à cette fiche.
        </p>

        {courseId && (
          <div className="mb-6 flex justify-center">
            <SheetBadgeFox courseId={courseId} title={courseTitle} size={92} />
          </div>
        )}

        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 flex items-center justify-center gap-3"
        >
          Super ! <PartyPopper size={20} />
        </button>
      </div>
    </div>
  );
}
