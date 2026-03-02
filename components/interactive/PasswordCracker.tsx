
'use client';

import React, { useState, useEffect } from 'react';

export default function PasswordCracker() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'cracking' | 'cracked'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const calculateComplexity = (pwd: string) => {
    return Math.pow(charset.length, pwd.length);
  };

  const startCracking = () => {
    if (!password) return;
    setStatus('cracking');
    setAttempts(0);
    setTimeElapsed(0);
    
    // Simulation (not real brute force to avoid browser freeze)
    const complexity = calculateComplexity(password);
    const speed = 10000000; // 10 million attempts per second (simulated)
    const simulatedTime = complexity / speed;
    
    let current = 0;
    const interval = setInterval(() => {
      current += speed / 10; // Update every 100ms
      setAttempts(Math.floor(current));
      setTimeElapsed(prev => prev + 0.1);
      
      // Random visual guess
      let guess = '';
      for(let i=0; i<password.length; i++) guess += charset[Math.floor(Math.random() * charset.length)];
      setCurrentGuess(guess);

      if (current >= complexity / 2) { // Average case: find halfway
        clearInterval(interval);
        setStatus('cracked');
        setCurrentGuess(password);
      }
    }, 100);
  };

  return (
    <div className="border rounded-xl p-8 bg-slate-900 text-white shadow-lg my-8 font-mono">
      <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2">
        🔓 Simulateur de Brute-Force
      </h3>

      <div className="flex flex-col gap-6">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wider font-bold">Ton mot de passe (max 5 chars pour la démo)</label>
          <div className="flex gap-4 mt-2">
            <input 
              type="text" 
              maxLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value.toLowerCase())}
              disabled={status === 'cracking'}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 w-full"
              placeholder="ex: a1b2"
            />
            <button 
              onClick={startCracking}
              disabled={status === 'cracking' || !password}
              className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50 transition-all"
            >
              HACKER
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Combinaisons possibles</div>
            <div className="text-xl font-bold text-orange-400">
              {calculateComplexity(password).toLocaleString()}
            </div>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Tentatives testées</div>
            <div className="text-xl font-bold text-white">
              {attempts.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="bg-black p-6 rounded-xl border border-orange-900/30 relative overflow-hidden">
          <div className="absolute top-2 right-4 text-xs text-orange-800 animate-pulse">SYSTEM_ACCESS: {status === 'cracked' ? 'GRANTED' : 'DENIED'}</div>
          
          <div className="flex flex-col items-center justify-center h-24">
            {status === 'idle' && <span className="text-slate-600 text-sm">En attente de cible...</span>}
            
            {status === 'cracking' && (
              <>
                <div className="text-4xl font-bold text-white tracking-[0.5em] mb-2">{currentGuess}</div>
                <div className="text-xs text-orange-500">Test en cours...</div>
              </>
            )}

            {status === 'cracked' && (
              <>
                <div className="text-4xl font-bold text-orange-500 tracking-[0.5em] mb-2">{currentGuess}</div>
                <div className="text-xs text-orange-400 font-bold">MOT DE PASSE TROUVÉ en {timeElapsed.toFixed(1)}s</div>
              </>
            )}
          </div>
        </div>
        
        <p className="text-xs text-slate-500 text-center italic">
          Note : Ceci est une simulation mathématique. Un vrai ordinateur peut tester des milliards de mots de passe par seconde.
        </p>
      </div>
    </div>
  );
}
