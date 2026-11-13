import { getReviewQueue } from "@/app/actions/reviewQueue";
import { ReviewQueue } from "@/components/admin/ReviewQueue";

export const dynamic = "force-dynamic";
// La correction automatique d'une copie ouverte lance Python dans un processus séparé.
export const maxDuration = 60;

export default async function AdminReviewQueuePage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const [{ type }, queue] = await Promise.all([searchParams, getReviewQueue()]);
  if (!queue) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <ReviewQueue initial={queue} initialType={type ?? ""} />;
}
