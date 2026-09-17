"use client";
import React, { useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

interface QuizProps {
  question: string;
  options: string[];
  answer: number; // 0-based index
  explanation?: string;
}

export default function Quiz({ question, options = [], answer, explanation }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Ensure options is an array (in case it's passed as a string or undefined)
  const safeOptions = Array.isArray(options) ? options : [];

  const handleSubmit = () => {
    if (selected !== null) {
      setIsSubmitted(true);
    }
  };

  const reset = () => {
    setSelected(null);
    setIsSubmitted(false);
  };

  const isCorrect = selected === answer;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)] not-prose">
      <div className="border-b border-[var(--border)] bg-[var(--surface-2)] p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-[var(--accent-soft)] p-2 text-[var(--accent)]">
            <HelpCircle size={20} />
          </div>
          <h3 className="m-0 text-lg font-semibold tracking-tight text-[var(--fg)]">Question</h3>
        </div>
        <p className="m-0 font-medium leading-6 text-[var(--muted)]">{question}</p>
      </div>
      
      <div className="space-y-2.5 p-4 sm:p-6">
        {safeOptions.map((option, index) => {
          let optionClass = "group flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all duration-150 ";
          
          if (isSubmitted) {
            if (index === answer) {
              optionClass += "border-emerald-400 bg-emerald-50 text-emerald-900";
            } else if (index === selected) {
              optionClass += "border-red-400 bg-red-50 text-red-900";
            } else {
              optionClass += "border-[var(--border)] bg-[var(--surface-2)] text-[var(--subtle)] opacity-55";
            }
          } else {
            if (selected === index) {
              optionClass += "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--fg)] shadow-sm";
            } else {
              optionClass += "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)]";
            }
          }

          return (
            <button 
              key={index}
              onClick={() => !isSubmitted && setSelected(index)}
              disabled={isSubmitted}
              className={optionClass}
            >
              <span className="font-medium">{option}</span>
              {isSubmitted && index === answer && <Check size={20} className="text-green-600" />}
              {isSubmitted && index === selected && index !== answer && <X size={20} className="text-red-600" />}
              {!isSubmitted && selected === index && <div className="h-4 w-4 rounded-full bg-[var(--accent)]" />}
              {!isSubmitted && selected !== index && <div className="h-4 w-4 rounded-full border-2 border-[var(--border)] group-hover:border-[var(--accent)]" />}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface-2)] p-4 sm:p-6">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={`rounded-xl px-5 py-2.5 font-semibold text-white transition-all ${
              selected !== null 
                ? 'bg-[var(--accent)] shadow-sm hover:-translate-y-0.5'
                : 'cursor-not-allowed bg-[var(--subtle)] opacity-45'
            }`}
          >
            Vérifier
          </button>
        ) : (
          <div className={`flex-1 rounded-xl p-4 ${isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
            <p className="font-bold mb-1 flex items-center gap-2">
              {isCorrect ? <><Check size={18} /> Correct !</> : <><X size={18} /> Incorrect</>}
            </p>
            <p className="text-sm opacity-90">
              {explanation || (isCorrect ? "Bravo, c'est la bonne réponse." : `La bonne réponse était : ${safeOptions[answer]}`)}
            </p>
          </div>
        )}
        {isSubmitted && (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--fg)]"
          >
            Rejouer
          </button>
        )}
      </div>
    </div>
  );
}
