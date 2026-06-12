"use client";
import React, { useState, useEffect } from 'react';
import { Check, CheckCircle2, Code2, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';
import AchievementUnlockedModal from './AchievementUnlockedModal';
import SuccessModal from './SuccessModal';

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

const LEVEL_MAP: Record<string, { label: string; code: string }> = {
  'SNI': { label: 'SNI', code: '0' },
  'SNT': { label: 'SNT', code: '1' },
  '1NSI': { label: 'Première NSI', code: '2' },
  'TNSI': { label: 'Terminale NSI', code: '3' },
  'SIO': { label: 'BTS SIO', code: '4' }
};

const DIFFICULTY_LEVELS = [
  'Introduction',
  'Facile',
  'Moyen',
  'Avancé',
  'Difficile',
  'Expert',
] as const;

type ExerciseDifficulty = (typeof DIFFICULTY_LEVELS)[number];

const DIFFICULTY_STYLES: Record<ExerciseDifficulty, { active: string; idle: string }> = {
  Introduction: {
    active: 'bg-sky-500 text-white border-sky-500 shadow-[0_16px_28px_-18px_rgba(14,165,233,0.95)]',
    idle: 'hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700',
  },
  Facile: {
    active: 'bg-emerald-500 text-white border-emerald-500 shadow-[0_16px_28px_-18px_rgba(16,185,129,0.95)]',
    idle: 'hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700',
  },
  Moyen: {
    active: 'bg-amber-500 text-white border-amber-500 shadow-[0_16px_28px_-18px_rgba(245,158,11,0.95)]',
    idle: 'hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700',
  },
  Avancé: {
    active: 'bg-orange-500 text-white border-orange-500 shadow-[0_16px_28px_-18px_rgba(249,115,22,0.95)]',
    idle: 'hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700',
  },
  Difficile: {
    active: 'bg-rose-500 text-white border-rose-500 shadow-[0_16px_28px_-18px_rgba(244,63,94,0.95)]',
    idle: 'hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700',
  },
  Expert: {
    active: 'bg-violet-600 text-white border-violet-600 shadow-[0_16px_28px_-18px_rgba(124,58,237,0.95)]',
    idle: 'hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700',
  },
};

function normalizeDifficultyText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function extractSectionNumber(label: string, id?: string): number | null {
  const fromLabel = label.match(/^(\d+)\./);
  if (fromLabel) return Number(fromLabel[1]);

  const fromId = id?.match(/-(\d+)-\d+$/);
  if (fromId) return Number(fromId[1]);

  return null;
}

function difficultyFromSection(section: number): ExerciseDifficulty {
  if (section <= 1) return 'Introduction';
  if (section === 2) return 'Facile';
  if (section === 3) return 'Moyen';
  if (section === 4) return 'Avancé';
  if (section === 5) return 'Difficile';
  return 'Expert';
}

function getExerciseDifficulty(label: string, id?: string): ExerciseDifficulty {
  const raw = normalizeDifficultyText(label);

  if (raw.includes('introduction') || /\bintro\b/.test(raw)) return 'Introduction';
  if (raw.includes('expert')) return 'Expert';
  if (raw.includes('difficile') || raw.includes('hard')) return 'Difficile';
  if (raw.includes('avance') || raw.includes('advanced')) return 'Avancé';
  if (
    raw.includes('moyen') ||
    raw.includes('intermediaire') ||
    raw.includes('medium') ||
    /\bmed\b/.test(raw)
  ) {
    return 'Moyen';
  }
  if (raw.includes('facile') || raw.includes('easy')) return 'Facile';

  const section = extractSectionNumber(label, id);
  if (section !== null) return difficultyFromSection(section);

  return 'Introduction';
}

function cleanExerciseLabel(label: string): string {
  return label
    .replace(/\[(Introduction|Facile|Moyen|Avancé|Difficile|Expert)\]/gi, '')
    .replace(/\((Introduction|Facile|Moyen|Avancé|Difficile|Expert|Intermédiaire|Intermediaire)\)/gi, '')
    .replace(/^(Introduction|Facile|Moyen|Avancé|Difficile|Expert|Easy|Medium|Med|Hard)\s*[-–]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTextFromNode(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return extractTextFromNode(node.props.children);
  }
  return '';
}

function normalizeVerificationCode(node: React.ReactNode): string {
  return extractTextFromNode(node)
    .replace(/```python/g, '')
    .replace(/```/g, '')
    .trim();
}

function splitTopLevel(value: string, separator: string): [string, string] | null {
  let depth = 0;
  let quote: string | null = null;

  for (let i = 0; i <= value.length - separator.length; i += 1) {
    const char = value[i];
    const previous = value[i - 1];

    if ((char === '"' || char === "'") && previous !== '\\') {
      quote = quote === char ? null : quote || char;
      continue;
    }

    if (quote) continue;
    if (['(', '[', '{'].includes(char)) depth += 1;
    if ([')', ']', '}'].includes(char)) depth -= 1;

    if (depth === 0 && value.slice(i, i + separator.length) === separator) {
      return [value.slice(0, i).trim(), value.slice(i + separator.length).trim()];
    }
  }

  return null;
}

function stripAssertMessage(assertion: string): string {
  return splitTopLevel(assertion, ',')?.[0] ?? assertion;
}

const IGNORED_FUNCTION_NAMES = new Set([
  'abs',
  'all',
  'any',
  'bool',
  'callable',
  'dict',
  'float',
  'int',
  'isinstance',
  'len',
  'list',
  'locals',
  'max',
  'min',
  'print',
  'range',
  'set',
  'str',
  'sum',
  'tuple',
]);

function extractFunctionCallAt(value: string, startIndex: number): string | null {
  const openIndex = value.indexOf('(', startIndex);
  if (openIndex === -1) return null;

  let depth = 0;
  let quote: string | null = null;

  for (let i = startIndex; i < value.length; i += 1) {
    const char = value[i];
    const previous = value[i - 1];

    if ((char === '"' || char === "'") && previous !== '\\') {
      quote = quote === char ? null : quote || char;
      continue;
    }

    if (quote) continue;
    if (char === '(') depth += 1;
    if (char === ')') {
      depth -= 1;
      if (depth === 0) return value.slice(startIndex, i + 1).trim();
    }
  }

  return null;
}

function findStudentFunctionCall(value: string): string | null {
  const functionNameRegex = /\b([A-Za-z_]\w*)\s*\(/g;
  let match: RegExpExecArray | null;

  while ((match = functionNameRegex.exec(value)) !== null) {
    const functionName = match[1];
    if (value[match.index - 1] === '.') continue;
    if (IGNORED_FUNCTION_NAMES.has(functionName)) continue;

    const call = extractFunctionCallAt(value, match.index);
    if (call) return call;
  }

  return null;
}

function isCallableCheck(assertion: string): string | null {
  const match = assertion.match(/^callable\(([^)]+)\)$/);
  return match?.[1]?.trim() ?? null;
}

function isLocalsDefinitionCheck(assertion: string): string | null {
  const match = assertion.match(/^['"](.+)['"]\s+in\s+locals\(\)$/);
  return match?.[1]?.trim() ?? null;
}

function describeAssertion(line: string, previousFunctionCall: string | null): string | null {
  const assertIndex = line.indexOf('assert ');
  if (assertIndex === -1) return null;

  const assertion = stripAssertMessage(line.slice(assertIndex + 'assert '.length).trim());
  const callableName = isCallableCheck(assertion);
  if (callableName) {
    return `On attend que \`${callableName}\` soit une fonction appelable.`;
  }

  const localsName = isLocalsDefinitionCheck(assertion);
  if (localsName) {
    return `On attend qu'une fonction \`${localsName}\` soit définie.`;
  }

  const equality = splitTopLevel(assertion, '==');
  if (equality) {
    const functionCall = findStudentFunctionCall(equality[0]) || findStudentFunctionCall(equality[1]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, résultat attendu : \`${equality[1]}\`.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, résultat attendu : \`${equality[0]} == ${equality[1]}\`.`;
    }
    return null;
  }

  const inequality = splitTopLevel(assertion, '!=');
  if (inequality) {
    const functionCall = findStudentFunctionCall(inequality[0]) || findStudentFunctionCall(inequality[1]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, résultat attendu : une valeur différente de \`${inequality[1]}\`.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, résultat attendu : \`${inequality[0]} != ${inequality[1]}\`.`;
    }
    return null;
  }

  const strictFalsy = splitTopLevel(assertion, ' is not ');
  if (strictFalsy) {
    const functionCall = findStudentFunctionCall(strictFalsy[0]) || findStudentFunctionCall(strictFalsy[1]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, résultat attendu : une valeur différente de \`${strictFalsy[1]}\`.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, résultat attendu : \`${strictFalsy[0]} is not ${strictFalsy[1]}\`.`;
    }
    return null;
  }

  const strictTruthy = splitTopLevel(assertion, ' is ');
  if (strictTruthy) {
    const functionCall = findStudentFunctionCall(strictTruthy[0]) || findStudentFunctionCall(strictTruthy[1]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, résultat attendu : \`${strictTruthy[1]}\`.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, résultat attendu : \`${strictTruthy[0]} is ${strictTruthy[1]}\`.`;
    }
    return null;
  }

  const absence = assertion.match(/^(.+)\s+not\s+in\s+(.+)$/);
  if (absence) {
    const functionCall = findStudentFunctionCall(absence[1]) || findStudentFunctionCall(absence[2]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, on attend que \`${absence[1].trim()}\` soit absent du résultat.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, on attend que \`${absence[1].trim()}\` soit absent de \`${absence[2].trim()}\`.`;
    }
    return null;
  }

  const presence = assertion.match(/^(.+)\s+in\s+(.+)$/);
  if (presence) {
    const functionCall = findStudentFunctionCall(presence[1]) || findStudentFunctionCall(presence[2]);
    if (functionCall) {
      return `Avec \`${functionCall}\`, on attend que \`${presence[1].trim()}\` soit présent dans le résultat.`;
    }
    if (previousFunctionCall) {
      return `Après l'appel \`${previousFunctionCall}\`, on attend que \`${presence[1].trim()}\` soit présent dans \`${presence[2].trim()}\`.`;
    }
    return null;
  }

  const functionCall = findStudentFunctionCall(assertion);
  if (functionCall) {
    return `Avec \`${functionCall}\`, la condition \`${assertion}\` doit être vraie.`;
  }

  return previousFunctionCall
    ? `Après l'appel \`${previousFunctionCall}\`, la condition \`${assertion}\` doit être vraie.`
    : null;
}

function buildReadableTests(verificationCode: string): string[] {
  const lines = verificationCode
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  const isFunctionExercise = lines.some((line) =>
    findStudentFunctionCall(line) || isCallableCheck(stripAssertMessage(line.replace(/^assert\s+/, '')))
  );

  if (!isFunctionExercise) return [];

  let previousFunctionCall: string | null = null;
  const readableTests: string[] = [];

  lines.forEach((line) => {
    if (!line.startsWith('assert ')) {
      const functionCall = findStudentFunctionCall(line);
      if (functionCall) previousFunctionCall = functionCall;
      return;
    }

    const description = describeAssertion(line, previousFunctionCall);
    if (description) readableTests.push(description);
  });

  return readableTests;
}

// --- BARRE DE PROGRESSION ---
function ExerciseProgressBar({ total, completed }: { total: number, completed: number }) {
  const progress = Math.round((completed / total) * 100) || 0;
  const isFinished = progress === 100;

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 mb-8 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Progression de la fiche</h4>
          <div className="text-2xl font-black text-slate-900 italic uppercase">
            {progress}% <span className="text-orange-500">Terminé</span>
          </div>
        </div>
        {isFinished && (
          <div className="bg-orange-500 p-3 rounded-2xl text-white shadow-lg animate-bounce">
            <Trophy size={28} />
          </div>
        )}
      </div>
      <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
        <div 
          className="h-full bg-orange-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}



export function ExerciseTabs({
  children,
  courseId,
  courseTitle,
}: {
  children: React.ReactNode,
  courseId: string,
  courseTitle: string,
}) {
  // Filter only valid React elements to avoid text nodes (whitespace) causing issues
  const childrenArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(childrenArray[0]?.props.id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);

  const difficultyByChild = React.useMemo(() => {
    const map = new Map<string, ExerciseDifficulty>();
    childrenArray.forEach((child) => {
      const label = (child.props.label || '').toString();
      map.set(child.props.id, getExerciseDifficulty(label, child.props.id));
    });
    return map;
  }, [childrenArray]);

  const categories = React.useMemo(() => {
    const present = new Set(childrenArray.map((child) => difficultyByChild.get(child.props.id)!));
    return DIFFICULTY_LEVELS.filter((level) => present.has(level));
  }, [childrenArray, difficultyByChild]);

  const [activeGroup, setActiveGroup] = useState<ExerciseDifficulty>('Introduction');

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeGroup)) {
      setActiveGroup(categories[0]);
    }
  }, [categories, activeGroup]);

  const filteredChildren = childrenArray.filter((child) => difficultyByChild.get(child.props.id) === activeGroup);

  useEffect(() => {
    const first = filteredChildren[0]?.props.id || childrenArray[0]?.props.id;
    if (first) setActiveTab(first);
  }, [activeGroup, childrenArray.length]);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        
        // Récupération de la progression
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('exercise_id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId);
        
        if (progressData) setCompletedIds(progressData.map(d => d.exercise_id));

        // Vérification du badge existant
        const { data: badgeData } = await supabase
          .from('badges')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId)
          .single();
        
        if (badgeData) setHasBadge(true);
      }
    };
    fetchProgress();
  }, [courseId]);

  const toggleComplete = async (e: React.MouseEvent, exerciseId: string) => {
    e.preventDefault(); e.stopPropagation();
    if (!userId) {
      console.log("Utilisateur non connecté");
      return;
    }

    const isDone = completedIds.includes(exerciseId);
    if (isDone) {
      const { error } = await supabase.from('user_progress').delete().eq('exercise_id', exerciseId).eq('user_id', userId);
      if (error) {
        console.error("Erreur suppression progression:", error);
      } else {
        setCompletedIds(prev => prev.filter(id => id !== exerciseId));
      }
    } else {
      // Utilisation de upsert pour éviter les erreurs de doublons (onConflict sur user_id, exercise_id)
      const { error } = await supabase.from('user_progress').upsert(
        { exercise_id: exerciseId, user_id: userId, course_id: courseId },
        { onConflict: 'user_id, exercise_id' }
      );
      
      if (error) {
        console.error("Erreur insertion progression:", error);
        alert("Impossible de sauvegarder la progression. Vérifiez vos droits d'accès.");
      } else {
        const newCompleted = [...completedIds, exerciseId];
        setCompletedIds(newCompleted);
        
        // DÉCLENCHEMENT DE LA MODAL SI 100% ET PAS ENCORE DE BADGE
        if (newCompleted.length === childrenArray.length && !hasBadge) {
          setShowModal(true);
        }
      }
    }
  };

  const handleValidateBadge = async () => {
    if (!userId) return;
    
    const badgeName = courseTitle || courseId || "Badge";
    console.log("Tentative d'enregistrement du badge:", { userId, courseId, badgeName });

    // 1. Fetch CURRENT stats (before insertion) to compare later
    const { data: profile } = await supabase.from('profiles').select('level').eq('id', userId).single();
    const { count: currentBadgesCount, data: currentBadges } = await supabase.from('badges').select('*', { count: 'exact' }).eq('user_id', userId);
    const { count: currentExercisesCount } = await supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId);
    
    // Fetch courses for chapter calculation
    let courses: any[] = [];
    if (profile && LEVEL_MAP[profile.level]) {
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

    // Enregistrement du badge dans Supabase
    const { error } = await supabase.from('badges').upsert({
      user_id: userId,
      course_id: courseId,
      badge_name: badgeName,
      unlocked_at: new Date().toISOString()
    });

    if (error) {
      console.error("Erreur lors de l'enregistrement du badge:", error);
      alert("Erreur lors de l'enregistrement du badge. Vérifiez la console.");
    } else {
      console.log("Badge enregistré avec succès !");
      setHasBadge(true); // Update local state
      setShowModal(false);

      // 3. Calculate NEW stats (Simulated)
      // New Badge Object
      const newBadge = { course_id: courseId, badge_name: badgeName, user_id: userId, unlocked_at: new Date().toISOString() };
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
          // Show the first newly unlocked achievement
          setUnlockedAchievement(newlyUnlocked[0]); 
      }
    }
  };

  return (
    <div className="w-full mt-10">
      {showModal && <SuccessModal courseTitle={courseTitle} onConfirm={handleValidateBadge} />}

      {unlockedAchievement && (
        <AchievementUnlockedModal 
          achievement={unlockedAchievement} 
          onClose={() => setUnlockedAchievement(null)} 
        />
      )}

      {/* ProgressBar removed as requested */}

      <div className="sticky top-4 z-20 mb-5 overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 shadow-[0_18px_42px_-34px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-500">Niveaux de difficulté</p>
          <p className="mt-1 text-sm text-slate-500">
            Introduction, Facile, Moyen, Avancé, Difficile, Expert — puis choisis l'exercice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {categories.map((cat) => {
            const count = childrenArray.filter((child) => difficultyByChild.get(child.props.id) === cat).length;
            const styles = DIFFICULTY_STYLES[cat];
            const isActive = activeGroup === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveGroup(cat)}
                className={`rounded-2xl border px-4 py-3 text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                  isActive
                    ? styles.active
                    : `bg-white text-slate-600 border-slate-200 ${styles.idle}`
                }`}
              >
                <span>{cat}</span>
                <span className={`ml-2 text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-8">
        {filteredChildren.length === 0 && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
            Aucun exercice dans cette catégorie.
          </div>
        )}
        {filteredChildren.map((child) => {
          const isDone = completedIds.includes(child.props.id);
          const isActive = activeTab === child.props.id;
          return (
            <div
              key={child.key}
              onClick={() => setActiveTab(child.props.id)}
              className={`group rounded-2xl border px-4 py-4 text-left text-sm transition-all duration-300 cursor-pointer focus-within:ring-2 focus-within:ring-orange-300 ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-600 shadow-[0_18px_32px_-20px_rgba(249,115,22,0.95)] scale-[1.01]'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-black">{cleanExerciseLabel(child.props.label)}</span>
                {isDone && (
                  <span className={`inline-flex items-center justify-center rounded-full p-1 ${isActive ? 'bg-white/25' : 'bg-emerald-100'}`}>
                    <Check size={12} className={isActive ? 'text-white' : 'text-emerald-600'} />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[2rem] p-5 md:p-8 border border-slate-200 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] min-h-[350px]">
        {(() => {
          const activeChild = childrenArray.find((child) => child.props.id === activeTab);
          return activeChild ?? null;
        })()}
      </div>
    </div>
  );
}

export function Enonce({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.6rem] border border-orange-100 bg-orange-50/35 p-5 md:p-7">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
        <Code2 size={13} />
        Énoncé
      </div>
      <div className="prose prose-slate max-w-none">
        {children}
      </div>
    </div>
  );
}

export function Correction({ children }: { children: React.ReactNode }) {
  return null;
}

export function Verification({ children }: { children: React.ReactNode }) {
  const verificationCode = normalizeVerificationCode(children);
  const readableTests = buildReadableTests(verificationCode);

  if (!verificationCode || readableTests.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_16px_36px_-30px_rgba(15,23,42,0.5)]">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-900">
            Résultats attendus
          </h4>
        </div>
      </div>
      <ol className="space-y-3 bg-white p-5">
        {readableTests.map((test, index) => (
          <li key={`${test}-${index}`} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-orange-600">
              {index + 1}
            </span>
            <span>{test}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ExerciseSection({ children }: TabProps) {
  return <div>{children}</div>;
}
