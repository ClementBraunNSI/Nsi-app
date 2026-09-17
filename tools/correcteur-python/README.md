# CorrectPy

Correction Python en masse dans le navigateur (Pyodide) ou en ligne de commande.

## Démarrage web

```bash
# Depuis tools/
npm install
npm run build:shared
npm run dev:correctpy
```

## Utilisation

1. **Mode fichiers multiples** — importez plusieurs copies `.py`
2. **Mode collage** — collez un seul script pour une correction rapide
3. Saisissez les tests (assertions Python) communs à toutes les copies
4. Lancez la correction : chaque fichier est exécuté dans un namespace isolé
5. Exportez le rapport CSV

Pyodide est chargé depuis le CDN jsDelivr (`v0.27.6`).

## CLI batch

```bash
python cli/correcteur.py --copies ./copies --tests tests.py --out rapport.csv
```

Arguments :

| Option | Description |
|--------|-------------|
| `--copies DIR` | Répertoire contenant les fichiers `.py` élèves |
| `--tests FILE` | Fichier Python avec les assertions |
| `--out FILE` | Fichier CSV de sortie (défaut : `rapport.csv`) |

## Build

```bash
npm run build -w correctpy
```
