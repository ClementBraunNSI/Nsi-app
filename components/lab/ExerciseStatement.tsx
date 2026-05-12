"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BookOpen, CheckCircle } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";

type Props = {
  exercise: LabExercise;
  isCompleted: boolean;
  content: string;
};

export function ExerciseStatement({ exercise, isCompleted, content }: Props) {
  return (
    <div className="border-r border-slate-200 bg-white min-h-0 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={18} className="text-slate-400" />
            {exercise.label}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
            {exercise.courseTitle}
          </p>
        </div>
        {isCompleted && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5">
            <CheckCircle size={12} /> Validé
          </span>
        )}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto p-5 prose prose-slate prose-lg max-w-none bg-white lab-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
