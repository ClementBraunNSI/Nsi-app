"use client";
import React, { useEffect, useState } from 'react';
import { Smartphone, Clock } from 'lucide-react';

export default function MobileBlocker() {
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hours = now.getHours();
      // Bloquer entre 8h00 (inclus) et 17h00 (exclus)
      const isSchoolHours = hours >= 8 && hours < 17;
      setShouldBlock(isSchoolHours);
    };

    checkTime();
    // Vérifier chaque minute si l'heure a changé
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!shouldBlock) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[9999] bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
      <div className="bg-orange-500 p-6 rounded-full mb-6 animate-pulse">
        <Smartphone size={48} />
      </div>
      <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
        Mode Ordinateur Requis
      </h2>
      <p className="text-slate-300 max-w-xs leading-relaxed mb-4">
        Pour garantir des conditions d'examen équitables et éviter la triche, l'accès à ce cours est bloqué sur mobile et tablette pendant les heures de cours.
      </p>
      
      <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700 text-orange-400 text-sm font-bold mb-6">
        <Clock size={16} />
        <span>Bloqué de 08:00 à 17:00</span>
      </div>

      <div className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-mono text-slate-400">
        Veuillez utiliser un ordinateur de bureau (Laptop/Desktop).
      </div>
    </div>
  );
}
