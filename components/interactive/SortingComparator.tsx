'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, BarChart2, RefreshCw } from 'lucide-react';

const ALGORITHMS = [
  { id: 'selection', name: 'Tri par Sélection', color: 'bg-blue-500' },
  { id: 'insertion', name: 'Tri par Insertion', color: 'bg-emerald-500' },
  { id: 'bubble', name: 'Tri à Bulles', color: 'bg-orange-500' },
  { id: 'python', name: 'Tri Natif (Timsort)', color: 'bg-purple-500' }
];

export default function SortingComparator() {
  const [arraySize, setArraySize] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ [key: string]: number }>({});
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [arrays, setArrays] = useState<{ [key: string]: number[] }>({});
  
  // To stop execution if component unmounts or reset
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    reset();
  }, [arraySize]);

  const reset = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    const baseArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 5);
    const initialArrays: { [key: string]: number[] } = {};
    const initialProgress: { [key: string]: number } = {};
    
    ALGORITHMS.forEach(algo => {
      initialArrays[algo.id] = [...baseArray];
      initialProgress[algo.id] = 0;
    });

    setArrays(initialArrays);
    setProgress(initialProgress);
    setResults({});
    setIsRunning(false);
  };

  const runComparison = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setResults({});
    
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const promises = ALGORITHMS.map(async (algo) => {
      const arr = [...arrays[algo.id]];
      const n = arr.length;
      let steps = 0;
      
      const updateVisuals = async () => {
        if (steps % Math.max(1, Math.floor(n / 10)) === 0) {
          setArrays(prev => ({ ...prev, [algo.id]: [...arr] }));
          // For Python sort, we don't really track progress step-by-step in the same way
          if (algo.id !== 'python') {
             // Rough estimation of progress based on 'i' index would be better passed as arg
          }
          await new Promise(r => setTimeout(r, 10)); // Small delay to allow render
        }
      };

      try {
        if (algo.id === 'selection') {
          for (let i = 0; i < n; i++) {
            if (signal.aborted) return;
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
              steps++;
              if (arr[j] < arr[minIdx]) minIdx = j;
            }
            if (minIdx !== i) {
              [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
              steps++;
            }
            setProgress(prev => ({ ...prev, [algo.id]: (i / n) * 100 }));
            await updateVisuals();
          }
        } 
        else if (algo.id === 'insertion') {
          for (let i = 1; i < n; i++) {
            if (signal.aborted) return;
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
              steps++;
              arr[j + 1] = arr[j];
              j--;
            }
            arr[j + 1] = key;
            setProgress(prev => ({ ...prev, [algo.id]: (i / n) * 100 }));
            await updateVisuals();
          }
        }
        else if (algo.id === 'bubble') {
          for (let i = 0; i < n; i++) {
            if (signal.aborted) return;
            for (let j = 0; j < n - i - 1; j++) {
              steps++;
              if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                steps++;
              }
            }
            setProgress(prev => ({ ...prev, [algo.id]: (i / n) * 100 }));
            await updateVisuals();
          }
        }
        else if (algo.id === 'python') {
          // Native sort
          arr.sort((a, b) => a - b);
          steps = n * Math.log2(n); // Approximation
          setProgress(prev => ({ ...prev, [algo.id]: 100 }));
          setArrays(prev => ({ ...prev, [algo.id]: [...arr] }));
        }

        if (!signal.aborted) {
          setResults(prev => ({ ...prev, [algo.id]: Math.round(steps) }));
          setProgress(prev => ({ ...prev, [algo.id]: 100 }));
          setArrays(prev => ({ ...prev, [algo.id]: [...arr] })); // Ensure final state is shown
        }
      } catch (e) {
        // Ignore errors from abort
      }
    });

    await Promise.all(promises);
    if (!signal.aborted) setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 my-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart2 className="text-indigo-600" /> Comparateur de Performance
        </h3>
        
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="whitespace-nowrap">Taille : {arraySize}</span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={arraySize} 
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isRunning}
              className="accent-indigo-600 w-24 sm:w-32"
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={reset}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={runComparison} 
              disabled={isRunning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 text-sm"
            >
              {isRunning ? 'Calcul...' : <><Play size={16} /> Lancer</>}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ALGORITHMS.map(algo => (
          <div key={algo.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <div className="flex justify-between items-center mb-3">
              <span className={`font-bold text-sm px-2 py-1 rounded text-white ${algo.color}`}>
                {algo.name}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {results[algo.id] !== undefined ? `${results[algo.id]} ops` : 'En attente'}
              </span>
            </div>
            
            {/* Visualisation des barres */}
            <div className="h-24 flex items-end justify-center gap-[1px] mb-3">
              {arrays[algo.id]?.map((val, idx) => (
                <div 
                  key={idx}
                  className={`flex-1 rounded-t-sm ${algo.color} opacity-80`}
                  style={{ height: `${val}%` }}
                ></div>
              ))}
            </div>

            {/* Barre de progression */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${algo.color}`}
                style={{ width: `${progress[algo.id] || 0}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mt-6 text-xs text-slate-400 text-center italic">
        * Le nombre d'opérations est une approximation (comparaisons + échanges).
        Le tri natif (Python/JS) est quasi-instantané.
      </p>
    </div>
  );
}
