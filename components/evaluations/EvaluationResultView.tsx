import Link from "next/link";
import { AlertTriangle, ArrowLeft, BookOpenCheck, Check, X } from "lucide-react";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import { positionText, type ClassStats, type EvaluationResult, type ResultExercise } from "@/lib/evaluation-result";
import type { ResultSuggestion } from "@/lib/evaluation-result-server";
import { cleanLabel, difficultyLabel, timeAgo } from "@/lib/revisions";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const pct = (value: number) => `${Math.min(100, Math.max(0, (value / 20) * 100))}%`;
const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

function reasonText(item: ResultSuggestion, now: Date) {
  if (item.reason === "rate") return item.when ? `Raté ${timeAgo(item.when, now)}` : "Déjà raté";
  if (item.reason === "non-fait") return "Pas encore fait";
  return item.when ? `Réussi ${timeAgo(item.when, now)}` : "Déjà réussi";
}

/** Bande de 0 à 20 : moitié centrale de la classe (Q1 à Q3), médiane, moyenne et note de la copie. */
function PositionStrip({ total, q1, median, q3, mean }: { total: number; q1: number; median: number; q3: number; mean: number }) {
  return (
    <figure className="eval-res-strip">
      <div
        className="eval-res-track"
        role="img"
        aria-label={`Note de la copie ${num(total)} sur 20. Moitié centrale de la classe de ${num(q1)} à ${num(q3)}, médiane ${num(median)}, moyenne ${num(mean)}.`}
      >
        <span className="eval-res-box" style={{ left: pct(q1), width: `calc(${pct(q3)} - ${pct(q1)})` }} title={`Moitié centrale de la classe : de ${num(q1)} à ${num(q3)}`} />
        <span className="eval-res-median" style={{ left: pct(median) }} title={`Médiane : ${num(median)}`} />
        <span className="eval-res-mean" style={{ left: pct(mean) }} title={`Moyenne : ${num(mean)}`} />
        <span className="eval-res-me" style={{ left: pct(total) }} title={`Note de la copie : ${num(total)}`}>
          <b>{num(total)}</b>
        </span>
      </div>
      <div className="eval-res-axis" aria-hidden>
        {[0, 5, 10, 15, 20].map((tick) => (
          <span key={tick} style={{ left: pct(tick) }}>
            {tick}
          </span>
        ))}
      </div>
      <figcaption className="eval-res-legend">
        <span><i className="is-box" /> Moitié centrale de la classe (Q1 à Q3)</span>
        <span><i className="is-median" /> Médiane</span>
        <span><i className="is-mean" /> Moyenne</span>
        <span><i className="is-me" /> Note de la copie</span>
      </figcaption>
    </figure>
  );
}

function ExerciseResult({
  item,
  exercise,
  code,
  suggestions,
  now,
}: {
  item: ResultExercise;
  exercise?: EvaluationExercise;
  code: string;
  suggestions: ResultSuggestion[];
  now: Date;
}) {
  const full = item.points >= item.max;
  const status = !item.written
    ? "Rien d'écrit pour cet exercice."
    : item.testsTotal > 0
      ? `${item.testsPassed} test${item.testsPassed > 1 ? "s" : ""} réussi${item.testsPassed > 1 ? "s" : ""} sur ${item.testsTotal}.`
      : "Exercice corrigé à la relecture.";
  return (
    <section className="eval-res-ex" aria-labelledby={`res-${item.id}`}>
      <header className="eval-res-ex-head">
        <h3 id={`res-${item.id}`}>{item.label}</h3>
        <span className={`eval-res-points ${full ? "is-full" : item.points === 0 ? "is-zero" : ""}`}>
          {num(item.points)} / {num(item.max)}
        </span>
      </header>
      <div className="eval-res-bar" aria-hidden>
        <span style={{ width: `${item.max > 0 ? (item.points / item.max) * 100 : 0}%` }} />
      </div>
      <p className="eval-res-status">
        {full ? <Check size={15} aria-hidden /> : null}
        {status}
        {item.manual ? " Points fixés à la relecture de la copie." : ""}
      </p>

      {item.error ? (
        <p className="eval-res-error">
          <AlertTriangle size={15} aria-hidden /> Le programme s&apos;arrête avant les tests : <code>{item.error}</code>
        </p>
      ) : null}
      {item.failed.length > 0 ? (
        <ul className="eval-res-failed" aria-label="Tests non réussis">
          {item.failed.map((test, index) => (
            <li key={index}>
              <X size={14} aria-hidden />
              <span>
                {test.label}
                {test.expected !== undefined || test.actual !== undefined ? (
                  <small>
                    {test.expected !== undefined ? <>attendu <code>{test.expected}</code></> : null}
                    {test.expected !== undefined && test.actual !== undefined ? ", " : null}
                    {test.actual !== undefined ? <>obtenu <code>{test.actual}</code></> : null}
                  </small>
                ) : null}
              </span>
            </li>
          ))}
          {item.testsTotal - item.testsPassed > item.failed.length ? (
            <li className="is-more">… et {item.testsTotal - item.testsPassed - item.failed.length} autre{item.testsTotal - item.testsPassed - item.failed.length > 1 ? "s" : ""}.</li>
          ) : null}
        </ul>
      ) : null}

      <div className="eval-res-details">
        {exercise?.statement ? (
          <details>
            <summary>Énoncé</summary>
            <div className="eval-statement">
              <ExerciseStatement label={exercise.label} content={exercise.statement} />
            </div>
          </details>
        ) : null}
        {code.trim() ? (
          <details>
            <summary>Code rendu</summary>
            <pre className="eval-res-code"><code>{code}</code></pre>
          </details>
        ) : null}
      </div>

      {item.review.length > 0 ? (
        <div className="eval-res-train">
          <h4>
            <BookOpenCheck size={16} aria-hidden /> Pour s&apos;entraîner : {item.review.join(", ")}
          </h4>
          {suggestions.length > 0 ? (
            <ol className="revise-list">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <Link href={`/exercice/${encodeURIComponent(suggestion.id)}`}>
                    <span className="revise-label">{cleanLabel(suggestion.label)}</span>
                    <small>
                      {suggestion.courseTitle} · {difficultyLabel(suggestion.difficulty)}
                    </small>
                  </Link>
                  <span className={`revise-reason is-${suggestion.reason}`}>{reasonText(suggestion, now)}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="revise-note">Aucun exercice des fiches ne correspond à ces notions pour le moment.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}

export function EvaluationResultView({
  title,
  submittedAt,
  result,
  stats,
  exercises,
  answers,
  suggestions,
}: {
  title: string;
  submittedAt: string | null;
  result: EvaluationResult;
  stats: ClassStats;
  exercises: EvaluationExercise[];
  answers: { exerciseId: string; code: string }[];
  suggestions: Record<string, ResultSuggestion[]>;
}) {
  const now = new Date();
  const hasStats = stats.mean !== null && stats.q1 !== null && stats.median !== null && stats.q3 !== null;
  const position = positionText(result.total, stats);
  const codeOf = new Map(answers.map((answer) => [answer.exerciseId, answer.code]));
  const exerciseOf = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const lost = result.exercises.filter((exercise) => exercise.points < exercise.max).length;

  return (
    <div className="eval-res">
      <Link href="/evaluations" className="eval-res-back">
        <ArrowLeft size={15} aria-hidden /> Mes évaluations
      </Link>
      <header className="eval-res-head">
        <span className="eval-status is-done">Corrigée</span>
        <h1>{title}</h1>
        {submittedAt ? <p>Copie rendue le {dateFormat.format(new Date(submittedAt))}.</p> : null}
      </header>

      <section className="eval-res-card" aria-label="Note et place dans la classe">
        <div className="eval-res-grade">
          <span>Note</span>
          <b>
            {num(result.total)}
            <small> / 20</small>
          </b>
          {position ? <p>{position}</p> : null}
        </div>

        {hasStats ? (
          <>
            <dl className="eval-res-kpis">
              <div><dt>Moyenne</dt><dd>{num(stats.mean!)}</dd></div>
              <div><dt>1er quartile (Q1)</dt><dd>{num(stats.q1!)}</dd></div>
              <div><dt>Médiane</dt><dd>{num(stats.median!)}</dd></div>
              <div><dt>3e quartile (Q3)</dt><dd>{num(stats.q3!)}</dd></div>
            </dl>
            <PositionStrip total={result.total} q1={stats.q1!} median={stats.median!} q3={stats.q3!} mean={stats.mean!} />
            <p className="eval-res-note">
              {stats.classe ? `Classe ${stats.classe}, ` : ""}
              {stats.count} copies corrigées. Un quart de la classe a une note inférieure ou égale à Q1, la moitié à la médiane, trois quarts à Q3.
              {stats.pending > 0 ? ` Statistiques provisoires : ${stats.pending} copie${stats.pending > 1 ? "s" : ""} encore en correction.` : ""}
            </p>
          </>
        ) : (
          <p className="eval-res-note">
            Moyenne, médiane et quartiles de la classe : affichés à partir de 5 copies corrigées ({stats.count} pour l&apos;instant
            {stats.pending > 0 ? `, ${stats.pending} encore en correction` : ""}).
          </p>
        )}
      </section>

      <h2 className="eval-res-title">Détail par exercice</h2>
      <p className="eval-res-intro">
        {lost === 0
          ? "Tous les points sont obtenus : rien à retravailler sur cette évaluation."
          : `Points perdus sur ${lost} exercice${lost > 1 ? "s" : ""} : les tests non réussis indiquent ce qui manque, et des exercices des fiches permettent de retravailler les notions en jeu.`}
      </p>
      <div className="eval-res-list">
        {result.exercises.map((item) => (
          <ExerciseResult
            key={item.id}
            item={item}
            exercise={exerciseOf.get(item.id)}
            code={codeOf.get(item.id) ?? ""}
            suggestions={suggestions[item.id] ?? []}
            now={now}
          />
        ))}
      </div>
    </div>
  );
}
