"use client";
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Award, CheckCircle, Search, Filter, AlertCircle, TrendingUp, Clock, X, Download, Star, ChevronRight, Lock } from 'lucide-react';
import React from 'react';
import { getReservedCourses } from '@/app/actions/getReservedCourses';

// Mapping des niveaux pour l'affichage et le filtrage
const LEVELS = [
  { id: 'ALL', label: 'Vue Globale' },
  { id: 'SNI', label: '2nde SNI' },
  { id: 'SNT', label: '2nde SNT' },
  { id: '1NSI', label: '1ère NSI' },
  { id: 'TNSI', label: 'Terminale NSI' },
  { id: 'SIO', label: 'BTS SIO' }
];

export default function AdminDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // États pour les filtres
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // 1. Récupérer les profils des élèves avec leurs stats (si possible)
      // Pour l'instant on récupère tout et on fera les calculs côté client
      const { data: studentsData } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin')
        .order('updated_at', { ascending: false });
      
      setStudents(studentsData || []);

      // 2. Compter le nombre total d'exercices validés
      const { count: countEx } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true });
      
      setTotalExercises(countEx || 0);

      // 3. Compter le nombre total de BADGES
      const { count: countBadges } = await supabase
        .from('badges')
        .select('*', { count: 'exact', head: true });

      setTotalBadges(countBadges || 0);

      setLoading(false);
    }

    fetchData();
  }, []);

  // --- LOGIQUE DE FILTRAGE ET STATS ---

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = (s.full_name || s.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [students, selectedLevel, searchQuery]);

  // Calcul des stats pour la vue actuelle
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) return { active: 0, inactive: 0, activityRate: 0 };

    // Un élève est "actif" s'il s'est connecté dans les 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeCount = filteredStudents.filter(s => new Date(s.updated_at) > sevenDaysAgo).length;
    
    return {
      active: activeCount,
      inactive: total - activeCount,
      activityRate: Math.round((activeCount / total) * 100)
    };
  }, [filteredStudents]);

  const exportData = () => {
    const headers = ['Nom', 'Email', 'Niveau', 'Dernière Activité', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => {
        const lastActive = s.updated_at ? new Date(s.updated_at).toLocaleDateString() : 'Jamais';
        const isInactive = !s.updated_at || (new Date().getTime() - new Date(s.updated_at).getTime()) > (7 * 24 * 60 * 60 * 1000);
        return [
          `"${s.full_name || 'Sans nom'}"`,
          s.email,
          s.level || 'N/A',
          lastActive,
          isInactive ? 'Inactif' : 'Actif'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eleves_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- EN-TÊTE --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter">
              Pilotage <span className="text-orange-500">Pédagogique</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">
              Vue d'ensemble et suivi des élèves par niveau.
            </p>
          </div>
          
          {/* Global Stats Badges (Visible tout le temps) */}
          <div className="flex gap-4">
             <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Badges</p>
                  <p className="text-xl font-black text-slate-800">{totalBadges}</p>
                </div>
             </div>
          </div>
        </div>

        {/* --- BARRE DE NAVIGATION (TABS) --- */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
          {LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`px-6 py-3 rounded-t-2xl font-bold text-sm transition-all ${
                selectedLevel === level.id
                  ? 'bg-white text-orange-500 border-x border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] translate-y-[1px]'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>

        {/* --- CONTENU PRINCIPAL --- */}
        <div className="bg-white rounded-b-3xl rounded-tr-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-8">
          
          {/* 1. KPIs du Niveau Sélectionné */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
              icon={<Users />} 
              label="Élèves (Vue actuelle)" 
              value={filteredStudents.length} 
              subtext="Total inscrits"
              color="bg-blue-50 text-blue-500" 
            />
            <StatCard 
              icon={<TrendingUp />} 
              label="Taux d'activité (7j)" 
              value={`${stats.activityRate}%`} 
              subtext={`${stats.active} élèves actifs`}
              color="bg-emerald-50 text-emerald-500" 
            />
             <StatCard 
              icon={<AlertCircle />} 
              label="À surveiller" 
              value={stats.inactive} 
              subtext="Inactifs > 7 jours"
              color="bg-red-50 text-red-500" 
            />
            <StatCard 
              icon={<CheckCircle />} 
              label="Exercices Validés" 
              value={totalExercises} // Idéalement filtrer par niveau si possible plus tard
              subtext="Global plateforme"
              color="bg-purple-50 text-purple-500" 
            />
          </div>

          {/* 2. Barre d'outils (Recherche) */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher un élève..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-slate-600 font-medium"
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <button 
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 font-bold shadow-sm"
              >
                <Download size={16} />
                <span className="hidden md:inline">Exporter CSV</span>
              </button>
              <div className="h-8 w-px bg-slate-200 mx-2"></div>
              <Filter size={16} />
              <span>{filteredStudents.length} élève{filteredStudents.length > 1 ? 's' : ''} affiché{filteredStudents.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* 3. Tableau des Élèves */}
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 italic">Élève</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 italic">Niveau</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 italic">Dernière Activité</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 italic">Statut</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 italic text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => {
                    const lastActive = s.updated_at ? new Date(s.updated_at) : null;
                    const isInactive = !lastActive || (new Date().getTime() - lastActive.getTime()) > (7 * 24 * 60 * 60 * 1000);
                    
                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold uppercase text-sm">
                              {(s.full_name || s.email || '?')[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800">{s.full_name || 'Sans nom'}</p>
                              <p className="text-xs text-slate-400 font-medium">{s.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wide">
                            {LEVELS.find(l => l.id === s.level)?.label || s.level || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                            <Clock size={14} />
                            {lastActive ? lastActive.toLocaleDateString() : 'Jamais'}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {isInactive ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              Inactif
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => setSelectedStudent(s)}
                            className="flex items-center gap-1 ml-auto text-sm font-bold text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Voir détails <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                      Aucun élève trouvé pour ce filtre.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>
      </div>
      
      {/* Modal Détails Élève */}
      {selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
}

function StudentDetailsModal({ student, onClose }: { student: any, onClose: () => void }) {
  const [details, setDetails] = useState<any>(null);
  const [reservedCourses, setReservedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      // 1. Récupérer les badges
      const { data: badges } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', student.id)
        .order('created_at', { ascending: false });
        
      // 2. Récupérer le nombre d'exercices
      const { count } = await supabase
        .from('user_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', student.id);

      // 3. Récupérer les cours réservés (Server Action)
      let courses: any[] = [];
      if (student.has_private_lessons) {
        courses = await getReservedCourses(student.full_name || "");
      }
      
      setDetails({ badges: badges || [], exercisesCount: count || 0 });
      setReservedCourses(courses);
      setLoading(false);
    }
    fetchDetails();
  }, [student]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center font-black text-2xl shadow-inner">
              {(student.full_name || student.email || '?')[0]}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{student.full_name || 'Élève sans nom'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide">
                   {LEVELS.find(l => l.id === student.level)?.label || student.level || 'N/A'}
                </span>
                <span className="text-slate-400 text-sm font-medium">{student.email}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-orange-500"></div>
              <p className="font-medium animate-pulse">Chargement des données...</p>
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Award size={20} />
                    <p className="text-xs font-bold uppercase tracking-wider">Badges Obtenus</p>
                  </div>
                  <p className="text-4xl font-black text-slate-800">{details?.badges.length}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <CheckCircle size={20} />
                    <p className="text-xs font-bold uppercase tracking-wider">Exercices Terminés</p>
                  </div>
                  <p className="text-4xl font-black text-slate-800">{details?.exercisesCount}</p>
                </div>
              </div>

              {/* Reserved Courses Section */}
              {reservedCourses.length > 0 && (
                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                  <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                    <Lock size={18} />
                    Cours Réservés Spéciaux
                    <span className="bg-white text-orange-600 text-xs px-2 py-1 rounded-full border border-orange-200">{reservedCourses.length}</span>
                  </h3>
                  <div className="space-y-2">
                    {reservedCourses.map((course, idx) => (
                      <a 
                        key={idx} 
                        href={course.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 hover:border-orange-300 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                           <span className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                             N{course.level}
                           </span>
                           <span className="font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                             {course.title}
                           </span>
                        </div>
                        <ChevronRight size={16} className="text-orange-300 group-hover:text-orange-500" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Badges List */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  Collection de Badges
                  <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{details?.badges.length}</span>
                </h3>
                
                {details?.badges.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.badges.map((b: any) => (
                      <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-orange-200 transition-colors group">
                        <div className="p-2 bg-yellow-50 text-yellow-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Star size={18} fill="currentColor" className="opacity-80" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-700 text-sm truncate">
                            {b.badge_id 
                              ? b.badge_id.split('_').map((w:string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
                              : 'Badge Inconnu'}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                             <Clock size={10} />
                             {new Date(b.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Award size={24} />
                    </div>
                    <p className="text-slate-500 font-bold">Aucun badge débloqué</p>
                    <p className="text-slate-400 text-sm">Cet élève n'a pas encore remporté de trophées.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
           <button 
             onClick={onClose}
             className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
           >
             Fermer
           </button>
        </div>
      </div>
    </div>
  );
}

// Composant Helper pour les cartes de stats
function StatCard({ icon, label, value, subtext, color }: any) {
  return (
    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.split(' ')[0]} ${color.split(' ')[1]}`}>
          {React.cloneElement(icon, { size: 22 })}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</p>
        {subtext && <p className="text-xs text-slate-400 font-medium italic">{subtext}</p>}
      </div>
    </div>
  );
}
