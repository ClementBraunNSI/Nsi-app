import Link from "next/link";
import { BookOpenCheck, Timer } from "lucide-react";
import type { RevisionItem, RevisionPlan } from "@/app/actions/revisions";
import { ASSESSMENT_LABELS } from "@/lib/class-info";
import { cleanLabel, difficultyLabel, shortDay, timeAgo } from "@/lib/revisions";

function dayPhrase(day: string, now: Date) {
  const today = now.toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const tomorrow = new Date(now.getTime() + 86_400_000).toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  if (day === today) return "aujourd'hui";
  if (day === tomorrow) return "demain";
  return `le ${shortDay(day)}`;
}

function reasonText(item: RevisionItem, now: Date) {
  if (item.reason === "rate") return item.when ? `Raté ${timeAgo(item.when, now)}` : "Raté";
  if (item.reason === "non-fait") return "Pas encore fait";
  return item.when ? `Réussi ${timeAgo(item.when, now)}` : "Déjà réussi";
}

/** Un bloc par interro ou DS des 14 prochains jours : « Interro le 12 nov. : 6 exercices à refaire ». */
export function RevisionBlocks({ plans, now }: { plans: RevisionPlan[]; now: string }) {
  if (plans.length === 0) return null;
  const date = new Date(now);
  return (
    <div className="revise-stack">
      {plans.map((plan) => {
        const { assessment, items } = plan;
        const kind = ASSESSMENT_LABELS[assessment.kind];
        const when = dayPhrase(assessment.day, date);
        const count = items.length;
        return (
          <section key={assessment.id} className="revise-block" aria-labelledby={`revise-${assessment.id}`}>
            <header className="revise-head">
              <BookOpenCheck size={20} aria-hidden />
              <div className="min-w-0">
                <h3 id={`revise-${assessment.id}`}>
                  {kind} {when}
                  {count > 0 ? ` : ${count} exercice${count > 1 ? "s" : ""} à refaire` : ""}
                </h3>
                <p>
                  {assessment.title ? `${assessment.title}. ` : ""}
                  {plan.sheets.length > 0
                    ? `${plan.sheets.length > 1 ? "Fiches" : "Fiche"} : ${plan.sheets.map((sheet) => sheet.courseTitle).join(", ")}.`
                    : assessment.chapters
                      ? `Chapitres annoncés : ${assessment.chapters}.`
                      : "Aucun chapitre annoncé."}
                </p>
              </div>
            </header>

            {count > 0 ? (
              <ol className="revise-list">
                {items.map((item) => (
                  <li key={item.id}>
                    <Link href={`/exercice/${encodeURIComponent(item.id)}`}>
                      <span className="revise-label">{cleanLabel(item.label)}</span>
                      <small>
                        {item.courseTitle} · {difficultyLabel(item.difficulty)}
                      </small>
                    </Link>
                    <span className={`revise-reason is-${item.reason}`}>{reasonText(item, date)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="revise-note">
                {plan.sheets.length === 0
                  ? "Aucune fiche d'exercices ne correspond aux chapitres annoncés : pas de liste à proposer pour cette date."
                  : "Ces fiches n'ont pas d'exercice vérifié par des tests."}
              </p>
            )}

            {plan.unmatched.length > 0 && plan.sheets.length > 0 ? (
              <p className="revise-note">
                Sans fiche correspondante : {plan.unmatched.map((part) => `« ${part} »`).join(", ")}.
              </p>
            ) : null}

            {count > 0 ? (
              <Link href={`/espace/entrainement?choix=${encodeURIComponent(`a:${assessment.id}`)}`} className="revise-practice">
                <Timer size={16} aria-hidden /> Sujet blanc chronométré sur ces fiches
              </Link>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
