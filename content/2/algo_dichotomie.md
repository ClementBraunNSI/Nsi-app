---
title: Recherche Dichotomique
description: Algorithme de recherche efficace dans une liste triée
level: premiere
chapter: Algorithmique
icon: "\U0001F50D"
badgeId: premiere_recherche_dichotomique
prerequisites:
  - algo_gloutons
---

## Objectifs

- Comprendre le principe de la recherche dichotomique (diviser l'espace de recherche par deux)
- Savoir pourquoi la liste **doit être triée**
- Implémenter l'algorithme en Python
- Comparer son efficacité à la recherche séquentielle

## Idée clé

Dans une **liste triée**, on n'a pas besoin de tout parcourir : on regarde le milieu, on jette une moitié, et on recommence. C'est le même réflexe que pour chercher un mot dans un dictionnaire.

!!! warning "Condition indispensable"
    La liste **doit être triée** (ordre croissant ou décroissant). Sur une liste non triée, la dichotomie donne un résultat **faux** : elle peut conclure « introuvable » alors que la valeur est présente.

## Principe

On répète trois étapes tant que la zone de recherche n'est pas vide :

1. **Viser le milieu** de la zone actuelle
2. **Comparer** avec la valeur cherchée :
   - égale → trouvé
   - trop grande → on ne garde que la **moitié gauche**
   - trop petite → on ne garde que la **moitié droite**
3. **Réduire** la zone et recommencer

<BinarySearchVisualizer />

## Pseudocode

```text
fonction recherche_dichotomique(liste, valeur):
    debut ← 0
    fin ← longueur(liste) - 1

    tant que debut <= fin:
        milieu ← (debut + fin) // 2

        si liste[milieu] == valeur:
            retourner milieu
        sinon si liste[milieu] < valeur:
            debut ← milieu + 1
        sinon:
            fin ← milieu - 1

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

Contre-exemple (liste **non** triée) :

```python
desordre = [7, 1, 9, 3, 5]
# La dichotomie peut renvoyer -1 alors que 7 est bien présent.
print(recherche_dichotomique(desordre, 7))  # résultat incorrect possible
```

## Efficacité

| Méthode | Complexité | Pour 1 000 000 d'éléments |
| :--- | :--- | :--- |
| Recherche séquentielle | $O(n)$ | jusqu'à ~1 000 000 comparaisons |
| Recherche dichotomique | $O(\log_2 n)$ | au plus ~**20** comparaisons ($2^{20} \approx 10^6$) |

<LinearVsBinarySearch />

## Piège fréquent

Oublier que la liste doit être **triée**, ou confondre l'indice du milieu avec la valeur : `milieu` est un **indice**, `liste[milieu]` est la **valeur** à comparer.

## À retenir

- La dichotomie ne fonctionne que sur une **liste triée**
- À chaque étape, on élimine environ **la moitié** des candidats
- On maintient deux bornes `debut` et `fin` qui se resserrent
- Complexité logarithmique : $O(\log_2 n)$
- Si la valeur est absente, on renvoie souvent `-1` (ou `None`)
- Sans tri préalable, le résultat n'est pas fiable

## Pour s'entraîner

1. Chercher `11` dans `[2, 4, 6, 8, 10, 11, 14]` en notant à chaque étape `debut`, `fin` et `milieu`.
2. Modifier la fonction pour qu'elle fonctionne aussi sur une liste triée **décroissante**.
3. Expliquer en une phrase pourquoi trier puis chercher en dichotomie peut être rentable… ou non, selon le nombre de recherches.
