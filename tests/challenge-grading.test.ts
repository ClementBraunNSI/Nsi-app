import { describe, expect, it } from "vitest";
import {
  challengeAnswerCodes,
  challengeDuration,
  challengeEvaluationTitle,
  challengeSubmittedAt,
  withoutBonusLevels,
} from "../lib/challenge-grading";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { exercisePoints } from "../lib/evaluation-grade";

const block = (id: string, extra = "") => `<ExerciseSection id="${id}" label="Exercice ${id}" type="python"${extra}>
<Enonce>
Écrire f.
</Enonce>
<Verification>
assert f() == 1
</Verification>
<Correction>
def f():
    return 1
</Correction>
</ExerciseSection>`;

describe("défi du lundi noté comme une évaluation", () => {
  it("garde les exercices obligatoires et retire les niveaux bonus du sujet noté", () => {
    const source = [block("a"), block("a-2", ' niveau="2" suite="a"'), block("b"), block("b-2", " suite='b' niveau='2'")].join("\n\n");
    const kept = withoutBonusLevels(source);
    const parsed = parseEvaluationSubject(kept);
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises.map((exercise) => exercise.id)).toEqual(["a", "b"]);
    // Deux exercices notés : 10 points chacun, les bonus ne prennent rien sur la note.
    expect(exercisePoints(parsed.exercises)).toEqual({ a: 10, b: 10 });
    // Sans niveau bonus, le sujet est inchangé.
    expect(parseEvaluationSubject(withoutBonusLevels(block("seul"))).exercises.map((exercise) => exercise.id)).toEqual(["seul"]);
  });

  it("reprend le code de chaque exercice noté, sans les exercices vides ni inconnus", () => {
    const answers = {
      a: { code: "def f():\n    return 1", passed: true, attempts: 3 },
      b: { code: "   ", passed: false },
      "a-2": { code: "bonus" },
    };
    expect(challengeAnswerCodes(answers, ["a", "b"])).toEqual({ a: "def f():\n    return 1" });
    expect(challengeAnswerCodes(null, ["a"])).toEqual({});
    expect(challengeAnswerCodes({ a: { code: 12 } }, ["a"])).toEqual({});
  });

  it("date la copie à la fin du défi pour l'élève, sinon à sa fermeture", () => {
    const now = Date.parse("2026-11-25T10:00:00Z");
    expect(challengeSubmittedAt("2026-11-23T07:25:00Z", "2026-11-24T07:00:00Z", now)).toBe("2026-11-23T07:25:00Z");
    expect(challengeSubmittedAt(null, "2026-11-24T07:00:00Z", now)).toBe("2026-11-24T07:00:00Z");
    // Défi encore ouvert : maintenant.
    expect(challengeSubmittedAt(null, "2026-11-26T07:00:00Z", now)).toBe(new Date(now).toISOString());
  });

  it("garde une durée et un titre acceptés par les évaluations", () => {
    expect(challengeDuration(20)).toBe(20);
    expect(challengeDuration(null)).toBeNull();
    expect(challengeDuration(3)).toBeNull();
    expect(challengeDuration(900)).toBe(600);
    expect(challengeEvaluationTitle("Mot de passe et températures")).toBe("Défi du lundi : Mot de passe et températures");
    expect(challengeEvaluationTitle("x".repeat(300))).toHaveLength(200);
  });
});
