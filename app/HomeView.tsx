"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Github, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getLandingPrivateCard, type LandingPrivateCard } from "@/app/actions/coursePages";
import { getHomeDashboard, type HomeDashboard } from "@/app/actions/home";
import { isAbortError } from "@/lib/is-abort-error";
import SplashText from "@/components/SplashText";
import ColleagueTeaser from "@/components/ColleagueTeaser";
import { GAME_NAME } from "@/app/foxtest/academy/meta";

export type HomeLevel = {
  folder: string;
  urlSlug: string;
  label: string;
  audience: string;
  description: string;
  image: string;
  chapters: number;
  resources: number;
};

type SearchResult = { title: string; slug: string; level: string; category: string };

const QUICK_SEARCHES = ["Boucles", "Listes", "Dictionnaires", "HTML", "SQL", "Récursivité"];

const emptyPrivateCard: LandingPrivateCard = { show: false, courses: [] };

function Greeting({ dashboard }: { dashboard: HomeDashboard }) {
  const hour = new Date().getHours();
  const hello = hour < 5 || hour >= 18 ? "Bonsoir" : "Bonjour";
  const { firstName, level, resume } = dashboard;
  const left = resume ? resume.total - resume.done : 0;
  const next = !resume
    ? "Toutes les fiches de ton niveau sont terminées, bravo !"
    : resume.done > 0
      ? `Encore ${left} exercice${left > 1 ? "s" : ""} pour finir « ${resume.title} ».`
      : `Prochaine étape : « ${resume.title} ».`;
  return (
    <div className="home-greet">
      <span className="home-avatar" aria-hidden="true">
        {(firstName || "?").charAt(0).toUpperCase()}
      </span>
      <div>
        <b>
          {hello}
          {firstName ? ` ${firstName}` : ""} 👋
          {level ? ` Tu en es à ${level.percent} % de ${level.label}.` : ""}
        </b>
        <span>{next}</span>
      </div>
    </div>
  );
}

function ResumeBand({ dashboard }: { dashboard: HomeDashboard }) {
  const { resume, homework, badges, badgeCount, badgeTotal } = dashboard;
  const percent = resume && resume.total ? Math.round((resume.done / resume.total) * 100) : 0;
  const due = homework?.dueAt
    ? new Date(homework.dueAt).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : null;
  return (
    <section className="home-resume" aria-label="Reprendre">
      {resume ? (
        <Link href={resume.href} className="home-continue">
          <span className="home-thumb">
            <Image src={resume.badgeSrc || "/images/fox_2.png"} alt="" width={76} height={76} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="home-eyebrow">
              {resume.done > 0 ? "Reprendre" : "Prochaine étape"} · {resume.chapter}
            </span>
            <b className="home-continue-title">{resume.title}</b>
            <span className="home-progress">
              <i style={{ width: `${percent}%` }} />
            </span>
            <span className="home-meta-row">
              <span>
                {resume.done} / {resume.total} exercices
              </span>
              <span>{percent} %</span>
            </span>
          </span>
          <span className="home-btn">{resume.done > 0 ? "Continuer" : "Commencer"} →</span>
        </Link>
      ) : (
        <Link href={dashboard.level?.href || "/espace"} className="home-continue">
          <span className="min-w-0 flex-1">
            <span className="home-eyebrow">Bravo</span>
            <b className="home-continue-title">Toutes les fiches de ton niveau sont terminées</b>
          </span>
        </Link>
      )}

      <Link href={homework?.href || "/espace"} className="home-side">
        <span className="home-side-k">
          <span>📝 Devoir</span>
        </span>
        {homework ? (
          <>
            <b>{homework.title}</b>
            {due ? <span className="home-due">À rendre {due}</span> : null}
          </>
        ) : (
          <>
            <b>Aucun devoir à rendre</b>
            <span className="home-side-p">Tout est à jour 🎉</span>
          </>
        )}
      </Link>

      <Link href="/espace" className="home-side">
        <span className="home-side-k">
          <span>🏅 Mes badges</span>
          <span>
            {badgeCount}
            {badgeTotal ? ` / ${badgeTotal}` : ""}
          </span>
        </span>
        <span className="home-badges">
          {badges.map((badge) => (
            <Image key={badge.courseId} src={badge.src} alt={badge.name} width={52} height={52} className="home-badge" />
          ))}
          {badgeCount > badges.length ? <span className="home-badge-more">+{badgeCount - badges.length}</span> : null}
          {badgeCount === 0 ? <span className="home-side-p">Valide une fiche pour gagner ton premier badge.</span> : null}
        </span>
      </Link>
    </section>
  );
}

export default function HomeView({ levels }: { levels: HomeLevel[] }) {
  const [privateCard, setPrivateCard] = useState<LandingPrivateCard>(emptyPrivateCard);
  const [dashboard, setDashboard] = useState<HomeDashboard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const checkAccess = async (session: unknown) => {
      try {
        if (session) {
          const [card, home] = await Promise.all([getLandingPrivateCard(), getHomeDashboard()]);
          setPrivateCard(card);
          setDashboard(home);
        } else {
          setPrivateCard(emptyPrivateCard);
          setDashboard(null);
        }
      } catch (error) {
        if (!isAbortError(error)) console.error(error);
      }
    };
    const refresh = () => {
      supabase.auth
        .getSession()
        .then(({ data: { session } }) => checkAccess(session))
        .catch((error) => {
          if (!isAbortError(error)) console.error(error);
        });
    };

    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        setPrivateCard(emptyPrivateCard);
        setDashboard(null);
      }
      if (event === "SIGNED_IN" && session) checkAccess(session);
    });

    // Re-vérification lors du focus et de la visibilité de la page
    const handleVisibilityChange = () => {
      if (!document.hidden) refresh();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", refresh);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          setResults(await res.json());
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

  const student = dashboard !== null;

  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)] relative">
      <button
        type="button"
        data-fox-easter-id="home"
        aria-label="Secret renard accueil"
        className="fox-secret-spot absolute top-24 right-8 z-20"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <header className="home-hero">
          <div className="min-w-0">
            {dashboard ? <Greeting dashboard={dashboard} /> : null}
            <h1 className="home-title text-[var(--fg)] tracking-tight">
              Maîtrise le <span className="text-[var(--accent)]">code.</span>
              <br />
              Deviens un{" "}
              <span className="relative inline-block">
                renard.
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 5C20 2 80 2 100 5" stroke="currentColor" className="text-[var(--accent)]" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="home-lead">
              Des cours clairs, des exercices corrigés automatiquement et un parcours de progression, de la seconde au BTS.
            </p>

            <div className="relative z-50 max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--subtle)] pointer-events-none" size={20} />
              <input
                type="text"
                placeholder="Rechercher une notion (ex : boucles, listes…)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] focus:border-[var(--accent)] outline-none transition-colors text-base font-medium text-[var(--fg)]"
                style={{ boxShadow: "var(--shadow)" }}
              />
              {searchQuery.length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-[var(--surface)] rounded-[var(--radius)] border border-[var(--border)] overflow-hidden text-left" style={{ boxShadow: "var(--shadow)" }}>
                  {isSearching ? (
                    <div className="p-6 text-center text-[var(--muted)]">Recherche dans les cours... 🦊</div>
                  ) : results.length > 0 ? (
                    results.map((course) => (
                      <Link key={`${course.level}/${course.slug}`} href={`/cours/${course.level}/${course.slug}`} className="flex items-center justify-between p-4 hover:bg-[var(--surface-2)] transition-colors border-b border-[var(--border)] last:border-0">
                        <div>
                          <div className="font-semibold text-[var(--fg)]">{course.title}</div>
                          <div className="text-xs text-[var(--accent)] font-semibold">{course.category}</div>
                        </div>
                        <ChevronRight className="text-[var(--subtle)]" size={18} />
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-[var(--muted)] italic">Aucun cours trouvé pour cette notion.</div>
                  )}
                </div>
              )}
            </div>
            <div className="home-quick">
              {QUICK_SEARCHES.map((query) => (
                <button key={query} type="button" onClick={() => setSearchQuery(query)}>
                  {query}
                </button>
              ))}
            </div>
            {student ? null : (
              <div className="home-cta">
                <a href="#niveaux" className="home-btn">Choisir mon niveau ↓</a>
                <Link href="/connexion" className="home-btn-ghost">Se connecter</Link>
              </div>
            )}
          </div>

          <div className="home-stage">
            <SplashText compact className="home-splash" />
            <Image src="/images/fox_assis.svg" alt="Le renard de la tanière" width={360} height={360} priority className="home-stage-fox" />
            {dashboard ? (
              <>
                {dashboard.badges[0] ? (
                  <div className="home-chip home-chip-1">
                    <Image src={dashboard.badges[0].src} alt="" width={30} height={30} />
                    <span>
                      Dernier badge<small>{dashboard.badges[0].name}</small>
                    </span>
                  </div>
                ) : null}
                <div className="home-chip home-chip-2">
                  <span>
                    🔥 {dashboard.exercisesCount} exercice{dashboard.exercisesCount > 1 ? "s" : ""} réussi{dashboard.exercisesCount > 1 ? "s" : ""}
                    <small>depuis le début</small>
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="home-chip home-chip-1">
                  <span>
                    ✅ Exercices corrigés<small>automatiquement</small>
                  </span>
                </div>
                <div className="home-chip home-chip-2">
                  <span>
                    🏅 Des badges<small>à chaque fiche réussie</small>
                  </span>
                </div>
              </>
            )}
          </div>
        </header>

        {dashboard ? <ResumeBand dashboard={dashboard} /> : null}

        <main className="relative z-10 pb-24">
          <section id="niveaux" className="scroll-mt-28">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-2xl font-semibold text-[var(--fg)] tracking-tight">
                Parcourir par <span className="text-[var(--accent)]">niveaux</span>
              </h2>
              <p className="text-sm font-medium text-[var(--subtle)]">
                {student ? "Ton niveau est mis en avant, avec ta progression." : "De la découverte au BTS : choisis ton niveau."}
              </p>
            </div>
            <div className="home-bento">
              {levels.map((level, index) => {
                const mine = dashboard?.level?.folder === level.folder;
                const percent = mine ? dashboard?.level?.percent ?? 0 : 0;
                return (
                  <Link
                    key={level.folder}
                    href={`/cours/${level.urlSlug}`}
                    data-level={level.folder}
                    className={`home-bt ${level.folder === "2" ? "is-big" : ""} ${mine ? "is-mine" : ""}`}
                  >
                    <span className="home-bt-step">{index + 1}</span>
                    <span className="home-bt-txt">
                      <span className="home-bt-aud">
                        {mine ? "Mon niveau · " : ""}
                        {level.audience}
                      </span>
                      <h3>{level.label}</h3>
                      <span className="home-bt-desc">{level.description}</span>
                      {mine ? (
                        <>
                          <span className="home-bt-prog">
                            <i style={{ width: `${percent}%` }} />
                          </span>
                          <span className="home-bt-meta">{percent} % terminé · Continuer →</span>
                        </>
                      ) : (
                        <span className="home-bt-meta">
                          {level.chapters} chapitre{level.chapters > 1 ? "s" : ""} · {level.resources} ressource
                          {level.resources > 1 ? "s" : ""} →
                        </span>
                      )}
                    </span>
                    <span className="home-bt-plate">
                      <Image src={level.image} alt="" width={240} height={240} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-[var(--fg)] mb-5 tracking-tight">
              Un peu plus de <span className="text-[var(--accent)]">renards</span>
            </h2>
            <div className="home-extras">
              <Link href="/academie" className="home-ex is-wide">
                <span className="home-ex-pic">
                  <Image src="/images/fox_act.png" alt="" width={92} height={92} />
                </span>
                <span>
                  <span className="home-eyebrow">Apprentissage Python</span>
                  <b>{GAME_NAME}</b>
                  <span className="home-ex-p">Fonctions, variables, conditions et boucles : guide le renard jusqu’à la poule.</span>
                  <span className="home-ex-link">
                    Jouer <ArrowRight size={14} />
                  </span>
                </span>
              </Link>
              <Link href="/enquetes" className="home-ex is-wide">
                <span className="home-ex-pic">
                  <Image src="/images/fox_enquetes.svg" alt="" width={98} height={92} />
                </span>
                <span>
                  <span className="home-eyebrow">Blocs, Python ou SQL</span>
                  <b>Enquêtes de la forêt</b>
                  <span className="home-ex-p">Fouille les registres des gardes, croise les témoignages et démasque les coupables.</span>
                  <span className="home-ex-link">
                    Enquêter <ArrowRight size={14} />
                  </span>
                </span>
              </Link>
              <Link href="/projets/chasse-aux-renards" className="home-ex">
                <span className="home-ex-pic">
                  <Image src="/images/fox_chasse_renard.png" alt="" width={70} height={70} />
                </span>
                <span>
                  <b>Chasse aux Ren’Arts</b>
                  <span className="home-ex-p">Les grands classiques revisités par les élèves.</span>
                </span>
              </Link>
              <Link href="/cours/c" className="home-ex">
                <span className="home-ex-pic">
                  <Image src="/images/fox_c.svg" alt="" width={74} height={70} />
                </span>
                <span>
                  <b>Programmation en C</b>
                  <span className="home-ex-p">Types, tableaux, fonctions, structures et tris.</span>
                </span>
              </Link>
              {privateCard.show ? (
                <div className="home-ex is-private">
                  <span className="home-ex-pic">
                    <Image src="/images/fox_2.png" alt="" width={70} height={70} />
                  </span>
                  <span className="min-w-0">
                    <b>Cours particuliers</b>
                    {privateCard.courses.length === 0 ? (
                      <span className="home-ex-p">Aucun cours particulier pour le moment.</span>
                    ) : (
                      <span className="home-ex-list">
                        {privateCard.courses.map((course) => (
                          <Link key={course.path} href={course.path}>
                            {course.title}
                          </Link>
                        ))}
                      </span>
                    )}
                  </span>
                </div>
              ) : null}
            </div>
          </section>
        </main>
      </div>

      <ColleagueTeaser />

      <footer className="border-t border-[var(--border)] py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[var(--subtle)] text-sm">© 2026 Clément Braun — NSI</div>
          <div className="flex items-center gap-6">
            <Link href="/outils-enseignants" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors text-sm font-medium">
              Outils enseignants
            </Link>
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
