'use client';

import React, { useState } from 'react';
import { FileImage, Minimize2, ZoomIn, Info } from 'lucide-react';

export default function ImageCompression() {
  const [mode, setMode] = useState<'raw' | 'png' | 'jpeg'>('raw');
  const [zoom, setZoom] = useState(false);

  // Simulated data
  const data = {
    raw: {
      label: 'RAW / BMP (Non compressé)',
      size: '1.44 Mo',
      desc: 'Chaque pixel est enregistré tel quel (3 octets). Aucune perte, mais très lourd.',
      quality: 100,
      blur: 0
    },
    png: {
      label: 'PNG (Compression sans perte)',
      size: '0.85 Mo',
      desc: 'Mathématique intelligente : "10 pixels rouges" au lieu de "rouge, rouge, rouge...". Qualité identique, poids réduit.',
      quality: 100,
      blur: 0
    },
    jpeg: {
      label: 'JPEG (Compression destructive)',
      size: '0.12 Mo',
      desc: 'L\'ordinateur supprime des détails que l\'oeil ne voit pas bien. Apparition de "blocs" si on compresse trop.',
      quality: 40, // Simulated degradation
      blur: 2
    }
  };

  const current = data[mode];

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-2 flex items-center justify-center gap-2">
        <Minimize2 className="text-orange-600" />
        Compression d'Image
      </h3>

      {/* Viewer */}
      <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `url('/content/1/japan-katsura-river.jpg')`, // Using an existing image from the project
            filter: mode === 'jpeg' ? `blur(${current.blur}px) contrast(1.2)` : 'none',
            transform: zoom ? 'scale(2)' : 'scale(1)',
            imageRendering: mode === 'jpeg' ? 'pixelated' : 'auto'
          }}
        >
          {/* JPEG Artifacts simulation overlay */}
          {mode === 'jpeg' && (
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>
          )}
        </div>

        <button 
          onClick={() => setZoom(!zoom)}
          className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          <ZoomIn size={20} />
        </button>

        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
          {current.size}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-2">
        {(['raw', 'png', 'jpeg'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`py-2 px-1 rounded-lg text-xs font-bold transition-all border-2 ${
              mode === m 
                ? 'border-orange-500 bg-orange-50 text-orange-700' 
                : 'border-slate-100 text-slate-500 hover:bg-slate-50'
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
        <Info className="text-orange-500 shrink-0 mt-1" size={20} />
        <div>
          <h4 className="font-bold text-slate-700 text-sm mb-1">{current.label}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.desc}
          </p>
        </div>
      </div>
    </div>
  );
}