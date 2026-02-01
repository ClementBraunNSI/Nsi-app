---
title: "Projet - PokéNSI"
description: "Création d'un jeu inspiré de Pokémon en Python"
level: premiere
chapter: "Projets"
icon: "👾"
badgeId: "premiere_pokensi"
---


# Projet - PokéNSI (Partie 1) 🎮

Le but de ce projet est de créer un jeu inspiré de Pokémon en utilisant Python.
Dans cette première partie, nous allons nous concentrer sur la création du Pokédex et la mise en place du système de combat.

Ressources :
- [Code source principal](resources/pokensi_main.py)
- [Base de données Pokedex](resources/pokedex.csv)
- [Base de données Attaques](resources/attaques.csv)

## Le Pokédex 📱

Le Pokédex est une base de données qui contient tous les Pokémon du jeu. Chaque Pokémon possède les caractéristiques suivantes :

- nom (chaîne de caractères) 📝  
- hp (points de vie) ❤️  
- atq (points d'attaque) ⚔️  
- def (points de défense) 🛡️  
- attaques (liste des attaques disponibles) 💥  
- evolution (nom du Pokémon évolué) ✨  
- niveau_evolution (niveau requis pour évoluer) 📈  
- niveau (niveau actuel du Pokémon) 📊  
- xp (points d'expérience) ⭐  

### Création du Pokédex 🛠️

!!! question "Création du Pokédex"
    **Créer une liste vide `pokedex` qui contiendra tous les Pokémon du jeu.**

!!! question "Remplissage du Pokédex"
    On dispose de la fonction `remplir_pokedex` suivante. Elle permet de récupérer toutes les informations des pokemons pour en faire une liste de dictionnaires.

    ```python
    def remplir_pokedex(filename:str)->list:
        pokedex = []
        with open(filename,'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["nom"] != '' or pokemon_dans_pokedex(row["nom"]) == None:
                    pokedex.append({"nom":row["nom"],"hp":int(row["hp"]),
                                    "atq":int(row["atq"]),"def":int(row["def"]),"attaques":row["attaques"].split(";"),
                                    "evolution":row["evolution"],"niveau_evolution":int(row["niveau_evolution"]),"niveau":int(row["niveau"]), "xp":int(row["xp"])})
        return pokedex
    ```

    Vous utiliserez le fichier csv suivant : [pokedex.csv](resources/pokedex.csv).
    Vous retrouverez comment importer un fichier `csv` dans le cours sur le [Traitement de tables](../../05_Dictionnaires_et_Traitement_de_tables/2_Traitement_Tables_CSV.md) (Lien à vérifier selon la structure finale).

!!! question "Créer un Pokemon 🔍"
    **Créer la fonction `creer_pokemon` qui prend en paramètre un nom de Pokémon (str) et renvoie le dictionnaire correspondant au Pokémon s'il existe dans le pokédex, None sinon.**

!!! example "Test du Pokédex ✅"
    **Tester vos fonctions de création du Pokédex :**
    1. Créer le Pokédex vide  
    2. Remplir le Pokédex avec le fichier CSV fourni  
    3. Afficher tous les Pokémon du Pokédex pour vérifier leur importation  
    4. Tester la fonction `pokemon_dans_pokedex` avec "Pikachu" puis avec "Mewtwo"  

## Le système de combat ⚔️

### Les attaques 💥

!!! question "Dictionnaire d'attaques"
    L'ensemble des attaques des pokemons est disponible dans le fichier CSV suivant [Attaques des pokemons](resources/attaques.csv).
    Le bloc de code suivant permet de créer le dictionnaire des attaques à l'instar des pokemon ci dessus:

    ```python
    def encyclopedies_attaques():
        with open("resources/attaques.csv",'r') as f:
            attaques = []
            reader = csv.DictReader(f)
            for row in reader:
                attaques.append({row["nom_attaque"]:int(row["degats"])})
        return attaques
    ```

### Gestion des dégâts 💢

Lors d'un combat, un pokemon doit en attaquer un autre avec une attaque. Cette attaque retire des points de vie au pokemon et les dégats sont calculés suivant la formule ci-après :  

$$
\texttt{dégats}=\frac{(((N \times 0.4)+2) \times \texttt{Atq} \times \texttt{Deg})}{\texttt{Def} \times 50}+2
$$

Avec :

- N : Niveau du Pokémon attaquant 📊  
- Atq : L'attaque du pokemon attaquant ⚔️  
- Deg : Les dégats de base de l'attaque reçue 💥  
- Def : La défense du pokémon défenseur 🛡️  

!!! question "Gestion des points de vie  ❤️"
    **Créer la fonction `retirer_hp` qui prend en paramètre un Pokémon et un malus, et retire ces points de vie au Pokémon si les dégats est positif, c'est-à-dire si le pokemon defenseur réussit à `tanker` les dégats.**

!!! question "Système d'attaque ⚔️"
    **Créer la fonction `attaquer` qui prend en paramètre un Pokémon attaquant, un Pokémon défenseur et une attaque.**  
    Cette fonction doit :  
    1. Récupérer les dégâts de base de l'attaque  
    2. Calculer les dégâts finaux selon la formule précédente  
    3. Retirer les points de vie au défenseur  

!!! example "Test d'une attaque ⚡"
    1. Créer un Pikachu niveau 1.  
    2. Créer un Bulbizarre niveau 1.  
    3. Faire attaquer le Bulbizarre par le Pikachu grâce à son attaque `Tonnerre`.  
    4. Afficher les point de vie du Bulbizarre pour vérifier le bon fonctionnement.  
