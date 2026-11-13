import { touchesAdminClass } from "./admin-class";

/*
 * Page « Préparer » : tout ce que la classe a devant elle sur une semaine (évaluations, interros et DS, défis,
 * devoirs, annonces, visios), rangé par jour. Calcul sans base, testé dans tests/admin-week.test.ts.
 */

const DAY_MS = 86_400_000;
const parisDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });
const parisTime = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export type WeekKind = "evaluation" | "interro" | "ds" | "defi" | "devoir" | "annonce" | "visio";

export type WeekItem = {
  key: string;
  kind: WeekKind;
  title: string;
  /** « 09:00 », ou null pour un élément sans heure. */
  time: string | null;
  who: string;
  href: string;
};

export type WeekDay = { day: string; label: string; today: boolean; weekend: boolean; items: WeekItem[] };

export type WeekInput = {
  evaluations: { id: string; title: string; status: string; classes: string[]; scheduledAt: string | null }[];
  challenges: { id: string; title: string; classes: string[]; opensAt: string }[];
  assessments: { id: string; kind: "interro" | "ds"; title: string; day: string; time: string | null; classes: string[] }[];
  homework: { id: string; title: string; classe: string | null; due_at: string | null }[];
  announcements: { id: string; body: string; classes: string[]; createdAt: string }[];
  visios: { id: string; title: string; classes: string[]; sessions: { id: string; day: string; start: string }[] }[];
};

export const WEEK_LABELS: Record<WeekKind, string> = {
  evaluation: "Évaluation",
  interro: "Interro",
  ds: "DS",
  defi: "Défi",
  devoir: "Devoir",
  annonce: "Annonce",
  visio: "Visio",
};

const dayOf = (iso: string) => parisDay.format(new Date(iso));
const timeOf = (iso: string) => parisTime.format(new Date(iso)).replace("h", ":").slice(0, 5);
const asDate = (day: string) => new Date(`${day}T12:00:00Z`);
const shift = (day: string, days: number) => new Date(asDate(day).getTime() + days * DAY_MS).toISOString().slice(0, 10);

/** Lundi (AAAA-MM-JJ) de la semaine qui contient ce jour ; un texte invalide donne le lundi de la semaine en cours. */
export function mondayOf(day: string | undefined, now: Date) {
  const base = day && /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(asDate(day).getTime()) ? day : parisDay.format(now);
  const weekday = (asDate(base).getUTCDay() + 6) % 7;
  return shift(base, -weekday);
}

export function shiftWeek(monday: string, weeks: number) {
  return shift(monday, weeks * 7);
}

const dayLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", timeZone: "UTC" });
const longLabel = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", timeZone: "UTC" });

/** « Semaine du 9 novembre ». */
export function weekTitle(monday: string) {
  return `Semaine du ${longLabel.format(asDate(monday))}`;
}

/**
 * Les jours de la semaine du lundi donné, avec leurs éléments triés par heure (ceux sans heure à la fin).
 * Samedi et dimanche n'apparaissent que s'ils ont quelque chose. `selection` : classe de la barre du haut.
 */
export function buildWeek(input: WeekInput, monday: string, selection: string, now: Date): WeekDay[] {
  const today = parisDay.format(now);
  const days = Array.from({ length: 7 }, (_, index) => shift(monday, index));
  const byDay = new Map<string, WeekItem[]>(days.map((day) => [day, []]));
  const add = (day: string, item: WeekItem) => byDay.get(day)?.push(item);
  const who = (classes: string[]) => classes.join(", ");

  for (const item of input.evaluations) {
    if (!item.scheduledAt || item.status === "brouillon" && !item.scheduledAt || !touchesAdminClass(selection, item.classes)) continue;
    add(dayOf(item.scheduledAt), {
      key: `e-${item.id}`,
      kind: "evaluation",
      title: item.status === "brouillon" ? `${item.title} (brouillon)` : item.title,
      time: timeOf(item.scheduledAt),
      who: who(item.classes),
      href: `/admin/evaluations/${item.id}`,
    });
  }
  for (const item of input.challenges) {
    if (!touchesAdminClass(selection, item.classes)) continue;
    add(dayOf(item.opensAt), { key: `c-${item.id}`, kind: "defi", title: item.title, time: timeOf(item.opensAt), who: who(item.classes), href: `/admin/defis/${item.id}` });
  }
  for (const item of input.assessments) {
    if (!touchesAdminClass(selection, item.classes)) continue;
    add(item.day, { key: `a-${item.id}`, kind: item.kind, title: item.title, time: item.time ? item.time.slice(0, 5) : null, who: who(item.classes), href: "/admin/devoirs#interros" });
  }
  for (const item of input.homework) {
    if (!item.due_at || !item.classe || !touchesAdminClass(selection, [item.classe])) continue;
    add(dayOf(item.due_at), { key: `h-${item.id}`, kind: "devoir", title: item.title, time: null, who: item.classe, href: "/admin/devoirs#devoirs-classe" });
  }
  for (const item of input.announcements) {
    if (!touchesAdminClass(selection, item.classes)) continue;
    const text = item.body.replace(/\s+/g, " ").trim();
    add(dayOf(item.createdAt), {
      key: `n-${item.id}`,
      kind: "annonce",
      title: text.length > 60 ? `${text.slice(0, 59)}…` : text,
      time: null,
      who: who(item.classes),
      href: "/admin/annonces",
    });
  }
  for (const visio of input.visios) {
    if (!touchesAdminClass(selection, visio.classes)) continue;
    for (const session of visio.sessions) {
      add(session.day, { key: `v-${session.id}`, kind: "visio", title: visio.title || "Visio", time: session.start.slice(0, 5), who: who(visio.classes), href: "/admin/devoirs#visio" });
    }
  }

  return days
    .map((day, index) => ({
      day,
      label: dayLabel.format(asDate(day)),
      today: day === today,
      weekend: index >= 5,
      items: (byDay.get(day) ?? []).sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99") || a.title.localeCompare(b.title, "fr")),
    }))
    .filter((day) => !day.weekend || day.items.length > 0);
}
