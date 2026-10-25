---
title: 'Projet Fil Rouge : Création d''un jeu ''FoxMon'' (Type Pokémon)'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
badgeId: projet_rpg_csharp
meta: 'C#, Projet, POO, Héritage, Polymorphisme, Console, Pokemon'
prerequisites:
  - tp_remediation_poo
audience: public
---

# Projet fil rouge : FoxMon

Le but de ce projet est de créer un jeu console, en C#, inspiré de Pokémon, dont toutes les créatures sont des renards : les FoxMons.
Le projet s'étale sur plusieurs séances. On avance dans l'ordre : la carte, le bestiaire, l'héritage, les attaques, les objets, les dresseurs, les dégâts, l'expérience, puis la sauvegarde.

**Organisation des fichiers.** Chaque classe a son propre fichier, et toutes partagent le même namespace `FoxMon`.

```text
FoxMon/
  Program.cs
  Carte.cs
  Dresseur.cs
```

Les classes du même namespace se voient sans import supplémentaire. `Program.cs` contient `Main`.

## 1. La carte et le dresseur <Icone nom="map" />

La région est une grille. `.` est un chemin, `#` un mur, `*` des hautes herbes. Le dresseur est dessiné par un `@`.

Carte de test : largeur 20, hauteur 10. Apparition conseillée : `X = 2`, `Y = 2`, une case `.`.

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

<ExerciseTabs courseId="sio_foxmon_carte" courseTitle="Carte">
  <ExerciseSection id="foxmon-carte-1" label="Charger la grille" type="autre">
    <Enonce>
      Créer la classe `Carte`. La grille est un `char[,]`. Copier le chargement, puis vérifier que `grille[2, 2]` vaut `'.'` et que `grille[0, 0]` vaut `'#'`.

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
      ```

      *Attention : l'indice x est la colonne, y est la ligne. `lignes[y][x]` se range dans `grille[x, y]`.*

      Écrire `Afficher()` : une double boucle dessine la grille. Écrire `EstTraversable(int x, int y)` : faux sur un `#`, faux hors de la grille. Écrire `EstHauteHerbe(int x, int y)` : vrai seulement sur `*`.

      `EstTraversable(2, 2)` vaut vrai. `EstTraversable(0, 0)` vaut faux. `EstHauteHerbe(9, 1)` vaut vrai (le premier `*` de la deuxième ligne).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-carte-2" label="Le dresseur" type="autre">
    <Enonce>
      Créer `Dresseur` : `Nom`, `X`, `Y`. Départ : nom `Joueur`, position `(2, 2)`.

      ```csharp
      namespace FoxMon;
      public class Dresseur
      {
        public string Nom { get; set; } = "Joueur";
        public int X { get; set; } = 2;
        public int Y { get; set; } = 2;
      }
      ```

      Écrire `Deplacer(Carte carte, int dx, int dy)`. La méthode calcule la case d'arrivée. Si `EstTraversable` est faux, `X` et `Y` ne changent pas. Sinon ils prennent la nouvelle case.

      Depuis `(2, 2)`, un pas vers la gauche de 1 reste en `(2, 2)` si la case n'est pas traversable, et un pas vers la droite de 1 va en `(3, 2)` sur cette carte (la case est un `.`).

      `Afficher(Dresseur dresseur)` dessine le `@` à `(X, Y)` par-dessus la carte, sans effacer le symbole du terrain en mémoire : la grille garde son `.` ou son `*`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-carte-3" label="La boucle" type="autre">
    <Enonce>
      Dans `Main`, le jeu tourne jusqu'à la touche qui quitte (par exemple `Echap`).

      À chaque tour, dans cet ordre :

      1. `Console.Clear()`
      2. dessiner la carte
      3. dessiner le `@`
      4. `Console.ReadKey(true)` : la touche n'est pas recopiée à l'écran
      5. flèche haut, bas, gauche, droite : appeler `Deplacer` avec le bon couple `(dx, dy)`

      `Console.SetCursorPosition(x, y)` place le curseur pour le `@`. Sans `Clear`, la carte s'empile vers le bas : ce n'est pas le rendu attendu.

      Contrôle : dix pas vers la droite ne traversent pas un `#`. Le `@` reste sur la dernière case traversable.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le bestiaire et le combat <Renard />

<ExerciseTabs courseId="sio_foxmon_combat" courseTitle="Combat">
  <ExerciseSection id="foxmon-combat-1" label="La classe FoxMon" type="autre">
    <Enonce>
      Créer `FoxMon` : nom, points de vie actuels, PV max, niveau, vitesse, et `TypeElementaire` (`"Eau"`, `"Feu"` ou `"Plante"` pour l'instant).

      Le dresseur a une `List<FoxMon> Equipe`, au plus 6 renards. Ajouter un septième est refusé : la liste ne dépasse pas 6, la méthode renvoie faux.

      Renard de test : `RenardEau`, 20 PV max, niveau 5, vitesse 10. Au départ, ses PV actuels sont égaux à ses PV max.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-combat-2" label="Les hautes herbes" type="autre">
    <Enonce>
      Quand le dresseur **arrive** sur une case `*`, tirer un nombre entre 0 et 99. S'il est strictement inférieur à 20, un FoxMon sauvage apparaît. La rencontre a donc lieu une fois sur cinq environ, et pas à chaque pas.

      Le combat remplace la carte. Dans `Main`, un booléen `enCombat` décide de la vue.

      - `enCombat` faux : carte et flèches.
      - Rencontre : `enCombat = true`, puis `Console.Clear()`.
      - Combat fini (fuite, victoire ou capture) : `enCombat = false`, `Console.Clear()`, le dresseur est toujours sur la même case.

      Le dresseur envoie le premier FoxMon de son équipe dont les PV sont supérieurs à 0. S'il n'en a aucun, la rencontre affiche `Aucun FoxMon en état.` et le combat n'a pas lieu.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-combat-3" label="Le tour" type="autre">
    <Enonce>
      Le joueur choisit : Attaquer, Capturer, Fuir.

      La table simple de cette séance : Eau contre Feu multiplie les dégâts par 2, et le programme affiche `C'est super efficace !`. Les autres couples de cette séance gardent le multiplicateur 1. La formule complète est à l'étape 7 : ne l'inventez pas encore.

      Exemple : un RenardEau de puissance 10 attaque un RenardFeu. Dégâts affichés : 20, avec la phrase. Les PV du défenseur baissent de 20, et ne descendent pas sous 0.

      Le combat s'arrête quand l'un des deux est KO (PV à 0), quand la capture réussit, ou quand la fuite est choisie. La fuite de cette séance réussit toujours : on retrouvera la carte. La capture détaillée est à l'étape 5. En attendant, Capturer affiche `Pas encore disponible.` et le tour passe.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. L'héritage <Icone nom="dna" />

Les `if` sur le type se regroupent dans des classes.

<ExerciseTabs courseId="sio_foxmon_heritage" courseTitle="Héritage">
  <ExerciseSection id="foxmon-heritage-1" label="Mère et filles" type="autre">
    <Enonce>
      `FoxMon` devient la classe mère. Elle garde les PV, le niveau, la vitesse, et une méthode qui dit si le renard est KO (`Pv <= 0`).

      Créer `RenardFeu`, `RenardEau` et `RenardPlante`. Le constructeur de chaque fille fixe le type et les statistiques de base. On ne les redemande pas à l'appel.

      | Classe | Type | PV max | Vitesse |
      | --- | --- | --- | --- |
      | RenardFeu | Feu | 18 | 12 |
      | RenardEau | Eau | 20 | 10 |
      | RenardPlante | Plante | 22 | 8 |

      `new RenardFeu("Flamèche")` a le type Feu, 18 PV, vitesse 12, niveau 1. Un appel qui oublie le type ne compile pas : le type n'est pas un paramètre.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Les attaques, lues dans un CSV <Icone nom="file-text" />

Un FoxMon connaît jusqu'à 4 attaques. On ne les écrit pas une par une dans le code : elles viennent d'un fichier.

```csv
Nom,Type,Puissance,Precision
Charge,Normal,40,100
Crocs Feu,Feu,65,95
Pistolet a O,Eau,40,100
Tranch'Herbe,Plante,55,95
```

<ExerciseTabs courseId="sio_foxmon_attaques" courseTitle="Attaques">
  <ExerciseSection id="foxmon-atk-1" label="Charger le fichier" type="autre">
    <Enonce>
      Créer la classe `Attaque` : `Nom`, `Type`, `Puissance`, `Precision`.

      Créer `PanelAttaques` avec `ChargerToutesLesAttaques()`, qui lit `attaques.csv` à la racine du projet (`File.ReadAllLines`, puis `Split(',')`). La première ligne est l'en-tête : on ne l'instancie pas. Chaque ligne suivante devient une `Attaque`. Puissance et précision sont des entiers.

      Après chargement du fichier ci-dessus, la liste contient 4 attaques. `Crocs Feu` a la puissance 65 et la précision 95.

      Ajouter `List<Attaque> AttaquesConnues` sur `FoxMon`. À la création d'un `RenardFeu`, lui donner `Charge` et `Crocs Feu`. Pas plus de 4. Une cinquième est refusée.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-atk-2" label="Toucher ou rater" type="autre">
    <Enonce>
      En combat, Attaquer affiche les attaques connues et le joueur en choisit une par son numéro. Un numéro hors liste redemande.

      Tirer un entier entre 1 et 100. S'il est strictement supérieur à `Precision`, l'attaque échoue : afficher `Raté !`, les PV ne bougent pas.

      `Charge` (précision 100) ne rate pas. `Crocs Feu` (95) rate quand le tir vaut 96, 97, 98, 99 ou 100.

      Pour le test, fixer le tir à 96 : `Crocs Feu` rate. Le fixer à 95 : l'attaque part.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 5. Objets et capture <Icone nom="flask-conical" />

<ExerciseTabs courseId="sio_foxmon_objets" courseTitle="Objets">
  <ExerciseSection id="foxmon-obj-1" label="Le sac" type="autre">
    <Enonce>
      Créer la classe abstraite `Objet` : `Nom`, et `Utiliser(Dresseur lanceur, FoxMon cible)`.

      - `Potion` : rend 10 PV, sans dépasser les PV max. Un renard à 15/20 passe à 20, pas à 25. Un renard KO (0 PV) n'est pas soigné : la potion n'est pas consommée.
      - `VulBall` : tente la capture d'un sauvage.
      - `BoostAttaque` : bonus temporaire, par exemple +5 de puissance au prochain coup, puis le bonus disparaît.
      - `BaieSoin` : objet tenu. Si les PV passent sous 30 % du max, elle rend 10 PV une fois, puis elle est consommée.

      Le dresseur a un inventaire : `AjouterObjet`, `RetirerObjet`, `AObjet`. En combat, l'action Objet applique l'effet et retire l'objet du sac, sauf si l'usage a été refusé (potion sur un KO).

      *Attention : la capture est interdite contre un dresseur. L'action n'apparaît pas, ou elle affiche `Capture impossible.` sans consommer la balle.*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-obj-2" label="La probabilité" type="autre">
    <Enonce>
      Contre un sauvage seulement :

      ```text
      p = 0,35 * (1 - PVactuels / PVmax) * multiplicateurBalle
      ```

      `VulBall` a le multiplicateur 1. Un sauvage à pleine vie a `p = 0`. Un sauvage à 0 PV n'est plus capturable : le combat est déjà fini par KO.

      Exemple : PV max 20, PV actuels 10. `p = 0,35 * (1 - 10/20) * 1 = 0,175`. Sur un tir entre 0 et 1, la capture réussit si le tir est strictement inférieur à 0,175.

      Réussite : le sauvage rejoint l'équipe s'il reste une place (moins de 6). Équipe pleine : il va dans une liste `Stockage`, et le message le dit. Échec : `La capture a échoué.`, la balle est consommée, le tour se termine.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 6. Les dresseurs sur la carte <Icone nom="handshake" />

<ExerciseTabs courseId="sio_foxmon_pnj" courseTitle="Dresseurs">
  <ExerciseSection id="foxmon-pnj-1" label="Champ de vision" type="autre">
    <Enonce>
      Un PNJ a un nom, une position, une portée de vision et une équipe. S'il regarde vers la gauche et que le joueur entre dans les cases à portée, le combat démarre. Une fois vaincu, il ne relance pas le combat.

      Exemple : rival en `(10, 6)`, vision 4, équipe `RenardFeu` puis `RenardPlante`. Le joueur en `(8, 6)` est à distance 2 : le combat part. Le joueur en `(5, 6)` est à distance 5 : rien.

      Règles du combat de dresseur : pas de capture. Le joueur peut changer de FoxMon, parmi ceux qui ne sont pas KO. L'adversaire envoie le premier de son équipe encore en état, et il attaque avec sa première attaque.

      Victoire quand toute l'équipe adverse est KO. Le rival laisse alors 100 pièces et une potion. Défaite quand toute l'équipe du joueur est KO : retour à la case `(2, 2)`, les PV de l'équipe repassent au max, l'argent ne descend pas.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 7. Dégâts, types, critiques <Icone nom="swords" />

Table utilisée à partir de cette séance. Le type de l'attaque est comparé au type du défenseur.

| Attaque contre défenseur | Multiplicateur |
| --- | --- |
| Feu contre Plante, Plante contre Eau, Eau contre Feu | 2,0 |
| Sens inverse (Feu contre Eau, Eau contre Plante, Plante contre Feu) | 0,5 |
| Même type, ou type Normal | 1,0 |

<ExerciseTabs courseId="sio_foxmon_degats" courseTitle="Dégâts">
  <ExerciseSection id="foxmon-degats-1" label="La formule" type="autre">
    <Enonce>
      Écrire `CalculerDegats(Attaque attaque, FoxMon defenseur)`.

      ```text
      degats = puissance * multiplicateurType * critique * variable
      ```

      - critique : 10 % de chance, alors le facteur vaut 1,5, sinon 1
      - variable : tiré entre 0,85 et 1,00 inclus

      Le résultat est un entier, arrondi à l'inférieur, au moins 1 si l'attaque touche et que la puissance est positive.

      Contrôles, critique forcé à non, variable forcée à 1 :

      - `Crocs Feu` (65) sur un `RenardPlante` : 65 × 2 = 130, message `C'est super efficace !`
      - `Crocs Feu` sur un `RenardEau` : 65 × 0,5 = 32, message `Ce n'est pas très efficace...`
      - `Charge` (40) sur n'importe qui : 40

      Les PV baissent de cette valeur et ne passent pas sous 0. À 0, le FoxMon est KO et ne rejoue pas.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 8. Expérience, évolution, grande carte <Icone nom="trending-up" />

<ExerciseTabs courseId="sio_foxmon_xp" courseTitle="Expérience">
  <ExerciseSection id="foxmon-xp-1" label="Niveaux" type="autre">
    <Enonce>
      Après une victoire, le FoxMon encore en jeu gagne 20 XP. L'XP nécessaire pour passer le niveau en cours vaut `10 * niveau * niveau`.

      Au niveau 1, le seuil est 10. 20 XP font passer au niveau 2, et il reste 10 XP. Au niveau 2, le seuil est 40 : ces 10 XP ne suffisent pas.

      À chaque niveau : +2 PV max, +1 vitesse. Les PV actuels gagnent aussi les 2 points (un renard à 18/18 passe à 20/20).

      Évolution, selon le niveau, sans changer les PV déjà gagnés :

      - niveau inférieur à 8 : le nom d'espèce affiché est Renardeau
      - de 8 à 15 inclus : Renard
      - à partir de 16 : Kitsune

      Un `RenardFeu` niveau 8 affiche `Renard` et garde le type Feu.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="foxmon-xp-2" label="La carte JSON" type="autre">
    <Enonce>
      Remplacer la carte écrite dans le code par un chargement JSON (`File.ReadAllText`, `System.Text.Json`). `EstTraversable` lit la couche `collision` (`#` bloque). `EstHauteHerbe` lit `ground` (ou la légende : `*` veut dire hautes herbes). `Afficher` parcourt `ground`. Le dresseur commence aux coordonnées `spawn`. Les PNJ viennent du tableau `pnj`.

      ```json
      {
        "width": 40,
        "height": 25,
        "layers": {
          "ground": ["........................................"],
          "collision": ["........................................"]
        },
        "legend": { ".": "chemin", "#": "mur", "*": "hautes_herbes" },
        "spawn": { "x": 2, "y": 2 },
        "pnj": [
          { "nom": "Rival", "x": 10, "y": 6, "vision": 4, "equipe": ["RenardFeu", "RenardPlante"] }
        ]
      }
      ```

      Le fichier du sujet peut être plus grand : chaque chaîne de `ground` a `width` caractères, et il y a `height` chaînes. Après chargement, `spawn` place le dresseur, et le rival de l'étape 6 est bien en `(10, 6)`.

      Découper la carte en morceaux pour l'affichage reste facultatif, et seulement si la grille devient lourde à redessiner.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 9. Sauvegarde <Icone nom="save" />

<ExerciseTabs courseId="sio_foxmon_save" courseTitle="Sauvegarde">
  <ExerciseSection id="foxmon-save-1" label="Écrire et relire" type="autre">
    <Enonce>
      Une classe `Sauvegarde` contient : position du dresseur, équipe (espèce, surnom, niveau, PV, XP, attaques), inventaire, argent, noms des PNJ déjà vaincus.

      `Sauvegarder` écrit ce contenu en JSON avec `System.Text.Json`. `Charger` le relit. Les deux sont dans le menu, accessibles depuis la carte (touches indiquées à l'écran, par exemple `S` et `C`).

      Contrôle : avancer, capturer ou soigner, sauvegarder, quitter le programme, relancer, charger. Le `@` est à la même case, l'équipe a les mêmes PV, le rival déjà vaincu ne relance pas le combat.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 10. Ce qu'on rend <Icone nom="package" />

Le dossier `FoxMon`, qui compile, avec un fichier par classe dans le namespace `FoxMon` :

- la carte de test, le dresseur qui ne traverse pas les `#`, la boucle qui efface l'écran ;
- `RenardFeu`, `RenardEau`, `RenardPlante`, l'équipe limitée à 6 ;
- `attaques.csv` et le chargement (4 attaques, `Crocs Feu` à 65) ;
- la formule de dégâts, avec les trois contrôles (130, 32 et 40) ;
- la capture `p = 0,175` sur l'exemple 10/20, interdite contre un dresseur ;
- la sauvegarde JSON qu'on recharge après avoir quitté.

Placer en tête de `Program.cs` un commentaire avec son nom et sa classe. Une fois que ce dossier tourne, et seulement alors, l'étape suivante consiste à porter l'affichage vers WinForms, WPF ou MonoGame. Le métier (dégâts, capture, sauvegarde) ne se réécrit pas dans les boutons.
