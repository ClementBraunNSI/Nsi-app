import type { RunReport, RunTest } from "./python-check";
import { explainFailedTest, explainPythonError, readError, type ErrorHelp } from "./python-error-help";

/*
 * Carnet d'erreurs : résumé court de l'erreur d'un essai refusé (gardé dans exercise_submissions.error),
 * regroupement par type d'erreur et différence avec le code réussi ensuite. Fonctions pures.
 */

export type ErrorSummary =
  | { kind: "exception"; type: string; message: string; detail?: string; line?: number }
  | { kind: "test"; label: string; detail?: string; actual?: string; expected?: string; printCompare?: boolean; total: number; failed: number }
  | { kind: "autre"; message: string };

const cut = (value: string | undefined, limit: number) => (value ? (value.length > limit ? `${value.slice(0, limit)}…` : value) : undefined);

/** Résumé d'un rapport refusé, assez petit pour être gardé avec l'essai. Null pour un rapport réussi. */
export function summarizeReport(report: RunReport): ErrorSummary | null {
  if (report.status === "success" && report.validated && report.tests.length > 0 && report.tests.every((test) => test.ok)) return null;
  if (report.error) {
    const read = readError(report.error, report.errorDetail);
    // La fin de la trace suffit pour retrouver la ligne et le type.
    const detail = cut(report.errorDetail?.split("\n").slice(-6).join("\n"), 800);
    if (read) return { kind: "exception", type: read.type, message: cut(report.error, 400) ?? "", detail, line: read.line };
    return { kind: "autre", message: cut(report.error, 400) ?? "" };
  }
  const failed = report.tests.filter((test) => !test.ok);
  const first = failed[0];
  if (first) {
    // Une erreur levée pendant un test compte comme cette erreur (NameError dans la fonction, etc.).
    if (first.detail && first.actual === undefined) {
      const read = readError(first.detail);
      if (read) return { kind: "exception", type: read.type, message: cut(first.detail, 400) ?? "", line: read.line };
    }
    return {
      kind: "test",
      label: cut(first.label, 300) ?? "",
      detail: cut(first.detail, 300),
      actual: cut(first.actual, 300),
      expected: cut(first.expected, 300),
      printCompare: first.printCompare || undefined,
      total: report.tests.length,
      failed: failed.length,
    };
  }
  return { kind: "autre", message: "Aucun test n'a pu être passé." };
}

/** Lit la colonne error (jsonb) : null si elle est vide ou mal formée. */
export function parseErrorSummary(value: unknown): ErrorSummary | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (data.kind === "exception" && typeof data.type === "string") return data as ErrorSummary;
  if (data.kind === "test" && typeof data.label === "string") return data as ErrorSummary;
  if (data.kind === "autre" && typeof data.message === "string") return data as ErrorSummary;
  return null;
}

export const TEST_GROUP = "Résultat faux";
export const OTHER_GROUP = "Autre erreur";

/** Clé de regroupement : le type Python (NameError…), « Résultat faux » pour un test raté. */
export function errorGroupKey(summary: ErrorSummary): string {
  if (summary.kind === "exception") return summary.type;
  if (summary.kind === "test") return TEST_GROUP;
  return OTHER_GROUP;
}

// Quelques mots pour chaque type courant, à côté du nom Python.
const GROUP_HINTS: Record<string, string> = {
  SyntaxError: "code mal écrit",
  IndentationError: "décalage des lignes",
  NameError: "nom inconnu",
  TypeError: "types incompatibles",
  ValueError: "valeur impossible à convertir",
  IndexError: "indice hors de la liste",
  KeyError: "clé absente du dictionnaire",
  ZeroDivisionError: "division par zéro",
  AttributeError: "méthode ou attribut inconnu",
  RecursionError: "récursion sans fin",
  UnboundLocalError: "variable utilisée avant d'être créée",
  EOFError: "saisie de trop",
  ModuleNotFoundError: "module introuvable",
  TimeoutError: "programme trop long",
  [TEST_GROUP]: "les tests attendaient une autre valeur",
};

export function groupHint(key: string) {
  return GROUP_HINTS[key];
}

/** Explication en français, reconstruite depuis le résumé et le code fautif. */
export function explainSummary(summary: ErrorSummary, code: string): ErrorHelp | null {
  if (summary.kind === "exception") {
    const help = explainPythonError(summary.message, summary.detail, code);
    if (!help || help.line || !summary.line) return help;
    // La ligne gardée avec le résumé, quand le message ne la donne plus.
    const lineText = code.split("\n")[summary.line - 1];
    return { ...help, line: summary.line, lineText: lineText?.trim() ? lineText : undefined };
  }
  if (summary.kind === "test") {
    const test: RunTest = { ok: false, label: summary.label, detail: summary.detail, actual: summary.actual, expected: summary.expected, printCompare: summary.printCompare };
    return explainFailedTest(test, code);
  }
  return null;
}

// ---------- Regroupement ----------

export type NotebookEntry = {
  id: string;
  exerciseId: string;
  createdAt: string;
  /** Null : essai ancien, pas encore analysé. */
  summary: ErrorSummary | null;
};

export type ErrorTrend = "disparue" | "frequente" | "occasionnelle";

export type ErrorGroup = {
  key: string;
  count: number;
  firstAt: string;
  lastAt: string;
  /** Fois sur les 14 derniers jours. */
  recent: number;
  trend: ErrorTrend;
  /** Exercices touchés, et ceux réussis après l'erreur. */
  exercises: number;
  fixed: number;
  entries: NotebookEntry[];
};

export const RECENT_DAYS = 14;
/** Une erreur absente depuis ce délai « ne revient plus ». */
export const GONE_DAYS = 21;

/**
 * Regroupe les erreurs analysées par type. Une erreur « ne revient plus » quand sa dernière apparition date de plus
 * de trois semaines ; elle est « encore fréquente » quand elle revient au moins 3 fois sur les deux dernières semaines.
 * Ordre : les fréquentes, puis les occasionnelles, puis celles qui ont disparu ; à égalité, la plus récente d'abord.
 */
export function groupErrors(entries: NotebookEntry[], fixedAfter: (entry: NotebookEntry) => boolean, now: Date): ErrorGroup[] {
  const groups = new Map<string, NotebookEntry[]>();
  for (const entry of entries) {
    if (!entry.summary) continue;
    const key = errorGroupKey(entry.summary);
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }
  const recentLimit = now.getTime() - RECENT_DAYS * 86_400_000;
  const goneLimit = now.getTime() - GONE_DAYS * 86_400_000;
  const order: Record<ErrorTrend, number> = { frequente: 0, occasionnelle: 1, disparue: 2 };

  return [...groups.entries()]
    .map(([key, list]) => {
      const sorted = [...list].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      const lastAt = sorted[0].createdAt;
      const recent = sorted.filter((entry) => Date.parse(entry.createdAt) >= recentLimit).length;
      const trend: ErrorTrend = Date.parse(lastAt) < goneLimit ? "disparue" : recent >= 3 ? "frequente" : "occasionnelle";
      const exercises = new Set(sorted.map((entry) => entry.exerciseId));
      const fixed = new Set(sorted.filter(fixedAfter).map((entry) => entry.exerciseId));
      return {
        key,
        count: sorted.length,
        firstAt: sorted[sorted.length - 1].createdAt,
        lastAt,
        recent,
        trend,
        exercises: exercises.size,
        fixed: fixed.size,
        entries: sorted,
      };
    })
    .sort((a, b) => order[a.trend] - order[b.trend] || Date.parse(b.lastAt) - Date.parse(a.lastAt));
}

/** Premier essai réussi sur le même exercice après l'essai refusé. */
export function findFix<T extends { exerciseId: string; createdAt: string; passed: boolean | null }>(entry: { exerciseId: string; createdAt: string }, attempts: T[]): T | null {
  const after = Date.parse(entry.createdAt);
  let best: T | null = null;
  for (const attempt of attempts) {
    if (attempt.passed !== true || attempt.exerciseId !== entry.exerciseId) continue;
    const at = Date.parse(attempt.createdAt);
    if (at <= after) continue;
    if (!best || at < Date.parse(best.createdAt)) best = attempt;
  }
  return best;
}

// ---------- Différence ----------

export type DiffLine = { kind: "same" | "removed" | "added"; text: string };

const DIFF_MAX_LINES = 120;
const DIFF_MAX_CHANGES = 24;

/**
 * Différence ligne à ligne (plus longue sous-suite commune). Null quand elle ne serait pas lisible :
 * code trop long, ou presque tout a changé ; le code fautif et le code corrigé sont alors montrés côte à côte.
 */
export function lineDiff(before: string, after: string): DiffLine[] | null {
  const a = before.replace(/\s+$/, "").split("\n");
  const b = after.replace(/\s+$/, "").split("\n");
  if (a.length > DIFF_MAX_LINES || b.length > DIFF_MAX_LINES) return null;
  const rows = a.length + 1;
  const cols = b.length + 1;
  const table = Array.from({ length: rows }, () => new Array<number>(cols).fill(0));
  for (let i = a.length - 1; i >= 0; i -= 1) {
    for (let j = b.length - 1; j >= 0; j -= 1) {
      table[i][j] = a[i].trimEnd() === b[j].trimEnd() ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i].trimEnd() === b[j].trimEnd()) {
      lines.push({ kind: "same", text: b[j] });
      i += 1;
      j += 1;
    } else if (i < a.length && (j >= b.length || table[i + 1][j] >= table[i][j + 1])) {
      // Ligne retirée avant la ligne ajoutée qui la remplace.
      lines.push({ kind: "removed", text: a[i] });
      i += 1;
    } else {
      lines.push({ kind: "added", text: b[j] });
      j += 1;
    }
  }
  const changes = lines.filter((line) => line.kind !== "same").length;
  const same = lines.length - changes;
  if (changes === 0 || changes > DIFF_MAX_CHANGES || same < changes / 2) return null;
  return lines;
}
