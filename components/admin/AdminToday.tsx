import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import {
  dateKindLabel,
  dayLabel,
  parisParts,
  timeLabel,
  todaySummary,
  untilLabel,
  type AdminTodayData,
  type AdminTodayExtra,
} from "@/lib/admin-today";

const longDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const NO_EXTRA: AdminTodayExtra = { grades: { total: 0, title: null }, bugs: 0, watch: [], watchMore: 0, next: null };

function ago(iso: string, now: Date) {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  return `il y a ${days} j`;
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

/**
 * Page d'accueil de l'admin : le prochain passage en classe, ce qui attend une correction, les élèves à surveiller,
 * la semaine, puis les classes. Données déjà calculées (lib/admin-today), limitées à la classe de la barre du haut.
 */
export function AdminToday({
  data,
  extra = NO_EXTRA,
  classLabel = "Toutes les classes",
  showClasses = true,
  now: nowIso,
  base = "/admin",
}: {
  data: AdminTodayData;
  extra?: AdminTodayExtra;
  classLabel?: string;
  showClasses?: boolean;
  now: string;
  base?: string;
}) {
  const now = new Date(nowIso);
  const href = (path: string) => `${base}${path}`;
  const hour = Number(parisParts(now)[1].slice(0, 2));
  const hello = hour < 5 || hour >= 18 ? "Bonsoir" : "Bonjour";
  const challenge = data.challenge;
  const next = extra.next;
  const todo = [
    {
      key: "notes",
      label: "Notes à valider",
      count: extra.grades.total,
      hint: extra.grades.total ? extra.grades.title ?? "Copies d'évaluation" : "Aucune copie en attente",
    },
    {
      key: "ecrits",
      label: "Réponses écrites",
      count: data.pending.total,
      hint: data.pending.oldestAt ? `la plus ancienne : ${ago(data.pending.oldestAt, now)}` : "Aucune réponse en attente",
    },
    { key: "messages", label: "Messages", count: data.unread.total, hint: data.unread.total ? `non lu${data.unread.total > 1 ? "s" : ""}` : "Tout est lu" },
    { key: "bugs", label: "Bugs signalés", count: extra.bugs, hint: extra.bugs ? "à regarder" : "Aucun nouveau signalement" },
  ];
  const nothingToDo = todo.every((item) => item.count === 0);

  return (
    <div className="admin-today">
      <header className="admin-today-head">
        <p className="admin-kicker">
          {longDay.format(now)} · {classLabel}
        </p>
        <h1>{hello}.</h1>
        <p className="admin-hero-lead">{todaySummary(data, now)}</p>
      </header>

      {next ? (
        <section className="admin-next" aria-label="Prochain passage en classe">
          <div className="min-w-0">
            <p>
              <span className={`admin-pill ${next.open ? "is-ok" : "is-accent"}`}>{next.open ? "En cours" : next.at ? untilLabel(next.at, now) : "Programmée"}</span>{" "}
              <b>Évaluation « {next.title} »</b>
            </p>
            <p className="admin-muted">
              {next.open
                ? `Ouverte pour ${next.classes.join(", ") || "aucune classe"}.`
                : `S'ouvrira toute seule${next.at ? ` à ${timeLabel(parisParts(new Date(next.at))[1])}` : ""} pour ${next.classes.join(", ") || "aucune classe"}.`}
            </p>
          </div>
          <div className="admin-next-actions">
            <Link href={href(`/evaluations/${next.id}`)} className="admin-btn is-quiet">
              Voir le sujet
            </Link>
            <Link href={href("/classe")} className="admin-btn is-dark">
              <Radio size={15} aria-hidden /> Ouvrir le suivi en direct
            </Link>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="admin-todo">
        <h2 id="admin-todo" className="admin-sec">
          À traiter <small>{nothingToDo ? "tout est à jour" : "chaque carte ouvre la file au bon endroit"}</small>
        </h2>
        <div className="admin-count-grid">
          {todo.map((item) => (
            <Link key={item.key} href={href(`/a-corriger?type=${item.key}`)} className={`admin-card admin-count${item.count ? " is-hot" : ""}`}>
              <span className="admin-count-k">{item.label}</span>
              <span className="admin-big">{item.count}</span>
              <span className="admin-count-hint">{item.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="admin-duo">
        <section className="admin-card" aria-labelledby="admin-watch">
          <h2 id="admin-watch" className="admin-card-h">
            Élèves à surveiller <small>saisies suspectes, puis inactifs depuis 7 jours</small>
          </h2>
          {extra.watch.length ? (
            <ul className="admin-lines">
              {extra.watch.map((student) => (
                <li key={student.id}>
                  <span>
                    <b>{student.name}</b> · <span className={student.tone === "warn" ? "admin-text-warn" : ""}>{student.reason}</span>
                  </span>
                  <span>
                    <Link href={href(`/eleves/${student.id}`)} className="admin-mini">
                      Fiche
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="admin-muted">Personne à signaler : tout le monde a travaillé cette semaine.</span>
          )}
          {extra.watchMore ? (
            <Link href={href("/eleves?inactifs=1")} className="admin-link">
              Et {extra.watchMore} autre{extra.watchMore > 1 ? "s" : ""} : voir la liste
            </Link>
          ) : null}
        </section>

        <section className="admin-card" aria-labelledby="admin-week">
          <h2 id="admin-week" className="admin-card-h">
            Cette semaine
          </h2>
          <ul className="admin-lines">
            {challenge ? (
              <li>
                <span>
                  <Link href={href(`/defis/${challenge.id}`)}>
                    <span className="admin-pill is-accent">Défi</span> {challenge.title}
                  </Link>
                </span>
                <span>
                  {challenge.open
                    ? `${challenge.passed} / ${challenge.students || "?"} réussis`
                    : `ouvre ${dayLabel(parisParts(new Date(challenge.opensAt))[0], now)}`}
                </span>
              </li>
            ) : null}
            {data.homework.map((row) => (
              <li key={row.id}>
                <span>
                  <Link href={href("/devoirs#devoirs-classe")}>
                    <span className="admin-pill">Devoir</span> {row.title} <span className="admin-subtle">· {row.classe}</span>
                  </Link>
                </span>
                <span>
                  {row.done} / {row.total || "?"}
                  {row.dueAt ? ` · ${dayLabel(parisParts(new Date(row.dueAt))[0], now)}` : ""}
                </span>
              </li>
            ))}
            {data.dates.map((date) => (
              <li key={date.key}>
                <span>
                  <Link href={date.href.replace("/admin", base)}>
                    <span className={`admin-pill is-${date.kind}`}>{dateKindLabel(date.kind)}</span> {date.title}
                    {date.who ? <span className="admin-subtle"> · {date.who}</span> : null}
                  </Link>
                </span>
                <span>
                  {dayLabel(date.day, now)}
                  {date.time ? ` ${timeLabel(date.time)}` : ""}
                </span>
              </li>
            ))}
          </ul>
          {!challenge && !data.homework.length && !data.dates.length ? <span className="admin-muted">Rien de programmé pour le moment.</span> : null}
          {challenge?.open ? (
            <Bar
              parts={
                challenge.students
                  ? [(challenge.passed / challenge.students) * 100, ((challenge.submitted - challenge.passed) / challenge.students) * 100]
                  : [0]
              }
            />
          ) : null}
          <Link href={href("/preparer")} className="admin-link">
            Préparer la semaine
          </Link>
        </section>
      </div>

      {showClasses ? (
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
      ) : null}
    </div>
  );
}
