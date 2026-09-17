# PlanNSI

Planificateur annuel NSI/SNT sur 12 périodes.

## Démarrage

```bash
cd tools
npm install
npm run dev -w plannsi
```

## Fonctionnalités

- Chargement du référentiel NSI (`tools/shared/referentiel-nsi.json`)
- Assignation chapitres → périodes (clic ou glisser-déposer)
- Alerte si plus de 3 chapitres par période
- Export/import JSON, export PDF
- Persistance localStorage
