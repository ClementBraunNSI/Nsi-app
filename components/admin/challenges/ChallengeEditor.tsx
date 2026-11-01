"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FlaskConical, Loader2 } from "lucide-react";
import { saveChallenge, testChallengeCorrection } from "@/app/actions/challenges";
import { parseEvaluationSubject } from "@/lib/evaluation-subject";
import { CHALLENGE_TEMPLATE, nextMonday } from "@/lib/challenges";
import type { RunReport } from "@/lib/python-check";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { RunResultPanel } from "@/components/lab/RunResultPanel";

export type ChallengeDraft = {
  id: string | null;
  title: string;
  classes: string[];
  source: string;
  openDay: string;
  durationDays: number;
};

/** Classes de Première proposées par défaut : celles qui commencent par « 1 ». */
export function defaultChallenge(classes: string[]): ChallengeDraft {
  return {
    id: null,
    title: "",
    classes: classes.filter((classe) => /^1/.test(classe)),
    source: CHALLENGE_TEMPLATE,
    openDay: nextMonday(),
    durationDays: 7,
  };
}

export default function ChallengeEditor({ initial, classes, onDone }: { initial: ChallengeDraft; classes: string[]; onDone?: () => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [testReport, setTestReport] = useState<RunReport | null>(null);
  const parsed = parseEvaluationSubject(draft.source);
  const exercise = parsed.exercises[0];
  const options = [...new Set([...classes, ...draft.classes])].sort();
  const set = (patch: Partial<ChallengeDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const test = async () => {
    setBusy("test");
    setErrors([]);
    setTestReport(null);
    const result = await testChallengeCorrection(draft.source);
    setBusy(null);
    if (!result.ok) setErrors("errors" in result ? result.errors : [result.error]);
    else setTestReport(result.report);
  };

  const save = async () => {
    setBusy("save");
    setErrors([]);
    const result = await saveChallenge(draft);
    setBusy(null);
    if (!result.ok) {
      setErrors("errors" in result ? result.errors : [result.error]);
      return;
    }
    onDone?.();
    router.push(`/admin/defis/${result.id}`);
    router.refresh();
  };

  return (
    <div className="adm-eval-panel space-y-4">
      <div className="adm-eval-form">
        <label>
          <span>Titre (vu par les élèves)</span>
          <input value={draft.title} onChange={(event) => set({ title: event.target.value })} maxLength={200} placeholder="Les nombres pairs" />
        </label>
        <fieldset>
          <legend>Classes</legend>
          <div className="adm-eval-chips">
            {options.map((classe) => (
              <label key={classe} className={draft.classes.includes(classe) ? "is-on" : ""}>
                <input
                  type="checkbox"
                  checked={draft.classes.includes(classe)}
                  onChange={(event) => set({ classes: event.target.checked ? [...draft.classes, classe] : draft.classes.filter((value) => value !== classe) })}
                />
                {classe}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex flex-wrap gap-4">
          <label className="adm-eval-short">
            <span>Ouverture (7 h 30, heure de Paris)</span>
            <input type="date" value={draft.openDay} onChange={(event) => set({ openDay: event.target.value })} />
          </label>
          <label className="adm-eval-short">
            <span>Durée, en jours</span>
            <input type="number" min={1} max={30} value={draft.durationDays} onChange={(event) => set({ durationDays: Number(event.target.value) })} />
          </label>
        </div>
        <label>
          <span>Exercice (format des fiches : un bloc &lt;ExerciseSection&gt; avec tests et correction)</span>
          <textarea className="adm-eval-source" value={draft.source} onChange={(event) => set({ source: event.target.value })} rows={20} spellCheck={false} />
        </label>
      </div>

      <div className="adm-eval-parse">
        <p>
          {exercise
            ? `${exercise.label} (${exercise.type}) · ${parsed.grading[0]?.verification ? "tests présents" : "sans tests"} · ${parsed.grading[0]?.correction ? "correction présente" : "sans correction"}`
            : "Aucun exercice trouvé."}
        </p>
        {parsed.errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
        {parsed.exercises.length > 1 ? <p className="adm-eval-error">Un défi contient un seul exercice.</p> : null}
      </div>

      <div className="adm-eval-actions is-start">
        <button type="button" className="adm-eval-secondary" onClick={() => setPreview((value) => !value)}>
          <Eye size={15} aria-hidden /> {preview ? "Masquer l'aperçu" : "Aperçu élève"}
        </button>
        <button type="button" className="adm-eval-secondary" disabled={busy !== null} onClick={test}>
          {busy === "test" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <FlaskConical size={15} aria-hidden />} Tester la correction
        </button>
      </div>

      {preview && exercise ? (
        <div className="adm-eval-preview-item">
          <ExerciseStatement label={exercise.label} content={exercise.statement} />
          {exercise.starter ? <pre>{exercise.starter}</pre> : null}
        </div>
      ) : null}
      {testReport ? (
        <div className="challenge-test-report">
          <p className="text-sm font-semibold text-slate-700">La correction passée dans les tests :</p>
          <RunResultPanel report={testReport} />
        </div>
      ) : null}

      {errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
      <div className="adm-eval-actions">
        {onDone ? <button type="button" className="adm-eval-secondary" onClick={onDone}>Annuler</button> : null}
        <button type="button" className="adm-eval-primary" disabled={busy !== null || !draft.title.trim() || parsed.errors.length > 0 || parsed.exercises.length !== 1} onClick={save}>
          {busy === "save" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} {draft.id ? "Enregistrer" : "Programmer le défi"}
        </button>
      </div>
    </div>
  );
}
