import { FolderCheck, Search, Sparkles, Star, Target } from "lucide-react";
import type { Achievement } from "@/lib/achievements";

/** Badge d'une enquête : une ligne de la table badges, comme une fiche terminée. */
export const enqueteBadgeId = (slug: string) => `enquete-${slug}`;

export const isEnqueteBadge = (courseId: string) => courseId.startsWith("enquete-");

/** Succès propres aux enquêtes : attribués par le serveur quand un coupable est trouvé, jamais par les fiches. */
export type EnqueteAchievement = Achievement & { image: string };

const never = () => false;

export const ENQUETE_ACHIEVEMENTS: EnqueteAchievement[] = [
  {
    id: "enquete_premier_dossier",
    title: "Premier dossier bouclé",
    description: "Résoudre une première enquête jusqu'au bout.",
    icon: FolderCheck,
    color: "text-emerald-600 bg-emerald-100",
    condition: never,
    image: "/images/succes/enquete_premier_dossier.png",
  },
  {
    id: "enquete_flair",
    title: "Flair du renard",
    description: "Désigner le bon coupable d'une étape sans ouvrir un seul indice.",
    icon: Search,
    color: "text-sky-600 bg-sky-100",
    condition: never,
    image: "/images/succes/enquete_flair.png",
  },
  {
    id: "enquete_rebondissement",
    title: "Pas si vite !",
    description: "Trouver un coupable, puis découvrir que l'enquête n'est pas finie.",
    icon: Sparkles,
    color: "text-orange-600 bg-orange-100",
    condition: never,
    image: "/images/succes/enquete_rebondissement.png",
  },
  {
    id: "enquete_obstine",
    title: "Têtu comme un renard",
    description: "Trouver le coupable après au moins trois fausses accusations.",
    icon: Target,
    color: "text-rose-600 bg-rose-100",
    condition: never,
    image: "/images/succes/enquete_obstine.png",
  },
  {
    id: "enquete_toutes",
    title: "Détective de la tanière",
    description: "Résoudre toutes les enquêtes.",
    icon: Star,
    color: "text-yellow-600 bg-yellow-100",
    condition: never,
    image: "/images/succes/enquete_toutes.png",
  },
];

export function enqueteAchievement(id: string): EnqueteAchievement | undefined {
  return ENQUETE_ACHIEVEMENTS.find((item) => item.id === id);
}

/** Ce que le navigateur reçoit après une bonne accusation : de quoi afficher les récompenses. */
export type EnqueteReward = { id: string; title: string; description: string; image: string; kind: "badge" | "succes" };

/**
 * Succès gagnés par une accusation juste, à partir de faits vérifiés par le serveur.
 * stage : rang de l'étape élucidée ; total : nombre d'étapes ; solvedSlugs : enquêtes résolues après cette accusation.
 */
export function earnedAchievementIds(input: {
  stage: number;
  total: number;
  hintsUsed: number;
  attempts: number;
  solvedSlugs: string[];
  allSlugs: string[];
}): string[] {
  const ids: string[] = [];
  const finished = input.stage === input.total - 1;
  if (finished) ids.push("enquete_premier_dossier");
  if (input.hintsUsed === 0) ids.push("enquete_flair");
  if (!finished && input.total > 1) ids.push("enquete_rebondissement");
  if (input.attempts >= 3) ids.push("enquete_obstine");
  if (input.allSlugs.length > 0 && input.allSlugs.every((slug) => input.solvedSlugs.includes(slug))) ids.push("enquete_toutes");
  return ids;
}
