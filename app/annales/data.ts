import DB from './annales_db.json';

// Interfaces for the JSON structure
export interface Question {
  id: string;
  question: string;
  indice?: string;
  reponse?: string;
}

export interface Exercise {
  title: string;
  theme?: string;
  points?: number;
  intro?: string;
  questions: Question[];
}

export interface SubjectData {
  title: string;
  date: string;
  description: string;
  exercices: Exercise[];
}

// Interface for the list item in ANNALES_LIST
export interface SubjectListItem {
  id: string;
  region: string;
  session: string;
  themes: string[];
  difficult: number;
}

export interface YearGroup {
  year: number;
  subjects: SubjectListItem[];
}

// Load the raw data from JSON
export const ANNALES_DATA: Record<string, SubjectData> = DB as unknown as Record<string, SubjectData>;

// Keywords for theme extraction from intro text
const THEME_KEYWORDS: Record<string, string> = {
  "arbre": "Arbres",
  "abr": "ABR",
  "graphe": "Graphes",
  "réseau": "Réseaux",
  "protocole": "Réseaux",
  "base de données": "BDD",
  "relationnel": "BDD",
  "sql": "SQL",
  "poo": "POO",
  "objet": "POO",
  "classe": "POO",
  "récursiv": "Récursivité",
  "pile": "Piles",
  "file": "Files",
  "tri": "Tris",
  "dichotom": "Dichotomie",
  "processus": "OS",
  "système": "OS",
  "interblocage": "OS",
  "boyer": "Texte",
  "knn": "K-NN",
  "diviser pour régner": "Diviser pour régner",
  "programmation dynamique": "Prog Dynamique"
};

// Helper to capitalize first letter
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Generate ANNALES_LIST dynamically
const subjectsByYear: Record<number, SubjectListItem[]> = {};

Object.keys(ANNALES_DATA).forEach((id) => {
  const parts = id.split('-');
  // Expected ID format: {year}-{region}-{session...}
  // Example: 2023-metropole-juin-jour-1
  
  const yearStr = parts[0];
  const year = parseInt(yearStr, 10);
  
  if (isNaN(year)) return;

  const subjectData = ANNALES_DATA[id];

  // Extract region (usually parts[1])
  let regionRaw = parts[1] || 'inconnue';
  let region = capitalize(regionRaw);
  if (regionRaw === 'metropole') region = 'Métropole';
  if (regionRaw === 'polynesie') region = 'Polynésie';
  if (regionRaw === 'amerique') region = 'Amérique du Nord'; // rough guess
  if (regionRaw === 'centres') region = 'Centres Étrangers'; // rough guess

  // Extract session (rest of parts)
  let sessionRaw = parts.slice(2).join(' ');
  // Clean up session string
  let session = capitalize(sessionRaw.replace(/-/g, ' '));
  
  // Refine session display
  if (session.includes('sujet')) {
    session = session.replace(/sujet (\d+)/i, '(Sujet $1)');
  }
  if (session.includes('jour')) {
    session = session.replace(/jour (\d+)/i, '(Jour $1)');
  }

  // Extract themes
  const themesSet = new Set<string>();
  
  subjectData.exercices.forEach(exo => {
    // Add explicit theme if not generic
    if (exo.theme && exo.theme !== 'NSI' && exo.theme.length > 2) {
      themesSet.add(exo.theme);
    }
    
    // Scan intro for keywords
    if (exo.intro) {
      const lowerIntro = exo.intro.toLowerCase();
      Object.entries(THEME_KEYWORDS).forEach(([keyword, label]) => {
        if (lowerIntro.includes(keyword)) {
          themesSet.add(label);
        }
      });
    }
    
    // Scan title for keywords
    if (exo.title) {
        const lowerTitle = exo.title.toLowerCase();
        Object.entries(THEME_KEYWORDS).forEach(([keyword, label]) => {
          if (lowerTitle.includes(keyword)) {
            themesSet.add(label);
          }
        });
    }
  });

  const themes = Array.from(themesSet);
  if (themes.length === 0) themes.push('Divers');

  // Difficulty (placeholder)
  // Maybe estimate based on number of questions?
  const totalQuestions = subjectData.exercices.reduce((acc, exo) => acc + (exo.questions?.length || 0), 0);
  // Simple heuristic: more questions = slightly harder? Or just random 3-4.
  // Let's keep it static 3 for now to avoid confusion.
  const difficult = 3;

  if (!subjectsByYear[year]) {
    subjectsByYear[year] = [];
  }

  // Strip year from ID for the URL param to avoid duplication in page.tsx
  // page.tsx constructs key as `${year}-${subject}`
  const shortId = id.startsWith(`${year}-`) ? id.slice(String(year).length + 1) : id;

  subjectsByYear[year].push({
    id: shortId,
    region,
    session,
    themes,
    difficult
  });
});

// Export the sorted list
export const ANNALES_LIST: YearGroup[] = Object.keys(subjectsByYear)
  .map(yStr => {
    const year = parseInt(yStr, 10);
    return {
      year,
      subjects: subjectsByYear[year].sort((a, b) => {
        // Sort by session name or region
        return a.region.localeCompare(b.region) || a.session.localeCompare(b.session);
      })
    };
  })
  .sort((a, b) => b.year - a.year); // Descending years
