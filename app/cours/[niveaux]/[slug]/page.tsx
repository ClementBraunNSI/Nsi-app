import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Importation des composants pour les onglets
import { ExerciseTabs, ExerciseSection, Correction, Enonce, Verification } from '@/components/ExerciseTabs';

export default async function CoursePage({ params }: { params: Promise<{ niveaux: string, slug: string }> }) {
  const { niveaux, slug } = await params;
  
  const dossierPhysique = niveaux; 
  let filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slug}.mdx`);
  }

  if (!fs.existsSync(filePath)) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Cours non trouvé</h1>
        <p className="text-slate-500 mb-4">Le fichier {slug}.md est introuvable.</p>
        <Link href={`/`} className="text-orange-600 underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  const mdxComponents = {
    ExerciseTabs,
    ExerciseSection,
    Correction,
    Enonce,
    Verification,
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Barre de navigation haute */}
      <nav className="border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={`/niveaux/${niveaux}`} className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest">
            <ChevronLeft size={16} /> Retour au niveau {niveaux}
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* En-tête style "Orange Fox" */}
        <div className="bg-orange-50/50 rounded-[2.5rem] p-10 text-center border border-orange-100 mb-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 italic uppercase tracking-tighter">
              {data.title || slug.replace(/[_-]/g, ' ')}
            </h1>
            {data.chapter && (
              <p className="text-orange-600 text-sm font-black mb-4 uppercase tracking-widest">
                {data.chapter}
              </p>
            )}
            {data.meta && (
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-white/80 inline-block px-6 py-2 rounded-full border border-orange-100 shadow-sm italic">
                {data.meta}
              </div>
            )}
          </div>
          <div className="absolute top-[-20%] right-[-5%] text-[12rem] opacity-[0.03] select-none pointer-events-none">🦊</div>
        </div>

        <article className="prose prose-slate max-w-none 
          prose-headings:italic prose-headings:uppercase prose-headings:font-black
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900
          prose-a:text-orange-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          
          /* RESTAURATION DES COULEURS DE CODE CLAIRES */
          prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#FFFBF5] prose-pre:border-l-4 prose-pre:border-orange-400 prose-pre:text-orange-900 prose-pre:shadow-sm prose-pre:rounded-r-xl
          
          prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-slate-50 prose-th:text-slate-900 prose-th:p-4 prose-th:border prose-th:border-slate-200
          prose-td:p-4 prose-td:border prose-td:border-slate-100
          ">
          <MDXRemote 
            source={content} 
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm, remarkMath],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </article>
      </main>
    </div>
  );
}