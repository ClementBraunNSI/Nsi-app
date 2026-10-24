---
title: "Bases de données et SQL"
description: "Introduction aux bases de données relationnelles et au langage de requête SQL"
level: premiere
chapter: Dictionnaires et Tables
icon: "🗄️"
badgeId: "premiere_intro_bases_donnees_sql"
audience: public
---

# Bases de données et SQL

Un tableur ou un fichier CSV finit par suffire tant que vous êtes seul à le modifier, et tant que la question reste simple. Dès que plusieurs programmes doivent lire les mêmes informations, les mettre à jour sans les casser, et n'en extraire qu'une partie, on passe à une **base de données**. En 1970, Edgar F. Codd propose le **modèle relationnel** : des tables, reliées par des relations logiques, interrogées par un langage. Ce langage est le SQL.

Une table ressemble à un tableau. Une **ligne**, ou enregistrement, est un objet : un étudiant, par exemple. Une **colonne**, ou attribut, est une caractéristique : son nom, son âge, sa classe. Le moteur, lui, ne se contente pas d'afficher la grille. Il vérifie des contraintes, et il répond à des questions.

<SqlTable 
  tableName="Etudiants" 
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale');"
/>

## Demander, pas parcourir

Le **SQL** (*Structured Query Language*) interroge ces tables. Une requête renvoie en général une table, parfois plus petite que celle de départ. Deux opérations portent des noms qu'il faut tenir, parce que le mot `SELECT` embrouille tout le monde.

La **projection** choisit des **colonnes**. `SELECT * FROM Etudiants` garde tout : l'étoile veut dire « toutes les colonnes ». Pour ne voir que le nom et l'âge :

```sql
SELECT nom, age FROM Etudiants;
```

La **sélection**, au sens du modèle relationnel, choisit des **lignes**. En SQL, c'est `WHERE` qui le fait, pas `SELECT`.

```sql
SELECT nom FROM Etudiants WHERE age > 17;
```

Cette requête projette sur `nom` et ne garde que les lignes dont l'âge dépasse 17. On combine les deux sans cérémonie :

```sql
SELECT nom, classe FROM Etudiants WHERE classe = 'Terminale';
```

Le piège de vocabulaire vaut le coup d'être dit à voix haute. En français courant, « sélectionner des colonnes » semble naturel. En NSI, sélectionner, c'est filtrer les lignes. `SELECT` lance la requête et annonce les colonnes. Le filtre, c'est `WHERE`.

## Pratiquer

<SqlEditor 
  title="Éditeur SQL Interactif" 
  description="Testez vos requêtes SELECT ici."
  initialSql="CREATE TABLE Etudiants (id INTEGER PRIMARY KEY, nom TEXT, age INTEGER, classe TEXT); INSERT INTO Etudiants VALUES (1, 'Alice', 17, 'Terminale'); INSERT INTO Etudiants VALUES (2, 'Bob', 16, 'Première'); INSERT INTO Etudiants VALUES (3, 'Charlie', 18, 'Terminale'); INSERT INTO Etudiants VALUES (4, 'David', 16, 'Première'); INSERT INTO Etudiants VALUES (5, 'Eve', 17, 'Terminale');"
  defaultQuery="SELECT * FROM Etudiants WHERE age >= 17;"
/>

L'éditeur ci-dessus exécute vos requêtes sur une petite table déjà remplie. Changez la condition, enlevez une colonne, regardez ce qui disparaît.

Pour aller plus loin, l'enquête [SQL Murder Mystery](https://mystery.knightlab.com) (en anglais) ne se résout qu'en écrivant des requêtes : la base contient le crime, pas le récit.

Plus tard, viendront les jointures, qui recollent deux tables, et les agrégats, qui comptent ou font une moyenne. Le lien avec les dictionnaires Python est le même geste : une clé qui retrouve une fiche, plutôt qu'une lecture de tout le fichier.
