"use client";

import { useEffect } from "react";

// Touches qui ouvrent la recherche rapide de Firefox hors d'un champ : « / », « ' », et le point du pavé numérique
// (signalé par un élève sous Linux, où le point du pavé ouvre la barre de recherche de la page).
const QUICK_FIND_KEYS = new Set(["/", "'", ".", ","]);

function isEditable(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  return ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || Boolean(target.closest("[contenteditable='true'], .cm-editor, .monaco-editor"));
}

/**
 * Empêche la barre de recherche de Firefox de s'ouvrir quand un élève tape une de ces touches en dehors d'un champ
 * (par exemple en voulant écrire un nombre décimal). Ctrl+F reste disponible ; rien ne change dans les champs de saisie.
 */
export function NoQuickFind() {
  useEffect(() => {
    const onKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (!QUICK_FIND_KEYS.has(event.key) && event.code !== "NumpadDecimal") return;
      if (isEditable(event.target)) return;
      event.preventDefault();
    };
    window.addEventListener("keypress", onKeyPress, true);
    return () => window.removeEventListener("keypress", onKeyPress, true);
  }, []);
  return null;
}
