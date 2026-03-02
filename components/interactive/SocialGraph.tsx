
'use client';

import React, { useState } from 'react';

const NODES = [
  { id: 1, name: "M. BRAUN", role: "Professeur NSI", x: 80, y: 200 },
  { id: 2, name: "Patrice Vergriete", role: "Maire de Dunkerque", x: 200, y: 120 },
  { id: 3, name: "Gérald Darmanin", role: "Ancien Ministre", x: 320, y: 180 },
  { id: 4, name: "Emmanuel Macron", role: "Président de la République", x: 440, y: 100 },
  { id: 5, name: "Bill Gates", role: "Fondateur Microsoft", x: 560, y: 160 },
  { id: 6, name: "Satya Nadella", role: "PDG Microsoft", x: 680, y: 220 },
  { id: 7, name: "Mark Zuckerberg", role: "PDG Meta", x: 800, y: 140 },
];

const LINKS = [
  { source: 1, target: 2 }, // Braun -> Vergriete
  { source: 2, target: 3 }, // Vergriete -> Darmanin
  { source: 3, target: 4 }, // Darmanin -> Macron
  { source: 4, target: 5 }, // Macron -> Gates
  { source: 5, target: 6 }, // Gates -> Nadella
  { source: 6, target: 7 }, // Nadella -> Zuckerberg
];

export default function SocialGraph() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const getNeighbors = (id: number) => {
    const neighborIds = LINKS
      .filter(l => l.source === id || l.target === id)
      .map(l => l.source === id ? l.target : l.source);
    // Déduplication avec Set pour éviter de compter deux fois si les liens sont bidirectionnels dans les données (ou si on ajoute des liens inverses plus tard)
    return Array.from(new Set(neighborIds));
  };

  const neighbors = selectedNode ? getNeighbors(selectedNode) : [];

  return (
    <div className="border rounded-xl p-8 bg-slate-50 shadow-lg my-8">
      <h3 className="text-xl font-bold mb-4 text-slate-800">Visualisation : Les 6 degrés de séparation</h3>
      <p className="text-sm text-slate-500 mb-6">Exemple de chaîne de relations : De M. BRAUN à Mark Zuckerberg en 6 étapes.</p>
      
      <div className="relative w-full h-96 bg-white rounded-xl shadow-inner overflow-hidden border border-slate-200">
        <svg className="w-full h-full" viewBox="0 0 900 400">
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
                  fill={isSelected ? "#ea580c" : isNeighbor ? "#fb923c" : "#0f172a"}
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
                  {node.id}
                </text>
                <text
                  x={node.x} y={node.y + 40}
                  textAnchor="middle"
                  fill="#1e293b"
                  fontSize="12"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.name}
                </text>
                <text
                  x={node.x} y={node.y + 55}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10"
                  pointerEvents="none"
                >
                  {node.role}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedNode && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-100 text-sm">
          <span className="font-bold text-orange-800">{NODES.find(n => n.id === selectedNode)?.name}</span> a {neighbors.length} connexion(s) de proximité : 
          <span className="text-slate-600 ml-2">
            {neighbors.map(nid => NODES.find(n => n.id === nid)?.name).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}
