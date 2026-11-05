// Réglages et lecture partagés par le service worker, le popup et la page de réglages.

export const DEFAULT_SITE = "https://www.clementbraun.info";
// Le site de développement sert aux essais (voir README).
export const ALLOWED_SITES = [DEFAULT_SITE, "http://localhost:3000"];
export const TOKEN_PATTERN = /^tdc_[0-9a-f]{64}$/;

export async function getSettings() {
  const { token = "", site = DEFAULT_SITE } = await chrome.storage.local.get(["token", "site"]);
  return { token, site: ALLOWED_SITES.includes(site) ? site : DEFAULT_SITE };
}

/** Interroge le site. Renvoie { info } ou { error } ; error vaut "token" quand le jeton est refusé. */
export async function fetchClassInfo({ token, site }) {
  if (!TOKEN_PATTERN.test(token)) return { error: "token" };
  try {
    const response = await fetch(`${site}/api/extension/classe`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "omit",
      cache: "no-store",
    });
    if (response.status === 401) return { error: "token" };
    if (!response.ok) return { error: "network" };
    return { info: await response.json() };
  } catch {
    return { error: "network" };
  }
}

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const dueFormat = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

export function formatAssessmentDate(day, time) {
  const [year, month, date] = day.split("-").map(Number);
  const label = dayFormat.format(new Date(Date.UTC(year, month - 1, date)));
  if (!time) return label;
  const [hours, minutes] = time.split(":");
  return `${label} à ${Number(hours)} h${minutes && minutes !== "00" ? ` ${minutes}` : ""}`;
}

export function formatTimeRange(start, end) {
  const one = (time) => {
    const [hours, minutes] = time.split(":");
    return `${Number(hours)} h${minutes && minutes !== "00" ? ` ${minutes}` : ""}`;
  };
  return `${one(start)} – ${one(end)}`;
}

export function formatDue(iso) {
  return iso ? `Pour ${dueFormat.format(new Date(iso))}` : "Sans date limite";
}
