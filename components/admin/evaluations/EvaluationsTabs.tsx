import Link from "next/link";

/** Onglets de la rubrique Évaluations : les interrogations pratiques, puis les corrections de DS. */
export function EvaluationsTabs({ current }: { current: "evaluations" | "ds" }) {
  return (
    <nav className="admin-tabs" aria-label="Rubriques des évaluations">
      <Link href="/admin/evaluations" className={current === "evaluations" ? "is-on" : ""} aria-current={current === "evaluations" ? "page" : undefined}>
        Interrogations pratiques
      </Link>
      <Link href="/admin/evaluations/ds" className={current === "ds" ? "is-on" : ""} aria-current={current === "ds" ? "page" : undefined}>
        Corrections de DS
      </Link>
    </nav>
  );
}
