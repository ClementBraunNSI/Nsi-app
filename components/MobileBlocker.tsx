"use client";
import React from 'react';
import { Smartphone } from 'lucide-react';

export default function MobileBlocker() {
  return (
    <div className="md:hidden fixed inset-0 z-[9999] bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-orange-500 p-6 rounded-full mb-6 animate-pulse">
        <Smartphone size={48} />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
        Mode Ordinateur Requis
      </h2>
      <p className="text-slate-300 max-w-xs leading-relaxed">
        Pour garantir des conditions d'examen équitables et éviter la triche, l'accès à ce cours est bloqué sur mobile.
      </p>
      <div className="mt-8 px-4 py-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-400">
        Veuillez utiliser un ordinateur ou une tablette en mode paysage.
      </div>
    </div>
  );
}
