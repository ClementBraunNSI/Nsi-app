---
title: "Exercices - Données Structurées"
description: "Exercices sur les formats CSV, JSON et les bases de données"
level: "seconde"
chapter: 7
icon: "clipboard-list"
---

# Exercice 1 : Découverte des formats de données

**Objectif :** Identifier les différents formats de données structurées.

Associez chaque format à sa description :

| Format | Description |
|--------|-------------|
| A. CSV | 1. Format hiérarchique utilisant des paires clé-valeur |
| B. JSON | 2. Format tabulaire avec séparateurs |
| C. XML | 3. Format de balisage pour documents structurés |
| D. SQL | 4. Langage pour interroger les bases de données |

# Exercice 2 : Manipulation du format CSV

**Contexte :** Vous disposez d'un fichier CSV contenant des informations sur des animaux.

```csv
Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Renard roux,Forêt tempérée,6.5,58
Luna,Chouette hulotte,Forêt mixte,0.8,35
Max,Sanglier,Forêt dense,85,120
Bella,Biche,Clairière,45,95
```

1.  Combien d'animaux sont répertoriés dans ce fichier ?
2.  Quels sont les champs (colonnes) de ce fichier CSV ?
3.  Quel animal pèse le plus lourd ?
4.  Ajoutez une ligne pour un écureuil nommé "Noisette" de l'espèce "Écureuil roux", vivant en "Forêt de conifères", pesant 0.3 kg et mesurant 20 cm.

# Exercice 3 : Découverte du format JSON

**Contexte :** Voici la fiche d'un renard au format JSON :

```json
{
  "nom": "Rusty",
  "espece": "Vulpes vulpes",
  "caracteristiques": {
    "poids": 6.5,
    "longueur": 58,
    "couleur": "roux"
  },
  "habitat": {
    "type": "Forêt tempérée",
    "region": "Europe"
  },
  "alimentation": ["rongeurs", "oiseaux", "fruits"]
}
```

1.  Quelle est la couleur de Rusty ?
2.  Dans quelle région vit-il ?
3.  Combien d'aliments différents consomme-t-il ?
4.  Quel type de données représente le champ "alimentation" ? (Objet, Tableau, Chaîne, Nombre ?)
5.  Ajoutez un champ "age" avec la valeur 3 dans les caractéristiques de Rusty.

# Exercice 4 : Bases de données relationnelles

**Contexte :** Une réserve naturelle utilise une base de données pour gérer ses animaux.

**Table "Animaux" :**
| ID | Nom | Espece_ID | Poids | Date_arrivee |
|----|-----|-----------|-------|-------------|
| 1 | Rusty | 1 | 6.5 | 2023-03-15 |
| 2 | Luna | 2 | 0.8 | 2023-04-20 |
| 3 | Max | 3 | 85 | 2023-02-10 |

**Table "Especes" :**
| ID | Nom_espece | Famille | Regime |
|----|------------|---------|--------|
| 1 | Renard roux | Canidés | Omnivore |
| 2 | Chouette hulotte | Strigidés | Carnivore |
| 3 | Sanglier | Suidés | Omnivore |

1.  Quel est le rôle de la colonne "Espece_ID" dans la table "Animaux" ?
2.  À quelle famille appartient Rusty ?
3.  Combien d'animaux omnivores y a-t-il dans la réserve ?
4.  Écrivez une requête SQL simple pour afficher tous les noms d'animaux : `SELECT _____ FROM _____;`

# Exercice 5 : Métadonnées

**Contexte :** Voici un exemple de métadonnées pour un fichier de données :

```json
{
  "fichier": "animaux_foret.csv",
  "description": "Inventaire des animaux de la forêt de Fontainebleau",
  "date_creation": "2024-01-15",
  "auteur": "Service des Eaux et Forêts",
  "nombre_lignes": 150,
  "colonnes": [
    {"nom": "espece", "type": "texte"},
    {"nom": "poids", "type": "nombre"}
  ]
}
```

1.  Que sont les métadonnées ?
2.  Combien d'animaux sont répertoriés dans ce fichier ?
3.  Qui a créé ce fichier de données ?
4.  Pourquoi est-il important d'avoir des métadonnées ?

# Exercice 6 : Applications pratiques

1.  Donnez un exemple d'utilisation des données structurées dans :
    - La domotique
    - La santé
    - Le commerce en ligne
    - Les réseaux sociaux

2.  Pour gérer une bibliothèque, quels formats utiliseriez-vous pour :
    - Stocker la liste des livres
    - Configurer l'application
    - Rechercher des livres
    - Échanger des données avec d'autres bibliothèques
