import { describe, expect, it } from "vitest";
import { ADMIN_PRIVATE, adminClassChoices, adminClassLabel, cleanAdminClass, inAdminClass, touchesAdminClass } from "../lib/admin-class";
import { buildTodayExtra, untilLabel, WATCH_SHOWN } from "../lib/admin-today";
import { buildWeek, mondayOf, shiftWeek, weekTitle } from "../lib/admin-week";
import { activityHeat, gradeStats, HEAT_DAYS, quantile, weekCount } from "../lib/student-card";

describe("admin class selection", () => {
  it("lists the choices and cleans the cookie value", () => {
    expect(adminClassChoices(["1NSI1", "TNSI"], true).map((choice) => choice.label)).toEqual(["Toutes", "1NSI1", "TNSI", "Particuliers"]);
    expect(adminClassChoices(["1NSI1"], false)).toHaveLength(2);
    expect(cleanAdminClass("1NSI1", ["1NSI1"], false)).toBe("1NSI1");
    expect(cleanAdminClass("1NSI9", ["1NSI1"], false)).toBe("");
    expect(cleanAdminClass(encodeURIComponent(ADMIN_PRIVATE), [], true)).toBe(ADMIN_PRIVATE);
    expect(cleanAdminClass(ADMIN_PRIVATE, [], false)).toBe("");
    expect(cleanAdminClass("%E0%A4%A", ["1NSI1"], false)).toBe("");
    expect(cleanAdminClass(undefined, ["1NSI1"], false)).toBe("");
    expect(adminClassLabel("")).toBe("Toutes les classes");
    expect(adminClassLabel(ADMIN_PRIVATE)).toBe("Cours particuliers");
  });

  it("filters students and class-bound items", () => {
    expect(inAdminClass("", { classe: "1NSI1" })).toBe(true);
    expect(inAdminClass("1NSI1", { classe: " 1NSI1 " })).toBe(true);
    expect(inAdminClass("1NSI1", { classe: "1NSI2" })).toBe(false);
    expect(inAdminClass("1NSI1", { classe: "1NSI1", has_private_lessons: true })).toBe(false);
    expect(inAdminClass(ADMIN_PRIVATE, { classe: null, privateLesson: true })).toBe(true);
    expect(touchesAdminClass("1NSI1", ["1NSI2", "1NSI1"])).toBe(true);
    expect(touchesAdminClass("1NSI1", ["TNSI"])).toBe(false);
    expect(touchesAdminClass(ADMIN_PRIVATE, ["1NSI1"])).toBe(false);
    expect(touchesAdminClass("", null)).toBe(true);
  });
});

describe("today extras", () => {
  const now = new Date("2026-11-12T08:35:00Z");
  const student = (id: string, days: number | null) => ({
    id,
    full_name: `Élève ${id}`,
    level: "1NSI",
    classe: "1NSI1",
    has_private_lessons: false,
    last_work_at: days === null ? null : new Date(now.getTime() - days * 86_400_000).toISOString(),
  });

  it("lists suspect typing first, then the longest inactive students", () => {
    const students = [student("a", 1), student("b", 9), student("c", 20), student("d", null), student("e", 0)];
    const extra = buildTodayExtra({
      now,
      students,
      grades: [
        { userId: "a", title: "Food truck" },
        { userId: "b", title: "Food truck" },
        { userId: "zz", title: "Autre classe" },
      ],
      bugs: 2,
      suspects: [{ userId: "e" }, { userId: "e" }, { userId: "zz" }],
      evaluations: [],
    });
    expect(extra.grades).toEqual({ total: 2, title: "Food truck" });
    expect(extra.bugs).toBe(2);
    expect(extra.watch.map((item) => item.id)).toEqual(["e", "d", "c", "b"]);
    expect(extra.watch[0]).toMatchObject({ reason: "2 essais à la saisie suspecte cette semaine", tone: "warn" });
    expect(extra.watch[1].reason).toBe("aucune activité enregistrée");
    expect(extra.watch[2].reason).toBe("aucune activité depuis 20 jours");
    expect(extra.watchMore).toBe(0);
  });

  it("counts what is beyond the shown list", () => {
    const extra = buildTodayExtra({ now, students: Array.from({ length: 8 }, (_, index) => student(`s${index}`, 10 + index)), grades: [], bugs: 0, suspects: [], evaluations: [] });
    expect(extra.watch).toHaveLength(WATCH_SHOWN);
    expect(extra.watchMore).toBe(3);
    expect(extra.grades).toEqual({ total: 0, title: null });
  });

  it("picks the open evaluation, else the one scheduled within a day", () => {
    const base = { now, students: [], grades: [], bugs: 0, suspects: [] };
    const soon = { id: "p", title: "Programmée", status: "programmee", classes: ["1NSI1"], scheduledAt: "2026-11-12T09:00:00Z" };
    const later = { id: "l", title: "Plus tard", status: "programmee", classes: ["1NSI1"], scheduledAt: "2026-11-20T09:00:00Z" };
    const open = { id: "o", title: "Ouverte", status: "ouverte", classes: ["1NSI1"], scheduledAt: null };
    expect(buildTodayExtra({ ...base, evaluations: [later, soon] }).next).toMatchObject({ id: "p", open: false });
    expect(buildTodayExtra({ ...base, evaluations: [soon, open] }).next).toMatchObject({ id: "o", open: true });
    expect(buildTodayExtra({ ...base, evaluations: [later] }).next).toBeNull();
    expect(untilLabel("2026-11-12T09:00:00Z", now)).toBe("dans 25 min");
    expect(untilLabel("2026-11-12T11:35:00Z", now)).toBe("dans 3 h");
    expect(untilLabel("2026-11-12T08:00:00Z", now)).toBe("maintenant");
  });
});

describe("student card", () => {
  it("computes quartiles like the database", () => {
    expect(quantile([8, 10, 12, 14, 16], 0.25)).toBe(10);
    expect(quantile([8, 10, 12, 14], 0.5)).toBe(11);
    expect(quantile([], 0.5)).toBeNull();
    expect(gradeStats([16, 8, 12, 10, 14])).toEqual({ count: 5, mean: 12, q1: 10, median: 12, q3: 14 });
    expect(gradeStats([])).toEqual({ count: 0, mean: null, q1: null, median: null, q3: null });
  });

  it("counts distinct exercises per Paris day over six weeks", () => {
    const now = new Date("2026-11-12T10:00:00Z");
    const heat = activityHeat(
      [
        { exerciseId: "a", at: "2026-11-12T08:00:00Z" },
        { exerciseId: "a", at: "2026-11-12T09:00:00Z" },
        { exerciseId: "b", at: "2026-11-12T09:30:00Z" },
        { exerciseId: "c", at: "2026-11-10T23:30:00Z" },
        { exerciseId: "d", at: null },
        { exerciseId: "e", at: "2026-01-01T10:00:00Z" },
      ],
      now,
    );
    expect(heat).toHaveLength(HEAT_DAYS);
    expect(heat.at(-1)).toEqual({ day: "2026-11-12", count: 2, level: 1 });
    // 23 h 30 UTC le 10 : déjà le 11 à Paris.
    expect(heat.at(-2)).toMatchObject({ day: "2026-11-11", count: 1 });
    expect(heat.at(-3)).toMatchObject({ day: "2026-11-10", count: 0, level: 0 });
    expect(weekCount(heat)).toBe(3);
  });
});

describe("planning week", () => {
  const now = new Date("2026-11-12T08:00:00Z");
  const input = {
    evaluations: [
      { id: "e1", title: "Food truck", status: "programmee", classes: ["1NSI1"], scheduledAt: "2026-11-12T09:00:00Z" },
      { id: "e2", title: "Sans date", status: "brouillon", classes: ["1NSI1"], scheduledAt: null },
      { id: "e3", title: "Autre classe", status: "fermee", classes: ["TNSI"], scheduledAt: "2026-11-10T08:00:00Z" },
    ],
    challenges: [{ id: "c1", title: "Défi du lundi", classes: ["1NSI1", "1NSI2"], opensAt: "2026-11-09T06:30:00Z" }],
    assessments: [{ id: "a1", kind: "ds" as const, title: "DS fonctions", day: "2026-11-17", time: "10:00:00", classes: ["1NSI1"] }],
    homework: [
      { id: "h1", title: "Boucles 2.1 à 2.4", classe: "1NSI1", due_at: "2026-11-13T22:59:00Z" },
      { id: "h2", title: "Sans date", classe: "1NSI1", due_at: null },
    ],
    announcements: [{ id: "n1", body: "Apporter les écouteurs\nmardi", classes: ["1NSI1"], createdAt: "2026-11-10T07:00:00Z" }],
    visios: [{ id: "v1", title: "", classes: ["1NSI1"], sessions: [{ id: "s1", day: "2026-11-14", start: "18:00:00" }] }],
  };

  it("finds the Monday of a week", () => {
    expect(mondayOf(undefined, now)).toBe("2026-11-09");
    expect(mondayOf("2026-11-15", now)).toBe("2026-11-09");
    expect(mondayOf("pas-une-date", now)).toBe("2026-11-09");
    expect(shiftWeek("2026-11-09", 1)).toBe("2026-11-16");
    expect(weekTitle("2026-11-09")).toBe("Semaine du 9 novembre");
  });

  it("places every item on its Paris day, for the chosen class", () => {
    const days = buildWeek(input, "2026-11-09", "1NSI1", now);
    // Du lundi au vendredi, plus le samedi parce qu'il a une visio.
    expect(days.map((day) => day.day)).toEqual(["2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14"]);
    expect(days[0].items.map((item) => `${item.kind} ${item.time}`)).toEqual(["defi 07:30"]);
    expect(days[1].items.map((item) => item.title)).toEqual(["Apporter les écouteurs mardi"]);
    expect(days[3]).toMatchObject({ today: true, items: [{ kind: "evaluation", title: "Food truck", time: "10:00", href: "/admin/evaluations/e1" }] });
    expect(days[4].items).toMatchObject([{ kind: "devoir", time: null }]);
    expect(days[5].items).toMatchObject([{ kind: "visio", title: "Visio", time: "18:00" }]);
  });

  it("shows the other class only when asked, and hides empty weekends", () => {
    const all = buildWeek(input, "2026-11-09", "", now);
    expect(all[1].items.map((item) => item.kind)).toEqual(["evaluation", "annonce"]);
    const tnsi = buildWeek(input, "2026-11-09", "TNSI", now);
    expect(tnsi.map((day) => day.items.length)).toEqual([0, 1, 0, 0, 0]);
    expect(buildWeek(input, "2026-11-16", "1NSI1", now).flatMap((day) => day.items.map((item) => item.kind))).toEqual(["ds"]);
  });
});
