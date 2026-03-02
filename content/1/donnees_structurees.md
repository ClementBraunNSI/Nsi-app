---
title: "Données Structurées"
description: "Comprendre les formats de données (CSV, JSON) et les bases de données"
level: "seconde"
chapter: "Données structurées"
icon: "🗄️"
---

# 1. Introduction

La nécessité d'organiser et de structurer les données remonte aux premiers systèmes informatiques. Aujourd'hui, les données structurées permettent de gérer des milliards d'informations pour alimenter des applications, des sites web ou des systèmes d'intelligence artificielle.

> **Définition** : **Une donnée structurée** est une information organisée selon un format prédéfini qui facilite son stockage, sa recherche et son traitement automatique par les machines.

On distingue deux catégories principales :
- **Données tabulaires** : organisées en lignes et colonnes (ex: CSV).
- **Données hiérarchiques** : organisées en arbre avec des niveaux de profondeur (ex: JSON).

# 2. Les formats de données

| Format | Rôle | Exemple d'usage |
|----------|-------------------------------|-----------------------|
| **CSV** | Format tabulaire simple | Tableurs, exports de données |
| **JSON** | Format hiérarchique pour structures complexes | APIs web, configuration |
| **XML** | Format de balisage pour documents structurés | Documents officiels, échange |
| **SQL** | Langage pour interroger les bases de données | Requêtes, rapports |

## 2.1 Le format CSV (Données tabulaires)

Le format **CSV** (Comma-Separated Values) utilise des séparateurs (souvent des virgules ou des points-virgules) pour délimiter les colonnes.
Il commence souvent par une ligne d'en-tête.

**Exemple : Base de données sur les renards**

```csv
Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61
```

## 2.2 Le format JSON (Données hiérarchiques)

Le format **JSON** (JavaScript Object Notation) permet de représenter des objets complexes avec des relations internes.
Il est constitué de paires **clé-valeur**.

> **Note** : Le JSON est très utilisé sur le web car il est léger et lisible par les humains et les machines.

**Exemple : Fiche détaillée d'un renard**

```json
{
  "renard": {
    "nom": "Rusty",
    "espece": "Vulpes vulpes",
    "caracteristiques": {
      "poids": 6.5,
      "longueur": 58,
      "couleur": "roux",
      "age": 3
    },
    "habitat": {
      "type": "Forêt tempérée",
      "region": "Europe",
      "coordonnees": {
        "latitude": 48.8566,
        "longitude": 2.3522
      }
    },
    "alimentation": ["rongeurs", "oiseaux", "insectes", "fruits"]
  }
}
```

# 3. Les Bases de Données Relationnelles

Pour gérer de grands volumes de données, on utilise des **bases de données**.
Le **modèle relationnel** organise les données en **tables** liées entre elles.

### Concepts clés :
- **Table** : Structure organisée en lignes (enregistrements) et colonnes (champs).
- **Relation** : Lien entre les tables (via des clés étrangères).
- **SQL** : Langage standard pour interroger et manipuler les données.

**Exemple : Table "Renards"**

| ID | Nom | Espèce | Habitat | Poids (kg) | Région |
|----|-----|--------|---------|------------|--------|
| 1 | Rusty | Vulpes vulpes | Forêt | 6.5 | Europe |
| 2 | Arctic | Vulpes lagopus | Toundra | 3.2 | Arctique |
| 3 | Fennec | Vulpes zerda | Désert | 1.5 | Afrique |
| 4 | Silver | Vulpes vulpes | Forêt | 7.1 | Amérique |

# 3.5 Traitement des données

Une fois les données structurées dans une table, on peut effectuer des opérations pour en extraire de l'information.

### Les opérations de base :
1. **Trier** : Ordonner les données (ex: du plus petit au plus grand).
2. **Filtrer** : Ne garder que les données qui nous intéressent (ex: seulement les monstres de type Feu).
3. **Calculer** : Faire des statistiques (ex: moyenne des niveaux).

Essayez de manipuler cette base de données de monstres :

<DataProcessor />

# 4. Le Cloud Computing

> **☁️ Définition**
>
> Le **Cloud Computing** (ou informatique en nuage) consiste à utiliser des serveurs informatiques distants via Internet pour stocker des données ou exécuter des applications, plutôt que de le faire sur son propre disque dur.

### 🏠 Local vs ☁️ Cloud

- **Stockage Local** : Vos fichiers sont sur votre ordinateur/téléphone. Si vous le perdez, vous perdez tout.
- **Stockage Cloud** : Vos fichiers sont envoyés dans des **Data Centers** (immenses usines à serveurs). Ils sont dupliqués pour ne jamais être perdus.

<CloudArchitecture />

> **⚠️ Enjeu de souveraineté**
>
> La plupart des géants du Cloud (Google, Amazon, Microsoft) sont américains. Cela pose la question de la confidentialité : qui a le droit de regarder vos données stockées chez eux ? (cf. le *Cloud Act* américain).

# 5. Données Personnelles et RGPD

> **🛡️ RGPD (Règlement Général sur la Protection des Données)**
>
> Depuis 2018, ce règlement européen protège votre vie privée. Il impose des règles strictes aux entreprises qui collectent vos données.

En tant que citoyen européen, vous disposez de **droits fondamentaux** sur vos données.

<RgpdRights />

# 6. Big Data et Open Data

### 🌊 Big Data (Mégadonnées)

Quand le volume de données devient si grand qu'il est impossible de le traiter avec des outils classiques (comme Excel), on parle de **Big Data**.
Ces données proviennent de nos smartphones, des réseaux sociaux, des objets connectés, des satellites...

Le Big Data est caractérisé par la règle des **3V** :
1.  **Volume** : La quantité de données est gigantesque (Téraoctets, Pétaoctets).
    *   *Exemple : YouTube reçoit 500 heures de vidéo chaque minute.*
2.  **Variété** : Les données sont de toutes formes (Texte, images, sons, géolocalisation, clics...).
    *   *Exemple : Facebook analyse vos photos, vos messages et vos likes en même temps.*
3.  **Vélocité** : La vitesse à laquelle les données sont créées et doivent être analysées en temps réel.
    *   *Exemple : Les algorithmes de trading en bourse décident en quelques millisecondes.*

### 🔓 Open Data (Données Ouvertes)

L'**Open Data** est une démarche politique et citoyenne qui consiste à mettre des données numériques **gratuitement à la disposition de tous**, sans restriction de droit d'auteur.

C'est souvent l'État ou les collectivités qui ouvrent leurs données pour favoriser la transparence et l'innovation.

*   **Exemple 1** : La RATP partage les horaires de bus en temps réel -> L'application *Citymapper* les utilise pour vous guider.
*   **Exemple 2** : La base de données des produits alimentaires -> L'application *Yuka* l'utilise pour noter vos courses.

> 🌍 **Ressource** : Visitez [data.gouv.fr](https://www.data.gouv.fr), la plateforme officielle des données publiques françaises.
