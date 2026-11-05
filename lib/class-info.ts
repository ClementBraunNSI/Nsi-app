/** Informations de classe renvoyées par class_info_mine (site) et extension_class_info (extension). */

export type ClassHomework = {
  id: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  pagePath: string | null;
  pageTitle: string | null;
  done: boolean;
};

export type ClassAssessment = {
  id: string;
  kind: "interro" | "ds";
  title: string;
  /** Jour au format AAAA-MM-JJ, heure de Paris. */
  day: string;
  /** HH:MM, ou null quand l'heure n'est pas fixée. */
  time: string | null;
  chapters: string;
};

export type ClassVisio = {
  id: string;
  title: string;
  note: string;
  /** Ouverte par l'enseignant, ou séance qui commence dans moins de 15 minutes. */
  joinable: boolean;
  /** Adresse et code : présents seulement quand la visio est rejoignable. */
  url: string | null;
  code: string | null;
  nextSession: { day: string; start: string; end: string } | null;
};

export type ClassVisioSession = { id: string; title: string; day: string; start: string; end: string };

export type ClassInfo = {
  classe: string | null;
  homework: ClassHomework[];
  assessments: ClassAssessment[];
  visios: ClassVisio[];
  visioSessions: ClassVisioSession[];
  unread: number;
  lastAnnouncement: { id: string; body: string; createdAt: string } | null;
};

export const ASSESSMENT_LABELS: Record<ClassAssessment["kind"], string> = { interro: "Interro", ds: "DS" };

export function parseClassInfo(value: unknown): ClassInfo | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<ClassInfo>;
  return {
    classe: data.classe ?? null,
    homework: Array.isArray(data.homework) ? data.homework : [],
    assessments: Array.isArray(data.assessments) ? data.assessments : [],
    visios: Array.isArray(data.visios) ? data.visios : [],
    visioSessions: Array.isArray(data.visioSessions) ? data.visioSessions : [],
    unread: Number(data.unread) || 0,
    lastAnnouncement: data.lastAnnouncement ?? null,
  };
}

const TOKEN = /^tdc_[0-9a-f]{64}$/;

/** Jeton de l'en-tête « Authorization: Bearer … », ou null s'il n'a pas la forme attendue. */
export function bearerToken(header: string | null): string | null {
  const match = /^Bearer\s+(\S+)$/i.exec(header?.trim() ?? "");
  return match && TOKEN.test(match[1]) ? match[1] : null;
}

/** « mardi 18 novembre à 10:00 », ou sans l'heure. Le jour est lu comme une date de Paris. */
export function formatAssessmentDate(day: string, time: string | null) {
  const [year, month, date] = day.split("-").map(Number);
  const label = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, date)),
  );
  if (!time) return label;
  const [hours, minutes] = time.split(":");
  return `${label} à ${Number(hours)} h${minutes && minutes !== "00" ? ` ${minutes}` : ""}`;
}
