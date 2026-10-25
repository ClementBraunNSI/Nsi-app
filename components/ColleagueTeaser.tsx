import Link from "next/link";

export default function ColleagueTeaser() {
  return (
    <section className="relative z-10 border-t border-[var(--border)] py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-5 py-6 md:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">Sites de collègues</h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">
            D'autres enseignants de SNT et de NSI publient leurs sites de cours en France.
          </p>
          <p className="mt-2 text-base leading-relaxed text-[var(--muted)]">
            Ces sites complètent La tanière. Ils sont utiles aux élèves, aux professeurs et aux inspecteurs.
          </p>
          <Link
            href="/autres-cours-nsi"
            className="mt-4 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
          >
            Voir les sites des collègues
          </Link>
        </div>
      </div>
    </section>
  );
}
