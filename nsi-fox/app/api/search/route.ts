import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  
  const contentDir = path.join(process.cwd(), 'content');
  const results: any[] = [];

  if (query.length < 2) return NextResponse.json([]);

  // On parcourt les dossiers de niveaux (0, 1, 2...)
  const levels = fs.readdirSync(contentDir);

  levels.forEach((level) => {
    const levelPath = path.join(contentDir, level);
    if (fs.statSync(levelPath).isDirectory()) {
      const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md'));

      files.forEach((file) => {
        const fileContent = fs.readFileSync(path.join(levelPath, file), 'utf8');
        const { data } = matter(fileContent);
        const title = data.title || file.replace('.md', '').replace(/[_-]/g, ' ');

        // Si le titre ou le contenu correspond à la recherche
        if (title.toLowerCase().includes(query)) {
          results.push({
            title,
            level,
            slug: file.replace('.md', ''),
            category: level === '1' ? 'SNT' : level === '2' ? '1ère NSI' : level === '3' ? 'Terminale NSI' : `Niveau ${level}`
          });
        }
      });
    }
  });

  return NextResponse.json(results.slice(0, 8)); // On limite à 8 résultats
}