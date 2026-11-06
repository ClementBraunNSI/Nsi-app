import { classGroups, NO_CLASS } from "./class-groups";
import { NSI_LEVELS } from "./nsi-levels";

/*
 * Page « Aujourd'hui » de l'admin : ce qui attend une action, la semaine, les classes.
 * Tout est calculé ici à partir des listes déjà renvoyées par les actions serveur, pour être testé sans base.
 */

const DAY_MS = 86_400_000;
export const INACTIVE_DAYS = 7;

export type TodayStudent = {
  id: string;
  full_name: string | null;
  level: string | null;
  classe: string | null;
  /** Dernière activité de travail (lib/last-work.ts), pas la date de modification du profil. */
  last_work_at: string | null;
  has_private_lessons: boolean | null;
};

export type TodayInput = {
  now: Date;
  students: TodayStudent[];
  pending: { id: string; userId: string; studentName: string; exerciseLabel: string; courseTitle: string; createdAt: string }[];
  inbox: { id: string; full_name: string | null; lastAt: string | null; unread: number }[];
  evaluations: { id: string; title: string; status: string; classes: string[]; attempts: number; submitted: number; locked: number }[];
  challenges: { id: string; title: string; classes: string[]; opensAt: string; closesAt: string; submitted: number; passed: number; locked: number }[];
  assessments: { id: string; kind: "interro" | "ds"; title: string; day: string; time: string | null; classes: string[] }[];
  lessons: { id: string; full_name: string; lesson: { id: string; starts_at: string; duration_minutes: number; title: string | null } | null }[];
  visios: { id: string; title: string; classes: string[]; isOpen: boolean; sessions: { id: string; day: string; start: string; end: string }[] }[];
  homework: { id: string; title: string; classe: string | null; due_at: string | null; doneCount: number }[];
};

export type TodayDate = {
  key: string;
  kind: "interro" | "ds" | "cours" | "visio";
  title: string;
  who: string;
  /** Jour AAAA-MM-JJ, heure de Paris. */
  day: string;
  time: string | null;
  href: string;
};

export type TodayClass = {
  key: string;
  label: string;
  /** Dossier de niveau (« 0 » à « 4 ») pour la couleur et le renard, ou null. */
  folder: string | null;
  levelLabel: string;
  image: string;
  total: number;
  inactive: number;
};

export type AdminTodayData = {
  pending: { total: number; oldestAt: string | null; items: { id: string; who: string; what: string; classe: string | null }[] };
  unread: { total: number; items: { id: string; name: string; at: string | null; count: number }[] };
  evaluations: { id: string; title: string; classes: string[]; attempts: number; submitted: number; locked: number }[];
  challenge: {
    id: string;
    title: string;
    classes: string[];
    open: boolean;
    opensAt: string;
    closesAt: string;
    students: number;
    submitted: number;
    passed: number;
    locked: number;
  } | null;
  dates: TodayDate[];
  homework: { id: string; title: string; classe: string; dueAt: string | null; done: number; total: number }[];
  classes: TodayClass[];
  privateStudents: number;
  inactive: number;
};

const parisFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Date et heure de Paris : ["AAAA-MM-JJ", "HH:MM"]. */
export function parisParts(date: Date): [string, string] {
  const text = parisFormat.format(date);
  const [day, time] = text.split(" ");
  return [day, time.slice(0, 5)];
}

export function isInactive(updatedAt: string | null, now: Date) {
  if (!updatedAt) return true;
  return now.getTime() - new Date(updatedAt).getTime() > INACTIVE_DAYS * DAY_MS;
}

function levelFolder(level: string | null): string | null {
  if (!level) return null;
  for (const [folder, meta] of Object.entries(NSI_LEVELS)) {
    if (meta.profileCode && meta.profileCode === level) return folder;
  }
  return null;
}

function mostCommon(values: (string | null)[]) {
  const counts = new Map<string, number>();
  for (const value of values) if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function buildClassTiles(students: TodayStudent[], now: Date): TodayClass[] {
  const inClass = students.filter((student) => !student.has_private_lessons);
  const tiles = classGroups(inClass, (student) => student.classe).map((group) => {
    const folder = levelFolder(mostCommon(group.items.map((student) => student.level)));
    const meta = folder ? NSI_LEVELS[folder as keyof typeof NSI_LEVELS] : null;
    return {
      key: group.key,
      label: group.label,
      folder,
      levelLabel: meta?.label ?? (group.key === NO_CLASS ? "À ranger" : "Niveau non renseigné"),
      image: meta?.image ?? "/images/fox_2.png",
      total: group.items.length,
      inactive: group.items.filter((student) => isInactive(student.last_work_at, now)).length,
    };
  });
  // De la seconde au BTS, puis les classes sans niveau ; « Sans classe » reste en dernier.
  const rank = (tile: TodayClass) => (tile.key === NO_CLASS ? 99 : tile.folder ? Number(tile.folder) : 50);
  return tiles.sort((a, b) => rank(a) - rank(b));
}

export function buildAdminToday(input: TodayInput): AdminTodayData {
  const { now } = input;
  const [today, nowTime] = parisParts(now);
  const classOf = new Map(input.students.map((student) => [student.id, student.classe?.trim() || null]));

  const pendingSorted = [...input.pending].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const unreadThreads = input.inbox.filter((thread) => thread.unread > 0);

  // Défi : celui qui est ouvert, sinon le prochain programmé.
  const nowMs = now.getTime();
  const openChallenge = input.challenges
    .filter((challenge) => Date.parse(challenge.opensAt) <= nowMs && nowMs < Date.parse(challenge.closesAt))
    .sort((a, b) => a.closesAt.localeCompare(b.closesAt))[0];
  const nextChallenge = input.challenges
    .filter((challenge) => Date.parse(challenge.opensAt) > nowMs)
    .sort((a, b) => a.opensAt.localeCompare(b.opensAt))[0];
  const challenge = openChallenge ?? nextChallenge ?? null;

  const dates: TodayDate[] = [];
  for (const item of input.assessments) {
    if (item.day < today) continue;
    dates.push({
      key: `a-${item.id}`,
      kind: item.kind,
      title: item.title,
      who: item.classes.join(", "),
      day: item.day,
      time: item.time ? item.time.slice(0, 5) : null,
      href: "/admin/devoirs#interros",
    });
  }
  for (const row of input.lessons) {
    if (!row.lesson) continue;
    const [day, time] = parisParts(new Date(row.lesson.starts_at));
    if (day < today) continue;
    dates.push({ key: `l-${row.lesson.id}`, kind: "cours", title: row.lesson.title || "Cours particulier", who: row.full_name, day, time, href: "/admin/eleves" });
  }
  for (const visio of input.visios) {
    for (const session of visio.sessions) {
      if (session.day < today || (session.day === today && session.end < nowTime)) continue;
      dates.push({ key: `v-${session.id}`, kind: "visio", title: visio.title || "Visio", who: visio.classes.join(", "), day: session.day, time: session.start, href: "/admin/devoirs#visio" });
    }
  }
  dates.sort((a, b) => `${a.day} ${a.time ?? "00:00"}`.localeCompare(`${b.day} ${b.time ?? "00:00"}`));

  const classSizes = new Map<string, number>();
  for (const student of input.students) {
    const classe = student.classe?.trim();
    if (classe && !student.has_private_lessons) classSizes.set(classe, (classSizes.get(classe) ?? 0) + 1);
  }
  const cutoff = nowMs - DAY_MS;
  const homework = input.homework
    .filter((row) => row.classe && (!row.due_at || Date.parse(row.due_at) >= cutoff))
    .sort((a, b) => (a.due_at ?? "9999").localeCompare(b.due_at ?? "9999"))
    .map((row) => ({
      id: row.id,
      title: row.title,
      classe: row.classe as string,
      dueAt: row.due_at,
      done: row.doneCount,
      total: classSizes.get((row.classe as string).trim()) ?? 0,
    }));

  const classes = buildClassTiles(input.students, now);

  return {
    pending: {
      total: pendingSorted.length,
      oldestAt: pendingSorted[0]?.createdAt ?? null,
      items: pendingSorted.slice(0, 3).map((item) => ({
        id: item.id,
        who: item.studentName,
        what: [item.courseTitle, item.exerciseLabel].filter(Boolean).join(" · "),
        classe: classOf.get(item.userId) ?? null,
      })),
    },
    unread: {
      total: unreadThreads.reduce((sum, thread) => sum + thread.unread, 0),
      items: unreadThreads.slice(0, 3).map((thread) => ({ id: thread.id, name: thread.full_name || "Élève", at: thread.lastAt, count: thread.unread })),
    },
    evaluations: input.evaluations
      .filter((evaluation) => evaluation.status === "ouverte")
      .map(({ id, title, classes, attempts, submitted, locked }) => ({ id, title, classes, attempts, submitted, locked })),
    challenge: challenge
      ? {
          id: challenge.id,
          title: challenge.title,
          classes: challenge.classes,
          open: challenge === openChallenge,
          opensAt: challenge.opensAt,
          closesAt: challenge.closesAt,
          students: challenge.classes.reduce((sum, classe) => sum + (classSizes.get(classe.trim()) ?? 0), 0),
          submitted: challenge.submitted,
          passed: challenge.passed,
          locked: challenge.locked,
        }
      : null,
    dates: dates.slice(0, 5),
    homework: homework.slice(0, 4),
    classes,
    privateStudents: input.students.filter((student) => student.has_private_lessons).length,
    inactive: classes.reduce((sum, tile) => sum + tile.inactive, 0),
  };
}

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

/** Jour lisible par rapport à aujourd'hui : « aujourd'hui », « demain », sinon « ven. 14 nov. ». */
export function dayLabel(day: string, now: Date) {
  const [today] = parisParts(now);
  const [tomorrow] = parisParts(new Date(now.getTime() + DAY_MS));
  if (day === today) return "aujourd'hui";
  if (day === tomorrow) return "demain";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export function timeLabel(time: string | null) {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  return minutes === "00" ? `${Number(hours)} h` : `${Number(hours)} h ${minutes}`;
}

const KIND_LABELS: Record<TodayDate["kind"], string> = { interro: "Interro", ds: "DS", cours: "Cours", visio: "Visio" };
export function dateKindLabel(kind: TodayDate["kind"]) {
  return KIND_LABELS[kind];
}

/** Phrase de l'en-tête : ce qui attend, puis la prochaine date des deux jours à venir. */
export function todaySummary(data: AdminTodayData, now: Date) {
  const parts: string[] = [];
  if (data.pending.total) parts.push(plural(data.pending.total, "réponse à corriger", "réponses à corriger"));
  if (data.unread.total) parts.push(plural(data.unread.total, "message non lu", "messages non lus"));
  const locked = data.evaluations.reduce((sum, evaluation) => sum + evaluation.locked, 0);
  if (locked) parts.push(plural(locked, "élève verrouillé en évaluation", "élèves verrouillés en évaluation"));
  let text = parts.length ? `${parts.join(", ")}.` : "Rien en attente.";
  const [today] = parisParts(now);
  const [afterTomorrow] = parisParts(new Date(now.getTime() + 2 * DAY_MS));
  const next = data.dates.find((date) => date.day >= today && date.day < afterTomorrow);
  if (next) {
    const when = [dayLabel(next.day, now), next.time ? `à ${timeLabel(next.time)}` : ""].filter(Boolean).join(" ");
    const who = next.who ? (next.kind === "cours" ? ` avec ${next.who}` : ` en ${next.who}`) : "";
    text += ` ${KIND_LABELS[next.kind]} « ${next.title} »${who} ${when}.`;
  }
  return text;
}
