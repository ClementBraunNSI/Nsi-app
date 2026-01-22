import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, LayoutGrid } from 'lucide-react';
// On importe le client Supabase serveur (assure-toi que ce fichier existe bien dans ton projet)
import { createClient } from '@/utils/supabase/server';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
  // Nouveaux champs pour la gestion des droits
  access?: string;
  allowedStudents?: string[];
}

const LEVELS_INFO: Record<string, { title: string; color: string }> = {
  '0': { title: 'SNI', color: 'bg-slate-500' },
  '1': { title: 'SNT', color: 'bg-blue-500' },
  '2': { title: 'Première NSI', color: 'bg-orange-500' },
  '3': { title: 'Terminale NSI', color: 'bg-purple-500' },
  '4': { title: 'BTS SIO', color: 'bg-emerald-500' },
};

export default async function PageSommaireNiveau({ params }: { params: Promise<{ id: string }> }) {
  // 1. Résolution des paramètres (Next.js 15)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Récupération de l'utilisateur connecté via Supabase
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // On récupère le nom complet de l'étudiant (ou son email si pas de nom)
  // Il faut que cela corresponde à ce que tu mets dans "allowedStudents" dans le Markdown
  const studentIdentifier = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email || "";

  // 3. Chemin vers le dossier de contenu
  const folderPath = path.join(process.cwd(), 'content', id);

  if (!fs.existsSync(folderPath)) {
    return (
      <div className="p-10 text-center text-slate-500">
        Dossier de contenu introuvable pour le niveau : {id}
      </div>
    );
  }

  const files = fs.readdirSync(folderPath);
  const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  // 4. Lecture et FILTRAGE des cours
  const tousLesCours: CoursData[] = mdxFiles.map(fileName => {
    const filePath = path.join(folderPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    
    return { 
      slug: fileName.replace(/\.mdx?$/, ''), 
      title: String(data.title || fileName.replace(/\.mdx?$/, '')),
      description: String(data.description || "Consulter la leçon"),
      chapter: String(data.chapter || "Général"), 
      icon: String(data.icon || '📘'),
      access: data.access,
      allowedStudents: data.allowedStudents
    };
  }).filter(cours => {
    // --- LOGIQUE DE SÉCURITÉ ---
    
    // Si le cours n'est pas privé, on l'affiche pour tout le monde
    if (cours.access !== 'private') {
      return true;
    }

    // Si le cours est privé et que l'utilisateur n'est pas connecté -> on masque
    if (!user) {
      return false;
    }

    // Si le cours est privé, on vérifie si l'utilisateur est dans la liste autorisée
    // On vérifie si allowedStudents existe et si l'identifiant de l'élève s'y trouve
    if (cours.allowedStudents && Array.isArray(cours.allowedStudents)) {
      return cours.allowedStudents.includes(studentIdentifier);
    }

    // Par sécurité, si c'est privé mais qu'aucune liste n'est définie, on masque
    return false;
  });

  // 5. Groupement par chapitre
  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) {
      chapitres[nomChapitre] = [];
    }
    chapitres[nomChapitre].push(cours);
  });

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen bg-white">
      {/* En-tête */}
      <div className="flex items-center gap-4 mb-12">
        <div className={`p-3 rounded-2xl text-white shadow-lg ${LEVELS_INFO[id]?.color || 'bg-slate-600'}`}>
          <GraduationCap size={32} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {LEVELS_INFO[id]?.title || `Niveau ${id}`}
        </h1>
      </div>

      {/* Liste des chapitres */}
      {Object.entries(chapitres).map(([nomChapitre, coursDuChapitre]) => (
        <section key={nomChapitre} className="mb-14">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
            <LayoutGrid className="text-orange-500" size={20} />
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight italic">
              {nomChapitre}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coursDuChapitre.map((cours) => (
              <Link 
                key={cours.slug}
                href={`/cours/${id}/${cours.slug}`}
                className="group flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-orange-500 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-3xl group-hover:bg-orange-50 transition-colors">
                    {cours.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                      {cours.title}
                      {/* Petit indicateur visuel pour toi (admin) ou l'élève pour savoir que c'est un cours privé */}
                      {cours.access === 'private' && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full border border-red-200">
                          Privé
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">{cours.description}</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={22} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {Object.keys(chapitres).length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <p>Aucun cours disponible pour le moment.</p>
        </div>
      )}
    </main>
  );
}