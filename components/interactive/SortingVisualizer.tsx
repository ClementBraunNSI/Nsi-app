'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, StepForward, Settings } from 'lucide-react';

type SortAlgorithm = 'selection' | 'insertion' | 'bubble';

interface SortingVisualizerProps {
  algorithm?: SortAlgorithm;
  title?: string;
}

export default function SortingVisualizer({ algorithm = 'selection', title }: SortingVisualizerProps) {
  // State
  const [array, setArray] = useState<number[]>([]);
  const [comparing, setComparing] = useState<number[]>([]); // Indices being compared
  const [swapping, setSwapping] = useState<number[]>([]); // Indices being swapped
  const [sorted, setSorted] = useState<number[]>([]); // Indices that are sorted
  const [highlight, setHighlight] = useState<number[]>([]); // Special highlight (e.g. current min)
  const [message, setMessage] = useState("Prêt à trier !");
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(500);
  
  // Generator ref to pause/resume
  const generatorRef = useRef<Generator<any, void, unknown> | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize array
  useEffect(() => {
    resetArray();
    return () => stop();
  }, []);

  const resetArray = () => {
    stop();
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setHighlight([]);
    setMessage("Nouveau tableau généré.");
    generatorRef.current = null;
  };

  const stop = () => {
    setIsRunning(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const getAlgorithmGenerator = function* (arr: number[]): Generator<any, void, unknown> {
    const n = arr.length;
    const a = [...arr];

    if (algorithm === 'selection') {
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        setHighlight([minIdx]); // Highlight current min candidate
        setMessage(`Recherche du minimum à partir de l'index ${i}...`);
        yield;

        for (let j = i + 1; j < n; j++) {
          setComparing([minIdx, j]);
          setMessage(`Comparaison : ${a[j]} < ${a[minIdx]} ?`);
          yield;

          if (a[j] < a[minIdx]) {
            minIdx = j;
            setHighlight([minIdx]); // New min found
            setMessage(`Nouveau minimum trouvé : ${a[minIdx]}`);
            yield;
          }
        }

        if (minIdx !== i) {
          setSwapping([i, minIdx]);
          setMessage(`Échange de ${a[i]} et ${a[minIdx]}`);
          yield;
          
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          setArray([...a]);
          yield;
        }
        
        setSwapping([]);
        setComparing([]);
        setHighlight([]);
        setSorted(prev => [...prev, i]);
        setMessage(`L'élément ${a[i]} est trié.`);
        yield;
      }
    } 
    else if (algorithm === 'insertion') {
      setSorted([0]); // First element is trivially sorted
      for (let i = 1; i < n; i++) {
        let key = a[i];
        let j = i - 1;
        
        setHighlight([i]); // Element to insert
        setMessage(`Insertion de ${key} dans la partie triée...`);
        yield;

        while (j >= 0) {
          setComparing([j, j+1]); // Visualizing comparison with gap
          setMessage(`Comparaison : ${a[j]} > ${key} ?`);
          yield;

          if (a[j] > key) {
            setSwapping([j, j+1]);
            setMessage(`Décalage de ${a[j]} vers la droite`);
            a[j + 1] = a[j]; // Shift
            a[j] = key; // Visualize the key moving left (simplified for visual)
            setArray([...a]);
            yield;
            j--;
          } else {
            break;
          }
        }
        
        a[j + 1] = key;
        setArray([...a]);
        setSorted(Array.from({length: i + 1}, (_, k) => k));
        setMessage(`${key} inséré à la position ${j + 1}`);
        setSwapping([]);
        setHighlight([]);
        yield;
      }
    }
    else if (algorithm === 'bubble') {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          setComparing([j, j + 1]);
          setMessage(`Comparaison : ${a[j]} > ${a[j+1]} ?`);
          yield;

          if (a[j] > a[j + 1]) {
            setSwapping([j, j + 1]);
            setMessage(`Échange : ${a[j]} et ${a[j+1]}`);
            yield;

            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            setArray([...a]);
            yield;
          }
        }
        setSorted(prev => [...prev, n - i - 1]);
        setMessage(`${a[n-i-1]} est à sa place définitive.`);
        yield;
      }
      setSorted(Array.from({length: n}, (_, k) => k));
    }

    setMessage("Tri terminé !");
    setComparing([]);
    setSwapping([]);
    setHighlight([]);
    setIsRunning(false);
  };

  const step = () => {
    if (!generatorRef.current) {
      generatorRef.current = getAlgorithmGenerator(array);
    }
    const result = generatorRef.current.next();
    if (result.done) {
      setIsRunning(false);
      generatorRef.current = null;
    }
    return !result.done;
  };

  const play = () => {
    if (isRunning) return;
    setIsRunning(true);
    
    const loop = () => {
      const notDone = step();
      if (notDone) {
        timeoutRef.current = setTimeout(loop, speed);
      }
    };
    loop();
  };

  const togglePlay = () => {
    if (isRunning) {
      stop();
    } else {
      play();
    }
  };

  const getBarColor = (index: number) => {
    if (swapping.includes(index)) return 'bg-red-500';
    if (highlight.includes(index)) return 'bg-purple-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    if (sorted.includes(index)) return 'bg-emerald-500';
    return 'bg-blue-400';
  };

  const defaultTitles = {
    selection: "Tri par Sélection",
    insertion: "Tri par Insertion",
    bubble: "Tri à Bulles"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden my-8">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          {title || defaultTitles[algorithm]}
        </h3>
        
        <div className="flex items-center gap-2">
           <button 
            onClick={resetArray}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw size={18} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={`p-2 rounded-lg text-white transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            title={isRunning ? "Pause" : "Lecture"}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button 
            onClick={() => { stop(); step(); }}
            className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
            title="Pas à pas"
            disabled={isRunning}
          >
            <StepForward size={18} />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="h-48 flex items-end justify-center gap-1 sm:gap-2 mb-6">
          {array.map((value, idx) => (
            <div 
              key={idx}
              className={`flex-1 rounded-t-md transition-all duration-300 flex items-end justify-center pb-1 text-[10px] sm:text-xs font-bold text-white ${getBarColor(idx)}`}
              style={{ height: `${value}%` }}
            >
              {value}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="bg-slate-100 px-4 py-2 rounded-lg text-slate-700 font-medium w-full sm:w-auto text-center sm:text-left">
            {message}
          </div>
          
          <div className="flex items-center gap-2 text-slate-500">
            <span className="text-xs font-bold uppercase">Vitesse</span>
            <input 
              type="range" 
              min="50" 
              max="1000" 
              step="50"
              value={1050 - speed} // Invert so right is faster
              onChange={(e) => setSpeed(1050 - Number(e.target.value))}
              className="w-24 accent-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-slate-500">
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Trié</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Comparaison</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Échange</div>
          {algorithm === 'selection' && <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Min actuel</div>}
          {algorithm === 'insertion' && <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> À insérer</div>}
        </div>
      </div>
    </div>
  );
}
