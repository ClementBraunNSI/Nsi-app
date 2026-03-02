'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ImageManipulatorProps {
  src?: string;
}

export default function ImageManipulator({ src = '/2928B642-6655-413A-9D95-A1F0D6F3A868_1_105_c.jpeg' }: ImageManipulatorProps) {
  const [rFactor, setRFactor] = useState(100);
  const [gFactor, setGFactor] = useState(100);
  const [bFactor, setBFactor] = useState(100);
  const [mode, setMode] = useState<'normal' | 'grayscale' | 'invert' | 'threshold' | 'sepia'>('normal');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      originalImageRef.current = img;
      applyFilters();
    };
  }, [src]);

  useEffect(() => {
    applyFilters();
  }, [rFactor, gFactor, bFactor, mode]);

  const applyFilters = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.drawImage(img, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Apply channel factors
      r = r * (rFactor / 100);
      g = g * (gFactor / 100);
      b = b * (bFactor / 100);

      // Apply effects
      if (mode === 'grayscale') {
        const avg = (r + g + b) / 3;
        r = avg;
        g = avg;
        b = avg;
      } else if (mode === 'invert') {
        r = 255 - r;
        g = 255 - g;
        b = 255 - b;
      } else if (mode === 'threshold') {
        const avg = (r + g + b) / 3;
        const val = avg > 128 ? 255 : 0;
        r = val;
        g = val;
        b = val;
      } else if (mode === 'sepia') {
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = tr;
        g = tg;
        b = tb;
      }

      // Clamp values
      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-lg my-8">
      <h3 className="text-xl font-bold mb-4">Manipulateur d'Image</h3>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Controls */}
        <div className="w-full lg:w-1/3 space-y-6">
          {/* Sliders */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Canaux RVB</h4>
            
            <div>
              <label className="flex justify-between text-sm font-bold text-red-600">
                <span>Rouge</span>
                <span>{rFactor}%</span>
              </label>
              <input 
                type="range" min="0" max="100" value={rFactor} 
                onChange={(e) => setRFactor(parseInt(e.target.value))}
                className="w-full h-2 bg-red-100 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-bold text-green-600">
                <span>Vert</span>
                <span>{gFactor}%</span>
              </label>
              <input 
                type="range" min="0" max="100" value={gFactor} 
                onChange={(e) => setGFactor(parseInt(e.target.value))}
                className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-sm font-bold text-blue-600">
                <span>Bleu</span>
                <span>{bFactor}%</span>
              </label>
              <input 
                type="range" min="0" max="100" value={bFactor} 
                onChange={(e) => setBFactor(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-700">Effets</h4>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setMode('normal')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'normal' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Normal
              </button>
              <button 
                onClick={() => setMode('grayscale')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'grayscale' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Gris
              </button>
              <button 
                onClick={() => setMode('invert')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'invert' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Négatif
              </button>
              <button 
                onClick={() => setMode('threshold')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'threshold' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Seuil
              </button>
              <button 
                onClick={() => setMode('sepia')}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors ${mode === 'sepia' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Sépia
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="w-full lg:w-2/3 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 overflow-hidden p-2">
          <canvas 
            ref={canvasRef} 
            className="max-w-full h-auto"
            style={{ maxHeight: '500px' }}
          />
        </div>
      </div>
    </div>
  );
}
