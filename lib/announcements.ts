/** Annonces par classe : texte brut, adresses http(s) rendues cliquables à l'affichage. */

export const ANNOUNCEMENT_MAX_LENGTH = 5000;

/** Événement émis après lecture des annonces, pour rafraîchir la pastille sans attendre. */
export const ANNOUNCEMENTS_READ_EVENT = "announcements-read";

export type AnnouncementPart = { type: "text"; value: string } | { type: "link"; value: string };

const URL_PATTERN = /https?:\/\/[^\s<>"]+/g;
const TRAILING = /[.,;:!?»'"\]]+$/;

/** Coupe la ponctuation de fin de phrase collée à l'adresse, et la parenthèse fermante qui n'en fait pas partie. */
function trimUrl(raw: string) {
  let url = raw.replace(TRAILING, "");
  while (url.endsWith(")") && (url.match(/\(/g)?.length ?? 0) < (url.match(/\)/g)?.length ?? 0)) {
    url = url.slice(0, -1).replace(TRAILING, "");
  }
  return url;
}

export function splitLinks(text: string): AnnouncementPart[] {
  const parts: AnnouncementPart[] = [];
  let cursor = 0;
  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0;
    const url = trimUrl(match[0]);
    if (!/^https?:\/\/[^/?#\s]+/.test(url)) continue;
    if (start > cursor) parts.push({ type: "text", value: text.slice(cursor, start) });
    parts.push({ type: "link", value: url });
    cursor = start + url.length;
  }
  if (cursor < text.length) parts.push({ type: "text", value: text.slice(cursor) });
  return parts;
}

/** Nettoie la liste de classes envoyée par le formulaire : sans doublon, sans vide. */
export function cleanClasses(classes: unknown): string[] {
  if (!Array.isArray(classes)) return [];
  return [...new Set(classes.map((value) => String(value ?? "").trim()).filter((value) => value && value.length <= 80))];
}
