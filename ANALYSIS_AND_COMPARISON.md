# 📊 Audit Comparatif & Pistes d'Amélioration

## 1. Analyse Comparative

### 🆚 Le "Standard" (Ex: Fabricenativel.github.io, Glassus, Monnet)
Ces sites sont des références académiques. Ils utilisent souvent des générateurs de sites statiques (MkDocs avec le thème Material, Sphinx).

**Forces :**
*   **Densité de contenu :** Des années de cours, d'exercices et de TP.
*   **Rapidité extrême :** Pas de JavaScript lourd, juste du HTML/CSS. Chargement instantané.
*   **Structure hiérarchique :** Très claire (Chapitre > Cours > Exo).
*   **Sobriété :** Pas de distraction, focus pur sur le texte.

**Faiblesses :**
*   **Passivité :** L'élève lit, mais ne "fait" pas sur le site (copier-coller vers Thonny nécessaire).
*   **Design austère :** Peut rebuter les élèves en difficulté ou moins motivés.
*   **Navigation :** Parfois labyrinthique sans recherche globale performante.
*   **Accessibilité :** Souvent basique (pas de mode dyslexique natif).

---

### 🦊 Nsi-app (Votre site)
Une approche "Application Web Moderne" (Next.js/React).

**Forces (Vos atouts majeurs) :**
*   **Interactivité (Le "Killer Feature") :** Playgrounds Python, Visualiseurs d'algos (Tri, Dichotomie). L'élève apprend en manipulant.
*   **UX/UI Moderne :** Design engageant ("Fox"), mode sombre, transitions fluides. Ça ressemble aux apps qu'ils utilisent (Spotify, Discord).
*   **Accessibilité :** Police Luciole, réglages dyslexie/contraste intégrés. C'est un argument fort pour l'inspection.
*   **Gamification :** Badges, progression (Fox Loader), connexion élève.

**Faiblesses actuelles :**
*   **Complexité de navigation :** Moins linéaire qu'un MkDocs. On peut s'y perdre.
*   **Performance (Lighthouse) :** Plus lourd qu'un site statique (chargement des scripts React, Hydration).
*   **Contenu :** Moins exhaustif pour l'instant (mais ça se remplit).

---

## 2. Pistes d'Amélioration (La Roadmap)

Voici les fonctionnalités à implémenter pour dépasser le standard, classées par priorité.

### 🧭 Navigation & Recherche (Intégré)
*   ✅ **Command Palette (`Cmd+K`) :** Intégrée en production. Inspirée de Raycast, Vercel et Tailwind. Permet une navigation clavier instantanée.
*   ✅ **Fil d'Ariane (Breadcrumbs) :** Intégré en haut des cours pour situer l'élève.
*   ✅ **Glossaire Tooltips :** Survoler un terme technique (ex: `DNS`) affiche sa définition sans quitter la page (Inspiré de MDN).
*   **Table des Matières Flottante (TOC) intelligente :** Sur la droite des cours, qui se met à jour au scroll (Scrollspy) pour savoir exactement dans quelle sous-partie on se trouve (Standard Stripe/Vercel).

### 🧠 Pédagogie Active (Inspiré de Codecademy / CodinGame / ReadMe)
*   **Console de validation automatique (TDD) :** Au lieu d'avoir un simple éditeur Python, ajouter un bouton "Vérifier" qui lance des tests unitaires cachés sur le code de l'élève.
*   **API Playgrounds :** Pour le cours sur le Web/HTTP, intégrer un mini-Postman permettant de faire des vraies requêtes GET/POST et de voir le JSON de réponse en direct (Inspiré de ReadMe / Stripe).
*   **Exercices "Fill-in-the-blanks" interactifs :** Des inputs directement dans le texte du cours pour valider la lecture en temps réel (ex: `L'adresse IP 192.168.1.1 est de classe [ input ]`).
*   **Split-pane Layout (Vue scindée) :** Pour les gros TPs, avoir le texte du cours à gauche et l'éditeur Python bloqué à droite (scroll indépendant), pour éviter à l'élève de faire des allers-retours haut/bas.

### 🎮 Gamification & Rétention (Inspiré de Duolingo)
*   **Streaks (Séries) :** Compter le nombre de jours consécutifs où l'élève a lu un cours ou réussi un exercice.
*   **Tableau des scores de classe (Leaderboard) :** Pour les élèves connectés, basé sur les exercices résolus.

### 📚 Structure & Documentation (Inspiré de Stripe / Supabase / Vercel)
*   **Code Blocks Multilangages :** Permettre de switcher un bloc de code entre Python, Pseudo-code, et C (pour certains élèves) via des onglets intégrés directement au bloc de code (comme sur Stripe Docs).
*   **Bouton "Copy to Clipboard" :** Avec une micro-animation de confirmation sur tous les blocs de code.
*   **"Was this helpful?" :** Un widget de feedback en bas de chaque cours (Pouce en l'air / Pouce en bas) pour identifier les cours à réécrire.
*   **Mode "Focus" / "Zen" :** Un raccourci pour masquer toute l'interface (header, sidebar) et ne garder que le texte centré.

### ⚡ Outils Enseignant & Analytics
*   **Dashboard d'Analytique Classe :** Voir où les élèves bloquent (quel exercice a le plus faible taux de réussite).
*   **Génération de PDF propre :** Une CSS spécifique `@media print` optimisée (masquage des sidebars, QR codes automatiques pour les liens) pour imprimer les cours facilement.

### ⚡ Performance
*   **Lazy Loading :** Ne charger les composants lourds (Monaco Editor, Visualiseurs) que lorsqu'ils sont visibles.
*   **Image Optimization :** Vérifier que toutes les images sont en WebP/AVIF via Next/Image.

---

## 3. Stratégie de déploiement

Nous allons créer une "Zone Expérimentale" (`/lab/experimental`) pour tester ces composants sans casser le site.

**Composants à tester immédiatement :**
1.  `CommandPalette` (Navigation rapide)
2.  `SmartBreadcrumbs` (Navigation contextuelle)
3.  `FlashCardReview` (Révision active)
