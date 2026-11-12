import { describe, expect, it } from "vitest";
import { gradeCopy, type GradedAnswer } from "../lib/evaluation-grade";
import { buildResult, codeNotions, functionBody, positionText, reviewNotions, sameResult } from "../lib/evaluation-result";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { matchAssessmentSheets, type SheetRef } from "../lib/revisions";
import { runPythonCheck } from "../lib/run-exercise-check";

const SUBJECT = `
<ExerciseSection id="stock" label="Exercice 1 - Le stock (10 points)" type="python">
<Enonce>Écrire total_stock et en_rupture.</Enonce>
<Verification>
assert total_stock({"pommes": 3, "poires": 2}) == 5, "total_stock compte toutes les pièces."
assert total_stock({}) == 0, "total_stock({}) vaut 0."
assert en_rupture({"pommes": 0, "poires": 2}) == ["pommes"], "en_rupture donne les produits à 0."
</Verification>
<Correction>
def total_stock(stock):
    total = 0
    for quantite in stock.values():
        total += quantite
    return total

def en_rupture(stock):
    vides = []
    for nom in stock:
        if stock[nom] == 0:
            vides.append(nom)
    return vides
</Correction>
</ExerciseSection>
<ExerciseSection id="prix" label="Exercice 2 - Le prix (10 points)" type="python" revoir="types, conditions">
<Enonce>Écrire prix_ttc.</Enonce>
<Verification>
assert prix_ttc(10) == 12, "prix_ttc(10) vaut 12."
</Verification>
<Correction>
def prix_ttc(ht):
    return ht * 1.2
</Correction>
</ExerciseSection>`;

const parsed = parseEvaluationSubject(SUBJECT);
const exercises = parsed.exercises.map((exercise, index) => ({ ...exercise, correction: parsed.grading[index].correction, hasTests: true }));

async function answer(id: string, code: string, extra: Partial<GradedAnswer> = {}): Promise<GradedAnswer> {
  const index = parsed.exercises.findIndex((exercise) => exercise.id === id);
  const report = await runPythonCheck(code, parsed.grading[index].verification, [], { keepSources: true });
  return {
    code,
    testsPassed: report.tests.filter((test) => test.ok).length,
    testsTotal: report.tests.length,
    report,
    gradedAt: new Date().toISOString(),
    manualPoints: null,
    reviewedAt: null,
    ...extra,
  };
}

// total_stock juste ; en_rupture affiche au lieu de renvoyer.
const PARTIAL = `def total_stock(stock):
    total = 0
    for quantite in stock.values():
        total += quantite
    return total

def en_rupture(stock):
    for nom in stock:
        if stock[nom] == 0:
            print(nom)`;

describe("evaluation result for students", { timeout: 30_000 }, () => {
  it("reads the notions to review set by the teacher", () => {
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises[1].review).toEqual(["types", "conditions"]);
    expect(parsed.exercises[0].review).toBeUndefined();
  });

  it("finds the notions used by a correction, ignoring words in strings and comments", () => {
    expect(codeNotions(parsed.grading[0].correction)).toEqual(["dictionnaires", "listes", "boucles", "conditions"]);
    expect(codeNotions('def f(x):\n    # for each value\n    return "if " + x')).toEqual([]);
    expect(codeNotions("def fact(n):\n    if n == 0:\n        return 1\n    return n * fact(n - 1)", ["fact"])).toEqual(["récursivité", "conditions"]);
    expect(functionBody(parsed.grading[0].correction, "total_stock")).toContain("stock.values()");
    expect(functionBody(parsed.grading[0].correction, "total_stock")).not.toContain("vides");
  });

  it("targets the failing function, and puts « fonctions » first when the student prints instead of returning", async () => {
    const stock = await answer("stock", PARTIAL);
    expect(stock.testsPassed).toBe(2);
    const notions = reviewNotions(parsed.exercises[0], parsed.grading[0].correction, PARTIAL, stock.report);
    expect(notions).toEqual(["fonctions", "listes", "boucles"]);
    // Le libellé revoir du sujet passe avant la lecture de la correction.
    expect(reviewNotions(parsed.exercises[1], parsed.grading[1].correction, "", null)).toEqual(["types", "conditions"]);
    expect(reviewNotions({ type: "sql" }, "SELECT * FROM t", "", null)).toEqual(["sql"]);
  });

  it("builds nothing until the grade is validated, then a summary without the tests' source", async () => {
    const stock = await answer("stock", PARTIAL);
    const prix = await answer("prix", parsed.grading[1].correction);
    expect(buildResult(exercises, { stock, prix }, gradeCopy(exercises, { stock, prix }))).toBeNull();

    const now = "2026-11-12T10:00:00.000Z";
    const answers = { stock: { ...stock, reviewedAt: now }, prix: { ...prix, reviewedAt: "2026-11-12T09:00:00.000Z" } };
    const result = buildResult(exercises, answers, gradeCopy(exercises, answers))!;
    expect(result.total).toBe(16.75);
    expect(result.validatedAt).toBe(now);
    expect(result.exercises[0]).toMatchObject({ points: 6.67, max: 10, testsPassed: 2, testsTotal: 3, error: null, review: ["fonctions", "listes", "boucles"] });
    expect(result.exercises[0].failed).toHaveLength(1);
    expect(result.exercises[0].failed[0].label).toBe("en_rupture donne les produits à 0.");
    expect(JSON.stringify(result)).not.toContain("assert");
    expect(result.exercises[1]).toMatchObject({ points: 10, failed: [], review: [] });
  });

  it("reports a program that does not run", async () => {
    const broken = await answer("stock", "def total_stock(stock)\n    return 0");
    const prix = await answer("prix", "def prix_ttc(ht):\n    return ht");
    const now = new Date().toISOString();
    const answers = { stock: { ...broken, reviewedAt: now }, prix: { ...prix, reviewedAt: now } };
    const result = buildResult(exercises, answers, gradeCopy(exercises, answers))!;
    expect(result.total).toBe(0);
    expect(result.exercises[0].error).toMatch(/Erreur de syntaxe/);
    expect(result.exercises[0].review[0]).toBe("fonctions");
    expect(result.exercises[1].failed[0]).toMatchObject({ label: "prix_ttc(10) vaut 12." });
  });

  it("compares stored summaries whatever the key order", () => {
    expect(sameResult({ total: 12, exercises: [{ id: "a", points: 2 }] }, { exercises: [{ points: 2, id: "a" }], total: 12 })).toBe(true);
    expect(sameResult({ total: 12 }, { total: 12.5 })).toBe(false);
    expect(sameResult(null, undefined)).toBe(true);
    expect(sameResult(null, { total: 0 })).toBe(false);
  });

  it("places a grade against the class quartiles and mean", () => {
    const stats = { classe: "1NSI1", count: 20, pending: 0, mean: 11.5, q1: 8, median: 11, q3: 14.5 };
    expect(positionText(16, stats)).toBe("Parmi le quart des meilleures notes de la classe, 4,5 points au-dessus de la moyenne.");
    expect(positionText(12, stats)).toBe("Dans la moitié haute de la classe, 0,5 point au-dessus de la moyenne.");
    expect(positionText(9, stats)).toBe("Dans la moitié basse de la classe, 2,5 points en dessous de la moyenne.");
    expect(positionText(5, stats)).toBe("Parmi le quart des notes les plus basses de la classe, 6,5 points en dessous de la moyenne.");
    expect(positionText(11.5, stats)).toBe("Dans la moitié haute de la classe, pile à la moyenne.");
    expect(positionText(12, { ...stats, mean: null, q1: null, median: null, q3: null })).toBeNull();
  });

  it("links the notions to the exercise sheets of the student's level", () => {
    const sheet = (courseId: string, courseTitle: string, level: string): SheetRef => ({ courseId, courseTitle, chapter: "Langages et programmation", level });
    const sheets = [
      sheet("python-exercices-boucles", "Exercices : Les Boucles", "1NSI"),
      sheet("python-exercices-listes", "Exercices : Les listes", "1NSI"),
      sheet("python-exercices-fonctions", "Exercices : Les Fonctions", "1NSI"),
      sheet("python-exercices-dictionnaires", "Exercices : Dictionnaires", "1NSI"),
      sheet("listes-comprehension", "Listes par compréhension - Exercices", "TNSI"),
    ];
    const match = matchAssessmentSheets(["fonctions", "listes", "boucles"].join(", "), sheets, { level: "1NSI" });
    expect(match.sheets.map((item) => item.courseId).sort()).toEqual(["python-exercices-boucles", "python-exercices-fonctions", "python-exercices-listes"]);
  });
});
