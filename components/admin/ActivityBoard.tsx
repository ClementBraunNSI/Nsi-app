"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import { ExerciseCode } from "@/components/admin/ExerciseCode";
import { classGroups, NO_CLASS } from "@/lib/class-groups";
import {
  buildFeed,
  clock,
  dayHeading,
  DEFAULT_KINDS,
  groupByDay,
  lastActivityLabel,
  studentStats,
  typingBadge,
  type ActivityKind,
  type ActivityPeriod,
  type BoardStudent,
  type StudentStats,
  type TypingSeverity,
} from "@/lib/activity-board";

type Audience = "classe" | "particuliers";
type View = "table" | "feed";

const PERIODS: { id: ActivityPeriod; label: string; scope: string }[] = [
  { id: "today", label: "Aujourd'hui", scope: "aujourd'hui" },
  { id: "7", label: "7 jours", scope: "sur 7 jours" },
  { id: "30", label: "30 jours", scope: "sur 30 jours" },
];

const KINDS: { id: ActivityKind; label: string }[] = [
  { id: "exercise", label: "Exercices" },
  { id: "sheet", label: "Fiches" },
  { id: "homework", label: "Devoirs" },
  { id: "message", label: "Messages" },
];

const SEVERITY_LABEL: Record<TypingSeverity, string> = { ok: "RAS", attention: "à regarder", suspect: "suspect" };
const SEVERITY_TONE: Record<TypingSeverity, string> = { ok: "is-ok", attention: "is-att", suspect: "is-warn" };

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

type Row = { student: BoardStudent; stats: StudentStats };

/**
 * Activité des élèves : barre de filtres qui reste visible, puis un tableau par classe (une ligne par élève,
 * détail dépliable groupé par jour) ou un fil d'activité jour par jour.
 */
export function ActivityBoard({ students, now: nowIso, detailBase = "/admin/activite" }: { students: BoardStudent[]; now: string; detailBase?: string }) {
  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const privateCount = students.filter((student) => student.privateLesson).length;
  const [audience, setAudience] = useState<Audience>(students.length > privateCount ? "classe" : "particuliers");
  const [classe, setClasse] = useState("");
  const [period, setPeriod] = useState<ActivityPeriod>("7");
  const [kinds, setKinds] = useState<ActivityKind[]>(DEFAULT_KINDS);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("table");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [idleOpen, setIdleOpen] = useState<Set<string>>(new Set());
  const scrollTo = useRef<string | null>(null);

  const scope = PERIODS.find((item) => item.id === period)!.scope;

  const audienceStudents = useMemo(
    () => students.filter((student) => (audience === "particuliers" ? student.privateLesson : !student.privateLesson)),
    [students, audience],
  );
  const classOptions = useMemo(() => classGroups(audienceStudents, (student) => student.classe), [audienceStudents]);

  const shown = useMemo(() => {
    const text = query.trim().toLowerCase();
    return audienceStudents.filter((student) => {
      if (text && !student.fullName.toLowerCase().includes(text)) return false;
      if (audience !== "classe" || !classe) return true;
      return classe === NO_CLASS ? !student.classe?.trim() : student.classe?.trim() === classe;
    });
  }, [audienceStudents, query, audience, classe]);

  const groups = useMemo(() => {
    const raw = audience === "classe" ? classGroups(shown, (student) => student.classe) : [{ key: "particuliers", label: "Cours particuliers", items: shown }];
    return raw.map((group) => {
      const rows: Row[] = group.items.map((student) => ({ student, stats: studentStats(student, period, kinds, now) }));
      const active = rows
        .filter((row) => row.stats.events.length > 0)
        .sort((a, b) => String(b.stats.latestAt).localeCompare(String(a.stats.latestAt)));
      const idle = rows.filter((row) => row.stats.events.length === 0);
      return {
        key: group.key,
        label: group.label,
        total: rows.length,
        active,
        idle,
        exercises: rows.reduce((sum, row) => sum + row.stats.exercises, 0),
      };
    });
  }, [shown, audience, period, kinds, now]);

  const feed = useMemo(() => (view === "feed" ? buildFeed(shown, period, kinds, now) : []), [view, shown, period, kinds, now]);

  useEffect(() => {
    if (!scrollTo.current) return;
    document.getElementById(`act-${scrollTo.current}`)?.scrollIntoView({ block: "center" });
    scrollTo.current = null;
  });

  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  const openStudent = (student: BoardStudent) => {
    setView("table");
    setOpen((current) => new Set(current).add(student.id));
    const group = student.classe?.trim() || NO_CLASS;
    if (!student.privateLesson && classe && classe !== group) setClasse("");
    // Un élève sans activité sur la période est dans la ligne repliée de sa classe : on la déplie.
    setIdleOpen((current) => new Set(current).add(student.privateLesson ? "particuliers" : group));
    scrollTo.current = student.id;
  };

  return (
    <div className="act-board">
      <div className="act-filters" role="search" aria-label="Filtrer l'activité">
        <div className="admin-seg" role="group" aria-label="Élèves">
          {(
            [
              ["classe", `Classes (${students.length - privateCount})`],
              ["particuliers", `Cours particuliers (${privateCount})`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={audience === id}
              className={audience === id ? "is-on" : ""}
              onClick={() => {
                setAudience(id);
                setClasse("");
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {audience === "classe" && classOptions.length > 1 ? (
          <select className="admin-select" value={classe} onChange={(event) => setClasse(event.target.value)} aria-label="Classe">
            <option value="">Toutes les classes</option>
            {classOptions.map((group) => (
              <option key={group.key} value={group.key}>
                {group.label} ({group.items.length})
              </option>
            ))}
          </select>
        ) : null}
        <div className="admin-seg" role="group" aria-label="Période">
          {PERIODS.map((item) => (
            <button key={item.id} type="button" aria-pressed={period === item.id} className={period === item.id ? "is-on" : ""} onClick={() => setPeriod(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="admin-chips act-kinds" role="group" aria-label="Types d'activité">
          {KINDS.map((item) => {
            const on = kinds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={on}
                className={on ? "is-on" : ""}
                onClick={() => setKinds(on ? kinds.filter((kind) => kind !== item.id) : [...kinds, item.id])}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <label className="admin-search act-search">
          <Search size={16} aria-hidden />
          <input type="search" placeholder="Rechercher un élève" aria-label="Rechercher un élève" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <div className="admin-seg act-view" role="group" aria-label="Affichage">
          <button type="button" aria-pressed={view === "table"} className={view === "table" ? "is-on" : ""} onClick={() => setView("table")}>
            Par élève
          </button>
          <button type="button" aria-pressed={view === "feed"} className={view === "feed" ? "is-on" : ""} onClick={() => setView("feed")}>
            Fil d&apos;activité
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <p className="admin-empty">{audienceStudents.length ? "Aucun élève pour ce filtre." : "Aucun élève dans ce groupe."}</p>
      ) : view === "table" ? (
        groups.map((group) => {
          const idleKey = group.key;
          const idleShown = idleOpen.has(idleKey) || group.active.length === 0;
          return (
            <section key={group.key} className="act-class" aria-label={group.label}>
              <h2>
                {group.label}
                <small>
                  {plural(group.total, "élève", "élèves")} · {group.active.length} actif{group.active.length > 1 ? "s" : ""} {scope} ·{" "}
                  {plural(group.exercises, "exercice validé", "exercices validés")}
                </small>
              </h2>
              <div className="act-table-wrap">
                <table className="act-table">
                  <thead>
                    <tr>
                      <th scope="col">Élève</th>
                      <th scope="col">Dernière activité</th>
                      <th scope="col" className="act-num">Exercices</th>
                      <th scope="col" className="act-opt">Fiches · devoirs</th>
                      <th scope="col" className="act-opt">Fiche en cours</th>
                      <th scope="col">Frappe</th>
                      <th scope="col"><span className="sr-only">Détail</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.active.map((row) => (
                      <StudentRow
                        key={row.student.id}
                        row={row}
                        now={now}
                        scope={scope}
                        open={open.has(row.student.id)}
                        onToggle={() => setOpen((current) => toggle(current, row.student.id))}
                        detailBase={detailBase}
                      />
                    ))}
                    {group.idle.length ? (
                      <>
                        {group.active.length ? (
                          <tr className="act-idle">
                            <td colSpan={7}>
                              <button type="button" aria-expanded={idleShown} onClick={() => setIdleOpen((current) => toggle(current, idleKey))}>
                                {idleShown ? <ChevronDown size={15} aria-hidden /> : <ChevronRight size={15} aria-hidden />}
                                <b>{plural(group.idle.length, "élève sans activité", "élèves sans activité")} {scope}</b>
                                {!idleShown ? (
                                  <span className="act-idle-names">
                                    {" "}
                                    : {group.idle.slice(0, 8).map((row) => row.student.fullName).join(", ")}
                                    {group.idle.length > 8 ? "…" : ""}
                                  </span>
                                ) : null}
                              </button>
                            </td>
                          </tr>
                        ) : null}
                        {idleShown
                          ? group.idle.map((row) => (
                              <StudentRow
                                key={row.student.id}
                                row={row}
                                now={now}
                                scope={scope}
                                idle
                                open={open.has(row.student.id)}
                                onToggle={() => setOpen((current) => toggle(current, row.student.id))}
                                detailBase={detailBase}
                              />
                            ))
                          : null}
                      </>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      ) : feed.length === 0 ? (
        <p className="admin-empty">Aucune activité {scope} pour ce filtre.</p>
      ) : (
        <div className="act-feed">
          {feed.map((day) => (
            <section key={day.day} className="act-feed-day" aria-label={dayHeading(day.day, now)}>
              <h2>
                {dayHeading(day.day, now)}
                <small>
                  {plural(day.students, "élève", "élèves")} · {plural(day.exercises, "exercice", "exercices")}
                </small>
              </h2>
              <ul>
                {day.lines.map((line) => {
                  const student = students.find((item) => item.id === line.studentId)!;
                  return (
                    <li key={line.key} className="act-feed-line">
                      <time dateTime={line.at}>{clock(line.at)}</time>
                      <span className="act-feed-who">
                        <button type="button" onClick={() => openStudent(student)}>
                          {line.name}
                        </button>
                        <span className="admin-pill">{line.privateLesson ? "Particulier" : line.classe || "Sans classe"}</span>
                      </span>
                      <span className="act-feed-what">{line.text}</span>
                      <span className="act-feed-flag">
                        {line.severity ? <span className={`admin-pill ${SEVERITY_TONE[line.severity]}`}>{SEVERITY_LABEL[line.severity]}</span> : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function StudentRow({
  row,
  now,
  scope,
  idle = false,
  open,
  onToggle,
  detailBase,
}: {
  row: Row;
  now: Date;
  scope: string;
  idle?: boolean;
  open: boolean;
  onToggle: () => void;
  detailBase: string;
}) {
  const { student, stats } = row;
  const badge = typingBadge(stats.typing);
  const tone = badge.tone === "warn" ? "is-warn" : badge.tone === "att" ? "is-att" : badge.tone === "ok" ? "is-ok" : "";
  return (
    <Fragment>
      <tr id={`act-${student.id}`} className={`act-row${open ? " is-open" : ""}${idle ? " is-idle" : ""}`} onClick={onToggle}>
        <td>
          <button
            type="button"
            className="act-name"
            aria-expanded={open}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            {student.fullName}
          </button>
        </td>
        <td className={student.lastWorkAt ? "" : "admin-text-warn"}>{lastActivityLabel(student.lastWorkAt, now)}</td>
        <td className="act-num">{stats.exercises || "–"}</td>
        <td className="act-opt">
          {stats.sheets} · {stats.homework}
        </td>
        <td className="act-opt act-sheet">{student.currentSheet ?? "–"}</td>
        <td>{badge.tone === "none" ? <span className="act-subtle">–</span> : <span className={`admin-pill ${tone}`}>{badge.label}</span>}</td>
        <td className="act-chev" aria-hidden>
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </td>
      </tr>
      {open ? (
        <tr className="act-detail">
          <td colSpan={7}>
            {stats.events.length === 0 ? (
              <p className="act-subtle">Rien {scope} avec ces filtres.</p>
            ) : (
              groupByDay(stats.events).map((day) => (
                <div key={day.day} className="act-day">
                  <p className="act-day-title">{dayHeading(day.day, now)}</p>
                  {day.blocks.map((block) =>
                    block.type === "event" ? (
                      <p key={`${block.at}-${block.event.label}`} className="act-ev">
                        <time dateTime={block.at}>{clock(block.at)}</time>
                        <span>{block.event.label}</span>
                      </p>
                    ) : (
                      <div key={`${block.at}-${block.sheet}`} className="act-ex-block">
                        <p className="act-ev">
                          <time dateTime={block.at}>{clock(block.at)}</time>
                          <span>
                            {block.items.length > 1 ? `${block.items.length} exercices validés` : "Exercice validé"} · <b>{block.sheet}</b>
                          </span>
                        </p>
                        <div className="act-ex-list">
                          {block.items.map((item) => (
                            <ExerciseCode key={`${item.exerciseId}-${item.at}`} studentId={student.id} exerciseId={item.exerciseId || ""}>
                              <span className="act-ex">
                                <time dateTime={item.at}>{clock(item.at)}</time> {item.label}
                                {item.severity && item.severity !== "ok" ? (
                                  <span className={`admin-pill ${SEVERITY_TONE[item.severity]}`}>{SEVERITY_LABEL[item.severity]}</span>
                                ) : null}
                              </span>
                            </ExerciseCode>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ))
            )}
            {student.undated.length ? (
              <p className="act-subtle act-undated">Devoirs particuliers rendus, date non enregistrée : {student.undated.join(", ")}</p>
            ) : null}
            <Link href={`${detailBase}/${student.id}`} className="act-more">
              Toutes ses fiches et ses exercices
            </Link>
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
}
