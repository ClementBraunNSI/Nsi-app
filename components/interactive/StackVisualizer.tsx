"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowDown, Database, Trash2, Plus } from 'lucide-react';

interface StackVisualizerProps {
  initialData?: any[];
  maxSize?: number;
  type?: 'stack' | 'queue'; // Pile ou File
}

export default function StackVisualizer({ initialData = [], maxSize = 8, type = 'stack' }: StackVisualizerProps) {
  const [items, setItems] = useState<any[]>(initialData);
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const push = () => {
    if (!inputValue) return;
    if (items.length >= maxSize) {
      setMessage("Erreur : La structure est pleine (Overflow) !");
      return;
    }
    
    setItems(prev => type === 'stack' ? [...prev, inputValue] : [...prev, inputValue]);
    setInputValue("");
    setMessage(`Ajout de "${inputValue}"`);
  };

  const pop = () => {
    if (items.length === 0) {
      setMessage("Erreur : La structure est vide (Underflow) !");
      return;
    }
    
    const removed = type === 'stack' ? items[items.length - 1] : items[0];
    setItems(prev => type === 'stack' ? prev.slice(0, -1) : prev.slice(1));
    setMessage(`Retrait de "${removed}"`);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Database className="text-emerald-600" />
        Visualiseur de {type === 'stack' ? 'Pile (LIFO)' : 'File (FIFO)'}
      </h3>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Valeur..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && push()}
          />
          <button
            onClick={push}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Empiler
          </button>
        </div>
        <button
          onClick={pop}
          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <Trash2 size={18} /> Dépiler
        </button>
      </div>

      {message && (
        <div className="mb-4 text-sm font-medium text-slate-500 italic">
          Console : {message}
        </div>
      )}

      {/* Visualization Area */}
      <div className={`
        flex items-center justify-center bg-slate-50 rounded-xl p-8 min-h-[200px] border border-slate-200 relative
        ${type === 'stack' ? 'flex-col-reverse justify-end' : 'flex-row justify-start overflow-x-auto'}
      `}>
        <AnimatePresence mode='popLayout'>
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.8, y: type === 'stack' ? -50 : 0, x: type === 'queue' ? -50 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: type === 'stack' ? -50 : 0, x: type === 'queue' ? 50 : 0 }}
              className={`
                flex items-center justify-center font-bold text-slate-700 shadow-sm border border-slate-300 bg-white
                ${type === 'stack' ? 'w-full max-w-[200px] h-12 rounded-lg mb-2 last:mb-0' : 'min-w-[80px] h-20 rounded-xl mr-2 last:mr-0'}
              `}
            >
              {item}
              <span className="absolute text-[10px] text-slate-400 font-mono top-1 right-2">#{index}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-xl uppercase tracking-widest pointer-events-none">
            Vide
          </div>
        )}
      </div>
      
      <div className="mt-4 text-xs text-slate-400 text-center">
        {type === 'stack' 
          ? "Le dernier élément ajouté est le premier à sortir (Last In, First Out)."
          : "Le premier élément ajouté est le premier à sortir (First In, First Out)."
        }
      </div>
    </div>
  );
}
