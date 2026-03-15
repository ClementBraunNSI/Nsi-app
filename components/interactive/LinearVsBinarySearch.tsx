"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Zap, Snail } from 'lucide-react';

export default function LinearVsBinarySearch() {
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number>(0);
  
  // Linear Search State
  const [linearIndex, setLinearIndex] = useState<number>(-1);
  const [linearSteps, setLinearSteps] = useState<number>(0);
  const [linearFound, setLinearFound] = useState<boolean | null>(null);

  // Binary Search State
  const [binaryLow, setBinaryLow] = useState<number>(0);
  const [binaryHigh, setBinaryHigh] = useState<number>(0);
  const [binaryMid, setBinaryMid] = useState<number | null>(null);
  const [binarySteps, setBinarySteps] = useState<number>(0);
  const [binaryFound, setBinaryFound] = useState<boolean | null>(null);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    reset();
  }, []);

  const reset = () => {
    // Generate sorted array of 15 elements (reduced from 32 for better visibility)
    const newArray = Array.from({ length: 15 }, (_, i) => i * 6 + Math.floor(Math.random() * 5));
    setArray(newArray);
    
    // Pick a target in the last quarter to show the difference better
    const randomTargetIndex = Math.floor(10 + Math.random() * 5);
    setTarget(newArray[randomTargetIndex]);

    setLinearIndex(-1);
    setLinearSteps(0);
    setLinearFound(null);

    setBinaryLow(0);
    setBinaryHigh(newArray.length - 1);
    setBinaryMid(null);
    setBinarySteps(0);
    setBinaryFound(null);
    setIsRunning(false);
  };

  const runComparison = async () => {
    if (isRunning) return;
    setIsRunning(true);

    // Reset states for a fresh run
    setLinearIndex(-1);
    setLinearSteps(0);
    setLinearFound(null);
    setBinaryLow(0);
    setBinaryHigh(array.length - 1);
    setBinaryMid(null);
    setBinarySteps(0);
    setBinaryFound(null);

    // --- LINEAR SEARCH (SLOW) ---
    // We simulate the linear search step by step
    let lIndex = 0;
    let lSteps = 0;
    
    const linearInterval = setInterval(() => {
      if (lIndex >= array.length) {
        setLinearFound(false);
        clearInterval(linearInterval);
        return;
      }

      setLinearIndex(lIndex);
      lSteps++;
      setLinearSteps(lSteps);

      if (array[lIndex] === target) {
        setLinearFound(true);
        clearInterval(linearInterval);
      } else {
        lIndex++;
      }
    }, 150); // Slow speed for linear

    // --- BINARY SEARCH (FAST) ---
    // We simulate binary search
    let bLow = 0;
    let bHigh = array.length - 1;
    let bSteps = 0;

    const binaryInterval = setInterval(() => {
        if (bLow > bHigh) {
            setBinaryFound(false);
            clearInterval(binaryInterval);
            return;
        }

        const bMid = Math.floor((bLow + bHigh) / 2);
        setBinaryMid(bMid);
        bSteps++;
        setBinarySteps(bSteps);

        if (array[bMid] === target) {
            setBinaryFound(true);
            clearInterval(binaryInterval);
        } else if (array[bMid] < target) {
            setBinaryLow(bMid + 1); // Update for visualizer
            bLow = bMid + 1;
        } else {
            setBinaryHigh(bMid - 1); // Update for visualizer
            bHigh = bMid - 1;
        }

    }, 800); // Slower interval for binary so we can see it, but fewer steps

    // Cleanup when both are done (rough estimate or state check)
    // Here we just let them run independently
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Zap className="text-orange-500" />
          Course : Linéaire vs Dichotomique
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runComparison}
            disabled={isRunning && (linearFound === null || binaryFound === null)}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Play size={18} /> Lancer la course
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
          >
            <RotateCcw size={18} /> Reset
          </button>
        </div>
      </div>

      <div className="mb-8 text-center">
        <span className="text-slate-500 font-medium">Cible à trouver : </span>
        <span className="text-3xl font-black text-slate-800 ml-2">{target}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LINEAR SEARCH SECTION */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <Snail className="text-blue-500" /> Recherche Séquentielle
            </h4>
            <span className="bg-white px-2 py-1 rounded border text-sm font-mono">
              Étapes : {linearSteps}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {array.map((val, idx) => (
              <div 
                key={idx}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-150 ${
                  idx === linearIndex 
                    ? (linearFound && array[idx] === target ? "bg-emerald-500 text-white scale-110 shadow-md" : "bg-blue-500 text-white scale-110 shadow-md")
                    : (idx < linearIndex ? "bg-slate-200 text-slate-400 opacity-50" : "bg-white border border-slate-300 text-slate-700")
                }`}
              >
                {val}
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center">
             Complexité O(n) - Vérifie tout un par un
          </div>
        </div>

        {/* BINARY SEARCH SECTION */}
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-emerald-800 flex items-center gap-2">
              <Zap className="text-emerald-600" /> Recherche Dichotomique
            </h4>
            <span className="bg-white px-2 py-1 rounded border text-sm font-mono">
              Étapes : {binarySteps}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {array.map((val, idx) => {
              const isEliminated = idx < binaryLow || idx > binaryHigh;
              const isMid = idx === binaryMid;
              
              return (
                <div 
                  key={idx}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                    isMid 
                      ? (binaryFound && array[idx] === target ? "bg-emerald-600 text-white scale-125 z-10" : "bg-orange-500 text-white scale-110 z-10")
                      : (isEliminated ? "bg-slate-200 text-slate-300 opacity-50 scale-90" : "bg-white border border-emerald-200 text-emerald-900")
                  }`}
                >
                  {val}
                </div>
              );
            })}
          </div>
           <div className="mt-2 text-xs text-emerald-600/70 text-center">
             Complexité O(log n) - Coupe en deux à chaque fois
          </div>
        </div>

      </div>
    </div>
  );
}
