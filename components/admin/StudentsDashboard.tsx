"use client";
import { useEffect, useState, useMemo } from 'react';
import { Award, CheckCircle, Search, Download, UserPlus, Users } from 'lucide-react';
import React from 'react';
import { getAdminDashboardData, type AdminStudent } from '@/app/actions/admin';
import { PrivateLessonDates } from '@/components/admin/PrivateLessonDates';
import { useAdminClass } from '@/components/admin/AdminClassContext';
import { ADMIN_PRIVATE } from '@/lib/admin-class';
import { DeleteStudentDialog, StudentAccountDialog } from '@/components/admin/StudentAccounts';
import { BulkStudentsDialog } from '@/components/admin/BulkStudents';
import { isAbortError } from '@/lib/is-abort-error';
import { classGroups, NO_CLASS } from '@/lib/class-groups';
import { isInactive } from '@/lib/admin-today';
import { getCatchUpCandidates, getStudentsOverview, draftCatchUpSheet, type CatchUpGroup, type StudentsOverview } from '@/app/actions/studentSheets';
import { StudentTiles } from '@/components/admin/students/StudentTiles';
import { StudentModal } from '@/components/admin/students/StudentModal';
import { SheetComposer, type ComposerRequest } from '@/components/admin/students/SheetComposer';
import { CatchUpPanel } from '@/components/admin/students/CatchUpPanel';
import tileStyles from '@/components/admin/students/Students.module.css';

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

/**
 * Liste des élèves (ancienne page /admin). `initial` sert aux données fictives de la page de développement ;
 * `initialClass`, `initialAudience` et `openCreate` viennent de l'adresse (/admin/eleves?classe=…&public=…&nouveau=1).
 */
export function StudentsDashboard({
  initial,
  initialClass = '',
  initialAudience,
  openCreate = false,
  openBulk = false,
  initialInactive = false,
}: {
  initial?: DashboardData;
  initialClass?: string;
  initialAudience?: Audience;
  openCreate?: boolean;
  openBulk?: boolean;
  initialInactive?: boolean;
}) {
  const { selection, select } = useAdminClass();
  const [students, setStudents] = useState<AdminStudent[]>(initial?.students ?? []);
  const [totalExercises, setTotalExercises] = useState(initial?.totalExercises ?? 0);
  const [totalBadges, setTotalBadges] = useState(initial?.totalBadges ?? 0);
  const [loading, setLoading] = useState(!initial);

  // États pour les filtres
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  // Sans classe choisie dans la barre du haut : élèves de classe ou cours particuliers, au choix.
  const [freeAudience, setFreeAudience] = useState<Audience>(initialAudience ?? 'classe');
  const audience: Audience = selection === ADMIN_PRIVATE ? 'particuliers' : selection ? 'classe' : freeAudience;
  const classFilter = selection && selection !== ADMIN_PRIVATE ? selection : '';
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInactive, setOnlyInactive] = useState(initialInactive);

  // Lien « /eleves?classe=… » (tuiles de la page Aujourd'hui) : la classe passe dans la barre du haut.
  useEffect(() => {
    if (initialAudience === 'particuliers' && selection !== ADMIN_PRIVATE) select(ADMIN_PRIVATE);
    else if (initialClass && initialClass !== NO_CLASS && initialClass !== selection) select(initialClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [accountMode, setAccountMode] = useState<'create' | 'edit' | null>(openCreate ? 'create' : null);
  const [accountStudent, setAccountStudent] = useState<AdminStudent | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<AdminStudent | null>(null);
  const [bulkOpen, setBulkOpen] = useState(openBulk);
  const [overview, setOverview] = useState<StudentsOverview | null>(null);
  const [catchUp, setCatchUp] = useState<CatchUpGroup[]>([]);
  const [openStudent, setOpenStudent] = useState<string | null>(null);
  const [composer, setComposer] = useState<ComposerRequest | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const now = useMemo(() => new Date(), [students]);

  const fetchData = async () => {
    if (initial) return;
    setLoading(true);
    try {
      const [data, nextOverview, nextCatchUp] = await Promise.all([
        getAdminDashboardData(),
        getStudentsOverview().catch(() => null),
        getCatchUpCandidates().catch(() => [] as CatchUpGroup[]),
      ]);
      setOverview(nextOverview);
      setCatchUp(nextCatchUp);
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
      const matchesActivity = !onlyInactive || isInactive(s.last_work_at, now);
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

  // Classes existantes (élèves de classe), avec le niveau le plus fréquent : proposées dans l'ajout en lot.
  const knownClasses = useMemo(() => {
    const byClass = new Map<string, Map<string, number>>();
    for (const s of students) {
      const name = s.classe?.trim();
      if (!name || s.has_private_lessons) continue;
      const levels = byClass.get(name) ?? new Map<string, number>();
      if (s.level) levels.set(s.level, (levels.get(s.level) ?? 0) + 1);
      byClass.set(name, levels);
    }
    return [...byClass.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'fr', { numeric: true }))
      .map(([classe, levels]) => ({ classe, level: [...levels.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null }));
  }, [students]);

  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const inactive = filteredStudents.filter((s) => isInactive(s.last_work_at, now)).length;
    return { total, active: total - inactive, inactive, activityRate: total ? Math.round(((total - inactive) / total) * 100) : 0 };
  }, [filteredStudents, now]);

  const exportData = () => {
    const headers = ['Nom', 'Email', 'Niveau', 'Classe', 'Dernière Activité', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(s => {
        const lastActive = s.last_work_at ? new Date(s.last_work_at).toLocaleDateString() : 'Jamais';
        return [
          `"${s.full_name || 'Sans nom'}"`,
          s.email,
          s.level || 'N/A',
          s.classe || '',
          lastActive,
          isInactive(s.last_work_at, now) ? 'Inactif' : 'Actif'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `eleves_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };


  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Élèves</p>
          <h1>Liste des élèves</h1>
          <p>Un clic sur un élève ouvre son détail : place dans la classe, dernières évaluations, activité, message et fiches particulières. La classe se choisit dans la barre du haut.</p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-btn" onClick={() => { setAccountStudent(null); setAccountMode('create'); }}>
            <UserPlus size={16} aria-hidden /> Ajouter un élève
          </button>
          <button type="button" className="admin-btn is-quiet" onClick={() => setBulkOpen(true)}>
            <Users size={16} aria-hidden /> Ajouter en lot
          </button>
          <button type="button" className="admin-btn is-quiet" onClick={exportData}>
            <Download size={16} aria-hidden /> Exporter CSV
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        {selection ? null : (
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
                onClick={() => setFreeAudience(id)}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
        )}
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

      {notice ? <p className="adm-eval-info">{notice}</p> : null}
      {audience === 'classe' ? (
        <CatchUpPanel
          groups={catchUp.filter((group) => !classFilter || group.classe === classFilter)}
          onPrepare={(group, chosenStudents) => {
            const request: ComposerRequest = {
              kind: 'rattrapage',
              students: chosenStudents.map((student) => ({ id: student.id, name: student.name })),
              title: `Rattrapage : ${group.title}`,
              fromEvaluation: group.evaluationId,
              loading: true,
            };
            setComposer(request);
            const notions = [...new Set(chosenStudents.flatMap((student) => student.notions))];
            const level = students.find((student) => student.id === chosenStudents[0]?.id)?.level ?? null;
            void draftCatchUpSheet(notions, level)
              .then((draft) => setComposer((current) => (current === request ? { ...request, source: draft.source, loading: false } : current)))
              .catch(() => setComposer((current) => (current === request ? { ...request, source: '', loading: false } : current)));
          }}
        />
      ) : null}

      {loading ? (
        <div className="admin-loading" role="status">Chargement des élèves</div>
      ) : (
        filteredStudents.length ? (
          <div className={tileStyles.sections}>
            {studentSections.map((section) => {
              const stats = section.label ? overview?.classes[section.label] : undefined;
              return (
                <section key={section.key} aria-label={section.label || 'Élèves'}>
                  {section.label ? (
                    <h2 className={tileStyles.sectionHead}>
                      {section.label}
                      <small>
                        {section.items.length} élève{section.items.length > 1 ? 's' : ''}
                        {stats?.mean != null ? ` · moyenne ${String(stats.mean).replace('.', ',')}` : ''}
                        {stats?.median != null ? ` · médiane ${String(stats.median).replace('.', ',')}` : ''}
                      </small>
                    </h2>
                  ) : null}
                  <StudentTiles
                    students={section.items}
                    overview={overview}
                    now={now}
                    onOpen={(student) => setOpenStudent(student.id)}
                    onEdit={(student) => {
                      setAccountStudent(student);
                      setAccountMode('edit');
                    }}
                    onDelete={setStudentToDelete}
                  />
                </section>
              );
            })}
          </div>
        ) : (
          <p className="admin-empty">Aucun élève pour ce filtre.</p>
        )
      )}

      {accountMode && (
        <StudentAccountDialog
          mode={accountMode}
          student={accountStudent}
          onClose={() => setAccountMode(null)}
          onSaved={() => { fetchData(); }}
        />
      )}
      {openStudent && (
        <StudentModal
          studentId={openStudent}
          onClose={() => setOpenStudent(null)}
          onGiveSheet={(student) => {
            setOpenStudent(null);
            setComposer({ kind: 'travail', students: [student] });
          }}
        />
      )}
      {composer && (
        <SheetComposer
          key={composer.students.map((student) => student.id).join('-') + composer.kind}
          request={composer}
          onClose={() => setComposer(null)}
          onCreated={() => {
            setNotice(
              composer.kind === 'rattrapage'
                ? 'Fiche de rattrapage envoyée : elle apparaît en vert en haut de l’espace des élèves choisis. Les copies se suivent dans Préparer, Évaluations.'
                : 'Fiche particulière envoyée : elle apparaît en haut de l’espace de l’élève. La copie se suit dans Préparer, Évaluations.',
            );
            setComposer(null);
            fetchData();
          }}
        />
      )}
      {bulkOpen && (
        <BulkStudentsDialog
          classes={knownClasses}
          onClose={() => setBulkOpen(false)}
          onCreated={() => { fetchData(); }}
        />
      )}
      {studentToDelete && (
        <DeleteStudentDialog
          student={studentToDelete}
          onClose={() => setStudentToDelete(null)}
          onDeleted={() => {
            fetchData();
          }}
        />
      )}
    </div>
  );
}
