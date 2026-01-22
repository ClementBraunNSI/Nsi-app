"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';
import { GraduationCap, Zap, BookOpen, ArrowRight, Clock, Award, X, Calendar, Trophy, Target, Lock } from 'lucide-react';

// Mapping des niveaux selon tes spécifications
const LEVEL_MAP: Record<string, { label: string; code: string }> = {
  'SNI': { label: 'SNI', code: '0' },
  'SNT': { label: 'SNT', code: '1' },
  '1NSI': { label: 'Première NSI', code: '2' },
  'TNSI': { label: 'Terminale NSI', code: '3' },
  'SIO': { label: 'BTS SIO', code: '4' }
};

// Contenu des cours particuliers
const PRIVATE_LESSONS = [
  { 
    title: "Suivi Individuel - Perfectionnement", 
    duration: "1h / semaine", 
    tag: "Privé", 
    href: "/cours/particuliers/suivi" 
  },
  { 
    title: "Préparation intensive examen", 
    duration: "Coaching", 
    tag: "Examen", 
    href: "/cours/particuliers/examen" 
  }
];

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [badgesCount, setBadgesCount] = useState(0);
  const [exercisesCount, setExercisesCount] = useState(0);
  const [badges, setBadges] = useState<any[]>([]);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) {
          setProfile(data);
          // Fetch cours standards pour ce niveau
          if (LEVEL_MAP[data.level]) {
            const code = LEVEL_MAP[data.level].code;
            const res = await fetch(`/api/courses/${code}`);
            const courseData = await res.json();
            setCourses(courseData.courses || []);
          }

          // Fetch badges
          const { data: badgesData, count: badgesTotal } = await supabase
            .from('badges')
            .select('*', { count: 'exact' })
            .eq('user_id', session.user.id)
            .order('unlocked_at', { ascending: false });
          
          setBadgesCount(badgesTotal || 0);
          setBadges(badgesData || []);

          // Fetch exercises count
          const { count: exercisesTotal } = await supabase
            .from('user_progress')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id);

          setExercisesCount(exercisesTotal || 0);
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  // Calculate completed chapters
  const completedChapters = React.useMemo(() => {
    if (!courses.length) return [];
    
    // Group courses by chapter, filtering only those with badgeId
    const chapterCourses: Record<string, string[]> = {};
    
    courses.forEach(course => {
      if (course.chapter && course.badgeId) {
        if (!chapterCourses[course.chapter]) {
          chapterCourses[course.chapter] = [];
        }
        chapterCourses[course.chapter].push(course.badgeId);
      }
    });
    
    // Check completion
    const completed: string[] = [];
    // User badges might use course_id or badge_name depending on how they were saved, 
    // but ExerciseTabs uses course_id matching the badgeId.
    const userBadgeIds = new Set(badges.map(b => b.course_id)); 
    
    Object.entries(chapterCourses).forEach(([chapter, badgeIds]) => {
      // A chapter is completed if it has badgeIds and all are unlocked
      if (badgeIds.length > 0 && badgeIds.every(id => userBadgeIds.has(id))) {
        completed.push(chapter);
      }
    });
    
    return completed;
  }, [courses, badges]);

  if (loading) return <div className="p-10 text-center font-bold">Chargement...</div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen className="mx-auto mb-6 text-slate-300" size={64} />
          <h1 className="text-2xl font-black text-slate-800 mb-4">Accès réservé</h1>
          <p className="text-slate-500 mb-8 max-w-md">Connectez-vous pour accéder à votre espace.</p>
          <Link href="/" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-2xl inline-block">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  const currentLevelInfo = profile?.level ? LEVEL_MAP[profile.level] : null;

  // Calculate unlocked achievements
  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
    achievement.condition({ badgesCount, exercisesCount, badges, completedChapters })
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profil */}
        <div className="flex items-center justify-between bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase italic leading-none">{profile?.full_name || "Élève"}</h1>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mt-1">
                {currentLevelInfo ? `${currentLevelInfo.label} (Niveau ${currentLevelInfo.code})` : "Niveau non défini"}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => setShowAchievementsModal(true)}
              className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:bg-purple-50 hover:border-purple-200 hover:scale-105 transition-all cursor-pointer group"
            >
              <Target className="text-purple-500 group-hover:rotate-12 transition-transform" size={24} />
              <div className="text-left">
                <div className="text-2xl font-black text-slate-900 leading-none group-hover:text-purple-600 transition-colors">{unlockedAchievements.length}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-purple-400 transition-colors">Succès</div>
              </div>
            </button>

            <button 
              onClick={() => setShowBadgesModal(true)}
              className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 hover:bg-orange-50 hover:border-orange-200 hover:scale-105 transition-all cursor-pointer group"
            >
              <Award className="text-orange-500 group-hover:rotate-12 transition-transform" size={24} />
              <div className="text-left">
                <div className="text-2xl font-black text-slate-900 leading-none group-hover:text-orange-600 transition-colors">{badgesCount}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-orange-400 transition-colors">Badges</div>
              </div>
            </button>
          </div>
        </div>

        {/* SECTION COURS PARTICULIERS (Si activé dans Supabase) */}
        {profile?.has_private_lessons && (
          <div className="space-y-6">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-orange-600 flex items-center gap-3">
              <Zap size={16} fill="currentColor" /> Ton Accompagnement Particulier
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRIVATE_LESSONS.map((lesson, index) => (
                <Link href={lesson.href} key={index} className="group">
                  <div className="bg-orange-500 border border-orange-400 p-6 rounded-3xl flex items-center justify-between hover:bg-orange-600 transition-all shadow-lg shadow-orange-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                        <Zap size={18} fill="currentColor" />
                      </div>
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/80 block mb-1">Module Privé</span>
                        <h3 className="font-bold text-white leading-tight">{lesson.title}</h3>
                      </div>
                    </div>
                    <ArrowRight className="text-white opacity-50 group-hover:opacity-100 transition-opacity" size={20} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Liste des Cours Standards */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <BookOpen size={16} className="text-orange-500" /> 
            Cours de la section {currentLevelInfo?.label}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {courses.length > 0 ? (
              courses.map((course: any) => (
                <CourseCard 
                  key={course.slug}
                  title={course.title}
                  duration="À déterminer" 
                  tag={course.chapter}
                  slug={course.slug}
                  levelCode={currentLevelInfo?.code}
                />
              ))
            ) : (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 italic font-bold">
                Aucun cours disponible pour ce niveau.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL SUCCÈS */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 md:p-10 max-w-4xl w-full relative shadow-2xl animate-in zoom-in duration-300 border border-purple-100 max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setShowAchievementsModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Target size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Mes Succès</h2>
              <p className="text-slate-500 font-medium mt-2">Débloque des récompenses uniques en progressant !</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((achievement) => {
                const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                const Icon = achievement.icon;
                
                return (
                  <div 
                    key={achievement.id} 
                    className={`
                      relative overflow-hidden p-6 rounded-3xl border transition-all
                      ${isUnlocked 
                        ? 'bg-white border-purple-100 shadow-lg shadow-purple-50' 
                        : 'bg-slate-50 border-slate-100 opacity-60 grayscale-[0.8]'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0
                        ${isUnlocked ? achievement.color : 'bg-slate-200 text-slate-400'}
                      `}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className={`font-black text-lg leading-tight mb-1 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                          {achievement.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                    {!isUnlocked && (
                      <div className="absolute top-3 right-3 text-slate-300">
                        <Lock size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL BADGES */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-8 md:p-10 max-w-2xl w-full relative shadow-2xl animate-in zoom-in duration-300 border border-orange-100 max-h-[80vh] overflow-y-auto">
            <button 
              onClick={() => setShowBadgesModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                <Award size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Mes Badges</h2>
              <p className="text-slate-500 font-medium mt-2">Bravo pour tes progrès ! Voici tes récompenses.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.length > 0 ? (
                badges.map((badge: any) => (
                  <div key={badge.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center hover:bg-orange-50 hover:border-orange-200 transition-colors group">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-500 mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <Trophy size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{badge.badge_name}</h3>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Calendar size={10} />
                      {new Date(badge.unlocked_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Tu n'as pas encore gagné de badge.<br/>
                  Termine des fiches d'exercices pour en débloquer !
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CourseCard({ title, duration, tag, slug, levelCode }: any) {
  if (!levelCode) return null;
  return (
    <Link href={`/cours/${levelCode}/${slug}`} className="group bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between hover:border-orange-500/30 hover:shadow-md transition-all block">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
          <BookOpen size={20} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block italic">
            {tag}
          </span>
          <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{title}</h3>
          <div className="flex items-center gap-2 text-slate-400 mt-1">
            <Clock size={12} />
            <span className="text-[10px] font-bold uppercase">{duration}</span>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all">
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}