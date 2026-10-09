'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import { getExerciseVerification, type LabExercise } from '@/app/actions/getExercises';
import { saveValidatedExercise } from '@/app/actions/progress';
import { supabase } from '@/lib/supabase';
import { loadPythonPackages } from '@/lib/pyodide-packages';
import { Achievement } from '@/lib/achievements';
import AchievementUnlockedModal from '@/components/AchievementUnlockedModal';
import SuccessModal from '@/components/SuccessModal';
import { ExerciseStatement } from '@/components/lab/ExerciseStatement';
import { LabEditor } from '@/components/lab/LabEditor';
import { LabOutput } from '@/components/lab/LabOutput';

function cleanStatement(content: string) {
  if (!content) return '';
  const lines = content.split('\n');
  const firstLineIndex = lines.findIndex((line) => line.trim().length > 0);
  if (firstLineIndex === -1) return content;
  if (!lines[firstLineIndex].trim().startsWith('#')) return content;
  return [...lines.slice(0, firstLineIndex), ...lines.slice(firstLineIndex + 1)].join('\n');
}

export function ExerciseWorkspace({ exercise }: { exercise: LabExercise }) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [pendingBadge, setPendingBadge] = useState<{ courseId: string; courseTitle: string } | null>(null);
  const [sqlResults, setSqlResults] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [sqlDb, setSqlDb] = useState<any>(null);
  const [sqlJs, setSqlJs] = useState<any>(null);
  const pyodideRef = useRef<any>(null);
  const pendingAchievementRef = useRef<Achievement | null>(null);

  useEffect(() => {
    const bootPyodide = async () => {
      try {
        // @ts-ignore
        if (!window.loadPyodide) return;
        // @ts-ignore
        pyodideRef.current = await window.loadPyodide();
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
      setUserId(session.user.id);
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
    if (exercise.type === 'sql') {
      if (sqlJs) {
        setSqlDb(new sqlJs.Database());
        setOutput(['> Base de données SQL initialisée.']);
      }
    } else {
      setOutput(['> Environnement Python prêt.']);
    }
  }, [exercise.id, exercise.type, sqlJs]);

  const saveProgress = async () => {
    let id = userId;
    if (!id) {
      const { data: { session } } = await supabase.auth.getSession();
      id = session?.user?.id ?? null;
      if (id) setUserId(id);
    }
    if (!id) return;
    const result = await saveValidatedExercise({
      exerciseId: exercise.id,
      courseId: exercise.courseId,
      courseTitle: exercise.courseTitle,
    });
    if (result.error) {
      setOutput((prev) => [...prev, '[Erreur] La validation n’a pas pu être enregistrée.']);
      return;
    }
    setIsCompleted(true);
    if (result.newBadge && result.newAchievement) {
      pendingAchievementRef.current = result.newAchievement;
      setPendingBadge({ courseId: exercise.courseId, courseTitle: exercise.courseTitle });
      setShowSuccessModal(true);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);

    if (exercise.type === 'sql') {
      if (!sqlDb) {
        setOutput(['[Erreur] Base de données non initialisée']);
        setIsRunning(false);
        return;
      }

      setOutput(['> Exécution de la requête SQL...']);
      setSqlResults(null);

      try {
        let results: any[] = [];
        try {
          results = sqlDb.exec(code);
        } catch (error: any) {
          setOutput((prev) => [...prev, `[Erreur SQL] ${error.message}`]);
          setIsRunning(false);
          return;
        }

        if (results.length > 0) {
          const lastResult = results[results.length - 1];
          setSqlResults({ columns: lastResult.columns, values: lastResult.values });
          setOutput((prev) => [...prev, `> ${results.length} requête(s) exécutée(s).`]);
        } else {
          setOutput((prev) => [...prev, '> Commande exécutée avec succès.']);
        }

        const sqlTests = exercise.hasVerification ? await getExerciseVerification(exercise.id) : null;
        if (exercise.hasVerification && !sqlTests) {
          setOutput((prev) => [...prev, '[Erreur] Impossible de charger le jeu de tests.']);
          setIsRunning(false);
          return;
        }

        if (sqlTests) {
          setOutput((prev) => [...prev, '> Vérification...']);
          try {
            const verifRes = sqlDb.exec(sqlTests);
            if (results.length === 0 && verifRes.length > 0) {
              const lastResult = verifRes[verifRes.length - 1];
              setSqlResults({ columns: lastResult.columns, values: lastResult.values });
            }
            await saveProgress();
            setOutput((prev) => [...prev, '✅ Exercice validé !']);
          } catch (error: any) {
            setOutput((prev) => [...prev, `[Erreur Vérification] ${error.message}`]);
          }
        } else {
          await saveProgress();
        }
      } catch (error: any) {
        setOutput((prev) => [...prev, `[Erreur] ${error.message}`]);
      } finally {
        setIsRunning(false);
      }
      return;
    }

    setOutput(['> Initialisation...']);
    if (!pyodideRef.current) {
      setOutput(['[Info] Environnement Python en cours de chargement... Veuillez patienter.']);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (!pyodideRef.current) {
        setOutput(['[Erreur] Impossible de charger Python. Vérifiez votre connexion.']);
        setIsRunning(false);
        return;
      }
    }

    try {
      setOutput(['> Exécution du script...']);
      if (exercise.pythonPackages?.length) {
        setOutput((prev) => [...prev, `> Chargement des modules : ${exercise.pythonPackages!.join(', ')}...`]);
        await loadPythonPackages(pyodideRef.current, exercise.pythonPackages);
      }

      const logs: string[] = [];
      pyodideRef.current.setStdout({ batched: (msg: string) => logs.push(msg) });
      pyodideRef.current.setStderr({ batched: (msg: string) => logs.push(`[Erreur] ${msg}`) });
      await pyodideRef.current.runPythonAsync(code);
      setOutput(['> Exécution du script...', ...logs, '[Succès] Programme terminé.']);

      const pythonTests = exercise.hasVerification ? await getExerciseVerification(exercise.id) : null;
      if (exercise.hasVerification && !pythonTests) {
        setOutput((prev) => [...prev, '[Erreur] Impossible de charger le jeu de tests.']);
        return;
      }

      if (pythonTests) {
        try {
          setOutput((prev) => [...prev, '> Lancement de la vérification...']);
          await pyodideRef.current.runPythonAsync(pythonTests);
          setOutput((prev) => [...prev, '✅ Tous les tests sont passés ! Bravo !']);
          await saveProgress();
        } catch (error: any) {
          const msg = error.message || '';
          const assertionMatch = msg.match(/AssertionError: (.*)/);
          const userMsg = assertionMatch?.[1]
            ? `❌ ${assertionMatch[1].trim()}`
            : msg.includes('AssertionError')
              ? '❌ Échec de la vérification. Une condition n’est pas remplie. Vérifiez votre code.'
              : `❌ Échec de la vérification. ${msg}`;
          setOutput((prev) => [...prev, userMsg]);
          return;
        }
      } else {
        await saveProgress();
      }
    } catch (error: any) {
      setOutput(['> Exécution du script...', `[Erreur] ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
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
        'editor.background': '#0f0f0f',
        'editor.foreground': '#ffffff',
        'editorCursor.foreground': '#F97316',
        'editor.lineHighlightBackground': '#1f1f1f',
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col bg-slate-50">
      {showSuccessModal && pendingBadge && (
        <SuccessModal
          courseTitle={pendingBadge.courseTitle}
          courseId={pendingBadge.courseId}
          onConfirm={() => {
            setShowSuccessModal(false);
            setPendingBadge(null);
            if (pendingAchievementRef.current) {
              setUnlockedAchievement(pendingAchievementRef.current);
              pendingAchievementRef.current = null;
            }
          }}
          onDismiss={() => {
            setShowSuccessModal(false);
            setPendingBadge(null);
            pendingAchievementRef.current = null;
          }}
        />
      )}
      {unlockedAchievement && (
        <AchievementUnlockedModal achievement={unlockedAchievement} onClose={() => setUnlockedAchievement(null)} />
      )}

      <div className="border-b border-slate-200 bg-white px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={exercise.pagePath || '/cours'}
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            <ArrowLeft size={16} />
            Retour à la fiche
          </Link>
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Terminal size={16} className="text-orange-500" />
            {exercise.courseTitle}
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2 lg:min-h-[70vh]">
        <div className="min-h-[24rem] border-b border-slate-200 lg:border-b-0 lg:border-r">
          <ExerciseStatement
            exercise={exercise}
            isCompleted={isCompleted}
            content={cleanStatement(exercise.content)}
          />
        </div>
        <div className="flex min-h-[32rem] flex-col bg-[#1e1e1e] lg:min-h-0">
          <LabEditor
            exercise={exercise}
            code={code}
            isRunning={isRunning}
            onCodeChange={setCode}
            onReset={() => setCode('')}
            onRun={handleRun}
            beforeMount={handleEditorWillMount}
          />
          <LabOutput exercise={exercise} output={output} sqlResults={sqlResults} />
        </div>
      </div>
    </div>
  );
}
