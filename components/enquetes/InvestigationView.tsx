"use client";

import { FormEvent, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Blocks, Check, Code2, Database, History, Lightbulb, NotebookPen, RotateCcw, Search, Table2, Target } from "lucide-react";
import { checkAccusation, resumeEnquete } from "@/app/actions/enquetes";
import type { EnqueteReward } from "@/lib/enquetes/rewards";
import RewardsDialog from "@/components/enquetes/RewardsDialog";
import type { PublicEnquete } from "@/lib/enquetes/types";
import { clearCase, markSolved, readProgress, readSolutions, readSolved, saveProgress, type Mode, type Solution } from "@/lib/enquetes/progress";

const loading = () => <p className="enq-muted enq-loading">Ouverture de l'atelier</p>;
const BlocklyMode = dynamic(() => import("@/components/enquetes/BlocklyMode"), { ssr: false, loading });
const CodeMode = dynamic(() => import("@/components/enquetes/CodeMode"), { ssr: false, loading });

const MODES: { id: Mode; label: string; detail: string; icon: typeof Blocks }[] = [
  { id: "blockly", label: "Blocs", detail: "Assembler des blocs", icon: Blocks },
  { id: "python", label: "Python", detail: "Lire des fichiers CSV", icon: Code2 },
  { id: "sql", label: "SQL", detail: "Écrire des requêtes", icon: Database },
];

type Props = { enquete: PublicEnquete; next: { slug: string; title: string } | null };

/** Coupable trouvé avant la dernière étape : le rebondissement, et l'étape qu'il ouvre. */
type Twist = Solution & { twist: string; next: PublicEnquete };

export default function InvestigationView({ enquete: firstStage, next }: Props) {
  const [enquete, setEnquete] = useState(firstStage);
  const [found, setFound] = useState<string[]>([]);
  const [twist, setTwist] = useState<Twist | null>(null);
  const [mode, setMode] = useState<Mode>("blockly");
  const [hintCount, setHintCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [answer, setAnswer] = useState("");
  const [verdict, setVerdict] = useState<"none" | "wrong" | "right">("none");
  const [attempts, setAttempts] = useState(0);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [checking, setChecking] = useState(false);
  const [openTable, setOpenTable] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const [rewards, setRewards] = useState<EnqueteReward[]>([]);

  // Reprend l'enquête là où l'élève l'avait laissée sur cet appareil, à la bonne étape.
  useEffect(() => {
    let cancelled = false;
    const slug = firstStage.slug;
    setRestored(false);
    setTwist(null);
    try {
      const savedMode = localStorage.getItem("enquetes-mode") as Mode | null;
      if (savedMode && MODES.some((item) => item.id === savedMode)) setMode(savedMode);
      setNotes(localStorage.getItem(`enquete-${slug}-notes`) || "");
    } catch {
      /* stockage indisponible */
    }
    const progress = readProgress(slug);
    const restore = (view: PublicEnquete, solved: string[]) => {
      if (cancelled) return;
      setEnquete(view);
      setFound(solved);
      setHintCount(Math.min(progress.hints, view.hints.length));
      setAttempts(progress.attempts);
      setAnswer(progress.answer);
      setOpenTable(progress.openTable);
      const known = readSolutions()[slug];
      if (known && readSolved().includes(slug)) {
        setSolution(known);
        setVerdict("right");
      } else {
        setSolution(null);
        setVerdict("none");
      }
      setRestored(true);
    };
    if (firstStage.stage && progress.found.length) {
      resumeEnquete(slug, progress.found)
        .then((result) => restore(result?.view ?? firstStage, progress.found.slice(0, result?.solved ?? 0)))
        .catch(() => restore(firstStage, []));
    } else restore(firstStage, []);
    return () => {
      cancelled = true;
    };
  }, [firstStage, resetCount]);

  const showHint = () => {
    const next = Math.min(hintCount + 1, enquete.hints.length);
    setHintCount(next);
    saveProgress(enquete.slug, { hints: next });
  };

  const toggleTable = (name: string) => {
    const next = openTable === name ? null : name;
    setOpenTable(next);
    saveProgress(enquete.slug, { openTable: next });
  };

  const restart = () => {
    if (!window.confirm("Effacer toute ton avancée sur cette enquête (code, blocs, notes, indices) ?")) return;
    clearCase(enquete.slug);
    setResetCount((value) => value + 1);
  };

  const chooseMode = (next: Mode) => {
    setMode(next);
    try {
      localStorage.setItem("enquetes-mode", next);
    } catch {
      /* stockage indisponible */
    }
  };

  const saveNotes = (value: string) => {
    setNotes(value);
    try {
      localStorage.setItem(`enquete-${enquete.slug}-notes`, value);
    } catch {
      /* stockage indisponible */
    }
  };

  const accuse = async (event: FormEvent) => {
    event.preventDefault();
    if (!answer.trim() || checking) return;
    setChecking(true);
    const result = await checkAccusation(enquete.slug, answer, found, { hints: hintCount, attempts }).catch(() => ({ correct: false as const }));
    setChecking(false);
    if (result.correct && result.rewards?.length) setRewards(result.rewards);
    if (result.correct && result.next) {
      // Un coupable de trouvé, mais l'enquête continue : l'étape suivante est déjà enregistrée.
      const solved = [...found, result.culprit];
      setFound(solved);
      setTwist({ culprit: result.culprit, explanation: result.explanation, twist: result.twist ?? "", next: result.next });
      saveProgress(enquete.slug, { found: solved, hints: 0, attempts: 0, answer: "" });
    } else if (result.correct) {
      const final: Solution = { culprit: result.culprit, explanation: result.explanation };
      setSolution(final);
      setVerdict("right");
      markSolved(enquete.slug, final);
      saveProgress(enquete.slug, { answer: "" });
      void import("canvas-confetti").then(({ default: confetti }) =>
        confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 }, colors: ["#ea580c", "#fdba74", "#fef3c7", "#16a34a"] }),
      );
    } else {
      setVerdict("wrong");
      setAttempts(attempts + 1);
      saveProgress(enquete.slug, { attempts: attempts + 1 });
    }
  };

  const openNextStage = () => {
    if (!twist) return;
    setEnquete(twist.next);
    setTwist(null);
    setHintCount(0);
    setAttempts(0);
    setAnswer("");
    setVerdict("none");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stage = enquete.stage;

  return (
    <div className="enq-page">
      {rewards.length > 0 ? <RewardsDialog rewards={rewards} onClose={() => setRewards([])} /> : null}
      <header className="enq-head">
        <Link href="/enquetes" className="enq-back">
          <ArrowLeft size={16} /> Toutes les enquêtes
        </Link>
        <div className="enq-head-main">
          <p className="enq-eyebrow">
            Enquête {enquete.numero}, niveau {enquete.difficulty.toLowerCase()}
          </p>
          <h1>{enquete.title}</h1>
          {stage ? (
            <ol className="enq-steps" aria-label={`Étape ${stage.index + 1} sur ${stage.total}`}>
              {Array.from({ length: stage.total }, (_, index) => {
                const done = index < stage.index || (index === stage.index && (verdict === "right" || twist !== null));
                return (
                  <li key={index} className={done ? "is-done" : index === stage.index ? "is-current" : ""} aria-current={index === stage.index ? "step" : undefined}>
                    {done ? <Check size={12} strokeWidth={3} /> : index + 1}
                  </li>
                );
              })}
              <span>
                Étape {stage.index + 1} sur {stage.total}
              </span>
            </ol>
          ) : null}
        </div>
        <div className="enq-modes" role="tablist" aria-label="Façon de mener l'enquête">
          {MODES.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={mode === item.id}
                onClick={() => chooseMode(item.id)}
                className={mode === item.id ? "is-active" : ""}
              >
                <Icon size={16} />
                <span>
                  <b>{item.label}</b>
                  <small>{item.detail}</small>
                </span>
              </button>
            );
          })}
        </div>
      </header>

      <div className="enq-layout">
        <aside className="enq-dossier">
          <section className="enq-card">
            <h2>
              <Search size={15} /> {stage ? `Étape ${stage.index + 1} : ${stage.title}` : "Le dossier"}
            </h2>
            {enquete.solvedStages?.length ? (
              <details className="enq-history">
                <summary>
                  <History size={14} /> Ce qui a été établi ({enquete.solvedStages.length} {enquete.solvedStages.length > 1 ? "étapes" : "étape"})
                </summary>
                <ol>
                  {enquete.solvedStages.map((done, index) => (
                    <li key={done.title}>
                      <b>
                        Étape {index + 1} : {done.title}
                      </b>
                      <p>
                        Coupable désigné : <b>{done.culprit}</b>. {done.explanation}
                      </p>
                      <p className="enq-history-twist">{done.twist}</p>
                    </li>
                  ))}
                </ol>
              </details>
            ) : null}
            {enquete.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="enq-objective">
              <Target size={16} aria-hidden /> {enquete.objective}
            </p>
          </section>

          <section className="enq-card">
            <h2>
              <Table2 size={15} /> Les registres de la forêt
            </h2>
            <p className="enq-muted">
              {mode === "python" ? "Chaque table est un fichier CSV du même nom (par exemple animaux.csv)." : "Clique sur une table pour voir ses colonnes."}
            </p>
            <ul className="enq-tables">
              {enquete.tables.map((table) => (
                <li key={table.name}>
                  <button type="button" onClick={() => toggleTable(table.name)} aria-expanded={openTable === table.name}>
                    <code>{mode === "python" ? `${table.name}.csv` : table.name}</code>
                    <span>{table.rows.length} lignes</span>
                  </button>
                  {openTable === table.name ? (
                    <div className="enq-columns">
                      <p>{table.description}</p>
                      <ul>
                        {table.columns.map((column) => (
                          <li key={column.name}>
                            <code>{column.name}</code> {column.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>

          <section className="enq-card">
            <h2>
              <Lightbulb size={15} /> Indices{stage ? ` de l'étape ${stage.index + 1}` : ""}
            </h2>
            {enquete.hints.slice(0, hintCount).map((hint, index) => (
              <p key={hint} className="enq-hint">
                <b>{index + 1}.</b> {hint}
              </p>
            ))}
            {hintCount < enquete.hints.length ? (
              <button type="button" className="enq-ghost" onClick={showHint}>
                {hintCount === 0 ? "Afficher un indice" : "Indice suivant"}
              </button>
            ) : (
              <p className="enq-muted">Tu as tous les indices !</p>
            )}
          </section>

          <section className="enq-card">
            <h2>
              <NotebookPen size={15} /> Carnet d'enquête
            </h2>
            <textarea
              className="enq-notes"
              value={notes}
              onChange={(event) => saveNotes(event.target.value)}
              placeholder="Note ici tes pistes : numéros de rapport, suspects, alibis"
              rows={4}
            />
            <p className="enq-saved">Ton avancée est gardée sur cet appareil.</p>
            <button type="button" className="enq-reset" onClick={restart}>
              <RotateCcw size={13} /> Recommencer l'enquête à zéro
            </button>
          </section>
        </aside>

        <main className="enq-work">
          {restored && mode === "blockly" ? <BlocklyMode key={`${enquete.slug}-blockly-${resetCount}`} enquete={enquete} /> : null}
          {restored && mode === "python" ? <CodeMode key={`${enquete.slug}-python-${resetCount}`} enquete={enquete} language="python" /> : null}
          {restored && mode === "sql" ? <CodeMode key={`${enquete.slug}-sql-${resetCount}`} enquete={enquete} language="sql" /> : null}

          <form className={`enq-accuse ${verdict === "right" ? "is-solved" : ""} ${twist ? "is-twist" : ""}`} onSubmit={accuse}>
            {twist && stage ? (
              <div className="enq-solved" role="status">
                <div className="enq-solved-fox is-twist" aria-hidden />
                <div>
                  <p className="enq-eyebrow">
                    Coupable désigné : {twist.culprit}. Vraiment ?
                  </p>
                  <h2>Pas si vite…</h2>
                  <p>{twist.explanation}</p>
                  <p className="enq-twist">{twist.twist}</p>
                  <button type="button" className="enq-run-button" onClick={openNextStage}>
                    Aller plus loin : étape {stage.index + 2} sur {stage.total} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ) : verdict === "right" && solution ? (
              <div className="enq-solved">
                <div className="enq-solved-fox" aria-hidden />
                <div>
                  <p className="enq-eyebrow">{stage ? "Affaire enfin résolue !" : "Affaire résolue !"}</p>
                  <h2>Le coupable est {solution.culprit}.</h2>
                  <p>{solution.explanation}</p>
                  <Link href={next ? `/enquetes/${next.slug}` : "/enquetes"} className="enq-run-button">
                    {next ? `Enquête suivante : ${next.title}` : "Retour aux enquêtes"}
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <label htmlFor="enq-answer">
                  <b>Tu as trouvé ?</b> Écris le nom du coupable.
                </label>
                <div className="enq-accuse-row">
                  <input
                    id="enq-answer"
                    value={answer}
                    onChange={(event) => {
                      setAnswer(event.target.value);
                      saveProgress(enquete.slug, { answer: event.target.value });
                      if (verdict === "wrong") setVerdict("none");
                    }}
                    placeholder="Nom du coupable"
                    autoComplete="off"
                  />
                  <button type="submit" className="enq-run-button" disabled={checking}>
                    {checking ? "Vérification en cours" : "Accuser"}
                  </button>
                </div>
                {verdict === "wrong" ? (
                  <p className="enq-error" role="alert">
                    Ce n'est pas le bon suspect.{" "}
                    {attempts >= 2 && hintCount < enquete.hints.length ? "Un indice pourrait t'aider." : "Relis les témoignages et vérifie chaque condition."}
                  </p>
                ) : null}
              </>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}
