"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { RotateCcw } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";
import { CodeArea } from "@/components/lab/CodeArea";

type Props = {
  exercise: LabExercise;
  code: string;
  busy: boolean;
  onCodeChange: (value: string) => void;
  onReset: () => void;
  beforeMount: (monaco: any) => void;
};

/** Monaco ne gère pas la saisie tactile : sur téléphone et tablette, on bascule sur CodeArea. */
function useTouchEditor() {
  const [touch, setTouch] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse), (max-width: 767px)");
    const update = () => setTouch(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return touch;
}

export function LabEditor({ exercise, code, busy, onCodeChange, onReset, beforeMount }: Props) {
  const touch = useTouchEditor();
  const language = exercise.type === "sql" ? "sql" : "python";

  return (
    <div className="exercise-editor">
      <div className="exercise-editor-bar">
        <span className="exercise-file">{language === "sql" ? "main.sql" : "main.py"}</span>
        <button
          type="button"
          onClick={onReset}
          className="exercise-icon-button"
          title="Effacer le code"
          aria-label="Effacer le code"
          disabled={busy || code.length === 0}
        >
          <RotateCcw size={14} />
        </button>
      </div>
      <div className="exercise-editor-frame">
        {touch === null ? null : touch ? (
          <CodeArea value={code} onChange={onCodeChange} language={language} />
        ) : (
          <Editor
            height="100%"
            defaultLanguage="python"
            language={language}
            theme="orange-dark"
            beforeMount={beforeMount}
            value={code}
            onChange={(value) => onCodeChange(value || "")}
            loading={<span className="exercise-editor-loading">Chargement de l'éditeur</span>}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 14, bottom: 14 },
              overviewRulerLanes: 0,
              renderLineHighlight: "line",
              lineNumbersMinChars: 3,
            }}
          />
        )}
      </div>
    </div>
  );
}
