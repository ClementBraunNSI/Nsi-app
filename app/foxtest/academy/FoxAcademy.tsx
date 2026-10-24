"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  LoaderCircle,
  Lock,
  Map as MapIcon,
  Play,
  RotateCcw,
  Save,
  X,
} from "lucide-react";
import Board, { type FoxAction } from "./Board";
import { CHAPTERS, COMMANDS } from "./commands";
import { executeStudentCode, translatePythonError } from "./engine";
import { LEVELS, getLevel } from "./levels";
import { GAME_NAME } from "./meta";
import type { Action, ChapterId, Direction, GameStatus, Position, SavedProgress } from "./types";
import { ahead, buildWorld, countCodeLines, isBlocked, samePos, turn } from "./world";
import styles from "./academy.module.css";
import { CodeArea, type CodeAreaHandle } from "@/components/lab/CodeArea";

const STORAGE_PREFIX = "fox-academy-v2";
const CHAPTER_ORDER: ChapterId[] = ["sequence", "variables", "conditions", "for", "while"];

function generateResumeCode() {
  if (typeof window === "undefined" || !window.crypto) {
    return `FOX-${Date.now().toString(36).toUpperCase()}`;
  }
  const bytes = new Uint8Array(4);
  window.crypto.getRandomValues(bytes);
  const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `FOX-${raw.toUpperCase()}`;
}

function chapterName(id: ChapterId) {
  return CHAPTERS[id].label.split("·")[1]?.trim() || CHAPTERS[id].label;
}

type Feedback = { tone: "error" | "info"; text: string } | null;
type Step = Position & { dir: Direction };

export default function FoxAcademy() {
  const [resumeCode, setResumeCode] = useState("");
  const [resumeInput, setResumeInput] = useState("");
  const [loadStatus, setLoadStatus] = useState("");
  const [levelId, setLevelId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [codeByLevel, setCodeByLevel] = useState<Record<number, string>>({});
  const [attemptsByLevel, setAttemptsByLevel] = useState<Record<number, number>>({});
  const [starsByLevel, setStarsByLevel] = useState<Record<number, number>>({});
  const [code, setCode] = useState(LEVELS[0].starter);
  const [world, setWorld] = useState(() => buildWorld(LEVELS[0]));
  const [foxPos, setFoxPos] = useState<Position>(() => buildWorld(LEVELS[0]).start);
  const [foxDir, setFoxDir] = useState<Direction>(LEVELS[0].startDir);
  const [trail, setTrail] = useState<Step[]>([]);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [stars, setStars] = useState(0);
  const [foxAction, setFoxAction] = useState<FoxAction>("idle");
  const [stepState, setStepState] = useState({ current: 0, total: 0 });
  const [activeLine, setActiveLine] = useState(0);
  const [errorLine, setErrorLine] = useState(0);
  const [panel, setPanel] = useState<"none" | "hint" | "memo">("none");
  const [showMap, setShowMap] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [fast, setFast] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const editorRef = useRef<CodeAreaHandle>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef(false);
  const hydratingRef = useRef(false);

  const level = useMemo(() => getLevel(levelId), [levelId]);
  const maxUnlocked = Math.min(LEVELS.length, Math.max(1, ...completed.map((id) => id + 1)));

  // --- Sauvegarde locale (code de reprise) ---
  useEffect(() => {
    const last = window.localStorage.getItem(`${STORAGE_PREFIX}-last`);
    const created = last || generateResumeCode();
    setResumeCode(created);
    setResumeInput(created);
    window.localStorage.setItem(`${STORAGE_PREFIX}-last`, created);
  }, []);

  useEffect(() => {
    if (!resumeCode) return;
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-${resumeCode}`);
    if (!raw) return;
    try {
      hydratingRef.current = true;
      const data: SavedProgress & { starsByLevel?: Record<number, number> } = JSON.parse(raw);
      const nextId = data.levelId && LEVELS.some((item) => item.id === data.levelId) ? data.levelId : 1;
      setLevelId(nextId);
      setCompleted(data.completed || []);
      setAttemptsByLevel(data.attemptsByLevel || {});
      setStarsByLevel(data.starsByLevel || {});
      setCodeByLevel(data.codeByLevel || {});
      setCode(data.codeByLevel?.[nextId] || getLevel(nextId).starter);
      setLoadStatus("Progression chargée.");
    } catch {
      setLoadStatus("Sauvegarde illisible, nouvelle partie.");
    } finally {
      setTimeout(() => {
        hydratingRef.current = false;
      }, 0);
    }
  }, [resumeCode]);

  useEffect(() => {
    if (!resumeCode || hydratingRef.current) return;
    const payload = {
      resumeCode,
      levelId,
      completed,
      codeByLevel: { ...codeByLevel, [levelId]: code },
      attemptsByLevel,
      starsByLevel,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(`${STORAGE_PREFIX}-${resumeCode}`, JSON.stringify(payload));
    } catch {
      /* quota */
    }
  }, [resumeCode, levelId, code, completed, attemptsByLevel, codeByLevel, starsByLevel]);

  // --- Monde et renard ---
  const placeFox = useCallback((nextWorld: ReturnType<typeof buildWorld>) => {
    cancelRef.current = true;
    setWorld(nextWorld);
    setFoxPos(nextWorld.start);
    setFoxDir(nextWorld.startDir);
    setTrail([]);
    setStatus("idle");
    setFeedback(null);
    setStars(0);
    setFoxAction("idle");
    setStepState({ current: 0, total: 0 });
    setActiveLine(0);
    setErrorLine(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    placeFox(buildWorld(getLevel(levelId)));
    setPanel("none");
    setCode(codeByLevel[levelId] || getLevel(levelId).starter);
  }, [levelId]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Python (Pyodide) ---
  useEffect(() => {
    if (isPyodideReady || pyodideLoadingRef.current) return;
    pyodideLoadingRef.current = true;

    const init = async () => {
      try {
        if (!window.loadPyodide) throw new Error("Pyodide indisponible");
        if (window.pyodide) {
          pyodideRef.current = window.pyodide;
          setIsPyodideReady(true);
          return;
        }
        const pyodide = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/" });
        pyodideRef.current = pyodide;
        window.pyodide = pyodide;
        setIsPyodideReady(true);
      } catch (error: any) {
        setFeedback({ tone: "error", text: `Impossible de charger Python : ${error?.message || error}` });
        pyodideLoadingRef.current = false;
      }
    };

    if (window.loadPyodide) {
      void init();
      return;
    }
    const existing = document.querySelector('script[src*="pyodide.js"]');
    if (existing) {
      existing.addEventListener("load", () => void init());
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
    script.async = true;
    script.onload = () => void init();
    script.onerror = () => {
      setFeedback({ tone: "error", text: "Impossible de charger Python. Vérifie ta connexion puis recharge la page." });
      pyodideLoadingRef.current = false;
    };
    document.body.appendChild(script);
  }, [isPyodideReady]);

  // --- Exécution et animation ---
  const animate = async (actions: Action[]) => {
    let pos = { ...world.start };
    let dir = world.startDir;
    const speed = fast ? 0.45 : 1;
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms * speed));
    const steps: Step[] = [{ ...pos, dir }];
    setTrail([...steps]);
    setStepState({ current: 0, total: actions.length });

    for (let index = 0; index < actions.length; index += 1) {
      const action = actions[index];
      if (cancelRef.current) return { won: false, bumped: false };
      setStepState({ current: index + 1, total: actions.length });
      setActiveLine(action.line || 0);

      if (action.type === "TURN_LEFT" || action.type === "TURN_RIGHT") {
        setFoxAction("turn");
        await wait(140);
        dir = turn(dir, action.type === "TURN_LEFT" ? "LEFT" : "RIGHT");
        setFoxDir(dir);
        await wait(200);
      } else if (action.type === "READ") {
        setFoxAction("read");
        await wait(480);
      } else {
        setFoxAction("walk");
        const next = ahead(pos, dir);
        if (isBlocked(world, next)) {
          await wait(180);
          setFoxAction("bump");
          return { won: false, bumped: true };
        }
        await wait(110);
        pos = next;
        steps.push({ ...pos, dir });
        setFoxPos({ ...pos });
        setTrail([...steps]);
        await wait(260);
      }
    }
    await wait(180);
    setActiveLine(0);
    if (samePos(pos, world.goal)) {
      const lines = countCodeLines(code);
      const earned = lines <= level.bestLines ? 3 : lines <= level.bestLines + 2 ? 2 : 1;
      setStars(earned);
      setStarsByLevel((prev) => ({ ...prev, [level.id]: Math.max(prev[level.id] || 0, earned) }));
      setStatus("won");
      setFoxAction("idle");
      setCompleted((prev) => (prev.includes(level.id) ? prev : [...prev, level.id]));
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 }, colors: ["#f97316", "#fdba74", "#fef3c7", "#16a34a"] });
      } catch {
        /* ignore */
      }
      return { won: true, bumped: false };
    }
    setFoxAction("idle");
    return { won: false, bumped: false };
  };

  const run = async () => {
    if (!pyodideRef.current || isRunning) return;
    const lines = countCodeLines(code);
    if (level.maxLines && lines > level.maxLines) {
      setFeedback({ tone: "info", text: `Ce défi se résout en ${level.maxLines} lignes au plus (tu en as ${lines}). Une boucle permet d'écrire moins.` });
      setStatus("lost");
      return;
    }

    cancelRef.current = false;
    // Sur téléphone, le plateau est au-dessus de l'éditeur : on le ramène à l'écran pour voir le renard bouger.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsRunning(true);
    setStatus("playing");
    setFeedback(null);
    setErrorLine(0);
    setStars(0);
    setFoxAction("idle");
    setFoxPos(world.start);
    setFoxDir(world.startDir);
    setTrail([]);
    setAttemptsByLevel((prev) => ({ ...prev, [level.id]: (prev[level.id] || 0) + 1 }));
    setCodeByLevel((prev) => ({ ...prev, [level.id]: code }));

    try {
      const result = await executeStudentCode(pyodideRef.current, code, level, world);
      if (result.actions.length === 0 && result.error) {
        setFeedback({ tone: "error", text: result.error });
        setErrorLine(result.errorLine || 0);
        setStatus("lost");
        setFoxAction("bump");
        return;
      }
      const outcome = await animate(result.actions);
      if (cancelRef.current) return;
      if (!outcome.won) {
        setStatus("lost");
        setActiveLine(0);
        if (result.error) {
          setFeedback({ tone: "error", text: result.error });
          setErrorLine(result.errorLine || 0);
        } else {
          setFeedback({
            tone: "info",
            text: outcome.bumped
              ? "Le renard s'est cogné. Regarde la ligne surlignée et compte les cases."
              : "Le programme est fini, mais le renard n'est pas sur la poule. Suis ses empreintes pour voir où il s'est arrêté.",
          });
        }
      }
    } catch (error: any) {
      setFeedback({ tone: "error", text: translatePythonError(error?.message || String(error)) });
      setStatus("lost");
      setFoxAction("bump");
    } finally {
      setIsRunning(false);
    }
  };

  const runRef = useRef(run);
  runRef.current = run;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        void runRef.current();
      }
      if (event.key === "Escape") {
        setShowMap(false);
        setShowSave(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (id: number) => {
    if (id < 1 || id > LEVELS.length || id > maxUnlocked) return;
    setShowMap(false);
    setLevelId(id);
  };

  const loadResume = () => {
    const candidate = resumeInput.trim().toUpperCase();
    if (!candidate) {
      setLoadStatus("Saisis un code de reprise.");
      return;
    }
    if (!localStorage.getItem(`${STORAGE_PREFIX}-${candidate}`)) {
      setLoadStatus("Aucune sauvegarde pour ce code sur cet appareil.");
      return;
    }
    setResumeCode(candidate);
    window.localStorage.setItem(`${STORAGE_PREFIX}-last`, candidate);
    setLoadStatus("Partie reprise.");
  };

  const lines = countCodeLines(code);
  const chapter = CHAPTERS[level.chapter];
  const allowed = level.commands.map((id) => COMMANDS[id]);
  const signLabel = level.commands.includes("lire_panneau")
    ? world.signWord
    : level.commands.includes("lire_nombre")
      ? String(world.numberValue)
      : undefined;
  const progress = stepState.total > 0 ? Math.round((stepState.current / stepState.total) * 100) : 0;

  return (
    <div className={styles.academy}>
      {/* Barre du haut : nom, chapitres, navigation entre défis */}
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <Link href="/" className={styles.iconButton} aria-label="Retour à l'accueil" title="Retour à l'accueil">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <p className={styles.gameName}>{GAME_NAME}</p>
            <p className={styles.chapterName}>{chapter.label}</p>
          </div>
        </div>

        <ol className={styles.chapters} aria-label="Chapitres">
          {CHAPTER_ORDER.map((id) => {
            const levels = LEVELS.filter((item) => item.chapter === id);
            const done = levels.filter((item) => completed.includes(item.id)).length;
            const first = levels[0]?.id ?? 1;
            const current = level.chapter === id;
            const locked = first > maxUnlocked;
            return (
              <li key={id}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => goTo(Math.min(maxUnlocked, levels.find((item) => !completed.includes(item.id))?.id ?? first))}
                  className={`${styles.chapterPill} ${current ? styles.chapterPillCurrent : ""} ${done === levels.length ? styles.chapterPillDone : ""}`}
                  title={`${chapterName(id)} : ${done}/${levels.length} défis réussis`}
                >
                  {locked ? <Lock size={12} /> : done === levels.length ? <Check size={12} /> : null}
                  <span>{chapterName(id)}</span>
                  <i style={{ width: `${(done / levels.length) * 100}%` }} aria-hidden />
                </button>
              </li>
            );
          })}
        </ol>

        <div className={styles.levelNav}>
          <button type="button" onClick={() => goTo(levelId - 1)} disabled={levelId === 1} className={styles.iconButton} aria-label="Défi précédent">
            <ChevronLeft size={18} />
          </button>
          <button type="button" onClick={() => setShowMap(true)} className={styles.levelCount} title="Voir tous les défis">
            <MapIcon size={14} /> {level.id} / {LEVELS.length}
          </button>
          <button
            type="button"
            onClick={() => goTo(levelId + 1)}
            disabled={levelId === LEVELS.length || levelId >= maxUnlocked}
            className={styles.iconButton}
            aria-label="Défi suivant"
          >
            <ChevronRight size={18} />
          </button>
          <button type="button" onClick={() => setShowSave((value) => !value)} className={styles.iconButton} aria-label="Sauvegarde" title="Sauvegarde">
            <Save size={16} />
          </button>
          {showSave ? (
            <div className={styles.savePopover} role="dialog" aria-label="Sauvegarde">
              <p>
                Ton code de reprise : <strong>{resumeCode || "…"}</strong>
              </p>
              <p className={styles.muted}>Note-le pour reprendre ta partie sur cet appareil.</p>
              <div className={styles.resumeRow}>
                <input
                  value={resumeInput}
                  onChange={(event) => setResumeInput(event.target.value.toUpperCase())}
                  placeholder="FOX-…"
                  aria-label="Code de reprise"
                />
                <button type="button" onClick={loadResume}>
                  Reprendre
                </button>
              </div>
              {loadStatus ? <p className={styles.muted}>{loadStatus}</p> : null}
            </div>
          ) : null}
        </div>
      </header>

      <div className={styles.workspace}>
        {/* Plateau */}
        <section className={styles.stageColumn} aria-label="Plateau">
          <div className={styles.stageFrame} ref={stageRef}>
            <Board world={world} foxPos={foxPos} foxDir={foxDir} foxAction={foxAction} signLabel={signLabel} chapter={level.chapter} trail={trail} />

            {status === "won" ? (
              <div className={styles.victory}>
                <div className={styles.victoryCard}>
                  <div className={styles.victoryFox} role="img" aria-label="Renard qui célèbre" />
                  <h2>Poule rattrapée !</h2>
                  <div className={styles.stars} aria-label={`${stars} étoiles sur 3`}>
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={i <= stars ? "" : styles.starOff}>★</span>
                    ))}
                  </div>
                  <p>
                    {stars === 3
                      ? `Programme parfait : ${lines} ligne${lines > 1 ? "s" : ""}.`
                      : `Réussi en ${lines} lignes. Le meilleur programme en fait ${level.bestLines}.`}
                  </p>
                  <div className={styles.victoryActions}>
                    <button type="button" onClick={() => placeFox(buildWorld(level, Date.now()))}>
                      Rejouer
                    </button>
                    {levelId < LEVELS.length ? (
                      <button type="button" className={styles.primary} onClick={() => goTo(levelId + 1)}>
                        Défi suivant <ChevronRight size={16} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.stageBar}>
            <div className={styles.stepTrack} aria-hidden>
              <span style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.stepText}>
              {stepState.total > 0 ? `Étape ${stepState.current} / ${stepState.total}` : "Le renard attend ton programme"}
            </span>
            <button type="button" className={`${styles.chip} ${fast ? styles.chipOn : ""}`} onClick={() => setFast((value) => !value)} aria-pressed={fast}>
              {fast ? "🐇 Rapide" : "🐢 Normal"}
            </button>
            <button type="button" className={styles.chip} onClick={() => placeFox(buildWorld(level, Date.now()))} disabled={isRunning}>
              <RotateCcw size={13} /> Replacer
            </button>
          </div>
        </section>

        {/* Mission + programme */}
        <section className={styles.codeColumn} aria-label="Programme">
          <article className={styles.mission}>
            <p className={styles.missionEyebrow}>
              Défi {level.id} · {chapterName(level.chapter)}
              {starsByLevel[level.id] ? <span className={styles.missionStars}>{"★".repeat(starsByLevel[level.id])}</span> : null}
            </p>
            <h1 className={styles.missionTitle}>{level.title}</h1>
            <p className={styles.missionText}>{level.mission}</p>
            <div className={styles.missionActions}>
              <button type="button" className={`${styles.chip} ${panel === "hint" ? styles.chipOn : ""}`} onClick={() => setPanel(panel === "hint" ? "none" : "hint")}>
                <Lightbulb size={13} /> Indice
              </button>
              <button type="button" className={`${styles.chip} ${panel === "memo" ? styles.chipOn : ""}`} onClick={() => setPanel(panel === "memo" ? "none" : "memo")}>
                <BookOpen size={13} /> Aide-mémoire
              </button>
            </div>
            {panel === "hint" ? <p className={styles.hint}>{level.hint}</p> : null}
            {panel === "memo" ? (
              <div className={styles.memo}>
                {chapter.memo.map((block) => (
                  <div key={block.title}>
                    <strong>{block.title}</strong>
                    <pre>{block.body}</pre>
                  </div>
                ))}
              </div>
            ) : null}
          </article>

          <div className={styles.commands} aria-label="Fonctions disponibles">
            {allowed.map((command) => (
              <button
                key={command.id}
                type="button"
                onClick={() => editorRef.current?.insertLine(command.insert)}
                className={styles.command}
                title={`${command.description} Clique pour l'ajouter au programme.`}
              >
                {command.code}
              </button>
            ))}
          </div>

          <div className={styles.editor}>
            <div className={styles.editorBar}>
              <span>renard.py</span>
              <button type="button" onClick={() => setCode(level.starter)} title="Revenir au code de départ" disabled={isRunning}>
                <RotateCcw size={13} /> Effacer
              </button>
            </div>
            <div className={styles.editorBody}>
              <CodeArea
                ref={editorRef}
                value={code}
                onChange={(value) => {
                  setCode(value);
                  if (errorLine) setErrorLine(0);
                }}
                language="python"
                activeLine={activeLine}
                errorLine={errorLine}
                ariaLabel="Programme Python du renard"
                placeholder="# Écris ici les instructions du renard"
              />
            </div>
          </div>

          {feedback ? (
            <div className={`${styles.feedback} ${feedback.tone === "error" ? styles.feedbackError : ""}`} role="alert">
              <span aria-hidden>{feedback.tone === "error" ? "🦊💥" : "🦊"}</span>
              <p>
                {feedback.text}
                {errorLine ? <em> (ligne {errorLine})</em> : null}
              </p>
              <button type="button" onClick={() => setFeedback(null)} aria-label="Fermer le message">
                <X size={14} />
              </button>
            </div>
          ) : null}

          <div className={styles.runBar}>
            <p className={styles.lineCount}>
              {lines} ligne{lines > 1 ? "s" : ""}
              {level.maxLines ? <> · max {level.maxLines}</> : null}
              <span className={styles.shortcut}>Ctrl + Entrée</span>
            </p>
            <button type="button" onClick={run} disabled={isRunning || !isPyodideReady} className={styles.runButton}>
              {isRunning || !isPyodideReady ? <LoaderCircle size={17} className="animate-spin" /> : <Play size={17} fill="currentColor" />}
              {isRunning ? "Le renard avance…" : isPyodideReady ? "Lancer le renard" : "Chargement de Python…"}
            </button>
          </div>
        </section>
      </div>

      {/* Carte de tous les défis */}
      {showMap ? (
        <div className={styles.mapBackdrop} onClick={(event) => event.target === event.currentTarget && setShowMap(false)}>
          <div className={styles.map} role="dialog" aria-modal="true" aria-labelledby="carte-titre">
            <div className={styles.mapHead}>
              <h2 id="carte-titre">Tous les défis</h2>
              <button type="button" className={styles.iconButton} onClick={() => setShowMap(false)} aria-label="Fermer">
                <X size={18} />
              </button>
            </div>
            {CHAPTER_ORDER.map((id) => (
              <section key={id} className={styles.mapChapter}>
                <h3>
                  {CHAPTERS[id].label} <span>{CHAPTERS[id].concept}</span>
                </h3>
                <div className={styles.mapLevels}>
                  {LEVELS.filter((item) => item.chapter === id).map((item) => {
                    const done = completed.includes(item.id);
                    const locked = item.id > maxUnlocked;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        disabled={locked}
                        onClick={() => goTo(item.id)}
                        className={`${styles.mapLevel} ${item.id === levelId ? styles.mapLevelCurrent : ""} ${done ? styles.mapLevelDone : ""}`}
                      >
                        <span className={styles.mapNumber}>{locked ? <Lock size={13} /> : done ? <Check size={14} /> : item.id}</span>
                        <span className={styles.mapTitle}>{item.title}</span>
                        {starsByLevel[item.id] ? <span className={styles.mapStars}>{"★".repeat(starsByLevel[item.id])}</span> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
