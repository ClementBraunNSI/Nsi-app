"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Play, RotateCcw, Terminal, AlertTriangle, Loader2 } from 'lucide-react';

interface PythonPlaygroundProps {
  initialCode?: string;
  height?: string;
}

// Global type for Pyodide
declare global {
  interface Window {
    loadPyodide?: (config?: { indexURL?: string }) => Promise<any>;
    pyodide?: any;
  }
}

export default function PythonPlayground({ initialCode = "print('Hello NSI !')", height = "300px" }: PythonPlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const pyodideRef = useRef<any>(null);

  // Load Pyodide
  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.pyodide) {
        pyodideRef.current = window.pyodide;
        setIsPyodideLoading(false);
        return;
      }

      try {
        // Create script tag
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
        script.async = true;
        document.body.appendChild(script);

        script.onload = async () => {
          try {
            // Initialize Pyodide
            const load = window.loadPyodide;
            if (load) {
              const pyodide = await load({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
              });
              
              // Set up stdout capture
              pyodide.setStdout({
                batched: (msg: string) => {
                  setOutput(prev => [...prev, msg]);
                }
              });

              pyodideRef.current = pyodide;
              window.pyodide = pyodide;
              setIsPyodideLoading(false);
            }
          } catch (err) {
            console.error("Failed to init Pyodide:", err);
            setError("Erreur d'initialisation de l'interpréteur Python.");
            setIsPyodideLoading(false);
          }
        };

        script.onerror = () => {
          setError("Impossible de charger le script Pyodide (CDN). Vérifiez votre connexion.");
          setIsPyodideLoading(false);
        };

      } catch (e) {
        console.error(e);
        setError("Erreur critique lors du chargement.");
        setIsPyodideLoading(false);
      }
    };

    loadPyodideScript();
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current || isRunning) return;
    
    setIsRunning(true);
    setOutput([]); // Clear previous output
    setError(null);

    try {
      // Capture standard output manually if setStdout doesn't catch everything
      // We wrap the code to redirect stdout to a string buffer in Python
      // But Pyodide's setStdout is usually cleaner. Let's rely on that first.
      
      // We can also use Python's io.StringIO to capture output explicitly if needed
      await pyodideRef.current.runPythonAsync(code);
      
    } catch (err: any) {
      setError(err.toString());
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    setOutput([]);
    setError(null);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
            <Terminal size={18} />
          </div>
          <span className="font-bold text-slate-700 text-sm">Playground Python</span>
          {isPyodideLoading && (
            <span className="flex items-center gap-1 text-xs text-slate-400 ml-2">
              <Loader2 size={12} className="animate-spin" /> Chargement...
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetCode}
            className="p-2 text-slate-500 hover:bg-slate-200 rounded-lg transition-colors"
            title="Réinitialiser"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={runCode}
            disabled={isPyodideLoading || isRunning}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-lg font-bold text-sm transition-all
              ${isPyodideLoading || isRunning 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow"}
            `}
          >
            {isRunning ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            {isRunning ? "Exécution..." : "Exécuter"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[400px]">
        {/* Editor */}
        <div className="border-r border-slate-200 h-full">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={code}
            onChange={(value) => setCode(value || "")}
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

        {/* Console Output */}
        <div className="bg-[#1e1e1e] text-slate-300 font-mono text-sm p-4 overflow-y-auto h-full flex flex-col">
          <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Sortie Console</div>
          
          {output.length === 0 && !error && (
            <div className="text-slate-600 italic mt-4 text-center">
              Le résultat de votre code s'affichera ici...
            </div>
          )}

          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap mb-1 text-emerald-400">
              {line}
            </div>
          ))}

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded text-red-400 text-xs whitespace-pre-wrap">
              <div className="flex items-center gap-2 font-bold mb-1 text-red-300">
                <AlertTriangle size={14} /> Erreur Python
              </div>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
