'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, RefreshCcw } from 'lucide-react';

type Node = {
  id: string;
  rank: number;
  x: number;
  y: number;
};

type Link = {
  source: string;
  target: string;
};

export default function PageRankVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'A', rank: 1, x: 50, y: 50 },
    { id: 'B', rank: 1, x: 250, y: 50 },
    { id: 'C', rank: 1, x: 150, y: 200 },
    { id: 'D', rank: 1, x: 50, y: 200 },
  ]);

  const [links, setLinks] = useState<Link[]>([
    { source: 'A', target: 'B' },
    { source: 'A', target: 'C' },
    { source: 'B', target: 'C' },
    { source: 'C', target: 'A' },
    { source: 'D', target: 'C' },
  ]);

  const [iterations, setIterations] = useState(0);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Simple PageRank Algorithm
  const calculateRank = () => {
    const dampingFactor = 0.85;
    const newNodes = nodes.map(node => {
      let incomingRank = 0;
      
      // Find nodes pointing to current node
      links.forEach(link => {
        if (link.target === node.id) {
          const sourceNode = nodes.find(n => n.id === link.source);
          if (sourceNode) {
            // Count outgoing links from source
            const outgoingCount = links.filter(l => l.source === sourceNode.id).length;
            incomingRank += sourceNode.rank / outgoingCount;
          }
        }
      });

      return {
        ...node,
        rank: (1 - dampingFactor) + dampingFactor * incomingRank
      };
    });

    setNodes(newNodes);
    setIterations(prev => prev + 1);
  };

  const reset = () => {
    setNodes(nodes.map(n => ({ ...n, rank: 1 })));
    setIterations(0);
    setSelectedNodeId(null);
  };

  const toggleLink = (source: string, target: string) => {
    if (source === target) return;
    const exists = links.find(l => l.source === source && l.target === target);
    if (exists) {
      setLinks(links.filter(l => l !== exists));
    } else {
      setLinks([...links, { source, target }]);
    }
    // Reset ranks on topology change to see effect clearly
    setNodes(nodes.map(n => ({ ...n, rank: 1 })));
    setIterations(0);
  };

  // Helper to get detailed calculation for a node
  const getCalculationDetails = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const incomingLinks = links.filter(l => l.target === nodeId);
    const details = incomingLinks.map(link => {
      const source = nodes.find(n => n.id === link.source)!;
      const outgoingCount = links.filter(l => l.source === source.id).length;
      return {
        sourceId: source.id,
        sourceRank: source.rank,
        outgoingCount,
        contribution: source.rank / outgoingCount
      };
    });

    return {
      node,
      incoming: details,
      base: 0.15, // 1 - dampingFactor (0.85)
      total: node.rank
    };
  };

  // Auto-calculate a few steps on mount or link change
  useEffect(() => {
    // Optional: auto-run
  }, [links]);

  return (
    <div className="flex flex-col gap-6 my-8 border rounded-xl overflow-hidden shadow-lg bg-white p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          Simulateur PageRank
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={reset}
            className="px-3 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded flex items-center gap-1"
          >
            <RefreshCcw size={14} /> Reset
          </button>
          <button 
            onClick={calculateRank}
            className="px-4 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm"
          >
            +1 Itération ({iterations})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="md:col-span-2 relative h-[300px] bg-slate-50 rounded-xl border border-slate-200">
          <svg className="w-full h-full">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
              </marker>
            </defs>
            
            {/* Links */}
            {links.map((link, i) => {
              const source = nodes.find(n => n.id === link.source)!;
              const target = nodes.find(n => n.id === link.target)!;
              return (
                <line 
                  key={i}
                  x1={source.x} y1={source.y}
                  x2={target.x} y2={target.y}
                  stroke="#94a3b8"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => (
              <g 
                key={node.id} 
                transform={`translate(${node.x},${node.y})`}
                onClick={() => setSelectedNodeId(node.id)}
                className="cursor-pointer hover:opacity-90"
              >
                <circle 
                  r={20 + Math.log(node.rank) * 5} 
                  fill={selectedNodeId === node.id ? '#f97316' : node.rank > 1.5 ? '#fb923c' : '#0f172a'} 
                  stroke={selectedNodeId === node.id ? '#fff7ed' : 'none'}
                  strokeWidth="4"
                  className="transition-all duration-500"
                />
                <text 
                  dy="5" 
                  textAnchor="middle" 
                  fill="white" 
                  fontWeight="bold"
                  className="pointer-events-none select-none"
                >
                  {node.id}
                </text>
                <text 
                  dy="35" 
                  textAnchor="middle" 
                  fill="#64748b" 
                  fontSize="10"
                  fontWeight="bold"
                >
                  Score: {node.rank.toFixed(2)}
                </text>
              </g>
            ))}
          </svg>
          
          <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 bg-white/80 p-1 rounded">
            Cliquez sur un noeud pour voir le détail du calcul.
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 text-sm mb-2">Modifier les liens</h4>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map(source => (
                nodes.map(target => (
                  source.id !== target.id && (
                    <label key={`${source.id}-${target.id}`} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-blue-100 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={links.some(l => l.source === source.id && l.target === target.id)}
                        onChange={() => toggleLink(source.id, target.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      {source.id} <ArrowRight size={10} /> {target.id}
                    </label>
                  )
                ))
              ))}
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white border p-3 rounded-lg shadow-sm h-48 overflow-y-auto">
            {selectedNodeId ? (
              (() => {
                const details = getCalculationDetails(selectedNodeId);
                if (!details) return null;
                return (
                  <div>
                    <div className="flex justify-between items-center mb-2 border-b pb-1">
                      <strong className="text-red-600">Détail pour {selectedNodeId}</strong>
                      <button onClick={() => setSelectedNodeId(null)} className="text-slate-400 hover:text-slate-600">×</button>
                    </div>
                    <div className="space-y-2">
                      <p>Score actuel : <strong>{details.node.rank.toFixed(3)}</strong></p>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <p className="font-bold text-slate-500 mb-2">Votes reçus :</p>
                        {details.incoming.length === 0 ? (
                          <span className="italic text-slate-400">Aucun lien entrant</span>
                        ) : (
                          <ul className="space-y-3">
                            {details.incoming.map((inc, i) => (
                              <li key={i} className="text-sm border-b border-dashed border-slate-200 last:border-0 pb-2">
                                <div className="flex items-center gap-1 mb-1">
                                  <span className="font-bold bg-blue-100 text-blue-800 px-1.5 rounded text-xs">{inc.sourceId}</span>
                                  <span className="text-slate-500 text-xs">vote pour</span>
                                  <span className="font-bold bg-red-100 text-red-800 px-1.5 rounded text-xs">{selectedNodeId}</span>
                                </div>
                                <div className="text-xs text-slate-600 pl-2 border-l-2 border-blue-200 ml-1">
                                  Score de {inc.sourceId} : <strong>{inc.sourceRank.toFixed(2)}</strong>
                                  <br/>
                                  Divisé par ses {inc.outgoingCount} liens :
                                  <br/>
                                  <span className="font-mono text-blue-600 font-bold mt-1 block">
                                    {inc.sourceRank.toFixed(2)} / {inc.outgoingCount} = {inc.contribution.toFixed(2)} pts
                                  </span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Formule : (1 - 0.85) + 0.85 × (Somme des votes)
                      </p>
                    </div>
                  </div>
                );
              })()
            ) : (
              <>
                <strong>Explication :</strong>
                <ul className="list-disc pl-4 mt-1 space-y-1">
                  <li>Chaque page commence avec un score de 1.</li>
                  <li>Une page "vote" pour les pages vers lesquelles elle pointe.</li>
                  <li>Plus une page a un score élevé, plus son vote a de poids !</li>
                  <li>Cliquez sur <strong>+1 Itération</strong> pour voir les scores s'ajuster.</li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}