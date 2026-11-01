"use client";

import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

/** Correction d'un exercice en mode projection : cachée jusqu'au clic de l'enseignant. */
export function RevealCorrection({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`reveal-correction ${open ? "is-open" : ""}`}>
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        {open ? <EyeOff size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
        {open ? "Masquer la correction" : "Montrer la correction"}
      </button>
      {open ? <div className="reveal-correction-body">{children}</div> : null}
    </div>
  );
}
