import { describe, expect, it } from "vitest";
import { exercisePoints, failingFunctions, formatGrade, functionNames, gradeCopy, labelPoints, type GradedAnswer } from "../lib/evaluation-grade";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { runPythonCheck } from "../lib/run-exercise-check";

const SUBJECT = `
<ExerciseSection id="caisse" label="Exercice 1 - À la caisse (4 points)" type="python">
<Enonce>Écrire prix_ttc et nb_menus.</Enonce>
<Verification>
assert prix_ttc(8) == 8.8, "prix_ttc(8) vaut 8.8."
assert prix_ttc(0) == 0, "prix_ttc(0) vaut 0."
assert nb_menus(20, 6) == 3, "nb_menus(20, 6) vaut 3."
assert nb_menus(5, 6) == 0, "nb_menus(5, 6) vaut 0."
</Verification>
<Correction>
def prix_ttc(prix_ht):
    return round(prix_ht * 1.1, 2)

def nb_menus(budget, prix_menu):
    return budget // prix_menu
</Correction>
</ExerciseSection>
<ExerciseSection id="ticket" label="Exercice 2 - Le ticket" type="python" points="16">
<Enonce>Écrire numero_commande.</Enonce>
<Verification>
assert numero_commande(7) == "CMD-007", "numero_commande(7)."
assert numero_commande(42) == "CMD-042", "numero_commande(42)."
</Verification>
<Correction>
def numero_commande(n):
    return "CMD-" + str(n).zfill(3)
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

// Chaque test lance plusieurs vérifications Python : délai large quand toute la suite tourne en parallèle.
describe("evaluation grade", { timeout: 30_000 }, () => {
  it("reads the points of each exercise and brings them back to 20", () => {
    expect(labelPoints("Exercice 1 - À la caisse (4 points)")).toBe(4);
    expect(labelPoints("Ex. 2 (2,5 pts)")).toBe(2.5);
    expect(labelPoints("Exercice 3")).toBeNull();
    expect(parsed.exercises[1].points).toBe(16);
    expect(exercisePoints(parsed.exercises)).toEqual({ caisse: 4, ticket: 16 });
    expect(exercisePoints([{ id: "a", label: "A (5 points)" }, { id: "b", label: "B (5 points)" }])).toEqual({ a: 10, b: 10 });
    expect(exercisePoints([{ id: "a", label: "A" }, { id: "b", label: "B (3 points)" }])).toEqual({ a: 10, b: 10 });
  });

  it("gives 20 when every test of every function passes, final only once the teacher has read the copy", async () => {
    const caisse = await answer("caisse", parsed.grading[0].correction);
    const ticket = await answer("ticket", parsed.grading[1].correction);
    let grade = gradeCopy(exercises, { caisse, ticket });
    expect(grade.total).toBe(20);
    expect(grade.pendingReview).toBe(0);
    expect(grade.toValidate).toBe(2);
    expect(grade.final).toBe(false);
    expect(formatGrade(grade.total)).toBe("20 / 20");
    const now = new Date().toISOString();
    grade = gradeCopy(exercises, { caisse: { ...caisse, reviewedAt: now }, ticket: { ...ticket, reviewedAt: now } });
    expect(grade.toValidate).toBe(0);
    expect(grade.final).toBe(true);
  });

  it("lets the teacher lower a too generous automatic grade", async () => {
    // Tous les tests passent, mais l'enseignant juge le travail moins bon : il donne 10 sur 16.
    const ticket = await answer("ticket", parsed.grading[1].correction, { manualPoints: 10, reviewedAt: new Date().toISOString() });
    const caisse = await answer("caisse", parsed.grading[0].correction, { reviewedAt: new Date().toISOString() });
    const grade = gradeCopy(exercises, { caisse, ticket });
    expect(grade.exercises[1]).toMatchObject({ auto: 16, points: 10, manual: true });
    expect(grade.total).toBe(14);
    expect(grade.final).toBe(true);
  });

  it("weights partial success by the exercise points, rounded to a quarter point", async () => {
    // prix_ttc juste, nb_menus faux sur un test sur deux : 3 tests sur 4 → 3 points sur 4.
    const caisse = await answer("caisse", "def prix_ttc(p):\n    return round(p * 1.1, 2)\ndef nb_menus(b, p):\n    return round(b / p)");
    const grade = gradeCopy(exercises, { caisse, ticket: await answer("ticket", parsed.grading[1].correction) });
    expect(grade.exercises[0]).toMatchObject({ testsPassed: 3, testsTotal: 4, auto: 3, needsReview: false });
    expect(grade.total).toBe(19);
  });

  it("asks for a manual check when no test passes for one function", async () => {
    const caisse = await answer("caisse", "def prix_ttc(p):\n    return round(p * 1.1, 2)\ndef nb_menus(b, p):\n    return b / p + 1");
    const grade = gradeCopy(exercises, { caisse, ticket: await answer("ticket", parsed.grading[1].correction) });
    expect(failingFunctions(parsed.grading[0].correction, caisse.report)).toEqual(["nb_menus"]);
    expect(grade.exercises[0].needsReview).toBe(true);
    expect(grade.exercises[0].reasons).toEqual(["nb_menus : aucun test réussi"]);
    expect(grade.pendingReview).toBe(1);
    expect(grade.final).toBe(false);
    expect(grade.total).toBe(18);
  });

  it("flags a program that does not run, and lets the teacher's points replace the automatic ones", async () => {
    const broken = await answer("ticket", "def numero_commande(n)\n    return 'CMD-' + str(n)");
    let grade = gradeCopy(exercises, { caisse: await answer("caisse", parsed.grading[0].correction), ticket: broken });
    expect(grade.exercises[1].needsReview).toBe(true);
    expect(grade.exercises[1].reasons[0]).toMatch(/ne s'exécute pas/);
    expect(grade.total).toBe(4);
    grade = gradeCopy(exercises, {
      caisse: await answer("caisse", parsed.grading[0].correction),
      ticket: { ...broken, manualPoints: 12.5, reviewedAt: new Date().toISOString() },
    });
    expect(grade.exercises[1]).toMatchObject({ points: 12.5, manual: true, reviewed: true });
    expect(grade.pendingReview).toBe(0);
    expect(grade.toValidate).toBe(1);
    expect(grade.total).toBe(16.5);
  });

  it("counts an empty exercise as 0 without asking for a check, and waits for ungraded code", () => {
    const grade = gradeCopy(exercises, {
      caisse: { code: "", testsPassed: null, testsTotal: null, report: null, gradedAt: null, manualPoints: null, reviewedAt: null },
      ticket: { code: "def numero_commande(n):\n    pass", testsPassed: null, testsTotal: null, report: null, gradedAt: null, manualPoints: null, reviewedAt: null },
    });
    expect(grade.exercises.map((item) => item.needsReview)).toEqual([false, false]);
    expect(grade.ungraded).toBe(1);
    expect(grade.final).toBe(false);
    expect(grade.total).toBe(0);
  });

  it("finds the functions defined in a correction", () => {
    expect(functionNames("def a(x):\n    return x\n\ndef  b_2 (y):\n    pass\nprint(a(1))")).toEqual(["a", "b_2"]);
  });
});

describe("grade exports", { timeout: 30_000 }, () => {
  it("writes the grade in each copy and a CSV of all grades", async () => {
    const { attemptText, gradesCsv } = await import("../lib/evaluation-export");
    const caisse = await answer("caisse", "def prix_ttc(p):\n    return round(p * 1.1, 2)\ndef nb_menus(b, p):\n    return b / p + 1");
    const ticket = await answer("ticket", parsed.grading[1].correction);
    const grade = gradeCopy(exercises, { caisse, ticket });
    const text = attemptText("Interrogation", {
      studentName: "Élève A",
      classe: "1NSI1",
      subjectLabel: "Sujet A",
      status: "rendue",
      startedAt: null,
      submittedAt: null,
      incidents: [],
      exercises: exercises.map((item) => ({ id: item.id, label: item.label, type: "python" as const })),
      answers: { caisse: { code: caisse.code, passed: false, testsPassed: 2, testsTotal: 4 } },
      grade,
    });
    expect(text).toContain("# Note : 18 / 20, à valider (1 exercice signalé)");
    expect(text).toContain("# Points : 2 / 4 (à vérifier)");
    const csv = gradesCsv([{ studentName: "Élève A", classe: "1NSI1", subjectLabel: "Sujet A", grade }]);
    expect(csv.startsWith("﻿Classe;Élève;Sujet;Note sur 20;État;Exercice 1;Exercice 2\r\n")).toBe(true);
    expect(csv).toContain("1NSI1;Élève A;Sujet A;18;à valider (1 exercice signalé);2 / 4;16 / 16");
  });
});
