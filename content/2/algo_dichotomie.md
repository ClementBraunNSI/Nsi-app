---
title: Recherche Dichotomique
description: Algorithme de recherche efficace dans une liste triée
level: premiere
chapter: Algorithmique
icon: "search"
badgeId: premiere_recherche_dichotomique
prerequisites:
  - algo_gloutons
audience: public
---

# Recherche dichotomique

Pour chercher un mot dans un dictionnaire, on peut lire chaque page depuis le début, mais c'est très lent. Il est plus efficace d'ouvrir le dictionnaire au milieu, de regarder si le mot se trouve avant ou après, puis d'écarter la moitié inutile. La **recherche dichotomique** fait exactement cela sur une **liste triée**. À chaque comparaison, la zone qui reste est environ deux fois plus petite.

!!! warning "Condition indispensable"
    La liste **doit être triée** (ordre croissant ou décroissant). Sur une liste non triée, la dichotomie donne un résultat **faux** : elle peut conclure « introuvable » alors que la valeur est présente.

Le tri est une condition indispensable. L'algorithme écarte la moitié gauche parce qu'il suppose que toutes les valeurs situées à gauche du milieu sont plus petites. Si la liste est en désordre, cette supposition est fausse, et il peut répondre « absent » pour une valeur qui est pourtant là.

## Le principe de l'algorithme

On garde deux indices, `debut` et `fin`, qui encadrent la zone encore possible. Tant que la zone n'est pas vide, c'est-à-dire tant que `debut <= fin` :

1. On vise le milieu : `milieu = (debut + fin) // 2`. `milieu` est un **indice**. La valeur à comparer est `liste[milieu]`.
2. Si cette valeur est celle qu'on cherche, on renvoie l'indice.
3. Si elle est trop petite, la valeur cherchée, si elle existe, est à droite : `debut` devient `milieu + 1`.
4. Si elle est trop grande, on ne garde que la gauche : `fin` devient `milieu - 1`.

L'indice `milieu` n'est pas repris dans la zone suivante, puisqu'il a déjà été comparé. Quand `debut` dépasse `fin`, la zone est vide : la valeur n'y est pas, et l'on renvoie `-1`.

<BinarySearchVisualizer />

## Pseudocode

```text
fonction recherche_dichotomique(liste, valeur):
    debut <- 0
    fin <- longueur(liste) - 1

    tant que debut <= fin:
        milieu <- (debut + fin) // 2

        si liste[milieu] == valeur:
            retourner milieu
        sinon si liste[milieu] < valeur:
            debut <- milieu + 1
        sinon:
            fin <- milieu - 1

    retourner -1
```

## Solution Python

```python
def recherche_dichotomique(liste, valeur):
    """
    Recherche `valeur` dans une liste TRIÉE.
    Renvoie l'indice si trouvée, -1 sinon.
    """
    debut = 0
    fin = len(liste) - 1

    while debut <= fin:
        milieu = (debut + fin) // 2
        if liste[milieu] == valeur:
            return milieu
        elif liste[milieu] < valeur:
            debut = milieu + 1
        else:
            fin = milieu - 1

    return -1


# Exemples
nombres = [1, 3, 5, 7, 9, 11, 13]
print(recherche_dichotomique(nombres, 7))   # 3
print(recherche_dichotomique(nombres, 4))   # -1
```

Dans `nombres`, l'indice de `7` est bien 3. `4` n'est pas dans la liste : les bornes se croisent, la fonction renvoie `-1`. Le code ci-dessus suppose l'ordre **croissant**. Sur une liste décroissante, les tests `<` et le choix de la moitié sont à inverser.

Voici ce qui arrive quand la liste n'est pas triée. `1` est présent, à l'indice 1. La dichotomie regarde le milieu `9`, conclut que `1` est à gauche, ne regarde plus jamais l'indice 1, et répond `-1`.

```python
desordre = [7, 1, 9, 3, 5]
# 1 est bien dans la liste, à l'indice 1.
print(recherche_dichotomique(desordre, 1))  # -1 : résultat faux
```

## L'efficacité de la dichotomie

La recherche séquentielle peut devoir comparer chaque case : dans le pire des cas, elle fait $n$ comparaisons, ce qui donne une complexité en $O(n)$. La dichotomie divise la zone par deux à chaque tour. Pour un million d'éléments, $2^{20}$ vaut environ un million, donc il faut au plus une vingtaine de comparaisons. La complexité est $O(\log_2 n)$.

| Méthode | Complexité | Pour 1 000 000 d'éléments |
| :--- | :--- | :--- |
| Recherche séquentielle | $O(n)$ | jusqu'à ~1 000 000 comparaisons |
| Recherche dichotomique | $O(\log_2 n)$ | au plus ~**20** comparaisons ($2^{20} \approx 10^6$) |

<LinearVsBinarySearch />

Trier la liste avant de chercher n'est pas toujours rentable, car un tri coûte plus cher qu'une seule recherche séquentielle. Si l'on ne cherche qu'une fois, trier fait donc perdre du temps. En revanche, si l'on cherche souvent dans la même liste, le tri n'est fait qu'une fois, et chaque recherche est ensuite logarithmique.

En résumé, la dichotomie ne fonctionne que sur une liste triée. Chaque étape élimine environ la moitié des candidats, en resserrant `debut` et `fin`. `milieu` est un indice, et `liste[milieu]` la valeur correspondante. La complexité est logarithmique, et une valeur absente est signalée par `-1`.

## Pour s'entraîner

1. Chercher `11` dans `[2, 4, 6, 8, 10, 11, 14]` en notant à chaque étape `debut`, `fin` et `milieu`.
2. Modifier la fonction pour qu'elle fonctionne aussi sur une liste triée **décroissante**.
3. Expliquer en une phrase pourquoi trier puis chercher en dichotomie peut être rentable, ou non, selon le nombre de recherches.
