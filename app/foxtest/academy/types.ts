export type Direction = "N" | "E" | "S" | "W";
export type Position = { x: number; y: number };
export type Tile = "empty" | "rock" | "sign";
export type GameStatus = "idle" | "playing" | "won" | "lost";
export type ChapterId = "sequence" | "variables" | "conditions" | "for" | "while";

export type CommandId =
  | "avancer"
  | "tourner_gauche"
  | "tourner_droite"
  | "avancer_de"
  | "lire_nombre"
  | "lire_panneau"
  | "mur_devant"
  | "poule_atteinte";

export type CommandDef = {
  id: CommandId;
  code: string;
  insert: string;
  description: string;
};

export type Action =
  | { type: "MOVE" }
  | { type: "TURN_LEFT" }
  | { type: "TURN_RIGHT" }
  | { type: "READ" };

export type LevelConfig = {
  id: number;
  chapter: ChapterId;
  title: string;
  mission: string;
  hint: string;
  map: string[];
  startDir: Direction;
  commands: CommandId[];
  concepts: string[];
  starter: string;
  maxLines?: number;
  bestLines: number;
  /** Distance displayed by lire_nombre(), or randomized if omitted. */
  randomDistance?: boolean;
  /** Direction displayed by lire_panneau(), or randomized if omitted. */
  randomSign?: boolean;
  /** Valeur fixe renvoyée par lire_nombre() si le niveau n'est pas randomisé. */
  fixedNumber?: number;
};

export type World = {
  cols: number;
  rows: number;
  start: Position;
  startDir: Direction;
  goal: Position;
  rocks: Position[];
  sign: Position | null;
  numberValue: number;
  signWord: "gauche" | "droite";
};

export type SavedProgress = {
  resumeCode: string;
  levelId: number;
  completed: number[];
  codeByLevel: Record<number, string>;
  attemptsByLevel: Record<number, number>;
  updatedAt: number;
};
