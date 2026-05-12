"use client";

import Editor from "@monaco-editor/react";
import { Play, RotateCcw } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";

type Props = {
  exercise: LabExercise;
  code: string;
  isRunning: boolean;
  onCodeChange: (value: string) => void;
  onReset: () => void;
  onRun: () => void;
  beforeMount: (monaco: any) => void;
};

export function LabEditor({ exercise, code, isRunning, onCodeChange, onReset, onRun, beforeMount }: Props) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>{exercise.type === "sql" ? "main.sql" : "main.py"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onReset} className="p-1.5 hover:bg-[#3e3e3e] rounded-md text-slate-400 transition-colors" title="Reset">
            <RotateCcw size={14} />
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              isRunning
                ? "bg-slate-600 text-slate-400 cursor-wait"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20"
            }`}
          >
            <Play size={14} fill="currentColor" />
            {isRunning ? "Exécution..." : "Exécuter & Valider"}
          </button>
        </div>
      </div>
      <div className="h-[55%] min-h-[250px] border-b border-[#3e3e3e]">
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
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>
    </>
  );
}
