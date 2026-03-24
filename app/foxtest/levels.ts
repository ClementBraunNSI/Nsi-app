

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface Position {
  x: number;
  y: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  gridSize: { cols: number; rows: number };
  start: { pos: Position; dir: Direction };
  goal: Position;
  obstacles: Position[]; // Rocks, trees
  maxInstructions?: number; // Optional limit
  initialCode?: string;
  hint?: string;
  bestLineCount: number; // Target for 3 stars (beginner friendly optimal)
}

const HEADER_SEQ = `# --- Commandes disponibles ---
# avancer()
# tourner_gauche()
# tourner_droite()
# -----------------------------

`;

const HEADER_FOR = `# --- Commandes disponibles ---
# avancer(), tourner_gauche()...
# for i in range(nombre):
#     action()
# -----------------------------

`;

const HEADER_WHILE = `# --- Commandes disponibles ---
# while condition:
# if condition: / else:
#
# Conditions :
# mur_devant(), mur_gauche(), mur_droite()
# sur_objectif()
# -----------------------------

`;

const HEADER_FUNC = `# --- Commandes disponibles ---
# def ma_fonction():
#     actions...
#
# + Toutes les commandes précédentes
# -----------------------------

`;

export const LEVELS: LevelConfig[] = [
  // ==========================================
  // MODULE 1 : SÉQUENCES (1-5)
  // ==========================================
  {
    id: 1,
    title: "1. Bonjour Renard",
    description: "Le renard a faim ! Fais-le avancer d'une case pour manger la poule.",
    gridSize: { cols: 3, rows: 1 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 2, y: 0 },
    obstacles: [],
    initialCode: HEADER_SEQ,
    hint: "Tu dois avancer 2 fois.",
    bestLineCount: 2
  },
  {
    id: 2,
    title: "2. Le Virage",
    description: "La poule est cachée au coin. Tourne au bon moment !",
    gridSize: { cols: 3, rows: 3 },
    start: { pos: { x: 0, y: 2 }, dir: 'E' },
    goal: { x: 2, y: 0 },
    obstacles: [ {x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:1, y:1} ],
    initialCode: HEADER_SEQ,
    hint: "Avance, tourne, avance...",
    bestLineCount: 4 // av, av, tg, av
  },
  {
    id: 3,
    title: "3. Zig Zag",
    description: "Un chemin sinueux. Il va falloir tourner souvent !",
    gridSize: { cols: 5, rows: 3 },
    start: { pos: { x: 0, y: 2 }, dir: 'E' },
    goal: { x: 4, y: 0 },
    // Obstacles adjusted to create a clear zig-zag path:
    // Path: (0,2) -> (0,1) -> (1,1) -> (1,0) -> (2,0) -> (2,1) -> (3,1) -> (3,0) -> (4,0)
    obstacles: [ 
        {x:1, y:2}, {x:2, y:2}, {x:3, y:2}, {x:4, y:2}, // Bottom row blocked except start
        {x:0, y:0}, {x:4, y:1} // Blocking direct path
    ],
    initialCode: HEADER_SEQ,
    hint: "Visualise le chemin case par case.",
    bestLineCount: 11 // av, tg, av, td, av, tg, av, td, av (approx)
  },
  {
    id: 4,
    title: "4. L'Escalier (Manuel)",
    description: "Monte les marches une par une.",
    gridSize: { cols: 4, rows: 4 },
    start: { pos: { x: 0, y: 3 }, dir: 'E' },
    goal: { x: 3, y: 0 },
    obstacles: [
        {x:1, y:3}, {x:2, y:3}, {x:3, y:3},
        {x:2, y:2}, {x:3, y:2},
        {x:3, y:1}
    ],
    initialCode: HEADER_SEQ,
    hint: "C'est répétitif : monte, tourne, monte, tourne...",
    bestLineCount: 12 // (tg, av, td, av) * 3
  },
  {
    id: 5,
    title: "5. Le Créneau",
    description: "Contourne le rocher proprement.",
    gridSize: { cols: 5, rows: 3 },
    start: { pos: { x: 0, y: 1 }, dir: 'E' },
    goal: { x: 4, y: 1 },
    obstacles: [{x: 2, y: 1}],
    initialCode: HEADER_SEQ,
    hint: "Tu peux passer par le haut ou par le bas.",
    bestLineCount: 6 // av, tg, av, td, av, td, av, tg, av ... ~6-8 instructions
  },

  // ==========================================
  // MODULE 2 : BOUCLES FOR (6-10)
  // ==========================================
  {
    id: 6,
    title: "6. La Longue Route",
    description: "Utilise une boucle 'for' pour avancer sans te fatiguer.",
    gridSize: { cols: 7, rows: 1 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 6, y: 0 },
    obstacles: [],
    initialCode: HEADER_FOR,
    hint: "Compte le nombre de cases.",
    bestLineCount: 2 // for i in range(6): av()
  },
  {
    id: 7,
    title: "7. Le Carré",
    description: "Fais le tour du parc (4 côtés identiques).",
    gridSize: { cols: 4, rows: 4 },
    start: { pos: { x: 1, y: 1 }, dir: 'E' },
    goal: { x: 1, y: 2 }, // Virtual goal to force loop logic
    obstacles: [{x:2, y:2}],
    initialCode: HEADER_FOR,
    hint: "Répète 4 fois : avancer et tourner.",
    bestLineCount: 4 // for 4: av, av, td
  },
  {
    id: 8,
    title: "8. L'Escalier (Boucle)",
    description: "Monte les 5 marches avec une boucle.",
    gridSize: { cols: 6, rows: 6 },
    start: { pos: { x: 0, y: 5 }, dir: 'E' },
    goal: { x: 5, y: 0 },
    obstacles: [
        {x:1, y:5}, {x:2, y:5}, {x:3, y:5}, {x:4, y:5}, {x:5, y:5},
        {x:2, y:4}, {x:3, y:4}, {x:4, y:4}, {x:5, y:4},
        {x:3, y:3}, {x:4, y:3}, {x:5, y:3},
        {x:4, y:2}, {x:5, y:2},
        {x:5, y:1}
    ],
    initialCode: HEADER_FOR,
    hint: "Quel est le motif qui se répète pour une marche ?",
    bestLineCount: 5 // for 5: tg, av, td, av
  },
  {
    id: 9,
    title: "9. Les Pointillés",
    description: "Avance, saute, avance... Un motif régulier.",
    gridSize: { cols: 7, rows: 3 },
    start: { pos: { x: 0, y: 2 }, dir: 'E' },
    goal: { x: 6, y: 2 },
    obstacles: [{x:1,y:2}, {x:3,y:2}, {x:5,y:2}],
    initialCode: HEADER_FOR,
    hint: "Décompose le mouvement pour franchir UN obstacle.",
    bestLineCount: 6 // for 3: tg, av, td, av, av ?? Or jump logic
  },
  {
    id: 10,
    title: "10. Le U",
    description: "Trois lignes droites séparées par des virages.",
    gridSize: { cols: 6, rows: 6 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 0, y: 1 },
    obstacles: [{x:1, y:1}, {x:2,y:1}, {x:3,y:1}, {x:4,y:1}],
    initialCode: HEADER_FOR,
    hint: "Tu peux utiliser plusieurs boucles 'for' à la suite.",
    bestLineCount: 8 // for 5: av; td; for 5: av; td; for 5: av
  },

  // ==========================================
  // MODULE 3 : WHILE & CONDITIONS (11-15)
  // ==========================================
  {
    id: 11,
    title: "11. Vers l'Inconnu",
    description: "Avance jusqu'au mur.",
    gridSize: { cols: 8, rows: 1 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 6, y: 0 },
    obstacles: [],
    initialCode: HEADER_WHILE,
    hint: "Utilise 'while not mur_devant():'",
    bestLineCount: 2
  },
  {
    id: 12,
    title: "12. Le Couloir",
    description: "Va au bout, tourne, et continue.",
    gridSize: { cols: 5, rows: 5 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 4, y: 4 },
    obstacles: [],
    initialCode: HEADER_WHILE,
    hint: "Deux boucles while séparées par un virage.",
    bestLineCount: 5 // while.. av; td; while.. av
  },
  {
    id: 13,
    title: "13. Le Chercheur",
    description: "Trouve l'objectif (la case verte).",
    gridSize: { cols: 8, rows: 1 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 5, y: 0 },
    obstacles: [],
    initialCode: HEADER_WHILE,
    hint: "Tant que 'not sur_objectif()', avance.",
    bestLineCount: 2
  },
  {
    id: 14,
    title: "14. Le Slalom (Auto)",
    description: "Adapte-toi : si mur, contourne. Sinon, avance.",
    gridSize: { cols: 8, rows: 3 },
    start: { pos: { x: 0, y: 1 }, dir: 'E' },
    goal: { x: 7, y: 1 },
    obstacles: [{x:2, y:1}, {x:5, y:1}],
    initialCode: HEADER_WHILE,
    hint: "Dans la boucle, utilise 'if mur_devant():'.",
    bestLineCount: 10 // while not obj: if mur: contourne (5-6 lines); else: av
  },
  {
    id: 15,
    title: "15. La Spirale Infernale",
    description: "Avance jusqu'au mur, tourne à droite. Répète.",
    gridSize: { cols: 6, rows: 6 },
    start: { pos: { x: 1, y: 1 }, dir: 'N' },
    goal: { x: 2, y: 3 },
    obstacles: [
        {x:0,y:0}, {x:1,y:0}, {x:2,y:0}, {x:3,y:0}, {x:4,y:0}, {x:5,y:0},
        {x:0,y:1}, {x:0,y:2}, {x:0,y:3}, {x:0,y:4}, {x:0,y:5},
    ],
    initialCode: HEADER_WHILE,
    hint: "Tant que pas sur objectif : si mur devant, tourne, sinon avance.",
    bestLineCount: 5
  },

  // ==========================================
  // MODULE 4 : FONCTIONS (16-20)
  // ==========================================
  {
    id: 16,
    title: "16. Demi-tour",
    description: "Crée une fonction 'demi_tour' et utilise-la.",
    gridSize: { cols: 3, rows: 3 },
    start: { pos: { x: 0, y: 1 }, dir: 'E' },
    goal: { x: 0, y: 1 },
    obstacles: [{x:2, y:1}],
    initialCode: HEADER_FUNC,
    hint: "def demi_tour(): ...",
    bestLineCount: 6 // def dt: td, td; av, dt, av
  },
  {
    id: 17,
    title: "17. Pyramide",
    description: "Fonctions 'monter' et 'descendre'.",
    gridSize: { cols: 5, rows: 5 },
    start: { pos: { x: 0, y: 4 }, dir: 'E' },
    goal: { x: 4, y: 4 },
    obstacles: [{x:1,y:4}, {x:2,y:4}, {x:3,y:4}, {x:2,y:3}],
    initialCode: HEADER_FUNC,
    hint: "Définis tes fonctions au début.",
    bestLineCount: 10 // def m, def d, calls
  },
  {
    id: 18,
    title: "18. Le Carré (Fonction)",
    description: "Fonction 'cote' + Boucle 4 fois.",
    gridSize: { cols: 5, rows: 5 },
    start: { pos: { x: 1, y: 1 }, dir: 'E' },
    goal: { x: 1, y: 2 },
    obstacles: [{x:2, y:2}],
    initialCode: HEADER_FUNC,
    hint: "Une fonction peut contenir plusieurs actions.",
    bestLineCount: 6 // def cote: av, av, td; for 4: cote
  },
  {
    id: 19,
    title: "19. Le Jardinier",
    description: "Traite chaque ligne.",
    gridSize: { cols: 5, rows: 5 },
    start: { pos: { x: 0, y: 0 }, dir: 'S' },
    goal: { x: 4, y: 4 },
    obstacles: [],
    initialCode: HEADER_FUNC,
    hint: "Une fonction pour la ligne, une pour changer de ligne.",
    bestLineCount: 10
  },
  {
    id: 20,
    title: "20. Le Grand Final",
    description: "Labyrinthe complet.",
    gridSize: { cols: 8, rows: 8 },
    start: { pos: { x: 0, y: 0 }, dir: 'E' },
    goal: { x: 7, y: 7 },
    obstacles: [
        {x:2,y:0}, {x:2,y:1}, {x:2,y:2},
        {x:5,y:7}, {x:5,y:6}, {x:5,y:5},
        {x:0,y:4}, {x:1,y:4}, {x:2,y:4}, {x:3,y:4}, {x:4,y:4},
        {x:6,y:3}
    ],
    initialCode: HEADER_FUNC,
    hint: "Combine tout ce que tu sais !",
    bestLineCount: 8 // while not obj: algo de contournement ou simple
  }
];
