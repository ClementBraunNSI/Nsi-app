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
    <div className="absolute top-16 right-0 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-[110]">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-50">
        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Accessibilité</span>
        <button onClick={onClose}>
          <X size={16} className="text-slate-300 hover:text-slate-500" />
        </button>
      </div>
      <div className="space-y-2">
        <button
          onClick={() => setShowCollection((prev) => !prev)}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
        >
          <span className="font-bold text-sm">Renards trouvés</span>
          <span className="text-xs font-black text-orange-600">{found.length}/{total}</span>
        </button>
        <button onClick={() => onToggle("dyslexic", "dyslexicMode", !dyslexicMode, setDyslexicMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${dyslexicMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
          <div className="flex items-center gap-3"><Type size={18} /><span className="font-bold text-sm">Dyslexie</span></div>{dyslexicMode && <Check size={16} />}
        </button>
        <button onClick={() => onToggle("dark", "darkMode", !darkMode, setDarkMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${darkMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
          <div className="flex items-center gap-3"><Moon size={18} /><span className="font-bold text-sm">Mode Sombre</span></div>{darkMode && <Check size={16} />}
        </button>
        <button onClick={() => onToggle("high-contrast", "highContrastMode", !highContrastMode, setHighContrastMode)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${highContrastMode ? "bg-orange-50 text-orange-600 border border-orange-100" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
          <div className="flex items-center gap-3"><Zap size={18} /><span className="font-bold text-sm">Contraste</span></div>{highContrastMode && <Check size={16} />}
        </button>
      </div>
    </div>
  );
}
