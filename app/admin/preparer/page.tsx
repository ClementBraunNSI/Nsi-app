import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { listEvaluations } from "@/app/actions/evaluations";
import { listChallenges } from "@/app/actions/challenges";
import { listAssessments } from "@/app/actions/classInfo";
import { listAnnouncements } from "@/app/actions/announcements";
import { listVisios } from "@/app/actions/visio";
import { getClassHomeworkBoard } from "@/app/actions/followup";
import { adminClassLabel } from "@/lib/admin-class";
import { readAdminClass } from "@/lib/admin-class-server";
import { buildWeek, mondayOf, shiftWeek, weekTitle } from "@/lib/admin-week";
import { WeekGrid } from "@/components/admin/WeekGrid";

export const dynamic = "force-dynamic";

/** « Préparer » : la semaine de la classe choisie, jour par jour, avec les liens pour ajouter un élément. */
export default async function AdminPlanPage({ searchParams }: { searchParams: Promise<{ semaine?: string }> }) {
  const [{ semaine }, { selection }, evaluations, challenges, assessments, announcements, visios, homework] = await Promise.all([
    searchParams,
    readAdminClass(),
    listEvaluations(),
    listChallenges(),
    listAssessments(),
    listAnnouncements(),
    listVisios(),
    getClassHomeworkBoard(),
  ]);
  const now = new Date();
  const monday = mondayOf(semaine, now);
  const thisMonday = mondayOf(undefined, now);
  const days = buildWeek(
    {
      evaluations,
      challenges,
      assessments: assessments.map((item) => ({ ...item, classes: item.classes ?? [] })),
      homework: homework?.homework ?? [],
      announcements,
      visios,
    },
    monday,
    selection,
    now,
  );
  const total = days.reduce((sum, day) => sum + day.items.length, 0);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="admin-today-head">
          <p className="admin-kicker">Préparer · {adminClassLabel(selection)}</p>
          <h1>{weekTitle(monday)}</h1>
          <p className="admin-hero-lead">
            {total ? `${total} élément${total > 1 ? "s" : ""} cette semaine.` : "Rien de programmé cette semaine."} Un clic sur un élément ouvre sa page.
          </p>
        </div>
        <div className="admin-head-actions">
          <Link href={`/admin/preparer?semaine=${shiftWeek(monday, -1)}`} className="admin-btn is-quiet" aria-label="Semaine précédente">
            <ChevronLeft size={15} aria-hidden />
          </Link>
          {monday !== thisMonday ? (
            <Link href="/admin/preparer" className="admin-btn is-quiet">
              Cette semaine
            </Link>
          ) : null}
          <Link href={`/admin/preparer?semaine=${shiftWeek(monday, 1)}`} className="admin-btn is-quiet">
            Semaine suivante <ChevronRight size={15} aria-hidden />
          </Link>
        </div>
      </header>

      <WeekGrid days={days} showWho={!selection} />
    </div>
  );
}
