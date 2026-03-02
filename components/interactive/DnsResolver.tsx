'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Server, Globe, Database, ArrowRight, CheckCircle2, XCircle, Play, Pause, Send, ArrowLeft } from 'lucide-react';

export default function DnsResolver() {
  const [domain, setDomain] = useState('www.wikipedia.org');
  const [step, setStep] = useState(0); // 0: Idle, 1: Root, 2: TLD, 3: Auth, 4: Done
  const [logs, setLogs] = useState<string[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Animation states
  const [packetState, setPacketState] = useState<'idle' | 'request' | 'processing' | 'response'>('idle');
  const [activeServerId, setActiveServerId] = useState<number | null>(null);

  // Refs for pause control
  const pauseRef = useRef(false);
  const stopRef = useRef(false);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);

  // Derived state for dynamic content
  const getDomainInfo = (d: string) => {
    const parts = d.trim().split('.');
    if (parts.length < 2) return { tld: '.org', sld: 'wikipedia', domain: 'wikipedia.org', ip: '185.15.59.224' };
    
    const tld = '.' + parts[parts.length - 1];
    const sld = parts[parts.length - 2];
    const domainName = sld + tld;
    // Generate a consistent-looking fake IP based on the domain name length
    const fakeIp = `185.${sld.length}.${parts.length + 10}.${Math.floor(d.length * 3) % 255}`;
    
    return { tld, sld, domain: domainName, ip: fakeIp };
  };

  const domainInfo = getDomainInfo(domain);

  const steps = [
    { 
      id: 1, 
      name: 'Racine (.)', 
      icon: <Globe size={24} />, 
      description: `Je ne connais pas l'adresse complète, mais je sais qui gère les ${domainInfo.tld} !` 
    },
    { 
      id: 2, 
      name: `TLD (${domainInfo.tld})`, 
      icon: <Server size={24} />, 
      description: `Je ne connais pas ${domain}, mais voici le serveur de ${domainInfo.domain}.` 
    },
    { 
      id: 3, 
      name: `Autoritaire (${domainInfo.domain})`, 
      icon: <Database size={24} />, 
      description: `Je connais cette adresse ! Voici l'IP : ${domainInfo.ip}` 
    }
  ];

  const wait = async (ms: number) => {
    let remaining = ms;
    const interval = 100;
    
    while (remaining > 0) {
      if (stopRef.current) return;
      
      if (!pauseRef.current) {
        remaining -= interval;
      }
      await new Promise(r => setTimeout(r, interval));
    }
  };

  const stopResolution = () => {
    stopRef.current = true;
    setIsResolving(false);
    setPacketState('idle');
    setStep(0);
    setActiveServerId(null);
  };

  const resolve = async () => {
    if (isResolving) return;
    
    setIsResolving(true);
    stopRef.current = false;
    setStep(0);
    setLogs([]);
    setPacketState('idle');
    setActiveServerId(null);
    
    const info = getDomainInfo(domain);
    
    // Step 1: Root
    if (stopRef.current) return;
    setStep(1);
    setActiveServerId(1);
    addLog(`🔍 Navigateur : Je cherche l'IP de ${domain}...`);
    
    // Request animation
    setPacketState('request');
    await wait(1500);
    
    // Server processing
    if (stopRef.current) return;
    setPacketState('processing');
    await wait(1000);
    addLog(`🌍 Serveur Racine : Je ne sais pas, demandez au TLD (${info.tld}).`);
    
    // Response animation
    if (stopRef.current) return;
    setPacketState('response');
    await wait(1500);

    // Step 2: TLD
    if (stopRef.current) return;
    setStep(2);
    setActiveServerId(2);
    addLog(`👉 Navigateur : Contact du serveur TLD (${info.tld})...`);
    
    setPacketState('request');
    await wait(1500);
    
    if (stopRef.current) return;
    setPacketState('processing');
    await wait(1000);
    addLog(`📂 Serveur ${info.tld} : Le domaine est géré par ${info.domain}.`);
    
    if (stopRef.current) return;
    setPacketState('response');
    await wait(1500);

    // Step 3: Auth
    if (stopRef.current) return;
    setStep(3);
    setActiveServerId(3);
    addLog(`👉 Navigateur : Contact du serveur autoritaire (${info.domain})...`);
    
    setPacketState('request');
    await wait(1500);
    
    if (stopRef.current) return;
    setPacketState('processing');
    await wait(1000);
    addLog(`✅ Serveur Autoritaire : Voici l'IP : ${info.ip}`);
    
    if (stopRef.current) return;
    setPacketState('response');
    await wait(1500);

    // Done
    if (stopRef.current) return;
    setStep(4);
    setPacketState('idle');
    setActiveServerId(null);
    setIsResolving(false);
  };

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-6">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Nom de domaine à résoudre</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={isResolving}
              className="flex-1 border rounded-lg px-4 py-2 font-mono text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none"
            />
            
            {isResolving ? (
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors text-white ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
                {isPaused ? "Reprendre" : "Pause"}
              </button>
            ) : (
              <button 
                onClick={resolve}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
              >
                <Search size={18} />
                Résoudre
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="relative py-12 px-4">
        {/* Connection Lines */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 transform -translate-y-1/2"></div>
        
        <div className="flex justify-between items-center relative min-h-[120px]">
          {/* Browser (Client) */}
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-colors ${step > 0 ? 'bg-orange-600' : 'bg-slate-800'}`}>
              <Search size={24} />
            </div>
            <span className="text-sm font-bold text-slate-700">Navigateur</span>
          </div>

          {/* Steps / Servers */}
          {steps.map((s, i) => (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all duration-300 ${
                activeServerId === s.id ? 'scale-110 ring-4 ring-orange-200' : ''
              } ${
                step > s.id ? 'bg-green-500' : 
                activeServerId === s.id ? 'bg-orange-600' : 'bg-slate-300'
              }`}>
                {step > s.id ? <CheckCircle2 size={28} /> : s.icon}
              </div>
              <span className={`text-xs font-bold transition-colors ${activeServerId === s.id ? 'text-orange-700' : 'text-slate-500'}`}>
                {s.name}
              </span>
              
              {/* Active Step Description */}
              {activeServerId === s.id && packetState === 'processing' && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 bg-slate-800 text-white text-xs p-2 rounded-lg shadow-xl text-center animate-bounce">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  {s.description}
                </div>
              )}
            </div>
          ))}

          {/* Animated Packet */}
          {isResolving && activeServerId && packetState !== 'idle' && (
            <div 
              className="absolute top-1/2 left-0 -translate-y-1/2 z-20 transition-all duration-1000 ease-in-out"
              style={{
                left: packetState === 'request' 
                  ? `${(activeServerId / 3) * 100}%` // Move to server
                  : packetState === 'response' 
                    ? '0%' // Move back to browser
                    : `${(activeServerId / 3) * 100}%`, // Stay at server
                opacity: packetState === 'processing' ? 0 : 1 // Hide while processing
              }}
            >
              <div className={`flex flex-col items-center gap-1 ${packetState === 'response' ? 'flex-col-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md text-white text-xs font-bold ${
                   packetState === 'request' ? 'bg-orange-500' : 'bg-green-500'
                 }`}>
                   {packetState === 'request' ? '?' : 'IP'}
                 </div>
                 <div className="text-[10px] font-bold text-slate-500 bg-white/80 px-1 rounded">
                    {packetState === 'request' ? 'Requête' : 'Réponse'}
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result & Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div className="bg-slate-50 rounded-xl p-4 border h-48 overflow-y-auto font-mono text-xs scroll-smooth">
          <div className="text-slate-400 mb-2 uppercase font-bold tracking-wider flex justify-between">
            <span>Journal de résolution</span>
            {isPaused && <span className="text-amber-500 animate-pulse">PAUSE</span>}
          </div>
          {logs.map((log, i) => (
            <div key={i} className="mb-2 text-slate-700 border-l-2 border-slate-200 pl-2 py-1 bg-white rounded-r shadow-sm">
              {log}
            </div>
          ))}
          {logs.length === 0 && <span className="text-slate-400 italic">En attente...</span>}
        </div>

        <div className={`rounded-xl p-4 border flex flex-col items-center justify-center text-center transition-colors ${step === 4 ? 'bg-green-50 border-green-200' : 'bg-white border-slate-100'}`}>
          {step === 4 ? (
            <>
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={24} />
              </div>
              <div className="font-bold text-green-800 text-lg">Adresse trouvée !</div>
              <div className="font-mono text-green-600 mt-1">{domainInfo.ip}</div>
              <div className="text-xs text-green-700/60 mt-2">Le navigateur peut maintenant contacter le site.</div>
            </>
          ) : (
            <div className="text-slate-400">
              <div className="text-2xl font-bold mb-1">?</div>
              Résultat final
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
