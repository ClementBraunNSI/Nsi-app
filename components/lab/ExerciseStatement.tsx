"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BookOpen, ChevronDown, Lightbulb } from "lucide-react";
import { splitStatement } from "@/lib/exercise-statement";

type Props = {
  label: string;
  content: string;
};

function Markdown({ children }: { children: string }) {
  return (
    <div className="lab-prose prose prose-slate max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}

function Fold({
  title,
  hint = false,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: boolean;
  defaultOpen?: boolean;
  children: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={hint ? "exercise-fold is-hint" : "exercise-fold"}>
      <button
        type="button"
        className="exercise-fold-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {hint ? <Lightbulb size={16} className="exercise-fold-icon" aria-hidden /> : null}
        <span>{title}</span>
        <ChevronDown size={16} className={open ? "exercise-fold-chevron is-open" : "exercise-fold-chevron"} aria-hidden />
      </button>
      {open ? (
        <div className="exercise-fold-body">
          <Markdown>{children}</Markdown>
        </div>
      ) : null}
    </section>
  );
}

export function ExerciseStatement({ label, content }: Props) {
  const parts = splitStatement(content, label);
  return (
    <div className="exercise-statement">
      <section>
        <h2 className="exercise-enonce-title">
          <BookOpen size={16} aria-hidden />
          Énoncé
        </h2>
        {parts.enonce ? <Markdown>{parts.enonce}</Markdown> : null}
      </section>
      {parts.consignes ? (
        <Fold title="Consignes" defaultOpen>
          {parts.consignes}
        </Fold>
      ) : null}
      {parts.indice ? (
        <Fold title={parts.indiceTitle || "Indice"} hint>
          {parts.indice}
        </Fold>
      ) : null}
      {parts.exemples ? <Fold title="Exemples">{parts.exemples}</Fold> : null}
    </div>
  );
}
