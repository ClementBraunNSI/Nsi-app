import type { Metadata } from "next";
import ColleagueMap from "@/components/ColleagueMap";

export const metadata: Metadata = {
  title: "Autres cours NSI",
  description:
    "Sites de cours tenus par d'autres enseignants de SNT et de NSI en France, en complément de La tanière du code.",
  alternates: {
    canonical: "https://www.clementbraun.info/autres-cours-nsi",
  },
};

export default function AutresCoursNsiPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      <header className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-8 sm:pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl">
          Autres cours NSI
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
          Autour de la tanière s'étend un territoire : la prairie de Seconde, la forêt de Première, les montagnes de
          Terminale et le rocher du bac. Chaque terrier mène au site d'un autre enseignant de SNT ou de NSI, en France.
        </p>
      </header>
      <ColleagueMap />
    </div>
  );
}
