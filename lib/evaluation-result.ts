import type { EvaluationExercise } from "./evaluation-subject";
import type { RunReport } from "./python-check";
import { functionNames, type CopyGrade, type GradedAnswer } from "./evaluation-grade";

/*
 * Résultat d'une copie montré à l'élève une fois l'évaluation fermée. Il est construit côté enseignant, quand la
 * note est validée, puis enregistré avec la copie : l'élève n'a jamais accès aux tests ni à la correction.
 * On y garde les points de chaque exercice, les messages des tests non réussis et les notions à retravailler,
 * rapprochées ensuite des fiches d'exercices comme les chapitres d'une interro.
 */

export type ResultTest = { label: string; expected?: string; actual?: string };

export type ResultExercise = {
  id: string;
  label: string;
  points: number;
  max: number;
  written: boolean;
  testsPassed: number;
  testsTotal: number;
  /** Points fixés à la relecture plutôt que tirés des tests. */
  manual: boolean;
  /** Tests non réussis (les premiers seulement). */
  failed: ResultTest[];
  /** Erreur qui empêche le programme de s'exécuter jusqu'aux tests. */
  error: string | null;
  /** Notions à retravailler quand des points sont perdus (« boucles », « listes »…). */
  review: string[];
};

export type EvaluationResult = {
  /** Note sur 20. */
  total: number;
  exercises: ResultExercise[];
  /** Dernière relecture d'un exercice de la copie. */
  validatedAt: string | null;
};

export type ClassStats = {
  classe: string | null;
  /** Copies validées prises en compte. */
  count: number;
  /** Copies rendues pas encore validées. */
  pending: number;
  /** Absents en dessous de 5 copies validées. */
  mean: number | null;
  q1: number | null;
  median: number | null;
  q3: number | null;
};

const MAX_FAILED = 6;
const MAX_NOTIONS = 3;

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/** Le code sans les chaînes ni les commentaires : un mot dans un texte n'est pas une instruction. */
function bare(code: string) {
  return code
    .replace(/("""|''')[\s\S]*?\1/g, '""')
    .replace(/(["'])(?:\\.|(?!\1)[^\\\n])*\1/g, '""')
    .replace(/#.*$/gm, "");
}

/** Lignes d'une fonction (def compris), ou null si le code ne la définit pas. */
export function functionBody(code: string, name: string) {
  const lines = (code || "").split("\n");
  const start = lines.findIndex((line) => new RegExp(`^\\s*def\\s+${name}\\s*\\(`).test(line));
  if (start === -1) return null;
  const indent = lines[start].match(/^\s*/)![0].length;
  const body = [lines[start]];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && line.match(/^\s*/)![0].length <= indent) break;
    body.push(line);
  }
  return body.join("\n");
}

// Du plus précis au plus général : une fonction qui parcourt un dictionnaire renvoie d'abord vers les dictionnaires.
const NOTIONS: [string, RegExp][] = [
  ["poo", /\bclass\s+\w|\bself\./],
  ["csv", /\bcsv\b|\bopen\(/],
  ["dictionnaires", /\{\s*\}|\{[^{}]*:|\.(items|keys|values)\(|\bdict\(/],
  ["listes", /\.(append|pop|insert|remove)\(|\[\s*\]|\[[^[\]]*,[^[\]]*\]|\blist\(/],
  ["boucles", /\b(for|while)\b/],
  ["conditions", /\bif\b/],
  ["types", /\b(int|float|str|bool|round)\(|\/\/|%/],
];

/** Notions employées par un morceau de code Python, de la plus précise à la plus générale. */
export function codeNotions(code: string, functions: string[] = []) {
  const text = bare(code);
  const found = NOTIONS.filter(([, pattern]) => pattern.test(text)).map(([notion]) => notion);
  // Une fonction qui s'appelle elle-même dans son corps.
  const recursive = functions.some((name) => {
    const body = functionBody(text, name);
    return body ? new RegExp(`\\b${name}\\s*\\(`).test(body.split("\n").slice(1).join("\n")) : false;
  });
  return recursive ? ["récursivité", ...found] : found;
}

/** Fonctions de la correction nommées par au moins un test non réussi. */
function failedFunctions(names: string[], report: RunReport | null) {
  const failed = (report?.tests ?? []).filter((test) => !test.ok);
  return names.filter((name) => failed.some((test) => new RegExp(`\\b${name}\\b`).test(test.source || test.label || "")));
}

/**
 * Notions à retravailler pour un exercice où des points sont perdus. Le libellé revoir="…" du sujet passe avant
 * tout ; sinon on lit la correction, limitée aux fonctions dont un test échoue. « fonctions » s'ajoute en tête
 * quand l'élève n'a pas écrit la fonction demandée, ou l'a écrite sans return alors qu'elle doit renvoyer une valeur.
 */
export function reviewNotions(
  exercise: Pick<EvaluationExercise, "type"> & { review?: string[] },
  correction: string,
  code: string,
  report: RunReport | null,
) {
  if (exercise.review?.length) return exercise.review.slice(0, MAX_NOTIONS);
  if (exercise.type === "sql") return ["sql"];
  const names = functionNames(correction);
  const failing = failedFunctions(names, report);
  const targets = failing.length > 0 ? failing : names;
  const focus = targets.map((name) => functionBody(correction, name)).filter(Boolean).join("\n") || correction;
  const notions = codeNotions(focus, targets);
  const misusedFunction = targets.some((name) => {
    const own = functionBody(code, name);
    if (!own) return true;
    const expected = functionBody(correction, name) ?? "";
    return /\breturn\b/.test(bare(expected)) && !/\breturn\b/.test(bare(own));
  });
  const all = misusedFunction || notions.length === 0 ? ["fonctions", ...notions] : notions;
  return [...new Set(all)].slice(0, MAX_NOTIONS);
}

/**
 * Résumé de la copie pour l'élève, ou null tant que la note n'est pas validée. Ni les tests (lignes assert)
 * ni la correction n'y figurent : seulement les messages des tests non réussis et les valeurs obtenues.
 */
export function buildResult(
  exercises: (Pick<EvaluationExercise, "id" | "label" | "type"> & { correction?: string; review?: string[] })[],
  answers: Record<string, GradedAnswer | undefined>,
  grade: CopyGrade,
): EvaluationResult | null {
  if (!grade.final) return null;
  const reviewed = Object.values(answers)
    .map((answer) => answer?.reviewedAt)
    .filter((value): value is string => Boolean(value))
    .sort();
  return {
    total: grade.total,
    validatedAt: reviewed.at(-1) ?? null,
    exercises: exercises.map((exercise) => {
      const item = grade.exercises.find((entry) => entry.id === exercise.id);
      const answer = answers[exercise.id];
      const report = item?.graded ? (answer?.report ?? null) : null;
      const failed = (report?.tests ?? [])
        .filter((test) => !test.ok)
        .slice(0, MAX_FAILED)
        .map((test) => ({
          label: clip(test.label || "Test non réussi", 200),
          ...(test.expected ? { expected: clip(test.expected, 120) } : {}),
          ...(test.actual ? { actual: clip(test.actual, 120) } : {}),
        }));
      const points = item?.points ?? 0;
      const max = item?.max ?? 0;
      return {
        id: exercise.id,
        label: exercise.label,
        points,
        max,
        written: item?.written ?? false,
        testsPassed: item?.testsPassed ?? 0,
        testsTotal: item?.testsTotal ?? 0,
        manual: item?.manual ?? false,
        failed,
        error: report?.error && (item?.testsPassed ?? 0) === 0 ? clip(report.error, 300) : null,
        review: points < max ? reviewNotions(exercise, exercise.correction ?? "", answer?.code ?? "", report) : [],
      };
    }),
  };
}

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => (value as Record<string, unknown>)[key] !== undefined)
        .sort()
        .map((key) => [key, canonical((value as Record<string, unknown>)[key])]),
    );
  }
  return value;
}

/** Même résultat, quel que soit l'ordre des clés (la base les range à sa façon). */
export function sameResult(a: unknown, b: unknown) {
  return JSON.stringify(canonical(a ?? null)) === JSON.stringify(canonical(b ?? null));
}

const decimal = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");

/** Place de la note dans la classe, en une phrase, à partir des quartiles et de la moyenne. */
export function positionText(total: number, stats: ClassStats) {
  if (stats.mean === null || stats.q1 === null || stats.median === null || stats.q3 === null) return null;
  const quarter =
    total >= stats.q3 && total > stats.median
      ? "Parmi le quart des meilleures notes de la classe"
      : total >= stats.median
        ? "Dans la moitié haute de la classe"
        : total >= stats.q1
          ? "Dans la moitié basse de la classe"
          : "Parmi le quart des notes les plus basses de la classe";
  const gap = Math.round((total - stats.mean) * 100) / 100;
  const unit = (value: number) => `${decimal(Math.abs(value))} point${Math.abs(value) >= 2 ? "s" : ""}`;
  const mean = gap === 0 ? "pile à la moyenne" : gap > 0 ? `${unit(gap)} au-dessus de la moyenne` : `${unit(gap)} en dessous de la moyenne`;
  return `${quarter}, ${mean}.`;
}
