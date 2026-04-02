import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, GitBranch, Lock, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { canAccessCourse, isElevatedUser } from '@/lib/course-access';

type CourseNode = {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
  access: unknown;
  allowedStudents: string[] | undefined;
  prerequisites: string[];
};

type SkillTier = {
  depth: number;
  courses: CourseNode[];
};

function parsePrerequisites(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function buildSkillTiers(courses: CourseNode[]): SkillTier[] {
  const bySlug = new Map(courses.map((c) => [c.slug, c]));
  const deps = new Map<string, string[]>();

  courses.forEach((course) => {
    deps.set(
      course.slug,
      course.prerequisites.filter((p) => bySlug.has(p))
    );
  });

  const memo = new Map<string, number>();
  const visiting = new Set<string>();

  const getDepth = (slug: string): number => {
    if (memo.has(slug)) return memo.get(slug)!;
    if (visiting.has(slug)) return 0;

    visiting.add(slug);
    const prereqs = deps.get(slug) || [];
    const depth = prereqs.length === 0 ? 0 : Math.max(...prereqs.map(getDepth)) + 1;
    visiting.delete(slug);
    memo.set(slug, depth);
    return depth;
  };

  const tiersMap = new Map<number, CourseNode[]>();
  courses.forEach((course) => {
    const depth = getDepth(course.slug);
    if (!tiersMap.has(depth)) tiersMap.set(depth, []);
    tiersMap.get(depth)!.push(course);
  });

  return Array.from(tiersMap.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([depth, tierCourses]) => ({
      depth,
      courses: tierCourses.sort((a, b) => a.title.localeCompare(b.title, 'fr')),
    }));
}

export default async function PageSommaireNiveau({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Configuration des niveaux (Titres et Couleurs)
  const LEVEL_CONFIG: Record<string, { title: string; color: string }> = {
    '0': { title: 'SNI', color: 'bg-slate-500' },
    '1': { title: 'SNT', color: 'bg-blue-500' },
    '2': { title: 'Première NSI', color: 'bg-orange-500' },
    '3': { title: 'Terminale NSI', color: 'bg-purple-500' },
    '4': { title: 'BTS SIO', color: 'bg-emerald-500' },
  };

  const currentLevel = LEVEL_CONFIG[id] || { title: `Niveau ${id}`, color: 'bg-blue-500' };
  
  // 1. Récupérer l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();

  const role = (user?.app_metadata?.role || user?.user_metadata?.role || "") as string;
  const isAdmin = isElevatedUser(role);

  // 3. IDENTIFIANT POUR L'ÉLÈVE
  const studentName = user?.user_metadata?.full_name || user?.email || "";

  const folderPath = path.join(process.cwd(), 'content', id);
  const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];
  const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const tousLesCours: CourseNode[] = mdxFiles.map(fileName => {
    const filePath = path.join(folderPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return { 
      slug: fileName.replace(/\.mdx?$/, ''), 
      title: String(data.title || fileName),
      description: String(data.description || ""),
      chapter: String(data.chapter || "Général"), 
      icon: String(data.icon || '📘'),
      access: data.access,
      allowedStudents: data.allowedStudents,
      prerequisites: parsePrerequisites(data.prerequisites),
    };
  }).filter((cours) =>
    canAccessCourse(
      { access: cours.access, allowedStudents: cours.allowedStudents },
      {
        isElevated: isAdmin,
        isAuthenticated: Boolean(user),
        userFullName: studentName || null,
      }
    )
  );

  // Groupement par chapitre
  const chapitres: Record<string, CourseNode[]> = {};
  tousLesCours.forEach(c => {
    if (!chapitres[c.chapter]) chapitres[c.chapter] = [];
    chapitres[c.chapter].push(c);
  });

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen bg-white">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl text-white shadow-lg ${currentLevel.color}`}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {currentLevel.title}
            </h1>
            {isAdmin && (
              <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} /> Accès Enseignant (Tous les cours)
              </div>
            )}
          </div>
        </div>
      </div>

      {Object.entries(chapitres).map(([nom, liste]) => {
        const tiers = buildSkillTiers(liste);
        const chapterSlugSet = new Set(liste.map((c) => c.slug));

        return (
        <section key={nom} className="mb-14">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight italic mb-6 border-b border-slate-50 pb-4 flex items-center gap-3">
            <GitBranch className="text-orange-500" size={20} />
            {nom}
          </h2>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[760px] grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-5">
              {tiers.map((tier, tierIndex) => (
                <div key={tier.depth} className="relative">
                  {tierIndex < tiers.length - 1 && (
                    <div className="absolute top-8 -right-3 h-0.5 w-6 bg-orange-200" />
                  )}
                  <div className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Étape {tier.depth + 1}
                  </div>
                  <div className="space-y-4">
                    {tier.courses.map((cours) => (
                      <Link
                        key={cours.slug}
                        href={`/cours/${id}/${cours.slug}`}
                        className={`group block p-5 bg-white border rounded-[1.5rem] transition-all duration-300 hover:-translate-y-0.5 ${
                          cours.access === 'private'
                            ? 'border-amber-200 bg-amber-50/20'
                            : 'border-slate-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="text-3xl leading-none">{cours.icon}</div>
                            <div>
                              <h3 className="font-bold text-base text-slate-900 group-hover:text-orange-600 flex items-center gap-2">
                                {cours.title}
                                {cours.access === 'private' && (
                                  <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300 font-black flex items-center gap-1">
                                    <Lock size={10} /> PRIVÉ
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-slate-500 line-clamp-2">{cours.description}</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-300 group-hover:text-orange-500 mt-1" size={20} />
                        </div>

                        {cours.prerequisites.filter((p) => chapterSlugSet.has(p)).length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                              Prérequis
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {cours.prerequisites
                                .filter((p) => chapterSlugSet.has(p))
                                .map((prereq) => (
                                  <span
                                    key={prereq}
                                    className="px-2 py-1 rounded-full text-[10px] font-bold border border-slate-200 text-slate-600 bg-slate-50"
                                  >
                                    {prereq}
                                  </span>
                                ))}
                            </div>
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )})}
    </main>
  );
}