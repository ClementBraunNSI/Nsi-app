import { notFound } from "next/navigation";
import { AnimatedFox } from "@/components/home/AnimatedFox";
import { SEASONS } from "@/lib/seasons";

/** Planche de vérification des décors saisonniers du renard de l'accueil, en développement seulement. */

const months = ["janv", "févr", "mars", "avr", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"];
const day = ([month, date]: readonly [number, number]) => `${date} ${months[month - 1]}`;
// Dans l'ordre de l'année scolaire, de la fin août à l'été.
const schoolOrder = ([month, date]: readonly [number, number]) => ((month + 4) % 12) * 100 + date;
const ordered = [...SEASONS].sort((a, b) => schoolOrder(a.start) - schoolOrder(b.start));

export default function SeasonsPreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[var(--fg)]">Le renard au fil de l'année</h1>
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {ordered.map((season) => (
          <figure key={season.id} className="rounded-3xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
            <AnimatedFox seasonal={season.id} className="h-auto w-full" />
            <figcaption className="text-center text-sm text-[var(--muted)]">
              <b className="text-[var(--fg)]">{season.label}</b> · {day(season.start)}
              {season.start.join() === season.end.join() ? "" : ` – ${day(season.end)}`}
            </figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
