import type { Metadata } from "next";
import ColleagueDirectory from "@/components/ColleagueDirectory";

export const metadata: Metadata = {
  title: "Autres cours NSI",
  description:
    "Sites de cours tenus par d’autres enseignants de SNT et de NSI en France, en complément de La tanière du code.",
  alternates: {
    canonical: "https://www.clementbraun.info/autres-cours-nsi",
  },
};

export default function AutresCoursNsiPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans selection:bg-[var(--accent-soft)] selection:text-[var(--accent)]">
      <header className="mx-auto max-w-5xl px-8 pb-8 pt-16">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--fg)]">
          Autres cours NSI
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--muted)]">
          Ces sites sont tenus par d’autres enseignants de SNT et de NSI, en France. Ils complètent
          La tanière du code. La liste suit l’ordre alphabétique des noms : niveaux, contenu, lien.
        </p>
      </header>
      <ColleagueDirectory />
    </div>
  );
}
