"use client";

import { Activity, Compass, Sparkles } from "lucide-react";
import type { ChapterId, Direction, Position, World } from "./types";
import { posKey, samePos } from "./world";
import styles from "./academy.module.css";

type Props = {
  world: World;
  foxPos: Position;
  foxDir: Direction;
  foxAction: "idle" | "walk" | "turn" | "read" | "bump";
  signLabel?: string;
  levelId: number;
  levelTitle: string;
  step: number;
  totalSteps: number;
  chapter: ChapterId;
};

const directionClass: Record<Direction, string> = {
  N: styles.foxNorth,
  E: styles.foxEast,
  S: styles.foxSouth,
  W: styles.foxWest,
};

const actionClass: Record<Props["foxAction"], string> = {
  idle: styles.foxIdle,
  walk: styles.foxWalk,
  turn: styles.foxTurn,
  read: styles.foxRead,
  bump: styles.foxBump,
};

const chapterClass: Record<ChapterId, string> = {
  sequence: styles.stageSequence,
  variables: styles.stageVariables,
  conditions: styles.stageConditions,
  for: styles.stageFor,
  while: styles.stageWhile,
};

const shadowClass: Record<Direction, string> = {
  N: styles.shadowNarrow,
  E: styles.shadowWide,
  S: styles.shadowNarrow,
  W: styles.shadowWide,
};

export default function Board({
  world,
  foxPos,
  foxDir,
  foxAction,
  signLabel,
  levelId,
  levelTitle,
  step,
  totalSteps,
  chapter,
}: Props) {
  const rocks = new Set(world.rocks.map(posKey));
  const progress = totalSteps > 0 ? Math.min(100, Math.round((step / totalSteps) * 100)) : 0;

  return (
    <div className={`${styles.stage} ${chapterClass[chapter]} ${foxAction === "bump" ? styles.stageBump : ""}`}>
      <div className={styles.sun} />
      <div className={styles.cloud} />
      <div className={`${styles.cloud} ${styles.cloudTwo}`} />
      <div className={styles.hills} />
      <div className={styles.canopy} />
      <span className={`${styles.leaf} ${styles.leafOne}`} />
      <span className={`${styles.leaf} ${styles.leafTwo}`} />
      <span className={`${styles.leaf} ${styles.leafThree}`} />

      <div className={styles.stageHud}>
        <div className={styles.stageBadge}>
          <Compass size={17} />
          <div>
            <strong>Clairière {String(levelId).padStart(2, "0")}</strong>
            <span>{levelTitle}</span>
          </div>
        </div>
        <div className={styles.statusBadge}>
          <Activity size={16} />
          <div>
            <strong>{foxAction === "idle" ? "Prêt" : "Programme en cours"}</strong>
            <span>{totalSteps > 0 ? `${totalSteps} action${totalSteps > 1 ? "s" : ""}` : "En attente du code"}</span>
          </div>
        </div>
      </div>

      <div
        className={styles.boardWrap}
        style={{ maxWidth: `${Math.min(720, world.cols * 88 + 34)}px` }}
      >
        <div
          className={styles.board}
          style={{ aspectRatio: `${world.cols} / ${world.rows}` }}
        >
          {Array.from({ length: world.rows * world.cols }).map((_, idx) => {
            const x = idx % world.cols;
            const y = Math.floor(idx / world.cols);
            const isRock = rocks.has(`${x},${y}`);
            const isGoal = samePos(world.goal, { x, y });
            const isSign = world.sign ? samePos(world.sign, { x, y }) : false;

            return (
              <div
                key={`${x}-${y}`}
                className={styles.tile}
                style={{
                  left: `${(x / world.cols) * 100}%`,
                  top: `${(y / world.rows) * 100}%`,
                  width: `${100 / world.cols}%`,
                  height: `${100 / world.rows}%`,
                }}
              >
                <div className={styles.tileInner}>
                  {isRock && <div className={styles.rock} />}
                  {isSign && signLabel && <div className={styles.sign}>{signLabel}</div>}
                  {isGoal && (
                    <>
                      <div className={styles.goalGlow} />
                      <div className={styles.henSheet} role="img" aria-label="Poule" />
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
            <div
              className={`${styles.characterShadow} ${shadowClass[foxDir]} ${
                foxAction === "idle" ? styles.shadowIdle : ""
              }`}
            />
            <div className={`${styles.dust} ${foxAction === "walk" ? styles.dustActive : ""}`} />
            <div
              className={`${styles.foxSheet} ${directionClass[foxDir]} ${actionClass[foxAction]}`}
              role="img"
              aria-label={`Renard orienté ${foxDir}`}
            />
          </div>
        </div>
      </div>

      {totalSteps > 0 && (
        <div className={styles.stepProgress}>
          <Sparkles size={15} color="var(--accent)" />
          <div className={styles.stepProgressTrack}>
            <div className={styles.stepProgressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.stepProgressText}>
            étape {step} / {totalSteps}
          </span>
        </div>
      )}
    </div>
  );
}
