"use client";

import { Check, Moon, Type, X, Zap } from "lucide-react";
import { useFoxEasterEgg } from "./FoxEasterEggProvider";

type Props = {
  onClose: () => void;
  dyslexicMode: boolean;
  darkMode: boolean;
  highContrastMode: boolean;
  onToggle: (className: string, key: string, value: boolean, setter: (value: boolean) => void) => void;
  setDyslexicMode: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setHighContrastMode: (value: boolean) => void;
};

export default function AccessibilityMenu({
  onClose,
  dyslexicMode,
  darkMode,
  highContrastMode,
  onToggle,
  setDyslexicMode,
  setDarkMode,
  setHighContrastMode,
}: Props) {
  const { found, total, setShowCollection } = useFoxEasterEgg();

  return (
    <div className="absolute top-16 right-0 w-64 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow)] p-4 z-[110]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border)]">
        <span className="text-xs font-semibold text-[var(--subtle)]">Accessibilité</span>
        <button onClick={onClose}>
          <X size={16} className="text-[var(--subtle)] hover:text-[var(--fg)]" />
        </button>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => setShowCollection((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          <span className="font-semibold text-sm">Renards trouvés</span>
          <span className="text-xs font-semibold text-[var(--accent)]">{found.length}/{total}</span>
        </button>
        <button onClick={() => onToggle("dyslexic", "dyslexicMode", !dyslexicMode, setDyslexicMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${dyslexicMode ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>
          <div className="flex items-center gap-3"><Type size={18} /><span className="font-semibold text-sm">Dyslexie</span></div>{dyslexicMode && <Check size={16} />}
        </button>
        <button onClick={() => onToggle("dark", "darkMode", !darkMode, setDarkMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${darkMode ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>
          <div className="flex items-center gap-3"><Moon size={18} /><span className="font-semibold text-sm">Mode Sombre</span></div>{darkMode && <Check size={16} />}
        </button>
        <button onClick={() => onToggle("high-contrast", "highContrastMode", !highContrastMode, setHighContrastMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${highContrastMode ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--border)]" : "bg-[var(--surface-2)] text-[var(--muted)] hover:text-[var(--fg)]"}`}>
          <div className="flex items-center gap-3"><Zap size={18} /><span className="font-semibold text-sm">Contraste</span></div>{highContrastMode && <Check size={16} />}
        </button>
      </div>
    </div>
  );
}
