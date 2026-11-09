"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { parisTime } from "@/lib/challenges";

export type EvaluationFormValues = {
  title: string;
  description: string;
  classes: string[];
  durationMinutes: number | null;
  /** Date et heure de passage (ISO), ou null si l'enseignant n'en donne pas (évaluations plus anciennes). */
  scheduledAt: string | null;
};

const parisDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" });
const parisClock = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

export default function EvaluationForm({
  classes,
  initial,
  busy,
  submitLabel,
  onSubmit,
  onCancel,
  requireSchedule = false,
}: {
  classes: string[];
  initial?: EvaluationFormValues;
  /** Création : la date et l'heure de passage sont obligatoires. */
  requireSchedule?: boolean;
  busy: boolean;
  submitLabel: string;
  onSubmit: (values: EvaluationFormValues) => void;
  onCancel?: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [chosen, setChosen] = useState<string[]>(initial?.classes ?? []);
  const [duration, setDuration] = useState(initial?.durationMinutes ? String(initial.durationMinutes) : "");
  const [day, setDay] = useState(initial?.scheduledAt ? parisDay.format(new Date(initial.scheduledAt)) : "");
  const [time, setTime] = useState(initial?.scheduledAt ? parisClock.format(new Date(initial.scheduledAt)) : "");
  const scheduledAt = day && /^\d{2}:\d{2}$/.test(time) ? parisTime(day, Number(time.slice(0, 2)), Number(time.slice(3, 5))).toISOString() : null;
  // Une classe saisie à la main reste proposée, même si aucun élève ne l'a encore.
  const options = [...new Set([...classes, ...chosen])].sort();

  return (
    <form
      className="adm-eval-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({ title, description, classes: chosen, durationMinutes: duration ? Number(duration) : null, scheduledAt });
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
      <div className="flex flex-wrap gap-4">
        <label className="adm-eval-short">
          <span>Date de passage{requireSchedule ? "" : " (facultatif)"}</span>
          <input type="date" value={day} onChange={(event) => setDay(event.target.value)} required={requireSchedule || Boolean(time)} />
        </label>
        <label className="adm-eval-short">
          <span>Heure de début (heure de Paris)</span>
          <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required={requireSchedule || Boolean(day)} step={300} />
        </label>
      </div>
      <p className="text-xs text-slate-500">
        Une fois les sujets ajoutés, « Programmer » rend l&apos;évaluation visible aux élèves à cette heure-là, sans autre clic.
      </p>
      <label className="adm-eval-short">
        <span>Durée par élève, en minutes (vide : sans limite)</span>
        <input type="number" min={5} max={600} value={duration} onChange={(event) => setDuration(event.target.value)} />
      </label>
      <div className="adm-eval-actions">
        {onCancel ? <button type="button" className="adm-eval-secondary" onClick={onCancel}>Annuler</button> : null}
        <button type="submit" className="adm-eval-primary" disabled={busy || !title.trim() || (requireSchedule && !scheduledAt)}>
          {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} {submitLabel}
        </button>
      </div>
    </form>
  );
}
