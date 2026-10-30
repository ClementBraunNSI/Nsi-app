import { describe, expect, it } from "vitest";
import { inflateRawSync } from "zlib";
import { parseEvaluationSubject, SUBJECT_TEMPLATE } from "../lib/evaluation-subject";
import { isAllowedPaste, incidentLocks, formatRemaining } from "../lib/evaluation-guard";
import { buildZip, crc32 } from "../lib/zip";
import { attemptFileName, attemptText } from "../lib/evaluation-export";

describe("evaluation subjects", () => {
  it("splits what the student sees from the tests and the correction", () => {
    const parsed = parseEvaluationSubject(SUBJECT_TEMPLATE);
    expect(parsed.errors).toEqual([]);
    expect(parsed.warnings).toEqual([]);
    expect(parsed.exercises).toHaveLength(1);
    const [exercise] = parsed.exercises;
    expect(exercise).toMatchObject({ id: "ex1", type: "python", starter: "def somme(a, b):\n    pass" });
    expect(exercise.statement).toContain("Écrire une fonction `somme(a, b)`");
    expect(JSON.stringify(exercise)).not.toContain("assert");
    expect(JSON.stringify(exercise)).not.toContain("return a + b");
    expect(parsed.grading[0].verification).toContain('assert somme(2, 3) == 5');
    expect(parsed.grading[0].correction).toBe("def somme(a, b):\n    return a + b");
  });

  it("reads indented sheet-style blocks, fenced tests and a shared SQL base", () => {
    const parsed = parseEvaluationSubject(`
<BaseSQL>
\`\`\`sql
CREATE TABLE eleve (nom TEXT);
\`\`\`
</BaseSQL>
  <ExerciseSection id="q1" label="Requête 1" type="sql">
    <Enonce>
    Afficher tous les élèves.
    <Correction>
    SELECT * FROM eleve;
    </Correction>
    </Enonce>
    <Verification>
    \`\`\`sql
    SELECT * FROM eleve;
    \`\`\`
    </Verification>
  </ExerciseSection>
  <ExerciseSection id="q1" label="Exercice sans tests" type="python">
    <Enonce>Écrire quelque chose.</Enonce>
  </ExerciseSection>
  <ExerciseSection label="Mauvais type" type="lecture"><Enonce>Lire.</Enonce></ExerciseSection>`);
    expect(parsed.exercises.map((exercise) => exercise.id)).toEqual(["q1", "q1-2"]);
    expect(parsed.exercises[0].statement).toBe("Afficher tous les élèves.");
    expect(parsed.exercises[0].sqlSetup).toBe("CREATE TABLE eleve (nom TEXT);");
    expect(parsed.grading[0].verification).toBe("SELECT * FROM eleve;");
    expect(parsed.errors).toEqual(["« Mauvais type » : le type « lecture » n'est pas possible en évaluation (python ou sql)."]);
    expect(parsed.warnings.join(" ")).toContain("pas de <Verification>");
  });

  it("refuses a subject without exercises", () => {
    expect(parseEvaluationSubject("Juste du texte").errors).toHaveLength(1);
  });
});

describe("evaluation guard", () => {
  it("lets code already in the editor be pasted, and nothing else", () => {
    const codes = ["def somme(a, b):\n    return a + b\n"];
    expect(isAllowedPaste("return a + b", [], codes)).toBe(true);
    expect(isAllowedPaste("  def somme(a, b):\n      return a + b", [], codes)).toBe(true);
    expect(isAllowedPaste("x = 42", ["x = 42"], codes)).toBe(true);
    expect(isAllowedPaste("print('trouvé sur internet')", ["x = 42"], codes)).toBe(false);
    expect(isAllowedPaste("   ", [], codes)).toBe(true);
  });

  it("locks on everything but a closed or reopened page", () => {
    expect(incidentLocks("application")).toBe(true);
    expect(incidentLocks("collage")).toBe(true);
    expect(incidentLocks("fermeture")).toBe(false);
    expect(incidentLocks("reprise")).toBe(false);
  });

  it("shows the time left", () => {
    expect(formatRemaining(65_000)).toBe("1 min 05 s");
    expect(formatRemaining(3_720_000)).toBe("1 h 02 min");
    expect(formatRemaining(-5)).toBe("0 min 00 s");
  });
});

describe("evaluation export", () => {
  const attempt = {
    studentName: "Élise Dupont",
    classe: "1NSI1",
    subjectLabel: "Sujet B",
    status: "rendue",
    startedAt: "2026-10-30T08:00:00Z",
    submittedAt: "2026-10-30T08:50:00Z",
    incidents: [{ kind: "collage" as const, createdAt: "2026-10-30T08:10:00Z", detail: "print('hors IDE')" }],
    exercises: [
      { id: "a", label: "Exercice 1", type: "python" as const },
      { id: "b", label: "Exercice 2", type: "sql" as const },
    ],
    answers: { a: { code: "def f():\n    return 1\n", passed: true, testsPassed: 2, testsTotal: 2 } },
  };

  it("writes one text file per student with every exercise", () => {
    const text = attemptText("Interro conditions", attempt);
    expect(text).toContain("# Élève : Élise Dupont (1NSI1)");
    expect(text).toContain("# Sujet : Sujet B");
    expect(text).toContain("Collage d'un texte venu d'ailleurs — print('hors IDE')");
    expect(text).toContain("# Tests réussis : 2 / 2 — exercice réussi");
    expect(text).toContain("def f():\n    return 1");
    expect(text).toContain("-- Exercice 2 (sql)");
    expect(text).toContain("-- (aucun code écrit)");
    expect(attemptFileName(attempt.studentName, attempt.classe)).toBe("1NSI1_Elise_Dupont.txt");
  });

  it("packs the files in a zip that unzips to the same text", () => {
    const zip = buildZip([{ name: "a.txt", content: "élève" }, { name: "b.txt", content: "code" }]);
    const view = new DataView(zip.buffer);
    expect(view.getUint32(0, true)).toBe(0x04034b50);
    const nameLength = view.getUint16(26, true);
    const size = view.getUint32(18, true);
    const data = zip.slice(30 + nameLength, 30 + nameLength + size);
    expect(new TextDecoder().decode(data)).toBe("élève");
    expect(view.getUint32(14, true)).toBe(crc32(new TextEncoder().encode("élève")));
    // Un fichier « stocké » se relit comme un flux sans compression.
    expect(inflateRawSync(Buffer.from([0x01, size, 0x00, ~size & 0xff, 0xff, ...data])).toString()).toBe("élève");
    expect(view.getUint32(zip.length - 22, true)).toBe(0x06054b50);
    expect(view.getUint16(zip.length - 22 + 10, true)).toBe(2);
  });
});
