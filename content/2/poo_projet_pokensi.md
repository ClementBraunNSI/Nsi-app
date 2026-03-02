---
title: "Dictionnaires : PokéNSI"
description: "Création d'un jeu inspiré de Pokémon en Python"
level: premiere
chapter: "Projets"
icon: "👾"
badgeId: "premiere_pokensi"
---

import ExerciseTabs from '../../components/interactive/ExerciseTabs';
import { Enonce } from '../../components/interactive/ExerciseTabs';

# 👾 Projet - PokéNSI (Partie 1)

Le but de ce projet est de créer un jeu inspiré de Pokémon en utilisant Python.
Dans cette première partie, nous allons nous concentrer sur la création du Pokédex et la mise en place du système de combat.

**Ressources :**
- [Code source principal](resources/pokensi_main.py)
- [Base de données Pokedex](resources/pokedex.csv)
- [Base de données Attaques](resources/attaques.csv)

## 1. Le Pokédex 📱

Le Pokédex est une base de données qui contient tous les Pokémon du jeu. Chaque Pokémon est représenté par un **dictionnaire** :

- `nom` (str) 📝
- `hp` (int) ❤️
- `atq` (int) ⚔️
- `def` (int) 🛡️
- `attaques` (list) 💥
- `evolution` (str) ✨
- `niveau_evolution` (int) 📈
- `niveau` (int) 📊
- `xp` (int) ⭐

<ExerciseTabs courseId="proj_poke_dex" courseTitle="Création du Pokédex">
  <ExerciseSection id="poke-dex-1" label="Initialisation">
    <Enonce>
      Créez une liste vide `pokedex` qui contiendra tous les dictionnaires de Pokémon.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-2" label="Import CSV">
    <Enonce>
      On dispose de la fonction `remplir_pokedex` suivante. Elle permet de récupérer toutes les informations des pokemons pour en faire une liste de dictionnaires.

      Copiez cette fonction dans votre code :

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

      Utilisez cette fonction avec le fichier `pokedex.csv` pour remplir votre liste.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-3" label="Recherche">
    <Enonce>
      Créez une fonction `recuperer_pokemon(nom)` qui cherche un Pokémon par son nom dans le `pokedex` et renvoie son dictionnaire.
      Si le Pokémon n'est pas trouvé, renvoyez `None`.

      *Testez avec "Pikachu" et "Mewtwo".*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le système de combat ⚔️

### Les attaques 💥

L'ensemble des attaques est disponible dans `attaques.csv`.

<ExerciseTabs courseId="proj_poke_fight" courseTitle="Système de Combat">
  <ExerciseSection id="poke-fight-1" label="Charger les attaques">
    <Enonce>
      Créez une fonction `charger_attaques()` similaire à `remplir_pokedex` qui lit `attaques.csv` et renvoie un dictionnaire où :
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

  <ExerciseSection id="poke-fight-2" label="Formule de Dégâts">
    <Enonce>
      Lors d'un combat, les dégâts sont calculés ainsi :

      $$
      \texttt{degats} = \frac{(((N \times 0.4)+2) \times \texttt{Atq} \times \texttt{Puissance})}{\texttt{Def} \times 50} + 2
      $$

      Avec :
      - $N$ : Niveau du Pokémon attaquant 📊
      - $Atq$ : Points d'attaque de l'attaquant ⚔️
      - $Puissance$ : Puissance de l'attaque utilisée 💥
      - $Def$ : Points de défense de la cible 🛡️

      Implémentez la fonction `calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques)`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poke-fight-3" label="Attaquer !">
    <Enonce>
      Créez la fonction `attaquer(attaquant, defenseur, nom_attaque, dico_attaques)` qui :
      1. Calcule les dégâts.
      2. Soustrait les dégâts aux `hp` du défenseur.
      3. Affiche un message de combat (ex: "Pikachu lance Tonnerre sur Carapuce ! Il inflige 15 dégâts.").
      
      *Attention : Les PV ne peuvent pas être négatifs.*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Simulation ⚡

<ExerciseTabs courseId="proj_poke_sim" courseTitle="Simulation">
  <ExerciseSection id="poke-sim-1" label="Duel">
    <Enonce>
      Écrivez un script principal qui :
      1. Charge le Pokédex et les Attaques.
      2. Récupère "Pikachu" et "Bulbizarre".
      3. Fait attaquer Pikachu avec "Tonnerre".
      4. Affiche les PV restants de Bulbizarre.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
