---
title: "C - Structures de Contrôle"
description: "Conditions, choix et boucles pour diriger vos programmes"
level: "particuliers"
chapter: "Programmation en C"
icon: "🔀"
allowedStudents: ["Cléo CHILAIN"]
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

### Boucle do...while

```c
#include <stdio.h>

int main() {
    int nombre;
    
    do {
        printf("Entrez un nombre positif : ");
        scanf("%d", &nombre);
    } while (nombre <= 0);
    
    printf("Vous avez saisi : %d\n", nombre);
    
    return 0;
}
```

## 🎯 Exemples pratiques

### Calculer la somme de 1 à n

```c
#include <stdio.h>

int main() {
    int n, somme = 0;
    
    printf("Entrez un nombre : ");
    scanf("%d", &n);
    
    for (int i = 1; i <= n; i++) {
        somme += i;
    }
    
    printf("La somme de 1 à %d est : %d\n", n, somme);
    
    return 0;
}
```

### Trouver le maximum dans un tableau

```c
#include <stdio.h>

int main() {
    int nombres[5] = {12, 45, 7, 23, 89};
    int max = nombres[0];
    
    for (int i = 1; i < 5; i++) {
        if (nombres[i] > max) {
            max = nombres[i];
        }
    }
    
    printf("Le maximum est : %d\n", max);
    
    return 0;
}
```

## ⚠️ Instructions de contrôle

### break - Sortir d'une boucle

```c
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Sort de la boucle
    }
    printf("%d ", i);
}
```

### continue - Passer à l'itération suivante

```c
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // Passe les nombres pairs
    }
    printf("%d ", i);  // Affiche seulement les impairs
}
```

!!! info "Priorité des opérateurs"
    Les conditions sont évaluées de gauche à droite. Utilisez des parenthèses pour clarifier : `(age >= 18 && age < 25)`