import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import {
  allExercisesPassed,
  CHALLENGE_ACHIEVEMENTS,
  CHALLENGE_TEMPLATE,
  challengeDeadline,
  challengeStreak,
  earnedChallengeAchievements,
  nextMonday,
  parisTime,
} from "../lib/challenges";
import { parseEvaluationSubject } from "../lib/evaluation-subject";
import { everyTestPassed } from "../lib/python-check";
import { runPythonCheck } from "../lib/run-exercise-check";
import { stripHiddenExerciseBlocks } from "../lib/exercise-statement";

const week = (daysAgo: number, passed: boolean | null, open = false) => ({
  opensAt: new Date(Date.UTC(2026, 9, 26) - daysAgo * 86_400_000).toISOString(),
  open,
  mine: passed === null ? null : { code: "", attempts: 1, passed, firstPassedAt: null },
});

describe("challenge streak", () => {
  it("counts consecutive weeks passed, newest first", () => {
    expect(challengeStreak([week(0, true), week(7, true), week(14, false), week(21, true)])).toBe(2);
  });

  it("does not break on this week's challenge still open and not yet passed", () => {
    expect(challengeStreak([week(0, null, true), week(7, true), week(14, true)])).toBe(2);
    expect(challengeStreak([week(0, false, true), week(7, true)])).toBe(1);
  });

  it("breaks on a closed challenge that was not done", () => {
    expect(challengeStreak([week(0, null), week(7, true)])).toBe(0);
  });

  it("unlocks achievements at 1, 3, 5 and 10 weeks", () => {
    expect(earnedChallengeAchievements(0)).toEqual([]);
    expect(earnedChallengeAchievements(4)).toEqual(["defi_premier", "defi_serie_3"]);
    expect(earnedChallengeAchievements(10)).toHaveLength(4);
    for (const achievement of CHALLENGE_ACHIEVEMENTS) {
      expect(fs.existsSync(path.join(process.cwd(), "public", achievement.image)), achievement.image).toBe(true);
    }
  });
});

describe("challenge timer and exercises", () => {
  it("counts the time limit from the moment the page was opened", () => {
    expect(challengeDeadline("2026-11-02T08:00:00.000Z", 15)).toBe(Date.parse("2026-11-02T08:15:00.000Z"));
  });

  it("has no deadline without a limit or before the timer starts", () => {
    expect(challengeDeadline("2026-11-02T08:00:00.000Z", null)).toBeNull();
    expect(challengeDeadline(null, 15)).toBeNull();
  });

  it("is passed only when every exercise is passed", () => {
    const ids = ["moyenne", "mention"];
    expect(allExercisesPassed(ids, { moyenne: { code: "", passed: true, attempts: 1 } })).toBe(false);
    expect(allExercisesPassed(ids, { moyenne: { code: "", passed: true, attempts: 1 }, mention: { code: "", passed: true, attempts: 3 } })).toBe(true);
    expect(allExercisesPassed([], {})).toBe(false);
  });
});

describe("challenge dates (Paris time)", () => {
  it("opens at 7:30 in Paris, summer and winter time alike", () => {
    expect(parisTime("2026-10-19", 7, 30).toISOString()).toBe("2026-10-19T05:30:00.000Z");
    expect(parisTime("2026-11-02", 7, 30).toISOString()).toBe("2026-11-02T06:30:00.000Z");
  });

  it("picks the next Monday, or today if it is Monday before the opening", () => {
    expect(nextMonday(new Date("2026-10-31T10:00:00Z"))).toBe("2026-11-02");
    expect(nextMonday(new Date("2026-11-02T05:00:00Z"))).toBe("2026-11-02");
    expect(nextMonday(new Date("2026-11-02T08:00:00Z"))).toBe("2026-11-09");
  });
});

describe("challenge source", () => {
  it("reads the template as one exercise with tests and a correction that passes them", async () => {
    const parsed = parseEvaluationSubject(CHALLENGE_TEMPLATE);
    expect(parsed.errors).toEqual([]);
    expect(parsed.exercises).toHaveLength(1);
    expect(JSON.stringify(parsed.exercises[0])).not.toContain("assert");
    const report = await runPythonCheck(parsed.grading[0].correction, parsed.grading[0].verification);
    expect(everyTestPassed(report)).toBe(true);
  });

  it("catches a wrong correction before the challenge goes out", async () => {
    const parsed = parseEvaluationSubject(CHALLENGE_TEMPLATE);
    const wrong = "def pairs(liste):\n    return liste";
    const report = await runPythonCheck(wrong, parsed.grading[0].verification);
    expect(everyTestPassed(report)).toBe(false);
  });
});

describe("corrections on course pages", () => {
  const sheet = "<Enonce>Écrire f.\n<Correction>def f(): return 1</Correction></Enonce>\n<Verification>assert f() == 1</Verification>";

  it("are never sent outside projection mode", () => {
    const text = stripHiddenExerciseBlocks(sheet);
    expect(text).not.toContain("Correction");
    expect(text).not.toContain("assert");
  });

  it("are kept for the teacher's projection, without the tests", () => {
    const text = stripHiddenExerciseBlocks(sheet, { keepCorrection: true });
    expect(text).toContain("<Correction>def f(): return 1</Correction>");
    expect(text).not.toContain("assert");
  });
});
