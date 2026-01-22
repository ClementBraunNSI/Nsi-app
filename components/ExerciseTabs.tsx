"use client";
import React, { useState, useEffect } from 'react';
import { Check, Trophy, Star, Lock, Unlock, PartyPopper } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TabProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

// --- COMPOSANT MODAL DE FÉLICITATIONS ---
function SuccessModal({ courseTitle, onConfirm }: { courseTitle: string, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 border border-orange-100">
        <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg rotate-3">
          <Trophy size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 italic uppercase tracking-tighter">Félicitations !</h2>
        <p className="text-slate-500 mb-8 leading-relaxed font-medium">
          Vous avez validé la fiche d'exercice : <br/>
          <span className="font-bold text-orange-600 text-lg italic underline decoration-orange-200">"{courseTitle}"</span>
        </p>
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-100 active:scale-95 flex items-center justify-center gap-3"
        >
          Valider & recevoir mon badge <PartyPopper size={20} />
        </button>
      </div>
    </div>
  );
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

export function Correction({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mt-6 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition-all text-sm font-bold border border-orange-100 shadow-sm"
      >
        {isOpen ? <Unlock size={18} /> : <Lock size={18} />}
        {isOpen ? 'Masquer la solution' : 'Voir la correction'}
      </button>
      {isOpen && (
        <div className="mt-4 p-6 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export function ExerciseTabs({ children, courseId, courseTitle }: { children: React.ReactNode, courseId: string, courseTitle: string }) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<TabProps>[];
  const [activeTab, setActiveTab] = useState(childrenArray[0]?.props.id);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [hasBadge, setHasBadge] = useState(false);

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
      setShowModal(false);
    }
  };

  return (
    <div className="w-full mt-10">
      {showModal && <SuccessModal courseTitle={courseTitle} onConfirm={handleValidateBadge} />}

      <ExerciseProgressBar total={childrenArray.length} completed={completedIds.length} />

      <div className="flex flex-wrap gap-3 mb-8">
        {childrenArray.map((child) => {
          const isDone = completedIds.includes(child.props.id);
          const isActive = activeTab === child.props.id;
          return (
            <div
              key={child.props.id}
              onClick={() => setActiveTab(child.props.id)}
              className={`flex-1 min-w-[160px] py-4 px-4 rounded-2xl text-xs font-black transition-all duration-300 uppercase tracking-tighter border-b-4 cursor-pointer flex items-center justify-between gap-3 ${
                isActive ? 'bg-orange-500 text-white border-orange-700 shadow-lg scale-[1.02]' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-white'
              }`}
            >
              <span className="truncate">{child.props.label}</span>
              <button
                onClick={(e) => toggleComplete(e, child.props.id)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all border-2 shadow-sm ${
                  isDone ? 'bg-white text-orange-500 border-white' : 'bg-slate-200 text-transparent border-slate-300 hover:border-orange-400'
                }`}
              >
                <Check size={16} strokeWidth={4} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-orange-50 shadow-sm min-h-[350px]">
        {childrenArray.find((child) => child.props.id === activeTab)}
      </div>
    </div>
  );
}

export function ExerciseSection({ children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="animate-in fade-in duration-500">{children}</div>;
}