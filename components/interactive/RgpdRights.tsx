'use client';

import React, { useState } from 'react';
import { Shield, Eye, Eraser, Edit, Download, XCircle } from 'lucide-react';

export default function RgpdRights() {
  const [flipped, setFlipped] = useState<number | null>(null);

  const rights = [
    {
      id: 1,
      title: "Droit d'accès",
      icon: <Eye size={32} />,
      desc: "Vous pouvez demander à tout organisme : 'Quelles données avez-vous sur moi ?'",
      example: "Je demande à Google de télécharger l'historique de toutes mes recherches."
    },
    {
      id: 2,
      title: "Droit de rectification",
      icon: <Edit size={32} />,
      desc: "Vous pouvez corriger des informations fausses ou incomplètes.",
      example: "Mon nom est mal orthographié sur ma facture EDF, je demande la correction."
    },
    {
      id: 3,
      title: "Droit à l'effacement",
      icon: <Eraser size={32} />,
      desc: "Aussi appelé 'Droit à l'oubli'. Vous pouvez demander la suppression de vos données.",
      example: "Je veux supprimer mon vieux compte Skyblog que je n'utilise plus."
    },
    {
      id: 4,
      title: "Droit à la portabilité",
      icon: <Download size={32} />,
      desc: "Récupérer vos données pour les transférer ailleurs.",
      example: "Je change de service de musique (Spotify -> Deezer) et je veux garder mes playlists."
    },
    {
      id: 5,
      title: "Droit d'opposition",
      icon: <XCircle size={32} />,
      desc: "Refuser que vos données soient utilisées pour un objectif précis.",
      example: "Je refuse que mon numéro de téléphone soit utilisé pour des pubs commerciales."
    }
  ];

  return (
    <div className="flex flex-col gap-6 my-8 border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-900 text-center mb-2 flex items-center justify-center gap-2">
        <Shield className="text-orange-500" />
        Vos Droits RGPD
      </h3>
      <p className="text-center text-slate-500 text-sm mb-6">
        Le Règlement Général sur la Protection des Données vous protège. Cliquez sur une carte pour comprendre.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rights.map((right) => (
          <div 
            key={right.id}
            onClick={() => setFlipped(flipped === right.id ? null : right.id)}
            className="relative h-48 cursor-pointer group perspective-1000"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="w-full h-full relative transition-transform duration-500"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: flipped === right.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Front */}
              <div 
                className="absolute w-full h-full rounded-xl shadow-md p-4 flex flex-col items-center justify-center bg-white border-2 border-slate-100 hover:border-orange-500 transition-colors"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="mb-3 p-3 bg-orange-50 rounded-full text-orange-500">
                  {right.icon}
                </div>
                <h4 className="font-bold text-lg text-center text-slate-800">{right.title}</h4>
                <p className="text-xs text-slate-400 mt-2 text-center">Cliquez pour voir l'exemple</p>
              </div>

              {/* Back */}
              <div 
                className="absolute w-full h-full rounded-xl shadow-md p-4 bg-orange-50 text-slate-900 flex flex-col justify-center items-center text-center border-2 border-orange-200"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <p className="text-sm font-bold mb-3 text-slate-800">{right.desc}</p>
                <div className="bg-white p-2 rounded text-xs italic text-slate-600 border border-orange-100 shadow-sm">
                  " {right.example} "
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
