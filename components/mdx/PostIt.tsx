"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { StickyNote, X } from "lucide-react";
import styles from "./PostIt.module.css";

/**
 * Pense-bête de syntaxe posé à côté de l'énoncé (exercices « Premiers pas »). Dans une fiche :
 *   <PostIt>
 *
 *   - `liste.append(x)` : ajoute x à la fin
 *
 *   </PostIt>
 * Dans <Enonce>, il est déplacé dans la colonne de droite ; sous l'énoncé quand la place manque.
 */

/** Colonne de l'énoncé qui reçoit le post-it ; `undefined` hors d'un énoncé (le post-it reste où il est écrit). */
const SlotContext = createContext<HTMLElement | null | undefined>(undefined);

export function PostItNote({ title = "Pense-bête", children }: { title?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button type="button" className={styles.reopen} onClick={() => setOpen(true)}>
        <StickyNote size={14} aria-hidden />
        {title}
      </button>
    );
  }
  return (
    <aside className={styles.note} aria-label={title}>
      <p className={styles.head}>
        <StickyNote size={14} aria-hidden />
        <span>{title}</span>
        <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label={`Refermer : ${title}`} title="Refermer">
          <X size={14} aria-hidden />
        </button>
      </p>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}

export function PostIt({ children }: { children?: ReactNode }) {
  const slot = useContext(SlotContext);
  const note = <PostItNote>{children}</PostItNote>;
  if (slot === undefined) return note;
  // Rien au premier rendu (serveur compris) : le post-it apparaît directement dans sa colonne.
  return slot ? createPortal(note, slot) : null;
}

/** Énoncé avec une colonne de côté pour ses post-it ; la colonne vide ne prend pas de place. */
export function PostItLayout({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  return (
    <SlotContext.Provider value={slot}>
      <div className={styles.layout}>
        <div className={styles.main}>{children}</div>
        <div ref={setSlot} className={styles.side} />
      </div>
    </SlotContext.Provider>
  );
}
