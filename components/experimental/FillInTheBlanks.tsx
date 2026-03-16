"use client";
import { useState } from 'react';
import { Check, X, RefreshCcw } from 'lucide-react';

interface Blank {
  id: string;
  answer: string;
}

interface FillInTheBlanksProps {
  text: string; // Text with [id] placeholders
  blanks: Blank[];
}

export default function FillInTheBlanks({ text, blanks }: FillInTheBlanksProps) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean | null>>({});

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    blanks.forEach(blank => {
      const userAnswer = inputs[blank.id]?.trim().toLowerCase() || "";
      newResults[blank.id] = userAnswer === blank.answer.toLowerCase();
    });
    setResults(newResults);
  };

  const reset = () => {
    setInputs({});
    setResults({});
  };

  // Parse text to replace [id] with inputs
  const parts = text.split(/(\[.*?\])/g);

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm my-6 transition-all hover:shadow-md">
      <div className="leading-loose text-lg text-slate-800 dark:text-slate-200 font-medium">
        {parts.map((part, index) => {
          const match = part.match(/^\[(.*?)\]$/);
          if (match) {
            const id = match[1];
            const isCorrect = results[id];
            
            return (
              <span key={index} className="relative inline-block mx-1 align-baseline">
                <input
                  type="text"
                  value={inputs[id] || ''}
                  onChange={(e) => {
                    setInputs(prev => ({ ...prev, [id]: e.target.value }));
                    setResults(prev => ({ ...prev, [id]: null })); // Reset validation on type
                  }}
                  className={`
                    w-32 px-3 py-1 border-b-2 text-center font-bold outline-none transition-all rounded-t-md
                    ${isCorrect === true 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                      : isCorrect === false 
                        ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                        : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 focus:border-orange-500 focus:bg-orange-50 dark:focus:bg-slate-800'}
                  `}
                  autoComplete="off"
                />
                {isCorrect === true && (
                  <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-900 rounded-full shadow-sm animate-in zoom-in duration-200">
                    <Check size={18} className="text-emerald-500" />
                  </div>
                )}
                {isCorrect === false && (
                  <div className="absolute -top-3 -right-3 bg-white dark:bg-slate-900 rounded-full shadow-sm animate-in zoom-in duration-200">
                    <X size={18} className="text-red-500" />
                  </div>
                )}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
      
      <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={reset}
          className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          <RefreshCcw size={16} /> Réinitialiser
        </button>
        <button
          onClick={checkAnswers}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-orange-100 dark:shadow-none flex items-center gap-2"
        >
          <Check size={18} /> Vérifier
        </button>
      </div>
    </div>
  );
}
