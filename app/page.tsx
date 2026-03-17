"use client"; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Search, Github, Book, ChevronRight as ChevronRightIcon, ChevronLeft, Zap, Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SplashText from '@/components/SplashText';

// Niveaux classiques
const LEVELS = [
  { id: 0, title: "SNI", desc: "Sciences Numériques et Informatique : les bases.", img: "/images/fox_0.png", color: "bg-slate-500", tag: "Niveau 0" },
  { id: 1, title: "SNT", desc: "Sciences Numériques et Technologie (2nde).", img: "/images/fox_1.png", color: "bg-blue-500", tag: "Niveau 1" },
  { id: 2, title: "Première NSI", desc: "Algorithmique, Python et structures de données.", img: "/images/fox_2.png", color: "bg-orange-500", tag: "Niveau 2" },
  { id: 3, title: "Terminale NSI", desc: "Récursivité, SQL et architectures réseaux.", img: "/images/fox_3.png", color: "bg-purple-500", tag: "Niveau 3" },
  { id: 4, title: "BTS SIO", desc: "Services Informatiques aux Organisations.", img: "/images/fox_4.png", color: "bg-emerald-500", tag: "Niveau 4" },
];

// Jeux et Outils
const GAMES = [
  { 
    id: 'fox-game', 
    title: "L'Académie des Renards", 
    desc: "Apprends les bases de Python (boucles, conditions, fonctions) en guidant un renard à travers des énigmes.", 
    img: "/images/fox_act.png", 
    color: "bg-amber-500", 
    tag: "Jeu Python", 
    href: "/fox" 
  },
];

// Données des cours particuliers
const PRIVATE_LESSONS = [
  { 
    id: 'private-1', 
    title: "Coaching Particulier", 
    desc: "Accès à tes ressources personnalisées, exercices spécifiques et suivi individuel.", 
    img: "/images/fox_3.png", 
    color: "bg-orange-600", 
    tag: "Privé", 
    href: "/student/dashboard" 
  },
];

const CourseCard = ({ title, desc, img, tag, color, href, isPrivate = false }: any) => (
  <Link href={href} className="group flex flex-col"> 
    <div className={`rounded-[2rem] overflow-hidden border shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full ${isPrivate ? 'border-orange-200 bg-orange-50/50' : 'bg-white border-slate-100'}`}>
      <div className="relative h-56 w-full bg-slate-50 p-4">
        <Image src={img} alt={title} fill className="object-contain p-2 transition-transform duration-700 group-hover:scale-110" />
        <div className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${isPrivate ? 'bg-orange-500 text-white border-orange-400' : 'bg-white/90 backdrop-blur-md text-slate-800 border-slate-100'}`}>
          {tag}
        </div>
      </div>
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-orange-500 transition-colors flex items-center gap-2">
          {isPrivate && <Zap size={20} className="text-orange-500" fill="currentColor" />}
          {title}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-2">{desc}</p>
        <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Book size={14} /> Ouvrir l'espace
          </span>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} text-white shadow-lg transform group-hover:rotate-12 transition-transform`}>
            <ChevronRight size={24} />
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default function LandingPage() {
  const [hasPrivateAccess, setHasPrivateAccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const colleagues = [
    { name: "Lucas Relmy", site: "http://lucasrelmynsi.gitlab.io/site_cours/", phrase: "Explorez l'informatique avec clarté et structure grâce aux cours organisés de Lucas Relmy." },
    { name: "Erwan Demerville", site: "https://nsi.erwandemerville.fr/", phrase: "Maîtrisez la NSI avec des ressources complètes et interactives pour Première et Terminale." },
    { name: "Stéphane Ramstein", site: "https://stephane_ramstein.gitlab.io/nsi/", phrase: "Le portail complet pour la NSI : cours, outils, orientation et concours." },
    { name: "Mathieu Marchand", site: "https://mmarchand-nsi.github.io/", phrase: "Explorez l'informatique scientifique avec des projets concrets et des outils professionnels." },
    { name: "Nicolas Leal", site: "http://www.prof-leal.fr/", phrase: "Découvrez le numérique avec curiosité et rigueur pour SNT et NSI." },
    { name: "Théo Quertier", site: "https://ge0rgi0.github.io/TAQ/", phrase: "TAQ : votre guide structuré pour maîtriser NSI et SNT étape par étape." },
    { name: "Mathieu Cardoso", site: "https://profcardoso.github.io/", phrase: "Cours NSI-SNT complets avec ressources pratiques et club informatique." },
    { name: "Nicolas Mathieu", site: "https://nsi.rocks/nsi", phrase: "Une mine d'or de ressources NSI : cours, exercices et projets pour progresser solide comme un roc." }
  ];

  const itemsPerPage = 3;
  const maxIndex = Math.max(0, colleagues.length - itemsPerPage);

  useEffect(() => {
    const checkAccess = async (session: any) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('has_private_lessons, level')
          .eq('id', session.user.id)
          .single();
        
        console.log("Niveau de l'utilisateur connecté :", data?.level);

        setHasPrivateAccess(data?.has_private_lessons || false);
      } else {
        setHasPrivateAccess(false);
      }
    };

    // Vérification initiale
    supabase.auth.getSession().then(({ data: { session } }) => checkAccess(session));

    // Écoute des changements d'auth (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setHasPrivateAccess(false);
      } else if (event === 'SIGNED_IN' && session) {
        checkAccess(session);
      } else if (!session) {
        setHasPrivateAccess(false);
      }
    });

    // Re-vérification lors du focus et de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        supabase.auth.getSession().then(({ data: { session } }) => checkAccess(session));
      }
    };

    const handleFocus = () => {
      supabase.auth.getSession().then(({ data: { session } }) => checkAccess(session));
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Erreur de recherche:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-orange-100 selection:text-orange-600">
      
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-24 text-center relative">
        <div className="relative inline-block">
          <h1 className="text-7xl md:text-8xl font-black text-slate-900 mb-10 tracking-tight">
            Maîtrisez le <span className="text-orange-500">Code.</span><br />
            Devenez un <span className="relative inline-block">
              Renard.
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 5C20 2 80 2 100 5" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          La plateforme de référence pour la NSI. Des cours épurés, des illustrations uniques et un parcours de progression jusqu'au BTS.
        </p>

        <SplashText />

        <div className="relative max-w-xl mx-auto z-50">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
          <input 
            type="text" 
            placeholder="Rechercher une notion (ex: boucles, listes...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 focus:border-orange-500 focus:ring-0 outline-none transition-all text-lg font-medium text-slate-800" 
          />
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-left animate-in fade-in slide-in-from-top-2">
              {isSearching ? (
                <div className="p-8 text-center text-slate-400">Recherche dans les cours... 🦊</div>
              ) : results.length > 0 ? (
                results.map((course: any, i) => (
                  <Link key={i} href={`/cours/${course.level}/${course.slug}`} className="flex items-center justify-between p-5 hover:bg-orange-50 transition-colors border-b border-slate-50 last:border-0">
                    <div>
                      <div className="font-bold text-slate-800">{course.title}</div>
                      <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{course.category}</div>
                    </div>
                    <ChevronRightIcon className="text-slate-300" size={18} />
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 italic">Aucun cours trouvé pour cette notion.</div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-32">
        {/* SECTION PRIVÉE DYNAMIQUE */}
        {hasPrivateAccess && (
          <div className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Zap size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tight">
                Mon Accompagnement <span className="text-orange-500">Privé</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {PRIVATE_LESSONS.map((lesson) => (
                <CourseCard key={lesson.id} {...lesson} isPrivate={true} />
              ))}
            </div>
            <div className="mt-16 border-b border-slate-100"></div>
          </div>
        )}

        <h2 className="text-2xl font-black text-slate-800 mb-10">Parcourir par niveaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {LEVELS.map((lvl) => (
            <CourseCard key={lvl.id} {...lvl} href={`/cours/${lvl.id}`} />
          ))}
        </div>

        <h2 className="text-2xl font-black text-slate-800 mt-20 mb-10">Zone d'Entraînement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {GAMES.map((game) => (
            <CourseCard key={game.id} {...game} />
          ))}

          <Link href="/projets/chasse-aux-renards" className="group p-8 rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-orange-500/20 transition-all text-center flex flex-col items-center justify-center gap-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-2 group-hover:rotate-12 transition-transform shadow-lg relative z-10">
                <Palette size={32} />
              </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-slate-900">Chasse aux Ren'Arts</h3>
              <p className="text-sm text-slate-500 mt-2">Galerie d'art des élèves</p>
            </div>
          </Link>
        </div>
      </main>

      <section className="bg-slate-50 py-24 border-t border-slate-100">
        {/* Section collègues identique... */}
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Sites de collègues</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto italic">
              Découvrez les ressources exceptionnelles de mes collègues enseignants NSI à travers la France.
            </p>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="flex justify-center gap-4 mb-8">
              <button 
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => { setCurrentIndex(Math.max(0, currentIndex - itemsPerPage)); setIsAnimating(false); }, 200);
                }}
                disabled={currentIndex === 0}
                className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </button>
              <button 
                onClick={() => {
                  setIsAnimating(true);
                  setTimeout(() => { setCurrentIndex(Math.min(maxIndex, currentIndex + itemsPerPage)); setIsAnimating(false); }, 200);
                }}
                disabled={currentIndex >= maxIndex}
                className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} className="text-slate-600" />
              </button>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              {colleagues.slice(currentIndex, currentIndex + itemsPerPage).map((colleague, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-all shadow-inner">
                      👨‍🏫
                    </div>
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">{colleague.name}</h3>
                      <p className="text-orange-600 font-bold text-xs uppercase tracking-widest">Enseignant NSI</p>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 italic">{colleague.phrase}</p>
                  <a href={colleague.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-200 text-sm">
                    Visiter le site <ChevronRight size={16} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-slate-400 font-bold text-sm tracking-widest uppercase">© 2026 Clément Braun — NSI</div>
          <div className="flex items-center gap-8">
            <Link href="/mentions-legales" className="text-slate-400 hover:text-slate-600 transition-colors text-sm font-medium">
              Mentions légales
            </Link>
            <Github className="text-slate-300 hover:text-slate-900 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}