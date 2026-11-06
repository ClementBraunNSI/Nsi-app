import { describe, expect, it } from "vitest";
import { buildAdminToday, dayLabel, isInactive, parisParts, timeLabel, todaySummary, type TodayInput } from "../lib/admin-today";

// Vendredi 6 novembre 2026, 9 h à Paris (8 h UTC).
const now = new Date("2026-11-06T08:00:00Z");
const daysAgo = (n: number) => new Date(now.getTime() - n * 86_400_000).toISOString();

function input(overrides: Partial<TodayInput> = {}): TodayInput {
  return {
    now,
    students: [
      { id: "a", full_name: "Alice", level: "1NSI", classe: "1NSI-A", updated_at: daysAgo(1), has_private_lessons: false },
      { id: "b", full_name: "Bob", level: "1NSI", classe: "1NSI-A", updated_at: daysAgo(10), has_private_lessons: false },
      { id: "c", full_name: "Chloé", level: "TNSI", classe: "TNSI", updated_at: null, has_private_lessons: false },
      { id: "d", full_name: "Dan", level: "SNT", classe: " 2nde 3 ", updated_at: daysAgo(0), has_private_lessons: false },
      { id: "p", full_name: "Paul", level: "TNSI", classe: null, updated_at: daysAgo(0), has_private_lessons: true },
    ],
    pending: [],
    inbox: [],
    evaluations: [],
    challenges: [],
    assessments: [],
    lessons: [],
    visios: [],
    homework: [],
    ...overrides,
  };
}

describe("admin-today", () => {
  it("donne la date et l'heure de Paris", () => {
    expect(parisParts(now)).toEqual(["2026-11-06", "09:00"]);
    expect(parisParts(new Date("2026-11-06T23:30:00Z"))).toEqual(["2026-11-07", "00:30"]);
  });

  it("compte un élève inactif après 7 jours ou sans date", () => {
    expect(isInactive(daysAgo(1), now)).toBe(false);
    expect(isInactive(daysAgo(8), now)).toBe(true);
    expect(isInactive(null, now)).toBe(true);
  });

  it("fait une tuile par classe avec niveau, effectif et inactifs", () => {
    const data = buildAdminToday(input());
    expect(data.classes.map((tile) => [tile.label, tile.folder, tile.total, tile.inactive])).toEqual([
      ["2nde 3", "1", 1, 0],
      ["1NSI-A", "2", 2, 1],
      ["TNSI", "3", 1, 1],
    ]);
    expect(data.privateStudents).toBe(1);
    expect(data.inactive).toBe(2);
  });

  it("trie les réponses à corriger de la plus ancienne à la plus récente", () => {
    const data = buildAdminToday(
      input({
        pending: [
          { id: "2", userId: "b", studentName: "Bob", exerciseLabel: "Ex. 2", courseTitle: "Listes", createdAt: daysAgo(1) },
          { id: "1", userId: "a", studentName: "Alice", exerciseLabel: "Ex. 1", courseTitle: "Listes", createdAt: daysAgo(3) },
        ],
      }),
    );
    expect(data.pending.total).toBe(2);
    expect(data.pending.oldestAt).toBe(daysAgo(3));
    expect(data.pending.items[0]).toEqual({ id: "1", who: "Alice", what: "Listes · Ex. 1", classe: "1NSI-A" });
  });

  it("garde le défi ouvert, sinon le prochain, avec l'effectif des classes", () => {
    const past = { id: "old", title: "Ancien", classes: ["1NSI-A"], opensAt: daysAgo(14), closesAt: daysAgo(7), submitted: 2, passed: 1, locked: 0 };
    const open = { id: "cur", title: "En cours", classes: ["1NSI-A", "2nde 3"], opensAt: daysAgo(3), closesAt: daysAgo(-4), submitted: 2, passed: 1, locked: 0 };
    const next = { id: "next", title: "Suivant", classes: ["TNSI"], opensAt: daysAgo(-4), closesAt: daysAgo(-11), submitted: 0, passed: 0, locked: 0 };
    expect(buildAdminToday(input({ challenges: [past, open, next] })).challenge).toMatchObject({ id: "cur", open: true, students: 3 });
    expect(buildAdminToday(input({ challenges: [past, next] })).challenge).toMatchObject({ id: "next", open: false, students: 1 });
    expect(buildAdminToday(input({ challenges: [past] })).challenge).toBeNull();
  });

  it("range les dates à venir dans l'ordre et écarte les passées", () => {
    const data = buildAdminToday(
      input({
        assessments: [
          { id: "x", kind: "ds", title: "SQL", day: "2026-11-10", time: null, classes: ["TNSI"] },
          { id: "y", kind: "interro", title: "Listes", day: "2026-11-07", time: "10:00", classes: ["1NSI-A"] },
          { id: "z", kind: "interro", title: "Vieux", day: "2026-11-01", time: null, classes: ["1NSI-A"] },
        ],
        lessons: [{ id: "p", full_name: "Paul", lesson: { id: "l1", starts_at: "2026-11-08T13:00:00Z", duration_minutes: 60, title: null } }],
        visios: [
          {
            id: "v",
            title: "Soutien",
            classes: ["2nde 3"],
            isOpen: false,
            sessions: [
              { id: "s0", day: "2026-11-06", start: "07:00", end: "08:00" },
              { id: "s1", day: "2026-11-06", start: "17:00", end: "18:00" },
            ],
          },
        ],
      }),
    );
    expect(data.dates.map((date) => [date.kind, date.day, date.time])).toEqual([
      ["visio", "2026-11-06", "17:00"],
      ["interro", "2026-11-07", "10:00"],
      ["cours", "2026-11-08", "14:00"],
      ["ds", "2026-11-10", null],
    ]);
  });

  it("garde les devoirs de classe en cours avec l'effectif de la classe", () => {
    const data = buildAdminToday(
      input({
        homework: [
          { id: "h1", title: "Fini depuis longtemps", classe: "1NSI-A", due_at: daysAgo(5), doneCount: 2 },
          { id: "h2", title: "Sans date", classe: "TNSI", due_at: null, doneCount: 0 },
          { id: "h3", title: "Vendredi", classe: "1NSI-A", due_at: daysAgo(-1), doneCount: 1 },
        ],
      }),
    );
    expect(data.homework.map((row) => [row.id, row.done, row.total])).toEqual([
      ["h3", 1, 2],
      ["h2", 0, 1],
    ]);
  });

  it("résume la journée en une phrase", () => {
    const data = buildAdminToday(
      input({
        pending: [{ id: "1", userId: "a", studentName: "Alice", exerciseLabel: "Ex. 1", courseTitle: "Listes", createdAt: daysAgo(1) }],
        inbox: [
          { id: "a", full_name: "Alice", lastAt: daysAgo(0), unread: 2 },
          { id: "b", full_name: "Bob", lastAt: daysAgo(1), unread: 0 },
        ],
        assessments: [{ id: "y", kind: "interro", title: "Listes", day: "2026-11-07", time: "10:00", classes: ["1NSI-A"] }],
      }),
    );
    expect(data.unread).toMatchObject({ total: 2, items: [{ id: "a", count: 2 }] });
    expect(todaySummary(data, now)).toBe("1 réponse à corriger, 2 messages non lus. Interro « Listes » en 1NSI-A demain à 10 h.");
    expect(todaySummary(buildAdminToday(input()), now)).toBe("Rien en attente.");
  });

  it("écrit les jours et les heures en français", () => {
    expect(dayLabel("2026-11-06", now)).toBe("aujourd'hui");
    expect(dayLabel("2026-11-07", now)).toBe("demain");
    expect(dayLabel("2026-11-10", now)).toBe("mar. 10 nov.");
    expect(timeLabel("10:00")).toBe("10 h");
    expect(timeLabel("08:30")).toBe("8 h 30");
  });
});
