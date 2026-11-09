/**
 * Signalements de bugs envoyés par les élèves : statuts, contrôles et réduction de la capture d'écran.
 * Module partagé navigateur et serveur ; seule compressScreenshot a besoin du navigateur.
 */

export type BugStatus = "nouveau" | "vu" | "corrige" | "ecarte";

export const BUG_STATUSES: { id: BugStatus; label: string }[] = [
  { id: "nouveau", label: "Nouveau" },
  { id: "vu", label: "Vu" },
  { id: "corrige", label: "Corrigé" },
  { id: "ecarte", label: "Écarté" },
];

export const BUG_MESSAGE_MIN = 5;
export const BUG_MESSAGE_MAX = 3000;
/** Taille maximale de la capture une fois compressée (data URL), alignée sur la contrainte de la table. */
export const BUG_SCREENSHOT_MAX = 1_900_000;
const MAX_WIDTH = 1600;

/** Signalement tel que l'enseignant le liste ; la capture se charge à part, à l'ouverture. */
export type BugReport = {
  id: string;
  createdAt: string;
  status: BugStatus;
  page: string | null;
  message: string;
  hasScreenshot: boolean;
  context: { userAgent?: string; viewport?: string; language?: string };
  note: string | null;
  student: { id: string | null; name: string; classe: string | null };
};

/** Page concernée : un chemin du site (/cours/...) ou une adresse complète du site, ramenée à son chemin. */
export function cleanBugPage(value: string, origin = "") {
  const text = value.trim().slice(0, 300);
  // Texte libre (« la page des enquêtes ») : gardé tel quel ; seule une adresse est ramenée à son chemin.
  if (!text || !/^(https?:\/\/|\/)/.test(text)) return text;
  try {
    const url = new URL(text, origin || "https://clementbraun.info");
    if (!origin || url.origin === origin || /clementbraun\.info$/.test(url.hostname)) return `${url.pathname}${url.search}`.slice(0, 300);
  } catch {
    /* texte libre : gardé tel quel */
  }
  return text;
}

/** Image acceptée : une data URL d'image, pas trop lourde. */
export function isValidScreenshot(value: string | null | undefined) {
  if (!value) return true;
  return /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value) && value.length <= BUG_SCREENSHOT_MAX;
}

/**
 * Capture d'écran réduite à 1600 px de large et compressée en JPEG dans le navigateur,
 * pour rester légère en base. Qualité baissée tant que l'image dépasse la taille permise.
 */
export async function compressScreenshot(file: Blob): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Le fichier choisi n'est pas une image.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("L'image n'a pas pu être préparée.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.82, 0.7, 0.55, 0.4]) {
    const data = canvas.toDataURL("image/jpeg", quality);
    if (data.length <= BUG_SCREENSHOT_MAX) return data;
  }
  throw new Error("L'image est trop lourde, même réduite : recadrer la capture sur la partie utile.");
}

/** Navigateur et système lisibles : « Chrome 130 · Windows », « Safari · iPhone ». */
export function describeBrowser(userAgent = "") {
  const ua = userAgent;
  const browser =
    ua.match(/Edg\/(\d+)/) ? `Edge ${ua.match(/Edg\/(\d+)/)![1]}`
    : ua.match(/OPR\/(\d+)/) ? `Opera ${ua.match(/OPR\/(\d+)/)![1]}`
    : ua.match(/Firefox\/(\d+)/) ? `Firefox ${ua.match(/Firefox\/(\d+)/)![1]}`
    : ua.match(/Chrome\/(\d+)/) ? `Chrome ${ua.match(/Chrome\/(\d+)/)![1]}`
    : /Safari\//.test(ua) ? "Safari"
    : "";
  const system =
    /iPhone/.test(ua) ? "iPhone"
    : /iPad/.test(ua) ? "iPad"
    : /Android/.test(ua) ? "Android"
    : /CrOS/.test(ua) ? "ChromeOS"
    : /Windows/.test(ua) ? "Windows"
    : /Mac OS X/.test(ua) ? "macOS"
    : /Linux/.test(ua) ? "Linux"
    : "";
  return [browser, system].filter(Boolean).join(" · ") || "Navigateur inconnu";
}
