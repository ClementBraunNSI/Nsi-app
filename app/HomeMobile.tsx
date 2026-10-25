"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, Medal, NotebookPen, Search } from "lucide-react";
import type { LandingPrivateCard } from "@/app/actions/coursePages";
import type { HomeDashboard } from "@/app/actions/home";
import SplashText from "@/components/SplashText";
import { AnimatedFox } from "@/components/home/AnimatedFox";
import { GAME_NAME } from "@/app/foxtest/academy/meta";
import type { HomeLevel } from "./HomeView";

export type HomeSearch = {
  query: string;
  setQuery: (value: string) => void;
  results: { title: string; slug: string; level: string; category: string }[];
  isSearching: boolean;
  quick: string[];
};

type Props = {
  levels: HomeLevel[];
  dashboard: HomeDashboard | null;
  privateCard: LandingPrivateCard;
  search: HomeSearch;
};

const ACTIVITIES = [
  {
    href: "/academie",
    image: "/images/fox_act.png",
    size: [112, 112],
    eyebrow: "Apprentissage Python",
    title: GAME_NAME,
    text: "Fonctions, variables, conditions et boucles : guide le renard jusqu'à la poule.",
    cta: "Jouer",
  },
  {
    href: "/enquetes",
    image: "/images/fox_enquetes.svg",
    size: [126, 118],
    eyebrow: "Blocs, Python ou SQL",
    title: "Enquêtes de la forêt",
    text: "Fouille les registres des gardes, croise les témoignages et démasque les coupables.",
    cta: "Enquêter",
  },
  {
    href: "/projets/chasse-aux-renards",
    image: "/images/fox_chasse_renard.png",
    size: [108, 108],
    eyebrow: "Projets d'élèves",
    title: "Chasse aux Ren'Arts",
    text: "Les grands classiques revisités par les élèves.",
    cta: "Visiter",
  },
  {
    href: "/cours/c",
    image: "/images/fox_c.svg",
    size: [118, 112],
    eyebrow: "Ouvert à tous",
    title: "Programmation en C",
    text: "Types, tableaux, fonctions, structures et tris.",
    cta: "Commencer",
  },
] as const;

function MobileGreeting({ dashboard }: { dashboard: HomeDashboard }) {
  const hour = new Date().getHours();
  const hello = hour < 5 || hour >= 18 ? "Bonsoir" : "Bonjour";
  const { firstName, level } = dashboard;
  return (
    <div className="hm-greet">
      <span className="home-avatar" aria-hidden="true">
        {(firstName || "?").charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0">
        <b>
          {hello}
          {firstName ? ` ${firstName}` : ""}
        </b>
        {level ? <span>Tu en es à {level.percent} % de {level.label}.</span> : null}
      </div>
    </div>
  );
}

function MobileResume({ dashboard }: { dashboard: HomeDashboard }) {
  const { resume, homework, badges, badgeCount, badgeTotal } = dashboard;
  const percent = resume && resume.total ? Math.round((resume.done / resume.total) * 100) : 0;
  const due = homework?.dueAt
    ? new Date(homework.dueAt).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })
    : null;
  return (
    <section className="hm-resume" aria-label="Reprendre">
      {resume ? (
        <Link href={resume.href} className="hm-continue">
          <span className="hm-continue-pic">
            <Image src={resume.badgeSrc || "/images/fox_2.png"} alt="" width={56} height={56} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="home-eyebrow">
              {resume.done > 0 ? "Reprendre" : "Prochaine étape"} : {resume.chapter}
            </span>
            <b className="hm-continue-title">{resume.title}</b>
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
          <ChevronRight size={20} className="hm-continue-go" aria-hidden />
        </Link>
      ) : (
        <Link href={dashboard.level?.href || "/espace"} className="hm-continue">
          <span className="min-w-0 flex-1">
            <span className="home-eyebrow">Bravo</span>
            <b className="hm-continue-title">Toutes les fiches de ton niveau sont terminées</b>
          </span>
          <ChevronRight size={20} className="hm-continue-go" aria-hidden />
        </Link>
      )}
      <div className="hm-minis">
        <Link href={homework?.href || "/espace"} className="hm-mini">
          <span className="hm-mini-k">
            <NotebookPen size={14} aria-hidden /> Devoir
          </span>
          <b>{homework ? homework.title : "Aucun devoir à rendre"}</b>
          {homework && due ? <span className="hm-mini-due">À rendre {due}</span> : null}
          {!homework ? <span className="hm-mini-p">Tout est à jour</span> : null}
        </Link>
        <Link href="/espace" className="hm-mini">
          <span className="hm-mini-k">
            <Medal size={14} aria-hidden /> Mes badges
          </span>
          <b>
            {badgeCount}
            {badgeTotal ? ` / ${badgeTotal}` : ""}
          </b>
          {badges.length > 0 ? (
            <span className="hm-mini-badges">
              {badges.slice(0, 3).map((badge) => (
                <Image key={badge.courseId} src={badge.src} alt={badge.name} width={30} height={30} />
              ))}
            </span>
          ) : (
            <span className="hm-mini-p">Valide une fiche pour gagner ton premier badge.</span>
          )}
        </Link>
      </div>
    </section>
  );
}

/** Accueil du téléphone : une composition à part, pensée pour le pouce, et non l'accueil de l'ordinateur empilé. */
export default function HomeMobile({ levels, dashboard, privateCard, search }: Props) {
  const { query, setQuery, results, isSearching, quick } = search;

  return (
    <div className="hm">
      {dashboard ? (
        <>
          <MobileGreeting dashboard={dashboard} />
          {/* Sur téléphone, l'élève connecté retrouve sa fiche en cours dès le premier écran. */}
          <MobileResume dashboard={dashboard} />
        </>
      ) : null}

      <header className="hm-hero">
        <SplashText compact className="hm-splash" />
        <h1 className="hm-title">
          Maîtrise le <span className="text-[var(--accent)]">code.</span>
          <br />
          Deviens un{" "}
          <span className="relative inline-block">
            renard.
            <svg className="absolute -bottom-1.5 left-0 w-full" height="7" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 5C20 2 80 2 100 5" stroke="currentColor" className="text-[var(--accent)]" strokeWidth="4" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </h1>
        <div className="hm-hero-row">
          <p className="hm-lead">
            Des cours clairs, des exercices corrigés automatiquement et un parcours de progression, de la seconde au BTS.
          </p>
          <span className="hm-fox-box">
            <AnimatedFox className="hm-fox" />
          </span>
        </div>
      </header>

      <div className="hm-search" role="search">
        <Search className="hm-search-icon" size={19} aria-hidden />
        <input
          type="search"
          enterKeyHint="search"
          placeholder="Rechercher une notion"
          aria-label="Rechercher une notion (ex : boucles, listes)"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {query.length > 1 ? (
          <div className="hm-search-results">
            {isSearching ? (
              <p className="hm-search-empty">Recherche dans les cours</p>
            ) : results.length > 0 ? (
              results.map((course) => (
                <Link key={`${course.level}/${course.slug}`} href={`/cours/${course.level}/${course.slug}`}>
                  <span className="min-w-0">
                    <b>{course.title}</b>
                    <small>{course.category}</small>
                  </span>
                  <ChevronRight size={18} aria-hidden />
                </Link>
              ))
            ) : (
              <p className="hm-search-empty">Aucun cours trouvé pour cette notion.</p>
            )}
          </div>
        ) : null}
      </div>
      <div className="hm-chips" aria-label="Recherches rapides">
        {quick.map((item) => (
          <button key={item} type="button" onClick={() => setQuery(item)} aria-pressed={query === item}>
            {item}
          </button>
        ))}
      </div>

      <section id="niveaux-mobile" className="hm-section">
        <h2 className="hm-h2">
          {dashboard?.level ? "Ton " : "Choisis ton "}
          <span className="text-[var(--accent)]">niveau</span>
        </h2>
        <p className="hm-sub">De la découverte au BTS, un pas après l'autre.</p>
        <ol className="hm-trail">
          {levels.map((level, index) => {
            const mine = dashboard?.level?.folder === level.folder;
            const percent = mine ? dashboard?.level?.percent ?? 0 : 0;
            return (
              <li key={level.folder} data-level={level.folder} className={`hm-step${mine ? " is-mine" : ""}${level.folder === "2" ? " is-featured" : ""}`}>
                <span className="hm-node" aria-hidden="true">
                  {index + 1}
                </span>
                <Link href={`/cours/${level.urlSlug}`} className="hm-level">
                  <span className="hm-level-txt">
                    <span className="hm-level-aud">{mine ? `Mon niveau, ${level.audience.toLowerCase()}` : level.audience}</span>
                    <b>{level.label}</b>
                    {mine ? (
                      <>
                        <span className="hm-level-prog">
                          <i style={{ width: `${percent}%` }} />
                        </span>
                        <span className="hm-level-meta">{percent} % terminé</span>
                      </>
                    ) : (
                      <span className="hm-level-meta">
                        {level.chapters} chapitre{level.chapters > 1 ? "s" : ""}, {level.resources} ressource
                        {level.resources > 1 ? "s" : ""}
                      </span>
                    )}
                  </span>
                  <span className="hm-level-pic">
                    <Image src={level.image} alt="" width={64} height={64} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="hm-section">
        <h2 className="hm-h2">
          Un peu plus de <span className="text-[var(--accent)]">renards</span>
        </h2>
        <div className="hm-rail">
          {ACTIVITIES.map((activity) => (
            <Link key={activity.href} href={activity.href} className="hm-card">
              <span className="hm-card-pic">
                <Image src={activity.image} alt="" width={activity.size[0]} height={activity.size[1]} />
              </span>
              <span className="hm-card-body">
                <span className="home-eyebrow">{activity.eyebrow}</span>
                <b>{activity.title}</b>
                <span className="hm-card-p">{activity.text}</span>
                <span className="hm-card-link">
                  {activity.cta} <ArrowRight size={14} aria-hidden />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {privateCard.show ? (
        <section className="hm-private">
          <span className="hm-private-pic">
            <Image src="/images/fox_2.png" alt="" width={56} height={56} />
          </span>
          <div className="min-w-0">
            <b>Cours particuliers</b>
            {privateCard.courses.length === 0 ? (
              <p>Aucun cours particulier pour le moment.</p>
            ) : (
              <ul>
                {privateCard.courses.map((course) => (
                  <li key={course.path}>
                    <Link href={course.path}>{course.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
