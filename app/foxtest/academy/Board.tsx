"use client";

import { PawPrint } from "lucide-react";
import type { ChapterId, Direction, Position, World } from "./types";
import { posKey, samePos } from "./world";
import { Bush, Flower, Hills, Mushroom, Nest, Pebble, PineTree, RoundTree, Tuft } from "./Scenery";
import styles from "./academy.module.css";

export type FoxAction = "idle" | "walk" | "turn" | "read" | "bump";

type Props = {
  world: World;
  foxPos: Position;
  foxDir: Direction;
  foxAction: FoxAction;
  signLabel?: string;
  chapter: ChapterId;
  /** Cases déjà parcourues pendant l'exécution : on y laisse des empreintes. */
  trail: Array<Position & { dir: Direction }>;
};

const directionClass: Record<Direction, string> = {
  N: styles.foxNorth,
  E: styles.foxEast,
  S: styles.foxSouth,
  W: styles.foxWest,
};

const actionClass: Record<FoxAction, string> = {
  idle: styles.foxIdle,
  walk: styles.foxWalk,
  turn: styles.foxTurn,
  read: styles.foxRead,
  bump: styles.foxBump,
};

/** Une saison par chapitre : printemps, été, automne, coucher de soleil, nuit. */
const themeClass: Record<ChapterId, string> = {
  sequence: styles.themeSpring,
  variables: styles.themeSummer,
  conditions: styles.themeAutumn,
  for: styles.themeSunset,
  while: styles.themeNight,
};

const pawRotation: Record<Direction, number> = { N: 0, E: 90, S: 180, W: 270 };

/** Petit hachage stable : le même niveau garde les mêmes fleurs d'une partie à l'autre. */
function noise(x: number, y: number, seed: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function TileDecor({ x, y, seed, chapter }: { x: number; y: number; seed: number; chapter: ChapterId }) {
  const r = noise(x, y, seed);
  if (r < 0.62) return null;
  const left = `${12 + noise(y, x, seed) * 52}%`;
  const style = { left, top: r > 0.85 ? "10%" : "56%" };
  if (r > 0.92) return chapter === "conditions" ? <Mushroom className={styles.tileDecor} style={style} /> : <Flower className={styles.tileDecor} style={style} />;
  if (r > 0.8) return <Tuft className={styles.tileDecor} style={style} />;
  if (r > 0.7) return <Pebble className={styles.tileDecor} style={style} />;
  return <Tuft className={styles.tileDecorSmall} style={style} />;
}

/** Plateau de jeu : une île d'herbe dans un paysage de saison, avec la poule, le renard et ses empreintes. */
export default function Board({ world, foxPos, foxDir, foxAction, signLabel, chapter, trail }: Props) {
  const rocks = new Set(world.rocks.map(posKey));
  const visited = new Map(trail.map((step) => [posKey(step), step.dir]));
  const seed = world.cols * 13 + world.rows * 7 + world.goal.x * 3 + world.goal.y;
  const tile = (n: number, axis: "x" | "y") => `${(n / (axis === "x" ? world.cols : world.rows)) * 100}%`;

  return (
    <div className={`${styles.meadow} ${themeClass[chapter]} ${foxAction === "bump" ? styles.meadowBump : ""}`}>
      <div className={styles.sky} aria-hidden>
        <span className={styles.sun} />
        <span className={`${styles.cloud} ${styles.cloudOne}`} />
        <span className={`${styles.cloud} ${styles.cloudTwo}`} />
        {chapter === "while" ? (
          <>
            {[12, 28, 46, 63, 81, 90].map((left, index) => (
              <span key={left} className={styles.firefly} style={{ left: `${left}%`, top: `${20 + ((index * 23) % 55)}%`, animationDelay: `${index * 0.7}s` }} />
            ))}
          </>
        ) : null}
      </div>
      <Hills className={styles.hills} />

      <div
        className={styles.boardWrap}
        style={{
          aspectRatio: `${world.cols} / ${world.rows}`,
          // Aussi grand que possible en gardant de la place pour le décor, cases de 140 px au plus.
          width: `min(86cqw, ${world.cols * 140}px, calc(80cqh * ${world.cols} / ${world.rows}))`,
        }}
      >
        {/* Décor autour de l'île : arbres et buissons dont la taille suit celle des cases */}
        <RoundTree className={styles.decor} style={{ left: `calc(-0.95 * ${tile(1, "x")})`, bottom: "8%", width: tile(0.95, "x") }} />
        <PineTree className={styles.decor} style={{ right: `calc(-0.85 * ${tile(1, "x")})`, bottom: "22%", width: tile(0.75, "x") }} />
        <Bush className={styles.decorFront} style={{ right: `calc(-0.35 * ${tile(1, "x")})`, bottom: `calc(-0.42 * ${tile(1, "y")})`, width: tile(0.9, "x") }} />
        <Bush className={styles.decorFront} style={{ left: `calc(-0.25 * ${tile(1, "x")})`, bottom: `calc(-0.4 * ${tile(1, "y")})`, width: tile(0.7, "x") }} />
        {world.cols >= 4 ? (
          <RoundTree className={styles.decorBack} style={{ left: tile(world.cols * 0.55, "x"), top: `calc(-0.95 * ${tile(1, "y")})`, width: tile(0.7, "x") }} />
        ) : null}

        <div className={styles.board}>
          {Array.from({ length: world.rows * world.cols }).map((_, idx) => {
            const x = idx % world.cols;
            const y = Math.floor(idx / world.cols);
            const key = `${x},${y}`;
            const isRock = rocks.has(key);
            const isGoal = samePos(world.goal, { x, y });
            const isStart = samePos(world.start, { x, y });
            const isSign = world.sign ? samePos(world.sign, { x, y }) : false;
            const pawDir = visited.get(key);
            const plain = !isRock && !isGoal && !isStart && !isSign;

            return (
              <div
                key={key}
                className={`${styles.tile} ${(x + y) % 2 ? styles.tileAlt : ""} ${isRock ? styles.tileRock : ""}`}
                style={{ left: tile(x, "x"), top: tile(y, "y"), width: tile(1, "x"), height: tile(1, "y") }}
              >
                <div className={styles.tileInner}>
                  {plain && pawDir === undefined ? <TileDecor x={x} y={y} seed={seed} chapter={chapter} /> : null}
                  {pawDir !== undefined && !isGoal && !samePos(foxPos, { x, y }) ? (
                    <span className={styles.paw} style={{ transform: `rotate(${pawRotation[pawDir]}deg)` }} aria-hidden>
                      <PawPrint size="1em" strokeWidth={2.4} />
                    </span>
                  ) : null}
                  {isRock && (
                    <div className={styles.rock}>
                      <span className={styles.moss} />
                    </div>
                  )}
                  {isSign && signLabel && <div className={styles.sign}>{signLabel}</div>}
                  {isGoal && (
                    <>
                      <div className={styles.goalGlow} />
                      <Nest className={styles.nest} />
                      <div className={styles.henSheet} role="img" aria-label="La poule" />
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div
            className={styles.character}
            style={{
              left: `${((foxPos.x - 0.14) / world.cols) * 100}%`,
              top: `${((foxPos.y - 0.34) / world.rows) * 100}%`,
              width: `${128 / world.cols}%`,
              height: `${128 / world.rows}%`,
            }}
          >
            <div className={`${styles.characterShadow} ${foxDir === "E" || foxDir === "W" ? styles.shadowWide : styles.shadowNarrow}`} />
            <div className={`${styles.dust} ${foxAction === "walk" ? styles.dustActive : ""}`} />
            <div
              className={`${styles.foxSheet} ${directionClass[foxDir]} ${actionClass[foxAction]}`}
              role="img"
              aria-label={`Le renard, tourné vers ${{ N: "le haut", E: "la droite", S: "le bas", W: "la gauche" }[foxDir]}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
