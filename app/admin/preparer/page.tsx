import Link from "next/link";
import { ChevronLeft, ChevronRight, ClipboardCheck, Plus, Trophy } from "lucide-react";
import { listEvaluations } from "@/app/actions/evaluations";
import { listChallenges } from "@/app/actions/challenges";
import { listAssessments } from "@/app/actions/classInfo";
import { listAnnouncements } from "@/app/actions/announcements";
import { listVisios } from "@/app/actions/visio";
import { getClassHomeworkBoard } from "@/app/actions/followup";
import { ADMIN_PRIVATE, adminClassLabel, touchesAdminClass } from "@/lib/admin-class";
import { readAdminClass } from "@/lib/admin-class-server";
import { buildWeek, mondayOf, mondayPlan, shiftWeek, weekTitle } from "@/lib/admin-week";
import { WeekGrid } from "@/components/admin/WeekGrid";

export const dynamic = "force-dynamic";

const mondayLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const whenLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** « Préparer » : créer une évaluation ou un défi du lundi, voir ce qui manque, puis la semaine jour par jour. */
export default async function AdminPlanPage({ searchParams }: { searchParams: Promise<{ semaine?: string }> }) {
  const [{ semaine }, { selection, classes }, evaluations, challenges, assessments, announcements, visios, homework] = await Promise.all([
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
      evaluations: evaluations.filter((item) => item.kind === "evaluation"),
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

  const shownClasses = selection === ADMIN_PRIVATE ? [] : selection ? [selection] : classes;
  const plan = mondayPlan(shownClasses, challenges, now);
  const upcoming = evaluations
    .filter((item) => item.kind === "evaluation" && (item.status === "brouillon" || item.status === "programmee") && touchesAdminClass(selection, item.classes))
    .sort((a, b) => (a.scheduledAt ?? "9").localeCompare(b.scheduledAt ?? "9") || b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Préparer · {adminClassLabel(selection)}</p>
          <h1>Évaluations et défis du lundi</h1>
          <p>Ce qui est prévu, ce qui manque, et de quoi le créer.</p>
        </div>
      </header>

      <div className="admin-create">
        <Link href="/admin/evaluations?nouveau=1" className="admin-card">
          <span className="admin-create-icon">
            <ClipboardCheck size={22} aria-hidden />
          </span>
          <span>
            <b>Nouvelle évaluation</b>
            <span className="admin-muted">Sujets, barème, date d&apos;ouverture, durée</span>
          </span>
        </Link>
        <Link href="/admin/defis?nouveau=1" className="admin-card">
          <span className="admin-create-icon">
            <Trophy size={22} aria-hidden />
          </span>
          <span>
            <b>Nouveau défi du lundi</b>
            <span className="admin-muted">Ouvert le lundi à 7 h 30, pour une semaine</span>
          </span>
        </Link>
      </div>

      <section className="admin-card" aria-labelledby="plan-mondays">
        <h2 id="plan-mondays" className="admin-card-h">
          Défis des prochains lundis <small>une case vide = un défi à créer</small>
        </h2>
        {plan.rows.length ? (
          <div className="admin-mondays">
            <table className="admin-mgrid">
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr-only">Classe</span>
                  </th>
                  {plan.mondays.map((day) => (
                    <th key={day} scope="col" className={day === thisMonday ? "is-now" : ""}>
                      {day === thisMonday ? "Cette semaine · " : ""}
                      {mondayLabel.format(new Date(`${day}T12:00:00Z`))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plan.rows.map((row) => (
                  <tr key={row.classe}>
                    <th scope="row">{row.classe}</th>
                    {row.slots.map((slot) => (
                      <td key={slot.monday}>
                        {slot.challenge ? (
                          <Link href={`/admin/defis/${slot.challenge.id}`} className={`admin-slot ${slot.challenge.open ? "is-open" : "is-planned"}`}>
                            <b>{slot.challenge.title}</b>
                            {slot.challenge.open ? "En cours" : Date.parse(`${slot.monday}T12:00:00Z`) < now.getTime() ? "Terminé" : "Programmé · 7 h 30"}
                          </Link>
                        ) : (
                          <Link href={`/admin/defis?nouveau=1&jour=${slot.monday}&classe=${encodeURIComponent(row.classe)}`} className="admin-slot is-missing">
                            <Plus size={14} aria-hidden /> Créer le défi
                          </Link>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-muted">Pas de défi du lundi pour les cours particuliers.</p>
        )}
      </section>

      <section className="admin-card" aria-labelledby="plan-evaluations">
        <h2 id="plan-evaluations" className="admin-card-h">
          Évaluations à venir <small>brouillons et évaluations programmées</small>
        </h2>
        {upcoming.length ? (
          <ul className="admin-lines">
            {upcoming.map((item) => (
              <li key={item.id}>
                <span>
                  <Link href={`/admin/evaluations/${item.id}`}>
                    <b>{item.title}</b> · {item.classes.join(", ") || "aucune classe"}
                  </Link>
                  <br />
                  <small className="admin-subtle">
                    {item.durationMinutes ? `${item.durationMinutes} min` : "durée libre"}
                    {item.scheduledAt ? ` · ${whenLabel.format(new Date(item.scheduledAt))}` : ""}
                  </small>
                </span>
                <span>{item.status === "programmee" ? <span className="admin-pill is-accent">Programmée</span> : <span className="admin-pill">Brouillon</span>}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="admin-muted">
            Aucune évaluation en préparation. <Link href="/admin/evaluations?nouveau=1">Créer une évaluation</Link>
          </p>
        )}
      </section>

      <section className="admin-page-section" aria-labelledby="plan-week">
        <div className="admin-section-head">
          <h2 id="plan-week" className="admin-sec">
            {weekTitle(monday)}{" "}
            <small>{total ? `${total} élément${total > 1 ? "s" : ""} : évaluations, interros, défis, devoirs, annonces` : "rien de programmé"}</small>
          </h2>
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
        </div>
        <WeekGrid days={days} showWho={!selection} />
      </section>
    </div>
  );
}
