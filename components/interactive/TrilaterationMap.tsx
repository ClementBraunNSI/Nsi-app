
'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamically import Leaflet components with no SSR to prevent window errors
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// Only create the icon if window is defined (client-side)
const icon = typeof window !== 'undefined' ? L.icon({
  iconUrl: '/images/fox_1.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
}) : undefined;

const SATELLITES = [
  { id: 1, pos: [48.8566, 2.3522], color: 'red', label: 'Sat A' }, // Paris
  { id: 2, pos: [48.8566, 2.4022], color: 'blue', label: 'Sat B' },
  { id: 3, pos: [48.8266, 2.3772], color: 'green', label: 'Sat C' },
];

const TARGET = [48.8466, 2.3772]; // Somewhere in between

export default function TrilaterationMap() {
  const [radii, setRadii] = useState([1000, 1000, 1000]); // Meters

  const updateRadius = (index: number, val: number) => {
    const newRadii = [...radii];
    newRadii[index] = val;
    setRadii(newRadii);
  };

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-lg my-8 h-[600px] flex flex-col">
      <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
        <h3 className="font-bold text-slate-800">📡 Défi Trilateration</h3>
        <div className="flex gap-4">
          {SATELLITES.map((sat, i) => (
            <div key={sat.id} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-${sat.color}-500`} style={{backgroundColor: sat.color}}></span>
              <input 
                type="range" min="500" max="5000" step="100" 
                value={radii[i]}
                onChange={(e) => updateRadius(i, parseInt(e.target.value))}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs font-mono w-12">{radii[i]}m</span>
            </div>
          ))}
        </div>
      </div>

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
        
        {SATELLITES.map((sat, i) => (
          <Circle 
            key={sat.id}
            // @ts-ignore
            center={sat.pos as L.LatLngExpression}
            radius={radii[i]}
            pathOptions={{ color: sat.color, fillColor: sat.color, fillOpacity: 0.1 }}
          >
            <Popup>{sat.label} (Rayon: {radii[i]}m)</Popup>
          </Circle>
        ))}

        {icon && (
        <Marker 
          // @ts-ignore
          position={TARGET as L.LatLngExpression} 
          icon={icon}
        >
          <Popup>🦊 Le Renard est ici !</Popup>
        </Marker>
        )}
      </MapContainer>
    </div>
  );
}
