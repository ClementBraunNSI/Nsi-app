"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Ban, Check, Lock, Sparkles } from "lucide-react";
import type { ExerciseCheckResult, LabExercise } from "@/app/actions/getExercises";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import type { ChallengeAnswer } from "@/lib/challenges";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";

/** Éditeur d'un exercice de défi : un seul éditeur pour tous ses niveaux (le code reste, la consigne et les tests changent). */
export function challengeLab(challengeId: string, challengeTitle: string, base: EvaluationExercise): LabExercise {
  return {
    id: `defi-${challengeId}-${base.id}`,
    label: base.label,
    courseId: "defi",
    courseTitle: challengeTitle,
    content: base.statement,
    starterCode: base.starter || undefined,
    sqlSetup: base.sqlSetup || undefined,
    pythonPackages: base.packages?.length ? base.packages : undefined,
    chapter: "",
    level: "",
    fileName: "defi",
    type: base.type,
    hasVerification: true,
  };
}

/** Code repris à l'ouverture : celui du niveau le plus avancé déjà vérifié. */
export function latestLevelCode(levels: EvaluationExercise[], answers: Record<string, ChallengeAnswer>) {
  for (const level of [...levels].reverse()) {
    if (answers[level.id]?.code) return answers[level.id].code;
  }
  return undefined;
}

type Props = {
  challengeId: string;
  challengeTitle: string;
  /** Niveau 1 d'abord, puis les niveaux bonus. */
  levels: EvaluationExercise[];
  answers: Record<string, ChallengeAnswer>;
  isPassed: (exerciseId: string) => boolean;
  checker: (exerciseId: string, code: string) => Promise<ExerciseCheckResult>;
  onPassed: (exerciseId: string) => void;
  /** Titre placé au-dessus de la consigne (numéro de l'exercice, pastille « Réussi »). */
  heading?: ReactNode;
  statementClassName: string;
  lockdown?: boolean;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
};

export function LeveledExercise({
  challengeId,
  challengeTitle,
  levels,
  answers,
  isPassed,
  checker,
  onPassed,
  heading,
  statementClassName,
  lockdown,
  initialCode,
  onCodeChange,
}: Props) {
  const base = levels[0];
  const lab = useMemo(() => challengeLab(challengeId, challengeTitle, base), [challengeId, challengeTitle, base]);
  const unlocked = (index: number) => index === 0 || isPassed(levels[index - 1].id);
  // À l'ouverture : le premier niveau ouvert et pas encore réussi, sinon le dernier niveau ouvert.
  const [selectedId, setSelectedId] = useState(() => {
    const open = levels.filter((_, index) => unlocked(index));
    return (open.find((level) => !isPassed(level.id)) ?? open.at(-1) ?? base).id;
  });
  const [notice, setNotice] = useState<string | null>(null);
  const index = Math.max(0, levels.findIndex((level) => level.id === selectedId));
  const current = levels[index];
  const leveled = levels.length > 1;

  const handlePassed = (id: string) => {
    onPassed(id);
    const position = levels.findIndex((level) => level.id === id);
    const next = levels[position + 1];
    if (next) {
      setSelectedId(next.id);
      setNotice(
        position === 0
          ? `Niveau 1 réussi : le défi est validé pour cet exercice. Le niveau ${next.level ?? 2} est ouvert : la consigne et les tests changent, le code reste dans l'éditeur.`
          : `Niveau ${levels[position].level ?? position + 1} réussi. Le niveau ${next.level ?? position + 2} est ouvert.`,
      );
    } else if (position > 0) {
      setNotice(`Niveau ${levels[position].level ?? position + 1} réussi : bonus gagné.`);
    }
  };

  return (
    <>
      <div className={statementClassName}>
        {heading}
        {leveled ? (
          <div className="challenge-levels" role="tablist" aria-label="Niveaux de l'exercice">
            {levels.map((level, position) => {
              const open = unlocked(position);
              const done = isPassed(level.id);
              return (
                <button
                  key={level.id}
                  type="button"
                  role="tab"
                  aria-selected={level.id === current.id}
                  disabled={!open}
                  title={open ? undefined : "S'ouvre une fois le niveau précédent réussi"}
                  className={`challenge-level-tab ${level.id === current.id ? "is-current" : ""} ${done ? "is-done" : ""}`}
                  onClick={() => {
                    setSelectedId(level.id);
                    setNotice(null);
                  }}
                >
                  {done ? <Check size={14} aria-hidden /> : open ? null : <Lock size={13} aria-hidden />}
                  Niveau {level.level ?? position + 1}
                  {position > 0 ? <span className="challenge-level-bonus"><Sparkles size={12} aria-hidden /> bonus</span> : null}
                </button>
              );
            })}
          </div>
        ) : null}
        {notice ? (
          <p className="challenge-level-notice" role="status">{notice}</p>
        ) : leveled && index === 0 && !isPassed(base.id) ? (
          <p className="challenge-level-info">
            Seul le niveau 1 compte pour valider le défi. Une fois réussi, le niveau suivant s&apos;ouvre : il est facultatif et rapporte un bonus.
          </p>
        ) : null}
        {current.forbidden?.length ? (
          <p className="challenge-forbidden">
            <Ban size={14} aria-hidden /> Interdit dans {leveled ? "ce niveau" : "cet exercice"} :{" "}
            {current.forbidden.map((word, position) => (
              <span key={word}>
                {position > 0 ? ", " : ""}
                <code>{word}</code>
              </span>
            ))}
          </p>
        ) : null}
        <ExerciseStatement label={current.label} content={current.statement} />
      </div>
      <ExerciseWorkspace
        exercise={lab}
        nav={null}
        embedded
        lockdown={lockdown}
        initialCode={initialCode ?? latestLevelCode(levels, answers)}
        onCodeChange={onCodeChange}
        resultsKey={current.id}
        onCompleted={() => handlePassed(current.id)}
        checker={(code) => checker(current.id, code)}
      />
    </>
  );
}
