"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

export type CodeAreaHandle = {
  /** Insère du texte au curseur, sur une nouvelle ligne si le curseur n'est pas en début de ligne. */
  insertLine: (text: string) => void;
  focus: () => void;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: "python" | "sql";
  /** Ligne surlignée en cours d'exécution (1 = première ligne). */
  activeLine?: number;
  /** Ligne surlignée en rouge après une erreur. */
  errorLine?: number;
  ariaLabel?: string;
  placeholder?: string;
};

const INDENT = "    ";
const LINE_HEIGHT = 22;
const PAD_TOP = 14;

/**
 * Éditeur léger : zone de texte à police fixe, numéros de ligne, Tab et retour à la ligne indentés
 * comme en Python. Sert sur les écrans tactiles (Monaco n'y accepte pas la saisie) et dans le jeu du renard.
 */
export const CodeArea = forwardRef<CodeAreaHandle, Props>(function CodeArea(
  { value, onChange, language, activeLine, errorLine, ariaLabel, placeholder },
  handle,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const lines = Math.max(1, value.split("\n").length);

  const replace = (start: number, end: number, text: string, caret: number) => {
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(caret, caret);
    });
  };

  useImperativeHandle(handle, () => ({
    insertLine: (text: string) => {
      const area = ref.current;
      const start = area ? area.selectionStart : value.length;
      const end = area ? area.selectionEnd : value.length;
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const before = value.slice(lineStart, start);
      const indent = before.match(/^\s*/)?.[0] ?? "";
      const atLineStart = before.trim() === "";
      const piece = atLineStart ? `${text}\n${indent}` : `\n${indent}${text}\n${indent}`;
      replace(start, end, piece, start + piece.length);
    },
    focus: () => ref.current?.focus(),
  }));

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const { selectionStart: start, selectionEnd: end } = event.currentTarget;
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) return;
    if (event.key === "Tab") {
      event.preventDefault();
      replace(start, end, INDENT, start + INDENT.length);
      return;
    }
    if (event.key === "Enter" && language === "python") {
      event.preventDefault();
      const lineStart = value.lastIndexOf("\n", start - 1) + 1;
      const line = value.slice(lineStart, start);
      const indent = line.match(/^\s*/)?.[0] ?? "";
      const extra = /:\s*(#.*)?$/.test(line) ? INDENT : "";
      const text = `\n${indent}${extra}`;
      replace(start, end, text, start + text.length);
    }
  };

  const bar = (line: number | undefined, className: string) =>
    line && line > 0 ? (
      <span className={className} style={{ top: PAD_TOP + (line - 1) * LINE_HEIGHT - scrollTop, height: LINE_HEIGHT }} aria-hidden />
    ) : null;

  return (
    <div className="code-area">
      <div className="code-area-gutter" aria-hidden style={{ transform: `translateY(${-scrollTop}px)` }}>
        {Array.from({ length: lines }, (_, index) => (
          <span key={index} className={index + 1 === activeLine ? "is-active" : index + 1 === errorLine ? "is-error" : undefined}>
            {index + 1}
          </span>
        ))}
      </div>
      <div className="code-area-main">
        {bar(errorLine, "code-area-line is-error")}
        {bar(activeLine, "code-area-line is-active")}
        <textarea
          ref={ref}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={onKeyDown}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label={ariaLabel ?? (language === "sql" ? "Éditeur SQL" : "Éditeur Python")}
          placeholder={placeholder ?? (language === "sql" ? "-- Écris ta requête ici" : "# Écris ton code ici")}
        />
      </div>
    </div>
  );
});
