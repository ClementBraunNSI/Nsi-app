import random
import csv

# Constantes
NB_VEHICULES = 2500  # Augmenté pour avoir plus de variété
TYPES = ["Voiture", "Moto", "CampingCar"]
ETATS = ["Disponible", "Loué", "En maintenance"]

# --- DONNÉES ENRICHIES ---

MARQUES_VOITURES = [
    "Peugeot", "Renault", "Citroën", "Toyota", "Tesla", "Volkswagen", "BMW", "Audi", "Ford", "Fiat",
    "Mercedes", "Hyundai", "Kia", "Dacia", "Skoda", "Volvo", "Nissan", "Mini", "Seat", "Opel"
]

MODELES_VOITURES = {
    "Peugeot": ["108", "208", "308", "408", "508", "2008", "3008", "5008", "Rifter"],
    "Renault": ["Twingo", "Clio", "Megane", "Captur", "Arkana", "Austral", "Espace", "Kangoo", "Zoe"],
    "Citroën": ["C1", "C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo"],
    "Toyota": ["Aygo X", "Yaris", "Yaris Cross", "Corolla", "C-HR", "RAV4", "Highlander", "bZ4X", "Prius"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "Volkswagen": ["Up!", "Polo", "Golf", "ID.3", "ID.4", "ID.5", "T-Roc", "Tiguan", "Passat", "Arteon"],
    "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "X1", "X2", "X3", "X5", "i4"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang Mach-E", "Explorer"],
    "Fiat": ["500", "500X", "Panda", "Tipo"],
    "Mercedes": ["Classe A", "Classe C", "Classe E", "CLA", "GLA", "GLB", "GLC", "EQA", "EQB"],
    "Hyundai": ["i10", "i20", "i30", "Bayon", "Kona", "Tucson", "Santa Fe", "Ioniq 5"],
    "Kia": ["Picanto", "Rio", "Ceed", "Stonic", "Niro", "Sportage", "EV6", "Sorento"],
    "Dacia": ["Sandero", "Duster", "Jogger", "Spring"],
    "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
    "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "V60"],
    "Nissan": ["Micra", "Juke", "Qashqai", "X-Trail", "Ariya", "Leaf"],
    "Mini": ["Cooper", "Cooper S", "Countryman", "Clubman"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Opel": ["Corsa", "Astra", "Mokka", "Crossland", "Grandland"]
}

MARQUES_MOTOS = [
    "Yamaha", "Kawasaki", "Honda", "BMW", "Suzuki", "Triumph", "Ducati", "KTM", "Harley-Davidson", "Royal Enfield"
]

MODELES_MOTOS = {
    "Yamaha": ["MT-07", "MT-09", "MT-10", "XSR700", "XSR900", "Tracer 7", "Tracer 9", "TMAX", "XMAX", "R1", "R6", "R7"],
    "Kawasaki": ["Z650", "Z900", "Z900RS", "Ninja 400", "Ninja 650", "Ninja 1000SX", "Versys 650", "Versys 1000"],
    "Honda": ["CB500F", "CB650R", "CB1000R", "CMX500 Rebel", "Africa Twin", "NT1100", "Gold Wing", "Forza 125", "Forza 350", "X-ADV"],
    "BMW": ["R1250GS", "R1250RT", "F750GS", "F850GS", "F900R", "F900XR", "S1000RR", "S1000XR", "R18", "CE 04"],
    "Suzuki": ["SV650", "GSX-S750", "GSX-S1000", "GSX-S1000GT", "V-Strom 650", "V-Strom 1050", "Hayabusa"],
    "Triumph": ["Street Triple", "Speed Triple", "Trident 660", "Tiger 900", "Tiger 1200", "Bonneville T100", "Bonneville T120", "Rocket 3"],
    "Ducati": ["Monster", "Scrambler", "Panigale V2", "Panigale V4", "Multistrada V4", "Diavel V4", "Streetfighter V4"],
    "KTM": ["Duke 125", "Duke 390", "Duke 890", "Super Duke 1290", "Adventure 390", "Adventure 890", "Super Adventure 1290"],
    "Harley-Davidson": ["Sportster S", "Pan America", "Fat Bob", "Low Rider S", "Street Glide", "Road Glide"],
    "Royal Enfield": ["Interceptor 650", "Continental GT 650", "Meteor 350", "Himalayan", "Classic 350"]
}

MARQUES_CC = [
    "Fiat", "Ford", "Volkswagen", "Mercedes", "Renault", "Citroën", "Peugeot", "Iveco"
]

# Modèles de base (châssis) souvent utilisés pour les Camping-Cars
MODELES_CC = {
    "Fiat": ["Ducato", "Talento", "Scudo"],
    "Ford": ["Transit Custom", "Transit 2T", "Ranger (Cellule)"],
    "Volkswagen": ["California", "Grand California", "Caddy California", "Crafter"],
    "Mercedes": ["Marco Polo", "Sprinter", "Vito"],
    "Renault": ["Trafic SpaceNomad", "Master", "Kangoo"],
    "Citroën": ["Jumper", "SpaceTourer", "Berlingo"],
    "Peugeot": ["Boxer", "Traveller", "Rifter"],
    "Iveco": ["Daily"]
}

def generate_immat():
    """Génère une plaque type AA-123-BB"""
    lettres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    l1 = random.choice(lettres) + random.choice(lettres)
    chiffres = f"{random.randint(1, 999):03d}"
    l2 = random.choice(lettres) + random.choice(lettres)
    return f"{l1}-{chiffres}-{l2}"

def generate_vehicle():
    type_vehicule = random.choices(TYPES, weights=[55, 30, 15])[0] # 55% voitures, 30% motos, 15% CC
    immat = generate_immat()
    etat = random.choices(ETATS, weights=[75, 20, 5])[0]
    
    if type_vehicule == "Voiture":
        marque = random.choice(MARQUES_VOITURES)
        if marque in MODELES_VOITURES:
            modele = random.choice(MODELES_VOITURES[marque])
        else:
            modele = "Modele Inconnu"
            
        prix = random.randint(30, 200)
        km = random.randint(500, 200000)
        # Divers1 = Nb Places, Divers2 = Clim (Oui/Non)
        divers1 = random.choice([2, 4, 5, 5, 5, 7, 9])
        divers2 = random.choices(["Oui", "Non"], weights=[90, 10])[0]
        
    elif type_vehicule == "Moto":
        marque = random.choice(MARQUES_MOTOS)
        if marque in MODELES_MOTOS:
            modele = random.choice(MODELES_MOTOS[marque])
        else:
            modele = "Modele Inconnu"
            
        prix = random.randint(40, 250)
        km = random.randint(100, 100000)
        # Divers1 = Cylindrée, Divers2 = Permis (A/A2)
        divers1 = random.choice([125, 300, 400, 500, 600, 650, 750, 800, 900, 1000, 1100, 1250, 1300, 1800])
        divers2 = "A2" if divers1 <= 700 else "A" 
        
    else: # CampingCar
        marque = random.choice(MARQUES_CC)
        if marque in MODELES_CC:
            modele = random.choice(MODELES_CC[marque])
        else:
            modele = "Cellule Standard"
            
        prix = random.randint(90, 400)
        km = random.randint(5000, 250000)
        # Divers1 = Longueur (m), Divers2 = Couchages
        divers1 = round(random.uniform(5.0, 9.0), 1)
        divers2 = random.randint(2, 7)

    return [type_vehicule, immat, marque, modele, prix, km, etat, divers1, divers2]

# Génération
print(f"Génération de {NB_VEHICULES} véhicules avec catalogue enrichi...")

try:
    with open('public/assets/ap2/flotte.csv', 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f, delimiter=';')
        writer.writerow(["Type", "Immatriculation", "Marque", "Modele", "Prix", "Km", "Etat", "Divers1", "Divers2"])
        
        for _ in range(NB_VEHICULES):
            writer.writerow(generate_vehicle())
            
    print(f"Succès ! Fichier 'public/assets/ap2/flotte.csv' généré avec {NB_VEHICULES} entrées.")
except Exception as e:
    print(f"Erreur lors de la génération : {e}")
