'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, Home, Lightbulb, Thermometer, Bell, Volume2, Wifi } from 'lucide-react';

export default function IotInterface() {
  const [lights, setLights] = useState(false);
  const [heater, setHeater] = useState(false);
  const [temp, setTemp] = useState(19);
  const [notification, setNotification] = useState<string | null>(null);

  // Simulate temp change when heater is on
  useEffect(() => {
    if (!heater) return;
    const interval = setInterval(() => {
      setTemp(t => (t < 24 ? parseFloat((t + 0.1).toFixed(1)) : t));
    }, 1000);
    return () => clearInterval(interval);
  }, [heater]);

  // Simulate temp drop when heater is off
  useEffect(() => {
    if (heater) return;
    const interval = setInterval(() => {
      setTemp(t => (t > 18 ? parseFloat((t - 0.1).toFixed(1)) : t));
    }, 2000);
    return () => clearInterval(interval);
  }, [heater]);

  const triggerMotion = () => {
    setNotification("⚠️ Mouvement détecté dans le salon !");
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <h3 className="text-xl font-bold text-slate-800 text-center mb-2 flex items-center justify-center gap-2">
        <Smartphone className="text-orange-600" />
        Interface Homme-Machine (IHM)
      </h3>
      <p className="text-center text-slate-500 text-sm mb-6">
        L'utilisateur ne voit pas le code, il interagit via une interface graphique (App).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Smartphone Interface */}
        <div className="mx-auto w-64 h-[400px] bg-slate-900 rounded-[2rem] border-8 border-slate-800 p-4 shadow-xl relative overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="flex justify-between text-white text-[10px] mb-4 opacity-80">
            <span>12:00</span>
            <div className="flex gap-1"><Wifi size={10} /> 100%</div>
          </div>

          {/* App Header */}
          <div className="text-white mb-6">
            <h4 className="font-bold text-lg">Ma Maison</h4>
            <span className="text-xs text-slate-400">Connecté</span>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 gap-3 mb-auto">
            <button 
              onClick={() => setLights(!lights)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                lights ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Lightbulb size={24} fill={lights ? "currentColor" : "none"} />
              <span className="text-xs font-bold">Lumière</span>
            </button>

            <button 
              onClick={() => setHeater(!heater)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                heater ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Thermometer size={24} />
              <span className="text-xs font-bold">Chauffage</span>
            </button>
          </div>

          {/* Data Display */}
          <div className="bg-slate-800 rounded-xl p-3 mb-4">
            <span className="text-slate-400 text-xs block mb-1">Température Salon</span>
            <span className="text-white text-2xl font-mono">{temp}°C</span>
          </div>

          {/* Notification Toast */}
          {notification && (
            <div className="absolute top-10 left-2 right-2 bg-white/90 backdrop-blur text-slate-900 p-3 rounded-lg shadow-lg text-xs font-bold flex items-center gap-2 animate-bounce-in">
              <Bell size={16} className="text-red-500" />
              {notification}
            </div>
          )}
        </div>

        {/* Physical World Simulation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 h-[300px] relative flex flex-col justify-between">
          <div className="absolute top-2 right-2 text-slate-300 font-black text-4xl opacity-20 pointer-events-none">MAISON</div>
          
          <div className="flex justify-around items-end h-full pb-4">
            {/* Lamp */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                lights ? 'bg-orange-300 shadow-orange-200' : 'bg-slate-300'
              }`}>
                <Lightbulb size={32} className="text-white" />
              </div>
              <span className="text-xs font-bold text-slate-500">Lampe</span>
            </div>

            {/* Heater */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-20 rounded-lg flex flex-col items-center justify-center gap-1 transition-all duration-500 border-2 ${
                heater ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-slate-200 border-slate-300'
              }`}>
                <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
                <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
                <div className="w-10 h-1 bg-slate-400 rounded-full"></div>
              </div>
              <span className="text-xs font-bold text-slate-500">Radiateur</span>
            </div>
          </div>

          {/* Motion Sensor Button */}
          <button 
            onClick={triggerMotion}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-orange-500"
          >
            <Volume2 size={16} /> Simuler un Mouvement (Capteur)
          </button>
        </div>
      </div>
    </div>
  );
}