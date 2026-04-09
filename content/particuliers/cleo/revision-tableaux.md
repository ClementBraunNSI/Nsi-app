---
title: "Révision — Tableaux (1D)"
description: "Fiche synthèse : déclaration, indices, parcours for"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "📦"
revisionSheet: true
---

# 📦 Révision — Tableaux à une dimension

## Définition rapide

Un **tableau** stocke plusieurs valeurs **du même type**, côte à côte en mémoire.

*   Taille fixe en C « classique » : `int t[10];`
*   **Indice du premier élément : `0`**
*   Dernier indice d'un tableau de taille `n` : **`n - 1`**

## Déclaration / initialisation

```c
int notes[5] = {12, 14, 9, 16, 11};
notes[0] = 15;   /* modifier une case */
```

## Parcours standard

```c
for (int i = 0; i < taille; i++) {
    printf("%d ", tab[i]);
}
```

!!! warning "Erreur classique"
    Accéder à `tab[taille]` est **hors du tableau** (comportement indéfini). La boucle s'arrête à `i < taille`.

## Passage à une fonction

Souvent on passe le tableau **et** sa **taille** :

```c
void afficher(const int tab[], int taille) {
    for (int i = 0; i < taille; i++)
        printf("%d ", tab[i]);
    printf("\n");
}
```

## Mini-checklist

*   Je sais parcourir de `0` à `taille - 1`.
*   Je sais calculer une **somme** ou un **maximum** avec une boucle.
*   Je retiens : tableau et taille vont souvent **ensemble** dans les prototypes.
