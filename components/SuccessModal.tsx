'use client';

import React from 'react';
import { Trophy, PartyPopper } from 'lucide-react';

interface SuccessModalProps {
  courseTitle: string;
  onConfirm: () => void;
}

export default function SuccessModal({ courseTitle, onConfirm }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 border border-orange-100">
        <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg rotate-3">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Félicitations !</h2>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
          Vous avez validé la fiche d'exercice : <br/>
          <span className="font-bold text-orange-600 text-lg italic underline decoration-orange-200">"{courseTitle}"</span>
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 flex items-center justify-center gap-3"
        >
          Valider & recevoir mon badge <PartyPopper size={20} />
        </button>
      </div>
    </div>
  );
}
