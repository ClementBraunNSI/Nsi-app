import { sheetProgressStatus, type SheetProgressStatus } from "./student-progress";

/*
 * Réunion parents-professeur : le travail de l'élève fiche par fiche (exercices validés, essayés, dernière activité)
 * pour montrer aux parents ce qui a été fait. Calcul sans base, testé dans tests/parent-meeting.test.ts.
 */

export type ParentSheet = {
  courseId: string;
  title: string;
  chapter: string;
  level: string;
  total: number;
  validated: number;
  /** Exercices essayés mais pas encore réussis. */
  tried: number;
  lastAt: string | null;
  status: SheetProgressStatus;
};

export type ParentWork = {
  /** Fiches commencées (au moins un exercice essayé ou validé), dans l'ordre des chapitres. */
  sheets: ParentSheet[];
  sheetsDone: number;
  exercisesValidated: number;
  exercisesTried: number;
  /** Fiches du niveau de l'élève, et celles qu'il n'a pas encore ouvertes. */
  levelSheets: number;
  levelNotStarted: number;
};

export function buildParentWork(input: {
  level: string | null;
  catalog: { id: string; courseId: string; courseTitle: string; chapter: string; level: string }[];
  /** Exercices validés. */
  progress: { exerciseId: string; at: string | null }[];
  /** Essais envoyés. */
  submissions: { exerciseId: string; at: string }[];
  /** Fiches dont le badge est obtenu. */
  awarded: Set<string>;
}): ParentWork {
  const validated = new Map<string, string | null>();
  for (const row of input.progress) validated.set(row.exerciseId, row.at);
  const tried = new Map<string, string>();
  for (const row of input.submissions) if (!tried.has(row.exerciseId) || row.at > tried.get(row.exerciseId)!) tried.set(row.exerciseId, row.at);

  const sheets = new Map<string, ParentSheet>();
  for (const exercise of input.catalog) {
    const sheet = sheets.get(exercise.courseId) ?? {
      courseId: exercise.courseId,
      title: exercise.courseTitle,
      chapter: exercise.chapter,
      level: exercise.level,
      total: 0,
      validated: 0,
      tried: 0,
      lastAt: null,
      status: "not_started" as SheetProgressStatus,
    };
    sheet.total += 1;
    if (validated.has(exercise.id)) sheet.validated += 1;
    else if (tried.has(exercise.id)) sheet.tried += 1;
    for (const at of [validated.get(exercise.id), tried.get(exercise.id)]) if (at && (!sheet.lastAt || at > sheet.lastAt)) sheet.lastAt = at;
    sheets.set(exercise.courseId, sheet);
  }

  const all = [...sheets.values()];
  for (const sheet of all) sheet.status = sheetProgressStatus({ validatedCount: sheet.validated, total: sheet.total, awarded: input.awarded.has(sheet.courseId) });
  const started = all
    .filter((sheet) => sheet.validated > 0 || sheet.tried > 0 || sheet.status === "validated")
    .sort((a, b) => a.chapter.localeCompare(b.chapter, "fr", { numeric: true }) || a.title.localeCompare(b.title, "fr"));
  const ofLevel = all.filter((sheet) => input.level && sheet.level === input.level);

  return {
    sheets: started,
    sheetsDone: started.filter((sheet) => sheet.status === "validated").length,
    exercisesValidated: started.reduce((sum, sheet) => sum + sheet.validated, 0),
    exercisesTried: started.reduce((sum, sheet) => sum + sheet.tried, 0),
    levelSheets: ofLevel.length,
    levelNotStarted: ofLevel.filter((sheet) => !started.includes(sheet)).length,
  };
}

/** Phrase pour les parents : où se situe la moyenne de l'élève par rapport à la médiane de sa classe. */
export function standingSentence(average: number | null, median: number | null) {
  if (average === null) return "Pas encore de note validée.";
  if (median === null) return "Pas assez de notes dans la classe pour situer l'élève.";
  const gap = average - median;
  if (Math.abs(gap) < 0.5) return "Dans la moyenne de la classe : autour de la médiane.";
  return gap > 0 ? "Au-dessus de la médiane : dans la moitié haute de la classe." : "Sous la médiane : dans la moitié basse de la classe.";
}
