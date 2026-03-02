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

  const isCorrect = selected === answer;

  return (
    <div className="my-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm not-prose">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
            <HelpCircle size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 m-0">Quiz Express</h3>
        </div>
        <p className="text-slate-600 font-medium m-0">{question}</p>
      </div>
      
      <div className="p-6 space-y-3">
        {safeOptions.map((option, index) => {
          let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex justify-between items-center group ";
          
          if (isSubmitted) {
            if (index === answer) {
              optionClass += "border-green-500 bg-green-50 text-green-900";
            } else if (index === selected) {
              optionClass += "border-red-500 bg-red-50 text-red-900";
            } else {
              optionClass += "border-slate-100 bg-slate-50 text-slate-400 opacity-50";
            }
          } else {
            if (selected === index) {
              optionClass += "border-orange-500 bg-orange-50 text-orange-900 shadow-md transform scale-[1.01]";
            } else {
              optionClass += "border-slate-100 hover:border-orange-200 hover:bg-slate-50 text-slate-600";
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
              {!isSubmitted && selected === index && <div className="w-4 h-4 rounded-full bg-orange-500" />}
              {!isSubmitted && selected !== index && <div className="w-4 h-4 rounded-full border-2 border-slate-200 group-hover:border-orange-300" />}
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className={`px-6 py-2 rounded-xl font-bold text-white transition-all ${
              selected !== null 
                ? 'bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            Vérifier
          </button>
        ) : (
          <div className={`flex-1 p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold mb-1 flex items-center gap-2">
              {isCorrect ? <><Check size={18} /> Correct !</> : <><X size={18} /> Incorrect</>}
            </p>
            <p className="text-sm opacity-90">
              {explanation || (isCorrect ? "Bravo, c'est la bonne réponse." : `La bonne réponse était : ${safeOptions[answer]}`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
