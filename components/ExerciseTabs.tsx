"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Code2, Maximize2, Minimize2, PanelLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { acceptsWrittenAnswer, canOpenExerciseIde, isEditorExercise, showsRealizeButton } from '@/lib/exercise-type';
import { contentFolderFromParam } from '@/lib/nsi-levels';
import { getExerciseById, type LabExercise } from '@/app/actions/getExercises';
import { ExerciseWorkspace } from '@/components/lab/ExerciseWorkspace';
import WrittenAnswer from './WrittenAnswer';

interface TabProps {
  id: string;
  label: string;
  type?: string;
  children: React.ReactNode;
}

const DIFFICULTY_LEVELS = ['Introduction', 'Facile', 'Moyen', 'Avancé', 'Difficile', 'Expert'] as const;

type ExerciseDifficulty = (typeof DIFFICULTY_LEVELS)[number];

const DIFFICULTY_COLORS: Record<ExerciseDifficulty, string> = {
  Introduction: '#0ea5e9',
  Facile: '#16a34a',
  Moyen: '#f59e0b',
  Avancé: '#ea580c',
  Difficile: '#e11d48',
  Expert: '#7c3aed',
};

function normalizeDifficultyText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function extractSectionNumber(label: string, id?: string): number | null {
  const fromLabel = label.match(/^(\d+)\./);
  if (fromLabel) return Number(fromLabel[1]);

  const fromId = id?.match(/-(\d+)-\d+$/);
  if (fromId) return Number(fromId[1]);

  return null;
}

function difficultyFromSection(section: number): ExerciseDifficulty {
  if (section <= 1) return 'Introduction';
  if (section === 2) return 'Facile';
  if (section === 3) return 'Moyen';
  if (section === 4) return 'Avancé';
  if (section === 5) return 'Difficile';
  return 'Expert';
}

function getExerciseDifficulty(label: string, id?: string): ExerciseDifficulty {
  const raw = normalizeDifficultyText(label);

  if (raw.includes('introduction') || /\bintro\b/.test(raw)) return 'Introduction';
  if (raw.includes('expert')) return 'Expert';
  if (raw.includes('difficile') || raw.includes('hard')) return 'Difficile';
  if (raw.includes('avance') || raw.includes('advanced')) return 'Avancé';
  if (
    raw.includes('moyen') ||
    raw.includes('intermediaire') ||
    raw.includes('medium') ||
    /\bmed\b/.test(raw)
  ) {
    return 'Moyen';
  }
  if (raw.includes('facile') || raw.includes('easy')) return 'Facile';

  const section = extractSectionNumber(label, id);
  if (section !== null) return difficultyFromSection(section);

  return 'Introduction';
}

function cleanExerciseLabel(label: string): string {
  return label
    .replace(/\[(Introduction|Facile|Moyen|Avancé|Difficile|Expert)\]/gi, '')
    .replace(/\((Introduction|Facile|Moyen|Avancé|Difficile|Expert|Intermédiaire|Intermediaire)\)/gi, '')
    .replace(/^(Introduction|Facile|Moyen|Avancé|Difficile|Expert|Easy|Medium|Med|Hard)\s*[-–]?\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** « 1.2 - Nombre positif » devient { number: "1.2", title: "Nombre positif" }. */
function splitExerciseLabel(label: string): { number: string; title: string } {
  const clean = cleanExerciseLabel(label);
  const match = clean.match(/^(\d+(?:\.\d+)*)\s*[-–:.]?\s+(.+)$/);
  return match ? { number: match[1], title: match[2] } : { number: '', title: clean };
}

const LEVEL_FOLDERS = new Set(['0', '1', '2', '3', '4', 'ressources', 'particuliers']);

/** Niveau de la fiche, lu dans l'adresse (/cours/<niveau>/...), pour le renard du bon niveau. */
function levelFromPath(pathname: string | null): string {
  const segment = pathname?.split('/')[2] ?? '';
  const folder = contentFolderFromParam(segment);
  return folder && LEVEL_FOLDERS.has(folder) ? folder : '2';
}

type SheetItem = {
  id: string;
  label: string;
  type?: string;
  number: string;
  title: string;
  difficulty: ExerciseDifficulty;
  content: React.ReactNode;
};

/** Premier exercice à faire sur le site : un onglet de consignes ne doit pas cacher les exercices. */
function firstPractice(items: SheetItem[], done: Set<string>) {
  const practice = items.filter((item) => isEditorExercise(item.type) || acceptsWrittenAnswer(item.type, item.label));
  return (practice.find((item) => !done.has(item.id)) ?? practice[0] ?? items[0])?.id ?? null;
}

const PracticeContext = React.createContext<{ role: string | null; courseId: string }>({ role: null, courseId: '' });

/** Éditeur d'un exercice de la fiche : l'exercice est chargé côté serveur, l'éditeur reste monté d'un exercice à l'autre. */
function SheetIde({ exerciseId, onCompleted }: { exerciseId: string; onCompleted: (id: string) => void }) {
  const [cache, setCache] = useState<Record<string, LabExercise | null>>({});
  const exercise = cache[exerciseId];

  useEffect(() => {
    if (exerciseId in cache) return;
    let cancelled = false;
    getExerciseById(exerciseId)
      .then((loaded) => { if (!cancelled) setCache((prev) => ({ ...prev, [exerciseId]: loaded })); })
      .catch(() => { if (!cancelled) setCache((prev) => ({ ...prev, [exerciseId]: null })); });
    return () => { cancelled = true; };
  }, [exerciseId, cache]);

  if (exercise === undefined) {
    return <div className="sheet-ide sheet-ide-loading">Chargement de l'éditeur</div>;
  }
  if (exercise === null) {
    return (
      <div className="sheet-ide sheet-ide-loading">
        Éditeur indisponible pour cet exercice.{' '}
        <Link href={`/exercice/${encodeURIComponent(exerciseId)}`}>Ouvrir sur une page à part</Link>
      </div>
    );
  }
  return <ExerciseWorkspace exercise={exercise} nav={null} embedded onCompleted={onCompleted} />;
}

export function ExerciseTabs({
  children,
  courseId,
  courseTitle,
}: {
  children: React.ReactNode,
  courseId: string,
  courseTitle: string,
}) {
  const pathname = usePathname();
  const level = levelFromPath(pathname);
  // Filter only valid React elements to avoid text nodes (whitespace) causing issues
  const childrenArray = React.Children.toArray(children).filter(React.isValidElement) as React.ReactElement<TabProps>[];

  const items = useMemo<SheetItem[]>(() => childrenArray.map((child) => {
    const label = (child.props.label || '').toString();
    return {
      id: child.props.id,
      label,
      type: child.props.type,
      ...splitExerciseLabel(label),
      difficulty: getExerciseDifficulty(label, child.props.id),
      content: child.props.children,
    };
  }), [childrenArray]);

  const groups = useMemo(() => DIFFICULTY_LEVELS
    .map((difficulty) => ({ difficulty, items: items.filter((item) => item.difficulty === difficulty) }))
    .filter((group) => group.items.length > 0), [items]);

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  // Aucun exercice choisi : le visiteur voit le renard qui l'invite à en choisir un.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [folded, setFolded] = useState(false);
  const [listOpen, setListOpen] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);

  const hasIde = canOpenExerciseIde(role);
  const done = useMemo(() => new Set(completedIds), [completedIds]);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).maybeSingle();
        setRole(typeof profile?.role === 'string' ? profile.role : null);

        const { data: progressData } = await supabase
          .from('user_progress')
          .select('exercise_id')
          .eq('user_id', session.user.id)
          .eq('course_id', courseId);

        if (progressData) setCompletedIds(progressData.map((row) => row.exercise_id));
      }
      setAuthReady(true);
    };
    fetchProgress();
  }, [courseId]);

  // L'élève arrive directement sur le premier exercice qui lui reste à faire.
  useEffect(() => {
    if (authReady && hasIde && selectedId === null) setSelectedId(firstPractice(items, done));
  }, [authReady, hasIde, selectedId, items, done]);

  useEffect(() => {
    if (!fullScreen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullScreen(false); };
    document.documentElement.classList.add('sheet-full-open');
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('sheet-full-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [fullScreen]);

  const index = items.findIndex((item) => item.id === selectedId);
  const current = index >= 0 ? items[index] : null;
  const previous = index > 0 ? items[index - 1] : null;
  const next = index >= 0 && index < items.length - 1 ? items[index + 1] : null;
  const markCompleted = (id: string) => setCompletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const editorCount = items.filter((item) => isEditorExercise(item.type)).length;
  const doneCount = items.filter((item) => done.has(item.id)).length;
  const editable = Boolean(current && hasIde && isEditorExercise(current.type));
  const writable = Boolean(current && (role === 'student' || role === 'invite') && acceptsWrittenAnswer(current.type, current.label));

  const choose = (id: string) => {
    setSelectedId(id);
    setFolded(false);
  };

  // Le titre de la fiche est déjà en haut de la page : seule la progression de l'élève est rappelée.
  const meter = hasIde && editorCount > 0 ? (
    <div className="sheet-meter" aria-label={`${doneCount} exercices validés sur ${items.length}`}>
      <span>{doneCount} / {items.length} validés</span>
      <i><b style={{ width: `${Math.round((doneCount / Math.max(items.length, 1)) * 100)}%` }} /></i>
    </div>
  ) : null;

  const status = (item: SheetItem) => (done.has(item.id)
    ? <span className="sheet-status is-done" aria-label="Validé"><Check size={11} strokeWidth={3} /></span>
    : <span className="sheet-status" aria-hidden />);

  return (
    <PracticeContext.Provider value={{ role, courseId }}>
      <section className="sheet not-prose" data-ide={hasIde ? 'true' : 'false'}>
        <div className="sheet-pick">
          {meter}
          <select
            value={selectedId ?? ''}
            onChange={(event) => choose(event.target.value)}
            aria-label="Choisir un exercice"
          >
            {selectedId ? null : <option value="" disabled>Choisir un exercice…</option>}
            {groups.map((group) => (
              <optgroup key={group.difficulty} label={group.difficulty}>
                {group.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {hasIde ? (done.has(item.id) ? '✓ ' : '○ ') : ''}{item.number ? `${item.number} · ` : ''}{item.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className={`sheet-layout ${listOpen ? '' : 'is-list-closed'}`}>
          <nav className="sheet-list" aria-label="Exercices de la fiche">
            {meter}
            {groups.map((group) => {
              const groupDone = group.items.filter((item) => done.has(item.id)).length;
              return (
                <div key={group.difficulty} className="sheet-group">
                  <p style={{ '--c': DIFFICULTY_COLORS[group.difficulty] } as React.CSSProperties}>
                    <span>{group.difficulty}</span>
                    <span>{hasIde ? `${groupDone}/${group.items.length}` : group.items.length}</span>
                  </p>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`sheet-item ${item.id === selectedId ? 'is-current' : ''}`}
                      aria-current={item.id === selectedId ? 'true' : undefined}
                      onClick={() => choose(item.id)}
                    >
                      {hasIde ? status(item) : null}
                      {item.number ? <span className="sheet-num">{item.number}</span> : null}
                      <span className="sheet-title">{item.title}</span>
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>

          <div className="sheet-main">
            {current ? (
              <div className={`sheet-work ${fullScreen ? 'is-full' : ''} ${folded ? 'is-folded' : ''}`}>
                <div className="sheet-brief">
                  <div className="sheet-brief-top">
                    <span className="sheet-tag" style={{ '--c': DIFFICULTY_COLORS[current.difficulty] } as React.CSSProperties}>{current.difficulty}</span>
                    {current.number ? <span className="sheet-tag">Exercice {current.number}</span> : null}
                    {hasIde && done.has(current.id) ? <span className="sheet-tag is-done">Validé</span> : null}
                    {folded ? <b className="sheet-brief-title">{current.title}</b> : null}
                    {editable ? (
                      <span className="sheet-tools">
                        <button type="button" onClick={() => setFolded((value) => !value)} aria-expanded={!folded}>
                          {folded ? <ChevronDown size={15} aria-hidden /> : <ChevronUp size={15} aria-hidden />}
                          {folded ? "Afficher l'énoncé" : 'Replier'}
                        </button>
                        <button type="button" className="sheet-hide-sm" onClick={() => setListOpen((value) => !value)} aria-pressed={!listOpen} title={listOpen ? 'Masquer la liste des exercices' : 'Afficher la liste des exercices'}>
                          <PanelLeft size={15} aria-hidden />
                        </button>
                        <button type="button" onClick={() => setFullScreen((value) => !value)} aria-pressed={fullScreen} title={fullScreen ? 'Quitter le plein écran (Échap)' : 'Éditeur en plein écran'}>
                          {fullScreen ? <Minimize2 size={15} aria-hidden /> : <Maximize2 size={15} aria-hidden />}
                        </button>
                      </span>
                    ) : null}
                  </div>
                  <div className="sheet-brief-body prose prose-slate max-w-none">{current.content}</div>
                </div>

                {editable ? <SheetIde exerciseId={current.id} onCompleted={markCompleted} /> : null}
                {writable ? <div className="sheet-written"><WrittenAnswer exerciseId={current.id} /></div> : null}
                {!hasIde && authReady && isEditorExercise(current.type) ? (
                  <div className="sheet-signin">
                    <span className="sheet-signin-fox" aria-hidden />
                    <span>Les élèves connectés écrivent et vérifient leur code ici, avec les tests.</span>
                    <Link href={`/connexion?next=${encodeURIComponent(pathname || '/')}`}>Se connecter</Link>
                  </div>
                ) : null}

                {fullScreen ? null : (
                  <footer className="sheet-foot">
                    <button type="button" disabled={!previous} onClick={() => previous && choose(previous.id)}>
                      <ArrowLeft size={15} aria-hidden />
                      {previous ? (previous.number || 'Précédent') : ''}
                    </button>
                    <span>{editable ? 'Validé dès que tous les tests passent' : `Exercice ${index + 1} sur ${items.length}`}</span>
                    <button type="button" disabled={!next} onClick={() => next && choose(next.id)}>
                      {next ? `${next.number ? `${next.number} · ` : ''}${next.title}` : ''}
                      <ArrowRight size={15} aria-hidden />
                    </button>
                  </footer>
                )}
              </div>
            ) : (
              <div className="sheet-empty">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/exercices/choisir-${level}.png`} alt="" width={640} height={480} />
                <h3>Choisir un exercice</h3>
                <p>Cliquer sur un exercice de la liste pour afficher son sujet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </PracticeContext.Provider>
  );
}

export function Enonce({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[1.25rem] border border-orange-100 bg-orange-50/35 p-3.5 sm:rounded-[1.6rem] sm:p-5 md:p-7">
      <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-orange-600">
        <Code2 size={13} />
        Énoncé
      </div>
      <div className="prose prose-slate max-w-none">
        {children}
      </div>
    </div>
  );
}


export function ExerciseSection({ id, label, children, type }: TabProps) {
  const { role } = React.useContext(PracticeContext);
  const nodes = React.Children.toArray(children);
  if (id && showsRealizeButton(type, role)) {
    const button = (
      <Link
        key="realiser"
        href={`/exercice/${encodeURIComponent(id)}`}
        className="exercise-start"
      >
        Réaliser l'exercice
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    );
    const enonceIndex = nodes.findIndex(
      (node) => React.isValidElement(node) && node.type === Enonce
    );
    if (enonceIndex >= 0) nodes.splice(enonceIndex + 1, 0, button);
    else nodes.push(button);
  } else if (id && (role === 'student' || role === 'invite') && acceptsWrittenAnswer(type, label)) {
    // Sans éditeur : la réponse s'écrit ici, puis l'enseignant la valide.
    nodes.push(<WrittenAnswer key="reponse" exerciseId={id} />);
  }
  return <div>{nodes}</div>;
}
