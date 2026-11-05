/**
 * Copie l'éditeur Monaco, Pyodide et les images de Blockly dans public/vendor, pour que le site les serve lui-même :
 * aucun CDN ne reçoit l'adresse IP des élèves. Lancé avant `npm run dev` et `npm run build`.
 * Les chemins sont repris dans lib/vendor-assets.ts. Le dossier public/vendor n'est pas suivi par git.
 *
 * Paquets Python : ceux que demandent les cours (attribut packages="…" de content/) et leurs dépendances.
 * Le paquet npm de Pyodide n'en contient aucun : ils sont téléchargés une fois depuis la distribution officielle,
 * vérifiés par l'empreinte sha256 du lock, et gardés dans node_modules/.cache/pyodide-packages.
 * Les roues de lib/pyodide-wheels (folium, geopy…) sont ajoutées au lock : le navigateur n'a plus besoin de PyPI.
 * Un paquet du lock que personne ne demande garde son adresse sur le CDN.
 *
 * Usage: node scripts/copy-vendor-assets.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { EXTRA, WHEELS_DIR } = require('../lib/pyodide-extra-packages.cjs');

const ROOT = process.cwd();
const VENDOR = path.join(ROOT, 'public', 'vendor');
const PYODIDE_SRC = path.join(ROOT, 'node_modules', 'pyodide');
const PYODIDE_OUT = path.join(VENDOR, 'pyodide');
const CACHE = path.join(ROOT, 'node_modules', '.cache', 'pyodide-packages');

// Seuls les fichiers que le navigateur télécharge : pas les types, les cartes de source ni la console d'exemple.
const PYODIDE_FILES = ['pyodide.js', 'pyodide.mjs', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip'];
// Paquets chargés par un composant sans passer par l'attribut packages="…" (CarteGpsPlayground).
const ALWAYS = ['folium', 'pandas'];

const normalize = (name) => (name === 'PIL' ? 'pillow' : name.toLowerCase().replace(/[-_.]+/g, '-'));
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function requestedPackages() {
  const found = new Set(ALWAYS);
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        for (const match of fs.readFileSync(full, 'utf8').matchAll(/\bpackages="([^"]*)"/g)) {
          match[1].split(',').map((pkg) => pkg.trim()).filter(Boolean).forEach((pkg) => found.add(pkg));
        }
      }
    }
  };
  walk(path.join(ROOT, 'content'));
  return [...found];
}

/** Ajoute au lock les roues de lib/pyodide-wheels, avec leurs dépendances. */
function addLocalWheels(lock) {
  const local = new Map();
  for (const file of fs.readdirSync(WHEELS_DIR).filter((entry) => entry.endsWith('.whl'))) {
    const [name, version] = file.split('-');
    local.set(normalize(name), { file, version });
  }
  for (const [module, { wheels, lock: fromLock }] of Object.entries(EXTRA)) {
    wheels.forEach((wheel, index) => {
      const { file, version } = local.get(normalize(wheel));
      const key = normalize(wheel);
      const earlier = wheels.slice(0, index).map(normalize);
      const previous = lock.packages[key];
      lock.packages[key] = {
        name: wheel,
        version,
        file_name: file,
        install_dir: 'site',
        package_type: 'package',
        sha256: sha256(fs.readFileSync(path.join(WHEELS_DIR, file))),
        imports: [wheel],
        depends: [...new Set([...(previous?.depends ?? []), ...earlier, ...(wheel === module ? fromLock : [])])],
      };
    });
  }
  return local;
}

function dependencyClosure(lock, names) {
  const seen = new Set();
  const visit = (name) => {
    const key = normalize(name);
    if (seen.has(key)) return;
    const entry = lock.packages[key];
    if (!entry) throw new Error(`Paquet absent du lock Pyodide : ${name}`);
    seen.add(key);
    entry.depends.forEach(visit);
  };
  names.forEach(visit);
  return seen;
}

async function cachedPackage(cdn, entry) {
  const cached = path.join(CACHE, entry.file_name);
  if (fs.existsSync(cached) && sha256(fs.readFileSync(cached)) === entry.sha256) return cached;
  const response = await fetch(cdn + entry.file_name);
  if (!response.ok) throw new Error(`${entry.file_name} : téléchargement refusé (${response.status})`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (sha256(bytes) !== entry.sha256) throw new Error(`${entry.file_name} : empreinte sha256 différente du lock`);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(cached, bytes);
  return cached;
}

fs.rmSync(VENDOR, { recursive: true, force: true });

const monacoVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'node_modules', 'monaco-editor', 'package.json'), 'utf8')).version;
fs.cpSync(path.join(ROOT, 'node_modules', 'monaco-editor', 'min', 'vs'), path.join(VENDOR, 'monaco', 'vs'), { recursive: true });

fs.cpSync(path.join(ROOT, 'node_modules', 'blockly', 'media'), path.join(VENDOR, 'blockly', 'media'), { recursive: true });

fs.mkdirSync(PYODIDE_OUT, { recursive: true });
for (const file of PYODIDE_FILES) fs.copyFileSync(path.join(PYODIDE_SRC, file), path.join(PYODIDE_OUT, file));

const lock = JSON.parse(fs.readFileSync(path.join(PYODIDE_SRC, 'pyodide-lock.json'), 'utf8'));
const cdn = `https://cdn.jsdelivr.net/pyodide/v${lock.info.version}/full/`;
const local = addLocalWheels(lock);
const hosted = dependencyClosure(lock, requestedPackages());

for (const [key, entry] of Object.entries(lock.packages)) {
  if (!hosted.has(key)) {
    entry.file_name = cdn + entry.file_name;
  } else if (local.has(key)) {
    fs.copyFileSync(path.join(WHEELS_DIR, entry.file_name), path.join(PYODIDE_OUT, entry.file_name));
  } else {
    fs.copyFileSync(await cachedPackage(cdn, entry), path.join(PYODIDE_OUT, entry.file_name));
  }
}
fs.writeFileSync(path.join(PYODIDE_OUT, 'pyodide-lock.json'), JSON.stringify(lock));

console.log(`public/vendor : Monaco ${monacoVersion}, Pyodide ${lock.info.version} avec ${hosted.size} paquets (${[...hosted].sort().join(', ')})`);
