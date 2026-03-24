---
title: "Projet Fil Rouge : Création d'un jeu 'FoxMon' (Type Pokémon)"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
badgeId: "projet_rpg_csharp"
meta: "C#, Projet, POO, Héritage, Polymorphisme, Console, Pokemon"
---

<Admonition type="info" title="Contexte du Projet">
Ce projet fil rouge s'étalera sur plusieurs séances. Votre objectif est de concevoir et développer un jeu en mode Console inspiré de la célèbre licence Pokémon, mais avec pour thème exclusif : **Les Renards (FoxMons)** ! 
En utilisant la Programmation Orientée Objet (POO) en C#, vous allez créer des espèces de renards élémentaires, vous déplacer sur une carte, et mener des combats au tour par tour pour les capturer.
</Admonition>

## 🎯 Objectifs Pédagogiques
- Concevoir une architecture logicielle robuste.
- Manipuler des listes (l'équipe de renards) et des grilles (la carte 2D).
- Appliquer les concepts avancés de la POO : **Héritage** et **Polymorphisme** (pour les types élémentaires et attaques).
- Gérer l'interaction utilisateur dans la console.

---

## 🗺️ Étape 1 : Le Dresseur et les Hautes Herbes (Séance 1)

Avant de capturer vos premiers FoxMons, vous devez pouvoir explorer la région.

### 1. La Carte du Monde
Vous devez créer une classe `Carte` qui gère l'environnement.

**Pistes de réflexion :**
- Comment stocker une grille en C# ? Renseignez-vous sur les **tableaux à deux dimensions** (`char[,]`).
- Quels symboles utiliser ? Par exemple : `.` (chemin), `#` (arbres/murs impossibles à traverser), et `*` pour les hautes herbes.
- Votre classe devra probablement contenir des méthodes comme :
  - `public void Afficher()` : qui utilise une double boucle `for` pour dessiner la grille.
  - `public bool EstTraversable(int x, int y)` : qui vérifie si une case donnée n'est pas un arbre.
  - `public bool EstHauteHerbe(int x, int y)` : pour déclencher des combats plus tard.

### 2. Le Dresseur
Créez une classe `Dresseur` pour représenter le joueur.

**Pistes de réflexion :**
- De quelles propriétés a-t-il besoin ? (Son nom, et surtout ses coordonnées `X` et `Y`).
- Comment le déplacer ? Vous devrez créer une méthode `Deplacer(...)` qui modifie `X` ou `Y` en fonction de la touche pressée, **tout en vérifiant** via la `Carte` si le déplacement est autorisé.

### 3. Le Moteur de Jeu (La Boucle Principale)
Dans votre `Main`, le jeu va tourner en continu jusqu'à ce qu'on le quitte.

**Mots-clés et fonctions C# à rechercher pour cette étape :**
- `while(true)` : Pour créer la boucle infinie du jeu.
- `Console.Clear()` : Pour effacer l'écran avant de redessiner la carte (évite que la carte s'imprime à l'infini vers le bas).
- `Console.ReadKey(true)` : Pour capter une touche du clavier (les flèches directionnelles) sans l'écrire dans la console. Renseignez-vous sur l'objet `ConsoleKeyInfo`.
- `Console.SetCursorPosition(x, y)` : **C'est le secret !** Cela permet de placer le curseur de la console à un endroit précis. Utile pour dessiner le dresseur (`@`) *par-dessus* la carte sans tout casser.

<Admonition type="tip" title="Ordre d'affichage">
Dans votre boucle, l'ordre logique est : 1. Nettoyer l'écran -> 2. Dessiner la carte -> 3. Dessiner le joueur par-dessus -> 4. Attendre une touche -> 5. Déplacer le joueur.
</Admonition>

---

## 🦊 Étape 2 : Le Bestiaire et les Combats (Séance 2)

Dans les hautes herbes, le danger guette.

1. **La classe FoxMon de base :**
   - Créez une classe `FoxMon` (Nom, Points de Vie Actuels, PV Max, Niveau, Vitesse).
   - Ajoutez un attribut `TypeElementaire` (qui peut être un simple `string` comme "Eau", "Feu", ou "Plante" pour l'instant).
   - Le dresseur possède un attribut `List<FoxMon> Equipe` (qui peut contenir jusqu'à 6 renards).

2. **La rencontre sauvage :**
   - À chaque fois que le dresseur marche sur une case `*` (hautes herbes), il y a **20% de chances** qu'un FoxMon sauvage apparaisse.
   - Si c'est le cas, l'affichage de la carte disparaît temporairement pour laisser place à l'interface de combat.

3. **Le Mode Combat et les Types (Tour par Tour) :**
   - Le dresseur envoie automatiquement le premier FoxMon de sa liste.
   - Le joueur a le choix des actions : *Attaquer, Capturer (si PV de la cible bas), Fuir*.
   - **La table des types :** L'attaque doit calculer les dégâts en fonction du type du lanceur et de la cible. Si un FoxMon Eau attaque un FoxMon Feu, les dégâts sont multipliés par 2 (afficher *"C'est super efficace !"*).
   - Le combat boucle jusqu'à ce qu'un des deux soit KO, capturé, ou que la fuite réussisse.

<Admonition type="tip" title="Gérer le changement de vue (Carte ↔ Combat)">
Pour passer de l'exploration au combat, vous devez gérer des "États de jeu". 
Dans votre `Main`, créez une variable `bool enCombat = false;`.
- Si `enCombat` est `false`, la boucle affiche la carte et lit les flèches directionnelles.
- Si le dresseur rencontre un FoxMon, passez `enCombat = true` et faites un `Console.Clear()`.
- La boucle va alors exécuter la logique de combat (afficher les PV, demander quelle attaque utiliser) au lieu d'afficher la carte.
- Une fois le combat terminé (fuite, victoire, capture), repassez `enCombat = false`, refaites un `Console.Clear()`, et le joueur retrouvera la carte là où il l'avait laissée !
</Admonition>

---

## 🧬 Étape 3 : Héritage et Factorisation (Séance 3)

À l'étape précédente, vous avez probablement géré les types avec beaucoup de `if/else` (si type = feu et cible = eau...). Il est temps d'introduire l'**Héritage** pour nettoyer tout ça !

1. **Refactorisation en classe Mère :**
   - Rendez votre classe `FoxMon` abstraite (ou utilisez-la comme classe mère stricte). Elle gère la mécanique globale des PV, de la mort, etc.

2. **Les Sous-Classes Élémentaires :**
   - Créez des classes qui héritent de `FoxMon` :
     - `RenardFeu` 
     - `RenardEau`
     - `RenardPlante` 
   - Le constructeur de chaque classe enfant doit forcer automatiquement son "Type" et ses statistiques de base sans qu'on ait besoin de les préciser.

3. **Le système de capture affiné :**
   - Le taux de réussite d'une capture ne doit plus être aléatoire. Il doit dépendre des PV Max du FoxMon sauvage par rapport à ses PV actuels (plus il est blessé, plus il est facile à capturer).

---

## 🎭 Étape 4 : Gestion des Attaques (Lecture de CSV) (Séance 4)

Un FoxMon ne se contente pas d'une seule attaque. Il en possède plusieurs, avec des caractéristiques différentes (puissance, précision, type). Pour éviter de "hardcoder" (écrire en dur) des dizaines d'attaques dans votre code, vous allez les lire depuis un fichier !

### 1. La classe `Attaque`
Créez une classe `Attaque` qui représente une capacité utilisable en combat.

**Pistes de réflexion :**
- Quels sont les attributs nécessaires ? `Nom` (ex: "Crocs Feu"), `Type` ("Feu"), `Puissance` (ex: 40), `Precision` (ex: 95 pour 95% de chance de toucher).
- Modifiez la classe mère `FoxMon` pour lui ajouter une `List<Attaque> AttaquesConnues` (un FoxMon peut connaître jusqu'à 4 attaques).

### 2. Le `PanelAttaques` (Lecture de CSV)
Créez un fichier `attaques.csv` à la racine de votre projet avec ce format :
```csv
Nom,Type,Puissance,Precision
Charge,Normal,40,100
Crocs Feu,Feu,65,95
Pistolet a O,Eau,40,100
Tranch'Herbe,Plante,55,95
```

Créez ensuite une classe `PanelAttaques` (ou `GestionnaireAttaques`) dont le rôle est de lire ce fichier au lancement du jeu.

**Mots-clés et fonctions C# à rechercher :**
- `System.IO.StreamReader` ou `File.ReadAllLines()` : pour lire un fichier texte ligne par ligne.
- `String.Split(',')` : pour découper une ligne CSV en un tableau de mots.
- Votre classe `PanelAttaques` devra contenir une méthode (ex: `public List<Attaque> ChargerToutesLesAttaques()`) qui lit le fichier, instancie un objet `Attaque` pour chaque ligne, et les stocke dans une grande liste globale.

### 3. Apprentissage et Choix en Combat
- À la création d'un FoxMon (ex: `RenardFeu`), utilisez le `PanelAttaques` pour lui attribuer 2 ou 3 attaques compatibles avec son type (ou le type "Normal").
- Lors d'un combat, au lieu d'avoir un simple bouton "Attaquer", le joueur doit maintenant choisir *quelle attaque* utiliser parmi la liste `AttaquesConnues` de son FoxMon actif.
- Prenez en compte la `Precision` de l'attaque : générez un nombre aléatoire (avec `Random`) entre 1 et 100. S'il est supérieur à la précision de l'attaque, celle-ci échoue !

---

## 🌟 Bonus et Fonctionnalités Avancées (Pour aller plus loin)

Si vous avez terminé les étapes précédentes, vous pouvez implémenter ces mécaniques pour rendre votre jeu exceptionnel :

- **Le Sac à Dos :** Création d'une classe `Objet` (mère) avec des enfants comme `Potion` (soigne), `FoxBall` (taux de capture variable).
- **Dresseurs Rivaux :** Ajoutez des PNJ (Personnages Non Joueurs) sur la carte. S'ils vous voient (champ de vision), un combat se lance contre leur propre équipe de FoxMons (pas de capture possible !).
- **Système d'Expérience et Évolution :** Gagner un combat donne de l'XP. À certains niveaux, le nom du FoxMon change (ex: Renardeau -> Renard -> Kitsune) et ses stats explosent.
- **Sauvegarde / Chargement :** Utilisez la manipulation de fichiers (JSON) pour sauvegarder la progression, la position et l'équipe du dresseur.
- **🏆 Interface Graphique (God Tier) :** Sortez le jeu de la console et portez-le sur *WinForms*, *WPF*, ou utilisez un moteur comme *MonoGame* pour afficher de vrais sprites de renards !

<Admonition type="warning" title="Critères d'évaluation">
La propreté de votre code est primordiale. Vous serez évalués sur :
- L'architecture de votre projet (les classes sont-elles logiques et bien séparées ?).
- La bonne utilisation de l'Héritage (pas de duplication de code inutile).
- La bonne utilisation du Polymorphisme (méthodes `virtual` et `override`).
- L'encapsulation (attributs en `private`, propriétés en `get/set`).
- La jouabilité (le jeu ne doit pas planter à la première erreur de saisie du joueur).
</Admonition>