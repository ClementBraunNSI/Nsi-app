import { describe, expect, it } from "vitest";
import {
  errorGroupKey,
  explainSummary,
  findFix,
  groupErrors,
  lineDiff,
  parseErrorSummary,
  summarizeReport,
  TEST_GROUP,
  type NotebookEntry,
} from "../lib/error-notebook";
import type { RunReport } from "../lib/python-check";

const now = new Date("2026-11-06T08:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

function report(patch: Partial<RunReport>): RunReport {
  return { status: "failure", validated: false, tests: [], prints: "", testPrints: "", stderr: "", ...patch };
}

describe("résumé d'un essai refusé", () => {
  it("garde le type d'une erreur Python et sa ligne", () => {
    const summary = summarizeReport(
      report({
        status: "error",
        error: "NameError : le nom « totl » n'est pas défini (ligne 3)",
        errorDetail: 'Traceback (most recent call last):\n  File "<programme>", line 3, in <module>\nNameError: name \'totl\' is not defined',
      }),
    );
    expect(summary).toMatchObject({ kind: "exception", type: "NameError", line: 3 });
    expect(errorGroupKey(summary!)).toBe("NameError");
  });

  it("résume le premier test raté", () => {
    const summary = summarizeReport(
      report({
        status: "failure",
        tests: [
          { ok: true, label: "somme(0)" },
          { ok: false, label: "somme(3)", actual: "None", expected: "6" },
          { ok: false, label: "somme(4)", actual: "None", expected: "10" },
        ],
      }),
    );
    expect(summary).toEqual({ kind: "test", label: "somme(3)", actual: "None", expected: "6", detail: undefined, printCompare: undefined, total: 3, failed: 2 });
    expect(errorGroupKey(summary!)).toBe(TEST_GROUP);
    expect(explainSummary(summary!, "def somme(n):\n    print(n)")?.title).toBe("La fonction ne renvoie rien (None).");
  });

  it("classe une erreur levée pendant un test sous son type", () => {
    const summary = summarizeReport(report({ tests: [{ ok: false, label: "f(2)", detail: "ZeroDivisionError: division by zero" }] }));
    expect(summary).toMatchObject({ kind: "exception", type: "ZeroDivisionError" });
  });

  it("ne résume pas un essai réussi et relit la colonne", () => {
    expect(summarizeReport(report({ status: "success", validated: true, tests: [{ ok: true, label: "ok" }] }))).toBeNull();
    expect(parseErrorSummary({ kind: "exception", type: "TypeError", message: "x" })).toMatchObject({ type: "TypeError" });
    expect(parseErrorSummary({ kind: "inconnu" })).toBeNull();
    expect(parseErrorSummary(null)).toBeNull();
  });

  it("explique une erreur Python en français", () => {
    const help = explainSummary(
      { kind: "exception", type: "NameError", message: "NameError: name 'totl' is not defined", line: 2 },
      "total = 0\nprint(totl)",
    );
    expect(help?.title).toBeTruthy();
    expect(help?.line).toBe(2);
  });
});

describe("regroupement des erreurs", () => {
  const name = (id: string, exerciseId: string, days: number): NotebookEntry => ({
    id,
    exerciseId,
    createdAt: daysAgo(days),
    summary: { kind: "exception", type: "NameError", message: "NameError: name 'x' is not defined" },
  });
  const entries: NotebookEntry[] = [
    name("n1", "a", 40),
    name("n2", "b", 30),
    name("n3", "a", 25),
    { id: "t1", exerciseId: "c", createdAt: daysAgo(1), summary: { kind: "test", label: "f(1)", total: 2, failed: 1 } },
    { id: "t2", exerciseId: "c", createdAt: daysAgo(2), summary: { kind: "test", label: "f(1)", total: 2, failed: 1 } },
    { id: "t3", exerciseId: "d", createdAt: daysAgo(3), summary: { kind: "test", label: "g(1)", total: 2, failed: 2 } },
    { id: "s1", exerciseId: "e", createdAt: daysAgo(5), summary: { kind: "exception", type: "SyntaxError", message: "SyntaxError: invalid syntax" } },
    // Pas encore analysé : hors des groupes.
    { id: "p1", exerciseId: "e", createdAt: daysAgo(6), summary: null },
  ];
  const groups = groupErrors(entries, (entry) => entry.exerciseId === "a" || entry.exerciseId === "c", now);

  it("compte chaque type et date la dernière fois", () => {
    expect(groups.map((g) => [g.key, g.count])).toEqual([
      [TEST_GROUP, 3],
      ["SyntaxError", 1],
      ["NameError", 3],
    ]);
    const nameGroup = groups.find((g) => g.key === "NameError")!;
    expect(nameGroup.lastAt).toBe(daysAgo(25));
    expect(nameGroup.firstAt).toBe(daysAgo(40));
    expect(nameGroup.entries.map((e) => e.id)).toEqual(["n3", "n2", "n1"]);
  });

  it("distingue les erreurs fréquentes, occasionnelles et disparues", () => {
    expect(groups.map((g) => g.trend)).toEqual(["frequente", "occasionnelle", "disparue"]);
    expect(groups[0].recent).toBe(3);
  });

  it("compte les exercices réussis après l'erreur", () => {
    expect(groups.find((g) => g.key === "NameError")).toMatchObject({ exercises: 2, fixed: 1 });
    expect(groups.find((g) => g.key === TEST_GROUP)).toMatchObject({ exercises: 2, fixed: 1 });
  });
});

describe("code corrigé", () => {
  const attempts = [
    { id: "1", exerciseId: "a", createdAt: daysAgo(5), passed: false },
    { id: "2", exerciseId: "a", createdAt: daysAgo(3), passed: true },
    { id: "3", exerciseId: "a", createdAt: daysAgo(1), passed: true },
    { id: "4", exerciseId: "b", createdAt: daysAgo(4), passed: true },
  ];

  it("prend le premier essai réussi qui suit, sur le même exercice", () => {
    expect(findFix({ exerciseId: "a", createdAt: daysAgo(5) }, attempts)?.id).toBe("2");
    expect(findFix({ exerciseId: "a", createdAt: daysAgo(2) }, attempts)?.id).toBe("3");
    expect(findFix({ exerciseId: "b", createdAt: daysAgo(3) }, attempts)).toBeNull();
  });

  it("met en évidence les lignes changées", () => {
    const diff = lineDiff("def f(n):\n    total = 0\n    print(totl)", "def f(n):\n    total = 0\n    return total");
    expect(diff).toEqual([
      { kind: "same", text: "def f(n):" },
      { kind: "same", text: "    total = 0" },
      { kind: "removed", text: "    print(totl)" },
      { kind: "added", text: "    return total" },
    ]);
  });

  it("renonce quand presque tout a changé", () => {
    expect(lineDiff("a\nb\nc\nd", "w\nx\ny\nz")).toBeNull();
    expect(lineDiff("a", "a")).toBeNull();
  });
});
