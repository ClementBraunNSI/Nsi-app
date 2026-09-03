import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, BookOpen, GraduationCap, GitBranch } from 'lucide-react';
import { listMarkdownFilesForContentLevel } from '@/lib/course-utils';
import { Badge, Card, PageHeader } from '@/components/ui';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
  level: string;
  prerequisites: string[];
}

const LEVELS_INFO: Record<string, { title: string; color: string }> = {
  '0': { title: 'SNI', color: 'bg-slate-500' },
  '1': { title: 'SNT', color: 'bg-blue-500' },
  '2': { title: 'Première NSI', color: 'bg-orange-500' },
  '3': { title: 'Terminale NSI', color: 'bg-purple-500' },
  '4': { title: 'BTS SIO', color: 'bg-emerald-500' },
  particuliers: { title: 'Programmation en C', color: 'bg-amber-600' },
};

function parsePrerequisites(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value.split(',').map((v) => v.trim()).filter(Boolean);
  }
  return [];
}

function buildSkillTiers(cours: CoursData[]) {
  const bySlug = new Map(cours.map((c) => [c.slug, c]));
  const deps = new Map<string, string[]>();
  cours.forEach((c) => {
    deps.set(c.slug, c.prerequisites.filter((p) => bySlug.has(p)));
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

  const tiers = new Map<number, CoursData[]>();
  cours.forEach((c) => {
    const depth = getDepth(c.slug);
    if (!tiers.has(depth)) tiers.set(depth, []);
    tiers.get(depth)!.push(c);
  });

  return Array.from(tiers.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([depth, courses]) => ({
      depth,
      courses: courses.sort((a, b) => a.title.localeCompare(b.title, 'fr')),
    }));
}

export default async function PageTousLesCours() {
  // 1. Vérifier que le dossier content existe
  const contentPath = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentPath)) {
    return (
      <main className="max-w-6xl mx-auto p-8 min-h-screen bg-[var(--bg)]">
        <div className="text-center text-[var(--muted)]">
          Dossier de contenu introuvable.
        </div>
      </main>
    );
  }

  // 2. Lister tous les niveaux disponibles
  const levels = fs.readdirSync(contentPath).filter(dir => {
    const dirPath = path.join(contentPath, dir);
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  }).sort();

  // 2. Collecter tous les cours de tous les niveaux
  const tousLesCours: CoursData[] = [];

  levels.forEach((level) => {
    const entries = listMarkdownFilesForContentLevel(level);
    entries.forEach(({ filePath, slug }) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      tousLesCours.push({
        slug,
        title: String(data.title || slug),
        description: String(data.description || "Consulter la leçon"),
        chapter: String(data.chapter || "Général"),
        icon: String(data.icon || '📘'),
        level,
        prerequisites: parsePrerequisites(data.prerequisites),
      });
    });
  });

  // 3. Grouper par niveau, puis par chapitre
  const coursParNiveau: Record<string, Record<string, typeof tousLesCours>> = {};

  tousLesCours.forEach((cours) => {
    const niveau = cours.level;
    const chapitre = cours.chapter;

    if (!coursParNiveau[niveau]) {
      coursParNiveau[niveau] = {};
    }
    if (!coursParNiveau[niveau][chapitre]) {
      coursParNiveau[niveau][chapitre] = [];
    }
    coursParNiveau[niveau][chapitre].push(cours);
  });

  return (
    <main className="max-w-6xl mx-auto p-8 min-h-screen bg-[var(--bg)]">
      <PageHeader
        className="mb-16"
        eyebrow={<span className="inline-flex items-center gap-2"><BookOpen size={16} /> Catalogue</span>}
        title="Tous les Cours"
        description="Liste complète de toutes les leçons, triées par niveau puis par chapitre."
      />

      {/* Affichage par niveau et chapitre */}
      {Object.entries(coursParNiveau)
        .sort(([a], [b]) => {
          const na = parseInt(a, 10);
          const nb = parseInt(b, 10);
          const aNum = !Number.isNaN(na);
          const bNum = !Number.isNaN(nb);
          if (aNum && bNum) return na - nb;
          if (aNum && !bNum) return -1;
          if (!aNum && bNum) return 1;
          return a.localeCompare(b, 'fr');
        })
        .map(([niveau, chapitres]) => (
        <section key={niveau} className="mb-12">
          {/* En-tête du niveau */}
          <div className="flex items-center gap-4 mb-8 pb-4 border-b border-[var(--border)]">
            <div className={`w-12 h-12 ${LEVELS_INFO[niveau]?.color || 'bg-gray-500'} rounded-[var(--radius-sm)] flex items-center justify-center text-white shadow-[var(--shadow)]`}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-[var(--fg)] tracking-tight">
                {LEVELS_INFO[niveau]?.title || `Niveau ${niveau}`}
              </h2>
              <p className="text-[var(--muted)] mt-1">Tous les chapitres de ce niveau</p>
            </div>
          </div>

          {/* Arbre de compétences par chapitre */}
          {Object.entries(chapitres).sort(([a], [b]) => a.localeCompare(b)).map(([nomChapitre, coursDuChapitre]) => (
            <Card key={nomChapitre} className="mb-6 overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <GitBranch className="text-[var(--accent)]" size={20} />
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">{nomChapitre}</h3>
                  <Badge>
                    {coursDuChapitre.length} cours
                  </Badge>
                </div>
              </div>

              <div className="overflow-x-auto pb-1">
                <div className="min-w-[760px] grid grid-flow-col auto-cols-[minmax(250px,1fr)] gap-4">
                  {buildSkillTiers(coursDuChapitre).map((tier, tierIndex, arr) => (
                    <div key={`${nomChapitre}-${tier.depth}`} className="relative">
                      {tierIndex < arr.length - 1 && (
                        <div className="absolute top-7 -right-2 h-0.5 w-4 bg-[var(--border)]" />
                      )}
                      <div className="mb-2 text-[10px] font-semibold text-[var(--subtle)]">
                        Étape {tier.depth + 1}
                      </div>
                      <div className="space-y-3">
                        {tier.courses.map((cours) => (
                          <Link
                            key={cours.slug}
                            href={`/cours/${niveau}/${cours.slug}`}
                            className="group flex items-start justify-between p-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors duration-150"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-[var(--surface)] rounded-lg flex items-center justify-center text-2xl transition-colors duration-150 shrink-0">
                                {cours.icon}
                              </div>
                              <div>
                                <h4 className="font-semibold text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-150">
                                  {cours.title}
                                </h4>
                                <p className="text-sm text-[var(--muted)] line-clamp-2">{cours.description}</p>
                                {cours.prerequisites.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {cours.prerequisites.map((pr) => (
                                      <span
                                        key={`${cours.slug}-${pr}`}
                                        className="text-[10px] font-medium text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] px-2 py-0.5 rounded-full"
                                      >
                                        {pr}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-[var(--subtle)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all duration-150 mt-1">
                              <ChevronRight size={18} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </section>
      ))}
    </main>
  );
}