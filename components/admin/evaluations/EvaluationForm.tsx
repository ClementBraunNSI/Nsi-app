"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export type EvaluationFormValues = {
  title: string;
  description: string;
  classes: string[];
  durationMinutes: number | null;
};

export default function EvaluationForm({
  classes,
  initial,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  classes: string[];
  initial?: EvaluationFormValues;
  busy: boolean;
  submitLabel: string;
  onSubmit: (values: EvaluationFormValues) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [chosen, setChosen] = useState<string[]>(initial?.classes ?? []);
  const [duration, setDuration] = useState(initial?.durationMinutes ? String(initial.durationMinutes) : "");
  // Une classe saisie à la main reste proposée, même si aucun élève ne l'a encore.
  const options = [...new Set([...classes, ...chosen])].sort();

  return (
    <form
      className="adm-eval-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title, description, classes: chosen, durationMinutes: duration ? Number(duration) : null });
      }}
    >
      <label>
        <span>Titre</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={200} placeholder="Interrogation : les conditions" />
      </label>
      <label>
        <span>Consigne affichée aux élèves (facultatif)</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} maxLength={4000} />
      </label>
      <fieldset>
        <legend>Classes</legend>
        <div className="adm-eval-chips">
          {options.length === 0 ? <span className="text-sm text-slate-500">Aucune classe enregistrée sur les comptes élèves.</span> : null}
          {options.map((classe) => (
            <label key={classe} className={chosen.includes(classe) ? "is-on" : ""}>
              <input
                type="checkbox"
                checked={chosen.includes(classe)}
                onChange={(event) => setChosen((prev) => (event.target.checked ? [...prev, classe] : prev.filter((value) => value !== classe)))}
              />
              {classe}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="adm-eval-short">
        <span>Durée par élève, en minutes (vide : sans limite)</span>
        <input type="number" min={5} max={600} value={duration} onChange={(event) => setDuration(event.target.value)} />
      </label>
      <div className="adm-eval-actions">
        {onCancel ? <button type="button" className="adm-eval-secondary" onClick={onCancel}>Annuler</button> : null}
        <button type="submit" className="adm-eval-primary" disabled={busy || !title.trim()}>
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} {submitLabel}
        </button>
      </div>
    </form>
  );
}
