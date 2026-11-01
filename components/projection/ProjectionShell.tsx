"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Minus, Plus, X } from "lucide-react";

/** Taille du texte en projection, lue aussi par l'éditeur (taille de police de Monaco). */
const ProjectionContext = createContext<{ scale: number } | null>(null);

export function useProjectionScale() {
  return useContext(ProjectionContext)?.scale ?? 1;
}

const SCALES = [1, 1.15, 1.3, 1.5, 1.75, 2, 2.3];
const SCALE_KEY = "projection-taille";

type Section = { id: string; title: string; element: HTMLElement };

/** Le clavier sert à l'éditeur ou à un champ : pas de navigation par flèches. */
function typing(target: EventTarget | null) {
  const element = target as HTMLElement | null;
  return Boolean(element?.closest?.("input, textarea, select, [contenteditable='true'], .monaco-editor, .code-area"));
}

/**
 * Mode projection d'un cours ou d'une fiche (compte admin) : plein écran par-dessus le site,
 * texte agrandi, navigation par section au clavier, éditeur à la même taille.
 */
export default function ProjectionShell({ title, exitHref, children }: { title: string; exitHref: string; children: ReactNode }) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  const [scaleIndex, setScaleIndex] = useState(2);
  const [sections, setSections] = useState<Section[]>([]);
  const [current, setCurrent] = useState(0);
  const scale = SCALES[scaleIndex];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SCALE_KEY);
      const saved = raw === null ? NaN : Number(raw);
      if (Number.isInteger(saved) && saved >= 0 && saved < SCALES.length) setScaleIndex(saved);
    } catch {
      /* stockage indisponible : taille par défaut */
    }
  }, []);

  const changeScale = useCallback((delta: number) => {
    setScaleIndex((index) => {
      const next = Math.min(Math.max(index + delta, 0), SCALES.length - 1);
      try {
        localStorage.setItem(SCALE_KEY, String(next));
      } catch {
        /* stockage indisponible */
      }
      return next;
    });
  }, []);

  // Sections : les titres h2 et h3 du cours, dans l'ordre.
  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;
    const found = [...root.querySelectorAll<HTMLElement>("h2, h3")]
      .filter((element) => element.textContent?.trim())
      .map((element, index) => ({ id: element.id || `section-${index}`, title: element.textContent!.trim(), element }));
    setSections(found);
  }, [children]);

  // Section courante : la dernière dont le titre est passé sous le haut de l'écran.
  useEffect(() => {
    const root = contentRef.current;
    if (!root || sections.length === 0) return;
    const onScroll = () => {
      const top = root.getBoundingClientRect().top + 90;
      let index = 0;
      sections.forEach((section, position) => {
        if (section.element.getBoundingClientRect().top <= top) index = position;
      });
      setCurrent(index);
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    return () => root.removeEventListener("scroll", onScroll);
  }, [sections]);

  const goTo = useCallback(
    (index: number) => {
      const target = sections[Math.min(Math.max(index, 0), sections.length - 1)];
      if (!target) return;
      target.element.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrent(sections.indexOf(target));
    },
    [sections],
  );

  const exit = useCallback(() => router.push(exitHref), [exitHref, router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && (event.key === "+" || event.key === "=" || event.key === "-")) {
        event.preventDefault();
        changeScale(event.key === "-" ? -1 : 1);
        return;
      }
      if (typing(event.target)) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goTo(current + 1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goTo(current - 1);
      } else if (event.key === "Escape") {
        exit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeScale, current, exit, goTo]);

  const progress = sections.length > 1 ? (current / (sections.length - 1)) * 100 : 100;

  return (
    <ProjectionContext.Provider value={{ scale }}>
      <div className="projection-shell">
        <header className="projection-bar">
          <b className="projection-title">{title}</b>
          {sections.length > 0 ? (
            <div className="projection-nav">
              <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Section précédente (←)"><ChevronLeft size={18} /></button>
              <select value={current} onChange={(event) => goTo(Number(event.target.value))} aria-label="Aller à la section">
                {sections.map((section, index) => (
                  <option key={section.id + index} value={index}>{section.title}</option>
                ))}
              </select>
              <button type="button" onClick={() => goTo(current + 1)} disabled={current >= sections.length - 1} aria-label="Section suivante (→)"><ChevronRight size={18} /></button>
            </div>
          ) : null}
          <div className="projection-zoom" aria-label="Taille du texte">
            <button type="button" onClick={() => changeScale(-1)} disabled={scaleIndex === 0} aria-label="Texte plus petit (Ctrl −)"><Minus size={16} /></button>
            <span>{Math.round(scale * 100)} %</span>
            <button type="button" onClick={() => changeScale(1)} disabled={scaleIndex === SCALES.length - 1} aria-label="Texte plus grand (Ctrl +)"><Plus size={16} /></button>
          </div>
          <button type="button" className="projection-exit" onClick={exit}>
            <X size={16} aria-hidden /> Quitter <kbd>Échap</kbd>
          </button>
          <span className="projection-progress" aria-hidden><span style={{ width: `${progress}%` }} /></span>
        </header>
        <div ref={contentRef} className="projection-content" style={{ ["--projection-scale" as string]: scale }}>
          <div className="projection-inner">{children}</div>
        </div>
      </div>
    </ProjectionContext.Provider>
  );
}
