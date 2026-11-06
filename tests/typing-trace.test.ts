import { describe, expect, it } from "vitest";
import { codeAboveLevel } from "../lib/code-level";
import {
  diffEdit,
  newTrace,
  pasteAllowed,
  recordEdit,
  recordMark,
  replayTrace,
  sanitizeTrace,
  summarizeTrace,
  type TypingTrace,
} from "../lib/typing-trace";

/** Tape `text` caractère par caractère à la fin du code, `gap` ms entre deux frappes. */
function type(trace: TypingTrace, code: string, text: string, start: number, gap = 250) {
  let current = code;
  let now = start;
  for (const char of text) {
    const next = current + char;
    recordEdit(trace, current, next, { now });
    current = next;
    now += gap;
  }
  return { code: current, now };
}

describe("typing trace", () => {
  it("finds the edit between two versions of the code", () => {
    expect(diffEdit("def f():\n    pass", "def f():\n    return 1")).toEqual({ at: 13, del: 4, ins: "return 1" });
    expect(diffEdit("abc", "abXc")).toEqual({ at: 2, del: 0, ins: "X" });
  });

  it("merges consecutive keystrokes and replays them to the same code", () => {
    const trace = newTrace("", 0);
    const { code } = type(trace, "", "def f(x):", 0);
    expect(trace.events).toHaveLength(1);
    expect(trace.events[0]).toMatchObject({ k: "s", ins: "def f(x):", n: 9 });
    expect(replayTrace(trace)).toBe(code);
  });

  it("tells typing, allowed pastes, restores and blocks apart", () => {
    const trace = newTrace("def f():\n    pass", 0);
    recordEdit(trace, "def f():\n    pass", "def f():\n    ", { now: 1000 });
    recordEdit(trace, "def f():\n    ", "def f():\n    pass", { now: 2000, known: ["pass"] });
    recordEdit(trace, "def f():\n    pass", "def f():\n    pass\nprint(f())", { now: 3000, pasted: "\nprint(f())" });
    recordEdit(trace, "def f():\n    pass\nprint(f())", "def f():\n    pass\nprint(f())\nfor i in range(10):\n    print(i * i)", { now: 4000 });
    expect(trace.events.map((event) => event.k)).toEqual(["s", "r", "p", "x"]);
    expect(replayTrace(trace)).toBe("def f():\n    pass\nprint(f())\nfor i in range(10):\n    print(i * i)");
  });

  it("allows short pastes and code already in the editor, not a long text from elsewhere", () => {
    expect(pasteAllowed("somme(liste)", "", [])).toBe(true);
    expect(pasteAllowed("for x in liste:\n    total = total + x", "def f(liste):\n    for x in liste:\n        total = total + x", [])).toBe(true);
    expect(pasteAllowed("def somme(liste):\n    return sum(x for x in liste)", "", [])).toBe(false);
    expect(pasteAllowed("def somme(liste):\n    return sum(x for x in liste)", "", ["def somme(liste):\n    return sum(x for x in liste)"])).toBe(true);
  });

  it("finds nothing to report on code written step by step, with corrections and tries", () => {
    const trace = newTrace("", 0);
    let { code, now } = type(trace, "", "def somme(liste):\n    total = 0\n", 0, 400);
    recordMark(trace, "e", { now });
    ({ code, now } = type(trace, code, "    for x in liste:\n        total = total + y", now + 5000, 400));
    // Correction : y devient x.
    recordEdit(trace, code, code.slice(0, -1), { now: now + 1000 });
    code = code.slice(0, -1);
    ({ code, now } = type(trace, code, "x\n    return total", now + 2000, 400));
    recordMark(trace, "e", { now });
    recordMark(trace, "c", { now: now + 1000 });
    const summary = summarizeTrace(trace, code);
    expect(summary.consistent).toBe(true);
    expect(summary.severity).toBe("ok");
    expect(summary.flags).toEqual([]);
  });

  it("keeps a paste from outside the editor and shows it to the teacher", () => {
    const trace = newTrace("", 0);
    const pasted = "def somme(liste):\n    return sum(x for x in liste if x % 2 == 0)";
    recordEdit(trace, "", pasted, { now: 1000, pasted, external: true });
    expect(trace.events[0]).toMatchObject({ k: "p", ext: 1, ins: pasted });
    const summary = summarizeTrace(trace, pasted);
    expect(summary.externalPastes).toBe(1);
    expect(summary.largestExternal).toBe(pasted.length);
    expect(summary.severity).toBe("suspect");
    expect(sanitizeTrace(JSON.parse(JSON.stringify(trace)))?.events[0].ext).toBe(1);
  });

  it("does not flag a short paste or code copied inside the editor", () => {
    const trace = newTrace("total = 0\n", 0);
    recordEdit(trace, "total = 0\n", "total = 0\ntotal = 0\n", { now: 1000, pasted: "total = 0\n", external: false });
    expect(summarizeTrace(trace, "total = 0\ntotal = 0\n").externalPastes).toBe(0);
  });

  it("flags blocked pastes, blocks of text and code that does not match the trace", () => {
    const trace = newTrace("", 0);
    recordMark(trace, "b", { now: 500, ins: "def somme(liste):\n    return sum(liste)" });
    recordEdit(trace, "", "def somme(liste):\n    return sum(liste)", { now: 900 });
    const summary = summarizeTrace(trace, "def somme(liste):\n    return sum(liste)\n# modifié ailleurs");
    expect(summary.severity).toBe("suspect");
    expect(summary.blockedPastes).toBe(1);
    expect(summary.blockChars).toBeGreaterThan(0);
    expect(summary.consistent).toBe(false);
  });

  it("flags code copied from another window: typed in one go, right after coming back to the page", () => {
    const trace = newTrace("", 0);
    recordMark(trace, "h", { now: 1000 });
    recordMark(trace, "v", { now: 90_000 });
    const text =
      "def moyenne(notes):\n    if len(notes) == 0:\n        return 0\n    total = 0\n    for note in notes:\n        total = total + note\n    return total / len(notes)\n";
    const { code, now } = type(trace, "", text, 91_000, 180);
    recordMark(trace, "c", { now });
    const summary = summarizeTrace(trace, code);
    expect(summary.severity).not.toBe("ok");
    expect(summary.flags.map((flag) => flag.label).join(" ")).toMatch(/seul jet/);
    expect(summary.flags.map((flag) => flag.label).join(" ")).toMatch(/revenu sur la page/);
  });

  it("rejects a malformed trace sent by the browser", () => {
    expect(sanitizeTrace({ v: 1, base: "", started: 0, events: [{ t: 0, k: "s", at: 0, ins: "a" }] })).not.toBeNull();
    expect(sanitizeTrace({ v: 2, base: "", started: 0, events: [] })).toBeNull();
    expect(sanitizeTrace({ v: 1, base: "", started: 0, events: [{ t: 0, k: "z" }] })).toBeNull();
    expect(sanitizeTrace("trace")).toBeNull();
  });
});

describe("code above the student's level", () => {
  it("flags constructs a Première student rarely writes, typical of generated code", () => {
    const code = [
      "def pairs(liste: list) -> list:",
      '    """Return the even numbers of the list."""',
      "    return [x for x in liste if x % 2 == 0]",
    ].join("\n");
    const ids = codeAboveLevel(code, "1NSI").map((flag) => flag.id);
    expect(ids).toEqual(expect.arrayContaining(["comprehension", "annotations", "docstring"]));
  });

  it("does not flag what the exercise's own correction uses, nor words inside strings", () => {
    const code = "def f(liste):\n    print(\"for x in liste lambda\")\n    return [x for x in liste]";
    const ids = codeAboveLevel(code, "1NSI", "def f(liste):\n    return [x for x in liste]").map((flag) => flag.id);
    expect(ids).toEqual([]);
  });

  it("allows Terminale constructs in Terminale and plain loops everywhere", () => {
    expect(codeAboveLevel("def f(l):\n    return [x * 2 for x in l]", "TNSI")).toEqual([]);
    expect(codeAboveLevel("def f(l):\n    total = 0\n    for x in l:\n        total = total + x\n    return total", "SNT")).toEqual([]);
  });
});
