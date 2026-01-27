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
