"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Eye, Loader2, Send, ShieldCheck, X } from "lucide-react";
import { checkSheetSource, createStudentSheet } from "@/app/actions/studentSheets";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { WORKSHEET_TEMPLATE } from "@/lib/catch-up";
import styles from "./Students.module.css";

export type ComposerRequest = {
  kind: "travail" | "rattrapage";
  students: { id: string; name: string }[];
  title?: string;
  source?: string;
  fromEvaluation?: string | null;
  /** Brouillon en cours de préparation (rattrapage) : la fiche s'affiche dès qu'il arrive. */
  loading?: boolean;
};

const PREVIEW_DELAY = 500;

/**
 * Écriture d'une fiche pour des élèves, au format des évaluations, avec son rendu à côté.
 * « rattrapage » : passée comme une évaluation (page verrouillée, indices retirés, seul le post-it reste).
 */
export function SheetComposer({ request, onClose, onCreated }: { request: ComposerRequest; onClose: () => void; onCreated: (id: string) => void }) {
  const rattrapage = request.kind === "rattrapage";
  const [title, setTitle] = useState(request.title ?? (rattrapage ? "Fiche de rattrapage" : "Fiche de travail"));
  const [source, setSource] = useState(request.source ?? (rattrapage ? "" : WORKSHEET_TEMPLATE));
  const [duration, setDuration] = useState("");
  const [preview, setPreview] = useState<{ errors: string[]; warnings: string[]; exercises: EvaluationExercise[] } | null>(null);
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  // Brouillon arrivé après l'ouverture (préparé sur le serveur).
  useEffect(() => {
    if (request.source !== undefined) setSource(request.source);
  }, [request.source]);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      checkSheetSource(source, request.kind)
        .then((result) => {
          setPreview(result);
          setSelected((value) => Math.min(value, Math.max(0, result.exercises.length - 1)));
        })
        .catch(() => setPreview(null));
    }, PREVIEW_DELAY);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [source, request.kind]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const names = request.students.map((student) => student.name.split(/\s+/)[0]).join(", ");
  const exercise = preview?.exercises[selected];
  const send = async () => {
    setBusy(true);
    setError(null);
    const result = await createStudentSheet({
      kind: request.kind,
      students: request.students.map((student) => student.id),
      title,
      source,
      durationMinutes: duration ? Number(duration) : null,
      fromEvaluation: request.fromEvaluation ?? null,
    }).catch(() => ({ ok: false as const, error: "La fiche n'a pas pu être envoyée." }));
    setBusy(false);
    if (!result.ok) setError(result.error);
    else onCreated(result.id);
  };

  // Rendue dans <body> : la page est dans un conteneur animé qui ferait passer l'en-tête du site devant la fenêtre.
  return createPortal(
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="sheet-composer-title">
      <button type="button" className={styles.backdrop} aria-label="Fermer" onClick={onClose} />
      <div className={`${styles.panel} ${styles.panelWide}`}>
        <header className={styles.panelHead}>
          <div className="min-w-0">
            <p className={styles.kicker}>{rattrapage ? "Fiche de rattrapage" : "Fiche particulière"}</p>
            <h2 id="sheet-composer-title">Pour {names}</h2>
            <p>
              {rattrapage
                ? "Passée comme une évaluation : page verrouillée au moindre changement de fenêtre, indices retirés, seul le post-it aide l'élève. Elle apparaît en vert en haut de son espace."
                : "Au format des interrogations (<ExerciseSection>, <Enonce>, <PostIt>, <Indices>, <Verification>, <Correction>). Sans verrouillage : les indices restent visibles."}
            </p>
          </div>
          <button type="button" className={styles.icon} onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        <div className={styles.composerBar}>
          <label>
            <span>Titre</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={200} />
          </label>
          <label className={styles.short}>
            <span>Durée (min)</span>
            <input type="number" min={5} max={600} value={duration} placeholder="libre" onChange={(event) => setDuration(event.target.value)} />
          </label>
        </div>

        <div className={styles.composer}>
          <label className={styles.editor}>
            <span className="sr-only">Contenu de la fiche</span>
            {request.loading && !source ? (
              <p className={styles.loading}>
                <Loader2 size={16} className="animate-spin" aria-hidden /> Préparation du brouillon à partir des fiches
              </p>
            ) : (
              <textarea value={source} spellCheck={false} onChange={(event) => setSource(event.target.value)} />
            )}
          </label>

          <section className={styles.preview} aria-label="Rendu pour l'élève">
            <p className={styles.previewHead}>
              <Eye size={14} aria-hidden /> Rendu pour l&apos;élève
              {preview?.exercises.length ? ` · ${preview.exercises.length} exercice${preview.exercises.length > 1 ? "s" : ""}` : ""}
            </p>
            {preview?.errors.length ? (
              <ul className={styles.errors}>
                {preview.errors.map((item) => (
                  <li key={item}>
                    <AlertTriangle size={14} aria-hidden /> {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {preview?.warnings.length ? (
              <ul className={styles.warnings}>
                {preview.warnings.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {preview?.exercises.length ? (
              <>
                <div className={styles.previewTabs} role="tablist">
                  {preview.exercises.map((item, index) => (
                    <button key={item.id} type="button" role="tab" aria-selected={index === selected} className={index === selected ? styles.on : ""} onClick={() => setSelected(index)}>
                      {index + 1}
                    </button>
                  ))}
                </div>
                {exercise ? (
                  <div className={styles.statement}>
                    <ExerciseStatement key={`${exercise.id}-${exercise.statement.length}`} label={exercise.label} content={exercise.statement} />
                    {exercise.starter ? (
                      <pre className={styles.starter}>
                        <code>{exercise.starter}</code>
                      </pre>
                    ) : null}
                  </div>
                ) : null}
              </>
            ) : !preview?.errors.length ? (
              <p className={styles.muted}>Le rendu apparaît ici dès qu&apos;un bloc &lt;ExerciseSection&gt; est écrit.</p>
            ) : null}
          </section>
        </div>

        <footer className={styles.panelFoot}>
          {error ? <p className={styles.errorText}>{error}</p> : <span />}
          <button type="button" className={styles.ghost} onClick={onClose}>
            Annuler
          </button>
          <button type="button" className={rattrapage ? styles.green : styles.primary} disabled={busy || !preview || preview.errors.length > 0 || preview.exercises.length === 0} onClick={send}>
            {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : rattrapage ? <ShieldCheck size={15} aria-hidden /> : <Send size={15} aria-hidden />}
            Envoyer à {names}
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
