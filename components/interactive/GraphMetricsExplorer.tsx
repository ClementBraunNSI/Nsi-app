'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Network, Plus, Trash2, Maximize, Circle, HelpCircle } from 'lucide-react';

type Node = {
  id: string;
  x: number;
  y: number;
};

type Link = {
  source: string;
  target: string;
};

export default function GraphMetricsExplorer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', x: 100, y: 100 },
    { id: 'B', x: 250, y: 50 },
    { id: 'C', x: 250, y: 200 },
    { id: 'D', x: 400, y: 150 },
    { id: 'E', x: 100, y: 250 },
  ]);

  const [links, setLinks] = useState<Link[]>([
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'D' },
    { source: 'C', target: 'D' },
    { source: 'A', target: 'E' },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [mode, setMode] = useState<'move' | 'add_node' | 'add_link' | 'delete'>('move');
  const svgRef = useRef<SVGSVGElement>(null);

  // Graph Metrics Calculation
  const calculateMetrics = () => {
    // 1. Distance Matrix (BFS for unweighted graph)
    const dist: Record<string, Record<string, number>> = {};
    nodes.forEach(n => {
      dist[n.id] = {};
      nodes.forEach(m => dist[n.id][m.id] = n.id === m.id ? 0 : Infinity);
    });

    // Initialize with direct links (undirected)
    links.forEach(l => {
      dist[l.source][l.target] = 1;
      dist[l.target][l.source] = 1;
    });

    // Floyd-Warshall Algorithm
    nodes.forEach(k => {
      nodes.forEach(i => {
        nodes.forEach(j => {
          if (dist[i.id][j.id] > dist[i.id][k.id] + dist[k.id][j.id]) {
            dist[i.id][j.id] = dist[i.id][k.id] + dist[k.id][j.id];
          }
        });
      });
    });

    // 2. Eccentricity (Écartement)
    const eccentricities: Record<string, number> = {};
    let radius = Infinity;
    let diameter = 0;
    
    nodes.forEach(n => {
      let maxDist = 0;
      nodes.forEach(m => {
        if (dist[n.id][m.id] !== Infinity && dist[n.id][m.id] > maxDist) {
          maxDist = dist[n.id][m.id];
        }
      });
      eccentricities[n.id] = maxDist;
      
      if (maxDist > diameter) diameter = maxDist;
      if (maxDist < radius && maxDist > 0) radius = maxDist;
    });

    // If graph is disconnected, radius/diameter might be weird. Handle basic case.
    if (radius === Infinity) radius = 0;

    // 3. Center
    const center = nodes.filter(n => eccentricities[n.id] === radius).map(n => n.id);

    return { dist, eccentricities, radius, diameter, center };
  };

  const metrics = calculateMetrics();

  // Interaction Handlers
  const handleSvgClick = (e: React.MouseEvent) => {
    if (mode === 'add_node') {
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newId = String.fromCharCode(65 + nodes.length); // A, B, C...
      setNodes([...nodes, { id: newId, x, y }]);
    }
  };

  const handleNodeClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (mode === 'delete') {
      setNodes(nodes.filter(n => n.id !== id));
      setLinks(links.filter(l => l.source !== id && l.target !== id));
      return;
    }

    if (mode === 'add_link') {
      if (selectedNode === null) {
        setSelectedNode(id);
      } else if (selectedNode !== id) {
        // Check if link exists
        if (!links.some(l => (l.source === selectedNode && l.target === id) || (l.source === id && l.target === selectedNode))) {
          setLinks([...links, { source: selectedNode, target: id }]);
        }
        setSelectedNode(null);
      } else {
        setSelectedNode(null); // Deselect
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 gap-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Network className="text-orange-600" />
          Analyseur de Graphe
        </h3>
        
        <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
          <button 
            onClick={() => setMode('move')}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors ${mode === 'move' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Maximize size={14} /> Bouger
          </button>
          <button 
            onClick={() => setMode('add_node')}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors ${mode === 'add_node' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Plus size={14} /> Noeud
          </button>
          <button 
            onClick={() => { setMode('add_link'); setSelectedNode(null); }}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors ${mode === 'add_link' ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Network size={14} /> Lien
          </button>
          <button 
            onClick={() => setMode('delete')}
            className={`px-3 py-1 text-xs font-bold rounded flex items-center gap-1 transition-colors ${mode === 'delete' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Trash2 size={14} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-2 bg-slate-50 border rounded-xl h-[400px] relative overflow-hidden">
          <svg 
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            onClick={handleSvgClick}
          >
            {/* Links */}
            {links.map((link, i) => {
              const s = nodes.find(n => n.id === link.source);
              const t = nodes.find(n => n.id === link.target);
              if (!s || !t) return null;
              return (
                <line 
                  key={i}
                  x1={s.x} y1={s.y}
                  x2={t.x} y2={t.y}
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const isCenter = metrics.center.includes(node.id);
              const isSelected = selectedNode === node.id;
              
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x},${node.y})`}
                  onClick={(e) => handleNodeClick(e, node.id)}
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <circle 
                    r="24" 
                    fill={isCenter ? '#ef4444' : '#0f172a'} 
                    stroke={isSelected ? '#f97316' : 'white'}
                    strokeWidth={isSelected ? 4 : 2}
                    className="shadow-lg drop-shadow-md"
                  />
                  <text 
                    dy="5" 
                    textAnchor="middle" 
                    fill="white" 
                    fontWeight="bold"
                    className="pointer-events-none select-none text-sm"
                  >
                    {node.id}
                  </text>
                  
                  {/* Metric Label */}
                  <text 
                    dy="40" 
                    textAnchor="middle" 
                    fill="#64748b" 
                    fontSize="10"
                    fontWeight="bold"
                    className="bg-white"
                  >
                    E={metrics.eccentricities[node.id] === Infinity ? '∞' : metrics.eccentricities[node.id]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 text-[10px] bg-white/90 p-2 rounded border shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Centre du graphe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-slate-900"></div>
              <span>Noeud normal</span>
            </div>
            <div className="mt-1 text-slate-500 italic">
              E = Écartement (Distance max aux autres)
            </div>
          </div>
        </div>

        {/* Metrics Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Circle size={16} /> Métriques Globales
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Rayon (Min E)</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {metrics.radius}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-600">Diamètre (Max E)</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {metrics.diameter}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Centre(s)</span>
                <span className="font-mono font-bold text-white bg-red-500 px-2 py-0.5 rounded shadow-sm">
                  {metrics.center.join(', ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex-1 overflow-auto">
            <h4 className="font-bold text-slate-700 mb-3 text-xs uppercase tracking-wider">
              Détails par Sommet
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 pl-2">Noeud</th>
                  <th className="pb-2">Écartement</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map(n => (
                  <tr key={n.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-100 transition-colors">
                    <td className="py-2 pl-2 font-bold text-slate-700">{n.id}</td>
                    <td className="py-2 font-mono text-slate-600">
                      {metrics.eccentricities[n.id] === Infinity ? '∞' : metrics.eccentricities[n.id]}
                    </td>
                    <td className="py-2">
                      {metrics.center.includes(n.id) && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                          CENTRE
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}