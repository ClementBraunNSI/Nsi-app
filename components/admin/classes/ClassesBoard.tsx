"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Mail, Search, TrendingDown, TrendingUp } from "lucide-react";
import { useAdminClass } from "@/components/admin/AdminClassContext";
import { ADMIN_PRIVATE } from "@/lib/admin-class";
import { averageBins, rankStudents, type BoardEvaluation, type BoardGrade, type BoardStudent, type ClassesBoard as Board, type Stats } from "@/lib/admin-classes";

const num = (value: number | null | undefined, digits = 1) =>
  value === null || value === undefined ? "—" : value.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const grade = (value: number) => value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const range = (low: number | null, high: number | null) => (low === null || high === null ? "—" : `${num(low)} – ${num(high)}`);
const shortDate = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Paris" });
const plural = (count: number, word: string) => `${count} ${word}${count > 1 ? "s" : ""}`;

/** Colonne triée : rang, nom, classe, moyenne, défis ou l'identifiant d'une évaluation. */
type SortKey = string;

/** Histogramme des moyennes par tranches de 2 points ; le survol d'une barre donne les élèves. */
function Histogram({ students }: { students: BoardStudent[] }) {
  const graded = students.filter((student) => student.average !== null);
  const bins = averageBins(graded.map((student) => student.average!));
  const W = 420;
  const H = 200;
  const left = 26;
  const bottom = 24;
  const top = 8;
  const peak = Math.max(4, ...bins.map((bin) => bin.count));
  const step = peak > 8 ? 4 : 2;
  const ceiling = Math.ceil(peak / step) * step;
  const x = (value: number) => left + (value / 20) * (W - left - 4);
  const y = (count: number) => top + (1 - count / ceiling) * (H - top - bottom);
  const width = x(2) - x(0);
  return (
    <figure className="admin-hist">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Moyennes de la classe par tranche de 2 points : ${bins.map((bin) => `${bin.from} à ${bin.to} : ${bin.count}`).join(", ")}`}>
        {Array.from({ length: ceiling / step + 1 }, (_, index) => index * step).map((count) => (
          <g key={count} className="admin-hist-grid">
            <line x1={left} x2={W - 4} y1={y(count)} y2={y(count)} />
            <text x={left - 6} y={y(count) + 4} textAnchor="end">
              {count}
            </text>
          </g>
        ))}
        {bins.map((bin) => {
          const names = graded.filter((student) => Math.min(9, Math.floor(student.average! / 2)) === bin.from / 2);
          const barTop = y(bin.count);
          const radius = Math.min(4, (y(0) - barTop) / 2, (width - 2) / 2);
          const x0 = x(bin.from) + 1;
          const x1 = x0 + width - 2;
          return (
            <g key={bin.from} className="admin-hist-bar">
              <title>{`${bin.from} à ${bin.to} : ${plural(bin.count, "élève")}${names.length ? `\n${names.map((student) => `${student.name} (${grade(student.average!)})`).join("\n")}` : ""}`}</title>
              <rect x={x(bin.from)} y={top} width={width} height={H - top - bottom} fill="transparent" />
              {bin.count ? <path d={`M${x0},${y(0)} V${barTop + radius} Q${x0},${barTop} ${x0 + radius},${barTop} H${x1 - radius} Q${x1},${barTop} ${x1},${barTop + radius} V${y(0)} Z`} /> : null}
            </g>
          );
        })}
        <line className="admin-hist-ten" x1={x(10)} x2={x(10)} y1={top} y2={y(0)} />
        {[0, 4, 8, 10, 12, 16, 20].map((value) => (
          <text key={value} x={x(value)} y={H - 6} textAnchor="middle">
            {value}
          </text>
        ))}
      </svg>
      <figcaption className="admin-subtle">Pointillés : 10/20. Survoler une barre pour voir les élèves.</figcaption>
    </figure>
  );
}

function Trend({ student }: { student: BoardStudent }) {
  const { trend } = student;
  if (trend === null) return <span className="admin-trend">—</span>;
  if (trend >= 1.5)
    return (
      <span className="admin-trend is-up" title="Dernière note au-dessus de sa moyenne">
        <TrendingUp size={15} aria-hidden /> +{num(trend)}
      </span>
    );
  if (trend <= -1.5)
    return (
      <span className="admin-trend is-down" title="Dernière note sous sa moyenne">
        <TrendingDown size={15} aria-hidden /> −{num(-trend)}
      </span>
    );
  return <span className="admin-trend">stable</span>;
}

function GradeCell({ value }: { value: BoardGrade | undefined }) {
  if (value === undefined) return <td className="admin-num">—</td>;
  if (value === "pending")
    return (
      <td className="admin-num">
        <span className="admin-note is-wait" title="Copie rendue, note pas encore validée">
          à corriger
        </span>
      </td>
    );
  return (
    <td className="admin-num">
      <span className={`admin-note${value < 10 ? " is-low" : ""}`}>{grade(value)}</span>
    </td>
  );
}

/** Élèves classés par moyenne : tri par colonne, filtre par nom, fiche et message à un clic. */
function Ranking({ students, evaluations, showClass, challenges }: { students: BoardStudent[]; evaluations: BoardEvaluation[]; showClass: boolean; challenges: Record<string, number> }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "rank", dir: 1 });
  const ranked = useMemo(() => rankStudents(students), [students]);
  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    const value = (student: BoardStudent): number | string | null => {
      if (sort.key === "rank") return ranked.indexOf(student);
      if (sort.key === "avg") return student.average;
      if (sort.key === "name") return student.name;
      if (sort.key === "classe") return student.classe;
      if (sort.key === "defis") return student.challengesPassed;
      const cell = student.grades[sort.key];
      return typeof cell === "number" ? cell : null;
    };
    return ranked
      .filter((student) => !words || student.name.toLowerCase().includes(words))
      .sort((a, b) => {
        const left = value(a);
        const right = value(b);
        if (left === null) return right === null ? 0 : 1;
        if (right === null) return -1;
        return typeof left === "string" ? sort.dir * left.localeCompare(String(right), "fr") : sort.dir * (left - Number(right));
      });
  }, [ranked, query, sort]);

  const header = (key: SortKey, label: string, first: 1 | -1 = -1) => (
    <button
      type="button"
      className="admin-sort"
      aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
      onClick={() => setSort(sort.key === key ? { key, dir: sort.dir === 1 ? -1 : 1 } : { key, dir: first })}
    >
      {label}
    </button>
  );

  return (
    <section className="admin-page-section" aria-labelledby="classes-ranking">
      <div className="admin-section-head">
        <h2 id="classes-ranking" className="admin-sec">
          Élèves classés par moyenne <small>{plural(students.length, "élève")} · un clic sur un nom ouvre sa fiche</small>
        </h2>
        <label className="admin-search">
          <Search size={16} aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filtrer les élèves…" aria-label="Filtrer les élèves" />
        </label>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{header("rank", "Rang", 1)}</th>
              <th>{header("name", "Élève", 1)}</th>
              {showClass ? <th>{header("classe", "Classe", 1)}</th> : null}
              <th>{header("avg", "Moyenne")}</th>
              {evaluations.map((evaluation) => (
                <th key={evaluation.id} className="admin-num">
                  {header(evaluation.id, evaluation.title)}
                </th>
              ))}
              <th className="admin-num">{header("defis", "Défis")}</th>
              <th>Tendance</th>
              <th>
                <span className="sr-only">Message</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((student) => (
              <tr key={student.id}>
                <td className={`admin-rank${student.rank !== null && student.rank <= 3 ? " is-top" : ""}`}>{student.rank ?? "—"}</td>
                <td>
                  <Link href={`/admin/eleves/${student.id}`} className="admin-who-name">
                    {student.name}
                  </Link>
                </td>
                {showClass ? <td>{student.classe}</td> : null}
                <td>
                  <span className="admin-avg">
                    <b className={student.average !== null && student.average < 10 ? "is-low" : ""}>{num(student.average, 2)}</b>
                    <span className="admin-meter" aria-hidden>
                      <i style={{ width: `${((student.average ?? 0) / 20) * 100}%` }} />
                    </span>
                  </span>
                </td>
                {evaluations.map((evaluation) => (
                  <GradeCell key={evaluation.id} value={student.grades[evaluation.id]} />
                ))}
                <td className="admin-num">
                  {student.challengesPassed}/{challenges[student.classe] ?? 0}
                </td>
                <td>
                  <Trend student={student} />
                </td>
                <td className="admin-num">
                  <Link href={`/admin/messages?eleve=${student.id}`} className="admin-icon-btn" title={`Écrire à ${student.name}`} aria-label={`Écrire à ${student.name}`}>
                    <Mail size={16} aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
            {shown.length === 0 ? (
              <tr>
                <td colSpan={8 + evaluations.length} className="admin-muted">
                  Aucun élève ne correspond.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Figures({ stats }: { stats: Stats }) {
  const items: [string, string][] = [
    ["Moyenne", num(stats.mean)],
    ["Médiane", num(stats.median)],
    ["Écart-type", num(stats.sd)],
    ["Q1 – Q3", range(stats.q1, stats.q3)],
    ["Min – max", range(stats.min, stats.max)],
    ["Sous 10", plural(stats.below, "élève")],
  ];
  return (
    <dl className="admin-figures">
      {items.map(([label, value]) => (
        <div key={label} className="admin-card">
          <dt className="admin-card-k">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Onglet « Classes » : une carte par classe, la classe choisie en détail, ou la comparaison de toutes les classes. */
export function ClassesBoard({ board }: { board: Board }) {
  const { selection, label, select } = useAdminClass();
  const chosen = board.classes.find((item) => item.name === selection) ?? null;
  const challenges = Object.fromEntries(board.classes.map((item) => [item.name, item.challenges]));

  if (selection === ADMIN_PRIVATE) {
    return (
      <div className="admin-page">
        <header className="admin-page-head">
          <div>
            <p className="admin-kicker">Classes · {label}</p>
            <h1>Cours particuliers</h1>
          </div>
        </header>
        <p className="admin-card admin-muted">Pas de moyenne de classe pour les cours particuliers. Choisis une classe dans la barre du haut.</p>
      </div>
    );
  }

  const students = chosen ? board.students.filter((student) => student.classe === chosen.name) : board.students;
  const evaluations = chosen ? board.evaluations.filter((evaluation) => evaluation.byClass[chosen.name]) : [];

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Classes · {label}</p>
          <h1>{chosen ? chosen.name : "Vue d'ensemble"}</h1>
          <p>Moyennes calculées sur les notes validées. Une copie encore à corriger s&apos;affiche en gris et ne compte pas.</p>
        </div>
      </header>

      {board.classes.length ? (
        <div className="admin-classes">
          {board.classes.map((item) => (
            <button
              key={item.name}
              type="button"
              className={`admin-class${item.folder ? "" : " is-plain"}${item.name === selection ? " is-on" : ""}`}
              data-level={item.folder ?? undefined}
              aria-pressed={item.name === selection}
              onClick={() => select(item.name === selection ? "" : item.name)}
            >
              <small>{item.levelLabel ?? "Niveau non renseigné"}</small>
              <b>{item.name}</b>
              <span className="admin-class-avg" title="Moyenne de la classe">
                {num(item.stats.mean)}
                <small> /20</small>
              </span>
              <span className="admin-class-meta">
                Moyenne · {plural(item.students, "élève")}
                <br />
                {item.pending ? `${plural(item.pending, "copie")} à corriger` : "tout est corrigé"}
              </span>
              <span className="admin-class-plate" aria-hidden>
                <Image src={item.image} alt="" width={72} height={72} />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="admin-card admin-muted">Aucun élève rangé dans une classe pour le moment.</p>
      )}

      {chosen ? (
        <>
          <Figures stats={chosen.stats} />
          <div className="admin-duo">
            <section className="admin-card" aria-labelledby="classes-hist">
              <h2 id="classes-hist" className="admin-card-h">
                Répartition des moyennes <small>élèves par tranche de 2 points</small>
              </h2>
              <Histogram students={students} />
            </section>
            <section className="admin-card" aria-labelledby="classes-evals">
              <h2 id="classes-evals" className="admin-card-h">
                Évaluations <small>{plural(evaluations.length, "évaluation")} depuis la rentrée</small>
              </h2>
              {evaluations.length ? (
                <div className="admin-table-wrap is-flat">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Évaluation</th>
                        <th className="admin-num">Moy.</th>
                        <th className="admin-num">Méd.</th>
                        <th className="admin-num">Min – max</th>
                        <th className="admin-num">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {evaluations.map((evaluation) => {
                        const stats = evaluation.byClass[chosen.name];
                        return (
                          <tr key={evaluation.id}>
                            <td>
                              <Link href={`/admin/evaluations/${evaluation.id}`} className="admin-who-name">
                                {evaluation.title}
                              </Link>
                              <small className="admin-subtle">{shortDate.format(new Date(evaluation.at))}</small>
                            </td>
                            <td className="admin-num">{num(stats.mean)}</td>
                            <td className="admin-num">{num(stats.median)}</td>
                            <td className="admin-num">{range(stats.min, stats.max)}</td>
                            <td className="admin-num">
                              {stats.pending ? (
                                <Link href="/admin/a-corriger" className="admin-pill is-accent">
                                  {stats.pending} à corriger <ArrowRight size={12} aria-hidden />
                                </Link>
                              ) : (
                                <span className="admin-pill is-ok">
                                  <Check size={12} aria-hidden /> {plural(stats.count, "note")}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="admin-muted">Aucune copie rendue pour le moment.</p>
              )}
            </section>
          </div>
        </>
      ) : board.classes.length ? (
        <section className="admin-card" aria-labelledby="classes-compare">
          <h2 id="classes-compare" className="admin-card-h">
            Comparaison des classes <small>un clic sur une classe ouvre son détail</small>
          </h2>
          <div className="admin-table-wrap is-flat">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Classe</th>
                  <th className="admin-num">Élèves</th>
                  <th className="admin-num">Moyenne</th>
                  <th className="admin-num">Médiane</th>
                  <th className="admin-num">Écart-type</th>
                  <th className="admin-num">Q1 – Q3</th>
                  <th className="admin-num">Min – max</th>
                  <th className="admin-num">Sous 10</th>
                  <th className="admin-num">Copies</th>
                </tr>
              </thead>
              <tbody>
                {board.classes.map((item) => (
                  <tr key={item.name}>
                    <td>
                      <button type="button" className="admin-who-name" onClick={() => select(item.name)}>
                        {item.name}
                      </button>
                    </td>
                    <td className="admin-num">{item.students}</td>
                    <td className="admin-num">
                      <b className="admin-note">{num(item.stats.mean)}</b>
                    </td>
                    <td className="admin-num">{num(item.stats.median)}</td>
                    <td className="admin-num">{num(item.stats.sd)}</td>
                    <td className="admin-num">{range(item.stats.q1, item.stats.q3)}</td>
                    <td className="admin-num">{range(item.stats.min, item.stats.max)}</td>
                    <td className="admin-num">{item.stats.below}</td>
                    <td className="admin-num">
                      {item.pending ? <span className="admin-pill is-accent">{item.pending} à corriger</span> : <span className="admin-pill is-ok">à jour</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {students.length ? <Ranking key={selection} students={students} evaluations={evaluations} showClass={!chosen} challenges={challenges} /> : null}
    </div>
  );
}
