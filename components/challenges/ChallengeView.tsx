"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Flame, Trophy, Users } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";
import { checkChallenge } from "@/app/actions/challenges";
import type { Achievement } from "@/lib/achievements";
import { challengeAchievement, type MyChallenge } from "@/lib/challenges";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const shortFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" });

/** Succès du défi au format attendu par la fenêtre « Nouveau succès ». */
function asAchievement(id: string): Achievement | null {
  const item = challengeAchievement(id);
  if (!item) return null;
  return { id: item.id, title: item.title, description: item.description, icon: Trophy, color: "", condition: () => false };
}

function labExercise(challenge: MyChallenge): LabExercise {
  const { exercise } = challenge;
  return {
    id: `defi-${challenge.id}`,
    label: exercise.label,
    courseId: "defi",
    courseTitle: challenge.title,
    content: exercise.statement,
    starterCode: exercise.starter || undefined,
    sqlSetup: exercise.sqlSetup || undefined,
    pythonPackages: exercise.packages?.length ? exercise.packages : undefined,
    chapter: "",
    level: "",
    fileName: "defi",
    type: exercise.type,
    hasVerification: true,
  };
}

export default function ChallengeView({ challenges, streak }: { challenges: MyChallenge[]; streak: number }) {
  const router = useRouter();
  const current = challenges[0]?.open ? challenges[0] : null;
  const past = current ? challenges.slice(1) : challenges;
  const [passedNow, setPassedNow] = useState(false);
  const exercise = useMemo(() => (current ? labExercise(current) : null), [current]);
  const passed = Boolean(current?.mine?.passed) || passedNow;

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

      {current && exercise ? (
        <section className="challenge-current">
          <header className="challenge-current-head">
            <div className="min-w-0">
              <p className="challenge-eyebrow">Défi de la semaine</p>
              <h2>{current.title}</h2>
              <p className="challenge-meta">Ouvert jusqu&apos;au {dayFormat.format(new Date(current.closesAt))}</p>
            </div>
            {passed ? (
              <span className="challenge-done"><Check size={16} aria-hidden /> Réussi</span>
            ) : null}
          </header>
          <div className="challenge-statement">
            <ExerciseStatement label={current.exercise.label} content={current.exercise.statement} />
          </div>
          <ExerciseWorkspace
            exercise={exercise}
            nav={null}
            embedded
            initialCode={current.mine?.code || undefined}
            onCompleted={() => {
              setPassedNow(true);
              router.refresh();
            }}
            checker={async (code) => {
              const result = await checkChallenge(current.id, code);
              return {
                report: result.report,
                newBadge: false,
                recorded: result.recorded,
                newAchievements: result.newAchievements.map(asAchievement).filter((item): item is Achievement => item !== null),
              };
            }}
          />
        </section>
      ) : (
        <p className="challenge-none">Pas de défi ouvert cette semaine : le prochain arrive lundi.</p>
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

function PastChallenge({ challenge }: { challenge: MyChallenge }) {
  const [open, setOpen] = useState(false);
  const status = challenge.mine?.passed ? "Réussi" : challenge.mine?.attempts ? "Tenté" : "Pas fait";
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
          <ExerciseStatement label={challenge.exercise.label} content={challenge.exercise.statement} />
          {challenge.mine?.code ? (
            <>
              <h3>Mon code</h3>
              <pre>{challenge.mine.code}</pre>
            </>
          ) : null}
          {challenge.correction ? (
            <>
              <h3>Correction</h3>
              <pre className="is-correction">{challenge.correction}</pre>
            </>
          ) : (
            <p className="challenge-meta">La correction apparaîtra à la fermeture du défi.</p>
          )}
        </div>
      ) : null}
    </li>
  );
}
