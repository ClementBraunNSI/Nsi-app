---
title: "Structures : Gestion Stock"
description: "Simulation d'un système de gestion de stock et de ventes pour un petit commerce"
level: premiere
chapter: "Projets"
icon: "📦"
badgeId: "premiere_gestion_stock"
---

import ExerciseTabs from '../../components/interactive/ExerciseTabs';
import { Enonce } from '../../components/interactive/ExerciseTabs';

# 📦 Projet - Système de Gestion de Stock

Ce projet a pour but de simuler un système simple de gestion de stock pour un petit commerce.

**Concepts Abordés :**
- Structures de données : listes de dictionnaires
- Fonctions et logique métier
- Calculs (totaux, seuils)

## 1. Catalogue Produits

Chaque produit est un dictionnaire :
- `id` (str) : Référence unique (ex: "LIV001")
- `nom` (str) : Désignation
- `prix` (float) : Prix unitaire
- `stock` (int) : Quantité disponible
- `seuil` (int) : Seuil d'alerte stock bas

<ExerciseTabs courseId="proj_stock_cat" courseTitle="Catalogue">
  <ExerciseSection id="stock-cat-1" label="Initialisation">
    <Enonce>
      Créez une liste `catalogue` qui contiendra les produits.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-2" label="Ajouter Produit">
    <Enonce>
      Créez une fonction `ajouter_produit(catalogue, id, nom, prix, stock, seuil)` :
      1. Vérifie si l'ID n'existe pas déjà.
      2. Ajoute le dictionnaire produit au catalogue.
      3. Renvoie `True` si succès, `False` sinon.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-3" label="Modifier">
    <Enonce>
      Créez une fonction `modifier_produit(catalogue, id, nouveau_prix)` qui met à jour le prix d'un produit donné par son ID.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Mouvements de Stock 📉📈

<ExerciseTabs courseId="proj_stock_mvt" courseTitle="Mouvements">
  <ExerciseSection id="stock-mvt-1" label="Mise à jour">
    <Enonce>
      Créez une fonction `maj_stock(catalogue, id, quantite)` :
      *   `quantite` peut être positive (réapprovisionnement) ou négative (perte/vente).
      *   La fonction doit mettre à jour le stock du produit.
      *   **Attention** : Le stock ne peut pas être négatif. Si la quantité à retirer est trop grande, l'opération doit être annulée (renvoyer `False`).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-mvt-2" label="Alerte">
    <Enonce>
      Créez une fonction `verifier_alertes(catalogue)` qui affiche la liste des produits dont le stock est inférieur ou égal au seuil.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Ventes et Panier 🛒

Une vente est une liste de tuples `(id_produit, quantite)`.

<ExerciseTabs courseId="proj_stock_sell" courseTitle="Ventes">
  <ExerciseSection id="stock-sell-1" label="Calcul du total">
    <Enonce>
      Créez une fonction `calculer_total(catalogue, panier)` qui :
      1. Parcourt le panier.
      2. Récupère le prix de chaque produit dans le catalogue.
      3. Calcule le montant total.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-sell-2" label="Valider Vente">
    <Enonce>
      Créez une fonction `valider_vente(catalogue, panier)` qui :
      1. Vérifie si tous les produits sont en stock suffisant.
      2. Si oui, déduit les quantités du stock (appel à `maj_stock`).
      3. Affiche le ticket de caisse avec le total.
      4. Si non, affiche un message d'erreur indiquant quel produit manque.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Interface

<ExerciseTabs courseId="proj_stock_ui" courseTitle="Menu">
  <ExerciseSection id="stock-ui-1" label="Menu Principal">
    <Enonce>
      Créez une interface textuelle pour tester votre application :
      1. Gestion Catalogue (Ajout/Modif)
      2. Gestion Stock (Réappro/Alertes)
      3. Caisse (Saisir une vente)
      4. Quitter
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
