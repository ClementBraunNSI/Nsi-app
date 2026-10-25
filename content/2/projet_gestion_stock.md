---
title: 'Structures : Gestion Stock'
description: >-
  Simulation d'un système de gestion de stock et de ventes pour un petit
  commerce
level: premiere
chapter: Projets
icon: "package"
badgeId: premiere_gestion_stock
prerequisites:
  - projet_gestion_bibliotheque
audience: public
---

# <Icone nom="package" /> Projet - Système de Gestion de Stock

Le but de ce projet est de simuler la réserve et la caisse d'un petit commerce.
Dans ce projet, le catalogue est une liste de dictionnaires, et une vente est une liste de couples `(id_produit, quantite)`. On ne retire du stock qu'une fois toute la vente vérifiée : un article manquant annule le ticket entier.

## 1. Le catalogue <Icone nom="tag" />

Une fiche produit contient :

*   `id` (`str`) : référence unique, par exemple `"LIV001"`
*   `nom` (`str`)
*   `prix` (`float`) : prix unitaire, strictement positif
*   `stock` (`int`) : quantité en réserve, toujours supérieure ou égale à 0
*   `seuil` (`int`) : alerte quand `stock` est inférieur ou égal à `seuil`

<ExerciseTabs courseId="proj_stock_cat" courseTitle="Catalogue">
  <ExerciseSection id="stock-cat-1" label="Initialisation" type="python">
    <Enonce>
      Créez `catalogue = []` et la fonction `trouver(catalogue, id_produit)`.

      Elle parcourt la liste et renvoie le dictionnaire dont la clé `id` est égale à `id_produit`, ou `None`. Les autres fonctions s'appuient dessus plutôt que de recopier la boucle de recherche.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-2" label="Ajouter un produit" type="python">
    <Enonce>
      Écrivez `ajouter_produit(catalogue, id_produit, nom, prix, stock, seuil)`.

      Renvoyez `False` sans rien ajouter si l'identifiant existe déjà, si `prix` est inférieur ou égal à 0, ou si `stock` ou `seuil` est négatif. Affichez `Identifiant déjà utilisé.` ou `Valeur invalide.` selon le cas.

      Sinon ajoutez le dictionnaire et renvoyez `True`.

      ```python
      catalogue = []
      ajouter_produit(catalogue, "LIV001", "Roman", 12.5, 5, 2)   # True
      ajouter_produit(catalogue, "STY002", "Stylo", 1.5, 2, 2)    # True
      ajouter_produit(catalogue, "LIV001", "Doublon", 9.0, 1, 1)  # False
      ```

      Le catalogue compte deux produits.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-3" label="Modifier le prix" type="lecture">
    <Enonce>
      Écrivez `modifier_produit(catalogue, id_produit, nouveau_prix)`.

      Identifiant absent : `Produit introuvable.`, `False`. `nouveau_prix` inférieur ou égal à 0 : `Valeur invalide.`, `False`. Sinon remplacez `prix` et renvoyez `True`.

      `modifier_produit(catalogue, "LIV001", 10.0)` passe le roman à `10.0`. Remettez `12.5` avant de calculer le ticket de l'exemple : le second appel renvoie `True`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Les mouvements <Icone nom="inbox" />

<ExerciseTabs courseId="proj_stock_mvt" courseTitle="Mouvements">
  <ExerciseSection id="stock-mvt-1" label="Mise à jour" type="lecture">
    <Enonce>
      Écrivez `maj_stock(catalogue, id_produit, quantite)`.

      `quantite` positive réapprovisionne, `quantite` négative sort de la réserve, `quantite` nulle renvoie `False` avec `Valeur invalide.`

      Produit absent : `Produit introuvable.`, `False`. Si `stock + quantite` est négatif : `Stock insuffisant.`, `False`, et le stock affiché reste l'ancien.

      *Attention : une sortie impossible est annulée. On ne descend jamais sous 0.*

      ```python
      maj_stock(catalogue, "STY002", -3)  # False, le stylo reste à 2
      maj_stock(catalogue, "LIV001", -1)  # True, le roman passe de 5 à 4
      maj_stock(catalogue, "LIV001", 1)   # True, le roman revient à 5
      ```

      Ces deux derniers essais se compensent : le ticket de la section suivante part des stocks de départ, roman 5 et stylo 2.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-mvt-2" label="Alerte" type="lecture">
    <Enonce>
      Écrivez `verifier_alertes(catalogue)`.

      Un produit est en alerte quand `stock` est inférieur ou égal à `seuil`. Affichez une ligne par produit concerné, par exemple `STY002 Stylo : stock 1 (seuil 2)`, et renvoyez la liste de ces dictionnaires. Aucune alerte : affichez `Aucune alerte.` et renvoyez `[]`.

      Au départ, avant toute vente, le stylo est déjà en alerte (stock 2, seuil 2) et le roman ne l'est pas (stock 5, seuil 2). Après la vente réussie de l'exemple (roman 3, stylo 1), seule la ligne du stylo apparaît.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. La vente <Icone nom="receipt" />

Une vente est une liste de tuples `(id_produit, quantite)`.

```python
panier = [("LIV001", 2), ("STY002", 1)]
```

`calculer_total` sur ce panier, avec les prix 12,5 et 1,5, vaut `26.5` (12,5 × 2 + 1,5 × 1). Elle ne modifie pas le stock. Elle renvoie `-1.0` si un identifiant du panier est inconnu.

<ExerciseTabs courseId="proj_stock_sell" courseTitle="Ventes">
  <ExerciseSection id="stock-sell-1" label="Calcul du total" type="python">
    <Enonce>
      Écrivez `calculer_total(catalogue, panier)`.

      Pour chaque couple, retrouvez le produit avec `trouver`. S'il manque, affichez `Produit introuvable :` suivi de l'identifiant et renvoyez `-1.0`. Sinon ajoutez `prix * quantite` à un accumulateur.

      Sur `[("LIV001", 2), ("STY002", 1)]` le retour vaut `26.5`. Le stock ne change pas pendant ce calcul.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="stock-sell-2" label="Valider la vente" type="lecture">
    <Enonce>
      Écrivez `valider_vente(catalogue, panier)`.

      Premier passage, sans rien modifier : chaque ligne doit avoir un produit connu et un stock suffisant (`quantite` supérieure ou égale à 1, et inférieure ou égale au stock). À la première ligne fausse, affichez `Produit introuvable : ...` ou `Stock insuffisant : ...`, renvoyez `False`, et laissez tous les stocks comme avant l'appel. Un identifiant inconnu annule la vente de la même façon.

      *Attention : on contrôle toutes les lignes avant de toucher au stock. À la première ligne impossible, rien n'est déduit, même pour les lignes précédentes qui auraient été possibles.*

      Deuxième passage, seulement si tout est bon : appelez `maj_stock` avec une quantité négative pour chaque ligne, affichez le ticket et renvoyez `True`.

      ```text
      Roman x2 : 25.00 €
      Stylo x1 : 1.50 €
      Total : 26.50 €
      ```

      Stocks ensuite : roman `3`, stylo `1`.

      Le panier `[("STY002", 5)]` qui suit affiche `Stock insuffisant : STY002`, renvoie `False`, et laisse le stylo à 1.

      Un panier `[("LIV999", 1)]` affiche `Produit introuvable : LIV999`, renvoie `False`, et aucun stock ne bouge.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Menu et rendu <Icone nom="shopping-cart" />

<ExerciseTabs courseId="proj_stock_ui" courseTitle="Menu">
  <ExerciseSection id="stock-ui-1" label="Menu principal" type="lecture">
    <Enonce>
      Écrivez `menu()` :

      ```text
      1. Ajouter ou modifier un produit
      2. Mouvement de stock et alertes
      3. Encaisser une vente
      4. Afficher le catalogue
      5. Quitter
      ```

      Le choix `3` construit le panier ligne par ligne : identifiant, quantité, et le mot `fin` comme identifiant pour lancer `valider_vente`. Le choix `4` affiche id, nom, prix et stock de chaque produit. Le choix `5` termine.

      Avant le menu, exécutez le scénario chiffré et affichez les booléens et les stocks, pour qu'on puisse contrôler 26,5, le roman à 3 et le stylo à 1 sans retaper les saisies. Vous pouvez remettre un catalogue propre pour le menu ensuite, ou continuer sur le catalogue déjà entamé : indiquez en commentaire ce que vous avez choisi.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `stock.py` : commentaire d'en-tête avec le nom et la classe, les fonctions `trouver`, `ajouter_produit`, `modifier_produit`, `maj_stock`, `verifier_alertes`, `calculer_total`, `valider_vente` et `menu`, le scénario (création, refus de doublon, sortie impossible, panier à 26,50 €, alerte stylo, panier refusé), puis le menu.
