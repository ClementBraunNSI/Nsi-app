# TODO.md - Audit UX/UI et organisation des cours (Nsi-app)

## Perimetre et objectif
- On compare **principalement** l'organisation "cours -> niveaux -> chapitres -> exercices" et l'UX/UI (navigation, feedback, lisibilite, discoverability).
- On exclude explicitement (sauf si impact UX evident): SEO/performance/CBV, securite technique "hardening", etc.

## References web (10 sites)
1. https://fabricenativel.github.io/
2. https://nsi-learning.fr/
3. https://www.nsi-lycee.fr/
4. http://nsi-snt.fr/cours_nsi
5. https://ntoulzac.github.io/Cours-NSI-Terminale/
6. https://cgouygou.github.io/1NSI/
7. https://spy.forge.apps.education.fr/snt-nsi/
8. https://snt.ababsurdo.fr/prof/
9. https://www.python-lycee.com/activite-en-ligne-snt
10. https://www.lesbonsprofs.com/nos-cours/seconde/snt/

## Ressources supplementaires a benchmarker (profs NSI/SNT)

1. Profjahier NSI
   - URL: https://profjahier.github.io/html/NSI/index.html
   - Forces: structuration orientee progression, ressources "terrain" reutilisables.
   - Idees a reprendre: organisation de pages par notion + acces rapide exercices.
   - Niveaux cibles: 1NSI / TNSI.

2. Glassus - Premiere NSI (source GitHub)
   - URL: https://github.com/glassus/premiere_nsi
   - Forces: corpus pedagogique robuste, historique et structure de contenu mature.
   - Idees a reprendre: conventions de chapitrage et organisation des ressources.
   - Niveaux cibles: 1NSI.

3. Glassus - Terminale NSI (source GitHub)
   - URL: https://github.com/glassus/terminale_nsi
   - Forces: couverture large du programme, nombreux supports/iterations.
   - Idees a reprendre: granularite des sequences et articulation cours/exercices.
   - Niveaux cibles: TNSI.

4. Pixees - Informatique au lycee
   - URL: https://pixees.fr/informatique-au-lycee-ressources-en-partage/
   - Forces: hub de ressources et pratiques enseignant, forte curations.
   - Idees a reprendre: section "ressources recommandees" par theme/niveau.
   - Niveaux cibles: SNT / 1NSI / TNSI.

5. Pixees - InformatiqueLycée Terminale
   - URL: https://pixees.fr/informatiquelycee/term/
   - Forces: alignement epreuves NSI, orientation revision/examen.
   - Idees a reprendre: parcours "revision bac" explicite dans le site.
   - Niveaux cibles: TNSI.

6. Lycée GSH - NSI
   - URL: https://www.lgsh.fr/nsi/nsi/index.php
   - Forces: exemple de site "prof" simple et navigable par chapitres.
   - Idees a reprendre: acces direct a un sommaire par periode/chapitre.
   - Niveaux cibles: NSI lycee.

7. Tutoriel France-IOI pour NSI
   - URL: http://nsi.janviercommelemois.fr/tuto-france-ioi.html
   - Forces: integration pratique d'une plateforme d'exercices auto-corriges.
   - Idees a reprendre: pont "cours -> entrainement exterieur" avec suivi.
   - Niveaux cibles: SNT / NSI.

8. CAPYTALE - Documentation des activites
   - URL: https://capytale.forge.apps.education.fr/documentation/Activites/
   - Forces: grand catalogue d'activites (Python, SQL, Web, notebooks, etc.).
   - Idees a reprendre: nomenclature des activites et typologies pedagogiques.
   - Niveaux cibles: SNT / NSI / SIO.

9. NSI/SNT Normandie - Usages Capytale
   - URL: https://nsi-snt.ac-normandie.fr/creer-et-partager-des-activites-avec-capytale
   - Forces: exemples concrets d'usage en classe, workflow enseignant-eleve.
   - Idees a reprendre: chaine de production d'activites + partage par code.
   - Niveaux cibles: SNT / NSI.

10. Academie de Lille - France-IOI en NSI
   - URL: https://pedagogie.ac-lille.fr/numerique-et-sciences-informatiques/france-ioi/
   - Forces: cadrage institutionnel et mise en pratique en classe.
   - Idees a reprendre: guide "demarrage rapide" pour profs et eleves.
   - Niveaux cibles: NSI lycee.

## Ce que ton site fait deja bien (signaux forts)
- Navigation de parcours: landing + "niveau" + "fiche cours" (routes sous `app/`).
- Experience de lecture avec progression: `components/ReadingProgressBar.tsx`.
- Organisation pedagogique: onglets et categorie des exercices via `components/ExerciseTabs.tsx`.
- Navigation "prev/next" coherente au niveau "cours" via `components/CourseNavigation.tsx` et `lib/course-utils.ts`.
- Ajout d'UX d'accessibilite: `app/layout.tsx` (mode sombre/contraste/dyslexie) - tres rare chez des sites "cours".
- UI d'execution interactive (Lab): `app/lab/page.tsx` (Python/SQL/feedback) - pattern tres utile, similaire a des IDE/ateliers d'autres sites.

## Principales frictions (ce qui te met "moins bien" vs les references)
- Discoverability incomplet: `components/experimental/CommandPalette.tsx` utilise des donnees mock, donc la palette n'est pas un "vrai" outil de navigation.
- Risque d'ordre pedagogique: `lib/course-utils.ts` depend d'un champ `order` ou d'un prefix de nom de fichier numerique. Si tes fiches ne respectent pas strictement la convention, "next/prev" peut etre incoherent.
- Parcours "cours/niveau" pas uniforme sur les listes vs la fiche: logique d'acces prives du cote `app/niveaux/[id]/page.tsx` et du cote `app/cours/[niveaux]/[...slug]/page.tsx` ne suit pas exactement le meme modele de frontmatter (ex: `access` vs `allowedStudents`).
- Progression de lecture: `ReadingProgressBar.tsx` peut ne pas reset correctement sur changement de route (pour un utilisateur, ca peut ressembler a un "bug de parcours").
- Decoupage contenu (granularite): les listes `app/page.tsx` et `app/cours/[niveaux]/page.tsx` enumerent seulement les fichiers directs sous `content/<niveau>` (pas les sous-dossiers). Si tu as des cours organises en sous-repertoires, ils peuvent ne pas apparaitre dans les listes.

## Backlog priorise (P0 / P1 / P2)

### P0 - Corrections "UX de base" (impact immediate, faible risque)

1. Rendre la Command Palette reelle (pas mock)
   - Cible: `components/experimental/CommandPalette.tsx` (tableau `commands` mock)
   - Pourquoi les autres sont mieux: leurs palettes/recherches/menus pointent vers de "vrais" contenus et actions contextualisees (cours, prochain chapitre, exercices).
   - Action:
     - Construire un index a partir de `content/<niveau>/*.md|*.mdx` (et eventuellement exercices si deja indexes).
     - Ajouter des commandes contextualisees:
       - "Prochain cours"
       - "Sommaire niveau"
       - "Lab: aller a ..." (si disponible)
       - "Tableau de bord (si connecte)"
   - Critere d'acceptation UX:
     - Ctrl/Cmd+K ouvre une liste pertinente pour un utilisateur qui visite un cours (pas generique).
     - ESC ferme.
     - Enter declenche l'action correcte (navigation sans erreurs).
   - Effort / risque: Moyen / Faible.

2. Garantir le reset et la coherence de `ReadingProgressBar`
   - Cible: `components/ReadingProgressBar.tsx` et injection/usage cote `app/cours/[niveaux]/[...slug]/page.tsx`.
   - Action:
     - Detecter le changement de route (ou evenement de navigation) et reset `progress` a 0.
     - Eviter les "docHeight incoherent" en re-calculeant proprement sur mount de la page (et pas une seule fois globalement).
   - Critere d'acceptation UX:
     - Sur le changement de cours, la barre repart a ~0% sans attendre un scroll.
   - Effort / risque: Faible / Faible.

3. Stabiliser l'ordre pedagogique (next/prev) et la convention de nommage
   - Cible: `lib/course-utils.ts` (tri par `order` ou prefix numerique)
   - Action:
     - Introduire une regle stricte: soit `order` obligatoire pour chaque fiche, soit un prefix numerique obligatoire (ex: `01_...`, `02_...`), et documenter la regle.
     - Ajouter une validation (a minima en commentaire/guide auteur): "si pas d'ordre -> ordre par defaut 999 (donc tri par titre)".
     - Option: rendre `order` recupere aussi depuis frontmatter "chapter order" si present (a clarifier).
   - Critere d'acceptation UX:
     - Sur 2 niveaux differents: "Chapitre precedent/suivant" correspond a la progression attendue.
   - Effort / risque: Moyen / Moyen.

4. Unifier la logique d'acces prive (liste vs fiche)
   - Cibles:
     - `app/niveaux/[id]/page.tsx` (filtre via `cours.access !== 'private'` + `allowedStudents`)
     - `app/cours/[niveaux]/[...slug]/page.tsx` (controle via `data.allowedStudents` et session)
   - Pourquoi c'est critique en UX: l'utilisateur voit parfois des contenus incoherents entre la liste et la fiche, ou tombe sur un "Acces restreint" alors que la liste laissait croire le contraire.
   - Action:
     - Definir un contrat unique de frontmatter (ex: `access: private` + `allowedStudents: [...]`).
     - Utiliser une seule fonction d'autorisation (helper) pour:
       - filtrage liste (sommaire)
       - controle fiche (render)
   - Critere d'acceptation UX:
     - Un utilisateur non autorise ne voit pas le cours dans les listes.
     - Un utilisateur autorise peut ouvrir la fiche sans message de debug.
   - Effort / risque: Moyen / Moyen.

5. Indexation des contenus: supporter les sous-dossiers si necessaire
   - Cibles:
     - `app/page.tsx` (lister niveaux et fichiers directs dans `content`)
     - `app/cours/[niveaux]/page.tsx` (lister fichiers directs dans `content/<niveau>`)
   - Pourquoi les autres sont mieux: beaucoup de sites structurent "themes/chapitres" et affichent une navigation qui reflete cette hierarchie (sans "trous").
   - Action:
     - Si tes cours utilisent des sous-dossiers (ex: `content/<niveau>/<chapitre>/*.md`), passer d'un `readdirSync` non-recursif a une enumeration recusive avec un mapping slug coherent.
   - Critere d'acceptation UX:
     - Tous les cours expected apparaissent dans "Tous les cours" et "Niveau X" (pas de "contenu disparu").
   - Effort / risque: Moyen / Moyen.

### P1 - Confort & clarity (ameliorations structurantes)

6. Harmoniser les labels UI et le modele mental (chapitre vs fiche)
   - Cibles: `app/page.tsx`, `app/cours/page.tsx`, `CourseNavigation.tsx`, `Breadcrumbs.tsx`
   - Action:
     - Standardiser:
       - `chapter` affiche comme "Chapitre" partout (ou "Theme" si c'est le mot pedago)
       - renommer microcopy si "fiche" vs "cours" n'est pas claire
   - Critere d'acceptation UX:
     - Sur 3 parcours utilisateur: aucune ambiguite sur "ce que representent les cartes".
   - Effort / risque: Faible / Faible.

7. Simplifier l'experience exercices: etats et progression percue
   - Cible: `components/ExerciseTabs.tsx`
   - Observations (a valider manuellement):
     - Categories derivees du prefix dans `label` (Introduction/Facile/Intermediaire/Autres). Si tes labels ne suivent pas la convention, le groupement sera incoherent.
   - Action:
     - Documenter une convention de label pour les tabs.
     - Ajouter un indicateur clair "fait/pas fait" (si pas deja) de maniere lisible sans modal.
   - Critere d'acceptation UX:
     - Un eleve sait immediatement quelles fiches il a deja terminees (sans ouvrir toutes les tabs).
   - Effort / risque: Moyen / Moyen.

8. Renforcer "reprendre plus tard": CTA de continuation dans le dashboard
   - Cibles: `app/student/dashboard/page.tsx`, `app/student/courses/page.tsx`
   - Action:
     - Ajouter un CTA "Continuer" qui pointe vers:
       - le prochain cours non termine, ou
       - la prochaine section/fichier non complete dans un cours deja ouvert (si possible).
   - Critere d'acceptation UX:
     - Le dashboard reduit le temps pour recommencer a <= 1 click.
   - Effort / risque: Moyen / Moyen.

### P2 - Raffinement UI/UX (qualite percue + polish)

9. Clarifier la navigation lecture -> exercices -> suite
   - Cibles: `app/cours/[niveaux]/[...slug]/page.tsx`, `CourseNavigation.tsx`
   - Action:
     - Ajouter une petite "ancre" visible (ex: "Aller aux exercices") si le layout le permet.
   - Critere d'acceptation UX:
     - Un utilisateur qui arrive sur une fiche peut debuter les exercices rapidement (sans scroll excessif).
   - Effort / risque: Faible / Faible.

10. Revoir `MobileBlocker` en mode "UX acceptable" (optional)
   - Cible: `components/MobileBlocker.tsx`
   - Pourquoi c'est delicat: certains sites n'ont pas ce pattern. Si ton public l'accepte, ok; sinon c'est une grosse friction.
   - Action:
     - Ajouter un message tres court + option "comprendre pourquoi" (non intrusif).
     - Rendre l'activation configurable (au moins via env) si possible.
   - Critere d'acceptation UX:
     - Les eleves comprennent immediatement et ne restent pas bloques sans savoir quoi faire.
   - Effort / risque: Faible / Moyen (selon contrainte).

11. Accessibilite: focus et navigation clavier sur elements interactifs
   - Cibles:
     - `components/experimental/CommandPalette.tsx`
     - `ExerciseTabs.tsx` (onglets)
   - Action:
     - Assurer "focus visible" et navigation clavier (au moins tab/enter) sans qu'on doive cliquer.
   - Critere d'acceptation UX:
     - Un utilisateur clavier-only peut ouvrir un cours/exercice et naviguer prev/next.
   - Effort / risque: Moyen / Moyen.

## Checklist auteur (pour preserver l'IA et la coherence)
Objectif: que chaque nouvelle fiche s'integre sans "trous" dans les listes, le next/prev, et l'access controle.

1. Champs frontmatter recommandes (au minimum)
   - `title`: titre affiche
   - `description`: microcopy sous la carte
   - `chapter`: label du chapitre/theme
   - `icon`: emoji/icone
   - `order`: entier (obligatoire si tu veux prev/next coherents)

2. Champs pour les cours prives (si applicable)
   - `access`: `private` (ou autre valeur definie dans le code)
   - `allowedStudents`: liste de noms (format identique au profil `full_name`)

3. Convention noms de fichiers (option de secours)
   - Prefix numerique obligatoire si `order` n'est pas present.
   - Exemple: `01_...md`, `02_...md`.

4. Convention des tabs exercises
   - `label` des onglets avec un prefix qui permet le groupement:
     - "Introduction - ..."
     - "Facile - ..."
     - "Intermediaire - ..."
     - "Autres - ..." (ou libelle qui retombe dans la categorie Autres)

## Notes d'acceptation (comment on validera rapidement)
- Parcours "visiteur":
  - Accueil -> Niveau -> Liste cours -> Fiche -> Exercices -> Next
- Parcours "eleve connecte":
  - Dashboard -> Continuer -> Fiche -> Complion + evidence etat
- Parcours "privé":
  - Non autorise: pas dans liste + message coherent
  - Autorise: acces sans surprise

