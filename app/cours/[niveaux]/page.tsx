import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ChevronRight, GraduationCap, LayoutGrid, Zap } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { getReservedCourses } from '@/app/actions/getReservedCourses';

interface CoursData {
  slug: string;
  title: string;
  description: string;
  level: string;
  chapter: string;
  icon: string;
  href?: string;
  isPrivate?: boolean;
}

export default async function PageNiveau({ params }: { params: Promise<{ niveaux: string }> }) {
  const { niveaux } = await params; 
  
  // Récupérer la session et les cours privés potentiels
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  let privateCourses: CoursData[] = [];
  
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('level, full_name, has_private_lessons')
      .eq('id', session.user.id)
      .single();
      
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
    const files = fs.readdirSync(folderPath);
    const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    standardCourses = mdxFiles.map(fileName => {
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
  }
  
  // Fusionner les cours
  const tousLesCours = [...privateCourses, ...standardCourses];

  if (tousLesCours.length === 0) {
    return <div className="p-10 text-center text-slate-500">Aucun contenu trouvé pour le niveau {niveaux}</div>;
  }

  // Logique de tri par chapitre
  const chapitres: Record<string, CoursData[]> = {};
  tousLesCours.forEach((cours) => {
    const nomChapitre = cours.chapter;
    if (!chapitres[nomChapitre]) chapitres[nomChapitre] = [];
    chapitres[nomChapitre].push(cours);
  });

  // Mapping des noms de niveaux pour l'affichage
  const DISPLAY_LEVEL_MAP: Record<string, string> = {
    '0': 'SNI',
    '1': 'SNT',
    '2': 'Première NSI',
    '3': 'Terminale NSI',
    '4': 'BTS SIO'
  };

  // Mapping des couleurs pour l'affichage (respectant la charte graphique de la landing page)
  const LEVEL_THEME: Record<string, { main: string, icon: string, border: string, text: string, light: string }> = {
    '0': { main: 'bg-slate-500', icon: 'text-slate-500', border: 'hover:border-slate-500', text: 'group-hover:text-slate-500', light: 'group-hover:bg-slate-50' }, // SNI (Gris)
    '1': { main: 'bg-blue-500', icon: 'text-blue-500', border: 'hover:border-blue-500', text: 'group-hover:text-blue-500', light: 'group-hover:bg-blue-50' }, // SNT (Bleu)
    '2': { main: 'bg-orange-500', icon: 'text-orange-500', border: 'hover:border-orange-500', text: 'group-hover:text-orange-500', light: 'group-hover:bg-orange-50' }, // 1NSI (Orange)
    '3': { main: 'bg-purple-500', icon: 'text-purple-500', border: 'hover:border-purple-500', text: 'group-hover:text-purple-500', light: 'group-hover:bg-purple-50' }, // TNSI (Violet)
    '4': { main: 'bg-emerald-500', icon: 'text-emerald-500', border: 'hover:border-emerald-500', text: 'group-hover:text-emerald-500', light: 'group-hover:bg-emerald-50' }, // SIO (Emeraude)
  };

  const theme = LEVEL_THEME[niveaux.trim()] || LEVEL_THEME['2']; // Fallback to orange-500

  return (
    <main className="max-w-5xl mx-auto p-8 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className={`p-3 rounded-2xl text-white shadow-lg ${theme.main}`}>
          <GraduationCap size={32} />
        </div>
        <h1 className="text-4xl font-black text-gray-900 capitalize">
          {DISPLAY_LEVEL_MAP[niveaux] || `Niveau ${niveaux}`}
        </h1>
      </div>

      {Object.entries(chapitres).map(([nomChapitre, coursDuChapitre]) => (
        <section key={nomChapitre} className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            {nomChapitre.includes('Particuliers') ? (
              <Zap className="text-orange-500" size={20} fill="currentColor" />
            ) : (
              <LayoutGrid className={`${theme.icon}`} size={20} />
            )}
            <h2 className={`text-2xl font-bold ${nomChapitre.includes('Particuliers') ? 'text-orange-600' : 'text-gray-800'}`}>
              {nomChapitre}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {coursDuChapitre.map((cours) => (
              <Link 
                key={cours.slug}
                href={cours.href || `/cours/${niveaux}/${cours.slug}`}
                className={`group flex items-center justify-between p-6 rounded-3xl transition-all duration-300 ${
                  cours.isPrivate 
                    ? 'bg-orange-50 border border-orange-200 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-100' 
                    : `bg-white border border-gray-100 ${theme.border} hover:shadow-xl`
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className={`text-4xl group-hover:scale-110 transition-transform duration-300 ${cours.isPrivate ? 'text-orange-500' : ''}`}>
                    {cours.icon}
                  </span>
                  <div>
                    <h3 className={`font-bold text-lg transition-colors ${
                      cours.isPrivate 
                        ? 'text-gray-900 group-hover:text-orange-600' 
                        : `text-gray-900 ${theme.text}`
                    }`}>
                      {cours.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {cours.description}
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  cours.isPrivate
                    ? 'bg-orange-100 text-orange-400 group-hover:bg-orange-500 group-hover:text-white'
                    : `bg-slate-50 text-slate-400 ${theme.light} ${theme.text}`
                }`}>
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