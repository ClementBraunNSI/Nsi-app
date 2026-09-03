import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GraduationCap } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getReservedCourses } from '@/app/actions/getReservedCourses';
import ChaptersPreviewTabs from './ChaptersPreviewTabs';
import { canAccessCourse, isElevatedUser } from '@/lib/course-access';
import { listMarkdownFilesForContentLevel } from '@/lib/course-utils';
import { nsiLevelLabel } from '@/lib/nsi-levels';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  level: string;
  chapter: string;
  icon: string;
  href?: string;
  isPrivate?: boolean;
  allowedStudents?: string[];
}

export default async function PageNiveau({ params }: { params: Promise<{ niveaux: string }> }) {
  const { niveaux } = await params; 
  
  // Récupérer la session et les cours privés potentiels
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  
  let privateCourses: CoursData[] = [];
  let profileFullName: string | null = null;
  let elevated = false;
  
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('level, full_name, has_private_lessons, role')
      .eq('id', session.user.id)
      .single();
    profileFullName = profile?.full_name || null;
    const userRole =
      (user?.app_metadata?.role as string | undefined) ||
      (user?.user_metadata?.role as string | undefined) ||
      (profile?.role as string | undefined) ||
      null;
    elevated = isElevatedUser(userRole);
      
    const LEVEL_CODE_MAP: Record<string, string> = {
      'SNI': '0',
      'SNT': '1',
      '1NSI': '2',
      'TNSI': '3',
      'SIO': '4'
    };

    if (profile && profile.has_private_lessons && LEVEL_CODE_MAP[profile.level] === niveaux) {
       console.log(`[DEBUG] Recherche cours pour ${profile.full_name} (Level: ${profile.level}, Page: ${niveaux})`);
       const reserved = await getReservedCourses(profile.full_name);
       console.log(`[DEBUG] Cours trouvés: ${reserved.length}`, reserved.map(r => r.title));
       
       privateCourses = reserved.map(rc => ({
         slug: rc.slug,
         title: rc.title,
         description: "Cours particulier réservé",
         level: rc.level,
         chapter: "⚡ Cours Particuliers",
         icon: '🎓',
         href: rc.path,
         isPrivate: true
       }));
    } else {
       console.log(`[DEBUG] Pas de cours privés injectés. Profile: ${!!profile}, HasPrivate: ${profile?.has_private_lessons}, UserLevel: ${profile?.level}, PageLevel: ${niveaux}, Expected: ${profile ? LEVEL_CODE_MAP[profile.level] : 'N/A'}`);
    }
  } else {
    console.log(`[DEBUG] Pas de session utilisateur.`);
  }

  // On va chercher dans /content/0 ou /content/1 ou /content/2...
  const folderPath = path.join(process.cwd(), 'content', niveaux);
  let standardCourses: CoursData[] = [];

  if (fs.existsSync(folderPath)) {
    const mdEntries = listMarkdownFilesForContentLevel(niveaux);

    standardCourses = mdEntries.map(({ filePath, slug }) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        level: String(data.level || niveaux),
        chapter: String(data.chapter || "Général"),
        icon: String(data.icon || '📘'),
        isPrivate: String(data.access || '').toLowerCase() === 'private',
        allowedStudents: Array.isArray(data.allowedStudents) ? data.allowedStudents.map((s: unknown) => String(s)) : undefined
      };
    }).filter((course) =>
      canAccessCourse(
        {
          access: course.isPrivate ? 'private' : 'public',
          allowedStudents: course.allowedStudents,
        },
        {
          isElevated: elevated,
          isAuthenticated: Boolean(session),
          userFullName: profileFullName,
        }
      )
    );
  }
  
  // Fusionner les cours
  const tousLesCours = [...privateCourses, ...standardCourses];

  if (tousLesCours.length === 0) {
    return <div className="p-10 text-center text-[var(--muted)]">Aucun contenu trouvé pour {nsiLevelLabel(niveaux)}</div>;
  }

  // Logique de tri par chapitre
  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });
  const orderedChapitres = Object.entries(chapitres).sort(([a], [b]) => {
    const aPrivate = a.includes('Particuliers');
    const bPrivate = b.includes('Particuliers');
    if (aPrivate && !bPrivate) return 1;
    if (!aPrivate && bPrivate) return -1;
    return a.localeCompare(b, 'fr');
  });

  // Mapping des couleurs pour l'affichage (respectant la charte graphique de la landing page)
  const LEVEL_THEME: Record<string, { main: string, icon: string, border: string, text: string, light: string }> = {
    '0': { main: 'bg-slate-500', icon: 'text-slate-500', border: 'hover:border-slate-500', text: 'group-hover:text-slate-500', light: 'group-hover:bg-slate-50' }, // SNI (Gris)
    '1': { main: 'bg-blue-500', icon: 'text-blue-500', border: 'hover:border-blue-500', text: 'group-hover:text-blue-500', light: 'group-hover:bg-blue-50' }, // SNT (Bleu)
    '2': { main: 'bg-orange-500', icon: 'text-orange-500', border: 'hover:border-orange-500', text: 'group-hover:text-orange-500', light: 'group-hover:bg-orange-50' }, // 1NSI (Orange)
    '3': { main: 'bg-purple-500', icon: 'text-purple-500', border: 'hover:border-purple-500', text: 'group-hover:text-purple-500', light: 'group-hover:bg-purple-50' }, // TNSI (Violet)
    '4': { main: 'bg-emerald-500', icon: 'text-emerald-500', border: 'hover:border-emerald-500', text: 'group-hover:text-emerald-500', light: 'group-hover:bg-emerald-50' }, // SIO (Emeraude)
    particuliers: { main: 'bg-amber-600', icon: 'text-amber-600', border: 'hover:border-amber-600', text: 'group-hover:text-amber-600', light: 'group-hover:bg-amber-50' },
  };

  const theme = LEVEL_THEME[niveaux.trim()] || LEVEL_THEME['2']; // Fallback to orange-500

  return (
    <main className="max-w-7xl mx-auto p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className={`p-3 rounded-[var(--radius-sm)] text-white shadow-[var(--shadow)] ${theme.main}`}>
          <GraduationCap size={32} />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--fg)] capitalize">
          {nsiLevelLabel(niveaux)}
        </h1>
      </div>

      <ChaptersPreviewTabs
        niveaux={niveaux}
        theme={{ icon: theme.icon, border: theme.border, text: theme.text, light: theme.light }}
        chapters={orderedChapitres.map(([name, courses]) => ({
          name,
          isPrivate: name.includes('Particuliers'),
          courses: courses.map((cours) => ({
            slug: cours.slug,
            title: cours.title,
            description: cours.description,
            icon: cours.icon,
            href: cours.href || `/cours/${niveaux}/${cours.slug}`,
            isPrivate: cours.isPrivate,
          })),
        }))}
      />
    </main>
  );
}