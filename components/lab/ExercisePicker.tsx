"use client";

import { ChevronDown, CheckCircle } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";

type Props = {
  selectedChapter: string;
  selectedExercise: LabExercise | null;
  availableExercises: LabExercise[];
  completedExercises: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (exercise: LabExercise) => void;
};

export function ExercisePicker({
  selectedChapter,
  selectedExercise,
  availableExercises,
  completedExercises,
  isOpen,
  onToggle,
  onSelect,
}: Props) {
  return (
    <div>
      <p className="mb-2 text-xs font-black uppercase tracking-wider text-slate-500">3. Exercice</p>
      <div className="relative">
        <button
          type="button"
          disabled={!selectedChapter}
          onClick={onToggle}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 hover:bg-slate-50 flex items-center justify-between ${
            selectedExercise ? "font-semibold text-slate-700" : "font-medium italic text-slate-400"
          }`}
        >
          <span className="truncate">
            {selectedExercise?.label || (selectedChapter ? "Choisir un exercice" : "Choisis d'abord un chapitre")}
          </span>
          <ChevronDown size={16} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {selectedChapter && isOpen && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 shadow-lg max-h-56 overflow-y-auto">
            <div className="grid grid-cols-1 gap-1.5">
              {availableExercises.map((ex) => {
                const isCompleted = completedExercises.includes(ex.id);
                const isSelected = selectedExercise?.id === ex.id;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => onSelect(ex)}
                    className={`w-full rounded-md px-2.5 py-2 text-left text-xs font-semibold transition flex items-center justify-between ${
                      isSelected ? "bg-orange-100 text-orange-700" : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="truncate pr-2">{ex.label}</span>
                    {isCompleted && <CheckCircle size={12} className="text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
