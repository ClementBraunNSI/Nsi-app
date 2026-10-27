/**
 * Badges de fiche et succès du site sans illustration : un renard des badges existants à gauche
 * et un accessoire en facettes à droite (même construction que scripts/enquete-badges.mjs).
 * Usage : node scripts/badge-illustrations.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PROPS, svg } from './fox-props.mjs';

const ROOT = process.cwd();
const BADGES = path.join(ROOT, 'public', 'images', 'badges');
const SUCCES = path.join(ROOT, 'public', 'images', 'succes');
fs.mkdirSync(SUCCES, { recursive: true });

// Renards pris dans les badges de fiche ; `crop` garde seulement la partie gauche (sans l'accessoire d'origine).
const FOX = {
  calm: { file: 'circuits-logiques.png', crop: 285 },
  book: { file: 'proj_lib_ui.png' },
  reader: { file: 'prog_mod_doctest.png' },
  wink: { file: 'tp-cesar-vigenere.png' },
  think: { file: 'csv.png' },
  sit: { file: 'c_structs.png' },
  cheer: { file: 'bts_python_intro.png' },
};


// Badges de fiche, nommés comme course_id dans la table badges.
const SHEETS = {
  'paul-bases-python': ['cheer', 'terminal'],
  'paul-bases-python-input': ['think', 'keyboard'],
  'premiere_projet': ['cheer', 'rocket'],
  'programmation-fonctionnelle': ['think', 'lambda'],
  'proj_caisse_bilan': ['book', 'receipt'],
  'proj_caisse_client': ['wink', 'basket'],
  'proj_caisse_journee': ['sit', 'register'],
  'proj_caisse_ligne': ['calm', 'barcode'],
  'proj_caisse_prix': ['think', 'pricetag'],
  'sio_ap1_etapes': ['cheer', 'stairs'],
  'sio_ap1_pages': ['reader', 'pages'],
  'sio_ap2_console': ['sit', 'terminal'],
  'sio_ap2_modele': ['think', 'uml'],
  'sio_ap2_web': ['wink', 'globe'],
  'sio_ap3_gui': ['calm', 'gui'],
  'sio_ap3_mvc': ['book', 'mvc'],
  'sio_foxmon_attaques': ['cheer', 'bolt'],
  'sio_foxmon_carte': ['reader', 'map'],
  'sio_foxmon_combat': ['sit', 'swords'],
  'sio_foxmon_degats': ['think', 'heart'],
  'sio_foxmon_heritage': ['book', 'hierarchy'],
  'sio_foxmon_objets': ['wink', 'potion'],
  'sio_foxmon_pnj': ['calm', 'speech'],
  'sio_foxmon_save': ['sit', 'floppy'],
  'sio_foxmon_xp': ['cheer', 'levelup'],
  'snt_bestiaire': ['book', 'bestiary'],
  'snt_chasse_renarts': ['think', 'map'],
  'snt_chasse_renarts_css': ['wink', 'palette'],
  'snt_chasse_renarts_fond': ['sit', 'frame'],
  'snt_chasse_anglais': ['calm', 'map', 'en'],
  'snt_chasse_anglais_css': ['cheer', 'palette', 'en'],
  'snt_chasse_anglais_fond': ['reader', 'frame', 'en'],
  'snt_chasse_espagnol': ['wink', 'map', 'es'],
  'snt_chasse_espagnol_css': ['sit', 'palette', 'es'],
  'snt_chasse_espagnol_fond': ['think', 'frame', 'es'],
  'term_mini_epreuve': ['think', 'stopwatch'],
  'term_mini_logs': ['reader', 'logs'],
  'term_mini_vehicules': ['wink', 'car'],
  'term_mini_villes': ['calm', 'city'],
  'terminale_exercices_poo': ['sit', 'cube'],
  // Badges existants dont l'accessoire était effacé ou absent.
  'c-affectations-types-exos': ['reader', 'equals'],
  'fiche-boucles': ['cheer', 'loop'],
  'les-dictionnaires-python': ['book', 'cards'],
  'premiere_projet_virus': ['think', 'virus'],
  'proj_bank_ui': ['calm', 'gui'],
  'proj_jv_menu': ['wink', 'menu'],
  'terminale_bdd_modele': ['book', 'table'],
  'terminale_graphes': ['think', 'graph'],
  'tp_spotify_1': ['sit', 'headphones'],
};

// Succès du site (lib/achievements.ts), nommés par leur id.
const ACHIEVEMENTS = {
  first_badge: ['cheer', 'medal_gold'],
  chapter_intro_python: ['book', 'pybook'],
  chapter_bts_cyber: ['think', 'shieldlock'],
  chapter_bts_dev: ['sit', 'csharp'],
  bts_start: ['wink', 'gradcap'],
  badge_collector_1: ['calm', 'medal_bronze'],
  badge_collector_2: ['sit', 'medals'],
  badge_collector_3: ['cheer', 'crown'],
  exercise_warrior_1: ['wink', 'bolt'],
  exercise_warrior_2: ['cheer', 'flame'],
  exercise_warrior_3: ['think', 'target'],
  badge_poo_master: ['reader', 'blueprint'],
  badge_poo_practice: ['sit', 'hammer'],
  maitre_comprehension: ['think', 'bulb'],
  premiere_explorer: ['calm', 'compass'],
  premiere_expert: ['cheer', 'gradcap', true],
};

const foxCache = new Map();
async function foxLayer(name) {
  if (!foxCache.has(name)) {
    const { file, crop } = FOX[name];
    let image = sharp(path.join(BADGES, file));
    if (crop) {
      const full = await image.resize(512, 512).png().toBuffer();
      image = sharp(full).extract({ left: 0, top: 0, width: crop, height: 512 });
    }
    // Même taille pour tous les renards : on rogne le vide, puis on cale le renard sur le sol du badge.
    const trimmed = await sharp(await image.png().toBuffer()).trim().png().toBuffer();
    const buffer = await sharp(trimmed).resize(310, 390, { fit: 'inside' }).png().toBuffer();
    const { width, height } = await sharp(buffer).metadata();
    foxCache.set(name, { input: buffer, left: Math.max(8, 168 - Math.round(width / 2)), top: 472 - height });
  }
  return foxCache.get(name);
}

async function render(out, [fox, prop, variant]) {
  await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      await foxLayer(fox),
      { input: svg(PROPS[prop](variant)), left: 0, top: 0 },
    ])
    .png()
    .toFile(out);
  console.log('ok', path.relative(ROOT, out));
}

const only = process.argv.slice(2);
const wanted = (id) => only.length === 0 || only.includes(id);
for (const [id, spec] of Object.entries(SHEETS)) if (wanted(id)) await render(path.join(BADGES, `${id}.png`), spec);
for (const [id, spec] of Object.entries(ACHIEVEMENTS)) if (wanted(id)) await render(path.join(SUCCES, `${id}.png`), spec);
