---
title: 'Dictionnaires : PokéNSI'
description: Création d'un jeu inspiré de Pokémon en Python
level: premiere
chapter: Projets
icon: "gamepad-2"
badgeId: premiere_pokensi
prerequisites:
  - projet_jeux_video
audience: public
---

# <Icone nom="gamepad-2" /> Projet - PokéNSI (Partie 1)

Le but de ce projet est de créer un jeu inspiré de Pokémon en utilisant Python.
Cette première partie porte sur la création du Pokédex et la mise en place du système de combat.

**Ressources :**
- [Code source principal](resources/pokensi_main.py)
- [Base de données Pokedex](resources/pokedex.csv)
- [Base de données Attaques](resources/attaques.csv)

## 1. Le Pokédex <Icone nom="smartphone" />

Le Pokédex est une base de données qui contient tous les Pokémon du jeu. Chaque Pokémon est représenté par un **dictionnaire** :

- `nom` (str) <Icone nom="notebook-pen" />
- `hp` (int) <Icone nom="heart" />
- `atq` (int) <Icone nom="swords" />
- `def` (int) <Icone nom="shield" />
- `attaques` (list) <Icone nom="zap" />
- `evolution` (str) <Icone nom="star" />
- `niveau_evolution` (int) <Icone nom="trending-up" />
- `niveau` (int) <Icone nom="chart-column" />
- `xp` (int)<Renards n="1" />

<ExerciseTabs courseId="proj_poke_dex" courseTitle="Création du Pokédex">
  <ExerciseSection id="poke-dex-1" label="Initialisation" type="python">
    <Enonce>
      Créer une liste vide `pokedex` qui contiendra tous les dictionnaires de Pokémon.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-2" label="Import CSV" type="lecture">
    <Enonce>
      On dispose de la fonction `remplir_pokedex` suivante. Elle permet de récupérer toutes les informations des pokemons pour en faire une liste de dictionnaires.

      Copier cette fonction dans le code :

      ```python
      import csv

      def remplir_pokedex(filename):
          pokedex = []
          with open(filename, 'r', encoding='utf-8') as f:
              reader = csv.DictReader(f, delimiter=',') # Vérifiez le délimiteur de votre CSV
              for row in reader:
                  # On convertit les types (tout est str dans un CSV)
                  pokemon = {
                      "nom": row["nom"],
                      "hp": int(row["hp"]),
                      "atq": int(row["atq"]),
                      "def": int(row["def"]),
                      "attaques": row["attaques"].split(";"), # Sépare les attaques
                      "evolution": row["evolution"],
                      "niveau_evolution": int(row["niveau_evolution"]),
                      "niveau": 1, 
                      "xp": 0
                  }
                  pokedex.append(pokemon)
          return pokedex
      ```

      Utiliser cette fonction avec le fichier `pokedex.csv` pour remplir la liste.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-3" label="Recherche" type="python">
    <Enonce>
      Créer une fonction `recuperer_pokemon(nom)` qui cherche un Pokémon par son nom dans le `pokedex` et renvoie son dictionnaire.
      Si le Pokémon n'est pas trouvé, renvoyer `None`.

      *Tester avec "Pikachu" et "Mewtwo".*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le système de combat <Icone nom="swords" />

### Les attaques <Icone nom="zap" />

L'ensemble des attaques est disponible dans `attaques.csv`.

<ExerciseTabs courseId="proj_poke_fight" courseTitle="Système de Combat">
  <ExerciseSection id="poke-fight-1" label="Charger les attaques" type="python">
    <Enonce>
      Créer une fonction `charger_attaques()` similaire à `remplir_pokedex` qui lit `attaques.csv` et renvoie un dictionnaire où :
      *   Clé = Nom de l'attaque
      *   Valeur = Dégâts (int)

      ```python
      # Exemple de structure attendue
      attaques = {
          "Charge": 10,
          "Tonnerre": 40,
          "Flammeche": 25
      }
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-fight-2" label="Formule de Dégâts" type="python">
    <Enonce>
      Lors d'un combat, les dégâts sont calculés ainsi :

      $$
      \texttt{degats} = \frac{(((N \times 0.4)+2) \times \texttt{Atq} \times \texttt{Puissance})}{\texttt{Def} \times 50} + 2
      $$

      Avec :
      - $N$ : Niveau du Pokémon attaquant <Icone nom="chart-column" />
      - $Atq$ : Points d'attaque de l'attaquant <Icone nom="swords" />
      - $Puissance$ : Puissance de l'attaque utilisée <Icone nom="zap" />
      - $Def$ : Points de défense de la cible <Icone nom="shield" />

      Implémenter la fonction `calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques)`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-fight-3" label="Attaquer !" type="python">
    <Enonce>
      Créer la fonction `attaquer(attaquant, defenseur, nom_attaque, dico_attaques)` qui :
      1. Calcule les dégâts.
      2. Soustrait les dégâts aux `hp` du défenseur.
      3. Affiche un message de combat (ex: "Pikachu lance Tonnerre sur Carapuce ! Il inflige 15 dégâts.").
      
      *Attention : Les PV ne peuvent pas être négatifs.*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Simulation <Icone nom="zap" />

<ExerciseTabs courseId="proj_poke_sim" courseTitle="Simulation">
  <ExerciseSection id="poke-sim-1" label="Duel" type="python">
    <Enonce>
      Écrire un script principal qui :
      1. Charge le Pokédex et les Attaques.
      2. Récupère "Pikachu" et "Bulbizarre".
      3. Fait attaquer Pikachu avec "Tonnerre".
      4. Affiche les PV restants de Bulbizarre.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
