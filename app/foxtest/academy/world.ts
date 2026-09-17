import type { Direction, LevelConfig, Position, World } from "./types";

const DIRS: Direction[] = ["N", "E", "S", "W"];

export function posKey(p: Position): string {
  return `${p.x},${p.y}`;
}

export function samePos(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

export function turn(dir: Direction, side: "LEFT" | "RIGHT"): Direction {
  const idx = DIRS.indexOf(dir);
  return side === "RIGHT" ? DIRS[(idx + 1) % 4] : DIRS[(idx + 3) % 4];
}

export function ahead(pos: Position, dir: Direction): Position {
  if (dir === "N") return { x: pos.x, y: pos.y - 1 };
  if (dir === "S") return { x: pos.x, y: pos.y + 1 };
  if (dir === "E") return { x: pos.x + 1, y: pos.y };
  return { x: pos.x - 1, y: pos.y };
}

function paddedRow(row: string, cols: number): string {
  return row.padEnd(cols, ".");
}

function pick<T>(values: T[], salt: number): T {
  return values[Math.abs(Math.floor(salt * 997) % values.length)];
}

export function buildWorld(level: LevelConfig, salt = level.id * 31): World {
  const cols = Math.max(...level.map.map((row) => row.length));
  const rows = level.map.length;
  const rocks: Position[] = [];
  let start: Position | null = null;
  let goal: Position | null = null;
  let sign: Position | null = null;
  const gaucheGoal: Position[] = [];
  const droiteGoal: Position[] = [];

  for (let y = 0; y < rows; y += 1) {
    const row = paddedRow(level.map[y], cols);
    for (let x = 0; x < cols; x += 1) {
      const cell = row[x];
      if (cell === "#") rocks.push({ x, y });
      if (cell === "F") start = { x, y };
      if (cell === "C") goal = { x, y };
      if (cell === "S") sign = { x, y };
      if (cell === "G") gaucheGoal.push({ x, y });
      if (cell === "D") droiteGoal.push({ x, y });
    }
  }

  if (!start) throw new Error(`Niveau ${level.id}: départ F manquant`);
  const foxStart = start;

  const signWord = level.randomSign
    ? pick(["gauche", "droite"] as const, salt)
    : "gauche";

  if (!goal) {
    if (signWord === "gauche" && gaucheGoal[0]) goal = gaucheGoal[0];
    else if (droiteGoal[0]) goal = droiteGoal[0];
    else if (gaucheGoal[0]) goal = gaucheGoal[0];
  }

  let numberValue = level.fixedNumber ?? 1;
  if (level.randomDistance) {
    const span = Math.max(2, cols - foxStart.x - 2);
    const steps = 2 + (Math.abs(Math.floor(salt / 17)) % Math.max(1, span - 1));
    numberValue = steps;
    if (level.id === 5 || level.id === 13) {
      goal = { x: foxStart.x + steps, y: foxStart.y };
    }
    if (level.id === 12) {
      goal = { x: foxStart.x + steps, y: foxStart.y };
      rocks.push({ x: foxStart.x + steps + 1, y: foxStart.y });
    }
  } else if (!level.fixedNumber && goal) {
    numberValue = Math.max(1, Math.abs(goal.x - foxStart.x));
  }

  if (!goal) throw new Error(`Niveau ${level.id}: poule C manquante`);

  return {
    cols,
    rows,
    start: foxStart,
    startDir: level.startDir,
    goal,
    rocks,
    sign,
    numberValue,
    signWord,
  };
}

export function isBlocked(world: World, pos: Position, extraRocks: Position[] = world.rocks): boolean {
  if (pos.x < 0 || pos.y < 0 || pos.x >= world.cols || pos.y >= world.rows) return true;
  return extraRocks.some((rock) => samePos(rock, pos));
}

export function countCodeLines(code: string): number {
  return code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#")).length;
}
