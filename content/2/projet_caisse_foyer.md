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

**Instructions autorisées :** `if` / `elif` / `else`, `while`, `for`, `range`, `def`, `return`, `input`, `print`, les opérateurs arithmétiques et les comparaisons.

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
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Une ligne de ticket <Icone nom="euro" />

<ExerciseTabs courseId="proj_caisse_ligne" courseTitle="Montant et monnaie">
  <ExerciseSection id="caisse-ligne-1" label="montant_ligne" type="lecture">
    <Enonce>
      Écrire `montant_ligne(choix, quantite)`. Elle renvoie le prix unitaire multiplié par la quantité.

      Renvoyer `-1.0` si `est_choix_valide(choix)` est faux, ou si `quantite` est inférieure à 1. Dans ces cas, on ne multiplie pas.

      ```python
      print(montant_ligne("3", 2))  # 7.0
      print(montant_ligne("1", 0))  # -1.0
      print(montant_ligne("4", 1))  # -1.0
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="caisse-ligne-2" label="rendu_monnaie" type="lecture">
    <Enonce>
      Écrire `rendu_monnaie(a_payer, donne)`. Elle renvoie `donne - a_payer` quand le client a donné assez, y compris quand les deux montants sont égaux (la monnaie vaut alors `0.0`).

      Si `donne` est inférieur à `a_payer`, renvoyer `-1.0`.

      ```python
      print(rendu_monnaie(7.0, 10.0))  # 3.0
      print(rendu_monnaie(7.0, 7.0))   # 0.0
      print(rendu_monnaie(7.0, 5.0))   # -1.0
      ```
    </Enonce>
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
  <ExerciseSection id="caisse-client-1" label="servir_client" type="lecture">
    <Enonce>
      Écrire `servir_client()`. Elle ne reçoit aucun paramètre. Elle parle au client avec `input` et renvoie un `float`.

      - Redemander l'article tant que `est_choix_valide` est faux. Message : `Choix invalide.`
      - Redemander la quantité tant qu'elle n'est pas un entier supérieur ou égal à 1. Message : `Quantité invalide.`
      - Afficher `À payer : X.XX €` à partir de `montant_ligne`.
      - Lire le montant donné. S'il est insuffisant, afficher `Montant insuffisant. Vente annulée.` et renvoyer `0.0`.
      - Sinon afficher `Monnaie : X.XX €` et renvoyer le montant à payer.

      La quantité lue par `input` est un `str` : la convertir en `int` une fois le texte obtenu. Les essais du sujet sont des nombres entiers, sans espace autour.

      *Attention : pas de liste pour mémoriser les essais. Un `while` et quelques variables suffisent.*
    </Enonce>
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
    <Enonce>
      Écrire le programme principal.

      1. Lire le nombre maximum de clients. Tant que cette valeur est inférieure à 1, reposer la question.
      2. Initialiser `total` à `0.0` et les quatre compteurs entiers à `0` : `nb_ventes`, `nb_jus`, `nb_cookies`, `nb_sandwiches`.
      3. Avec `for numero in range(1, nb_max + 1)`, servir un client.
      4. N'augmentez les compteurs que si `servir_client` a renvoyé un montant supérieur à 0. Ajouter la quantité vendue au bon compteur : deux sandwiches augmentent `nb_sandwiches` de 2.
      5. Après chaque client réellement appelé, lire `Un autre client ? (oui/non) : `. Si la réponse n'est pas exactement `oui`, sortir de la journée.

      Rejouer l'exemple du bilan : 2 sandwiches payés 10 €, puis 1 jus payé 1,20 €, puis arrêt. Une troisième vente annulée ne compte pas. Le total vaut `8.2`, `nb_ventes` vaut 2, `nb_sandwiches` vaut 2, `nb_jus` vaut 1.
    </Enonce>
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
  <ExerciseSection id="caisse-bilan-1" label="resume_journee" type="lecture">
    <Enonce>
      Écrire `resume_journee(nb_ventes, total, nb_jus, nb_cookies, nb_sandwiches)`. Elle affiche le bilan et ne renvoie rien.

      - `nb_ventes` vaut 0 : afficher `Aucune vente.` et s'arrêter.
      - Sinon afficher le bloc `--- Bilan de la récré ---`, le total et le ticket moyen avec deux décimales, puis les trois compteurs.
      - Comparer `nb_jus`, `nb_cookies` et `nb_sandwiches` pour produire l'un des trois messages.

      Test d'égalité : 3 jus, 3 cookies, 1 sandwich affiche `Égalité : jus et cookie (3 chacun)`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un seul fichier `caisse_foyer.py` :

- en tête, un commentaire avec son nom et la classe ;
- les sept fonctions, avec ces noms-là ;
- le programme principal qui lance la journée puis appelle `resume_journee` ;
- les `print` de test peuvent rester, à condition de ne pas gêner la saisie (les regrouper sous un commentaire, ou les enlever une fois les tests passés).

Un fichier qui calcule juste mais qui stocke les tickets dans une liste ne respecte pas les contraintes.
