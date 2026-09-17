# SujetLab

Générateur de sujets DS & bac blanc pour NSI. Sélectionnez une banque de questions, configurez le sujet, prévisualisez et exportez en PDF.

## Démarrage

```bash
# Depuis tools/
npm install
npm run build:shared
npm run dev:sujetlab
```

## Banques de questions

Les banques YAML se trouvent dans `tools/banques/`. Format :

```yaml
id: ma-banque
label: Ma banque NSI
questions:
  - id: q1
    label: Tableaux
    content: |
      Écrire une fonction...
    difficulty: moyen
    bareme: 4
    correction: |
      def ma_fonction(): ...
    verificationCode: |
      assert ma_fonction() == ...
```

## Fonctionnalités

- Sélection de banque et de questions individuelles
- Import YAML personnalisé
- Mélange reproductible via graine (seed)
- Export PDF sujet (sans correction)
- Export PDF corrigé (correction + code de vérification)

## Build

```bash
npm run build -w sujetlab
```

Les fichiers statiques sont générés dans `dist/` (base relative `./` pour usage offline).
