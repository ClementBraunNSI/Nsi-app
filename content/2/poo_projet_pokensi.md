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

Dans l'éditeur du site, le code de départ crée une version courte de ces deux fichiers (quatre Pokémon, cinq attaques). `attaques.csv` a deux colonnes : `nom` et `puissance`.

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

    <Correction>
    ```python
    pokedex = []
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'pokedex' in globals(), "La liste doit s'appeler pokedex."
    assert pokedex == [], "pokedex doit être une liste vide."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-2" label="Import CSV" type="python">
    <CodeDepart>
    ```python
    # Les fichiers du projet, en version courte, créés ici pour tester dans l'éditeur.
    with open("pokedex.csv", "w", encoding="utf-8") as f:
        f.write("""nom,hp,atq,def,attaques,evolution,niveau_evolution
    Pikachu,35,55,40,Charge;Tonnerre,Raichu,20
    Bulbizarre,45,49,49,Charge;Fouet Lianes,Herbizarre,16
    Salameche,39,52,43,Charge;Flammeche,Reptincel,16
    Carapuce,44,48,65,Charge;Pistolet a O,Carabaffe,16
    """)
    with open("attaques.csv", "w", encoding="utf-8") as f:
        f.write("""nom,puissance
    Charge,10
    Tonnerre,40
    Flammeche,25
    Fouet Lianes,25
    Pistolet a O,25
    """)
    ```
    </CodeDepart>
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

    <Correction>
    ```python
    import csv

    def remplir_pokedex(filename):
        pokedex = []
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter=',')
            for row in reader:
                pokemon = {
                    "nom": row["nom"],
                    "hp": int(row["hp"]),
                    "atq": int(row["atq"]),
                    "def": int(row["def"]),
                    "attaques": row["attaques"].split(";"),
                    "evolution": row["evolution"],
                    "niveau_evolution": int(row["niveau_evolution"]),
                    "niveau": 1,
                    "xp": 0
                }
                pokedex.append(pokemon)
        return pokedex

    pokedex = remplir_pokedex("pokedex.csv")
    print(len(pokedex))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'pokedex' in globals() and isinstance(pokedex, list), "pokedex doit être la liste renvoyée par remplir_pokedex."
    assert len(pokedex) == 4, "pokedex.csv contient 4 Pokémon."
    assert pokedex[0]["nom"] == "Pikachu" and pokedex[0]["hp"] == 35, "Le premier Pokémon est Pikachu, avec 35 PV."
    assert pokedex[0]["attaques"] == ["Charge", "Tonnerre"], "Les attaques sont séparées en liste."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="poke-dex-3" label="Recherche" type="python">
    <CodeDepart>
    ```python
    pokedex = [
        {"nom": "Pikachu", "hp": 35, "atq": 55, "def": 40, "attaques": ["Charge", "Tonnerre"], "evolution": "Raichu", "niveau_evolution": 20, "niveau": 1, "xp": 0},
        {"nom": "Bulbizarre", "hp": 45, "atq": 49, "def": 49, "attaques": ["Charge", "Fouet Lianes"], "evolution": "Herbizarre", "niveau_evolution": 16, "niveau": 1, "xp": 0},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Créer une fonction `recuperer_pokemon(nom)` qui cherche un Pokémon par son nom dans le `pokedex` et renvoie son dictionnaire.
      Si le Pokémon n'est pas trouvé, renvoyer `None`.

      *Tester avec "Pikachu" et "Mewtwo".*

    <Correction>
    ```python
    def recuperer_pokemon(nom):
        for pokemon in pokedex:
            if pokemon["nom"] == nom:
                return pokemon
        return None

    print(recuperer_pokemon("Pikachu"))
    print(recuperer_pokemon("Mewtwo"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert recuperer_pokemon("Pikachu") is pokedex[0], "recuperer_pokemon('Pikachu') renvoie le dictionnaire de Pikachu."
    assert recuperer_pokemon("Bulbizarre")["hp"] == 45, "recuperer_pokemon('Bulbizarre') renvoie Bulbizarre."
    assert recuperer_pokemon("Mewtwo") is None, "Un Pokémon absent : None."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le système de combat <Icone nom="swords" />

### Les attaques <Icone nom="zap" />

L'ensemble des attaques est disponible dans `attaques.csv`.

<ExerciseTabs courseId="proj_poke_fight" courseTitle="Système de Combat">
  <ExerciseSection id="poke-fight-1" label="Charger les attaques" type="python">
    <CodeDepart>
    ```python
    # Les fichiers du projet, en version courte, créés ici pour tester dans l'éditeur.
    with open("pokedex.csv", "w", encoding="utf-8") as f:
        f.write("""nom,hp,atq,def,attaques,evolution,niveau_evolution
    Pikachu,35,55,40,Charge;Tonnerre,Raichu,20
    Bulbizarre,45,49,49,Charge;Fouet Lianes,Herbizarre,16
    Salameche,39,52,43,Charge;Flammeche,Reptincel,16
    Carapuce,44,48,65,Charge;Pistolet a O,Carabaffe,16
    """)
    with open("attaques.csv", "w", encoding="utf-8") as f:
        f.write("""nom,puissance
    Charge,10
    Tonnerre,40
    Flammeche,25
    Fouet Lianes,25
    Pistolet a O,25
    """)
    ```
    </CodeDepart>
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

    <Correction>
    ```python
    import csv

    def charger_attaques():
        attaques = {}
        with open("attaques.csv", encoding="utf-8") as f:
            for ligne in csv.DictReader(f):
                attaques[ligne["nom"]] = int(ligne["puissance"])
        return attaques

    print(charger_attaques())
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    attaques = charger_attaques()
    assert isinstance(attaques, dict), "charger_attaques renvoie un dictionnaire."
    assert attaques["Charge"] == 10 and attaques["Tonnerre"] == 40 and attaques["Flammeche"] == 25, "Clé : nom de l'attaque, valeur : dégâts en int."
    assert len(attaques) == 5, "attaques.csv contient 5 attaques."
    with open("attaques.csv", "w", encoding="utf-8") as __f:
        __f.write("nom,puissance\nEclair,30\n")
    assert charger_attaques() == {"Eclair": 30}, "charger_attaques lit le fichier attaques.csv."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="poke-fight-2" label="Formule de Dégâts" type="python">
    <CodeDepart>
    ```python
    pokedex = [
        {"nom": "Pikachu", "hp": 35, "atq": 55, "def": 40, "attaques": ["Charge", "Tonnerre"], "evolution": "Raichu", "niveau_evolution": 20, "niveau": 1, "xp": 0},
        {"nom": "Bulbizarre", "hp": 45, "atq": 49, "def": 49, "attaques": ["Charge", "Fouet Lianes"], "evolution": "Herbizarre", "niveau_evolution": 16, "niveau": 1, "xp": 0},
    ]
    attaques = {"Charge": 10, "Tonnerre": 40, "Flammeche": 25}
    ```
    </CodeDepart>
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

    <Correction>
    ```python
    def calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques):
        puissance = dico_attaques[nom_attaque]
        return ((attaquant["niveau"] * 0.4 + 2) * attaquant["atq"] * puissance) / (defenseur["def"] * 50) + 2

    print(calculer_degats(pokedex[0], pokedex[1], "Tonnerre", attaques))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    pika = {"nom": "Pikachu", "hp": 35, "atq": 55, "def": 40, "attaques": ["Charge", "Tonnerre"], "evolution": "Raichu", "niveau_evolution": 20, "niveau": 1, "xp": 0}
    bulbi = {"nom": "Bulbizarre", "hp": 45, "atq": 49, "def": 49, "attaques": ["Charge", "Fouet Lianes"], "evolution": "Herbizarre", "niveau_evolution": 16, "niveau": 1, "xp": 0}
    attaques_test = {"Charge": 10, "Tonnerre": 40}
    d = calculer_degats(pika, bulbi, "Tonnerre", attaques_test)
    assert abs(d - (((1 * 0.4 + 2) * 55 * 40) / (49 * 50) + 2)) < 1, "Pikachu niveau 1, Tonnerre sur Bulbizarre : environ 4.15 dégâts."
    pika["niveau"] = 30
    d = calculer_degats(pika, bulbi, "Tonnerre", attaques_test)
    assert abs(d - (((30 * 0.4 + 2) * 55 * 40) / (49 * 50) + 2)) < 1, "Le niveau de l'attaquant compte : niveau 30, environ 14.6 dégâts."
    d = calculer_degats(bulbi, pika, "Charge", attaques_test)
    assert abs(d - (((1 * 0.4 + 2) * 49 * 10) / (40 * 50) + 2)) < 1, "La défense utilisée est celle du défenseur."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="poke-fight-3" label="Attaquer !" type="python">
    <CodeDepart>
    ```python
    pokedex = [
        {"nom": "Pikachu", "hp": 35, "atq": 55, "def": 40, "attaques": ["Charge", "Tonnerre"], "evolution": "Raichu", "niveau_evolution": 20, "niveau": 1, "xp": 0},
        {"nom": "Bulbizarre", "hp": 45, "atq": 49, "def": 49, "attaques": ["Charge", "Fouet Lianes"], "evolution": "Herbizarre", "niveau_evolution": 16, "niveau": 1, "xp": 0},
    ]
    attaques = {"Charge": 10, "Tonnerre": 40, "Flammeche": 25}

    def calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques):
        puissance = dico_attaques[nom_attaque]
        return ((attaquant["niveau"] * 0.4 + 2) * attaquant["atq"] * puissance) / (defenseur["def"] * 50) + 2
    ```
    </CodeDepart>
    <Enonce>
      Créer la fonction `attaquer(attaquant, defenseur, nom_attaque, dico_attaques)` qui :
      1. Calcule les dégâts.
      2. Soustrait les dégâts aux `hp` du défenseur.
      3. Affiche un message de combat (ex: "Pikachu lance Tonnerre sur Carapuce ! Il inflige 15 dégâts.").
      
      *Attention : Les PV ne peuvent pas être négatifs.*

    <Correction>
    ```python
    def attaquer(attaquant, defenseur, nom_attaque, dico_attaques):
        degats = int(calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques))
        defenseur["hp"] = max(0, defenseur["hp"] - degats)
        print(attaquant["nom"] + " lance " + nom_attaque + " sur " + defenseur["nom"] + " ! Il inflige " + str(degats) + " dégâts.")

    attaquer(pokedex[0], pokedex[1], "Tonnerre", attaques)
    print(pokedex[1]["hp"])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    pika = {"nom": "Pikachu", "hp": 35, "atq": 55, "def": 40, "attaques": ["Charge", "Tonnerre"], "evolution": "Raichu", "niveau_evolution": 20, "niveau": 1, "xp": 0}
    bulbi = {"nom": "Bulbizarre", "hp": 45, "atq": 49, "def": 49, "attaques": ["Charge", "Fouet Lianes"], "evolution": "Herbizarre", "niveau_evolution": 16, "niveau": 1, "xp": 0}
    avant = bulbi["hp"]
    _, texte = _sortie(attaquer, pika, bulbi, "Tonnerre", {"Tonnerre": 40})
    perte = avant - bulbi["hp"]
    attendu = ((1 * 0.4 + 2) * 55 * 40) / (49 * 50) + 2
    assert abs(perte - attendu) < 1, "Bulbizarre perd environ 4 PV."
    assert "Pikachu" in texte and "Tonnerre" in texte and "Bulbizarre" in texte, "Le message cite l'attaquant, l'attaque et le défenseur."
    pika["niveau"] = 100
    pika["atq"] = 500
    _sortie(attaquer, pika, bulbi, "Tonnerre", {"Tonnerre": 40})
    assert bulbi["hp"] == 0, "Les PV ne descendent jamais sous 0."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Simulation <Icone nom="zap" />

<ExerciseTabs courseId="proj_poke_sim" courseTitle="Simulation">
  <ExerciseSection id="poke-sim-1" label="Duel" type="python">
    <CodeDepart>
    ```python
    # Les fichiers du projet, en version courte, créés ici pour tester dans l'éditeur.
    with open("pokedex.csv", "w", encoding="utf-8") as f:
        f.write("""nom,hp,atq,def,attaques,evolution,niveau_evolution
    Pikachu,35,55,40,Charge;Tonnerre,Raichu,20
    Bulbizarre,45,49,49,Charge;Fouet Lianes,Herbizarre,16
    Salameche,39,52,43,Charge;Flammeche,Reptincel,16
    Carapuce,44,48,65,Charge;Pistolet a O,Carabaffe,16
    """)
    with open("attaques.csv", "w", encoding="utf-8") as f:
        f.write("""nom,puissance
    Charge,10
    Tonnerre,40
    Flammeche,25
    Fouet Lianes,25
    Pistolet a O,25
    """)

    import csv

    def remplir_pokedex(filename):
        pokedex = []
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f, delimiter=',')
            for row in reader:
                pokemon = {
                    "nom": row["nom"],
                    "hp": int(row["hp"]),
                    "atq": int(row["atq"]),
                    "def": int(row["def"]),
                    "attaques": row["attaques"].split(";"),
                    "evolution": row["evolution"],
                    "niveau_evolution": int(row["niveau_evolution"]),
                    "niveau": 1,
                    "xp": 0
                }
                pokedex.append(pokemon)
        return pokedex

    def recuperer_pokemon(nom):
        for pokemon in pokedex:
            if pokemon["nom"] == nom:
                return pokemon
        return None

    import csv

    def charger_attaques():
        attaques = {}
        with open("attaques.csv", encoding="utf-8") as f:
            for ligne in csv.DictReader(f):
                attaques[ligne["nom"]] = int(ligne["puissance"])
        return attaques

    def calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques):
        puissance = dico_attaques[nom_attaque]
        return ((attaquant["niveau"] * 0.4 + 2) * attaquant["atq"] * puissance) / (defenseur["def"] * 50) + 2

    def attaquer(attaquant, defenseur, nom_attaque, dico_attaques):
        degats = int(calculer_degats(attaquant, defenseur, nom_attaque, dico_attaques))
        defenseur["hp"] = max(0, defenseur["hp"] - degats)
        print(attaquant["nom"] + " lance " + nom_attaque + " sur " + defenseur["nom"] + " ! Il inflige " + str(degats) + " dégâts.")
    ```
    </CodeDepart>
    <Enonce>
      Écrire un script principal qui :
      1. Charge le Pokédex et les Attaques.
      2. Récupère "Pikachu" et "Bulbizarre".
      3. Fait attaquer Pikachu avec "Tonnerre".
      4. Affiche les PV restants de Bulbizarre.

    <Correction>
    ```python
    pokedex = remplir_pokedex("pokedex.csv")
    attaques = charger_attaques()
    pikachu = recuperer_pokemon("Pikachu")
    bulbizarre = recuperer_pokemon("Bulbizarre")
    attaquer(pikachu, bulbizarre, "Tonnerre", attaques)
    print("PV restants de Bulbizarre :", bulbizarre["hp"])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert len(pokedex) == 4, "Le script charge le Pokédex depuis pokedex.csv."
    assert attaques.get("Tonnerre") == 40, "Le script charge les attaques depuis attaques.csv."
    bulbi = [p for p in pokedex if p["nom"] == "Bulbizarre"][0]
    assert bulbi["hp"] < 45, "Bulbizarre a perdu des PV après l'attaque de Pikachu."
    assert str(bulbi["hp"]) in SORTIE.strip().splitlines()[-1], "La dernière ligne affiche les PV restants de Bulbizarre."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
