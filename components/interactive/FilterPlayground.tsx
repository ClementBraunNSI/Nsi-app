'use client';

import React, { useState } from 'react';
import { Sliders, RefreshCw, Calculator } from 'lucide-react';

export default function FilterPlayground() {
  const [r, setR] = useState(100);
  const [g, setG] = useState(150);
  const [b, setB] = useState(200);
  const [activeFilter, setActiveFilter] = useState<'none' | 'grayscale' | 'invert' | 'red' | 'blue' | 'green'>('none');

  const getFilteredColor = () => {
    switch (activeFilter) {
      case 'grayscale':
        const avg = Math.round((r + g + b) / 3);
        return { r: avg, g: avg, b: avg, formula: `(${r} + ${g} + ${b}) / 3 ≈ ${avg}` };
      case 'invert':
        return { 
          r: 255 - r, 
          g: 255 - g, 
          b: 255 - b, 
          formula: `R: 255-${r}, G: 255-${g}, B: 255-${b}` 
        };
      case 'red':
        return { r: r, g: 0, b: 0, formula: `R: ${r}, G: 0, B: 0` };
      case 'green':
        return { r: 0, g: g, b: 0, formula: `R: 0, G: ${g}, B: 0` };
      case 'blue':
        return { r: 0, g: 0, b: b, formula: `R: 0, G: 0, B: ${b}` };
      default:
        return { r, g, b, formula: `R: ${r}, G: ${g}, B: ${b}` };
    }
  };

  const filtered = getFilteredColor();

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-slate-50 rounded-xl shadow-lg border border-slate-200 my-8">
      
      {/* Input Section */}
      <div className="flex-1 space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-orange-500" />
          Pixel Original
        </h3>

        <div className="flex gap-4 items-center">
          <div 
            className="w-24 h-24 rounded-lg shadow-md border border-slate-300"
            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
          />
          <div className="space-y-1 text-sm font-mono text-slate-600">
            <div>Rouge : {r}</div>
            <div>Vert  : {g}</div>
            <div>Bleu  : {b}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-red-500 block mb-1">Rouge ({r})</label>
            <input 
              type="range" min="0" max="255" value={r} 
              onChange={(e) => setR(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-green-500 block mb-1">Vert ({g})</label>
            <input 
              type="range" min="0" max="255" value={g} 
              onChange={(e) => setG(Number(e.target.value))}
              className="w-full accent-green-500"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-blue-500 block mb-1">Bleu ({b})</label>
            <input 
              type="range" min="0" max="255" value={b} 
              onChange={(e) => setB(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex-1 space-y-6 border-l border-slate-200 pl-0 md:pl-8">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-orange-500" />
          Traitement Mathématique
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => setActiveFilter('none')}
            className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${activeFilter === 'none' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'}`}
          >
            Original
          </button>
          <button 
            onClick={() => setActiveFilter('grayscale')}
            className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${activeFilter === 'grayscale' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'}`}
          >
            Niveaux de Gris
          </button>
          <button 
            onClick={() => setActiveFilter('invert')}
            className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${activeFilter === 'invert' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'}`}
          >
            Négatif (Inversion)
          </button>
          <button 
            onClick={() => setActiveFilter('red')}
            className={`px-3 py-2 rounded-lg text-sm font-bold border transition-all ${activeFilter === 'red' ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'}`}
          >
            Filtre Rouge
          </button>
        </div>

        <div className="bg-slate-100 rounded-xl p-4 flex gap-4 items-center">
           <div 
            className="w-24 h-24 rounded-lg shadow-md border border-slate-300 transition-colors duration-300"
            style={{ backgroundColor: `rgb(${filtered.r}, ${filtered.g}, ${filtered.b})` }}
          />
          <div className="flex-1">
            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Résultat</div>
            <div className="font-mono text-lg font-bold text-slate-800 mb-2">
              rgb({filtered.r}, {filtered.g}, {filtered.b})
            </div>
            <div className="text-xs bg-white p-2 rounded border border-slate-200 font-mono text-slate-600">
              <span className="font-bold text-orange-600">Math :</span> {filtered.formula}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
