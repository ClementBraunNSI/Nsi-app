import React from 'react';
import { Mail, GraduationCap, Code2, Heart, Trees, MapPin, Globe } from 'lucide-react';

const CONTRIBUTORS = [
  { name: "Clément Braun", role: "Auteur principal", avatar: "🦊", desc: "Enseignant NSI et concepteur de la plateforme." },
  { name: "Nicolas DELPLACE", role: "Lycée de l'Escaut", avatar: "🏢", desc: "Enseignant d'informatique à Valenciennes." },
  { name: "Stéphane RAMSTEIN", role: "Lycée Raymond Queneau", avatar: "📚", desc: "Enseignant d'informatique à Villeneuve-d'Ascq." },
  { name: "Benoit PAPEGAY", role: "Université de Lille", avatar: "🎓", desc: "Enseignant-chercheur et contributeur pédagogique." },
  { name: "Mathieu MARCHAND", role: "Lycée Benjamin Franklin", avatar: "🌊", desc: "Enseignant d'informatique à Auray." }
];

type TimelineEstablishment = {
  place: string;
  city: string;
};

type TimelineStep = {
  year: string;
  icon: string;
  establishments: TimelineEstablishment[];
};

const TIMELINE: TimelineStep[] = [
  {
    year: "2021 - 2022",
    icon: "🎒",
    establishments: [{ place: "Lycée Pasteur", city: "Hénin-Beaumont (62)" }],
  },
  {
    year: "2022 - 2024",
    icon: "🏛️",
    establishments: [{ place: "Lycée Raymond Queneau", city: "Villeneuve-d'Ascq (59)" }],
  },
  {
    year: "2024 - 2025",
    icon: "⛵",
    establishments: [{ place: "Lycée Charles de Gaulle", city: "Vannes (56)" }],
  },
  {
    year: "2025 - 2026",
    icon: "🏫",
    establishments: [
      { place: "Lycée Paul Duez", city: "Cambrai (59)" },
      { place: "Lycée Henri Wallon", city: "Valenciennes (59)" },
      { place: "Lycée Montebello", city: "Lille (59)" }
    ],
  },
  {
    year: "2026 - 2027",
    icon: "🧭",
    establishments: [
      { place: "Lycée Yves Kernanec", city: "Marcq-en-Baroeul (59)" },
    ],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)]">
      <button
        type="button"
        data-fox-easter-id="apropos"
        aria-label="Secret renard a propos"
        className="fox-secret-spot absolute top-28 right-8 z-20"
      />
      
      {/* Hero Section - Identité Professionnelle */}
      <header className="max-w-7xl mx-auto px-8 pt-24 pb-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full text-xs font-semibold mb-6">
              <GraduationCap size={14} fill="currentColor" /> Enseignant certifié · TZR
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold text-[var(--fg)] mb-8 tracking-tight">
              Clément <span className="text-[var(--accent)]">Braun</span>
            </h1>
            <p className="text-xl text-[var(--muted)] leading-relaxed mb-8">
              Enseignant certifié de NSI en <span className="font-semibold text-[var(--fg)]">TZR</span>, mon parcours m'a mené dans des lycées du <span className="font-semibold text-[var(--fg)]">Nord</span> et du <span className="font-semibold text-[var(--fg)]">Pas-de-Calais</span> jusqu'aux côtes du <span className="font-semibold text-[var(--fg)]">Morbihan</span>. Selon les années, j'interviens dans un ou plusieurs établissements.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)]">
                <MapPin size={16} className="text-[var(--accent)]" /> Pas-de-Calais (62)
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)]">
                <MapPin size={16} className="text-[var(--accent)]" /> Nord (59)
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)]">
                <MapPin size={16} className="text-[var(--accent)]" /> Morbihan (56)
              </span>
            </div>
          </div>
          <div className="w-64 h-64 bg-[var(--accent)] rounded-[var(--radius)] flex items-center justify-center text-[8rem]">
            <span>🦊</span>
          </div>
        </div>
      </header>

     

      {/* Section : Pourquoi le Renard ? (Biodiversité) */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="bg-emerald-900 rounded-[var(--radius)] p-10 md:p-20 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 mb-6 text-emerald-300 font-semibold text-sm">
              <Trees size={24} /> Écosystème & Engagement
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 leading-tight tracking-tight">
              Bien plus qu'une simple <span className="text-emerald-300">mascotte.</span>
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

             {/* Section : Parcours */}
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-[var(--fg)] mb-4 tracking-tight">L'itinéraire du renard</h2>
          <p className="text-[var(--muted)]">Un parcours entre terrils, métropole et océan — une carte peut regrouper plusieurs lycées sur la même période.</p>
        </div>

        <div className="relative">
          {/* Tracé serpentin desktop */}
          <svg
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[320px] -translate-x-1/2 md:block"
            viewBox="0 0 320 1200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M160 20 C 300 120, 20 240, 160 360 C 300 480, 20 620, 160 760 C 300 900, 30 1040, 160 1180"
              fill="none"
              stroke="#FDBA74"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="2 22"
              opacity="0.8"
            />
          </svg>

          <div className="space-y-14">
            {TIMELINE.map((step, i) => (
              <div key={step.year} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Bloc Contenu */}
                <div className="flex-1 w-full md:w-auto">
                  <div className={`relative p-8 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-[var(--accent)] font-semibold text-sm">{step.year}</span>
                    {step.establishments.length > 1 ? (
                      <p className={`mt-2 text-xs font-semibold text-[var(--subtle)] ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                        {step.establishments.length} établissements
                      </p>
                    ) : null}
                    <div className={`mt-3 space-y-4 ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'} flex flex-col`}>
                      {step.establishments.map((establishment) => (
                        <div
                          key={`${step.year}-${establishment.place}`}
                          className={`${step.establishments.length > 1 ? 'rounded-2xl border border-[var(--border)] bg-[var(--accent-soft)] px-4 py-3' : ''}`}
                        >
                          <h3 className="text-xl font-semibold text-[var(--fg)] tracking-tight">{establishment.place}</h3>
                          <p className={`text-[var(--muted)] flex items-center gap-2 mt-1 ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                            <MapPin size={14} className="shrink-0 text-[var(--accent)]" />
                            <span>{establishment.city}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Badge Central */}
                <div className="relative z-10 w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-2xl border-4 border-[var(--bg)]">
                  {step.icon}
                </div>

                {/* Espaceur pour l'équilibre (Desktop) */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rappel des contributeurs - Réutilisation de tes données existantes */}
      <section className="bg-[var(--surface-2)] py-24 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-4xl font-semibold text-[var(--fg)] mb-4 tracking-tight">Une démarche collaborative</h2>
            <p className="text-[var(--muted)] font-medium max-w-2xl italic">
              "Seul on va plus vite, ensemble on va plus loin." Ce projet mutualise les travaux de collègues passionnés rencontrés au fil de mon parcours.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {CONTRIBUTORS.map((person, i) => (
              <div key={i} className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--border)] text-center w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(20%-1.5rem)] min-w-[220px] hover:border-[var(--accent)] transition-colors">
                <div className="w-14 h-14 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-2xl mb-5 mx-auto">
                  {person.avatar}
                </div>
                <h3 className="font-semibold text-[var(--fg)] text-lg mb-1 tracking-tight">{person.name}</h3>
                <p className="text-[var(--accent)] font-semibold text-xs mb-3">{person.role}</p>
                <p className="text-[var(--muted)] text-[13px] leading-relaxed">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <h2 className="text-3xl font-semibold text-[var(--fg)] mb-6 tracking-tight">Restons en contact</h2>
        <p className="text-[var(--muted)] mb-10 text-lg">
          Que vous soyez élève, parent ou enseignant, n'hésitez pas à me contacter pour échanger sur le projet.
        </p>
        <a 
          href="mailto:clementbraun@supwallon.fr"
          className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-[var(--accent-fg)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity"
        >
          <Mail size={24} /> Me contacter par mail
        </a>
      </section>
    </div>
  );
}