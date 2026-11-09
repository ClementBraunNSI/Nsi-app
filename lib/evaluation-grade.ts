import type { EvaluationExercise } from "./evaluation-subject";
import type { RunReport } from "./python-check";

/**
 * Note d'une copie d'évaluation, presque automatique.
 * - Chaque exercice vaut des points (attribut points="4" ou libellé « (4 points) » ; sinon 20 répartis à égalité).
 * - Points obtenus = points × tests réussis / tests au total, sauf si l'enseignant a fixé les points à la main.
 * - Un exercice est « à vérifier » quand une de ses fonctions ne réussit aucun de ses tests, ou quand le programme
 *   ne s'exécute pas : l'enseignant regarde le code et garde la note automatique ou en donne une autre.
 * La note finale est ramenée sur 20 et arrondie au quart de point. Elle reste provisoire tant que l'enseignant
 * n'a pas vu chaque exercice écrit (note automatique gardée ou points donnés à la main) : aucune note n'est
 * définitive sans relecture de la copie.
 */

export type GradedAnswer = {
  code: string;
  testsPassed: number | null;
  testsTotal: number | null;
  report: RunReport | null;
  gradedAt: string | null;
  /** Points donnés à la main par l'enseignant (remplacent la note automatique). */
  manualPoints: number | null;
  /** L'enseignant a vérifié l'exercice (note automatique gardée ou points donnés à la main). */
  reviewedAt: string | null;
};

export type ExerciseGrade = {
  id: string;
  label: string;
  /** Points de l'exercice dans le barème (ramené sur 20). */
  max: number;
  /** Points tirés des tests, avant vérification. */
  auto: number;
  /** Points retenus : ceux de l'enseignant s'il en a donné, sinon les points automatiques. */
  points: number;
  testsPassed: number;
  testsTotal: number;
  written: boolean;
  graded: boolean;
  needsReview: boolean;
  reviewed: boolean;
  manual: boolean;
  /** Raisons de la vérification : fonctions sans aucun test réussi, programme qui ne s'exécute pas. */
  reasons: string[];
};

export type CopyGrade = {
  /** Note sur 20, arrondie au quart de point. */
  total: number;
  exercises: ExerciseGrade[];
  /** Exercices signalés (fonction sans test réussi, programme qui ne tourne pas) pas encore vus par l'enseignant. */
  pendingReview: number;
  /** Exercices écrits que l'enseignant n'a pas encore validés, signalés ou non. */
  toValidate: number;
  /** Exercices écrits pas encore passés aux tests. */
  ungraded: number;
  /** Note définitive : tout est corrigé, et chaque exercice écrit a été validé par l'enseignant. */
  final: boolean;
};

const round2 = (value: number) => Math.round(value * 100) / 100;
const quarter = (value: number) => Math.round(value * 4) / 4;

/** Points lus dans un libellé : « Exercice 2 - Le ticket (4 points) », « (2,5 pts) ». */
export function labelPoints(label: string) {
  const match = label.match(/\((\d+(?:[.,]\d+)?)\s*(?:points?|pts?)\)/i);
  return match ? Number(match[1].replace(",", ".")) : null;
}

/** Barème de chaque exercice, ramené sur 20 ; sans barème complet, 20 points répartis à égalité. */
export function exercisePoints(exercises: Pick<EvaluationExercise, "id" | "label" | "points">[]) {
  const raw = exercises.map((exercise) => exercise.points ?? labelPoints(exercise.label));
  const complete = raw.length > 0 && raw.every((value) => value !== null && value > 0);
  const sum = complete ? raw.reduce<number>((total, value) => total + (value ?? 0), 0) : exercises.length;
  return Object.fromEntries(exercises.map((exercise, index) => [exercise.id, ((complete ? raw[index]! : 1) / sum) * 20])) as Record<string, number>;
}

/** Fonctions définies dans un code Python (def nom(...)). */
export function functionNames(code: string) {
  return [...new Set([...code.matchAll(/^\s*def\s+([A-Za-z_]\w*)\s*\(/gm)].map((match) => match[1]))];
}

/**
 * Fonctions de la correction dont aucun test (qui la nomme) ne réussit. Le test est repéré par sa ligne assert ;
 * les copies corrigées avant que cette ligne soit gardée se rabattent sur le message du test.
 */
export function failingFunctions(correction: string, report: RunReport | null) {
  if (!report?.tests.length) return [];
  return functionNames(correction).filter((name) => {
    const pattern = new RegExp(`\\b${name}\\b`);
    const own = report.tests.filter((test) => pattern.test(test.source || test.label || ""));
    return own.length > 0 && own.every((test) => !test.ok);
  });
}

export function gradeCopy(
  exercises: (Pick<EvaluationExercise, "id" | "label" | "points"> & { correction?: string; hasTests?: boolean })[],
  answers: Record<string, GradedAnswer | undefined>,
): CopyGrade {
  const maxima = exercisePoints(exercises);
  const grades = exercises.map((exercise): ExerciseGrade => {
    const answer = answers[exercise.id];
    const max = maxima[exercise.id];
    const written = Boolean(answer?.code?.trim());
    const graded = written && answer?.gradedAt != null && answer.testsTotal !== null;
    const testsTotal = graded ? answer!.testsTotal ?? 0 : 0;
    const testsPassed = graded ? answer!.testsPassed ?? 0 : 0;
    const auto = graded && testsTotal > 0 ? (max * testsPassed) / testsTotal : 0;

    const reasons: string[] = [];
    if (graded) {
      if (answer!.report?.error && testsPassed === 0) reasons.push("le programme ne s'exécute pas jusqu'aux tests");
      for (const name of failingFunctions(exercise.correction ?? "", answer!.report)) reasons.push(`${name} : aucun test réussi`);
      if (reasons.length === 0 && testsPassed === 0) reasons.push("aucun test réussi");
    }
    // Un exercice sans tests ne se corrige qu'à la main.
    if (written && exercise.hasTests === false) reasons.push("exercice sans tests : à noter à la main");

    const manual = answer?.manualPoints != null;
    const points = manual ? Math.min(max, Math.max(0, answer!.manualPoints!)) : auto;
    return {
      id: exercise.id,
      label: exercise.label,
      max: round2(max),
      auto: round2(auto),
      points: round2(points),
      testsPassed,
      testsTotal,
      written,
      graded,
      needsReview: reasons.length > 0,
      reviewed: Boolean(answer?.reviewedAt),
      manual,
      reasons,
    };
  });
  const pendingReview = grades.filter((grade) => grade.needsReview && !grade.reviewed).length;
  const toValidate = grades.filter((grade) => grade.written && !grade.reviewed).length;
  const ungraded = grades.filter((grade) => grade.written && !grade.graded && exercises.find((item) => item.id === grade.id)?.hasTests !== false).length;
  return {
    total: quarter(grades.reduce((sum, grade) => sum + grade.points, 0)),
    exercises: grades,
    pendingReview,
    toValidate,
    ungraded,
    final: toValidate === 0 && ungraded === 0,
  };
}

/** Note lisible : « 14,25 / 20 ». */
export function formatGrade(total: number) {
  return `${String(total).replace(".", ",")} / 20`;
}
