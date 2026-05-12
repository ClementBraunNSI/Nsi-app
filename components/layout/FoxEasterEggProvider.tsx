"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type FoxContextValue = {
  found: string[];
  total: number;
  secretIds: string[];
  showCollection: boolean;
  setShowCollection: (value: boolean | ((prev: boolean) => boolean)) => void;
  unlockFox: (id: string) => void;
};

const FoxEasterEggContext = createContext<FoxContextValue | null>(null);

const SECRET_IDS = ["logo", "home", "cours", "lab", "apropos"];

export function useFoxEasterEgg() {
  const value = useContext(FoxEasterEggContext);
  if (!value) throw new Error("useFoxEasterEgg must be used inside FoxEasterEggProvider");
  return value;
}

export function FoxEasterEggProvider({ children }: { children: React.ReactNode }) {
  const [foxParty, setFoxParty] = useState(false);
  const [foxBurst, setFoxBurst] = useState<number[]>([]);
  const [foxHint, setFoxHint] = useState<string | null>(null);
  const [found, setFound] = useState<string[]>([]);
  const [showCollection, setShowCollection] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cooldownRef = useRef(0);

  useEffect(() => {
    const storedFox = JSON.parse(localStorage.getItem("foxFoundSecrets") || "[]");
    if (Array.isArray(storedFox)) setFound(storedFox);
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const triggerFoxEffect = useCallback((hint: string) => {
    const now = Date.now();
    if (now - cooldownRef.current < 3500) return;
    cooldownRef.current = now;
    setFoxHint(hint);
    setFoxBurst(Array.from({ length: reducedMotion ? 4 : 10 }, (_, i) => i));
    setFoxParty(true);
    window.setTimeout(() => {
      setFoxParty(false);
      setFoxHint(null);
    }, reducedMotion ? 2200 : 3400);
  }, [reducedMotion]);

  const unlockFox = useCallback((id: string) => {
    if (!SECRET_IDS.includes(id)) return;
    if (found.includes(id)) {
      setFoxHint("Déjà découvert");
      window.setTimeout(() => setFoxHint(null), 1200);
      return;
    }
    const next = [...found, id];
    setFound(next);
    localStorage.setItem("foxFoundSecrets", JSON.stringify(next));
    triggerFoxEffect("Nouveau renard trouvé");
  }, [found, triggerFoxEffect]);

  useEffect(() => {
    const konamiArrows = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const konamiLettersFr = ["h", "h", "b", "b", "g", "g", "d", "d", "b", "a"];
    let currentArrowIndex = 0;
    let currentLetterIndex = 0;

    const triggerKonami = () => {
      currentArrowIndex = 0;
      currentLetterIndex = 0;
      triggerFoxEffect("Pluie de renards déclenchée");
      unlockFox("logo");
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === konamiArrows[currentArrowIndex]) {
        currentArrowIndex += 1;
        if (currentArrowIndex === konamiArrows.length) {
          triggerKonami();
          return;
        }
      } else {
        currentArrowIndex = key === konamiArrows[0] ? 1 : 0;
      }

      if (key === konamiLettersFr[currentLetterIndex]) {
        currentLetterIndex += 1;
        if (currentLetterIndex === konamiLettersFr.length) triggerKonami();
      } else {
        currentLetterIndex = key === konamiLettersFr[0] ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [triggerFoxEffect, unlockFox]);

  useEffect(() => {
    let typed = "";
    const onTypeSecret = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-6);
      if (typed.includes("renard")) {
        typed = "";
        triggerFoxEffect("Mot secret détecté");
      }
    };
    window.addEventListener("keydown", onTypeSecret);
    return () => window.removeEventListener("keydown", onTypeSecret);
  }, [triggerFoxEffect]);

  useEffect(() => {
    const onGlobalFoxClick = (event: MouseEvent) => {
      const el = event.target as HTMLElement | null;
      const secret = el?.closest("[data-fox-easter-id]") as HTMLElement | null;
      if (!secret) return;
      const foxId = secret.getAttribute("data-fox-easter-id");
      if (!foxId) return;
      if (!secret.getAttribute("data-fox-revealed")) secret.setAttribute("data-fox-revealed", "true");
      unlockFox(foxId);
    };
    document.body.addEventListener("click", onGlobalFoxClick);
    return () => document.body.removeEventListener("click", onGlobalFoxClick);
  }, [unlockFox]);

  return (
    <FoxEasterEggContext.Provider value={{ found, total: SECRET_IDS.length, secretIds: SECRET_IDS, showCollection, setShowCollection, unlockFox }}>
      {children}
      {foxParty && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden fox-overlay">
          {foxBurst.map((seed) => (
            <span
              key={seed}
              className="absolute text-3xl fox-fall"
              style={{
                left: `${(seed * 7) % 100}%`,
                animationDelay: `${(seed % 6) * 0.12}s`,
                animationDuration: `${reducedMotion ? 1.6 : 2.4 + (seed % 5) * 0.35}s`,
              }}
            >
              🦊
            </span>
          ))}
          <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-2xl bg-white/95 px-5 py-3 text-sm font-black text-orange-600 shadow-xl border border-orange-100 fox-toast">
            {foxHint || "Renard débloqué"}
          </div>
        </div>
      )}
      {showCollection && (
        <div className="fixed inset-0 z-[180] bg-slate-900/40 flex items-center justify-center p-4" onClick={() => setShowCollection(false)}>
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-slate-900 mb-1">Collection de renards</h3>
            <p className="text-sm text-slate-500 mb-4">Renards trouvés: {found.length}/{SECRET_IDS.length}</p>
            <div className="grid grid-cols-2 gap-2">
              {SECRET_IDS.map((id) => {
                const isFound = found.includes(id);
                return (
                  <div key={id} className={`rounded-xl border p-2 text-sm ${isFound ? "border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                    <div className="font-bold capitalize">{id}</div>
                    <div className="text-xs">{isFound ? "Découvert" : "???"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </FoxEasterEggContext.Provider>
  );
}
