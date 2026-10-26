---
title: 'Fonctions : La caisse du foyer'
description: Tenir la caisse du foyer avec des fonctions, des conditions et des boucles, sans liste ni dictionnaire.
level: premiere
chapter: Projets
icon: "receipt"
badgeId: premiere_projet_caisse
prerequisites: []
audience: public
---

# <Icone nom="receipt" /> Projet - La caisse du foyer

Le but de ce projet est de tenir la caisse du foyer du lycée pendant la récréation.
Ce projet consiste à servir les clients un par un, encaisser, rendre la monnaie, puis afficher le bilan. Le foyer vend trois articles.

Ce projet se fait tôt dans l'année. Le programme tient dans des variables simples. Chaque information (un prix, un total, un nombre de jus) a sa propre variable.

## Contraintes de programmation

Le correcteur ouvre le fichier et vérifie ces règles avant de lire le reste.

**Types autorisés :** `int`, `float`, `str`, `bool`.

**Instructions autorisées :** `if` / `elif` / `else`, `while`, `for`, `range`, `def`, `return`, `global`, `input`, `print`, les opérateurs arithmétiques et les comparaisons.

Une chaîne est un seul texte : un choix (`"1"`), une réponse (`"oui"`), un message affiché. On peut coller deux textes avec `+`. On peut comparer deux textes avec `==`.

`range(n)` sert uniquement à répéter une action `n` fois. On ne le transforme pas en collection, et on ne le stocke pas.

**Interdit dans tout le fichier :**

- les listes, dictionnaires, tuples et ensembles (`list`, `dict`, `tuple`, `set`), ainsi que les crochets et les accolades qui servent à en créer ;
- ranger plusieurs ventes, plusieurs noms ou plusieurs prix dans une seule variable ;
- lire un caractère ou un morceau de texte par un indice ou une tranche (`texte[i]`, `texte[i:j]`) ;
- `.split()`, `.join()`, `.append()`, et toute méthode dont le résultat est une collection ;
- les fichiers (`open`) et les classes.

Les trois prix sont écrits dans la fonction `prix_article`, chacun derrière un `if`. Il n'y a pas de catalogue à côté.

Les compteurs de la journée sont des variables séparées : `nb_jus`, `nb_cookies`, `nb_sandwiches`, `nb_ventes`, `total`.

## 1. Les trois articles <Icone nom="cup-soda" />

| Choix | Article | Prix |
| --- | --- | --- |
| `"1"` | jus | 1,20 € |
| `"2"` | cookie | 0,80 € |
| `"3"` | sandwich | 3,50 € |

En Python les prix s'écrivent avec un point : `1.2`, `0.8`, `3.5`. À l'écran, on affiche deux décimales.

<ExerciseTabs courseId="proj_caisse_prix" courseTitle="Prix des articles">
  <ExerciseSection id="caisse-prix-1" label="Trois fonctions" type="python">
    <Enonce>
      Écrire les trois fonctions. Les noms, les paramètres et les valeurs de retour sont fixés.

      ```python
      def est_choix_valide(choix: str) -> bool:
          """True seulement si choix vaut "1", "2" ou "3"."""

      def prix_article(choix: str) -> float:
          """Prix unitaire. Renvoie -1.0 si le choix est inconnu."""

      def libelle_article(choix: str) -> str:
          """"jus", "cookie" ou "sandwich". Renvoie "inconnu" sinon."""
      ```

      Les trois prix sont des `float` écrits dans `prix_article`, chacun derrière un `if`. Un choix autre que `"1"`, `"2"` et `"3"` donne `False`, `-1.0` ou `"inconnu"` selon la fonction.

      *Tester avec :*

      ```python
      print(est_choix_valide("2"))    # True
      print(est_choix_valide("jus"))  # False
      print(prix_article("1"))        # 1.2
      print(prix_article("3"))        # 3.5
      print(prix_article("9"))        # -1.0
      print(libelle_article("2"))     # cookie
      print(libelle_article("0"))     # inconnu
      ```

    <Correction>
    ```python
    def est_choix_valide(choix):
        return choix == "1" or choix == "2" or choix == "3"

    def prix_article(choix):
        if choix == "1":
            return 1.2
        if choix == "2":
            return 0.8
        if choix == "3":
            return 3.5
        return -1.0

    def libelle_article(choix):
        if choix == "1":
            return "jus"
        if choix == "2":
            return "cookie"
        if choix == "3":
            return "sandwich"
        return "inconnu"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert est_choix_valide("2") is True and est_choix_valide("1") is True and est_choix_valide("3") is True, "1, 2 et 3 sont des choix valides."
    assert est_choix_valide("jus") is False and est_choix_valide("4") is False and est_choix_valide("") is False, "Un autre texte n'est pas un choix valide."
    assert prix_article("1") == 1.2 and prix_article("2") == 0.8 and prix_article("3") == 3.5, "Prix : jus 1.2, cookie 0.8, sandwich 3.5."
    assert prix_article("9") == -1.0, "Un choix inconnu donne -1.0."
    assert libelle_article("1") == "jus" and libelle_article("2") == "cookie" and libelle_article("3") == "sandwich", "Libellés : jus, cookie, sandwich."
    assert libelle_article("0") == "inconnu", "Un choix inconnu donne inconnu."
    import ast as _ast
    _arbre = _ast.parse(PROGRAMME)
    assert not any(isinstance(n, (_ast.List, _ast.Dict, _ast.Tuple, _ast.Set, _ast.ListComp, _ast.DictComp, _ast.SetComp, _ast.Subscript)) for n in _ast.walk(_arbre)), "Contrainte du projet : ni liste, ni dictionnaire, ni tuple, ni crochets."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Une ligne de ticket <Icone nom="euro" />

<ExerciseTabs courseId="proj_caisse_ligne" courseTitle="Montant et monnaie">
  <ExerciseSection id="caisse-ligne-1" label="montant_ligne" type="python">
    <CodeDepart>
    ```python
    def est_choix_valide(choix):
        return choix == "1" or choix == "2" or choix == "3"

    def prix_article(choix):
        if choix == "1":
            return 1.2
        if choix == "2":
            return 0.8
        if choix == "3":
            return 3.5
        return -1.0

    def libelle_article(choix):
        if choix == "1":
            return "jus"
        if choix == "2":
            return "cookie"
        if choix == "3":
            return "sandwich"
        return "inconnu"
    ```
    </CodeDepart>
    <Enonce>
      Écrire `montant_ligne(choix, quantite)`. Elle renvoie le prix unitaire multiplié par la quantité.

      Renvoyer `-1.0` si `est_choix_valide(choix)` est faux, ou si `quantite` est inférieure à 1. Dans ces cas, on ne multiplie pas.

      ```python
      print(montant_ligne("3", 2))  # 7.0
      print(montant_ligne("1", 0))  # -1.0
      print(montant_ligne("4", 1))  # -1.0
      ```

    <Correction>
    ```python
    def montant_ligne(choix, quantite):
        if not est_choix_valide(choix) or quantite < 1:
            return -1.0
        return prix_article(choix) * quantite
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert montant_ligne("3", 2) == 7.0, "montant_ligne('3', 2) vaut 7.0."
    assert abs(montant_ligne("2", 4) - 3.2) < 1e-9, "montant_ligne('2', 4) vaut 3.2."
    assert montant_ligne("1", 0) == -1.0, "Une quantité inférieure à 1 donne -1.0."
    assert montant_ligne("4", 1) == -1.0, "Un choix inconnu donne -1.0."
    import ast as _ast
    _arbre = _ast.parse(PROGRAMME)
    assert not any(isinstance(n, (_ast.List, _ast.Dict, _ast.Tuple, _ast.Set, _ast.ListComp, _ast.DictComp, _ast.SetComp, _ast.Subscript)) for n in _ast.walk(_arbre)), "Contrainte du projet : ni liste, ni dictionnaire, ni tuple, ni crochets."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="caisse-ligne-2" label="rendu_monnaie" type="python">
    <Enonce>
      Écrire `rendu_monnaie(a_payer, donne)`. Elle renvoie `donne - a_payer` quand le client a donné assez, y compris quand les deux montants sont égaux (la monnaie vaut alors `0.0`).

      Si `donne` est inférieur à `a_payer`, renvoyer `-1.0`.

      ```python
      print(rendu_monnaie(7.0, 10.0))  # 3.0
      print(rendu_monnaie(7.0, 7.0))   # 0.0
      print(rendu_monnaie(7.0, 5.0))   # -1.0
      ```

    <Correction>
    ```python
    def rendu_monnaie(a_payer, donne):
        if donne < a_payer:
            return -1.0
        return donne - a_payer
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert rendu_monnaie(7.0, 10.0) == 3.0, "rendu_monnaie(7.0, 10.0) vaut 3.0."
    assert rendu_monnaie(7.0, 7.0) == 0.0, "Montants égaux : la monnaie vaut 0.0."
    assert rendu_monnaie(7.0, 5.0) == -1.0, "Montant insuffisant : -1.0."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Un client <Icone nom="hand" />

Dialogue attendu pour un client servi (les lignes après `>` sont ce que tape l'utilisateur) :

```text
Article (1 jus, 2 cookie, 3 sandwich) : > 3
Quantité : > 2
À payer : 7.00 €
Montant donné : > 10
Monnaie : 3.00 €
```

`servir_client()` renvoie alors `7.0` : l'argent encaissé, pas la monnaie.

Si le choix puis la quantité sont invalides, on redemande avant de parler d'argent :

```text
Article (1 jus, 2 cookie, 3 sandwich) : > 9
Choix invalide.
Article (1 jus, 2 cookie, 3 sandwich) : > 2
Quantité : > 0
Quantité invalide.
Quantité : > 4
À payer : 3.20 €
Montant donné : > 2
Montant insuffisant. Vente annulée.
```

`servir_client()` renvoie alors `0.0`. Les compteurs de la journée ne bougent pas.

<ExerciseTabs courseId="proj_caisse_client" courseTitle="Un client">
  <ExerciseSection id="caisse-client-1" label="servir_client" type="python">
    <CodeDepart>
    ```python
    def est_choix_valide(choix):
        return choix == "1" or choix == "2" or choix == "3"

    def prix_article(choix):
        if choix == "1":
            return 1.2
        if choix == "2":
            return 0.8
        if choix == "3":
            return 3.5
        return -1.0

    def libelle_article(choix):
        if choix == "1":
            return "jus"
        if choix == "2":
            return "cookie"
        if choix == "3":
            return "sandwich"
        return "inconnu"

    def montant_ligne(choix, quantite):
        if not est_choix_valide(choix) or quantite < 1:
            return -1.0
        return prix_article(choix) * quantite

    def rendu_monnaie(a_payer, donne):
        if donne < a_payer:
            return -1.0
        return donne - a_payer
    ```
    </CodeDepart>
    <Enonce>
      Écrire `servir_client()`. Elle ne reçoit aucun paramètre. Elle parle au client avec `input` et renvoie un `float`.

      - Redemander l'article tant que `est_choix_valide` est faux. Message : `Choix invalide.`
      - Redemander la quantité tant qu'elle n'est pas un entier supérieur ou égal à 1. Message : `Quantité invalide.`
      - Afficher `À payer : X.XX €` à partir de `montant_ligne`.
      - Lire le montant donné. S'il est insuffisant, afficher `Montant insuffisant. Vente annulée.` et renvoyer `0.0`.
      - Sinon afficher `Monnaie : X.XX €` et renvoyer le montant à payer.
      - Pour que le programme principal sache quoi compter, une vente encaissée range aussi le choix et la quantité dans deux variables globales, `dernier_choix` et `derniere_quantite` (déclarées avec `global` au début de la fonction).

      La quantité lue par `input` est un `str` : la convertir en `int` une fois le texte obtenu. Les essais du sujet sont des nombres entiers, sans espace autour.

      *Attention : pas de liste pour mémoriser les essais. Un `while` et quelques variables suffisent.*

    <Correction>
    ```python
    dernier_choix = ""
    derniere_quantite = 0

    def servir_client():
        global dernier_choix, derniere_quantite
        choix = input("Article (1 jus, 2 cookie, 3 sandwich) : ")
        while not est_choix_valide(choix):
            print("Choix invalide.")
            choix = input("Article (1 jus, 2 cookie, 3 sandwich) : ")
        quantite = int(input("Quantité : "))
        while quantite < 1:
            print("Quantité invalide.")
            quantite = int(input("Quantité : "))
        a_payer = montant_ligne(choix, quantite)
        print("À payer : " + format(a_payer, ".2f") + " €")
        donne = float(input("Montant donné : "))
        monnaie = rendu_monnaie(a_payer, donne)
        if monnaie < 0:
            print("Montant insuffisant. Vente annulée.")
            return 0.0
        print("Monnaie : " + format(monnaie, ".2f") + " €")
        dernier_choix = choix
        derniere_quantite = quantite
        return a_payer

    print(servir_client())
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
    ENTREES = ["3", "2", "10"]
    saisies = []
    def input(question=""):
        print(question, end="")
        return saisies.pop(0)
    saisies[:] = ["3", "2", "10"]
    valeur, texte = _sortie(servir_client)
    assert valeur == 7.0, "2 sandwiches payés 10 € : servir_client renvoie 7.0, l'argent encaissé."
    assert "À payer : 7.00 €" in texte and "Monnaie : 3.00 €" in texte, "Afficher À payer : 7.00 € puis Monnaie : 3.00 €"
    assert dernier_choix == "3" and derniere_quantite == 2, "Une vente encaissée range dernier_choix = '3' et derniere_quantite = 2."
    saisies[:] = ["9", "2", "0", "4", "2"]
    valeur, texte = _sortie(servir_client)
    assert saisies == [], "Choix et quantité invalides : on redemande, avant de parler d'argent."
    assert "Choix invalide." in texte and "Quantité invalide." in texte, "Afficher Choix invalide. puis Quantité invalide."
    assert "À payer : 3.20 €" in texte, "4 cookies : À payer : 3.20 €"
    assert valeur == 0.0 and "Montant insuffisant. Vente annulée." in texte, "2 € pour 3.20 € : Montant insuffisant. Vente annulée. et la fonction renvoie 0.0."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 4. La récréation <Icone nom="refresh-cw" />

Le programme demande d'abord `Nombre maximum de clients : `. Ce nombre est un entier supérieur ou égal à 1. Sinon, on repose la question (`while`).

Ensuite une boucle `for` va de 1 jusqu'à ce nombre. À chaque tour :

1. appeler `servir_client()` ;
2. si le montant renvoyé est supérieur à 0, l'ajouter à `total`, ajouter 1 à `nb_ventes`, et ajouter la quantité au compteur du bon article ;
3. demander `Un autre client ? (oui/non) : `. Seule la réponse exacte `oui` continue. Toute autre réponse termine la journée, même s'il reste des tours possibles.

On ne conserve pas le détail de chaque ticket. Seuls les cinq compteurs survivent d'un client à l'autre.

<ExerciseTabs courseId="proj_caisse_journee" courseTitle="La récréation">
  <ExerciseSection id="caisse-journee-1" label="Plusieurs clients" type="python">
    <CodeDepart>
    ```python
    def est_choix_valide(choix):
        return choix == "1" or choix == "2" or choix == "3"

    def prix_article(choix):
        if choix == "1":
            return 1.2
        if choix == "2":
            return 0.8
        if choix == "3":
            return 3.5
        return -1.0

    def libelle_article(choix):
        if choix == "1":
            return "jus"
        if choix == "2":
            return "cookie"
        if choix == "3":
            return "sandwich"
        return "inconnu"

    def montant_ligne(choix, quantite):
        if not est_choix_valide(choix) or quantite < 1:
            return -1.0
        return prix_article(choix) * quantite

    def rendu_monnaie(a_payer, donne):
        if donne < a_payer:
            return -1.0
        return donne - a_payer

    dernier_choix = ""
    derniere_quantite = 0

    def servir_client():
        global dernier_choix, derniere_quantite
        choix = input("Article (1 jus, 2 cookie, 3 sandwich) : ")
        while not est_choix_valide(choix):
            print("Choix invalide.")
            choix = input("Article (1 jus, 2 cookie, 3 sandwich) : ")
        quantite = int(input("Quantité : "))
        while quantite < 1:
            print("Quantité invalide.")
            quantite = int(input("Quantité : "))
        a_payer = montant_ligne(choix, quantite)
        print("À payer : " + format(a_payer, ".2f") + " €")
        donne = float(input("Montant donné : "))
        monnaie = rendu_monnaie(a_payer, donne)
        if monnaie < 0:
            print("Montant insuffisant. Vente annulée.")
            return 0.0
        print("Monnaie : " + format(monnaie, ".2f") + " €")
        dernier_choix = choix
        derniere_quantite = quantite
        return a_payer
    ```
    </CodeDepart>
    <Enonce>
      Écrire le programme principal.

      1. Lire le nombre maximum de clients. Tant que cette valeur est inférieure à 1, reposer la question.
      2. Initialiser `total` à `0.0` et les quatre compteurs entiers à `0` : `nb_ventes`, `nb_jus`, `nb_cookies`, `nb_sandwiches`.
      3. Avec `for numero in range(1, nb_max + 1)`, servir un client.
      4. N'augmenter les compteurs que si `servir_client` a renvoyé un montant supérieur à 0. Ajouter `derniere_quantite` au compteur de l'article `dernier_choix` : deux sandwiches augmentent `nb_sandwiches` de 2.
      5. Après chaque client réellement appelé, lire `Un autre client ? (oui/non) : `. Si la réponse n'est pas exactement `oui`, sortir de la journée.

      Les fonctions des étapes précédentes sont déjà dans l'éditeur.
      Rejouer l'exemple du bilan : 2 sandwiches payés 10 €, puis 1 jus payé 1,20 €, puis arrêt. Une troisième vente annulée ne compte pas. Le total vaut `8.2`, `nb_ventes` vaut 2, `nb_sandwiches` vaut 2, `nb_jus` vaut 1.

    <Correction>
    ```python
    nb_max = int(input("Nombre maximum de clients : "))
    while nb_max < 1:
        nb_max = int(input("Nombre maximum de clients : "))
    total = 0.0
    nb_ventes = 0
    nb_jus = 0
    nb_cookies = 0
    nb_sandwiches = 0
    for numero in range(1, nb_max + 1):
        montant = servir_client()
        if montant > 0:
            total = total + montant
            nb_ventes = nb_ventes + 1
            if dernier_choix == "1":
                nb_jus = nb_jus + derniere_quantite
            elif dernier_choix == "2":
                nb_cookies = nb_cookies + derniere_quantite
            else:
                nb_sandwiches = nb_sandwiches + derniere_quantite
        if input("Un autre client ? (oui/non) : ") != "oui":
            break
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["0", "5", "3", "2", "10", "oui", "1", "1", "2", "oui", "2", "1", "0.5", "non"]
    assert total == 8.2 or abs(total - 8.2) < 1e-9, "2 sandwiches puis 1 jus : total vaut 8.2."
    assert nb_ventes == 2, "La vente annulée ne compte pas : nb_ventes vaut 2."
    assert nb_sandwiches == 2 and nb_jus == 1 and nb_cookies == 0, "nb_sandwiches vaut 2, nb_jus 1, nb_cookies 0."
    assert SORTIE.count("Nombre maximum de clients") == 2, "Un nombre maximum de 0 est refusé : la question est reposée."
    variables, sortie = relancer(["2", "1", "1", "5", "non"])
    assert variables["nb_ventes"] == 1 and variables["nb_jus"] == 1, "Une réponse autre que oui termine la journée."
    variables, sortie = relancer(["1", "2", "1", "1", "oui"])
    assert sortie.count("Un autre client") == 1, "Le nombre maximum de clients limite la boucle."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 5. Le bilan <Icone nom="chart-column" />

Deux ventes encaissées : 2 sandwiches (7,00 €) puis 1 jus (1,20 €).

```text
--- Bilan de la récré ---
Ventes encaissées : 2
Total : 8.20 €
Ticket moyen : 4.10 €
Jus : 1
Cookies : 0
Sandwiches : 2
Le plus vendu : sandwich (2)
```

Le ticket moyen est `total / nb_ventes`. S'il n'y a eu aucune vente, on affiche `Aucune vente.` et on ne fait pas la division.

Messages du plus vendu :

- un article strictement devant : `Le plus vendu : sandwich (2)`
- deux articles à égalité devant le troisième : `Égalité : jus et cookie (3 chacun)`
- les trois à égalité : `Égalité : jus, cookie et sandwich (2 chacun)`

Les trois nombres se comparent avec des `if`. On n'assemble pas les noms dans une collection pour les trier.

<ExerciseTabs courseId="proj_caisse_bilan" courseTitle="Bilan">
  <ExerciseSection id="caisse-bilan-1" label="resume_journee" type="python">
    <Enonce>
      Écrire `resume_journee(nb_ventes, total, nb_jus, nb_cookies, nb_sandwiches)`. Elle affiche le bilan et ne renvoie rien.

      - `nb_ventes` vaut 0 : afficher `Aucune vente.` et s'arrêter.
      - Sinon afficher le bloc `--- Bilan de la récré ---`, le total et le ticket moyen avec deux décimales, puis les trois compteurs.
      - Comparer `nb_jus`, `nb_cookies` et `nb_sandwiches` pour produire l'un des trois messages.

      Test d'égalité : 3 jus, 3 cookies, 1 sandwich affiche `Égalité : jus et cookie (3 chacun)`.

    <Correction>
    ```python
    def resume_journee(nb_ventes, total, nb_jus, nb_cookies, nb_sandwiches):
        if nb_ventes == 0:
            print("Aucune vente.")
            return
        print("--- Bilan de la récré ---")
        print("Ventes encaissées :", nb_ventes)
        print("Total : " + format(total, ".2f") + " €")
        print("Ticket moyen : " + format(total / nb_ventes, ".2f") + " €")
        print("Jus :", nb_jus)
        print("Cookies :", nb_cookies)
        print("Sandwiches :", nb_sandwiches)
        if nb_jus == nb_cookies and nb_cookies == nb_sandwiches:
            print("Égalité : jus, cookie et sandwich (" + str(nb_jus) + " chacun)")
        elif nb_jus > nb_cookies and nb_jus > nb_sandwiches:
            print("Le plus vendu : jus (" + str(nb_jus) + ")")
        elif nb_cookies > nb_jus and nb_cookies > nb_sandwiches:
            print("Le plus vendu : cookie (" + str(nb_cookies) + ")")
        elif nb_sandwiches > nb_jus and nb_sandwiches > nb_cookies:
            print("Le plus vendu : sandwich (" + str(nb_sandwiches) + ")")
        elif nb_jus == nb_cookies:
            print("Égalité : jus et cookie (" + str(nb_jus) + " chacun)")
        elif nb_jus == nb_sandwiches:
            print("Égalité : jus et sandwich (" + str(nb_jus) + " chacun)")
        else:
            print("Égalité : cookie et sandwich (" + str(nb_cookies) + " chacun)")

    resume_journee(2, 8.2, 1, 0, 2)
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
    _, texte = _sortie(resume_journee, 2, 8.2, 1, 0, 2)
    lignes = [l.strip() for l in texte.strip().splitlines()]
    assert lignes == ["--- Bilan de la récré ---", "Ventes encaissées : 2", "Total : 8.20 €", "Ticket moyen : 4.10 €", "Jus : 1", "Cookies : 0", "Sandwiches : 2", "Le plus vendu : sandwich (2)"], "Le bilan de l'exemple n'a pas les huit lignes attendues."
    _, texte = _sortie(resume_journee, 0, 0.0, 0, 0, 0)
    assert texte.strip() == "Aucune vente.", "Aucune vente : afficher seulement Aucune vente."
    _, texte = _sortie(resume_journee, 3, 5.6, 3, 3, 1)
    assert texte.strip().splitlines()[-1] == "Égalité : jus et cookie (3 chacun)", "3 jus, 3 cookies, 1 sandwich : Égalité : jus et cookie (3 chacun)"
    _, texte = _sortie(resume_journee, 3, 11.0, 2, 2, 2)
    assert texte.strip().splitlines()[-1] == "Égalité : jus, cookie et sandwich (2 chacun)", "Trois égalités : Égalité : jus, cookie et sandwich (2 chacun)"
    _, texte = _sortie(resume_journee, 2, 2.0, 1, 4, 0)
    assert texte.strip().splitlines()[-1] == "Le plus vendu : cookie (4)", "4 cookies devant : Le plus vendu : cookie (4)"
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un seul fichier `caisse_foyer.py` :

- en tête, un commentaire avec son nom et la classe ;
- les sept fonctions, avec ces noms-là ;
- le programme principal qui lance la journée puis appelle `resume_journee` ;
- les `print` de test peuvent rester, à condition de ne pas gêner la saisie (les regrouper sous un commentaire, ou les enlever une fois les tests passés).

Un fichier qui calcule juste mais qui stocke les tickets dans une liste ne respecte pas les contraintes.
