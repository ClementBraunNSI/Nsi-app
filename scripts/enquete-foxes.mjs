/**
 * Renards des enquêtes : chaque enquête habille les quatre émotes du renard de l'académie
 * (calme, pensif, joyeux, étourdi) d'un chapeau, d'un accessoire au cou et de l'objet de son badge.
 * Une planche par enquête, quatre cases dans le même ordre que academy-fox-emotes.png.
 * Usage : node scripts/enquete-foxes.mjs
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { PROPS as CASE_PROPS } from './enquete-badges.mjs';
import { B, BD, BL, BR, BRD, CR, CR2, G, GD, INK, O, OD, P, PD, R, RD, Y, YD } from './fox-props.mjs';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'images', 'enquetes');
const EMOTES = path.join(ROOT, 'public', 'images', 'foxtest', 'academy', 'academy-fox-emotes.png');
fs.mkdirSync(OUT, { recursive: true });

const poly = (points, fill, extra = '') => `<polygon points="${points}" fill="${fill}" ${extra}/>`;
const line = (d, color, width, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;

// Repères relevés sur chaque émote (case de 512 px) : sommet du crâne et haut du poitrail.
const POSES = [
  { head: [295, 100, 0, 1], neck: [296, 212, 0, 1] },
  // Pensif : tête penchée, la patte au menton. L'accessoire du cou s'arrête devant la patte.
  { head: [266, 118, -27, 0.88], neck: [262, 212, -10, 0.9], paw: '292,200 334,196 352,214 376,262 376,300 324,300 292,246' },
  // Joyeux : un bout de queue de l'émote voisine dépasse en bas à droite de la case, on le masque.
  { head: [276, 93, 0, 0.92], neck: [275, 200, 0, 0.92], crop: '0,0 512,0 512,370 396,370 396,512 0,512' },
  { head: [294, 126, 16, 1], neck: [282, 236, 12, 1] },
];

const at = ([x, y, angle, scale], body, grow = 1) => `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale * grow})">${body}</g>`;

// Plumes, gouttes, abeilles, feuilles : petits détails posés autour du renard, en coordonnées de la case finale.
const drop = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">${poly('0,-18 -10,2 0,12', B)}${poly('0,-18 10,2 0,12', BD)}${poly('0,-12 -5,0 0,4', BL)}</g>`;
const bee = (x, y, angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle})">
  ${poly('-6,-6 -16,-22 2,-14', '#fff', 'opacity=".85"')}${poly('2,-6 6,-24 14,-10', '#fff', 'opacity=".7"')}
  <ellipse cx="0" cy="0" rx="17" ry="11" fill="${Y}"/>${poly('-3,-11 4,-11 4,11 -3,11', INK)}${poly('9,-8 13,-6 13,6 9,8', INK)}
  ${poly('-17,0 -24,-3 -24,3', INK)}</g>`;
const feather = (x, y, angle) =>
  `<g transform="translate(${x} ${y}) rotate(${angle})">${poly('0,-22 -8,-4 0,16', CR)}${poly('0,-22 8,-4 0,16', CR2)}${line('M0 -16 L0 24', '#d6c4a4', 2)}</g>`;
const leaf = (x, y, angle, fill = G, shade = GD) =>
  `<g transform="translate(${x} ${y}) rotate(${angle})">${poly('0,-18 -11,0 0,14', fill)}${poly('0,-18 11,0 0,14', shade)}${line('M0 14 L0 24', BRD, 3)}</g>`;

// Tenues : chapeau (origine au bord du chapeau, sur le crâne), accessoire au cou, décor de la case.
const OUTFITS = {
  // Qui a croqué les œufs ? Chapeau de paille du poulailler, plume de poule, bandana bleu, plumes au vent.
  'oeufs-croques': {
    prop: 'egg',
    hat: `
      ${poly('8,-30 30,-92 40,-86 22,-26', CR)}${poly('22,-26 40,-86 46,-76 30,-24', CR2)}${line('M14 -28 L38 -88', '#d6c4a4', 3)}
      ${poly('-46,4 -40,-42 -10,-52 0,-52 0,4', '#f2cf7a')}${poly('46,4 40,-42 10,-52 0,-52 0,4', '#d9ad4f')}
      ${line('M-43 -30 L43 -30 M-44 -18 L44 -18', '#b8862f', 3, 'opacity=".6"')}
      ${poly('-45,-12 0,-12 0,0 -46,0', R)}${poly('45,-12 0,-12 0,0 46,0', RD)}
      ${poly('-104,4 0,-2 0,14 -94,16', '#f2cf7a')}${poly('104,4 0,-2 0,14 94,16', '#d9ad4f')}
      ${line('M-90 6 L-60 12 M-40 4 L-20 10 M90 6 L60 12 M40 4 L20 10', '#b8862f', 3, 'opacity=".6"')}`,
    neck: `
      ${poly('-38,-8 0,0 0,46', B)}${poly('38,-8 0,0 0,46', BD)}<circle cx="0" cy="2" r="8" fill="${BD}"/>
      <circle cx="-16" cy="8" r="3" fill="${CR}"/><circle cx="12" cy="10" r="3" fill="${CR}"/><circle cx="-2" cy="26" r="3" fill="${CR}"/>`,
    scene: `${feather(46, 110, 30)}${feather(318, 150, -40)}${feather(78, 236, 70)}`,
  },
  // Le miel envolé : chapeau d'apiculteur, voile relevé sur les côtés, abeilles.
  'miel-envole': {
    prop: 'honey',
    hat: `
      ${poly('-42,4 -36,-46 0,-52 0,4', CR)}${poly('42,4 36,-46 0,-52 0,4', CR2)}
      ${poly('-43,-12 0,-12 0,0 -44,0', Y)}${poly('43,-12 0,-12 0,0 44,0', YD)}
      ${poly('-98,0 0,-4 0,12 -88,14', CR)}${poly('98,0 0,-4 0,12 88,14', CR2)}
      ${poly('-96,10 -66,10 -58,124 -108,112', '#f8fafc', 'opacity=".55"')}${poly('96,10 66,10 58,124 108,112', '#e2e8f0', 'opacity=".55"')}
      ${line('M-88 12 L-98 114 M-77 12 L-82 118 M-68 12 L-66 122 M88 12 L98 114 M77 12 L82 118 M68 12 L66 122', '#94a3b8', 2, 'opacity=".6"')}
      ${line('M-108 112 L-58 124 M108 112 L58 124', '#94a3b8', 3, 'opacity=".7"')}`,
    neck: '',
    scene: `${bee(316, 150, -12)}${bee(470, 236, 10)}${bee(54, 128, 18)}`,
  },
  // Le barrage percé : suroît jaune, ciré au col, gouttes de pluie.
  'barrage-perce': {
    prop: 'dam',
    hat: `
      ${poly('-52,6 -46,-38 -16,-56 0,-58 0,6', '#facc15')}${poly('52,6 46,-38 16,-56 0,-58 0,6', '#eab308')}
      ${line('M0 -58 L0 6', '#ca8a04', 4)}
      ${poly('-96,26 -60,0 0,2 0,16 -72,30', '#facc15')}${poly('96,26 60,0 0,2 0,16 72,30', '#eab308')}`,
    neck: `${poly('-46,-8 -6,6 -16,30', '#facc15')}${poly('46,-8 6,6 16,30', '#eab308')}<circle cx="0" cy="22" r="5" fill="${INK}"/>`,
    scene: `${drop(40, 96)}${drop(84, 170, 0.8)}${drop(30, 236, 0.7)}${drop(318, 120, 0.8)}${drop(300, 220, 0.6)}`,
  },
  // L'affaire du Gland d'Or : haut-de-forme de la Nuit des Lanternes, nœud papillon, lanterne.
  'gland-d-or': {
    prop: 'acorn',
    hat: `
      ${poly('-40,2 -36,-92 0,-94 0,2', P)}${poly('40,2 36,-92 0,-94 0,2', PD)}
      ${poly('-36,-92 0,-94 0,-100 -30,-100', '#a78bfa')}${poly('36,-92 0,-94 0,-100 30,-100', '#8b5cf6')}
      ${poly('-39,-30 0,-30 0,-10 -40,-10', O)}${poly('39,-30 0,-30 0,-10 40,-10', OD)}
      ${poly('22,-34 30,-26 22,-14 14,-26', Y)}${poly('22,-34 30,-26 22,-26', YD)}
      ${poly('-64,0 0,-2 0,12 -58,12', P)}${poly('64,0 0,-2 0,12 58,12', PD)}`,
    neck: `${poly('0,2 -32,-14 -32,18', R)}${poly('0,2 32,-14 32,18', RD)}${poly('-7,-6 7,-6 7,10 -7,10', RD)}`,
    scene: `
      ${line('M470 0 L470 64', INK, 3)}${poly('458,64 482,64 478,72 462,72', INK)}
      ${poly('470,72 438,96 438,152 470,176', R)}${poly('470,72 502,96 502,152 470,176', RD)}
      ${line('M440 112 L500 112 M440 136 L500 136', '#fca5a5', 3, 'opacity=".7"')}
      ${poly('458,176 482,176 478,186 462,186', INK)}<circle cx="470" cy="124" r="40" fill="${Y}" opacity=".18"/>`,
  },
  // Le Bois des Détours : chapeau de garde forestière, foulard, feuilles qui tombent.
  'bois-des-detours': {
    prop: 'signpost',
    hat: `
      ${poly('-100,2 0,-2 0,12 -92,14', '#4d7c0f')}${poly('100,2 0,-2 0,12 92,14', '#3f6212')}
      ${poly('-48,2 -38,-50 -12,-64 0,-56 0,2', '#4d7c0f')}${poly('48,2 38,-50 12,-64 0,-56 0,2', '#3f6212')}
      ${line('M-24 -56 L-20 -8 M24 -56 L20 -8', '#365314', 3, 'opacity=".7"')}
      ${poly('-48,-10 0,-10 0,2 -49,2', BR)}${poly('48,-10 0,-10 0,2 49,2', BRD)}`,
    neck: `${poly('-36,-8 0,0 0,48', R)}${poly('36,-8 0,0 0,48', RD)}<circle cx="0" cy="2" r="8" fill="${RD}"/>`,
    scene: `${leaf(48, 104, 30, Y, YD)}${leaf(90, 190, -40)}${leaf(30, 262, 70, O, OD)}${leaf(316, 132, -20)}`,
  },
};

// Les quatre émotes, recadrées une à une.
const emotes = await Promise.all(
  [0, 1, 2, 3].map(async (index) => (await sharp(EMOTES).extract({ left: index * 512, top: 0, width: 512, height: 512 }).png().toBuffer()).toString('base64')),
);

// Le renard est réduit et calé à gauche pour laisser l'objet de l'enquête à droite (comme sur les badges).
const FOX = 'matrix(0.84 0 0 0.84 -77.5 70.6)';
// Les chapeaux sont dessinés à la largeur du crâne ; un peu plus grands, ils se lisent mieux en vignette.
const HAT = 1.15;

for (const [slug, outfit] of Object.entries(OUTFITS)) {
  const cells = await Promise.all(
    POSES.map(async (pose, index) => {
      const clip = `${pose.paw ? `<clipPath id="paw"><path clip-rule="evenodd" d="M0 0 H512 V512 H0 Z M${pose.paw.replaceAll(' ', ' L')} Z"/></clipPath>` : ''}${pose.crop ? `<clipPath id="crop"><polygon points="${pose.crop}"/></clipPath>` : ''}`;
      const neck = outfit.neck ? `<g ${pose.paw ? 'clip-path="url(#paw)"' : ''}>${at(pose.neck, outfit.neck)}</g>` : '';
      const body = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" viewBox="0 0 512 512">
        <defs>${clip}</defs>${outfit.scene}${CASE_PROPS[outfit.prop]}
        <g transform="${FOX}"><image width="512" height="512" xlink:href="data:image/png;base64,${emotes[index]}" ${pose.crop ? 'clip-path="url(#crop)"' : ''}/>${neck}${at(pose.head, outfit.hat, HAT)}</g>
      </svg>`;
      return { input: await sharp(Buffer.from(body)).png().toBuffer(), left: index * 512, top: 0 };
    }),
  );
  const sheet = await sharp({ create: { width: 2048, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(cells).png().toBuffer();

  // Thème sombre : un halo crème derrière la silhouette, sinon les pattes noires se perdent dans le fond.
  const glow = await sharp(sheet).extractChannel('alpha').blur(7).linear(1.1, 0).toBuffer();
  const halo = await sharp({ create: { width: 2048, height: 512, channels: 3, background: '#f6efd9' } }).joinChannel(glow).png().toBuffer();
  const dark = await sharp(halo).composite([{ input: sheet }]).png().toBuffer();

  for (const [suffix, image] of [['', sheet], ['-sombre', dark]]) {
    const out = path.join(OUT, `renard-${slug}${suffix}.png`);
    await sharp(image).resize(1280, 320).png({ palette: true, quality: 90, effort: 10 }).toFile(out);
    console.log('ok', path.relative(ROOT, out));
  }
}
