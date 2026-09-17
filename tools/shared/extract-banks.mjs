#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const BANQUES_ROOT = path.resolve(__dirname, '../banques');

const LEVEL_FOLDERS = ['0', '1', '2', '3', '4'];
const FOLDER_TO_NIVEAU = {
  '0': 'sni',
  '1': 'snt',
  '2': 'premiere',
  '3': 'terminale',
  '4': 'sio',
};

const DIFFICULTY_PATTERNS = [
  { pattern: /\b(introduction|intro)\b/i, value: 'introduction' },
  { pattern: /\[(facile|easy)\]/i, value: 'facile' },
  { pattern: /\b(facile|easy)\b/i, value: 'facile' },
  { pattern: /\[(moyen|medium)\]/i, value: 'moyen' },
  { pattern: /\b(moyen|medium|important)\b/i, value: 'moyen' },
  { pattern: /\[(difficile|hard)\]/i, value: 'difficile' },
  { pattern: /\b(difficile|hard)\b/i, value: 'difficile' },
  { pattern: /\[(expert)\]/i, value: 'expert' },
  { pattern: /\b(expert)\b/i, value: 'expert' },
];

const SAMPLE_BANKS = {
  'snt/web-qcm.yaml': {
    slug: 'web-qcm',
    title: 'Web — QCM',
    niveau: 'snt',
    questions: [
      {
        id: 'web-qcm-1',
        label: 'Protocole HTTP',
        content: 'Quelle méthode HTTP est utilisée pour récupérer une ressource sans la modifier ?',
        type: 'qcm',
        difficulty: 'facile',
        choices: ['GET', 'POST', 'DELETE', 'PATCH'],
        answer: 0,
        notion: 'Web',
      },
      {
        id: 'web-qcm-2',
        label: 'Code de statut',
        content: 'Que signifie le code HTTP 404 ?',
        type: 'qcm',
        difficulty: 'facile',
        choices: [
          'Ressource non trouvée',
          'Accès interdit',
          'Erreur serveur',
          'Redirection permanente',
        ],
        answer: 0,
        notion: 'Web',
      },
      {
        id: 'web-qcm-3',
        label: 'URL',
        content: 'Dans une URL, quel composant identifie le protocole ?',
        type: 'qcm',
        difficulty: 'moyen',
        choices: ['Le schéma (ex. https)', 'Le port', 'Le fragment', 'Le chemin'],
        answer: 0,
        notion: 'Web',
      },
    ],
  },
  'terminale/recursivite.yaml': {
    slug: 'recursivite',
    title: 'Récursivité — QCM',
    niveau: 'terminale',
    questions: [
      {
        id: 'rec-qcm-1',
        label: 'Cas de base',
        content: 'Pourquoi une fonction récursive doit-elle avoir un cas de base ?',
        type: 'qcm',
        difficulty: 'facile',
        choices: [
          'Pour arrêter la récursion',
          'Pour accélérer le processeur',
          'Pour éviter les paramètres',
          'Pour utiliser une boucle for',
        ],
        answer: 0,
        notion: 'Récursivité',
      },
      {
        id: 'rec-qcm-2',
        label: 'Pile d’exécution',
        content: 'Que se produit-il si une récursion est trop profonde en Python ?',
        type: 'qcm',
        difficulty: 'moyen',
        choices: [
          'RecursionError / stack overflow',
          'SyntaxError',
          'ImportError',
          'Le programme retourne None automatiquement',
        ],
        answer: 0,
        notion: 'Récursivité',
      },
      {
        id: 'rec-qcm-3',
        label: 'Factorielle',
        content: 'Quelle est la valeur de factorielle(0) dans l’exemple classique ?',
        type: 'qcm',
        difficulty: 'facile',
        choices: ['1', '0', '-1', 'Indéfini'],
        answer: 0,
        notion: 'Récursivité',
      },
    ],
  },
};

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const data = {};
  for (const line of match[1].split('\n')) {
    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) continue;
    const value = kvMatch[2].trim().replace(/^['"]|['"]$/g, '');
    data[kvMatch[1]] = value;
  }
  return data;
}

function inferDifficulty(label, sectionDifficulty) {
  const haystack = `${label ?? ''} ${sectionDifficulty ?? ''}`;
  for (const { pattern, value } of DIFFICULTY_PATTERNS) {
    if (pattern.test(haystack)) return value;
  }
  return undefined;
}

function extractTagContent(block, tagName) {
  const regex = new RegExp(`<${tagName}>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  const matches = [...block.matchAll(regex)];
  if (matches.length === 0) return undefined;
  return matches.map((match) => match[1].trim()).join('\n\n').trim() || undefined;
}

function stripNestedCorrection(enonce) {
  if (!enonce) return enonce;
  return enonce.replace(/<Correction>[\s\S]*?<\/Correction>/gi, '').trim();
}

function extractCorrectionFromEnonce(enonceBlock) {
  if (!enonceBlock) return undefined;
  const match = enonceBlock.match(/<Correction>([\s\S]*?)<\/Correction>/i);
  return match?.[1]?.trim();
}

function inferQuestionType(content, verificationCode) {
  const text = `${content ?? ''}\n${verificationCode ?? ''}`.toLowerCase();
  if (/\bselect\b|\bfrom\b|\bwhere\b|\binsert\b/.test(text)) return 'sql';
  if (verificationCode || /\bdef\s+\w+/.test(text) || /```python/.test(text)) return 'python';
  return 'ouvert';
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function walkMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, files);
    } else if (/\.mdx?$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseExerciseSections(text) {
  const sections = [];
  const regex = /<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/gi;

  for (const match of text.matchAll(regex)) {
    const attrs = match[1];
    const body = match[2];
    const id =
      attrs.match(/\bid=["']([^"']+)["']/i)?.[1] ??
      slugify(attrs.match(/\btitle=["']([^"']+)["']/i)?.[1] ?? 'exercice');
    const label =
      attrs.match(/\blabel=["']([^"']+)["']/i)?.[1] ??
      attrs.match(/\btitle=["']([^"']+)["']/i)?.[1] ??
      id;
    const sectionDifficulty = attrs.match(/\bdifficulty=["']([^"']+)["']/i)?.[1];

    const enonceBlock = extractTagContent(body, 'Enonce');
    const verificationCode = extractTagContent(body, 'Verification');
    const correction =
      extractTagContent(body, 'Correction') ?? extractCorrectionFromEnonce(enonceBlock);
    const content = stripNestedCorrection(enonceBlock) ?? body.trim();

    sections.push({
      id,
      label,
      content,
      difficulty: inferDifficulty(label, sectionDifficulty),
      type: inferQuestionType(content, verificationCode),
      correction,
      verificationCode,
    });
  }

  return sections;
}

function wipeBanquesDir() {
  if (fs.existsSync(BANQUES_ROOT)) {
    fs.rmSync(BANQUES_ROOT, { recursive: true, force: true });
  }
  fs.mkdirSync(BANQUES_ROOT, { recursive: true });
}

function writeBankFile(niveau, slug, bank) {
  const dir = path.join(BANQUES_ROOT, niveau);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.yaml`);
  fs.writeFileSync(filePath, yaml.dump(bank, { lineWidth: 120, noRefs: true }), 'utf8');
  return filePath;
}

function extractBanksFromContent() {
  const written = [];

  for (const folder of LEVEL_FOLDERS) {
    const niveau = FOLDER_TO_NIVEAU[folder];
    const files = walkMarkdownFiles(path.join(CONTENT_ROOT, folder));

    for (const filePath of files) {
      const text = fs.readFileSync(filePath, 'utf8');
      const questions = parseExerciseSections(text);
      if (questions.length === 0) continue;

      const frontmatter = parseFrontmatter(text);
      const slug = path.basename(filePath, path.extname(filePath));
      const bank = {
        slug,
        title: frontmatter.title ?? slug,
        niveau,
        source: path.relative(path.resolve(__dirname, '../..'), filePath),
        questions: questions.map((question) => ({
          ...question,
          niveau,
          notion: frontmatter.chapter ?? frontmatter.title ?? slug,
        })),
      };

      writeBankFile(niveau, slug, bank);
      written.push(path.join(BANQUES_ROOT, niveau, `${slug}.yaml`));
    }
  }

  return { written };
}

function writeSampleBanks() {
  const created = [];

  for (const [relativePath, bank] of Object.entries(SAMPLE_BANKS)) {
    const filePath = path.join(BANQUES_ROOT, relativePath);
    if (fs.existsSync(filePath)) continue;
    const [niveau, filename] = relativePath.split('/');
    const slug = filename.replace(/\.yaml$/, '');
    const outputPath = writeBankFile(niveau, slug, bank);
    created.push(outputPath);
  }

  return created;
}

async function main() {
  wipeBanquesDir();
  const { written } = extractBanksFromContent();
  const samples = writeSampleBanks();

  console.log(`Regenerated ${written.length} bank file(s) from content.`);
  if (samples.length > 0) {
    console.log(`Added ${samples.length} sample QCM bank(s):`);
    for (const filePath of samples) {
      console.log(`  - ${path.relative(path.resolve(__dirname, '..'), filePath)}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
