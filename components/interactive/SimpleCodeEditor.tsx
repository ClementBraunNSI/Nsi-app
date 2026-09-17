"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type SimpleCodeEditorHandle = {
  focus: () => void;
  insertText: (text: string) => void;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  ariaLabel?: string;
  dark?: boolean;
};

const SimpleCodeEditor = forwardRef<SimpleCodeEditorHandle, Props>(function SimpleCodeEditor(
  {
    value,
    onChange,
    language = "code",
    height = "100%",
    ariaLabel = "Éditeur de code",
    dark = true,
  },
  ref,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const lineNumbers = useMemo(
    () => Array.from({ length: Math.max(1, value.split("\n").length) }, (_, index) => index + 1),
    [value],
  );

  const insertText = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(`${value}${text}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    onChange(`${value.slice(0, start)}${text}${value.slice(end)}`);
    requestAnimationFrame(() => {
      const cursor = start + text.length;
      textarea.setSelectionRange(cursor, cursor);
      textarea.focus();
    });
  };

  useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    insertText,
  }));

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    insertText("    ");
  };

  return (
    <div
      className={`relative flex min-h-0 overflow-hidden font-mono text-sm ${
        dark ? "bg-[#181c23] text-[#f5f1e8]" : "bg-[var(--surface)] text-[var(--fg)]"
      }`}
      style={{ height }}
      data-language={language}
    >
      <div
        aria-hidden="true"
        className={`w-11 shrink-0 overflow-hidden border-r py-3 text-right text-xs leading-6 select-none ${
          dark ? "border-white/8 bg-black/10 text-white/30" : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--subtle)]"
        }`}
      >
        <div style={{ transform: `translateY(-${scrollTop}px)` }}>
          {lineNumbers.map((line) => (
            <div key={line} className="h-6 pr-3">{line}</div>
          ))}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
        aria-label={ariaLabel}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className={`min-h-0 flex-1 resize-none overflow-auto border-0 bg-transparent px-3 py-3 leading-6 outline-none ${
          dark ? "caret-orange-400 selection:bg-orange-500/30" : "caret-[var(--accent)] selection:bg-[var(--accent-soft)]"
        }`}
      />
    </div>
  );
});

export default SimpleCodeEditor;
