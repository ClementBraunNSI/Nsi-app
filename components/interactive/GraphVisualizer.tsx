"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface GraphVisualizerProps {
  initialNodes?: string[]; // Liste de labels de nœuds détectés
}

export default function GraphVisualizer({ initialNodes = [] }: GraphVisualizerProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Initialisation intelligente basée sur les données extraites
  useEffect(() => {
    // Éviter de réinitialiser si les nœuds sont déjà chargés
    if (nodes.length > 0) return;

    if (initialNodes.length > 0) {
      const newNodes = initialNodes.map((label, index) => ({
        id: (index + 1).toString(),
        x: Math.random() * 250 + 50,
        y: Math.random() * 150 + 50,
        label: label
      }));
      setNodes(newNodes);
      
      // Essayer de lier un peu au hasard pour montrer qqchose (car on a pas les arêtes)
      if (newNodes.length > 1) {
        setEdges([{ from: '1', to: '2', weight: 1 }]);
      }
    } else {
      // Default fallback
      setNodes([
        { id: '1', x: 50, y: 50, label: 'A' },
        { id: '2', x: 150, y: 150, label: 'B' },
      ]);
      setEdges([{ from: '1', to: '2', weight: 5 }]);
    }
    // On retire initialNodes de la dépendance car c'est un tableau créé à chaque rendu parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNode = () => {
    const id = (nodes.length + 1).toString();
    const x = Math.random() * 300 + 50;
    const y = Math.random() * 200 + 50;
    setNodes([...nodes, { id, x, y, label: String.fromCharCode(64 + parseInt(id)) }]);
  };

  const addEdge = () => {
    if (nodes.length < 2) return;
    const from = nodes[nodes.length - 2].id;
    const to = nodes[nodes.length - 1].id;
    setEdges([...edges, { from, to, weight: Math.floor(Math.random() * 10) + 1 }]);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-6">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Network className="text-emerald-600" />
        Éditeur de Graphes
      </h3>

      <div className="flex gap-2 mb-4">
        <button onClick={addNode} className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold hover:bg-emerald-200">
          <Plus size={14} /> Ajouter Nœud
        </button>
        <button onClick={addEdge} className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200">
          <LinkIcon size={14} /> Lier Derniers
        </button>
      </div>

      <div className="relative w-full h-[300px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((edge, i) => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;
            return (
              <line
                key={i}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="#94a3b8"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {nodes.map((node) => (
          <motion.div
            key={node.id}
            drag
            dragConstraints={{ left: 0, right: 350, top: 0, bottom: 250 }}
            className="absolute w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center font-bold text-slate-700 cursor-grab active:cursor-grabbing z-10"
            style={{ left: node.x, top: node.y }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {node.label}
          </motion.div>
        ))}
      </div>
      
      <p className="mt-2 text-xs text-slate-400 text-center">
        Déplacez les nœuds pour réorganiser le graphe.
      </p>
    </div>
  );
}
