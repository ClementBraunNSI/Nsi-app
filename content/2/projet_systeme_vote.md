---
title: 'Algorithmes : Système de Vote'
description: 'Implémentation de différents systèmes de scrutin (Majoritaire, Condorcet)'
level: premiere
chapter: Projets
icon: "vote"
badgeId: premiere_projet_vote
prerequisites: []
audience: public
---

# <Icone nom="vote" /> Projet - Simulateur de Système de Vote

Le but de ce projet est de programmer un système de dépouillement.
Ce projet consiste à appliquer quatre règles au même jeu de bulletins, et constater que la règle peut changer le vainqueur.

On utilise des listes et des dictionnaires : une liste de noms pour un scrutin à un tour, une liste de classements pour les autres méthodes, un dictionnaire pour les scores. Le programme ne demande pas les votes au clavier : les bulletins sont écrits dans le fichier `votes.py`, ce qui permet de vérifier les résultats.

Un bulletin de classement contient chaque candidat une seule fois.

## 1. Scrutin à un tour <Icone nom="vote" />

Celui qui a le plus de voix gagne. Il n'y a pas de seuil de 50 % dans cette partie.

Jeu A (un seul nom par électeur) :

```python
urnes = ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"]
```

```text
Alice : 3 voix
Bob : 2 voix
Charlie : 1 voix
Vainqueur : Alice
```

L'ordre d'affichage est celui de la première apparition dans la liste.

<ExerciseTabs courseId="proj_vote_maj" courseTitle="Majoritaire">
  <ExerciseSection id="vote-maj-1" label="Modélisation" type="python">
    <CodeDepart>
    ```python
    urnes = ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"]
    urnes_egalite = ["Alice", "Bob", "Alice", "Bob"]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `depouiller_majoritaire(urnes)`.

      1. Parcourir `urnes` et compter les voix dans un dictionnaire.
      2. Afficher chaque candidat et son nombre de voix, dans l'ordre de première apparition.
      3. Renvoyer le nom du vainqueur.

      Si deux candidats ou plus partagent le maximum, les afficher et renvoyer `"égalité"`. Si `urnes` est vide, afficher `Aucun bulletin.` et renvoyer `"aucun"`.

      Le jeu A renvoie `"Alice"`.

      ```python
      urnes_egalite = ["Alice", "Bob", "Alice", "Bob"]
      ```

      Alice et Bob ont 2 voix. La fonction renvoie `"égalité"`.

    <Correction>
    ```python
    def depouiller_majoritaire(urnes):
        if len(urnes) == 0:
            print("Aucun bulletin.")
            return "aucun"
        voix = {}
        for nom in urnes:
            voix[nom] = voix.get(nom, 0) + 1
        for nom in voix:
            print(nom, ":", voix[nom], "voix")
        maximum = max(voix.values())
        gagnants = [nom for nom in voix if voix[nom] == maximum]
        if len(gagnants) > 1:
            print("Égalité :", ", ".join(gagnants))
            return "égalité"
        print("Vainqueur :", gagnants[0])
        return gagnants[0]

    depouiller_majoritaire(urnes)
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
    valeur, texte = _sortie(depouiller_majoritaire, ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"])
    assert valeur == "Alice", "Le jeu A renvoie Alice."
    lignes = [l.strip() for l in texte.strip().splitlines()]
    assert lignes[:3] == ["Alice : 3 voix", "Bob : 2 voix", "Charlie : 1 voix"], "Afficher Alice : 3 voix, Bob : 2 voix, Charlie : 1 voix, dans l'ordre de première apparition."
    valeur, _ = _sortie(depouiller_majoritaire, ["Alice", "Bob", "Alice", "Bob"])
    assert valeur == "égalité", "Alice et Bob à 2 voix : égalité."
    valeur, texte = _sortie(depouiller_majoritaire, [])
    assert valeur == "aucun" and "Aucun bulletin." in texte, "Urnes vides : Aucun bulletin. et aucun."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Scrutin à deux tours 2️⃣

Chaque électeur classe tous les candidats. Au premier tour, on ne regarde que le premier nom du bulletin. Si un candidat a strictement plus de la moitié des bulletins, il est élu tout de suite. Sinon, les deux meilleurs s'affrontent : sur chaque bulletin, on donne la voix à celui des deux qui est classé devant l'autre.

Jeu B (neuf bulletins, trois candidats) :

```python
bulletins = [
    ["Alice", "Charlie", "Bob"],
    ["Alice", "Charlie", "Bob"],
    ["Alice", "Charlie", "Bob"],
    ["Alice", "Charlie", "Bob"],
    ["Bob", "Charlie", "Alice"],
    ["Bob", "Charlie", "Alice"],
    ["Bob", "Charlie", "Alice"],
    ["Charlie", "Bob", "Alice"],
    ["Charlie", "Bob", "Alice"],
]
candidats = ["Alice", "Bob", "Charlie"]
```

| Règle | Résultat attendu |
| --- | --- |
| Premières places | Alice 4, Bob 3, Charlie 2 |
| Majorité absolue | non : il faudrait au moins 5 voix sur 9 |
| Second tour (Alice contre Bob) | Bob 5, Alice 4. Vainqueur : Bob |

<ExerciseTabs courseId="proj_vote_maj2" courseTitle="Deux Tours">
  <ExerciseSection id="vote-maj2-1" label="Premier tour" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `voix_premier_tour(bulletins)` qui renvoie un dictionnaire des premières places. Sur le jeu B : Alice 4, Bob 3, Charlie 2.

      Écrire `a_majorite_absolue(voix, nb_bulletins)` qui renvoie un booléen. Avec 4 voix sur 9, Alice n'a pas la majorité absolue. Avec trois bulletins qui commencent tous par Alice, la fonction renvoie `True`.

      Écrire `finalistes(voix)` qui renvoie les deux noms ayant le plus de voix, le meilleur en premier. Sur le jeu B : Alice puis Bob. S'il y a égalité pour la deuxième place, décrire la règle choisie dans un commentaire et s'y tenir (le jeu B n'a pas cette égalité).

    <Correction>
    ```python
    def voix_premier_tour(bulletins):
        voix = {}
        for bulletin in bulletins:
            voix[bulletin[0]] = voix.get(bulletin[0], 0) + 1
        return voix

    def a_majorite_absolue(voix, nb_bulletins):
        for nom in voix:
            if voix[nom] > nb_bulletins / 2:
                return True
        return False

    def finalistes(voix):
        # Égalité pour la deuxième place : on garde le premier rencontré.
        tries = sorted(voix, key=lambda nom: voix[nom], reverse=True)
        return tries[:2]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert voix_premier_tour(bulletins) == {"Alice": 4, "Bob": 3, "Charlie": 2}, "Jeu B : Alice 4, Bob 3, Charlie 2."
    assert a_majorite_absolue({"Alice": 4, "Bob": 3, "Charlie": 2}, 9) is False, "4 voix sur 9 : pas de majorité absolue."
    assert a_majorite_absolue(voix_premier_tour([["Alice", "Bob"]] * 3), 3) is True, "3 voix sur 3 : majorité absolue."
    assert a_majorite_absolue({"Alice": 5, "Bob": 4}, 9) is True, "5 voix sur 9 : majorité absolue."
    assert list(finalistes({"Alice": 4, "Bob": 3, "Charlie": 2})) == ["Alice", "Bob"], "Jeu B : finalistes Alice puis Bob."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="vote-maj2-2" label="Second tour" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]

    def voix_premier_tour(bulletins):
        voix = {}
        for bulletin in bulletins:
            voix[bulletin[0]] = voix.get(bulletin[0], 0) + 1
        return voix

    def a_majorite_absolue(voix, nb_bulletins):
        for nom in voix:
            if voix[nom] > nb_bulletins / 2:
                return True
        return False

    def finalistes(voix):
        # Égalité pour la deuxième place : on garde le premier rencontré.
        tries = sorted(voix, key=lambda nom: voix[nom], reverse=True)
        return tries[:2]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `duel(bulletins, candidat1, candidat2)`.

      1. Parcourir les bulletins.
      2. Sur chacun, regarder qui de `candidat1` ou `candidat2` apparaît en premier.
      3. Compter les deux voix.
      4. Renvoyer le gagnant. En cas d'égalité, renvoyer `"égalité"`.

      Sur le jeu B, `duel(bulletins, "Alice", "Bob")` renvoie `"Bob"` (5 contre 4).

      Écrire `scrutin_deux_tours(bulletins, candidats)` qui enchaîne premier tour, test de majorité absolue, puis duel des finalistes. Elle renvoie le nom élu. Sur le jeu B, elle renvoie `"Bob"`.

    <Correction>
    ```python
    def duel(bulletins, candidat1, candidat2):
        v1 = 0
        v2 = 0
        for bulletin in bulletins:
            if bulletin.index(candidat1) < bulletin.index(candidat2):
                v1 = v1 + 1
            else:
                v2 = v2 + 1
        if v1 > v2:
            return candidat1
        if v2 > v1:
            return candidat2
        return "égalité"

    def scrutin_deux_tours(bulletins, candidats):
        voix = voix_premier_tour(bulletins)
        for nom in voix:
            if voix[nom] > len(bulletins) / 2:
                return nom
        premier, second = finalistes(voix)
        return duel(bulletins, premier, second)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert duel(bulletins, "Alice", "Bob") == "Bob", "Jeu B : Bob bat Alice 5 à 4."
    assert duel(bulletins, "Bob", "Alice") == "Bob", "L'ordre des paramètres ne change pas le gagnant."
    assert duel([["A", "B"], ["B", "A"]], "A", "B") == "égalité", "Une voix chacun : égalité."
    assert scrutin_deux_tours(bulletins, candidats) == "Bob", "Jeu B : le scrutin à deux tours élit Bob."
    assert scrutin_deux_tours([["Alice", "Bob", "Charlie"]] * 3 + [["Bob", "Alice", "Charlie"]], candidats) == "Alice", "Majorité absolue au premier tour : élue directement."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Condorcet <Icone nom="swords" />

Un vainqueur de Condorcet bat chaque autre candidat en duel. Il n'en existe pas toujours.

Sur le jeu B : Charlie bat Alice (5-4) et Charlie bat Bob (6-3). Charlie gagne ses deux duels.

Jeu C (paradoxe de Condorcet) :

```python
cycle = [
    ["Alice", "Bob", "Charlie"],
    ["Bob", "Charlie", "Alice"],
    ["Charlie", "Alice", "Bob"],
]
```

Alice bat Bob (2 voix contre 1), Bob bat Charlie (2 contre 1), Charlie bat Alice (2 contre 1). Personne ne gagne tous ses duels.

<ExerciseTabs courseId="proj_vote_condorcet" courseTitle="Condorcet">
  <ExerciseSection id="vote-condorcet-1" label="Tous les duels" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]

    def duel(bulletins, candidat1, candidat2):
        v1 = 0
        v2 = 0
        for bulletin in bulletins:
            if bulletin.index(candidat1) < bulletin.index(candidat2):
                v1 = v1 + 1
            else:
                v2 = v2 + 1
        if v1 > v2:
            return candidat1
        if v2 > v1:
            return candidat2
        return "égalité"
    ```
    </CodeDepart>
    <Enonce>
      Écrire `duels(bulletins, candidats)` qui organise chaque paire une seule fois (Alice contre Bob, pas aussi Bob contre Alice).

      Pour chaque paire, appeler `duel` et afficher une ligne du type `Alice vs Bob : Bob (5-4)`. La fonction peut renvoyer un dictionnaire des résultats, à condition que l'affichage soit présent.

      Jeu B : Bob bat Alice, Charlie bat Alice, Charlie bat Bob.

    <Correction>
    ```python
    def duels(bulletins, candidats):
        resultats = {}
        for i in range(len(candidats)):
            for j in range(i + 1, len(candidats)):
                a = candidats[i]
                b = candidats[j]
                va = 0
                for bulletin in bulletins:
                    if bulletin.index(a) < bulletin.index(b):
                        va = va + 1
                vb = len(bulletins) - va
                gagnant = duel(bulletins, a, b)
                print(a, "vs", b, ":", gagnant, "(" + str(max(va, vb)) + "-" + str(min(va, vb)) + ")")
                resultats[(a, b)] = gagnant
        return resultats

    duels(bulletins, candidats)
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
    _, texte = _sortie(duels, bulletins, candidats)
    lignes = [" ".join(l.split()) for l in texte.strip().splitlines()]
    assert len(lignes) == 3, "Trois paires, une ligne chacune : chaque paire une seule fois."
    assert "Alice vs Bob : Bob (5-4)" in lignes, "Ligne attendue : Alice vs Bob : Bob (5-4)"
    assert any(l.startswith("Alice vs Charlie : Charlie") for l in lignes), "Charlie bat Alice."
    assert any(l.startswith("Bob vs Charlie : Charlie") for l in lignes), "Charlie bat Bob."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="vote-condorcet-2" label="Vainqueur de Condorcet" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]

    def duel(bulletins, candidat1, candidat2):
        v1 = 0
        v2 = 0
        for bulletin in bulletins:
            if bulletin.index(candidat1) < bulletin.index(candidat2):
                v1 = v1 + 1
            else:
                v2 = v2 + 1
        if v1 > v2:
            return candidat1
        if v2 > v1:
            return candidat2
        return "égalité"
    ```
    </CodeDepart>
    <Enonce>
      Écrire `vainqueur_condorcet(bulletins, candidats)`.

      Un candidat est vainqueur s'il gagne chaque duel qui le concerne. Renvoyer son nom, ou `None` si personne ne remplit cette condition.

      - Jeu B : renvoyer `"Charlie"`.
      - Jeu C : renvoyer `None` et afficher `Paradoxe de Condorcet : aucun candidat ne gagne tous ses duels.`

    <Correction>
    ```python
    def vainqueur_condorcet(bulletins, candidats):
        for c in candidats:
            gagne_tout = True
            for autre in candidats:
                if autre != c and duel(bulletins, c, autre) != c:
                    gagne_tout = False
            if gagne_tout:
                return c
        print("Paradoxe de Condorcet : aucun candidat ne gagne tous ses duels.")
        return None
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
    valeur, _ = _sortie(vainqueur_condorcet, bulletins, candidats)
    assert valeur == "Charlie", "Jeu B : Charlie gagne tous ses duels."
    valeur, texte = _sortie(vainqueur_condorcet, cycle, candidats)
    assert valeur is None, "Jeu C : aucun vainqueur, None."
    assert "Paradoxe de Condorcet : aucun candidat ne gagne tous ses duels." in texte, "Jeu C : afficher le message du paradoxe."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 4. Borda et comparaison <Icone nom="calculator" />

Avec N candidats, le premier d'un bulletin reçoit N − 1 points, le deuxième N − 2, et le dernier reçoit 0.

Sur un bulletin `["Alice", "Charlie", "Bob"]`, Alice reçoit 2 points, Charlie 1 point, Bob 0 point.

Jeu B complet : Alice 8, Bob 8, Charlie 11. Vainqueur : Charlie.

Le même paquet de bulletins donne donc trois vainqueurs différents : Alice au premier tour, Bob au second tour, Charlie chez Condorcet et Borda.

<ExerciseTabs courseId="proj_vote_borda" courseTitle="Méthode de Borda">
  <ExerciseSection id="vote-borda-1" label="Calcul des points" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `calculer_borda(bulletins, candidats)`.

      1. Initialiser un dictionnaire de scores à 0 pour chaque candidat.
      2. Pour chaque bulletin, le candidat à la position `i` (en partant de 0) reçoit `N - 1 - i` points.
      3. Renvoyer le dictionnaire des scores.

      Contrôle sur un seul bulletin `["Alice", "Charlie", "Bob"]` : Alice 2, Charlie 1, Bob 0.

      Jeu B complet : Alice 8, Bob 8, Charlie 11.

    <Correction>
    ```python
    def calculer_borda(bulletins, candidats):
        scores = {}
        for c in candidats:
            scores[c] = 0
        n = len(candidats)
        for bulletin in bulletins:
            for i in range(len(bulletin)):
                scores[bulletin[i]] = scores[bulletin[i]] + n - 1 - i
        return scores
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert calculer_borda([["Alice", "Charlie", "Bob"]], candidats) == {"Alice": 2, "Bob": 0, "Charlie": 1}, "Un bulletin Alice, Charlie, Bob : Alice 2, Charlie 1, Bob 0."
    assert calculer_borda(bulletins, candidats) == {"Alice": 8, "Bob": 8, "Charlie": 11}, "Jeu B : Alice 8, Bob 8, Charlie 11."
    assert calculer_borda([], candidats) == {"Alice": 0, "Bob": 0, "Charlie": 0}, "Sans bulletin, chaque candidat a 0 point."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="vote-borda-2" label="Comparaison" type="python">
    <CodeDepart>
    ```python
    bulletins = [
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Alice", "Charlie", "Bob"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Bob", "Alice"],
        ["Charlie", "Bob", "Alice"],
    ]
    candidats = ["Alice", "Bob", "Charlie"]
    cycle = [
        ["Alice", "Bob", "Charlie"],
        ["Bob", "Charlie", "Alice"],
        ["Charlie", "Alice", "Bob"],
    ]

    def voix_premier_tour(bulletins):
        voix = {}
        for bulletin in bulletins:
            voix[bulletin[0]] = voix.get(bulletin[0], 0) + 1
        return voix

    def a_majorite_absolue(voix, nb_bulletins):
        for nom in voix:
            if voix[nom] > nb_bulletins / 2:
                return True
        return False

    def finalistes(voix):
        # Égalité pour la deuxième place : on garde le premier rencontré.
        tries = sorted(voix, key=lambda nom: voix[nom], reverse=True)
        return tries[:2]

    def duel(bulletins, candidat1, candidat2):
        v1 = 0
        v2 = 0
        for bulletin in bulletins:
            if bulletin.index(candidat1) < bulletin.index(candidat2):
                v1 = v1 + 1
            else:
                v2 = v2 + 1
        if v1 > v2:
            return candidat1
        if v2 > v1:
            return candidat2
        return "égalité"

    def scrutin_deux_tours(bulletins, candidats):
        voix = voix_premier_tour(bulletins)
        for nom in voix:
            if voix[nom] > len(bulletins) / 2:
                return nom
        premier, second = finalistes(voix)
        return duel(bulletins, premier, second)

    def vainqueur_condorcet(bulletins, candidats):
        for c in candidats:
            gagne_tout = True
            for autre in candidats:
                if autre != c and duel(bulletins, c, autre) != c:
                    gagne_tout = False
            if gagne_tout:
                return c
        print("Paradoxe de Condorcet : aucun candidat ne gagne tous ses duels.")
        return None

    def calculer_borda(bulletins, candidats):
        scores = {}
        for c in candidats:
            scores[c] = 0
        n = len(candidats)
        for bulletin in bulletins:
            for i in range(len(bulletin)):
                scores[bulletin[i]] = scores[bulletin[i]] + n - 1 - i
        return scores
    ```
    </CodeDepart>
    <Enonce>
      Écrire `vainqueur_borda(scores)` qui renvoie le nom au score maximal, ou `"égalité"` si plusieurs candidats partagent ce maximum.

      Sur le jeu B, elle renvoie `"Charlie"`.

      Dans le programme principal, afficher côte à côte les quatre résultats du jeu B :

      ```text
      Un tour : Alice
      Deux tours : Bob
      Condorcet : Charlie
      Borda : Charlie
      ```

      Sous cet affichage, cinq lignes de commentaires expliquent pourquoi la règle change le vainqueur, en s'appuyant sur les effectifs du tableau (4, 3 et 2 au premier tour, duel 5-4, scores 8, 8 et 11).

    <Correction>
    ```python
    def vainqueur_borda(scores):
        maximum = max(scores.values())
        gagnants = [nom for nom in scores if scores[nom] == maximum]
        if len(gagnants) > 1:
            return "égalité"
        return gagnants[0]

    print("Un tour : Alice")
    print("Deux tours :", scrutin_deux_tours(bulletins, candidats))
    print("Condorcet :", vainqueur_condorcet(bulletins, candidats))
    print("Borda :", vainqueur_borda(calculer_borda(bulletins, candidats)))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert vainqueur_borda({"Alice": 8, "Bob": 8, "Charlie": 11}) == "Charlie", "Jeu B : Charlie."
    assert vainqueur_borda({"Alice": 8, "Bob": 8}) == "égalité", "Deux candidats au maximum : égalité."
    lignes = [" ".join(l.split()) for l in SORTIE.strip().splitlines()]
    assert lignes[-4:] == ["Un tour : Alice", "Deux tours : Bob", "Condorcet : Charlie", "Borda : Charlie"], "Afficher les quatre résultats du jeu B."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `votes.py` : commentaire d'en-tête avec le nom et la classe, les fonctions demandées, les trois jeux d'essai (A, B et C), et les affichages correspondants.

## 5. Pour aller plus loin

*   **Jugement majoritaire.** Chaque bulletin donne une mention (Excellent, Bien, Passable, Insuffisant) plutôt qu'un classement. La mention médiane départage les candidats.
*   **Diagramme.** Afficher les voix du premier tour avec une ligne de caractères `#` par candidat, par exemple `Alice : ####`.
