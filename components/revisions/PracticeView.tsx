"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Check, CircleDashed, Flag, Loader2, Timer } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";
import { checkPracticeSolution } from "@/app/actions/getExercises";
import { finishPractice, startPractice, type PracticeChoice, type PracticeExercise, type PracticeRun, type PracticeSetup } from "@/app/actions/revisions";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";
import { cleanLabel, difficultyLabel, practiceRemaining, PRACTICE_DURATIONS } from "@/lib/revisions";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

function clock(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

function spentMinutes(run: PracticeRun) {
  const end = run.finishedAt ? Date.parse(run.finishedAt) : Date.parse(run.startedAt) + run.minutes * 60_000;
  return Math.max(1, Math.min(run.minutes, Math.round((end - Date.parse(run.startedAt)) / 60_000)));
}

function labExercise(run: PracticeRun, exercise: PracticeExercise): LabExercise {
  return {
    // Identifiant propre à l'entraînement : le brouillon de la fiche ne remplit pas l'éditeur.
    id: `entrainement-${run.id}-${exercise.id}`,
    label: exercise.label,
    courseId: "entrainement",
    courseTitle: run.label,
    content: exercise.statement,
    starterCode: exercise.starterCode,
    sqlSetup: exercise.sqlSetup,
    pythonPackages: exercise.pythonPackages,
    chapter: "",
    level: "",
    fileName: "entrainement",
    type: exercise.type,
    hasVerification: true,
  };
}

export function PracticeView({ setup, initialChoice }: { setup: PracticeSetup; initialChoice?: string }) {
  const [run, setRun] = useState<PracticeRun | null>(setup.current);
  const [history, setHistory] = useState(setup.history);
  const [result, setResult] = useState<PracticeRun | null>(null);

  if (run) {
    return (
      <PracticeRunner
        key={run.id}
        run={run}
        onFinished={(finished) => {
          setRun(null);
          setResult(finished);
          setHistory((current) => [finished, ...current.filter((item) => item.id !== finished.id)].slice(0, 10));
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {result ? <PracticeResult run={result} /> : null}
      <PracticeStart choices={setup.choices} initialChoice={initialChoice} onStarted={(next) => {
        setResult(null);
        setRun(next);
      }} />
      {history.length > 0 ? (
        <section className="space-y-3" aria-labelledby="practice-history">
          <h2 id="practice-history" className="classe-heading">Entraînements précédents</h2>
          <ul className="practice-history">
            {history.map((item) => (
              <li key={item.id}>
                <span className="min-w-0 flex-1">
                  <b>{item.label}</b>
                  <small>
                    {dateFormat.format(new Date(item.startedAt))} · {spentMinutes(item)} min sur {item.minutes}
                  </small>
                </span>
                <span className={`practice-score${item.solved.length === item.exercises.length && item.exercises.length > 0 ? " is-full" : ""}`}>
                  {item.solved.length} / {item.exercises.length} réussi{item.solved.length > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function PracticeStart({ choices, initialChoice, onStarted }: { choices: PracticeChoice[]; initialChoice?: string; onStarted: (run: PracticeRun) => void }) {
  const [choice, setChoice] = useState(() => (choices.some((item) => item.key === initialChoice) ? initialChoice! : choices[0]?.key ?? ""));
  const [minutes, setMinutes] = useState<number>(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const groups = useMemo(() => {
    const map = new Map<string, PracticeChoice[]>();
    for (const item of choices) map.set(item.group, [...(map.get(item.group) ?? []), item]);
    return [...map.entries()];
  }, [choices]);

  if (choices.length === 0) {
    return <p className="carnet-empty">Aucune fiche d&apos;exercices vérifiés par des tests n&apos;est ouverte pour ce compte.</p>;
  }

  const start = async () => {
    setBusy(true);
    setError(null);
    const response = await startPractice(choice, minutes).catch(() => null);
    setBusy(false);
    if (!response || !response.ok) {
      setError(response && !response.ok ? response.error : "L'entraînement n'a pas pu commencer.");
      return;
    }
    onStarted(response.run);
  };

  return (
    <section className="practice-start" aria-labelledby="practice-start">
      <h2 id="practice-start">Nouveau sujet blanc</h2>
      <label className="practice-field">
        <span>Chapitre, fiche ou interro</span>
        <select value={choice} onChange={(event) => setChoice(event.target.value)}>
          {groups.map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <fieldset className="practice-field">
        <legend>Durée</legend>
        <div className="practice-durations">
          {PRACTICE_DURATIONS.map((value) => (
            <label key={value} className={minutes === value ? "is-on" : ""}>
              <input type="radio" name="practice-duration" checked={minutes === value} onChange={() => setMinutes(value)} />
              {value} min
              <small>{value === 45 ? "4 exercices" : "3 exercices"}</small>
            </label>
          ))}
        </div>
      </fieldset>
      <ul className="practice-rules">
        <li>Exercices tirés au hasard dans les fiches choisies, du plus facile au plus difficile, en évitant ceux déjà réussis.</li>
        <li>Comme en évaluation : chrono visible, énoncés sans indices ni correction, code vérifié par les tests.</li>
        <li>Les essais comptent comme ceux des fiches : un exercice réussi est validé, une erreur rejoint le carnet d&apos;erreurs. Aucune note n&apos;est donnée.</li>
      </ul>
      {error ? <p className="practice-error">{error}</p> : null}
      <button type="button" className="carnet-button is-primary" disabled={busy || !choice} onClick={start}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Timer size={16} aria-hidden />}
        Commencer ({minutes} minutes)
      </button>
    </section>
  );
}

function PracticeRunner({ run, onFinished }: { run: PracticeRun; onFinished: (run: PracticeRun) => void }) {
  const [now, setNow] = useState(() => Date.now());
  const [solved, setSolved] = useState<string[]>(run.solved);
  const [mounted, setMounted] = useState(false);
  const [ending, setEnding] = useState(false);
  const endedRef = useRef(false);
  const remaining = practiceRemaining(run.startedAt, run.minutes, now);
  const labs = useMemo(() => run.exercises.map((exercise) => ({ exercise, lab: labExercise(run, exercise) })), [run]);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const end = async () => {
    if (endedRef.current) return;
    endedRef.current = true;
    setEnding(true);
    const finished = await finishPractice(run.id).catch(() => null);
    onFinished(finished ?? { ...run, solved, finishedAt: new Date().toISOString(), running: false });
  };

  useEffect(() => {
    if (remaining <= 0) void end();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining <= 0]);

  const checker = (exerciseId: string) => async (code: string, trace: unknown) => {
    const outcome = await checkPracticeSolution(run.id, exerciseId, code, trace);
    if (outcome.expired) void end();
    return outcome;
  };

  return (
    <section className="challenge-current practice-run" aria-labelledby="practice-run-title">
      <header className="challenge-current-head practice-run-head">
        <div className="min-w-0">
          <p className="challenge-eyebrow">Sujet blanc · {run.minutes} minutes</p>
          <h2 id="practice-run-title">{run.label}</h2>
          <p className="challenge-meta">
            {solved.length} exercice{solved.length > 1 ? "s" : ""} réussi{solved.length > 1 ? "s" : ""} sur {run.exercises.length}
          </p>
        </div>
        <button
          type="button"
          className="carnet-button"
          disabled={ending}
          onClick={() => {
            if (window.confirm("Terminer l'entraînement maintenant ? Le code ne sera plus vérifié.")) void end();
          }}
        >
          <Flag size={15} aria-hidden /> Terminer
        </button>
      </header>
      {mounted && !ending
        ? createPortal(
            <span className={`challenge-timer ${remaining < 120_000 ? "is-low" : ""}`} role="timer" aria-live="off">
              <Timer size={17} aria-hidden />
              {clock(remaining)} restantes
            </span>,
            document.body,
          )
        : null}
      {ending ? (
        <p className="carnet-muted practice-ending">
          <Loader2 size={15} className="animate-spin" aria-hidden /> Fin de l&apos;entraînement…
        </p>
      ) : (
        labs.map(({ exercise, lab }, index) => (
          <div key={exercise.id} className="challenge-exercise">
            <div className="challenge-statement">
              <div className="challenge-exercise-head">
                <span>
                  Exercice {index + 1} · {difficultyLabel(exercise.difficulty)}
                </span>
                {solved.includes(exercise.id) ? (
                  <span className="challenge-done is-small">
                    <Check size={14} aria-hidden /> Réussi
                  </span>
                ) : null}
              </div>
              <ExerciseStatement label={cleanLabel(exercise.label)} content={exercise.statement} />
            </div>
            <ExerciseWorkspace
              exercise={lab}
              nav={null}
              embedded
              onCompleted={() => setSolved((ids) => (ids.includes(exercise.id) ? ids : [...ids, exercise.id]))}
              checker={checker(exercise.id)}
            />
          </div>
        ))
      )}
    </section>
  );
}

function PracticeResult({ run }: { run: PracticeRun }) {
  const count = run.solved.length;
  return (
    <section className="practice-result" aria-labelledby="practice-result">
      <h2 id="practice-result">
        Bilan : {count} exercice{count > 1 ? "s" : ""} réussi{count > 1 ? "s" : ""} sur {run.exercises.length}, en {spentMinutes(run)} minutes
      </h2>
      <p className="challenge-meta">{run.label} · sujet de {run.minutes} minutes</p>
      <ul>
        {run.exercises.map((exercise) => {
          const ok = run.solved.includes(exercise.id);
          return (
            <li key={exercise.id}>
              {ok ? <Check size={16} className="carnet-ok" aria-label="Réussi" /> : <CircleDashed size={16} className="carnet-ko" aria-label="Pas réussi" />}
              <span className="min-w-0 flex-1">
                <b>{cleanLabel(exercise.label)}</b>
                <small>
                  {exercise.courseTitle} · {difficultyLabel(exercise.difficulty)}
                </small>
              </span>
              {exercise.pagePath ? (
                <Link href={`${exercise.pagePath}?exercice=${encodeURIComponent(exercise.id)}`} className="carnet-link">
                  Correction dans la fiche
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
