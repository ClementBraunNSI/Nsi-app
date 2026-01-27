'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Achievement } from '@/lib/achievements';

interface AchievementUnlockedModalProps {
  achievement: Achievement;
  onClose: () => void;
}

export default function AchievementUnlockedModal({ achievement, onClose }: AchievementUnlockedModalProps) {
  const Icon = achievement.icon;
  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-500 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-500 border-4 border-purple-100 relative overflow-hidden cursor-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Effet de fond */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-50 to-transparent -z-10" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl rotate-3 animate-bounce ${achievement.color}`}>
          <Icon size={48} />
        </div>
        
        <div className="inline-block px-4 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-black uppercase tracking-widest mb-4 animate-in slide-in-from-bottom-2 duration-700 delay-100">
          Nouveau Succès !
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-2 italic uppercase tracking-tighter animate-in slide-in-from-bottom-2 duration-700 delay-200">
          {achievement.title}
        </h2>
        
        <p className="text-slate-500 font-medium leading-relaxed animate-in slide-in-from-bottom-2 duration-700 delay-300">
          {achievement.description}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-2 duration-700 delay-500">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Continue comme ça !
            </p>
        </div>
      </div>
    </div>
  );
}
