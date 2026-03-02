'use client';

import React, { useState } from 'react';
import { Lock, Unlock, RefreshCw, Key, FileText, Send, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function HttpsSimulator() {
  const [isSecure, setIsSecure] = useState(false);
  const [message, setMessage] = useState("Mon mot de passe secret");
  const [encrypted, setEncrypted] = useState("");
  const [step, setStep] = useState(0); // 0: Input, 1: Transit, 2: Received

  const encrypt = (text: string) => {
    return text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 5)).join('');
  };

  const sendData = async () => {
    setStep(1);
    // Simulate network delay
    setTimeout(() => {
      setStep(2);
    }, 1500);
  };

  const reset = () => {
    setStep(0);
  };

  const transitData = isSecure ? encrypt(message) : message;

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {isSecure ? <Lock className="text-green-600" /> : <Unlock className="text-red-500" />}
          {isSecure ? "Connexion Sécurisée (HTTPS)" : "Connexion Non Sécurisée (HTTP)"}
        </h3>
        
        <label className="flex items-center gap-2 cursor-pointer bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
          <input 
            type="checkbox" 
            checked={isSecure}
            onChange={(e) => { setIsSecure(e.target.checked); reset(); }}
            className="rounded text-green-600 focus:ring-green-500"
          />
          <span className="text-sm font-bold text-slate-700">Activer HTTPS</span>
        </label>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {/* Client */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
            <UserIcon />
          </div>
          <span className="font-bold text-slate-700">Vous (Client)</span>
          
          <div className="bg-white border rounded-lg p-2 shadow-sm w-48">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={step > 0}
              className="w-full text-sm outline-none text-slate-600"
            />
          </div>
          
          {step === 0 && (
            <button 
              onClick={sendData}
              className="mt-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 transition-colors"
            >
              <Send size={14} /> Envoyer
            </button>
          )}
        </div>

        {/* Network / Hacker */}
        <div className="flex-1 flex flex-col items-center justify-center h-32 relative w-full">
          {/* Cable line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-0"></div>
          
          {/* Data Packet Animation */}
          {step === 1 && (
            <div className="absolute top-1/2 left-0 w-full h-full flex items-center justify-center -translate-y-1/2">
               <div className="bg-white border-2 border-slate-300 px-3 py-1 rounded shadow-lg animate-slide text-xs font-mono font-bold text-slate-700 flex items-center gap-2">
                 <FileText size={12} />
                 {transitData}
               </div>
            </div>
          )}

          {/* Hacker */}
          <div className="absolute top-[-20px] bg-slate-800 text-red-400 p-2 rounded-lg text-xs font-mono border border-slate-700 shadow-xl">
             <div className="flex items-center gap-1 mb-1 border-b border-slate-700 pb-1">
               <span className="text-red-500">😈 Hacker</span>
               <span className="text-slate-500">sniffing...</span>
             </div>
             <div>
               {step === 1 ? (
                 isSecure ? (
                   <span className="text-slate-500 line-through decoration-red-500 decoration-2 select-none blur-[2px]">{transitData}</span>
                 ) : (
                   <span className="bg-red-900/30 px-1 rounded text-red-300 animate-pulse">{message}</span>
                 )
               ) : (
                 <span className="text-slate-600 italic">En attente...</span>
               )}
             </div>
             <div className="mt-1 text-[10px] text-slate-500">
               {isSecure ? "Données illisibles (Chiffrées)" : "DONNÉES VOLÉES !"}
             </div>
          </div>
        </div>

        {/* Server */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <ServerIcon />
          </div>
          <span className="font-bold text-slate-700">Serveur</span>
          
          <div className={`bg-white border rounded-lg p-2 shadow-sm w-48 min-h-[40px] flex items-center justify-center transition-all ${step === 2 ? 'scale-110 border-green-500 ring-2 ring-green-100' : ''}`}>
            {step === 2 ? (
              <span className="text-sm text-green-700 font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Reçu : {message}
              </span>
            ) : (
              <span className="text-xs text-slate-400 italic">En attente...</span>
            )}
          </div>

          {step === 2 && (
             <button 
              onClick={reset}
              className="mt-2 text-slate-400 hover:text-slate-600 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <RefreshCw size={12} /> Recommencer
            </button>
          )}
        </div>
      </div>

      <div className={`p-4 rounded-lg text-sm border ${isSecure ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
        <p className="font-bold flex items-center gap-2">
          {isSecure ? <Lock size={16} /> : <AlertTriangle size={16} />}
          {isSecure ? "Vos données sont protégées." : "Attention ! Vos données sont en danger."}
        </p>
        <p className="mt-1 opacity-80">
          {isSecure 
            ? "Le protocole HTTPS utilise TLS (Transport Layer Security) pour chiffrer les données. Même si un pirate intercepte le paquet, il ne verra qu'une suite de caractères incompréhensible."
            : "En HTTP simple, les données circulent 'en clair'. N'importe qui sur le réseau (WiFi public, pirate) peut lire vos mots de passe et messages."
          }
        </p>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  )
}

function ServerIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>
  )
}
