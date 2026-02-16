
'use client';

import React, { useState } from 'react';

export default function PixelManipulator() {
  const [r, setR] = useState(255);
  const [g, setG] = useState(165);
  const [b, setB] = useState(0);

  const hex = (val: number) => val.toString(16).padStart(2, '0').toUpperCase();

  return (
    <div className="border rounded-xl p-8 bg-white shadow-lg my-8">
      <h3 className="text-xl font-bold mb-6">Mélangeur de Couleurs (RVB)</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Sliders */}
        <div className="flex-1 space-y-6 w-full">
          <div>
            <label className="flex justify-between text-sm font-bold text-red-600 mb-2">
              <span>Rouge (R)</span>
              <span>{r}</span>
            </label>
            <input 
              type="range" min="0" max="255" value={r} 
              onChange={(e) => setR(parseInt(e.target.value))}
              className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
          </div>
          
          <div>
            <label className="flex justify-between text-sm font-bold text-green-600 mb-2">
              <span>Vert (G)</span>
              <span>{g}</span>
            </label>
            <input 
              type="range" min="0" max="255" value={g} 
              onChange={(e) => setG(parseInt(e.target.value))}
              className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
          </div>
          
          <div>
            <label className="flex justify-between text-sm font-bold text-blue-600 mb-2">
              <span>Bleu (B)</span>
              <span>{b}</span>
            </label>
            <input 
              type="range" min="0" max="255" value={b} 
              onChange={(e) => setB(parseInt(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        {/* Visualizer */}
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-32 h-32 rounded-2xl shadow-inner border-4 border-gray-100 transition-colors"
            style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
          />
          <div className="text-center font-mono bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-600">
            <div>rgb({r}, {g}, {b})</div>
            <div className="font-bold text-gray-800">#{hex(r)}{hex(g)}{hex(b)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
