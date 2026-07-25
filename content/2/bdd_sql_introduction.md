---
title: "Bases de données et SQL"
description: "Introduction aux bases de données relationnelles et au langage de requête SQL"
level: premiere
chapter: Dictionnaires et Tables
icon: "🗄️"
badgeId: "premiere_intro_bases_donnees_sql"
---

# Introduction aux bases de données et au langage SQL

## Objectifs

- Expliquer ce qu'est une base de données relationnelle (tables, lignes, colonnes).
- Distinguer **projection** (`SELECT` colonnes) et **sélection** (`WHERE`).
- Écrire des requêtes `SELECT … FROM …` simples, avec ou sans `WHERE`.
- Pratiquer avec l'éditeur intégré et une enquête SQL.

## Idée clé

Une base relationnelle organise les données en **tables**. Une requête SQL **extrait** un résultat : on choisit **quelles colonnes** garder (**projection**) et **quelles lignes** garder (**sélection**).

## Pourquoi une base de données ?

Par rapport à un simple fichier, une BDD facilite le stockage structuré, la recherche, la mise à jour et le contrôle d'intégrité. On peut la comparer à des **tableaux** (comme en CSV), mais gérés par un moteur de requêtes.

En 1970, **Edgar F. Codd** propose le **modèle relationnel** : tables reliées par des relations logiques.

### Table = lignes + colonnes

- **Ligne** (enregistrement) : un objet (un étudiant…).
- **Colonne** (attribut) : une caractéristique (nom, âge…).

<SqlTable 
  tableName="Etudiants" 
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale');"
/>

## SQL : parler à la base

Le **SQL** (Structured Query Language) sert à interroger et manipuler ces tables. Une **requête** produit en général une table résultat.

### Projection : choisir les colonnes (`SELECT`)

La **projection** consiste à ne garder que certaines **colonnes**.

```sql
SELECT * FROM Etudiants;
```

`*` = toutes les colonnes. Pour n'afficher que le nom et l'âge :

```sql
SELECT nom, age FROM Etudiants;
```

### Sélection : filtrer les lignes (`WHERE`)

La **sélection** (au sens relationnel) filtre les **lignes** selon une condition, avec `WHERE` :

```sql
SELECT nom FROM Etudiants WHERE age > 17;
```

Ici : projection sur `nom` **et** sélection des lignes où `age > 17`.

On peut combiner les deux :

```sql
SELECT nom, classe FROM Etudiants WHERE classe = 'Terminale';
```

## Pratiquer

<SqlEditor 
  title="Éditeur SQL Interactif" 
  description="Testez vos requêtes SELECT ici."
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale'); INSERT INTO Etudiants VALUES (4, 'David', 16, 'Première'); INSERT INTO Etudiants VALUES (5, 'Eve', 17, 'Terminale');"
  defaultQuery="SELECT * FROM Etudiants WHERE age >= 17;"
/>

### Activité : SQL Murder Mystery

Résolvez une enquête en écrivant des requêtes SQL (site en anglais) :

[Accéder à SQL Murder Mystery](https://mystery.knightlab.com)

## Piège fréquent

Appeler « sélection » le simple `SELECT colonne`. En vocabulaire relationnel :

- **`SELECT` colonnes** → **projection** ;
- **`WHERE`** → **sélection** (filtrage des lignes).

Le mot `SELECT` du SQL est trompeur : il lance la requête, mais le filtrage des lignes, c'est `WHERE`.

## À retenir

- Table = lignes (enregistrements) + colonnes (attributs).
- SQL = langage de requêtes sur une BDD relationnelle.
- Projection = choisir les colonnes (`SELECT nom, age`).
- Sélection = filtrer les lignes (`WHERE condition`).
- `SELECT * FROM Table` lit toute la table.
- On combine souvent projection et sélection dans une même requête.

## Pour s'entraîner / Suite

Utilisez l'éditeur ci-dessus, puis l'enquête Murder Mystery. Plus tard : jointures, agrégats, et liens avec les dictionnaires / tables déjà vus en Python.
