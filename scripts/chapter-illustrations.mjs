/**
 * Illustrations des chapitres : le renard du niveau (public/images/fox_<niveau>) à gauche, avec son fond,
 * et un accessoire en facettes à droite. Écrit aussi lib/chapter-images.json, lu par lib/chapter-utils.ts.
 * Usage : node scripts/chapter-illustrations.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PROPS } from './fox-props.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'images', 'chapitres');
const WIDTH = 640;
const HEIGHT = 480;

const LEVEL_FOX = {
  0: 'fox_0.png',
  1: 'fox_1.png',
  2: 'fox_2.png',
  3: 'fox_3.png',
  4: 'fox_4.png',
  particuliers: 'fox_c.svg',
};

// Accessoire de chaque chapitre, par niveau, clé = nom normalisé (comme normalizeChapterName).
const CHAPTERS = {
  0: {
    cybersecurite: 'shieldlock',
    'donnees structurees': 'table',
    programmation_python: 'terminal',
    representation_de_base: 'binary',
  },
  1: {
    'donnees structurees': 'table',
    'intelligence artificielle': 'robot',
    internet: 'globe',
    localisation: 'pin',
    'micro-controleurs': 'chip',
    'photographie numerique': 'camera',
    'programmation python': 'terminal',
    'reseaux sociaux': 'social',
    web: 'pages',
  },
  2: {
    algorithmique: 'flowchart',
    'architecture materielle': 'chip',
    'dictionnaires et tables': 'cards',
    histoire: 'hourglass',
    'introduction a python': 'terminal',
    'programmation orientee objet': 'cube',
    projets: 'rocket',
    'representation des donnees': 'binary',
    'reseaux et internet': 'graph',
    'structures de donnees lineaires': 'stack',
    "systemes d'exploitation": 'gear',
    'web et interaction': 'gui',
  },
  3: {
    algorithmique: 'flowchart',
    'architectures materielles, os & reseaux': 'chip',
    'bases de donnees': 'database',
    entrainement: 'stopwatch',
    histoire: 'hourglass',
    'langages et programmation': 'lambda',
    projets: 'rocket',
    'structures de donnees': 'tree',
  },
  4: {
    'bts sio 1 : b2 - developpement (slam)': 'csharp',
    'bts sio 1 : b3 - cybersecurite': 'shieldlock',
    'bts sio 1 slam': 'uml',
    'bts sio 1 slam ap': 'stairs',
    'bts sio 2 : b1 - support et mise a disposition de services informatiques': 'headphones',
    'bts sio 2 : e4 - support et mise a disposition de services informatiques': 'server',
    'ressources necessaires': 'pages',
  },
  particuliers: {
    'programmation en c': 'clang',
    'programmation en c : revisions': 'cards',
    'c : programmation structuree': 'stack',
    'bases de python': 'terminal',
    'programmation fonctionnelle': 'lambda',
  },
};

const normalize = (value) =>
  value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
const slug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Noms de chapitres réellement utilisés dans les cours, pour signaler un chapitre sans illustration.
function chapterNames(folder) {
  const names = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        const match = fs.readFileSync(full, 'utf8').match(/^chapter:\s*(.+)$/m);
        if (match) names.add(normalize(match[1].trim().replace(/^["']|["']$/g, '')));
      }
    }
  };
  walk(path.join(ROOT, 'content', folder));
  return names;
}

async function levelFox(folder) {
  const source = path.join(ROOT, 'public', 'images', LEVEL_FOX[folder]);
  const raster = await sharp(source, { density: 300 }).resize(1200, 1200, { fit: 'inside' }).png().toBuffer();
  const trimmed = await sharp(raster).trim().png().toBuffer();
  const buffer = await sharp(trimmed).resize(420, 420, { fit: 'inside' }).png().toBuffer();
  const { width, height } = await sharp(buffer).metadata();
  return { input: buffer, left: Math.max(4, 220 - Math.round(width / 2)), top: HEIGHT - 8 - height };
}

const prop = (name) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><g transform="translate(-58 -224) scale(1.4)">${PROPS[name]()}</g></svg>`,
  );

const manifest = {};
for (const [folder, chapters] of Object.entries(CHAPTERS)) {
  const fox = await levelFox(folder);
  fs.mkdirSync(path.join(OUT, folder), { recursive: true });
  manifest[folder] = {};
  for (const [name, propName] of Object.entries(chapters)) {
    const file = `chap_${slug(name)}.png`;
    await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([fox, { input: prop(propName), left: 0, top: 0 }])
      .png()
      .toFile(path.join(OUT, folder, file));
    manifest[folder][name] = `/images/chapitres/${folder}/${file}`;
  }
  for (const used of chapterNames(folder)) {
    if (!chapters[used]) console.warn(`niveau ${folder} : chapitre sans illustration « ${used} »`);
  }
  console.log('ok niveau', folder, Object.keys(chapters).length);
}

fs.writeFileSync(path.join(ROOT, 'lib', 'chapter-images.json'), `${JSON.stringify(manifest, null, 2)}\n`);
