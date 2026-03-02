'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { RefreshCw, Play, CheckCircle2, AlertTriangle, Clock, Info, MapPin, Navigation, Search } from 'lucide-react';

// Dynamic imports for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Constants
const SPEED_OF_LIGHT = 0.3; // meters per nanosecond (approx) -> 300m per microsecond
// We'll display time in microseconds (µs)
// 1 µs = 300m

const SATELLITES = [
  { id: 1, pos: [48.8566, 2.3522] as [number, number], color: '#f97316', label: 'Sat A', name: "Galileo-1" }, // Orange
  { id: 2, pos: [48.8566, 2.4022] as [number, number], color: '#475569', label: 'Sat B', name: "Galileo-2" }, // Slate
  { id: 3, pos: [48.8266, 2.3772] as [number, number], color: '#0f172a', label: 'Sat C', name: "Galileo-3" }, // Dark Slate/Black
];

// Helper functions
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function getRandomTarget() {
  // Bounding box roughly between the satellites
  const minLat = 48.835;
  const maxLat = 48.850;
  const minLng = 2.360;
  const maxLng = 2.390;
  
  return [
    minLat + Math.random() * (maxLat - minLat),
    minLng + Math.random() * (maxLng - minLng)
  ] as [number, number];
}

export default function TrilaterationMap() {
  const [target, setTarget] = useState<[number, number] | null>(null);
  const [userRadii, setUserRadii] = useState([1000, 1000, 1000]);
  const [step, setStep] = useState(0); // 0: Intro, 1: Sat A, 2: Sat A+B, 3: Sat A+B+C
  const [found, setFound] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [noise, setNoise] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [foxIcon, setFoxIcon] = useState<any>(null);
  const [realDistances, setRealDistances] = useState<number[]>([0, 0, 0]);

  // Initialize Leaflet icon on client side
  useEffect(() => {
    import('leaflet').then(L => {
      setFoxIcon(L.icon({
        iconUrl: '/images/fox_1.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }));
    });
    // Initial target
    handleReset();
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step > 0 && !found && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, found, startTime]);

  const handleReset = () => {
    const newTarget = getRandomTarget();
    setTarget(newTarget);
    
    // Calculate real distances
    const dists = SATELLITES.map(s => getDistance(s.pos[0], s.pos[1], newTarget[0], newTarget[1]));
    setRealDistances(dists);
    
    setStep(0);
    setFound(false);
    setFeedback(null);
    setUserRadii([500, 500, 500]); // Reset sliders
    setStartTime(null);
    setElapsedTime(0);
  };

  const handleStart = () => {
    setStep(1);
    setStartTime(Date.now());
    setFeedback("Recherche du signal Sat A...");
  };

  const updateRadius = (index: number, val: number) => {
    const newRadii = [...userRadii];
    newRadii[index] = val;
    setUserRadii(newRadii);
    
    // Check if close enough for immediate feedback (Hot/Cold)
    const diff = Math.abs(val - realDistances[index]);
    if (diff < 50) {
      // Very close
    }
  };

  const checkStep = () => {
    if (step === 1) {
      // Check Sat A
      const diff = userRadii[0] - realDistances[0];
      if (Math.abs(diff) < 100) {
        setStep(2);
        setFeedback("Signal Sat A verrouillé ! Recherche Sat B...");
      } else {
        const direction = diff > 0 ? "trop grand" : "trop petit";
        setFeedback(`Rayon ${direction} ! Erreur de ${Math.round(Math.abs(diff))}m.`);
      }
    } else if (step === 2) {
      // Check Sat B
      const diff = userRadii[1] - realDistances[1];
      if (Math.abs(diff) < 100) {
        setStep(3);
        setFeedback("Signal Sat B verrouillé ! Il ne reste plus qu'une intersection possible.");
      } else {
        const direction = diff > 0 ? "trop grand" : "trop petit";
        setFeedback(`Rayon ${direction} ! Erreur de ${Math.round(Math.abs(diff))}m sur Sat B.`);
      }
    } else if (step === 3) {
      // Check Sat C and Finalize
      const diff = userRadii[2] - realDistances[2];
      if (Math.abs(diff) < 100) {
        setFound(true);
        setFeedback(`Cible localisée ! Précision excellente. Temps total: ${elapsedTime}s`);
      } else {
        const direction = diff > 0 ? "trop grand" : "trop petit";
        setFeedback(`Rayon ${direction} ! Erreur de ${Math.round(Math.abs(diff))}m sur Sat C.`);
      }
    }
  };

  const getCircleColor = (index: number) => {
    const diff = Math.abs(userRadii[index] - realDistances[index]);
    if (diff < 50) return '#ea580c'; // Dark Orange (Success)
    if (diff < 200) return '#f59e0b'; // Amber (Warning)
    return SATELLITES[index].color;
  };

  // Noise simulation
  const displayedTime = (index: number) => {
    let d = realDistances[index];
    if (noise) {
      d += (Math.random() - 0.5) * 200; // +/- 100m error
    }
    // Time in microseconds
    return (d / 300).toFixed(2);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 my-8 h-[700px]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-1/3 bg-slate-50 p-6 rounded-xl border shadow-sm flex flex-col gap-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-orange-600" />
            Trilatération
          </h3>
          <button onClick={handleReset} className="p-2 hover:bg-slate-100 hover:text-orange-500 rounded-full" title="Recommencer">
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Status Panel */}
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
             <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                <span>c = 300 m/µs</span>
             </div>
             <div className="flex items-center gap-2 text-slate-700 font-mono font-bold">
                <Clock size={16} />
                <span>{elapsedTime}s</span>
             </div>
          </div>
          
          <div className={`text-sm font-medium ${found ? 'text-green-600' : 'text-slate-700'}`}>
            {step === 0 ? "Prêt à commencer" : found ? "MISSION ACCOMPLIE" : `Étape ${step}/3`}
          </div>
          {feedback && (
            <div className={`mt-2 text-sm p-2 rounded ${found ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'} flex gap-2 items-start`}>
              <Info size={16} className="mt-0.5 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col gap-4">
          {step === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600 mb-4">
                Le renard se cache. Utilisez les signaux GPS pour trianguler sa position.
              </p>
              <button 
                onClick={handleStart}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto transition-colors"
              >
                <Play size={20} />
                Lancer la mission
              </button>
            </div>
          ) : (
            <>
              {SATELLITES.map((sat, i) => (
                <div key={sat.id} className={`p-4 rounded-lg border transition-all ${step > i ? 'bg-white border-slate-300 opacity-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold flex items-center gap-2" style={{color: sat.color}}>
                      {step > i ? <CheckCircle2 size={16} /> : <div className="w-4 h-4 rounded-full border-2" style={{borderColor: sat.color}} />}
                      {sat.label}
                    </span>
                    <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">
                      {step > i ? `${displayedTime(i)} µs` : "---"}
                    </span>
                  </div>
                  
                  <input 
                    type="range" min="0" max="6000" step="10" 
                    value={userRadii[i]}
                    onChange={(e) => updateRadius(i, parseInt(e.target.value))}
                    disabled={step <= i && !found}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1 font-mono">
                    <span>0m</span>
                    <span>{userRadii[i]}m</span>
                    <span>6000m</span>
                  </div>
                </div>
              ))}

              {!found && (
                <button 
                  onClick={checkStep}
                  className="mt-auto bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95 flex justify-center items-center gap-2"
                >
                  <Search size={18} />
                  {step === 3 ? "LOCALISER LA CIBLE" : "VÉRIFIER LE SIGNAL"}
                </button>
              )}
            </>
          )}
        </div>

        {/* Options */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input 
              type="checkbox" 
              checked={noise} 
              onChange={(e) => setNoise(e.target.checked)}
              className="rounded text-orange-600 focus:ring-orange-500" 
            />
            Simuler interférences (Bruit)
          </label>
          <p className="text-xs text-slate-400 mt-1 pl-6">
            Ajoute une incertitude au signal GPS, comme dans la réalité (nuages, bâtiments).
          </p>
        </div>

        {/* 3D Info */}
        <div className="mt-auto pt-4 border-t border-slate-200">
           <details className="text-xs text-slate-500 cursor-pointer group">
             <summary className="font-semibold hover:text-orange-600 flex items-center gap-1">
               <Info size={14} /> Pourquoi 4 satellites en réalité ?
             </summary>
             <p className="mt-2 pl-4 border-l-2 border-slate-200">
               Ici, nous sommes en 2D (latitude, longitude). Dans la réalité, il faut calculer l'altitude ! 
               L'intersection de 3 sphères donne 2 points (un sur Terre, un dans l'espace). 
               Un 4ème satellite est nécessaire pour corriger l'horloge du récepteur et éliminer le point impossible.
             </p>
           </details>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 border rounded-xl overflow-hidden shadow-lg relative bg-slate-200">
        <MapContainer 
          // @ts-ignore
          center={[48.8466, 2.3772]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            // @ts-ignore
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Satellites and Circles */}
          {SATELLITES.map((sat, i) => (
            <React.Fragment key={sat.id}>
              {/* Satellite Marker */}
              <Circle
                // @ts-ignore
                center={sat.pos}
                radius={50}
                pathOptions={{ color: sat.color, fillColor: sat.color, fillOpacity: 1 }}
              >
                 <Popup>{sat.name} ({sat.label})</Popup>
              </Circle>

              {/* Signal Circle (Only visible if active step) */}
              {(step > i || found) && (
                <Circle 
                  // @ts-ignore
                  center={sat.pos}
                  radius={userRadii[i]}
                  pathOptions={{ 
                    color: getCircleColor(i), 
                    fillColor: sat.color, 
                    fillOpacity: 0.05,
                    weight: 2,
                    dashArray: step === i + 1 ? '5, 10' : undefined // Dashed if currently adjusting
                  }}
                />
              )}
            </React.Fragment>
          ))}

          {/* Target (Fox) - Only visible if found */}
          {found && target && foxIcon && (
            <Marker 
              // @ts-ignore
              position={target} 
              icon={foxIcon}
            >
              <Popup>🦊 Tu m'as trouvé !</Popup>
            </Marker>
          )}

          {/* Debug Target (Optional, remove in production) */}
          {/* <Circle center={target || [0,0]} radius={10} pathOptions={{color: 'transparent'}} /> */}

        </MapContainer>
        
        {/* Overlay Message for Step 0 */}
        {step === 0 && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] flex items-center justify-center z-[1000] pointer-events-none">
            <div className="bg-white/90 p-4 rounded-xl shadow-xl">
              <p className="font-bold text-slate-800">En attente du signal...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
