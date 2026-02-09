'use client';

import React, { useState, useEffect } from 'react';
import { Table } from 'lucide-react';

interface SqlTableProps {
  initialSql?: string; // SQL to create table and insert data
  tableName: string; // Table to display
  title?: string;
}

export default function SqlTable({ 
  initialSql = "", 
  tableName,
  title
}: SqlTableProps) {
  const [data, setData] = useState<{columns: string[], values: any[][]} | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // @ts-ignore
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({
          locateFile: (file: string) => `/sql/${file}`
        });
        
        const db = new SQL.Database();
        if (initialSql) {
          db.run(initialSql);
        }

        const res = db.exec(`SELECT * FROM ${tableName}`);
        if (res.length > 0) {
          setData({
            columns: res[0].columns,
            values: res[0].values
          });
        } else {
            // Table exists but empty? or error?
            setData({ columns: [], values: [] });
        }
        
        db.close();
        setLoading(false);
      } catch (err: any) {
        console.error("Erreur SqlTable:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, [initialSql, tableName]);

  if (loading) {
     return <div className="animate-pulse h-32 bg-slate-100 rounded-xl my-4"></div>;
  }

  if (error) {
    return (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm my-4">
            Erreur lors du chargement de la table {tableName}: {error}
        </div>
    );
  }

  return (
    <div className="my-6 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex items-center gap-2">
        <div className="p-1.5 bg-indigo-100 rounded-md text-indigo-600">
            <Table size={16} />
        </div>
        <span className="font-semibold text-slate-700 text-sm">{title || `Table : ${tableName}`}</span>
      </div>
      
      <div className="overflow-x-auto p-0">
        {data && data.columns.length > 0 ? (
            <table className="w-full text-sm text-left text-slate-600 border-collapse">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                <tr>
                {data.columns.map((col, i) => (
                    <th key={i} className="px-6 py-3 border-b border-r border-slate-200 last:border-r-0">
                    {col}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white">
                {data.values.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">
                    {row.map((cell: any, j: number) => (
                    <td key={j} className="px-6 py-3 border-r border-slate-100 last:border-r-0 font-mono text-slate-800 text-xs">
                        {cell === null ? <span className="text-slate-400 italic">NULL</span> : cell.toString()}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <div className="p-4 text-center text-slate-500 italic text-sm">Table vide</div>
        )}
      </div>
    </div>
  );
}
