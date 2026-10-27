"use client";

import { useEffect, useState } from "react";
import { Check, Clock, MessageSquareWarning, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { submitWrittenAnswer } from "@/app/actions/submissions";

type Last = {
  status: "auto" | "en_attente" | "validee" | "a_revoir";
  feedback: string | null;
  content: string;
  created_at: string;
};

const draftKey = (exerciseId: string) => `reponse-brouillon-${exerciseId}`;

function readDraft(exerciseId: string) {
  try {
    return localStorage.getItem(draftKey(exerciseId)) ?? "";
  } catch {
    return "";
  }
}

function writeDraft(exerciseId: string, value: string) {
  try {
    if (value) localStorage.setItem(draftKey(exerciseId), value);
    else localStorage.removeItem(draftKey(exerciseId));
  } catch {
    /* stockage indisponible : le brouillon n'est pas gardé */
  }
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" });

/** Réponse écrite à un exercice sans éditeur : enregistrée en base, validée ou renvoyée par l'enseignant. */
export default function WrittenAnswer({ exerciseId }: { exerciseId: string }) {
  const [text, setText] = useState("");
  const [last, setLast] = useState<Last | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setText(readDraft(exerciseId));
    setError(null);
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from("exercise_submissions")
        .select("status, feedback, content, created_at")
        .eq("user_id", session.user.id)
        .eq("exercise_id", exerciseId)
        .eq("kind", "reponse")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!cancelled) {
        setLast((data as Last | null) ?? null);
        if (data && !readDraft(exerciseId)) setText(String(data.content || ""));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [exerciseId]);

  const send = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    setError(null);
    const result = await submitWrittenAnswer(exerciseId, text).catch(() => ({ ok: false as const, error: "La réponse n'a pas pu être envoyée." }));
    setSending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    writeDraft(exerciseId, "");
    setLast({ status: "en_attente", feedback: null, content: text.trim(), created_at: result.createdAt });
  };

  return (
    <section className="written-answer" aria-label="Rendre ma réponse">
      <label htmlFor={`reponse-${exerciseId}`} className="written-answer-title">
        Ma réponse
      </label>
      <p className="written-answer-help">
        Écrire la réponse ici, puis la rendre : elle est enregistrée et l'enseignant la valide.
      </p>
      <textarea
        id={`reponse-${exerciseId}`}
        className="written-answer-input"
        value={text}
        rows={6}
        maxLength={60000}
        onChange={(event) => {
          setText(event.target.value);
          writeDraft(exerciseId, event.target.value);
        }}
      />
      <div className="written-answer-bar">
        <button type="button" className="exercise-start" onClick={send} disabled={sending || !text.trim()}>
          <Send size={16} aria-hidden="true" />
          {sending ? "Envoi…" : last ? "Rendre à nouveau" : "Rendre ma réponse"}
        </button>
        {last ? (
          <span className={`written-answer-status is-${last.status}`}>
            {last.status === "validee" ? <Check size={14} aria-hidden /> : last.status === "a_revoir" ? <MessageSquareWarning size={14} aria-hidden /> : <Clock size={14} aria-hidden />}
            {last.status === "validee" ? "Validée" : last.status === "a_revoir" ? "À revoir" : "En attente de correction"}
            {" · "}
            {dateFormat.format(new Date(last.created_at))}
          </span>
        ) : null}
      </div>
      {last?.feedback ? (
        <p className="written-answer-feedback">
          <strong>Retour de l'enseignant :</strong> {last.feedback}
        </p>
      ) : null}
      {error ? <p className="written-answer-error" role="alert">{error}</p> : null}
    </section>
  );
}
