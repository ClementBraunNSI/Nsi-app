
'use client';

import React, { useState } from 'react';

export default function BinaryPixelArt() {
  const gridSize = 8;
  const [grid, setGrid] = useState<number[]>(Array(gridSize * gridSize).fill(0));

  const togglePixel = (index: number) => {
    const newGrid = [...grid];
    newGrid[index] = newGrid[index] === 0 ? 1 : 0;
    setGrid(newGrid);
  };

  const getBinaryString = () => {
    return grid.map((val, i) => {
      let str = val.toString();
      if ((i + 1) % gridSize === 0) str += '\n';
      else str += ' ';
      return str;
    }).join('');
  };

  const getHexCode = () => {
    let hex = '';
    for (let i = 0; i < gridSize; i++) {
      const row = grid.slice(i * gridSize, (i + 1) * gridSize).join('');
      const val = parseInt(row, 2);
      hex += '0x' + val.toString(16).padStart(2, '0').toUpperCase() + ' ';
    }
    return hex.trim();
  };

  return (
    <div className="border rounded-xl p-8 bg-slate-50 shadow-lg my-8 flex flex-col md:flex-row gap-8 items-start">
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-bold text-slate-800">1. Dessine ton Pixel Art</h3>
        <div 
          className="grid gap-1 bg-white p-2 rounded-lg shadow-sm border border-slate-200"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {grid.map((val, i) => (
            <div
              key={i}
              onClick={() => togglePixel(i)}
              className={`w-8 h-8 border rounded-md cursor-pointer transition-all duration-200 ${
                val === 1 ? 'bg-slate-900 border-slate-900 scale-95' : 'bg-white border-slate-200 hover:bg-slate-100'
              }`}
            />
          ))}
        </div>
        <button 
          onClick={() => setGrid(Array(gridSize * gridSize).fill(0))}
          className="text-xs text-red-500 hover:text-red-700 underline text-center"
        >
          Effacer tout
        </button>
      </div>

      <div className="flex-1 space-y-6 w-full">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">2. Représentation Binaire</h3>
          <p className="text-sm text-slate-500 mb-2">L'ordinateur voit une suite de 0 (blanc) et de 1 (noir).</p>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-xl font-mono text-sm leading-relaxed overflow-auto max-h-48 shadow-inner">
            {getBinaryString()}
          </pre>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">3. En Hexadécimal</h3>
          <p className="text-sm text-slate-500 mb-2">Pour compresser, on regroupe les bits par 8.</p>
          <div className="bg-white border border-slate-200 p-4 rounded-xl font-mono text-orange-600 font-bold shadow-sm">
            {getHexCode()}
          </div>
        </div>
      </div>
    </div>
  );
}
