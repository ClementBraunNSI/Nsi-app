"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, MapPin, Terminal, AlertTriangle, Loader2 } from 'lucide-react';
import { loadPythonPackages } from '@/lib/pyodide-packages';

interface CarteGpsPlaygroundProps {
  initialCode?: string;
  editorHeight?: string;
  mapHeight?: string;
}

declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<any>;
    pyodide?: any;
  }
}

const DEFAULT_CODE = `import folium

# Crée une carte centrée sur la France
carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

print("Carte prête ! Cliquez sur Exécuter pour l'afficher.")
`;

export default function CarteGpsPlayground({
  initialCode = DEFAULT_CODE,
  editorHeight = "280px",
  mapHeight = "360px",
}: CarteGpsPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [mapHtml, setMapHtml] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<any>(null);
  const packagesLoadedRef = useRef(false);

  useEffect(() => {
    setCode(initialCode);
    setOutput([]);
    setMapHtml(null);
    setError(null);
  }, [initialCode]);

  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.pyodide) {
        pyodideRef.current = window.pyodide;
        setIsPyodideLoading(false);
        return;
      }

      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          try {
            const load = window.loadPyodide;
            if (!load) return;

            const pyodide = await load({
              indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
            });

            pyodideRef.current = pyodide;
            window.pyodide = pyodide;
            setIsPyodideLoading(false);
          } catch (err) {
            console.error('Failed to init Pyodide:', err);
            setError("Erreur d'initialisation de l'interpréteur Python.");
            setIsPyodideLoading(false);
          }
        };

        script.onerror = () => {
          setError('Impossible de charger Pyodide. Vérifiez votre connexion.');
          setIsPyodideLoading(false);
        };
      } catch (e) {
        console.error(e);
        setError('Erreur critique lors du chargement.');
        setIsPyodideLoading(false);
      }
    };

    loadPyodideScript();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current || isRunning) return;

    setIsRunning(true);
    setOutput([]);
    setMapHtml(null);
    setError(null);

    const logs: string[] = [];

    try {
      if (!packagesLoadedRef.current) {
        logs.push('> Chargement de folium...');
        setOutput([...logs]);
        await loadPythonPackages(pyodideRef.current, ['folium', 'pandas']);
        packagesLoadedRef.current = true;
      }

      pyodideRef.current.setStdout({
        batched: (msg: string) => {
          logs.push(msg);
          setOutput([...logs]);
        },
      });
      pyodideRef.current.setStderr({
        batched: (msg: string) => logs.push(`[Erreur] ${msg}`),
      });

      await pyodideRef.current.runPythonAsync(code);

      const html = await pyodideRef.current.runPythonAsync(`
import json
if "carte" in globals() and hasattr(carte, "_repr_html_"):
    json.dumps(carte._repr_html_())
else:
    json.dumps("")
`);

      const parsedHtml = JSON.parse(html);
      if (parsedHtml) {
        setMapHtml(parsedHtml);
        logs.push('> Carte mise à jour !');
      } else {
        logs.push('> Aucune carte trouvée : créez une variable nommée carte (folium.Map).');
      }
      setOutput([...logs]);
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setMapHtml(null);
    setError(null);
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
            <MapPin size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">Carte GPS interactive</p>
            <p className="text-xs text-slate-500">Modifiez le code, puis exécutez pour voir la carte</p>
          </div>
          {isPyodideLoading && (
            <span className="ml-2 flex items-center gap-1 text-xs text-slate-400">
              <Loader2 size={12} className="animate-spin" /> Chargement Python...
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200"
            title="Réinitialiser"
            type="button"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={runCode}
            disabled={isPyodideLoading || isRunning}
            className={`flex items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-bold transition-all ${
              isPyodideLoading || isRunning
                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                : 'bg-emerald-500 text-white shadow-sm hover:bg-emerald-600'
            }`}
            type="button"
          >
            {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
            {isRunning ? 'Exécution...' : 'Exécuter'}
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200" style={{ height: editorHeight }}>
        <Editor
          height="100%"
          defaultLanguage="python"
          value={code}
          onChange={(value) => setCode(value || '')}
          theme="light"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-b border-slate-200 lg:border-b-0 lg:border-r" style={{ minHeight: mapHeight }}>
          {mapHtml ? (
            <iframe
              srcDoc={mapHtml}
              title="Carte folium"
              className="h-full w-full border-0"
              style={{ minHeight: mapHeight }}
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div
              className="flex h-full flex-col items-center justify-center bg-emerald-50/40 p-6 text-center text-slate-500"
              style={{ minHeight: mapHeight }}
            >
              <MapPin size={32} className="mb-3 text-emerald-400" />
              <p className="text-sm font-medium">La carte s'affichera ici après l'exécution.</p>
              <p className="mt-1 text-xs">Votre programme doit créer une variable <code className="rounded bg-white px-1">carte</code>.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col bg-[#1e1e1e] text-sm text-slate-300">
          <div className="flex items-center gap-2 border-b border-[#333] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Terminal size={14} />
            Console
          </div>
          <div className="min-h-[120px] flex-1 overflow-y-auto p-4 font-mono" style={{ maxHeight: mapHeight }}>
            {output.length === 0 && !error && (
              <p className="italic text-slate-600">Les messages de votre programme apparaîtront ici...</p>
            )}
            {output.map((line, i) => (
              <div key={i} className="mb-1 whitespace-pre-wrap text-emerald-400">
                {line}
              </div>
            ))}
            {error && (
              <div className="mt-2 whitespace-pre-wrap rounded border border-red-800/50 bg-red-900/30 p-3 text-xs text-red-400">
                <div className="mb-1 flex items-center gap-2 font-bold text-red-300">
                  <AlertTriangle size={14} /> Erreur Python
                </div>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
