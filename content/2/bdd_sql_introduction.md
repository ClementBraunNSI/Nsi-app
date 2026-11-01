---
title: "Bases de données et SQL"
description: "Introduction aux bases de données relationnelles et au langage de requête SQL"
level: premiere
chapter: Dictionnaires et Tables
icon: "database"
badgeId: "premiere_intro_bases_donnees_sql"
audience: public
---

# Bases de données et SQL

Un tableur ou un fichier CSV suffit tant qu'une seule personne le modifie et que les questions restent simples. Dès que plusieurs programmes doivent lire les mêmes informations, les mettre à jour sans les casser, et n'en extraire qu'une partie, on passe à une **base de données**. En 1970, Edgar F. Codd propose le **modèle relationnel**. Les données y sont rangées dans des tables reliées entre elles, que l'on interroge avec un langage, le SQL.

Une table ressemble à un tableau. Une **ligne**, ou enregistrement, décrit un objet, par exemple un étudiant. Une **colonne**, ou attribut, correspond à une caractéristique, comme son nom, son âge ou sa classe. Le système qui gère la base ne se contente pas d'afficher ce tableau : il vérifie des contraintes et répond à des requêtes.

<SqlTable 
  tableName="Etudiants" 
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale');"
/>

## Interroger une table

Le **SQL** (*Structured Query Language*) permet d'interroger ces tables. Une requête renvoie en général une table, souvent plus petite que celle de départ. Deux opérations ont des noms précis qu'il faut bien distinguer, car le mot `SELECT` prête à confusion.

La **projection** choisit des **colonnes**. `SELECT * FROM Etudiants` garde tout : l'étoile veut dire « toutes les colonnes ». Pour ne voir que le nom et l'âge :

```sql
SELECT nom, age FROM Etudiants;
```

La **sélection**, au sens du modèle relationnel, choisit des **lignes**. En SQL, c'est `WHERE` qui le fait, pas `SELECT`.

```sql
SELECT nom FROM Etudiants WHERE age > 17;
```

Cette requête projette sur `nom` et ne garde que les lignes dont l'âge dépasse 17. Les deux opérations se combinent facilement :

```sql
SELECT nom, classe FROM Etudiants WHERE classe = 'Terminale';
```

Ce piège de vocabulaire mérite d'être souligné. En français courant, on parle volontiers de « sélectionner des colonnes ». En NSI, en revanche, la sélection consiste à filtrer des lignes. `SELECT` commence la requête et indique les colonnes voulues, tandis que le filtre est fait par `WHERE`.

## Pratiquer

<SqlEditor 
  title="Éditeur SQL Interactif" 
  description="Tester les requêtes SELECT ici."
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale'); INSERT INTO Etudiants VALUES (4, 'David', 16, 'Première'); INSERT INTO Etudiants VALUES (5, 'Eve', 17, 'Terminale');"
  defaultQuery="SELECT * FROM Etudiants WHERE age >= 17;"
/>

L'éditeur ci-dessus exécute les requêtes sur une petite table déjà remplie. Essayer de changer la condition ou d'enlever une colonne, et observer ce qui disparaît.

Pour aller plus loin, l'enquête [SQL Murder Mystery](https://mystery.knightlab.com) (en anglais) ne se résout qu'en écrivant des requêtes sur la base qui contient les informations du crime.

Viendront plus tard les jointures, qui relient deux tables, et les agrégats, qui comptent des lignes ou calculent une moyenne. On retrouve la même idée qu'avec les dictionnaires Python : une clé permet de retrouver directement une fiche, sans relire tout le fichier.
