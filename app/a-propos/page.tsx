import React from 'react';
import { Mail, GraduationCap, Code2, Heart, Trees, MapPin, Globe } from 'lucide-react';

const CONTRIBUTORS = [
  { name: "Clément Braun", role: "Auteur Principal", avatar: "🦊", desc: "Enseignant NSI et concepteur de la plateforme." },
  { name: "Nicolas DELPLACE", role: "Lycée de l'Escaut", avatar: "🏢", desc: "Enseignant d'informatique à Valenciennes." },
  { name: "Stéphane RAMSTEIN", role: "Lycée Raymond Queneau", avatar: "📚", desc: "Enseignant d'informatique à Villeneuve-d'Ascq." },
  { name: "Benoit PAPEGAY", role: "Université de Lille", avatar: "🎓", desc: "Enseignant chercheur et contributeur pédagogique." },
  { name: "Mathieu MARCHAND", role: "Lycée Benjamin Franklin", avatar: "🌊", desc: "Enseignant d'informatique à Auray." }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-orange-100">
      
      {/* Hero Section - Identité Professionnelle */}
      <header className="max-w-7xl mx-auto px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <GraduationCap size={14} fill="currentColor" /> Enseignant Certifié
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight">
              Clément <span className="text-orange-500">Braun</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              Enseignant certifié de NSI, mon parcours m'a mené dans des lycées du <span className="font-bold text-slate-800">Nord</span> et du <span className="font-bold text-slate-800">Pas-de-Calais</span> jusqu'aux côtes du <span className="font-bold text-slate-800">Morbihan</span>. 
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-500 shadow-sm">
                <MapPin size={16} className="text-orange-500" /> Nord & Pas-de-Calais
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-medium text-slate-500 shadow-sm">
                <MapPin size={16} className="text-orange-500" /> Morbihan (56)
              </span>
            </div>
          </div>
          <div className="w-64 h-64 bg-orange-500 rounded-[3rem] flex items-center justify-center text-[8rem] shadow-2xl shadow-orange-200 rotate-3">
            🦊
          </div>
        </div>
      </header>

      {/* Section : Pourquoi le Renard ? (Biodiversité) */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-emerald-900 rounded-[3.5rem] p-10 md:p-20 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 text-emerald-400 font-black uppercase tracking-[0.2em] text-sm">
              <Trees size={24} /> Écosystème & Engagement
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Bien plus qu'une simple <span className="text-emerald-400">mascotte.</span>
            </h2>
            <div className="space-y-6 text-emerald-100 text-lg leading-relaxed">
              <p>
                Le choix du renard n'est pas seulement esthétique. C'est un animal qui <strong>fédère</strong> par son intelligence et sa capacité d'adaptation — des qualités essentielles en informatique.
              </p>
              <p>
                Mais au-delà du code, le renard est un symbole fort de notre lien avec la nature. À travers ce thème, je souhaite rappeler l'importance de la <strong>préservation de la biodiversité</strong>. Apprendre les sciences numériques, c'est aussi comprendre le monde qui nous entoure pour mieux le protéger.
              </p>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-10 rotate-12 pointer-events-none">
            <Globe size={500} />
          </div>
        </div>
      </section>

      {/* Rappel des contributeurs - Réutilisation de tes données existantes */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Une démarche collaborative</h2>
            <p className="text-slate-500 font-medium max-w-2xl italic">
              "Seul on va plus vite, ensemble on va plus loin." Ce projet mutualise les travaux de collègues passionnés rencontrés au fil de mon parcours.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {CONTRIBUTORS.map((person, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group text-center w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(20%-1.5rem)] min-w-[220px] transition-all hover:shadow-xl hover:border-orange-200">
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                  {person.avatar}
                </div>
                <h3 className="font-black text-slate-800 text-lg mb-1">{person.name}</h3>
                <p className="text-orange-600 font-bold text-[10px] uppercase tracking-widest mb-3">{person.role}</p>
                <p className="text-slate-500 text-[13px] leading-relaxed">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Restons en contact</h2>
        <p className="text-slate-500 mb-10 text-lg">
          Que vous soyez élève, parent ou enseignant, n'hésitez pas à me contacter pour échanger sur le projet.
        </p>
        <a 
          href="mailto:ton-email@exemple.fr" 
          className="inline-flex items-center gap-3 px-10 py-5 bg-orange-500 text-white rounded-[2rem] font-black hover:scale-105 transition-transform shadow-2xl shadow-orange-200"
        >
          <Mail size={24} /> Me contacter par mail
        </a>
      </section>
    </div>
  );
}