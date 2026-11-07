"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, CircleDashed, Loader2 } from "lucide-react";
import { analyzeMySubmission } from "@/app/actions/getExercises";
import type { NotebookItem } from "@/app/actions/revisions";
import { ErrorHelpBox } from "@/components/lab/ErrorHelpBox";
import {
  explainSummary,
  groupErrors,
  groupHint,
  lineDiff,
  type ErrorGroup,
  type ErrorSummary,
} from "@/lib/error-notebook";
import { cleanLabel, timeAgo } from "@/lib/revisions";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
// Anciens essais analysés d'un coup au plus (chaque analyse relance le code sur le serveur).
const BATCH = 20;

function trendText(group: ErrorGroup, now: Date) {
  if (group.trend === "disparue") return `Ne revient plus depuis ${timeAgo(group.lastAt, now).replace(/^il y a /, "")}`;
  if (group.trend === "frequente") return `Encore fréquente : ${group.recent} fois en 2 semaines`;
  return group.recent > 0 ? `${group.recent} fois en 2 semaines` : "Peu fréquente";
}

function summaryLine(summary: ErrorSummary) {
  if (summary.kind === "exception") return summary.message.split("\n")[0];
  if (summary.kind === "test") {
    const values = summary.expected !== undefined ? ` : attendu ${summary.expected}, obtenu ${summary.actual ?? "rien"}` : "";
    return `Test ${summary.label}${values} (${summary.failed} test${summary.failed > 1 ? "s" : ""} raté${summary.failed > 1 ? "s" : ""} sur ${summary.total})`;
  }
  return summary.message;
}

export function ErrorNotebook({ initial, now: nowIso }: { initial: NotebookItem[]; now: string }) {
  const now = useMemo(() => new Date(nowIso), [nowIso]);
  const [items, setItems] = useState(initial);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [batch, setBatch] = useState<{ done: number; total: number } | null>(null);

  const fixedAfter = useMemo(() => new Set(items.filter((item) => item.fix).map((item) => item.id)), [items]);
  const groups = useMemo(
    () => groupErrors(items.map((item) => ({ id: item.id, exerciseId: item.exerciseId, createdAt: item.createdAt, summary: item.summary })), (entry) => fixedAfter.has(entry.id), now),
    [items, fixedAfter, now],
  );
  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const pending = items.filter((item) => !item.summary);
  const analysed = items.length - pending.length;
  const fixedExercises = new Set(items.filter((item) => item.fix).map((item) => item.exerciseId)).size;
  const exercises = new Set(items.map((item) => item.exerciseId)).size;

  const store = (id: string, summary: ErrorSummary | null) => {
    if (summary) setItems((current) => current.map((item) => (item.id === id ? { ...item, summary } : item)));
  };

  const analyseBatch = async () => {
    const list = pending.slice(0, BATCH);
    setBatch({ done: 0, total: list.length });
    for (const [index, item] of list.entries()) {
      store(item.id, await analyzeMySubmission(item.id).catch(() => null));
      setBatch({ done: index + 1, total: list.length });
    }
    setBatch(null);
  };

  if (items.length === 0) {
    return (
      <p className="carnet-empty">
        Aucune erreur Python enregistrée pour l&apos;instant. Chaque essai refusé par les tests d&apos;un exercice viendra s&apos;ajouter ici, avec son explication.
      </p>
    );
  }

  return (
    <div className="carnet">
      <dl className="carnet-stats">
        <div>
          <dt>Essais refusés</dt>
          <dd>{items.length}</dd>
        </div>
        <div>
          <dt>Exercices concernés</dt>
          <dd>{exercises}</dd>
        </div>
        <div>
          <dt>Réussis ensuite</dt>
          <dd>{fixedExercises}</dd>
        </div>
        <div>
          <dt>Types d&apos;erreurs</dt>
          <dd>{groups.length}</dd>
        </div>
      </dl>

      {pending.length > 0 ? (
        <div className="carnet-pending">
          <p>
            {pending.length} essai{pending.length > 1 ? "s" : ""} plus ancien{pending.length > 1 ? "s" : ""} que le carnet {pending.length > 1 ? "n'ont" : "n'a"} pas encore
            d&apos;analyse : le code est relancé sur le serveur à l&apos;ouverture, puis l&apos;explication est gardée.
            {analysed > 0 ? "" : " Les groupes ci-dessous apparaissent au fur et à mesure."}
          </p>
          <button type="button" className="carnet-button" disabled={batch !== null} onClick={analyseBatch}>
            {batch ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden /> Analyse {batch.done} sur {batch.total}
              </>
            ) : (
              `Analyser ${Math.min(BATCH, pending.length)} essai${Math.min(BATCH, pending.length) > 1 ? "s" : ""}`
            )}
          </button>
        </div>
      ) : null}

      <ul className="carnet-groups">
        {groups.map((group) => {
          const open = openGroup === group.key;
          const hint = groupHint(group.key);
          return (
            <li key={group.key} className={`carnet-group is-${group.trend}${open ? " is-open" : ""}`}>
              <button type="button" className="carnet-group-head" aria-expanded={open} onClick={() => setOpenGroup(open ? null : group.key)}>
                <span className="min-w-0 flex-1">
                  <b>
                    {group.key}
                    {hint ? <span className="carnet-hint"> · {hint}</span> : null}
                  </b>
                  <small>
                    {group.count} fois, la dernière {timeAgo(group.lastAt, now)}
                    {group.exercises > 0 ? ` · ${group.fixed} exercice${group.fixed > 1 ? "s" : ""} réussi${group.fixed > 1 ? "s" : ""} ensuite sur ${group.exercises}` : ""}
                  </small>
                </span>
                <span className={`carnet-trend is-${group.trend}`}>{trendText(group, now)}</span>
                <ChevronDown size={18} className="carnet-chevron" aria-hidden />
              </button>
              {open ? (
                <ol className="carnet-entries">
                  {group.entries.map((entry) => {
                    const item = byId.get(entry.id);
                    return item ? <NotebookEntryView key={item.id} item={item} now={now} onAnalysed={store} /> : null;
                  })}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ul>

      {pending.length > 0 ? (
        <section className="carnet-older" aria-labelledby="carnet-older">
          <h2 id="carnet-older">Essais pas encore analysés</h2>
          <ol className="carnet-entries">
            {pending.map((item) => (
              <NotebookEntryView key={item.id} item={item} now={now} onAnalysed={store} />
            ))}
          </ol>
        </section>
      ) : null}
    </div>
  );
}

function NotebookEntryView({ item, now, onAnalysed }: { item: NotebookItem; now: Date; onAnalysed: (id: string, summary: ErrorSummary | null) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && !item.summary && !loading) {
      setLoading(true);
      setFailed(false);
      const summary = await analyzeMySubmission(item.id).catch(() => null);
      setLoading(false);
      if (!summary) setFailed(true);
      onAnalysed(item.id, summary);
    }
  };

  const help = item.summary ? explainSummary(item.summary, item.code) : null;
  const diff = item.fix ? lineDiff(item.code, item.fix.code) : null;

  return (
    <li className={`carnet-entry${open ? " is-open" : ""}`}>
      <button type="button" className="carnet-entry-head" aria-expanded={open} onClick={toggle}>
        {item.fix ? <CheckCircle2 size={16} className="carnet-ok" aria-label="Réussi ensuite" /> : <CircleDashed size={16} className="carnet-ko" aria-label="Pas encore réussi" />}
        <span className="min-w-0 flex-1">
          <b>{cleanLabel(item.exerciseLabel)}</b>
          <small>
            {item.courseTitle} · {dayFormat.format(new Date(item.createdAt))}
          </small>
        </span>
        <ChevronDown size={16} className="carnet-chevron" aria-hidden />
      </button>
      {open ? (
        <div className="carnet-entry-body">
          {loading ? (
            <p className="carnet-muted">
              <Loader2 size={15} className="animate-spin" aria-hidden /> Analyse du code…
            </p>
          ) : null}
          {failed && !item.summary ? <p className="carnet-muted">L&apos;analyse n&apos;a pas pu être faite. Réessayer plus tard.</p> : null}
          {item.summary ? <p className="carnet-raw">{summaryLine(item.summary)}</p> : null}
          {help ? <ErrorHelpBox help={help} /> : null}

          {item.fix && diff ? (
            <>
              <h3>Ce qui a changé dans le code réussi {timeAgo(item.fix.createdAt, now)}</h3>
              <pre className="carnet-diff">
                {diff.map((line, index) => (
                  <span key={index} className={`is-${line.kind}`}>
                    <i aria-hidden>{line.kind === "added" ? "+" : line.kind === "removed" ? "−" : " "}</i>
                    {line.text || " "}
                    {"\n"}
                  </span>
                ))}
              </pre>
            </>
          ) : (
            <div className={item.fix ? "carnet-codes" : ""}>
              <div>
                <h3>Code refusé</h3>
                <pre className="carnet-code">{item.code || "(vide)"}</pre>
              </div>
              {item.fix ? (
                <div>
                  <h3>Code réussi {timeAgo(item.fix.createdAt, now)}</h3>
                  <pre className="carnet-code is-fixed">{item.fix.code}</pre>
                </div>
              ) : null}
            </div>
          )}
          {!item.fix ? (
            <Link href={`/exercice/${encodeURIComponent(item.exerciseId)}`} className="carnet-link">
              Reprendre l&apos;exercice
            </Link>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}
