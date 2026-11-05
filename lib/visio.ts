/** Visio de classe : lien vers une classe virtuelle de l'Éducation nationale, rejointe en invité. */

export type VisioUrlCheck = { ok: true; url: string; warning: string | null } | { ok: false; error: string };

// apps.education.fr et ses sous-domaines, les autres services en education.fr, les domaines académiques ac-*.fr.
const EDUCATION_HOST = /(^|\.)education\.fr$|(^|\.)ac-[a-z0-9-]+\.fr$/;

/** Accepte seulement https://. Avertit, sans bloquer, quand le domaine n'est pas celui d'un service de l'Éducation nationale. */
export function checkVisioUrl(raw: string): VisioUrlCheck {
  const text = String(raw ?? "").trim();
  if (!text) return { ok: false, error: "Indiquer l'adresse de la classe virtuelle." };
  if (text.length > 1000) return { ok: false, error: "Adresse trop longue." };
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return { ok: false, error: "Adresse invalide." };
  }
  if (url.protocol !== "https:") return { ok: false, error: "Seules les adresses en https:// sont acceptées." };
  if (url.username || url.password) return { ok: false, error: "L'adresse ne doit pas contenir d'identifiant ni de mot de passe." };
  const host = url.hostname.toLowerCase();
  const warning = EDUCATION_HOST.test(host)
    ? null
    : `Le domaine ${host} ne ressemble pas à un service de l'Éducation nationale (education.fr, apps.education.fr, ac-….fr). Le lien est tout de même accepté.`;
  return { ok: true, url: url.toString(), warning };
}

export type VisioSessionTimes = { day: string; start: string; end: string };

/** Séance planifiée : jour AAAA-MM-JJ, heures HH:MM, fin après le début. */
export function checkVisioSession({ day, start, end }: VisioSessionTimes): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) return "Date invalide.";
  if (!/^\d{2}:\d{2}$/.test(start) || !/^\d{2}:\d{2}$/.test(end)) return "Heures invalides.";
  if (end <= start) return "La fin doit venir après le début.";
  return null;
}

/** « 14 h – 15 h 30 ». */
export function formatTimeRange(start: string, end: string) {
  const one = (time: string) => {
    const [hours, minutes] = time.split(":");
    return `${Number(hours)} h${minutes && minutes !== "00" ? ` ${minutes}` : ""}`;
  };
  return `${one(start)} – ${one(end)}`;
}
