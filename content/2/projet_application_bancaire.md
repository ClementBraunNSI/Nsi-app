---
title: "Projet - Application Bancaire"
description: "Création d'une application bancaire simple en Python"
level: premiere
chapter: "Projets"
icon: "🏦"
badgeId: "premiere_application_bancaire"
---


# Projet - Application Bancaire Simple

Le but de ce projet est de créer une application bancaire simple en utilisant Python.
Nous allons nous concentrer sur la gestion des comptes bancaires et des transactions en utilisant les dictionnaires.

Vous pouvez télécharger le code de base ici : [Code source](resources/app_back.py).

## Le système de comptes

Chaque compte bancaire possède les caractéristiques suivantes :
- nom (chaîne de caractères)
- solde (nombre décimal)
- transactions (liste des opérations effectuées)

### Création du système de comptes

!!! question "Base de données des comptes"
    **Créer un dictionnaire vide `comptes` qui contiendra tous les comptes bancaires.**

!!! question "Création de compte"
    **Créer la fonction `creer_compte` qui prend en paramètres :**
    - un numéro de compte (str)
    - un nom (str)
    - un solde initial (float, valeur par défaut : 0)
    - une liste vide `transactions` qui correspond aux transactions.
    
    **Cette fonction ajoute dans le dictionnaires des comptes, un nouveau dictionnaire avec pour clef le numéro de compte et comme valeurs un autre dictionnaire contenant toutes les informations necessaires.**
    La fonction doit vérifier si le compte n'existe pas déjà avant de le créer.

## Les opérations bancaires

### Gestion des transactions

!!! question "Dépôt d'argent"
    **Créer la fonction `deposer` qui prend en paramètres :**
    - un numéro de compte (str)
    - un montant à déposer (float)
    
    La fonction doit :
    1. Vérifier que le compte existe
    2. Ajouter le montant au solde
    3. Enregistrer la transaction dans l'historique

!!! question "Retrait d'argent"
    **Créer la fonction `retirer` qui prend en paramètres :**
    - un numéro de compte (str)
    - un montant à retirer (float)
    
    La fonction doit :
    1. Vérifier que le compte existe
    2. Vérifier que le solde est suffisant
    3. Retirer le montant du solde
    4. Enregistrer la transaction dans l'historique

### Consultation des informations

!!! question "Vérification du solde"
    **Créer la fonction `verifier_solde` qui prend en paramètre un numéro de compte (str) et affiche le solde actuel du compte.**

!!! question "Historique des transactions"
    **Créer la fonction `voir_transactions` qui prend en paramètre un numéro de compte (str) et affiche l'historique des transactions du compte.**

## Interface utilisateur

!!! question "Menu principal"
    **Créer la fonction `afficher_menu` qui affiche les options disponibles :**
    1. Créer un compte
    2. Faire un dépôt
    3. Faire un retrait
    4. Vérifier le solde
    5. Voir les transactions
    6. Quitter

!!! question "Boucle principale"
    **Créer la fonction `main` qui gère l'interaction avec l'utilisateur :**
    - Afficher le menu
    - Gérer les choix de l'utilisateur
    - Gérer les erreurs de saisie
    - Permettre de quitter proprement l'application

!!! example "Test de l'application"
    **Tester le bon fonctionnement de l'application :**
    1. Créer un compte pour Alice avec 1000€
    2. Créer un compte pour Bob avec 500€
    3. Faire un dépôt de 200€ sur le compte d'Alice
    4. Faire un retrait de 50€ sur le compte d'Alice
    5. Vérifier le solde d'Alice
    6. Afficher l'historique des transactions d'Alice
    7. Tester la gestion des erreurs :
        - Retrait avec solde insuffisant
        - Accès à un compte inexistant
        - Saisie de montants invalides
