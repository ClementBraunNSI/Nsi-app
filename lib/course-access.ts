/**
 * Audience écrite sur chaque cours.
 *
 * - `audience: public`
 * - `audience: { class: "1NSI1" }` — correspond à `profiles.classe`
 * - `audience: { accounts: ["<user id ou email>"] }`
 *
 * Le dossier, le nom affiché et la partie locale de l'e-mail ne donnent aucun accès.
 */

export type CourseAudience =
  | { kind: "public" }
  | { kind: "class"; classe: string }
  | { kind: "accounts"; accounts: string[] };

export type CourseViewer = {
  isElevated: boolean;
  isAuthenticated: boolean;
  userId?: string | null;
  userEmail?: string | null;
  hasPrivateLessons?: boolean;
  classe?: string | null;
};

const text = (value: unknown) => String(value ?? "").trim();
const token = (value: unknown) => text(value).toLowerCase();

export function isElevatedUser(role?: string | null) {
  const normalized = (role || "").toLowerCase().trim();
  return normalized === "admin" || normalized === "enseignant";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function accountList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => text(entry)).filter(Boolean);
}

/**
 * Lit `audience: public`, `{ class }`, ou `{ accounts }`.
 * Toute autre forme, y compris un champ vide, n'est visible que des comptes élevés.
 */
export function parseAudience(data: { audience?: unknown } | null | undefined): CourseAudience {
  const audience = data?.audience;
  if (typeof audience === "string" && audience.trim().toLowerCase() === "public") {
    return { kind: "public" };
  }
  const record = asRecord(audience);
  if (record) {
    const classe = text(record.class);
    if (classe) return { kind: "class", classe };
    if ("accounts" in record) return { kind: "accounts", accounts: accountList(record.accounts) };
  }
  return { kind: "accounts", accounts: [] };
}

export function isPublicCourse(data: { audience?: unknown } | null | undefined) {
  return parseAudience(data).kind === "public";
}

export function isRestrictedCourse(data: { audience?: unknown } | null | undefined) {
  return !isPublicCourse(data);
}

function accountListed(audience: CourseAudience, viewer: CourseViewer) {
  if (audience.kind !== "accounts" || !viewer.isAuthenticated) return false;
  const id = token(viewer.userId);
  const email = token(viewer.userEmail);
  return audience.accounts.some((entry) => {
    const key = token(entry);
    if (!key) return false;
    return (Boolean(id) && key === id) || (Boolean(email) && key === email);
  });
}

export function canAccessCourse(data: { audience?: unknown } | null | undefined, viewer: CourseViewer) {
  if (viewer.isElevated) return true;
  const audience = parseAudience(data);

  // Un élève en cours particuliers voit les cours publics comme tout le monde, en plus des fiches qui le nomment.
  if (audience.kind === "public") return true;
  if (!viewer.isAuthenticated) return false;
  if (audience.kind === "class") {
    const classe = text(viewer.classe);
    return Boolean(classe) && classe === audience.classe;
  }
  return accountListed(audience, viewer);
}
