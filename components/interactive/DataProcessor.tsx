'use client';

import React, { useState, useMemo } from 'react';
import { Filter, ArrowUpDown, Calculator, Database, RefreshCw } from 'lucide-react';

type ElementType = 'Feu' | 'Eau' | 'Plante' | 'Électrique' | 'Normal';

interface Monster {
  id: number;
  nom: string;
  type: ElementType;
  niveau: number;
  poids: number; // kg
}

const INITIAL_DATA: Monster[] = [
  { id: 1, nom: 'Flaméou', type: 'Feu', niveau: 12, poids: 8.5 },
  { id: 2, nom: 'Aquabulle', type: 'Eau', niveau: 5, poids: 3.2 },
  { id: 3, nom: 'Herbizar', type: 'Plante', niveau: 18, poids: 12.0 },
  { id: 4, nom: 'Voltali', type: 'Électrique', niveau: 25, poids: 5.4 },
  { id: 5, nom: 'Rocabot', type: 'Normal', niveau: 8, poids: 9.1 },
  { id: 6, nom: 'Pyroli', type: 'Feu', niveau: 32, poids: 15.6 },
  { id: 7, nom: 'Tortipouss', type: 'Plante', niveau: 10, poids: 6.8 },
  { id: 8, nom: 'Staross', type: 'Eau', niveau: 28, poids: 22.5 },
];

export default function DataProcessor() {
  const [data, setData] = useState<Monster[]>(INITIAL_DATA);
  const [filterType, setFilterType] = useState<ElementType | 'Tous'>('Tous');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Monster, direction: 'asc' | 'desc' } | null>(null);
  const [activeOperation, setActiveOperation] = useState<string>('SELECT * FROM monstres');

  // Derived state
  const processedData = useMemo(() => {
    let result = [...INITIAL_DATA];

    // 1. Filter
    if (filterType !== 'Tous') {
      result = result.filter(m => m.type === filterType);
    }

    // 2. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [filterType, sortConfig]);

  // Statistics
  const averageLevel = useMemo(() => {
    if (processedData.length === 0) return 0;
    return (processedData.reduce((acc, curr) => acc + curr.niveau, 0) / processedData.length).toFixed(1);
  }, [processedData]);

  // Handlers
  const handleFilter = (type: ElementType | 'Tous') => {
    setFilterType(type);
    if (type === 'Tous') {
      setActiveOperation('SELECT * FROM monstres');
    } else {
      setActiveOperation(`SELECT * FROM monstres WHERE type = '${type}'`);
    }
  };

  const handleSort = (key: keyof Monster) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const dirStr = direction === 'asc' ? 'ASC' : 'DESC';
    const whereClause = filterType !== 'Tous' ? ` WHERE type = '${filterType}'` : '';
    setActiveOperation(`SELECT * FROM monstres${whereClause} ORDER BY ${key} ${dirStr}`);
  };

  const getTypeColor = (type: ElementType) => {
    switch (type) {
      case 'Feu': return 'bg-red-100 text-red-800 border-red-200';
      case 'Eau': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Plante': return 'bg-green-100 text-green-800 border-green-200';
      case 'Électrique': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Normal': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-200 my-8 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
        <h3 className="font-bold flex items-center gap-2">
          <Database className="w-5 h-5 text-orange-400" />
          Explorateur de Données
        </h3>
        <div className="font-mono text-xs bg-slate-800 px-3 py-1.5 rounded text-orange-400 border border-slate-700">
          &gt; {activeOperation}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-4">
        
        {/* Filter Group */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtrer par Type
          </span>
          <div className="flex gap-2">
            {(['Tous', 'Feu', 'Eau', 'Plante'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleFilter(type)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  filterType === type 
                    ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Group */}
        <div className="flex flex-col gap-2 ml-auto">
           <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3" /> Trier par
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('niveau')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                sortConfig?.key === 'niveau'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'
              }`}
            >
              Niveau {sortConfig?.key === 'niveau' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => handleSort('poids')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                sortConfig?.key === 'poids'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-orange-500'
              }`}
            >
              Poids {sortConfig?.key === 'poids' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Niveau</th>
              <th className="px-6 py-3 text-right">Poids (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedData.length > 0 ? (
              processedData.map((monster) => (
                <tr key={monster.id} className="hover:bg-orange-50 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <td className="px-6 py-4 font-mono text-slate-400">#{monster.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{monster.nom}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getTypeColor(monster.type)}`}>
                      {monster.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600">{monster.niveau}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600">{monster.poids}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  Aucune donnée ne correspond aux critères
                </td>
              </tr>
            )}
          </tbody>
          {/* Footer with Stats */}
          <tfoot className="bg-slate-50 border-t border-slate-200">
            <tr>
              <td colSpan={3} className="px-6 py-3 font-bold text-slate-500 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Calculator className="w-4 h-4" /> Moyenne :
                </div>
              </td>
              <td className="px-6 py-3 text-right font-bold text-orange-600 font-mono">
                {averageLevel}
              </td>
              <td className="px-6 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
