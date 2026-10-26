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
      Créer `catalogue = []` et la fonction `trouver(catalogue, id_produit)`.

      Elle parcourt la liste et renvoie le dictionnaire dont la clé `id` est égale à `id_produit`, ou `None`. Les autres fonctions s'appuient dessus plutôt que de recopier la boucle de recherche.

    <Correction>
    ```python
    catalogue = []

    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    print(trouver([{"id": "A"}], "A"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert catalogue == [], "catalogue doit être une liste vide au départ."
    essai = [{"id": "LIV001", "nom": "Roman"}, {"id": "STY002", "nom": "Stylo"}]
    assert trouver(essai, "STY002") is essai[1], "trouver renvoie le dictionnaire dont l'id correspond."
    assert trouver(essai, "XXX") is None, "Identifiant absent : trouver renvoie None."
    assert trouver([], "LIV001") is None, "Catalogue vide : trouver renvoie None."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-2" label="Ajouter un produit" type="python">
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None
    ```
    </CodeDepart>
    <Enonce>
      Écrire `ajouter_produit(catalogue, id_produit, nom, prix, stock, seuil)`.

      Renvoyer `False` sans rien ajouter si l'identifiant existe déjà, si `prix` est inférieur ou égal à 0, ou si `stock` ou `seuil` est négatif. Afficher `Identifiant déjà utilisé.` ou `Valeur invalide.` selon le cas.

      Sinon ajouter le dictionnaire et renvoyer `True`.

      ```python
      catalogue = []
      ajouter_produit(catalogue, "LIV001", "Roman", 12.5, 5, 2)   # True
      ajouter_produit(catalogue, "STY002", "Stylo", 1.5, 2, 2)    # True
      ajouter_produit(catalogue, "LIV001", "Doublon", 9.0, 1, 1)  # False
      ```

      Le catalogue compte deux produits.

    <Correction>
    ```python
    def ajouter_produit(catalogue, id_produit, nom, prix, stock, seuil):
        if trouver(catalogue, id_produit) is not None:
            print("Identifiant déjà utilisé.")
            return False
        if prix <= 0 or stock < 0 or seuil < 0:
            print("Valeur invalide.")
            return False
        catalogue.append({"id": id_produit, "nom": nom, "prix": prix, "stock": stock, "seuil": seuil})
        return True

    catalogue = []
    print(ajouter_produit(catalogue, "LIV001", "Roman", 12.5, 5, 2))
    print(ajouter_produit(catalogue, "STY002", "Stylo", 1.5, 2, 2))
    print(ajouter_produit(catalogue, "LIV001", "Doublon", 9.0, 1, 1))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = []
    assert ajouter_produit(essai, "LIV001", "Roman", 12.5, 5, 2) is True, "Un nouveau produit : True."
    assert essai == [{"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2}], "Le produit ajouté a les clés id, nom, prix, stock, seuil."
    assert ajouter_produit(essai, "STY002", "Stylo", 1.5, 2, 2) is True, "Le stylo est ajouté."
    assert ajouter_produit(essai, "LIV001", "Doublon", 9.0, 1, 1) is False, "Identifiant déjà utilisé : False."
    assert ajouter_produit(essai, "GOM003", "Gomme", 0, 1, 1) is False, "Un prix nul est refusé."
    assert ajouter_produit(essai, "GOM003", "Gomme", 1.0, -1, 1) is False, "Un stock négatif est refusé."
    assert ajouter_produit(essai, "GOM003", "Gomme", 1.0, 1, -1) is False, "Un seuil négatif est refusé."
    assert len(essai) == 2, "Le catalogue compte deux produits."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="stock-cat-3" label="Modifier le prix" type="python">
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `modifier_produit(catalogue, id_produit, nouveau_prix)`.

      Identifiant absent : `Produit introuvable.`, `False`. `nouveau_prix` inférieur ou égal à 0 : `Valeur invalide.`, `False`. Sinon remplacer `prix` et renvoyer `True`.

      `modifier_produit(catalogue, "LIV001", 10.0)` passe le roman à `10.0`. Remettre `12.5` avant de calculer le ticket de l'exemple : le second appel renvoie `True`.

    <Correction>
    ```python
    def modifier_produit(catalogue, id_produit, nouveau_prix):
        produit = trouver(catalogue, id_produit)
        if produit is None:
            print("Produit introuvable.")
            return False
        if nouveau_prix <= 0:
            print("Valeur invalide.")
            return False
        produit["prix"] = nouveau_prix
        return True

    print(modifier_produit(catalogue, "LIV001", 10.0))
    print(modifier_produit(catalogue, "LIV001", 12.5))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    assert modifier_produit(essai, "LIV001", 10.0) is True and essai[0]["prix"] == 10.0, "Le roman passe à 10.0."
    assert modifier_produit(essai, "LIV001", 12.5) is True and essai[0]["prix"] == 12.5, "Le roman revient à 12.5."
    assert modifier_produit(essai, "XXX", 3.0) is False, "Produit absent : False."
    assert modifier_produit(essai, "STY002", 0) is False and essai[1]["prix"] == 1.5, "Un prix nul est refusé, le prix ne change pas."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Les mouvements <Icone nom="inbox" />

<ExerciseTabs courseId="proj_stock_mvt" courseTitle="Mouvements">
  <ExerciseSection id="stock-mvt-1" label="Mise à jour" type="python">
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `maj_stock(catalogue, id_produit, quantite)`.

      `quantite` positive réapprovisionne, `quantite` négative sort de la réserve, `quantite` nulle renvoie `False` avec `Valeur invalide.`

      Produit absent : `Produit introuvable.`, `False`. Si `stock + quantite` est négatif : `Stock insuffisant.`, `False`, et le stock affiché reste l'ancien.

      *Attention : une sortie impossible est annulée. On ne descend jamais sous 0.*

      ```python
      maj_stock(catalogue, "STY002", -3)  # False, le stylo reste à 2
      maj_stock(catalogue, "LIV001", -1)  # True, le roman passe de 5 à 4
      maj_stock(catalogue, "LIV001", 1)   # True, le roman revient à 5
      ```

      Ces deux derniers essais se compensent : le ticket de la section suivante part des stocks de départ, roman 5 et stylo 2.

    <Correction>
    ```python
    def maj_stock(catalogue, id_produit, quantite):
        produit = trouver(catalogue, id_produit)
        if produit is None:
            print("Produit introuvable.")
            return False
        if quantite == 0:
            print("Valeur invalide.")
            return False
        if produit["stock"] + quantite < 0:
            print("Stock insuffisant.")
            return False
        produit["stock"] = produit["stock"] + quantite
        return True

    print(maj_stock(catalogue, "STY002", -3))
    print(maj_stock(catalogue, "LIV001", -1))
    print(maj_stock(catalogue, "LIV001", 1))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    assert maj_stock(essai, "STY002", -3) is False and essai[1]["stock"] == 2, "Sortie impossible : False, le stylo reste à 2."
    assert maj_stock(essai, "LIV001", -1) is True and essai[0]["stock"] == 4, "Le roman passe de 5 à 4."
    assert maj_stock(essai, "LIV001", 1) is True and essai[0]["stock"] == 5, "Le roman revient à 5."
    assert maj_stock(essai, "LIV001", 0) is False, "Une quantité nulle est refusée."
    assert maj_stock(essai, "XXX", 1) is False, "Produit absent : False."
    assert maj_stock(essai, "STY002", -2) is True and essai[1]["stock"] == 0, "On peut descendre exactement à 0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="stock-mvt-2" label="Alerte" type="python">
    <CodeDepart>
    ```python
    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `verifier_alertes(catalogue)`.

      Un produit est en alerte quand `stock` est inférieur ou égal à `seuil`. Afficher une ligne par produit concerné, par exemple `STY002 Stylo : stock 1 (seuil 2)`, et renvoyer la liste de ces dictionnaires. Aucune alerte : afficher `Aucune alerte.` et renvoyer `[]`.

      Au départ, avant toute vente, le stylo est déjà en alerte (stock 2, seuil 2) et le roman ne l'est pas (stock 5, seuil 2). Après la vente réussie de l'exemple (roman 3, stylo 1), seule la ligne du stylo apparaît.

    <Correction>
    ```python
    def verifier_alertes(catalogue):
        alertes = []
        for produit in catalogue:
            if produit["stock"] <= produit["seuil"]:
                print(produit["id"], produit["nom"], ": stock", produit["stock"], "(seuil " + str(produit["seuil"]) + ")")
                alertes.append(produit)
        if len(alertes) == 0:
            print("Aucune alerte.")
        return alertes

    verifier_alertes(catalogue)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    essai = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    valeur, texte = _sortie(verifier_alertes, essai)
    assert valeur == [essai[1]], "Au départ, seul le stylo est en alerte (stock 2, seuil 2)."
    assert "STY002" in texte and "LIV001" not in texte, "Une ligne par produit en alerte : seulement le stylo."
    valeur, texte = _sortie(verifier_alertes, [{"id": "A", "nom": "A", "prix": 1, "stock": 9, "seuil": 1}])
    assert valeur == [] and "Aucune alerte." in texte, "Sans alerte : afficher Aucune alerte. et renvoyer []."
    ```
    </Verification>
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
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `calculer_total(catalogue, panier)`.

      Pour chaque couple, retrouver le produit avec `trouver`. S'il manque, afficher `Produit introuvable :` suivi de l'identifiant et renvoyer `-1.0`. Sinon ajouter `prix * quantite` à un accumulateur.

      Sur `[("LIV001", 2), ("STY002", 1)]` le retour vaut `26.5`. Le stock ne change pas pendant ce calcul.

    <Correction>
    ```python
    def calculer_total(catalogue, panier):
        total = 0.0
        for id_produit, quantite in panier:
            produit = trouver(catalogue, id_produit)
            if produit is None:
                print("Produit introuvable :", id_produit)
                return -1.0
            total = total + produit["prix"] * quantite
        return total

    print(calculer_total(catalogue, [("LIV001", 2), ("STY002", 1)]))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    assert calculer_total(essai, [("LIV001", 2), ("STY002", 1)]) == 26.5, "Le panier vaut 12.5 × 2 + 1.5 × 1 = 26.5."
    assert [p["stock"] for p in essai] == [5, 2], "calculer_total ne modifie pas le stock."
    assert calculer_total(essai, [("LIV999", 1)]) == -1.0, "Un identifiant inconnu : -1.0."
    assert calculer_total(essai, []) == 0, "Un panier vide vaut 0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="stock-sell-2" label="Valider la vente" type="python">
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    def maj_stock(catalogue, id_produit, quantite):
        produit = trouver(catalogue, id_produit)
        if produit is None:
            print("Produit introuvable.")
            return False
        if quantite == 0:
            print("Valeur invalide.")
            return False
        if produit["stock"] + quantite < 0:
            print("Stock insuffisant.")
            return False
        produit["stock"] = produit["stock"] + quantite
        return True

    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `valider_vente(catalogue, panier)`.

      Premier passage, sans rien modifier : chaque ligne doit avoir un produit connu et un stock suffisant (`quantite` supérieure ou égale à 1, et inférieure ou égale au stock). À la première ligne fausse, afficher `Produit introuvable : ...` ou `Stock insuffisant : ...`, renvoyer `False`, et laisser tous les stocks comme avant l'appel. Un identifiant inconnu annule la vente de la même façon.

      *Attention : on contrôle toutes les lignes avant de toucher au stock. À la première ligne impossible, rien n'est déduit, même pour les lignes précédentes qui auraient été possibles.*

      Deuxième passage, seulement si tout est bon : appeler `maj_stock` avec une quantité négative pour chaque ligne, afficher le ticket et renvoyer `True`.

      ```text
      Roman x2 : 25.00 €
      Stylo x1 : 1.50 €
      Total : 26.50 €
      ```

      Stocks ensuite : roman `3`, stylo `1`.

      Le panier `[("STY002", 5)]` qui suit affiche `Stock insuffisant : STY002`, renvoie `False`, et laisse le stylo à 1.

      Un panier `[("LIV999", 1)]` affiche `Produit introuvable : LIV999`, renvoie `False`, et aucun stock ne bouge.

    <Correction>
    ```python
    def valider_vente(catalogue, panier):
        for id_produit, quantite in panier:
            produit = trouver(catalogue, id_produit)
            if produit is None:
                print("Produit introuvable :", id_produit)
                return False
            if quantite < 1 or quantite > produit["stock"]:
                print("Stock insuffisant :", id_produit)
                return False
        total = 0.0
        for id_produit, quantite in panier:
            produit = trouver(catalogue, id_produit)
            maj_stock(catalogue, id_produit, -quantite)
            montant = produit["prix"] * quantite
            total = total + montant
            print(produit["nom"] + " x" + str(quantite) + " : " + format(montant, ".2f") + " €")
        print("Total : " + format(total, ".2f") + " €")
        return True

    print(valider_vente(catalogue, [("LIV001", 2), ("STY002", 1)]))
    print(valider_vente(catalogue, [("STY002", 5)]))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    essai = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    valeur, texte = _sortie(valider_vente, essai, [("LIV001", 2), ("STY002", 1)])
    assert valeur is True, "Le panier possible est validé : True."
    assert [p["stock"] for p in essai] == [3, 1], "Après la vente : roman 3, stylo 1."
    assert "Total : 26.50 €" in texte, "Le ticket se termine par Total : 26.50 €"
    assert "Roman x2 : 25.00 €" in texte, "Le ticket affiche Roman x2 : 25.00 €"
    valeur, texte = _sortie(valider_vente, essai, [("STY002", 5)])
    assert valeur is False and essai[1]["stock"] == 1, "Stock insuffisant : False, le stylo reste à 1."
    valeur, texte = _sortie(valider_vente, essai, [("LIV001", 1), ("LIV999", 1)])
    assert valeur is False and essai[0]["stock"] == 3, "Une ligne impossible annule toute la vente : le roman reste à 3."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 4. Menu et rendu <Icone nom="shopping-cart" />

<ExerciseTabs courseId="proj_stock_ui" courseTitle="Menu">
  <ExerciseSection id="stock-ui-1" label="Menu principal" type="python">
    <CodeDepart>
    ```python
    def trouver(catalogue, id_produit):
        for produit in catalogue:
            if produit["id"] == id_produit:
                return produit
        return None

    def ajouter_produit(catalogue, id_produit, nom, prix, stock, seuil):
        if trouver(catalogue, id_produit) is not None:
            print("Identifiant déjà utilisé.")
            return False
        if prix <= 0 or stock < 0 or seuil < 0:
            print("Valeur invalide.")
            return False
        catalogue.append({"id": id_produit, "nom": nom, "prix": prix, "stock": stock, "seuil": seuil})
        return True

    def modifier_produit(catalogue, id_produit, nouveau_prix):
        produit = trouver(catalogue, id_produit)
        if produit is None:
            print("Produit introuvable.")
            return False
        if nouveau_prix <= 0:
            print("Valeur invalide.")
            return False
        produit["prix"] = nouveau_prix
        return True

    def maj_stock(catalogue, id_produit, quantite):
        produit = trouver(catalogue, id_produit)
        if produit is None:
            print("Produit introuvable.")
            return False
        if quantite == 0:
            print("Valeur invalide.")
            return False
        if produit["stock"] + quantite < 0:
            print("Stock insuffisant.")
            return False
        produit["stock"] = produit["stock"] + quantite
        return True

    def verifier_alertes(catalogue):
        alertes = []
        for produit in catalogue:
            if produit["stock"] <= produit["seuil"]:
                print(produit["id"], produit["nom"], ": stock", produit["stock"], "(seuil " + str(produit["seuil"]) + ")")
                alertes.append(produit)
        if len(alertes) == 0:
            print("Aucune alerte.")
        return alertes

    def valider_vente(catalogue, panier):
        for id_produit, quantite in panier:
            produit = trouver(catalogue, id_produit)
            if produit is None:
                print("Produit introuvable :", id_produit)
                return False
            if quantite < 1 or quantite > produit["stock"]:
                print("Stock insuffisant :", id_produit)
                return False
        total = 0.0
        for id_produit, quantite in panier:
            produit = trouver(catalogue, id_produit)
            maj_stock(catalogue, id_produit, -quantite)
            montant = produit["prix"] * quantite
            total = total + montant
            print(produit["nom"] + " x" + str(quantite) + " : " + format(montant, ".2f") + " €")
        print("Total : " + format(total, ".2f") + " €")
        return True

    catalogue = [
        {"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2},
        {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `menu()` :

      ```text
      1. Ajouter ou modifier un produit
      2. Mouvement de stock et alertes
      3. Encaisser une vente
      4. Afficher le catalogue
      5. Quitter
      ```

      Le choix `3` construit le panier ligne par ligne : identifiant, quantité, et le mot `fin` comme identifiant pour lancer `valider_vente`. Dans l'éditeur, les fonctions des étapes précédentes et le catalogue de départ sont déjà écrits : appeler `menu()` à la fin du programme. Le choix `4` affiche id, nom, prix et stock de chaque produit. Le choix `5` termine.

      Avant le menu, exécuter le scénario chiffré et afficher les booléens et les stocks, pour qu'on puisse contrôler 26,5, le roman à 3 et le stylo à 1 sans retaper les saisies. Le menu peut ensuite repartir d'un catalogue propre, ou continuer sur le catalogue déjà entamé : indiquer en commentaire le choix fait.

    <Correction>
    ```python
    def menu():
        while True:
            print("1. Ajouter ou modifier un produit")
            print("2. Mouvement de stock et alertes")
            print("3. Encaisser une vente")
            print("4. Afficher le catalogue")
            print("5. Quitter")
            choix = input("Choix : ")
            if choix == "1":
                id_produit = input("Identifiant : ")
                if trouver(catalogue, id_produit) is None:
                    nom = input("Nom : ")
                    prix = float(input("Prix : "))
                    stock = int(input("Stock : "))
                    seuil = int(input("Seuil : "))
                    ajouter_produit(catalogue, id_produit, nom, prix, stock, seuil)
                else:
                    modifier_produit(catalogue, id_produit, float(input("Nouveau prix : ")))
            elif choix == "2":
                id_produit = input("Identifiant : ")
                maj_stock(catalogue, id_produit, int(input("Quantité : ")))
                verifier_alertes(catalogue)
            elif choix == "3":
                panier = []
                while True:
                    id_produit = input("Identifiant (fin pour terminer) : ")
                    if id_produit == "fin":
                        break
                    panier.append((id_produit, int(input("Quantité : "))))
                valider_vente(catalogue, panier)
            elif choix == "4":
                for produit in catalogue:
                    print(produit["id"], produit["nom"], produit["prix"], produit["stock"])
            elif choix == "5":
                return

    menu()
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["5"]
    import io, contextlib
    catalogue.clear()
    catalogue.extend([{"id": "LIV001", "nom": "Roman", "prix": 12.5, "stock": 5, "seuil": 2}, {"id": "STY002", "nom": "Stylo", "prix": 1.5, "stock": 2, "seuil": 2}])
    saisies = ["3", "LIV001", "2", "STY002", "1", "fin", "4", "5"]
    def input(question=""):
        return saisies.pop(0)
    tampon = io.StringIO()
    with contextlib.redirect_stdout(tampon):
        menu()
    texte = tampon.getvalue()
    assert saisies == [], "Le choix 3 lit identifiant puis quantité, jusqu'au mot fin ; le choix 5 termine."
    assert [p["stock"] for p in catalogue] == [3, 1], "Après la vente du menu : roman 3, stylo 1."
    assert "26.50" in texte, "Le ticket affiche le total 26.50 €."
    assert "LIV001" in texte and "Roman" in texte, "Le choix 4 affiche le catalogue."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `stock.py` : commentaire d'en-tête avec le nom et la classe, les fonctions `trouver`, `ajouter_produit`, `modifier_produit`, `maj_stock`, `verifier_alertes`, `calculer_total`, `valider_vente` et `menu`, le scénario (création, refus de doublon, sortie impossible, panier à 26,50 €, alerte stylo, panier refusé), puis le menu.
