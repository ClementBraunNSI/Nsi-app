"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, FlaskConical, Loader2 } from "lucide-react";
import { saveChallenge, testChallengeCorrection, type CorrectionTest } from "@/app/actions/challenges";
import { parseEvaluationSubject } from "@/lib/evaluation-subject";
import { CHALLENGE_TEMPLATE, nextMonday } from "@/lib/challenges";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { RunResultPanel } from "@/components/lab/RunResultPanel";

export type ChallengeDraft = {
  id: string | null;
  title: string;
  classes: string[];
  source: string;
  openDay: string;
  durationDays: number;
  /** Temps par élève depuis l'ouverture de la page, en minutes ; null : pas de limite. */
  timeLimitMinutes: number | null;
  /** Surveillance des évaluations pratiques : partage d'écran, verrouillage, code du professeur. */
  proctored: boolean;
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
    timeLimitMinutes: null,
    proctored: true,
  };
}

export default function ChallengeEditor({ initial, classes, onDone }: { initial: ChallengeDraft; classes: string[]; onDone?: () => void }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState<"save" | "test" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const [testResults, setTestResults] = useState<CorrectionTest[] | null>(null);
  const parsed = parseEvaluationSubject(draft.source);
  const exerciseCount = parsed.exercises.length;
  const options = [...new Set([...classes, ...draft.classes])].sort();
  const set = (patch: Partial<ChallengeDraft>) => setDraft((prev) => ({ ...prev, ...patch }));

  const test = async () => {
    setBusy("test");
    setErrors([]);
    setTestResults(null);
    const result = await testChallengeCorrection(draft.source);
    setBusy(null);
    if (!result.ok) setErrors("errors" in result ? result.errors : [result.error]);
    else setTestResults(result.results);
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
          <label className="adm-eval-short">
            <span>Temps par élève, en minutes (vide : sans limite)</span>
            <input
              type="number"
              min={1}
              max={240}
              value={draft.timeLimitMinutes ?? ""}
              placeholder="Sans limite"
              onChange={(event) => set({ timeLimitMinutes: event.target.value ? Number(event.target.value) : null })}
            />
          </label>
        </div>
        <label className="adm-eval-check">
          <input type="checkbox" checked={draft.proctored} onChange={(event) => set({ proctored: event.target.checked })} />
          <span>
            Surveillance comme une évaluation pratique : partage d&apos;écran, page verrouillée au moindre changement d&apos;onglet ou collage
            venu d&apos;ailleurs, déverrouillage avec le code du professeur. À réserver aux défis faits en classe.
          </span>
        </label>
        <label>
          <span>Exercices (format des fiches : un bloc &lt;ExerciseSection&gt; par exercice, avec tests et correction ; 5 au plus)</span>
          <textarea className="adm-eval-source" value={draft.source} onChange={(event) => set({ source: event.target.value })} rows={20} spellCheck={false} />
        </label>
      </div>

      <div className="adm-eval-parse">
        {exerciseCount === 0 ? <p>Aucun exercice trouvé.</p> : null}
        {parsed.exercises.map((item, index) => (
          <p key={item.id}>
            {index + 1}. {item.label} ({item.type}) · {parsed.grading[index]?.verification ? "tests présents" : "sans tests"} · {parsed.grading[index]?.correction ? "correction présente" : "sans correction"}
          </p>
        ))}
        {parsed.errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
        {exerciseCount > 5 ? <p className="adm-eval-error">Un défi contient au plus 5 exercices.</p> : null}
      </div>

      <div className="adm-eval-actions is-start">
        <button type="button" className="adm-eval-secondary" onClick={() => setPreview((value) => !value)}>
          <Eye size={15} aria-hidden /> {preview ? "Masquer l'aperçu" : "Aperçu élève"}
        </button>
        <button type="button" className="adm-eval-secondary" disabled={busy !== null} onClick={test}>
          {busy === "test" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <FlaskConical size={15} aria-hidden />} Tester la correction
        </button>
      </div>

      {preview
        ? parsed.exercises.map((item) => (
            <div key={item.id} className="adm-eval-preview-item">
              <ExerciseStatement label={item.label} content={item.statement} />
              {item.starter ? <pre>{item.starter}</pre> : null}
            </div>
          ))
        : null}
      {testResults?.map((result) => (
        <div key={result.id} className="challenge-test-report">
          <p className="text-sm font-semibold text-slate-700">
            {result.label} : {result.missing ? "pas de <Correction> à tester." : result.passed ? "la correction passe tous les tests." : "la correction ne passe pas tous les tests."}
          </p>
          {result.report ? <RunResultPanel report={result.report} /> : null}
        </div>
      ))}

      {errors.map((error) => <p key={error} className="adm-eval-error">{error}</p>)}
      <div className="adm-eval-actions">
        {onDone ? <button type="button" className="adm-eval-secondary" onClick={onDone}>Annuler</button> : null}
        <button type="button" className="adm-eval-primary" disabled={busy !== null || !draft.title.trim() || parsed.errors.length > 0 || exerciseCount === 0 || exerciseCount > 5} onClick={save}>
          {busy === "save" ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} {draft.id ? "Enregistrer" : "Programmer le défi"}
        </button>
      </div>
    </div>
  );
}
