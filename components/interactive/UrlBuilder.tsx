'use client';

import React, { useState } from 'react';
import { Lock, Globe, Server, Folder, HelpCircle } from 'lucide-react';

export default function UrlBuilder() {
  const [protocol, setProtocol] = useState('https');
  const [subdomain, setSubdomain] = useState('www');
  const [domain, setDomain] = useState('google');
  const [tld, setTld] = useState('com');
  const [path, setPath] = useState('search');
  const [query, setQuery] = useState('q=exemple');

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-4">
        🛠️ Constructeur d'URL
      </h3>

      {/* The URL Display */}
      <div className="bg-slate-100 p-4 rounded-xl flex flex-wrap items-center justify-center font-mono text-lg md:text-xl shadow-inner gap-1">
        <span className="text-slate-500 font-bold">{protocol}://</span>
        <span className="text-slate-400">{subdomain}.</span>
        <span className="text-slate-900 font-bold">{domain}</span>
        <span className="text-slate-600">.{tld}</span>
        <span className="text-orange-600">/{path}</span>
        <span className="text-orange-400">?{query}</span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Protocol */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-600 font-bold text-sm uppercase">
            <Lock size={16} /> Protocole
          </div>
          <select 
            value={protocol} 
            onChange={(e) => setProtocol(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          >
            <option value="https">https (Sécurisé)</option>
            <option value="http">http (Non sécurisé)</option>
          </select>
          <p className="text-xs text-slate-500 mt-2">La langue parlée (chiffrée ou non).</p>
        </div>

        {/* Subdomain */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2 mb-2 text-slate-600 font-bold text-sm uppercase">
            <Globe size={16} /> Sous-domaine
          </div>
          <input 
            type="text" 
            value={subdomain} 
            onChange={(e) => setSubdomain(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-500"
          />
          <p className="text-xs text-slate-500 mt-2">Une section du site (ex: mail, www).</p>
        </div>

        {/* Domain */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-slate-100 border-slate-300">
          <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold text-sm uppercase">
            <Server size={16} /> Nom de domaine
          </div>
          <div className="flex gap-1">
            <input 
              type="text" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-500 font-bold"
            />
            <select 
              value={tld} 
              onChange={(e) => setTld(e.target.value)}
              className="w-20 bg-white border border-slate-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-slate-500 text-slate-700 font-bold"
            >
              <option value="com">.com</option>
              <option value="fr">.fr</option>
              <option value="org">.org</option>
              <option value="net">.net</option>
            </select>
          </div>
          <p className="text-xs text-slate-600 mt-2">L'identité principale du site.</p>
        </div>

        {/* Path */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-orange-50 border-orange-200">
          <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm uppercase">
            <Folder size={16} /> Chemin (Path)
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-400 font-bold">/</span>
            <input 
              type="text" 
              value={path} 
              onChange={(e) => setPath(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <p className="text-xs text-orange-700/60 mt-2">Le dossier ou la page demandée.</p>
        </div>

        {/* Query */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-orange-50/50 border-orange-100">
          <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold text-sm uppercase">
            <HelpCircle size={16} /> Paramètres
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-300 font-bold">?</span>
            <input 
              type="text" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white border border-orange-200 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <p className="text-xs text-orange-600/60 mt-2">Informations supplémentaires (recherche...).</p>
        </div>

      </div>
    </div>
  );
}
