
'use client';

import React, { useState } from 'react';
import { Package, Truck, Globe, Wifi, ArrowDown, ArrowUp } from 'lucide-react';

export default function EncapsulationVisualizer() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'encapsulation' | 'desencapsulation'>('encapsulation');

  const layers = [
    { 
      id: 1, 
      name: "Application", 
      icon: <Package className="w-6 h-6 text-white" />, 
      color: "bg-slate-800", 
      content: "Données (Message)",
      description: "Le message brut créé par l'utilisateur (ex: HTTP)"
    },
    { 
      id: 2, 
      name: "Transport (TCP)", 
      icon: <Truck className="w-6 h-6 text-white" />, 
      color: "bg-slate-600", 
      content: "Segment",
      description: "Ajout des ports (Source/Dest) pour identifier l'application"
    },
    { 
      id: 3, 
      name: "Internet (IP)", 
      icon: <Globe className="w-6 h-6 text-white" />, 
      color: "bg-orange-600", 
      content: "Paquet",
      description: "Ajout des adresses IP pour le routage à travers le monde"
    },
    { 
      id: 4, 
      name: "Accès Réseau", 
      icon: <Wifi className="w-6 h-6 text-white" />, 
      color: "bg-orange-500", 
      content: "Trame",
      description: "Ajout des adresses MAC pour la liaison locale (Câble/WiFi)"
    }
  ];

  const maxSteps = layers.length;

  const nextStep = () => {
    if (step < maxSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const reset = () => {
    setStep(0);
  };

  const toggleMode = () => {
    setMode(mode === 'encapsulation' ? 'desencapsulation' : 'encapsulation');
    setStep(0);
  };

  return (
    <div className="border rounded-xl p-6 bg-slate-50 shadow-lg my-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            {mode === 'encapsulation' ? '📦 Encapsulation' : '📦 Désencapsulation'}
          </h3>
          <p className="text-sm text-slate-500">
            {mode === 'encapsulation' 
              ? "Les données descendent les couches avant l'envoi." 
              : "Les données remontent les couches à la réception."}
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleMode}
            className="text-xs px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            Changer de mode
          </button>
          <button 
            onClick={reset}
            className="text-xs px-3 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-slate-200 p-8 overflow-hidden">
        
        {/* Visualisation des couches imbriquées */}
        <div className="relative flex items-center justify-center w-full">
          {layers.map((layer, index) => {
            // Logique d'affichage selon le mode et l'étape
            let isVisible = false;
            if (mode === 'encapsulation') {
              isVisible = index < step;
            } else {
              isVisible = index >= (maxSteps - step); // On enlève les couches externes
            }

            // Calcul de la taille pour l'effet "Poupée Russe"
            // Plus l'index est grand (couche basse), plus c'est grand en encapsulation
            const size = 100 + (index * 60); 
            const zIndex = 50 - index; // Les plus petits au dessus

            if (!isVisible && mode === 'encapsulation') return null;
            // En désencapsulation, on montre tout au début (step 0), puis on enlève les couches externes
            if (mode === 'desencapsulation' && index < (maxSteps - step) && step > 0 && index !== 0) {
               // Pour garder le coeur visible
            }
            
            // Logique simplifiée pour l'affichage statique "final" ou étape par étape
            // En encapsulation : on affiche les couches 0 à step-1
            // En désencapsulation : on affiche les couches step à maxSteps-1 ? Non.
            
            // Refonte logique visuelle
            const showLayer = mode === 'encapsulation' 
              ? index < step 
              : index < (maxSteps - step);

            if (!showLayer) return null;

            return (
              <div 
                key={layer.id}
                className={`absolute flex flex-col items-center justify-start pt-2 border-2 border-white shadow-xl rounded-xl transition-all duration-500 ease-in-out ${layer.color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  zIndex: zIndex,
                  opacity: 1,
                  transform: `scale(${1})`,
                }}
              >
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider mb-1">
                  {layer.icon}
                  {layer.name}
                </div>
                {index === 0 && (
                  <div className="mt-4 text-white text-center text-xs px-2">
                    {layer.content}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Placeholder si vide */}
          {step === 0 && mode === 'encapsulation' && (
            <div className="text-slate-400 italic">Cliquez sur "Suivant" pour commencer l'envoi...</div>
          )}
          {step === maxSteps && mode === 'desencapsulation' && (
            <div className="text-green-600 font-bold text-lg">Message reçu ! 🎉</div>
          )}
        </div>

      </div>

      {/* Contrôles et explications */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="text-center h-12">
          {step > 0 && step <= maxSteps && (
            <p className="text-slate-700 font-medium">
              {mode === 'encapsulation' 
                ? `Étape ${step} : ${layers[step-1].description}`
                : `Étape ${step} : On retire la couche ${layers[maxSteps-step].name}`
              }
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 disabled:opacity-50 font-medium hover:bg-slate-300 transition-colors"
          >
            Précédent
          </button>
          <button
            onClick={nextStep}
            disabled={step === maxSteps}
            className="px-6 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50 disabled:shadow-none"
          >
            {step === maxSteps ? 'Terminé' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
