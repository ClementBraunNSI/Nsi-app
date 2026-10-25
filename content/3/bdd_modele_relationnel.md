---
title: "Bases de Données : Modèle Relationnel"
description: "Théorie des bases de données : tables, clés, schéma."
level: TNSI
order: 50
chapter: "Bases de Données"
icon: "database"
badgeId: "terminale_bdd_modele"
prerequisites: []
audience: public
---

# Modèle relationnel

Une **base de données** stocke beaucoup d'informations, de façon structurée, durable, et exploitable par plusieurs programmes. Le modèle le plus répandu est le **modèle relationnel**, proposé par E. F. Codd en 1970. L'idée est de tout ranger dans des tables, et de lier les tables par des valeurs communes, pas par des pointeurs cachés dans le programme.

## Tables, lignes, colonnes

Une **relation** est un ensemble d'enregistrements de même forme. En pratique, on dit une **table**. Une colonne est un **attribut** : elle a un nom et un **domaine**, l'ensemble des valeurs autorisées, par exemple les entiers, les textes, les dates. Une ligne est un **enregistrement**, aussi appelé n-uplet. Deux lignes identiques n'ont pas de place dans une relation au sens strict : un ensemble ne contient pas de doublon. C'est la clé qui rend cette promesse vérifiable.

La **clé primaire** est un attribut, ou un petit groupe d'attributs, qui identifie chaque ligne sans ambiguïté. Elle est **unique** et jamais vide. Un numéro d'élève, un ISBN, un identifiant client jouent ce rôle. Le nom et le prénom n'y suffisent presque jamais : deux personnes les partagent.

La **clé étrangère** est un attribut d'une table qui reprend la clé primaire d'une autre table. C'est le lien. Dans `Commandes`, la colonne `id_client` ne décrit pas le client : elle désigne la ligne de `Clients` dont la clé primaire a cette valeur. On évite ainsi de recopier le nom, l'adresse et le téléphone dans chaque commande. On les écrit une fois, et l'on pointe.

## Écrire le schéma

Le **schéma relationnel** décrit la structure, sans les données. On souligne la clé primaire. On marque la clé étrangère d'un `#`.

- **Eleves** (<u>id_eleve</u>, nom, prenom, classe)
- **Notes** (<u>id_note</u>, valeur, matiere, #id_eleve)

`id_note` identifie une note. `id_eleve` dans `Notes` doit correspondre à un `id_eleve` qui existe dans `Eleves`. Le schéma ne dit pas encore quelles lignes sont présentes. Il dit quelles colonnes existent, et quelles valeurs ont le droit de se référencer.

## Ce que le SGBD refuse

Le **système de gestion de base de données** applique des contraintes d'intégrité. On ne compte pas sur le programme pour « faire attention ».

L'**intégrité de domaine** impose le type. Une note est un nombre. La chaîne `"vingt"` n'entre pas dans une colonne numérique.

L'**intégrité de relation**, ou intégrité d'entité, impose la clé primaire : pas de doublon, pas de valeur vide. Deux lignes ne peuvent pas prétendre être le même élève.

L'**intégrité référentielle** impose la clé étrangère. On ne peut pas saisir une note pour un `id_eleve` absent de `Eleves`. Selon la règle choisie, supprimer un élève peut être refusé tant qu'il a des notes, ou entraîner la suppression de ses notes. Dans les deux cas, la base ne laisse pas un lien pointer dans le vide.

<ExerciseTabs courseId="terminale_bdd_modele" courseTitle="Exercices Modélisation">

  <ExerciseSection id="bdd-ex-1" label="Bibliothèque" type="lecture">
    <Enonce>
    ### Modéliser une Bibliothèque
    On veut gérer des **Livres** et des **Auteurs**.
    *   Un auteur a un nom, un prénom et une date de naissance.
    *   Un livre a un titre, une année de parution et un auteur.
    
    1.  Proposer un schéma relationnel avec les clés primaires et étrangères.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
