"use client";
import React, { useState, useMemo } from 'react';
import { GitMerge, Plus, Minus, Trash2 } from 'lucide-react';

type TreeNode = {
  id: number;
  val: number;
  parentId: number | null;
  side: 'left' | 'right' | null;
};

type NodeWithPos = TreeNode & {
  x: number;
  y: number;
  depth: number;
};

export default function TreeVisualizer() {
  const [nodes, setNodes] = useState<TreeNode[]>([
    { id: 1, val: 8, parentId: null, side: null },
    { id: 2, val: 3, parentId: 1, side: 'left' },
    { id: 3, val: 10, parentId: 1, side: 'right' },
    { id: 4, val: 1, parentId: 2, side: 'left' },
    { id: 5, val: 6, parentId: 2, side: 'right' },
    { id: 6, val: 14, parentId: 3, side: 'right' },
  ]);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [nextId, setNextId] = useState(7);

  // Compute positions
  const positionedNodes = useMemo(() => {
    const result: NodeWithPos[] = [];
    
    const calculateNode = (id: number, depth: number, x: number, y: number) => {
      const node = nodes.find(n => n.id === id);
      if (!node) return;
      
      result.push({ ...node, x, y, depth });
      
      const leftChild = nodes.find(n => n.parentId === id && n.side === 'left');
      const rightChild = nodes.find(n => n.parentId === id && n.side === 'right');
      
      const horizontalSpacing = 200 / Math.pow(2, depth + 1);
      const verticalSpacing = 60;
      
      if (leftChild) calculateNode(leftChild.id, depth + 1, x - horizontalSpacing, y + verticalSpacing);
      if (rightChild) calculateNode(rightChild.id, depth + 1, x + horizontalSpacing, y + verticalSpacing);
    };

    const root = nodes.find(n => n.parentId === null);
    if (root) {
      calculateNode(root.id, 0, 200, 40);
    }
    
    return result;
  }, [nodes]);

  const getPathToRoot = (nodeId: number): number[] => {
    const path = [];
    let currentId: number | null = nodeId;
    while (currentId !== null) {
      path.push(currentId);
      const node = nodes.find(n => n.id === currentId);
      currentId = node ? node.parentId : null;
    }
    return path;
  };

  const activePath = hoveredNode ? getPathToRoot(hoveredNode) : [];

  const addNode = (parentId: number, side: 'left' | 'right') => {
    const parentPos = positionedNodes.find(n => n.id === parentId);
    if (parentPos && parentPos.depth >= 3) {
      alert("Profondeur maximale atteinte pour cette visualisation.");
      return;
    }

    const newVal = Math.floor(Math.random() * 20);
    setNodes([...nodes, { id: nextId, val: newVal, parentId, side }]);
    setNextId(nextId + 1);
  };

  const removeNode = (id: number) => {
    const getDescendants = (nodeId: number): number[] => {
      const children = nodes.filter(n => n.parentId === nodeId).map(n => n.id);
      return [...children, ...children.flatMap(getDescendants)];
    };
    
    const toRemove = [id, ...getDescendants(id)];
    setNodes(nodes.filter(n => !toRemove.includes(n.id)));
  };
  
  const resetTree = () => {
    setNodes([{ id: 1, val: 8, parentId: null, side: null }]);
    setNextId(2);
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm my-8 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GitMerge size={24} className="text-orange-500 rotate-180" />
          <h3 className="text-xl font-bold text-slate-800">Visualiseur d'Arbre Binaire</h3>
        </div>
        <button 
          onClick={resetTree}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Dessin de l'Arbre */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex items-center justify-center relative min-h-[350px] overflow-hidden">
          <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 300">
            {/* Lignes (Arêtes) */}
            {positionedNodes.map((node) => {
              if (node.parentId === null) return null;
              const parent = positionedNodes.find(n => n.id === node.parentId)!;
              
              const isActiveEdge = activePath.includes(node.id) && activePath.includes(parent.id);
              
              return (
                <line 
                  key={`edge-${node.id}`} 
                  x1={parent.x} y1={parent.y} 
                  x2={node.x} y2={node.y} 
                  stroke={isActiveEdge ? "#F97316" : "#E2E8F0"} 
                  strokeWidth={isActiveEdge ? "3" : "2"}
                  className="transition-all duration-300"
                />
              );
            })}
            
            {/* Noeuds */}
            {positionedNodes.map(node => {
              const isRoot = node.parentId === null;
              const hasLeft = nodes.some(n => n.parentId === node.id && n.side === 'left');
              const hasRight = nodes.some(n => n.parentId === node.id && n.side === 'right');
              const isLeaf = !hasLeft && !hasRight;
              const isHovered = hoveredNode === node.id;
              const inPath = activePath.includes(node.id);

              return (
                <g 
                  key={`node-${node.id}`} 
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="transition-all duration-300"
                >
                  <circle 
                    cx={node.x} cy={node.y} r="20" 
                    fill={inPath ? "#FFF7ED" : "white"} 
                    stroke={isRoot ? "#8B5CF6" : isLeaf ? "#10B981" : "#94A3B8"} 
                    strokeWidth={inPath ? "3" : "2"}
                    className={`transition-all duration-300 ${inPath ? 'stroke-orange-500' : ''}`}
                  />
                  <text 
                    x={node.x} y={node.y + 5} 
                    textAnchor="middle" 
                    fill={inPath ? "#C2410C" : "#334155"} 
                    className="font-bold text-sm select-none transition-all duration-300 cursor-default"
                  >
                    {node.val}
                  </text>

                  {/* Boutons d'interaction au survol */}
                  {isHovered && (
                    <g className="opacity-100 transition-opacity">
                      {/* Ajouter à gauche */}
                      {!hasLeft && node.depth < 3 && (
                        <g 
                          transform={`translate(${node.x - 25}, ${node.y + 15})`} 
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => addNode(node.id, 'left')}
                        >
                          <circle cx="0" cy="0" r="8" fill="#10B981" />
                          <path d="M-3,0 L3,0 M0,-3 L0,3" stroke="white" strokeWidth="2" />
                        </g>
                      )}
                      {/* Ajouter à droite */}
                      {!hasRight && node.depth < 3 && (
                        <g 
                          transform={`translate(${node.x + 25}, ${node.y + 15})`} 
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => addNode(node.id, 'right')}
                        >
                          <circle cx="0" cy="0" r="8" fill="#10B981" />
                          <path d="M-3,0 L3,0 M0,-3 L0,3" stroke="white" strokeWidth="2" />
                        </g>
                      )}
                      {/* Supprimer (si pas racine) */}
                      {!isRoot && (
                        <g 
                          transform={`translate(${node.x}, ${node.y - 25})`} 
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => removeNode(node.id)}
                        >
                          <circle cx="0" cy="0" r="8" fill="#EF4444" />
                          <path d="M-3,0 L3,0" stroke="white" strokeWidth="2" />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1 text-slate-500"><div className="w-3 h-3 rounded-full border-2 border-purple-500 bg-white"></div> Racine</span>
            <span className="flex items-center gap-1 text-slate-500"><div className="w-3 h-3 rounded-full border-2 border-emerald-500 bg-white"></div> Feuilles</span>
          </div>
        </div>

        {/* Explications et Contrôles */}
        <div className="flex flex-col justify-center space-y-6">
          <div className="p-4 bg-orange-50 text-orange-800 rounded-xl border border-orange-100 text-sm">
            <strong>Interactif !</strong> Survolez un nœud pour faire apparaître les contrôles :
            <ul className="mt-2 space-y-1 ml-4 list-disc">
              <li>Cliquez sur les <span className="text-emerald-600 font-bold">(+)</span> pour ajouter un enfant gauche ou droit.</li>
              <li>Cliquez sur le <span className="text-red-500 font-bold">(-)</span> pour supprimer un nœud et toute sa descendance.</li>
            </ul>
          </div>
          
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="text-orange-500">Tableau des nœuds</span>
            </h4>
            <div className="max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 rounded-tl-lg">Valeur</th>
                    <th className="px-3 py-2">Parent</th>
                    <th className="px-3 py-2 rounded-tr-lg">Position</th>
                  </tr>
                </thead>
                <tbody>
                  {positionedNodes.map(node => (
                    <tr key={node.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-3 py-2 font-medium text-slate-800">{node.val}</td>
                      <td className="px-3 py-2">{node.parentId ? nodes.find(n => n.id === node.parentId)?.val : '-'}</td>
                      <td className="px-3 py-2 capitalize">{node.side || 'Racine'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
