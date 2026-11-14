"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockOpen, Square, Table2 } from "lucide-react";
import { getEvaluationBoard, setEvaluationStatus, unlockAttemptRemotely, type BoardRow, type EvaluationBoard } from "@/app/actions/evaluations";
import AttemptPanel from "@/components/admin/evaluations/AttemptPanel";
import { useAdminClass } from "@/components/admin/AdminClassContext";
import { inAdminClass } from "@/lib/admin-class";
import { INCIDENT_LABELS } from "@/lib/evaluation-guard";

// Sans signe de vie depuis plus longtemps : la page de l'élève est fermée ou l'ordinateur éteint.
const OFFLINE_AFTER = 35_000;
const REFRESH_MS = 5000;

type Alert = { key: string; row: BoardRow; text: string; unlock: boolean };

function tileState(row: BoardRow, offline: boolean) {
  if (row.status === "pas_commencee") return "Pas commencé";
  if (row.status === "rendue") return "Copie rendue";
  if (row.status === "verrouillee") return "Verrouillé";
  if (offline) return "Hors ligne";
  return `${row.exercisesWritten} exercice${row.exercisesWritten > 1 ? "s" : ""} écrit${row.exercisesWritten > 1 ? "s" : ""}`;
}

/**
 * Suivi en direct d'une évaluation ouverte : une tuile par élève, les élèves verrouillés en rouge avec leur code,
 * les alertes à côté. Un clic sur une tuile ouvre la copie en cours d'écriture. Se recharge toutes les 5 secondes.
 */
export function LiveClass({ initialBoard, others = [] }: { initialBoard: EvaluationBoard; others?: { id: string; title: string }[] }) {
  const { selection, label } = useAdminClass();
  const router = useRouter();
  const [board, setBoard] = useState(initialBoard);
  const [openAttempt, setOpenAttempt] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { evaluation } = board;

  const refresh = useCallback(async () => {
    const next = await getEvaluationBoard(evaluation.id);
    if (next) setBoard(next);
  }, [evaluation.id]);

  useEffect(() => {
    const timer = window.setInterval(refresh, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const serverNow = Date.parse(board.now);
  const rows = useMemo(() => board.rows.filter((row) => inAdminClass(selection, { classe: row.classe })), [board.rows, selection]);
  const offlineOf = (row: BoardRow) =>
    (row.status === "en_cours" || row.status === "verrouillee") && (!row.lastSeenAt || serverNow - Date.parse(row.lastSeenAt) > OFFLINE_AFTER);

  const counts = {
    working: rows.filter((row) => row.status === "en_cours").length,
    locked: rows.filter((row) => row.status === "verrouillee").length,
    submitted: rows.filter((row) => row.status === "rendue").length,
    waiting: rows.filter((row) => row.status === "pas_commencee").length,
  };

  const alerts: Alert[] = [
    ...rows
      .filter((row) => row.status === "verrouillee")
      .map((row) => ({ key: `l-${row.studentId}`, row, text: row.lockReason ? INCIDENT_LABELS[row.lockReason] : "page verrouillée", unlock: true })),
    ...rows
      .filter((row) => row.status === "en_cours" && offlineOf(row))
      .map((row) => ({ key: `o-${row.studentId}`, row, text: "hors ligne : page fermée ou ordinateur éteint", unlock: false })),
    ...rows
      .filter((row) => row.status === "en_cours" && !offlineOf(row) && row.incidents > 0)
      .map((row) => ({ key: `i-${row.studentId}`, row, text: `${row.incidents} incident${row.incidents > 1 ? "s" : ""} depuis le début`, unlock: false })),
  ];

  const unlock = async (row: BoardRow) => {
    if (!row.attemptId) return;
    setBusy(row.attemptId);
    setMessage(null);
    const result = await unlockAttemptRemotely(row.attemptId);
    setBusy(null);
    if (!result.ok) setMessage(result.error);
    await refresh();
  };

  const close = async () => {
    if (!window.confirm("Fermer l'évaluation ? Les copies encore ouvertes seront rendues telles quelles, et chaque élève verra sa note dès qu'elle sera validée.")) return;
    setBusy("close");
    const result = await setEvaluationStatus(evaluation.id, "fermee");
    setBusy(null);
    if (!result.ok) {
      setMessage(result.error);
      await refresh();
      return;
    }
    // Interrogation terminée : le tableau de l'évaluation s'ouvre sur son bilan, et corrige les copies au passage.
    router.push(`/admin/evaluations/${evaluation.id}?bilan=1`);
  };

  const closed = evaluation.status !== "ouverte";

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div className="admin-today-head">
          <p className="admin-kicker">En classe · {label}</p>
          <h1>
            {evaluation.title} <span className={`admin-pill ${closed ? "" : "is-ok"}`}>{closed ? "fermée" : "ouverte"}</span>
          </h1>
          <p className="admin-hero-lead">
            {evaluation.classes.join(", ") || "Aucune classe"} · {evaluation.durationMinutes ? `${evaluation.durationMinutes} min par élève` : "sans limite de temps"} · mise à jour
            toutes les 5 secondes
          </p>
        </div>
        <div className="admin-head-actions">
          <Link href={`/admin/evaluations/${evaluation.id}`} className="admin-btn is-quiet">
            <Table2 size={15} aria-hidden /> Tableau complet
          </Link>
          {closed ? (
            <Link href="/admin/a-corriger?type=notes" className="admin-btn is-dark">
              Valider les notes
            </Link>
          ) : (
            <button type="button" className="admin-btn is-danger" disabled={busy !== null} onClick={close}>
              <Square size={15} aria-hidden /> Fermer et ramasser
            </button>
          )}
        </div>
      </header>

      {others.length ? (
        <p className="admin-muted">
          Autre{others.length > 1 ? "s" : ""} évaluation{others.length > 1 ? "s" : ""} ouverte{others.length > 1 ? "s" : ""} :{" "}
          {others.map((other, index) => (
            <span key={other.id}>
              {index ? ", " : ""}
              <Link href={`/admin/classe?evaluation=${other.id}`}>{other.title}</Link>
            </span>
          ))}
        </p>
      ) : null}
      {message ? <p className="adm-eval-error">{message}</p> : null}

      <div className="admin-count-grid">
        <div className="admin-card admin-count">
          <span className="admin-count-k">Au travail</span>
          <span className="admin-big">{counts.working}</span>
        </div>
        <div className={`admin-card admin-count${counts.locked ? " is-hot" : ""}`}>
          <span className="admin-count-k">Verrouillés</span>
          <span className="admin-big">{counts.locked}</span>
        </div>
        <div className="admin-card admin-count">
          <span className="admin-count-k">Copies rendues</span>
          <span className="admin-big">{counts.submitted}</span>
        </div>
        <div className="admin-card admin-count">
          <span className="admin-count-k">Pas commencé</span>
          <span className="admin-big">{counts.waiting}</span>
        </div>
      </div>

      <div className="admin-duo">
        <section aria-labelledby="live-seats">
          <h2 id="live-seats" className="admin-sec">
            La classe <small>un clic sur une tuile ouvre la copie en cours d&apos;écriture</small>
          </h2>
          {rows.length ? (
            <div className="admin-seats">
              {rows.map((row) => {
                const offline = offlineOf(row);
                const tone = row.status === "verrouillee" ? "is-lock" : row.status === "rendue" ? "is-done" : row.status === "pas_commencee" ? "is-off" : offline ? "is-away" : "";
                return (
                  <button
                    key={row.studentId}
                    type="button"
                    className={`admin-seat ${tone}`}
                    disabled={!row.attemptId}
                    onClick={() => row.attemptId && setOpenAttempt(row.attemptId)}
                    aria-label={`${row.name} : ${tileState(row, offline)}`}
                  >
                    <b>{row.name}</b>
                    <span>
                      {tileState(row, offline)}
                      {row.status === "verrouillee" && row.unlockCode ? (
                        <>
                          {" · "}
                          <code>{row.unlockCode}</code>
                        </>
                      ) : null}
                    </span>
                    <span className="admin-seat-dots" aria-hidden>
                      {Array.from({ length: row.exercisesTotal || 0 }, (_, index) => (
                        <i key={index} className={index < row.exercisesWritten ? "is-on" : ""} />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="admin-muted">Aucun élève de {label.toLowerCase()} ne passe cette évaluation.</p>
          )}
        </section>

        <section className="admin-card" aria-labelledby="live-alerts">
          <h2 id="live-alerts" className="admin-card-h">
            Alertes <small>élèves verrouillés d&apos;abord</small>
          </h2>
          {alerts.length ? (
            <ul className="admin-lines is-wrap">
              {alerts.map((alert) => (
                <li key={alert.key}>
                  <span>
                    <b>{alert.row.name}</b> · {alert.text}
                    {alert.unlock && alert.row.unlockCode ? (
                      <>
                        {" · code "}
                        <b className="adm-eval-code">{alert.row.unlockCode}</b>
                      </>
                    ) : null}
                  </span>
                  <span>
                    {alert.unlock ? (
                      <button type="button" className="admin-btn is-dark is-small" disabled={busy !== null} onClick={() => unlock(alert.row)}>
                        <LockOpen size={14} aria-hidden /> Déverrouiller
                      </button>
                    ) : (
                      <button type="button" className="admin-mini" onClick={() => alert.row.attemptId && setOpenAttempt(alert.row.attemptId)}>
                        Voir
                      </button>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="admin-muted">Aucune alerte : personne n&apos;est verrouillé ni hors ligne.</span>
          )}
        </section>
      </div>

      {openAttempt ? (
        <AttemptPanel
          attemptId={openAttempt}
          evaluationId={evaluation.id}
          onClose={() => setOpenAttempt(null)}
          onChange={refresh}
          order={rows.filter((row) => row.attemptId).map((row) => row.attemptId!)}
          onNavigate={setOpenAttempt}
        />
      ) : null}
    </div>
  );
}
