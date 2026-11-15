import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { classStanding, distribution, gapLabel, studentAverages, studentPosition } from "../lib/student-overview";
import { buildCatchUpDraft, extractSection, hasPostIt, pickCatchUpExercises, withoutHints, WORKSHEET_TEMPLATE, type CatchUpCandidate } from "../lib/catch-up";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { runPythonCheck } from "../lib/run-exercise-check";

describe("student overview", () => {
  it("averages validated grades per student", () => {
    const averages = studentAverages([
      { userId: "a", total: 12 },
      { userId: "a", total: 15 },
      { userId: "b", total: 8 },
      { userId: "c", total: Number.NaN },
    ]);
    expect(averages.get("a")).toEqual({ average: 13.5, count: 2 });
    expect(averages.get("b")).toEqual({ average: 8, count: 1 });
    expect(averages.has("c")).toBe(false);
  });

  it("places a student against the class mean and median", () => {
    const standing = classStanding([14, 8, 10, 12, 16]);
    expect(standing).toEqual({ averages: [8, 10, 12, 14, 16], mean: 12, median: 12 });
    expect(studentPosition(16, standing)).toMatchObject({ rank: 1, count: 5, beats: 100, vsMean: 4, vsMedian: 4, tone: "haut" });
    expect(studentPosition(8, standing)).toMatchObject({ rank: 5, beats: 0, vsMedian: -4, tone: "bas" });
    expect(studentPosition(12, standing)).toMatchObject({ rank: 3, beats: 50, tone: "milieu" });
    expect(studentPosition(15, classStanding([15]))).toMatchObject({ rank: 1, count: 1, beats: 100 });
    expect(classStanding([])).toEqual({ averages: [], mean: null, median: null });
  });

  it("writes the gap to the median and the mean", () => {
    expect(gapLabel(1.5, "médiane")).toBe("+1,5 sur la médiane");
    expect(gapLabel(-2, "moyenne")).toBe("−2 sous la moyenne");
    expect(gapLabel(0.1, "médiane")).toBe("à la médiane");
    expect(gapLabel(null, "médiane")).toBe("");
  });

  it("smooths class averages from 0 to 20 into thin bars for the gauge", () => {
    const bars = distribution([8.5, 8.9, 12, 20, 0]);
    expect(bars).toHaveLength(40);
    // Deux moyennes proches (8,5 et 8,9) : le plus haut sommet.
    const peak = bars.findIndex((bar) => bar.height === 1);
    expect(peak).toBe(17);
    expect(bars[17].count).toBe(2);
    expect(bars[24].count).toBe(1);
    expect(bars[39].count).toBe(1);
    expect(bars[0].count).toBe(1);
    expect(bars[30].height).toBeLessThan(0.01);
    expect(distribution([]).every((bar) => bar.height === 0)).toBe(true);
  });
});

describe("catch-up sheets", { timeout: 30_000 }, () => {
  const sheet = fs.readFileSync(path.join(process.cwd(), "content/2/python_exercices_revision_bases.md"), "utf8");

  it("takes an exercise from a sheet, keeps its post-it and drops its hints", () => {
    const section = extractSection(sheet, "1nsi-revbases-1-1")!;
    expect(section).toMatch(/^<ExerciseSection\b/);
    expect(section).toMatch(/<\/ExerciseSection>$/);
    expect(hasPostIt(section)).toBe(true);
    expect(withoutHints(section)).not.toContain("<Indices>");
    expect(withoutHints(section)).toContain("<PostIt>");
    expect(extractSection(sheet, "absent")).toBeNull();
  });

  it("builds a draft that parses, sends the post-it but no hint to the student, and passes its own tests", async () => {
    const source = buildCatchUpDraft([extractSection(sheet, "1nsi-revbases-1-1")!], ["types"]);
    expect(source).toContain("Notions à retravailler : types.");
    const parsed = parseEvaluationSubject(source, { hints: false });
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises).toHaveLength(1);
    expect(parsed.exercises[0].statement).toContain("<PostIt>");
    expect(parsed.exercises[0].statement).not.toContain("<Indice");
    expect(parsed.exercises[0].statement).not.toContain("nom = \"Goupil\"\nage = 4");
    const report = await runPythonCheck(parsed.grading[0].correction, parsed.grading[0].verification, [], {});
    expect(report.tests.length).toBeGreaterThan(0);
    expect(report.tests.every((test) => test.ok)).toBe(true);
  });

  it("keeps hints in a personal worksheet, and its template passes its own tests", async () => {
    const parsed = parseEvaluationSubject(WORKSHEET_TEMPLATE);
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises[0].statement).toContain("<Indices>");
    expect(parseEvaluationSubject(WORKSHEET_TEMPLATE, { hints: false }).exercises[0].statement).not.toContain("<Indices>");
    const report = await runPythonCheck(parsed.grading[0].correction, parsed.grading[0].verification, [], {});
    expect(report.tests.every((test) => test.ok)).toBe(true);
  });
});


/** Catalogue des fiches de Première lu directement dans content/2, comme le fait le site (sans base ni session). */
function premiereCatalog(): CatchUpCandidate[] {
  const folder = path.join(process.cwd(), "content/2");
  const attr = (attrs: string, name: string) => attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]+)"`))?.[1] ?? "";
  return fs
    .readdirSync(folder)
    .filter((name) => name.endsWith(".md"))
    .flatMap((name) => {
      const text = fs.readFileSync(path.join(folder, name), "utf8");
      const title = text.match(/^title:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? name;
      const chapter = text.match(/^chapter:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? "";
      const courseId = text.match(/^badgeId:\s*['"]?(.+?)['"]?\s*$/m)?.[1] ?? name.replace(/\.md$/, "");
      return [...text.matchAll(/<ExerciseSection\s([^>]*)>([\s\S]*?)<\/ExerciseSection>/g)].map((match) => ({
        id: attr(match[1], "id"),
        label: attr(match[1], "label"),
        type: attr(match[1], "type") || "python",
        courseId,
        courseTitle: title,
        chapter,
        level: "1NSI",
        hasVerification: /<Verification>/.test(match[2]),
        content: match[2],
      }));
    });
}

describe("catch-up exercise choice", { timeout: 30_000 }, () => {
  const catalog = premiereCatalog();

  it("takes easy exercises of the missed notions, post-its first, alternating notions", () => {
    expect(catalog.length).toBeGreaterThan(50);
    const picked = pickCatchUpExercises(catalog, ["boucles", "listes"], "1NSI");
    expect(picked).toHaveLength(4);
    expect(picked.every((exercise) => exercise.type === "python" && exercise.hasVerification)).toBe(true);
    expect(new Set(picked.map((exercise) => exercise.id)).size).toBe(4);
    // Une notion après l'autre : boucles, listes, boucles, listes.
    expect(picked[0].courseTitle).toMatch(/boucle|révision/i);
    expect(picked[1].courseTitle).toMatch(/liste|révision/i);
  });

  it("builds a draft from real sheets that parses and passes its own tests", async () => {
    const picked = pickCatchUpExercises(catalog, ["conditions"], "1NSI", 2);
    expect(picked.length).toBe(2);
    const folder = path.join(process.cwd(), "content/2");
    const texts = fs.readdirSync(folder).map((name) => fs.readFileSync(path.join(folder, name), "utf8"));
    const sections = picked.map((exercise) => extractSection(texts.find((text) => extractSection(text, exercise.id))!, exercise.id)!);
    const parsed = parseEvaluationSubject(buildCatchUpDraft(sections, ["conditions"]), { hints: false });
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises).toHaveLength(2);
    for (const [index, item] of parsed.grading.entries()) {
      expect(parsed.exercises[index].statement).not.toContain("<Indice");
      const report = await runPythonCheck(item.correction, item.verification, [], {});
      expect(report.tests.every((test) => test.ok), `${item.id} : ${JSON.stringify(report.tests.filter((test) => !test.ok))}`).toBe(true);
    }
  });
});
