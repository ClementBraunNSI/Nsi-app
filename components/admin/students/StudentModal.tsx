"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarClock, Check, FilePlus2, Loader2, Send, X } from "lucide-react";
import { getStudentDetail, type StudentDetail } from "@/app/actions/studentSheets";
import { sendTeacherMessage } from "@/app/actions/followup";
import { distribution, gapLabel } from "@/lib/student-overview";
import { lastActivityLabel } from "@/lib/activity-board";
import { timeAgo } from "@/lib/revisions";
import { firstName, levelFox } from "./StudentTiles";
import styles from "./Students.module.css";

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const pct = (value: number) => `${Math.min(100, Math.max(0, (value / 20) * 100))}%`;
const lessonFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });
const shortDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });
const KIND_LABEL: Record<string, string> = { travail: "Fiche particulière", rattrapage: "Rattrapage" };
const STATUS_LABEL: Record<string, string> = { ouverte: "ouverte", fermee: "fermée", brouillon: "brouillon", programmee: "programmée" };

/**
 * Place dans la classe, façon banc d'essai : la distribution des moyennes de la classe en barres, une réglette du
 * rouge au vert, et la moyenne de l'élève posée dessus avec la moyenne et la médiane de la classe.
 */
export function PositionGauge({ detail }: { detail: StudentDetail }) {
  const { position, classAverages, classMean, classMedian } = detail;
  if (!position) return <p className={styles.muted}>Pas encore de note validée : la place dans la classe apparaîtra après la première évaluation corrigée.</p>;
  const bars = distribution(classAverages);
  const mine = Math.min(bars.length - 1, Math.floor((position.average / 20) * bars.length));
  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeHead}>
        <span>
          <b>{num(position.average)}</b> / 20 de moyenne
        </span>
        <span>
          Rang <b>{position.rank}</b> sur {position.count}
        </span>
      </div>
      <div className={styles.bars} role="img" aria-label={`Moyennes de la classe : ${classAverages.map(num).join(", ")}. Moyenne de l'élève : ${num(position.average)}.`}>
        {bars.map((bar, index) => (
          <i
            key={index}
            className={index === mine ? styles.barMine : ""}
            style={{ height: `${Math.max(2, bar.height * 100)}%` }}
            title={bar.count ? `${bar.count} élève${bar.count > 1 ? "s" : ""} entre ${num(index / 2)} et ${num((index + 1) / 2)}` : undefined}
          />
        ))}
      </div>
      <div className={styles.rail}>
        {classMedian !== null ? <span className={styles.tick} style={{ left: pct(classMedian) }} title={`Médiane de la classe : ${num(classMedian)}`} /> : null}
        {classMean !== null ? <span className={`${styles.tick} ${styles.tickMean}`} style={{ left: pct(classMean) }} title={`Moyenne de la classe : ${num(classMean)}`} /> : null}
        <span className={styles.pin} style={{ left: pct(position.average) }} />
      </div>
      <div className={styles.axis} aria-hidden>
        {[0, 5, 10, 15, 20].map((tick) => (
          <span key={tick} style={{ left: pct(tick) }}>
            {tick}
          </span>
        ))}
      </div>
      <div className={styles.gaugeFoot}>
        <span className={styles.beats}>
          <b>{position.beats} %</b> de la classe a une moyenne plus basse
        </span>
        <span>
          {gapLabel(position.vsMedian, "médiane")} ({classMedian !== null ? num(classMedian) : "—"}) · {gapLabel(position.vsMean, "moyenne")} (
          {classMean !== null ? num(classMean) : "—"})
        </span>
      </div>
    </div>
  );
}

/** Détail d'un élève : activité, badges, défis, dernières évaluations, place dans la classe, message et fiches. */
export function StudentModal({
  studentId,
  initial,
  onClose,
  onGiveSheet,
}: {
  studentId: string;
  /** Détail déjà chargé (page de démonstration) : pas d'appel au serveur. */
  initial?: StudentDetail;
  onClose: () => void;
  onGiveSheet: (student: { id: string; name: string }) => void;
}) {
  const [detail, setDetail] = useState<StudentDetail | null | undefined>(initial);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (initial) return;
    let alive = true;
    setDetail(undefined);
    getStudentDetail(studentId)
      .then((value) => alive && setDetail(value))
      .catch(() => alive && setDetail(null));
    return () => {
      alive = false;
    };
  }, [studentId, initial]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const now = new Date();
  const card = detail?.card;
  const name = card?.student.name ?? "Élève";
  const send = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    const result = await sendTeacherMessage(studentId, text).catch(() => ({ error: "Le message n'est pas parti." }));
    setSending(false);
    if (result.error) setSent(result.error);
    else {
      setMessage("");
      setSent("Message envoyé.");
    }
  };

  // Rendue dans <body> : la page est dans un conteneur animé qui ferait passer l'en-tête du site devant la fenêtre.
  return createPortal(
    <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="student-modal-title">
      <button type="button" className={styles.backdrop} aria-label="Fermer" onClick={onClose} />
      <div className={styles.panel}>
        <header className={styles.panelHead}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={levelFox(card?.student.level ?? null)} alt="" width={56} height={56} className={styles.fox} />
          <div className="min-w-0">
            <h2 id="student-modal-title">{card ? firstName(name) : "Chargement"}</h2>
            {card ? (
              <p>
                {name} · {card.student.privateLessons ? "Cours particuliers" : card.student.classe || "Sans classe"} · dernière activité :{" "}
                {lastActivityLabel(card.lastWorkAt, now)}
              </p>
            ) : null}
          </div>
          <Link href={`/admin/eleves/${studentId}`} className={styles.ghost}>
            Fiche complète <ArrowUpRight size={14} aria-hidden />
          </Link>
          <button type="button" className={styles.icon} onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        {detail === undefined ? (
          <p className={styles.loading}>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Chargement du détail
          </p>
        ) : detail === null || !card ? (
          <p className={styles.loading}>Le détail de cet élève n&apos;a pas pu être chargé.</p>
        ) : (
          <div className={styles.body}>
            <dl className={styles.kpis}>
              <div>
                <dt>Fiches terminées</dt>
                <dd>{detail.sheetsDone}</dd>
                <small>{card.badges} badge{card.badges > 1 ? "s" : ""}</small>
              </div>
              <div>
                <dt>Exercices validés</dt>
                <dd>{card.exercisesDone}</dd>
                <small>{card.weekExercises} cette semaine</small>
              </div>
              <div>
                <dt>Défis du lundi validés</dt>
                <dd>{detail.challengesPassed}</dd>
                <small>sur {detail.challengesTried} tenté{detail.challengesTried > 1 ? "s" : ""}</small>
              </div>
              {card.suspects ? (
                <div className={styles.kpiWarn}>
                  <dt>Saisies suspectes</dt>
                  <dd>{card.suspects}</dd>
                  <small>sur 7 jours</small>
                </div>
              ) : null}
            </dl>

            {card.student.privateLessons ? (
              <section className={styles.section}>
                <h3>
                  <CalendarClock size={16} aria-hidden /> Prochain cours
                </h3>
                <p>{detail.nextLesson ? `${lessonFormat.format(new Date(detail.nextLesson.at))}${detail.nextLesson.title ? ` · ${detail.nextLesson.title}` : ""}` : "Aucun cours prévu."}</p>
              </section>
            ) : (
              <section className={styles.section}>
                <h3>Place dans la classe {card.student.classe ? `(${card.student.classe})` : ""}</h3>
                <PositionGauge detail={detail} />
              </section>
            )}

            <div className={styles.duo}>
              <section className={styles.section}>
                <h3>3 dernières évaluations</h3>
                {card.evaluations.length ? (
                  <ul className={styles.list}>
                    {card.evaluations.slice(0, 3).map((item) => (
                      <li key={item.attemptId}>
                        <span>
                          <b>{item.title}</b>
                          <small>
                            {item.stats.count >= 2 && item.stats.median !== null
                              ? `classe : Q1 ${num(item.stats.q1!)} · médiane ${num(item.stats.median)} · Q3 ${num(item.stats.q3!)}`
                              : "pas assez de copies validées pour situer"}
                          </small>
                        </span>
                        <span className={styles.grade}>
                          {item.grade !== null ? (
                            <>
                              <b>{num(item.grade)}</b>
                              {item.stats.median !== null ? <small>{gapLabel(item.grade - item.stats.median, "médiane")}</small> : null}
                            </>
                          ) : (
                            <small>{item.handedIn ? "à valider" : "en cours"}</small>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>Aucune évaluation passée.</p>
                )}
              </section>

              <section className={styles.section}>
                <h3>Dernières activités</h3>
                {detail.recent.length ? (
                  <ul className={styles.list}>
                    {detail.recent.map((item) => (
                      <li key={item.id}>
                        <span>
                          <b>{item.label}</b>
                          <small>{timeAgo(item.at, now)}</small>
                        </span>
                        <span className={item.passed ? styles.ok : styles.muted}>{item.passed ? <Check size={15} aria-label="réussi" /> : "essai"}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>Aucun exercice essayé pour le moment.</p>
                )}
              </section>
            </div>

            <div className={styles.duo}>
              <section className={styles.section}>
                <h3>Écrire à {firstName(name)}</h3>
                <textarea
                  className={styles.textarea}
                  value={message}
                  rows={3}
                  maxLength={2000}
                  placeholder="Message visible dans l'espace de l'élève"
                  onChange={(event) => {
                    setMessage(event.target.value);
                    setSent(null);
                  }}
                />
                <div className={styles.row}>
                  {sent ? <small className={styles.muted}>{sent}</small> : <span />}
                  <button type="button" className={styles.primary} disabled={sending || !message.trim()} onClick={send}>
                    <Send size={14} aria-hidden /> Envoyer
                  </button>
                </div>
              </section>

              <section className={styles.section}>
                <h3>Fiches données</h3>
                {detail.sheets.length ? (
                  <ul className={styles.list}>
                    {detail.sheets.slice(0, 4).map((sheet) => (
                      <li key={sheet.id}>
                        <span>
                          <Link href={`/admin/evaluations/${sheet.id}`}>
                            <b>{sheet.title}</b>
                          </Link>
                          <small>
                            {KIND_LABEL[sheet.kind] ?? "Évaluation"} · {shortDate.format(new Date(sheet.createdAt))} · {STATUS_LABEL[sheet.status] ?? sheet.status}
                          </small>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.muted}>Aucune fiche particulière pour le moment.</p>
                )}
                <button type="button" className={styles.ghost} onClick={() => onGiveSheet({ id: studentId, name })}>
                  <FilePlus2 size={14} aria-hidden /> Donner une fiche particulière
                </button>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
