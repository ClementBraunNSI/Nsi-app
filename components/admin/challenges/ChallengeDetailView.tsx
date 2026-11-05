"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, LockOpen, Trash2, X } from "lucide-react";
import {
  deleteChallenge,
  getChallengeIncidents,
  unlockChallengeRemotely,
  type ChallengeDetail,
  type ChallengeIncident,
} from "@/app/actions/challenges";
import { INCIDENT_LABELS } from "@/lib/evaluation-guard";
import { PageHeader } from "@/components/ui";
import ChallengeEditor from "./ChallengeEditor";
import { challengeState } from "./ChallengesAdmin";

const dayFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Paris" });
const timeFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const secondFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "medium", timeZone: "Europe/Paris" });
// Défi ouvert : le tableau se met à jour (verrouillages, codes, réussites).
const REFRESH = 5000;

type Row = ChallengeDetail["rows"][number];

/** État de surveillance d'un élève, pour la colonne du tableau. */
function watchState(row: Row) {
  if (row.locked) return { key: "verrouillee", label: "Verrouillé" };
  if (row.passed) return { key: "rendue", label: "Réussi" };
  if (row.finishedAt) return { key: "rendue", label: "Arrêté" };
  if (row.startedAt) return { key: "en_cours", label: "En cours" };
  return { key: "pas_commencee", label: "Pas commencé" };
}

/** « AAAA-MM-JJ » du jour d'ouverture, à l'heure de Paris. */
function parisDay(iso: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date(iso));
}

export default function ChallengeDetailView({ detail, classes }: { detail: ChallengeDetail; classes: string[] }) {
  const router = useRouter();
  const { challenge, rows } = detail;
  const [tab, setTab] = useState<"resultats" | "modifier">(challengeState(challenge).key === "programme" ? "modifier" : "resultats");
  const [openCode, setOpenCode] = useState<string | null>(null);
  const opened = openCode ? rows.find((row) => row.studentId === openCode) : null;
  const state = challengeState(challenge);
  const lockedCount = rows.filter((row) => row.locked).length;
  const byClass = [...new Set(rows.map((row) => row.classe ?? ""))].map((classe) => {
    const members = rows.filter((row) => (row.classe ?? "") === classe);
    return { classe, total: members.length, passed: members.filter((row) => row.passed).length };
  });

  useEffect(() => {
    if (state.key !== "ouvert" || tab !== "resultats") return;
    const timer = window.setInterval(() => router.refresh(), REFRESH);
    return () => window.clearInterval(timer);
  }, [router, state.key, tab]);

  return (
    <div className="space-y-6">
      <Link href="/admin/defis" className="adm-eval-back"><ArrowLeft size={15} aria-hidden /> Tous les défis</Link>
      <PageHeader
        eyebrow={<span className="inline-flex items-center gap-2">Défi du lundi <span className={`adm-eval-status is-${state.key === "ouvert" ? "ouverte" : state.key === "ferme" ? "fermee" : "brouillon"}`}>{state.label}</span></span>}
        title={challenge.title}
        description={`${challenge.classes.join(", ")} · du ${dayFormat.format(new Date(challenge.opensAt))} au ${dayFormat.format(new Date(challenge.closesAt))}${challenge.timeLimitMinutes ? ` · ${challenge.timeLimitMinutes} min par élève` : ""}${challenge.proctored ? " · surveillé" : ""}`}
        actions={
          <button
            type="button"
            className="adm-eval-danger"
            onClick={async () => {
              if (!window.confirm("Supprimer ce défi et les essais des élèves ?")) return;
              const result = await deleteChallenge(challenge.id);
              if (result.ok) router.push("/admin/defis");
            }}
          >
            <Trash2 size={15} aria-hidden /> Supprimer
          </button>
        }
      />

      <div className="adm-eval-card">
        <nav className="adm-eval-tabs" aria-label="Sections du défi">
          <button type="button" aria-pressed={tab === "resultats"} onClick={() => setTab("resultats")}>Résultats</button>
          <button type="button" aria-pressed={tab === "modifier"} onClick={() => setTab("modifier")}>Modifier</button>
        </nav>

        {tab === "resultats" ? (
          <section className="space-y-4">
            <div className="adm-eval-stats">
              {byClass.map((group) => (
                <span key={group.classe}><b>{group.passed}</b> / {group.total} en {group.classe || "sans classe"}</span>
              ))}
              {challenge.proctored ? (
                <span className={lockedCount ? "is-alert" : ""}><Lock size={14} aria-hidden /> <b>{lockedCount}</b> verrouillé{lockedCount > 1 ? "s" : ""}</span>
              ) : null}
            </div>
            {rows.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun élève dans ces classes.</p>
            ) : (
              <div className="adm-eval-table-wrap">
                <table className="adm-eval-table">
                  <thead>
                    <tr>
                      <th>Élève</th>
                      <th>Résultat</th>
                      {challenge.proctored ? <th>Surveillance</th> : null}
                      {challenge.proctored ? <th>Code de déverrouillage</th> : null}
                      {challenge.exercises.map((exercise, index) => <th key={exercise.id} title={exercise.label}>Ex. {index + 1}</th>)}
                      <th>Essais</th>
                      <th>Ouvert à</th>
                      <th>Réussi en</th>
                      <th><span className="sr-only">Code</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.studentId} className={row.locked ? "is-locked" : ""}>
                        <td><b>{row.name}</b><small>{row.classe}</small></td>
                        <td>
                          {row.passed ? (
                            <span className="adm-eval-pass"><Check size={13} aria-hidden /> Réussi</span>
                          ) : row.attempts ? (
                            <span className="adm-eval-fail"><X size={13} aria-hidden /> Pas encore</span>
                          ) : "—"}
                        </td>
                        {challenge.proctored ? (
                          <td>
                            <span className={`adm-eval-row-status is-${watchState(row).key}`}>{watchState(row).label}</span>
                            {row.lockReason ? <small className="adm-eval-reason">{INCIDENT_LABELS[row.lockReason]}</small> : null}
                            {row.incidents ? <small>{row.incidents} incident{row.incidents > 1 ? "s" : ""}</small> : null}
                          </td>
                        ) : null}
                        {challenge.proctored ? (
                          <td className="adm-eval-code">
                            {row.unlockCode ?? "—"}
                            {row.locked && row.failedUnlocks ? <small>{row.failedUnlocks} essai{row.failedUnlocks > 1 ? "s" : ""} faux</small> : null}
                          </td>
                        ) : null}
                        {challenge.exercises.map((exercise) => {
                          const answer = row.answers[exercise.id];
                          return (
                            <td key={exercise.id}>
                              {answer?.passed ? <Check size={15} className="text-green-600" aria-label="Réussi" /> : answer ? <X size={15} className="text-amber-600" aria-label="Pas réussi" /> : "—"}
                            </td>
                          );
                        })}
                        <td>{row.attempts || "—"}</td>
                        <td>{row.startedAt ? timeFormat.format(new Date(row.startedAt)) : "—"}</td>
                        <td>{row.firstPassedAt && row.startedAt ? `${Math.max(1, Math.round((Date.parse(row.firstPassedAt) - Date.parse(row.startedAt)) / 60_000))} min` : "—"}</td>
                        <td>
                          {Object.keys(row.answers).length > 0 || row.incidents > 0 ? (
                            <button type="button" className="adm-eval-link" onClick={() => setOpenCode(openCode === row.studentId ? null : row.studentId)}>
                              {openCode === row.studentId ? "Masquer" : "Voir"}
                            </button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {opened ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">{opened.name}</p>
                {challenge.proctored ? <StudentIncidents challengeId={challenge.id} row={opened} onChange={() => router.refresh()} /> : null}
                {challenge.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500">
                      Ex. {index + 1} · {exercise.label} · {opened.answers[exercise.id]?.passed ? "réussi" : opened.answers[exercise.id] ? "pas réussi" : "pas tenté"}
                    </p>
                    {opened.answers[exercise.id]?.code ? <pre className="adm-eval-code-block">{opened.answers[exercise.id].code}</pre> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </section>
        ) : (
          <ChallengeEditor
            classes={classes}
            initial={{
              id: challenge.id,
              title: challenge.title,
              classes: challenge.classes,
              source: challenge.source,
              openDay: parisDay(challenge.opensAt),
              durationDays: Math.round((Date.parse(challenge.closesAt) - Date.parse(challenge.opensAt)) / 86_400_000),
              timeLimitMinutes: challenge.timeLimitMinutes,
              proctored: challenge.proctored,
            }}
          />
        )}
      </div>
    </div>
  );
}

/** Incidents d'un élève (avec les captures) et déverrouillage à distance. */
function StudentIncidents({ challengeId, row, onChange }: { challengeId: string; row: Row; onChange: () => void }) {
  const [incidents, setIncidents] = useState<ChallengeIncident[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [zoom, setZoom] = useState<string | null>(null);

  // Rechargés quand un incident arrive ou que la page se verrouille ou se déverrouille.
  useEffect(() => {
    let cancelled = false;
    void getChallengeIncidents(challengeId, row.studentId).then((list) => {
      if (!cancelled) setIncidents(list);
    });
    return () => {
      cancelled = true;
    };
  }, [challengeId, row.studentId, row.incidents, row.locked]);

  useEffect(() => {
    if (!zoom) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoom(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  return (
    <section className="space-y-2">
      {row.locked ? (
        <div className="adm-eval-actions is-start">
          <button
            type="button"
            className="adm-eval-primary"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await unlockChallengeRemotely(challengeId, row.studentId);
              setBusy(false);
              onChange();
            }}
          >
            <LockOpen size={15} aria-hidden /> Déverrouiller à distance
          </button>
        </div>
      ) : null}
      <h3 className="text-sm font-semibold text-slate-700">Incidents ({incidents?.length ?? row.incidents})</h3>
      {incidents && incidents.length === 0 ? <p className="text-sm text-slate-500">Aucun incident.</p> : null}
      <ol className="adm-eval-incidents">
        {(incidents ?? []).map((incident) => (
          <li key={incident.id} className={incident.locks ? "is-lock" : ""}>
            <p>
              <b>{INCIDENT_LABELS[incident.kind] ?? incident.kind}</b>
              <span>{secondFormat.format(new Date(incident.createdAt))}</span>
              {incident.locks ? <span className={incident.resolvedAt ? "is-resolved" : "is-open"}>{incident.resolvedAt ? "débloqué" : "en attente"}</span> : null}
            </p>
            {incident.detail ? <pre>{incident.detail}</pre> : null}
            {incident.screenshot ? (
              <button type="button" className="adm-eval-shot" onClick={() => setZoom(incident.screenshot)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={incident.screenshot} alt={`Écran de l'élève : ${INCIDENT_LABELS[incident.kind] ?? incident.kind}`} />
              </button>
            ) : incident.locks ? <small className="text-slate-500">Pas de capture (partage d&apos;écran indisponible).</small> : null}
          </li>
        ))}
      </ol>
      {zoom ? (
        <button type="button" className="adm-eval-zoom" onClick={() => setZoom(null)} aria-label="Fermer la capture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Capture de l'écran de l'élève" />
        </button>
      ) : null}
    </section>
  );
}
