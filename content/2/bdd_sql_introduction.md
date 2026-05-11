---
title: "Bases de données et SQL"
description: "Introduction aux bases de données relationnelles et au langage de requête SQL"
level: premiere
chapter: Dictionnaires et Tables
icon: "🗄️"
badgeId: "premiere_intro_bases_donnees_sql"
---


# Introduction aux bases de données et au langage SQL

## Introduction aux Bases de Données

### Qu'est-ce qu'une Base de Données ?

Une **base de données** est un ensemble organisé d'informations structurées de manière à pouvoir être facilement accessible, gérée et mise à jour.
On peut associer cela à un grand tableau organisé en colonnes, nommées attributs (à l'instar des fichiers CSV).

### Pourquoi utiliser une Base de Données ?

Le but principal des bases de données est de faciliter :

*   **Le stockage organisé** : Les informations sont rangées de façon structurée, souvent sous forme de tables, ce qui facilite la gestion.
*   **La recherche efficace** : On peut rapidement trouver des données spécifiques grâce à des requêtes.
*   **La maintenance** : On peut mettre à jour ou supprimer des informations de façon sécurisée.
*   **L'intégrité et la sécurité des données** : Les bases de données relationnelles assurent que les données sont fiables et protégées.

## Historique des Bases de Données Relationnelles

### Origines

Dans les années 1960, les bases de données étaient très basiques et souvent peu optimisées.
En 1970, **Edgar F. Codd** propose le **modèle relationnel**. Son idée était de simplifier la gestion des données en les organisant sous forme de tables reliées par des relations logiques.

### Le modèle relationnel

Dans ce modèle, les données sont organisées en **tables**.
Une table est constituée de :

*   **Lignes** (ou enregistrements) : Chaque ligne représente un élément unique (par exemple, un étudiant).
*   **Colonnes** (ou attributs) : Chaque colonne décrit une caractéristique de cet élément (par exemple, le nom, l'âge, la classe).

#### Exemple d'une table `Etudiants`

<SqlTable 
  tableName="Etudiants" 
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale');"
/>

## Introduction au SQL

### Qu'est-ce que le SQL ?

Le **SQL** (Structured Query Language) est le langage utilisé pour interagir avec une base de données relationnelle. Il permet de **poser des questions** à la base de données et d'obtenir des réponses sous forme de tables. On parle de **requêtes SQL** pour désigner ces questions.

Le SQL permet de réaliser des requêtes de demande de données suivant des critères plus facilement et de manière plus sécurisée en communiquant avec une base de données normalisée.

### Projeter des données : SELECT

La commande `SELECT` permet de **récupérer des lignes spécifiques** (appelés **enregistrements**) d'une table.

!!! warning "Attention"
    Il ne faut pas confondre la commande SELECT avec la sélection. Sélectionner des données revient à réaliser une projection **avec des contraintes**.

#### Exemple : Obtenir toutes les informations des étudiants

```sql
SELECT * FROM Etudiants;
```
`SELECT *` signifie "retourner toutes les colonnes". `FROM Etudiants` indique que l'on travaille avec la table Etudiants.

#### Exemple : Afficher uniquement le nom et l'âge

```sql
SELECT nom, age FROM Etudiants;
```

## Sélectionner des attributs avec WHERE

Pour sélectionner les valeurs suivant des contraintes / conditions, on doit ajouter à notre requête le mot-clef `WHERE` avec une condition à la suite.

#### Exemple : Étudiants de plus de 17 ans

```sql
SELECT nom FROM Etudiants WHERE age > 17;
```
Ici, on veut afficher le nom des étudiants avec l'instruction `SELECT nom FROM Etudiants` mais en ajoutant la contrainte `WHERE age > 17` permet d'obtenir tous les noms uniquement de ceux ayant plus de 17 ans.

## Pratiquer le SQL

Voici un éditeur SQL interactif pour tester vos requêtes sur la table `Etudiants`.

<SqlEditor 
  title="Éditeur SQL Interactif" 
  description="Testez vos requêtes SELECT ici."
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale'); INSERT INTO Etudiants VALUES (4, 'David', 16, 'Première'); INSERT INTO Etudiants VALUES (5, 'Eve', 17, 'Terminale');"
  defaultQuery="SELECT * FROM Etudiants WHERE age >= 17;"
/>

## Activité : SQL Murder Mystery

Pour appliquer cela, vous pouvez vous diriger vers le site "SQL Murder Mystery" qui permet de résoudre une enquête d'un crime à l'aide de bases de données et de requête en langage SQL.
*(Attention, le site est uniquement en anglais)*.

[Accéder à SQL Murder Mystery](https://mystery.knightlab.com)
