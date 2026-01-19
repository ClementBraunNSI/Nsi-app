import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function AllCoursesPage() {
  const contentDir = path.join(process.cwd(), 'content');
  const levels = fs.readdirSync(contentDir).filter(f => 
    fs.statSync(path.join(contentDir, f)).isDirectory()
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-12">Catalogue des cours</h1>
        
        {levels.map(level => {
          const levelPath = path.join(contentDir, level);
          const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md'));

          return (
            <section key={level} className="mb-10">
              <h2 className="text-xl font-bold text-orange-600 mb-4 px-2 uppercase tracking-wider">
                Niveau {level === '0' ? 'Seconde' : level === '1' ? 'Première' : 'Terminale'}
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {files.map((file, index) => {
                  const fileContent = fs.readFileSync(path.join(levelPath, file), 'utf8');
                  const { data } = matter(fileContent);
                  const slug = file.replace('.md', '');
                  
                  return (
                    <Link 
                      key={slug} 
                      href={`/cours/${level}/${slug}`}
                      className={`block p-4 hover:bg-orange-50 transition-colors flex justify-between items-center ${index !== files.length - 1 ? 'border-b border-slate-50' : ''}`}
                    >
                      <span className="font-medium text-slate-700">
                        {data.title || slug.replace(/[_-]/g, ' ')}
                      </span>
                      <span className="text-slate-300 text-sm italic">Lire le cours →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}