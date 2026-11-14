import { beforeAll, describe, expect, it } from "vitest";
import type { GradedAnswer } from "../lib/evaluation-grade";
import { buildEvaluationSummary, type SummaryCopy } from "../lib/evaluation-summary";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { runPythonCheck } from "../lib/run-exercise-check";

const SUBJECT_A = `
<ExerciseSection id="caisse" label="Exercice 1 - À la caisse (10 points)" type="python">
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
<ExerciseSection id="ticket" label="Exercice 2 - Le ticket (10 points)" type="python">
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

const SUBJECT_B = `
<ExerciseSection id="double" label="Exercice 1 - Le double" type="python">
<Enonce>Écrire double.</Enonce>
<Verification>
assert double(2) == 4, "double(2) vaut 4."
assert double(0) == 0, "double(0) vaut 0."
</Verification>
<Correction>
def double(n):
    return n * 2
</Correction>
</ExerciseSection>`;

function subject(source: string) {
  const parsed = parseEvaluationSubject(source);
  return {
    parsed,
    exercises: parsed.exercises.map((exercise, index) => ({ ...exercise, correction: parsed.grading[index].correction, hasTests: true })),
  };
}
const A = subject(SUBJECT_A);
const B = subject(SUBJECT_B);
const correction = (from: typeof A, id: string) => from.parsed.grading[from.parsed.exercises.findIndex((exercise) => exercise.id === id)].correction;

async function answer(from: typeof A, id: string, code: string, extra: Partial<GradedAnswer> = {}): Promise<GradedAnswer> {
  const index = from.parsed.exercises.findIndex((exercise) => exercise.id === id);
  const report = await runPythonCheck(code, from.parsed.grading[index].verification, [], { keepSources: true });
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

const copy = (name: string, from: typeof A, subjectId: string, answers: SummaryCopy["answers"]): SummaryCopy => ({
  studentId: `id-${name}`,
  name,
  subjectId,
  subjectLabel: subjectId === "a" ? "Sujet A" : "Sujet B",
  exercises: from.exercises,
  answers,
});

// Chaque copie lance plusieurs vérifications Python : délai large quand toute la suite tourne en parallèle.
describe("evaluation summary", { timeout: 30_000 }, () => {
  let copies: SummaryCopy[] = [];

  beforeAll(async () => {
    const wrongMenus = "def prix_ttc(p):\n    return round(p * 1.1, 2)\ndef nb_menus(b, p):\n    return b / p + 1";
    const wrongTicket = "def numero_commande(n):\n    return 'CMD-' + str(n)";
    copies = [
      // 20 : tout est juste.
      copy("Alice", A, "a", { caisse: await answer(A, "caisse", correction(A, "caisse")), ticket: await answer(A, "ticket", correction(A, "ticket")) }),
      // 15 : nb_menus ne réussit aucun de ses tests.
      copy("Bilal", A, "a", { caisse: await answer(A, "caisse", wrongMenus), ticket: await answer(A, "ticket", correction(A, "ticket")) }),
      // 0 : exercice 1 laissé vide, exercice 2 faux.
      copy("Chloé", A, "a", { ticket: await answer(A, "ticket", wrongTicket) }),
      // 10 : exercice 2 laissé vide.
      copy("Driss", A, "a", { caisse: await answer(A, "caisse", correction(A, "caisse")) }),
      // 10 : autre sujet, un test sur deux.
      copy("Emma", B, "b", { double: await answer(B, "double", "def double(n):\n    return n + 2") }),
    ];
  }, 60_000);

  it("gives the grade statistics and the distribution", () => {
    const summary = buildEvaluationSummary(copies, 7);
    expect(summary).toMatchObject({ students: 7, handedIn: 5, missing: 2, validated: 0, ungraded: 0, severalSubjects: true });
    expect(summary.grades).toEqual({
      mean: 11,
      median: 10,
      q1: 10,
      q3: 15,
      min: 0,
      max: 20,
      below: 1,
      bins: [
        { label: "0 à 4", count: 1 },
        { label: "4 à 8", count: 0 },
        { label: "8 à 12", count: 2 },
        { label: "12 à 16", count: 1 },
        { label: "16 à 20", count: 1 },
      ],
    });
  });

  it("sorts the exercises from least to most successful, with blank and zero copies", () => {
    const { exercises } = buildEvaluationSummary(copies, 7);
    expect(exercises.map((exercise) => `${exercise.subjectLabel} ${exercise.label} ${exercise.rate}`)).toEqual([
      "Sujet B Exercice 1 - Le double 0.5",
      "Sujet A Exercice 2 - Le ticket (10 points) 0.5",
      "Sujet A Exercice 1 - À la caisse (10 points) 0.63",
    ]);
    expect(exercises[1]).toMatchObject({ max: 10, copies: 4, mean: 5, full: 2, zero: 2, blank: 1, functions: [{ name: "numero_commande", copies: 1 }] });
    expect(exercises[2]).toMatchObject({ max: 10, copies: 4, mean: 6.25, full: 2, zero: 1, blank: 1, functions: [{ name: "nb_menus", copies: 1 }] });
    // Un test sur deux réussi : la fonction n'est pas signalée.
    expect(exercises[0]).toMatchObject({ max: 20, copies: 1, mean: 10, full: 0, zero: 0, blank: 0, functions: [] });
  });

  it("lists the most failed tests among the copies that answered", () => {
    const { tests } = buildEvaluationSummary(copies, 7);
    expect(tests).toHaveLength(5);
    expect(tests[0]).toMatchObject({ label: "double(0) vaut 0.", exerciseLabel: "Exercice 1 - Le double", subjectLabel: "Sujet B", failed: 1, tried: 1 });
    // La copie vide de Chloé ne compte pas : 3 copies ont répondu à l'exercice 1.
    expect(tests.find((test) => test.label === "nb_menus(20, 6) vaut 3.")).toMatchObject({ failed: 1, tried: 3 });
    expect(tests.find((test) => test.label === "numero_commande(7).")).toMatchObject({ failed: 1, tried: 3 });
    expect(tests.some((test) => test.label.startsWith("prix_ttc"))).toBe(false);
  });

  it("counts the students per notion to review and the copies under 8", () => {
    const summary = buildEvaluationSummary(copies, 7);
    // types : Bilal, Chloé, Driss ; fonctions : Chloé et Driss (fonction pas écrite), Emma (aucune autre notion).
    expect(summary.notions).toEqual([
      { notion: "fonctions", students: 3 },
      { notion: "types", students: 3 },
    ]);
    expect(summary.struggling).toEqual([{ studentId: "id-Chloé", name: "Chloé", total: 0 }]);
  });

  it("counts validated grades, ungraded exercises and a single subject", () => {
    const now = new Date().toISOString();
    const alice = copies[0];
    const validated = { ...alice, answers: { caisse: { ...alice.answers.caisse!, reviewedAt: now }, ticket: { ...alice.answers.ticket!, reviewedAt: now } } };
    const waiting = copy("Farid", A, "a", {
      caisse: { code: "def prix_ttc(p):\n    return p", testsPassed: null, testsTotal: null, report: null, gradedAt: null, manualPoints: null, reviewedAt: null },
    });
    const summary = buildEvaluationSummary([validated, copies[1], waiting], 3);
    expect(summary).toMatchObject({ handedIn: 3, missing: 0, validated: 1, ungraded: 1, severalSubjects: false });
    expect(summary.struggling.map((student) => student.name)).toEqual(["Farid"]);
  });

  it("stays empty without any copy", () => {
    expect(buildEvaluationSummary([], 23)).toEqual({
      students: 23,
      handedIn: 0,
      missing: 23,
      validated: 0,
      ungraded: 0,
      grades: null,
      exercises: [],
      tests: [],
      notions: [],
      struggling: [],
      severalSubjects: false,
    });
  });
});
