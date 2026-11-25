import { quantile } from "./student-card";
import { classLevel } from "./admin-today";

/*
 * Onglet « Classes » de l'admin : statistiques de chaque classe (moyenne, médiane, quartiles, écart-type), notes de
 * chaque évaluation et élèves classés par moyenne. Seules les notes validées comptent ; une copie rendue sans note
 * validée est « à corriger ». Calcul sans base, testé dans tests/admin-classes.test.ts.
 */

export type BoardInput = {
  now: Date;
  /** Élèves de classe (ni cours particuliers ni sans classe). */
  students: { id: string; name: string; classe: string; level: string | null }[];
  evaluations: { id: string; title: string; classes: string[]; at: string }[];
  /** Copies rendues : total = note validée, null = note à valider. */
  attempts: { userId: string; evaluationId: string; total: number | null }[];
  challenges: { id: string; classes: string[]; opensAt: string }[];
  challengeResults: { challengeId: string; userId: string; passed: boolean }[];
};

export type Stats = {
  count: number;
  mean: number | null;
  median: number | null;
  q1: number | null;
  q3: number | null;
  sd: number | null;
  min: number | null;
  max: number | null;
  /** Valeurs sous 10. */
  below: number;
};

export type BoardClass = {
  name: string;
  folder: string | null;
  levelLabel: string | null;
  image: string;
  students: number;
  /** Statistiques des moyennes des élèves notés. */
  stats: Stats;
  /** Copies rendues dont la note n'est pas validée. */
  pending: number;
  /** Défis du lundi déjà ouverts à la classe. */
  challenges: number;
};

/** Note validée, ou « pending » pour une copie rendue à corriger. */
export type BoardGrade = number | "pending";

export type BoardStudent = {
  id: string;
  name: string;
  classe: string;
  average: number | null;
  /** Rang dans la classe (1 = meilleure moyenne), null sans note validée. */
  rank: number | null;
  grades: Record<string, BoardGrade>;
  gradeCount: number;
  challengesPassed: number;
  /** Dernière note validée moins la moyenne, à partir de deux notes. */
  trend: number | null;
};

export type BoardEvaluation = {
  id: string;
  title: string;
  at: string;
  classes: string[];
  /** Statistiques des notes validées, classe par classe, et copies à corriger. */
  byClass: Record<string, Stats & { pending: number }>;
};

export type ClassesBoard = { classes: BoardClass[]; students: BoardStudent[]; evaluations: BoardEvaluation[] };

const round2 = (value: number) => Math.round(value * 100) / 100;

export function computeStats(values: number[]): Stats {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return { count: 0, mean: null, median: null, q1: null, q3: null, sd: null, min: null, max: null, below: 0 };
  const mean = sorted.reduce((sum, value) => sum + value, 0) / sorted.length;
  return {
    count: sorted.length,
    mean: round2(mean),
    median: quantile(sorted, 0.5),
    q1: quantile(sorted, 0.25),
    q3: quantile(sorted, 0.75),
    sd: round2(Math.sqrt(sorted.reduce((sum, value) => sum + (value - mean) ** 2, 0) / sorted.length)),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    below: sorted.filter((value) => value < 10).length,
  };
}

export function buildClassesBoard(input: BoardInput): ClassesBoard {
  const now = input.now.getTime();
  const classOf = new Map(input.students.map((student) => [student.id, student.classe]));
  const evaluations = [...input.evaluations].sort((a, b) => a.at.localeCompare(b.at));
  const order = new Map(evaluations.map((item, index) => [item.id, index]));

  // Notes de chaque élève, dans l'ordre des évaluations.
  const grades = new Map<string, Record<string, BoardGrade>>();
  for (const attempt of input.attempts) {
    if (!classOf.has(attempt.userId) || !order.has(attempt.evaluationId)) continue;
    const mine = grades.get(attempt.userId) ?? {};
    mine[attempt.evaluationId] = attempt.total !== null && Number.isFinite(attempt.total) ? attempt.total : "pending";
    grades.set(attempt.userId, mine);
  }

  const opened = input.challenges.filter((challenge) => Date.parse(challenge.opensAt) <= now);
  const openedIds = new Set(opened.map((challenge) => challenge.id));
  const passed = new Map<string, number>();
  for (const result of input.challengeResults) {
    if (result.passed && openedIds.has(result.challengeId)) passed.set(result.userId, (passed.get(result.userId) ?? 0) + 1);
  }

  const students: BoardStudent[] = input.students.map((student) => {
    const mine = grades.get(student.id) ?? {};
    const validated = Object.entries(mine)
      .filter((entry): entry is [string, number] => typeof entry[1] === "number")
      .sort((a, b) => order.get(a[0])! - order.get(b[0])!)
      .map(([, value]) => value);
    const average = validated.length ? round2(validated.reduce((sum, value) => sum + value, 0) / validated.length) : null;
    return {
      id: student.id,
      name: student.name,
      classe: student.classe,
      average,
      rank: null,
      grades: mine,
      gradeCount: validated.length,
      challengesPassed: passed.get(student.id) ?? 0,
      trend: average !== null && validated.length >= 2 ? round2(validated[validated.length - 1] - average) : null,
    };
  });

  const names = [...new Set(input.students.map((student) => student.classe))].sort((a, b) => a.localeCompare(b, "fr", { numeric: true }));
  const classes: BoardClass[] = names.map((name) => {
    const members = students.filter((student) => student.classe === name);
    const averages = members.map((student) => student.average).filter((value): value is number => value !== null);
    // Rang : 1 + le nombre d'élèves de la classe qui ont une moyenne strictement meilleure (ex aequo au même rang).
    for (const student of members) student.rank = student.average === null ? null : averages.filter((value) => value > student.average!).length + 1;
    const level = classLevel(input.students.filter((student) => student.classe === name).map((student) => student.level));
    return {
      name,
      ...level,
      students: members.length,
      stats: computeStats(averages),
      pending: members.reduce((sum, student) => sum + Object.values(student.grades).filter((grade) => grade === "pending").length, 0),
      challenges: opened.filter((challenge) => challenge.classes.includes(name)).length,
    };
  });
  // De la seconde au BTS (dossier de niveau), puis par nom.
  classes.sort((a, b) => Number(a.folder ?? 50) - Number(b.folder ?? 50) || a.name.localeCompare(b.name, "fr", { numeric: true }));

  const boardEvaluations: BoardEvaluation[] = evaluations
    .map((evaluation) => {
      const byClass: BoardEvaluation["byClass"] = {};
      for (const name of names) {
        const values = students.filter((student) => student.classe === name).map((student) => student.grades[evaluation.id]).filter((grade) => grade !== undefined);
        if (!values.length) continue;
        byClass[name] = { ...computeStats(values.filter((grade): grade is number => grade !== "pending")), pending: values.filter((grade) => grade === "pending").length };
      }
      return { id: evaluation.id, title: evaluation.title, at: evaluation.at, classes: Object.keys(byClass), byClass };
    })
    .filter((evaluation) => evaluation.classes.length > 0);

  return { classes, students, evaluations: boardEvaluations };
}

/** Élèves d'une classe (ou de toutes) du mieux classé au moins bien ; les élèves sans note à la fin, par nom. */
export function rankStudents(students: BoardStudent[]) {
  return [...students].sort((a, b) => (b.average ?? -1) - (a.average ?? -1) || a.name.localeCompare(b.name, "fr"));
}

/** Histogramme des moyennes par tranches de 2 points, de 0 à 20 (20 compte dans la dernière tranche). */
export function averageBins(values: number[]) {
  const bins = Array.from({ length: 10 }, (_, index) => ({ from: index * 2, to: index * 2 + 2, count: 0 }));
  for (const value of values) if (Number.isFinite(value)) bins[Math.min(9, Math.max(0, Math.floor(value / 2)))].count += 1;
  return bins;
}
