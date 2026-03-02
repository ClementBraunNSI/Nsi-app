'use client';

import React, { useState } from 'react';
import { Terminal, MapPin, Clock, Satellite, Mountain, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

const EXAMPLES = [
  {
    label: "Exemple 1 (Paris)",
    frame: "$GPGGA,123519,4807.038,N,01131.000,E,1,08,0.9,545.4,M,46.9,M,,*47"
  },
  {
    label: "Exemple 2 (New York)",
    frame: "$GPGGA,164530.000,4042.608,N,07400.278,W,1,05,1.2,10.5,M,-34.0,M,,*72"
  },
  {
    label: "Exemple 3 (Mont Everest)",
    frame: "$GPGGA,053015.00,2759.170,N,08655.310,E,1,10,0.8,8848.0,M,-28.0,M,,*6B"
  }
];

export default function NmeaDecoder() {
  const [input, setInput] = useState(EXAMPLES[0].frame);
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const parseNMEA = (nmea: string) => {
    try {
      if (!nmea.startsWith('$GPGGA')) {
        throw new Error("La trame doit commencer par $GPGGA");
      }
      
      const parts = nmea.split(',');
      if (parts.length < 15) {
        throw new Error("La trame est incomplète (manque de champs)");
      }

      // Time
      const timeRaw = parts[1];
      const time = timeRaw ? `${timeRaw.slice(0,2)}h ${timeRaw.slice(2,4)}m ${timeRaw.slice(4,6)}s` : "Inconnu";

      // Latitude
      const latRaw = parts[2];
      const latDir = parts[3];
      let lat = "Inconnue";
      if (latRaw && latDir) {
        const deg = latRaw.slice(0, 2);
        const min = latRaw.slice(2);
        lat = `${deg}° ${min}' ${latDir}`;
      }

      // Longitude
      const lonRaw = parts[4];
      const lonDir = parts[5];
      let lon = "Inconnue";
      if (lonRaw && lonDir) {
        const deg = lonRaw.slice(0, 3);
        const min = lonRaw.slice(3);
        lon = `${deg}° ${min}' ${lonDir}`;
      }

      // Quality
      const qualityMap = ["Invalide", "GPS Fix (SPS)", "DGPS Fix", "PPS Fix", "RTK", "Float RTK", "Estimé", "Manuel", "Simulation"];
      const quality = qualityMap[parseInt(parts[6])] || "Inconnu";

      // Satellites
      const sats = parseInt(parts[7]);

      // Altitude
      const alt = parseFloat(parts[9]);

      setParsed({
        time,
        lat,
        lon,
        quality,
        sats,
        alt
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setParsed(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Input Section */}
      <div className="w-full md:w-1/2 p-6 bg-slate-900 text-slate-300 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Terminal size={20} />
            Décodeur NMEA
          </h3>
          <div className="flex gap-2">
            {EXAMPLES.map((ex, i) => (
              <button 
                key={i}
                onClick={() => { setInput(ex.frame); parseNMEA(ex.frame); }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors"
              >
                {ex.label.split(' ')[2].replace(/[()]/g, '')}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 bg-slate-950 text-orange-400 font-mono text-sm p-4 rounded-lg border border-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none resize-none mb-4"
          placeholder="$GPGGA,..."
        />

        <button
          onClick={() => parseNMEA(input)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} />
          Décoder la trame
        </button>

        {error && (
          <div className="mt-4 bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}
      </div>

      {/* Result Section */}
      <div className="flex-1 p-6 bg-slate-50 flex flex-col justify-center">
        {parsed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                <Clock size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Heure UTC</div>
                <div className="text-lg font-mono font-bold text-slate-800">{parsed.time}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <MapPin size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Position</div>
                <div className="text-sm font-mono font-bold text-slate-800">{parsed.lat}</div>
                <div className="text-sm font-mono font-bold text-slate-800">{parsed.lon}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                <Satellite size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Satellites</div>
                <div className="text-lg font-mono font-bold text-slate-800">{parsed.sats}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                <Mountain size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Altitude</div>
                <div className="text-lg font-mono font-bold text-slate-800">{parsed.alt} m</div>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="bg-slate-100 p-3 rounded-full text-slate-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-slate-400">Qualité du signal</div>
                <div className="text-lg font-bold text-slate-800">{parsed.quality}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-slate-400 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Terminal size={32} />
            </div>
            <p>Entrez une trame NMEA valide<br/>pour voir les résultats.</p>
          </div>
        )}
      </div>
    </div>
  );
}
