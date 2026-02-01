---
title: Projet - Gestion Stock et Ventes
description: Simulation d'un système de gestion de stock et de ventes pour un petit commerce
level: Première
chapter: 13 - Projets
icon: fa-solid fa-boxes-packing
---

# Projet - Système de Gestion de Stock et Ventes 🛒📦

Ce projet a pour but de simuler un système simple de gestion de stock pour un petit commerce. Il permettra d'ajouter des produits, de mettre à jour leurs quantités, d'enregistrer des ventes et de visualiser l'état du stock.

## Concepts Abordés

- Structures de données : listes de dictionnaires (pour les produits, les ventes).
- Manipulation de fichiers (CSV/JSON pour la persistance des données).
- Fonctions pour chaque opération (ajouter produit, enregistrer vente, etc.).
- Logique de mise à jour des quantités.
- Calculs simples (total d'une vente, valeur du stock).

## Fonctionnalités à Implémenter

### 1. Gestion du Catalogue de Produits

Chaque produit a des attributs spécifiques.

!!! question "Structure d'un produit"
    Définir une structure pour un produit en stock. Un dictionnaire est idéal :
    - `id_produit` (chaîne de caractères ou entier, unique, ex: "LIV001", 101)
    - `nom_produit` (chaîne de caractères, ex: "Livre de NSI")
    - `description` (chaîne de caractères)
    - `prix_unitaire_vente` (flottant)
    - `quantite_stock` (entier)
    - `seuil_alerte_stock` (entier, optionnel, pour indiquer un stock bas)

!!! question "Catalogue des produits"
    Créer une liste globale `catalogue_produits` pour stocker tous les dictionnaires de produits.

!!! question "Ajouter un nouveau produit"
    Créer une fonction `ajouter_produit(catalogue, id_prod, nom, desc, prix, qte_init, seuil_alerte)` qui :
    1. Vérifie si un produit avec `id_prod` existe déjà.
    2. Si non, crée un dictionnaire pour le nouveau produit et l'ajoute au `catalogue_produits`.
    3. Renvoie `True` si le produit est ajouté, `False` sinon.

!!! question "Modifier un produit"
    Créer une fonction `modifier_produit(catalogue, id_prod, nouveau_nom=None, nouvelle_desc=None, nouveau_prix=None, nouveau_seuil=None)` qui :
    1. Trouve le produit par `id_prod`.
    2. Si trouvé, met à jour les champs spécifiés (ceux qui ne sont pas `None`).
    3. Renvoie `True` si modifié, `False` si produit non trouvé.
    *Note : La quantité en stock ne sera pas modifiée par cette fonction mais par des fonctions d'entrée/sortie de stock.*

!!! question "Afficher les détails d'un produit"
    Créer une fonction `afficher_details_produit(produit)` qui affiche les informations d'un produit de manière lisible.

!!! question "Afficher tous les produits"
    Créer une fonction `afficher_catalogue(catalogue)` qui liste tous les produits avec quelques informations clés (ID, nom, prix, quantité).

!!! example "Tests de la gestion du catalogue"
    1. Initialiser un catalogue vide.
    2. Ajouter plusieurs produits différents.
    3. Essayer d'ajouter un produit avec un ID existant.
    4. Modifier les informations d'un produit existant (nom, prix).
    5. Afficher le catalogue complet.
    6. Afficher les détails d'un produit spécifique.

### 2. Gestion des Stocks

!!! question "Mettre à jour la quantité en stock"
    Créer une fonction `maj_quantite_stock(catalogue, id_prod, quantite_ajoutee)` qui :
    1. Trouve le produit par `id_prod`.
    2. Si trouvé, ajoute `quantite_ajoutee` à `quantite_stock` (peut être négatif pour une sortie de stock non liée à une vente, comme une perte).
    3. S'assure que la quantité en stock ne devient pas négative (ou gère ce cas selon la logique métier choisie).
    4. Renvoie la nouvelle quantité en stock, ou `None` si produit non trouvé.

!!! question "Alerte stock bas"
    Modifier `afficher_catalogue` ou créez une nouvelle fonction `verifier_stocks_bas(catalogue)` qui liste les produits dont la `quantite_stock` est inférieure ou égale à leur `seuil_alerte_stock`.

!!! example "Tests de la gestion des stocks"
    1. Ajouter un produit avec une quantité initiale et un seuil d'alerte.
    2. Augmenter le stock de ce produit.\ Vérifier la nouvelle quantité.
    3. Diminuer le stock (simuler une perte). Vérifier.
    4. Diminuer le stock en dessous du seuil d'alerte et vérifier que l'alerte est visible.

### 3. Enregistrement des Ventes

Une vente peut concerner plusieurs produits en différentes quantités.

!!! question "Structure d'une ligne de vente"
    Pour chaque produit dans une vente, nous aurons besoin de :
    - `id_produit_vendu`
    - `quantite_vendue`
    - `prix_unitaire_au_moment_vente` (important si les prix changent)

!!! question "Structure d'une vente"
    Définir une structure pour une vente (dictionnaire) :
    - `id_vente` (entier, unique)
    - `date_vente` (objet `datetime`)
    - `lignes_vente` (liste de dictionnaires, chacun étant une ligne de vente comme définie ci-dessus)
    - `total_vente` (flottant)

!!! question "Base de données des ventes"
    Créer une liste globale `historique_ventes` et un compteur `prochain_id_vente`.

!!! question "Enregistrer une nouvelle vente"
    Créer une fonction `enregistrer_vente(catalogue, historique_ventes, details_panier)` où `details_panier` est une liste de tuples `(id_produit, quantite_demandee)`.
    Cette fonction doit :
    1. Pour chaque item dans `details_panier` :
        a. Vérifier si le produit existe et si la `quantite_demandee` est disponible en stock.
