import Link from "next/link";
import { Plus } from "lucide-react";
import { WEEK_LABELS, type WeekDay, type WeekKind } from "@/lib/admin-week";

const ADD = [
  { label: "Évaluation", href: "/admin/evaluations?nouveau=1" },
  { label: "Interro ou DS", href: "/admin/devoirs#interros" },
  { label: "Défi", href: "/admin/defis?nouveau=1" },
  { label: "Devoir", href: "/admin/devoirs#devoirs-classe" },
  { label: "Annonce", href: "/admin/annonces#nouvelle" },
];
const LEGEND: WeekKind[] = ["evaluation", "interro", "ds", "defi", "devoir", "annonce", "visio"];

const hour = (time: string) => {
  const [hours, minutes] = time.split(":");
  return minutes === "00" ? `${Number(hours)} h` : `${Number(hours)} h ${minutes}`;
};

/** Semaine jour par jour : la légende, puis une colonne par jour avec ses éléments et le menu « ajouter ». */
export function WeekGrid({ days, showWho = false }: { days: WeekDay[]; showWho?: boolean }) {
  return (
    <>
        <div className="admin-week-legend">
          {LEGEND.map((kind) => (
            <span key={kind} className={`admin-ev is-${kind}`}>
              {WEEK_LABELS[kind]}
            </span>
          ))}
        </div>

        <div className="admin-weekgrid" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}>
          {days.map((day) => (
            <section key={day.day} className={`admin-day${day.today ? " is-today" : ""}`} aria-label={day.label}>
              <h2>
                {day.label}
                {day.today ? " · aujourd'hui" : ""}
              </h2>
              {day.items.map((item) => (
                <Link key={item.key} href={item.href} className={`admin-ev is-${item.kind}`} title={`${WEEK_LABELS[item.kind]} · ${item.who}`}>
                  <b>
                    {WEEK_LABELS[item.kind]}
                    {item.time ? ` · ${hour(item.time)}` : ""}
                  </b>
                  {item.title}
                  {showWho && item.who ? <small>{item.who}</small> : null}
                </Link>
              ))}
              <details className="admin-day-add">
                <summary>
                  <Plus size={13} aria-hidden /> ajouter
                </summary>
                {ADD.map((entry) => (
                  <Link key={entry.href} href={entry.href}>
                    {entry.label}
                  </Link>
                ))}
              </details>
            </section>
          ))}
        </div>
    </>
  );
}
