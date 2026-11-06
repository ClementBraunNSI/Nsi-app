import { describe, expect, it } from "vitest";
import {
  buildFeed,
  dayHeading,
  DEFAULT_KINDS,
  groupByDay,
  inPeriod,
  lastActivityLabel,
  studentStats,
  typingBadge,
  type BoardEvent,
  type BoardStudent,
} from "../lib/activity-board";

// Vendredi 6 novembre 2026, 20 h à Paris (19 h UTC).
const now = new Date("2026-11-06T19:00:00Z");
const at = (iso: string) => new Date(iso).toISOString();

const ex = (iso: string, label: string, sheet: string, severity: BoardEvent["severity"] = null): BoardEvent => ({
  at: at(iso),
  kind: "exercise",
  label,
  sheet,
  exerciseId: label,
  severity,
});

function student(overrides: Partial<BoardStudent> = {}): BoardStudent {
  return {
    id: "s1",
    fullName: "Gwen",
    classe: "1NSI1",
    privateLesson: false,
    lastWorkAt: null,
    currentSheet: null,
    events: [],
    undated: [],
    ...overrides,
  };
}

describe("activity-board", () => {
  it("découpe les périodes à l'heure de Paris", () => {
    expect(inPeriod(at("2026-11-05T23:30:00Z"), "today", now)).toBe(true); // 0 h 30 à Paris le 6
    expect(inPeriod(at("2026-11-05T22:30:00Z"), "today", now)).toBe(false); // 23 h 30 le 5
    expect(inPeriod(at("2026-10-31T20:00:00Z"), "7", now)).toBe(true);
    expect(inPeriod(at("2026-10-29T18:00:00Z"), "7", now)).toBe(false);
    expect(inPeriod(at("2026-10-29T18:00:00Z"), "30", now)).toBe(true);
  });

  it("compte la période et la frappe, sans les messages par défaut", () => {
    const s = student({
      events: [
        ex("2026-11-06T18:49:00Z", "5.1 Impôt", "Les Conditions", "ok"),
        { at: at("2026-11-06T10:00:00Z"), kind: "message", label: "Message envoyé" },
        { at: at("2026-11-04T21:41:00Z"), kind: "sheet", label: "Fiche terminée : Les Fonctions" },
        ex("2026-11-04T21:40:00Z", "2.3 Bissextile", "Les Fonctions", "suspect"),
        ex("2026-10-20T10:00:00Z", "1.1 Ancien", "Types", "suspect"),
      ],
    });
    const stats = studentStats(s, "7", DEFAULT_KINDS, now);
    expect([stats.exercises, stats.sheets, stats.homework, stats.messages]).toEqual([2, 1, 0, 0]);
    expect(stats.typing).toEqual({ suspect: 1, attention: 0, ok: 1 });
    expect(typingBadge(stats.typing)).toEqual({ tone: "warn", label: "1 suspect" });
    // Exercices masqués : la frappe reste comptée.
    expect(studentStats(s, "7", ["sheet"], now).typing.suspect).toBe(1);
    expect(studentStats(s, "today", DEFAULT_KINDS, now).latestAt).toBe(at("2026-11-06T18:49:00Z"));
  });

  it("résume la frappe : à regarder, RAS, ou rien", () => {
    expect(typingBadge({ suspect: 0, attention: 2, ok: 1 })).toEqual({ tone: "att", label: "2 à regarder" });
    expect(typingBadge({ suspect: 0, attention: 0, ok: 3 })).toEqual({ tone: "ok", label: "RAS" });
    expect(typingBadge({ suspect: 0, attention: 0, ok: 0 }).tone).toBe("none");
  });

  it("groupe le détail par jour, puis les exercices par fiche", () => {
    const days = groupByDay([
      ex("2026-11-04T21:41:00Z", "2.3", "Les Fonctions"),
      { at: at("2026-11-04T21:42:00Z"), kind: "sheet", label: "Fiche terminée : Les Fonctions" },
      ex("2026-11-04T21:30:00Z", "2.2", "Les Fonctions"),
      ex("2026-11-04T21:00:00Z", "1.1", "Types"),
      ex("2026-11-06T18:49:00Z", "5.1", "Les Conditions"),
    ]);
    expect(days.map((day) => day.day)).toEqual(["2026-11-06", "2026-11-04"]);
    const blocks = days[1].blocks.map((block) => (block.type === "event" ? "fiche" : `${block.sheet}:${block.items.length}`));
    expect(blocks).toEqual(["fiche", "Les Fonctions:2", "Types:1"]);
  });

  it("fait un fil jour par jour, une ligne d'exercices par élève et par jour", () => {
    const a = student({
      events: [
        ex("2026-11-06T18:49:00Z", "5.1 Impôt", "Les Conditions", "ok"),
        ex("2026-11-06T18:40:00Z", "5.0 Taxe", "Les Conditions", "attention"),
        { at: at("2026-11-05T21:41:00Z"), kind: "sheet", label: "Fiche terminée : Les Fonctions" },
      ],
    });
    const b = student({ id: "s2", fullName: "Paul", classe: null, privateLesson: true, events: [ex("2026-11-06T10:33:00Z", "3.3 Panneau", "Ferme")] });
    const feed = buildFeed([a, b], "7", DEFAULT_KINDS, now);
    expect(feed.map((day) => [day.day, day.students, day.exercises, day.lines.length])).toEqual([
      ["2026-11-06", 2, 3, 2],
      ["2026-11-05", 1, 0, 1],
    ]);
    expect(feed[0].lines[0]).toMatchObject({ name: "Gwen", text: "2 exercices validés (Les Conditions)", severity: "attention" });
    expect(feed[0].lines[1]).toMatchObject({ name: "Paul", text: "Exercice validé : 3.3 Panneau (Ferme)", severity: null });
  });

  it("écrit les jours et la dernière activité en français", () => {
    expect(dayHeading("2026-11-06", now)).toBe("Aujourd'hui, vendredi 6 novembre");
    expect(dayHeading("2026-11-05", now)).toBe("Hier, jeudi 5 novembre");
    expect(dayHeading("2026-11-04", now)).toBe("Mercredi 4 novembre");
    expect(lastActivityLabel(at("2026-11-06T18:49:00Z"), now)).toBe("aujourd'hui 19:49");
    expect(lastActivityLabel(at("2026-11-05T21:18:00Z"), now)).toBe("hier 22:18");
    expect(lastActivityLabel(at("2026-11-02T10:00:00Z"), now)).toBe("lun. 2 nov.");
    expect(lastActivityLabel(null, now)).toBe("jamais");
  });
});
