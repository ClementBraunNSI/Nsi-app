---
title: "C - Les Tableaux"
description: "Stocker et manipuler plusieurs variables ensemble"
level: "particuliers"
chapter: "Programmation en C"
icon: "📦"
allowedStudents: ["Cléo"]
---

# 📦 C — Les Tableaux

## Stocker et manipuler plusieurs variables ensemble

## 📚 Qu'est-ce qu'un tableau ?

### Définition

Un tableau (array) est une variable spéciale qui peut contenir **plusieurs valeurs** du **même type**.

- Les valeurs sont stockées côte à côte en mémoire (bloc contigu)
- Chaque élément est accessible par son **indice** (position)
- Les indices commencent à **0** (premier élément)

### Déclaration d'un tableau

```c
int notes[5];        // Tableau de 5 entiers
double prix[10];     // Tableau de 10 décimaux
char lettres[26];    // Tableau de 26 caractères
```

## 🎯 Initialisation et accès

### Initialisation complète

```c
int scores[5] = {10, 20, 30, 40, 50};
// scores[0] = 10, scores[1] = 20, etc.
```

### Initialisation partielle

```c
int nombres[10] = {1, 2, 3};  // Les autres valeurs sont à 0
```

### Accès aux éléments

```c
int premier = scores[0];      // Récupérer la valeur
scores[2] = 35;              // Modifier la valeur
```

## 🔄 Parcourir un tableau

### Avec une boucle for

```c
#include <stdio.h>

int main() {
    int notes[5] = {12, 15, 18, 10, 14};
    int somme = 0;
    
    // Afficher toutes les notes
    printf("Notes : ");
    for(int i = 0; i < 5; i++) {
        printf("%d ", notes[i]);
    }
    printf("\n");
    
    // Calculer la somme
    for(int i = 0; i < 5; i++) {
        somme += notes[i];
    }
    
    printf("Somme : %d\n", somme);
    printf("Moyenne : %.1f\n", somme / 5.0);
    
    return 0;
}
```

## 🔍 Recherche dans un tableau

```c
#include <stdio.h>

int main() {
    int nombres[8] = {3, 7, 1, 9, 4, 2, 8, 5};
    int recherche = 9;
    int trouve = 0;
    int position = -1;
    
    // Rechercher un nombre
    for(int i = 0; i < 8; i++) {
        if(nombres[i] == recherche) {
            trouve = 1;
            position = i;
            break;  // Sortir de la boucle si trouvé
        }
    }
    
    if(trouve) {
        printf("%d trouvé à la position %d\n", recherche, position);
    } else {
        printf("%d non trouvé\n", recherche);
    }
    
    return 0;
}
```

## ⚠️ Points importants

!!! warning "Dépassement de tableau"
    - Ne jamais accéder à un indice supérieur à la taille du tableau
    - Tableau `int tab[5]` : indices valides de 0 à 4
    - `tab[5]` = **ERREUR** (dépassement mémoire)

!!! info "Taille du tableau"
    ```c
    int tableau[10];
    int taille = sizeof(tableau) / sizeof(tableau[0]);
    // taille = 10
    ```