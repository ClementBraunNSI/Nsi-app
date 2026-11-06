import { describe, expect, it } from "vitest";
import { lastWorkByStudent, type LastWorkRows } from "../lib/last-work";
import { lastActivityLabel, studentStats, DEFAULT_KINDS, type BoardStudent } from "../lib/activity-board";
import { buildClassTiles, isInactive, type TodayStudent } from "../lib/admin-today";

// Vendredi 6 novembre 2026, 12 h à Paris.
const now = new Date("2026-11-06T11:00:00Z");

// Cas signalé : Julie a envoyé et validé des codes le 5 novembre, son profil a été modifié le 2.
const rows: LastWorkRows = {
  progress: [
    { user_id: "julie", completed_at: "2026-11-05T07:54:00Z" },
    { user_id: "julie", completed_at: "2026-11-05T08:07:00Z" },
    { user_id: "marc", completed_at: "2026-10-20T10:00:00Z" },
  ],
  badges: [{ user_id: "julie", unlocked_at: "2026-11-01T10:00:00Z" }],
  homework: [{ user_id: "marc", completed_at: "2026-10-28T10:00:00Z" }],
  submissions: [
    { user_id: "julie", created_at: "2026-11-05T08:07:00Z" },
    { user_id: "julie", created_at: "2026-11-05T07:54:00Z" },
    { user_id: "nina", created_at: "2026-11-06T09:30:00Z" }, // essai raté, rien de validé
  ],
};

describe("dernière activité, la même partout dans l'admin", () => {
  const lastWork = lastWorkByStudent(rows);

  it("prend le travail le plus récent, toutes sources confondues", () => {
    expect(lastWork.get("julie")).toBe("2026-11-05T08:07:00Z");
    expect(lastWork.get("marc")).toBe("2026-10-28T10:00:00Z");
    // Un essai envoyé compte, même raté.
    expect(lastWork.get("nina")).toBe("2026-11-06T09:30:00Z");
    expect(lastWork.has("personne")).toBe(false);
  });

  it("donne la même date sur la liste des élèves, la page Activité et Aujourd'hui", () => {
    // Liste des élèves (getAdminDashboardData) : profil + last_work_at.
    const listed: TodayStudent = {
      id: "julie",
      full_name: "Julie",
      level: "1NSI",
      classe: "1NSI2",
      has_private_lessons: false,
      last_work_at: lastWork.get("julie") ?? null,
    };
    // Page Activité (getActivityBoard) : lastWorkAt.
    const board: BoardStudent = {
      id: "julie",
      fullName: "Julie",
      classe: "1NSI2",
      privateLesson: false,
      lastWorkAt: lastWork.get("julie") ?? null,
      currentSheet: "Les dictionnaires",
      events: [{ at: "2026-11-05T08:07:00Z", kind: "exercise", label: "3.2", sheet: "Les dictionnaires" }],
      undated: [],
    };

    expect(listed.last_work_at).toBe(board.lastWorkAt);
    expect(lastActivityLabel(listed.last_work_at, now)).toBe("hier 09:07");
    expect(lastActivityLabel(board.lastWorkAt, now)).toBe("hier 09:07");
    // Ni la liste, ni la tuile de classe d'Aujourd'hui ne la comptent comme inactive.
    expect(isInactive(listed.last_work_at, now)).toBe(false);
    expect(buildClassTiles([listed], now)[0]).toMatchObject({ label: "1NSI2", total: 1, inactive: 0 });
    // La page Activité la compte active sur 7 jours.
    expect(studentStats(board, "7", DEFAULT_KINDS, now).exercises).toBe(1);
  });

  it("ignore les dates vides ou illisibles", () => {
    const map = lastWorkByStudent({
      progress: [{ user_id: "a", completed_at: null }],
      badges: [{ user_id: "a", unlocked_at: "pas une date" }],
      homework: [],
      submissions: [],
    });
    expect(map.size).toBe(0);
  });
});
