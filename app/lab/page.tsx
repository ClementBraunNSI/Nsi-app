
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { getAllExercises, LabExercise } from '@/app/actions/getExercises';
import { Play, CheckCircle, BookOpen, ChevronRight, Trophy, RotateCcw, Terminal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';
import AchievementUnlockedModal from '@/components/AchievementUnlockedModal';
import SuccessModal from '@/components/SuccessModal';

declare global {
  interface Window {
    loadPyodide: any;
  }
}

const LEVEL_MAP: Record<string, { label: string; code: string }> = {
  'SNI': { label: 'SNI', code: '0' },
  'SNT': { label: 'SNT', code: '1' },
  '1NSI': { label: 'Première NSI', code: '2' },
  'TNSI': { label: 'Terminale NSI', code: '3' },
  'SIO': { label: 'BTS SIO', code: '4' }
};

export default function LabPage() {
  const [exercises, setExercises] = useState<LabExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<LabExercise | null>(null);
  const [code, setCode] = useState('print("Hello World")');
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // Modals State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [pendingBadge, setPendingBadge] = useState<{ courseId: string, courseTitle: string } | null>(null);
  
  // Pyodide Ref
  const pyodideRef = useRef<any>(null);
  const [isPyodideReady, setIsPyodideReady] = useState(false);

  const [expandedFiches, setExpandedFiches] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  // Group exercises by Level > Chapter > CourseTitle
  const groupedExercises = exercises.reduce((acc, ex) => {
    // 1. Level
    if (!acc[ex.level]) acc[ex.level] = {};
    
    // 2. Chapter
    if (!acc[ex.level][ex.chapter]) acc[ex.level][ex.chapter] = {};
    
    // 3. Course Title (Fiche)
    if (!acc[ex.level][ex.chapter][ex.courseTitle]) acc[ex.level][ex.chapter][ex.courseTitle] = [];
    
    acc[ex.level][ex.chapter][ex.courseTitle].push(ex);
    return acc;
  }, {} as Record<string, Record<string, Record<string, LabExercise[]>>>);

  const toggleFiche = (id: string) => {
    setExpandedFiches(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    // 0. Load Pyodide
    const loadPyodideScript = async () => {
      if (window.loadPyodide) return; // Already loaded

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
      script.async = true;
      script.onload = async () => {
        try {
          // @ts-ignore
          const pyodide = await window.loadPyodide();
          pyodideRef.current = pyodide;
          setIsPyodideReady(true);
          console.log("Pyodide loaded!");
        } catch (e) {
          console.error("Failed to load Pyodide", e);
        }
      };
      document.body.appendChild(script);
    };
    loadPyodideScript();

    // 1. Fetch Exercises
    getAllExercises().then(setExercises);

    // 2. Check Auth & Progress
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('user_progress').select('exercise_id').eq('user_id', session.user.id);
        if (data) setCompletedExercises(data.map(d => d.exercise_id));
      }
    };
    checkAuth();
  }, []);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(['> Initialisation...']);
    
    // Si Pyodide n'est pas prêt, on attend un peu ou on simule
    if (!pyodideRef.current) {
        setOutput(['[Info] Environnement Python en cours de chargement... Veuillez patienter.']);
        // Petit délai pour voir si ça charge
        await new Promise(r => setTimeout(r, 2000));
        if (!pyodideRef.current) {
           setOutput(['[Erreur] Impossible de charger Python. Vérifiez votre connexion.']);
           setIsRunning(false);
           return;
        }
    }

    try {
      setOutput(['> Exécution du script...']);
      
      const logs: string[] = [];
      // Capture stdout/stderr
      pyodideRef.current.setStdout({ batched: (msg: string) => logs.push(msg) });
      pyodideRef.current.setStderr({ batched: (msg: string) => logs.push(`[Erreur] ${msg}`) });
      
      await pyodideRef.current.runPythonAsync(code);
      
      // Mise à jour de l'affichage avec les logs réels
      setOutput(['> Exécution du script...', ...logs, `[Succès] Programme terminé.`]);

      // --- VERIFICATION STEP ---
      if (selectedExercise && selectedExercise.verificationCode) {
         try {
            setOutput(prev => [...prev, '> Lancement de la vérification...']);
            await pyodideRef.current.runPythonAsync(selectedExercise.verificationCode);
            setOutput(prev => [...prev, '✅ Tous les tests sont passés ! Bravo !']);
            
            // Save progress only if verification passes
            if (user) {
              await saveProgress(selectedExercise);
            }
         } catch (e: any) {
            const msg = e.message || '';
            const isAssertionError = msg.includes('AssertionError');

            // Log differently based on error type to avoid scary console errors for expected failures
            if (isAssertionError) {
                console.log("Verification failed (AssertionError):", msg);
            } else {
                console.error("Verification failed:", e);
            }

            // We want to show a clean error message if it's an assertion error
            // Pyodide error messages can be verbose.
            let userMsg = `❌ Échec de la vérification.`;

            // Extract the specific assertion message if available
            // Look for "AssertionError: <message>"
            const assertionMatch = msg.match(/AssertionError: (.*)/);

            if (assertionMatch && assertionMatch[1]) {
               userMsg = `❌ ${assertionMatch[1].trim()}`;
            } else if (isAssertionError) {
               userMsg += ` Une condition n'est pas remplie. Vérifiez votre code.`;
            } else {
               userMsg += ` ${msg}`;
            }
            setOutput(prev => [...prev, userMsg]);
            // Do NOT save progress
            return; 
         }
      } else {
        // No verification code -> assume success if code ran without error
        if (user && selectedExercise) {
          await saveProgress(selectedExercise);
        }
      }

    } catch (error: any) {
      setOutput(['> Exécution du script...', `[Erreur] ${error.message}`]);
    } finally {
      setIsRunning(false);
    }
  };

  const saveProgress = async (exercise: LabExercise) => {
    if (!user) return;

    // 1. Save Progress
    const { error } = await supabase.from('user_progress').upsert(
      { exercise_id: exercise.id, user_id: user.id, course_id: exercise.courseId },
      { onConflict: 'user_id, exercise_id' }
    );

    if (!error) {
      setCompletedExercises(prev => [...prev, exercise.id]);
      checkBadgeCompletion(exercise);
    }
  };

  const checkBadgeCompletion = async (exercise: LabExercise) => {
    // Find all exercises for this badge
    const badgeExercises = exercises.filter(e => e.courseId === exercise.courseId);
    
    // Check if user has completed all of them (including the one just finished)
    // We fetch fresh progress to be sure, or use local state optimistically
    const { data: progress } = await supabase
        .from('user_progress')
        .select('exercise_id')
        .eq('user_id', user.id)
        .eq('course_id', exercise.courseId);
    
    const completedIds = progress?.map(p => p.exercise_id) || [];
    const allDone = badgeExercises.every(e => completedIds.includes(e.id));

    // Check if badge is already awarded
    const { data: existingBadge } = await supabase
        .from('badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', exercise.courseId)
        .single();

    if (allDone && !existingBadge) {
      setPendingBadge({ courseId: exercise.courseId, courseTitle: exercise.courseTitle });
      setShowSuccessModal(true);
    }
  };

  const handleAwardBadge = async () => {
    if (!pendingBadge || !user) return;
    
    const { courseId, courseTitle } = pendingBadge;
    const badgeName = courseTitle || courseId || "Badge";
    
    // 1. Fetch CURRENT stats (before insertion)
    const { data: profile } = await supabase.from('profiles').select('level').eq('id', user.id).single();
    const { count: currentBadgesCount, data: currentBadges } = await supabase.from('badges').select('*', { count: 'exact' }).eq('user_id', user.id);
    const { count: currentExercisesCount } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    
    // Fetch courses for chapter calculation
    let courses: any[] = [];
    if (profile && profile.level && LEVEL_MAP[profile.level]) {
        try {
          const res = await fetch(`/api/courses/${LEVEL_MAP[profile.level].code}`);
          const data = await res.json();
          courses = data.courses || [];
        } catch (e) {
          console.error("Erreur fetching courses:", e);
        }
    }

    // Helper to calculate completed chapters
    const getCompletedChapters = (badgesList: any[]) => {
        if (!courses.length) return [];
        const chapterCourses: Record<string, string[]> = {};
        courses.forEach(c => {
            if (c.chapter && c.badgeId) {
                if (!chapterCourses[c.chapter]) chapterCourses[c.chapter] = [];
                chapterCourses[c.chapter].push(c.badgeId);
            }
        });
        const completed: string[] = [];
        const userBadgeIds = new Set(badgesList.map(b => b.course_id));
        Object.entries(chapterCourses).forEach(([chapter, badgeIds]) => {
            if (badgeIds.length > 0 && badgeIds.every(id => userBadgeIds.has(id))) {
                completed.push(chapter);
            }
        });
        return completed;
    };

    // Calculate PREVIOUS unlocked
    const prevStats = {
        badgesCount: currentBadgesCount || 0,
        exercisesCount: currentExercisesCount || 0,
        badges: currentBadges || [],
        completedChapters: getCompletedChapters(currentBadges || [])
    };
    const prevUnlocked = ACHIEVEMENTS.filter(a => a.condition(prevStats));

    // Award Badge
    const { error } = await supabase.from('badges').upsert({
      user_id: user.id,
      course_id: courseId,
      badge_name: badgeName,
      unlocked_at: new Date().toISOString()
    }, { onConflict: 'user_id, course_id' });

    if (!error) {
      setShowSuccessModal(false);
      setPendingBadge(null);

      // 3. Calculate NEW stats (Simulated)
      const newBadge = { course_id: courseId, badge_name: badgeName, user_id: user.id, unlocked_at: new Date().toISOString() };
      const newBadgesList = [...(currentBadges || []), newBadge];
      
      const newStats = {
          badgesCount: (currentBadgesCount || 0) + 1,
          exercisesCount: currentExercisesCount || 0,
          badges: newBadgesList,
          completedChapters: getCompletedChapters(newBadgesList)
      };
      const newUnlocked = ACHIEVEMENTS.filter(a => a.condition(newStats));

      // 4. Find difference
      const newlyUnlocked = newUnlocked.filter(na => !prevUnlocked.some(pa => pa.id === na.id));

      if (newlyUnlocked.length > 0) {
          setUnlockedAchievement(newlyUnlocked[0]); 
      }
    }
  };

  // Helper to clean content (remove first title if redundant)
  const getCleanContent = (content: string, label: string) => {
    if (!content) return '';
    // Regex to match the first header (h1-h6) at the start of the string
    // We check if it matches the label or just remove the first header if it seems to be a title
    const lines = content.split('\n');
    let cleanLines = lines;
    
    // Check first non-empty line
    const firstLineIndex = lines.findIndex(l => l.trim().length > 0);
    if (firstLineIndex !== -1) {
      const firstLine = lines[firstLineIndex].trim();
      if (firstLine.startsWith('#')) {
        // It's a header. We remove it.
        // User specifically mentioned the h3 (###) that duplicates the label
        cleanLines = [...lines.slice(0, firstLineIndex), ...lines.slice(firstLineIndex + 1)];
      }
    }
    return cleanLines.join('\n');
  };

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('orange-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'F97316', fontStyle: 'bold' }, // Orange-500
        { token: 'type.identifier', foreground: 'FDBA74' }, // Orange-300
        { token: 'string', foreground: 'FDBA74' }, // Orange-300
        { token: 'number', foreground: 'F97316' }, // Orange-500
        { token: 'comment', foreground: '525252' }, // Neutral-600
        { token: 'delimiter', foreground: 'A3A3A3' }, // Neutral-400
        { token: 'identifier', foreground: 'FFFFFF' },
        { token: 'function', foreground: 'FED7AA' }, // Orange-200
      ],
      colors: {
        'editor.background': '#0f0f0f', // Very dark
        'editor.foreground': '#ffffff',
        'editorCursor.foreground': '#F97316',
        'editor.lineHighlightBackground': '#1f1f1f',
        'editorLineNumber.foreground': '#404040',
        'editor.selectionBackground': '#F9731633',
        'editorIndentGuide.background': '#262626',
        'editorIndentGuide.activeBackground': '#F97316',
      }
    });
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      {/* SIDEBAR */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Terminal className="text-orange-500" />
            La Tanière <span className="text-slate-400 font-medium text-sm">Lab</span>
          </h1>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {Object.entries(groupedExercises).sort(([a], [b]) => a.localeCompare(b)).map(([level, chapters]) => (
            <div key={level}>
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4 pl-2 border-l-4 border-orange-500">
                Niveau {level}
              </h3>
              
              <div className="space-y-3">
                {Object.entries(chapters).map(([chapter, fiches]) => (
                  <div key={chapter} className="pl-2">
                    <button 
                      onClick={() => toggleChapter(chapter)}
                      className="flex items-center gap-2 w-full text-left text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors mb-2"
                    >
                      <ChevronRight size={16} className={`transition-transform ${expandedChapters.includes(chapter) ? 'rotate-90' : ''}`} />
                      {chapter}
                    </button>

                    {expandedChapters.includes(chapter) && (
                      <div className="pl-4 space-y-2 border-l border-slate-200 ml-2 animate-in slide-in-from-left-2 fade-in duration-200">
                        {Object.entries(fiches).map(([ficheTitle, exercises]) => (
                          <div key={ficheTitle}>
                            <button
                              onClick={() => toggleFiche(ficheTitle)}
                              className="flex items-center gap-2 w-full text-left text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors py-1"
                            >
                              <ChevronRight size={14} className={`transition-transform ${expandedFiches.includes(ficheTitle) ? 'rotate-90' : ''}`} />
                              {ficheTitle}
                            </button>

                            {expandedFiches.includes(ficheTitle) && (
                              <div className="pl-4 mt-1 space-y-0.5 border-l border-slate-100 ml-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                                {exercises.map(ex => {
                                  const isCompleted = completedExercises.includes(ex.id);
                                  const isSelected = selectedExercise?.id === ex.id;
                                  
                                  return (
                                    <button
                                      key={ex.id}
                                      onClick={() => setSelectedExercise(ex)}
                                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center justify-between group ${
                                        isSelected 
                                          ? 'bg-orange-50 text-orange-700 font-bold' 
                                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                      }`}
                                    >
                                      <span className="truncate pr-2">{ex.label}</span>
                                      {isCompleted && <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedExercise ? (
          <>
            {/* Header / Instructions */}
            <div className="h-[30%] bg-white border-b border-slate-200 flex flex-col">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div>
                   <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                     <BookOpen size={18} className="text-slate-400" />
                     {selectedExercise.label}
                   </h2>
                   <p className="text-xs text-slate-500 font-medium mt-0.5 ml-7">
                     {selectedExercise.courseTitle}
                   </p>
                </div>
                {completedExercises.includes(selectedExercise.id) && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <CheckCircle size={12} /> Validé
                  </span>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-5 prose prose-slate prose-lg max-w-none bg-white
                prose-headings:italic prose-headings:uppercase prose-headings:font-black
                prose-p:text-slate-700 prose-p:leading-relaxed
                prose-strong:text-slate-900
                prose-a:text-orange-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                
                prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#FFFBF5] prose-pre:border-l-4 prose-pre:border-orange-400 prose-pre:text-orange-900 prose-pre:shadow-sm prose-pre:rounded-r-xl
                
                prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
                prose-th:bg-slate-50 prose-th:text-slate-900 prose-th:p-4 prose-th:border prose-th:border-slate-200
                prose-td:p-4 prose-td:border prose-td:border-slate-100
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    // We remove custom renderers to rely on the prose classes, matching the Course page design
                    // except for maybe keeping some basic structure if needed.
                    // But standard markdown elements should be styled by the prose-* classes above.
                  }}
                >
                  {getCleanContent(selectedExercise.content, selectedExercise.label)}
                </ReactMarkdown>
              </div>
            </div>

            {/* Editor Area */}
            <div className="h-[70%] flex flex-col bg-[#1e1e1e]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3e3e3e]">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>main.py</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCode('')}
                    className="p-1.5 hover:bg-[#3e3e3e] rounded-md text-slate-400 transition-colors"
                    title="Reset"
                  >
                    <RotateCcw size={14} />
                  </button>
                  <button
                    onClick={handleRun}
                    disabled={isRunning}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                      isRunning 
                        ? 'bg-slate-600 text-slate-400 cursor-wait'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                    }`}
                  >
                    <Play size={14} fill="currentColor" />
                    {isRunning ? 'Exécution...' : 'Exécuter & Valider'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex">
                <div className="w-1/2 border-r border-[#3e3e3e]">
                   <Editor
                     height="100%"
                     defaultLanguage="python"
                     theme="orange-dark"
                     beforeMount={handleEditorWillMount}
                     value={code}
                     onChange={(value) => setCode(value || '')}
                     options={{
                       minimap: { enabled: false },
                       fontSize: 14,
                       scrollBeyondLastLine: false,
                       padding: { top: 16, bottom: 16 }
                     }}
                   />
                </div>
                <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
                  <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-[#3e3e3e]">
                    Console / Sortie
                  </div>
                  <div className="flex-1 p-4 font-mono text-sm text-slate-300 overflow-y-auto space-y-1">
                    {output.length > 0 ? (
                      output.map((line, i) => (
                        <div key={i} className="border-b border-transparent hover:border-[#333]">{line}</div>
                      ))
                    ) : (
                      <div className="text-slate-600 italic">En attente d'exécution...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 text-slate-300">
              <Terminal size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Prêt à coder ?</h2>
            <p className="max-w-md mx-auto mb-8">
              Sélectionnez un exercice dans le menu de gauche pour charger l'énoncé et l'éditeur de code.
            </p>
          </div>
        )}
      </div>

      {showSuccessModal && pendingBadge && (
        <SuccessModal 
          courseTitle={pendingBadge.courseTitle} 
          onConfirm={handleAwardBadge} 
        />
      )}
      
      {unlockedAchievement && (
        <AchievementUnlockedModal 
          achievement={unlockedAchievement} 
          onClose={() => setUnlockedAchievement(null)} 
        />
      )}
    </div>
  );
}
