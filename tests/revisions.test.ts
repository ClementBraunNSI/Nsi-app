import { describe, expect, it } from "vitest";
import {
  buildHistory,
  difficultyRank,
  drawPracticeSubject,
  matchAssessmentSheets,
  pickRevisionExercises,
  practiceStatement,
  seededRandom,
  shortDay,
  splitChapters,
  timeAgo,
  type RevisionExercise,
  type SheetRef,
} from "../lib/revisions";

const now = new Date("2026-11-06T08:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

const SHEETS: SheetRef[] = [
  { courseId: "les-boucles-python", courseTitle: "Les Boucles", chapter: "Langages et Programmation", level: "1NSI" },
  { courseId: "les-listes-python", courseTitle: "Les listes", chapter: "Langages et Programmation", level: "1NSI" },
  { courseId: "dictionnaires-python", courseTitle: "Dictionnaires", chapter: "Dictionnaires et Tables", level: "1NSI" },
  { courseId: "tris-fusion", courseTitle: "Tris et fusion", chapter: "Algorithmique", level: "1NSI" },
  { courseId: "snt-boucles", courseTitle: "Les boucles", chapter: "Introduction à Python", level: "SNT" },
  { courseId: "matrices", courseTitle: "Matrices", chapter: "Structures de données", level: "TNSI" },
];

const LEVELS = ["Introduction", "Facile", "Moyen", "Difficile", "Expert"];

/** Une fiche de 5 niveaux × 4 exercices + 2 mini-projets, comme les fiches refaites. */
function sheet(courseId: string, prefix = courseId): RevisionExercise[] {
  const list: RevisionExercise[] = [];
  LEVELS.forEach((level, index) => {
    for (let n = 1; n <= 4; n += 1) {
      list.push({
        id: `${prefix}-${index + 1}-${n}`,
        label: `${index + 1}.${n} [${level}] - Exercice ${n}`,
        courseId,
        courseTitle: courseId,
        chapter: "Langages et Programmation",
        level: "1NSI",
        type: "python",
      });
    }
  });
  for (let n = 1; n <= 2; n += 1) {
    list.push({ id: `${prefix}-6-${n}`, label: `6.${n} [Mini-projet] - Projet`, courseId, courseTitle: courseId, chapter: "", level: "1NSI", type: "python" });
  }
  return list;
}

describe("rapprochement des chapitres", () => {
  it("découpe le texte libre de l'enseignant", () => {
    expect(splitChapters("Listes et dictionnaires ; boucles\nTris, conditions (if, else)")).toEqual(["Listes et dictionnaires", "boucles", "Tris", "conditions"]);
  });

  it("ne prend pas tout un chapitre pour un seul mot de son nom", () => {
    // « Dictionnaires et Tables » est un chapitre : « dictionnaires » ne vise que la fiche des dictionnaires.
    const sheets = [...SHEETS, { courseId: "csv", courseTitle: "Traitement de Tables", chapter: "Dictionnaires et Tables", level: "1NSI" }];
    expect(matchAssessmentSheets("Listes et dictionnaires", sheets, { level: "1NSI" }).sheets.map((s) => s.courseId).sort()).toEqual([
      "dictionnaires-python",
      "les-listes-python",
    ]);
    expect(matchAssessmentSheets("Dictionnaires et tables", sheets, { level: "1NSI" }).sheets.map((s) => s.courseId).sort()).toEqual(["csv", "dictionnaires-python"]);
  });

  it("ignore les fiches de projets et comprend quelques synonymes", () => {
    const sheets: SheetRef[] = [
      ...SHEETS,
      { courseId: "proj_jv_base", courseTitle: "Fonctions de Base", chapter: "Projets", level: "1NSI" },
      { courseId: "les-fonctions-python", courseTitle: "Les Fonctions", chapter: "Introduction à Python", level: "1NSI" },
      { courseId: "poo-1nsi", courseTitle: "Exercices POO", chapter: "Programmation Orientée Objet", level: "1NSI" },
      { courseId: "terminale_exercices_poo", courseTitle: "Exercices POO", chapter: "Langages et Programmation", level: "TNSI" },
      { courseId: "premiere_exercices", courseTitle: "Exercices KNN", chapter: "Algorithmique", level: "1NSI" },
    ];
    expect(matchAssessmentSheets("Chapitre 3 : fonctions", sheets, { level: "1NSI" }).sheets.map((s) => s.courseId)).toEqual(["les-fonctions-python"]);
    expect(matchAssessmentSheets("Programmation orientée objet", sheets, { level: "TNSI" }).sheets.map((s) => s.courseId)).toEqual(["terminale_exercices_poo"]);
    expect(matchAssessmentSheets("k plus proches voisins", sheets, { level: "1NSI" }).sheets.map((s) => s.courseId)).toEqual(["premiere_exercices"]);
  });

  it("ignore accents, casse, pluriels et petits mots", () => {
    const match = matchAssessmentSheets("les LISTES, Dictionnaire", SHEETS, { level: "1NSI" });
    expect(match.sheets.map((s) => s.courseId)).toEqual(["les-listes-python", "dictionnaires-python"]);
    expect(match.unmatched).toEqual([]);
    expect(match.chosen).toBe(false);
  });

  it("préfère les fiches du niveau de l'élève", () => {
    expect(matchAssessmentSheets("Boucles", SHEETS, { level: "1NSI" }).sheets.map((s) => s.courseId)).toEqual(["les-boucles-python"]);
    expect(matchAssessmentSheets("Boucles", SHEETS, { level: "SNT" }).sheets.map((s) => s.courseId)).toEqual(["snt-boucles"]);
  });

  it("reconnaît un chapitre entier et un mot du titre dans une phrase", () => {
    expect(matchAssessmentSheets("Langages et programmation", SHEETS, { level: "1NSI" }).sheets.map((s) => s.courseId)).toEqual([
      "les-boucles-python",
      "les-listes-python",
    ]);
    expect(matchAssessmentSheets("Les boucles for (range)", SHEETS, { level: "1NSI" }).sheets.map((s) => s.courseId)).toEqual(["les-boucles-python"]);
  });

  it("ne confond pas un mot court avec un morceau d'un autre mot", () => {
    // « tri » est dans « matrices » : ce n'est pas la fiche des tris.
    expect(matchAssessmentSheets("tri", SHEETS, { level: "TNSI" }).sheets.map((s) => s.courseId)).toEqual(["tris-fusion"]);
  });

  it("signale ce qui ne correspond à rien", () => {
    const match = matchAssessmentSheets("Réseaux, boucles", SHEETS, { level: "1NSI" });
    expect(match.unmatched).toEqual(["Réseaux"]);
    expect(match.sheets.map((s) => s.courseId)).toEqual(["les-boucles-python"]);
  });

  it("prend les fiches choisies par l'enseignant avant le texte", () => {
    const match = matchAssessmentSheets("n'importe quoi", SHEETS, { courseIds: ["tris-fusion", "inconnue"] });
    expect(match).toEqual({ sheets: [SHEETS[3]], unmatched: [], chosen: true });
  });
});

describe("difficulté", () => {
  it("lit le niveau entre crochets, sinon le numéro", () => {
    expect(difficultyRank("2.3 [Facile] - Somme")).toBe(2);
    expect(difficultyRank("5.1 [Expert] - Luhn")).toBe(5);
    expect(difficultyRank("6.1 [Mini-projet] - Pendu")).toBe(6);
    expect(difficultyRank("3.2 - Palindrome")).toBe(3);
    expect(difficultyRank("Exercice sans numéro")).toBe(2);
  });
});

describe("exercices à refaire", () => {
  const exercises = [...sheet("boucles"), ...sheet("listes")];

  it("met les ratés d'abord, les plus récents en premier, puis les non faits", () => {
    const history = buildHistory(
      [
        { exercise_id: "boucles-3-1", passed: false, created_at: daysAgo(10) },
        { exercise_id: "listes-2-2", passed: false, created_at: daysAgo(2) },
        // Raté puis réussi : n'est plus « raté ».
        { exercise_id: "boucles-2-1", passed: false, created_at: daysAgo(5) },
        { exercise_id: "boucles-2-1", passed: true, created_at: daysAgo(4) },
      ],
      [],
    );
    const picks = pickRevisionExercises(exercises, history, now);
    expect(picks).toHaveLength(6);
    expect(picks.slice(0, 2).map((p) => [p.id, p.reason])).toEqual([
      ["listes-2-2", "rate"],
      ["boucles-3-1", "rate"],
    ]);
    // Non faits : Facile d'abord, une fiche puis l'autre ; jamais l'exercice réussi récemment.
    expect(picks.slice(2).map((p) => p.id)).toEqual(["boucles-2-2", "listes-2-1", "boucles-2-3", "listes-2-3"]);
    expect(picks.every((p) => p.difficulty < 6)).toBe(true);
  });

  it("va jusqu'à 8 quand beaucoup d'exercices sont ratés", () => {
    const submissions = exercises.slice(0, 12).map((e, i) => ({ exercise_id: e.id, passed: false, created_at: daysAgo(i + 1) }));
    const picks = pickRevisionExercises(exercises, buildHistory(submissions, []), now);
    expect(picks).toHaveLength(8);
    expect(picks.every((p) => p.reason === "rate")).toBe(true);
  });

  it("propose les exercices réussis il y a longtemps, puis complète jusqu'à 4", () => {
    const small = sheet("boucles").filter((e) => ["boucles-1-1", "boucles-1-2", "boucles-1-3", "boucles-1-4", "boucles-2-1"].includes(e.id));
    const history = buildHistory(
      [
        { exercise_id: "boucles-1-1", passed: true, created_at: daysAgo(40) },
        { exercise_id: "boucles-1-2", passed: true, created_at: daysAgo(30) },
        { exercise_id: "boucles-1-3", passed: true, created_at: daysAgo(3) },
        { exercise_id: "boucles-1-4", passed: true, created_at: daysAgo(1) },
      ],
      [{ exercise_id: "boucles-2-1", completed_at: daysAgo(2) }],
    );
    const picks = pickRevisionExercises(small, history, now);
    expect(picks.map((p) => [p.id, p.reason])).toEqual([
      ["boucles-1-1", "ancien"],
      ["boucles-1-2", "ancien"],
      // Réussis récemment, les plus anciens d'abord, seulement pour atteindre 4.
      ["boucles-1-3", "ancien"],
      ["boucles-2-1", "ancien"],
    ]);
  });

  it("ne renvoie rien sans exercice", () => {
    expect(pickRevisionExercises([], {}, now)).toEqual([]);
  });
});

describe("sujet blanc", () => {
  const exercises = [...sheet("boucles"), ...sheet("listes")];

  it("tire 3 exercices en 30 minutes, de difficulté croissante, sans mini-projet", () => {
    const subject = drawPracticeSubject(exercises, 30, { random: seededRandom(1) });
    expect(subject.map((e) => e.difficulty)).toEqual([2, 3, 4]);
    expect(new Set(subject.map((e) => e.id)).size).toBe(3);
  });

  it("tire 4 exercices en 45 minutes et 3 en 20 minutes", () => {
    expect(drawPracticeSubject(exercises, 45, { random: seededRandom(2) }).map((e) => e.difficulty)).toEqual([2, 3, 4, 5]);
    expect(drawPracticeSubject(exercises, 20, { random: seededRandom(3) }).map((e) => e.difficulty)).toEqual([1, 2, 3]);
  });

  it("est reproductible avec la même graine et varie avec une autre", () => {
    const a = drawPracticeSubject(exercises, 45, { random: seededRandom(42) }).map((e) => e.id);
    const b = drawPracticeSubject(exercises, 45, { random: seededRandom(42) }).map((e) => e.id);
    expect(a).toEqual(b);
    const others = new Set([1, 2, 3, 4, 5, 6, 7, 8].map((seed) => drawPracticeSubject(exercises, 45, { random: seededRandom(seed) }).map((e) => e.id).join()));
    expect(others.size).toBeGreaterThan(1);
  });

  it("remplace un niveau absent par le plus proche et évite les exercices réussis", () => {
    const easy = sheet("boucles").filter((e) => e.label.includes("[Introduction]") || e.label.includes("[Facile]"));
    const solved = new Set(easy.filter((e) => e.label.includes("[Facile]")).slice(0, 3).map((e) => e.id));
    const subject = drawPracticeSubject(easy, 30, { random: seededRandom(5), solved });
    expect(subject).toHaveLength(3);
    expect(subject.filter((e) => solved.has(e.id))).toHaveLength(0);
  });

  it("rend moins d'exercices quand la fiche n'en a pas assez", () => {
    expect(drawPracticeSubject(sheet("boucles").slice(0, 2), 45)).toHaveLength(2);
    expect(drawPracticeSubject([], 30)).toEqual([]);
  });

  it("retire indices et correction de l'énoncé", () => {
    const content = [
      "Écrire une fonction `somme(n)`.",
      "",
      "### Indice",
      "Utiliser range.",
      "",
      "### Exemples",
      "somme(3) vaut 6",
      "",
      "<Indices><Indice>Une boucle for</Indice></Indices>",
      "<Correction>def somme(n): ...</Correction>",
    ].join("\n");
    const text = practiceStatement(content, "1.1 Somme");
    expect(text).toContain("somme(n)");
    expect(text).toContain("somme(3) vaut 6");
    expect(text).not.toMatch(/range|Une boucle for|def somme/);
  });
});

describe("dates", () => {
  it("formate un jour court et une durée écoulée", () => {
    expect(shortDay("2026-11-12")).toBe("12 nov.");
    expect(timeAgo(daysAgo(0), now)).toBe("aujourd'hui");
    expect(timeAgo(daysAgo(1), now)).toBe("hier");
    expect(timeAgo(daysAgo(21), now)).toBe("il y a 3 semaines");
    expect(timeAgo(daysAgo(65), now)).toBe("il y a 2 mois");
  });
});
