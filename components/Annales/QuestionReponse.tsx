"use client";
import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, CheckCircle2 } from 'lucide-react';

interface QuestionProps {
  numero: string;
  question: string; // Markdown supported
  indice?: string;
  reponse: string; // Markdown supported
}

export default function QuestionReponse({ numero, question, indice, reponse }: QuestionProps) {
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="mb-8 border-l-4 border-slate-200 pl-6 py-2 transition-all hover:border-orange-200">
      <div className="flex items-start gap-3 mb-4">
        <span className="font-black text-slate-400 select-none pt-1">{numero}</span>
        <div className="prose prose-slate max-w-none text-slate-800">
          {/* Rendu Markdown basique pour la question */}
          <div dangerouslySetInnerHTML={{ __html: question }} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {indice && (
          <button
            onClick={() => setShowHint(!showHint)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              showHint ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb size={16} />
            {showHint ? 'Masquer l\'indice' : 'Besoin d\'un indice ?'}
          </button>
        )}

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            showAnswer ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {showAnswer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {showAnswer ? 'Masquer la correction' : 'Voir la correction'}
        </button>
      </div>

      {showHint && indice && (
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800 text-sm animate-in fade-in slide-in-from-top-2">
          <strong className="block mb-1 font-bold">💡 Indice :</strong>
          {indice}
        </div>
      )}

      {showAnswer && (
        <div className="mt-4 p-6 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-900 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold border-b border-emerald-200 pb-2">
            <CheckCircle2 size={18} />
            Correction détaillée
          </div>
          <div className="prose prose-emerald max-w-none">
            <div dangerouslySetInnerHTML={{ __html: reponse }} />
          </div>
        </div>
      )}
    </div>
  );
}
