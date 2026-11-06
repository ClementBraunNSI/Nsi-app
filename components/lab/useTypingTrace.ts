"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import {
  newTrace,
  pasteAllowed,
  recordEdit,
  recordMark,
  replayTrace,
  sanitizeTrace,
  type TypingTrace,
} from "@/lib/typing-trace";

const traceKey = (exerciseId: string) => `suivi-frappe-${exerciseId}`;

function readTrace(exerciseId: string) {
  try {
    const raw = localStorage.getItem(traceKey(exerciseId));
    return raw ? sanitizeTrace(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeTrace(exerciseId: string, trace: TypingTrace) {
  try {
    localStorage.setItem(traceKey(exerciseId), JSON.stringify(trace));
  } catch {
    /* stockage plein ou indisponible : l'historique repartira de l'état du code */
  }
}

/**
 * Suivi de frappe de l'éditeur d'un exercice. Chaque modification du code est notée, collages compris : rien n'est
 * bloqué, mais un collage venu d'ailleurs que l'éditeur est marqué pour l'enseignant. L'historique survit au
 * rechargement tant que le code du navigateur est celui qu'il redonne.
 */
export function useTypingTrace({
  exerciseId,
  starter,
  enabled,
  containerRef,
  getCode,
}: {
  exerciseId: string;
  starter: string;
  enabled: boolean;
  containerRef: RefObject<HTMLElement | null>;
  getCode: () => string;
}) {
  const traceRef = useRef<TypingTrace | null>(null);
  const pastedRef = useRef<{ text: string; external: boolean } | null>(null);
  const knownRef = useRef<string[]>([]);
  const copiedRef = useRef<string[]>([]);
  const saveTimer = useRef<number | null>(null);
  const getCodeRef = useRef(getCode);
  getCodeRef.current = getCode;

  const save = useCallback(() => {
    if (saveTimer.current !== null) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveTimer.current = null;
      if (traceRef.current) writeTrace(exerciseId, traceRef.current);
    }, 800);
  }, [exerciseId]);

  /** Code chargé dans l'éditeur : on reprend l'historique s'il mène bien à ce code, sinon on repart de lui. */
  const begin = useCallback(
    (code: string) => {
      if (!enabled) {
        traceRef.current = null;
        return;
      }
      const stored = readTrace(exerciseId);
      traceRef.current = stored && replayTrace(stored) === code ? stored : newTrace(code);
      knownRef.current = [starter];
      copiedRef.current = [];
      pastedRef.current = null;
    },
    [enabled, exerciseId, starter],
  );

  const onEdit = useCallback(
    (prev: string, next: string) => {
      const trace = traceRef.current;
      if (!trace || prev === next) return;
      recordEdit(trace, prev, next, {
        pasted: pastedRef.current?.text,
        external: pastedRef.current?.external,
        known: [...knownRef.current, prev],
      });
      pastedRef.current = null;
      // Ce qui est effacé peut revenir (annuler, couper puis coller) sans compter comme un texte venu d'ailleurs.
      const removed = (() => {
        let start = 0;
        while (start < prev.length && start < next.length && prev[start] === next[start]) start += 1;
        let end = 0;
        while (end < prev.length - start && end < next.length - start && prev[prev.length - 1 - end] === next[next.length - 1 - end]) end += 1;
        return prev.slice(start, prev.length - end);
      })();
      if (removed.length > 2) knownRef.current = [starter, ...knownRef.current.slice(1).slice(-19), removed];
      save();
    },
    [save, starter],
  );

  const mark = useCallback(
    (kind: "e" | "c") => {
      if (!traceRef.current) return;
      recordMark(traceRef.current, kind);
      save();
    },
    [save],
  );

  /** Historique à joindre à une vérification. */
  const snapshot = useCallback(() => (traceRef.current ? (JSON.parse(JSON.stringify(traceRef.current)) as TypingTrace) : null), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;
    const allowed = (text: string) => pasteAllowed(text, getCodeRef.current(), [...copiedRef.current, ...knownRef.current]);

    // Le collage passe toujours ; on retient seulement d'où il vient, pour l'enseignant.
    const onPaste = (event: ClipboardEvent) => {
      const text = event.clipboardData?.getData("text/plain") ?? "";
      pastedRef.current = { text, external: !allowed(text) };
    };
    const onDrop = (event: DragEvent) => {
      const text = event.dataTransfer?.getData("text/plain") ?? "";
      pastedRef.current = { text, external: !allowed(text) };
    };
    const onCopy = (event: ClipboardEvent) => {
      const target = event.target as HTMLElement | null;
      let text = event.clipboardData?.getData("text/plain") ?? "";
      if (!text && target instanceof HTMLTextAreaElement) text = target.value.slice(target.selectionStart, target.selectionEnd);
      if (!text) text = window.getSelection()?.toString() ?? "";
      if (text) copiedRef.current = [...copiedRef.current.slice(-19), text];
    };

    container.addEventListener("paste", onPaste, true);
    container.addEventListener("drop", onDrop, true);
    // Phase de bouillonnement : l'éditeur a déjà rempli le presse-papiers.
    container.addEventListener("copy", onCopy);
    container.addEventListener("cut", onCopy);
    return () => {
      container.removeEventListener("paste", onPaste, true);
      container.removeEventListener("drop", onDrop, true);
      container.removeEventListener("copy", onCopy);
      container.removeEventListener("cut", onCopy);
    };
  }, [containerRef, enabled]);

  // Sortir de la page (autre onglet, autre fenêtre) puis y revenir : noté dans l'historique.
  useEffect(() => {
    if (!enabled) return;
    const onVisibility = () => {
      if (!traceRef.current) return;
      recordMark(traceRef.current, document.hidden ? "h" : "v");
      save();
    };
    const onLeave = () => {
      if (traceRef.current) writeTrace(exerciseId, traceRef.current);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onLeave);
      onLeave();
    };
  }, [enabled, exerciseId, save]);

  return { begin, onEdit, mark, snapshot };
}

