import type { AdminPracticeSession } from "@/app/actions/revisions";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** Entraînements chronométrés des élèves : qui, quand, sur quoi. Pas de résultat : ce n'est pas une évaluation. */
export function PracticeSessionsList({ sessions }: { sessions: AdminPracticeSession[] }) {
  if (sessions.length === 0) return <p className="admin-muted">Aucun entraînement ces 30 derniers jours.</p>;
  return (
    <ul className="adm-practice-list">
      {sessions.map((session) => (
        <li key={session.id}>
          <b>{session.studentName}</b>
          {session.classe ? <span className="adm-practice-classe">{session.classe}</span> : null}
          <span className="adm-practice-label">{session.label}</span>
          <small>
            {dateFormat.format(new Date(session.startedAt))} · {session.minutes} min · {session.exercises} exercices
          </small>
        </li>
      ))}
    </ul>
  );
}
