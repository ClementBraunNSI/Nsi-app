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

Pour deviner ce qu'est un nouvel exemple, on regarde ceux qu'on connaît déjà et qui lui ressemblent. C'est tout l'algorithme des **$k$ plus proches voisins**, le k-NN. Il n'apprend pas une formule. Il garde les exemples, mesure des distances, et suit les voisins. La proximité, ici, tient lieu de similarité.

On part d'exemples **déjà étiquetés** : on connaît la bonne réponse. En **classification**, la réponse est une catégorie : spam ou pas spam, pomme ou orange. En **régression**, la réponse est un nombre : le prix d'une maison. Dans les deux cas, l'hypothèse est la même. Des points proches dans l'espace des données portent souvent la même étiquette, ou des valeurs proches.

## Quatre gestes

On choisit d'abord $k$, le nombre de voisins que l'on accepte de consulter. On calcule ensuite la distance entre le nouvel élément et **tous** les exemples connus. On garde les $k$ plus petites distances. Puis on décide. En classification, c'est un **vote majoritaire** : la catégorie la plus fréquente parmi ces $k$ voisins l'emporte. En régression, c'est la **moyenne** de leurs valeurs.

!!! example "Exemple"
    Points de classes **A** et **B**, point inconnu **X**, $K = 3$.
    Si parmi les 3 plus proches on a 2 A et 1 B, on classe X comme **A**.

Le vote ne regarde pas les points plus loin. Un nuage entier de B, s'il est au-delà des trois voisins, ne compte pas.

## La distance euclidienne

En Première, on mesure la proximité avec la **distance euclidienne**, celle de la règle dans le plan, généralisée à plusieurs coordonnées. Entre deux points $P$ et $Q$ :

$$
d(P, Q) = \sqrt{(p_1-q_1)^2 + (p_2-q_2)^2 + \cdots + (p_n-q_n)^2}
$$

Chaque écart de coordonnée est mis au carré, pour que le signe ne compte pas, puis on somme, puis on prend la racine. En deux dimensions, Python l'écrit ainsi.

```python
import math

def distance_euclidienne(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
```

`p1[0]` et `p1[1]` sont les deux coordonnées du premier point. La même formule avec davantage de termes marche en dimension supérieure : une coordonnée de plus, un carré de plus sous la racine.

!!! warning "Échelles différentes"
    Si une coordonnée va de 0 à 100 et une autre de 0 à 100 000, la seconde **écrase** la distance.
    Avant de comparer, on met souvent les valeurs sur une même échelle (par exemple entre 0 et 1).

Sans cette mise à l'échelle, deux maisons « proches » par le nombre de pièces peuvent sembler très éloignées à cause du prix au mètre carré, simplement parce que les nombres sont plus grands. On ramène souvent chaque coordonnée entre 0 et 1 avant de calculer.

## Choisir k

| Valeur de K | Effet |
| :--- | :--- |
| **K petit** (ex. $K=1$) | Très sensible aux points aberrants : un voisin « bizarre » peut décider seul |
| **K grand** | Plus stable, mais on peut mélanger des voisins trop éloignés ; à l'extrême, c'est toujours la classe la plus fréquente globalement qui gagne |

Il n'y a pas de $k$ universel. On en essaie quelques-uns sur des exemples dont on connaît déjà l'étiquette, et l'on regarde combien de fois le vote se trompe. Avec deux classes, un $k$ **impair** évite un vote pile égal, deux contre deux.

$k = 1$ est le cas le plus fragile. Le voisin le plus proche décide seul. S'il est mal étiqueté, ou s'il est un cas isolé, toute la prédiction suit l'erreur. À l'autre bout, si $k$ vaut la taille du jeu entier, la distance ne sert plus : on répond toujours la classe majoritaire du fichier.

## Ce que l'algorithme coûte

Il est simple à expliquer et à coder. Il ne suppose pas que les données forment une droite ou un nuage de forme connue. Il classifie et il estime des nombres, selon qu'on vote ou qu'on moyenne.

Le prix est le parcours. Pour chaque nouveau point, on calcule la distance à **tous** les exemples. Plus le fichier grossit, plus une prédiction devient lente, et il faut garder tous les exemples en mémoire : il n'y a pas de modèle résumé à emporter à la place. L'échelle des coordonnées, déjà dite, peut fausser les voisins si on l'oublie.

Pour fermer : le k-NN classe, ou estime, à partir des $k$ exemples les plus proches. La distance du cours est l'euclidienne. La classification vote, la régression moyenne. Un $k$ trop petit suit le bruit. Un $k$ trop grand noie le point dans des voisins qui ne lui ressemblent plus. Les coordonnées doivent être du même ordre de grandeur. La méthode reste coûteuse quand les exemples sont très nombreux.

## Pour s'entraîner

Mettre en pratique sur des jeux de données concrets : [TP KNN](/cours/2/algo_knn) et [exercices KNN](/cours/2/algo_knn_exercices).
