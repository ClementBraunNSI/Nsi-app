import { describe, expect, it } from "vitest";
import { averageBins, buildClassesBoard, computeStats, rankStudents, type BoardInput } from "../lib/admin-classes";
import { buildParentWork, standingSentence } from "../lib/parent-meeting";
import { mondayPlan } from "../lib/admin-week";

const now = new Date("2026-11-24T09:00:00Z");

function input(extra: Partial<BoardInput> = {}): BoardInput {
  return {
    now,
    students: [
      { id: "a", name: "Alice", classe: "1NSI1", level: "1NSI" },
      { id: "b", name: "Bilal", classe: "1NSI1", level: "1NSI" },
      { id: "c", name: "Chloé", classe: "1NSI1", level: "1NSI" },
      { id: "t", name: "Tom", classe: "TNSI", level: "TNSI" },
    ],
    evaluations: [
      { id: "e2", title: "Boucles", classes: ["1NSI1"], at: "2026-11-17T08:00:00Z" },
      { id: "e1", title: "Types", classes: ["1NSI1"], at: "2026-10-06T08:00:00Z" },
      { id: "t1", title: "Récursivité", classes: ["TNSI"], at: "2026-10-13T08:00:00Z" },
    ],
    attempts: [
      { userId: "a", evaluationId: "e1", total: 12 },
      { userId: "a", evaluationId: "e2", total: 16 },
      { userId: "b", evaluationId: "e1", total: 8 },
      { userId: "b", evaluationId: "e2", total: null },
      { userId: "c", evaluationId: "e1", total: 13 },
      { userId: "t", evaluationId: "t1", total: 15 },
      { userId: "zz", evaluationId: "e1", total: 20 },
    ],
    challenges: [
      { id: "d1", classes: ["1NSI1"], opensAt: "2026-11-16T06:30:00Z" },
      { id: "d2", classes: ["1NSI1"], opensAt: "2026-11-30T06:30:00Z" },
    ],
    challengeResults: [
      { challengeId: "d1", userId: "a", passed: true },
      { challengeId: "d2", userId: "a", passed: true },
      { challengeId: "d1", userId: "b", passed: false },
    ],
    ...extra,
  };
}

describe("classes board", () => {
  it("computes the usual statistics", () => {
    expect(computeStats([])).toMatchObject({ count: 0, mean: null, median: null, below: 0 });
    expect(computeStats([8, 12, 14, 16])).toEqual({ count: 4, mean: 12.5, median: 13, q1: 11, q3: 14.5, sd: 2.96, min: 8, max: 16, below: 1 });
  });

  it("averages validated grades only and ranks students within their class", () => {
    const board = buildClassesBoard(input());
    const alice = board.students.find((student) => student.id === "a")!;
    const bilal = board.students.find((student) => student.id === "b")!;
    expect(alice).toMatchObject({ average: 14, rank: 1, gradeCount: 2, trend: 2, challengesPassed: 1 });
    expect(bilal).toMatchObject({ average: 8, rank: 3, gradeCount: 1, trend: null, challengesPassed: 0 });
    expect(bilal.grades).toEqual({ e1: 8, e2: "pending" });
    expect(board.students.find((student) => student.id === "c")!.rank).toBe(2);
    expect(board.students.find((student) => student.id === "t")!.rank).toBe(1);
  });

  it("summarises classes and evaluations", () => {
    const board = buildClassesBoard(input());
    expect(board.classes.map((item) => item.name)).toEqual(["1NSI1", "TNSI"]);
    const first = board.classes[0];
    expect(first).toMatchObject({ students: 3, pending: 1, challenges: 1, folder: "2", image: "/images/fox_2.png" });
    expect(first.stats).toMatchObject({ count: 3, mean: 11.67, median: 13, below: 1 });
    expect(board.evaluations.map((item) => item.id)).toEqual(["e1", "t1", "e2"]);
    expect(board.evaluations[2].byClass["1NSI1"]).toMatchObject({ count: 1, pending: 1, mean: 16 });
    expect(board.evaluations[0].byClass["1NSI1"]).toMatchObject({ count: 3, mean: 11, min: 8, max: 13 });
  });

  it("keeps equal averages on the same rank and sorts the ranking", () => {
    const board = buildClassesBoard(input({ attempts: [{ userId: "a", evaluationId: "e1", total: 12 }, { userId: "b", evaluationId: "e1", total: 12 }] }));
    expect(board.students.filter((student) => student.classe === "1NSI1").map((student) => student.rank)).toEqual([1, 1, null]);
    expect(rankStudents(board.students).map((student) => student.id)).toEqual(["a", "b", "c", "t"]);
  });

  it("bins averages two points wide", () => {
    const bins = averageBins([0, 1.9, 10, 19.5, 20]);
    expect(bins).toHaveLength(10);
    expect(bins[0].count).toBe(2);
    expect(bins[5].count).toBe(1);
    expect(bins[9].count).toBe(2);
  });
});

describe("parent meeting", () => {
  const catalog = [
    { id: "x1", courseId: "boucles", courseTitle: "Boucles", chapter: "02", level: "1NSI" },
    { id: "x2", courseId: "boucles", courseTitle: "Boucles", chapter: "02", level: "1NSI" },
    { id: "x3", courseId: "boucles", courseTitle: "Boucles", chapter: "02", level: "1NSI" },
    { id: "y1", courseId: "types", courseTitle: "Types", chapter: "01", level: "1NSI" },
    { id: "z1", courseId: "listes", courseTitle: "Listes", chapter: "03", level: "1NSI" },
    { id: "w1", courseId: "graphes", courseTitle: "Graphes", chapter: "05", level: "TNSI" },
  ];

  it("counts validated and tried exercises per started sheet", () => {
    const work = buildParentWork({
      level: "1NSI",
      catalog,
      progress: [
        { exerciseId: "x1", at: "2026-11-10T10:00:00Z" },
        { exerciseId: "y1", at: "2026-10-01T10:00:00Z" },
      ],
      submissions: [
        { exerciseId: "x1", at: "2026-11-09T10:00:00Z" },
        { exerciseId: "x2", at: "2026-11-12T10:00:00Z" },
        { exerciseId: "x2", at: "2026-11-11T10:00:00Z" },
      ],
      awarded: new Set(),
    });
    expect(work.sheets.map((sheet) => sheet.courseId)).toEqual(["types", "boucles"]);
    expect(work.sheets[1]).toMatchObject({ total: 3, validated: 1, tried: 1, lastAt: "2026-11-12T10:00:00Z", status: "in_progress" });
    expect(work.sheets[0]).toMatchObject({ total: 1, validated: 1, status: "validated" });
    expect(work).toMatchObject({ sheetsDone: 1, exercisesValidated: 2, exercisesTried: 1, levelSheets: 3, levelNotStarted: 1 });
  });

  it("counts a sheet whose badge was awarded as done", () => {
    const work = buildParentWork({ level: null, catalog, progress: [], submissions: [], awarded: new Set(["graphes"]) });
    expect(work.sheets.map((sheet) => sheet.courseId)).toEqual(["graphes"]);
    expect(work).toMatchObject({ sheetsDone: 1, levelSheets: 0 });
  });

  it("places the student in the class by exercises validated", () => {
    const work = buildParentWork({
      level: "1NSI",
      catalog,
      progress: [
        { exerciseId: "x1", at: null },
        { exerciseId: "x2", at: null },
      ],
      submissions: [],
      awarded: new Set(),
      classmates: {
        ids: ["me", "b", "c"],
        progress: [
          { userId: "me", exerciseId: "x1" },
          { userId: "me", exerciseId: "x2" },
          { userId: "b", exerciseId: "x1" },
          { userId: "b", exerciseId: "y1" },
          { userId: "b", exerciseId: "hors-catalogue" },
          { userId: "zz", exerciseId: "x3" },
        ],
      },
    });
    expect(work.sheets[0].classStats).toEqual({ mean: 1, median: 1, started: 2, count: 3 });
    expect(work.classExercises).toMatchObject({ average: 2, rank: 1, count: 3, mean: 1.33, median: 2, max: 2 });
  });

  it("skips the class comparison without classmates", () => {
    const work = buildParentWork({ level: null, catalog, progress: [{ exerciseId: "x1", at: null }], submissions: [], awarded: new Set(), classmates: { ids: ["me"], progress: [] } });
    expect(work.classExercises).toBeNull();
    expect(work.sheets[0].classStats).toBeNull();
  });

  it("phrases the standing for parents", () => {
    expect(standingSentence(null, 12)).toMatch(/Pas encore/);
    expect(standingSentence(12, null)).toMatch(/Pas assez/);
    expect(standingSentence(12.2, 12)).toMatch(/autour de la médiane/);
    expect(standingSentence(15, 12)).toMatch(/Au-dessus/);
    expect(standingSentence(9, 12)).toMatch(/Sous la médiane/);
  });
});

describe("monday plan", () => {
  it("places each challenge on the Monday it opens, class by class", () => {
    const plan = mondayPlan(
      ["1NSI1", "TNSI"],
      [
        { id: "d1", title: "Palindromes", classes: ["1NSI1"], opensAt: "2026-11-23T06:30:00Z", closesAt: "2026-11-30T06:30:00Z" },
        { id: "d2", title: "Monnaie", classes: ["1NSI1", "TNSI"], opensAt: "2026-12-07T06:30:00Z", closesAt: "2026-12-14T06:30:00Z" },
      ],
      now,
    );
    expect(plan.mondays).toEqual(["2026-11-23", "2026-11-30", "2026-12-07", "2026-12-14"]);
    expect(plan.rows[0].slots.map((slot) => slot.challenge?.id ?? null)).toEqual(["d1", null, "d2", null]);
    expect(plan.rows[0].slots[0].challenge).toMatchObject({ open: true });
    expect(plan.rows[1].slots.map((slot) => slot.challenge?.id ?? null)).toEqual([null, null, "d2", null]);
    expect(plan.rows[0].slots.some((slot) => slot.today)).toBe(false);
  });
});
