---
title: "Révision — Tableaux 2D (matrices)"
description: "Fiche synthèse : grille, double boucle, indices [i][j]"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "🏗️"
revisionSheet: true
---

# 🏗️ Révision — Tableaux à deux dimensions

## Idée

Un tableau 2D = **lignes** et **colonnes** (matrice, grille de jeu, image simplifiée).

```c
int m[3][4];   /* 3 lignes, 4 colonnes */
```

*   **`m[i][j]`** : ligne `i`, colonne `j`.
*   Souvent : boucle **`i`** sur les lignes, boucle **`j`** sur les colonnes.

## Initialisation

```c
int grille[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

## Parcours ligne par ligne

```c
for (int i = 0; i < lignes; i++) {
    for (int j = 0; j < colonnes; j++) {
        printf("%d ", grille[i][j]);
    }
    printf("\n");
}
```

## À retenir pour les exos

*   Nombre d'éléments total = `lignes * colonnes`.
*   Bien distinguer **indice de ligne** et **indice de colonne** dans l'énoncé.
*   Si tu utilises `malloc` pour du 2D dynamique, revoir le cours : c'est une étape de plus que le 1D.

## Mini-checklist

*   Je sais afficher une matrice « joliment » (retour à la ligne après chaque ligne).
*   Je sais parcourir toute la grille pour une somme ou une recherche.
