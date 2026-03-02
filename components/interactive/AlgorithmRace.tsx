
'use client';

import React, { useState, useEffect } from 'react';

export default function AlgorithmRace() {
  const [array, setArray] = useState([50, 20, 90, 10, 60, 80, 30, 70, 40]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const reset = () => {
    setArray([50, 20, 90, 10, 60, 80, 30, 70, 40]);
    setComparing([]);
    setSorted([]);
    setIsRunning(false);
  };

  const bubbleSort = async () => {
    if (isRunning) return;
    setIsRunning(true);
    const arr = [...array];
    
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setComparing([j, j + 1]);
        await new Promise(r => setTimeout(r, 300));
        
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await new Promise(r => setTimeout(r, 300));
        }
      }
      setSorted(prev => [...prev, arr.length - i - 1]);
    }
    setComparing([]);
    setSorted(Array.from({length: arr.length}, (_, i) => i));
    setIsRunning(false);
  };

  return (
    <div className="border rounded-xl p-8 bg-slate-50 shadow-lg my-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold text-slate-800">🏎️ La Course du Tri à Bulles</h3>
        <div className="flex gap-4">
          <button onClick={reset} className="text-slate-500 hover:text-slate-800 text-sm font-bold">Réinitialiser</button>
          <button 
            onClick={bubbleSort} 
            disabled={isRunning}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Tri en cours...' : 'Lancer le Tri'}
          </button>
        </div>
      </div>

      <div className="h-64 flex items-end justify-center gap-2 p-4 bg-white rounded-xl shadow-inner border border-slate-200">
        {array.map((val, i) => {
          const isComparing = comparing.includes(i);
          const isSorted = sorted.includes(i);
          
          return (
            <div 
              key={i}
              className={`w-8 rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 text-xs font-bold text-white shadow-sm ${
                isComparing ? 'bg-orange-500 scale-110 z-10' : 
                isSorted ? 'bg-slate-800' : 
                'bg-slate-400'
              }`}
              style={{ height: `${val}%` }}
            >
              {val}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-center text-sm text-slate-500">
        {comparing.length > 0 
          ? `Comparaison : ${array[comparing[0]]} > ${array[comparing[1]]} ? ${array[comparing[0]] > array[comparing[1]] ? 'OUI (Échange)' : 'NON'}`
          : isRunning ? 'Fin du passage...' : 'Prêt.'}
      </div>
    </div>
  );
}
