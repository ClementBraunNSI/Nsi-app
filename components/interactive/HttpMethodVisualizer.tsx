'use client';

import React, { useState } from 'react';
import { Send, Eye, EyeOff, Server, Globe, FileText, ArrowRight } from 'lucide-react';

export default function HttpMethodVisualizer() {
  const [method, setMethod] = useState<'GET' | 'POST'>('GET');
  const [formData, setFormData] = useState({
    username: 'alice',
    password: 'secret_password'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowResult(false);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));
    
    setIsSubmitting(false);
    setShowResult(true);
  };

  const getUrl = () => {
    const baseUrl = "https://www.monsite.com/login";
    if (method === 'GET') {
      return `${baseUrl}?username=${formData.username}&password=${formData.password}`;
    }
    return baseUrl;
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-2">
        🆚 Comparateur GET vs POST
      </h3>
      
      <div className="flex justify-center gap-4 mb-4">
        <button 
          onClick={() => { setMethod('GET'); setShowResult(false); }}
          className={`px-6 py-2 rounded-lg font-bold transition-colors border-2 ${method === 'GET' ? 'bg-slate-100 border-slate-500 text-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
          📥 Méthode GET
        </button>
        <button 
          onClick={() => { setMethod('POST'); setShowResult(false); }}
          className={`px-6 py-2 rounded-lg font-bold transition-colors border-2 ${method === 'POST' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
          📤 Méthode POST
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Side */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Globe size={18} /> Navigateur (Client)
            </h4>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="text-xs font-bold text-slate-500 uppercase">Formulaire de Connexion</div>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Nom d'utilisateur"
              />
              <input 
                type="text" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="border rounded px-3 py-2 text-sm"
                placeholder="Mot de passe"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`mt-2 py-2 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-colors ${method === 'GET' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {isSubmitting ? 'Envoi...' : <><Send size={16} /> Envoyer ({method})</>}
              </button>
            </form>
          </div>

          {/* URL Preview */}
          <div className="bg-slate-800 text-slate-200 p-3 rounded-lg font-mono text-xs break-all relative">
            <div className="absolute -top-3 left-3 bg-slate-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Barre d'adresse</div>
            {getUrl()}
          </div>
          
          <div className={`text-xs p-3 rounded-lg border ${method === 'GET' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            {method === 'GET' ? (
              <div className="flex items-start gap-2">
                <Eye size={16} className="mt-0.5 shrink-0" />
                <span>
                  <strong>Attention :</strong> Avec GET, les données sont visibles dans l'URL ! 
                  N'importe qui regardant votre écran ou l'historique peut voir le mot de passe.
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <EyeOff size={16} className="mt-0.5 shrink-0" />
                <span>
                  <strong>Sécurisé :</strong> Avec POST, les données sont cachées dans le corps de la requête 
                  et n'apparaissent pas dans l'URL.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visualization & Server Side */}
        <div className="flex flex-col gap-4 relative">
           {/* Animation Arrow */}
           {isSubmitting && (
             <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 z-10 animate-slide-right">
               <div className={`p-2 rounded-full text-white shadow-xl ${method === 'GET' ? 'bg-slate-800' : 'bg-orange-500'}`}>
                 <ArrowRight size={24} />
               </div>
             </div>
           )}

          <div className={`flex-1 border-2 border-dashed rounded-xl p-4 flex flex-col justify-center items-center transition-colors ${showResult ? 'bg-slate-50 border-slate-300' : 'bg-slate-50 border-slate-200'}`}>
            <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
              <Server size={18} /> Serveur Web
            </h4>

            {showResult ? (
              <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-slate-200 font-mono text-xs">
                <div className="text-slate-400 mb-2 uppercase font-bold tracking-wider border-b pb-1">Requête Reçue</div>
                <div className="mb-2">
                  <span className="text-orange-600 font-bold">{method}</span> <span className="text-slate-600">/login HTTP/1.1</span>
                </div>
                
                {method === 'POST' && (
                  <div className="mt-4 pt-2 border-t border-dashed border-slate-300">
                    <div className="text-slate-400 mb-1 uppercase font-bold text-[10px]">Corps de la requête (Body)</div>
                    <div className="text-orange-600 bg-orange-50 p-2 rounded">
                      username={formData.username}&password={formData.password}
                    </div>
                  </div>
                )}
                
                {method === 'GET' && (
                  <div className="mt-4 pt-2 border-t border-dashed border-slate-300">
                    <div className="text-slate-400 mb-1 uppercase font-bold text-[10px]">Paramètres URL</div>
                    <div className="text-slate-600 bg-slate-100 p-2 rounded">
                      username: {formData.username}<br/>
                      password: {formData.password}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-slate-400 text-center italic">
                En attente de la requête...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}