'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Database } from 'lucide-react';

interface SqlEditorProps {
  initialSql?: string;
  defaultQuery?: string;
  title?: string;
  description?: string;
}

export default function SqlEditor({ 
  initialSql = "", 
  defaultQuery = "SELECT * FROM sqlite_master WHERE type='table';",
  title = "Éditeur SQL",
  description
}: SqlEditorProps) {
  const [db, setDb] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{columns: string[], values: any[][]} | null>(null);
  const [query, setQuery] = useState(defaultQuery);
  const [loading, setLoading] = useState(true);
  const [sqlJs, setSqlJs] = useState<any>(null);

  // Charger sql.js uniquement côté client
  useEffect(() => {
    const loadSqlJs = async () => {
      try {
        // @ts-ignore
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) => `/sql/${file}`
        });
        setSqlJs(SQL);
        
        // Initialiser la DB
        const newDb = new SQL.Database();
        if (initialSql) {
          newDb.run(initialSql);
        }
        setDb(newDb);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement de sql.js:", err);
        setError("Impossible de charger le moteur SQL.");
        setLoading(false);
      }
    };

    loadSqlJs();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, []);

  const runQuery = useCallback(() => {
    if (!db) return;
    setError(null);
    setResults(null);

    try {
      const res = db.exec(query);
      if (res.length > 0) {
        setResults({
          columns: res[0].columns,
          values: res[0].values
        });
      } else {
        // Pas de résultats (ex: INSERT, UPDATE ou SELECT vide)
        // On vérifie si c'était une commande de modification
        if (query.trim().toUpperCase().startsWith('SELECT')) {
           setResults({ columns: [], values: [] }); // Résultat vide
        } else {
           // On pourrait afficher un message de succès
           setResults({ columns: ["Info"], values: [["Requête exécutée avec succès"]] });
        }
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [db, query]);

  const resetDb = () => {
    if (!sqlJs) return;
    const newDb = new sqlJs.Database();
    if (initialSql) {
      newDb.run(initialSql);
    }
    setDb(newDb);
    setResults(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <span className="ml-3 text-slate-500">Chargement du moteur SQL...</span>
      </div>
    );
  }

  return (
    <div className="my-6 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Database size={20} />
            </div>
            <div>
                <h3 className="font-semibold text-slate-800">{title}</h3>
                {description && <p className="text-sm text-slate-500">{description}</p>}
            </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={resetDb}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
            title="Réinitialiser la base de données"
          >
            <RotateCcw size={16} />
            Reset
          </button>
          <button 
            onClick={runQuery}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors shadow-sm"
          >
            <Play size={16} />
            Exécuter
          </button>
        </div>
      </div>

      <div className="h-64 border-b border-slate-200">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(value) => setQuery(value || "")}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16 }
          }}
        />
      </div>

      <div className="p-4 bg-slate-50 min-h-[100px]">
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-mono">
            Erreur SQL : {error}
          </div>
        ) : results ? (
          <div className="overflow-x-auto">
             {results.columns.length > 0 ? (
                <table className="w-full text-sm text-left text-slate-600 border-collapse">
                <thead className="text-xs text-slate-700 uppercase bg-slate-200">
                    <tr>
                    {results.columns.map((col, i) => (
                        <th key={i} className="px-6 py-3 border border-slate-300">
                        {col}
                        </th>
                    ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {results.values.map((row, i) => (
                    <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
                        {row.map((cell: any, j: number) => (
                        <td key={j} className="px-6 py-4 border border-slate-200 font-mono text-slate-800">
                            {cell === null ? <span className="text-slate-400 italic">NULL</span> : cell.toString()}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </table>
             ) : (
                 <div className="text-slate-500 italic text-center py-4">Aucun résultat retourné (ou requête vide)</div>
             )}
          </div>
        ) : (
          <div className="text-slate-400 italic text-center py-4 text-sm">
            Les résultats de votre requête s'afficheront ici...
          </div>
        )}
      </div>
    </div>
  );
}
