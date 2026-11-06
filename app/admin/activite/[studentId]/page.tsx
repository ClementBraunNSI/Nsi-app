import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { getStudentWorkDetail } from "@/app/actions/activity";
import { StudentWorkBlocks } from "@/components/admin/StudentWorkBlocks";

export default async function StudentActivityDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const detail = await getStudentWorkDetail(studentId);
  if (!detail) notFound();

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Activité"
        title={detail.fullName}
        description="Fiches terminées et exercices validés par cet élève."
        actions={
          <Link href="/admin/activite" className="text-sm font-semibold text-[var(--accent)]">
            Retour à l&apos;activité
          </Link>
        }
      />
      <StudentWorkBlocks detail={detail} />
    </div>
  );
}
