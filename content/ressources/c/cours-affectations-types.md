---
title: "C - Affectations & Types"
description: "Variables, opérateurs, entrées/sorties - bases solides"
level: ressources
chapter: "Langage C"
icon: "wrench"
audience: public
---

# <Icone nom="wrench" /> C : Affectations & Types (débutante)

## Variables, opérateurs, entrées/sorties : bases solides

## <Icone nom="target" /> Types fondamentaux du C

### Types de base

En C, chaque variable doit être déclarée avec un type précis. Les types fondamentaux sont :

- **`int`** : nombres entiers (ex: 42, -17)
- **`float`** : nombres décimaux simple précision (ex: 3.14)
- **`double`** : nombres décimaux double précision (ex: 2.718281828)
- **`char`** : caractères individuels (ex: 'A', '7')

### Déclaration et initialisation

```c
int age = 18;           // Un entier
float prix = 19.99f;    // Un décimal (notez le 'f')
double pi = 3.14159;   // Un décimal plus précis
char grade = 'A';      // Un caractère
```

## <Icone nom="type" /> Affectations et opérateurs

### Opérateurs arithmétiques

| Opérateur | Description | Exemple |
|-----------|-------------|---------|
| `+` | Addition | `int somme = 5 + 3;` |
| `-` | Soustraction | `int diff = 10 - 4;` |
| `*` | Multiplication | `int prod = 6 * 7;` |
| `/` | Division | `float quotient = 15.0 / 4.0;` |
| `%` | Modulo (reste) | `int reste = 17 % 5;` |

### Affectations combinées

```c
int compteur = 0;
compteur += 1;  // Équivaut à : compteur = compteur + 1;
compteur *= 2;  // Équivaut à : compteur = compteur * 2;
```

## <Icone nom="inbox" /><Icone nom="send" /> Entrées et sorties

### Affichage avec printf()

```c
#include <stdio.h>

int main() {
    int nombre = 42;
    printf("Le nombre est : %d\n", nombre);
    
    float prix = 19.99f;
    printf("Le prix est : %.2f euros\n", prix);
    
    char lettre = 'X';
    printf("La lettre est : %c\n", lettre);
    
    return 0;
}
```

### Lecture avec scanf()

```c
#include <stdio.h>

int main() {
    int age;
    printf("Quel est votre âge ? ");
    scanf("%d", &age);
    
    printf("Vous avez %d ans.\n", age);
    return 0;
}
```

## <Icone nom="calculator" /> Exemple pratique

```c
#include <stdio.h>

int main() {
    // Déclaration des variables
    int prix_unitaire = 25;
    int quantite = 3;
    int total;
    
    // Calcul du total
    total = prix_unitaire * quantite;
    
    // Affichage du résultat
    printf("Prix unitaire : %d€\n", prix_unitaire);
    printf("Quantité : %d\n", quantite);
    printf("Total à payer : %d€\n", total);
    
    return 0;
}
```

!!! info "Formatage des nombres"
    - `%d` pour les entiers (`int`)
    - `%f` pour les décimaux (`float`/`double`)
    - `%c` pour les caractères (`char`)
    - `%.2f` affiche 2 décimales après la virgule
