import type { EvaluationExercise } from "./evaluation-subject";
import { failingFunctions, gradeCopy, type CopyGrade, type GradedAnswer } from "./evaluation-grade";
import { reviewNotions } from "./evaluation-result";
import { quantile } from "./student-card";

/*
 * Bilan d'une interrogation pour l'enseignant, une fois les copies rendues : répartition des notes, exercices
 * les moins réussis, tests les plus ratés, notions à retravailler, élèves à accompagner.
 * Calcul sans base à partir des copies rendues, testé dans tests/evaluation-summary.test.ts.
 */

export type SummaryCopy = {
  studentId: string;
  name: string;
  subjectId: string;
  subjectLabel: string;
  exercises: (Pick<EvaluationExercise, "id" | "label" | "type" | "points"> & { correction?: string; hasTests?: boolean; review?: string[] })[];
  answers: Record<string, GradedAnswer | undefined>;
};

export type SummaryExercise = {
  key: string;
  subjectLabel: string;
  label: string;
  max: number;
  copies: number;
  /** Moyenne des points obtenus. */
  mean: number;
  /** Part des points obtenus, de 0 à 1. */
  rate: number;
  full: number;
  zero: number;
  /** Copies sans rien d'écrit pour cet exercice. */
  blank: number;
  /** Fonctions dont aucun test ne passe, avec le nombre de copies concernées. */
  functions: { name: string; copies: number }[];
};

export type SummaryTest = { key: string; label: string; exerciseLabel: string; subjectLabel: string; failed: number; tried: number };

export type EvaluationSummary = {
  /** Élèves des classes de l'évaluation. */
  students: number;
  handedIn: number;
  /** Élèves sans copie rendue (absents, pas commencé, copie encore ouverte). */
  missing: number;
  validated: number;
  /** Exercices écrits pas encore passés aux tests : le bilan est incomplet tant qu'il en reste. */
  ungraded: number;
  grades: {
    mean: number;
    median: number;
    q1: number;
    q3: number;
    min: number;
    max: number;
    /** Copies sous 10. */
    below: number;
    bins: { label: string; count: number }[];
  } | null;
  /** Du moins réussi au mieux réussi. */
  exercises: SummaryExercise[];
  /** Tests les plus souvent ratés, parmi les copies qui ont écrit l'exercice. */
  tests: SummaryTest[];
  /** Notions à retravailler, avec le nombre d'élèves concernés. */
  notions: { notion: string; students: number }[];
  /** Copies les plus faibles (note sous 8), de la plus basse à la plus haute. */
  struggling: { studentId: string; name: string; total: number }[];
  /** Plusieurs sujets : le libellé du sujet est affiché à côté de chaque exercice. */
  severalSubjects: boolean;
};

const BINS = [
  { label: "0 à 4", from: 0, to: 4 },
  { label: "4 à 8", from: 4, to: 8 },
  { label: "8 à 12", from: 8, to: 12 },
  { label: "12 à 16", from: 12, to: 16 },
  { label: "16 à 20", from: 16, to: 20.01 },
];
export const SUMMARY_TESTS = 6;
export const STRUGGLING_UNDER = 8;
const round2 = (value: number) => Math.round(value * 100) / 100;

export function buildEvaluationSummary(copies: SummaryCopy[], students: number): EvaluationSummary {
  const graded: { copy: SummaryCopy; grade: CopyGrade }[] = copies.map((copy) => ({ copy, grade: gradeCopy(copy.exercises, copy.answers) }));
  const totals = graded.map(({ grade }) => grade.total).sort((a, b) => a - b);

  const exercises = new Map<string, SummaryExercise & { points: number; byFunction: Map<string, number> }>();
  const tests = new Map<string, SummaryTest>();
  const notions = new Map<string, Set<string>>();

  for (const { copy, grade } of graded) {
    for (const exercise of copy.exercises) {
      const item = grade.exercises.find((entry) => entry.id === exercise.id);
      if (!item) continue;
      const key = `${copy.subjectId}:${exercise.id}`;
      const entry =
        exercises.get(key) ??
        { key, subjectLabel: copy.subjectLabel, label: exercise.label, max: item.max, copies: 0, mean: 0, rate: 0, full: 0, zero: 0, blank: 0, functions: [], points: 0, byFunction: new Map<string, number>() };
      entry.copies += 1;
      entry.points += item.points;
      if (!item.written) entry.blank += 1;
      if (item.points >= item.max) entry.full += 1;
      else if (item.points === 0) entry.zero += 1;
      const answer = copy.answers[exercise.id];
      const report = item.graded ? (answer?.report ?? null) : null;
      for (const name of failingFunctions(exercise.correction ?? "", report)) entry.byFunction.set(name, (entry.byFunction.get(name) ?? 0) + 1);
      exercises.set(key, entry);

      // Tests : comptés sur les copies où l'exercice est écrit et corrigé.
      for (const test of report?.tests ?? []) {
        const label = test.label || test.source || "Test";
        const testKey = `${key}:${label}`;
        const row = tests.get(testKey) ?? { key: testKey, label, exerciseLabel: exercise.label, subjectLabel: copy.subjectLabel, failed: 0, tried: 0 };
        row.tried += 1;
        if (!test.ok) row.failed += 1;
        tests.set(testKey, row);
      }

      if (item.points < item.max) {
        for (const notion of reviewNotions(exercise, exercise.correction ?? "", answer?.code ?? "", report)) {
          if (!notions.has(notion)) notions.set(notion, new Set());
          notions.get(notion)!.add(copy.studentId);
        }
      }
    }
  }

  return {
    students,
    handedIn: copies.length,
    missing: Math.max(0, students - copies.length),
    validated: graded.filter(({ grade }) => grade.final).length,
    ungraded: graded.reduce((sum, { grade }) => sum + grade.ungraded, 0),
    grades: totals.length
      ? {
          mean: round2(totals.reduce((sum, value) => sum + value, 0) / totals.length),
          median: quantile(totals, 0.5)!,
          q1: quantile(totals, 0.25)!,
          q3: quantile(totals, 0.75)!,
          min: totals[0],
          max: totals[totals.length - 1],
          below: totals.filter((value) => value < 10).length,
          bins: BINS.map((bin) => ({ label: bin.label, count: totals.filter((value) => value >= bin.from && value < bin.to).length })),
        }
      : null,
    exercises: [...exercises.values()]
      .map(({ points, byFunction, ...entry }) => ({
        ...entry,
        mean: round2(points / entry.copies),
        rate: entry.max > 0 ? round2(points / entry.copies / entry.max) : 0,
        functions: [...byFunction].map(([name, count]) => ({ name, copies: count })).sort((a, b) => b.copies - a.copies),
      }))
      .sort((a, b) => a.rate - b.rate || a.label.localeCompare(b.label, "fr", { numeric: true })),
    tests: [...tests.values()]
      .filter((test) => test.failed > 0)
      .sort((a, b) => b.failed / b.tried - a.failed / a.tried || b.failed - a.failed)
      .slice(0, SUMMARY_TESTS),
    notions: [...notions].map(([notion, ids]) => ({ notion, students: ids.size })).sort((a, b) => b.students - a.students || a.notion.localeCompare(b.notion, "fr")),
    struggling: graded
      .filter(({ grade }) => grade.total < STRUGGLING_UNDER)
      .map(({ copy, grade }) => ({ studentId: copy.studentId, name: copy.name, total: grade.total }))
      .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name, "fr")),
    severalSubjects: new Set(copies.map((copy) => copy.subjectId)).size > 1,
  };
}
