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

Une **base de données** stocke beaucoup d'informations de façon structurée et durable, pour qu'elles puissent être exploitées par plusieurs programmes. Le modèle le plus répandu est le **modèle relationnel**, proposé par E. F. Codd en 1970. Il consiste à ranger les données dans des tables, reliées entre elles par des valeurs communes plutôt que par des liens cachés dans le programme.

## Tables, lignes, colonnes

Une **relation** est un ensemble d'enregistrements de même forme. En pratique, on dit une **table**. Une colonne est un **attribut** : elle a un nom et un **domaine**, c'est-à-dire l'ensemble des valeurs autorisées (des entiers, des textes, des dates...). Une ligne est un **enregistrement**, aussi appelé n-uplet. Au sens strict, une relation ne peut pas contenir deux lignes identiques, car un ensemble n'a pas de doublon. C'est la clé primaire qui permet de garantir cette règle.

La **clé primaire** est un attribut, ou un petit groupe d'attributs, qui identifie chaque ligne sans ambiguïté. Elle est **unique** et jamais vide. Un numéro d'élève, un ISBN, un identifiant client jouent ce rôle. Le nom et le prénom ne suffisent presque jamais, car deux personnes peuvent avoir les mêmes.

La **clé étrangère** est un attribut d'une table qui reprend la clé primaire d'une autre table. C'est elle qui crée le lien entre les tables. Dans `Commandes`, la colonne `id_client` ne décrit pas le client : elle désigne la ligne de `Clients` dont la clé primaire a cette valeur. On évite ainsi de recopier le nom, l'adresse et le téléphone dans chaque commande : ces informations sont écrites une seule fois, et les commandes y font référence.

## Écrire le schéma

Le **schéma relationnel** décrit la structure, sans les données. On souligne la clé primaire. On marque la clé étrangère d'un `#`.

- **Eleves** (<u>id_eleve</u>, nom, prenom, classe)
- **Notes** (<u>id_note</u>, valeur, matiere, #id_eleve)

`id_note` identifie une note. `id_eleve` dans `Notes` doit correspondre à un `id_eleve` qui existe dans `Eleves`. Le schéma n'indique pas quelles lignes sont présentes : il décrit les colonnes qui existent et les liens autorisés entre les tables.

## Les contraintes d'intégrité

Le **système de gestion de base de données** applique des contraintes d'intégrité. Le respect de ces règles ne dépend donc pas de la vigilance du programme qui utilise la base.

L'**intégrité de domaine** impose le type des valeurs. Une note est un nombre, et la chaîne `"vingt"` ne peut pas être saisie dans une colonne numérique.

L'**intégrité de relation**, ou intégrité d'entité, impose la clé primaire : elle interdit les doublons et les valeurs vides, si bien que deux lignes ne peuvent pas représenter le même élève.

L'**intégrité référentielle** impose la clé étrangère. On ne peut pas saisir une note pour un `id_eleve` absent de `Eleves`. Selon la règle choisie, supprimer un élève peut être refusé tant qu'il a des notes, ou entraîner la suppression de ses notes. Dans les deux cas, la base n'accepte jamais une référence vers une ligne qui n'existe pas.

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
