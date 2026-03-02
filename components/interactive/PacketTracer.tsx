'use client';

import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MarkerType,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';

// Initial node positions
const POSITIONS = {
  pc1: { x: 50, y: 100 },
  router1: { x: 250, y: 100 },
  router2: { x: 450, y: 50 },
  router3: { x: 450, y: 150 },
  server: { x: 650, y: 100 }
};

const initialNodes: Node[] = [
  { id: 'pc-1', position: POSITIONS.pc1, data: { label: 'PC Alice (192.168.1.10)' }, type: 'input', style: { background: '#fff', border: '1px solid #777', width: 180 } },
  { id: 'router-1', position: POSITIONS.router1, data: { label: 'Routeur A' }, style: { background: '#fff', border: '1px solid #777' } },
  { id: 'router-2', position: POSITIONS.router2, data: { label: 'Routeur B' }, style: { background: '#fff', border: '1px solid #777' } },
  { id: 'router-3', position: POSITIONS.router3, data: { label: 'Routeur C' }, style: { background: '#fff', border: '1px solid #777' } },
  { id: 'server', position: POSITIONS.server, data: { label: 'Serveur Web (8.8.8.8)' }, type: 'output', style: { background: '#fff', border: '1px solid #777', width: 180 } },
  // Hidden packet node initially
  { 
    id: 'packet', 
    position: POSITIONS.pc1, 
    data: { label: '✉️' }, 
    style: { 
      opacity: 0,
      background: 'transparent',
      border: 'none',
      fontSize: '24px',
      width: 40,
      height: 40,
      zIndex: 1000,
      transition: 'all 0.8s ease-in-out', // Smooth transition for movement
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none' // Prevent interaction with the packet
    },
    draggable: false,
    connectable: false
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'pc-1', target: 'router-1', markerEnd: { type: MarkerType.ArrowClosed }, label: '1ms' },
  { id: 'e2-3', source: 'router-1', target: 'router-2', markerEnd: { type: MarkerType.ArrowClosed }, label: '10ms (Rapide)', style: { stroke: '#10b981' }, labelStyle: { fill: '#10b981', fontWeight: 700 } },
  { id: 'e2-4', source: 'router-1', target: 'router-3', markerEnd: { type: MarkerType.ArrowClosed }, label: '50ms (Encombré)', style: { stroke: '#ef4444' }, labelStyle: { fill: '#ef4444', fontWeight: 700 } },
  { id: 'e3-5', source: 'router-2', target: 'server', markerEnd: { type: MarkerType.ArrowClosed }, label: '5ms' },
  { id: 'e4-5', source: 'router-3', target: 'server', markerEnd: { type: MarkerType.ArrowClosed }, label: '5ms' },
];

export default function PacketTracer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Helper to update visual state
  const updateVisuals = (activeNodeId: string | null, activeEdgeId: string | null, packetPos: {x: number, y: number} | null, packetLabel: string = '✉️') => {
    setNodes((nds) => nds.map((node) => {
      if (node.id === 'packet') {
        return {
          ...node,
          position: packetPos || node.position,
          data: { label: packetLabel },
          style: {
            ...node.style,
            opacity: packetPos ? 1 : 0, // Show if position provided
          }
        };
      }
      return {
        ...node,
        style: {
          ...node.style,
          background: node.id === activeNodeId ? '#fff7ed' : '#fff', // Orange-50 highlight
          borderColor: node.id === activeNodeId ? '#f97316' : '#777', // Orange-500 border
          borderWidth: node.id === activeNodeId ? 2 : 1,
          boxShadow: node.id === activeNodeId ? '0 0 10px rgba(249, 115, 22, 0.5)' : 'none'
        }
      };
    }));

    setEdges((eds) => eds.map((edge) => {
      const isActive = edge.id === activeEdgeId;
      // Preserve original colors if not active, or highlight orange if active
      const originalColor = edge.id === 'e2-3' ? '#10b981' : edge.id === 'e2-4' ? '#ef4444' : '#b1b1b7';
      
      return {
        ...edge,
        animated: isActive,
        style: {
          ...edge.style,
          stroke: isActive ? '#f97316' : originalColor, // Orange-500 highlight
          strokeWidth: isActive ? 3 : (edge.id === 'e2-3' || edge.id === 'e2-4' ? 2 : 1)
        }
      };
    }));
  };

  const simulatePing = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setLogs([]);
    
    // Reset visuals first
    updateVisuals(null, null, null);
    
    // Sequence of steps
    // Each step: Log message, Active Node, Active Edge, Packet Position (Target of the movement)
    const steps = [
      {
        log: "PC Alice : Création du paquet IP (Src: 192.168.1.10, Dst: 8.8.8.8)",
        node: 'pc-1',
        edge: null,
        pos: POSITIONS.pc1,
        icon: '✉️'
      },
      {
        log: "PC Alice : Envoi vers la passerelle par défaut (Routeur A)",
        node: 'pc-1',
        edge: 'e1-2',
        pos: POSITIONS.router1, // Move to Router A
        icon: '✉️'
      },
      {
        log: "Routeur A : Réception. Analyse des routes disponibles...",
        node: 'router-1',
        edge: null,
        pos: POSITIONS.router1,
        icon: '⚙️' // Processing
      },
      {
        log: "Routeur A : Route vers Routeur C (Rouge) -> Encombrée (50ms) ❌",
        node: 'router-1',
        edge: null, // Just thinking
        pos: POSITIONS.router1,
        icon: '🤔'
      },
      {
        log: "Routeur A : Route vers Routeur B (Vert) -> Rapide (10ms) ✅",
        node: 'router-1',
        edge: null,
        pos: POSITIONS.router1,
        icon: '💡'
      },
      {
        log: "Routeur A : Décision prise -> Passage par Routeur B",
        node: 'router-1',
        edge: 'e2-3',
        pos: POSITIONS.router2, // Move to Router B
        icon: '✉️'
      },
      {
        log: "Routeur B : Transmission vers le Serveur Web",
        node: 'router-2',
        edge: 'e3-5',
        pos: POSITIONS.server, // Move to Server
        icon: '✉️'
      },
      {
        log: "Serveur Web : Paquet reçu ! Préparation de la réponse (PONG)",
        node: 'server',
        edge: null,
        pos: POSITIONS.server,
        icon: '✅'
      },
      {
        log: "Serveur Web : Réponse envoyée vers Routeur B...",
        node: 'server',
        edge: 'e3-5',
        pos: POSITIONS.router2, // Move back to Router B
        icon: '📩' // Response packet
      },
      {
        log: "Routeur B : Transmission vers Routeur A...",
        node: 'router-2',
        edge: 'e2-3',
        pos: POSITIONS.router1, // Move back to Router A
        icon: '📩'
      },
      {
        log: "Routeur A : Transmission vers PC Alice",
        node: 'router-1',
        edge: 'e1-2',
        pos: POSITIONS.pc1, // Move back to PC
        icon: '📩'
      },
      {
        log: "PC Alice : PING réussi ! (Temps total estimé: 24ms)",
        node: 'pc-1',
        edge: null,
        pos: POSITIONS.pc1,
        icon: '🏁'
      }
    ];

    // Helper delay
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Update log
      setLogs(prev => [...prev, step.log]);
      
      // Update visuals
      updateVisuals(step.node, step.edge, step.pos, step.icon);
      
      // Wait for animation
      await wait(1200); // Slower for better reading
    }
    
    // Final clear after a short delay
    await wait(3000);
    updateVisuals(null, null, null);
    setIsSimulating(false);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden bg-slate-50 shadow-lg my-8">
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h3 className="font-bold text-slate-800">Simulateur de Réseau (Mini Packet Tracer)</h3>
        <button 
          onClick={simulatePing}
          disabled={isSimulating}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm ${
            isSimulating 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          {isSimulating ? 'Simulation en cours...' : 'Lancer un PING'}
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
          attributionPosition="bottom-right"
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <div className="h-48 bg-slate-900 text-orange-400 font-mono text-xs p-4 overflow-y-auto border-t border-slate-700 scroll-smooth">
        <div className="mb-2 text-slate-500 uppercase tracking-widest font-bold text-[10px]">Console Réseau</div>
        {logs.length === 0 && <span className="opacity-50">En attente de commande...</span>}
        {logs.map((log, i) => (
          <div key={i} className="mb-1 border-l-2 border-transparent hover:border-orange-500 pl-2 transition-colors">
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            {`> ${log}`}
          </div>
        ))}
      </div>
    </div>
  );
}
