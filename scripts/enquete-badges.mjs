/**
 * Badges et succès des enquêtes : un renard des badges existants, décalé à gauche,
 * et un accessoire d'enquête en facettes à droite (même construction que les badges de fiche).
 * Usage : node scripts/enquete-badges.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const ROOT = process.cwd();
const BADGES = path.join(ROOT, 'public', 'images', 'badges');
const SUCCES = path.join(ROOT, 'public', 'images', 'succes');
fs.mkdirSync(SUCCES, { recursive: true });

// Renards sans accessoire, pris dans les badges de fiche.
const FOX = {
  wink: 'tp-cesar-vigenere.png',
  think: 'csv.png',
  sit: 'c_structs.png',
  cheer: 'bts_python_intro.png',
};

const INK = '#302020';
const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${body}</svg>`);

// Accessoires dessinés en facettes : chaque forme a une moitié claire et une moitié ombrée.
const PROPS = {
  // Œuf croqué : coquille crème fendue, jaune qui coule.
  egg: `
    <ellipse cx="410" cy="470" rx="62" ry="10" fill="#000" opacity=".08"/>
    <polygon points="410,300 362,360 352,420 380,462 410,468" fill="#fbf1dc"/>
    <polygon points="410,300 458,360 468,420 440,462 410,468" fill="#e9d9b8"/>
    <polygon points="352,392 372,372 390,394 410,370 428,394 446,372 468,392 468,420 352,420" fill="#f7a823"/>
    <polygon points="352,392 372,372 390,394 410,370 410,420 352,420" fill="#fbbf3a"/>
    <polyline points="352,392 372,372 390,394 410,370 428,394 446,372 468,392" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`,
  // Pot de miel : pot ambré, couvercle, goutte qui s'échappe.
  honey: `
    <ellipse cx="410" cy="472" rx="66" ry="10" fill="#000" opacity=".08"/>
    <polygon points="352,350 410,338 410,470 362,462 346,410" fill="#f59e0b"/>
    <polygon points="468,350 410,338 410,470 458,462 474,410" fill="#d97706"/>
    <polygon points="350,326 410,316 470,326 466,350 410,342 354,350" fill="#b45309"/>
    <polygon points="372,384 448,384 444,420 376,420" fill="#fef3c7"/>
    <polygon points="402,296 418,296 422,312 410,322 398,312" fill="#f59e0b"/>`,
  // Barrage percé : rondins, voie d'eau qui jaillit.
  dam: `
    <ellipse cx="408" cy="474" rx="72" ry="10" fill="#000" opacity=".08"/>
    <polygon points="338,470 338,330 372,322 372,470" fill="#a8693c"/>
    <polygon points="372,470 372,322 406,330 406,470" fill="#8a5330"/>
    <polygon points="406,470 406,330 440,322 440,470" fill="#a8693c"/>
    <polygon points="440,470 440,322 474,330 474,470" fill="#8a5330"/>
    <circle cx="372" cy="400" r="20" fill="#5b8fd1"/>
    <polygon points="372,400 352,448 372,436 392,448" fill="#3b82f6"/>
    <polygon points="372,380 362,400 382,400" fill="#93c5fd"/>`,
  // Gland d'or : cupule brune, fruit doré à facettes.
  acorn: `
    <ellipse cx="410" cy="474" rx="58" ry="10" fill="#000" opacity=".08"/>
    <polygon points="410,350 362,374 372,430 410,470" fill="#fcd34d"/>
    <polygon points="410,350 458,374 448,430 410,470" fill="#f59e0b"/>
    <polygon points="410,352 380,414 410,470" fill="#fde68a" opacity=".55"/>
    <polygon points="352,372 366,336 410,322 410,378" fill="#92400e"/>
    <polygon points="468,372 454,336 410,322 410,378" fill="#78350f"/>
    <polygon points="404,322 410,292 422,296 416,324" fill="#78350f"/>
    <polygon points="452,300 460,286 468,300 460,314" fill="#fef3c7"/>`,
  // Dossier bouclé : chemise kraft, tampon vert.
  folder: `
    <ellipse cx="410" cy="474" rx="72" ry="10" fill="#000" opacity=".08"/>
    <polygon points="338,352 380,352 392,364 482,364 482,468 338,468" fill="#e8c37a"/>
    <polygon points="410,364 482,364 482,468 410,468" fill="#d6aa58"/>
    <polygon points="352,330 470,330 470,360 352,360" fill="#fffaf0"/>
    <polygon points="378,420 398,442 444,394 456,406 398,466 366,432" fill="#16a34a"/>`,
  // Loupe : flair du renard.
  magnifier: `
    <ellipse cx="410" cy="474" rx="58" ry="10" fill="#000" opacity=".08"/>
    <polygon points="430,412 448,400 482,452 464,464" fill="${INK}"/>
    <circle cx="400" cy="372" r="56" fill="${INK}"/>
    <circle cx="400" cy="372" r="42" fill="#bfe3f5"/>
    <polygon points="400,330 358,372 400,372" fill="#e6f5fc"/>`,
  // Rebondissement : point d'interrogation et point d'exclamation.
  twist: `
    <ellipse cx="410" cy="474" rx="62" ry="10" fill="#000" opacity=".08"/>
    <path d="M352 352 Q352 312 390 312 Q426 312 426 348 Q426 372 398 384 L398 410" fill="none" stroke="#ea580c" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="398" cy="448" r="13" fill="#ea580c"/>
    <polygon points="448,318 474,318 466,416 456,416" fill="${INK}"/>
    <circle cx="461" cy="448" r="12" fill="${INK}"/>`,
  // Obstination : cible, une flèche plantée au centre.
  target: `
    <ellipse cx="410" cy="474" rx="62" ry="10" fill="#000" opacity=".08"/>
    <circle cx="410" cy="396" r="70" fill="#ea580c"/>
    <circle cx="410" cy="396" r="50" fill="#fffaf0"/>
    <circle cx="410" cy="396" r="30" fill="#ea580c"/>
    <circle cx="410" cy="396" r="12" fill="#fffaf0"/>
    <polygon points="410,396 470,330 478,338 418,404" fill="${INK}"/>
    <polygon points="470,330 486,318 490,336 478,338" fill="#16a34a"/>`,
  // Détective de la tanière : étoile d'or à facettes.
  star: `
    <ellipse cx="410" cy="474" rx="62" ry="10" fill="#000" opacity=".08"/>
    <polygon points="410,306 428,368 492,368 440,404 460,466 410,428 360,466 380,404 328,368 392,368" fill="#fbbf24"/>
    <polygon points="410,306 428,368 492,368 440,404 460,466 410,428" fill="#f59e0b"/>
    <circle cx="410" cy="390" r="16" fill="#fef3c7"/>`,
};

const ITEMS = [
  // Badges : un par enquête, nommés comme course_id dans la table badges.
  { out: path.join(BADGES, 'enquete-oeufs-croques.png'), fox: 'wink', prop: 'egg' },
  { out: path.join(BADGES, 'enquete-miel-envole.png'), fox: 'sit', prop: 'honey' },
  { out: path.join(BADGES, 'enquete-barrage-perce.png'), fox: 'think', prop: 'dam' },
  { out: path.join(BADGES, 'enquete-gland-d-or.png'), fox: 'cheer', prop: 'acorn' },
  // Succès des enquêtes.
  { out: path.join(SUCCES, 'enquete_premier_dossier.png'), fox: 'cheer', prop: 'folder' },
  { out: path.join(SUCCES, 'enquete_flair.png'), fox: 'think', prop: 'magnifier' },
  { out: path.join(SUCCES, 'enquete_rebondissement.png'), fox: 'wink', prop: 'twist' },
  { out: path.join(SUCCES, 'enquete_obstine.png'), fox: 'sit', prop: 'target' },
  { out: path.join(SUCCES, 'enquete_toutes.png'), fox: 'cheer', prop: 'star' },
];

for (const item of ITEMS) {
  const fox = await sharp(path.join(BADGES, FOX[item.fox])).resize(400, 400).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: fox, left: 6, top: 96 },
      { input: svg(PROPS[item.prop]), left: 0, top: 0 },
    ])
    .png()
    .toFile(item.out);
  console.log('ok', path.relative(ROOT, item.out));
}
