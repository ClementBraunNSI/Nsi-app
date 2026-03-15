"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, Play, CheckCircle2, XCircle, ArrowRight, ArrowDown } from 'lucide-react';

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  const [low, setLow] = useState<number>(0);
  const [high, setHigh] = useState<number>(0);
  const [mid, setMid] = useState<number | null>(null);
  const [found, setFound] = useState<boolean | null>(null); // null = searching, true = found, false = not found
  const [message, setMessage] = useState<string>("Initialisation...");
  const [history, setHistory] = useState<string[]>([]);

  // Initialize with a sorted array
  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    // Generate a sorted array of 15 unique numbers between 1 and 100
    const newArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 99) + 1);
    // Ensure uniqueness and sort
    const uniqueSorted = Array.from(new Set(newArray)).sort((a, b) => a - b).slice(0, 12);
    
    setArray(uniqueSorted);
    setLow(0);
    setHigh(uniqueSorted.length - 1);
    setMid(null);
    setFound(null);
    setHistory([]);
    
    // Pick a random target from the array or a number not in the array (20% chance)
    if (Math.random() > 0.2 && uniqueSorted.length > 0) {
      setTarget(uniqueSorted[Math.floor(Math.random() * uniqueSorted.length)]);
    } else {
      let randomTarget = Math.floor(Math.random() * 99) + 1;
      while (uniqueSorted.includes(randomTarget)) {
        randomTarget = Math.floor(Math.random() * 99) + 1;
      }
      setTarget(randomTarget);
    }
    
    setMessage("Prêt à commencer la recherche.");
  };

  const nextStep = () => {
    if (found !== null || target === null) return;

    if (low > high) {
      setFound(false);
      setMessage(`La zone de recherche est vide (début ${low} > fin ${high}). La valeur n'est pas présente.`);
      setHistory(prev => [...prev, `Fin : ${low} > ${high} → Non trouvé`]);
      return;
    }

    const currentMid = Math.floor((low + high) / 2);
    setMid(currentMid);

    const midValue = array[currentMid];

    if (midValue === target) {
      setFound(true);
      setMessage(`Trouvé ! La valeur ${target} est à l'index ${currentMid}.`);
      setHistory(prev => [...prev, `Milieu = ${currentMid} (valeur ${midValue}) == Cible → Trouvé !`]);
    } else if (midValue < target) {
      setMessage(`La valeur centrale ${midValue} est plus petite que ${target}. On cherche à droite.`);
      setHistory(prev => [...prev, `Milieu = ${currentMid} (valeur ${midValue}) < Cible → Droite`]);
      setLow(currentMid + 1);
    } else {
      setMessage(`La valeur centrale ${midValue} est plus grande que ${target}. On cherche à gauche.`);
      setHistory(prev => [...prev, `Milieu = ${currentMid} (valeur ${midValue}) > Cible → Gauche`]);
      setHigh(currentMid - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Search className="text-emerald-600" />
          Visualiseur de Recherche Dichotomique
        </h3>
        <div className="flex gap-2">
           <button
            onClick={nextStep}
            disabled={found !== null}
            className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
              found !== null
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
            }`}
          >
            <Play size={18} /> Étape Suivante
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} /> Nouveau
          </button>
        </div>
      </div>

      <div className="mb-8 text-center">
        <span className="text-slate-500 font-medium">Valeur cherchée (Cible) : </span>
        <span className="text-3xl font-black text-emerald-600 ml-2">{target}</span>
      </div>

      {/* Visualization Area */}
      <div className="relative flex justify-center items-end h-32 gap-2 mb-8 px-4">
        <AnimatePresence>
          {array.map((value, index) => {
            const isOutOfRange = index < low || index > high;
            const isMid = index === mid;
            const isTarget = index === mid && found === true;
            
            return (
              <motion.div
                key={`${value}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: isOutOfRange ? 0.3 : 1,
                  scale: isMid ? 1.1 : 1,
                  y: isMid ? -10 : 0,
                  backgroundColor: isTarget 
                    ? "#10b981" // Emerald-500
                    : isMid 
                      ? "#f59e0b" // Amber-500
                      : isOutOfRange 
                        ? "#e2e8f0" // Slate-200
                        : "#3b82f6" // Blue-500
                }}
                className={`
                  relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-sm font-bold text-white transition-colors duration-300
                  ${isOutOfRange ? "text-slate-400" : ""}
                `}
              >
                {value}
                
                {/* Indices */}
                <span className="absolute -bottom-6 text-xs text-slate-400 font-mono font-normal">
                  {index}
                </span>

                {/* Markers */}
                {index === low && !isOutOfRange && (
                  <motion.div 
                    layoutId="marker-low"
                    className="absolute -top-8 text-xs font-bold text-blue-500 flex flex-col items-center"
                  >
                    <span>Début</span>
                    <ArrowDown className="w-4 h-4" />
                  </motion.div>
                )}
                {index === high && !isOutOfRange && (
                  <motion.div 
                    layoutId="marker-high"
                    className="absolute -top-8 text-xs font-bold text-blue-500 flex flex-col items-center"
                  >
                    <span>Fin</span>
                    <ArrowDown className="w-4 h-4" />
                  </motion.div>
                )}
                {isMid && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-16 bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-sm border border-amber-200"
                  >
                    Milieu
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Info Panel */}
      <div className={`p-4 rounded-xl border transition-colors duration-300 ${
        found === true ? "bg-emerald-50 border-emerald-200" : 
        found === false ? "bg-red-50 border-red-200" : 
        "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-start gap-3">
          {found === true ? <CheckCircle2 className="text-emerald-600 mt-1" /> :
           found === false ? <XCircle className="text-red-600 mt-1" /> :
           <div className="w-6 h-6 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin mt-1" />}
          
          <div>
            <h4 className={`font-bold ${
              found === true ? "text-emerald-700" : 
              found === false ? "text-red-700" : 
              "text-slate-700"
            }`}>
              {message}
            </h4>
            <div className="mt-2 text-sm text-slate-500">
              <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">debut: {low}</span>
              <span className="mx-2">•</span>
              <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">fin: {high}</span>
              {mid !== null && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">milieu: {mid}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Historique des étapes</h4>
          <div className="space-y-1">
            {history.map((step, i) => (
              <div key={i} className="text-xs text-slate-600 font-mono flex items-center gap-2">
                <span className="text-slate-300 w-4">{i + 1}.</span>
                {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
