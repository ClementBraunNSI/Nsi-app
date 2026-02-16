
'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: 'pc-1', position: { x: 50, y: 100 }, data: { label: 'PC Alice (192.168.1.10)' }, type: 'input' },
  { id: 'router-1', position: { x: 250, y: 100 }, data: { label: 'Routeur A' } },
  { id: 'router-2', position: { x: 450, y: 50 }, data: { label: 'Routeur B' } },
  { id: 'router-3', position: { x: 450, y: 150 }, data: { label: 'Routeur C' } },
  { id: 'server', position: { x: 650, y: 100 }, data: { label: 'Serveur Web (8.8.8.8)' }, type: 'output' },
];

const initialEdges = [
  { id: 'e1-2', source: 'pc-1', target: 'router-1', animated: true },
  { id: 'e2-3', source: 'router-1', target: 'router-2' },
  { id: 'e2-4', source: 'router-1', target: 'router-3' },
  { id: 'e3-5', source: 'router-2', target: 'server' },
  { id: 'e4-5', source: 'router-3', target: 'server' },
];

export default function PacketTracer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [logs, setLogs] = useState<string[]>([]);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const simulatePing = async () => {
    setLogs([]);
    const steps = [
      "PC Alice : Création du paquet IP (Src: 192.168.1.10, Dst: 8.8.8.8)",
      "PC Alice : Envoi vers la passerelle par défaut (Routeur A)",
      "Routeur A : Réception du paquet. Consultation de la table de routage...",
      "Routeur A : Route choisie -> Routeur B (Moins de trafic)",
      "Routeur B : Transmission vers le Serveur Web",
      "Serveur Web : Paquet reçu ! Préparation de la réponse (PONG)",
      "Serveur Web : Réponse envoyée vers Routeur B...",
      "Routeur B -> Routeur A -> PC Alice",
      "PC Alice : PING réussi ! (Temps: 24ms)"
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setLogs(prev => [...prev, steps[i]]);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-slate-50 shadow-lg my-8">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h3 className="font-bold text-slate-800">Simulateur de Réseau (Mini Packet Tracer)</h3>
        <button 
          onClick={simulatePing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"
        >
          Lancer un PING
        </button>
      </div>
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <div className="h-48 bg-slate-900 text-green-400 font-mono text-xs p-4 overflow-y-auto border-t border-slate-700">
        <div className="mb-2 text-slate-500 uppercase tracking-widest font-bold text-[10px]">Console Réseau</div>
        {logs.length === 0 && <span className="opacity-50">En attente de commande...</span>}
        {logs.map((log, i) => (
          <div key={i} className="mb-1">{`> ${log}`}</div>
        ))}
      </div>
    </div>
  );
}
