"use client";

import styles from "@/app/foxtest/academy/academy.module.css";

/**
 * Same celebration as a finished academy level: the joyful frame of
 * academy-fox-emotes.png (background-position 66.667%) with victory-bounce.
 * The class lives in the academy stylesheet so a fix there stays in sync.
 */
export function AcademyVictoryFox({ className = "" }: { className?: string }) {
  return (
    <div className={`mx-auto flex justify-center ${className}`}>
      <div
        className={styles.victoryFox}
        role="img"
        aria-label="Renard qui célèbre"
        style={{ margin: 0 }}
      />
    </div>
  );
}
