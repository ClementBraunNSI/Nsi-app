'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { Globe, MapPin, Navigation } from 'lucide-react';

// Dynamic imports for Leaflet
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(mod => mod.Polyline), { ssr: false });
const MapClickHandler = dynamic(() => import('react-leaflet').then(mod => {
  const { useMapEvents } = mod;
  return function MapEvents({ setPos }: { setPos: (pos: [number, number]) => void }) {
    useMapEvents({
      click(e) {
        setPos([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };
}), { ssr: false });

export default function GpsCoordinates() {
  const [position, setPosition] = useState<[number, number]>([48.8566, 2.3522]); // Paris
  const [icon, setIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(L => {
      // Default marker icon fix for Next.js
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });
      setIcon(DefaultIcon);
    });
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white">
      {/* Controls / Info */}
      <div className="w-full md:w-1/3 p-6 bg-slate-50 border-r flex flex-col justify-center">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Globe className="text-orange-600" />
          Coordonnées GPS
        </h3>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 block">Latitude (Nord/Sud)</label>
            <div className="text-3xl font-mono font-bold text-orange-600">
              {position[0].toFixed(4)}°
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Angle par rapport à l'<strong>Équateur</strong> (0°).
              <br/>Positive = Hémisphère Nord 🟢
              <br/>Négative = Hémisphère Sud 🔴
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1 block">Longitude (Est/Ouest)</label>
            <div className="text-3xl font-mono font-bold text-slate-600">
              {position[1].toFixed(4)}°
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Angle par rapport au <strong>Méridien de Greenwich</strong> (0°).
              <br/>Positive = Est ➡️
              <br/>Négative = Ouest ⬅️
            </p>
          </div>
          
          <div className="text-center text-sm text-slate-400 italic">
            Cliquez sur la carte pour changer de position !
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 h-[400px] relative">
        <MapContainer 
          center={position} 
          zoom={4} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {/* Equator Line */}
          <Polyline positions={[[0, -180], [0, 180]]} color="red" weight={2} dashArray="5, 10" />
          
          {/* Greenwich Line */}
          <Polyline positions={[[90, 0], [-90, 0]]} color="green" weight={2} dashArray="5, 10" />

          {/* Marker */}
          {icon && (
            <Marker position={position} icon={icon}>
              <Popup>
                Lat: {position[0].toFixed(4)}<br/>
                Lon: {position[1].toFixed(4)}
              </Popup>
            </Marker>
          )}

          {/* Click Handler */}
          {/* @ts-ignore */}
          <MapClickHandler setPos={setPosition} />
        </MapContainer>
        
        {/* Labels for lines */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full z-[1000] opacity-80 pointer-events-none">
          Méridien de Greenwich (Lon 0°)
        </div>
        <div className="absolute top-1/2 left-2 -translate-y-1/2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full z-[1000] opacity-80 pointer-events-none -rotate-90 origin-left">
          Équateur (Lat 0°)
        </div>
      </div>
    </div>
  );
}
