"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { GraduationCap, Zap, BookOpen, ArrowRight, Clock } from 'lucide-react';

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
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

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