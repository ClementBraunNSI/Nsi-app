/**
 * Ajout d'élèves en lot : lecture de la liste de prénoms, adresses proposées et contrôle avant création.
 * Fonctions pures, partagées entre le formulaire (aperçu) et l'action serveur (contrôle final).
 */

import { classTemporaryPassword } from "./class-password";

export const STUDENT_EMAIL_DOMAIN = "clementbraun.info";
export const BULK_MAX_ROWS = 40;

/** Raison pour laquelle l'adresse proposée diffère de l'adresse de base. */
export type BulkOrigin = "new" | "taken" | "duplicate";

/** Problème qui bloque la création d'une ligne, tel qu'elle est au moment du contrôle. */
export type BulkProblem = "name" | "email_invalid" | "taken" | "duplicate";

export type BulkRow = {
  /** Prénom tel qu'il a été saisi (espaces superflus retirés). */
  fullName: string;
  /** Adresse sans suffixe, tirée du prénom. Vide si le prénom ne donne aucune lettre utilisable. */
  baseEmail: string;
  /** Adresse proposée, modifiable à la main. */
  email: string;
  origin: BulkOrigin;
};

/** Une ligne par prénom ; virgules, points-virgules et tabulations servent aussi de séparateurs (liste collée). */
export function parseNameList(text: string): string[] {
  return String(text || "")
    .split(/[\n\r,;\t]+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

const LIGATURES: Record<string, string> = { œ: "oe", æ: "ae", ß: "ss", ø: "o", ł: "l", đ: "d" };

/** Partie locale de l'adresse : minuscules, sans accents ni espaces ; seuls lettres, chiffres et tirets restent. */
export function emailLocalPart(fullName: string): string {
  return String(fullName || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[œæßøłđ]/g, (char) => LIGATURES[char] ?? "")
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function studentEmail(localPart: string, domain = STUDENT_EMAIL_DOMAIN) {
  return localPart ? `${localPart}@${domain}` : "";
}

export function normalizeEmail(email: string) {
  return String(email || "").trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

/** Mot de passe provisoire : il dépend du prénom seul, jamais du suffixe de l'adresse (leo2@ → Nsi-leo26). */
export function bulkTemporaryPassword(fullName: string) {
  return classTemporaryPassword(fullName);
}

/**
 * Adresse proposée pour chaque prénom. Si l'adresse de base est déjà prise (compte existant) ou déjà utilisée
 * plus haut dans la liste, on ajoute le plus petit suffixe libre à partir de 2 : leo2@, hugo2@, hugo3@…
 */
export function proposeBulkRows(names: string[], takenEmails: Iterable<string>, domain = STUDENT_EMAIL_DOMAIN): BulkRow[] {
  const taken = new Set([...takenEmails].map(normalizeEmail));
  const used = new Set<string>();
  const seenBases = new Set<string>();

  return names.map((rawName) => {
    const fullName = String(rawName || "").replace(/\s+/g, " ").trim();
    const local = emailLocalPart(fullName);
    const baseEmail = studentEmail(local, domain);
    if (!baseEmail) return { fullName, baseEmail, email: "", origin: "new" as const };

    const duplicate = seenBases.has(baseEmail);
    seenBases.add(baseEmail);
    const blocked = (email: string) => taken.has(email) || used.has(email);

    let email = baseEmail;
    let origin: BulkOrigin = "new";
    if (blocked(baseEmail)) {
      origin = duplicate ? "duplicate" : "taken";
      let n = 2;
      while (blocked(studentEmail(`${local}${n}`, domain))) n += 1;
      email = studentEmail(`${local}${n}`, domain);
    }
    used.add(email);
    return { fullName, baseEmail, email, origin };
  });
}

/** Problème de chaque ligne avec les adresses actuelles (éventuellement corrigées à la main). */
export function bulkProblems(rows: Pick<BulkRow, "fullName" | "email">[], takenEmails: Iterable<string>): (BulkProblem | null)[] {
  const taken = new Set([...takenEmails].map(normalizeEmail));
  const counts = new Map<string, number>();
  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (email) counts.set(email, (counts.get(email) ?? 0) + 1);
  }
  return rows.map((row) => {
    const email = normalizeEmail(row.email);
    if (row.fullName.length < 2 || row.fullName.length > 80 || !bulkTemporaryPassword(row.fullName)) return "name";
    if (!isValidEmail(email)) return "email_invalid";
    if (taken.has(email)) return "taken";
    if ((counts.get(email) ?? 0) > 1) return "duplicate";
    return null;
  });
}

/** Texte à coller (tableur, traitement de texte) : une ligne par élève, colonnes séparées par des tabulations. */
export function recapText(rows: { fullName: string; email: string; password: string }[]) {
  return [
    ["Prénom", "Identifiant", "Mot de passe provisoire"].join("\t"),
    ...rows.map((row) => [row.fullName, row.email, row.password].join("\t")),
  ].join("\n");
}
