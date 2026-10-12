"use client";

import Editor from "@monaco-editor/react";
import { Check, Play, RotateCcw } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";

type Props = {
  exercise: LabExercise;
  code: string;
  running: "execute" | "test" | null;
  onCodeChange: (value: string) => void;
  onReset: () => void;
  onExecute: () => void;
  onTest: () => void;
  beforeMount: (monaco: any) => void;
};

export function LabEditor({ exercise, code, running, onCodeChange, onReset, onExecute, onTest, beforeMount }: Props) {
  const busy = running !== null;
  return (
    <div className="exercise-editor">
      <div className="exercise-editor-bar">
        <span className="exercise-file">{exercise.type === "sql" ? "main.sql" : "main.py"}</span>
        <div className="exercise-editor-actions">
          <button type="button" onClick={onReset} className="exercise-icon-button" title="Réinitialiser le code" disabled={busy}>
            <RotateCcw size={14} />
          </button>
          <span className="exercise-runtime">{exercise.type === "sql" ? "SQL" : "Python 3"}</span>
          <button type="button" onClick={onExecute} disabled={busy} className="exercise-run">
            <Play size={14} fill="currentColor" aria-hidden />
            {running === "execute" ? "Exécution…" : "Exécuter"}
          </button>
          {exercise.hasVerification ? (
            <button type="button" onClick={onTest} disabled={busy} className="exercise-test">
              <Check size={14} aria-hidden />
              {running === "test" ? "Vérification…" : "Tester ma solution"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="exercise-editor-frame">
        <div className="exercise-editor-fill">
        <Editor
          height="100%"
          defaultLanguage="python"
          language={exercise.type === "sql" ? "sql" : "python"}
          theme="orange-dark"
          beforeMount={beforeMount}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            overviewRulerLanes: 0,
          }}
        />
        </div>
      </div>
    </div>
  );
}
