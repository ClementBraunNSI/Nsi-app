"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Code2,
  Copy,
  Lightbulb,
  LoaderCircle,
  Play,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import Board from "./Board";
import { CHAPTERS, COMMANDS } from "./commands";
import { executeStudentCode, translatePythonError } from "./engine";
import { LEVELS, getLevel } from "./levels";
import type { Direction, GameStatus, Position, SavedProgress } from "./types";
import { ahead, buildWorld, countCodeLines, isBlocked, samePos, turn } from "./world";
import styles from "./academy.module.css";
import SimpleCodeEditor, {
  type SimpleCodeEditorHandle,
} from "@/components/interactive/SimpleCodeEditor";

const STORAGE_PREFIX = "fox-academy-v2";

function generateResumeCode() {
  if (typeof window === "undefined" || !window.crypto) {
    return `FOX-${Date.now().toString(36).toUpperCase()}`;
  }
  const bytes = new Uint8Array(4);
  window.crypto.getRandomValues(bytes);
  const raw = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `FOX-${raw.toUpperCase()}`;
}

export default function FoxAcademy() {
  const [resumeCode, setResumeCode] = useState("");
  const [resumeInput, setResumeInput] = useState("");
  const [loadStatus, setLoadStatus] = useState("");
  const [levelId, setLevelId] = useState(1);
  const [completed, setCompleted] = useState<number[]>([]);
  const [codeByLevel, setCodeByLevel] = useState<Record<number, string>>({});
  const [attemptsByLevel, setAttemptsByLevel] = useState<Record<number, number>>({});
  const [code, setCode] = useState(LEVELS[0].starter);
  const [world, setWorld] = useState(() => buildWorld(LEVELS[0]));
  const [foxPos, setFoxPos] = useState<Position>({ x: 0, y: 0 });
  const [foxDir, setFoxDir] = useState<Direction>(LEVELS[0].startDir);
  const [status, setStatus] = useState<GameStatus>("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [stars, setStars] = useState(0);
  const [foxAction, setFoxAction] = useState<"idle" | "walk" | "turn" | "read" | "bump">("idle");
  const [stepState, setStepState] = useState({ current: 0, total: 0 });
  const [drawerTab, setDrawerTab] = useState<"memo" | "save">("memo");
  const [showHint, setShowHint] = useState(false);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const pyodideRef = useRef<any>(null);
  const pyodideLoadingRef = useRef(false);
  const editorRef = useRef<SimpleCodeEditorHandle>(null);
  const cancelRef = useRef(false);
  const hydratingRef = useRef(false);

  const level = useMemo(() => getLevel(levelId), [levelId]);
  const maxUnlocked = Math.max(1, ...completed.map((id) => id + 1), 1);

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
      const data: SavedProgress = JSON.parse(raw);
      const nextId = data.levelId && LEVELS.some((item) => item.id === data.levelId) ? data.levelId : 1;
      setLevelId(nextId);
      setCompleted(data.completed || []);
      setAttemptsByLevel(data.attemptsByLevel || {});
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
    const payload: SavedProgress = {
      resumeCode,
      levelId,
      completed,
      codeByLevel: { ...codeByLevel, [levelId]: code },
      attemptsByLevel,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(`${STORAGE_PREFIX}-${resumeCode}`, JSON.stringify(payload));
    } catch {
      /* quota */
    }
  }, [resumeCode, levelId, code, completed, attemptsByLevel, codeByLevel]);

  const resetWorld = useCallback((id: number, keepCode = true) => {
    const next = getLevel(id);
    const nextWorld = buildWorld(next, Date.now());
    cancelRef.current = true;
    setWorld(nextWorld);
    setFoxPos(nextWorld.start);
    setFoxDir(nextWorld.startDir);
    setStatus("idle");
    setLogs([]);
    setStars(0);
    setFoxAction("idle");
    setStepState({ current: 0, total: 0 });
    setIsRunning(false);
    if (!keepCode) {
      setCode(codeByLevel[id] || next.starter);
    }
  }, [codeByLevel]);

  useEffect(() => {
    const next = getLevel(levelId);
    const nextWorld = buildWorld(next);
    setWorld(nextWorld);
    setFoxPos(nextWorld.start);
    setFoxDir(nextWorld.startDir);
    setStatus("idle");
    setLogs([]);
    setStars(0);
    setFoxAction("idle");
    setStepState({ current: 0, total: 0 });
    setShowHint(false);
    setCode(codeByLevel[levelId] || next.starter);
  }, [levelId]); // eslint-disable-line react-hooks/exhaustive-deps

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
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });
        pyodideRef.current = pyodide;
        window.pyodide = pyodide;
        setIsPyodideReady(true);
      } catch (error: any) {
        setLogs([`Impossible de charger Python : ${error?.message || error}`]);
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
      setLogs(["Impossible de charger l'interpréteur Python (réseau)."]);
      pyodideLoadingRef.current = false;
    };
    document.body.appendChild(script);
  }, [isPyodideReady]);

  const insertCommand = (snippet: string) => {
    const editor = editorRef.current;
    if (!editor) {
      setCode((prev) => `${prev.trimEnd()}\n${snippet}\n`);
      return;
    }
    editor.insertText(snippet);
  };

  const run = async () => {
    if (!pyodideRef.current || isRunning) return;
    const lines = countCodeLines(code);
    if (level.maxLines && lines > level.maxLines) {
      setLogs([`Ce défi autorise au plus ${level.maxLines} lignes. Une boucle permet d'écrire moins.`]);
      setStatus("lost");
      return;
    }

    cancelRef.current = false;
    setIsRunning(true);
    setStatus("playing");
    setLogs([]);
    setStars(0);
    setFoxAction("idle");
    setStepState({ current: 0, total: 0 });
    setFoxPos(world.start);
    setFoxDir(world.startDir);
    setAttemptsByLevel((prev) => ({ ...prev, [level.id]: (prev[level.id] || 0) + 1 }));
    setCodeByLevel((prev) => ({ ...prev, [level.id]: code }));

    try {
      const result = await executeStudentCode(pyodideRef.current, code, level, world);
      if (result.actions.length === 0 && result.error) {
        setLogs([result.error]);
        setStatus("lost");
        setFoxAction("bump");
        setIsRunning(false);
        return;
      }
      const outcome = await animate(result.actions);
      if (cancelRef.current) return;
      if (result.error && !outcome.won) {
        setLogs([result.error]);
      } else if (!outcome.won) {
        setLogs([
          outcome.bumped
            ? "Le renard a heurté un obstacle."
            : "Le renard n'est pas arrivé sur la poule. Relis le chemin, instruction par instruction.",
        ]);
        setStatus("lost");
      }
    } catch (error: any) {
      setLogs([translatePythonError(error?.message || String(error))]);
      setStatus("lost");
      setFoxAction("bump");
    } finally {
      setIsRunning(false);
    }
  };

  const animate = async (actions: { type: string }[]) => {
    let pos = { ...world.start };
    let dir = world.startDir;
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    setStepState({ current: 0, total: actions.length });

    for (let index = 0; index < actions.length; index += 1) {
      const action = actions[index];
      if (cancelRef.current) return { won: false, bumped: false };
      setStepState({ current: index + 1, total: actions.length });

      if (action.type === "TURN_LEFT") {
        setFoxAction("turn");
        await wait(130);
        dir = turn(dir, "LEFT");
        setFoxDir(dir);
        await wait(150);
      } else if (action.type === "TURN_RIGHT") {
        setFoxAction("turn");
        await wait(130);
        dir = turn(dir, "RIGHT");
        setFoxDir(dir);
        await wait(150);
      } else if (action.type === "READ") {
        setFoxAction("read");
        await wait(360);
      } else if (action.type === "MOVE") {
        setFoxAction("walk");
        const next = ahead(pos, dir);
        if (isBlocked(world, next)) {
          await wait(170);
          setFoxAction("bump");
          setStatus("lost");
          return { won: false, bumped: true };
        }
        await wait(100);
        pos = next;
        setFoxPos({ ...pos });
        await wait(230);
      }
    }
    await wait(200);
    if (samePos(pos, world.goal)) {
      const lines = countCodeLines(code);
      const earned = lines <= level.bestLines ? 3 : lines <= level.bestLines + 2 ? 2 : 1;
      setStars(earned);
      setStatus("won");
      setFoxAction("idle");
      setCompleted((prev) => (prev.includes(level.id) ? prev : [...prev, level.id]));
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.55 } });
      } catch {
        /* ignore */
      }
      return { won: true, bumped: false };
    }
    setFoxAction("idle");
    return { won: false, bumped: false };
  };

  const goTo = (id: number) => {
    if (id < 1 || id > LEVELS.length) return;
    if (id > maxUnlocked) return;
    setShowHint(false);
    setLevelId(id);
  };

  const loadResume = () => {
    const candidate = resumeInput.trim().toUpperCase();
    if (!candidate) {
      setLoadStatus("Saisis un code de reprise.");
      return;
    }
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-${candidate}`);
    if (!raw) {
      setLoadStatus("Aucune sauvegarde pour ce code.");
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

  return (
    <div className={styles.academy}>
      <div className={styles.frame}>
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <div className={styles.crest} aria-hidden="true">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <p className={styles.eyebrow}>L'académie des renards · {chapter.label}</p>
            <h1 className={styles.title}>{level.id}. {level.title}</h1>
          </div>
        </div>
        <div className={styles.levelNav}>
          <button
            type="button"
            onClick={() => goTo(levelId - 1)}
            disabled={levelId === 1}
            className={styles.roundButton}
            aria-label="Défi précédent"
          >
            <ChevronLeft size={18} />
          </button>
          <span className={styles.levelCount}>{level.id} / {LEVELS.length}</span>
          <button
            type="button"
            onClick={() => goTo(levelId + 1)}
            disabled={levelId === LEVELS.length || levelId >= maxUnlocked}
            className={styles.roundButton}
            aria-label="Défi suivant"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </header>

      <nav className={styles.trail} aria-label="Parcours pédagogique">
        {LEVELS.map((item) => {
          const done = completed.includes(item.id);
          const locked = item.id > maxUnlocked && item.id !== levelId;
          const startsChapter = item.id === 1 || LEVELS[item.id - 2]?.chapter !== item.chapter;
          return (
            <div key={item.id} className="contents">
            {startsChapter && <span className={styles.trailChapter}>{CHAPTERS[item.chapter].label.split("·")[1]}</span>}
            <button
              type="button"
              disabled={locked}
              onClick={() => goTo(item.id)}
              className={`${styles.trailDot} ${
                item.id === levelId ? styles.trailDotCurrent : done ? styles.trailDotDone : ""
              }`}
              aria-label={`Défi ${item.id} : ${item.title}${locked ? " (verrouillé)" : ""}`}
            >
              {done && item.id !== levelId ? <Check size={12} className="mx-auto" /> : item.id}
            </button>
            </div>
          );
        })}
      </nav>

      <div className={styles.workspace}>
        <section className={styles.console}>
          <article className={styles.mission}>
            <p className={styles.missionLabel}>Mission · {chapter.concept}</p>
            <p className={styles.missionText}>{level.mission}</p>
            <div className={styles.concepts}>
              {level.concepts.map((concept) => <span key={concept} className={styles.concept}>{concept}</span>)}
              <button type="button" className={styles.concept} onClick={() => setShowHint((value) => !value)}>
                <Lightbulb size={11} className="inline -mt-0.5 mr-1" />
                {showHint ? "Masquer l'indice" : "Afficher l'indice"}
              </button>
            </div>
            {showHint && (
              <div key={level.id} className={styles.hintPanel}>
                <Lightbulb size={15} />
                <span>{level.hint}</span>
              </div>
            )}
          </article>

          <div className={styles.commandDock}>
            <div className={styles.commandDockHeader}>
              <span>Fonctions autorisées dans ce défi</span>
              <span>cliquer pour insérer</span>
            </div>
            <div className={styles.commands}>
              {allowed.map((command) => (
                <button
                  key={command.id}
                  type="button"
                  onClick={() => insertCommand(`${command.insert}\n`)}
                  className={styles.command}
                  title={command.description}
                >
                  <Copy size={12} />
                  {command.code}
                </button>
              ))}
            </div>
          </div>

          <article className={styles.editorShell}>
            <div className={styles.editorTop}>
              <div className={styles.editorFile}>
                <span className={styles.windowDots}><span /><span /><span /></span>
                <Code2 size={13} />
                mission_{String(level.id).padStart(2, "0")}.py
              </div>
              <button
                type="button"
                onClick={() => setCode(level.starter)}
                className={styles.resetCode}
                title="Réinitialiser le code"
              >
                <RotateCcw size={15} />
                Recommencer
              </button>
            </div>
            <div className={styles.editor}>
              <SimpleCodeEditor
                ref={editorRef}
                height="100%"
                language="python"
                value={code}
                onChange={setCode}
                ariaLabel="Programme Python du renard"
              />
            </div>
            <div className={styles.runbar}>
              <p className={styles.lineCount}>
                {lines} ligne{lines > 1 ? "s" : ""}
                {level.maxLines ? ` · max ${level.maxLines}` : ""}
              </p>
              <button
                type="button"
                onClick={run}
                disabled={isRunning || !isPyodideReady}
                className={styles.runButton}
              >
                {isRunning || !isPyodideReady
                  ? <LoaderCircle size={15} className="animate-spin" />
                  : <Play size={15} fill="currentColor" />}
                {isRunning ? "Exécution…" : isPyodideReady ? "Exécuter" : "Chargement Python…"}
              </button>
            </div>

            {logs.length > 0 && status !== "won" && (
            <div className={styles.feedback} role="alert">
              <CircleHelp size={17} className="shrink-0" />
              <div>
              {logs.map((log) => (
                <p key={log}>{log}</p>
              ))}
              </div>
            </div>
            )}
          </article>
        </section>

        <section className={styles.stageColumn}>
          <div className="relative flex flex-1">
            <Board
              world={world}
              foxPos={foxPos}
              foxDir={foxDir}
              foxAction={foxAction}
              signLabel={signLabel}
              levelId={level.id}
              levelTitle={level.title}
              step={stepState.current}
              totalSteps={stepState.total}
              chapter={level.chapter}
            />

            {status === "won" && (
              <div className={styles.victory}>
                <div className={styles.victoryCard}>
                  <div className={styles.victoryFox} role="img" aria-label="Renard qui célèbre" />
                  <h2>Poule rattrapée !</h2>
                  <p className="mt-1 text-xs text-[#5b6f60]">
                    Programme terminé en {stepState.total} action{stepState.total > 1 ? "s" : ""}.
                  </p>
                  <div className={styles.stars} aria-label={`${stars} étoiles sur 3`}>
                    {[1, 2, 3].map((i) => (
                      <span key={i} className={i <= stars ? "" : styles.starOff}>★</span>
                    ))}
                  </div>
                  <div className={styles.victoryActions}>
                    <button
                      type="button"
                      onClick={() => resetWorld(level.id, true)}
                    >
                      Rejouer
                    </button>
                    {levelId < LEVELS.length && (
                      <button
                        type="button"
                        onClick={() => goTo(levelId + 1)}
                      >
                        Défi suivant
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.drawer}>
            <div className={styles.drawerTabs}>
            <button
              type="button"
              onClick={() => setDrawerTab("memo")}
              className={`${styles.drawerTab} ${drawerTab === "memo" ? styles.drawerTabActive : ""}`}
            >
              <BookOpen size={14} />
              Mémo Python
            </button>
            <button
              type="button"
              onClick={() => setDrawerTab("save")}
              className={`${styles.drawerTab} ${drawerTab === "save" ? styles.drawerTabActive : ""}`}
            >
              <Save size={14} />
              Sauvegarde
            </button>
            </div>

            <div className={styles.drawerContent}>
            {drawerTab === "memo" ? (
              <div className={styles.memoGrid}>
                {chapter.memo.map((block) => (
                  <div key={block.title} className={styles.memoCard}>
                    <strong>{block.title}</strong>
                    <pre>{block.body}</pre>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="mb-2">
                  Ton code de reprise : <strong className="font-mono text-[var(--fg)]">{resumeCode || "…"}</strong>
                  {" · "}{attemptsByLevel[level.id] || 0} tentative{(attemptsByLevel[level.id] || 0) > 1 ? "s" : ""} sur ce défi.
                </p>
                <div className={styles.resumePanel}>
                  <input
                    value={resumeInput}
                    onChange={(event) => setResumeInput(event.target.value.toUpperCase())}
                    placeholder="FOX-…"
                    aria-label="Code de reprise"
                  />
                  <button type="button" onClick={loadResume}>Reprendre</button>
                </div>
                {loadStatus && <p className="mt-2">{loadStatus}</p>}
              </>
            )}
            </div>
          </div>
        </section>
      </div>
      </div>
    </div>
  );
}
