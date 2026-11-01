"use client";

import React, { useState, type ReactNode } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import styles from "./Indices.module.css";

/**
 * Indices d'un exercice, révélés un par un. Le dernier est toujours le pseudo-code, qui reste à traduire en Python.
 * Dans une fiche :
 *   <Indices>
 *   <Indice>Une piste.</Indice>
 *   <Indice>```text … ```</Indice>
 *   </Indices>
 */
export function Indice({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export function Indices({ children }: { children?: ReactNode }) {
  const items = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => (child as React.ReactElement<{ children?: ReactNode }>).props.children);
  return <HintSteps items={items} />;
}

function hintName(index: number, count: number) {
  return index === count - 1 ? "Pseudo-code" : `Indice ${index + 1}`;
}

/** Liste d'indices à ouvrir dans l'ordre ; partagée par la fiche (MDX) et l'éditeur seul (Markdown). */
export function HintSteps({ items }: { items: ReactNode[] }) {
  const [shown, setShown] = useState(0);
  const count = items.length;
  if (count === 0) return null;

  const nextLabel = shown === count - 1
    ? "Afficher le pseudo-code"
    : `Afficher l'indice ${shown + 1} sur ${count - 1}`;

  return (
    <div className={styles.hints} data-hints={count}>
      {items.slice(0, shown).map((item, index) => (
        <section key={index} className={index === count - 1 ? `${styles.hint} ${styles.pseudo}` : styles.hint}>
          <p className={styles.name}>{hintName(index, count)}</p>
          <div className={styles.body}>{item}</div>
        </section>
      ))}
      <div className={styles.bar}>
        {shown < count ? (
          <button type="button" className={styles.next} onClick={() => setShown((value) => Math.min(value + 1, count))}>
            <Lightbulb size={15} aria-hidden />
            {nextLabel}
          </button>
        ) : (
          <span className={styles.left}>Il reste à traduire le pseudo-code en Python.</span>
        )}
        {shown > 0 ? (
          <button type="button" className={styles.reset} onClick={() => setShown(0)}>
            <RotateCcw size={13} aria-hidden />
            Masquer les indices
          </button>
        ) : null}
      </div>
    </div>
  );
}
