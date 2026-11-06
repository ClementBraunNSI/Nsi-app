import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lock, Plus } from "lucide-react";
import { AnimatedFox } from "@/components/home/AnimatedFox";
import {
  dateKindLabel,
  dayLabel,
  parisParts,
  timeLabel,
  todaySummary,
  type AdminTodayData,
} from "@/lib/admin-today";

const QUICK_ACTIONS = [
  { label: "Annonce", path: "/annonces#nouvelle" },
  { label: "Devoir de classe", path: "/devoirs#devoirs-classe" },
  { label: "Interro ou DS", path: "/devoirs#interros" },
  { label: "Défi", path: "/defis?nouveau=1" },
  { label: "Évaluation", path: "/evaluations?nouveau=1" },
  { label: "Élève", path: "/eleves?nouveau=1" },
];

const longDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });

function ago(iso: string, now: Date) {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} j`;
}

function shortWhen(iso: string | null, now: Date) {
  if (!iso) return "";
  const [day, time] = parisParts(new Date(iso));
  const label = dayLabel(day, now);
  return label === "aujourd'hui" ? timeLabel(time) : label;
}

function Bar({ parts }: { parts: number[] }) {
  return (
    <span className="admin-bar" aria-hidden>
      {parts.map((value, index) => (
        <i key={index} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      ))}
    </span>
  );
}

/** Page d'accueil de l'admin : à traiter, la semaine, les classes. Données déjà calculées (lib/admin-today). */
export function AdminToday({ data, now: nowIso, base = "/admin" }: { data: AdminTodayData; now: string; base?: string }) {
  const now = new Date(nowIso);
  const href = (path: string) => `${base}${path}`;
  const hour = Number(parisParts(now)[1].slice(0, 2));
  const hello = hour < 5 || hour >= 18 ? "Bonsoir" : "Bonjour";
  const challenge = data.challenge;
  const nothingToDo = !data.pending.total && !data.unread.total && !data.evaluations.length;

  return (
    <div className="admin-today">
      <header className="admin-hero">
        <div className="min-w-0">
          <p className="admin-eyebrow">Espace enseignant</p>
          <h1>
            {hello}, <span>{longDay.format(now)}</span>
          </h1>
          <p className="admin-hero-lead">{todaySummary(data, now)}</p>
          <nav className="admin-quick" aria-label="Créer">
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.path} href={href(action.path)}>
                <Plus size={14} aria-hidden /> {action.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="admin-hero-fox" aria-hidden>
          <AnimatedFox className="admin-hero-fox-svg" seasonal />
        </div>
      </header>

      <section aria-labelledby="admin-todo">
        <h2 id="admin-todo" className="admin-sec">
          À traiter <small>{nothingToDo ? "tout est à jour" : "chaque carte se vide quand c'est fait"}</small>
        </h2>
        <div className="admin-todo">
          <Link href={href("/corrections")} className={`admin-card${data.pending.total ? " is-hot" : ""}`}>
            <span className="admin-card-k">
              <span>Réponses écrites à corriger</span>
              {data.pending.oldestAt ? <span className="admin-pill is-accent">la plus ancienne : {ago(data.pending.oldestAt, now)}</span> : null}
            </span>
            <span className="admin-big">
              {data.pending.total}
              <small>{data.pending.total > 1 ? "réponses" : "réponse"}</small>
            </span>
            {data.pending.items.length ? (
              <ul className="admin-lines">
                {data.pending.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      <b>{item.who}</b> · {item.what}
                    </span>
                    <span>{item.classe ?? ""}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="admin-muted">Aucune réponse en attente.</span>
            )}
            {data.pending.total ? <span className="admin-cta">Corriger</span> : <span className="admin-link">Voir les corrections</span>}
          </Link>

          <Link href={href("/messages")} className="admin-card">
            <span className="admin-card-k">
              <span>Messages non lus</span>
              {data.unread.total ? <span className="admin-pill is-accent">{data.unread.total}</span> : null}
            </span>
            {data.unread.items.length ? (
              <ul className="admin-lines">
                {data.unread.items.map((item) => (
                  <li key={item.id}>
                    <span>
                      <b>{item.name}</b>
                      {item.count > 1 ? ` (${item.count})` : ""}
                    </span>
                    <span>{shortWhen(item.at, now)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="admin-muted">Aucun message en attente.</span>
            )}
            <span className="admin-link">Ouvrir la messagerie</span>
          </Link>

          {data.evaluations.length ? (
            <div className="admin-card admin-card-list">
              <span className="admin-card-k">
                <span>{data.evaluations.length > 1 ? "Évaluations ouvertes" : "Évaluation ouverte"}</span>
              </span>
              {data.evaluations.slice(0, 2).map((evaluation) => (
                <Link key={evaluation.id} href={href(`/evaluations/${evaluation.id}`)} className="admin-eval">
                  <b>{evaluation.title}</b>
                  <span className="admin-eval-meta">
                    <span className="admin-pill">
                      {evaluation.classes.join(", ") || "Aucune classe"} · {evaluation.submitted} / {evaluation.attempts} rendues
                    </span>
                    {evaluation.locked ? (
                      <span className="admin-pill is-warn">
                        <Lock size={12} aria-hidden /> {evaluation.locked} verrouillé{evaluation.locked > 1 ? "s" : ""}
                      </span>
                    ) : null}
                  </span>
                  <Bar parts={[evaluation.attempts ? (evaluation.submitted / evaluation.attempts) * 100 : 0]} />
                </Link>
              ))}
              <Link href={href("/evaluations")} className="admin-link">
                Suivre en direct
              </Link>
            </div>
          ) : (
            <Link href={href("/evaluations")} className="admin-card">
              <span className="admin-card-k">
                <span>Évaluations</span>
              </span>
              <span className="admin-muted">Aucune évaluation ouverte en ce moment.</span>
              <span className="admin-link">Préparer une évaluation</span>
            </Link>
          )}
        </div>
      </section>

      <section aria-labelledby="admin-week">
        <h2 id="admin-week" className="admin-sec">
          À venir
        </h2>
        <div className="admin-week">
          {challenge ? (
            <Link href={href(`/defis/${challenge.id}`)} className="admin-card">
              <span className="admin-card-k">
                <span>Défi du lundi</span>
                <span className={`admin-pill ${challenge.open ? "is-ok" : ""}`}>
                  {challenge.open
                    ? `ouvert jusqu'à ${dayLabel(parisParts(new Date(challenge.closesAt))[0], now)}`
                    : `ouvre ${dayLabel(parisParts(new Date(challenge.opensAt))[0], now)}`}
                </span>
              </span>
              <b className="admin-card-title">{challenge.title}</b>
              <span className="admin-muted">
                {challenge.classes.join(", ")} · {challenge.students} élève{challenge.students > 1 ? "s" : ""}
              </span>
              {challenge.open ? (
                <>
                  <Bar
                    parts={
                      challenge.students
                        ? [(challenge.passed / challenge.students) * 100, ((challenge.submitted - challenge.passed) / challenge.students) * 100]
                        : [0]
                    }
                  />
                  <span className="admin-card-k">
                    <span>
                      {challenge.passed} réussi{challenge.passed > 1 ? "s" : ""} · {challenge.submitted - challenge.passed} en cours
                    </span>
                    <span>{Math.max(0, challenge.students - challenge.submitted)} pas commencé</span>
                  </span>
                </>
              ) : null}
            </Link>
          ) : (
            <Link href={href("/defis?nouveau=1")} className="admin-card">
              <span className="admin-card-k">
                <span>Défi du lundi</span>
              </span>
              <span className="admin-muted">Aucun défi ouvert ni programmé.</span>
              <span className="admin-link">Programmer un défi</span>
            </Link>
          )}

          <Link href={href("/devoirs#interros")} className="admin-card">
            <span className="admin-card-k">
              <span>Prochaines dates</span>
            </span>
            {data.dates.length ? (
              <ul className="admin-lines">
                {data.dates.map((date) => (
                  <li key={date.key}>
                    <span>
                      <span className={`admin-pill is-${date.kind}`}>{dateKindLabel(date.kind)}</span> {date.title}
                      {date.who ? <span className="admin-subtle"> · {date.who}</span> : null}
                    </span>
                    <span>
                      {dayLabel(date.day, now)}
                      {date.time ? ` ${timeLabel(date.time)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="admin-muted">Aucune interro, DS, visio ou cours programmé.</span>
            )}
            <span className="admin-link">Devoirs et dates</span>
          </Link>

          <Link href={href("/devoirs#devoirs-classe")} className="admin-card">
            <span className="admin-card-k">
              <span>Devoirs de classe en cours</span>
            </span>
            {data.homework.length ? (
              <ul className="admin-lines">
                {data.homework.map((row) => (
                  <li key={row.id}>
                    <span>
                      {row.title} <span className="admin-subtle">· {row.classe}</span>
                    </span>
                    <span>
                      {row.done} / {row.total || "?"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="admin-muted">Aucun devoir de classe en cours.</span>
            )}
            <span className="admin-link">Tous les devoirs</span>
          </Link>
        </div>
      </section>

      <section aria-labelledby="admin-classes">
        <h2 id="admin-classes" className="admin-sec">
          Mes classes <small>inactif : aucune activité depuis 7 jours</small>
        </h2>
        <div className="admin-classes">
          {data.classes.map((tile) => (
            <Link
              key={tile.key}
              href={href(`/eleves?classe=${encodeURIComponent(tile.key)}`)}
              className={`admin-class${tile.folder ? "" : " is-plain"}`}
              data-level={tile.folder ?? undefined}
            >
              <small>{tile.levelLabel}</small>
              <b>{tile.label}</b>
              <span className="admin-class-meta">
                {tile.total} élève{tile.total > 1 ? "s" : ""} ·{" "}
                {tile.inactive ? `${tile.inactive} inactif${tile.inactive > 1 ? "s" : ""}` : "tous actifs"}
              </span>
              <span className="admin-class-plate" aria-hidden>
                <Image src={tile.image} alt="" width={72} height={72} />
              </span>
            </Link>
          ))}
          {data.privateStudents ? (
            <Link href={href("/eleves?public=particuliers")} className="admin-class" data-level="particuliers">
              <small>Hors classe</small>
              <b>Cours particuliers</b>
              <span className="admin-class-meta">
                {data.privateStudents} élève{data.privateStudents > 1 ? "s" : ""}
              </span>
              <span className="admin-class-plate" aria-hidden>
                <Image src="/images/fox_2.png" alt="" width={72} height={72} />
              </span>
            </Link>
          ) : null}
          {!data.classes.length && !data.privateStudents ? (
            <p className="admin-muted">
              Aucun élève inscrit. <Link href={href("/eleves?nouveau=1")}>Ajouter un élève <ArrowRight size={12} aria-hidden /></Link>
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
