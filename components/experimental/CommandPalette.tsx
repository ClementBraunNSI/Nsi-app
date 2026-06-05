"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Command, ArrowRight, Zap, Hash, FileText } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CommandItem {
  id: string;
  title: string;
  shortcut?: string;
  icon: React.ReactNode;
  category: 'Pages' | 'Actions' | 'Cours';
  action: () => void;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  // Mock Data (To be replaced with real data fetch)
  const commands: CommandItem[] = [
    { id: 'home', title: 'Aller à l\'Accueil', category: 'Pages', icon: <Hash size={16} />, action: () => router.push('/') },
    { id: 'lab', title: 'Aller au Lab', category: 'Pages', icon: <Zap size={16} />, action: () => router.push('/lab') },
    { id: 'dicho', title: 'Cours : Dichotomie', category: 'Cours', icon: <FileText size={16} />, action: () => router.push('/cours/2/algo_dichotomie') },
    { id: 'python', title: 'Cours : Python — Constructions', category: 'Cours', icon: <FileText size={16} />, action: () => router.push('/cours/2/python_constructions_elementaires') },
    { id: 'sort', title: 'Visualiseur de Tris', category: 'Actions', icon: <Zap size={16} />, action: () => router.push('/lab/sorting') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh] animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="text-slate-400 mr-3" size={20} />
          <input 
            className="flex-1 bg-transparent outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            placeholder="Rechercher une commande ou un cours..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">Aucun résultat trouvé.</div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    cmd.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400 group-hover:text-orange-500 transition-colors">
                      {cmd.icon}
                    </div>
                    <span>{cmd.title}</span>
                  </div>
                  {cmd.category && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                      {cmd.category}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <div className="flex gap-4">
            <span><strong className="font-bold">↑↓</strong> pour naviguer</span>
            <span><strong className="font-bold">↵</strong> pour valider</span>
          </div>
          <span className="flex items-center gap-1">
            Propulsé par <Command size={10} />
          </span>
        </div>
      </div>
      
      {/* Overlay click to close */}
      <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
    </div>,
    document.body
  );
}
