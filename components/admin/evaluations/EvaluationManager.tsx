"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, Download, Eye, FileDown, Loader2, Lock, Play, ShieldCheck, Square, Wand2 } from "lucide-react";
import {
  answersToGrade,
  deleteEvaluation,
  getEvaluationBoard,
  gradeEvaluationAnswers,
  setEvaluationStatus,
  updateEvaluation,
  type BoardRow,
  type EvaluationBoard,
  type EvaluationStatus,
} from "@/app/actions/evaluations";
import { INCIDENT_LABELS } from "@/lib/evaluation-guard";
import { PageHeader } from "@/components/ui";
import EvaluationForm from "./EvaluationForm";
import SubjectsEditor from "./SubjectsEditor";
import AttemptPanel from "./AttemptPanel";
import { scheduleLabel, STATUS_LABELS } from "./EvaluationsAdmin";

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
    // Programmée : rafraîchir souvent, le tableau ouvre aussi l'évaluation à l'heure prévue.
    const timer = window.setInterval(refresh, evaluation.status === "ouverte" ? 5000 : evaluation.status === "programmee" ? 15000 : 20000);
    return () => window.clearInterval(timer);
  }, [evaluation.status, refresh, tab]);

  const changeStatus = async (status: EvaluationStatus) => {
    if (status === "fermee" && !window.confirm("Fermer l'évaluation ? Les copies encore ouvertes seront rendues telles quelles, et chaque élève verra sa note dès qu'elle sera validée.")) return;
    setBusy(true);
    setMessage(null);
    const result = await setEvaluationStatus(evaluation.id, status);
    setBusy(false);
    if (!result.ok) setMessage(result.error);
    await refresh();
  };

  // Correction automatique par lots de 8 exercices, corrigés quatre à la fois sur le serveur.
  const gradeAll = useCallback(async (manual = false) => {
    if (gradingRef.current) return;
    gradingRef.current = true;
    const work = (await answersToGrade(evaluation.id, manual)).filter((item) => manual || !triedRef.current.has(`${item.attemptId}:${item.exerciseId}`));
    work.forEach((item) => triedRef.current.add(`${item.attemptId}:${item.exerciseId}`));
    setGrading({ done: 0, total: work.length });
    let done = 0;
    for (let start = 0; start < work.length; start += 8) {
      const batch = work.slice(start, start + 8);
      await gradeEvaluationAnswers(batch);
      done += batch.length;
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
  // Copies rendues dans l'ordre du tableau : la relecture passe de l'une à l'autre.
  const handedIn = board.rows.filter((row) => row.status === "rendue" && row.attemptId);
  const reviewOrder = handedIn.map((row) => row.attemptId!);
  const toValidate = handedIn.filter((row) => row.grade && !row.grade.final);
  const ready = board.subjects.length > 0 && evaluation.classes.length > 0;
  const notReadyReason = board.subjects.length === 0 ? "Ajouter d'abord un sujet" : evaluation.classes.length === 0 ? "Choisir d'abord une classe" : undefined;
  const plannedLater = Boolean(evaluation.scheduledAt && Date.parse(evaluation.scheduledAt) > serverNow);

  return (
    <div className="space-y-6">
      <Link href="/admin/evaluations" className="adm-eval-back"><ArrowLeft size={15} aria-hidden /> Toutes les évaluations</Link>
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2">
            Évaluation
            <span className={`adm-eval-status is-${evaluation.status}`}>{STATUS_LABELS[evaluation.status]}</span>
          </span>
        }
        title={evaluation.title}
        description={`${evaluation.classes.join(", ") || "Aucune classe"} · ${board.subjects.length} sujet${board.subjects.length > 1 ? "s" : ""} · ${
          evaluation.durationMinutes ? `${evaluation.durationMinutes} min par élève` : "sans limite de temps"
        }${evaluation.scheduledAt ? ` · passage le ${scheduleLabel(evaluation.scheduledAt)}` : ""}`}
        actions={
          <div className="adm-eval-actions">
            {evaluation.status === "brouillon" && plannedLater ? (
              <button type="button" className="adm-eval-primary" disabled={busy || !ready} title={notReadyReason} onClick={() => changeStatus("programmee")}>
                <CalendarClock size={15} aria-hidden /> Programmer : {scheduleLabel(evaluation.scheduledAt!)}
              </button>
            ) : null}
            {evaluation.status === "programmee" ? (
              <button type="button" className="adm-eval-secondary" disabled={busy} onClick={() => changeStatus("brouillon")}>
                Annuler la programmation
              </button>
            ) : null}
            {evaluation.status !== "ouverte" ? (
              <button
                type="button"
                className={evaluation.status === "brouillon" && plannedLater ? "adm-eval-secondary" : "adm-eval-primary"}
                disabled={busy || !ready}
                title={notReadyReason}
                onClick={() => changeStatus("ouverte")}
              >
                <Play size={15} aria-hidden /> {evaluation.status === "fermee" ? "Rouvrir" : plannedLater || evaluation.status === "programmee" ? "Ouvrir maintenant" : "Ouvrir aux élèves"}
              </button>
            ) : (
              <button type="button" className="adm-eval-danger" disabled={busy} onClick={() => changeStatus("fermee")}>
                <Square size={15} aria-hidden /> Fermer et ramasser les copies
              </button>
            )}
            {board.rows.some((row) => row.attemptId) ? (
              <a className="adm-eval-secondary" href={`/admin/evaluations/${evaluation.id}/export`}>
                <Download size={15} aria-hidden /> Toutes les copies (.zip)
              </a>
            ) : null}
            {board.rows.some((row) => row.status === "rendue") ? (
              <a className="adm-eval-secondary" href={`/admin/evaluations/${evaluation.id}/export?format=notes`}>
                <FileDown size={15} aria-hidden /> Notes (.csv)
              </a>
            ) : null}
          </div>
        }
      />
      {board.subjects.length === 0 && evaluation.status === "brouillon" ? (
        <p className="adm-eval-warning">
          Prochaine étape : ajouter au moins un sujet dans l&apos;onglet « Sujets », puis {plannedLater ? "programmer" : "ouvrir"} l&apos;évaluation.
        </p>
      ) : null}
      {board.subjects.length > 0 && evaluation.status === "brouillon" && plannedLater ? (
        <p className="adm-eval-warning">
          Encore en brouillon : cliquer sur « Programmer » pour que l&apos;évaluation s&apos;ouvre toute seule le {scheduleLabel(evaluation.scheduledAt!)}.
        </p>
      ) : null}
      {evaluation.status === "programmee" && evaluation.scheduledAt ? (
        <p className="adm-eval-info">
          <CalendarClock size={15} aria-hidden /> Programmée : invisible des élèves jusqu&apos;au {scheduleLabel(evaluation.scheduledAt)}, puis ouverte automatiquement aux classes{" "}
          {evaluation.classes.join(", ")}.
        </p>
      ) : null}
      {message ? <p className="adm-eval-error">{message}</p> : null}

      <div className="adm-eval-card">
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
            {handedIn.length > 0 ? (
              <span className={toValidate.length ? "is-alert" : ""}>
                <ShieldCheck size={14} aria-hidden /> <b>{toValidate.length}</b> note{toValidate.length > 1 ? "s" : ""} à valider
              </span>
            ) : null}
            {toValidate.length > 0 ? (
              <button type="button" className="adm-eval-link" onClick={() => setOpenAttempt(toValidate[0].attemptId)}>
                <ShieldCheck size={14} aria-hidden /> Relire les copies une à une
              </button>
            ) : null}
            {grading ? (
              <span><Loader2 size={14} className="animate-spin" aria-hidden /> Correction automatique {grading.done} / {grading.total}</span>
            ) : (
              <button type="button" className="adm-eval-link" onClick={() => gradeAll(true)}><Wand2 size={14} aria-hidden /> Recorriger toutes les copies rendues</button>
            )}
          </div>
          {handedIn.length > 0 ? (
            <p className="adm-eval-info">
              <Eye size={15} aria-hidden />
              {evaluation.status === "fermee"
                ? `Évaluation fermée : chaque élève dont la note est validée voit sa note, ses points par exercice, sa place par rapport à la moyenne, la médiane et les quartiles de sa classe (à partir de 5 copies validées), et des exercices pour s'entraîner.${
                    toValidate.length ? ` ${toValidate.length} note${toValidate.length > 1 ? "s" : ""} pas encore validée${toValidate.length > 1 ? "s" : ""} : invisible${toValidate.length > 1 ? "s" : ""} pour l'instant.` : ""
                  }`
                : "Les notes validées seront visibles par les élèves à la fermeture de l'évaluation, avec la moyenne, la médiane et les quartiles de leur classe."}
            </p>
          ) : null}
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
                    <th>Note</th>
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
                          {row.lockReason ? <small className="adm-eval-reason">{INCIDENT_LABELS[row.lockReason]}</small> : null}
                          {offline ? <small className="adm-eval-offline">hors ligne</small> : null}
                        </td>
                        <td className="adm-eval-code">{row.unlockCode ?? "—"}{row.failedUnlocks ? <small>{row.failedUnlocks} essai{row.failedUnlocks > 1 ? "s" : ""} faux</small> : null}</td>
                        <td>{row.subjectLabel ?? "—"}</td>
                        <td>{row.attemptId ? `${row.exercisesWritten} / ${row.exercisesTotal}` : "—"}</td>
                        <td>{row.graded ? `${row.passed} / ${row.exercisesTotal}` : row.toGrade ? "à corriger" : "—"}</td>
                        <td>
                          {row.grade && row.status === "rendue" ? (
                            <span className={`adm-grade-cell ${row.grade.final ? "is-final" : ""}`}>
                              <b>{String(row.grade.total).replace(".", ",")}</b>
                              {row.grade.pendingReview ? <small className="is-review">{row.grade.pendingReview} à vérifier</small> : null}
                              {!row.grade.pendingReview && row.grade.ungraded ? <small>en correction</small> : null}
                              {!row.grade.pendingReview && !row.grade.ungraded && !row.grade.final ? <small>à valider</small> : null}
                              {row.grade.final ? <small className="is-final">validée</small> : null}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
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
            initial={{
              title: evaluation.title,
              description: evaluation.description,
              classes: evaluation.classes,
              durationMinutes: evaluation.durationMinutes,
              scheduledAt: evaluation.scheduledAt,
            }}
            requireSchedule={evaluation.status === "programmee"}
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

      </div>

      {openAttempt ? (
        <AttemptPanel
          attemptId={openAttempt}
          evaluationId={evaluation.id}
          onClose={() => setOpenAttempt(null)}
          onChange={refresh}
          order={reviewOrder}
          onNavigate={setOpenAttempt}
        />
      ) : null}
    </div>
  );
}
