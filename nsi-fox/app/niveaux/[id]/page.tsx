import React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronLeft, BookOpen, ChevronRight, PlayCircle } from 'lucide-react';

// On ajoute "async" ici
export default function NiveauPage({ params }: { params: Promise<{ id: string }> }) {
  // On attend (await) que les paramètres soient prêts
  const resolvedParams = React.use ? React.use(params) : React.useSyncExternalStore(() => () => {}, () => params) as any; 
  // Version simplifiée pour Next.js 15 :
  // const { id } = await params; (si tu es sûr d'être en Server Component)

  return (
    <NiveauContent paramsPromise={params} />
  );
}

// Pour plus de sécurité et de compatibilité, utilise cette structure :
async function NiveauContent({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = await paramsPromise;
  const contentDirectory = path.join(process.cwd(), 'content', id);
  
  let chapters: string[] = [];
  if (fs.existsSync(contentDirectory)) {
    chapters = fs.readdirSync(contentDirectory).filter(file => file.endsWith('.md'));
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:text-orange-500 mb-12">
          <ChevronLeft size={20} /> Retour à l'accueil
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Niveau {id}</h1>
        </header>

        <div className="grid gap-4">
          {chapters.length > 0 ? (
            chapters.map((file) => {
              const slug = file.replace('.md', '');
              return (
                <Link key={file} href={`/cours/${id}/${slug}`}>
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-orange-200 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <PlayCircle size={24} />
                      </div>
                      <span className="font-black text-slate-800 text-lg capitalize">{slug.replace(/_/g, ' ')}</span>
                    </div>
                    <ChevronRight className="text-slate-200 group-hover:text-orange-500" />
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-400">
              Aucun chapitre trouvé dans /content/{id}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}