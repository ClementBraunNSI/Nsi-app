"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Flag, Loader2, Lock, MonitorUp, ShieldAlert, TimerReset } from "lucide-react";
import type { ExerciseCheckResult, LabExercise } from "@/app/actions/getExercises";
import {
  challengeHeartbeat,
  finishChallenge,
  reportChallengeIncident,
  startChallenge,
  unlockChallenge,
  type UnlockedIncident,
} from "@/app/actions/challenges";
import type { EvaluationExercise } from "@/lib/evaluation-subject";
import { formatRemaining, INCIDENT_LABELS, isAllowedPaste, LOCK_FALLBACK, LOCK_MESSAGES, type IncidentKind } from "@/lib/evaluation-guard";
import type { MyChallenge } from "@/lib/challenges";
import { latestLevelCode, LeveledExercise } from "./LeveledExercise";
import { ExerciseStatement } from "@/components/lab/ExerciseStatement";
import { ExerciseWorkspace } from "@/components/lab/ExerciseWorkspace";
import {
  captureActive,
  captureSupported,
  grabScreenshot,
  onCaptureEnded,
  startScreenCapture,
  stopScreenCapture,
} from "@/components/evaluations/screen-capture";

/*
 * Défi du lundi surveillé : les règles et la surveillance des évaluations pratiques (EvaluationRunner),
 * appliquées au défi. Le code n'est enregistré qu'à la vérification, comme pour un défi sans surveillance.
 */

const HEARTBEAT = 10_000;
// Le temps de laisser l'autre fenêtre s'afficher avant de prendre l'image de l'écran.
const SCREENSHOT_DELAY = 900;
// Après le partage d'écran, le navigateur rend la main à la page : pas de verrouillage pendant ce temps.
const ARM_DELAY = 1500;

const RULES = [
  "Garder cette page seule ouverte, dans un seul onglet.",
  "Ne pas changer d'onglet, de fenêtre ni d'application, et ne pas réduire le navigateur.",
  "Ne pas coller de texte venu d'ailleurs. Copier-coller du code déjà écrit dans l'éditeur reste permis.",
  "Partager l'écran entier au début ; ne pas toucher à la barre de partage du navigateur ensuite.",
  "Au moindre écart, la page se verrouille : attendre le professeur, qui la débloque avec un code.",
  "Seul le code vérifié est enregistré : penser à cliquer sur « Vérifier ».",
];

const timeFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "medium" });

const CHALLENGE_LOCK_MESSAGES: Partial<Record<IncidentKind, string>> = {
  ...LOCK_MESSAGES,
  onglet: "La page du défi a été quittée : changement d'onglet, fenêtre réduite ou autre bureau.",
  double_onglet: "Le défi a été ouvert dans un second onglet ou une seconde fenêtre.",
};

// Réouvertures déjà notées pendant ce chargement de page (React peut monter le composant deux fois).
const reopenReported = new Set<string>();

/** Clé de session : posée au début du défi, pour ne pas noter ce premier affichage comme une réouverture. */
const freshStartKey = (challengeId: string) => `defi-debut-${challengeId}`;

/** Écran d'accueil du défi surveillé : règles, partage de l'écran, puis départ du chrono. */
export function ChallengeStart({ challenge, onStarted }: { challenge: MyChallenge; onStarted: (startedAt: string) => void }) {
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Lu après le premier rendu : le serveur ne connaît pas le navigateur.
  const [supported, setSupported] = useState(true);
  useEffect(() => setSupported(captureSupported()), []);

  const start = async () => {
    setBusy(true);
    setError(null);
    // Le partage se demande d'abord : il faut le clic de l'élève pour ouvrir la fenêtre du navigateur.
    if (captureSupported()) {
      const shared = await startScreenCapture();
      if (!shared.ok) {
        setBusy(false);
        setError(shared.reason);
        return;
      }
    }
    const startedAt = await startChallenge(challenge.id);
    if (!startedAt) {
      setBusy(false);
      setError("Le défi n'a pas pu commencer.");
      return;
    }
    try {
      sessionStorage.setItem(freshStartKey(challenge.id), startedAt);
    } catch {
      /* stockage indisponible : le premier affichage sera noté comme une réouverture */
    }
    onStarted(startedAt);
  };

  return (
    <div className="challenge-start">
      <p className="challenge-meta">
        {challenge.timeLimitMinutes ? `${challenge.timeLimitMinutes} minutes à partir du début.` : "Pas de limite de temps."} Le défi se fait dans les mêmes conditions qu&apos;une évaluation.
      </p>
      <h3>Règles</h3>
      <ol className="eval-rules">
        {RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ol>
      {!supported ? (
        <p className="eval-note">Ce navigateur ne permet pas le partage d&apos;écran : le défi fonctionne, sans capture en cas d&apos;incident.</p>
      ) : null}
      <label className="eval-accept">
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        <span>Les règles sont lues et acceptées.</span>
      </label>
      {error ? <p className="eval-error">{error}</p> : null}
      <button type="button" className="eval-primary" disabled={!accepted || busy} onClick={start}>
        {busy ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <MonitorUp size={16} aria-hidden />}
        Partager l&apos;écran et commencer
      </button>
    </div>
  );
}

type RunnerProps = {
  challenge: MyChallenge;
  /** Fin du temps de l'élève (ms), ou null sans limite. */
  deadline: number | null;
  remaining: number | null;
  /** Un élément par exercice : son niveau 1 (`exercise`), l'éditeur et tous ses niveaux. */
  labs: { exercise: EvaluationExercise; lab: LabExercise; levels: EvaluationExercise[] }[];
  isPassed: (exerciseId: string) => boolean;
  allPassed: boolean;
  checker: (exerciseId: string, code: string) => Promise<ExerciseCheckResult>;
  onPassed: (exerciseId: string) => void;
  /** L'élève quitte la page surveillée : défi arrêté ou réussi. */
  onLeave: (reason: "arret" | "reussi") => void;
};

/** Le défi en cours, en plein écran, sous surveillance. */
export function ProctoredRunner({ challenge, deadline, remaining, labs, isPassed, allPassed, checker, onPassed, onLeave }: RunnerProps) {
  const answers = challenge.mine?.answers ?? {};
  const [codes, setCodes] = useState<Record<string, string | undefined>>(() =>
    Object.fromEntries(labs.map(({ exercise, levels }) => [exercise.id, latestLevelCode(levels, answers)])),
  );
  const [selectedId, setSelectedId] = useState(labs[0]?.exercise.id ?? "");
  const [locked, setLocked] = useState(Boolean(challenge.mine?.locked));
  // Cause affichée à l'élève : le dernier incident qui a verrouillé la page.
  const [lockReason, setLockReason] = useState<IncidentKind | null>(challenge.mine?.lockReason ?? null);
  const [needsShare, setNeedsShare] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [confirmStop, setConfirmStop] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const armedRef = useRef(false);
  // Fenêtre de choix du partage d'écran ouverte : le navigateur prend le focus, ce n'est pas un incident.
  const pickingRef = useRef(false);
  // Versions précédentes du code : coller un passage coupé plus tôt dans l'éditeur reste permis.
  const historyRef = useRef<string[]>([]);
  const lockedRef = useRef(Boolean(challenge.mine?.locked));
  const finishedRef = useRef(false);
  const codesRef = useRef(codes);
  const copiedRef = useRef<string[]>([]);
  const lockRef = useRef<HTMLDivElement>(null);
  const deadlineRef = useRef(deadline);
  codesRef.current = codes;
  deadlineRef.current = deadline;

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast((value) => (value === message ? null : value)), 3500);
  }, []);

  const writtenCodes = () => [...Object.values(codesRef.current).filter((code): code is string => Boolean(code)), ...historyRef.current];

  const onCodeChange = useCallback((exerciseId: string, code: string) => {
    const previous = codesRef.current[exerciseId];
    if (previous === code) return;
    if (previous) historyRef.current = [...historyRef.current.slice(-59), previous];
    codesRef.current = { ...codesRef.current, [exerciseId]: code };
    setCodes(codesRef.current);
  }, []);

  // ---------- Verrouillage ----------

  const violation = useCallback(
    (kind: IncidentKind, detail = "") => {
      if (!armedRef.current || finishedRef.current || pickingRef.current) return;
      lockedRef.current = true;
      setLocked(true);
      setLockReason(kind);
      void (async () => {
        const result = await reportChallengeIncident(challenge.id, kind, detail);
        if (!result.ok || !result.incidentId) return;
        const wait = kind === "onglet" || kind === "application" ? SCREENSHOT_DELAY : 150;
        await new Promise((resolve) => window.setTimeout(resolve, wait));
        const image = await grabScreenshot();
        if (!image) return;
        await fetch("/api/defis/signal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "capture", incidentId: result.incidentId, image }),
          keepalive: image.length < 60_000,
        }).catch(() => undefined);
      })();
    },
    [challenge.id],
  );

  const arm = useCallback(() => {
    window.setTimeout(() => {
      if (!finishedRef.current) armedRef.current = true;
    }, ARM_DELAY);
  }, []);

  /** Fin de la surveillance : défi réussi, arrêté ou temps écoulé. */
  const disarm = useCallback(() => {
    finishedRef.current = true;
    armedRef.current = false;
    stopScreenCapture();
  }, []);

  // Premier affichage : la surveillance démarre ; un rechargement de la page est noté comme une réouverture.
  useEffect(() => {
    let fresh = false;
    try {
      fresh = Boolean(sessionStorage.getItem(freshStartKey(challenge.id)));
      sessionStorage.removeItem(freshStartKey(challenge.id));
    } catch {
      fresh = false;
    }
    if (!fresh && !reopenReported.has(challenge.id)) void reportChallengeIncident(challenge.id, "reprise", "");
    reopenReported.add(challenge.id);
    setNeedsShare(captureSupported() && !captureActive());
    arm();
  }, [arm, challenge.id]);

  // Tous les exercices réussis : la surveillance s'arrête, la page reste ouverte pour voir le succès.
  useEffect(() => {
    if (allPassed) disarm();
  }, [allPassed, disarm]);

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
      if (isAllowedPaste(text, copiedRef.current, writtenCodes())) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      violation("collage", text || "(contenu non textuel : image ou fichier)");
    };
    const onDrop = (event: DragEvent) => {
      if (!armedRef.current) return;
      const text = event.dataTransfer?.getData("text/plain") ?? "";
      const files = event.dataTransfer?.files?.length ?? 0;
      if (!files && isAllowedPaste(text, copiedRef.current, writtenCodes())) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      violation("depot", text || `${files} fichier(s) déposé(s)`);
    };
    const onCopy = (event: ClipboardEvent) => {
      if (insideLock(event.target) || finishedRef.current) return;
      const target = event.target as HTMLElement | null;
      const inEditor = Boolean(target?.closest?.(".exercise-editor"));
      if (!inEditor) {
        // Copier l'énoncé ne sert qu'à le coller ailleurs : la copie est simplement bloquée.
        event.preventDefault();
        showToast("La copie de texte hors de l'éditeur est désactivée pendant le défi.");
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

    // Un second onglet sur le même défi : les deux se verrouillent.
    const tabId = Math.random().toString(36).slice(2);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(`defi-${challenge.id}`);
      channel.onmessage = (event) => {
        if (event.data?.tab === tabId) return;
        if (event.data?.type === "bonjour") channel?.postMessage({ type: "deja-ouverte", tab: tabId });
        violation("double_onglet", "Le défi est ouvert dans un autre onglet ou une autre fenêtre.");
      };
      channel.postMessage({ type: "bonjour", tab: tabId });
    } catch {
      channel = null;
    }

    const offCapture = onCaptureEnded(() => {
      if (finishedRef.current) return;
      violation("partage_arrete", "Le partage de l'écran a été arrêté.");
      setNeedsShare(captureSupported());
    });

    const onLeavePage = () => {
      if (!armedRef.current || finishedRef.current) return;
      navigator.sendBeacon?.("/api/defis/signal", JSON.stringify({ type: "fermeture", challengeId: challenge.id }));
    };
    window.addEventListener("pagehide", onLeavePage);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("paste", onPaste, true);
      window.removeEventListener("drop", onDrop, true);
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("cut", onCopy);
      window.removeEventListener("pagehide", onLeavePage);
      channel?.close();
      offCapture();
    };
    // writtenCodes ne lit que des refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge.id, showToast, violation]);

  // Fin du temps : la page surveillée disparaît, ce n'est pas une fermeture.
  useEffect(() => () => {
    const timeUp = deadlineRef.current !== null && Date.now() >= deadlineRef.current;
    if (timeUp) disarm();
    if (armedRef.current && !finishedRef.current) {
      navigator.sendBeacon?.("/api/defis/signal", JSON.stringify({ type: "fermeture", challengeId: challenge.id }));
    }
  }, [challenge.id, disarm]);

  // Présence, et déverrouillage à distance par l'enseignant.
  useEffect(() => {
    const beat = async () => {
      if (finishedRef.current) return;
      const result = await challengeHeartbeat(challenge.id);
      if (!result.ok) return;
      if (!result.locked && lockedRef.current) {
        lockedRef.current = false;
        setLocked(false);
        showToast("Le professeur a déverrouillé le défi.");
      } else if (result.locked && !lockedRef.current) {
        lockedRef.current = true;
        setLocked(true);
      }
      if (result.locked && result.lockReason) setLockReason(result.lockReason);
    };
    const timer = window.setInterval(beat, HEARTBEAT);
    return () => window.clearInterval(timer);
  }, [challenge.id, showToast]);

  const stop = async () => {
    setStopping(true);
    const result = await finishChallenge(challenge.id);
    setStopping(false);
    setConfirmStop(false);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    disarm();
    onLeave("arret");
  };

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

  const current = labs.find(({ exercise }) => exercise.id === selectedId) ?? labs[0];
  const passedCount = labs.filter(({ exercise }) => isPassed(exercise.id)).length;

  return (
    <div className="eval-shell">
      <header className="eval-bar">
        <div className="eval-bar-title">
          <ShieldAlert size={18} aria-hidden />
          <b>{challenge.title}</b>
        </div>
        {remaining !== null && !allPassed ? (
          <span className={`eval-timer ${remaining < 2 * 60_000 ? "is-short" : ""}`} role="timer" aria-live="off">
            <TimerReset size={15} aria-hidden /> {formatRemaining(remaining)}
          </span>
        ) : null}
        <span className="eval-save">
          {passedCount} / {labs.length} réussi{passedCount > 1 ? "s" : ""}
        </span>
        {allPassed ? (
          <button type="button" className="eval-submit" onClick={() => onLeave("reussi")}>
            <Check size={15} aria-hidden /> Défi réussi : quitter
          </button>
        ) : (
          <button type="button" className="eval-submit" onClick={() => setConfirmStop(true)}>
            <Flag size={15} aria-hidden /> Arrêter le défi
          </button>
        )}
      </header>

      <div className="eval-body">
        <nav className="eval-list" aria-label="Exercices">
          {labs.map(({ exercise }, index) => (
            <button
              key={exercise.id}
              type="button"
              className={`eval-item ${exercise.id === current?.exercise.id ? "is-current" : ""}`}
              aria-current={exercise.id === current?.exercise.id ? "true" : undefined}
              onClick={() => setSelectedId(exercise.id)}
            >
              <span className={`eval-dot ${isPassed(exercise.id) ? "is-saved" : ""}`} aria-hidden>{isPassed(exercise.id) ? <Check size={12} /> : index + 1}</span>
              <span>{exercise.label}</span>
            </button>
          ))}
        </nav>
        <main className="eval-main">
          {current ? (
            <>
              <LeveledExercise
                key={current.exercise.id}
                challengeId={challenge.id}
                challengeTitle={challenge.title}
                levels={current.levels}
                answers={answers}
                isPassed={isPassed}
                checker={checker}
                onPassed={onPassed}
                statementClassName="eval-statement"
                lockdown
                initialCode={codes[current.exercise.id] ?? latestLevelCode(current.levels, answers)}
                onCodeChange={(code) => onCodeChange(current.exercise.id, code)}
              />
            </>
          ) : null}
        </main>
      </div>

      {toast ? <div className="eval-toast" role="status">{toast}</div> : null}

      {needsShare && !locked && !allPassed ? (
        <div className="eval-overlay is-opaque">
          <div className="eval-card">
            <MonitorUp size={28} aria-hidden />
            <h2>Partager l&apos;écran pour continuer</h2>
            <p>Choisir « Écran entier » dans la fenêtre du navigateur. Une image n&apos;est prise que si le défi se verrouille.</p>
            {shareError ? <p className="eval-error">{shareError}</p> : null}
            <button type="button" className="eval-primary" onClick={share}>Partager l&apos;écran</button>
          </div>
        </div>
      ) : null}

      {confirmStop ? (
        <div className="eval-overlay">
          <div className="eval-card">
            <Flag size={26} aria-hidden />
            <h2>Arrêter le défi ?</h2>
            <p>Les exercices déjà réussis restent réussis. Plus rien ne sera enregistré ensuite.</p>
            <div className="eval-actions">
              <button type="button" className="eval-secondary" onClick={() => setConfirmStop(false)} disabled={stopping}>Continuer</button>
              <button type="button" className="eval-primary" onClick={stop} disabled={stopping}>
                {stopping ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Arrêter
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {locked ? (
        <div className="eval-overlay is-lock" ref={lockRef}>
          <LockPanel
            challengeId={challenge.id}
            reason={lockReason}
            onResume={() => {
              lockedRef.current = false;
              setLocked(false);
              if (captureSupported() && !captureActive()) setNeedsShare(true);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

function LockPanel({ challengeId, reason, onResume }: { challengeId: string; reason: IncidentKind | null; onResume: () => void }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [incidents, setIncidents] = useState<UnlockedIncident[] | null>(null);

  const unlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    const result = await unlockChallenge(challengeId, code);
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
        <button type="button" className="eval-primary" onClick={onResume}>Reprendre le défi</button>
      </div>
    );
  }

  return (
    <form className="eval-card" onSubmit={unlock}>
      <Lock size={30} aria-hidden />
      <h2>Attente du professeur</h2>
      <p className="eval-lock-reason">{(reason && CHALLENGE_LOCK_MESSAGES[reason]) || LOCK_FALLBACK}</p>
      <p>Le défi est verrouillé et le chrono continue. Le professeur va venir saisir le code de déverrouillage.</p>
      <label className="eval-code">
        <span>Code du professeur</span>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
          maxLength={12}
          inputMode="text"
          aria-describedby="defi-lock-message"
        />
      </label>
      {message ? <p id="defi-lock-message" className="eval-error">{message}</p> : null}
      <button type="submit" className="eval-primary" disabled={busy || code.trim().length < 4}>
        {busy ? <Loader2 size={15} className="animate-spin" aria-hidden /> : null} Déverrouiller
      </button>
    </form>
  );
}
