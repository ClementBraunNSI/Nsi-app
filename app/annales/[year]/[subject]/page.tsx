"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Calendar, User, Clock, FileText } from 'lucide-react';
import { ANNALES_DATA } from '../../data'; // Import data
import QuestionReponse from '@/components/Annales/QuestionReponse';
import { notFound } from 'next/navigation';

export default function SubjectPage({ params }: { params: Promise<{ year: string, subject: string }> }) {
  const resolvedParams = React.use(params);
  const { year, subject } = resolvedParams;
  const key = `${year}-${subject}`;
  const data = ANNALES_DATA[key];

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Sujet non trouvé 😕</h1>
        <p className="text-slate-500 mb-8">Ce sujet n'est pas encore disponible dans notre base.</p>
        <Link href="/annales" className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
          Retour aux annales
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-emerald-100 selection:text-emerald-600">
      {/* HEADER DU SUJET */}
      <header className="bg-white border-b border-slate-100 sticky top-20 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/annales" className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
            <ChevronLeft size={16} /> Retour
          </Link>
          <div className="text-right">
            <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">{data.date}</div>
            <h1 className="text-xl font-black text-slate-800">{data.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* INFO CARD */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-12 flex flex-col md:flex-row gap-6 items-center text-sm text-emerald-800">
          <div className="flex items-center gap-2">
            <Calendar size={18} /> Session {year}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} /> Durée : 3h30
          </div>
          <div className="flex items-center gap-2">
            <FileText size={18} /> {data.exercices.length} Exercices
          </div>
          <div className="flex-1 md:text-right italic text-emerald-600">
            "{data.description}"
          </div>
        </div>

        {/* EXERCICES */}
        <div className="space-y-16">
          {data.exercices.map((exo: any, index: number) => (
            <section key={index} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12">
              <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">{exo.title}</h2>
                  <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Thème : {exo.theme}
                  </span>
                </div>
                <div className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md">
                  {exo.points} points
                </div>
              </div>

              {/* INTRO DU CONTEXTE */}
              {exo.intro && (
                <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  <div dangerouslySetInnerHTML={{ __html: exo.intro.replace(/\n/g, '<br />') }} />
                </div>
              )}

              {/* QUESTIONS */}
              <div className="space-y-2">
                {exo.questions.map((q: any) => (
                  <QuestionReponse 
                    key={q.id}
                    numero={q.id}
                    question={q.question}
                    indice={q.indice}
                    reponse={q.reponse}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
