"use client";

import type { LabExercise } from "@/app/actions/getExercises";

type SqlResults = { columns: string[]; values: any[][] } | null;

type Props = {
  exercise: LabExercise;
  output: string[];
  sqlResults: SqlResults;
};

export function LabOutput({ exercise, output, sqlResults }: Props) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#1e1e1e]">
      <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#3e3e3e]">
        Console / Sortie
      </div>
      <div className="flex-1 min-h-0 p-4 font-mono text-sm text-slate-300 overflow-y-auto space-y-1">
        {exercise.type === "sql" && sqlResults ? (
          <div className="bg-white rounded-lg overflow-hidden text-slate-900 shadow-sm overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  {sqlResults.columns.map((col, idx) => (
                    <th key={idx} className="px-3 py-2">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sqlResults.values.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50">
                    {row.map((cell: any, cIdx: number) => (
                      <td key={cIdx} className="px-3 py-2 font-mono">{String(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : output.length > 0 ? (
          output.map((line, i) => (
            <div key={i} className="border-b border-transparent hover:border-[#333]">{line}</div>
          ))
        ) : (
          <div className="text-slate-600 italic">En attente d'exécution...</div>
        )}
      </div>
    </div>
  );
}
