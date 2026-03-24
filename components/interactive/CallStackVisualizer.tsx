"use client";
import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, StepForward, Info } from 'lucide-react';

export default function CallStackVisualizer() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Simulation de factorielle(3)
  const steps = [
    { stack: [], action: "Début de l'exécution", result: null },
    { stack: ["fact(3) : 3 * fact(2)"], action: "Appel de fact(3). On a besoin de fact(2).", result: null },
    { stack: ["fact(3) : 3 * fact(2)", "fact(2) : 2 * fact(1)"], action: "Appel de fact(2). On a besoin de fact(1).", result: null },
    { stack: ["fact(3) : 3 * fact(2)", "fact(2) : 2 * fact(1)", "fact(1) : 1 * fact(0)"], action: "Appel de fact(1). On a besoin de fact(0).", result: null },
    { stack: ["fact(3) : 3 * fact(2)", "fact(2) : 2 * fact(1)", "fact(1) : 1 * fact(0)", "fact(0) : return 1"], action: "Cas de base atteint ! fact(0) retourne 1.", result: null },
    { stack: ["fact(3) : 3 * fact(2)", "fact(2) : 2 * fact(1)", "fact(1) : 1 * 1 = 1"], action: "fact(0) est dépilé. fact(1) peut se calculer.", result: 1 },
    { stack: ["fact(3) : 3 * fact(2)", "fact(2) : 2 * 1 = 2"], action: "fact(1) est dépilé. fact(2) peut se calculer.", result: 2 },
    { stack: ["fact(3) : 3 * 2 = 6"], action: "fact(2) est dépilé. fact(3) peut se calculer.", result: 6 },
    { stack: [], action: "L'exécution est terminée !", result: 6 },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && step < steps.length - 1) {
      timer = setTimeout(() => {
        setStep(s => s + 1);
      }, 1500);
    } else if (step >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step]);

  const currentStep = steps[step];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Play size={20} className="text-orange-500" fill="currentColor" />
            Visualisation de la Pile d'Appels
          </h3>
          <p className="text-sm text-slate-500 mt-1">Exécution de <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded text-xs font-mono">factorielle(3)</code></p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0 || isPlaying}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 transition-colors"
            title="Étape précédente"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={step === steps.length - 1}
            className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg disabled:opacity-50 transition-colors shadow-sm"
          >
            {isPlaying ? "Pause" : <><Play size={18} fill="currentColor" /> Lecture</>}
          </button>
          <button
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1 || isPlaying}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 transition-colors"
            title="Étape suivante"
          >
            <StepForward size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visualisation de la pile */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 min-h-[300px] flex flex-col justify-end">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
            Pile Mémoire (Call Stack)
          </div>
          
          <div className="flex flex-col-reverse gap-2">
            {currentStep.stack.map((frame, index) => (
              <div 
                key={`${step}-${index}`}
                className={`
                  p-3 rounded-lg border font-mono text-sm text-center shadow-sm transition-all duration-300
                  ${index === currentStep.stack.length - 1 
                    ? 'bg-orange-50 border-orange-200 text-orange-700 font-bold scale-[1.02]' 
                    : 'bg-white border-slate-200 text-slate-600'}
                `}
              >
                {frame}
              </div>
            ))}
            {currentStep.stack.length === 0 && step === 0 && (
              <div className="text-center text-slate-400 italic py-8">Pile vide</div>
            )}
            {currentStep.stack.length === 0 && step > 0 && (
              <div className="text-center text-emerald-600 font-bold py-8 text-lg">
                Résultat final : {currentStep.result}
              </div>
            )}
          </div>
        </div>

        {/* Explications de l'étape */}
        <div className="flex flex-col justify-center">
          <div className="bg-slate-50 text-slate-800 p-6 rounded-xl border border-slate-100 relative">
            <Info size={20} className="absolute top-4 right-4 text-orange-400" />
            <div className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-2">Étape {step + 1} / {steps.length}</div>
            <p className="text-base font-medium leading-relaxed">{currentStep.action}</p>
          </div>
          
          {step > 0 && step < steps.length - 1 && (
            <div className="mt-4 p-4 bg-white border border-slate-200 rounded-xl text-sm flex flex-col gap-1 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opération en mémoire</span>
              {currentStep.stack.length > steps[step-1].stack.length ? (
                <span className="text-blue-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Empilement (Push)</span>
              ) : (
                <span className="text-emerald-600 font-medium flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Dépilement (Pop)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}