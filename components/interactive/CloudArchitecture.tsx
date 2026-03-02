'use client';

import React, { useState } from 'react';
import { Cloud, Smartphone, Server, Upload, Download, Database, Wifi } from 'lucide-react';

export default function CloudArchitecture() {
  const [activeAction, setActiveAction] = useState<'idle' | 'upload' | 'download'>('idle');
  const [serverData, setServerData] = useState<string[]>([]);
  const [localData, setLocalData] = useState<string[]>(['Photo_1.jpg', 'Doc_projet.pdf']);

  const handleUpload = async () => {
    if (activeAction !== 'idle' || localData.length === 0) return;
    setActiveAction('upload');
    
    // Simulate transfer
    await new Promise(r => setTimeout(r, 2000));
    
    const item = localData[0];
    setLocalData(prev => prev.slice(1));
    setServerData(prev => [...prev, item]);
    setActiveAction('idle');
  };

  const handleDownload = async () => {
    if (activeAction !== 'idle' || serverData.length === 0) return;
    setActiveAction('download');
    
    // Simulate transfer
    await new Promise(r => setTimeout(r, 2000));
    
    const item = serverData[0];
    setServerData(prev => prev.slice(1));
    setLocalData(prev => [...prev, item]);
    setActiveAction('idle');
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
        ☁️ Le Cloud Computing
      </h3>
      <p className="text-center text-slate-500 text-sm mb-6">
        Le "Nuage" n'est pas magique : ce sont des ordinateurs (serveurs) stockés ailleurs !
      </p>

      <div className="grid grid-cols-3 gap-4 items-center relative min-h-[200px]">
        {/* User Device */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 z-10">
          <Smartphone size={48} className="text-slate-700" />
          <span className="font-bold text-slate-700">Votre Appareil</span>
          <div className="w-full bg-white p-2 rounded border border-slate-200 min-h-[60px] text-xs">
            <div className="text-slate-400 mb-1 uppercase text-[10px]">Stockage Local</div>
            {localData.map((f, i) => (
              <div key={i} className="flex items-center gap-1 text-slate-600">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div> {f}
              </div>
            ))}
            {localData.length === 0 && <span className="text-slate-300 italic">Vide</span>}
          </div>
        </div>

        {/* Network / Actions */}
        <div className="flex flex-col items-center justify-center gap-4 z-0">
          {/* Connection Lines */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
          <Wifi size={24} className="text-slate-300 mb-2" />
          
          <div className="flex flex-col gap-2 w-full px-4">
            <button 
              onClick={handleUpload}
              disabled={activeAction !== 'idle' || localData.length === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                activeAction === 'idle' && localData.length > 0 
                  ? 'bg-slate-900 text-white hover:bg-slate-700' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Upload size={14} /> Envoyer (Upload)
            </button>
            
            <button 
              onClick={handleDownload}
              disabled={activeAction !== 'idle' || serverData.length === 0}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-xs transition-all ${
                activeAction === 'idle' && serverData.length > 0
                  ? 'bg-orange-500 text-white hover:bg-orange-600' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Download size={14} /> Récupérer (Download)
            </button>
          </div>

          {/* Animated Packet */}
          {activeAction !== 'idle' && (
            <div 
              className={`absolute top-1/2 w-8 h-8 bg-orange-500 rounded-lg shadow-lg flex items-center justify-center text-white z-20 transition-all duration-[2000ms] ease-in-out ${
                activeAction === 'upload' ? 'left-[20%] translate-x-[200%]' : 'left-[70%] -translate-x-[200%]'
              }`}
            >
              <Database size={16} />
            </div>
          )}
        </div>

        {/* Data Center */}
        <div className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 z-10">
          <div className="relative">
            <Cloud size={64} className="text-slate-200" fill="#f8fafc" />
            <Server size={32} className="text-orange-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <span className="font-bold text-slate-700">Data Center</span>
          <div className="w-full bg-white p-2 rounded border border-slate-200 min-h-[60px] text-xs">
            <div className="text-slate-400 mb-1 uppercase text-[10px]">Stockage Cloud</div>
            {serverData.map((f, i) => (
              <div key={i} className="flex items-center gap-1 text-slate-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div> {f}
              </div>
            ))}
            {serverData.length === 0 && <span className="text-slate-300 italic">Vide</span>}
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
        <strong>Pourquoi utiliser le Cloud ?</strong>
        <ul className="list-disc pl-4 mt-2 space-y-1">
          <li>🌍 <strong>Accessibilité :</strong> Vos données sont accessibles partout, depuis n'importe quel appareil.</li>
          <li>🛡️ <strong>Sécurité :</strong> Si vous perdez votre téléphone, vos données sont sauves dans le Data Center.</li>
          <li>🤝 <strong>Partage :</strong> Facile de donner accès à un fichier via un simple lien.</li>
        </ul>
      </div>
    </div>
  );
}