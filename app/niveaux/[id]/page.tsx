import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, LayoutGrid, Lock, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

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

  // 2. RÉCUPÉRATION DU RÔLE (On teste les deux endroits standards de Supabase)
  // Souvent c'est dans app_metadata (défini par l'admin) ou user_metadata (profil)
  const role = user?.app_metadata?.role || user?.user_metadata?.role || "";
  const isAdmin = role.toLowerCase() === 'admin' || role.toLowerCase() === 'enseignant';

  // 3. IDENTIFIANT POUR L'ÉLÈVE
  const studentName = user?.user_metadata?.full_name || user?.email || "";

  const folderPath = path.join(process.cwd(), 'content', id);
  const files = fs.existsSync(folderPath) ? fs.readdirSync(folderPath) : [];
  const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  const tousLesCours = mdxFiles.map(fileName => {
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
      allowedStudents: data.allowedStudents
    };
  }).filter(cours => {
    // --- LA LOGIQUE QUE VOUS DEMANDEZ ---
    
    // SI ADMIN : On affiche tout, point final.
    if (isAdmin) return true;

    // SI ÉLÈVE :
    // Si le cours n'est pas "private", tout le monde le voit
    if (cours.access !== 'private') return true;

    // Si le cours est "private", l'élève doit être dans la liste
    return user && cours.allowedStudents?.includes(studentName);
  });

  // Groupement par chapitre
  const chapitres: Record<string, any[]> = {};
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

      {Object.entries(chapitres).map(([nom, liste]) => (
        <section key={nom} className="mb-14">
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight italic mb-6 border-b border-slate-50 pb-4 flex items-center gap-3">
            <LayoutGrid className="text-orange-500" size={20} />
            {nom}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {liste.map((cours) => (
              <Link 
                key={cours.slug}
                href={`/cours/${id}/${cours.slug}`}
                className={`group flex items-center justify-between p-6 bg-white border rounded-[2rem] transition-all duration-300 ${
                  cours.access === 'private' ? 'border-amber-200 bg-amber-50/20' : 'border-slate-100'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className="text-3xl">{cours.icon}</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 flex items-center gap-2">
                      {cours.title}
                      {cours.access === 'private' && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-300 font-black flex items-center gap-1">
                          <Lock size={10} /> PRIVÉ
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{cours.description}</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-orange-500" size={22} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}