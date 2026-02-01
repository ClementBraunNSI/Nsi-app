import csv
import random

# Pokemons
pokedex = []

def remplir_pokedex(filename):
    with open(filename,'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["nom"] != '' or pokemon_dans_pokedex(row["nom"]) == None:
                pokedex.append({"nom":row["nom"],"hp":int(row["hp"]),
                                "atq":int(row["atq"]),"def":int(row["def"]),"attaques":row["attaques"].split(";"),
                                "evolution":row["evolution"],"niveau_evolution":int(row["niveau_evolution"]),"niveau":int(row["niveau"]), "xp":int(row["xp"])})
                
def pokemon_dans_pokedex(nom:str)->dict:
    for pokemon in pokedex:
        if pokemon["nom"] == nom:
            return pokemon
    return None

def evolution(pokemon):
    if pokemon["niveau"] >= pokemon["niveau_evolution"] and pokemon["evolution"] != "":
        choix = input("Voulez vous faire évoluer votre pokemon? Oui / Non")
        if choix == "Oui":
            pokemon["nom"] = pokemon["evolution"]["nom"]
            pokemon["hp"] = pokemon["evolution"]["hp"]
            pokemon["atq"] = pokemon["evolution"]["atq"]
            pokemon["def"] = pokemon["evolution"]["def"]
            pokemon["evolution"] = pokemon["evolution"]["evolution"]
            pokemon["niveau_evolution"] = pokemon["evolution"]["niveau_evolution"]

def niveau_superieur(pokemon):
    print(0.8*(((pokemon["niveau"]+5)**3)))
    if pokemon["xp"] >= 0.8*(((pokemon["niveau"]+5)**3)):
        pokemon["xp"] = 0
        pokemon["niveau"] += 1
        evolution(pokemon)
        augmenter_stats(pokemon)

def augmenter_stats(pokemon):
        pokemon["hp"] = pokemon["hp"] + (1/50 * pokemon["hp"]*pokemon["niveau"])
        pokemon["atq"] = pokemon["atq"] + (1/50 * pokemon["atq"]*pokemon["niveau"])
        pokemon["def"] = pokemon["def"] + (1/50 * pokemon["def"]*pokemon["niveau"])

def afficher_attaques(pokemon):
    for i in range(len(pokemon["attaques"])):
        print(f"{i+1}: {pokemon['attaques'][i]}")
    


# Attaques Dex

attaques = {"tonerre":40, "queue de fer":20, "fouet lianes":10, "tranch'herbe":20}

# Gestion des combats
def retirer_hp(pokemon, malus):
    if malus > 0:
        pokemon["hp"] = pokemon["hp"] - malus

def attaquer(pokemon_attaquant, pokemon_defenseur, attaque):
    degats = attaques[attaque]
    malus = ((pokemon_attaquant["niveau"]*0.4+2)*pokemon_attaquant["atq"]*degats)/(pokemon_defenseur["def"]*50)+2
    retirer_hp(pokemon_defenseur, malus)

def choisir_attaque(pokemon,joueur):
    choix = None
    if joueur == "Joueur":
        afficher_attaques(pokemon)
        choix = int(input("Choisissez une attaque"))
    elif joueur == "Ordi":
        choix = random.randint(0,len(pokemon["attaques"]))
    return pokemon["attaques"][choix-1]

def combat_pokemon_sauvage(equipe, pokemon_sauvage):
    pokemon_actuel = equipe[0]
    equipe_index = 0
    hp_sauvage_initial = pokemon_sauvage["hp"]
    
    while True:
        # Display current battle status
        print("\n=== État du combat ===")
        print(f"Votre {pokemon_actuel['nom']} - HP: {pokemon_actuel['hp']}")
        print(f"{pokemon_sauvage['nom']} sauvage - HP: {pokemon_sauvage['hp']}")
        print("===================\n")
        
        # Player's turn
        attaque = choisir_attaque(pokemon_actuel, "Joueur")
        attaquer(pokemon_actuel, pokemon_sauvage, attaque)
        
        # Check if wild pokemon is defeated
        if pokemon_sauvage["hp"] <= 0:
            print(f"\nVictoire! Le {pokemon_sauvage['nom']} sauvage est K.O!")
            pokemon_actuel["xp"] += pokemon_sauvage["xp"] * (pokemon_sauvage["niveau"]/7)
            niveau_superieur(pokemon_actuel)
            pokemon_sauvage["hp"] = hp_sauvage_initial  # Reset HP for future battles
            return True
            
        # Wild pokemon's turn
        attaque = choisir_attaque(pokemon_sauvage, "Ordi")
        attaquer(pokemon_sauvage, pokemon_actuel, attaque)
        
        # Check if current pokemon is defeated
        if pokemon_actuel["hp"] <= 0:
            print(f"\nVotre {pokemon_actuel['nom']} est K.O!")
            equipe_index += 1
            
            # Check if there are more pokemon in the team
            if equipe_index >= len(equipe):
                print("\nDéfaite! Tous vos pokémons sont K.O!")
                pokemon_sauvage["hp"] = hp_sauvage_initial  # Reset HP for future battles
                return False
            
            pokemon_actuel = equipe[equipe_index]
            print(f"\n{pokemon_actuel['nom']} entre dans le combat!")
        
# Carte

carte = [["." for _ in range(20)] for _ in range(10)]

def afficher_carte(carte):
    s = ""
    for ligne in carte:
        for case in ligne:
            s+=case
        s+="\n"
    print(s)

def ajouter_joueur(joueur,i,j,carte):
    if i<0 or i>=len(carte) or j<0 or j>=len(carte[0]) or carte[i][j] != ".":
        print("Position invalide")
    else :
        carte[i][j] = joueur

# Joueur
def ajouter_pokemon_equipe(joueur,pokemon_a_ajouter):
    if len(joueur["equipe"]) <= 6:
        for pokemon in pokedex:
            if pokemon["nom"] == pokemon_a_ajouter:
                joueur["equipe"].append(pokemon)
                return
    else:
        print("Equipe pleine")

def afficher_equipe(joueur):
    for pokemon in joueur["equipe"]:
        print(f"{pokemon['nom']} :\n {pokemon['hp']} hp\n {pokemon['atq']} atq\n {pokemon['def']} def\n Niveau :{pokemon['niveau']} \n {pokemon["xp"]}:xp")

def encyclopedies_attaques():
    with open("attaques.csv",'r') as f:
        attaques = []
        reader = csv.DictReader(f)
        for row in reader:
            attaques.append({row["nom_attaque"]:row["degats"]})
    return attaques


# Tests
remplir_pokedex("pokedex.csv")
encyclopedie_attaque= encyclopedies_attaques()
print(encyclopedie_attaque)
joueur_1 = {"nom":"Joueur 1", "equipe":[]}
ajouter_pokemon_equipe(joueur_1,"Pikachu")
afficher_equipe(joueur_1)

pokemon_sauvage = pokedex[1]
pokemon_sauvage["xp"] = 5000

#combat_pokemon_sauvage(joueur_1["equipe"][0], pokemon_sauvage)