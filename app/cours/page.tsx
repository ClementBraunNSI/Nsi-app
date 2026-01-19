import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, BookOpen, GraduationCap } from 'lucide-react';

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

      {/* Affichage par niveau et chapitre */}
      {Object.entries(coursParNiveau).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([niveau, chapitres]) => (
        <section key={niveau} className="mb-12">
          {/* En-tête du niveau */}
          <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-orange-100">
            <div className={`w-12 h-12 ${LEVELS_INFO[niveau]?.color || 'bg-gray-500'} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {LEVELS_INFO[niveau]?.title || `Niveau ${niveau}`}
              </h2>
              <p className="text-slate-500 mt-1">Tous les chapitres de ce niveau</p>
            </div>
          </div>

          {/* Chapitres du niveau */}
          {Object.entries(chapitres).sort(([a], [b]) => a.localeCompare(b)).map(([nomChapitre, coursDuChapitre]) => (
            <details key={nomChapitre} className="mb-6 bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-orange-50 transition-colors">
                <div className="flex items-center gap-3">
                  <BookOpen className="text-orange-500" size={20} />
                  <h3 className="text-xl font-bold text-slate-800">{nomChapitre}</h3>
                  <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {coursDuChapitre.length} cours
                  </span>
                </div>
                <ChevronRight className="text-slate-400 details-marker-hidden" size={20} />
              </summary>
              <div className="px-6 pb-6 space-y-3">
                {coursDuChapitre.map((cours) => (
                  <Link
                    key={cours.slug}
                    href={`/cours/${niveau}/${cours.slug}`}
                    className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl group-hover:bg-orange-50 transition-colors">
                        {cours.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {cours.title}
                        </h4>
                        <p className="text-sm text-slate-500">{cours.description}</p>
                      </div>
                    </div>
                    <div className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </section>
      ))}
    </main>
  );
}