---
title: SQL & Bases de Données
description: Interroger et manipuler les données relationnelles
level: TNSI
chapter: Bases de Données
icon: "\U0001F4BE"
prerequisites:
  - bdd_modele_relationnel
---

# 💾 SQL & Bases de Données

## Interroger et manipuler les données relationnelles

## 1. Introduction aux Bases de Données Relationnelles

### Structure d'une Table

Une base de données relationnelle organise l'information sous forme de **tables** (ou relations).
Chaque table est composée de :

- **Colonnes** (attributs) : définissent le type de données
- **Lignes** (enregistrements) : contiennent les données
- **Clé primaire** : identifie de manière unique chaque ligne

### Exemple de table "Etudiants"

| id | nom | prenom | age | classe |
|----|-----|--------|-----|--------|
| 1 | Martin | Alice | 17 | 1ère |
| 2 | Dupont | Bob | 18 | 1ère |
| 3 | Durand | Claire | 17 | Terminale |

## 2. Langage SQL - Commandes de base

### CREATE TABLE - Créer une table

```sql
CREATE TABLE etudiants (
    id INTEGER PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    age INTEGER,
    classe VARCHAR(20)
);
```

### INSERT - Ajouter des données

```sql
INSERT INTO etudiants (nom, prenom, age, classe)
VALUES ('Martin', 'Alice', 17, '1ère');

INSERT INTO etudiants (nom, prenom, age, classe)
VALUES ('Dupont', 'Bob', 18, '1ère');
```

### SELECT - Lire des données

```sql
-- Tous les étudiants
SELECT * FROM etudiants;

-- Seulement certains champs
SELECT nom, prenom FROM etudiants;

-- Avec condition
SELECT * FROM etudiants WHERE age > 17;

-- Trier les résultats
SELECT * FROM etudiants ORDER BY nom;
```

### UPDATE - Modifier des données

```sql
UPDATE etudiants 
SET age = 18 
WHERE nom = 'Martin' AND prenom = 'Alice';
```

### DELETE - Supprimer des données

```sql
DELETE FROM etudiants 
WHERE id = 3;
```

## 3. Requêtes Avancées

### Opérateurs de comparaison

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `=` | Égal | `WHERE nom = 'Martin'` |
| `!=` ou `<>` | Différent | `WHERE age != 17` |
| `>` | Supérieur | `WHERE age > 17` |
| `<` | Inférieur | `WHERE age < 18` |
| `>=` | Supérieur ou égal | `WHERE age >= 18` |
| `<=` | Inférieur ou égal | `WHERE age <= 17` |

### Opérateurs logiques

```sql
-- ET logique (AND)
SELECT * FROM etudiants 
WHERE age > 17 AND classe = '1ère';

-- OU logique (OR)
SELECT * FROM etudiants 
WHERE age = 17 OR age = 18;

-- Négation (NOT)
SELECT * FROM etudiants 
WHERE NOT age = 17;
```

### Fonctions d'agrégation

```sql
-- Nombre total d'étudiants
SELECT COUNT(*) FROM etudiants;

-- Moyenne d'âge
SELECT AVG(age) FROM etudiants;

-- Âge minimum et maximum
SELECT MIN(age), MAX(age) FROM etudiants;

-- Somme des âges
SELECT SUM(age) FROM etudiants;
```

## 4. Exemple pratique

```sql
-- Créer une table de notes
CREATE TABLE notes (
    id INTEGER PRIMARY KEY,
    etudiant_id INTEGER,
    matiere VARCHAR(30),
    note DECIMAL(4,2),
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id)
);

-- Ajouter des notes
INSERT INTO notes (etudiant_id, matiere, note)
VALUES (1, 'Mathématiques', 15.50);

-- Afficher les notes avec les noms des étudiants
SELECT e.nom, e.prenom, n.matiere, n.note
FROM etudiants e, notes n
WHERE e.id = n.etudiant_id;
```

!!! info "Bonnes pratiques"
    - Toujours spécifier les colonnes dans INSERT
    - Utiliser des noms de table et colonnes explicites
    - Tester les requêtes sur des données d'exemple
    - Sauvegarder régulièrement la base de données
