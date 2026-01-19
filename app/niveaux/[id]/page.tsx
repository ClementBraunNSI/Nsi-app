import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function PageNiveau({ params }: { params: { niveaux: string } }) {
  const { niveaux } = params;
  const contentPath = path.join(process.cwd(), 'content');
  const files = fs.readdirSync(contentPath);

  // 1. Extraire tous les cours du niveau sélectionné
  const tousLesCours = files.map(filename => {
    const content = fs.readFileSync(path.join(contentPath, filename), 'utf-8');
    const { data } = matter(content);
    return { 
      slug: filename.replace('.mdx', '').replace('.md', ''), 
      ...data 
    };
  }).filter(c => c.level?.toLowerCase().replace(' ', '-') === niveaux);

  // 2. Grouper les cours par chapitre
  const chapitres: Record<string, any[]> = {};
  tousLesCours.forEach(cours => {
    const nomChapitre = cours.chapter || "Autres";
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-10 capitalize">📚 {niveaux.replace('-', ' ')}</h1>

      {Object.entries(chapitres).map(([nomChapitre, coursDuChapitre]) => (
        <div key={nomChapitre} className="mb-12">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 border-b pb-2">
            {nomChapitre}
          </h2>
          <div className="grid gap-4">
            {coursDuChapitre.map((cours) => (
              <Link 
                key={cours.slug}
                href={`/cours/${niveaux}/${cours.slug}`}
                className="flex items-center justify-between p-4 bg-white border rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{cours.icon || '📄'}</span>
                  <div>
                    <h3 className="font-bold group-hover:text-blue-500">{cours.title}</h3>
                    <p className="text-sm text-gray-500">{cours.description}</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-400" />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}