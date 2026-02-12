
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, HelpCircle, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LEVELS, LevelConfig, Direction, Position } from './levels';

// --- GAME CONSTANTS ---
const CELL_SIZE = 60;

// --- ASSETS (Using emojis for MVP, can be replaced by images) ---
const SPRITES = {
  FOX: '🦊',
  GOAL: '🐔', // Chicken!
  OBSTACLE: '🪨',
  EMPTY: '',
  GRASS: '🟩'
};

import { loader } from '@monaco-editor/react';

// Configure Monaco to use local files instead of CDN to prevent loading errors
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs'
  }
});

export default function FoxGame() {
  // Game State
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [level, setLevel] = useState<LevelConfig>(LEVELS[0]);
  
  // Player State
  const [foxPos, setFoxPos] = useState<Position>({ x: 0, y: 0 });
  const [foxDir, setFoxDir] = useState<Direction>('E');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [stars, setStars] = useState<number>(0);
  const [code, setCode] = useState('');

  // Pyodide
  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false); // Prevent double loading
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  // Init Level
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

  // Load Pyodide
  useEffect(() => {
    if (isPyodideReady || pyodideLoadingRef.current) return;
    
    pyodideLoadingRef.current = true;

    const initPyodide = async () => {
      try {
        if (!window.loadPyodide) {
             throw new Error("window.loadPyodide is not defined (Script load failed?)");
        }
        
        // Explicitly provide indexURL to avoid auto-detection issues
        // @ts-ignore
        const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/"
        });
        
        pyodideRef.current = pyodide;
        setIsPyodideReady(true);
        console.log("Pyodide Ready for Fox Game");
        setLogs(prev => [...prev, "✅ Moteur Python prêt !"]);
      } catch (e) {
        let msg = "Erreur inconnue";
        if (typeof e === 'string') msg = e;
        else if (e && (e as any).message) msg = (e as any).message;
        
        console.error("Pyodide Load Error (Safe):", msg);
        setLogs(prev => [...prev, `❌ Erreur d'initialisation Python: ${msg}`]);
        pyodideLoadingRef.current = false; // Allow retry?
      }
    };

    const loadPyodideScript = () => {
      // Check if already loaded by another component
      if (window.loadPyodide) {
         initPyodide();
         return;
      }
      
      // Check if script tag exists
      const existingScript = document.querySelector('script[src*="pyodide.js"]');
      if (existingScript) {
          existingScript.addEventListener('load', () => initPyodide());
          return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = () => initPyodide();
      script.onerror = (e) => {
        console.error("Failed to load Pyodide script (Network/404)");
        setLogs(prev => [...prev, "❌ Erreur critique : Impossible de charger le moteur Python (Pyodide). Vérifiez votre connexion internet."]);
        pyodideLoadingRef.current = false;
      };
      document.body.appendChild(script);
    };

    loadPyodideScript();
  }, [isPyodideReady]);

  // --- EXECUTION LOGIC ---
  const handleRun = async () => {
    if (!pyodideRef.current || isRunning) return;
    
    setIsRunning(true);
    setGameStatus('playing');
    setLogs(['> Analyse du code...']);
    
    // Reset position visually before run? No, let's reset to start
    setFoxPos(level.start.pos);
    setFoxDir(level.start.dir);

    try {
      // 1. Setup Python Environment
      // We pass the grid and obstacles to Python so it can simulate "mur_devant()"
      // Note: This is a simplified simulation. The Python code runs instantly,
      // so it tracks a virtual position to answer "mur_devant()".

      const gridSizeJson = JSON.stringify(level.gridSize);
      const obstaclesJson = JSON.stringify(level.obstacles);
      const startPosJson = JSON.stringify(level.start.pos);
      const startDirJson = JSON.stringify(level.start.dir);
      const goalPosJson = JSON.stringify(level.goal);

      const pythonBridge = `
import js
import json

# Game State Simulation
grid_size = json.loads('${gridSizeJson}')
obstacles = json.loads('${obstaclesJson}')
current_pos = json.loads('${startPosJson}')
current_dir = json.loads('${startDirJson}') # "N", "E", "S", "W"
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
    # Grid boundaries
    if pos['x'] < 0 or pos['x'] >= grid_size['cols'] or pos['y'] < 0 or pos['y'] >= grid_size['rows']:
        return True
    # Obstacles
    for obs in obstacles:
        if obs['x'] == pos['x'] and obs['y'] == pos['y']:
            return True
    return False

# --- SENSORS ---

def mur_devant():
    next_p = get_next_pos(current_pos, current_dir)
    return is_blocked(next_p)

def mur_droite():
    dirs = ['N', 'E', 'S', 'W']
    idx = dirs.index(current_dir)
    right_dir = dirs[(idx + 1) % 4]
    next_p = get_next_pos(current_pos, right_dir)
    return is_blocked(next_p)

def mur_gauche():
    dirs = ['N', 'E', 'S', 'W']
    idx = dirs.index(current_dir)
    left_dir = dirs[(idx + 3) % 4]
    next_p = get_next_pos(current_pos, left_dir)
    return is_blocked(next_p)

def sur_objectif():
    return current_pos['x'] == goal_pos['x'] and current_pos['y'] == goal_pos['y']

# --- ACTIONS ---

def avancer():
    global current_pos
    # Check physical move for simulation state
    next_p = get_next_pos(current_pos, current_dir)
    if not is_blocked(next_p):
        current_pos = next_p
    actions_queue.append("MOVE")

def tourner_gauche():
    global current_dir
    dirs = ['N', 'E', 'S', 'W']
    idx = dirs.index(current_dir)
    current_dir = dirs[(idx + 3) % 4]
    actions_queue.append("TURN_LEFT")

def tourner_droite():
    global current_dir
    dirs = ['N', 'E', 'S', 'W']
    idx = dirs.index(current_dir)
    current_dir = dirs[(idx + 1) % 4]
    actions_queue.append("TURN_RIGHT")

# Aliases
def av(): avancer()
def tg(): tourner_gauche()
def td(): tourner_droite()
      `;

      await pyodideRef.current.runPythonAsync(pythonBridge);
      
      // 2. Run User Code
      await pyodideRef.current.runPythonAsync(code);
      
      // 3. Retrieve Actions
      const actionsProxy = pyodideRef.current.globals.get('actions_queue');
      let actions: string[] = [];
      if (actionsProxy) {
        actions = actionsProxy.toJs();
        actionsProxy.destroy();
      }

      setLogs(prev => [...prev, `> ${actions.length} actions générées.`]);

      // 4. Execute Animation
      await animateActions(actions);

    } catch (e: any) {
      // Avoid logging the raw Pyodide error object as it confuses Next.js error overlay
      // console.error("Game Execution Error:", e);
      
      // Safe error message extraction
      let msg = "Une erreur inconnue est survenue.";
      if (typeof e === 'string') msg = e;
      else if (e && e.message) msg = e.message;
      else if (e && e.toString) msg = e.toString();
      
      console.error("Game Exec Error (String):", msg);

      setLogs(prev => [...prev, `❌ Erreur: ${msg}`]);
      setGameStatus('lost');
    } finally {
      setIsRunning(false);
    }
  };

  const animateActions = async (actions: string[]) => {
    // Clone state for simulation
    let currentPos = { ...level.start.pos };
    let currentDir = level.start.dir;
    
    // Helper to sleep
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      await wait(500); // Animation speed

      if (action === "MOVE") {
        const nextPos = getNextPos(currentPos, currentDir);
        
        // Check collision (Wall or Obstacle)
        if (isBlocked(nextPos)) {
            setLogs(prev => [...prev, `⚠️ Aïe ! Mur ou obstacle en (${nextPos.x}, ${nextPos.y})`]);
            setGameStatus('lost');
            // setIsRunning(false); // Handled in finally block
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

    // End of actions
    await wait(200);
    await checkWin(currentPos);
    // setIsRunning(false); // Handled in finally block of handleRun
  };

  // --- HELPERS ---
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
    if (turn === 'RIGHT') return dirs[(idx + 1) % 4];
    return dirs[(idx + 3) % 4]; // +3 is same as -1 in mod 4
  };

  const isBlocked = (pos: Position): boolean => {
    // 1. Grid Boundaries
    if (pos.x < 0 || pos.x >= level.gridSize.cols || pos.y < 0 || pos.y >= level.gridSize.rows) return true;
    
    // 2. Obstacles
    if (level.obstacles.some(o => o.x === pos.x && o.y === pos.y)) return true;
    
    return false;
  };

  const countEffectiveLines = (src: string): number => {
    return src
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'))
      .length;
  };

  const checkWin = async (pos: Position) => {
    if (pos.x === level.goal.x && pos.y === level.goal.y) {
      setGameStatus('won');
      
      const lines = countEffectiveLines(code);
      let earnedStars = 1;
      if (lines <= level.bestLineCount) earnedStars = 3;
      else if (lines <= level.bestLineCount + 2) earnedStars = 2;
      
      setStars(earnedStars);

      setLogs(prev => [
              ...prev, 
              '🎉 BRAVO! Tu as attrapé la poule!',
              `📊 Code : ${lines} lignes (Objectif : ${level.bestLineCount})`,
              `⭐ Note : ${earnedStars}/3`
            ]);
            
            try {
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } catch (e) {
              console.warn("Confetti failed", e);
            }
          } else {
      setGameStatus('lost');
      setLogs(prev => [...prev, '❌ Perdu... Le renard n\'est pas arrivé à destination.']);
    }
  };

  // --- RENDER HELPERS ---
  const getRotationStyle = (dir: Direction) => {
    switch(dir) {
      case 'N': return 'rotate(-90deg)';
      case 'E': return 'rotate(0deg)';
      case 'S': return 'rotate(90deg)';
      case 'W': return 'rotate(180deg)';
      default: return 'rotate(0deg)';
    }
  };

  return (
    <div className="flex h-screen bg-amber-50 font-sans overflow-hidden">
        {/* LEFT: GAME VIEW */}
        <div className="w-1/2 flex flex-col items-center justify-center p-8 border-r border-amber-200 bg-[url('/pattern-forest.png')] relative">
            
            {/* Header Level */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-orange-700 mb-1 flex items-center gap-2">
                        🦊 L'Académie des Renards
                    </h1>
                    <h2 className="text-xl font-bold text-orange-900">{level.id}. {level.title}</h2>
                    <p className="text-orange-800/80 max-w-md mt-2">{level.description}</p>
                </div>
                <div className="flex gap-2">
                     <button 
                        onClick={() => setCurrentLevelId(Math.max(1, currentLevelId - 1))}
                        className="p-2 rounded-full bg-white shadow-sm hover:bg-orange-100 text-orange-600 disabled:opacity-50"
                        disabled={currentLevelId === 1}
                     >
                        <ChevronLeft />
                     </button>
                     <button 
                        onClick={() => setCurrentLevelId(Math.min(LEVELS.length, currentLevelId + 1))}
                        className="p-2 rounded-full bg-white shadow-sm hover:bg-orange-100 text-orange-600 disabled:opacity-50"
                        disabled={currentLevelId === LEVELS.length}
                     >
                        <ChevronRight />
                     </button>
                </div>
            </div>

            {/* GRID */}
            <div 
                className="relative bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl border-4 border-orange-200"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${level.gridSize.cols}, ${CELL_SIZE}px)`,
                    gridTemplateRows: `repeat(${level.gridSize.rows}, ${CELL_SIZE}px)`,
                    gap: '4px'
                }}
            >
                {Array.from({ length: level.gridSize.rows * level.gridSize.cols }).map((_, idx) => {
                    const x = idx % level.gridSize.cols;
                    const y = Math.floor(idx / level.gridSize.cols);
                    const isObstacle = level.obstacles.some(o => o.x === x && o.y === y);
                    const isGoal = level.goal.x === x && level.goal.y === y;
                    
                    return (
                        <div key={idx} className={`
                            w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] 
                            rounded-lg flex items-center justify-center text-3xl
                            ${isObstacle ? 'bg-stone-200' : 'bg-emerald-100'}
                            border-2 ${isObstacle ? 'border-stone-300' : 'border-emerald-200'}
                        `}>
                            {isObstacle && SPRITES.OBSTACLE}
                            {isGoal && SPRITES.GOAL}
                        </div>
                    );
                })}

                {/* PLAYER SPRITE (Absolute positioning over grid) */}
                <div 
                    className="absolute transition-all duration-500 ease-in-out flex items-center justify-center text-4xl z-10"
                    style={{
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                        left: 16 + (foxPos.x * (CELL_SIZE + 4)), // 16 is padding, 4 is gap
                        top: 16 + (foxPos.y * (CELL_SIZE + 4)),
                        transform: getRotationStyle(foxDir)
                    }}
                >
                    {SPRITES.FOX}
                </div>
            </div>
            
            {/* Legend / Status */}
            <div className="mt-8 flex gap-4 items-center">
                <div className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 ${
                    gameStatus === 'won' ? 'bg-green-100 text-green-700' :
                    gameStatus === 'lost' ? 'bg-red-100 text-red-700' :
                    'bg-white text-slate-500'
                }`}>
                    {gameStatus === 'won' && (
                        <>
                            <span>🎉 Niveau réussi !</span>
                            <div className="flex">
                                {[1,2,3].map(i => (
                                    <span key={i} className={`text-xl ${i <= stars ? 'grayscale-0' : 'grayscale opacity-30'}`}>⭐</span>
                                ))}
                            </div>
                        </>
                    )}
                    {gameStatus === 'lost' && "💀 Essaye encore..."}
                    {gameStatus === 'playing' && "🏃‍♂️ En cours..."}
                    {gameStatus === 'idle' && "En attente"}
                </div>
            </div>

        </div>

        {/* RIGHT: EDITOR */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e] border-l border-slate-700">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
                    <span>mission.py</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => resetLevel(level)}
                        className="p-2 hover:bg-[#3e3e3e] rounded text-slate-400"
                        title="Réinitialiser"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <button
                        onClick={handleRun}
                        disabled={isRunning || !isPyodideReady}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                            isRunning 
                            ? 'bg-slate-600 text-slate-400 cursor-wait'
                            : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20'
                        }`}
                    >
                        <Play size={16} fill="currentColor" />
                        {isRunning ? '...' : 'Exécuter'}
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark" // We can reuse 'orange-dark' if defined globally or re-define
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                        fontSize: 16,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        roundedSelection: false,
                        padding: { top: 20 }
                    }}
                />
            </div>

            {/* Console */}
            <div className="h-48 bg-[#151515] border-t border-[#3e3e3e] flex flex-col">
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#3e3e3e] flex justify-between">
                    <span>Journal de bord</span>
                    {level.hint && <span className="text-orange-400 flex items-center gap-1"><HelpCircle size={12}/> Indice disponible</span>}
                </div>
                <div className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-y-auto space-y-1">
                    {logs.length === 0 && <div className="text-slate-600 italic">Prêt à partir...</div>}
                    {logs.map((log, i) => (
                        <div key={i} className="border-b border-transparent hover:border-[#333]">{log}</div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}
