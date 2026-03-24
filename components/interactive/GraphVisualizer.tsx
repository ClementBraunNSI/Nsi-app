"use client";
import React, { useState, useMemo } from 'react';
import { Network, Search, Plus, Trash2, MousePointer2 } from 'lucide-react';

export default function GraphVisualizer() {
  const [activeTab, setActiveTab] = useState('visual');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const [nodes, setNodes] = useState([
    { id: 'A', x: 50, y: 50 },
    { id: 'B', x: 200, y: 50 },
    { id: 'C', x: 50, y: 150 },
    { id: 'D', x: 200, y: 150 },
  ]);

  const [edges, setEdges] = useState([
    { from: 'A', to: 'B' },
    { from: 'A', to: 'C' },
    { from: 'B', to: 'C' },
    { from: 'C', to: 'D' },
  ]);

  // Ajouter un sommet
  const addNode = () => {
    if (nodes.length >= 6) return; // Limite à 6 sommets pour garder un bel affichage
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const existingIds = nodes.map(n => n.id);
    const nextId = alphabet.split('').find(char => !existingIds.includes(char)) || 'Z';
    
    // Position aléatoire mais contenue
    const newX = 30 + Math.random() * 190;
    const newY = 30 + Math.random() * 140;
    
    setNodes([...nodes, { id: nextId, x: newX, y: newY }]);
  };

  // Supprimer un sommet
  const removeNode = (idToRemove: string) => {
    setNodes(nodes.filter(n => n.id !== idToRemove));
    setEdges(edges.filter(e => e.from !== idToRemove && e.to !== idToRemove));
    if (selectedNode === idToRemove) setSelectedNode(null);
    if (hoveredNode === idToRemove) setHoveredNode(null);
  };

  // Ajouter ou retirer une arête
  const toggleEdge = (n1: string, n2: string) => {
    if (n1 === n2) return; // Pas de boucle sur soi-même
    
    const edgeExists = edges.some(e => (e.from === n1 && e.to === n2) || (e.from === n2 && e.to === n1));
    
    if (edgeExists) {
      setEdges(edges.filter(e => !((e.from === n1 && e.to === n2) || (e.from === n2 && e.to === n1))));
    } else {
      setEdges([...edges, { from: n1, to: n2 }]);
    }
  };

  // Gérer le clic sur un sommet dans la vue visuelle
  const handleNodeClick = (nodeId: string) => {
    if (selectedNode === null) {
      setSelectedNode(nodeId);
    } else {
      toggleEdge(selectedNode, nodeId);
      setSelectedNode(null); // Deselect after connecting
    }
  };

  // Calculs dynamiques
  const nodeIds = [...nodes].sort((a, b) => a.id.localeCompare(b.id)).map(n => n.id);

  const matrix = useMemo(() => {
    return nodeIds.map(rowId => 
      nodeIds.map(colId => {
        return edges.some(e => (e.from === rowId && e.to === colId) || (e.from === colId && e.to === rowId)) ? 1 : 0;
      })
    );
  }, [nodes, edges, nodeIds]);

  const adjList = useMemo(() => {
    const list: Record<string, string[]> = {};
    nodeIds.forEach(id => {
      const neighbors = edges
        .filter(e => e.from === id || e.to === id)
        .map(e => e.from === id ? e.to : e.from)
        .sort();
      list[id] = neighbors;
    });
    return list;
  }, [nodes, edges, nodeIds]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Network size={24} className="text-orange-500" />
          <h3 className="text-xl font-bold text-slate-800">Graphe Interactif</h3>
        </div>
        <button
          onClick={addNode}
          disabled={nodes.length >= 6}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 disabled:opacity-50 transition-colors"
        >
          <Plus size={18} /> Ajouter un sommet
        </button>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('visual')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'visual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Visuel
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'matrix' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Matrice d'adjacence
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Liste d'adjacence
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Dessin du Graphe */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col items-center justify-center relative min-h-[300px]">
          <svg className="w-full h-full max-w-[250px]" viewBox="0 0 250 200">
            {/* Lignes */}
            {edges.map((edge, i) => {
              const n1 = nodes.find(n => n.id === edge.from);
              const n2 = nodes.find(n => n.id === edge.to);
              if (!n1 || !n2) return null;

              const isHighlight = hoveredNode && (hoveredNode === n1.id || hoveredNode === n2.id);
              
              return (
                <line 
                  key={i} 
                  x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} 
                  stroke={isHighlight ? "#F97316" : "#E2E8F0"} 
                  strokeWidth={isHighlight ? "3" : "2"}
                  className="transition-all duration-300"
                />
              );
            })}
            
            {/* Noeuds */}
            {nodes.map(node => {
              const isHovered = hoveredNode === node.id;
              const isSelected = selectedNode === node.id;
              
              return (
                <g 
                  key={node.id} 
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                  onContextMenu={(e) => { e.preventDefault(); removeNode(node.id); }}
                  className="cursor-pointer"
                >
                  <circle 
                    cx={node.x} cy={node.y} r="20" 
                    fill={(isHovered || isSelected) ? "#FFF7ED" : "white"} 
                    stroke={(isHovered || isSelected) ? "#F97316" : "#94A3B8"} 
                    strokeWidth={isSelected ? "4" : "2"}
                    className="transition-all duration-300"
                  />
                  <text 
                    x={node.x} y={node.y + 5} 
                    textAnchor="middle" 
                    fill={(isHovered || isSelected) ? "#C2410C" : "#334155"} 
                    className="font-bold text-sm select-none transition-all duration-300"
                  >
                    {node.id}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-500 font-medium px-4">
            <span className="text-orange-500 font-bold">Clic</span> = Relier 2 sommets • <span className="text-red-500 font-bold">Clic droit</span> = Supprimer
          </div>
        </div>

        {/* Vue Data */}
        <div className="flex flex-col justify-center">
          
          {activeTab === 'visual' && (
            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed text-sm">
                Un graphe est un ensemble de <strong>sommets</strong> reliés par des <strong>arêtes</strong>. 
                Modifiez le graphe ci-contre et observez comment les données sont mises à jour dans les autres onglets !
              </p>
              <div className="p-4 bg-orange-50 rounded-xl text-orange-800 text-sm border border-orange-100 flex items-start gap-3">
                <MousePointer2 className="text-orange-500 shrink-0 mt-0.5" size={18}/>
                <div className="space-y-2">
                  <p><strong>Astuces :</strong></p>
                  <ul className="list-disc pl-4 space-y-1 text-orange-700">
                    <li>Cliquez sur un sommet, puis sur un autre pour créer ou supprimer une arête.</li>
                    <li>Vous pouvez modifier les arêtes en cliquant directement dans la matrice !</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="animate-in fade-in">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">Tableau 2D (Matrice)</span>
              </h4>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="p-3 border-b border-r border-slate-200"></th>
                      {nodeIds.map(l => (
                        <th key={l} className={`p-3 border-b border-slate-200 text-sm ${hoveredNode === l ? 'text-orange-600 font-black' : 'text-slate-500'}`}>{l}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map((row, i) => {
                      const rowLabel = nodeIds[i];
                      return (
                        <tr key={i} className={hoveredNode === rowLabel ? 'bg-orange-50/50' : ''}>
                          <th className={`p-3 border-r border-slate-200 bg-slate-50 text-sm ${hoveredNode === rowLabel ? 'text-orange-600 font-black' : 'text-slate-500'}`}>{rowLabel}</th>
                          {row.map((val, j) => {
                            const colLabel = nodeIds[j];
                            const isHighlight = val === 1 && hoveredNode && (hoveredNode === rowLabel || hoveredNode === colLabel);
                            const isSelf = i === j;
                            return (
                              <td 
                                key={j} 
                                onClick={() => !isSelf && toggleEdge(rowLabel, colLabel)}
                                className={`p-3 border border-slate-100 text-sm transition-colors 
                                  ${isSelf ? 'bg-slate-100 text-slate-300' : 'cursor-pointer hover:bg-orange-100'} 
                                  ${isHighlight ? 'text-orange-600 font-black bg-orange-50' : (val === 1 ? 'text-slate-800 font-bold' : 'text-slate-400')}`}
                              >
                                {val}
                              </td>
                            )
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-4 italic text-center">
                Cliquez sur les 0 et les 1 pour modifier les arêtes en direct !
              </p>
            </div>
          )}

          {activeTab === 'list' && (
            <div className="animate-in fade-in">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="text-orange-500">Dictionnaire (Table de hachage)</span>
              </h4>
              <div className="bg-[#1E293B] text-slate-300 p-5 rounded-xl font-mono text-sm shadow-sm">
                <span className="text-blue-400">graphe</span> = {'{'}
                <div className="pl-6 space-y-1.5 mt-2 mb-2 border-l border-slate-700 ml-2">
                  {Object.entries(adjList).map(([key, neighbors]) => (
                    <div key={key} className={hoveredNode === key ? 'text-orange-200 bg-slate-800/80 rounded px-2 -ml-2 py-0.5' : 'px-0 py-0.5'}>
                      <span className="text-emerald-400">"{key}"</span>: [{neighbors.length > 0 ? neighbors.map(n => <span key={n} className={hoveredNode === n ? 'text-white font-bold' : 'text-orange-300'}>"{n}"</span>).reduce((prev, curr) => <>{prev}, {curr}</>) : ''}],
                    </div>
                  ))}
                </div>
                {'}'}
              </div>
              <p className="text-xs text-slate-400 mt-4 italic text-center">
                Mise à jour en temps réel selon vos modifications du graphe.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}