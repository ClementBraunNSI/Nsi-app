import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import remarkGfm from 'remark-gfm';

export default async function CoursePage({ params }: { params: Promise<{ niveaux: string, slug: string }> }) {
  // On récupère les paramètres de l'URL
  const { niveaux, slug } = await params;

  /* LOGIQUE DE CHEMIN :
     Si l'URL est /cours/2/types-de-bases
     niveaux = "2"
     On cherche dans : /content/2/types-de-bases.md
  */
  
  // Construction du chemin : content / (valeur de niveaux, ex: "2") / slug.md
  const dossierPhysique = niveaux; // Contient "0", "1", "2", etc.
  let filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slug}.md`);
  
  // Tentative avec .mdx si le .md n'existe pas
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'content', dossierPhysique, `${slug}.mdx`);
  }

  // Si le fichier est introuvable
  if (!fs.existsSync(filePath)) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Cours non trouvé</h1>
        <p className="text-slate-500 mb-4">
          Le fichier <code className="bg-slate-100 px-1">{slug}.md</code> est introuvable dans le dossier <code className="bg-slate-100 px-1">/content/{dossierPhysique}/</code>
        </p>
        <Link href={`/cours/${niveaux}`} className="text-blue-600 underline font-medium">
          Retour au sommaire du niveau {niveaux}
        </Link>
      </div>
    );
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(fileContent);

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Link href={`/cours/${niveaux}`} className="flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-medium">
            <ChevronLeft size={20} /> Retour
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          {data.chapter && (
            <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">
              {data.chapter}
            </span>
          )}
          <h1 className="text-5xl font-black text-slate-900 mt-2 tracking-tight">
            {data.title || slug.replace(/[_-]/g, ' ')}
          </h1>
        </div>

        <article className="prose prose-slate lg:prose-xl max-w-none 
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-strong:text-slate-900
          prose-code:text-orange-700 prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#FFFBF5] prose-pre:border-l-4 prose-pre:border-orange-400 prose-pre:text-orange-900 prose-pre:shadow-sm prose-pre:rounded-r-xl
          prose-table:border-collapse prose-table:border prose-table:border-slate-200 prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-slate-50 prose-th:text-slate-900 prose-th:p-4 prose-th:border prose-th:border-slate-200 prose-th:font-bold
          prose-td:p-4 prose-td:border prose-td:border-slate-100 prose-td:text-slate-600
          prose-tr:even:bg-slate-50/50
          ">
          <MDXRemote 
            source={content} 
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
              },
            }}
          />
        </article>
      </main>
    </div>
  );
}