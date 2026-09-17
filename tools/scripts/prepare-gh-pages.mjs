#!/usr/bin/env node
// Assemble tools/*/dist into tools/gh-pages/ for GitHub Pages.
// Each app keeps base './' so nested folders work.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOOLS_ROOT = path.resolve(__dirname, '..');
const OUT = path.join(TOOLS_ROOT, 'gh-pages');

const APPS = [
  { dir: 'generateur-eval', name: 'SujetLab', slug: 'sujetlab' },
  { dir: 'correcteur-python', name: 'CorrectPy', slug: 'correctpy' },
  { dir: 'conseil-classe', name: 'ConseilNote', slug: 'conseilnote' },
  { dir: 'planificateur', name: 'PlanNSI', slug: 'plannsi' },
  { dir: 'banque-qcm', name: 'QCMForge', slug: 'qcmforge' },
  { dir: 'suivi-projets', name: 'ProjetSuivi', slug: 'projetsuivi' },
];

const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Outils NSI — applications indépendantes</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; color: #1e293b; }
    h1 { font-size: 1.5rem; }
    ul { padding-left: 1.2rem; }
    a { color: #1d4ed8; }
    .note { color: #64748b; font-size: 0.9rem; margin-top: 2rem; }
  </style>
</head>
<body>
  <h1>Outils enseignants NSI/SNT</h1>
  <p>Chaque application est <strong>indépendante</strong> (identité visuelle et données locales séparées).</p>
  <ul>
    ${APPS.map((a) => `<li><a href="./${a.slug}/">${a.name}</a> — ${a.dir}</li>`).join('\n    ')}
  </ul>
  <p class="note">Licence MIT. Pas de compte, pas de cloud. Données traitées dans le navigateur.</p>
</body>
</html>
`;

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '', 'utf8');

let copied = 0;
for (const app of APPS) {
  const src = path.join(TOOLS_ROOT, app.dir, 'dist');
  if (!fs.existsSync(src)) {
    console.warn(`Skip ${app.slug}: missing ${src}`);
    continue;
  }
  const dest = path.join(OUT, app.slug);
  fs.cpSync(src, dest, { recursive: true });
  copied += 1;
  console.log(`Copied ${app.name} → gh-pages/${app.slug}/`);
}

console.log(`Prepared ${OUT} (${copied} apps).`);
