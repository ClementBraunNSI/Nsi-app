import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import remarkGfm from 'remark-gfm';


export default async function CoursePage({ params }: { params: Promise<{ niveaux: string, slug: string }> }) {
  const { niveaux, slug } = await params;
  const filePath = path.join(process.cwd(), 'content', niveaux, `${slug}.md`);

  if (!fs.existsSync(filePath)) return <div className="p-10">Cours non trouvé</div>;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href={`/niveaux/${niveaux}`} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium">
            <ChevronLeft size={20} /> Retour
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-black text-slate-900 mb-10 tracking-tight">
          {data.title || slug.replace(/[_-]/g, ' ')}
        </h1>

        {/* C'est cette div qui fait toute la magie du design Tailwind */}
        <article className="prose prose-slate lg:prose-xl max-w-none 
          /* Styles généraux du texte */
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900
          
          /* Style du code en ligne (ex: `variable`) */
          prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          
          /* STYLE DES BLOCS DE CODE (Le thème orangé lisible) */
          prose-pre:bg-[#FFFBF5]           /* Fond crème/orange très clair */
          prose-pre:border-l-4             /* Bordure à gauche */
          prose-pre:border-orange-400      /* Couleur de la bordure */
          prose-pre:text-orange-900        /* Couleur du texte principal du code */
          prose-pre:shadow-sm              /* Légère ombre pour le relief */
          prose-pre:rounded-r-xl           /* Coins arrondis à droite */
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900
          
          /* STYLE DES TABLEAUX (Bordures et structure) */
          prose-table:border-collapse 
          prose-table:border prose-table:border-slate-200 
          prose-table:rounded-xl 
          prose-table:overflow-hidden

          /* En-têtes (th) */
          prose-th:bg-slate-50 
          prose-th:text-slate-900 
          prose-th:p-4 
          prose-th:border prose-th:border-slate-200
          prose-th:font-bold

          /* Cellules (td) */
          prose-td:p-4 
          prose-td:border prose-td:border-slate-100 
          prose-td:text-slate-600
          
          /* Lignes alternées (Optionnel mais joli) */
          prose-tr:even:bg-slate-50/50

          /* Style des blocs de code orangés */
          prose-pre:bg-[#FFFBF5]           
          prose-pre:border-l-4             
          prose-pre:border-orange-400      
          prose-pre:text-orange-900        
          prose-pre:shadow-sm              
          prose-pre:rounded-r-xl
          ">
          <MDXRemote 
  source={content} 
  options={{
    mdxOptions: {
      remarkPlugins: [remarkGfm], // Active le support des tableaux
    },
  }}
/>
        </article>
      </main>
    </div>
  );
}