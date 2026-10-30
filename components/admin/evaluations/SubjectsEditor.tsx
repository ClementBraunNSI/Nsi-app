"use client";

import { useState } from "react";
import { Eye, FileUp, Loader2, Plus, Trash2 } from "lucide-react";
import { deleteEvaluationSubject, saveEvaluationSubject, type EvaluationBoard } from "@/app/actions/evaluations";
import { parseEvaluationSubject, SUBJECT_TEMPLATE } from "@/lib/evaluation-subject";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";

type Draft = { id: string | null; label: string; source: string };

export default function SubjectsEditor({ board, onChange }: { board: EvaluationBoard; onChange: () => Promise<void> }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const parsed = draft ? parseEvaluationSubject(draft.source) : null;
  const started = board.subjects.some((subject) => subject.attempts > 0);

  const save = async () => {
    if (!draft) return;
    setBusy(true);
    setErrors([]);
    setNotice(null);
    const result = await saveEvaluationSubject({ evaluationId: board.evaluation.id, subjectId: draft.id, label: draft.label, source: draft.source });
    setBusy(false);
    if (!result.ok) {
      setErrors("errors" in result ? result.errors : [result.error]);
      return;
    }
    setNotice(result.warnings.length ? `Sujet enregistré. ${result.warnings.join(" ")}` : "Sujet enregistré.");
    setDraft(null);
    await onChange();
  };

  const loadFile = (file: File | undefined) => {
    if (!file) return;
    file.text().then((text) => {
      setDraft((prev) => ({ id: prev?.id ?? null, label: prev?.label || file.name.replace(/\.[^.]+$/, ""), source: text }));
    });
  };

  return (
    <section className="space-y-5">
      <div className="adm-eval-help">
        <p>
          Chaque élève reçoit l&apos;un de ces sujets, tiré au hasard et distribué à parts égales. Sujets, tests et corrections restent en base :
          ni dans le dépôt du site, ni à une adresse accessible aux élèves.
        </p>
        <p>
          Format des fiches : des blocs <code>&lt;ExerciseSection&gt;</code> de type <code>python</code> ou <code>sql</code>, avec un{" "}
          <code>&lt;Enonce&gt;</code>, un <code>&lt;CodeDepart&gt;</code> facultatif, les tests dans <code>&lt;Verification&gt;</code> et la{" "}
          <code>&lt;Correction&gt;</code>.
        </p>
      </div>
      {started ? <p className="adm-eval-warning">Des élèves ont déjà reçu un sujet : une modification s&apos;applique aussi à leur copie en cours.</p> : null}
      {notice ? <p className="adm-eval-ok">{notice}</p> : null}

      <ul className="adm-eval-subjects">
        {board.subjects.map((subject) => (
          <li key={subject.id}>
            <div className="min-w-0">
              <b>{subject.label}</b>
              <small>
                {subject.exercises.length} exercice{subject.exercises.length > 1 ? "s" : ""} ·{" "}
                {subject.grading.filter((item) => item.verification).length} avec tests · tiré pour {subject.attempts} élève{subject.attempts > 1 ? "s" : ""}
              </small>
              <span className="adm-eval-subject-ex">{subject.exercises.map((exercise) => exercise.label).join(" · ")}</span>
            </div>
            <div className="adm-eval-actions">
              <button type="button" className="adm-eval-secondary" onClick={() => { setDraft({ id: subject.id, label: subject.label, source: subject.source }); setErrors([]); setPreview(false); }}>
                Modifier
              </button>
              <button
                type="button"
                className="adm-eval-icon"
                title="Supprimer le sujet"
                aria-label={`Supprimer ${subject.label}`}
                disabled={subject.attempts > 0}
                onClick={async () => {
                  if (!window.confirm(`Supprimer « ${subject.label} » ?`)) return;
                  const result = await deleteEvaluationSubject(board.evaluation.id, subject.id);
                  if (!result.ok) setErrors([result.error]);
                  await onChange();
                }}
              >
                <Trash2 size={15} aria-hidden />
              </button>
            </div>
          </li>
        ))}
      </ul>

      {draft ? (
        <div className="adm-eval-panel space-y-4">
          <div className="adm-eval-form">
            <label>
              <span>Nom du sujet (vu seulement par l&apos;enseignant)</span>
              <input value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} maxLength={120} />
            </label>
            <label>
              <span>Sujet</span>
              <textarea
                className="adm-eval-source"
                value={draft.source}
                onChange={(event) => setDraft({ ...draft, source: event.target.value })}
                rows={22}
                spellCheck={false}
              />
            </label>
          </div>
          <div className="adm-eval-actions is-start">
            <label className="adm-eval-secondary">
              <FileUp size={15} aria-hidden /> Importer un fichier .md
              <input type="file" accept=".md,.mdx,.txt" className="sr-only" onChange={(event) => loadFile(event.target.files?.[0])} />
            </label>
            <button type="button" className="adm-eval-secondary" onClick={() => setPreview((value) => !value)}>
              <Eye size={15} aria-hidden /> {preview ? "Masquer l'aperçu" : "Aperçu élève"}
            </button>
          </div>

          {parsed ? (
            <div className="adm-eval-parse">
              <p>
                {parsed.exercises.length} exercice{parsed.exercises.length > 1 ? "s" : ""} trouvé{parsed.exercises.length > 1 ? "s" : ""} :{" "}
                {parsed.exercises.map((exercise) => `${exercise.label} (${exercise.type}${parsed.grading.find((item) => item.id === exercise.id)?.verification ? ", tests" : ", sans tests"})`).join(" · ") || "aucun"}
              </p>
              {parsed.errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
              {parsed.warnings.map((warning) => <p key={warning} className="adm-eval-warning">{warning}</p>)}
            </div>
          ) : null}

          {preview && parsed ? (
            <div className="adm-eval-preview">
              {parsed.exercises.map((exercise) => (
                <div key={exercise.id} className="adm-eval-preview-item">
                  <ExerciseStatement label={exercise.label} content={exercise.statement} />
                  {exercise.starter ? <pre>{exercise.starter}</pre> : null}
                </div>
              ))}
            </div>
          ) : null}

          {errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
          <div className="adm-eval-actions">
            <button type="button" className="adm-eval-secondary" onClick={() => setDraft(null)}>Annuler</button>
            <button type="button" className="adm-eval-primary" disabled={busy || !parsed || parsed.errors.length > 0} onClick={save}>
              {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Enregistrer le sujet
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="adm-eval-primary"
          onClick={() => {
            setDraft({ id: null, label: `Sujet ${String.fromCharCode(65 + board.subjects.length)}`, source: SUBJECT_TEMPLATE });
            setErrors([]);
            setNotice(null);
          }}
        >
          <Plus size={16} aria-hidden /> Ajouter un sujet
        </button>
      )}
    </section>
  );
}
