"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteAssessment, saveAssessment, type AdminAssessment, type AssessmentInput } from "@/app/actions/classInfo";
import { ASSESSMENT_LABELS, formatAssessmentDate } from "@/lib/class-info";

const empty = (): AssessmentInput => ({ classes: [], kind: "interro", title: "", day: "", time: "", chapters: "" });

/** Dates d'interrogations et de DS par classe. Une saisie peut viser plusieurs classes. */
export function AssessmentsPanel({ assessments, classes }: { assessments: AdminAssessment[]; classes: string[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<AssessmentInput>(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Paris" });
  const set = (patch: Partial<AssessmentInput>) => setDraft((current) => ({ ...current, ...patch }));
  const options = [...new Set([...classes, ...draft.classes])].sort();

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
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="adm-eval-icon"
                      title="Modifier"
                      aria-label="Modifier"
                      onClick={() => {
                        setDraft({ id: item.id, classes: item.classes, kind: item.kind, title: item.title, day: item.day, time: item.time ?? "", chapters: item.chapters });
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
