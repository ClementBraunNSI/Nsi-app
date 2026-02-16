
'use client';

import React, { useState } from 'react';

const NODES = [
  { id: 1, name: "Alice", x: 100, y: 100 },
  { id: 2, name: "Bob", x: 250, y: 150 },
  { id: 3, name: "Charlie", x: 150, y: 250 },
  { id: 4, name: "David", x: 300, y: 300 },
  { id: 5, name: "Eve", x: 400, y: 100 },
];

const LINKS = [
  { source: 1, target: 2 },
  { source: 2, target: 3 },
  { source: 3, target: 1 },
  { source: 2, target: 4 },
  { source: 4, target: 5 },
  { source: 5, target: 2 },
];

export default function SocialGraph() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const getNeighbors = (id: number) => {
    return LINKS
      .filter(l => l.source === id || l.target === id)
      .map(l => l.source === id ? l.target : l.source);
  };

  const neighbors = selectedNode ? getNeighbors(selectedNode) : [];

  return (
    <div className="border rounded-xl p-8 bg-slate-50 shadow-lg my-8">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Visualisation de Réseau Social</h3>
      <p className="text-sm text-slate-500 mb-6">Clique sur un nœud (personne) pour voir ses amis (liens directs).</p>
      
      <div className="relative w-full h-96 bg-white rounded-xl shadow-inner overflow-hidden border border-slate-200">
        <svg className="w-full h-full">
          {/* Links */}
          {LINKS.map((link, i) => {
            const start = NODES.find(n => n.id === link.source)!;
            const end = NODES.find(n => n.id === link.target)!;
            
            const isConnectedToSelected = selectedNode && (
              (link.source === selectedNode && link.target) || 
              (link.target === selectedNode && link.source)
            );
            
            // Check if this link is directly connected to the selected node
            const isHighlight = selectedNode !== null && (
              (link.source === selectedNode && neighbors.includes(link.target)) ||
              (link.target === selectedNode && neighbors.includes(link.source))
            );
            
            return (
              <line
                key={i}
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke={isHighlight ? "#f97316" : "#cbd5e1"}
                strokeWidth={isHighlight ? 4 : 2}
                className="transition-all duration-300"
              />
            );
          })}
          
          {NODES.map((node) => {
            const isSelected = selectedNode === node.id;
            const isNeighbor = neighbors.includes(node.id);
            
            return (
              <g 
                key={node.id} 
                onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                className="cursor-pointer hover:scale-110 transition-transform origin-center"
              >
                <circle
                  cx={node.x} cy={node.y} r={25}
                  fill={isSelected ? "#f97316" : isNeighbor ? "#fbbf24" : "#3b82f6"}
                  className="transition-colors duration-300 shadow-lg"
                />
                <text
                  x={node.x} y={node.y} dy={5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.name[0]}
                </text>
                <text
                  x={node.x} y={node.y + 40}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12"
                  pointerEvents="none"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNode && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100 text-sm">
          <span className="font-bold text-orange-800">{NODES.find(n => n.id === selectedNode)?.name}</span> a {neighbors.length} ami(s) : 
          <span className="text-slate-600 ml-2">
            {neighbors.map(nid => NODES.find(n => n.id === nid)?.name).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}
