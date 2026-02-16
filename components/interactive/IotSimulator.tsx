
'use client';

import React, { useState } from 'react';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';

function Draggable({ id, label, icon }: { id: string, label: string, icon: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="bg-white border-2 border-slate-200 p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-orange-400 hover:shadow-md transition-all flex flex-col items-center gap-2 w-24"
    >
      <div className="text-2xl">{icon}</div>
      <div className="text-xs font-bold text-slate-600 text-center">{label}</div>
    </div>
  );
}

function Droppable({ id, children, active }: { id: string, children?: React.ReactNode, active: boolean }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef} 
      className={`w-28 h-28 rounded-xl border-2 border-dashed flex items-center justify-center transition-colors ${
        active ? 'bg-green-50 border-green-400' : 'bg-slate-50 border-slate-300'
      }`}
    >
      {children || <span className="text-slate-400 text-xs font-bold uppercase">Déposer ici</span>}
    </div>
  );
}

export default function IotSimulator() {
  const [slots, setSlots] = useState<{ sensor: string | null, logic: string | null, actuator: string | null }>({
    sensor: null,
    logic: null,
    actuator: null
  });

  const [sensorValue, setSensorValue] = useState(0); // 0 (Dark) to 100 (Bright)
  const [switchState, setSwitchState] = useState(false);

  const handleDragEnd = (event: any) => {
    const { over, active } = event;
    if (over) {
      setSlots(prev => ({ ...prev, [over.id]: active.id }));
    }
  };

  // Logic Simulation
  const isSensorActive = slots.sensor === 'sensor-light' ? sensorValue < 50 : false; // Light sensor triggers when dark
  const isLogicActive = slots.logic === 'logic-and' ? (isSensorActive && switchState) : isSensorActive;
  const isActuatorActive = isLogicActive && slots.actuator === 'actuator-siren';

  return (
    <div className="border rounded-xl p-8 bg-slate-50 shadow-lg my-8">
      <h3 className="text-xl font-bold mb-6 text-slate-800">🛠️ Le Système d'Alarme (IoT)</h3>
      
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Component Palette */}
          <div className="flex flex-col gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Composants</h4>
            <div className="flex flex-wrap gap-4">
              <Draggable id="sensor-light" label="Capteur Lum." icon="☀️" />
              <Draggable id="logic-and" label="Porte ET" icon="&" />
              <Draggable id="actuator-siren" label="Sirène" icon="🚨" />
            </div>
          </div>

          {/* Circuit Board */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {/* Wires */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-300 -z-10 transform -translate-y-1/2"></div>

            <div className="flex items-center gap-8 z-10">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-500">ENTRÉE</span>
                <Droppable id="sensor" active={!!slots.sensor}>
                  {slots.sensor === 'sensor-light' && <div className="text-3xl">☀️</div>}
                </Droppable>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-500">LOGIQUE</span>
                <Droppable id="logic" active={!!slots.logic}>
                  {slots.logic === 'logic-and' && <div className="text-3xl font-bold">&</div>}
                </Droppable>
              </div>

              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-500">SORTIE</span>
                <Droppable id="actuator" active={!!slots.actuator}>
                  {slots.actuator === 'actuator-siren' && <div className={`text-4xl transition-all ${isActuatorActive ? 'animate-bounce scale-125' : 'opacity-50'}`}>🚨</div>}
                </Droppable>
              </div>
            </div>
          </div>
        </div>
      </DndContext>

      {/* Controls */}
      <div className="mt-12 p-6 bg-white rounded-xl border border-slate-200 flex gap-12 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-bold text-slate-600">Luminosité Ambiante</label>
          <input 
            type="range" min="0" max="100" 
            value={sensorValue} 
            onChange={(e) => setSensorValue(parseInt(e.target.value))}
            className="w-48 h-2 bg-yellow-100 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <span className="text-xs font-mono">{sensorValue}% ({sensorValue < 50 ? 'Sombre' : 'Clair'})</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <label className="text-sm font-bold text-slate-600">Interrupteur Principal</label>
          <button 
            onClick={() => setSwitchState(!switchState)}
            className={`w-16 h-8 rounded-full relative transition-colors ${switchState ? 'bg-green-500' : 'bg-slate-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${switchState ? 'left-9' : 'left-1'}`}></div>
          </button>
          <span className="text-xs font-mono">{switchState ? 'ON' : 'OFF'}</span>
        </div>
      </div>

      {/* Status */}
      <div className={`mt-6 p-4 rounded-lg text-center font-bold border ${isActuatorActive ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
        État du système : {isActuatorActive ? "ALARME ACTIVÉE ! 🚨" : "Veille..."}
      </div>
    </div>
  );
}
