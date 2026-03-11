"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, MapPin, ChevronRight, Search } from 'lucide-react';
import { ANNALES_LIST } from './data';

export default function AnnalesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-emerald-100 selection:text-emerald-600">
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Annales du <span className="text-emerald-500">Bac NSI</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
          Entraîne-toi sur les vrais sujets tombés ces dernières années. Corrections détaillées et indices progressifs inclus.
        </p>

        <div className="relative max-w-lg mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un thème (ex: SQL, Graphes...)" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition-all"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-32 space-y-20">
        {ANNALES_LIST.map((group) => (
          <section key={group.year} className="relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-slate-900 text-white font-black text-2xl px-4 py-2 rounded-lg shadow-lg rotate-3 transform origin-bottom-left">
                {group.year}
              </div>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {group.subjects
                .filter(sub => 
                  sub.region.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  sub.themes.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((subject) => (
                <Link 
                  key={subject.id} 
                  href={`/annales/${group.year}/${subject.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                      {subject.session}
                    </span>
                    <MapPin size={16} className="text-slate-300" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
                    {subject.region}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {subject.themes.map(theme => (
                      <span key={theme} className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        {theme}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between text-slate-400 group-hover:text-emerald-500 transition-colors pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <BookOpen size={14} /> Voir le sujet
                    </span>
                    <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
