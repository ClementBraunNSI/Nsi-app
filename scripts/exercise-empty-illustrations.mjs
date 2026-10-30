/**
 * Illustration « choisir un exercice » d'une fiche, une par niveau : le renard du niveau tourné vers la liste
 * (à gauche), une fiche d'exercices et une flèche qui pointe vers la liste.
 * Usage : node scripts/exercise-empty-illustrations.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { CR, CR2, G, INK, OD, OM, Y } from './fox-props.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'images', 'exercices');
fs.mkdirSync(OUT, { recursive: true });
const WIDTH = 640;
const HEIGHT = 480;

// `flip` : le renard regarde à droite sur l'image d'origine, on le retourne vers la liste.
const LEVELS = {
  0: { file: 'fox_0.png', flip: true },
  1: { file: 'fox_1.png', flip: true },
  2: { file: 'fox_2.png', flip: false },
  3: { file: 'fox_3.png', flip: true },
  4: { file: 'fox_4.png', flip: true },
  ressources: { file: 'fox_c.svg', flip: false },
  particuliers: { file: 'fox_2.png', flip: false },
};

// Fiche d'exercices penchée : lignes, états (validé, en cours, à faire), et une flèche vers la gauche.
const scene = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <ellipse cx="180" cy="452" rx="120" ry="12" fill="#000" opacity=".07"/>
  <g transform="rotate(-6 180 300)">
    <polygon points="86,150 274,150 274,440 86,440" fill="${CR}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
    <polygon points="180,152 272,152 272,438 180,438" fill="${CR2}"/>
    <polygon points="140,134 220,134 220,166 140,166" fill="${OD}"/>
    <polygon points="140,134 180,134 180,166 140,166" fill="${OM}"/>
    ${[0, 1, 2, 3, 4].map((i) => {
      const y = 196 + i * 46;
      const mark = i < 2
        ? `<circle cx="116" cy="${y}" r="12" fill="${G}"/><path d="M110 ${y} L115 ${y + 5} L123 ${y - 5}" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`
        : i === 2
          ? `<circle cx="116" cy="${y}" r="12" fill="${Y}"/>`
          : `<circle cx="116" cy="${y}" r="10" fill="none" stroke="#c9b99a" stroke-width="4"/>`;
      const width = [120, 96, 132, 104, 88][i];
      return `${mark}<rect x="140" y="${y - 6}" width="${width}" height="12" rx="6" fill="${i === 2 ? OM : '#c9b99a'}"/>`;
    }).join('')}
  </g>
  <path d="M396 120 C 340 70, 250 66, 196 96" fill="none" stroke="${OM}" stroke-width="12" stroke-linecap="round" stroke-dasharray="2 22"/>
  <polygon points="168,110 206,72 214,118" fill="${OM}"/>
  <polygon points="168,110 206,72 196,96" fill="${OD}"/>
</svg>`;

async function fox({ file, flip }) {
  const source = path.join(ROOT, 'public', 'images', file);
  let image = sharp(await sharp(source, { density: 300 }).resize(1200, 1200, { fit: 'inside' }).png().toBuffer());
  if (flip) image = image.flop();
  const trimmed = await sharp(await image.png().toBuffer()).trim().png().toBuffer();
  const buffer = await sharp(trimmed).resize(330, 360, { fit: 'inside' }).png().toBuffer();
  const { width, height } = await sharp(buffer).metadata();
  return { input: buffer, left: Math.min(WIDTH - width - 6, 470 - Math.round(width / 2)), top: HEIGHT - 12 - height };
}

for (const [level, spec] of Object.entries(LEVELS)) {
  const out = path.join(OUT, `choisir-${level}.png`);
  await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: Buffer.from(scene), left: 0, top: 0 }, await fox(spec)])
    .png()
    .toFile(out);
  console.log('ok', path.relative(ROOT, out));
}
