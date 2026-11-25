"use client";

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import styles from './LinearStructureVisualizer.module.css';

type Kind = 'liste' | 'pile' | 'file';

type Cell = { key: number; value: string };

const TITLES: Record<Kind, string> = {
  liste: 'Liste chaînée : ajouter et retirer',
  pile: 'Pile : empiler et dépiler',
  file: 'File : enfiler et défiler',
};

const NAMES: Record<Kind, string> = { liste: 'l', pile: 'p', file: 'f' };

const MAX_SIZE = 7;
const STEP_MS = 420;

/** Valeurs proposées tour à tour, pour ne pas avoir à taper une valeur à chaque ajout. */
const SUGGESTIONS = ['7', '3', '12', '5', '9', '1', '8', '4', '6', '2'];

/** Le MDX des cours ne passe pas d'expressions JavaScript : les valeurs de départ s'écrivent « 3 1 4 ». */
function parseInitial(initial: string | string[]): string[] {
  return Array.isArray(initial) ? initial : initial.split(/[\s,]+/).filter(Boolean);
}

function startCells(initial: string[]): Cell[] {
  return initial.slice(0, MAX_SIZE).map((value, index) => ({ key: index + 1, value }));
}

/**
 * Animation d'une structure linéaire, pour les cours : on ajoute et on retire des éléments,
 * et chaque opération s'écrit avec les noms du type abstrait (empiler(p, x), defiler(f)…).
 * `type="liste"` : liste chaînée (maillons et références), ajout en tête ou en queue, retrait en tête.
 * `type="pile"` : pile verticale, le sommet en haut. `type="file"` : file horizontale, de la tête à la queue.
 */
export default function LinearStructureVisualizer({
  type = 'pile',
  initial: initialProp = '4 8 2',
}: {
  type?: Kind;
  /** Valeurs de départ, du fond vers le sommet (pile) ou de la tête vers la queue : « 4 8 2 ». */
  initial?: string | string[];
}) {
  const initial = parseInitial(initialProp);
  const [cells, setCells] = useState<Cell[]>(() => startCells(initial));
  const [value, setValue] = useState(SUGGESTIONS[0]);
  const [log, setLog] = useState<{ text: string; tone: 'ok' | 'out' | 'error' }[]>([]);
  const [visiting, setVisiting] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const nextKey = useRef(initial.length + 1);
  const suggestion = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const name = NAMES[type];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const write = (text: string, tone: 'ok' | 'out' | 'error' = 'ok') => setLog((prev) => [{ text, tone }, ...prev].slice(0, 4));

  const takeValue = () => {
    const chosen = value.trim().slice(0, 4) || SUGGESTIONS[suggestion.current % SUGGESTIONS.length];
    setValue(SUGGESTIONS[suggestion.current % SUGGESTIONS.length]);
    suggestion.current += 1;
    return chosen;
  };

  const newCell = (text: string): Cell => ({ key: nextKey.current++, value: text });

  const full = cells.length >= MAX_SIZE;

  // Dans cette animation, l'ajout se fait toujours à droite du tableau `cells`, sauf pour la tête d'une liste.
  const add = () => {
    if (busy) return;
    if (full) {
      write(`Plus de place dans l'animation (${MAX_SIZE} éléments au plus).`, 'error');
      return;
    }
    const text = takeValue();
    if (type === 'liste') {
      setCells((prev) => [newCell(text), ...prev]);
      write(`${name} = ajouter_en_tete(${name}, ${text}) : un nouveau maillon pointe vers l'ancienne tête`);
    } else if (type === 'pile') {
      setCells((prev) => [...prev, newCell(text)]);
      write(`${name} = empiler(${name}, ${text})`);
    } else {
      setCells((prev) => [...prev, newCell(text)]);
      write(`${name} = enfiler(${name}, ${text}) : ${text} arrive en queue`);
    }
  };

  // Ajout en queue d'une liste chaînée : il faut d'abord parcourir tous les maillons depuis la tête.
  const addLast = () => {
    if (busy) return;
    if (full) {
      write(`Plus de place dans l'animation (${MAX_SIZE} éléments au plus).`, 'error');
      return;
    }
    const text = takeValue();
    setBusy(true);
    const steps = cells.length;
    cells.forEach((cell, index) => {
      timers.current.push(setTimeout(() => setVisiting(cell.key), index * STEP_MS));
    });
    timers.current.push(setTimeout(() => {
      setVisiting(null);
      setCells((prev) => [...prev, newCell(text)]);
      write(`ajout de ${text} en queue : ${steps} maillon${steps > 1 ? 's' : ''} parcouru${steps > 1 ? 's' : ''} avant de pouvoir l'accrocher`);
      setBusy(false);
    }, steps * STEP_MS));
  };

  const remove = () => {
    if (busy) return;
    if (cells.length === 0) {
      const what = type === 'pile' ? `depiler(${name})` : type === 'file' ? `defiler(${name})` : `queue(${name})`;
      write(`${what} : impossible, la structure est vide (est_vide(${name}) vaut Vrai)`, 'error');
      return;
    }
    if (type === 'pile') {
      const top = cells[cells.length - 1];
      setCells((prev) => prev.slice(0, -1));
      write(`depiler(${name}) renvoie ${top.value} : le dernier entré sort le premier`, 'out');
    } else if (type === 'file') {
      const first = cells[0];
      setCells((prev) => prev.slice(1));
      write(`defiler(${name}) renvoie ${first.value} : le premier entré sort le premier`, 'out');
    } else {
      const head = cells[0];
      setCells((prev) => prev.slice(1));
      write(`tete(${name}) vaut ${head.value}, puis ${name} = queue(${name}) : la tête devient le maillon suivant`, 'out');
    }
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setVisiting(null);
    setBusy(false);
    setCells(startCells(initial));
    nextKey.current = initial.length + 1;
    setLog([]);
  };

  const addLabel = type === 'pile' ? 'Empiler' : type === 'file' ? 'Enfiler' : 'Ajouter en tête';
  const removeLabel = type === 'pile' ? 'Dépiler' : type === 'file' ? 'Défiler' : 'Retirer la tête';

  const enter = type === 'pile' ? { opacity: 0, y: -46 } : type === 'file' ? { opacity: 0, x: 46 } : { opacity: 0, y: -36 };
  const leave = type === 'pile' ? { opacity: 0, y: -46 } : type === 'file' ? { opacity: 0, x: -46 } : { opacity: 0, y: 36 };

  const box = (cell: Cell, index: number) => {
    const isTop = type === 'pile' && index === cells.length - 1;
    const isHead = type !== 'pile' && index === 0;
    const isTail = type === 'file' && index === cells.length - 1;
    return (
      <motion.div
        key={cell.key}
        layout
        initial={enter}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={leave}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={styles.item}
      >
        {type === 'liste' ? (
          <div className={`${styles.node} ${visiting === cell.key ? styles.visiting : ''}`}>
            <span className={styles.value}>{cell.value}</span>
            <span className={styles.ref} aria-hidden>•</span>
          </div>
        ) : (
          <div className={`${styles.cell} ${isTop || isHead ? styles.hot : ''}`}>{cell.value}</div>
        )}
        {isTop ? <span className={styles.tag}>sommet</span> : null}
        {isHead ? <span className={styles.tag}>tête</span> : null}
        {isTail && !isHead ? <span className={styles.tag}>queue</span> : null}
        {type === 'liste' ? <span className={styles.arrow} aria-hidden>→</span> : null}
      </motion.div>
    );
  };

  return (
    <MotionConfig reducedMotion="user">
    <figure className={styles.wrap} aria-label={TITLES[type]}>
      <figcaption className={styles.title}>{TITLES[type]}</figcaption>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>Valeur</span>
          <input
            value={value}
            maxLength={4}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') add(); }}
          />
        </label>
        <button type="button" className={styles.primary} onClick={add} disabled={busy}>{addLabel}</button>
        {type === 'liste' ? (
          <button type="button" className={styles.secondary} onClick={addLast} disabled={busy}>Ajouter en queue</button>
        ) : null}
        <button type="button" className={styles.secondary} onClick={remove} disabled={busy}>{removeLabel}</button>
        <button type="button" className={styles.ghost} onClick={reset} title="Revenir au départ" aria-label="Revenir au départ">
          <RotateCcw size={15} aria-hidden />
        </button>
      </div>

      <div className={`${styles.stage} ${styles[type]}`}>
        {type === 'file' ? <span className={styles.side}>sortie ←</span> : null}
        <div className={styles.track}>
          <AnimatePresence initial={false} mode="popLayout">
            {cells.map(box)}
          </AnimatePresence>
          {type === 'liste' ? <span className={styles.none}>None</span> : null}
          {cells.length === 0 && type !== 'liste' ? <span className={styles.empty}>{type === 'pile' ? 'pile vide' : 'file vide'}</span> : null}
        </div>
        {type === 'file' ? <span className={styles.side}>← entrée</span> : null}
      </div>

      <ol className={styles.log} aria-live="polite">
        {log.length === 0 ? (
          <li className={styles.hint}>
            {type === 'pile' && 'Empiler plusieurs valeurs, puis dépiler : elles ressortent dans l\'ordre inverse.'}
            {type === 'file' && 'Enfiler plusieurs valeurs, puis défiler : elles ressortent dans leur ordre d\'arrivée.'}
            {type === 'liste' && 'Comparer l\'ajout en tête, immédiat, et l\'ajout en queue, qui parcourt toute la liste.'}
          </li>
        ) : log.map((line, index) => (
          <li key={`${index}-${line.text}`} className={`${styles[line.tone]} ${index === 0 ? styles.latest : ''}`}>{line.text}</li>
        ))}
      </ol>
    </figure>
    </MotionConfig>
  );
}
