import { difficultyRank, isProjectChapter, matchAssessmentSheets, MINI_PROJECT, type SheetRef } from "./revisions";

/*
 * Fiche de rattrapage : un brouillon de sujet écrit à partir d'exercices des fiches, dans le format des évaluations.
 * Les exercices gardent leur post-it (le seul rappel permis), leurs tests et leur correction ; leurs indices sont
 * retirés, puisque la fiche se passe comme une évaluation. Calcul sans base, testé dans tests/catch-up.test.ts.
 */

/** Bloc <ExerciseSection id="…"> d'une fiche, tel qu'il est écrit, ou null. */
export function extractSection(sheet: string, id: string) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = sheet.match(new RegExp(`<ExerciseSection\\b[^>]*\\bid="${escaped}"[^>]*>[\\s\\S]*?<\\/ExerciseSection>`));
  return match ? match[0] : null;
}

/** Le bloc sans ses indices : en rattrapage, seul le post-it aide l'élève. */
export function withoutHints(section: string) {
  return section.replace(/\n?[ \t]*<Indices>[\s\S]*?<\/Indices>[ \t]*\n?/g, "\n");
}

/** Le bloc a-t-il un post-it ? Les exercices qui en ont passent en premier. */
export function hasPostIt(section: string) {
  return /<PostIt\b/.test(section);
}

export type CatchUpCandidate = {
  id: string;
  label: string;
  type: string;
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string;
  hasVerification: boolean;
  /** Énoncé de l'exercice : sert à repérer un post-it. */
  content: string;
};

export const DRAFT_EXERCISES = 4;

/**
 * Exercices d'une fiche de rattrapage, dans l'ordre : une notion après l'autre, à tour de rôle, pris dans les fiches
 * du niveau de l'élève qui correspondent à la notion ; Python vérifié par des tests, Introduction à Moyen, hors
 * mini-projets et fiches de projets ; ceux qui ont un post-it d'abord, puis du plus facile au plus difficile.
 */
export function pickCatchUpExercises<T extends CatchUpCandidate>(catalog: T[], notions: string[], level: string | null, count = DRAFT_EXERCISES): T[] {
  const usable = catalog.filter((exercise) => {
    const rank = difficultyRank(exercise.label);
    return exercise.type === "python" && exercise.hasVerification && rank <= 3 && rank < MINI_PROJECT && !isProjectChapter(exercise.chapter);
  });
  const sheets = new Map<string, SheetRef>();
  for (const exercise of usable) sheets.set(exercise.courseId, { courseId: exercise.courseId, courseTitle: exercise.courseTitle, chapter: exercise.chapter, level: exercise.level });
  const queues = (notions.length ? notions : ["fonctions"]).map((notion) => {
    const ids = new Set(matchAssessmentSheets(notion, [...sheets.values()], { level }).sheets.map((sheet) => sheet.courseId));
    return usable
      .filter((exercise) => ids.has(exercise.courseId))
      .sort((a, b) => Number(hasPostIt(b.content)) - Number(hasPostIt(a.content)) || difficultyRank(a.label) - difficultyRank(b.label));
  });
  const picked: T[] = [];
  while (picked.length < count && queues.some((queue) => queue.length)) {
    for (const queue of queues) {
      while (queue.length) {
        const next = queue.shift()!;
        if (picked.some((item) => item.id === next.id)) continue;
        picked.push(next);
        break;
      }
      if (picked.length >= count) break;
    }
  }
  return picked;
}

const HEADER = (notions: string[]) =>
  [
    "<!--",
    "Fiche de rattrapage : brouillon à relire avant l'envoi.",
    notions.length ? `Notions à retravailler : ${notions.join(", ")}.` : "Notions à retravailler : à préciser.",
    "Chaque exercice garde son post-it (<PostIt>), ses tests (<Verification>) et sa correction (<Correction>).",
    "Les indices ne sont pas montrés en rattrapage : seul le post-it aide l'élève.",
    "-->",
    "",
  ].join("\n");

/** Brouillon complet : un commentaire pour l'enseignant, puis les exercices choisis, sans indices. */
export function buildCatchUpDraft(sections: string[], notions: string[]) {
  return `${HEADER(notions)}${sections.map((section) => withoutHints(section).trim()).join("\n\n")}\n`;
}

/** Modèle d'une fiche particulière écrite à la main. */
export const WORKSHEET_TEMPLATE = `<ExerciseSection id="ex1" label="Exercice 1" type="python">
<Enonce>
### Titre de l'exercice

Écrire une fonction \`double(n)\` qui renvoie le double de \`n\`.

<PostIt>

- \`def nom(parametre):\` définit une fonction
- \`return valeur\` renvoie le résultat

</PostIt>

<Indices>
<Indice>

Multiplier \`n\` par 2.

</Indice>
</Indices>
</Enonce>
<CodeDepart>
def double(n):
    pass
</CodeDepart>
<Verification>
assert double(3) == 6, "double(3) vaut 6."
assert double(0) == 0, "double(0) vaut 0."
</Verification>
<Correction>
def double(n):
    return 2 * n
</Correction>
</ExerciseSection>
`;
