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
Dans ce projet, nous allons appliquer quatre règles au même jeu de bulletins, et constater que la règle peut changer le vainqueur.

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
  <ExerciseSection id="vote-maj-1" label="Modélisation" type="lecture">
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
    </Enonce>
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
  <ExerciseSection id="vote-maj2-1" label="Premier tour" type="lecture">
    <Enonce>
      Écrire `voix_premier_tour(bulletins)` qui renvoie un dictionnaire des premières places. Sur le jeu B : Alice 4, Bob 3, Charlie 2.

      Écrire `a_majorite_absolue(voix, nb_bulletins)` qui renvoie un booléen. Avec 4 voix sur 9, Alice n'a pas la majorité absolue. Avec trois bulletins qui commencent tous par Alice, la fonction renvoie `True`.

      Écrire `finalistes(voix)` qui renvoie les deux noms ayant le plus de voix, le meilleur en premier. Sur le jeu B : Alice puis Bob. S'il y a égalité pour la deuxième place, décrire la règle choisie dans un commentaire et s'y tenir (le jeu B n'a pas cette égalité).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-maj2-2" label="Second tour" type="lecture">
    <Enonce>
      Écrire `duel(bulletins, candidat1, candidat2)`.

      1. Parcourir les bulletins.
      2. Sur chacun, regarder qui de `candidat1` ou `candidat2` apparaît en premier.
      3. Compter les deux voix.
      4. Renvoyer le gagnant. En cas d'égalité, renvoyer `"égalité"`.

      Sur le jeu B, `duel(bulletins, "Alice", "Bob")` renvoie `"Bob"` (5 contre 4).

      Écrire `scrutin_deux_tours(bulletins, candidats)` qui enchaîne premier tour, test de majorité absolue, puis duel des finalistes. Elle renvoie le nom élu. Sur le jeu B, elle renvoie `"Bob"`.
    </Enonce>
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
  <ExerciseSection id="vote-condorcet-1" label="Tous les duels" type="lecture">
    <Enonce>
      Écrire `duels(bulletins, candidats)` qui organise chaque paire une seule fois (Alice contre Bob, pas aussi Bob contre Alice).

      Pour chaque paire, appeler `duel` et afficher une ligne du type `Alice vs Bob : Bob (5-4)`. La fonction peut renvoyer un dictionnaire des résultats, à condition que l'affichage soit présent.

      Jeu B : Bob bat Alice, Charlie bat Alice, Charlie bat Bob.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-condorcet-2" label="Vainqueur de Condorcet" type="lecture">
    <Enonce>
      Écrire `vainqueur_condorcet(bulletins, candidats)`.

      Un candidat est vainqueur s'il gagne chaque duel qui le concerne. Renvoyer son nom, ou `None` si personne ne remplit cette condition.

      - Jeu B : renvoyer `"Charlie"`.
      - Jeu C : renvoyer `None` et afficher `Paradoxe de Condorcet : aucun candidat ne gagne tous ses duels.`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Borda et comparaison <Icone nom="calculator" />

Avec N candidats, le premier d'un bulletin reçoit N − 1 points, le deuxième N − 2, et le dernier reçoit 0.

Sur un bulletin `["Alice", "Charlie", "Bob"]`, Alice reçoit 2 points, Charlie 1 point, Bob 0 point.

Jeu B complet : Alice 8, Bob 8, Charlie 11. Vainqueur : Charlie.

Le même paquet de bulletins donne donc trois vainqueurs différents : Alice au premier tour, Bob au second tour, Charlie chez Condorcet et Borda.

<ExerciseTabs courseId="proj_vote_borda" courseTitle="Méthode de Borda">
  <ExerciseSection id="vote-borda-1" label="Calcul des points" type="lecture">
    <Enonce>
      Écrire `calculer_borda(bulletins, candidats)`.

      1. Initialiser un dictionnaire de scores à 0 pour chaque candidat.
      2. Pour chaque bulletin, le candidat à la position `i` (en partant de 0) reçoit `N - 1 - i` points.
      3. Renvoyer le dictionnaire des scores.

      Contrôle sur un seul bulletin `["Alice", "Charlie", "Bob"]` : Alice 2, Charlie 1, Bob 0.

      Jeu B complet : Alice 8, Bob 8, Charlie 11.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-borda-2" label="Comparaison" type="lecture">
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
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `votes.py` : commentaire d'en-tête avec le nom et la classe, les fonctions demandées, les trois jeux d'essai (A, B et C), et les affichages correspondants.

## 5. Pour aller plus loin

*   **Jugement majoritaire.** Chaque bulletin donne une mention (Excellent, Bien, Passable, Insuffisant) plutôt qu'un classement. La mention médiane départage les candidats.
*   **Diagramme.** Afficher les voix du premier tour avec une ligne de caractères `#` par candidat, par exemple `Alice : ####`.
