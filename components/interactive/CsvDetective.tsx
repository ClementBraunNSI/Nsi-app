
'use client';

import React, { useState, useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, Search, Filter } from 'lucide-react';

type Person = {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  ville: string;
  metier: string;
  signe_particulier: string;
};

const defaultData: Person[] = [
  { id: 1, nom: "Dupont", prenom: "Jean", age: 45, ville: "Paris", metier: "Banquier", signe_particulier: "Porte des lunettes" },
  { id: 2, nom: "Martin", prenom: "Sophie", age: 32, ville: "Lyon", metier: "Avocate", signe_particulier: "Gaucher" },
  { id: 3, nom: "Bernard", prenom: "Luc", age: 28, ville: "Marseille", metier: "Boulanger", signe_particulier: "Tatouage au bras" },
  { id: 4, nom: "Petit", prenom: "Marie", age: 54, ville: "Paris", metier: "Médecin", signe_particulier: "Cheveux rouges" },
  { id: 5, nom: "Robert", prenom: "Thomas", age: 32, ville: "Lille", metier: "Ingénieur", signe_particulier: "Boiteux" },
  { id: 6, nom: "Richard", prenom: "Emma", age: 22, ville: "Lyon", metier: "Étudiante", signe_particulier: "Sac à dos vert" },
  { id: 7, nom: "Durand", prenom: "Paul", age: 45, ville: "Paris", metier: "Architecte", signe_particulier: "Chapeau melon" },
  { id: 8, nom: "Moreau", prenom: "Julie", age: 60, ville: "Bordeaux", metier: "Retraitée", signe_particulier: "Canne" },
];

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor('nom', {
    header: 'Nom',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('prenom', {
    header: 'Prénom',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Âge',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('ville', {
    header: 'Ville',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('metier', {
    header: 'Métier',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('signe_particulier', {
    header: 'Signe Particulier',
    cell: info => info.getValue(),
  }),
];

export default function CsvDetective() {
  const [data] = useState(() => [...defaultData]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<any[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const foundCount = table.getRowModel().rows.length;

  return (
    <div className="border rounded-xl p-6 bg-white shadow-lg my-8 font-sans">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            🕵️‍♂️ Le Détective CSV
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Trouve le suspect grâce aux indices. Utilise les filtres ci-dessous.
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 max-w-xs">
          <strong>Indice du jour :</strong> Le suspect a 32 ans et habite à Lyon.
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="Recherche globale..."
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-slate-600 font-bold text-sm">
          <Filter size={16} />
          {foundCount} suspect(s) trouvé(s)
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-6 py-3 border-b cursor-pointer hover:bg-slate-100 transition-colors" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ChevronUp size={14} />,
                        desc: <ChevronDown size={14} />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-blue-50 transition-colors group">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4 text-slate-700 group-hover:text-blue-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {foundCount === 0 && (
        <div className="text-center py-10 text-slate-400">
          Aucun suspect ne correspond à ces critères... 🧐
        </div>
      )}
    </div>
  );
}
