"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, BookOpen, Award, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ exercises: 0, badges: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
      }

      // Fetch exercises validated (count from exercises_completed table)
      const { count: exercisesCount, error: exercisesError } = await supabase
        .from('exercises_completed')
        .select('*', { count: 'exact', head: true });

      if (exercisesError) {
        console.error('Error fetching exercises count:', exercisesError);
      }

      // Fetch badges awarded (count from badges table)
      const { count: badgesCount, error: badgesError } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true });

      if (badgesError) {
        console.error('Error fetching badges count:', badgesError);
      }

      setStats({
        exercises: exercisesCount || 0,
        badges: badgesCount || 0
      });

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold">Chargement...</div>;

  return (
    <main className="max-w-7xl mx-auto px-8 py-12">
      <h1 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tighter">
        Console <span className="text-orange-500">Enseignant</span>
      </h1>

      {/* Résumé rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
          <Users className="mb-4 text-orange-500" />
          <div className="text-3xl font-black">{students.length}</div>
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Élèves suivis</div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
          <CheckCircle className="mb-4 text-emerald-500" />
          <div className="text-3xl font-black">{stats.exercises}</div>
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Exercices validés</div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
          <Award className="mb-4 text-orange-500" />
          <div className="text-3xl font-black">{stats.badges}</div>
          <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Badges décernés</div>
        </div>
      </div>

      {/* Liste des élèves */}
      <div className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Élève</th>
              <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Niveau</th>
              <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Progression</th>
              <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Dernière activité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-8 py-6 font-bold text-slate-800">{s.full_name || s.email}</td>
                <td className="px-8 py-6 text-slate-500 text-sm">{s.level || 'Non défini'}</td>
                <td className="px-8 py-6">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full" style={{ width: `0%` }}></div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm italic text-slate-400">Aucune activité</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}