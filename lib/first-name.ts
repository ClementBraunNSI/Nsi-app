/** Premier mot du nom complet ; null quand le profil n'a pas de nom. */
export function firstNameOf(fullName: string | null | undefined): string | null {
  const first = String(fullName || "").trim().split(/\s+/)[0];
  return first || null;
}
