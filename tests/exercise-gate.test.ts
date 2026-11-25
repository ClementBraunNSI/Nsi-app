import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { levelGate } from "../lib/exercise-gate";

const items = [
  { id: "a1", difficulty: "Pas à pas" },
  { id: "a2", difficulty: "Pas à pas" },
  { id: "b1", difficulty: "Introduction" },
  { id: "c1", difficulty: "Mini-projet" },
];

describe("level gate of a sheet (unlockAfter)", () => {
  it("locks every other level for a student until the gate level is fully validated", () => {
    const gate = levelGate(items, new Set(["a1"]), "student", "Pas à pas");
    expect(gate.active).toBe(true);
    expect(gate.gateDone).toBe(1);
    expect(gate.isLocked("a2")).toBe(false);
    expect(gate.isLocked("b1")).toBe(true);
    expect(gate.isLocked("c1")).toBe(true);
  });

  it("opens the whole sheet once the gate level is validated", () => {
    const gate = levelGate(items, new Set(["a1", "a2"]), "invite", "pas a pas");
    expect(gate.active).toBe(false);
    expect(gate.isLocked("b1")).toBe(false);
  });

  it("never locks a teacher, a visitor or a sheet without unlockAfter", () => {
    expect(levelGate(items, new Set(), "teacher", "Pas à pas").isLocked("b1")).toBe(false);
    expect(levelGate(items, new Set(), null, "Pas à pas").isLocked("b1")).toBe(false);
    expect(levelGate(items, new Set(), "student").isLocked("b1")).toBe(false);
    expect(levelGate(items, new Set(), "student", "Niveau absent").isLocked("b1")).toBe(false);
  });

  it("gates the Terminale stacks and queues sheet behind its nine Pas à pas exercises", () => {
    const text = fs.readFileSync(path.join(process.cwd(), "content/3/structures_lineaires_exercices.md"), "utf8");
    const unlockAfter = text.match(/<ExerciseTabs\b[^>]*\bunlockAfter="([^"]*)"/)?.[1];
    const sheet = [...text.matchAll(/<ExerciseSection id="([^"]+)" label="[^[]*\[([^\]]+)\]/g)].map((m) => ({ id: m[1], difficulty: m[2] }));
    const gate = levelGate(sheet, new Set(), "student", unlockAfter);
    expect(gate.gateIds).toHaveLength(9);
    expect(sheet.filter((item) => gate.isLocked(item.id))).toHaveLength(sheet.length - 9);
  });
});
