import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, BookOpen } from 'lucide-react';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
  level: string;
}

const LEVELS_INFO: Record<string, { title: string; color: string }> = {
  '0': { title: 'SNI', color: 'bg-slate-500' },
  '1': { title: 'SNT', color: 'bg-blue-500' },
  '2': { title: 'Première NSI', color: 'bg-orange-500' },
  '3': { title: 'Terminale NSI', color: 'bg-purple-500' },
  '4': { title: 'BTS SIO', color: 'bg-emerald-500' },
};

export default async function PageTousLesCours() {
  // 1. Vérifier que le dossier content existe
  const contentPath = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentPath)) {
    return (
      <main className="max-w-6xl mx-auto p-8 min-h-screen bg-[#FDFCFB]">
        <div className="text-center text-slate-500">
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

  levels.forEach(level => {
    const levelPath = path.join(contentPath, level);
    const files = fs.readdirSync(levelPath);
    const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    mdxFiles.forEach(fileName => {
      const filePath = path.join(levelPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      tousLesCours.push({
        slug: fileName.replace(/\.mdx?$/, ''),
        title: String(data.title || fileName.replace(/\.mdx?$/, '')),
        description: String(data.description || "Consulter la leçon"),
        chapter: String(data.chapter || "Général"),
        icon: String(data.icon || '📘'),
        level: level
      });
    });
  });

  // 3. Trier par niveau, puis par chapitre
  tousLesCours.sort((a, b) => {
    if (a.level !== b.level) {
      return parseInt(a.level) - parseInt(b.level);
    }
    return a.chapter.localeCompare(b.chapter);
  });

  return (
    <main className="max-w-6xl mx-auto p-8 min-h-screen bg-[#FDFCFB]">
      {/* En-tête de la page */}
      <div className="flex items-center gap-4 mb-16">
        <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg">
          <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tous les Cours</h1>
          <p className="text-slate-500 mt-2">Liste complète de toutes les leçons, triées par niveau puis par chapitre</p>
        </div>
      </div>

      {/* Liste des cours triés */}
      <div className="space-y-4">
        {tousLesCours.map((cours, index) => (
          <Link
            key={`${cours.level}-${cours.slug}`}
            href={`/cours/${cours.level}/${cours.slug}`}
            className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl hover:border-orange-500 hover:shadow-xl transition-all duration-300 block"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-3xl group-hover:bg-orange-50 transition-colors">
                {cours.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest text-white rounded-full ${LEVELS_INFO[cours.level]?.color || 'bg-gray-500'}`}>
                    {LEVELS_INFO[cours.level]?.title || `Niveau ${cours.level}`}
                  </span>
                  <span className="text-sm font-bold text-orange-600 uppercase tracking-widest">
                    {cours.chapter}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                  {cours.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{cours.description}</p>
              </div>
            </div>
            <div className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">
              <ChevronRight size={22} />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}