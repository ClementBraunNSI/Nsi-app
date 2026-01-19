import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, LayoutGrid } from 'lucide-react';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
}

// Notez le "async" et le type de params (Promise)
export default async function PageSommaireNiveau({ params }: { params: Promise<{ id: string }> }) {
  
  // CORRECT : On attend (await) les paramètres avant de les utiliser
  const resolvedParams = await params;
  const id = resolvedParams.id; 

  // Sécurité : Vérifier que l'id existe avant de construire le chemin
  if (!id) {
    return <div className="p-10 text-center">ID de niveau manquant.</div>;
  }

  const folderPath = path.join(process.cwd(), 'content', id);

  if (!fs.existsSync(folderPath)) {
    return <div className="p-10 text-center">Dossier /content/{id} introuvable.</div>;
  }

  const files = fs.readdirSync(folderPath);
  const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const tousLesCours: CoursData[] = mdxFiles.map(fileName => {
    try {
      const filePath = path.join(folderPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      return { 
        slug: fileName.replace(/\.mdx?$/, ''), 
        title: String(data.title || fileName.replace(/\.mdx?$/, '')),
        description: String(data.description || "Accéder au cours"),
        chapter: String(data.chapter || "Général"), 
        icon: String(data.icon || '📘')
      };
    } catch (e) {
      console.error(`Erreur lecture fichier ${fileName}:`, e);
      return null;
    }
  }).filter((c): c is CoursData => c !== null);

  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-orange-600 rounded-2xl text-white shadow-lg">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900">Niveau {id}</h1>
      </div>

      {Object.entries(chapitres).map(([nomChapitre, coursDuChapitre]) => (
        <section key={nomChapitre} className="mb-14">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <LayoutGrid className="text-orange-500" size={20} />
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                {nomChapitre}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coursDuChapitre.map((cours) => (
              <Link 
                key={cours.slug}
                href={`/cours/${id}/${cours.slug}`}
                className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:border-orange-500 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-5">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{cours.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600">
                        {cours.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{cours.description}</p>
                  </div>
                </div>
                <ChevronRight size={22} className="text-slate-300 group-hover:text-orange-500" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}