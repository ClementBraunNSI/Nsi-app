import { parisParts } from "./admin-today";

/*
 * Page « Activité » de l'admin : filtres par période et par type, chiffres par élève,
 * détail groupé par jour et par fiche, fil d'activité tous élèves confondus.
 * Le serveur envoie les 30 derniers jours ; tout le reste se calcule ici, sans base.
 */

export type ActivityKind = "exercise" | "sheet" | "homework" | "message";
export type TypingSeverity = "ok" | "attention" | "suspect";
export type ActivityPeriod = "today" | "7" | "30";

export type BoardEvent = {
  at: string;
  kind: ActivityKind;
  label: string;
  exerciseId?: string;
  /** Fiche de l'exercice. */
  sheet?: string;
  /** Résumé du suivi de frappe de l'essai réussi, quand il existe. */
  severity?: TypingSeverity | null;
};

export type BoardStudent = {
  id: string;
  fullName: string;
  classe: string | null;
  privateLesson: boolean;
  /** Dernier travail, toutes dates confondues (exercice, fiche ou devoir). */
  lastWorkAt: string | null;
  /** Fiche du dernier exercice validé. */
  currentSheet: string | null;
  /** Les 30 derniers jours, du plus récent au plus ancien. */
  events: BoardEvent[];
  /** Devoirs particuliers rendus dont la date n'est pas enregistrée. */
  undated: string[];
};

export const WINDOW_DAYS = 30;
const DAY_MS = 86_400_000;
export const ALL_KINDS: ActivityKind[] = ["exercise", "sheet", "homework", "message"];
export const DEFAULT_KINDS: ActivityKind[] = ["exercise", "sheet", "homework"];

export function inPeriod(at: string, period: ActivityPeriod, now: Date) {
  if (period === "today") return parisParts(new Date(at))[0] === parisParts(now)[0];
  return now.getTime() - new Date(at).getTime() <= Number(period) * DAY_MS;
}

export function filterEvents(events: BoardEvent[], period: ActivityPeriod, kinds: readonly ActivityKind[], now: Date) {
  return events.filter((event) => kinds.includes(event.kind) && inPeriod(event.at, period, now));
}

export type TypingTally = { suspect: number; attention: number; ok: number };

export type StudentStats = {
  events: BoardEvent[];
  exercises: number;
  sheets: number;
  homework: number;
  messages: number;
  typing: TypingTally;
  /** Dernier événement affiché sur la période, pour le tri. */
  latestAt: string | null;
};

export function studentStats(student: BoardStudent, period: ActivityPeriod, kinds: readonly ActivityKind[], now: Date): StudentStats {
  const events = filterEvents(student.events, period, kinds, now);
  const count = (kind: ActivityKind) => events.filter((event) => event.kind === kind).length;
  // La frappe se lit sur tous les exercices de la période, même si le type « exercices » est masqué.
  const typing: TypingTally = { suspect: 0, attention: 0, ok: 0 };
  for (const event of student.events) {
    if (event.kind !== "exercise" || !event.severity || !inPeriod(event.at, period, now)) continue;
    typing[event.severity] += 1;
  }
  return {
    events,
    exercises: count("exercise"),
    sheets: count("sheet"),
    homework: count("homework"),
    messages: count("message"),
    typing,
    latestAt: events[0]?.at ?? null,
  };
}

/** Pastille de la colonne « Frappe ». */
export function typingBadge(tally: TypingTally): { tone: "warn" | "att" | "ok" | "none"; label: string } {
  if (tally.suspect) return { tone: "warn", label: `${tally.suspect} suspect${tally.suspect > 1 ? "s" : ""}` };
  if (tally.attention) return { tone: "att", label: `${tally.attention} à regarder` };
  if (tally.ok) return { tone: "ok", label: "RAS" };
  return { tone: "none", label: "—" };
}

export type DayBlock =
  | { type: "exercises"; sheet: string; at: string; items: BoardEvent[] }
  | { type: "event"; at: string; event: BoardEvent };

export type DayGroup = { day: string; blocks: DayBlock[] };

/** Détail d'un élève : un groupe par jour ; dans un jour, les exercices d'une même fiche sont réunis. */
export function groupByDay(events: BoardEvent[]): DayGroup[] {
  const days: DayGroup[] = [];
  const sorted = [...events].sort((a, b) => b.at.localeCompare(a.at));
  for (const event of sorted) {
    const [day] = parisParts(new Date(event.at));
    let group = days[days.length - 1];
    if (!group || group.day !== day) {
      group = { day, blocks: [] };
      days.push(group);
    }
    if (event.kind === "exercise") {
      const sheet = event.sheet || "Autres exercices";
      const block = group.blocks.find((item) => item.type === "exercises" && item.sheet === sheet);
      if (block && block.type === "exercises") block.items.push(event);
      else group.blocks.push({ type: "exercises", sheet, at: event.at, items: [event] });
    } else {
      group.blocks.push({ type: "event", at: event.at, event });
    }
  }
  return days;
}

export type FeedLine = {
  key: string;
  at: string;
  studentId: string;
  name: string;
  classe: string | null;
  privateLesson: boolean;
  text: string;
  /** Pire résumé de frappe des exercices de la ligne. */
  severity: TypingSeverity | null;
};

export type FeedDay = { day: string; students: number; exercises: number; lines: FeedLine[] };

export function worstSeverity(values: (TypingSeverity | null | undefined)[]): TypingSeverity | null {
  if (values.includes("suspect")) return "suspect";
  if (values.includes("attention")) return "attention";
  if (values.includes("ok")) return "ok";
  return null;
}

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

/** Fil d'activité : jour par jour, une ligne par élève pour ses exercices du jour, une ligne par autre événement. */
export function buildFeed(students: BoardStudent[], period: ActivityPeriod, kinds: readonly ActivityKind[], now: Date): FeedDay[] {
  const days = new Map<string, { lines: FeedLine[]; students: Set<string>; exercises: number }>();
  for (const student of students) {
    const exercisesByDay = new Map<string, BoardEvent[]>();
    for (const event of filterEvents(student.events, period, kinds, now)) {
      const [day] = parisParts(new Date(event.at));
      const bucket = days.get(day) ?? { lines: [], students: new Set<string>(), exercises: 0 };
      days.set(day, bucket);
      bucket.students.add(student.id);
      if (event.kind === "exercise") {
        bucket.exercises += 1;
        exercisesByDay.set(day, [...(exercisesByDay.get(day) ?? []), event]);
        continue;
      }
      bucket.lines.push({
        key: `${student.id}-${event.kind}-${event.at}`,
        at: event.at,
        studentId: student.id,
        name: student.fullName,
        classe: student.classe,
        privateLesson: student.privateLesson,
        text: event.label,
        severity: null,
      });
    }
    for (const [day, list] of exercisesByDay) {
      const sheets = [...new Set(list.map((event) => event.sheet).filter(Boolean))];
      const text =
        list.length === 1
          ? `Exercice validé : ${list[0].label}${list[0].sheet ? ` (${list[0].sheet})` : ""}`
          : `${plural(list.length, "exercice validé", "exercices validés")}${sheets.length ? ` (${sheets.join(", ")})` : ""}`;
      days.get(day)!.lines.push({
        key: `${student.id}-ex-${day}`,
        at: list[0].at,
        studentId: student.id,
        name: student.fullName,
        classe: student.classe,
        privateLesson: student.privateLesson,
        text,
        severity: worstSeverity(list.map((event) => event.severity)),
      });
    }
  }
  return [...days]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([day, bucket]) => ({
      day,
      students: bucket.students.size,
      exercises: bucket.exercises,
      lines: bucket.lines.sort((a, b) => b.at.localeCompare(a.at)),
    }));
}

/** « aujourd'hui », « hier », sinon « lun. 2 nov. » */
export function relativeDay(day: string, now: Date) {
  const [today] = parisParts(now);
  const [yesterday] = parisParts(new Date(now.getTime() - DAY_MS));
  if (day === today) return "aujourd'hui";
  if (day === yesterday) return "hier";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

/** En-tête d'un jour : « Aujourd'hui, vendredi 6 novembre », « Hier, jeudi 5 novembre », « Mercredi 4 novembre ». */
export function dayHeading(day: string, now: Date) {
  const long = new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  const relative = relativeDay(day, now);
  if (relative === "aujourd'hui") return `Aujourd'hui, ${long}`;
  if (relative === "hier") return `Hier, ${long}`;
  return long.charAt(0).toUpperCase() + long.slice(1);
}

/** Heure de Paris « 19:49 ». */
export function clock(at: string) {
  return parisParts(new Date(at))[1];
}

/** Dernière activité : « aujourd'hui 19:49 », « hier 22:18 », « lun. 2 nov. », ou « jamais ». */
export function lastActivityLabel(at: string | null, now: Date) {
  if (!at) return "jamais";
  const [day, time] = parisParts(new Date(at));
  const relative = relativeDay(day, now);
  return relative === "aujourd'hui" || relative === "hier" ? `${relative} ${time}` : relative;
}
