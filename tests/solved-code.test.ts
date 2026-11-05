import { describe, expect, it } from "vitest";
import { latestSolved, solvedCodeFiles, solvedCodeText, type SolvedEntry } from "../lib/solved-code";
import { classGroups, NO_CLASS, NO_CLASS_LABEL } from "../lib/class-groups";

function entry(overrides: Partial<SolvedEntry>): SolvedEntry {
  return {
    id: "s1",
    userId: "u1",
    studentName: "Élève Test",
    classe: "TEST-1",
    exerciseId: "ex1",
    exerciseLabel: "Exercice 1",
    courseId: "fiche-a",
    courseTitle: "Fiche A",
    type: "python",
    status: "auto",
    versions: 1,
    solvedAt: "2026-11-05T10:00:00Z",
    content: "print('ok')",
    ...overrides,
  };
}

describe("solved code", () => {
  it("keeps the latest successful version per student and exercise", () => {
    const rows = [
      { id: "a", user_id: "u1", exercise_id: "ex1", created_at: "2026-11-01T10:00:00Z" },
      { id: "b", user_id: "u1", exercise_id: "ex1", created_at: "2026-11-03T10:00:00Z" },
      { id: "c", user_id: "u1", exercise_id: "ex2", created_at: "2026-11-02T10:00:00Z" },
      { id: "d", user_id: "u2", exercise_id: "ex1", created_at: "2026-11-02T10:00:00Z" },
    ];
    const latest = latestSolved(rows);
    expect(latest.map(({ row, versions }) => [row.id, versions])).toEqual([["b", 2], ["c", 1], ["d", 1]]);
  });

  it("writes one text file per student, grouped by sheet, with SQL comments for SQL", () => {
    const text = solvedCodeText({ name: "Élève Test", classe: "TEST-1" }, [
      entry({}),
      entry({ id: "s2", exerciseId: "ex2", exerciseLabel: "Requête", courseTitle: "Fiche B", type: "sql", status: "validee", content: "SELECT 1;\n\n" }),
    ]);
    expect(text).toContain("# Élève : Élève Test (TEST-1)");
    expect(text).toContain("# Exercices réussis : 2");
    expect(text).toContain("# Fiche : Fiche A");
    expect(text).toContain("print('ok')");
    expect(text).toContain("-- Requête (sql) — validé par l'enseignant le");
    expect(text).toContain("SELECT 1;\n");
    expect(text.indexOf("Fiche A")).toBeLessThan(text.indexOf("Fiche B"));
  });

  it("names files after the class and student, numbering homonyms", () => {
    const files = solvedCodeFiles([
      entry({ userId: "u1" }),
      entry({ id: "s2", userId: "u2" }),
      entry({ id: "s3", userId: "u3", classe: null, studentName: "Autre" }),
    ]);
    expect(files.map((file) => file.name)).toEqual(["TEST_1_Eleve_Test.txt", "TEST_1_Eleve_Test_2.txt", "Autre.txt"]);
  });
});

describe("class groups", () => {
  it("orders classes naturally, keeps student order, puts students without a class last", () => {
    const students = [
      { name: "A", classe: "TEST-10" },
      { name: "B", classe: null },
      { name: "C", classe: "TEST-2" },
      { name: "D", classe: "TEST-2" },
      { name: "E", classe: " " },
    ];
    const groups = classGroups(students, (student) => student.classe);
    expect(groups.map((group) => [group.label, group.items.map((student) => student.name).join("")])).toEqual([
      ["TEST-2", "CD"],
      ["TEST-10", "A"],
      [NO_CLASS_LABEL, "BE"],
    ]);
    expect(groups[2].key).toBe(NO_CLASS);
  });
});
