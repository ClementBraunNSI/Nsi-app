---
title: "SQL & Bases de Données - Exercices"
description: "Exercices pratiques sur SQL et les bases de données"
level: "TNSI"
chapter: "Bases de Données"
icon: "💾"
---

<ExerciseTabs courseId="sql-bases-donnees-exos" courseTitle="SQL & Bases de Données - Exercices">
  <ExerciseSection id="exo-1-1" label="Niveau 0 - INSERT, UPDATE, DELETE">
    <Enonce>
    ### Exercice 1.1 : Créer une table étudiants
    **Créez une table `etudiants` avec les colonnes :**
    - `id` (INTEGER PRIMARY KEY)
    - `nom` (VARCHAR(50))
    - `prenom` (VARCHAR(50))
    - `age` (INTEGER)
    
    **Insérez 3 étudiants :**
    - Martin Alice 17 ans
    - Dupont Bob 18 ans
    - Durand Claire 17 ans

    <Verification>
    ```sql
    -- Vérification
    SELECT * FROM etudiants;
    ```
    </Verification>
    ### Exercice 1.2 : Requêtes avec conditions
    **À partir de la table étudiants, écrivez les requêtes :**
    1. Afficher tous les étudiants
    2. Afficher seulement les noms et prénoms
    3. Afficher les étudiants de 17 ans
    4. Afficher les étudiants dont le nom commence par 'D'

    <Verification>
    ```sql
    -- Vérification
    ```
    </Verification>
  
    ### Exercice 1.3 : Modifier et supprimer
    **À partir de la table étudiants, écrivez les requêtes :**
    5. Modifier l'âge de Martin pour le mettre à 18 ans
    6. Supprimer l'étudiant Durand
    7. Augmenter l'âge de tous les étudiants de 1 an

    <Verification>
    ```sql
    -- Vérification
    ```
    </Verification>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="level-1-biblio" label="Niveau 1 - La Bibliothèque">
    <Enonce>
    ### Contexte : La Bibliothèque
    Vous gérez une petite base de données contenant une table `Livres`.
    
    | id | titre | auteur | annee_publication | genre | disponible |
    |----|-------|--------|-------------------|-------|------------|
    | 1 | 1984 | George Orwell | 1949 | SF | 1 |
    | 2 | Le Petit Prince | Antoine de Saint-Exupéry | 1943 | Conte | 0 |
    | 3 | Dune | Frank Herbert | 1965 | SF | 1 |
    | 4 | Les Misérables | Victor Hugo | 1862 | Roman | 1 |
    | 5 | Fondation | Isaac Asimov | 1951 | SF | 0 |

    *(Note : `disponible` est un booléen : 1 = Oui, 0 = Non)*

    **Exercices :**
    1. **Tout voir** : Afficher toutes les colonnes de tous les livres.
    2. **Titres uniquement** : Afficher uniquement le `titre` et l'`auteur` de tous les livres.
    3. **Science-Fiction** : Afficher les titres des livres du genre 'SF'.
    4. **Disponibles** : Afficher les titres des livres qui sont actuellement disponibles (`disponible = 1`).
    5. **Après 1950** : Afficher les livres publiés strictement après l'année 1950.
    6. **Auteurs précis** : Afficher les livres écrits par 'George Orwell' OU 'Isaac Asimov'.

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="level-2-concession" label="Niveau 2 - La Concession">
    <Enonce>
    ### Contexte : La Concession Automobile
    Vous analysez le stock d'une concession automobile.
    
    | id | marque | modele | couleur | annee | prix | kilométrage |
    |----|--------|--------|---------|-------|------|-------------|
    | 1 | Renault | Clio | Rouge | 2018 | 12000 | 45000 |
    | 2 | Peugeot | 208 | Blanc | 2020 | 15000 | 20000 |
    | 3 | Tesla | Model 3 | Noir | 2022 | 35000 | 10000 |
    | 4 | Renault | Mégane | Bleu | 2015 | 8000 | 120000 |
    | 5 | Porsche | 911 | Gris | 2019 | 95000 | 15000 |

    **Exercices :**
    1. **Catalogue trié** : Afficher toutes les voitures triées par prix croissant.
    2. **Les Renault** : Afficher le modèle et le prix de toutes les voitures de marque 'Renault'.
    3. **Voitures récentes et abordables** : Afficher les voitures fabriquées après 2017 (inclus) ET dont le prix est inférieur à 20 000 €.
    4. **Couleurs disponibles** : Afficher la liste des différentes couleurs disponibles en stock, sans doublons.
    5. **Le kilométrage** : Afficher les voitures ayant moins de 50 000 km, triées par kilométrage croissant.
    6. **Recherche spécifique** : Afficher les voitures qui ne sont PAS de couleur 'Blanc'.

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="level-3-refuge" label="Niveau 3 - Le Refuge">
    <Enonce>
    ### Contexte : Le Refuge des Renards
    Vous gérez un refuge pour renards réparti sur trois tables.

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

    **Exercices :**
    1. **Qui est où ?** : Afficher le nom du renard et le nom de l'enclos dans lequel il se trouve.
    2. **Les grands espaces** : Afficher les noms des renards qui vivent dans un enclos de plus de 200 m².
    3. **Les mâles de la Forêt** : Afficher les renards mâles ('M') qui sont dans l'enclos nommé 'La Forêt'.
    4. **L'âge des pensionnaires** : Afficher la liste des renards et de leur enclos, triée par âge du renard (descendant).
    5. **Sans domicile** : Afficher les renards qui ne sont affectés à aucun enclos (`id_enclos` est NULL).
    6. **Inventaire** : Afficher le nom de l'enclos et la surface pour tous les enclos qui ont un sol de type 'Herbe' ou 'Terre'.

    </Enonce>
  </ExerciseSection>
</ExerciseTabs>