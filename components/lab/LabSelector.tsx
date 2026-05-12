"use client";

import { SelectField } from "@/components/ui";

type LevelMap = Record<string, { label: string; code: string }>;

type Props = {
  availableLevels: string[];
  availableChapters: string[];
  selectedLevel: string;
  selectedChapter: string;
  levelMap: LevelMap;
  onLevelChange: (value: string) => void;
  onChapterChange: (value: string) => void;
};

export function LabSelector({
  availableLevels,
  availableChapters,
  selectedLevel,
  selectedChapter,
  levelMap,
  onLevelChange,
  onChapterChange,
}: Props) {
  return (
    <>
      <SelectField
        label="1. Niveau"
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value)}
        className={selectedLevel ? "font-semibold text-slate-700" : "font-medium italic text-slate-400"}
      >
        <option value="">Choisir un niveau</option>
        {availableLevels.map((level) => (
          <option key={level} value={level}>
            {levelMap[level]?.label || `Niveau ${level}`}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="2. Chapitre"
        value={selectedChapter}
        onChange={(e) => onChapterChange(e.target.value)}
        disabled={!selectedLevel}
        className={selectedChapter ? "font-semibold text-slate-700" : "font-medium italic text-slate-400"}
      >
        <option value="">{selectedLevel ? "Choisir un chapitre" : "Choisis d'abord un niveau"}</option>
        {availableChapters.map((chapter) => (
          <option key={chapter} value={chapter}>
            {chapter}
          </option>
        ))}
      </SelectField>
    </>
  );
}
