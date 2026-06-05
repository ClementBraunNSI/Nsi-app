/**
 * Reconstruit tableaux/ + manifest.json à partir du dossier edition_2025_2026 déjà copié.
 * Usage: node scripts/rebuild-chasse-edition-2025.mjs
 */
import fs from 'fs';
import path from 'path';

const DEST = path.join(
  process.cwd(),
  'public/projets/chasse-aux-renards/edition_2025_2026'
);
const SITES_DIR = path.join(DEST, 'sites');
const TABLEAUX_DIR = path.join(DEST, 'tableaux');
const LEVELS = ['secondes', '3e'];

const IMAGE_EXT = /\.(png|jpe?g|webp|jfif)$/i;
const SKIP_NAMES = /^\._/;

function toInitial(slugPart) {
  const cleaned = slugPart
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (!cleaned) return '?';
  return cleaned.charAt(0).toUpperCase();
}

function walkFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_NAMES.test(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, files);
    else if (IMAGE_EXT.test(entry.name)) files.push(full);
  }
  return files;
}

function scoreImage(filePath, slug) {
  const base = path.basename(filePath).toLowerCase();
  const rel = filePath.toLowerCase();

  if (/^tableau[_\.]/.test(base) || base === 'tableau.png' || base === 'tableau.jpg' || base === 'tableau.jpeg') {
    return 100;
  }
  if (base.includes('renard') || base.includes('renarnica') || base.includes('guernica_renard')) {
    return 80;
  }
  if (slug && base.includes(slug.replace(/-/g, ''))) {
    return 70;
  }
  if (rel.includes('/image/') || rel.includes('/images/')) {
    return 10;
  }
  return 0;
}

function findFromHtml(siteDir) {
  const htmlPath = path.join(siteDir, 'index.html');
  if (!fs.existsSync(htmlPath)) return null;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const srcs = [
    ...html.matchAll(
      /<img[^>]*class=["'][^"']*image_principale[^"']*["'][^>]*src=["']([^"']+)["']/gi
    ),
    ...html.matchAll(
      /<img[^>]*src=["']([^"']+)["'][^>]*class=["'][^"']*image_principale[^"']*["']/gi
    ),
  ].map((m) => m[1].replace(/^\.\//, ''));

  const unique = [...new Set(srcs)];
  const candidates = unique
    .map((src) => path.join(siteDir, src))
    .filter((p) => fs.existsSync(p) && IMAGE_EXT.test(p));

  if (candidates.length >= 2) return candidates[1];
  if (candidates.length === 1) {
    const score = scoreImage(candidates[0], '');
    return score >= 70 ? candidates[0] : null;
  }
  return null;
}

function findStudentArtwork(siteDir, slug) {
  const files = walkFiles(siteDir);
  let best = null;
  let bestScore = 0;

  for (const file of files) {
    const score = scoreImage(file, slug);
    if (score > bestScore) {
      bestScore = score;
      best = file;
    }
  }

  if (bestScore >= 70) return best;

  const fromHtml = findFromHtml(siteDir);
  if (fromHtml) return fromHtml;

  return bestScore >= 80 ? best : null;
}

function cleanMeta(value) {
  return (value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/^["']|["']$/g, '')
    .replace(/\\"/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromImageBlock(block) {
  const h3 = block.match(/<h3[^>]*>([\s\S]*?)(?:<\/h3>|<h3>)/i);
  if (h3) return cleanMeta(h3[1]);

  const afterImg = block.split(/<img[^>]*class=["'][^"']*image_principale[^"']*["'][^>]*>/i)[1];
  if (!afterImg) return '';

  const divText = afterImg.match(/<div>\s*([\s\S]*?)\s*<\/div>/i);
  if (divText) {
    const raw = cleanMeta(divText[1]);
    const parts = raw.split(/\s*-\s*/).map((p) => p.trim()).filter(Boolean);
    return parts[0] || raw;
  }
  return '';
}

function storyFromImageBlock(block) {
  const desc = block.match(
    /<div\s+class\s*=\s*["']div_tableau_description["'][^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i
  );
  if (desc) return cleanMeta(desc[1]);
  return '';
}

function extractMetadata(html) {
  const imageBlocks = html.split(/<div\s+class\s*=\s*["']image["']/i).slice(1);

  let originalTitle = imageBlocks[0] ? titleFromImageBlock(imageBlocks[0]) : '';
  let modifiedTitle = imageBlocks[1] ? titleFromImageBlock(imageBlocks[1]) : '';
  let story = imageBlocks[1] ? storyFromImageBlock(imageBlocks[1]) : '';

  if (!originalTitle || !modifiedTitle) {
    const headingMatches = [
      ...html.matchAll(/<h3[^>]*>([\s\S]*?)(?:<\/h3>|<h3>)/gi),
      ...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi),
    ]
      .map((m) => cleanMeta(m[1]))
      .filter((t) => t && !t.toLowerCase().includes('titre du site'));

    if (!originalTitle) originalTitle = headingMatches[0] ?? '';
    if (!modifiedTitle) modifiedTitle = headingMatches[1] ?? headingMatches[0] ?? '';
  }

  if (!story && imageBlocks[0]) {
    story = storyFromImageBlock(imageBlocks[0]);
  }

  return {
    title: cleanMeta(modifiedTitle) || 'Œuvre renardisée',
    original: cleanMeta(originalTitle) || 'Tableau original',
    story: story || '',
  };
}

function sanitizeStudentHtml(html, initial) {
  let output = html.replace(
    /(<div[^>]*class=["'][^"']*nom_eleve[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>)([\s\S]*?)(<\/h1>)/i,
    `$1${initial}$3`
  );
  output = output.replace(/<h1>([^<]*)<\/h1>/gi, `<h1>${initial}</h1>`);
  output = output.replace(/<h1>([^<]*)<h1>/gi, `<h1>${initial}</h1>`);

  const namePatterns = [
    /\b(AHMED|Ahmed|ARIGE|Arige|CHARLIE|Charlie|CHLOE|Chloe|Chloé|ELIKYAH|Elikyah|ELSA|Elsa|GASPARD|Gaspard|ILHAM|Ilham|INES|Ines|Inès|JUDITH|Judith|LUCIANO|Luciano|MAELIE|Maëlie|Maelie|MALIA|Malia|MARCEAU|Marceau|MARIE|Marie|SACHA|Sacha|SARA|Sara|SIHEM|Sihem|SONIA|Sonia|TIMOTHEE|Timothée|Timothee|YASSIN|Yassin|ZOE|Zoé|Zoe|AYA|Aya)\b/g,
  ];
  for (const pattern of namePatterns) {
    output = output.replace(pattern, initial);
  }
  return output;
}

function sanitizeAllSites(siteEntries) {
  for (const { slug, siteDir } of siteEntries) {
    const htmlPath = path.join(siteDir, 'index.html');
    if (!fs.existsSync(htmlPath)) continue;
    const initial = toInitial(slug.split('-')[0]);
    const sanitized = sanitizeStudentHtml(fs.readFileSync(htmlPath, 'utf8'), initial);
    fs.writeFileSync(htmlPath, sanitized, 'utf8');
  }
}

/** Déplace les dossiers élèves à la racine de sites/ vers sites/secondes/ (une seule fois). */
function ensureLevelFolders() {
  const secondesDir = path.join(SITES_DIR, 'secondes');
  const troisiemeDir = path.join(SITES_DIR, '3e');
  fs.mkdirSync(secondesDir, { recursive: true });
  fs.mkdirSync(troisiemeDir, { recursive: true });

  const flatDirs = fs
    .readdirSync(SITES_DIR, { withFileTypes: true })
    .filter(
      (e) =>
        e.isDirectory() &&
        !SKIP_NAMES.test(e.name) &&
        !LEVELS.includes(e.name)
    )
    .map((e) => e.name);

  for (const name of flatDirs) {
    const dest = path.join(secondesDir, name);
    if (!fs.existsSync(dest)) {
      fs.renameSync(path.join(SITES_DIR, name), dest);
    }
  }
}

function listSiteEntries() {
  ensureLevelFolders();
  const entries = [];

  for (const level of LEVELS) {
    const levelDir = path.join(SITES_DIR, level);
    if (!fs.existsSync(levelDir)) continue;

    const slugs = fs
      .readdirSync(levelDir, { withFileTypes: true })
      .filter((e) => e.isDirectory() && !SKIP_NAMES.test(e.name))
      .map((e) => e.name);

    for (const slug of slugs) {
      entries.push({
        slug,
        level,
        siteDir: path.join(levelDir, slug),
      });
    }
  }

  return entries.sort((a, b) => {
    const levelOrder = LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level);
    if (levelOrder !== 0) return levelOrder;
    return a.slug.localeCompare(b.slug, 'fr');
  });
}

function createPlaceholderSvg() {
  const placeholderPath = path.join(TABLEAUX_DIR, 'tableau_placeholder.svg');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#ffedd5"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect x="70" y="70" width="1060" height="760" rx="32" fill="#ffffff" stroke="#fb923c" stroke-width="10"/>
  <text x="600" y="420" text-anchor="middle" font-size="56" font-family="Arial, sans-serif" fill="#c2410c">Tableau en attente</text>
  <text x="600" y="490" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#9a3412">Cliquez pour ouvrir le site de l'élève</text>
</svg>`;
  fs.writeFileSync(placeholderPath, svg, 'utf8');
  return 'tableau_placeholder.svg';
}

function tableauKey(entry) {
  return `${entry.level}/${entry.slug}`;
}

function rebuildTableaux(siteEntries) {
  fs.mkdirSync(TABLEAUX_DIR, { recursive: true });

  for (const file of fs.readdirSync(TABLEAUX_DIR)) {
    if (file === 'tableau_placeholder.svg') continue;
    if (/^tableau_/i.test(file)) {
      fs.unlinkSync(path.join(TABLEAUX_DIR, file));
    }
  }

  const placeholderFile = createPlaceholderSvg();
  const copiedByKey = {};

  for (const entry of siteEntries) {
    const artwork = findStudentArtwork(entry.siteDir, entry.slug);
    if (!artwork) continue;

    const ext = path.extname(artwork).toLowerCase() || '.png';
    const destName = `tableau_${entry.level}_${entry.slug}${ext}`;
    fs.copyFileSync(artwork, path.join(TABLEAUX_DIR, destName));
    copiedByKey[tableauKey(entry)] = destName;
  }

  return { copiedByKey, placeholderFile };
}

function buildManifest(siteEntries, copiedByKey, placeholderFile) {
  const artworks = siteEntries.map((entry, index) => {
    const key = tableauKey(entry);
    const file = copiedByKey[key] ?? placeholderFile;
    const isPlaceholder = file === placeholderFile;
    const htmlPath = path.join(entry.siteDir, 'index.html');
    const siteExists = fs.existsSync(htmlPath);
    const initial = toInitial(entry.slug.split('-')[0]);

    let title = isPlaceholder ? `Projet de ${initial}.` : `Œuvre de ${initial}.`;
    let original = isPlaceholder ? 'Tableau non fourni' : 'Tableau original';
    let story = '';

    if (siteExists) {
      const meta = extractMetadata(fs.readFileSync(htmlPath, 'utf8'));
      if (meta.title) title = meta.title;
      if (meta.original) original = meta.original;
      if (meta.story) story = meta.story;
    }

    return {
      id: `2025-${index + 1}`,
      src: `/projets/chasse-aux-renards/edition_2025_2026/tableaux/${encodeURIComponent(file)}`,
      file,
      slug: entry.slug,
      level: entry.level,
      artist: initial,
      title,
      original,
      story,
      isPlaceholder,
      siteUrl: siteExists
        ? `/projets/chasse-aux-renards/edition_2025_2026/sites/${entry.level}/${entry.slug}/index.html`
        : null,
    };
  });

  const manifestPath = path.join(DEST, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(artworks, null, 2), 'utf8');

  const secondes = artworks.filter((a) => a.level === 'secondes').length;
  const troisieme = artworks.filter((a) => a.level === '3e').length;
  const withImage = artworks.filter((a) => !a.isPlaceholder).length;
  const placeholders = artworks.filter((a) => a.isPlaceholder).length;
  console.log(
    `Manifest: ${artworks.length} œuvres (secondes: ${secondes}, 3e: ${troisieme}, ${withImage} tableaux, ${placeholders} placeholders)`
  );
}

function main() {
  if (!fs.existsSync(SITES_DIR)) {
    console.error(`Dossier introuvable: ${SITES_DIR}`);
    process.exit(1);
  }

  const siteEntries = listSiteEntries();
  sanitizeAllSites(siteEntries);
  const { copiedByKey, placeholderFile } = rebuildTableaux(siteEntries);
  buildManifest(siteEntries, copiedByKey, placeholderFile);
}

main();
