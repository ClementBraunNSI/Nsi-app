"use client"; 
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Search, Github, Book, ChevronRight as ChevronRightIcon, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import SplashText from '@/components/SplashText';
import ColleagueSites from '@/components/ColleagueSites';

// Niveaux classiques
const LEVELS = [
  { id: 0, title: "SNI", desc: "Sciences Numériques et Informatique : les bases.", img: "/images/fox_0.png", color: "bg-slate-500", tag: "Niveau 0" },
  { id: 1, title: "SNT", desc: "Sciences Numériques et Technologie (2nde).", img: "/images/fox_1.png", color: "bg-blue-500", tag: "Niveau 1" },
  { id: 2, title: "Première NSI", desc: "Algorithmique, Python et structures de données.", img: "/images/fox_2.png", color: "bg-orange-500", tag: "Niveau 2" },
  { id: 3, title: "Terminale NSI", desc: "Récursivité, SQL et architectures réseaux.", img: "/images/fox_3.png", color: "bg-purple-500", tag: "Niveau 3" },
  { id: 4, title: "BTS SIO", desc: "Services Informatiques aux Organisations.", img: "/images/fox_4.png", color: "bg-emerald-500", tag: "Niveau 4" },
];

// Ressources publiques (hors parcours NSI classique)
const PUBLIC_RESOURCES = [
  {
    id: 'public-c-lang',
    title: 'Programmation en C',
    desc: 'Cours et exercices en langage C : types, tableaux, fonctions, structures, tris… Accessible sans compte.',
    img: '/images/fox_2.png',
    color: 'bg-amber-600',
    tag: 'Langage C',
    href: '/cours/particuliers',
  },
];

// Jeux et Outils
const GAMES = [
  { 
    id: 'fox-3d-test', 
    title: "Académie des Renards", 
    desc: "Prototype isométrique avec grille 3D, sprites renard/poule et obstacles. Prévisualisation technique.", 
    img: "/images/fox_act.png", 
    color: "bg-teal-500", 
    tag: "Apprentissage Python", 
    href: "/foxtest" 
  },
  { 
    id: 'fox-art', 
    title: "Chasse aux Ren'Arts", 
    desc: "Découvrez les créations artistiques de nos élèves qui ont revisité les grands classiques de l'art.", 
    img: "/images/fox_chasse_renard.png", 
    color: "bg-rose-500", 
    tag: "Galerie d'Art", 
    href: "/projets/chasse-aux-renards" 
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

const CourseCard = ({ title, desc, img, tag, color, href, isPrivate = false, featured = false }: any) => (
  <Link href={href} className={`group flex flex-col ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
    <div className={`home-card overflow-hidden flex flex-col h-full ${isPrivate ? 'is-private' : ''} ${featured ? 'is-featured' : ''}`}>
      <div className={`relative w-full bg-[var(--surface-2)] p-4 ${featured ? 'h-56 lg:h-80' : 'h-40'}`}>
        <Image src={img} alt={title} fill className="object-contain p-2" sizes={featured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'} />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${isPrivate ? 'bg-[var(--accent)] text-[var(--accent-fg)] border-transparent' : 'bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]'}`}>
          {tag}
        </div>
      </div>
      <div className={`flex flex-col flex-1 ${featured ? 'p-7' : 'p-6'}`}>
        <h3 className={`font-semibold tracking-tight text-[var(--fg)] mb-2 group-hover:text-[var(--accent)] transition-colors flex items-center gap-2 ${featured ? 'text-2xl' : 'text-lg'}`}>
          {isPrivate && <Zap size={18} className="text-[var(--accent)]" fill="currentColor" />}
          {title}
        </h3>
        <p className={`text-[var(--muted)] text-sm leading-relaxed mb-6 ${featured ? '' : 'line-clamp-2'}`}>{desc}</p>
        <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <span className="flex items-center gap-2 text-xs font-semibold text-[var(--subtle)]">
            <Book size={14} /> Ouvrir l'espace
          </span>
          <span className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden="true" />
            <ChevronRight size={18} className="text-[var(--subtle)] group-hover:text-[var(--accent)] transition-colors" />
          </span>
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
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] relative">
      <button
        type="button"
        data-fox-easter-id="home"
        aria-label="Secret renard accueil"
        className="fox-secret-spot absolute top-24 right-8 z-20"
      />
      
      <header className="max-w-7xl mx-auto px-8 pt-20 pb-24 text-center relative z-10">
        <div className="relative inline-block">
          <h1 className="home-title text-[var(--fg)] mb-10 tracking-tight">
            Maîtrisez le <span className="text-[var(--accent)]">Code.</span><br />
            Devenez un <span className="relative inline-block">
              Renard.
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 5C20 2 80 2 100 5" stroke="currentColor" className="text-[var(--accent)]" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </div>
        <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          La plateforme de référence pour la NSI. Des cours épurés, des illustrations uniques et un parcours de progression jusqu'au BTS.
        </p>

        <SplashText />

        <div className="relative max-w-xl mx-auto z-50">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--subtle)] pointer-events-none" size={24} />
          <input 
            type="text" 
            placeholder="Rechercher une notion (ex: boucles, listes...)" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] focus:border-[var(--accent)] outline-none transition-colors text-lg font-medium text-[var(--fg)]" 
          />
          {searchQuery.length > 1 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden text-left" style={{ boxShadow: 'var(--shadow)' }}>
              {isSearching ? (
                <div className="p-8 text-center text-[var(--muted)]">Recherche dans les cours... 🦊</div>
              ) : results.length > 0 ? (
                results.map((course: any, i) => (
                  <Link key={i} href={`/cours/${course.level}/${course.slug}`} className="flex items-center justify-between p-5 hover:bg-[var(--surface-2)] transition-colors border-b border-[var(--border)] last:border-0">
                    <div>
                      <div className="font-semibold text-[var(--fg)]">{course.title}</div>
                      <div className="text-xs text-[var(--accent)] font-semibold">{course.category}</div>
                    </div>
                    <ChevronRightIcon className="text-[var(--subtle)]" size={18} />
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-[var(--muted)] italic">Aucun cours trouvé pour cette notion.</div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 pb-32 relative z-10">
        {/* SECTION PRIVÉE DYNAMIQUE */}
        {hasPrivateAccess && (
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-[var(--accent-fg)]">
                <Zap size={20} fill="currentColor" />
              </div>
              <h2 className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
                Mon Accompagnement <span className="text-[var(--accent)]">Privé</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {PRIVATE_LESSONS.map((lesson) => (
                <CourseCard key={lesson.id} {...lesson} isPrivate={true} />
              ))}
            </div>
            <div className="mt-16 border-b border-[var(--border)]"></div>
          </div>
        )}

        <h2 className="text-2xl font-semibold text-[var(--fg)] mb-6 tracking-tight">Parcourir par niveaux</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LEVELS.map((lvl) => (
            <CourseCard key={lvl.id} {...lvl} href={`/cours/${lvl.id}`} featured={lvl.id === 2} />
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-[var(--fg)] mt-16 mb-6 tracking-tight">Ressources <span className="text-[var(--accent)]">ouvertes</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PUBLIC_RESOURCES.map((item) => (
            <CourseCard key={item.id} {...item} />
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-[var(--fg)] mt-16 mb-6 tracking-tight">Un peu plus de <span className="text-[var(--accent)]">Renards</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game) => (
            <CourseCard key={game.id} {...game} />
          ))}
        </div>
      </main>

      <ColleagueSites />

      <footer className="border-t border-[var(--border)] py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[var(--subtle)] text-sm">© 2026 Clément Braun — NSI</div>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm font-medium">
              Mentions légales
            </Link>
            <Github className="text-[var(--subtle)] hover:text-[var(--fg)] cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
