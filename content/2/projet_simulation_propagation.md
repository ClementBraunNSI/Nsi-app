---
title: "Boucles : Simulation de Propagation"
description: "Modéliser la propagation d'une rumeur ou d'un virus dans une population."
level: premiere
chapter: "Projets"
icon: "🦠"
badgeId: "premiere_projet_virus"
---

# 🦠 Projet - Simulation de Propagation

Ce projet vise à simuler, tour par tour, comment une information (rumeur) ou un agent pathogène (virus) se propage dans une population fermée. C'est une application concrète des **boucles `while` ou `for`** et de la mise à jour de variables.

## 1. Le Scénario

Imaginez une classe de 30 élèves.
*   Au jour 0, 1 seul élève connaît la rumeur.
*   Chaque jour, chaque élève qui connaît la rumeur la répète à **2 nouvelles personnes** (taux de propagation `R = 2`).
*   Combien de jours faut-il pour que toute la classe (ou tout le lycée) soit au courant ?

## 2. Cahier des Charges

Le programme doit :
1.  Demander la taille de la population totale (ex: 1000 personnes).
2.  Demander le taux de propagation (combien de nouvelles personnes sont contaminées par chaque malade chaque jour).
3.  Simuler jour après jour l'évolution.
4.  S'arrêter quand tout le monde est touché.

## 3. Étapes de réalisation

### Étape 1 : Variables d'état
Il nous faut suivre :
*   `jours` : le compteur de temps (commence à 0).
*   `infectes` : le nombre de personnes touchées (commence à 1).
*   `population_totale` : la limite à ne pas dépasser.

### Étape 2 : La Boucle de Simulation
Tant que (`while`) le nombre d'`infectes` est inférieur à la `population_totale`, on continue la simulation.

### Étape 3 : Calcul du tour
Dans la boucle :
1.  On calcule les nouveaux cas : `nouveaux = infectes * taux`.
2.  On met à jour le total : `infectes = infectes + nouveaux`.
3.  ⚠️ **Attention** : On ne peut pas dépasser la population totale ! Il faut utiliser `min()` ou une condition `if` pour plafonner `infectes`.
4.  On incrémente le jour : `jours = jours + 1`.
5.  On affiche l'état du jour.

## 4. Pour aller plus loin (Bonus) 🚀

*   **Immunité / Oubli** : Introduire une variable qui fait que chaque jour, un certain nombre de personnes "guérissent" ou "oublient" la rumeur et ne la transmettent plus.
*   **Visualisation textuelle** : Afficher une barre de progression avec des caractères `#` pour visualiser la proportion de la population atteinte.
    Exemple : `Jour 3 : [######..............] 30%`

---

<ExerciseTabs courseId="premiere_projet_virus" courseTitle="Simulation Rumeur">
  <ExerciseSection id="proj-virus-1" label="À vous de jouer !">
    <Enonce>
    À vous de coder ! Suivez les étapes ci-dessus pour réaliser votre propre simulateur.
    Essayez de visualiser la propagation jour par jour.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
