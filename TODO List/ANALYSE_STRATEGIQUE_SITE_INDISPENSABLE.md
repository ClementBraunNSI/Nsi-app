# 🚀 Analyse Stratégique : Rendre le Site NSI "Indispensable"

Pour passer d'un "bon site de cours" à une **ressource indispensable** (le "réflexe" quotidien des élèves et la référence secrète des collègues), nous devons transformer la plateforme.

L'objectif n'est plus seulement de **transmettre** (Lecture), mais de **faire pratiquer** (Laboratoire) et d'**entraîner** (Coaching).

Voici l'analyse des manques critiques et la feuille de route pour atteindre ce statut.

---

## 1. 🧪 La Dimension "Laboratoire" (Interactivité Manquante)

Les élèves comprennent mieux en manipulant. Le site doit proposer des outils qu'un manuel papier ou un PDF ne peut pas offrir.

### A. Pour la Terminale (Le plus gros manque actuel)
Le programme de Terminale est abstrait (Graphes, Récursivité, Processus). Il manque des "jouets" pour ces concepts :

*   [ ] **Visualiseur d'Algorithmes de Graphes (Critique)**
    *   *Besoin :* Un outil où l'élève dessine des nœuds/arêtes (ou charge des presets).
    *   *Fonction :* Lancer BFS, DFS, Dijkstra et voir l'algorithme "colorier" le graphe étape par étape.
    *   *Pourquoi indispensable ?* C'est la bête noire du Bac. Un outil visuel est une "tuerie" pédagogique.
*   [ ] **Arbre de Récursivité Interactif**
    *   *Besoin :* Visualiser la pile d'appels (Stack) pour `factorielle`, `fibonacci` ou `tri_fusion`.
    *   *Fonction :* Voir les appels s'empiler et les retours se dépiler.
    *   *Pourquoi indispensable ?* Pour démystifier le "Stack Overflow" et comprendre l'ordre d'exécution.
*   [ ] **Ordonnanceur de Processus (OS)**
    *   *Besoin :* Simuler l'allocation CPU (Round-Robin, FIFO).
    *   *Fonction :* Un diagramme de Gantt qui se remplit en temps réel avec des processus de différentes couleurs.

### B. Pour la Première & SNT
*   [ ] **Mini-IDE Python dans le navigateur** (via Pyodide ou simple simulation)
    *   *Besoin :* Exécuter les bouts de code directement dans la page sans ouvrir Thonny.
    *   *Pourquoi indispensable ?* Réduit la friction. "Je lis, je teste, je comprends".

---

## 2. 🏆 La Dimension "Coach" (Préparation Bac & Examens)

Le site doit préparer à l'épreuve. Actuellement, c'est un dépôt de connaissances. Il doit devenir un entraîneur.

*   [ ] **Mode "Annales Interactives"**
    *   *Concept :* Au lieu de simples PDF de sujets, proposer des sujets découpés par exercice.
    *   *Innovation :* Des "Indices progressifs" (Coup de pouce 1, Coup de pouce 2) avant la correction.
    *   *Indispensable :* Permet de réviser sans bloquer et sans tricher immédiatement.
*   [ ] **Flashcards de Révision (Style Anki)**
    *   *Concept :* Cartes retournables pour le "Par Cœur" (Complexités algo, Acronymes réseau, Commandes Linux).
    *   *Technique :* Stockage local de la progression (Connu / À revoir).
*   [ ] **Le "Chasseur de Bugs"**
    *   *Activité :* Présenter du code *qui ne marche pas* (erreur classique d'indentation, confusion `=` vs `==`, effet de bord).
    *   *But :* L'élève doit cliquer sur l'erreur ou la corriger. C'est une compétence évaluée au Bac mais jamais exercée.

---

## 3. 💎 La Dimension "Produit" (UX & Rétention)

Pour être indispensable, le site doit être agréable et "intelligent".

*   [ ] **Barre de Recherche Globale (Cmd+K)**
    *   *Manque actuel :* Si un élève cherche "Dijkstra", il doit deviner dans quel chapitre c'est.
    *   *Solution :* Une recherche instantanée (Algolia ou locale) qui indexe tout le contenu.
*   [ ] **Suivi de Progression (Gamification légère)**
    *   *Manque :* L'élève ne sait plus ce qu'il a lu ou fait.
    *   *Solution :* Checkbox automatique "Lu" en bas de page + Barre de progression globale par chapitre. "Tu as complété 80% du thème Algorithmique".
*   [ ] **Mode "Focus / Zen"**
    *   *Idée :* Masquer la sidebar et le header pour ne laisser que le texte (déjà un peu fait avec le layout, mais à pousser).

---

## 4. 🚨 Audit Rapide du Contenu Terminale (Priorités)

L'analyse des fichiers existants montre des structures correctes mais parfois un contenu théorique sans "chair".

*   **Bases de données :** Le composant `SqlEditor` existe-t-il vraiment et est-il utilisé dans `sql-bases-donnees-exercices.md` ? Si non, c'est une priorité absolue. SQL s'apprend en pratiquant.
*   **Sécurité :** Manque d'attaques concrètes (Simulation Man-in-the-Middle ou Injection SQL visuelle).
*   **Architecture SoC :** Souvent très abstrait. Besoin d'un schéma interactif d'un microcontrôleur.

---

## 🗓️ Plan d'Action Recommandé (Ordre de priorité)

1.  **UX Quick Win :** Ajouter la **Barre de Recherche** (Indispensable pour la navigabilité).
2.  **Pédagogie Terminale :** Créer le **Visualiseur de Graphes** (Dijkstra/Parcours). C'est la "killer feature" pour les Terminales.
3.  **Entraînement :** Créer une section **"Flashcards"** transversale (accessible depuis le menu).
4.  **Contenu :** Vérifier et activer l'éditeur SQL interactif dans tous les cours de BDD.

*Fait le 26/02/2026 par Trae AI.*
