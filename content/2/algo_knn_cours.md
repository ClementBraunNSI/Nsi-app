---
title: Algorithme des K Plus Proches Voisins
description: >-
  Comprendre l'algorithme KNN, son fonctionnement, la distance euclidienne et
  ses applications en classification et régression.
level: premiere
chapter: Algorithmique
icon: "brain"
badgeId: premiere_cours
prerequisites: []
audience: public
groupe: knn
groupeTitre: "k plus proches voisins (KNN)"
---

# Algorithme des k plus proches voisins

Pour deviner la catégorie d'un nouvel exemple, on regarde les exemples déjà connus qui lui ressemblent le plus. C'est le principe de l'algorithme des **$k$ plus proches voisins**, ou k-NN. Il n'apprend pas de formule : il conserve les exemples, calcule des distances et se fie aux voisins les plus proches. Deux exemples sont ici considérés comme semblables quand ils sont proches.

On part d'exemples **déjà étiquetés** : on connaît la bonne réponse. En **classification**, la réponse est une catégorie : spam ou pas spam, pomme ou orange. En **régression**, la réponse est un nombre : le prix d'une maison. Dans les deux cas, on fait la même hypothèse : des points proches dans l'espace des données ont souvent la même étiquette, ou des valeurs voisines.

## Les étapes de l'algorithme

On choisit d'abord $k$, le nombre de voisins que l'on accepte de consulter. On calcule ensuite la distance entre le nouvel élément et **tous** les exemples connus. On ne garde que les $k$ exemples les plus proches, puis on décide. En classification, on procède à un **vote majoritaire** : la catégorie la plus fréquente parmi ces $k$ voisins l'emporte. En régression, on calcule la **moyenne** de leurs valeurs.

!!! example "Exemple"
    On dispose de points des classes **A** et **B** et d'un point inconnu **X**, avec $K = 3$.
    Si parmi les 3 plus proches on a 2 A et 1 B, on classe X comme **A**.

Le vote ne tient pas compte des points plus éloignés : même un grand nombre de points B ne compte pas s'ils sont au-delà des trois plus proches voisins.

## La distance euclidienne

En Première, on mesure la proximité avec la **distance euclidienne**, celle de la règle dans le plan, généralisée à plusieurs coordonnées. Entre deux points $P$ et $Q$ :

$$
d(P, Q) = \sqrt{(p_1-q_1)^2 + (p_2-q_2)^2 + \cdots + (p_n-q_n)^2}
$$

Chaque écart entre coordonnées est mis au carré, pour que son signe ne compte pas. On additionne ensuite ces carrés, puis on prend la racine de la somme. En deux dimensions, cela s'écrit ainsi en Python :

```python
import math

def distance_euclidienne(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
```

`p1[0]` et `p1[1]` sont les deux coordonnées du premier point. La même formule fonctionne en dimension supérieure : chaque coordonnée supplémentaire ajoute un carré sous la racine.

!!! warning "Échelles différentes"
    Si une coordonnée va de 0 à 100 et une autre de 0 à 100 000, la seconde **écrase** la distance.
    Avant de comparer, on met souvent les valeurs sur une même échelle (par exemple entre 0 et 1).

Sans cette mise à l'échelle, deux maisons « proches » par le nombre de pièces peuvent sembler très éloignées à cause du prix au mètre carré, simplement parce que les nombres sont plus grands. C'est pourquoi on ramène souvent chaque coordonnée entre 0 et 1 avant de calculer.

## Choisir k

| Valeur de K | Effet |
| :--- | :--- |
| **K petit** (ex. $K=1$) | Très sensible aux points aberrants : un voisin « bizarre » peut décider seul |
| **K grand** | Plus stable, mais on peut prendre en compte des voisins trop éloignés. À l'extrême, c'est toujours la classe la plus fréquente globalement qui gagne |

Il n'y a pas de $k$ universel. On en essaie quelques-uns sur des exemples dont on connaît déjà l'étiquette, et l'on regarde combien de fois le vote se trompe. Avec deux classes, un $k$ **impair** évite une égalité dans le vote, par exemple deux voix contre deux.

Le cas $k = 1$ est le plus fragile, car le voisin le plus proche décide seul. S'il est mal étiqueté, ou s'il s'agit d'un cas isolé, la prédiction est fausse. À l'inverse, si $k$ est égal à la taille du jeu de données, la distance ne sert plus à rien : la réponse est toujours la classe majoritaire du fichier.

## Avantages et inconvénients

L'algorithme est simple à expliquer et à programmer. Il ne suppose pas que les données ont une forme particulière, comme une droite. Il permet aussi bien de classer des exemples que d'estimer des nombres, selon qu'on fait voter les voisins ou qu'on calcule leur moyenne.

Son principal inconvénient est son coût : pour chaque nouveau point, il faut calculer la distance à **tous** les exemples. Plus le fichier est gros, plus une prédiction est lente, et il faut garder tous les exemples en mémoire, car l'algorithme ne produit pas de modèle résumé. Enfin, comme on l'a vu, des coordonnées d'échelles différentes peuvent fausser le choix des voisins.

En résumé, le k-NN classe un exemple, ou estime une valeur, à partir des $k$ exemples les plus proches, en utilisant la distance euclidienne. En classification, les voisins votent, et en régression, on calcule la moyenne de leurs valeurs. Un $k$ trop petit rend la prédiction sensible aux erreurs, alors qu'un $k$ trop grand fait intervenir des voisins qui ne ressemblent plus au point étudié. Les coordonnées doivent être du même ordre de grandeur, et la méthode reste coûteuse quand les exemples sont très nombreux.

## Pour s'entraîner

Mettre en pratique sur des jeux de données concrets : [TP KNN](/cours/2/algo_knn) et [exercices KNN](/cours/2/algo_knn_exercices).
