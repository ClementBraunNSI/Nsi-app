"use client";

import { CalendarClock, Pencil, Trash2 } from "lucide-react";
import type { AdminStudent } from "@/app/actions/admin";
import type { StudentTile, StudentsOverview } from "@/app/actions/studentSheets";
import { gapLabel } from "@/lib/student-overview";
import { lastActivityLabel } from "@/lib/activity-board";
import { isInactive } from "@/lib/admin-today";
import { NSI_LEVELS } from "@/lib/nsi-levels";
import styles from "./Students.module.css";

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const lessonFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** Dessin du renard du niveau de l'élève, comme sur les tuiles de classe de la page Aujourd'hui. */
export function levelFox(level: string | null) {
  for (const meta of Object.values(NSI_LEVELS)) if (meta.profileCode && meta.profileCode === level) return meta.image;
  return "/images/fox_2.png";
}

/** Prénom : le premier mot du nom. */
export const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

function Standing({ tile }: { tile: StudentTile }) {
  if (tile.privateLessons) {
    return (
      <span className={styles.lesson}>
        <CalendarClock size={14} aria-hidden />
        {tile.nextLesson ? lessonFormat.format(new Date(tile.nextLesson.at)) : "Aucun cours prévu"}
      </span>
    );
  }
  if (!tile.position) return <span className={styles.muted}>Pas encore de note validée</span>;
  const { position } = tile;
  return (
    <span className={styles.standing}>
      <b className={styles[`tone_${position.tone}`]}>{num(position.average)}</b>
      <span>
        <small>{gapLabel(position.vsMedian, "médiane")}</small>
        <small>{gapLabel(position.vsMean, "moyenne")}</small>
      </span>
    </span>
  );
}

/** Une carte par élève : prénom, renard du niveau, moyenne et place dans la classe, ou prochain cours particulier. */
export function StudentTiles({
  students,
  overview,
  now,
  onOpen,
  onEdit,
  onDelete,
}: {
  students: AdminStudent[];
  overview: StudentsOverview | null;
  now: Date;
  onOpen: (student: AdminStudent) => void;
  onEdit: (student: AdminStudent) => void;
  onDelete: (student: AdminStudent) => void;
}) {
  return (
    <ul className={styles.grid}>
      {students.map((student) => {
        const name = student.full_name || student.email || "Élève";
        const tile: StudentTile = overview?.tiles[student.id] ?? {
          id: student.id,
          name,
          classe: student.classe,
          level: student.level,
          privateLessons: Boolean(student.has_private_lessons),
          position: null,
          grades: 0,
          nextLesson: null,
        };
        const inactive = isInactive(student.last_work_at, now);
        return (
          <li key={student.id} className={`${styles.tile} ${tile.position ? styles[`edge_${tile.position.tone}`] : ""}`}>
            <button type="button" className={styles.open} onClick={() => onOpen(student)} aria-label={`Ouvrir le détail de ${name}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={levelFox(student.level)} alt="" className={styles.fox} width={44} height={44} />
              <span className={styles.who}>
                <b>{firstName(name)}</b>
                <small className={inactive ? styles.warn : ""}>{lastActivityLabel(student.last_work_at, now)}</small>
              </span>
              <Standing tile={tile} />
            </button>
            <span className={styles.tools}>
              <button type="button" onClick={() => onEdit(student)} aria-label={`Modifier le compte de ${name}`} title="Modifier le compte">
                <Pencil size={14} aria-hidden />
              </button>
              <button type="button" className={styles.danger} onClick={() => onDelete(student)} aria-label={`Supprimer ${name}`} title="Supprimer">
                <Trash2 size={14} aria-hidden />
              </button>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
