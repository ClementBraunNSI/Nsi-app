'use client';

import React, { useState } from 'react';
import { Eye, Code, ArrowRight } from 'lucide-react';

export default function HtmlStructureExplorer() {
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = {
    html: { 
      label: '<html>', 
      desc: 'La racine du document. Tout le code HTML doit être à l\'intérieur.',
      color: 'bg-slate-200 border-slate-400 text-slate-900'
    },
    head: { 
      label: '<head>', 
      desc: 'Contient les informations invisibles pour l\'utilisateur (titre, encodage, liens CSS).',
      color: 'bg-slate-100 border-slate-300 text-slate-600'
    },
    body: { 
      label: '<body>', 
      desc: 'Contient tout ce qui est visible sur la page (textes, images, liens).',
      color: 'bg-orange-50 border-orange-200 text-orange-900'
    },
    title: { 
      label: '<title>', 
      desc: 'Définit le titre qui s\'affiche dans l\'onglet du navigateur.',
      color: 'bg-slate-300 border-slate-500 text-slate-800'
    },
    h1: { 
      label: '<h1>', 
      desc: 'Un titre de niveau 1 (le plus important).',
      color: 'bg-orange-200 border-orange-400 text-orange-900'
    },
    p: { 
      label: '<p>', 
      desc: 'Un paragraphe de texte.',
      color: 'bg-white border-slate-200 text-slate-700'
    }
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
        🏗️ Explorateur de Structure HTML
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visual Tree */}
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 bg-slate-50 min-h-[300px]">
          <div className="absolute top-2 left-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Arborescence (DOM)</div>
          
          <div 
            className={`mt-6 p-4 border-2 rounded-lg cursor-pointer transition-all ${tags.html.color} ${selectedTag === 'html' ? 'ring-4 ring-blue-200 scale-105 shadow-lg' : 'hover:shadow-md'}`}
            onClick={() => setSelectedTag('html')}
          >
            <div className="font-mono font-bold mb-2">html</div>
            
            <div className="flex flex-col gap-4 pl-4 border-l-2 border-blue-300/50">
              {/* HEAD */}
              <div 
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${tags.head.color} ${selectedTag === 'head' ? 'ring-4 ring-yellow-200 scale-105 shadow-lg' : 'hover:shadow-md'}`}
                onClick={(e) => { e.stopPropagation(); setSelectedTag('head'); }}
              >
                <div className="font-mono font-bold mb-2">head</div>
                <div 
                  className={`ml-4 p-2 border-2 rounded cursor-pointer ${tags.title.color} ${selectedTag === 'title' ? 'ring-2 ring-orange-200 scale-105' : ''}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedTag('title'); }}
                >
                  <span className="font-mono font-bold">title</span>: "Mon Site"
                </div>
              </div>

              {/* BODY */}
              <div 
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${tags.body.color} ${selectedTag === 'body' ? 'ring-4 ring-green-200 scale-105 shadow-lg' : 'hover:shadow-md'}`}
                onClick={(e) => { e.stopPropagation(); setSelectedTag('body'); }}
              >
                <div className="font-mono font-bold mb-2">body</div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <div 
                    className={`p-2 border-2 rounded cursor-pointer ${tags.h1.color} ${selectedTag === 'h1' ? 'ring-2 ring-purple-200 scale-105' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedTag('h1'); }}
                  >
                    <span className="font-mono font-bold">h1</span>: Bienvenue !
                  </div>
                  <div 
                    className={`p-2 border-2 rounded cursor-pointer ${tags.p.color} ${selectedTag === 'p' ? 'ring-2 ring-slate-200 scale-105' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedTag('p'); }}
                  >
                    <span className="font-mono font-bold">p</span>: Ceci est un site.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border rounded-xl p-6 shadow-sm h-full flex flex-col justify-center items-center text-center">
            {selectedTag ? (
              <>
                <div className={`text-3xl font-mono font-bold mb-4 px-4 py-2 rounded-lg ${tags[selectedTag as keyof typeof tags].color}`}>
                  &lt;{selectedTag}&gt;
                </div>
                <p className="text-slate-600 text-lg leading-relaxed">
                  {tags[selectedTag as keyof typeof tags].desc}
                </p>
                {selectedTag === 'head' && (
                  <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                    💡 Astuce : Ce qui est dans le head n'est <strong>jamais</strong> affiché directement dans la page web !
                  </div>
                )}
                {selectedTag === 'body' && (
                  <div className="mt-4 p-3 bg-green-50 text-green-800 text-sm rounded border border-green-200">
                    💡 Astuce : C'est ici que vous écrirez 99% de votre code HTML.
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-400">
                <div className="animate-bounce mb-4 text-4xl">👆</div>
                <p>Cliquez sur un élément de l'arborescence à gauche pour voir à quoi il sert !</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}