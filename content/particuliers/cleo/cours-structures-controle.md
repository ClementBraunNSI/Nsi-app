---
title: C - Structures de Contrôle
description: 'Conditions, choix et boucles pour diriger vos programmes'
level: particuliers
chapter: Programmation en C
icon: "\U0001F500"
allowedStudents:
  - Cléo
prerequisites:
  - cours-tableaux-2d
---

# 🔀 C — Structures de Contrôle

## Conditions, choix et boucles pour diriger vos programmes

## 🚦 Les Conditions (if / else)

### Décisions

Pour exécuter du code seulement si une condition est vraie.

- `if (condition) { ... }` : Si c'est vrai
- `else { ... }` : Sinon
- `else if (condition) { ... }` : Sinon si

### Exemple simple

```c
#include <stdio.h>

int main() {
    int age = 18;
    
    if (age >= 18) {
        printf("Vous êtes majeur\n");
    } else {
        printf("Vous êtes mineur\n");
    }
    
    return 0;
}
```

### Conditions multiples

```c
#include <stdio.h>

int main() {
    int note = 15;
    
    if (note >= 16) {
        printf("Très bien !\n");
    } else if (note >= 14) {
        printf("Bien !\n");
    } else if (note >= 12) {
        printf("Assez bien\n");
    } else if (note >= 10) {
        printf("Passable\n");
    } else {
        printf("Insuffisant\n");
    }
    
    return 0;
}
```

## 🔄 Les Boucles

### Boucle while

```c
#include <stdio.h>

int main() {
    int compteur = 0;
    
    while (compteur < 5) {
        printf("Compteur : %d\n", compteur);
        compteur++;
    }
    
    return 0;
}
```

### Boucle for

```c
#include <stdio.h>

int main() {
    // Afficher les nombres de 1 à 10
    for (int i = 1; i <= 10; i++) {
        printf("%d ", i);
    }
    printf("\n");
    
    return 0;
}
```
