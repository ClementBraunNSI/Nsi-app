'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, ChevronUp, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS, LevelConfig, Direction, Position } from './levels';

import Image from 'next/image';

// Configuration de Monaco Editor
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

// --- COMPOSANTS GRAPHIQUES ---

const FoxLogo = ({ className = "w-8 h-8 drop-shadow-sm" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className}>
    <path d="M50 85L20 50L50 15L80 50L50 85Z" fill="#ea580c"/>
    <circle cx="40" cy="50" r="5" fill="#1e293b"/>
    <circle cx="60" cy="50" r="5" fill="#1e293b"/>
    <path d="M35 30L65 30L50 15L35 30Z" fill="#fb923c"/>
  </svg>
);

const FoxSprite = ({ direction }: { direction: Direction }) => {
  const getSpriteSrc = () => {
    switch(direction) {
      case 'E': return '/images/foxtest/renard_haut.png';
      case 'W': return '/images/foxtest/renard_bas.png';
      case 'S': return '/images/foxtest/renard_droite.png';
      case 'N': return '/images/foxtest/renard_gauche.png';
      default: return '/images/foxtest/renard_haut.png';
    }
  };

  return (
    <div className="relative w-full h-full">
      <Image 
        src={getSpriteSrc()} 
        alt="Fox Sprite" 
        fill
        style={{ objectFit: 'contain' }}
        className="drop-shadow-xl"
        priority
      />
    </div>
  );
};

const ChickenSprite = () => (
  <div className="relative w-full h-full">
    <Image 
      src="/images/foxtest/poulet.png" 
      alt="Chicken Sprite" 
      fill
      style={{ objectFit: 'contain' }}
      className="drop-shadow-md"
    />
  </div>
);

const GroundBlock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 96" className="w-[141.4%] h-[141.4%] absolute" style={{ 
    left: '-20.7%', 
    top: '-20.7%',
    transform: 'translateZ(-25px) rotateZ(45deg) rotateX(-60deg)',
    transformStyle: 'preserve-3d'
  }}> 
    <polygon points="64,64 128,32 128,52 64,84" fill="#65a30d" /> 
    <polygon points="0,32 64,64 64,84 0,52" fill="#84cc16" /> 
    <polygon points="64,0 128,32 64,64 0,32" fill="#a3e635" /> 
    <path d="M20,30 L20,25 M108,30 L108,25 M64,55 L64,50" stroke="#84cc16" strokeWidth="2" strokeLinecap="round"/> 
  </svg>
);

const RockBlock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-[141.4%] h-[188.5%] absolute" style={{ 
    left: '-20.7%', 
    top: '-43%',
    transform: 'translateZ(10px) rotateZ(45deg) rotateX(-60deg)',
    transformStyle: 'preserve-3d'
  }}> 
    <ellipse cx="64" cy="95" rx="45" ry="20" fill="#1e293b" opacity="0.2"/> 
 
    <polygon points="64,25 100,45 64,65 28,45" fill="#94a3b8" /> 
    <polygon points="28,45 64,65 64,95 28,75" fill="#475569" /> 
    <polygon points="64,65 100,45 100,75 64,95" fill="#64748b" /> 
  
    <polyline points="28,45 45,55 45,85" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
    <polyline points="64,65 80,55 85,75" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> 
    <line x1="75" y1="35" x2="90" y2="40" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"/> 
    <polygon points="50,35 60,40 55,45" fill="#cbd5e1" opacity="0.5"/> 
  
    <polygon points="35,75 50,85 35,95 20,85" fill="#cbd5e1" /> 
    <polygon points="20,85 35,95 35,105 20,95" fill="#64748b" /> 
    <polygon points="35,95 50,85 50,95 35,105" fill="#94a3b8" /> 
  
    <polygon points="95,65 110,75 95,85 80,75" fill="#cbd5e1" /> 
    <polygon points="80,75 95,85 95,95 80,85" fill="#64748b" /> 
    <polygon points="95,85 110,75 110,85 95,95" fill="#94a3b8" /> 
  </svg>
);

const IsoGrid = ({ level, foxPos, foxDir }: { level: LevelConfig, foxPos: Position, foxDir: Direction }) => {
    const MAX_GRID_DIM = Math.max(level.gridSize.cols, level.gridSize.rows);
    const CELL_SIZE = Math.min(64, 400 / MAX_GRID_DIM); 
    
    return (
        <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <div 
                style={{
                    transform: 'rotateX(60deg) rotateZ(-45deg)',
                    transformStyle: 'preserve-3d',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${level.gridSize.cols}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${level.gridSize.rows}, ${CELL_SIZE}px)`,
                    gap: '2px',
                    transition: 'all 0.5s ease'
                }}
            >
                {/* Rendu des cases et obstacles */}
                {Array.from({ length: level.gridSize.rows * level.gridSize.cols }).map((_, idx) => {
                    const x = idx % level.gridSize.cols;
                    const y = Math.floor(idx / level.gridSize.cols);
                    const isObstacle = level.obstacles.some((o: any) => o.x === x && o.y === y);
                    const isGoal = level.goal.x === x && level.goal.y === y;

                    return (
                        <div key={idx} className="relative" style={{ width: CELL_SIZE, height: CELL_SIZE, transformStyle: 'preserve-3d' }}>
                            {/* Sol de base (SVG) */}
                            <GroundBlock />

                            {/* Obstacle (Rocher SVG de la maquette) */}
                            {isObstacle && (
                                <RockBlock />
                            )}

                            {/* Objectif (La Poule ! - Affichée en billboard 2D face caméra) */}
                            {isGoal && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none" 
                                     style={{ 
                                         transform: 'translateZ(10px) rotateZ(45deg) rotateX(-60deg)',
                                         transformStyle: 'preserve-3d',
                                         width: CELL_SIZE * 1.5,
                                         height: CELL_SIZE * 1.5,
                                         left: -CELL_SIZE * 0.15,
                                         top: -CELL_SIZE * 0.55
                                     }}>
                                     <div className="w-full h-full animate-bounce" style={{ filter: 'drop-shadow(0px 10px 5px rgba(0,0,0,0.3))' }}>
                                         <ChickenSprite />
                                     </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Le Renard (SVG 2D orienté face caméra) */}
                <div 
                    className="absolute flex items-center justify-center z-50 transition-all duration-300 ease-in-out pointer-events-none"
                    style={{
                        width: CELL_SIZE * 1.5,
                        height: CELL_SIZE * 1.5,
                        left: `${foxPos.x * (CELL_SIZE + 2) - CELL_SIZE * 0.05}px`,
                        top: `${foxPos.y * (CELL_SIZE + 2) - CELL_SIZE * 0.55}px`,
                        transform: `translateZ(15px) rotateZ(45deg) rotateX(-60deg)`,
                        transformStyle: 'preserve-3d'
                    }}
                >
                    <div className="w-full h-full" style={{ filter: 'drop-shadow(0px 15px 5px rgba(0,0,0,0.4))' }}>
                        <FoxSprite direction={foxDir} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- LOGIQUE PRINCIPALE DU JEU ---

export default function FoxGame() {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [level, setLevel] = useState<LevelConfig>(LEVELS[0]);
  
  const [foxPos, setFoxPos] = useState<Position>({ x: 0, y: 0 });
  const [foxDir, setFoxDir] = useState<Direction>('N');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [stars, setStars] = useState<number>(0);
  const [code, setCode] = useState('');

  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  useEffect(() => {
    const lvl = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
    setLevel(lvl);
    resetLevel(lvl);
  }, [currentLevelId]);

  const resetLevel = (lvl: LevelConfig) => {
    setFoxPos(lvl.start.pos);
    setFoxDir(lvl.start.dir);
    setGameStatus('idle');
    setStars(0);
    setLogs([]);
    setCode(lvl.initialCode || '');
  };

  useEffect(() => {
    if (isPyodideReady || pyodideLoadingRef.current) return;
    pyodideLoadingRef.current = true;

    const initPyodide = async () => {
      try {
        if (!(window as any).loadPyodide) throw new Error("window.loadPyodide is not defined");
        const pyodide = await (window as any).loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        pyodideRef.current = pyodide;
        setIsPyodideReady(true);
      } catch (e: any) {
        setLogs(prev => [...prev, `❌ Erreur d'initialisation Python: ${e.message || e}`]);
        pyodideLoadingRef.current = false;
      }
    };

    const loadPyodideScript = () => {
      if ((window as any).loadPyodide) return initPyodide();
      const existingScript = document.querySelector('script[src*="pyodide.js"]');
      if (existingScript) {
          existingScript.addEventListener('load', () => initPyodide());
          return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = () => initPyodide();
      script.onerror = () => {
        setLogs(prev => [...prev, "❌ Erreur critique : Impossible de charger Pyodide."]);
        pyodideLoadingRef.current = false;
      };
      document.body.appendChild(script);
    };

    loadPyodideScript();
  }, [isPyodideReady]);

  const handleRun = async () => {
    if (!pyodideRef.current || isRunning) return;
    setIsRunning(true);
    setGameStatus('playing');
    setLogs([]);
    setFoxPos(level.start.pos);
    setFoxDir(level.start.dir);

    try {
      const gridSizeJson = JSON.stringify(level.gridSize);
      const obstaclesJson = JSON.stringify(level.obstacles);
      const startPosJson = JSON.stringify(level.start.pos);
      const startDirJson = JSON.stringify(level.start.dir);
      const goalPosJson = JSON.stringify(level.goal);

      const pythonBridge = `
import js
import json

grid_size = json.loads('${gridSizeJson}')
obstacles = json.loads('${obstaclesJson}')
current_pos = json.loads('${startPosJson}')
current_dir = json.loads('${startDirJson}')
goal_pos = json.loads('${goalPosJson}')
actions_queue = []

def get_next_pos(pos, direction):
    x, y = pos['x'], pos['y']
    if direction == 'N': y -= 1
    elif direction == 'S': y += 1
    elif direction == 'E': x += 1
    elif direction == 'W': x -= 1
    return {'x': x, 'y': y}

def is_blocked(pos):
    if pos['x'] < 0 or pos['x'] >= grid_size['cols'] or pos['y'] < 0 or pos['y'] >= grid_size['rows']:
        return True
    for obs in obstacles:
        if obs['x'] == pos['x'] and obs['y'] == pos['y']: return True
    return False

def mur_devant(): return is_blocked(get_next_pos(current_pos, current_dir))
def mur_droite():
    dirs = ['N', 'E', 'S', 'W']
    return is_blocked(get_next_pos(current_pos, dirs[(dirs.index(current_dir) + 1) % 4]))
def mur_gauche():
    dirs = ['N', 'E', 'S', 'W']
    return is_blocked(get_next_pos(current_pos, dirs[(dirs.index(current_dir) + 3) % 4]))
def sur_objectif(): return current_pos['x'] == goal_pos['x'] and current_pos['y'] == goal_pos['y']

def avancer():
    global current_pos
    next_p = get_next_pos(current_pos, current_dir)
    if not is_blocked(next_p): current_pos = next_p
    actions_queue.append("MOVE")

def tourner_gauche():
    global current_dir
    dirs = ['N', 'E', 'S', 'W']
    current_dir = dirs[(dirs.index(current_dir) + 3) % 4]
    actions_queue.append("TURN_LEFT")

def tourner_droite():
    global current_dir
    dirs = ['N', 'E', 'S', 'W']
    current_dir = dirs[(dirs.index(current_dir) + 1) % 4]
    actions_queue.append("TURN_RIGHT")

def tourner(direction):
    if direction == 'gauche': tourner_gauche()
    elif direction == 'droite': tourner_droite()

def av(): avancer()
def tg(): tourner_gauche()
def td(): tourner_droite()
`;

      await pyodideRef.current.runPythonAsync(pythonBridge);
      await pyodideRef.current.runPythonAsync(code);
      
      const actionsProxy = pyodideRef.current.globals.get('actions_queue');
      let actions: string[] = [];
      if (actionsProxy) {
        actions = actionsProxy.toJs();
        actionsProxy.destroy();
      }

      if (actions.length === 0) {
        setLogs(["⚠️ Aucune action générée."]);
      }
      
      await animateActions(actions);

    } catch (e: any) {
      setLogs([`❌ Erreur : ${e.message || e.toString()}`]);
      setGameStatus('lost');
    } finally {
      setIsRunning(false);
    }
  };

  const animateActions = async (actions: string[]) => {
    let currentPos = { ...level.start.pos };
    let currentDir = level.start.dir;
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      await wait(400); 

      if (action === "MOVE") {
        const nextPos = getNextPos(currentPos, currentDir);
        if (isBlocked(nextPos)) {
            setLogs([`⚠️ Aïe ! Mur percuté.`]);
            setGameStatus('lost');
            return;
        }
        currentPos = nextPos;
        setFoxPos({ ...currentPos });
      } 
      else if (action === "TURN_LEFT") {
        currentDir = rotate(currentDir, 'LEFT');
        setFoxDir(currentDir);
      }
      else if (action === "TURN_RIGHT") {
        currentDir = rotate(currentDir, 'RIGHT');
        setFoxDir(currentDir);
      }
    }
    await wait(300);
    await checkWin(currentPos);
  };

  const getNextPos = (pos: Position, dir: Direction): Position => {
    switch (dir) {
      case 'N': return { x: pos.x, y: pos.y - 1 };
      case 'S': return { x: pos.x, y: pos.y + 1 };
      case 'E': return { x: pos.x + 1, y: pos.y };
      case 'W': return { x: pos.x - 1, y: pos.y };
    }
  };

  const rotate = (dir: Direction, turn: 'LEFT' | 'RIGHT'): Direction => {
    const dirs: Direction[] = ['N', 'E', 'S', 'W'];
    const idx = dirs.indexOf(dir);
    return turn === 'RIGHT' ? dirs[(idx + 1) % 4] : dirs[(idx + 3) % 4];
  };

  const isBlocked = (pos: Position): boolean => {
    if (pos.x < 0 || pos.x >= level.gridSize.cols || pos.y < 0 || pos.y >= level.gridSize.rows) return true;
    return level.obstacles.some(o => o.x === pos.x && o.y === pos.y);
  };

  const checkWin = async (pos: Position) => {
    if (pos.x === level.goal.x && pos.y === level.goal.y) {
      setGameStatus('won');
      const lines = code.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('#')).length;
      const earnedStars = lines <= level.bestLineCount ? 3 : lines <= level.bestLineCount + 2 ? 2 : 1;
      setStars(earnedStars);
      try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } }); } catch (e) {}
    } else {
      setGameStatus('lost');
    }
  };

  const instructionsUsed = code.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('#')).length;
  const maxInstr = level.maxInstructions || 10;

  return (
    <div className="min-h-screen bg-[#f2f8f9] text-slate-900 font-sans flex flex-col relative overflow-hidden pt-20">
       
       {/* Décoration d'arrière plan */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 15L60 30L30 45L0 30z\' fill=\'none\' stroke=\'%23457b7b\' stroke-width=\'2\'/%3E%3C/svg%3E")', backgroundSize: '80px 80px' }}>
       </div>

       {/* En-tête Global */}
       <header className="w-full flex items-center justify-between px-8 py-4 bg-transparent absolute top-0 z-50">
          <nav className="hidden md:flex items-center gap-8 font-bold text-slate-600 text-sm tracking-widest">
            <a href="#" className="text-teal-800 border-b-[3px] border-teal-800 pb-1">NIVEAUX</a>
            <a href="#" className="hover:text-teal-800 transition-colors pb-1 border-b-[3px] border-transparent">PROGRÈS</a>
            <a href="#" className="hover:text-teal-800 transition-colors pb-1 border-b-[3px] border-transparent">AIDE</a>
          </nav>
       </header>

       {/* Contenu Principal */}
       <main className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 p-6 z-10">
          
          {/* COLONNE GAUCHE: Éditeur et Instructions */}
          <div className="w-full lg:w-[420px] flex flex-col gap-5">
             
             {/* Éditeur de Code */}
             <div className="bg-[#282a36] rounded-xl shadow-xl overflow-hidden flex flex-col h-[350px] border border-[#1e1e24]">
                <div className="px-5 py-4 bg-[#1e1e24] flex justify-between items-center text-white">
                    <h2 className="text-sm font-bold tracking-widest text-slate-200 uppercase">DÉFI {level.id} : {level.title.split('. ')[1]}</h2>
                    <button onClick={() => resetLevel(level)} className="text-slate-400 hover:text-white transition-colors" title="Réinitialiser le code">
                        <RotateCcw size={16} />
                    </button>
                </div>
                <div className="flex-1 relative pt-2">
                    <Editor
                        height="100%"
                        defaultLanguage="python"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || '')}
                        options={{ 
                          fontSize: 14, 
                          minimap: { enabled: false }, 
                          scrollBeyondLastLine: false, 
                          padding: { top: 16 }, 
                          fontFamily: 'monospace',
                          lineNumbersMinChars: 3
                        }}
                    />
                </div>
             </div>

             {/* Panneau d'Instructions */}
             <div className="bg-white rounded-xl shadow-lg flex flex-col overflow-hidden">
                <div className="px-5 py-4 flex justify-between items-center bg-slate-50 border-b border-slate-100 cursor-default">
                  <h3 className="text-sm font-bold text-slate-800 tracking-widest">INSTRUCTIONS</h3>
                  <ChevronUp className="text-slate-400" size={20} />
                </div>
                
                <div className="px-5 pt-5 pb-5 flex flex-col gap-6">
                  {/* Liste des commandes */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 w-7 flex justify-center">
                        <FoxLogo className="w-7 h-7 drop-shadow-sm" />
                      </div>
                      <div>
                        <code className="text-[13px] font-bold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">avancer()</code>
                        <p className="text-[13px] text-slate-500 mt-1">Déplace le renard d'une case</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 w-7 flex justify-center">
                        <RotateCcw className="text-[#457b7b]" size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <code className="text-[13px] font-bold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">tourner(direction)</code>
                        <p className="text-[13px] text-slate-500 mt-1">Oriente le renard ('gauche' ou 'droite')</p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton Exécuter */}
                  <button 
                    onClick={handleRun} 
                    disabled={isRunning || !isPyodideReady} 
                    className="w-full mt-2 bg-[#457b7b] hover:bg-[#366262] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3.5 rounded-lg font-bold text-sm tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Play size={18} fill="currentColor" />
                    {isRunning ? 'EXÉCUTION...' : 'EXÉCUTER LE CODE'}
                  </button>

                  {/* Zone de Logs (si erreur) */}
                  {logs.length > 0 && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-mono border border-red-100 mt-[-8px]">
                      {logs.map((log, i) => <div key={i}>{log}</div>)}
                    </div>
                  )}
                </div>
             </div>

          </div>

          {/* COLONNE DROITE: Rendu Isométrique et Statut */}
          <div className="flex-1 flex flex-col gap-4">
              
              {/* Conteneur de la map (Bleu clair comme la mer) */}
              <div className="flex-1 bg-[#dff0f6] rounded-xl shadow-lg relative overflow-hidden flex items-center justify-center min-h-[400px]">
                  
                  {/* Navigation Niveaux (Superposée, subtile) */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between z-10 pointer-events-none">
                      <button onClick={() => setCurrentLevelId(prev => Math.max(1, prev - 1))} disabled={currentLevelId === 1} className="pointer-events-auto w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full shadow text-slate-700 flex items-center justify-center hover:bg-white transition disabled:opacity-50"><ChevronLeft /></button>
                      <button onClick={() => setCurrentLevelId(prev => Math.min(LEVELS.length, prev + 1))} disabled={currentLevelId === LEVELS.length} className="pointer-events-auto w-10 h-10 bg-white/60 backdrop-blur-sm rounded-full shadow text-slate-700 flex items-center justify-center hover:bg-white transition disabled:opacity-50"><ChevronRight /></button>
                  </div>

                  {/* Grille Isométrique */}
                  <IsoGrid level={level} foxPos={foxPos} foxDir={foxDir} />
                  
                  {/* Message de victoire superposé */}
                  {gameStatus === 'won' && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50 animate-in fade-in duration-300">
                      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center transform scale-100 animate-in zoom-in duration-500">
                        <div className="text-4xl mb-4">🏆</div>
                        <h2 className="text-2xl font-black text-slate-800 mb-2">Niveau Complété !</h2>
                        <div className="flex justify-center gap-2 text-3xl mb-6">
                            {[1,2,3].map(i => <span key={i} className={i <= stars ? 'grayscale-0 drop-shadow-md' : 'grayscale opacity-30'}>⭐</span>)}
                        </div>
                        <button 
                          onClick={() => setCurrentLevelId(prev => Math.min(LEVELS.length, prev + 1))}
                          className="bg-[#457b7b] hover:bg-[#366262] text-white px-8 py-3 rounded-lg font-bold tracking-wider transition-colors"
                        >
                          NIVEAU SUIVANT
                        </button>
                      </div>
                    </div>
                  )}
              </div>

              {/* Barre de Statut (Footer) */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[13px] font-bold text-slate-600 uppercase tracking-wider">
                  <div>NIVEAU {level.id} : {level.title.split('. ')[1]}</div>
                  <div className="flex gap-8 mt-3 sm:mt-0">
                      <div>COMMANDES RESTANTES: {Math.max(0, maxInstr - instructionsUsed)}/{maxInstr}</div>
                      <div>TRÉSORS TROUVÉS: {gameStatus === 'won' ? '1' : '0'}</div>
                  </div>
              </div>
              
          </div>

       </main>
    </div>
  );
}
