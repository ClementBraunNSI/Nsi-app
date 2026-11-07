import { splitStatement } from "./exercise-statement";

/*
 * Outils de révision : rapprochement des chapitres d'une interro avec les fiches, choix des exercices à refaire,
 * tirage d'un sujet blanc. Fonctions pures, sans base ni fichiers : testées dans tests/revisions.test.ts.
 */

export type SheetRef = { courseId: string; courseTitle: string; chapter: string; level: string };

export type RevisionExercise = SheetRef & {
  id: string;
  label: string;
  type: "python" | "sql";
  pagePath?: string;
};

// ---------- Texte ----------

/** Minuscules, sans accents ni ponctuation, espaces simples. */
export function foldText(text: string) {
  return (text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Mots qui ne disent rien du chapitre : articles, liaisons, et les mots communs à toutes les fiches.
const STOPWORDS = new Set(
  (
    "les des une aux par pour sur dans avec sans the and que qui est sont son ses leur leurs " +
    "chapitre chapitres fiche fiches exercice exercices cours partie parties revision revisions interro interrogation ds " +
    "python langage langages programmation notion notions base bases introduction tout toute tous toutes debut fin"
  ).split(" "),
);

function stem(word: string) {
  if (word.length > 4 && word.endsWith("aux")) return `${word.slice(0, -3)}al`;
  if (word.length > 3 && (word.endsWith("s") || word.endsWith("x"))) return word.slice(0, -1);
  return word;
}

/** Mots porteurs de sens, ramenés au singulier : « Les dictionnaires » donne ["dictionnaire"]. */
export function keywords(text: string): string[] {
  return [...new Set(foldText(text).split(" ").filter((word) => word.length >= 3 && !STOPWORDS.has(word)).map(stem))];
}

/** Morceaux du texte libre, séparés par virgule, point-virgule, barre ou retour à la ligne ; parenthèses retirées. */
export function splitChapters(text: string): string[] {
  return (text || "")
    .replace(/\([^)]*\)/g, " ")
    .split(/[\n,;/+•]|\s[-–]\s/)
    .map((part) => part.trim())
    .filter((part) => foldText(part).length > 0);
}

/** « Listes et dictionnaires » donne deux morceaux. */
function splitAnd(segment: string): string[] {
  return segment
    .split(/\bet\b|&/i)
    .map((part) => part.trim())
    .filter((part) => foldText(part).length > 0);
}

// Synonymes courants des intitulés d'interro : le mot ajouté est celui des titres de fiches.
const ALIASES: [RegExp, string][] = [
  [/\borientee?s? objets?\b|\bobjets?\b/, "poo"],
  [/\bplus proches? voisins?\b/, "knn"],
  [/\brecursi/, "recursivite"],
  [/\bdiviser pour regner\b/, "diviser regner"],
  [/\bfichiers? csv\b|\bcsv\b/, "table"],
];

function partWords(part: string) {
  const fold = foldText(part);
  const extra = ALIASES.filter(([pattern]) => pattern.test(fold)).flatMap(([, word]) => word.split(" "));
  return [...new Set([...keywords(part), ...extra.map(stem)])];
}

const within = (outer: string, inner: string) => Boolean(inner) && ` ${outer} `.includes(` ${inner} `);

/** Le texte nomme en entier le chapitre ou le titre de la fiche (« Langages et programmation »). */
function namesSheet(text: string, sheet: SheetRef) {
  const fold = foldText(text);
  return within(fold, foldText(sheet.chapter)) || within(fold, foldText(sheet.courseTitle));
}

/** Un morceau court correspond à la fiche : il est dans son titre, ou un mot porteur de sens est en commun. */
function partMatches(part: string, sheet: SheetRef) {
  const fold = foldText(part);
  if (fold.length >= 3 && within(foldText(sheet.courseTitle), fold)) return true;
  if (namesSheet(part, sheet)) return true;
  const words = partWords(part);
  if (words.length === 0) return false;
  const titleWords = new Set(keywords(`${sheet.courseTitle} ${sheet.courseId.replace(/[-_]/g, " ")}`));
  return words.some((word) => titleWords.has(word));
}

// ---------- Fiches d'une interro ----------

export type SheetMatch = {
  sheets: SheetRef[];
  /** Morceaux du texte de l'enseignant qui ne correspondent à aucune fiche. */
  unmatched: string[];
  /** Fiches choisies par l'enseignant dans le formulaire (le texte n'est alors pas lu). */
  chosen: boolean;
};

/** Les fiches de projets (chapitre « Projets ») ne servent pas aux révisions : ce sont des étapes d'un même programme. */
export function isProjectChapter(chapter: string) {
  return foldText(chapter) === "projets";
}

/**
 * Fiches visées par une interro. Les fiches choisies par l'enseignant passent avant le texte libre ;
 * sinon chaque morceau du texte est rapproché des chapitres et des titres de fiches, sans tenir compte
 * des accents, de la casse, des pluriels ni des petits mots. Un chapitre nommé en entier donne toutes ses fiches.
 * Les fiches du niveau de l'élève passent avant les autres ; les fiches de projets sont ignorées.
 */
export function matchAssessmentSheets(
  chaptersText: string,
  sheets: SheetRef[],
  options: { courseIds?: string[]; level?: string | null } = {},
): SheetMatch {
  const byId = new Map(sheets.map((sheet) => [sheet.courseId, sheet]));
  const chosen = (options.courseIds ?? []).map((id) => byId.get(id)).filter((sheet): sheet is SheetRef => Boolean(sheet));
  if (chosen.length > 0) return { sheets: chosen, unmatched: [], chosen: true };

  const usable = sheets.filter((sheet) => !isProjectChapter(sheet.chapter));
  const sameLevel = options.level ? usable.filter((sheet) => sheet.level === options.level) : [];
  const pools = sameLevel.length > 0 ? [sameLevel, usable] : [usable];
  const found = new Map<string, SheetRef>();
  const unmatched: string[] = [];
  for (const segment of splitChapters(chaptersText)) {
    const parts = splitAnd(segment);
    // Le niveau de l'élève d'abord ; les autres niveaux seulement si rien n'y correspond.
    let named: SheetRef[] = [];
    let byPart: SheetRef[][] = parts.map(() => []);
    for (const pool of pools) {
      // « Langages et programmation » : le chapitre est nommé en entier, le « et » ne coupe pas.
      named = pool.filter((sheet) => namesSheet(segment, sheet));
      byPart = parts.map((part) => pool.filter((sheet) => partMatches(part, sheet)));
      if (named.length > 0 || byPart.some((hits) => hits.length > 0)) break;
    }
    const namedText = named.map((sheet) => `${foldText(sheet.chapter)} ${foldText(sheet.courseTitle)}`).join(" ");
    for (const sheet of [...named, ...byPart.flat()]) found.set(sheet.courseId, sheet);
    parts.forEach((part, index) => {
      if (byPart[index].length === 0 && !within(namedText, foldText(part))) unmatched.push(part);
    });
  }
  return { sheets: [...found.values()], unmatched, chosen: false };
}

// ---------- Difficulté ----------

export const DIFFICULTIES = ["Introduction", "Facile", "Moyen", "Difficile", "Expert"] as const;
export const MINI_PROJECT = 6;

/** 1 (Introduction) à 5 (Expert), 6 pour un mini-projet. Lu dans « 2.3 [Facile] - … », sinon dans le numéro. */
export function difficultyRank(label: string): number {
  const tag = foldText(label.match(/\[([^\]]+)\]/)?.[1] ?? "");
  if (/mini projet/.test(tag) || /mini[\s-]?projet/i.test(label)) return MINI_PROJECT;
  const tagged: Record<string, number> = { introduction: 1, facile: 2, moyen: 3, avance: 4, difficile: 4, expert: 5 };
  if (tagged[tag]) return tagged[tag];
  const section = Number(label.match(/^(\d+)\./)?.[1]);
  if (section >= 1) return Math.min(section, 5);
  return 2;
}

/** « 3.2 [Moyen] - Palindrome » devient « 3.2 - Palindrome » : le niveau est affiché à part. */
export function cleanLabel(label: string) {
  return label.replace(/\s*\[[^\]]+\]\s*/g, " ").replace(/\s+/g, " ").trim();
}

export function difficultyLabel(rank: number) {
  return rank >= MINI_PROJECT ? "Mini-projet" : DIFFICULTIES[Math.max(1, rank) - 1];
}

// ---------- Exercices à refaire ----------

export type ExerciseHistory = {
  /** Au moins un essai refusé. */
  failedAt?: string;
  /** Réussi (tests ou validation de l'enseignant). */
  passedAt?: string;
};

export type RevisionReason = "rate" | "non-fait" | "ancien";

export type RevisionPick = RevisionExercise & { reason: RevisionReason; difficulty: number; when?: string };

export const REVISION_TARGET = 6;
export const REVISION_MIN = 4;
export const REVISION_MAX = 8;
/** Un exercice réussi depuis plus longtemps que ce délai est proposé à nouveau. */
export const LONG_AGO_DAYS = 21;

const time = (iso?: string) => (iso ? Date.parse(iso) || 0 : 0);

/** Fiche par fiche, à tour de rôle : la liste ne se remplit pas avec une seule fiche. */
function roundRobin<T extends { courseId: string }>(items: T[]): T[] {
  const bySheet = new Map<string, T[]>();
  for (const item of items) bySheet.set(item.courseId, [...(bySheet.get(item.courseId) ?? []), item]);
  const queues = [...bySheet.values()];
  const result: T[] = [];
  while (queues.some((queue) => queue.length > 0)) {
    for (const queue of queues) {
      const next = queue.shift();
      if (next) result.push(next);
    }
  }
  return result;
}

// Ordre des niveaux pour les exercices pas encore faits : le cœur de l'interro d'abord.
const NOT_DONE_ORDER = [2, 3, 1, 4, 5];

/**
 * Exercices à refaire avant une interro, pris dans les fiches visées : d'abord ceux ratés (jamais réussis),
 * les plus récents en premier, puis ceux pas encore faits (Facile et Moyen d'abord), puis ceux réussis
 * il y a plus de trois semaines. 6 en général, jusqu'à 8 s'il y a beaucoup d'exercices ratés, 4 au moins
 * quand la fiche le permet (des exercices réussis récemment complètent alors la liste).
 */
export function pickRevisionExercises(
  exercises: RevisionExercise[],
  history: Record<string, ExerciseHistory>,
  now: Date,
): RevisionPick[] {
  const pool = exercises
    .map((exercise) => ({ ...exercise, difficulty: difficultyRank(exercise.label) }))
    .filter((exercise) => exercise.difficulty < MINI_PROJECT);
  const longAgo = now.getTime() - LONG_AGO_DAYS * 86_400_000;

  const failed = pool
    .filter((exercise) => history[exercise.id]?.failedAt && !history[exercise.id]?.passedAt)
    .sort((a, b) => time(history[b.id].failedAt) - time(history[a.id].failedAt))
    .map((exercise) => ({ ...exercise, reason: "rate" as const, when: history[exercise.id].failedAt }));

  const notDone = NOT_DONE_ORDER.flatMap((rank) =>
    roundRobin(pool.filter((exercise) => exercise.difficulty === rank && !history[exercise.id]?.failedAt && !history[exercise.id]?.passedAt)),
  ).map((exercise) => ({ ...exercise, reason: "non-fait" as const }));

  const passed = pool
    .filter((exercise) => history[exercise.id]?.passedAt)
    .sort((a, b) => time(history[a.id].passedAt) - time(history[b.id].passedAt))
    .map((exercise) => ({ ...exercise, reason: "ancien" as const, when: history[exercise.id].passedAt }));
  const passedLongAgo = passed.filter((exercise) => time(exercise.when) < longAgo);
  const passedRecently = passed.filter((exercise) => time(exercise.when) >= longAgo);

  const picks: RevisionPick[] = failed.slice(0, REVISION_MAX);
  for (const list of [notDone, passedLongAgo]) {
    for (const exercise of list) {
      if (picks.length >= REVISION_TARGET) break;
      picks.push(exercise);
    }
  }
  for (const exercise of passedRecently) {
    if (picks.length >= REVISION_MIN) break;
    picks.push(exercise);
  }
  return picks;
}

/** Historique par exercice à partir des essais et des exercices validés. */
export function buildHistory(
  submissions: { exercise_id: string; passed: boolean | null; created_at: string }[],
  validated: { exercise_id: string; completed_at: string | null }[],
): Record<string, ExerciseHistory> {
  const history: Record<string, ExerciseHistory> = {};
  const entry = (id: string) => (history[id] ??= {});
  for (const row of submissions) {
    const item = entry(row.exercise_id);
    if (row.passed === true) {
      if (time(row.created_at) > time(item.passedAt)) item.passedAt = row.created_at;
    } else if (row.passed === false) {
      if (time(row.created_at) > time(item.failedAt)) item.failedAt = row.created_at;
    }
  }
  for (const row of validated) {
    const item = entry(row.exercise_id);
    const at = row.completed_at ?? new Date(0).toISOString();
    if (!item.passedAt || time(at) > time(item.passedAt)) item.passedAt = at;
  }
  return history;
}

// ---------- Sujet blanc ----------

export const PRACTICE_DURATIONS = [20, 30, 45] as const;
export type PracticeDuration = (typeof PRACTICE_DURATIONS)[number];

// Niveaux visés par durée : 3 exercices en 20 et 30 minutes, 4 en 45 minutes, de difficulté croissante.
const PRACTICE_LADDERS: Record<PracticeDuration, number[]> = {
  20: [1, 2, 3],
  30: [2, 3, 4],
  45: [2, 3, 4, 5],
};

/** Générateur pseudo-aléatoire reproductible (mulberry32) : un même tirage pour une même graine. */
export function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * Sujet blanc : 3 ou 4 exercices de difficulté croissante, un par niveau visé, tirés au hasard parmi les fiches
 * (jamais deux fois le même, jamais un mini-projet). Un niveau absent est remplacé par le plus proche encore libre ;
 * les exercices réussis sont pris en dernier recours. Le sujet est trié du plus facile au plus difficile.
 */
export function drawPracticeSubject(
  exercises: RevisionExercise[],
  minutes: PracticeDuration,
  options: { random?: () => number; solved?: Set<string> } = {},
): (RevisionExercise & { difficulty: number })[] {
  const random = options.random ?? Math.random;
  const solved = options.solved ?? new Set<string>();
  const pool = exercises
    .map((exercise) => ({ ...exercise, difficulty: difficultyRank(exercise.label) }))
    .filter((exercise) => exercise.difficulty < MINI_PROJECT);
  const taken = new Set<string>();
  const subject: (RevisionExercise & { difficulty: number })[] = [];
  const ladder = PRACTICE_LADDERS[minutes] ?? PRACTICE_LADDERS[30];

  for (const target of ladder) {
    const free = pool.filter((exercise) => !taken.has(exercise.id));
    if (free.length === 0) break;
    // Le plus proche du niveau visé, en préférant les exercices pas encore réussis puis le niveau au-dessus.
    const score = (exercise: { id: string; difficulty: number }) =>
      Math.abs(exercise.difficulty - target) * 2 + (exercise.difficulty < target ? 1 : 0) + (solved.has(exercise.id) ? 10 : 0);
    const best = Math.min(...free.map(score));
    const candidates = free.filter((exercise) => score(exercise) === best);
    const chosen = candidates[Math.floor(random() * candidates.length) % candidates.length];
    taken.add(chosen.id);
    subject.push(chosen);
  }
  return subject.sort((a, b) => a.difficulty - b.difficulty);
}

/** Énoncé d'un exercice de sujet blanc : énoncé, consignes et exemples, sans indice ni correction. */
export function practiceStatement(content: string, label: string) {
  const parts = splitStatement(content, label);
  return [
    parts.enonce,
    parts.consignes ? `### Consignes\n\n${parts.consignes}` : "",
    parts.exemples ? `### Exemples\n\n${parts.exemples}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Temps restant, en millisecondes, d'un entraînement commencé à startedAt. */
export function practiceRemaining(startedAt: string, minutes: number, now: number) {
  return Date.parse(startedAt) + minutes * 60_000 - now;
}

// ---------- Dates ----------

const SHORT_DAY = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });

/** « 12 nov. » pour un jour AAAA-MM-JJ. */
export function shortDay(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  return SHORT_DAY.format(new Date(Date.UTC(year, month - 1, date)));
}

/** « il y a 3 semaines », « aujourd'hui », « hier ». */
export function timeAgo(iso: string, now: Date) {
  const days = Math.floor((now.getTime() - Date.parse(iso)) / 86_400_000);
  if (days <= 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7) return `il y a ${days} jours`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks <= 1 ? "il y a une semaine" : `il y a ${weeks} semaines`;
  }
  const months = Math.round(days / 30);
  return months <= 1 ? "il y a un mois" : `il y a ${months} mois`;
}
