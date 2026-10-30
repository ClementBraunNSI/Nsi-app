"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, FileDown, Loader2, Lock, Play, Square, Wand2 } from "lucide-react";
import {
  answersToGrade,
  deleteEvaluation,
  getEvaluationBoard,
  gradeEvaluationAnswer,
  setEvaluationStatus,
  updateEvaluation,
  type BoardRow,
  type EvaluationBoard,
} from "@/app/actions/evaluations";
import EvaluationForm from "./EvaluationForm";
import SubjectsEditor from "./SubjectsEditor";
import AttemptPanel from "./AttemptPanel";
import { STATUS_LABELS } from "./EvaluationsAdmin";

type Tab = "suivi" | "sujets" | "reglages";

const ROW_STATUS: Record<BoardRow["status"], string> = {
  pas_commencee: "Pas commencée",
  en_cours: "En cours",
  verrouillee: "Verrouillée",
  rendue: "Rendue",
};

const timeFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "short", timeZone: "Europe/Paris" });
// Sans signe de vie depuis plus longtemps : la page de l'élève est fermée ou l'ordinateur éteint.
const OFFLINE_AFTER = 35_000;

export default function EvaluationManager({ initialBoard, classes, initialTab }: { initialBoard: EvaluationBoard; classes: string[]; initialTab: Tab }) {
  const router = useRouter();
  const [board, setBoard] = useState(initialBoard);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [openAttempt, setOpenAttempt] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [grading, setGrading] = useState<{ done: number; total: number } | null>(null);
  const gradingRef = useRef(false);
  // Exercices déjà passés à la correction automatique pendant cette visite : pas de nouvel essai en boucle.
  const triedRef = useRef(new Set<string>());
  const { evaluation } = board;

  const refresh = useCallback(async () => {
    const next = await getEvaluationBoard(evaluation.id);
    if (next) setBoard(next);
  }, [evaluation.id]);

  // Suivi en direct pendant l'évaluation.
  useEffect(() => {
    if (tab !== "suivi") return;
    const timer = window.setInterval(refresh, evaluation.status === "ouverte" ? 5000 : 20000);
    return () => window.clearInterval(timer);
  }, [evaluation.status, refresh, tab]);

  const changeStatus = async (status: "brouillon" | "ouverte" | "fermee") => {
    if (status === "fermee" && !window.confirm("Fermer l'évaluation ? Les copies encore ouvertes seront rendues telles quelles.")) return;
    setBusy(true);
    setMessage(null);
    const result = await setEvaluationStatus(evaluation.id, status);
    setBusy(false);
    if (!result.ok) setMessage(result.error);
    await refresh();
  };

  // Correction automatique, un exercice à la fois (chaque appel lance les tests sur le serveur).
  const gradeAll = useCallback(async (manual = false) => {
    if (gradingRef.current) return;
    gradingRef.current = true;
    const work = (await answersToGrade(evaluation.id, manual)).filter((item) => manual || !triedRef.current.has(`${item.attemptId}:${item.exerciseId}`));
    work.forEach((item) => triedRef.current.add(`${item.attemptId}:${item.exerciseId}`));
    setGrading({ done: 0, total: work.length });
    let done = 0;
    for (const item of work) {
      await gradeEvaluationAnswer(item.attemptId, item.exerciseId);
      done += 1;
      setGrading({ done, total: work.length });
    }
    gradingRef.current = false;
    setGrading(null);
    await refresh();
  }, [evaluation.id, refresh]);

  const pendingGrades = board.rows.reduce((sum, row) => sum + row.toGrade, 0);
  // Les copies rendues se corrigent toutes seules quand ce tableau est ouvert.
  useEffect(() => {
    if (pendingGrades > 0 && !gradingRef.current) void gradeAll(false);
  }, [gradeAll, pendingGrades]);

  const counts = {
    total: board.rows.length,
    started: board.rows.filter((row) => row.status !== "pas_commencee").length,
    locked: board.rows.filter((row) => row.status === "verrouillee").length,
    submitted: board.rows.filter((row) => row.status === "rendue").length,
  };
  const serverNow = Date.parse(board.now);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/admin/evaluations" className="adm-eval-secondary"><ArrowLeft size={15} aria-hidden /> Évaluations</Link>
        <span className={`adm-eval-status is-${evaluation.status}`}>{STATUS_LABELS[evaluation.status]}</span>
      </div>
      <header className="adm-eval-head">
        <div className="min-w-0">
          <h1>{evaluation.title}</h1>
          <p>
            {evaluation.classes.join(", ") || "Aucune classe"} · {board.subjects.length} sujet{board.subjects.length > 1 ? "s" : ""} ·{" "}
            {evaluation.durationMinutes ? `${evaluation.durationMinutes} min par élève` : "sans limite de temps"}
          </p>
        </div>
        <div className="adm-eval-actions">
          {evaluation.status !== "ouverte" ? (
            <button type="button" className="adm-eval-primary" disabled={busy} onClick={() => changeStatus("ouverte")}>
              <Play size={15} aria-hidden /> {evaluation.status === "fermee" ? "Rouvrir" : "Ouvrir aux élèves"}
            </button>
          ) : (
            <button type="button" className="adm-eval-danger" disabled={busy} onClick={() => changeStatus("fermee")}>
              <Square size={15} aria-hidden /> Fermer et ramasser les copies
            </button>
          )}
          <a className="adm-eval-secondary" href={`/admin/evaluations/${evaluation.id}/export`}>
            <Download size={15} aria-hidden /> Toutes les copies (.zip)
          </a>
        </div>
      </header>
      {message ? <p className="adm-eval-error">{message}</p> : null}

      <nav className="adm-eval-tabs" aria-label="Sections de l'évaluation">
        {(["suivi", "sujets", "reglages"] as Tab[]).map((key) => (
          <button key={key} type="button" aria-pressed={tab === key} onClick={() => setTab(key)}>
            {key === "suivi" ? "Suivi" : key === "sujets" ? `Sujets (${board.subjects.length})` : "Réglages"}
          </button>
        ))}
      </nav>

      {tab === "suivi" ? (
        <section className="space-y-4">
          <div className="adm-eval-stats">
            <span><b>{counts.started}</b> / {counts.total} commencées</span>
            <span className={counts.locked ? "is-alert" : ""}><Lock size={14} aria-hidden /> <b>{counts.locked}</b> verrouillée{counts.locked > 1 ? "s" : ""}</span>
            <span><b>{counts.submitted}</b> rendue{counts.submitted > 1 ? "s" : ""}</span>
            {grading ? (
              <span><Loader2 size={14} className="animate-spin" aria-hidden /> Correction automatique {grading.done} / {grading.total}</span>
            ) : (
              <button type="button" className="adm-eval-link" onClick={() => gradeAll(true)}><Wand2 size={14} aria-hidden /> Recorriger toutes les copies rendues</button>
            )}
          </div>
          {board.rows.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun élève dans {evaluation.classes.join(", ") || "les classes choisies"}.</p>
          ) : (
            <div className="adm-eval-table-wrap">
              <table className="adm-eval-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>État</th>
                    <th>Code de déverrouillage</th>
                    <th>Sujet</th>
                    <th>Exercices écrits</th>
                    <th>Réussis</th>
                    <th>Incidents</th>
                    <th>Vu</th>
                    <th><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {board.rows.map((row) => {
                    const offline = row.status === "en_cours" || row.status === "verrouillee"
                      ? !row.lastSeenAt || serverNow - Date.parse(row.lastSeenAt) > OFFLINE_AFTER
                      : false;
                    return (
                      <tr key={row.studentId} className={row.status === "verrouillee" ? "is-locked" : ""}>
                        <td>
                          <b>{row.name}</b>
                          <small>{row.classe}</small>
                        </td>
                        <td>
                          <span className={`adm-eval-row-status is-${row.status}`}>{ROW_STATUS[row.status]}</span>
                          {offline ? <small className="adm-eval-offline">hors ligne</small> : null}
                        </td>
                        <td className="adm-eval-code">{row.unlockCode ?? "—"}{row.failedUnlocks ? <small>{row.failedUnlocks} essai{row.failedUnlocks > 1 ? "s" : ""} faux</small> : null}</td>
                        <td>{row.subjectLabel ?? "—"}</td>
                        <td>{row.attemptId ? `${row.exercisesWritten} / ${row.exercisesTotal}` : "—"}</td>
                        <td>{row.graded ? `${row.passed} / ${row.exercisesTotal}` : row.toGrade ? "à corriger" : "—"}</td>
                        <td>
                          {row.incidents ? (
                            <span className={row.openIncidents ? "adm-eval-alert" : ""}>{row.incidents}{row.openIncidents ? ` (${row.openIncidents} en attente)` : ""}</span>
                          ) : "—"}
                        </td>
                        <td>{row.lastSeenAt ? timeFormat.format(new Date(row.lastSeenAt)) : "—"}</td>
                        <td className="adm-eval-row-actions">
                          {row.attemptId ? (
                            <>
                              <button type="button" className="adm-eval-link" onClick={() => setOpenAttempt(row.attemptId)}>Voir</button>
                              <a className="adm-eval-link" href={`/admin/evaluations/${evaluation.id}/export?copie=${row.attemptId}`} title="Copie en fichier texte">
                                <FileDown size={14} aria-hidden /> .txt
                              </a>
                            </>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {tab === "sujets" ? <SubjectsEditor board={board} onChange={refresh} /> : null}

      {tab === "reglages" ? (
        <section className="adm-eval-panel space-y-6">
          <EvaluationForm
            classes={classes}
            initial={{ title: evaluation.title, description: evaluation.description, classes: evaluation.classes, durationMinutes: evaluation.durationMinutes }}
            busy={busy}
            submitLabel="Enregistrer"
            onSubmit={async (values) => {
              setBusy(true);
              const result = await updateEvaluation(evaluation.id, values);
              setBusy(false);
              setMessage(result.ok ? "Réglages enregistrés." : result.error);
              await refresh();
            }}
          />
          <div className="adm-eval-actions">
            {evaluation.status !== "brouillon" ? (
              <button type="button" className="adm-eval-secondary" disabled={busy} onClick={() => changeStatus("brouillon")}>Repasser en brouillon (invisible des élèves)</button>
            ) : null}
            <button
              type="button"
              className="adm-eval-danger"
              disabled={busy}
              onClick={async () => {
                if (!window.confirm("Supprimer l'évaluation, ses sujets et toutes les copies ? C'est définitif.")) return;
                const result = await deleteEvaluation(evaluation.id);
                if (result.ok) router.push("/admin/evaluations");
                else setMessage(result.error);
              }}
            >
              Supprimer l&apos;évaluation
            </button>
          </div>
        </section>
      ) : null}

      {openAttempt ? (
        <AttemptPanel
          attemptId={openAttempt}
          evaluationId={evaluation.id}
          onClose={() => setOpenAttempt(null)}
          onChange={refresh}
        />
      ) : null}
    </div>
  );
}
