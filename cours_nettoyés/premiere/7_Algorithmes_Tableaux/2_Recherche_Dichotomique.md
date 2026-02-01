---
title: Recherche Dichotomique
description: Algorithme de recherche efficace dans une liste triée
level: Première
chapter: 7
icon: magnifying-glass
---

# La Recherche Dichotomique

## Qu'est-ce que la recherche dichotomique ?

La **dichotomie** (du grec "couper en deux") est une méthode de recherche très efficace qui permet de trouver un élément dans une **liste triée** en divisant récursivement l'espace de recherche par deux.

C'est le principe utilisé quand on cherche un mot dans un dictionnaire ou un nom dans un annuaire : on ouvre au milieu, on regarde si le mot cherché est avant ou après, et on recommence avec la moitié pertinente.

!!! warning "Condition Préalable"
    Pour utiliser la recherche dichotomique, la liste **DOIT être triée** (par ordre croissant ou décroissant). Si la liste n'est pas triée, l'algorithme ne fonctionne pas.

## Principe Fondamental

L'algorithme repose sur trois étapes répétées tant qu'on n'a pas trouvé la valeur (ou que l'espace de recherche n'est pas vide) :

1.  **Viser le milieu** : On regarde l'élément central de la zone de recherche actuelle.
2.  **Comparer** :
    *   Si c'est la valeur cherchée : C'est gagné !
    *   Si la valeur cherchée est *plus petite* : On ne garde que la **moitié gauche**.
    *   Si la valeur cherchée est *plus grande* : On ne garde que la **moitié droite**.
3.  **Répéter** : On recommence avec la nouvelle zone réduite.

## Algorithme en Pseudocode

```text
fonction recherche_dichotomique(liste, valeur):
    debut ← 0
    fin ← longueur(liste) - 1

    tant que debut <= fin:
        milieu ← (debut + fin) // 2
        
        si liste[milieu] == valeur:
            retourner milieu  # Trouvé !
        sinon si liste[milieu] < valeur:
            debut ← milieu + 1  # On cherche dans la partie droite
        sinon:
            fin ← milieu - 1    # On cherche dans la partie gauche

    retourner -1  # Pas trouvé
```

## Implémentation Python

!!! example "Exercice : Implémentation"
    Traduire le pseudocode ci-dessus en Python.

    ```python
    def recherche_dichotomique(liste, valeur):
        """
        Recherche la valeur dans la liste TRIÉE.
        Renvoie l'indice de la valeur ou -1 si absente.
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
    ```

## Efficacité et Complexité

La recherche dichotomique est beaucoup plus rapide que la **recherche séquentielle** (parcourir toute la liste un par un).

*   **Recherche Séquentielle** : Complexité linéaire $O(n)$. Pour 1 000 000 d'éléments, on peut faire jusqu'à 1 000 000 de comparaisons.
*   **Recherche Dichotomique** : Complexité logarithmique $O(\log_2 n)$. Pour 1 000 000 d'éléments, on fait au maximum environ **20 comparaisons** ($2^{20} \approx 1 000 000$).
