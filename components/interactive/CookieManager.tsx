'use client';

import React, { useState } from 'react';
import { Cookie, Eye, Lock, ShieldAlert, Trash2, ShoppingCart, User, Globe } from 'lucide-react';

export default function CookieManager() {
  const [cookies, setCookies] = useState([
    { id: 1, name: 'session_id', domain: 'monsite.fr', type: 'Essentiel', data: 'xyz123', risk: 'low' },
    { id: 2, name: 'panier', domain: 'monsite.fr', type: 'Fonctionnel', data: 'item_42,item_7', risk: 'low' },
    { id: 3, name: '_ga', domain: 'google-analytics.com', type: 'Analytique', data: 'GA1.2.345', risk: 'medium' },
    { id: 4, name: 'ads_prefs', domain: 'doubleclick.net', type: 'Publicitaire', data: 'sport,voyage', risk: 'high' }
  ]);

  const [history, setHistory] = useState<string[]>([]);

  const visitSite = (site: string) => {
    setHistory([...history, site]);
    
    const newCookies = [...cookies];
    let changed = false;

    if (site === 'Site de Sport') {
      if (!newCookies.find(c => c.name === 'interet_sport')) {
        newCookies.push({ id: Date.now(), name: 'interet_sport', domain: 'pub.com', type: 'Publicitaire', data: 'true', risk: 'high' });
        changed = true;
      }
    } else if (site === 'Site de Voyage') {
      if (!newCookies.find(c => c.name === 'interet_voyage')) {
        newCookies.push({ id: Date.now() + 1, name: 'interet_voyage', domain: 'ad-network.net', type: 'Publicitaire', data: 'bali,tokyo', risk: 'high' });
        changed = true;
      }
    }

    if (changed) {
      setCookies(newCookies);
    }
  };

  const deleteCookie = (id: number) => {
    setCookies(cookies.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Simulation */}
      <div className="w-full md:w-1/3 p-6 bg-slate-50 border-r flex flex-col">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Globe className="text-orange-500" />
          Navigation
        </h3>
        <p className="text-sm text-slate-600 mb-4">Visitez des sites pour voir les cookies s'accumuler.</p>
        
        <div className="flex flex-col gap-2 mb-6">
          <button onClick={() => visitSite('Site de Sport')} className="bg-white border hover:bg-slate-100 hover:border-orange-500 p-3 rounded-lg text-left shadow-sm transition-colors">
            ⚽ Visiter un site de Sport
          </button>
          <button onClick={() => visitSite('Site de Voyage')} className="bg-white border hover:bg-slate-100 hover:border-orange-500 p-3 rounded-lg text-left shadow-sm transition-colors">
            ✈️ Visiter un site de Voyage
          </button>
        </div>

        <div className="mt-auto bg-slate-100 border border-slate-200 p-4 rounded-xl">
          <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
            <Eye size={16} className="text-orange-500" /> Ce que les pubs savent de vous :
          </h4>
          <ul className="text-xs text-slate-600 list-disc pl-4">
            {cookies.some(c => c.name === 'interet_sport') && <li>Vous aimez le sport</li>}
            {cookies.some(c => c.name === 'interet_voyage') && <li>Vous aimez les voyages</li>}
            {history.length > 2 && <li>Vous naviguez beaucoup</li>}
            {history.length === 0 && <li>Rien pour l'instant...</li>}
          </ul>
        </div>
      </div>

      {/* Cookie List */}
      <div className="flex-1 p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Cookie className="text-orange-500" />
          Gestionnaire de Cookies
        </h3>

        <div className="space-y-3">
          {cookies.map(cookie => (
            <div key={cookie.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${
                  cookie.risk === 'high' ? 'bg-red-100 text-red-600' : 
                  cookie.risk === 'medium' ? 'bg-orange-100 text-orange-600' : 
                  'bg-green-100 text-green-600'
                }`}>
                  {cookie.risk === 'high' ? <ShieldAlert size={18} /> : 
                   cookie.name === 'panier' ? <ShoppingCart size={18} /> : 
                   cookie.name === 'session_id' ? <User size={18} /> :
                   <Cookie size={18} />}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{cookie.name}</div>
                  <div className="text-xs text-slate-500">{cookie.domain} • {cookie.type}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <code className="hidden md:block text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono">
                  {cookie.data}
                </code>
                <button 
                  onClick={() => deleteCookie(cookie.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer le cookie"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {cookies.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              <Cookie size={48} className="mx-auto mb-2 opacity-20" />
              <p>Aucun cookie ! Votre navigateur est "amnésique".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
