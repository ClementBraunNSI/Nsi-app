import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, LayoutGrid } from 'lucide-react';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  level: string;
  chapter: string;
  icon: string;
}

export default async function PageNiveau({ params }: { params: { niveaux: string } }) {
  const { niveaux } = params; 
  
  // On va chercher dans /content/0 ou /content/1 ou /content/2...
  const folderPath = path.join(process.cwd(), 'content', niveaux);

  if (!fs.existsSync(folderPath)) {
    return <div className="p-10 text-center text-slate-500">Aucun contenu trouvé pour le niveau {niveaux}</div>;
  }

  const files = fs.readdirSync(folderPath);
  const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const tousLesCours: CoursData[] = mdxFiles.map(fileName => {
    const filePath = path.join(folderPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return { 
      slug: fileName.replace(/\.mdx?$/, ''), 
      title: String(data.title || fileName),
      description: String(data.description || ""),
      level: String(data.level || niveaux),
      chapter: String(data.chapter || "Général"), 
      icon: String(data.icon || '📘')
    };
  });

  // Logique de tri par chapitre
  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 capitalize">
          Niveau {niveaux}
        </h1>
      </div>

      {Object.entries(chapitres).map(([nomChapitre, coursDuChapitre]) => (
        <section key={nomChapitre} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <LayoutGrid className="text-blue-500" size={20} />
            <h2 className="text-2xl font-bold text-gray-800">
              {nomChapitre}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coursDuChapitre.map((cours) => (
              <Link 
                key={cours.slug}
                href={`/cours/${niveaux}/${cours.slug}`}
                className="group flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {cours.icon}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {cours.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {cours.description}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}