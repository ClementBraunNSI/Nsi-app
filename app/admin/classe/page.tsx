import Link from "next/link";
import { CalendarClock, Radio, Trophy } from "lucide-react";
import { getEvaluationBoard, listEvaluations } from "@/app/actions/evaluations";
import { listChallenges } from "@/app/actions/challenges";
import { LiveClass } from "@/components/admin/LiveClass";
import { adminClassLabel, touchesAdminClass } from "@/lib/admin-class";
import { readAdminClass } from "@/lib/admin-class-server";

export const dynamic = "force-dynamic";
// La copie ouverte depuis une tuile peut lancer la correction automatique (Python dans un processus séparé).
export const maxDuration = 60;

const when = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** « En classe » : le suivi en direct de l'évaluation ouverte pour la classe choisie, sinon ce qui est programmé. */
export default async function AdminLivePage({ searchParams }: { searchParams: Promise<{ evaluation?: string }> }) {
  const [{ evaluation: wanted }, { selection }, evaluations, challenges] = await Promise.all([searchParams, readAdminClass(), listEvaluations(), listChallenges()]);
  const mine = evaluations.filter((item) => touchesAdminClass(selection, item.classes));
  const open = mine.filter((item) => item.status === "ouverte");
  const chosen = open.find((item) => item.id === wanted) ?? open[0] ?? null;
  const board = chosen ? await getEvaluationBoard(chosen.id) : null;
  if (board && chosen) {
    return <LiveClass key={chosen.id} initialBoard={board} others={open.filter((item) => item.id !== chosen.id).map((item) => ({ id: item.id, title: item.title }))} />;
  }

  const now = Date.now();
  const planned = mine
    .filter((item) => item.status === "programmee" && item.scheduledAt)
    .sort((a, b) => String(a.scheduledAt).localeCompare(String(b.scheduledAt)));
  const liveChallenges = challenges.filter((item) => touchesAdminClass(selection, item.classes) && Date.parse(item.opensAt) <= now && now < Date.parse(item.closesAt));

  return (
    <div className="admin-page">
      <header className="admin-today-head">
        <p className="admin-kicker">En classe · {adminClassLabel(selection)}</p>
        <h1>Aucune évaluation ouverte</h1>
        <p className="admin-hero-lead">Dès qu&apos;une évaluation s&apos;ouvre, cette page montre une tuile par élève, les élèves verrouillés et leur code de déverrouillage.</p>
      </header>

      {planned.length ? (
        <section className="admin-card" aria-labelledby="live-planned">
          <h2 id="live-planned" className="admin-card-h">
            <CalendarClock size={17} aria-hidden /> Évaluations programmées <small>elles s&apos;ouvrent toutes seules à l&apos;heure dite</small>
          </h2>
          <ul className="admin-lines">
            {planned.map((item) => (
              <li key={item.id}>
                <span>
                  <Link href={`/admin/evaluations/${item.id}`}>
                    <b>{item.title}</b> · {item.classes.join(", ")}
                  </Link>
                </span>
                <span>{when.format(new Date(item.scheduledAt!))}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {liveChallenges.length ? (
        <section className="admin-card" aria-labelledby="live-challenges">
          <h2 id="live-challenges" className="admin-card-h">
            <Trophy size={17} aria-hidden /> Défi ouvert en ce moment
          </h2>
          <ul className="admin-lines">
            {liveChallenges.map((item) => (
              <li key={item.id}>
                <span>
                  <Link href={`/admin/defis/${item.id}`}>
                    <b>{item.title}</b> · {item.classes.join(", ")}
                  </Link>
                </span>
                <span>
                  {item.passed} réussi{item.passed > 1 ? "s" : ""} · {item.submitted} commencé{item.submitted > 1 ? "s" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="admin-head-actions">
        <Link href="/admin/evaluations?nouveau=1" className="admin-btn">
          <Radio size={15} aria-hidden /> Préparer une évaluation
        </Link>
        <Link href="/admin/evaluations" className="admin-btn is-quiet">
          Toutes les évaluations
        </Link>
      </div>
    </div>
  );
}
