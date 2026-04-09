'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Play, RotateCcw, ChevronRight, ChevronLeft, ChevronUp, HelpCircle } from 'lucide-react';
import { LEVELS, LevelConfig, Direction, Position } from './levels';
import Image from 'next/image';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-[#1f2230]" />,
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

type AllowedCommand = { code: string; description: string };
type HelpTab = 'guide' | 'memo';
type CommandTab = 'deplacements' | 'logique' | 'avance';
type ObstacleKind = 'rock' | 'bush' | 'log';

type SavedProgress = {
  resumeCode: string;
  levelId: number;
  codeByLevel: Record<number, string>;
  attemptsByLevel: Record<number, number>;
  totalRuns: number;
  updatedAt: number;
};

type RuntimeVariant = {
  obstacles: Position[];
  obstacleKinds: Record<string, ObstacleKind>;
  goal: Position;
  signalWord: 'gauche' | 'droite';
  measureValue: number;
};

const STORAGE_PREFIX = 'foxtest-progress-v1';

const generateResumeCode = () => {
  if (typeof window === 'undefined' || !window.crypto) {
    return `FOX-${Date.now().toString(36).toUpperCase()}`;
  }
  const bytes = new Uint8Array(4);
  window.crypto.getRandomValues(bytes);
  const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `FOX-${raw.toUpperCase()}`;
};

const normalizePythonError = (errorMessage: string): string => {
  const msg = (errorMessage || '').toLowerCase();
  if (msg.includes('syntaxerror')) {
    return "❌ Syntaxe invalide. Vérifie les parenthèses, les deux-points ':' et l'indentation.";
  }
  if (msg.includes('indentationerror') || msg.includes('expected an indented block')) {
    return "❌ Problème d'indentation. Après `for`, `while`, `if`, `else` ou `def`, il faut un bloc indenté.";
  }
  if (msg.includes('nameerror')) {
    return "❌ Nom inconnu. Vérifie l'orthographe des fonctions (`avancer`, `tourner_gauche`, etc.) et des variables.";
  }
  if (msg.includes('typeerror')) {
    return "❌ Type de donnée inattendu. Vérifie les paramètres passés à tes fonctions.";
  }
  if (msg.includes('while true') || msg.includes('maximum recursion depth exceeded')) {
    return "❌ Ton programme semble bloquer (boucle infinie ou récursion). Ajoute une condition d'arrêt.";
  }
  return `❌ Erreur Python : ${errorMessage}`;
};

const getAllowedCommands = (levelId: number): AllowedCommand[] => {
  const base: AllowedCommand[] = [
    { code: 'avancer()', description: "Déplace le renard d'une case" },
    { code: 'tourner_gauche()', description: 'Tourne le renard vers la gauche' },
    { code: 'tourner_droite()', description: 'Tourne le renard vers la droite' },
  ];

  if (levelId >= 11) {
    base.push(
      { code: 'mur_devant()', description: 'Renvoie vrai si un mur est devant' },
      { code: 'mur_gauche()', description: 'Renvoie vrai si un mur est à gauche' },
      { code: 'mur_droite()', description: 'Renvoie vrai si un mur est à droite' },
      { code: 'sur_objectif()', description: "Renvoie vrai si le renard est sur l'objectif" },
      { code: 'while / if / else', description: 'Boucles et conditions autorisées' }
    );
  }

  if (levelId >= 16) {
    base.push({ code: 'def ma_fonction():', description: 'Définition de fonctions autorisée' });
  }
  if (levelId >= 21) {
    base.push(
      { code: 'obstacle_devant()', description: "Vrai si un obstacle est devant" },
      { code: 'hauteur_devant()', description: "Donne une hauteur (0, 1 ou 2)" },
      { code: 'lire_balise()', description: "Renvoie 'gauche' ou 'droite'" },
      { code: 'bondir()', description: 'Saute par-dessus un obstacle' },
      { code: 'casser_obstacle()', description: 'Retire un buisson ou un tronc devant toi' },
    );
  }

  return base;
};

const getCommandsForTab = (commands: AllowedCommand[], tab: CommandTab): AllowedCommand[] => {
  if (tab === 'deplacements') {
    return commands.filter((c) =>
      ['avancer()', 'tourner_gauche()', 'tourner_droite()'].includes(c.code)
    );
  }
  if (tab === 'logique') {
    return commands.filter((c) =>
      ['mur_devant()', 'mur_gauche()', 'mur_droite()', 'sur_objectif()', 'while / if / else', 'def ma_fonction():', 'obstacle_devant()', 'hauteur_devant()', 'lire_balise()'].includes(c.code)
    );
  }
  return commands.filter((c) =>
    ['bondir()', 'casser_obstacle()'].includes(c.code)
  );
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const posKey = (p: Position) => `${p.x},${p.y}`;

const createRuntimeVariant = (lvl: LevelConfig): RuntimeVariant => {
  const seedBase = Date.now() + lvl.id * 97;
  const obstacles: Position[] = [];

  if (!lvl.randomize) {
    return {
      obstacles: lvl.obstacles,
      obstacleKinds: Object.fromEntries(lvl.obstacles.map((o) => [posKey(o), 'rock' as ObstacleKind])),
      goal: lvl.goal,
      signalWord: 'gauche',
      measureValue: 1,
    };
  }

  if (lvl.id === 21) {
    const positions = [2, 4, 6];
    positions.forEach((x, idx) => {
      const dice = seededRandom(seedBase + idx);
      if (dice > 0.33) obstacles.push({ x, y: 0 });
    });
  } else if (lvl.id === 22) {
    const middleRow = 2;
    for (let x = 1; x < 6; x++) {
      if (x % 2 === 1) {
        const y = seededRandom(seedBase + x) > 0.5 ? middleRow - 1 : middleRow + 1;
        obstacles.push({ x, y });
      }
    }
  } else if (lvl.id === 23) {
    for (let x = 1; x < 8; x++) {
      if (seededRandom(seedBase + x * 3) > 0.45) obstacles.push({ x, y: 0 });
    }
  } else if (lvl.id === 24) {
    for (let y = 1; y < 5; y++) {
      for (let x = 1; x < 7; x++) {
        const r = seededRandom(seedBase + x * 11 + y * 17);
        if (r > 0.84) obstacles.push({ x, y });
      }
    }
  }

  const signalWord: 'gauche' | 'droite' = seededRandom(seedBase + 401) > 0.5 ? 'gauche' : 'droite';
  const measureValue = 1 + Math.floor(seededRandom(seedBase + 701) * 2);
  const obstacleKinds: Record<string, ObstacleKind> = {};
  obstacles.forEach((obs, idx) => {
    const roll = seededRandom(seedBase + 901 + idx);
    obstacleKinds[posKey(obs)] = roll > 0.55 ? 'rock' : roll > 0.25 ? 'bush' : 'log';
  });
  return { obstacles, obstacleKinds, goal: lvl.goal, signalWord, measureValue };
};

const stripCommandHeader = (rawCode: string): string => {
  if (!rawCode) return '';
  return rawCode
    .replace(/^# --- Commandes disponibles ---[\s\S]*?# -----------------------------\n*/m, '')
    .trimStart();
};

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

const BushBlock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-[141.4%] h-[188.5%] absolute" style={{
    left: '-20.7%',
    top: '-43%',
    transform: 'translateZ(10px) rotateZ(45deg) rotateX(-60deg)',
    transformStyle: 'preserve-3d'
  }}>
    <ellipse cx="64" cy="96" rx="40" ry="16" fill="#1e293b" opacity="0.16" />
    <ellipse cx="64" cy="78" rx="34" ry="22" fill="#65a30d" />
    <ellipse cx="48" cy="68" rx="20" ry="16" fill="#84cc16" />
    <ellipse cx="80" cy="68" rx="20" ry="16" fill="#84cc16" />
    <ellipse cx="64" cy="60" rx="18" ry="14" fill="#a3e635" />
    <line x1="52" y1="84" x2="46" y2="92" stroke="#4d7c0f" strokeWidth="3" strokeLinecap="round" />
    <line x1="74" y1="84" x2="80" y2="92" stroke="#4d7c0f" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const LogBlock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="w-[141.4%] h-[188.5%] absolute" style={{
    left: '-20.7%',
    top: '-43%',
    transform: 'translateZ(10px) rotateZ(45deg) rotateX(-60deg)',
    transformStyle: 'preserve-3d'
  }}>
    <ellipse cx="64" cy="94" rx="36" ry="14" fill="#1e293b" opacity="0.16" />
    <ellipse cx="38" cy="72" rx="12" ry="18" fill="#7c2d12" />
    <ellipse cx="90" cy="72" rx="12" ry="18" fill="#7c2d12" />
    <rect x="38" y="54" width="52" height="36" rx="16" fill="#92400e" />
    <line x1="48" y1="58" x2="48" y2="88" stroke="#7c2d12" strokeWidth="3" />
    <line x1="62" y1="56" x2="62" y2="90" stroke="#7c2d12" strokeWidth="3" />
    <line x1="76" y1="58" x2="76" y2="88" stroke="#7c2d12" strokeWidth="3" />
    <circle cx="38" cy="72" r="4" fill="#fbbf24" opacity="0.45" />
  </svg>
);

const IsoGrid = ({
  level,
  foxPos,
  foxDir,
  obstacleKinds,
}: {
  level: LevelConfig;
  foxPos: Position;
  foxDir: Direction;
  obstacleKinds: Record<string, ObstacleKind>;
}) => {
    const MAX_GRID_DIM = Math.max(level.gridSize.cols, level.gridSize.rows);
    const CELL_SIZE = Math.min(64, 400 / MAX_GRID_DIM); 
    const obstacleSet = useMemo(
      () => new Set(level.obstacles.map((o) => `${o.x},${o.y}`)),
      [level.obstacles]
    );
    const totalCells = level.gridSize.rows * level.gridSize.cols;
    
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
                {Array.from({ length: totalCells }).map((_, idx) => {
                    const x = idx % level.gridSize.cols;
                    const y = Math.floor(idx / level.gridSize.cols);
                    const isObstacle = obstacleSet.has(`${x},${y}`);
                    const isGoal = level.goal.x === x && level.goal.y === y;

                    return (
                        <div key={idx} className="relative" style={{ width: CELL_SIZE, height: CELL_SIZE, transformStyle: 'preserve-3d' }}>
                            {/* Sol de base (SVG) */}
                            <GroundBlock />

                            {/* Obstacle (Rocher SVG de la maquette) */}
                            {isObstacle && (
                                obstacleKinds[`${x},${y}`] === 'log'
                                  ? <LogBlock />
                                  : obstacleKinds[`${x},${y}`] === 'bush'
                                    ? <BushBlock />
                                    : <RockBlock />
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
  const [resumeCode, setResumeCode] = useState('');
  const [resumeInput, setResumeInput] = useState('');
  const [loadStatus, setLoadStatus] = useState('');
  const [helpTab, setHelpTab] = useState<HelpTab>('guide');
  const [commandTab, setCommandTab] = useState<CommandTab>('deplacements');
  const [attemptsByLevel, setAttemptsByLevel] = useState<Record<number, number>>({});
  const [totalRuns, setTotalRuns] = useState(0);
  const [runtimeVariantByLevel, setRuntimeVariantByLevel] = useState<Record<number, RuntimeVariant>>({});

  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const hydratingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const created = generateResumeCode();
    setResumeCode(created);
    setResumeInput(created);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !resumeCode) return;
    const storageKey = `${STORAGE_PREFIX}-${resumeCode}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;

    try {
      hydratingRef.current = true;
      const data: SavedProgress = JSON.parse(raw);
      if (data.levelId && LEVELS.some((l) => l.id === data.levelId)) {
        setCurrentLevelId(data.levelId);
      }
      setAttemptsByLevel(data.attemptsByLevel || {});
      setTotalRuns(data.totalRuns || 0);
      setCode(data.codeByLevel?.[data.levelId || 1] || '');
      setLoadStatus('Progression chargée automatiquement.');
    } catch {
      setLoadStatus('Code de reprise invalide ou données corrompues.');
    } finally {
      setTimeout(() => {
        hydratingRef.current = false;
      }, 0);
    }
  }, [resumeCode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !resumeCode || hydratingRef.current) return;
    const storageKey = `${STORAGE_PREFIX}-${resumeCode}`;
    const raw = localStorage.getItem(storageKey);
    let previous: SavedProgress = {
      resumeCode,
      levelId: currentLevelId,
      codeByLevel: {},
      attemptsByLevel: {},
      totalRuns: 0,
      updatedAt: Date.now(),
    };

    if (raw) {
      try {
        previous = JSON.parse(raw);
      } catch {
        // Si le localStorage est corrompu, on repart sur une base propre.
        previous = {
          resumeCode,
          levelId: currentLevelId,
          codeByLevel: {},
          attemptsByLevel: {},
          totalRuns: 0,
          updatedAt: Date.now(),
        };
      }
    }

    const next: SavedProgress = {
      ...previous,
      resumeCode,
      levelId: currentLevelId,
      codeByLevel: { ...previous.codeByLevel, [currentLevelId]: code },
      attemptsByLevel,
      totalRuns,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Echec silencieux (quota/cookie policy) sans bloquer le jeu.
    }
  }, [resumeCode, currentLevelId, code, attemptsByLevel, totalRuns]);

  useEffect(() => {
    const lvl = LEVELS.find(l => l.id === currentLevelId) || LEVELS[0];
    setLevel(lvl);
    setRuntimeVariantByLevel(prev => {
      if (prev[lvl.id]) return prev;
      return { ...prev, [lvl.id]: createRuntimeVariant(lvl) };
    });
    resetLevel(lvl);
  }, [currentLevelId]);

  const runtimeVariant = runtimeVariantByLevel[level.id] || {
    obstacles: level.obstacles,
    obstacleKinds: Object.fromEntries(level.obstacles.map((o) => [posKey(o), 'rock' as ObstacleKind])),
    goal: level.goal,
    signalWord: 'gauche' as const,
    measureValue: 1,
  };
  const runtimeObstacles = level.randomize ? runtimeVariant.obstacles : level.obstacles;
  const runtimeObstacleKinds = level.randomize
    ? runtimeVariant.obstacleKinds
    : Object.fromEntries(level.obstacles.map((o) => [posKey(o), 'rock' as ObstacleKind]));
  const runtimeGoal = level.randomize ? runtimeVariant.goal : level.goal;
  const renderLevel = { ...level, obstacles: runtimeObstacles, goal: runtimeGoal };

  const resetLevel = (lvl: LevelConfig) => {
    if (lvl.randomize) {
      setRuntimeVariantByLevel(prev => ({ ...prev, [lvl.id]: createRuntimeVariant(lvl) }));
    }
    setFoxPos(lvl.start.pos);
    setFoxDir(lvl.start.dir);
    setGameStatus('idle');
    setStars(0);
    setLogs([]);
    const defaultCode = stripCommandHeader(lvl.initialCode || '');
    if (typeof window !== 'undefined' && resumeCode) {
      const storageKey = `${STORAGE_PREFIX}-${resumeCode}`;
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const data: SavedProgress = JSON.parse(raw);
          setCode(data.codeByLevel?.[lvl.id] || defaultCode);
          return;
        } catch {}
      }
    }
    setCode(defaultCode);
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
    setAttemptsByLevel(prev => ({ ...prev, [level.id]: (prev[level.id] || 0) + 1 }));
    setTotalRuns(prev => prev + 1);

    try {
      const gridSizeJson = JSON.stringify(level.gridSize);
      const obstaclesJson = JSON.stringify(runtimeObstacles);
      const destructibleJson = JSON.stringify(
        runtimeObstacles.filter((o) => runtimeObstacleKinds[posKey(o)] !== 'rock')
      );
      const startPosJson = JSON.stringify(level.start.pos);
      const startDirJson = JSON.stringify(level.start.dir);
      const goalPosJson = JSON.stringify(runtimeGoal);
      const signalWordJson = JSON.stringify(runtimeVariant.signalWord);
      const measureValueJson = JSON.stringify(runtimeVariant.measureValue);

      const pythonBridge = `
import js
import json

grid_size = json.loads('${gridSizeJson}')
obstacles = json.loads('${obstaclesJson}')
destructible_positions = json.loads('${destructibleJson}')
current_pos = json.loads('${startPosJson}')
current_dir = json.loads('${startDirJson}')
goal_pos = json.loads('${goalPosJson}')
signal_word = json.loads('${signalWordJson}')
measure_value = json.loads('${measureValueJson}')
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
def obstacle_devant(): return mur_devant()
def hauteur_devant(): return measure_value
def lire_balise(): return signal_word

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

def bondir():
    global current_pos
    next_p = get_next_pos(current_pos, current_dir)
    if is_blocked(next_p):
        landing = get_next_pos(next_p, current_dir)
        if not is_blocked(landing):
            current_pos = landing
    elif not is_blocked(next_p):
        current_pos = next_p
    actions_queue.append("JUMP")

def casser_obstacle():
    global obstacles
    next_p = get_next_pos(current_pos, current_dir)
    can_break = any(d['x'] == next_p['x'] and d['y'] == next_p['y'] for d in destructible_positions)
    if can_break:
        obstacles = [o for o in obstacles if not (o['x'] == next_p['x'] and o['y'] == next_p['y'])]
        actions_queue.append("ATTACK")

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
      setLogs([normalizePythonError(e.message || e.toString())]);
      setGameStatus('lost');
    } finally {
      setIsRunning(false);
    }
  };

  const handleLoadFromCode = () => {
    const candidate = resumeInput.trim().toUpperCase();
    if (!candidate) {
      setLoadStatus('Saisis un code de reprise.');
      return;
    }
    if (typeof window === 'undefined') return;
    const storageKey = `${STORAGE_PREFIX}-${candidate}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      setLoadStatus("Aucune sauvegarde trouvée pour ce code.");
      return;
    }
    setResumeCode(candidate);
    setLoadStatus('Code chargé. Progression restaurée.');
  };

  const animateActions = async (actions: string[]) => {
    let currentPos = { ...level.start.pos };
    let currentDir = level.start.dir;
    let currentObstacles = [...runtimeObstacles];
    const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      await wait(400); 

      if (action === "MOVE") {
        const nextPos = getNextPos(currentPos, currentDir);
        if (isBlocked(nextPos, currentObstacles)) {
            setLogs([`⚠️ Aïe ! Mur percuté.`]);
            setGameStatus('lost');
            return;
        }
        currentPos = nextPos;
        setFoxPos({ ...currentPos });
      } 
      else if (action === "JUMP") {
        const nextPos = getNextPos(currentPos, currentDir);
        if (isBlocked(nextPos, currentObstacles)) {
          const landing = getNextPos(nextPos, currentDir);
          if (!isBlocked(landing, currentObstacles)) {
            currentPos = landing;
            setFoxPos({ ...currentPos });
          }
        } else {
          currentPos = nextPos;
          setFoxPos({ ...currentPos });
        }
      }
      else if (action === "TURN_LEFT") {
        currentDir = rotate(currentDir, 'LEFT');
        setFoxDir(currentDir);
      }
      else if (action === "TURN_RIGHT") {
        currentDir = rotate(currentDir, 'RIGHT');
        setFoxDir(currentDir);
      } else if (action === "ATTACK") {
        const target = getNextPos(currentPos, currentDir);
        const targetKind = runtimeObstacleKinds[posKey(target)];
        if (targetKind && targetKind !== 'rock') {
          currentObstacles = currentObstacles.filter(o => !(o.x === target.x && o.y === target.y));
        } else {
          setLogs(prev => [...prev, "🪨 Impossible de casser un rocher. Essaie de contourner ou bondir."]);
        }
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

  const isBlocked = (pos: Position, obstaclesRef: Position[] = runtimeObstacles): boolean => {
    if (pos.x < 0 || pos.x >= level.gridSize.cols || pos.y < 0 || pos.y >= level.gridSize.rows) return true;
    return obstaclesRef.some(o => o.x === pos.x && o.y === pos.y);
  };

  const checkWin = async (pos: Position) => {
    if (pos.x === runtimeGoal.x && pos.y === runtimeGoal.y) {
      setGameStatus('won');
      const lines = code.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('#')).length;
      const earnedStars = lines <= level.bestLineCount ? 3 : lines <= level.bestLineCount + 2 ? 2 : 1;
      setStars(earnedStars);
      try {
        const confettiModule = await import('canvas-confetti');
        const fire = confettiModule.default;
        fire({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setGameStatus('lost');
    }
  };

  const instructionsUsed = code.split('\n').filter(l => l.trim().length > 0 && !l.trim().startsWith('#')).length;
  const allowedCommands = getAllowedCommands(level.id);
  const commandsForCurrentTab = getCommandsForTab(allowedCommands, commandTab);
  const maxInstr = level.maxInstructions || 10;

  return (
    <div className="min-h-screen bg-[#f2f8f9] text-slate-900 font-sans flex flex-col relative overflow-hidden pt-20">
       
       {/* Décoration d'arrière plan */}
       <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 15L60 30L30 45L0 30z\' fill=\'none\' stroke=\'%23457b7b\' stroke-width=\'2\'/%3E%3C/svg%3E")', backgroundSize: '80px 80px' }}>
       </div>

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
                    <MonacoEditor
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCommandTab('deplacements')}
                      className={`px-2.5 py-1 text-[11px] rounded-md font-semibold ${commandTab === 'deplacements' ? 'bg-[#457b7b] text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Déplacements
                    </button>
                    <button
                      onClick={() => setCommandTab('logique')}
                      className={`px-2.5 py-1 text-[11px] rounded-md font-semibold ${commandTab === 'logique' ? 'bg-[#457b7b] text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Logique
                    </button>
                    <button
                      onClick={() => setCommandTab('avance')}
                      className={`px-2.5 py-1 text-[11px] rounded-md font-semibold ${commandTab === 'avance' ? 'bg-[#457b7b] text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      Avancé
                    </button>
                  </div>
                  {/* Liste des commandes */}
                  <div className="flex flex-col gap-4">
                    {commandsForCurrentTab.map((cmd, idx) => (
                      <div key={cmd.code} className="flex items-start gap-4">
                        <div className="mt-0.5 w-7 flex justify-center">
                          {idx === 0 ? (
                            <span className="text-xl leading-none" aria-hidden="true">🦊</span>
                          ) : (
                            <RotateCcw className="text-[#457b7b]" size={24} strokeWidth={2.5} />
                          )}
                        </div>
                        <div>
                          <code className="text-[13px] font-bold text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{cmd.code}</code>
                          <p className="text-[13px] text-slate-500 mt-1">{cmd.description}</p>
                        </div>
                      </div>
                    ))}
                    {commandsForCurrentTab.length === 0 && (
                      <div className="text-[12px] text-slate-500 bg-slate-50 border border-slate-100 rounded-md p-3">
                        Aucune commande disponible dans cet onglet pour ce niveau.
                      </div>
                    )}
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

             {/* Guide + mémo + reprise */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 tracking-widest flex items-center gap-2">
                    <HelpCircle size={16} />
                    AIDE & REPRISE
                  </h3>
                  <div className="text-[11px] text-slate-500 uppercase font-semibold">Code: {resumeCode || '...'}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setHelpTab('guide')}
                    className={`px-3 py-1.5 text-xs rounded-md font-semibold ${helpTab === 'guide' ? 'bg-[#457b7b] text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Guide
                  </button>
                  <button
                    onClick={() => setHelpTab('memo')}
                    className={`px-3 py-1.5 text-xs rounded-md font-semibold ${helpTab === 'memo' ? 'bg-[#457b7b] text-white' : 'bg-slate-100 text-slate-700'}`}
                  >
                    Mémo Python
                  </button>
                </div>

                {helpTab === 'guide' ? (
                  <div className="text-[13px] text-slate-600 space-y-2">
                    <p>Objectif: atteindre la poule en écrivant un programme Python.</p>
                    <p>Commence simple: teste 2-3 lignes, exécute, puis améliore.</p>
                    <p>Astuce: si tu bloques, reformule avec une boucle `for` ou `while`.</p>
                  </div>
                ) : (
                  <div className="text-[13px] text-slate-600 space-y-2">
                    <p><code>for _ in range(3):</code> répète un bloc un nombre connu de fois.</p>
                    <p><code>while not mur_devant():</code> répète tant qu'une condition est vraie.</p>
                    <p><code>if mur_devant(): ... else: ...</code> choisit une action selon la situation.</p>
                    <p><code>def action():</code> crée une action réutilisable.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
                  <input
                    value={resumeInput}
                    onChange={(e) => setResumeInput(e.target.value.toUpperCase())}
                    className="border border-slate-200 rounded-md px-3 py-2 text-xs font-mono uppercase"
                    placeholder="Code de reprise (ex: FOX-12AB34CD)"
                  />
                  <button
                    onClick={handleLoadFromCode}
                    className="px-3 py-2 text-xs rounded-md bg-slate-800 text-white font-semibold"
                  >
                    Reprendre
                  </button>
                </div>
                {loadStatus && <p className="text-[12px] text-slate-500">{loadStatus}</p>}
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
                  <IsoGrid level={renderLevel} foxPos={foxPos} foxDir={foxDir} obstacleKinds={runtimeObstacleKinds} />
                  
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
                      <div>TENTATIVES: {attemptsByLevel[level.id] || 0}</div>
                  </div>
              </div>
              
          </div>

       </main>
    </div>
  );
}
