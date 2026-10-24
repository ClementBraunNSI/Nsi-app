'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { checkExerciseSolution, type ExerciseCheckResult, type ExerciseSheetNav, type LabExercise } from '@/app/actions/getExercises';
import { supabase } from '@/lib/supabase';
import { loadPythonPackages } from '@/lib/pyodide-packages';
import {
  buildPythonCheckSource,
  everyTestPassed,
  parsePythonCheckResult,
  reportFromQuery,
  unexpectedRunReport,
  type RunReport,
} from '@/lib/python-check';
import { Achievement } from '@/lib/achievements';
import AchievementUnlockedModal from '@/components/AchievementUnlockedModal';
import SuccessModal from '@/components/SuccessModal';
import { ExerciseStatement } from '@/components/lab/ExerciseStatement';
import { LabEditor } from '@/components/lab/LabEditor';
import { LabOutput, type ConsoleState } from '@/components/lab/LabOutput';

const IDLE_CONSOLE: ConsoleState = { tone: 'idle', text: 'En attente d’exécution…' };

function cleanStatement(content: string) {
  if (!content) return '';
  const lines = content.split('\n');
  const firstLineIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstLineIndex === -1) return content;
  if (!lines[firstLineIndex].trim().startsWith('#')) return content;
  return [...lines.slice(0, firstLineIndex), ...lines.slice(firstLineIndex + 1)].join('\n');
}

function consoleFromReport(report: RunReport, emptyLine: string): ConsoleState {
  const prints = report.prints.replace(/\s+$/g, '');
  const testPrints = report.testPrints.replace(/\s+$/g, '');
  const stderr = report.stderr.replace(/\s+$/g, '');
  const parts = [prints];
  if (testPrints && testPrints !== prints) parts.push(testPrints);
  if (stderr) parts.push(stderr);
  const text = parts.filter(Boolean).join('\n\n');
  if (report.error) {
    return {
      tone: 'error',
      text: [report.error, text].filter(Boolean).join('\n\n'),
      detail: report.errorDetail,
    };
  }
  if (!text) return { tone: 'ok', text: emptyLine };
  return { tone: 'ok', text };
}

export function ExerciseWorkspace({ exercise, nav }: { exercise: LabExercise; nav: ExerciseSheetNav | null }) {
  const [code, setCode] = useState('');
  const [running, setRunning] = useState<'execute' | 'test' | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [pendingBadge, setPendingBadge] = useState<{ courseId: string; courseTitle: string } | null>(null);
  const [sqlResults, setSqlResults] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [report, setReport] = useState<RunReport | null>(null);
  const [statusLine, setStatusLine] = useState<string | null>(null);
  const [consoleState, setConsoleState] = useState<ConsoleState>(IDLE_CONSOLE);
  const [tab, setTab] = useState<'console' | 'tests'>('console');
  const [sqlDb, setSqlDb] = useState<any>(null);
  const [sqlJs, setSqlJs] = useState<any>(null);
  const pyodideRef = useRef<any>(null);
  const pendingQueueRef = useRef<Achievement[]>([]);
  const emptyLine = exercise.type === 'sql' ? 'Requête exécutée.' : '>>> Programme terminé.';

  useEffect(() => {
    const bootPyodide = async () => {
      try {
        // @ts-ignore
        if (!window.loadPyodide) return;
        // @ts-ignore
        pyodideRef.current = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
        });
      } catch (error) {
        console.error('Failed to load Pyodide', error);
      }
    };
    // @ts-ignore
    if (window.loadPyodide) {
      bootPyodide();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = () => { bootPyodide(); };
      document.body.appendChild(script);
    }

    const loadSql = async () => {
      try {
        // @ts-ignore
        const initSqlJs = (await import('sql.js')).default;
        const SQL = await initSqlJs({ locateFile: (file: string) => `/sql/${file}` });
        setSqlJs(SQL);
        setSqlDb(new SQL.Database());
      } catch (error) {
        console.error('Erreur lors du chargement de sql.js:', error);
      }
    };
    loadSql();

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const { data } = await supabase
        .from('user_progress')
        .select('exercise_id')
        .eq('user_id', session.user.id)
        .eq('exercise_id', exercise.id);
      setIsCompleted(Boolean(data && data.length > 0));
    };
    checkAuth();
  }, [exercise.id]);

  useEffect(() => {
    setCode('');
    setSqlResults(null);
    setReport(null);
    setStatusLine(null);
    setConsoleState(IDLE_CONSOLE);
    setTab('console');
    if (exercise.type === 'sql' && sqlJs) {
      setSqlDb(new sqlJs.Database());
    }
  }, [exercise.id, exercise.type, sqlJs]);

  const presentCheck = (outcome: ExerciseCheckResult) => {
    const next = outcome.report;
    setConsoleState(consoleFromReport(next, emptyLine));
    setReport(next);
    if (!outcome.recorded || !everyTestPassed(next) || next.saveWarning) return;
    setIsCompleted(true);
    const unlocked = outcome.newAchievements ?? [];
    if (outcome.newBadge) {
      pendingQueueRef.current = unlocked;
      setPendingBadge({ courseId: exercise.courseId, courseTitle: exercise.courseTitle });
      setShowSuccessModal(true);
      return;
    }
    if (unlocked.length > 0) {
      const [first, ...rest] = unlocked;
      pendingQueueRef.current = rest;
      setUnlockedAchievement(first);
    }
  };

  const ensurePython = async () => {
    if (pyodideRef.current) return pyodideRef.current;
    setStatusLine('Chargement de Python…');
    const started = Date.now();
    while (!pyodideRef.current && Date.now() - started < 20000) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    if (!pyodideRef.current) {
      throw new Error('Impossible de charger Python. Vérifiez votre connexion.');
    }
    return pyodideRef.current;
  };

  const runPython = async () => {
    const pyodide = await ensurePython();
    if (exercise.pythonPackages?.length) {
      setStatusLine(`Chargement des modules : ${exercise.pythonPackages.join(', ')}…`);
      await loadPythonPackages(pyodide, exercise.pythonPackages);
    }
    const leaked: string[] = [];
    pyodide.setStdout({ batched: (msg: string) => leaked.push(String(msg)) });
    pyodide.setStderr({ batched: (msg: string) => leaked.push(String(msg)) });
    const raw = await pyodide.runPythonAsync(buildPythonCheckSource(code, null));
    const next = parsePythonCheckResult(raw);
    if (!next.prints.trim() && leaked.length > 0) next.prints = leaked.join('\n');
    return next;
  };

  const handleExecute = async () => {
    setRunning('execute');
    setTab('console');
    setStatusLine(exercise.type === 'sql' ? 'Exécution de la requête SQL…' : 'Exécution du programme…');
    try {
      if (exercise.type === 'sql') {
        if (!sqlDb) {
          setConsoleState(consoleFromReport(unexpectedRunReport('Base de données non initialisée'), emptyLine));
          return;
        }
        setSqlResults(null);
        try {
          const results = sqlDb.exec(code);
          if (results.length > 0) {
            const lastResult = results[results.length - 1];
            setSqlResults({ columns: lastResult.columns, values: lastResult.values });
          }
          setConsoleState({ tone: 'ok', text: results.length > 0 ? 'Requête exécutée.' : emptyLine });
        } catch (error: any) {
          setConsoleState(consoleFromReport(reportFromQuery({ phase: 'student-error', message: error?.message }), emptyLine));
        }
        return;
      }

      const next = await runPython();
      setConsoleState(consoleFromReport(next, emptyLine));
    } catch (error: any) {
      setConsoleState(consoleFromReport(unexpectedRunReport(error?.message || 'Erreur inattendue.'), emptyLine));
    } finally {
      setStatusLine(null);
      setRunning(null);
    }
  };

  const handleTest = async () => {
    setRunning('test');
    setTab('tests');
    setReport(null);
    setStatusLine(exercise.type === 'sql' ? 'Vérification de la requête…' : 'Vérification…');
    try {
      if (exercise.type === 'sql' && sqlDb) {
        setSqlResults(null);
        try {
          const results = sqlDb.exec(code);
          if (results.length > 0) {
            const lastResult = results[results.length - 1];
            setSqlResults({ columns: lastResult.columns, values: lastResult.values });
          }
        } catch {
          setSqlResults(null);
        }
      }
      presentCheck(await checkExerciseSolution(exercise.id, code));
    } catch (error: any) {
      const next = unexpectedRunReport(error?.message || 'Erreur inattendue.');
      setConsoleState(consoleFromReport(next, emptyLine));
      setReport(next);
    } finally {
      setStatusLine(null);
      setRunning(null);
    }
  };

  const handleClear = () => {
    setConsoleState(IDLE_CONSOLE);
    setSqlResults(null);
    setReport(null);
    setStatusLine(null);
    setTab('console');
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('orange-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'F97316', fontStyle: 'bold' },
        { token: 'string', foreground: 'FDBA74' },
        { token: 'number', foreground: 'F97316' },
        { token: 'comment', foreground: '525252' },
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#ffffff',
        'editorCursor.foreground': '#F97316',
        'editor.lineHighlightBackground': '#2a2a2a',
      },
    });
  };

  const backHref = exercise.pagePath || '/';

  return (
    <div className="exercise-workspace">
      {showSuccessModal && pendingBadge && (
        <SuccessModal
          courseTitle={pendingBadge.courseTitle}
          courseId={pendingBadge.courseId}
          onConfirm={() => {
            setShowSuccessModal(false);
            setPendingBadge(null);
            const [first, ...rest] = pendingQueueRef.current;
            pendingQueueRef.current = rest;
            setUnlockedAchievement(first ?? null);
          }}
          onDismiss={() => {
            setShowSuccessModal(false);
            setPendingBadge(null);
            pendingQueueRef.current = [];
          }}
        />
      )}
      {unlockedAchievement && (
        <AchievementUnlockedModal
          achievement={unlockedAchievement}
          onClose={() => {
            const [first, ...rest] = pendingQueueRef.current;
            pendingQueueRef.current = rest;
            setUnlockedAchievement(first ?? null);
          }}
        />
      )}

      <header className="exercise-toolbar">
        <Link href={backHref} className="exercise-back">
          <ArrowLeft size={16} aria-hidden />
          Retour au chapitre
        </Link>
        <div className="exercise-toolbar-center">
          <h1 title={exercise.label}>{exercise.label}</h1>
          {isCompleted ? (
            <span className="exercise-validated">
              <CheckCircle size={13} aria-hidden />
              Validé
            </span>
          ) : null}
        </div>
        {nav && nav.total > 0 ? (
          <div className="exercise-nav">
            <span className="exercise-nav-count">{nav.marker} / {nav.total}</span>
            <span className="exercise-nav-track" aria-hidden>
              <span style={{ width: `${(nav.index / nav.total) * 100}%` }} />
            </span>
            {nav.previous ? (
              <Link href={`/exercice/${encodeURIComponent(nav.previous.id)}`} className="exercise-nav-arrow" aria-label={`Exercice précédent : ${nav.previous.label}`}>
                <ChevronLeft size={16} />
              </Link>
            ) : (
              <button type="button" className="exercise-nav-arrow" disabled aria-label="Pas d’exercice précédent">
                <ChevronLeft size={16} />
              </button>
            )}
            {nav.next ? (
              <Link href={`/exercice/${encodeURIComponent(nav.next.id)}`} className="exercise-nav-arrow" aria-label={`Exercice suivant : ${nav.next.label}`}>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <button type="button" className="exercise-nav-arrow" disabled aria-label="Pas d’exercice suivant">
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        ) : null}
      </header>

      <div className="exercise-body">
        <ExerciseStatement label={exercise.label} content={cleanStatement(exercise.content)} />
        <div className="exercise-work">
          <LabEditor
            exercise={exercise}
            code={code}
            running={running}
            onCodeChange={setCode}
            onReset={() => setCode('')}
            onExecute={handleExecute}
            onTest={handleTest}
            beforeMount={handleEditorWillMount}
          />
          <LabOutput
            exercise={exercise}
            tab={tab}
            onTab={setTab}
            onClear={handleClear}
            consoleState={consoleState}
            sqlResults={sqlResults}
            report={report}
            statusLine={statusLine}
          />
        </div>
      </div>
    </div>
  );
}
