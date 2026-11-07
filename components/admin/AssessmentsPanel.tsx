"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, X } from "lucide-react";
import { deleteAssessment, saveAssessment, type AdminAssessment, type AssessmentInput } from "@/app/actions/classInfo";
import type { ExerciseSheet } from "@/app/actions/getExercises";
import { ASSESSMENT_LABELS, formatAssessmentDate } from "@/lib/class-info";
import { matchAssessmentSheets } from "@/lib/revisions";

const empty = (): AssessmentInput => ({ classes: [], kind: "interro", title: "", day: "", time: "", chapters: "", courseIds: [] });

/** Dates d'interrogations et de DS par classe. Une saisie peut viser plusieurs classes. */
export function AssessmentsPanel({ assessments, classes, sheets = [] }: { assessments: AdminAssessment[]; classes: string[]; sheets?: ExerciseSheet[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<AssessmentInput>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const set = (patch: Partial<AssessmentInput>) => setDraft((current) => ({ ...current, ...patch }));
  const options = [...new Set([...classes, ...draft.classes])].sort();
  const sheetTitle = (id: string) => {
    const sheet = sheets.find((item) => item.courseId === id);
    return sheet ? `${sheet.courseTitle} (${sheet.level})` : id;
  };
  const chosen = draft.courseIds ?? [];
  // Aperçu du rapprochement fait pour les élèves (sans tenir compte de leur niveau).
  const preview = draft.chapters.trim() && chosen.length === 0 ? matchAssessmentSheets(draft.chapters, sheets) : null;
  const levels = [...new Set(sheets.map((sheet) => sheet.level))];

  const submit = async () => {
    setBusy(true);
    setError(null);
    const result = await saveAssessment(draft);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDraft(empty());
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="adm-eval-panel" ref={formRef}>
        <h2>{draft.id ? "Modifier la date" : "Nouvelle interro ou nouveau DS"}</h2>
        <div className="adm-eval-form">
          <fieldset>
            <legend>Classes</legend>
            <div className="adm-eval-chips">
              {options.map((classe) => (
                <label key={classe} className={draft.classes.includes(classe) ? "is-on" : ""}>
                  <input
                    type="checkbox"
                    checked={draft.classes.includes(classe)}
                    onChange={(event) =>
                      set({ classes: event.target.checked ? [...draft.classes, classe] : draft.classes.filter((value) => value !== classe) })
                    }
                  />
                  {classe}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Type</legend>
            <div className="adm-eval-chips">
              {(["interro", "ds"] as const).map((kind) => (
                <label key={kind} className={draft.kind === kind ? "is-on" : ""}>
                  <input type="radio" name="assessment-kind" checked={draft.kind === kind} onChange={() => set({ kind })} />
                  {ASSESSMENT_LABELS[kind]}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-4">
            <label className="adm-eval-short">
              <span>Date</span>
              <input type="date" value={draft.day} min={draft.id ? undefined : today} onChange={(event) => set({ day: event.target.value })} />
            </label>
            <label className="adm-eval-short">
              <span>Heure (facultatif)</span>
              <input type="time" value={draft.time} onChange={(event) => set({ time: event.target.value })} />
            </label>
          </div>
          <label>
            <span>Titre (facultatif)</span>
            <input value={draft.title} maxLength={200} onChange={(event) => set({ title: event.target.value })} placeholder="Listes et dictionnaires" />
          </label>
          <label>
            <span>Chapitres concernés</span>
            <textarea value={draft.chapters} maxLength={1000} rows={2} onChange={(event) => set({ chapters: event.target.value })} />
          </label>
          {preview ? (
            <p className={`adm-revise-preview${preview.sheets.length === 0 ? " is-none" : ""}`}>
              {preview.sheets.length === 0
                ? "Aucune fiche d'exercices reconnue dans ce texte : les élèves n'auront pas d'exercices à refaire. Choisir les fiches ci-dessous."
                : `Fiches reconnues pour les révisions (chaque élève voit celles de son niveau) : ${preview.sheets.map((sheet) => `${sheet.courseTitle} (${sheet.level})`).join(", ")}.`}
              {preview.sheets.length > 0 && preview.unmatched.length > 0
                ? ` Sans fiche : ${preview.unmatched.map((part) => `« ${part} »`).join(", ")}.`
                : ""}
            </p>
          ) : null}
          <div className="adm-revise-sheets">
            <span>Fiches à réviser (facultatif)</span>
            {chosen.length > 0 ? (
              <ul>
                {chosen.map((id) => (
                  <li key={id}>
                    {sheetTitle(id)}
                    <button type="button" aria-label={`Retirer ${sheetTitle(id)}`} onClick={() => set({ courseIds: chosen.filter((value) => value !== id) })}>
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <select
              value=""
              onChange={(event) => {
                const id = event.target.value;
                if (id && !chosen.includes(id)) set({ courseIds: [...chosen, id] });
              }}
            >
              <option value="">Ajouter une fiche…</option>
              {levels.map((level) => (
                <optgroup key={level} label={level}>
                  {sheets
                    .filter((sheet) => sheet.level === level && !chosen.includes(sheet.courseId))
                    .map((sheet) => (
                      <option key={sheet.courseId} value={sheet.courseId}>
                        {sheet.chapter} · {sheet.courseTitle}
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            {chosen.length > 0 ? <small>Les fiches choisies remplacent le rapprochement automatique du texte.</small> : null}
          </div>
        </div>
        {error ? <p className="adm-eval-error mt-3">{error}</p> : null}
        <div className="adm-eval-actions is-start mt-4">
          <button type="button" className="adm-eval-primary" disabled={busy || draft.classes.length === 0 || !draft.day} onClick={submit}>
            {draft.id ? "Enregistrer" : "Ajouter"}
          </button>
          {draft.id ? (
            <button type="button" className="adm-eval-secondary" onClick={() => setDraft(empty())}>
              Annuler
            </button>
          ) : null}
        </div>
      </div>

      {assessments.length === 0 ? (
        <p className="text-sm text-slate-400">Aucune interro ni aucun DS à venir.</p>
      ) : (
        <ul className="space-y-3">
          {assessments.map((item) => {
            const past = item.day < today;
            return (
              <li key={item.id} className={`bg-white rounded-2xl border border-slate-200 p-4 text-sm${past ? " opacity-60" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">
                      {ASSESSMENT_LABELS[item.kind]}
                      {item.title ? ` : ${item.title}` : ""}
                    </p>
                    <p className="text-slate-500">
                      {item.classes.join(", ")}, {formatAssessmentDate(item.day, item.time)}
                      {past ? " (passée)" : ""}
                    </p>
                    {item.chapters ? <p className="mt-1 text-slate-600 whitespace-pre-wrap">{item.chapters}</p> : null}
                    {item.courseIds.length > 0 ? (
                      <p className="mt-1 text-slate-500">Fiches à réviser : {item.courseIds.map(sheetTitle).join(", ")}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="adm-eval-icon"
                      title="Modifier"
                      aria-label="Modifier"
                      onClick={() => {
                        setDraft({ id: item.id, classes: item.classes, kind: item.kind, title: item.title, day: item.day, time: item.time ?? "", chapters: item.chapters, courseIds: item.courseIds });
                        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      className="adm-eval-icon"
                      title="Supprimer"
                      aria-label="Supprimer"
                      disabled={busy}
                      onClick={async () => {
                        if (!window.confirm("Supprimer cette date pour toutes les classes visées ?")) return;
                        setBusy(true);
                        const result = await deleteAssessment(item.id);
                        setBusy(false);
                        if (!result.ok) setError(result.error);
                        else router.refresh();
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
