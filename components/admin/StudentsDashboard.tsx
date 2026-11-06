"use client";
import { useEffect, useState, useMemo } from 'react';
import { Award, CheckCircle, Search, Clock, X, Download, ChevronRight, Lock, Pencil, Trash2, UserPlus } from 'lucide-react';
import React from 'react';
import { getAdminDashboardData, getStudentAdminDetails, type AdminStudent } from '@/app/actions/admin';
import { getStudentWorkDetail, type StudentWorkDetail } from '@/app/actions/activity';
import { StudentWorkBlocks } from '@/components/admin/StudentWorkBlocks';
import { PrivateLessonDates } from '@/components/admin/PrivateLessonDates';
import { StudentFollowup } from '@/components/admin/StudentFollowup';
import { StudentProgressModal } from '@/components/admin/StudentProgressModal';
import { SheetBadgeFox } from '@/components/fox/SheetBadgeFox';
import { AchievementMark } from '@/components/fox/AchievementMark';
import { DeleteStudentDialog, StudentAccountDialog } from '@/components/admin/StudentAccounts';
import { isAbortError } from '@/lib/is-abort-error';
import { classGroups, NO_CLASS } from '@/lib/class-groups';
import { isInactive } from '@/lib/admin-today';

// Niveaux pour l'affichage et le filtrage
const LEVELS = [
  { id: 'ALL', label: 'Tous les niveaux' },
  { id: 'SNI', label: '2nde SNI' },
  { id: 'SNT', label: '2nde SNT' },
  { id: '1NSI', label: '1ère NSI' },
  { id: 'TNSI', label: 'Terminale NSI' },
  { id: 'SIO', label: 'BTS SIO' }
];

type Audience = 'particuliers' | 'classe';
type DashboardData = { students: AdminStudent[]; totalExercises: number; totalBadges: number };

const lastActiveLabel = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Jamais');

/**
 * Liste des élèves (ancienne page /admin). `initial` sert aux données fictives de la page de développement ;
 * `initialClass`, `initialAudience` et `openCreate` viennent de l'adresse (/admin/eleves?classe=…&public=…&nouveau=1).
 */
export function StudentsDashboard({
  initial,
  initialClass = '',
  initialAudience,
  openCreate = false,
}: {
  initial?: DashboardData;
  initialClass?: string;
  initialAudience?: Audience;
  openCreate?: boolean;
}) {
  const [students, setStudents] = useState<AdminStudent[]>(initial?.students ?? []);
  const [totalExercises, setTotalExercises] = useState(initial?.totalExercises ?? 0);
  const [totalBadges, setTotalBadges] = useState(initial?.totalBadges ?? 0);
  const [loading, setLoading] = useState(!initial);

  // États pour les filtres
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [audience, setAudience] = useState<Audience>(initialAudience ?? (initialClass ? 'classe' : 'particuliers'));
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState(initialClass);
  const [onlyInactive, setOnlyInactive] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [progressStudent, setProgressStudent] = useState<AdminStudent | null>(null);
  const [accountMode, setAccountMode] = useState<'create' | 'edit' | null>(openCreate ? 'create' : null);
  const [accountStudent, setAccountStudent] = useState<AdminStudent | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<AdminStudent | null>(null);
  const now = useMemo(() => new Date(), [students]);

  const fetchData = async () => {
    if (initial) return;
    setLoading(true);
    try {
      const data = await getAdminDashboardData();
      setStudents(data.students);
      setTotalExercises(data.totalExercises);
      setTotalBadges(data.totalBadges);
    } catch (error) {
      if (!isAbortError(error)) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- FILTRES ET STATS ---

  const audienceStudents = useMemo(
    () => students.filter((s) => (audience === 'particuliers' ? Boolean(s.has_private_lessons) : !s.has_private_lessons)),
    [students, audience],
  );

  const filteredStudents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return audienceStudents.filter(s => {
      const matchesSearch = !query || (s.full_name || s.email || '').toLowerCase().includes(query);
      const matchesLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
      const matchesClass = audience !== 'classe' || !classFilter
        || (classFilter === NO_CLASS ? !s.classe?.trim() : s.classe?.trim() === classFilter);
      const matchesActivity = !onlyInactive || isInactive(s.updated_at, now);
      return matchesSearch && matchesLevel && matchesClass && matchesActivity;
    });
  }, [audienceStudents, selectedLevel, searchQuery, audience, classFilter, onlyInactive, now]);

  // Élèves de classe : une section par classe, dans l'ordre des classes.
  const classOptions = useMemo(
    () => classGroups(audienceStudents.filter((s) => audience === 'classe' && (selectedLevel === 'ALL' || s.level === selectedLevel)), (s) => s.classe),
    [audienceStudents, audience, selectedLevel],
  );
  const studentSections = useMemo(
    () => audience === 'classe'
      ? classGroups(filteredStudents, (s) => s.classe)
      : [{ key: 'all', label: '', items: filteredStudents }],
    [filteredStudents, audience],
  );

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const inactive = filteredStudents.filter((s) => isInactive(s.updated_at, now)).length;
    return { total, active: total - inactive, inactive, activityRate: total ? Math.round(((total - inactive) / total) * 100) : 0 };
  }, [filteredStudents, now]);

  const exportData = () => {
    const headers = ['Nom', 'Email', 'Niveau', 'Classe', 'Dernière Activité', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => {
        const lastActive = s.updated_at ? new Date(s.updated_at).toLocaleDateString() : 'Jamais';
        return [
          `"${s.full_name || 'Sans nom'}"`,
          s.email,
          s.level || 'N/A',
          s.classe || '',
          lastActive,
          isInactive(s.updated_at, now) ? 'Inactif' : 'Actif'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eleves_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const levelLabel = (level: string | null) => LEVELS.find((l) => l.id === level)?.label || level || 'Niveau ?';

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Élèves</p>
          <h1>Liste des élèves</h1>
          <p>Cliquer sur un nom ouvre sa progression ; « Suivi » ouvre son travail, ses devoirs et ses messages.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-btn" onClick={() => { setAccountStudent(null); setAccountMode('create'); }}>
            <UserPlus size={16} aria-hidden /> Ajouter un élève
          </button>
          <button type="button" className="admin-btn is-quiet" onClick={exportData}>
            <Download size={16} aria-hidden /> Exporter CSV
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <div className="admin-seg" role="group" aria-label="Type d'élèves">
          {([
            ['particuliers', 'Cours particuliers'],
            ['classe', 'Élèves de classe'],
          ] as const).map(([id, label]) => {
            const count = students.filter((s) => (id === 'particuliers' ? s.has_private_lessons : !s.has_private_lessons)).length;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={audience === id}
                className={audience === id ? 'is-on' : ''}
                onClick={() => {
                  setAudience(id);
                  setClassFilter('');
                }}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
        <label className="admin-search">
          <Search size={18} aria-hidden />
          <input
            type="search"
            placeholder="Rechercher un élève"
            aria-label="Rechercher un élève"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
        <select className="admin-select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} aria-label="Filtrer par niveau">
          {LEVELS.map((level) => (
            <option key={level.id} value={level.id}>{level.label}</option>
          ))}
        </select>
      </div>

      <div className="admin-chips" role="group" aria-label="Filtrer">
        {audience === 'classe' ? (
          <>
            <button type="button" aria-pressed={!classFilter} className={!classFilter ? 'is-on' : ''} onClick={() => setClassFilter('')}>Toutes les classes</button>
            {classOptions.map((group) => (
              <button
                key={group.key}
                type="button"
                aria-pressed={classFilter === group.key}
                className={classFilter === group.key ? 'is-on' : ''}
                onClick={() => setClassFilter(classFilter === group.key ? '' : group.key)}
              >
                {group.label} ({group.items.length})
              </button>
            ))}
          </>
        ) : null}
        <button type="button" aria-pressed={onlyInactive} className={`is-warn${onlyInactive ? ' is-on' : ''}`} onClick={() => setOnlyInactive(!onlyInactive)}>
          Inactifs depuis 7 jours
        </button>
      </div>

      <div className="admin-stats">
        <span><b>{stats.total}</b> élève{stats.total > 1 ? 's' : ''} affiché{stats.total > 1 ? 's' : ''}</span>
        <span><b>{stats.activityRate} %</b> actifs sur 7 jours</span>
        <span className={stats.inactive ? 'is-warn' : ''}><b>{stats.inactive}</b> inactif{stats.inactive > 1 ? 's' : ''}</span>
        <span><CheckCircle size={14} aria-hidden /> <b>{totalExercises}</b> exercices validés sur le site</span>
        <span><Award size={14} aria-hidden /> <b>{totalBadges}</b> badges</span>
      </div>

      {audience === 'particuliers' && <PrivateLessonDates />}

      {loading ? (
        <div className="admin-loading" role="status">Chargement des élèves</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Élève</th>
                <th scope="col" className="admin-col-opt">Niveau</th>
                <th scope="col" className="admin-col-opt">Classe</th>
                <th scope="col" className="admin-col-opt">Dernière activité</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                studentSections.map((section) => (
                  <React.Fragment key={section.key}>
                    {section.label && (
                      <tr className="admin-table-group">
                        <th colSpan={5} scope="colgroup">
                          {section.label}
                          <span>{section.items.length} élève{section.items.length > 1 ? 's' : ''}</span>
                        </th>
                      </tr>
                    )}
                    {section.items.map((s) => {
                      const inactive = isInactive(s.updated_at, now);
                      const name = s.full_name || 'Sans nom';
                      const classLabel = s.classe || (s.has_private_lessons ? 'Particulier' : 'Sans classe');
                      return (
                        <tr key={s.id}>
                          <td>
                            <div className="admin-who">
                              <span className="admin-avatar" aria-hidden>{(s.full_name || s.email || '?')[0]}</span>
                              <span className="min-w-0">
                                <button
                                  type="button"
                                  onClick={() => setProgressStudent(s)}
                                  className="admin-who-name"
                                  aria-label={`Voir la progression de ${s.full_name || 'cet élève'}`}
                                >
                                  {name}
                                </button>
                                <small>{s.email}</small>
                                <small className="admin-row-sub">
                                  {levelLabel(s.level)} · {classLabel} ·{' '}
                                  <span className={inactive ? 'admin-text-warn' : ''}>{lastActiveLabel(s.updated_at)}</span>
                                </small>
                              </span>
                            </div>
                          </td>
                          <td className="admin-col-opt"><span className="admin-pill">{levelLabel(s.level)}</span></td>
                          <td className="admin-col-opt">{classLabel}</td>
                          <td className="admin-col-opt">
                            <span className={`admin-pill ${inactive ? 'is-warn' : 'is-ok'}`}>
                              <Clock size={12} aria-hidden /> {lastActiveLabel(s.updated_at)}
                            </span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button type="button" className="is-main" onClick={() => setSelectedStudent(s)}>
                                Suivi <ChevronRight size={15} aria-hidden />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setAccountStudent(s);
                                  setAccountMode('edit');
                                }}
                                aria-label={`Modifier le compte de ${name}`}
                                title="Modifier le compte"
                              >
                                <Pencil size={15} aria-hidden />
                              </button>
                              <button type="button" className="is-danger" onClick={() => setStudentToDelete(s)} aria-label={`Supprimer ${name}`} title="Supprimer">
                                <Trash2 size={15} aria-hidden />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-empty">Aucun élève pour ce filtre.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
      {progressStudent && (
        <StudentProgressModal
          student={progressStudent}
          onClose={() => setProgressStudent(null)}
        />
      )}
      {accountMode && (
        <StudentAccountDialog
          mode={accountMode}
          student={accountStudent}
          onClose={() => setAccountMode(null)}
          onSaved={() => { fetchData(); }}
        />
      )}
      {studentToDelete && (
        <DeleteStudentDialog
          student={studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onDeleted={() => {
            if (selectedStudent?.id === studentToDelete.id) setSelectedStudent(null);
            if (progressStudent?.id === studentToDelete.id) setProgressStudent(null);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function StudentDetailsModal({ student, onClose }: { student: AdminStudent; onClose: () => void }) {
  const [details, setDetails] = useState<any>(null);
  const [reservedCourses, setReservedCourses] = useState<any[]>([]);
  const [work, setWork] = useState<StudentWorkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      const [data, workDetail] = await Promise.all([
        getStudentAdminDetails(student.id),
        getStudentWorkDetail(student.id),
      ]);
      setDetails({
        badges: data.badges || [],
        achievements: data.achievements || [],
        exercisesCount: data.exercisesCount || 0,
      });
      setReservedCourses(data.reservedCourses || []);
      setWork(workDetail);
      setLoading(false);
    }
    fetchDetails();
  }, [student]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center font-bold text-2xl shadow-inner">
              {(student.full_name || student.email || '?')[0]}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{student.full_name || 'Élève sans nom'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-bold">
                   {LEVELS.find(l => l.id === student.level)?.label || student.level || 'N/A'}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                  student.has_private_lessons ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {student.has_private_lessons ? 'Cours particuliers' : 'Élève de classe'}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Award size={20} />
                    <p className="text-xs font-bold">Badges Obtenus</p>
                  </div>
                  <p className="text-4xl font-bold text-slate-800">{details?.badges.length}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <CheckCircle size={20} />
                    <p className="text-xs font-bold">Exercices Terminés</p>
                  </div>
                  <p className="text-4xl font-bold text-slate-800">{details?.exercisesCount}</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-orange-600">
                    <Award size={20} />
                    <p className="text-xs font-bold">Succès</p>
                  </div>
                  <p className="text-4xl font-bold text-slate-800">{details?.achievements?.length || 0}</p>
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

              {work && <StudentWorkBlocks detail={work} />}

              <StudentFollowup studentId={student.id} />

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
                        <SheetBadgeFox
                          courseId={b.course_id || b.badge_id || ''}
                          title={b.badge_name}
                          size={52}
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-700 text-sm truncate">
                            {b.badge_name
                              || (b.badge_id
                                ? String(b.badge_id).split('_').map((w:string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                                : 'Badge Inconnu')}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                             <Clock size={10} />
                             {new Date(b.unlocked_at || b.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 sm:p-10 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                      <Award size={24} />
                    </div>
                    <p className="text-slate-500 font-bold">Aucun badge débloqué</p>
                    <p className="text-slate-400 text-sm">Cet élève n'a pas encore remporté de trophées.</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  Succès
                  <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-full">{details?.achievements?.length || 0}</span>
                </h3>
                {details?.achievements?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {details.achievements.map((achievement: { id: string; achievement_id: string; title: string; description: string | null; unlocked_at: string }) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white">
                        <AchievementMark id={achievement.achievement_id} title={achievement.title} size={52} />
                        <div className="overflow-hidden">
                          <p className="font-bold text-slate-700 text-sm truncate">{achievement.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 sm:p-10 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                    <p className="text-slate-500 font-bold">Aucun succès débloqué</p>
                    <p className="text-slate-400 text-sm">Les succès de fiche et les paliers apparaîtront ici.</p>
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
