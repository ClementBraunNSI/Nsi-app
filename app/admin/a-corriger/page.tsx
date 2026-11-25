import { getReviewQueue } from "@/app/actions/reviewQueue";
import { ReviewQueue } from "@/components/admin/ReviewQueue";

export const dynamic = "force-dynamic";
// La correction automatique d'une copie ouverte lance Python dans un processus séparé.
export const maxDuration = 60;

/** « À corriger » : seulement les notes d'évaluation à valider. Réponses écrites, messages et bugs ont leur page. */
export default async function AdminReviewQueuePage() {
  const queue = await getReviewQueue();
  if (!queue) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <ReviewQueue initial={queue} only="note" />;
}
