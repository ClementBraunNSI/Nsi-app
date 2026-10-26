---
title: SQL & Bases de Données - Exercices
description: Exercices pratiques sur SQL et les bases de données
level: TNSI
order: 70
chapter: Bases de Données
icon: "save"
badgeId: terminale_sql_exos
prerequisites:
  - sql-bases-donnees
audience: public
groupe: sql
groupeTitre: "SQL et bases de données"
---

Chaque exercice s'écrit dans l'éditeur SQL. La base de l'exercice y est déjà chargée : le bouton **Exécuter** affiche le résultat de la requête, le bouton **Vérifier** le compare au résultat attendu. Chaque exécution repart de la base d'origine.

<ExerciseTabs courseId="sql-bases-donnees-exos" courseTitle="SQL & Bases de Données - Exercices">

  <ExerciseSection id="sql-0-1" label="0.1 [Introduction] - Créer la table etudiants" type="sql">
    <Enonce>
    ### Exercice 0.1 : Créer et remplir une table
    **Créer une table `etudiants` avec les colonnes :**
    - `id` (INTEGER PRIMARY KEY)
    - `nom` (VARCHAR(50))
    - `prenom` (VARCHAR(50))
    - `age` (INTEGER)

    **Puis insérer 3 étudiants :**
    - Martin Alice, 17 ans
    - Dupont Bob, 18 ans
    - Durand Claire, 17 ans

    *La base de départ est vide.*

    <Correction>
    ```sql
    CREATE TABLE etudiants (
      id INTEGER PRIMARY KEY,
      nom VARCHAR(50),
      prenom VARCHAR(50),
      age INTEGER
    );
    INSERT INTO etudiants (nom, prenom, age) VALUES ('Martin', 'Alice', 17);
    INSERT INTO etudiants (nom, prenom, age) VALUES ('Dupont', 'Bob', 18);
    INSERT INTO etudiants (nom, prenom, age) VALUES ('Durand', 'Claire', 17);
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    CREATE TABLE etudiants (id INTEGER PRIMARY KEY, nom VARCHAR(50), prenom VARCHAR(50), age INTEGER);
    INSERT INTO etudiants (nom, prenom, age) VALUES ('Martin', 'Alice', 17), ('Dupont', 'Bob', 18), ('Durand', 'Claire', 17);
    -- controle
    SELECT nom, prenom, age FROM etudiants ORDER BY nom, prenom;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-2" label="0.2 [Introduction] - Tous les étudiants" type="sql">
    <BaseSQL>
    ```sql
    CREATE TABLE etudiants (id INTEGER PRIMARY KEY, nom VARCHAR(50), prenom VARCHAR(50), age INTEGER);
    INSERT INTO etudiants VALUES (1, 'Martin', 'Alice', 17), (2, 'Dupont', 'Bob', 18), (3, 'Durand', 'Claire', 17);
    ```
    </BaseSQL>
    <Enonce>
    ### Exercice 0.2 : Tous les étudiants
    La table `etudiants(id, nom, prenom, age)` contient :

    | id | nom | prenom | age |
    |----|-----|--------|-----|
    | 1 | Martin | Alice | 17 |
    | 2 | Dupont | Bob | 18 |
    | 3 | Durand | Claire | 17 |

    **Afficher toutes les colonnes de tous les étudiants.**

    <Correction>
    ```sql
    SELECT * FROM etudiants;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM etudiants;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-3" label="0.3 [Introduction] - Noms et prénoms" type="sql">
    <Enonce>
    ### Exercice 0.3 : Noms et prénoms
    Table `etudiants(id, nom, prenom, age)`.

    **Afficher seulement le nom et le prénom de chaque étudiant.**

    <Correction>
    ```sql
    SELECT nom, prenom FROM etudiants;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT nom, prenom FROM etudiants;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-4" label="0.4 [Introduction] - Les étudiants de 17 ans" type="sql">
    <Enonce>
    ### Exercice 0.4 : Les étudiants de 17 ans
    Table `etudiants(id, nom, prenom, age)`.

    **Afficher toutes les colonnes des étudiants qui ont 17 ans.**

    <Correction>
    ```sql
    SELECT * FROM etudiants WHERE age = 17;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM etudiants WHERE age = 17;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-5" label="0.5 [Introduction] - Les noms en D" type="sql">
    <Enonce>
    ### Exercice 0.5 : Les noms qui commencent par D
    Table `etudiants(id, nom, prenom, age)`.

    **Afficher toutes les colonnes des étudiants dont le nom commence par la lettre `D`.**

    *Indice : `LIKE 'D%'`.*

    <Correction>
    ```sql
    SELECT * FROM etudiants WHERE nom LIKE 'D%';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM etudiants WHERE nom LIKE 'D%';
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-6" label="0.6 [Facile] - Modifier un âge" type="sql">
    <Enonce>
    ### Exercice 0.6 : Modifier un âge
    Table `etudiants(id, nom, prenom, age)`.

    **Modifier l'âge de l'étudiante Martin pour le mettre à 18 ans.**

    *Pour voir le résultat, ajouter `SELECT * FROM etudiants;` après la modification.*

    <Correction>
    ```sql
    UPDATE etudiants SET age = 18 WHERE nom = 'Martin';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    UPDATE etudiants SET age = 18 WHERE nom = 'Martin';
    -- controle
    SELECT id, nom, prenom, age FROM etudiants ORDER BY id;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-7" label="0.7 [Facile] - Supprimer un étudiant" type="sql">
    <Enonce>
    ### Exercice 0.7 : Supprimer un étudiant
    Table `etudiants(id, nom, prenom, age)`.

    **Supprimer l'étudiante Durand.**

    <Correction>
    ```sql
    DELETE FROM etudiants WHERE nom = 'Durand';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    DELETE FROM etudiants WHERE nom = 'Durand';
    -- controle
    SELECT id, nom, prenom, age FROM etudiants ORDER BY id;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-0-8" label="0.8 [Facile] - Tout le monde vieillit" type="sql">
    <Enonce>
    ### Exercice 0.8 : Tout le monde vieillit
    Table `etudiants(id, nom, prenom, age)`.

    **Augmenter de 1 an l'âge de tous les étudiants, en une seule requête.**

    <Correction>
    ```sql
    UPDATE etudiants SET age = age + 1;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    UPDATE etudiants SET age = age + 1;
    -- controle
    SELECT id, nom, prenom, age FROM etudiants ORDER BY id;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-1" label="1.1 [Facile] - Bibliothèque : tout voir" type="sql">
    <BaseSQL>
    ```sql
    CREATE TABLE Livres (id INTEGER PRIMARY KEY, titre TEXT, auteur TEXT, annee_publication INTEGER, genre TEXT, disponible INTEGER);
    INSERT INTO Livres VALUES
      (1, '1984', 'George Orwell', 1949, 'SF', 1),
      (2, 'Le Petit Prince', 'Antoine de Saint-Exupéry', 1943, 'Conte', 0),
      (3, 'Dune', 'Frank Herbert', 1965, 'SF', 1),
      (4, 'Les Misérables', 'Victor Hugo', 1862, 'Roman', 1),
      (5, 'Fondation', 'Isaac Asimov', 1951, 'SF', 0);
    ```
    </BaseSQL>
    <Enonce>
    ### Contexte : la bibliothèque
    Une petite base de données contient une table `Livres`.

    | id | titre | auteur | annee_publication | genre | disponible |
    |----|-------|--------|-------------------|-------|------------|
    | 1 | 1984 | George Orwell | 1949 | SF | 1 |
    | 2 | Le Petit Prince | Antoine de Saint-Exupéry | 1943 | Conte | 0 |
    | 3 | Dune | Frank Herbert | 1965 | SF | 1 |
    | 4 | Les Misérables | Victor Hugo | 1862 | Roman | 1 |
    | 5 | Fondation | Isaac Asimov | 1951 | SF | 0 |

    *`disponible` vaut 1 pour Oui, 0 pour Non.*

    **Afficher toutes les colonnes de tous les livres.**

    <Correction>
    ```sql
    SELECT * FROM Livres;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Livres;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-2" label="1.2 [Facile] - Bibliothèque : titres et auteurs" type="sql">
    <Enonce>
    ### Exercice 1.2 : Titres et auteurs
    Table `Livres(id, titre, auteur, annee_publication, genre, disponible)`.

    **Afficher uniquement le `titre` et l'`auteur` de tous les livres.**

    <Correction>
    ```sql
    SELECT titre, auteur FROM Livres;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT titre, auteur FROM Livres;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-3" label="1.3 [Facile] - Bibliothèque : science-fiction" type="sql">
    <Enonce>
    ### Exercice 1.3 : Science-fiction
    Table `Livres(id, titre, auteur, annee_publication, genre, disponible)`.

    **Afficher les titres des livres du genre `'SF'`.**

    <Correction>
    ```sql
    SELECT titre FROM Livres WHERE genre = 'SF';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT titre FROM Livres WHERE genre = 'SF';
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-4" label="1.4 [Facile] - Bibliothèque : disponibles" type="sql">
    <Enonce>
    ### Exercice 1.4 : Livres disponibles
    Table `Livres(id, titre, auteur, annee_publication, genre, disponible)`.

    **Afficher les titres des livres actuellement disponibles (`disponible = 1`).**

    <Correction>
    ```sql
    SELECT titre FROM Livres WHERE disponible = 1;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT titre FROM Livres WHERE disponible = 1;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-5" label="1.5 [Facile] - Bibliothèque : après 1950" type="sql">
    <Enonce>
    ### Exercice 1.5 : Après 1950
    Table `Livres(id, titre, auteur, annee_publication, genre, disponible)`.

    **Afficher toutes les colonnes des livres publiés strictement après 1950.**

    <Correction>
    ```sql
    SELECT * FROM Livres WHERE annee_publication > 1950;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Livres WHERE annee_publication > 1950;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-1-6" label="1.6 [Facile] - Bibliothèque : deux auteurs" type="sql">
    <Enonce>
    ### Exercice 1.6 : Deux auteurs
    Table `Livres(id, titre, auteur, annee_publication, genre, disponible)`.

    **Afficher toutes les colonnes des livres écrits par `'George Orwell'` ou par `'Isaac Asimov'`.**

    <Correction>
    ```sql
    SELECT * FROM Livres WHERE auteur = 'George Orwell' OR auteur = 'Isaac Asimov';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Livres WHERE auteur IN ('George Orwell', 'Isaac Asimov');
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-1" label="2.1 [Moyen] - Concession : catalogue trié" type="sql">
    <BaseSQL>
    ```sql
    CREATE TABLE Voitures (id INTEGER PRIMARY KEY, marque TEXT, modele TEXT, couleur TEXT, annee INTEGER, prix INTEGER, kilometrage INTEGER);
    INSERT INTO Voitures VALUES
      (1, 'Renault', 'Clio', 'Rouge', 2018, 12000, 45000),
      (2, 'Peugeot', '208', 'Blanc', 2020, 15000, 20000),
      (3, 'Tesla', 'Model 3', 'Noir', 2022, 35000, 10000),
      (4, 'Renault', 'Mégane', 'Bleu', 2015, 8000, 120000),
      (5, 'Porsche', '911', 'Gris', 2019, 95000, 15000);
    ```
    </BaseSQL>
    <Enonce>
    ### Contexte : la concession automobile
    La table `Voitures` décrit le stock d'une concession.

    | id | marque | modele | couleur | annee | prix | kilometrage |
    |----|--------|--------|---------|-------|------|-------------|
    | 1 | Renault | Clio | Rouge | 2018 | 12000 | 45000 |
    | 2 | Peugeot | 208 | Blanc | 2020 | 15000 | 20000 |
    | 3 | Tesla | Model 3 | Noir | 2022 | 35000 | 10000 |
    | 4 | Renault | Mégane | Bleu | 2015 | 8000 | 120000 |
    | 5 | Porsche | 911 | Gris | 2019 | 95000 | 15000 |

    **Afficher toutes les colonnes de toutes les voitures, triées par prix croissant.**

    <Correction>
    ```sql
    SELECT * FROM Voitures ORDER BY prix;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Voitures ORDER BY prix ASC;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-2" label="2.2 [Moyen] - Concession : les Renault" type="sql">
    <Enonce>
    ### Exercice 2.2 : Les Renault
    Table `Voitures(id, marque, modele, couleur, annee, prix, kilometrage)`.

    **Afficher le modèle et le prix de toutes les voitures de marque `'Renault'`.**

    <Correction>
    ```sql
    SELECT modele, prix FROM Voitures WHERE marque = 'Renault';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT modele, prix FROM Voitures WHERE marque = 'Renault';
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-3" label="2.3 [Moyen] - Concession : récentes et abordables" type="sql">
    <Enonce>
    ### Exercice 2.3 : Récentes et abordables
    Table `Voitures(id, marque, modele, couleur, annee, prix, kilometrage)`.

    **Afficher toutes les colonnes des voitures fabriquées à partir de 2017 (inclus) et dont le prix est inférieur à 20 000 €.**

    <Correction>
    ```sql
    SELECT * FROM Voitures WHERE annee >= 2017 AND prix < 20000;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Voitures WHERE annee >= 2017 AND prix < 20000;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-4" label="2.4 [Moyen] - Concession : couleurs sans doublon" type="sql">
    <Enonce>
    ### Exercice 2.4 : Couleurs disponibles
    Table `Voitures(id, marque, modele, couleur, annee, prix, kilometrage)`.

    **Afficher la liste des couleurs présentes en stock, sans doublon.**

    <Correction>
    ```sql
    SELECT DISTINCT couleur FROM Voitures;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT DISTINCT couleur FROM Voitures;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-5" label="2.5 [Moyen] - Concession : faible kilométrage" type="sql">
    <Enonce>
    ### Exercice 2.5 : Faible kilométrage
    Table `Voitures(id, marque, modele, couleur, annee, prix, kilometrage)`.

    **Afficher toutes les colonnes des voitures ayant moins de 50 000 km, triées par kilométrage croissant.**

    <Correction>
    ```sql
    SELECT * FROM Voitures WHERE kilometrage < 50000 ORDER BY kilometrage;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Voitures WHERE kilometrage < 50000 ORDER BY kilometrage;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-2-6" label="2.6 [Moyen] - Concession : pas blanches" type="sql">
    <Enonce>
    ### Exercice 2.6 : Pas blanches
    Table `Voitures(id, marque, modele, couleur, annee, prix, kilometrage)`.

    **Afficher toutes les colonnes des voitures qui ne sont pas de couleur `'Blanc'`.**

    <Correction>
    ```sql
    SELECT * FROM Voitures WHERE couleur <> 'Blanc';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT * FROM Voitures WHERE couleur != 'Blanc';
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-1" label="3.1 [Difficile] - Refuge : qui est où ?" type="sql">
    <BaseSQL>
    ```sql
    CREATE TABLE Soignants (id INTEGER PRIMARY KEY, nom TEXT, specialite TEXT);
    CREATE TABLE Enclos (id INTEGER PRIMARY KEY, nom_enclos TEXT, surface_m2 INTEGER, type_sol TEXT);
    CREATE TABLE Renards (id INTEGER PRIMARY KEY, nom TEXT, sexe TEXT, age INTEGER, id_enclos INTEGER REFERENCES Enclos(id), id_soignant INTEGER REFERENCES Soignants(id));
    INSERT INTO Soignants VALUES (1, 'Dr. Dolittle', 'Vétérinaire'), (2, 'Mme. Pomfrey', 'Infirmière'), (3, 'Hagrid', 'Gardien');
    INSERT INTO Enclos VALUES (1, 'La Forêt', 500, 'Terre'), (2, 'La Plaine', 300, 'Herbe'), (3, 'La Tanière', 50, 'Sable');
    INSERT INTO Renards VALUES
      (1, 'Rusty', 'M', 3, 1, 1),
      (2, 'Vixey', 'F', 2, 1, 2),
      (3, 'Zorro', 'M', 5, 2, 1),
      (4, 'Luna', 'F', 1, 3, 3),
      (5, 'Shadow', 'M', 4, NULL, 2);
    ```
    </BaseSQL>
    <Enonce>
    ### Contexte : le refuge des renards
    La base d'un refuge pour renards est répartie sur trois tables.

    **Table `Soignants`**

    | id | nom | specialite |
    |----|-----|------------|
    | 1 | Dr. Dolittle | Vétérinaire |
    | 2 | Mme. Pomfrey | Infirmière |
    | 3 | Hagrid | Gardien |

    **Table `Enclos`**

    | id | nom_enclos | surface_m2 | type_sol |
    |----|------------|------------|----------|
    | 1 | La Forêt | 500 | Terre |
    | 2 | La Plaine | 300 | Herbe |
    | 3 | La Tanière | 50 | Sable |

    **Table `Renards`**

    | id | nom | sexe | age | id_enclos | id_soignant |
    |----|-----|------|-----|-----------|-------------|
    | 1 | Rusty | M | 3 | 1 | 1 |
    | 2 | Vixey | F | 2 | 1 | 2 |
    | 3 | Zorro | M | 5 | 2 | 1 |
    | 4 | Luna | F | 1 | 3 | 3 |
    | 5 | Shadow | M | 4 | NULL | 2 |

    **Afficher le nom de chaque renard et le nom de l'enclos dans lequel il se trouve.** Les renards sans enclos ne sont pas affichés.

    <Correction>
    ```sql
    SELECT Renards.nom, Enclos.nom_enclos
    FROM Renards
    JOIN Enclos ON Renards.id_enclos = Enclos.id;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT R.nom, E.nom_enclos FROM Renards AS R JOIN Enclos AS E ON R.id_enclos = E.id;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-2" label="3.2 [Difficile] - Refuge : les grands espaces" type="sql">
    <Enonce>
    ### Exercice 3.2 : Les grands espaces
    Tables `Renards(id, nom, sexe, age, id_enclos, id_soignant)` et `Enclos(id, nom_enclos, surface_m2, type_sol)`.

    **Afficher le nom des renards qui vivent dans un enclos de plus de 200 m².**

    <Correction>
    ```sql
    SELECT Renards.nom
    FROM Renards
    JOIN Enclos ON Renards.id_enclos = Enclos.id
    WHERE Enclos.surface_m2 > 200;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT R.nom FROM Renards AS R JOIN Enclos AS E ON R.id_enclos = E.id WHERE E.surface_m2 > 200;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-3" label="3.3 [Difficile] - Refuge : les mâles de la Forêt" type="sql">
    <Enonce>
    ### Exercice 3.3 : Les mâles de la Forêt
    Tables `Renards(id, nom, sexe, age, id_enclos, id_soignant)` et `Enclos(id, nom_enclos, surface_m2, type_sol)`.

    **Afficher le nom des renards mâles (`'M'`) qui sont dans l'enclos nommé `'La Forêt'`.**

    <Correction>
    ```sql
    SELECT Renards.nom
    FROM Renards
    JOIN Enclos ON Renards.id_enclos = Enclos.id
    WHERE Renards.sexe = 'M' AND Enclos.nom_enclos = 'La Forêt';
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT R.nom FROM Renards AS R JOIN Enclos AS E ON R.id_enclos = E.id WHERE R.sexe = 'M' AND E.nom_enclos = 'La Forêt';
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-4" label="3.4 [Difficile] - Refuge : par âge décroissant" type="sql">
    <Enonce>
    ### Exercice 3.4 : L'âge des pensionnaires
    Tables `Renards(id, nom, sexe, age, id_enclos, id_soignant)` et `Enclos(id, nom_enclos, surface_m2, type_sol)`.

    **Afficher le nom de chaque renard et le nom de son enclos, du plus âgé au plus jeune.** Les renards sans enclos ne sont pas affichés.

    <Correction>
    ```sql
    SELECT Renards.nom, Enclos.nom_enclos
    FROM Renards
    JOIN Enclos ON Renards.id_enclos = Enclos.id
    ORDER BY Renards.age DESC;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT R.nom, E.nom_enclos FROM Renards AS R JOIN Enclos AS E ON R.id_enclos = E.id ORDER BY R.age DESC;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-5" label="3.5 [Difficile] - Refuge : sans enclos" type="sql">
    <Enonce>
    ### Exercice 3.5 : Sans domicile
    Table `Renards(id, nom, sexe, age, id_enclos, id_soignant)`.

    **Afficher le nom des renards qui ne sont affectés à aucun enclos (`id_enclos` vaut `NULL`).**

    *Attention : `= NULL` ne fonctionne pas en SQL.*

    <Correction>
    ```sql
    SELECT nom FROM Renards WHERE id_enclos IS NULL;
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT nom FROM Renards WHERE id_enclos IS NULL;
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sql-3-6" label="3.6 [Difficile] - Refuge : inventaire des enclos" type="sql">
    <Enonce>
    ### Exercice 3.6 : Inventaire
    Table `Enclos(id, nom_enclos, surface_m2, type_sol)`.

    **Afficher le nom et la surface des enclos dont le sol est de type `'Herbe'` ou `'Terre'`.**

    <Correction>
    ```sql
    SELECT nom_enclos, surface_m2 FROM Enclos WHERE type_sol IN ('Herbe', 'Terre');
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```sql
    SELECT nom_enclos, surface_m2 FROM Enclos WHERE type_sol = 'Herbe' OR type_sol = 'Terre';
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
