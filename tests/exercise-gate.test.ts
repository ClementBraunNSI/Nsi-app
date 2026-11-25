import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import { levelGate } from "../lib/exercise-gate";

const items = [
  { id: "a1", difficulty: "Pas à pas" },
  { id: "a2", difficulty: "Pas à pas" },
  { id: "a3", difficulty: "Pas à pas" },
  { id: "b1", difficulty: "Introduction" },
  { id: "c1", difficulty: "Mini-projet" },
];

describe("level gate of a sheet (unlockAfter)", () => {
  it("opens the gate exercises one by one, each after the previous one is validated", () => {
    const start = levelGate(items, new Set(), "student", "Pas à pas");
    expect(["a1", "a2", "a3"].map(start.isLocked)).toEqual([false, true, true]);
    const second = levelGate(items, new Set(["a1"]), "student", "Pas à pas");
    expect(["a1", "a2", "a3"].map(second.isLocked)).toEqual([false, false, true]);
  });

  it("keeps every other level closed until the whole gate level is validated", () => {
    const gate = levelGate(items, new Set(["a1", "a2"]), "student", "Pas à pas");
    expect(gate.active).toBe(true);
    expect(gate.gateDone).toBe(2);
    expect(gate.isLocked("a3")).toBe(false);
    expect(gate.isLocked("b1")).toBe(true);
    expect(gate.isLocked("c1")).toBe(true);
  });

  it("opens the whole sheet once the gate level is validated", () => {
    const gate = levelGate(items, new Set(["a1", "a2", "a3"]), "invite", "pas a pas");
    expect(gate.active).toBe(false);
    expect(items.some((item) => gate.isLocked(item.id))).toBe(false);
  });

  it("locks a teacher account too, unless the teacher opens the preview", () => {
    expect(levelGate(items, new Set(), "admin", "Pas à pas").isLocked("b1")).toBe(true);
    expect(levelGate(items, new Set(), "enseignant", "Pas à pas").isLocked("a2")).toBe(true);
    expect(levelGate(items, new Set(), "admin", "Pas à pas", true).isLocked("b1")).toBe(false);
  });

  it("never locks a visitor without an account, or a sheet without unlockAfter", () => {
    expect(levelGate(items, new Set(), null, "Pas à pas").isLocked("b1")).toBe(false);
    expect(levelGate(items, new Set(), "student").isLocked("b1")).toBe(false);
    expect(levelGate(items, new Set(), "student", "Niveau absent").isLocked("b1")).toBe(false);
  });

  it("gates the Terminale stacks and queues sheet behind its nine Pas à pas exercises, opened in order", () => {
    const text = fs.readFileSync(path.join(process.cwd(), "content/3/structures_lineaires_exercices.md"), "utf8");
    const unlockAfter = text.match(/<ExerciseTabs\b[^>]*\bunlockAfter="([^"]*)"/)?.[1];
    const sheet = [...text.matchAll(/<ExerciseSection id="([^"]+)" label="[^[]*\[([^\]]+)\]/g)].map((m) => ({ id: m[1], difficulty: m[2] }));
    const gate = levelGate(sheet, new Set(), "student", unlockAfter);
    expect(gate.gateIds).toHaveLength(9);
    expect(sheet.filter((item) => !gate.isLocked(item.id)).map((item) => item.id)).toEqual(["tnsi-pf-0-1"]);
  });
});
