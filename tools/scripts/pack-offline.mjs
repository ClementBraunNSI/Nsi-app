#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(TOOLS_ROOT, 'dist-offline');
const ZIP_PATH = path.join(OUTPUT_DIR, 'nsi-outils-enseignants.zip');
const README_OFFLINE = path.join(OUTPUT_DIR, 'README-OFFLINE.md');

const APP_DIRS = [
  'generateur-eval',
  'correcteur-python',
  'conseil-classe',
  'planificateur',
  'banque-qcm',
  'suivi-projets',
];

const README_CONTENT = `# NSI — Outils enseignants (mode hors ligne)

Ce paquet regroupe les builds statiques des applications du monorepo \`tools/\`.

## Contenu

Chaque application est disponible dans son dossier \`dist/\` :

- **SujetLab** (\`generateur-eval/dist\`)
- **CorrectPy** (\`correcteur-python/dist\`)
- **ConseilNote** (\`conseil-classe/dist\`)
- **PlanNSI** (\`planificateur/dist\`)
- **QCMForge** (\`banque-qcm/dist\`)
- **ProjetSuivi** (\`suivi-projets/dist\`)

## Servir une application localement

Depuis le dossier décompressé, lancez par exemple :

\`\`\`bash
npx serve generateur-eval/dist
npx serve correcteur-python/dist
npx serve conseil-classe/dist
npx serve planificateur/dist
npx serve banque-qcm/dist
npx serve suivi-projets/dist
\`\`\`

Ouvrez ensuite l’URL affichée par \`serve\` (souvent http://localhost:3000).

## Prérequis

- Node.js 18+
- Connexion internet uniquement pour \`npx serve\` (ou installez \`serve\` globalement)

Licence MIT — indépendant de La tanière du code.
`;

function collectDistFolders() {
  const distFolders = [];

  for (const appDir of APP_DIRS) {
    const distPath = path.join(TOOLS_ROOT, appDir, 'dist');
    if (fs.existsSync(distPath) && fs.statSync(distPath).isDirectory()) {
      distFolders.push({ appDir, distPath });
    }
  }

  return distFolders;
}

function zipWithSystemCommand(distFolders) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(README_OFFLINE, README_CONTENT, 'utf8');

  const zipArgs = ['-r', ZIP_PATH, 'README-OFFLINE.md'];
  for (const { appDir } of distFolders) {
    zipArgs.push(`${appDir}/dist`);
  }

  const result = spawnSync('zip', zipArgs, { cwd: OUTPUT_DIR, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('La commande zip a échoué.');
  }
}

async function zipWithArchiver(distFolders) {
  const archiverModule = await import('archiver');
  const archiver = archiverModule.default;
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(README_OFFLINE, README_CONTENT, 'utf8');

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(ZIP_PATH);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.file(README_OFFLINE, { name: 'README-OFFLINE.md' });

    for (const { appDir, distPath } of distFolders) {
      archive.directory(distPath, `${appDir}/dist`);
    }

    archive.finalize();
  });
}

async function main() {
  const distFolders = collectDistFolders();

  if (distFolders.length === 0) {
    console.warn('Aucun dossier dist trouvé. Lancez d’abord npm run build:all.');
  }

  const zipAvailable = spawnSync('zip', ['-h'], { stdio: 'ignore' }).status === 0;

  if (zipAvailable) {
    const stagingDir = path.join(OUTPUT_DIR, 'staging');
    fs.rmSync(stagingDir, { recursive: true, force: true });
    fs.mkdirSync(stagingDir, { recursive: true });
    fs.writeFileSync(path.join(stagingDir, 'README-OFFLINE.md'), README_CONTENT, 'utf8');

    for (const { appDir, distPath } of distFolders) {
      const target = path.join(stagingDir, appDir, 'dist');
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.cpSync(distPath, target, { recursive: true });
    }

    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    const result = spawnSync(
      'zip',
      ['-r', ZIP_PATH, '.'],
      { cwd: stagingDir, stdio: 'inherit' },
    );
    fs.rmSync(stagingDir, { recursive: true, force: true });

    if (result.status !== 0) {
      throw new Error('La commande zip a échoué.');
    }
  } else {
    await zipWithArchiver(distFolders);
  }

  // Copie optionnelle pour téléchargement depuis le site Next.js
  const publicDownloads = path.resolve(TOOLS_ROOT, '../public/downloads');
  fs.mkdirSync(publicDownloads, { recursive: true });
  const publicZip = path.join(publicDownloads, 'nsi-outils-enseignants.zip');
  fs.copyFileSync(ZIP_PATH, publicZip);
  console.log(`Also copied to ${publicZip}`);

  console.log(`Created ${ZIP_PATH} (${distFolders.length} app dist folder(s) included).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
