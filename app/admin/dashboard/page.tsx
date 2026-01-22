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
      setLoading(true);

      // 1. Récupérer les profils des élèves
      const { data: studentsData, error: studentsError } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin');

      if (studentsError) console.error('Error fetching students:', studentsError);
      else setStudents(studentsData || []);

      // 2. Récupérer le nombre total d'exercices validés (table user_progress)
      const { count: exercisesCount, error: exercisesError } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true });

      if (exercisesError) console.error('Error fetching exercises count:', exercisesError);

      // 3. Récupérer le nombre total de BADGES décernés (table badges)
      const { count: badgesCount, error: badgesError } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true });

      if (badgesError) console.error('Error fetching badges count:', badgesError);

      setStats({
        exercises: exercisesCount || 0,
        badges: badgesCount || 0, // Mise à jour ici
      });

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* En-tête */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
              Dashboard <span className="text-orange-500">Enseignant</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">Suivi global de la progression des classes.</p>
          </div>
        </div>

        {/* --- GRILLE DES STATISTIQUES --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            icon={<Users className="text-blue-500" />} 
            label="Élèves inscrits" 
            value={students.length} 
            color="bg-blue-50" 
          />
          <StatCard 
            icon={<CheckCircle className="text-emerald-500" />} 
            label="Exercices validés" 
            value={stats.exercises} 
            color="bg-emerald-50" 
          />
          {/* CARTE DES BADGES MISE À JOUR */}
          <StatCard 
            icon={<Award className="text-orange-500" />} 
            label="Badges décernés" 
            value={stats.badges} 
            color="bg-orange-50" 
          />
        </div>

        {/* --- TABLEAU DES ÉLÈVES --- */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
            <Users size={16} /> Liste des élèves
          </h2>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Élève</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Niveau</th>
                  <th className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Dernière activité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-8 py-6 font-bold text-slate-800">{s.full_name || s.email}</td>
                    <td className="px-8 py-6 text-slate-500 text-sm">
                      <span className="bg-slate-100 px-3 py-1 rounded-full font-bold text-[10px] uppercase">
                        {s.level || 'Non défini'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-400 text-sm italic">
                      {s.updated_at ? new Date(s.updated_at).toLocaleDateString() : 'Aucune'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 transition-transform hover:scale-[1.02]">
      <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-black text-slate-900">{value}</div>
        <div className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">{label}</div>
      </div>
    </div>
  );
}