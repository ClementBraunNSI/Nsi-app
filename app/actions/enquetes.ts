"use server";

import { revalidatePath } from "next/cache";
import { accuse, solvedCount, type Accusation } from "@/lib/enquetes/build";
import { ENQUETES, getEnquete } from "@/lib/enquetes/cases";
import { stagesOf, toPublic, type PublicEnquete } from "@/lib/enquetes/types";
import { getAuthContext } from "@/lib/auth";
import { createAdminClient } from "@/utils/supabase/admin";
import { ACHIEVEMENTS, globalAchievementsUnlockedBetween } from "@/lib/achievements";
import {
  earnedAchievementIds,
  enqueteAchievement,
  enqueteBadgeId,
  isEnqueteBadge,
  type EnqueteReward,
} from "@/lib/enquetes/rewards";

export type AccusationResult = Accusation & { rewards?: EnqueteReward[] };

const cleanAnswers = (found: unknown) => (Array.isArray(found) ? found.slice(0, 10).map((item) => String(item ?? "").slice(0, 80)) : []);
const cleanCount = (value: unknown) => Math.max(0, Math.min(999, Math.floor(Number(value) || 0)));

/**
 * Enregistre l'étape élucidée pour un élève connecté, puis le badge de l'enquête et les succès gagnés.
 * Les faits (étape, enquête terminée) viennent de la vérification du serveur ; indices et essais viennent du navigateur.
 */
async function recordSolvedStage(slug: string, stage: number, total: number, hintsUsed: number, attempts: number): Promise<EnqueteReward[]> {
  const auth = await getAuthContext();
  if (!auth.user || (auth.role !== "student" && auth.role !== "invite")) return [];
  const admin = createAdminClient();
  if (!admin) return [];
  const userId = auth.user.id;

  await admin
    .from("enquete_progress")
    .upsert({ user_id: userId, slug, stage, hints_used: hintsUsed, attempts }, { onConflict: "user_id,slug,stage", ignoreDuplicates: true });

  const [badgesRes, achievementsRes, progressCount] = await Promise.all([
    admin.from("badges").select("course_id, badge_name").eq("user_id", userId),
    admin.from("user_achievements").select("achievement_id").eq("user_id", userId),
    admin.from("user_progress").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);
  const priorBadges = badgesRes.data || [];
  const rewards: EnqueteReward[] = [];

  const enquete = getEnquete(slug);
  const finished = stage === total - 1;
  const badgeId = enqueteBadgeId(slug);
  let afterBadges = priorBadges;
  if (finished && enquete && !priorBadges.some((badge) => badge.course_id === badgeId)) {
    const { error } = await admin.from("badges").upsert(
      { user_id: userId, course_id: badgeId, badge_name: enquete.title, unlocked_at: new Date().toISOString() },
      { onConflict: "user_id, course_id" },
    );
    if (!error) {
      afterBadges = [...priorBadges, { course_id: badgeId, badge_name: enquete.title }];
      rewards.push({
        id: badgeId,
        title: enquete.title,
        description: `L'enquête « ${enquete.title} » est résolue jusqu'au bout.`,
        image: `/images/badges/${badgeId}.png`,
        kind: "badge",
      });
    }
  }

  const solvedSlugs = afterBadges.filter((badge) => isEnqueteBadge(badge.course_id)).map((badge) => badge.course_id.slice("enquete-".length));
  const owned = new Set((achievementsRes.data || []).map((row) => row.achievement_id));
  const wanted = earnedAchievementIds({
    stage,
    total,
    hintsUsed,
    attempts,
    solvedSlugs,
    allSlugs: ENQUETES.map((item) => item.slug),
  })
    .map((id) => enqueteAchievement(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item) && !owned.has(item!.id));

  // Un badge d'enquête compte aussi pour les succès « nombre de badges » du site.
  const exercises = progressCount.count || 0;
  const general = afterBadges.length > priorBadges.length
    ? globalAchievementsUnlockedBetween(
        { badgesCount: priorBadges.length, exercisesCount: exercises, badges: priorBadges, completedChapters: [] },
        { badgesCount: afterBadges.length, exercisesCount: exercises, badges: afterBadges, completedChapters: [] },
      ).filter((item) => !owned.has(item.id))
    : [];

  const toStore = [...wanted, ...general];
  if (toStore.length > 0) {
    await admin.from("user_achievements").upsert(
      toStore.map((item) => ({
        user_id: userId,
        achievement_id: item.id,
        title: item.title,
        description: item.description,
        unlocked_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,achievement_id", ignoreDuplicates: true },
    );
    for (const item of wanted) rewards.push({ id: item.id, title: item.title, description: item.description, image: item.image, kind: "succes" });
    for (const item of general) {
      if (ACHIEVEMENTS.some((known) => known.id === item.id)) {
        rewards.push({ id: item.id, title: item.title, description: item.description, image: "", kind: "succes" });
      }
    }
  }

  if (rewards.length > 0) {
    revalidatePath("/espace");
    revalidatePath("/admin");
  }
  return rewards;
}

/**
 * Vérifie l'accusation côté serveur : le nom du coupable n'est jamais envoyé avec l'enquête.
 * found : les coupables déjà trouvés aux étapes précédentes (enquête en plusieurs étapes).
 * stats : indices ouverts et fausses accusations à cette étape, pour les succès.
 */
export async function checkAccusation(
  slug: string,
  answer: string,
  found: string[] = [],
  stats: { hints?: number; attempts?: number } = {},
): Promise<AccusationResult> {
  const enquete = getEnquete(String(slug || ""));
  if (!enquete) return { correct: false };
  const previous = cleanAnswers(found);
  const result = accuse(enquete, previous, String(answer || "").slice(0, 80));
  if (!result.correct) return result;

  const stage = solvedCount(enquete, previous);
  const rewards = await recordSolvedStage(
    enquete.slug,
    stage,
    stagesOf(enquete).length,
    cleanCount(stats.hints),
    cleanCount(stats.attempts),
  ).catch(() => []);
  return rewards.length > 0 ? { ...result, rewards } : result;
}

/** Retrouve l'étape atteinte à partir des coupables déjà trouvés, gardés sur l'appareil de l'élève. */
export async function resumeEnquete(slug: string, found: string[]): Promise<{ view: PublicEnquete; solved: number } | null> {
  const enquete = getEnquete(String(slug || ""));
  if (!enquete) return null;
  const solved = solvedCount(enquete, cleanAnswers(found));
  return { view: toPublic(enquete, solved), solved };
}
