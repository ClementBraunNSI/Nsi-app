import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, GraduationCap, Code2, Heart, Trees, MapPin, Globe, Building2, Library, Waves, Compass, School, Sailboat, Landmark, Backpack, type LucideIcon } from 'lucide-react';
import { FoxHead } from '@/components/ui/FoxHead';

export const metadata: Metadata = {
  title: 'Clément Braun, enseignant NSI',
  description:
    'Clément Braun, enseignant certifié de NSI, propose des cours et des exercices de Python et de SQL pour la SNT, la Première et la Terminale.',
  alternates: {
    canonical: '/a-propos',
  },
};

const ABOUT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: 'https://www.clementbraun.info/a-propos',
  mainEntity: {
    '@type': 'Person',
    name: 'Clément Braun',
    jobTitle: 'Enseignant de NSI',
    url: 'https://www.clementbraun.info',
  },
};

const CONTRIBUTORS = [
  { name: "Clément Braun", role: "Auteur principal", avatar: <FoxHead size={30} />, desc: "Enseignant NSI et concepteur de la plateforme." },
  { name: "Nicolas DELPLACE", role: "Lycée de l'Escaut", avatar: <Building2 size={24} />, desc: "Enseignant d'informatique à Valenciennes." },
  { name: "Stéphane RAMSTEIN", role: "Lycée Raymond Queneau", avatar: <Library size={24} />, desc: "Enseignant d'informatique à Villeneuve-d'Ascq." },
  { name: "Benoit PAPEGAY", role: "Université de Lille", avatar: <GraduationCap size={24} />, desc: "Enseignant-chercheur et contributeur pédagogique." },
  { name: "Mathieu MARCHAND", role: "Lycée Benjamin Franklin", avatar: <Waves size={24} />, desc: "Enseignant d'informatique à Auray." }
];

type TimelineEstablishment = {
  place: string;
  city: string;
};

type TimelineStep = {
  year: string;
  icon: LucideIcon;
  subject: string;
  current?: boolean;
  establishments: TimelineEstablishment[];
};

const TIMELINE: TimelineStep[] = [
  {
    year: "2026 - 2027",
    icon: Compass,
    subject: "SNT / NSI",
    current: true,
    establishments: [
      { place: "Lycée Yves Kernanec", city: "Marcq-en-Baroeul (59)" },
    ],
  },
  {
    year: "2025 - 2026",
    icon: School,
    subject: "SNT / BTS SIO",
    establishments: [
      { place: "Lycée Paul Duez", city: "Cambrai (59)" },
      { place: "Lycée Henri Wallon", city: "Valenciennes (59)" },
      { place: "Lycée Montebello", city: "Lille (59)" }
    ],
  },
  {
    year: "2024 - 2025",
    icon: Sailboat,
    subject: "SNT / NSI",
    establishments: [{ place: "Lycée Charles de Gaulle", city: "Vannes (56)" }, {place : "Lycée Benjamin Franklin", city: "Auray (56)"}],
  },
  {
    year: "2022 - 2024",
    icon: Landmark,
    subject: "SNT / NSI",
    establishments: [{ place: "Lycée Raymond Queneau", city: "Villeneuve-d'Ascq (59)" }],
  },
  {
    year: "2021 - 2022",
    icon: Backpack,
    subject: "SNT / NSI",
    establishments: [{ place: "Lycée Louis Pasteur", city: "Hénin-Beaumont (62)" }],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_JSON_LD) }}
      />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-soft)] text-[var(--accent)] rounded-full text-xs font-semibold mb-3">
              <GraduationCap size={14} fill="currentColor" /> Enseignant certifié, TZR
            </div>
            <p className="mb-6 text-sm font-semibold text-[var(--fg)]">Certifié de NSI</p>
            <h1 className="text-5xl md:text-7xl font-semibold text-[var(--fg)] mb-8 tracking-tight">
              Clément <span className="text-[var(--accent)]">Braun</span>
              <span className="mt-3 block text-2xl font-medium tracking-normal text-[var(--muted)] md:text-3xl">
                Enseignant de NSI
              </span>
            </h1>
            <p className="mb-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-base leading-relaxed text-[var(--muted)]">
              Bonjour à tous,
              Je suis Clément BRAUN, <strong className="font-semibold text-[var(--accent)]">enseignant certifié de sciences informatiques</strong> dans l'académie de Lille, passioné d'informatique, de programmation et des nouvelles technologies. <br/>
              Certains se demanderont pourquoi j'ai choisi le renard comme mascotte? C'est simple, c'est un animal intelligent, malin et très curieux. Mais c'est aussi un animal qui est attaché à son groupe lorsque les ressources sont abondantes.
              Ce site contient toutes les ressources necessaires à la réussite des élèves en <strong className="font-semibold text-[var(--accent)]">seconde, première et terminale</strong> et plus encore. 
              Choisir le renard a dont été une évidence, les ressources étant présentes en nombre, tous peuvent donc progresser et réussir en mettant à l'honneur l'entraide et la solidarité.
            </p>
            <div className="mb-8 space-y-2 text-lg leading-relaxed text-[var(--muted)]">
              <p>La <strong className="font-semibold text-[var(--accent)]">SNT</strong> s'adresse à tous les élèves de <strong className="font-semibold text-[var(--accent)]">seconde</strong>.</p>
              <p>La <strong className="font-semibold text-[var(--accent)]">NSI</strong> est la spécialité de <strong className="font-semibold text-[var(--accent)]">Première</strong> et de <strong className="font-semibold text-[var(--accent)]">Terminale</strong>.</p>
              <p>Ce site est d'abord destiné à <strong className="font-semibold text-[var(--accent)]">mes classes</strong>.</p>
            </div>
            <nav aria-label="Niveaux" className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="/cours/snt" className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                SNT
              </Link>
              <Link href="/cours/1nsi" className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                Première NSI
              </Link>
              <Link href="/cours/tnsi" className="flex items-center gap-2 px-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors">
                Terminale NSI
              </Link>
            </nav>
            <div className="mt-10">
              <p className="text-sm font-semibold text-[var(--fg)]">Mail professionnel</p>
              <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">
                Un élève de mes classes, un parent ou un collègue peut m'écrire.
              </p>
              <p className="mt-2 text-base font-medium text-[var(--fg)]">clementbraun@ac-lille.fr</p>
              <a
                href="mailto:clementbraun@ac-lille.fr"
                className="mt-6 inline-flex items-center gap-3 px-10 py-5 bg-[var(--accent)] text-[var(--accent-fg)] rounded-[var(--radius)] font-semibold hover:opacity-90 transition-opacity"
              >
                <Mail size={24} /> Me contacter par mail
              </a>
            </div>
          </div>
          <div className="w-64 h-64 bg-[var(--surface-2)] rounded-[var(--radius)] flex items-center justify-center">
            <Image src="/images/fox_assis.svg" alt="Le renard de la tanière" width={240} height={240} />
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
                Le choix du renard n'est pas seulement esthétique. C'est un animal qui <strong>fédère</strong> par son intelligence et sa capacité d'adaptation, des qualités essentielles en informatique.
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
          <p className="text-[var(--muted)]">Parcours d'enseignant de NSI, entre terrils, métropole et océan.</p>
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
                    <div className={`flex flex-wrap items-center gap-2 ${i % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <span className="text-[var(--accent)] font-semibold text-sm">{step.year}</span>
                      {step.current ? (
                        <span className="inline-flex items-center rounded-full bg-[var(--accent-soft)] px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                          en poste
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-[var(--fg)]">{step.subject}</p>
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
                <div className="relative z-10 w-16 h-16 bg-[var(--accent)] rounded-2xl flex items-center justify-center text-white border-4 border-[var(--bg)]">
                  {React.createElement(step.icon, { size: 26, "aria-hidden": true })}
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
            <p className="mt-4 max-w-2xl text-[var(--muted)] leading-relaxed">
              À côté de ce projet, d'autres enseignants de SNT et de NSI publient leurs propres cours.
            </p>
            <Link
              href="/autres-cours-nsi"
              className="mt-3 inline-block font-semibold text-[var(--accent)] hover:underline"
            >
              Voir les autres cours NSI
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {CONTRIBUTORS.map((person, i) => (
              <div key={i} className="bg-[var(--surface)] p-6 rounded-[var(--radius)] border border-[var(--border)] text-center w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(20%-1.5rem)] min-w-[220px] hover:border-[var(--accent)] transition-colors">
                <div className="w-14 h-14 bg-[var(--surface-2)] rounded-2xl flex items-center justify-center text-[var(--accent)] mb-5 mx-auto">
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

    </div>
  );
}