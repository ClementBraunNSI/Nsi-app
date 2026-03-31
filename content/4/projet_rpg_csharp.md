---
title: 'Projet Fil Rouge : Création d''un jeu ''FoxMon'' (Type Pokémon)'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
badgeId: projet_rpg_csharp
meta: 'C#, Projet, POO, Héritage, Polymorphisme, Console, Pokemon'
prerequisites:
  - tp_remediation_poo
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

**Exemple de carte (pour tester l'étape 1) :**

Dimensions : largeur = 20, hauteur = 10.  
Spawn conseillé : `X = 2`, `Y = 2` (case `.`).

```text
####################
#.........*....*...#
#..####....####..*.#
#.....*.....*......#
#####..####..####..#
#....*....#...*....#
#......####........#
#....#......#......#
#..*.........*.....#
####################
```

Vous pouvez charger cette carte en mémoire via un tableau `char[,]` (conversion `string[]` -> `char[,]`) :

```csharp
string[] lignes = new[]
{
  "####################",
  "#.........*....*...#",
  "#..####....####..*.#",
  "#.....*.....*......#",
  "#####..####..####..#",
  "#....*....#...*....#",
  "#......####........#",
  "#....#......#......#",
  "#..*.........*.....#",
  "####################",
};

int height = lignes.Length;
int width = lignes[0].Length;

char[,] grille = new char[width, height];

for (int y = 0; y < height; y++)
{
  for (int x = 0; x < width; x++)
  {
    grille[x, y] = lignes[y][x];
  }
}

// Spawn conseillé :
int spawnX = 2;
int spawnY = 2;
```

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
- `Console.SetCursorPosition(x, y)` : Cela permet de placer le curseur de la console à un endroit précis. Utile pour dessiner le dresseur (`@`) *par-dessus* la carte sans tout casser.

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

## 🧪 Étape 5 : Captures et Objets (Séance 5)

L’exploration mène à la capture. Implémentez la mécanique de capture et introduisez les objets.

### 1. Classe `Objet` et hiérarchie
- Créez une classe abstraite `Objet` avec `Nom` et `Utiliser(Dresseur lanceur, FoxMon cible)`.
- Créez des classes filles :
  - `Potion` : restaure des PV.
  - `VulBall` : tente la capture d’un FoxMon sauvage.
  - `ObjetCombat` (ex: `BoostAttaque`) : applique un bonus temporaire.
  - `ObjetTenu` (ex: `BaieSoin`) : effet automatique si condition remplie (ex: PV < 30%).

### 2. Sac à dos
- Ajoutez un inventaire au `Dresseur`.
- Ajoutez `AjouterObjet`, `RetirerObjet`, `AObjet`.
- Dans le menu de combat, l’option `Objet` applique l’effet et consomme l’objet.

### 3. Capture (sauvage uniquement)
- Action `Capturer` disponible uniquement contre un FoxMon sauvage.
- Probabilité de capture : `p = baseRate * (1 - HPactuels / HPmax) * multiplicateurBalle` (par défaut `baseRate=0.35`, `multiplicateurBalle=1.0` pour `VulBall`).
- En cas de réussite : ajout à l’équipe (ou stockage si équipe pleine).
- En échec : message et fin de tour.

<Admonition type="warning" title="Règle">
La capture est interdite en combat contre dresseur.
</Admonition>

---

## 🤝 Étape 6 : Combats contre Dresseurs (Séance 6)

### 1. PNJ Dresseurs
- Ajoutez des PNJ avec champ de vision sur la carte.
- Si le joueur entre dans ce champ, déclenchez un combat.

### 2. Règles
- Pas de capture.
- Autoriser le `Changement` de FoxMon.
- IA : choisit le premier FoxMon apte et attaque.

### 3. Fin de combat
- Victoire si toute l’équipe adverse est KO.
- Récompense possible (argent, objets).

---

## ⚔️ Étape 7 : Dégâts, Types et Coups Critiques (Séance 7)

### 1. Table des types (simplifiée)
- Feu → Plante : 2.0 ; Plante → Eau : 2.0 ; Eau → Feu : 2.0.
- Inverse défavorable : 0.5 ; même type : 1.0.

### 2. Critiques et variabilité
- Critique : 10% de chance, multiplicateur 1.5.
- Variabilité : facteur aléatoire 0.85–1.00.

### 3. Formule indicative
- `dégâts = puissanceBase * multiplicateurType * (critique ? 1.5 : 1.0) * random(0.85..1.0)`

---

## 📈 Étape 8 : Expérience et Évolution (Séance 8)

### 1. Gain d’XP
- Après une victoire, attribuer des XP au FoxMon actif.
- Courbe simple : `XP nécessaire = 10 * niveau^2`.

### 2. Niveau et évolution
- Augmenter PV max et statistiques à chaque niveau.
- Évolutions par paliers : Renardeau → Renard → Kitsune.

### 3. Cartes volumineuses via JSON
- Remplacez la carte en tableaux 2D par un chargement depuis un fichier JSON pour permettre de grandes maps.
- Proposez une structure JSON simple :

```json
{
  "width": 40,
  "height": 25,
  "layers": {
    "ground": [
      "........................................",
      "....#########.............******........",
      "....#.......#.............******........",
      "....#.......#.........................#.",
      "....#.......#.............######......#.",
      "....#########.............#....#......#.",
      "..........................#....#......#.",
      "**************............#....#......#.",
      "**************............######......#.",
      "......................................#.",
      "######################################."
    ],
    "collision": [
      "........................................",
      "....#########.............******........",
      "....#.......#.............******........",
      "....#.......#.........................#.",
      "....#.......#.............######......#.",
      "....#########.............#....#......#.",
      "..........................#....#......#.",
      "**************............#....#......#.",
      "**************............######......#.",
      "......................................#.",
      "######################################."
    ]
  },
  "legend": {
    ".": "chemin",
    "#": "mur",
    "*": "hautes_herbes"
  },
  "spawn": { "x": 2, "y": 2 },
  "pnj": [
    { "nom": "Rival", "x": 10, "y": 6, "vision": 4, "equipe": ["RenardFeu", "RenardPlante"] }
  ]
}
```

- Adaptez la classe `Carte` pour charger ce JSON (`File.ReadAllText`, `System.Text.Json`), reconstruire les layers en mémoire et exposer :
  - `EstTraversable(x, y)` en se basant sur `collision`.
  - `EstHauteHerbe(x, y)` en se basant sur `legend`.
  - `Afficher()` en itérant la couche `ground`.
- Utilisez `spawn` pour positionner le dresseur au lancement et initialisez les PNJ depuis `pnj`.
- Optionnel : découpez la carte en “chunks” pour optimiser l’affichage si la taille augmente fortement.

---

## 💾 Étape 9 : Sauvegarde et Chargement (Séance 9)

### 1. Données à persister
- Position du dresseur, équipe, inventaire, PNJ vaincus.

### 2. Format JSON
- Utilisez `System.Text.Json` avec une classe `Sauvegarde`.

### 3. Intégration
- Ajoutez `Sauvegarder` et `Charger` au menu principal.

---

## 🌟 Aller plus loin

- **🏆 Interface Graphique (God Tier) :** portage vers *WinForms*, *WPF* ou *MonoGame* pour des sprites.
