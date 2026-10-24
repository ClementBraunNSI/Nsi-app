---
title: SQL & Bases de Données
description: Interroger et manipuler les données relationnelles
level: TNSI
order: 60
chapter: Bases de Données
icon: "\U0001F4BE"
badgeId: terminale_sql_cours
prerequisites:
  - bdd_modele_relationnel
audience: public
---

# SQL

Le modèle relationnel a posé les tables, les clés, les contraintes. **SQL** est le langage qui les crée, les remplit et les interroge. On ne parcourt pas la table avec une boucle dans le programme : on décrit le résultat voulu, et le SGBD décide comment le calculer.

Une table a des **colonnes**, les attributs, et des **lignes**, les enregistrements. La **clé primaire** identifie chaque ligne. Voici une table d'élèves sur laquelle toutes les requêtes de la page vont s'appuyer.

| id | nom | prenom | age | classe |
|----|-----|--------|-----|--------|
| 1 | Martin | Alice | 17 | 1ère |
| 2 | Dupont | Bob | 18 | 1ère |
| 3 | Durand | Claire | 17 | Terminale |

## Créer, insérer, lire, modifier, supprimer

`CREATE TABLE` déclare les colonnes et leurs domaines. `INTEGER` est un entier, `VARCHAR(50)` un texte d'au plus 50 caractères. `PRIMARY KEY` désigne la clé primaire : le SGBD refusera deux lignes avec le même `id`.

```sql
CREATE TABLE etudiants (
    id INTEGER PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    age INTEGER,
    classe VARCHAR(20)
);
```

`INSERT` ajoute une ligne. On nomme les colonnes, puis les valeurs dans le même ordre. Nommer les colonnes évite qu'une valeur atterrisse dans le mauvais champ le jour où l'ordre de la table change. Ici `id` n'est pas dans la liste : selon le SGBD, il peut être attribué automatiquement, ou devoir être fourni. Dans les exemples qui suivent, Alice a l'id 1 et Bob l'id 2, comme dans la table ci-dessus.

```sql
INSERT INTO etudiants (nom, prenom, age, classe)
VALUES ('Martin', 'Alice', 17, '1ère');

INSERT INTO etudiants (nom, prenom, age, classe)
VALUES ('Dupont', 'Bob', 18, '1ère');
```

`SELECT` lit. L'étoile demande toutes les colonnes. Une liste de noms n'en garde que quelques-unes : c'est une projection. `WHERE` filtre les lignes : c'est une sélection. `ORDER BY` trie le résultat, sans modifier la table.

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

Les chaînes se comparent entre quotes simples. `age > 17` ne garde que Bob dans la table d'exemple. Alice et Claire ont 17 ans, la condition est stricte.

`UPDATE` modifie les lignes qui passent le `WHERE`. Sans `WHERE`, toutes les lignes sont modifiées. On relit la clause avant d'exécuter.

```sql
UPDATE etudiants 
SET age = 18 
WHERE nom = 'Martin' AND prenom = 'Alice';
```

`DELETE` retire des lignes. Ici, seulement celle dont l'id vaut 3. Sans `WHERE`, la table se vide, et la structure, elle, reste.

```sql
DELETE FROM etudiants 
WHERE id = 3;
```

## Comparer et combiner

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `=` | Égal | `WHERE nom = 'Martin'` |
| `!=` ou `<>` | Différent | `WHERE age != 17` |
| `>` | Supérieur | `WHERE age > 17` |
| `<` | Inférieur | `WHERE age < 18` |
| `>=` | Supérieur ou égal | `WHERE age >= 18` |
| `<=` | Inférieur ou égal | `WHERE age <= 17` |

`AND` exige les deux conditions. `OR` en exige une. `NOT` inverse. Les parenthèses lèvent le doute quand `AND` et `OR` se mélangent : `AND` est prioritaire, comme le ET logique devant le OU.

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

Les fonctions d'agrégation résument une colonne au lieu de renvoyer les lignes. `COUNT(*)` compte les lignes. `AVG` moyenne, `MIN` et `MAX` cherchent les extrêmes, `SUM` additionne. Le résultat est une seule ligne, sauf si un `GROUP BY` redécoupe la table en groupes. On n'en a pas besoin pour les requêtes ci-dessous.

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

## Relier deux tables

Une note ne recopie pas le nom de l'élève. Elle porte `etudiant_id`, clé étrangère vers `etudiants(id)`. `DECIMAL(4,2)` est un décimal : quatre chiffres au plus, dont deux après la virgule. 15,50 tient. 100,00 ne tient pas.

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

La dernière requête est une **jointure implicite**. La virgule dans le `FROM` fabrique toutes les combinaisons d'une ligne d'élève et d'une ligne de note, et le `WHERE` ne garde que celles où les clés coïncident. On préfère l'écrire avec `JOIN`, qui montre le lien dans la requête au lieu de le cacher parmi les filtres.

```sql
-- INNER JOIN : uniquement les lignes qui ont une correspondance des deux côtés
SELECT e.nom, e.prenom, n.matiere, n.note
FROM etudiants e
INNER JOIN notes n ON e.id = n.etudiant_id;

-- LEFT JOIN : tous les étudiants, même sans note
SELECT e.nom, n.matiere, n.note
FROM etudiants e
LEFT JOIN notes n ON e.id = n.etudiant_id;
```

`INNER JOIN` ne garde que les appariements. Un élève sans note disparaît. `LEFT JOIN` garde **toutes** les lignes de la table de gauche, ici les élèves. S'il n'y a pas de note, les colonnes de `notes` valent `NULL`. `RIGHT JOIN` fait le symétrique : toutes les lignes de la table de droite, et `NULL` à gauche quand rien ne correspond.

| Type | Résultat |
| --- | --- |
| `INNER JOIN` | Intersection : lignes appariées |
| `LEFT JOIN` | Toutes les lignes de la table de gauche + correspondances à droite |
| `RIGHT JOIN` | Symétrique de `LEFT JOIN` |

L'alias `e` pour `etudiants` et `n` pour `notes` évite de réécrire le nom de la table devant chaque colonne. Il devient indispensable quand les deux tables ont une colonne `id`.

!!! tip "Programme Terminale"
    Savoir lire et écrire un `JOIN` sur deux tables liées par une clé étrangère est attendu à l'épreuve pratique.

!!! info "Bonnes pratiques"
    - Toujours spécifier les colonnes dans INSERT
    - Utiliser des noms de table et colonnes explicites
    - Tester les requêtes sur des données d'exemple
    - Sauvegarder régulièrement la base de données
