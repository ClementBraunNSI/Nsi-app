# QCMForge

Banque de QCM SNT/NSI avec tirage aléatoire et export PDF.

## Démarrage

```bash
cd tools
npm install
npm run dev -w qcmforge
```

## Fonctionnalités

- CRUD questions (4 choix, notion, niveau)
- 5 questions d'exemple préchargées
- Import/export YAML (`js-yaml`)
- Tirage aléatoire avec mélange des choix
- PDF élève et corrigé
- Persistance localStorage
