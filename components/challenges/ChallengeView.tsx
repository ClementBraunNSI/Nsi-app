"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Flame, Sparkles, Timer, Trophy, Users } from "lucide-react";
import { checkChallenge, startChallenge } from "@/app/actions/challenges";
import type { Achievement } from "@/lib/achievements";
import { bonusLevelsPassed, challengeAchievement, challengeDeadline, challengeGroups, type MyChallenge } from "@/lib/challenges";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ChallengeStart, ProctoredRunner } from "./ProctoredChallenge";
import { challengeLab, LeveledExercise } from "./LeveledExercise";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const shortFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });

/** Succès du défi au format attendu par la fenêtre « Nouveau succès ». */
function asAchievement(id: string): Achievement | null {
  const item = challengeAchievement(id);
  if (!item) return null;
  return { id: item.id, title: item.title, description: item.description, icon: Trophy, color: "", condition: () => false };
}

function clock(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export default function ChallengeView({ challenges, streak }: { challenges: MyChallenge[]; streak: number }) {
  const current = challenges[0]?.open ? challenges[0] : null;
  const past = current ? challenges.slice(1) : challenges;

  return (
    <div className="space-y-8">
      <div className="challenge-stats">
        <span className="challenge-stat">
          <Flame size={18} aria-hidden />
          <b>{streak}</b> semaine{streak > 1 ? "s" : ""} de suite
        </span>
        {current ? (
          <span className="challenge-stat">
            <Users size={18} aria-hidden />
            <b>{current.classPassed}</b> élève{current.classPassed > 1 ? "s" : ""} de la classe sur {current.classSize} l&apos;{current.classPassed > 1 ? "ont" : "a"} réussi
          </span>
        ) : null}
      </div>

      {current ? (
        <CurrentChallenge key={current.id} challenge={current} />
      ) : (
        <p className="challenge-none">Pas de défi ouvert cette semaine. Le prochain arrive lundi.</p>
      )}

      {past.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Défis précédents</h2>
          <ul className="challenge-history">
            {past.map((challenge) => (
              <PastChallenge key={challenge.id} challenge={challenge} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function CurrentChallenge({ challenge }: { challenge: MyChallenge }) {
  const router = useRouter();
  const answers = challenge.mine?.answers ?? {};
  const [startedAt, setStartedAt] = useState<string | null>(challenge.mine?.startedAt ?? null);
  const [now, setNow] = useState(() => Date.now());
  const [serverExpired, setServerExpired] = useState(false);
  const [passedNow, setPassedNow] = useState<string[]>([]);
  const [finished, setFinished] = useState(Boolean(challenge.mine?.finishedAt));
  // Défi surveillé déjà réussi au chargement : la page surveillée ne se rouvre pas.
  const [leftRunner, setLeftRunner] = useState(Boolean(challenge.mine?.passed));
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  // Un exercice et ses niveaux bonus : seul le niveau 1 compte pour valider le défi.
  const groups = useMemo(() => challengeGroups(challenge.exercises), [challenge.exercises]);
  const exercises = useMemo(
    () => groups.map((group) => ({ exercise: group.levels[0], lab: challengeLab(challenge.id, challenge.title, group.levels[0]), levels: group.levels })),
    [challenge.id, challenge.title, groups],
  );

  // Le chrono part à l'ouverture de la page (le serveur garde la première heure de départ).
  // Défi surveillé : il part au clic sur « commencer », une fois l'écran partagé.
  useEffect(() => {
    if (!challenge.timeLimitMinutes || challenge.proctored) return;
    let cancelled = false;
    void startChallenge(challenge.id).then((value) => {
      if (!cancelled && value) setStartedAt(value);
    });
    return () => {
      cancelled = true;
    };
  }, [challenge.id, challenge.proctored, challenge.timeLimitMinutes]);

  const deadline = challengeDeadline(startedAt, challenge.timeLimitMinutes);
  useEffect(() => {
    if (deadline === null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const remaining = deadline === null ? null : deadline - now;
  const expired = serverExpired || finished || (remaining !== null && remaining <= 0);
  const isPassed = (id: string) => Boolean(answers[id]?.passed) || passedNow.includes(id);
  const passedCount = groups.filter((group) => isPassed(group.id)).length;
  const allPassed = groups.length > 0 && passedCount === groups.length;
  const hasBonus = groups.some((group) => group.levels.length > 1);
  const bonusPassed =
    bonusLevelsPassed(challenge.exercises, answers) +
    challenge.exercises.filter((exercise) => exercise.parent && passedNow.includes(exercise.id) && !answers[exercise.id]?.passed).length;
  const watched = Boolean(challenge.proctored) && !expired && !(allPassed && leftRunner);

  const onPassed = (id: string) => {
    setPassedNow((ids) => (ids.includes(id) ? ids : [...ids, id]));
    router.refresh();
  };
  const checker = async (id: string, code: string) => {
    const result = await checkChallenge(challenge.id, id, code);
    if (result.expired) setServerExpired(true);
    return {
      report: result.report,
      newBadge: false,
      recorded: result.recorded,
      newAchievements: result.newAchievements.map(asAchievement).filter((item): item is Achievement => item !== null),
    };
  };

  if (watched && startedAt) {
    return (
      <ProctoredRunner
        challenge={challenge}
        deadline={deadline}
        remaining={remaining}
        labs={exercises}
        isPassed={isPassed}
        allPassed={allPassed}
        checker={checker}
        onPassed={onPassed}
        onLeave={(reason) => {
          if (reason === "arret") setFinished(true);
          setLeftRunner(true);
          router.refresh();
        }}
      />
    );
  }

  return (
    <section className="challenge-current">
      <header className="challenge-current-head">
        <div className="min-w-0">
          <p className="challenge-eyebrow">Défi de la semaine</p>
          <h2>{challenge.title}</h2>
          <p className="challenge-meta">
            {groups.length} exercice{groups.length > 1 ? "s" : ""}
            {hasBonus ? " avec niveau bonus" : ""}
            {challenge.timeLimitMinutes
              ? ` · ${challenge.timeLimitMinutes} minutes à partir ${challenge.proctored ? "du début" : "de l'ouverture de la page"}`
              : ` · ouvert jusqu'au ${dayFormat.format(new Date(challenge.closesAt))}`}
            {challenge.proctored ? " · surveillé comme une évaluation" : ""}
          </p>
        </div>
        {allPassed ? (
          <span className="challenge-done"><Check size={16} aria-hidden /> Réussi</span>
        ) : null}
        {bonusPassed > 0 ? (
          <span className="challenge-bonus-chip"><Sparkles size={15} aria-hidden /> {bonusPassed} niveau{bonusPassed > 1 ? "x" : ""} bonus</span>
        ) : null}
        {/* Le chrono est posé sur la page entière : il reste visible pendant qu'on fait défiler les exercices. */}
        {challenge.timeLimitMinutes && !expired && !watched && mounted
          ? createPortal(
              <span className={`challenge-timer ${remaining !== null && remaining < 120_000 ? "is-low" : ""}`} role="timer" aria-live="off">
                <Timer size={17} aria-hidden />
                {remaining === null ? "Démarrage…" : `${clock(remaining)} restantes`}
              </span>,
              document.body,
            )
          : null}
      </header>

      {watched ? (
        <ChallengeStart challenge={challenge} onStarted={setStartedAt} />
      ) : expired ? (
        <div className="challenge-expired">
          <p>
            <b>{finished ? "Défi arrêté." : "Temps écoulé."}</b> {passedCount} exercice{passedCount > 1 ? "s" : ""} réussi{passedCount > 1 ? "s" : ""} sur {groups.length}
            {bonusPassed > 0 ? `, et ${bonusPassed} niveau${bonusPassed > 1 ? "x" : ""} bonus` : ""}.
            La correction apparaîtra le {dayFormat.format(new Date(challenge.closesAt))}.
          </p>
          {challenge.exercises.map((exercise) => (
            <div key={exercise.id} className="challenge-past-body">
              <ExerciseStatement label={exercise.parent ? `${exercise.label} (niveau ${exercise.level ?? 2}, bonus)` : exercise.label} content={exercise.statement} />
              <h3>{isPassed(exercise.id) ? "Code réussi" : "Dernier code vérifié"}</h3>
              <pre>{answers[exercise.id]?.code || "Aucun code vérifié."}</pre>
            </div>
          ))}
        </div>
      ) : (
        exercises.map(({ exercise, levels }, index) => (
          <div key={exercise.id} className="challenge-exercise">
            <LeveledExercise
              challengeId={challenge.id}
              challengeTitle={challenge.title}
              levels={levels}
              answers={answers}
              isPassed={isPassed}
              checker={checker}
              onPassed={onPassed}
              statementClassName="challenge-statement"
              heading={
                <div className="challenge-exercise-head">
                  <span>Exercice {index + 1}</span>
                  {isPassed(exercise.id) ? <span className="challenge-done is-small"><Check size={14} aria-hidden /> Réussi</span> : null}
                </div>
              }
            />
          </div>
        ))
      )}
    </section>
  );
}

function PastChallenge({ challenge }: { challenge: MyChallenge }) {
  const [open, setOpen] = useState(false);
  const status = challenge.mine?.passed ? "Réussi" : challenge.mine?.attempts ? "Tenté" : "Pas fait";
  const answers = challenge.mine?.answers ?? {};
  return (
    <li className={`challenge-past ${open ? "is-open" : ""}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className={`challenge-badge is-${challenge.mine?.passed ? "ok" : challenge.mine?.attempts ? "try" : "none"}`}>{status}</span>
        <span className="min-w-0 flex-1">
          <b>{challenge.title}</b>
          <small>Lundi {shortFormat.format(new Date(challenge.opensAt))} · {challenge.classPassed} / {challenge.classSize} réussi</small>
        </span>
        <ChevronDown size={18} className="challenge-chevron" aria-hidden />
      </button>
      {open ? (
        <div className="challenge-past-body">
          {challenge.exercises.map((exercise) => {
            const correction = challenge.corrections?.find((item) => item.id === exercise.id)?.correction;
            return (
              <div key={exercise.id} className="challenge-past-exercise">
                <ExerciseStatement label={exercise.parent ? `${exercise.label} (niveau ${exercise.level ?? 2}, bonus)` : exercise.label} content={exercise.statement} />
                {answers[exercise.id]?.code ? (
                  <>
                    <h3>Mon code {answers[exercise.id].passed ? "(réussi)" : ""}</h3>
                    <pre>{answers[exercise.id].code}</pre>
                  </>
                ) : null}
                {correction ? (
                  <>
                    <h3>Correction</h3>
                    <pre className="is-correction">{correction}</pre>
                  </>
                ) : null}
              </div>
            );
          })}
          {challenge.corrections ? null : <p className="challenge-meta">La correction apparaîtra à la fermeture du défi.</p>}
        </div>
      ) : null}
    </li>
  );
}
