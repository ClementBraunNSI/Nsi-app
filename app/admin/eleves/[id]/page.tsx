import { notFound } from "next/navigation";
import { getStudentCard } from "@/app/actions/studentCard";
import { StudentCardView } from "@/components/admin/StudentCardView";

export const dynamic = "force-dynamic";

export default async function AdminStudentCardPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const [{ id }, { onglet }] = await Promise.all([params, searchParams]);
  const card = await getStudentCard(id);
  if (!card) notFound();
  return <StudentCardView key={card.student.id} card={card} initialTab={onglet} />;
}
