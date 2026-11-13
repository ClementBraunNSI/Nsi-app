"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BarChart3, MessageSquare } from "lucide-react";
import type { StudentCard, StudentCardEvaluation } from "@/app/actions/studentCard";
import { getStudentWorkDetail, type StudentWorkDetail } from "@/app/actions/activity";
import { StudentWorkBlocks } from "@/components/admin/StudentWorkBlocks";
import { StudentFollowup } from "@/components/admin/StudentFollowup";
import { StudentProgressModal } from "@/components/admin/StudentProgressModal";
import { SolvedCodePanel } from "@/components/admin/SolvedCodePanel";
import { SubmissionsReview } from "@/components/admin/SubmissionsReview";
import { lastActivityLabel } from "@/lib/activity-board";

const TABS = [
  { id: "vue", label: "Vue d'ensemble" },
  { id: "activite", label: "Activité" },
  { id: "code", label: "Code" },
  { id: "ecrits", label: "Réponses écrites" },
  { id: "suivi", label: "Devoirs et messages" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const shortDate = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" });
const heatDate = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

function gradeCell(item: StudentCardEvaluation) {
  if (item.grade !== null) return <b>{num(item.grade)}</b>;
  return <span className="admin-subtle">{item.handedIn ? "à valider" : "en cours"}</span>;
}

function Overview({ card, base }: { card: StudentCard; base: string }) {
  const graded = card.evaluations.filter((item) => item.grade !== null);
  const last = graded[0];
  return (
    <div className="admin-fiche-body">
      <div className="admin-count-grid is-three">
        <div className="admin-card admin-count">
          <span className="admin-count-k">Moyenne des évaluations</span>
          <span className="admin-big">{card.average !== null ? num(card.average) : "—"}</span>
          <span className="admin-count-hint">
            {graded.length
              ? `${graded.length} note${graded.length > 1 ? "s" : ""} validée${graded.length > 1 ? "s" : ""}${
                  last?.stats.median !== null && last ? ` · dernière médiane de classe : ${num(last.stats.median!)}` : ""
                }`
              : "Aucune note validée"}
          </span>
        </div>
        <div className="admin-card admin-count">
          <span className="admin-count-k">Exercices sur 7 jours</span>
          <span className="admin-big">{card.weekExercises}</span>
          <span className="admin-count-hint">
            {card.exercisesDone} validé{card.exercisesDone > 1 ? "s" : ""} en tout · {card.badges} badge{card.badges > 1 ? "s" : ""}
          </span>
        </div>
        <div className={`admin-card admin-count${card.suspects ? " is-hot" : ""}`}>
          <span className="admin-count-k">Saisies suspectes sur 7 jours</span>
          <span className="admin-big">{card.suspects}</span>
          <span className="admin-count-hint">{card.suspects ? "collage extérieur ou code arrivé d'un bloc : voir l'onglet Activité" : "rien à signaler"}</span>
        </div>
      </div>

      <section className="admin-card" aria-labelledby="fiche-heat">
        <h2 id="fiche-heat" className="admin-card-h">
          Activité des 6 dernières semaines <small>une case par jour, plus foncée quand il y a plus d&apos;exercices</small>
        </h2>
        <div className="admin-heat" role="img" aria-label={`${card.heat.filter((day) => day.count > 0).length} jours travaillés sur 42`}>
          {card.heat.map((day) => (
            <i
              key={day.day}
              data-level={day.level}
              title={`${heatDate.format(new Date(`${day.day}T12:00:00Z`))} : ${day.count} exercice${day.count > 1 ? "s" : ""}`}
            />
          ))}
        </div>
      </section>

      <section className="admin-card" aria-labelledby="fiche-evals">
        <h2 id="fiche-evals" className="admin-card-h">
          Évaluations <small>la note, puis Q1, médiane et Q3 des copies validées{card.student.classe ? ` de la ${card.student.classe}` : ""}</small>
        </h2>
        {card.evaluations.length ? (
          <div className="admin-table-wrap is-flat">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Évaluation</th>
                  <th scope="col">Note</th>
                  <th scope="col">Classe (Q1 · médiane · Q3)</th>
                  <th scope="col">
                    <span className="sr-only">Copie</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {card.evaluations.map((item) => (
                  <tr key={item.attemptId}>
                    <td>
                      <b className="admin-strong">{item.title}</b>
                      {item.submittedAt ? <small className="admin-subtle"> · rendue le {shortDate.format(new Date(item.submittedAt))}</small> : null}
                    </td>
                    <td>{gradeCell(item)}</td>
                    <td>
                      {item.stats.count >= 2 && item.stats.q1 !== null
                        ? `${num(item.stats.q1)} · ${num(item.stats.median!)} · ${num(item.stats.q3!)}`
                        : "pas assez de copies validées"}
                    </td>
                    <td>
                      <Link href={`${base}/evaluations/${item.id}?copie=${item.attemptId}`} className="admin-mini">
                        Copie
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <span className="admin-muted">Aucune évaluation passée pour le moment.</span>
        )}
      </section>
    </div>
  );
}

function Activity({ studentId }: { studentId: string }) {
  const [detail, setDetail] = useState<StudentWorkDetail | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    getStudentWorkDetail(studentId)
      .then((value) => alive && setDetail(value))
      .catch(() => alive && setDetail(null));
    return () => {
      alive = false;
    };
  }, [studentId]);
  if (detail === undefined) return <p className="admin-loading" role="status">Chargement de l&apos;activité</p>;
  if (!detail) return <p className="admin-muted">L&apos;activité n&apos;a pas pu être chargée.</p>;
  return <StudentWorkBlocks detail={detail} />;
}

/** Fiche d'un élève : tout ce qui le concerne dans des onglets, et la liste de sa classe pour passer au suivant. */
export function StudentCardView({ card, initialTab = "vue", base = "/admin" }: { card: StudentCard; initialTab?: string; base?: string }) {
  const [tab, setTab] = useState<TabId>(TABS.some((item) => item.id === initialTab) ? (initialTab as TabId) : "vue");
  const [progress, setProgress] = useState(false);
  const { student } = card;
  const position = card.classmates.findIndex((mate) => mate.id === student.id);
  const previous = position > 0 ? card.classmates[position - 1] : null;
  const next = position >= 0 && position < card.classmates.length - 1 ? card.classmates[position + 1] : null;
  const now = new Date();

  return (
    <div className="admin-fiche">
      <aside className="admin-card admin-fiche-list" aria-label={student.classe ? `Élèves de la ${student.classe}` : "Élèves"}>
        <Link href={`${base}/eleves`} className="admin-fiche-back">
          <ArrowLeft size={14} aria-hidden /> Liste des élèves
        </Link>
        {card.classmates.map((mate) => (
          <Link key={mate.id} href={`${base}/eleves/${mate.id}${tab === "vue" ? "" : `?onglet=${tab}`}`} className={mate.id === student.id ? "is-on" : ""} aria-current={mate.id === student.id ? "page" : undefined}>
            {mate.name}
          </Link>
        ))}
      </aside>

      <div className="admin-fiche-main">
        <header className="admin-card admin-fiche-head">
          <div className="admin-who">
            <span className="admin-avatar is-big" aria-hidden>
              {student.name[0]}
            </span>
            <div className="min-w-0">
              <h1>{student.name}</h1>
              <p>
                {student.privateLessons ? "Cours particuliers" : student.classe || "Sans classe"}
                {student.email ? ` · ${student.email}` : ""} · dernière activité : {lastActivityLabel(card.lastWorkAt, now)}
              </p>
            </div>
          </div>
          <div className="admin-head-actions">
            <button type="button" className="admin-btn is-quiet" onClick={() => setTab("suivi")}>
              <MessageSquare size={15} aria-hidden /> Écrire ou donner un devoir
            </button>
            <button type="button" className="admin-btn is-quiet" onClick={() => setProgress(true)}>
              <BarChart3 size={15} aria-hidden /> Progression par fiche
            </button>
            {previous ? (
              <Link href={`${base}/eleves/${previous.id}`} className="admin-btn is-quiet" aria-label={`Élève précédent : ${previous.name}`}>
                <ArrowLeft size={15} aria-hidden />
              </Link>
            ) : null}
            {next ? (
              <Link href={`${base}/eleves/${next.id}`} className="admin-btn is-quiet" aria-label={`Élève suivant : ${next.name}`}>
                <ArrowRight size={15} aria-hidden />
              </Link>
            ) : null}
          </div>
        </header>

        <div className="admin-tabs" role="tablist" aria-label="Rubriques de la fiche">
          {TABS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-on" : ""} onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </div>

        {tab === "vue" ? <Overview card={card} base={base} /> : null}
        {tab === "activite" ? <Activity studentId={student.id} /> : null}
        {tab === "code" ? <SolvedCodePanel studentId={student.id} /> : null}
        {tab === "ecrits" ? <SubmissionsReview studentId={student.id} /> : null}
        {tab === "suivi" ? <StudentFollowup studentId={student.id} /> : null}
      </div>

      {progress ? (
        <StudentProgressModal
          student={{ id: student.id, full_name: student.name, email: student.email, level: student.level, has_private_lessons: student.privateLessons }}
          onClose={() => setProgress(false)}
        />
      ) : null}
    </div>
  );
}
