import fs from 'fs';
import path from 'path';

const SOURCE = '/Volumes/Carte SD/S03';
const DEST = path.join(
  process.cwd(),
  'public/projets/chasse-aux-renards/edition_2025_2026'
);

const SITE_SLUG_ALIASES = {
  ines_b: 'ines-b',
  maelie: 'maelie',
};

function toInitial(name) {
  const cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (!cleaned) return '?';
  return cleaned.charAt(0).toUpperCase() || '?';
}

function folderToSlug(folderName) {
  const normalized = folderName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^projet_site_/i, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  const alias = SITE_SLUG_ALIASES[normalized] ?? normalized;
  return alias.replace(/_/g, '-');
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function findHtmlEntry(dir) {
  const preferred = ['index.html', 'projet_site_judith.html', 'projet.html'];
  for (const name of preferred) {
    const full = path.join(dir, name);
    if (fs.existsSync(full)) return full;
  }
  const html = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.html') && !f.includes('.html1'));
  return html.length ? path.join(dir, html[0]) : null;
}

function sanitizeStudentHtml(html, initial) {
  let output = html.replace(
    /(<div[^>]*class=["'][^"']*nom_eleve[^"']*["'][^>]*>[\s\S]*?<h1[^>]*>)([\s\S]*?)(<\/h1>)/i,
    `$1${initial}$3`
  );

  output = output.replace(/<h1>([^<]*)<h1>/gi, `<h1>${initial}</h1>`);

  const namePatterns = [
    /\b(AHMED|Ahmed)\b/g,
    /\b(Marceau|MARCEAU)\b/g,
    /\b(Judith|JUDITH)\b/g,
    /\b(Sara|SARA)\b/g,
    /\b(Zoé|Zoe|ZOÉ)\b/g,
    /\b(Ilham|ILHAM)\b/g,
    /\b(Ines|Inès|INÈS)\b/g,
    /\b(Aya|AYA)\b/g,
    /\b(Chloe|Chloé|CHLOÉ)\b/g,
    /\b(Maëlie|Maelie|MAELIE)\b/g,
    /\b(Malia|MALIA)\b/g,
    /\b(Marie|MARIE)\b/g,
    /\b(Sacha|SACHA)\b/g,
    /\b(Sihem|SIHEM)\b/g,
    /\b(Timothée|Timothee|TIMOTHEE)\b/g,
  ];

  for (const pattern of namePatterns) {
    output = output.replace(pattern, initial);
  }

  return output;
}

function walkImageFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkImageFiles(fullPath, files);
    else if (/\.(png|jpe?g|webp|jfif)$/i.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function scoreTableauImage(filePath, slug) {
  const base = path.basename(filePath).toLowerCase();
  if (/^tableau[_\.]/.test(base)) return 100;
  if (base.includes('renard') || base.includes('guernica_renard')) return 80;
  if (slug && base.includes(slug.replace(/-/g, ''))) return 70;
  return 0;
}

function findTableauFromHtml(siteDir) {
  const htmlPath = path.join(siteDir, 'index.html');
  if (!fs.existsSync(htmlPath)) return null;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const srcs = [
    ...html.matchAll(
      /<img[^>]*class=["'][^"']*image_principale[^"']*["'][^>]*src=["']([^"']+)["']/gi
    ),
  ].map((m) => m[1].replace(/^\.\//, ''));
  const candidates = [...new Set(srcs)]
    .map((src) => path.join(siteDir, src))
    .filter((p) => fs.existsSync(p));
  return candidates.length >= 2 ? candidates[1] : null;
}

function findTableauFile(siteDir, slug) {
  const files = walkImageFiles(siteDir);
  let best = null;
  let bestScore = 0;
  for (const file of files) {
    const score = scoreTableauImage(file, slug);
    if (score > bestScore) {
      bestScore = score;
      best = file;
    }
  }
  if (bestScore >= 70) return best;
  return findTableauFromHtml(siteDir) ?? (bestScore >= 80 ? best : null);
}

function extractMetadata(html) {
  const h3Matches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map((m) => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter((t) => t && !t.toLowerCase().includes('titre du site'));

  const originalTitle = h3Matches[0] ?? 'Tableau original';
  const modifiedTitle = h3Matches[1] ?? h3Matches[0] ?? 'Œuvre renardisée';

  const clean = (value) => value.replace(/^["']|["']$/g, '').replace(/\\"/g, '"').trim();

  return {
    title: clean(modifiedTitle),
    original: clean(originalTitle),
  };
}

function createPlaceholderSvg(destTableaux) {
  const placeholderPath = path.join(destTableaux, 'tableau_placeholder.svg');
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
  <text x="600" y="490" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#9a3412">Cliquez pour ouvrir le site de l&apos;élève</text>
</svg>`;
  fs.writeFileSync(placeholderPath, svg, 'utf8');
  return 'tableau_placeholder.svg';
}

function copyTableaux(siteEntries) {
  const destTableaux = path.join(DEST, 'tableaux');
  fs.mkdirSync(destTableaux, { recursive: true });
  const copiedBySlug = {};

  for (const site of siteEntries) {
    const sourceTableau = findTableauFile(site.srcDir, site.slug);
    if (!sourceTableau) continue;
    const ext = path.extname(sourceTableau).toLowerCase() || '.png';
    const destName = `tableau_${site.slug}${ext}`;
    fs.copyFileSync(sourceTableau, path.join(destTableaux, destName));
    copiedBySlug[site.slug] = destName;
  }

  const placeholderFile = createPlaceholderSvg(destTableaux);
  return { copiedBySlug, placeholderFile };
}

function copySites() {
  const destSites = path.join(DEST, 'sites');
  fs.mkdirSync(destSites, { recursive: true });
  const siteEntries = [];

  const folders = fs
    .readdirSync(SOURCE, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^projet_site_/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'fr'));

  for (const folder of folders) {
    const slug = folderToSlug(folder);
    const srcDir = path.join(SOURCE, folder);
    const destDir = path.join(destSites, slug);
    if (fs.existsSync(destDir)) continue;
    copyDir(srcDir, destDir);

    const htmlPath = findHtmlEntry(destDir);
    if (htmlPath) {
      const initial = toInitial(slug.split('-')[0]);
      const rawHtml = fs.readFileSync(htmlPath, 'utf8');
      const sanitized = sanitizeStudentHtml(rawHtml, initial);
      fs.writeFileSync(path.join(destDir, 'index.html'), sanitized, 'utf8');

      if (path.basename(htmlPath) !== 'index.html' && htmlPath !== path.join(destDir, 'index.html')) {
        fs.unlinkSync(htmlPath);
      }
    }

    siteEntries.push({ slug, srcDir });
  }

  return siteEntries;
}

function buildManifest(siteEntries, copiedBySlug, placeholderFile) {
  const artworks = siteEntries.map((site, index) => {
    const file = copiedBySlug[site.slug] ?? placeholderFile;
    const siteSlug = site.slug;
    const siteDir = path.join(DEST, 'sites', siteSlug);
    const siteExists = siteDir && fs.existsSync(path.join(siteDir, 'index.html'));
    const initial = toInitial(siteSlug.split('-')[0]);

    let title = copiedBySlug[site.slug]
      ? `Œuvre de ${initial}.`
      : `Projet de ${initial}.`;
    let original = copiedBySlug[site.slug]
      ? 'Tableau original'
      : 'Tableau non fourni';
    if (siteExists) {
      const html = fs.readFileSync(path.join(siteDir, 'index.html'), 'utf8');
      const meta = extractMetadata(html);
      title = meta.title;
      original = meta.original;
    }

    return {
      id: `2025-${index + 1}`,
      src: `/projets/chasse-aux-renards/edition_2025_2026/tableaux/${encodeURIComponent(file)}`,
      file,
      slug: siteSlug,
      artist: initial,
      title,
      original,
      siteUrl: siteExists
        ? `/projets/chasse-aux-renards/edition_2025_2026/sites/${siteSlug}/index.html`
        : null,
    };
  });

  const manifestPath = path.join(DEST, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(artworks, null, 2), 'utf8');
  console.log(`Wrote ${artworks.length} artworks to ${manifestPath}`);
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source not found: ${SOURCE}`);
    process.exit(1);
  }

  fs.rmSync(DEST, { recursive: true, force: true });
  fs.mkdirSync(DEST, { recursive: true });

  const siteEntries = copySites();
  const { copiedBySlug, placeholderFile } = copyTableaux(siteEntries);
  buildManifest(siteEntries, copiedBySlug, placeholderFile);
}

main();
