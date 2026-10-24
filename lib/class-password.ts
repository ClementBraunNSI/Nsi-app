/** Mot de passe temporaire d'un élève de classe : Nsi-prenom26, sans accent ni majuscule. */
export function classTemporaryPassword(fullName: string) {
  const prenom = String(fullName || "")
    .trim()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  if (prenom.length < 2) return "";
  return `Nsi-${prenom}26`;
}
