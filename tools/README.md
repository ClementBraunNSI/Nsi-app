# NSI — Outils enseignants

Monorepo npm regroupant **six applications web indépendantes** pour les professeurs de NSI/SNT. Ces outils sont **distincts de La tanière du code** : chaque app a sa propre interface, tourne dans le navigateur (Windows / macOS / Linux / Chromebook), et ne nécessite pas de compte.

Licence **MIT**.

## Applications

| Application | Dossier | Lancer |
|-------------|---------|--------|
| **SujetLab** | `generateur-eval` | `npm run dev:sujetlab` |
| **CorrectPy** | `correcteur-python` | `npm run dev:correctpy` |
| **ConseilNote** | `conseil-classe` | `npm run dev:conseilnote` |
| **PlanNSI** | `planificateur` | `npm run dev:plannsi` |
| **QCMForge** | `banque-qcm` | `npm run dev:qcmforge` |
| **ProjetSuivi** | `suivi-projets` | `npm run dev:projetsuivi` |

Le package `@nsi-tools/shared` fournit uniquement des utilitaires (YAML, CSV, PDF, types) — **pas de UI commune**.

## Installation

```bash
cd tools
npm install
npm run extract
```

## Extraire le référentiel et les banques

```bash
npm run extract
```

1. `extract-notions.mjs` → `shared/referentiel-nsi.json`
2. `extract-banks.mjs` → `banques/{niveau}/*.yaml` (à partir des `<ExerciseSection>` de `content/`)

## Build & partage

```bash
npm run build:all          # compile shared + 6 apps
npm run pack:offline       # zip pour collègues (+ copie dans public/downloads/)
npm run prepare:pages      # assemble tools/gh-pages/ pour GitHub Pages
npm run deploy:prepare     # build + pages + zip
```

### Mode offline (collègues)

1. Décompresser `nsi-outils-enseignants.zip`
2. Servir une app : `npx serve generateur-eval/dist`
3. Ouvrir l’URL affichée (souvent http://localhost:3000)

### GitHub Pages

Le workflow [`.github/workflows/deploy-tools.yml`](../.github/workflows/deploy-tools.yml) déploie `tools/gh-pages/` (une URL par app : `/sujetlab/`, `/correctpy/`, …).

Activer **Settings → Pages → GitHub Actions** sur le dépôt.

## Structure

```
tools/
├── shared/              # utilitaires + scripts d'extraction
├── banques/             # banques YAML ouvertes
├── scripts/
│   ├── pack-offline.mjs
│   └── prepare-gh-pages.mjs
├── generateur-eval/     # SujetLab
├── correcteur-python/   # CorrectPy
├── conseil-classe/      # ConseilNote
├── planificateur/       # PlanNSI
├── banque-qcm/          # QCMForge
└── suivi-projets/       # ProjetSuivi
```

## Page liens (site)

Une page de téléchargement / instructions est disponible sur le site : `/outils-enseignants` (liens uniquement, pas d’intégration des apps).

## Licence

MIT — libre d’utilisation, de modification et de redistribution entre collègues.
