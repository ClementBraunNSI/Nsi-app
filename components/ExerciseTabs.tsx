"use client";
import React, { useState, useEffect } from 'react';
import { Check, Trophy } from 'lucide-react';
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



export function ExerciseTabs({ children, courseId, courseTitle }: { children: React.ReactNode, courseId: string, courseTitle: string }) {
  // Filter only valid React elements to avoid text nodes (whitespace) causing issues
  const childrenArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(childrenArray[0]?.props.id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const categories = Array.from(new Set(childrenArray.map(c => {
    const raw = (c.props.label || '').toString();
    const left = raw.split('-')[0].trim();
    if (left.toLowerCase().includes('introduction')) return 'Introduction';
    if (left.toLowerCase().includes('facile')) return 'Facile';
    if (left.toLowerCase().includes('intermédiaire')) return 'Intermédiaire';
    return 'Autres';
  })));
  const [activeGroup, setActiveGroup] = useState(categories.includes('Introduction') ? 'Introduction' : (categories[0] || 'Tous'));
  const filteredChildren = childrenArray.filter(c => {
    const raw = (c.props.label || '').toString();
    const left = raw.split('-')[0].trim();
    const cat = left.toLowerCase().includes('introduction') ? 'Introduction'
      : left.toLowerCase().includes('facile') ? 'Facile'
      : left.toLowerCase().includes('intermédiaire') ? 'Intermédiaire'
      : 'Autres';
    return cat === activeGroup;
  });
  useEffect(() => {
    const first = filteredChildren[0]?.props.id || childrenArray[0]?.props.id;
    if (first && first !== activeTab) setActiveTab(first);
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

      <div className="rounded-[1.6rem] border border-slate-200 bg-white/90 p-3 mb-4 shadow-[0_14px_30px_-24px_rgba(15,23,42,0.4)]">
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Filtrer les exercices</p>
        <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveGroup(cat)}
            className={`px-3 py-2 rounded-xl text-[11px] font-black tracking-widest uppercase border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
              activeGroup === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-[0_12px_22px_-18px_rgba(249,115,22,0.95)]'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
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
              className={`group py-4 px-4 rounded-2xl text-xs font-black transition-all duration-300 uppercase tracking-tighter cursor-pointer border focus-within:ring-2 focus-within:ring-orange-300 ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-600 shadow-[0_18px_32px_-20px_rgba(249,115,22,0.95)] scale-[1.01]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate">{child.props.label}</span>
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

      <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-200 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] min-h-[350px]">
        {childrenArray.find((child) => child.props.id === activeTab)}
      </div>
    </div>
  );
}

export function Enonce({ children }: { children: React.ReactNode }) {
  return <div className="enonce">{children}</div>;
}

export function Correction({ children }: { children: React.ReactNode }) {
  return null;
}

export function Verification({ children }: { children: React.ReactNode }) {
  return null; // Invisible in the Course view
}

export function ExerciseSection({ children }: TabProps) {
  return <>{children}</>;
}
