import { icons } from "lucide-react";
import { FoxHead } from "@/components/ui/FoxHead";

/**
 * Pictogrammes utilisables dans les cours (fichiers content/) à la place des emojis :
 * <Icone nom="target" />, <Renard />, <Renards n={2} />.
 * Rendus côté serveur : la liste complète des icônes lucide n'alourdit pas les pages.
 */

const pascal = (name: string) =>
  name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

/** Icône lucide désignée par son nom (« triangle-alert », « book-open »…). */
export function Icone({ nom }: { nom: string }) {
  const Icon = icons[pascal(nom) as keyof typeof icons];
  if (!Icon) return null;
  return <Icon className="course-mark" size="1em" aria-hidden />;
}

/** Le renard du site, en petit. */
export function Renard() {
  return (
    <span className="course-mark">
      <FoxHead size="1.15em" />
    </span>
  );
}

/**
 * Niveau de difficulté : de 1 à 5 têtes de renard. Dans un cours, on écrit <Renards n="2" /> :
 * le moteur des cours bloque les expressions {…}, le nombre arrive donc en texte.
 */
export function Renards({ n }: { n: number | string }) {
  const count = Math.max(1, Math.min(5, Math.round(Number(n)) || 1));
  return (
    <span className="course-level" role="img" aria-label={`Niveau ${count} sur ${Math.max(3, count)}`}>
      {Array.from({ length: count }, (_, index) => (
        <FoxHead key={index} size="1.05em" />
      ))}
    </span>
  );
}
