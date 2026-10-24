import type { RunOutcome } from "./engines";

/**
 * Avancée des enquêtes, gardée dans le stockage local du navigateur (rien n'est envoyé au serveur).
 * Toutes les clés d'une enquête commencent par `enquete-{slug}-`, ce qui permet de tout effacer d'un coup.
 */
export const SOLVED_KEY = "enquetes-resolues";
export const SOLUTIONS_KEY = "enquetes-solutions";

export type Mode = "blockly" | "python" | "sql";
export type Solution = { culprit: string; explanation: string };
export type CaseProgress = { hints: number; attempts: number; answer: string; openTable: string | null };

const EMPTY: CaseProgress = { hints: 0, attempts: 0, answer: "", openTable: null };
const MAX_SAVED_ROWS = 200;
const MAX_SAVED_PRINT = 20_000;

const caseKey = (slug: string, part: string) => `enquete-${slug}-${part}`;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage plein ou indisponible : l'enquête continue sans sauvegarde */
  }
}

export function readSolved(): string[] {
  return readJson<string[]>(SOLVED_KEY, []);
}

export function readSolutions(): Record<string, Solution> {
  return readJson<Record<string, Solution>>(SOLUTIONS_KEY, {});
}

export function markSolved(slug: string, solution: Solution) {
  writeJson(SOLVED_KEY, [...new Set([...readSolved(), slug])]);
  writeJson(SOLUTIONS_KEY, { ...readSolutions(), [slug]: solution });
}

export function readProgress(slug: string): CaseProgress {
  return { ...EMPTY, ...readJson<Partial<CaseProgress>>(caseKey(slug, "progression"), {}) };
}

export function saveProgress(slug: string, patch: Partial<CaseProgress>) {
  writeJson(caseKey(slug, "progression"), { ...readProgress(slug), ...patch });
}

/** Dernier résultat obtenu dans un mode, pour le retrouver en revenant sur l'enquête. */
export function readOutcome(slug: string, mode: Mode): RunOutcome | null {
  return readJson<RunOutcome | null>(caseKey(slug, `${mode}-resultat`), null);
}

export function saveOutcome(slug: string, mode: Mode, outcome: RunOutcome) {
  writeJson(caseKey(slug, `${mode}-resultat`), {
    ...outcome,
    printed: outcome.printed?.slice(0, MAX_SAVED_PRINT),
    results: outcome.results.map((result) => ({
      columns: result.columns,
      rows: result.rows.slice(0, MAX_SAVED_ROWS),
      total: result.total ?? result.rows.length,
    })),
  });
}

/** « new » tant que l'élève n'a rien fait, « started » dès qu'une trace existe, « solved » une fois le coupable trouvé. */
export function caseStatus(slug: string): "new" | "started" | "solved" {
  if (readSolved().includes(slug)) return "solved";
  try {
    const prefix = caseKey(slug, "");
    for (let index = 0; index < localStorage.length; index += 1) {
      if (localStorage.key(index)?.startsWith(prefix)) return "started";
    }
  } catch {
    /* stockage indisponible */
  }
  return "new";
}

/** Efface toute l'avancée d'une enquête : code, blocs, notes, indices, résultats et résolution. */
export function clearCase(slug: string) {
  try {
    const prefix = caseKey(slug, "");
    const keys: string[] = [];
    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (key?.startsWith(prefix)) keys.push(key);
    }
    keys.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* stockage indisponible */
  }
  writeJson(SOLVED_KEY, readSolved().filter((item) => item !== slug));
  const solutions = readSolutions();
  delete solutions[slug];
  writeJson(SOLUTIONS_KEY, solutions);
}
