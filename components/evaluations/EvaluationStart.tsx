"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MonitorUp } from "lucide-react";
import { startEvaluation } from "@/app/actions/evaluations";
import { freshStartKey } from "./EvaluationRunner";
import { captureSupported, startScreenCapture } from "./screen-capture";

const RULES = [
  "Garder cette page seule ouverte, dans un seul onglet.",
  "Ne pas changer d'onglet, de fenêtre ni d'application, et ne pas réduire le navigateur.",
  "Ne pas coller de texte venu d'ailleurs. Copier-coller du code déjà écrit dans l'éditeur reste permis.",
  "Partager l'écran entier au début ; ne pas toucher à la barre de partage du navigateur ensuite.",
  "Au moindre écart, la page se verrouille : attendre le professeur, qui la débloque avec un code.",
  "Le code est enregistré automatiquement. Une extinction du poste ou un plantage du navigateur ne fait rien perdre.",
];

export default function EvaluationStart({ evaluationId, title, description, durationMinutes }: {
  evaluationId: string;
  title: string;
  description: string;
  durationMinutes: number | null;
}) {
  const router = useRouter();
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
    const result = await startEvaluation(evaluationId);
    if (!result.ok) {
      setBusy(false);
      setError(result.error);
      return;
    }
    try {
      sessionStorage.setItem(freshStartKey(evaluationId), result.attemptId);
    } catch {
      /* stockage indisponible : le premier affichage sera noté comme une réouverture */
    }
    router.refresh();
  };

  return (
    <section className="eval-start">
      <p className="eval-start-eyebrow">Évaluation</p>
      <h1>{title}</h1>
      {description ? <p className="eval-start-desc">{description}</p> : null}
      <p className="eval-start-meta">{durationMinutes ? `Durée : ${durationMinutes} minutes à partir du début.` : "Pas de limite de temps : la copie part quand elle est rendue ou quand le professeur ferme l'évaluation."}</p>
      <h2>Règles</h2>
      <ol className="eval-rules">
        {RULES.map((rule) => <li key={rule}>{rule}</li>)}
      </ol>
      {!supported ? (
        <p className="eval-note">Ce navigateur ne permet pas le partage d&apos;écran : l&apos;évaluation fonctionne, sans capture en cas d&apos;incident.</p>
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
    </section>
  );
}
