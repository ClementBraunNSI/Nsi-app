---
title: "Bases de Données : Modèle Relationnel"
description: "Théorie des bases de données : tables, clés, schéma."
level: TNSI
order: 50
chapter: "Bases de Données"
icon: "🗄️"
badgeId: "terminale_bdd_modele"
prerequisites: []
---

# 🗄️ Modèle Relationnel

Une **Base de Données (BDD)** sert à stocker de grandes quantités d'informations de manière structurée, pérenne et efficace. Le modèle le plus utilisé est le **modèle relationnel** (inventé par E.F. Codd en 1970).

## 1. Concepts Clés

### 1.1 La Relation (Table)
Une **relation** est un ensemble de données organisées en tableau.
*   En informatique, on l'appelle souvent une **Table**.
*   Chaque colonne est un **Attribut** (avec un domaine de valeurs précis : entier, texte, date...).
*   Chaque ligne est un **Enregistrement** (ou Tuplet/uplet).

### 1.2 La Clé Primaire (Primary Key - PK)
Pour distinguer chaque enregistrement sans ambiguïté, on choisit un (ou plusieurs) attributs comme **Clé Primaire**.
*   **Propriété** : Elle doit être **UNIQUE** et non nulle.
*   *Exemple* : Numéro de Sécurité Sociale, ID client, ISBN d'un livre.

### 1.3 La Clé Étrangère (Foreign Key - FK)
Pour relier deux tables entre elles, on utilise une **Clé Étrangère**. C'est un attribut dans une table qui fait référence à la clé primaire d'une autre table.
C'est le "lien" relationnel.

*   *Exemple* : Dans une table `Commandes`, on a une colonne `id_client` qui pointe vers l'id de la table `Clients`.

## 2. Schéma Relationnel

Le schéma décrit la structure de la base. On l'écrit souvent ainsi :

*   **Eleves** (<u>id_eleve</u>, nom, prenom, classe)
*   **Notes** (<u>id_note</u>, valeur, matiere, #id_eleve)

*Légende : Souligné = Clé Primaire, # = Clé Étrangère.*

## 3. Contraintes d'Intégrité

Pour garder des données cohérentes, le SGBD (Système de Gestion de Bases de Données) applique des règles :

1.  **Intégrité de domaine** : Une note doit être un nombre, pas "vingt".
2.  **Intégrité de relation** : Pas de doublon de clé primaire.
3.  **Intégrité de référence** : On ne peut pas mettre une note à un élève qui n'existe pas (la clé étrangère doit pointer vers une clé primaire existante).

---

<ExerciseTabs courseId="terminale_bdd_modele" courseTitle="Exercices Modélisation">

  <ExerciseSection id="bdd-ex-1" label="Bibliothèque">
    <Enonce>
    ### Modéliser une Bibliothèque
    On veut gérer des **Livres** et des **Auteurs**.
    *   Un auteur a un nom, un prénom et une date de naissance.
    *   Un livre a un titre, une année de parution et un auteur.
    
    1.  Proposez un schéma relationnel avec les clés primaires et étrangères.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
