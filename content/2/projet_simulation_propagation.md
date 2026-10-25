---
title: 'Boucles : Simulation de Propagation'
description: Modéliser la propagation d'une rumeur ou d'un virus dans une population.
level: premiere
chapter: Projets
icon: "bug"
badgeId: premiere_projet_virus
prerequisites:
  - projet_systeme_vote
audience: public
---

# <Icone nom="bug" /> Projet - Simulation de Propagation

Le but de ce projet est de simuler, jour après jour, la propagation d'une rumeur dans une population fermée.
Dans ce projet, nous allons écrire une boucle `while` qui s'arrête quand tout le monde est au courant, sans jamais dépasser la population.

Chaque personne qui connaît la rumeur la transmet à un nombre fixe de nouvelles personnes. Les « infectés » du programme sont les personnes qui connaissent la rumeur et la transmettent encore. Dans la version de base, personne n'oublie.

## 1. Le modèle <Icone nom="megaphone" />

*   Au jour 0, une seule personne connaît la rumeur (`infectes = 1`).
*   Chaque jour, les nouveaux cas valent `infectes * taux`.
*   Ces nouveaux cas s'ajoutent aux personnes déjà au courant.
*   Le nombre de personnes au courant ne dépasse jamais la population.
*   On recommence tant que `infectes` est strictement inférieur à la population.

`taux` vaut 2 quand chaque personne informée en informe deux nouvelles.

<ExerciseTabs courseId="premiere_projet_virus" courseTitle="Simulation Rumeur">
  <ExerciseSection id="proj-virus-1" label="Le plafond" type="lecture">
    <Enonce>
      Écrire `nouveaux_cas(infectes, taux)` et `plafonner(infectes, population)`.

      ```python
      def nouveaux_cas(infectes: float, taux: float) -> float:
          """Renvoie infectes * taux."""

      def plafonner(infectes: float, population: int) -> float:
          """Renvoie infectes, ou population si infectes la dépasse."""
      ```

      `nouveaux_cas(27, 2)` renvoie `54`. `plafonner(81, 30)` renvoie `30`. `plafonner(27, 30)` renvoie `27`. On peut utiliser `min`, ou un `if`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-virus-2" label="La boucle" type="python">
    <Enonce>
      Écrire `simuler(population, taux)`. Elle affiche chaque jour et renvoie le nombre de jours écoulés.

      - `jours` commence à 0, `infectes` commence à 1.
      - Afficher `Jour 0 : 1 / ...` avant la boucle.
      - Tant que `infectes` est inférieur à `population` : calculer les nouveaux cas, les ajouter, plafonner, augmenter `jours` de 1, afficher la ligne du jour.
      - Après la boucle, afficher `Toute la population est touchée en X jour(s).`
      - Renvoyer `jours`.

      *Attention : si la population vaut 1 dès le départ, la boucle ne tourne pas et la fonction renvoie 0.*

      Vérifier les trois exemples par des appels directs, avant d'ajouter `input`.

      Population 30, taux 2. Le jour 4 : 27 × 2 = 54 nouveaux cas, 27 + 54 = 81, ramené à 30. `simuler(30, 2)` renvoie `4`.

      ```text
      Jour 0 : 1 / 30
      Jour 1 : 3 / 30
      Jour 2 : 9 / 30
      Jour 3 : 27 / 30
      Jour 4 : 30 / 30
      Toute la population est touchée en 4 jour(s).
      ```

      Population 8, taux 1 : la population double à chaque jour (1, 2, 4, 8). `simuler(8, 1)` renvoie `3`.

      Population 1, taux 2 : `simuler(1, 2)` renvoie `0`.

      ```text
      Jour 0 : 1 / 1
      Toute la population est touchée en 0 jour(s).
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-virus-3" label="La saisie" type="python">
    <Enonce>
      Écrire le programme principal du fichier `rumeur.py`.

      1. Demander `Population totale : `. `input` renvoie un texte : le convertir en `int`. Reposer la question tant que la valeur est inférieure à 1.
      2. Demander `Taux de propagation : `. Le convertir en `float`. Reposer la question tant que la valeur est inférieure ou égale à 0. Un taux nul figerait la boucle : le programme ne doit pas l'accepter.
      3. Appeler `simuler` avec ces deux valeurs.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `rumeur.py` : commentaire d'en-tête avec le nom et la classe, les trois fonctions, la saisie protégée par des `while`, et un appel qui lance la simulation avec les valeurs tapées.

## 2. Pour aller plus loin

*   **Oubli.** Chaque jour, après les nouveaux cas, une personne informée oublie la rumeur et ne la transmet plus, tant qu'il reste au moins deux transmetteurs. Elle compte encore dans un total `deja_au_courant` (elle l'a entendue). La boucle s'arrête quand `deja_au_courant` atteint la population. Deux variables suffisent : on ne stocke pas les noms.
*   **Barre.** Sur 20 caractères, afficher la part déjà touchée, par exemple `Jour 3 : [##################..] 27/30`. Le nombre de `#` vaut `int(20 * infectes / population)`.
