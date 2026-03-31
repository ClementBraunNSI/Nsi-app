---
title: C - Les Tableaux à 2 Dimensions
description: Manipuler des matrices statiques et dynamiques
level: particuliers
chapter: Programmation en C
icon: "\U0001F3D7️"
allowedStudents:
  - Cléo
prerequisites:
  - cours-tableaux
---

# 🏗️ C — Les Tableaux à 2 Dimensions (Matrices)

## 📚 Introduction

Un tableau à 2 dimensions permet de représenter des données sous forme de grille (lignes et colonnes), comme :
- Une image (pixels)
- Un plateau de jeu (échecs, morpion)
- Une matrice mathématique
- Un tableau Excel simplifié

Il existe deux façons de créer ces tableaux en C :
1. **Statique** : Taille fixe connue à l'avance (ex: `int grille[10][10]`).
2. **Dynamique** : Taille variable décidée pendant l'exécution (avec `malloc`).

---

## 1️⃣ Allocation Statique (Sur la pile)

C'est la méthode la plus simple, à utiliser quand on connaît la taille à l'avance.

### Déclaration et Initialisation

```c
// type nom[LIGNES][COLONNES];

int matrice[3][4]; // Matrice de 3 lignes, 4 colonnes
```

On peut initialiser directement :

```c
int grille[3][3] = {
    {1, 2, 3},   // Ligne 0
    {4, 5, 6},   // Ligne 1
    {7, 8, 9}    // Ligne 2
};
```

### Accès et Parcours

On utilise deux boucles imbriquées : `i` pour les lignes, `j` pour les colonnes.

```c
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        printf("%d ", grille[i][j]);
    }
    printf("\n");
}
```

> ⚠️ **Limitation** : La taille doit être connue à la compilation et la mémoire est limitée (stack overflow si le tableau est trop grand).

---

## 2️⃣ Allocation Dynamique (Sur le tas)

Utilisée quand la taille du tableau dépend d'une variable (ex: taille demandée à l'utilisateur) ou pour de très grands tableaux.

### Méthode : Tableau de pointeurs

C'est la méthode la plus flexible. On crée un tableau de pointeurs (les lignes), où chaque pointeur pointe vers un tableau d'entiers (les colonnes).

### Étape 1 : Allocation

```c
#include <stdlib.h>

int lignes = 5;
int colonnes = 10;

// 1. Allouer le tableau de pointeurs (les lignes)
int **matrice = (int **)malloc(lignes * sizeof(int *));

// 2. Allouer chaque ligne (les colonnes)
for (int i = 0; i < lignes; i++) {
    matrice[i] = (int *)malloc(colonnes * sizeof(int));
}
```

### Étape 2 : Utilisation

L'utilisation est **identique** à la version statique !

```c
matrice[0][0] = 42;
printf("%d", matrice[0][0]);
```

### Étape 3 : Libération (Très important !)

Il faut libérer la mémoire dans l'ordre inverse de l'allocation.

```c
// 1. Libérer chaque ligne
for (int i = 0; i < lignes; i++) {
    free(matrice[i]);
}

// 2. Libérer le tableau de pointeurs
free(matrice);
```

---

## 3️⃣ Passage en paramètre de fonction

### Cas Statique
Il faut préciser la taille de la deuxième dimension (colonnes).

```c
void afficher(int tab[][4], int lignes) {
    // ...
}
```

### Cas Dynamique
On passe un double pointeur `int **tab`.

```c
void afficher(int **tab, int lignes, int colonnes) {
    for (int i = 0; i < lignes; i++) {
        for (int j = 0; j < colonnes; j++) {
            printf("%d ", tab[i][j]);
        }
        printf("\n");
    }
}
```

---

## 🔍 Résumé

| Caractéristique | Statique (`int t[N][M]`) | Dynamique (`int **t`) |
|-----------------|--------------------------|-----------------------|
| **Mémoire** | Pile (Stack) - Rapide mais limité | Tas (Heap) - Grand mais plus lent |
| **Taille** | Fixe à la compilation | Variable à l'exécution |
| **Gestion** | Automatique | Manuelle (`malloc`/`free`) |
| **Syntaxe** | Simple | Plus complexe (double pointeur) |
