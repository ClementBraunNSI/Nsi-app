"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, CloudOff, Loader2, Lock, MonitorUp, Send, ShieldAlert, TimerReset } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";
import {
  evaluationHeartbeat,
  reportEvaluationIncident,
  saveEvaluationAnswer,
  submitEvaluation,
  unlockEvaluation,
  type UnlockedIncident,
} from "@/app/actions/evaluations";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import { formatRemaining, INCIDENT_LABELS, isAllowedPaste, type IncidentKind } from "@/lib/evaluation-guard";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";
import {
  captureActive,
  captureSupported,
  grabScreenshot,
  onCaptureEnded,
  startScreenCapture,
  stopScreenCapture,
} from "./screen-capture";

type Props = {
  evaluation: { id: string; title: string; durationMinutes: number | null };
  attempt: { id: string; locked: boolean; deadline: string | null };
  exercises: EvaluationExercise[];
  answers: Record<string, string>;
};

const SAVE_DELAY = 1200;
const HEARTBEAT = 10_000;
// Le temps de laisser l'autre fenêtre s'afficher avant de prendre l'image de l'écran.
const SCREENSHOT_DELAY = 900;
// Après le partage d'écran, le navigateur rend la main à la page : pas de verrouillage pendant ce temps.
const ARM_DELAY = 1500;

const timeFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "medium" });

// Réouvertures déjà notées pendant ce chargement de page (React peut monter le composant deux fois).
const reopenReported = new Set<string>();

/** Clé de session : posée au début de l'évaluation, pour ne pas noter ce premier affichage comme une réouverture. */
export const freshStartKey = (evaluationId: string) => `evaluation-debut-${evaluationId}`;

export default function EvaluationRunner({ evaluation, attempt, exercises, answers }: Props) {
  const router = useRouter();
  const [codes, setCodes] = useState<Record<string, string>>(() =>
    Object.fromEntries(exercises.map((exercise) => [exercise.id, answers[exercise.id] ?? exercise.starter ?? ""])),
  );
  const [selectedId, setSelectedId] = useState(exercises[0]?.id ?? "");
  const [locked, setLocked] = useState(attempt.locked);
  const [needsShare, setNeedsShare] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set(Object.keys(answers)));
  // L'heure n'est lue que dans le navigateur : le serveur et la page afficheraient deux temps restants différents.
  const [now, setNow] = useState<number | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const armedRef = useRef(false);
  // Fenêtre de choix du partage d'écran ouverte : le navigateur prend le focus, ce n'est pas un incident.
  const pickingRef = useRef(false);
  // Versions précédentes du code : coller un passage coupé plus tôt dans l'éditeur reste permis.
  const historyRef = useRef<string[]>([]);
  const lockedRef = useRef(attempt.locked);
  const finishedRef = useRef(false);
  const codesRef = useRef(codes);
  const pendingRef = useRef(new Map<string, string>());
  const saveTimerRef = useRef<number | null>(null);
  const copiedRef = useRef<string[]>([]);
  const lockRef = useRef<HTMLDivElement>(null);
  codesRef.current = codes;

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((value) => (value === message ? null : value)), 3500);
  }, []);

  // ---------- Sauvegarde ----------

  const flushSaves = useCallback(async () => {
    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
    const pending = [...pendingRef.current.entries()];
    if (pending.length === 0) return true;
    setSaveState("saving");
    let ok = true;
    for (const [exerciseId, code] of pending) {
      const result = await saveEvaluationAnswer(attempt.id, exerciseId, code);
      if (result.ok) {
        if (pendingRef.current.get(exerciseId) === code) pendingRef.current.delete(exerciseId);
        setSavedIds((prev) => (prev.has(exerciseId) ? prev : new Set(prev).add(exerciseId)));
      } else {
        ok = false;
      }
    }
    setSaveState(ok && pendingRef.current.size === 0 ? "saved" : ok ? "saving" : "error");
    return ok;
  }, [attempt.id]);

  const onCodeChange = useCallback(
    (exerciseId: string, code: string) => {
      const previous = codesRef.current[exerciseId];
      if (previous === code) return;
      if (previous) historyRef.current = [...historyRef.current.slice(-59), previous];
      codesRef.current = { ...codesRef.current, [exerciseId]: code };
      setCodes(codesRef.current);
      pendingRef.current.set(exerciseId, code);
      setSaveState("saving");
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(() => {
        if (!lockedRef.current) void flushSaves();
      }, SAVE_DELAY);
    },
    [flushSaves],
  );

  // ---------- Verrouillage ----------

  const violation = useCallback(
    (kind: IncidentKind, detail = "") => {
      if (!armedRef.current || finishedRef.current || pickingRef.current) return;
      const firstLock = !lockedRef.current;
      lockedRef.current = true;
      setLocked(true);
      void (async () => {
        // Le code écrit juste avant reste enregistré : la sauvegarde est refusée une fois verrouillée.
        if (firstLock) await flushSaves();
        const result = await reportEvaluationIncident(attempt.id, kind, detail);
        if (!result.ok || !result.incidentId) return;
        const wait = kind === "onglet" || kind === "application" ? SCREENSHOT_DELAY : 150;
        await new Promise((resolve) => window.setTimeout(resolve, wait));
        const image = await grabScreenshot();
        if (!image) return;
        await fetch("/api/evaluations/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "capture", incidentId: result.incidentId, image }),
          keepalive: image.length < 60_000,
        }).catch(() => undefined);
      })();
    },
    [attempt.id, flushSaves],
  );

  const arm = useCallback(() => {
    window.setTimeout(() => {
      if (!finishedRef.current) armedRef.current = true;
    }, ARM_DELAY);
  }, []);

  // Premier affichage : la surveillance démarre ; un rechargement de la page est noté comme une réouverture.
  useEffect(() => {
    let fresh = false;
    try {
      fresh = sessionStorage.getItem(freshStartKey(evaluation.id)) === attempt.id;
      sessionStorage.removeItem(freshStartKey(evaluation.id));
    } catch {
      fresh = false;
    }
    if (!fresh && !reopenReported.has(attempt.id)) void reportEvaluationIncident(attempt.id, "reprise", "");
    reopenReported.add(attempt.id);
    setNeedsShare(captureSupported() && !captureActive());
    arm();
  }, [arm, attempt.id, evaluation.id]);

  // Surveillance : onglet, application, collage, dépôt, second onglet, partage arrêté, fermeture.
  useEffect(() => {
    const insideLock = (target: EventTarget | null) => target instanceof Node && Boolean(lockRef.current?.contains(target));

    const onVisibility = () => {
      if (document.hidden) violation("onglet", "La page n'était plus visible (autre onglet, fenêtre réduite ou autre bureau).");
    };
    const onBlur = () => {
      window.setTimeout(() => {
        if (!document.hidden && !document.hasFocus()) {
          violation("application", "La fenêtre du navigateur a perdu le focus (autre application ou fenêtre au premier plan).");
        }
      }, 200);
    };
    const onPaste = (event: ClipboardEvent) => {
      if (insideLock(event.target) || !armedRef.current) return;
      const text = event.clipboardData?.getData("text/plain") ?? "";
      if (isAllowedPaste(text, copiedRef.current, [...Object.values(codesRef.current), ...historyRef.current])) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      violation("collage", text || "(contenu non textuel : image ou fichier)");
    };
    const onDrop = (event: DragEvent) => {
      if (!armedRef.current) return;
      const text = event.dataTransfer?.getData("text/plain") ?? "";
      const files = event.dataTransfer?.files?.length ?? 0;
      if (!files && isAllowedPaste(text, copiedRef.current, [...Object.values(codesRef.current), ...historyRef.current])) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      violation("depot", text || `${files} fichier(s) déposé(s)`);
    };
    const onCopy = (event: ClipboardEvent) => {
      if (insideLock(event.target)) return;
      const target = event.target as HTMLElement | null;
      const inEditor = Boolean(target?.closest?.(".exercise-editor"));
      if (!inEditor) {
        // Copier l'énoncé ne sert qu'à le coller ailleurs : la copie est simplement bloquée.
        event.preventDefault();
        showToast("La copie de texte hors de l'éditeur est désactivée pendant l'évaluation.");
        return;
      }
      let text = event.clipboardData?.getData("text/plain") ?? "";
      if (!text && target instanceof HTMLTextAreaElement) text = target.value.slice(target.selectionStart, target.selectionEnd);
      if (!text) text = window.getSelection()?.toString() ?? "";
      if (text) copiedRef.current = [...copiedRef.current.slice(-19), text];
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("paste", onPaste, true);
    window.addEventListener("drop", onDrop, true);
    document.addEventListener("copy", onCopy);
    document.addEventListener("cut", onCopy);

    // Un second onglet sur la même copie : les deux se verrouillent.
    const tabId = Math.random().toString(36).slice(2);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`evaluation-${attempt.id}`);
      channel.onmessage = (event) => {
        if (event.data?.tab === tabId) return;
        if (event.data?.type === "bonjour") channel?.postMessage({ type: "deja-ouverte", tab: tabId });
        violation("double_onglet", "L'évaluation est ouverte dans un autre onglet ou une autre fenêtre.");
      };
      channel.postMessage({ type: "bonjour", tab: tabId });
    } catch {
      channel = null;
    }

    const offCapture = onCaptureEnded(() => {
      violation("partage_arrete", "Le partage de l'écran a été arrêté.");
      setNeedsShare(captureSupported());
    });

    const onLeave = () => {
      if (!armedRef.current || finishedRef.current) return;
      navigator.sendBeacon?.("/api/evaluations/signal", JSON.stringify({ type: "fermeture", attemptId: attempt.id }));
    };
    window.addEventListener("pagehide", onLeave);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("paste", onPaste, true);
      window.removeEventListener("drop", onDrop, true);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      window.removeEventListener("pagehide", onLeave);
      channel?.close();
      offCapture();
    };
  }, [attempt.id, showToast, violation]);

  // Quitter la page par un lien du site compte comme une fermeture (les liens sont masqués pendant l'évaluation).
  useEffect(() => () => {
    if (armedRef.current && !finishedRef.current) {
      navigator.sendBeacon?.("/api/evaluations/signal", JSON.stringify({ type: "fermeture", attemptId: attempt.id }));
    }
  }, [attempt.id]);

  const finish = useCallback(
    (message: string) => {
      finishedRef.current = true;
      armedRef.current = false;
      setFinished(message);
      stopScreenCapture();
      router.refresh();
    },
    [router],
  );

  // Présence, déverrouillage à distance par l'enseignant, fermeture de l'évaluation.
  useEffect(() => {
    const beat = async () => {
      if (finishedRef.current) return;
      const result = await evaluationHeartbeat(attempt.id);
      if (!result.ok) return;
      if (result.status === "rendue") {
        finish(result.evaluationStatus === "fermee" ? "Le professeur a fermé l'évaluation : la copie est rendue." : "Le temps est écoulé : la copie est rendue.");
        return;
      }
      if (!result.locked && lockedRef.current) {
        lockedRef.current = false;
        setLocked(false);
        showToast("Le professeur a déverrouillé l'évaluation.");
        void flushSaves();
      } else if (result.locked && !lockedRef.current) {
        lockedRef.current = true;
        setLocked(true);
      }
    };
    const timer = window.setInterval(beat, HEARTBEAT);
    return () => window.clearInterval(timer);
  }, [attempt.id, finish, flushSaves, showToast]);

  // Compte à rebours ; la copie part d'elle-même à la fin du temps.
  const deadline = attempt.deadline ? Date.parse(attempt.deadline) : null;
  useEffect(() => {
    if (!deadline) return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const submit = useCallback(async () => {
    setSubmitting(true);
    await flushSaves();
    const result = await submitEvaluation(attempt.id, evaluation.id);
    setSubmitting(false);
    setConfirmSubmit(false);
    if (result.ok) finish("Copie rendue.");
    else showToast(result.error);
  }, [attempt.id, evaluation.id, finish, flushSaves, showToast]);

  const timeUp = deadline !== null && now !== null && now >= deadline;
  useEffect(() => {
    if (timeUp && !finishedRef.current && !lockedRef.current) void submit();
  }, [timeUp, submit]);

  const share = async () => {
    setShareError(null);
    pickingRef.current = true;
    // Fenêtre de choix laissée ouverte : la surveillance reprend au bout de 20 secondes.
    const giveUp = window.setTimeout(() => {
      pickingRef.current = false;
    }, 20_000);
    const result = await startScreenCapture();
    window.clearTimeout(giveUp);
    // Le navigateur rend le focus à la page juste après le choix de l'écran.
    window.setTimeout(() => {
      pickingRef.current = false;
    }, ARM_DELAY);
    if (!result.ok) {
      setShareError(result.reason);
      return;
    }
    setNeedsShare(false);
  };

  const current = exercises.find((exercise) => exercise.id === selectedId) ?? exercises[0];
  const labExercise = useMemo<LabExercise | null>(
    () =>
      current
        ? {
            id: `evaluation-${attempt.id}-${current.id}`,
            label: current.label,
            courseId: "evaluation",
            courseTitle: evaluation.title,
            content: current.statement,
            starterCode: current.starter || undefined,
            sqlSetup: current.sqlSetup || undefined,
            pythonPackages: current.packages?.length ? current.packages : undefined,
            chapter: "",
            level: "",
            fileName: current.id,
            type: current.type,
            hasVerification: false,
          }
        : null,
    [attempt.id, current, evaluation.title],
  );

  if (finished) {
    return (
      <div className="eval-shell is-done">
        <div className="eval-done">
          <Check size={28} aria-hidden />
          <h1>{finished}</h1>
          <p>Le code de chaque exercice est enregistré. La page peut être fermée.</p>
        </div>
      </div>
    );
  }

  const remaining = deadline && now !== null ? deadline - now : null;

  return (
    <div className="eval-shell">
      <header className="eval-bar">
        <div className="eval-bar-title">
          <ShieldAlert size={18} aria-hidden />
          <b>{evaluation.title}</b>
        </div>
        {remaining !== null ? (
          <span className={`eval-timer ${remaining < 5 * 60_000 ? "is-short" : ""}`}>
            <TimerReset size={15} aria-hidden /> {formatRemaining(remaining)}
          </span>
        ) : null}
        <span className={`eval-save is-${saveState}`}>
          {saveState === "saving" ? <Loader2 size={14} className="animate-spin" aria-hidden /> : saveState === "error" ? <CloudOff size={14} aria-hidden /> : <Check size={14} aria-hidden />}
          {saveState === "saving" ? "Enregistrement…" : saveState === "error" ? "Non enregistré, nouvel essai à la prochaine frappe" : "Enregistré"}
        </span>
        <button type="button" className="eval-submit" onClick={() => setConfirmSubmit(true)}>
          <Send size={15} aria-hidden /> Rendre la copie
        </button>
      </header>

      <div className="eval-body">
        <nav className="eval-list" aria-label="Exercices">
          {exercises.map((exercise, index) => (
            <button
              key={exercise.id}
              type="button"
              className={`eval-item ${exercise.id === current?.id ? "is-current" : ""}`}
              aria-current={exercise.id === current?.id ? "true" : undefined}
              onClick={() => {
                void flushSaves();
                setSelectedId(exercise.id);
              }}
            >
              <span className={`eval-dot ${savedIds.has(exercise.id) ? "is-saved" : ""}`} aria-hidden>{index + 1}</span>
              <span>{exercise.label}</span>
            </button>
          ))}
        </nav>
        <main className="eval-main">
          {current && labExercise ? (
            <>
              <div className="eval-statement">
                <ExerciseStatement label={current.label} content={current.statement} />
              </div>
              <ExerciseWorkspace
                exercise={labExercise}
                nav={null}
                embedded
                lockdown
                initialCode={codes[current.id]}
                onCodeChange={(code) => onCodeChange(current.id, code)}
              />
            </>
          ) : null}
        </main>
      </div>

      {toast ? <div className="eval-toast" role="status">{toast}</div> : null}

      {needsShare && !locked ? (
        <div className="eval-overlay is-opaque">
          <div className="eval-card">
            <MonitorUp size={28} aria-hidden />
            <h2>Partager l&apos;écran pour continuer</h2>
            <p>Choisir « Écran entier » dans la fenêtre du navigateur. Une image n&apos;est prise que si l&apos;évaluation se verrouille.</p>
            {shareError ? <p className="eval-error">{shareError}</p> : null}
            <button type="button" className="eval-primary" onClick={share}>Partager l&apos;écran</button>
          </div>
        </div>
      ) : null}

      {confirmSubmit ? (
        <div className="eval-overlay">
          <div className="eval-card">
            <Send size={26} aria-hidden />
            <h2>Rendre la copie ?</h2>
            <p>Le code ne pourra plus être modifié.</p>
            <div className="eval-actions">
              <button type="button" className="eval-secondary" onClick={() => setConfirmSubmit(false)} disabled={submitting}>Continuer</button>
              <button type="button" className="eval-primary" onClick={submit} disabled={submitting}>
                {submitting ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Rendre
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {locked ? (
        <div className="eval-overlay is-lock" ref={lockRef}>
          <LockPanel
            attemptId={attempt.id}
            onResume={() => {
              lockedRef.current = false;
              setLocked(false);
              if (captureSupported() && !captureActive()) setNeedsShare(true);
              void flushSaves();
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function LockPanel({ attemptId, onResume }: { attemptId: string; onResume: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<UnlockedIncident[] | null>(null);

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await unlockEvaluation(attemptId, code);
    setBusy(false);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    if (result.status === "refuse") setMessage("Code incorrect.");
    else if (result.status === "attente") setMessage("Trop d'essais : attendre une minute.");
    else if (result.status === "deverrouillee") onResume();
    else setIncidents(result.incidents);
    setCode("");
  };

  if (incidents) {
    return (
      <div className="eval-card is-wide">
        <h2>Pourquoi la page s&apos;est verrouillée</h2>
        {incidents.length === 0 ? <p>Aucun incident enregistré.</p> : null}
        <ol className="eval-incidents">
          {incidents.map((incident, index) => (
            <li key={index}>
              <p>
                <b>{INCIDENT_LABELS[incident.kind] ?? incident.kind}</b>
                <span>{timeFormat.format(new Date(incident.createdAt))}</span>
              </p>
              {incident.detail ? <pre>{incident.detail}</pre> : null}
              {incident.screenshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={incident.screenshot} alt={`Écran au moment de l'incident : ${INCIDENT_LABELS[incident.kind] ?? incident.kind}`} />
              ) : null}
            </li>
          ))}
        </ol>
        <button type="button" className="eval-primary" onClick={onResume}>Reprendre l&apos;évaluation</button>
      </div>
    );
  }

  return (
    <form className="eval-card" onSubmit={unlock}>
      <Lock size={30} aria-hidden />
      <h2>Attente du professeur</h2>
      <p>L&apos;évaluation est verrouillée : la page a quitté le premier plan, ou un texte venu d&apos;ailleurs a été collé. Le professeur va saisir le code de déverrouillage.</p>
      <label className="eval-code">
        <span>Code du professeur</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
          maxLength={12}
          inputMode="text"
          aria-describedby="eval-lock-message"
        />
      </label>
      {message ? <p id="eval-lock-message" className="eval-error">{message}</p> : null}
      <button type="submit" className="eval-primary" disabled={busy || code.trim().length < 4}>
        {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Déverrouiller
      </button>
    </form>
  );
}
