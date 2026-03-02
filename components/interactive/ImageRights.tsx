'use client';

import React, { useState } from 'react';
import { Camera, CheckCircle, XCircle, HelpCircle, RefreshCcw } from 'lucide-react';

export default function ImageRights() {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const questions = [
    {
      id: 0,
      text: "Voulez-vous publier la photo d'une personne ?",
      options: [
        { label: "Oui", next: 1 },
        { label: "Non (Paysage, Objet)", next: 99 } // 99 = OK
      ]
    },
    {
      id: 1,
      text: "La personne est-elle reconnaissable ?",
      options: [
        { label: "Oui", next: 2 },
        { label: "Non (Floue, Dos, Foule)", next: 99 }
      ]
    },
    {
      id: 2,
      text: "Avez-vous son autorisation écrite ?",
      options: [
        { label: "Oui", next: 99 },
        { label: "Non", next: 3 }
      ]
    },
    {
      id: 3,
      text: "Est-ce une personnalité publique dans l'exercice de ses fonctions ?",
      options: [
        { label: "Oui (Politique, Artiste)", next: 99 },
        { label: "Non (Vie privée)", next: 4 }
      ]
    },
    {
      id: 4,
      text: "Est-ce un événement d'actualité (Droit à l'information) ?",
      options: [
        { label: "Oui", next: 99 },
        { label: "Non", next: 100 } // 100 = INTERDIT
      ]
    }
  ];

  const handleOption = (nextId: number) => {
    setHistory([...history, step]);
    setStep(nextId);
  };

  const reset = () => {
    setStep(0);
    setHistory([]);
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6 relative">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-4 flex items-center justify-center gap-2">
        <Camera className="text-orange-500" />
        Ai-je le droit de publier ?
      </h3>

      <div className="min-h-[200px] flex flex-col items-center justify-center">
        {step === 99 ? (
          <div className="text-center animate-bounce-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={48} />
            </div>
            <h4 className="text-xl font-bold text-green-700 mb-2">Publication Autorisée !</h4>
            <p className="text-sm text-slate-500">Vous respectez le droit à l'image.</p>
          </div>
        ) : step === 100 ? (
          <div className="text-center animate-bounce-in">
            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={48} />
            </div>
            <h4 className="text-xl font-bold text-red-700 mb-2">Publication Interdite !</h4>
            <p className="text-sm text-slate-500">Vous risquez 1 an de prison et 45 000€ d'amende.</p>
          </div>
        ) : (
          <div className="w-full max-w-md">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 text-lg mb-6 text-center">
                {questions.find(q => q.id === step)?.text}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {questions.find(q => q.id === step)?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOption(opt.next)}
                    className="bg-white border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {(step === 99 || step === 100) && (
        <button 
          onClick={reset}
          className="mx-auto mt-4 flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm"
        >
          <RefreshCcw size={16} /> Recommencer
        </button>
      )}
    </div>
  );
}