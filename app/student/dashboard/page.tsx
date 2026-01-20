"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Zap, BookOpen, LayoutDashboard, ArrowRight, Clock } from 'lucide-react';

// Mapping des niveaux selon tes spécifications
const LEVEL_MAP: Record<string, { label: string; code: string }> = {
  'SNI': { label: 'SNI', code: '0' },
  'SNT': { label: 'SNT', code: '1' },
  '1NSI': { label: 'Première NSI', code: '2' },
  'TNSI': { label: 'Terminale NSI', code: '3' },
  'SIO': { label: 'BTS SIO', code: '4' }
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          // Fetch courses for this level
          if (LEVEL_MAP[data.level]) {
            const code = LEVEL_MAP[data.level].code;
            const res = await fetch(`/api/courses/${code}`);
            const courseData = await res.json();
            setCourses(courseData.courses || []);
          }
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Chargement...</div>;

  // Récupération des infos du niveau actuel
  const currentLevelInfo = profile?.level ? LEVEL_MAP[profile.level] : null;

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-4 md:p-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header avec Niveau Dynamique */}
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
          <div className="hidden sm:block px-4 py-2 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Espace Étudiant
          </div>
        </div>

        {/* Hero Progression */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-2 text-orange-400 mb-2 font-bold uppercase text-[10px] tracking-[0.3em]">
               <Zap size={14} fill="currentColor" /> Ta progression en {currentLevelInfo?.label || "NSI"}
             </div>
             <div className="flex items-baseline gap-2">
               <span className="text-6xl md:text-8xl font-black italic">0</span>
               <span className="text-2xl font-black text-orange-500">%</span>
             </div>
             <div className="w-full max-w-md bg-white/10 h-3 rounded-full mt-6 overflow-hidden">
               <div className="bg-orange-500 h-full w-[2%] transition-all duration-1000"></div>
             </div>
             <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">3 chapitres à compléter ce trimestre</p>
           </div>
           {/* Décoration en fond */}
           <BookOpen className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
        </div>

        {/* Liste des Cours du Niveau */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <BookOpen size={16} className="text-orange-500" /> 
            Cours disponibles pour la section {currentLevelInfo?.label}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {courses.map((course: any) => (
              <CourseCard 
                key={course.slug}
                title={course.title}
                duration="À déterminer" // Could add duration in frontmatter later
                tag={course.chapter}
                slug={course.slug}
                levelCode={currentLevelInfo?.code}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sous-composant pour les cartes de cours
function CourseCard({ title, duration, tag, slug, levelCode }: { title: string; duration: string; tag: string; slug: string; levelCode: string }) {
  return (
    <Link href={`/cours/${levelCode}/${slug}`} className="group bg-white border border-slate-100 p-6 rounded-3xl flex items-center justify-between hover:border-orange-500/30 hover:shadow-md transition-all cursor-pointer block">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
          <BookOpen size={20} />
        </div>
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-2 py-1 rounded-md mb-2 inline-block">
            {tag}
          </span>
          <h3 className="font-bold text-slate-800 group-hover:text-orange-600 transition-colors">{title}</h3>
          <div className="flex items-center gap-2 text-slate-400 mt-1">
            <Clock size={12} />
            <span className="text-[10px] font-bold uppercase">{duration}</span>
          </div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all">
        <ArrowRight size={18} />
      </div>
    </Link>
  );
}