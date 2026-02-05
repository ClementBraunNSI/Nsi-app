---
title: "C - Fonctions"
description: "Organiser le code en fonctions réutilisables"
level: "particuliers"
chapter: "Programmation en C"
icon: "⚙️"
allowedStudents: ["Cléo CHILAIN"]
---

# ⚙️ C — Fonctions

## Organiser le code en fonctions réutilisables

## 🎯 Qu'est-ce qu'une fonction ?

### Définition

Une fonction est un **bloc de code** qui effectue une **tâche spécifique** et peut être **réutilisé**.

- Évite la répétition du code
- Rend le programme plus **modulaire**
- Facilite la **lecture** et la **maintenance**

### Structure d'une fonction

```c
type_retour nom_fonction(paramètres) {
    // Corps de la fonction
    return valeur;  // Si type_retour n'est pas void
}
```

## 🔧 Déclaration et utilisation

### Fonction simple sans paramètres

```c
#include <stdio.h>

// Déclaration de la fonction
void dire_bonjour() {
    printf("Bonjour !\n");
}

int main() {
    // Appel de la fonction
    dire_bonjour();
    dire_bonjour();  // Peut être appelée plusieurs fois
    
    return 0;
}
```

### Fonction avec paramètres

```c
#include <stdio.h>

// Fonction avec paramètres
void presenter(char nom[], int age) {
    printf("Je m'appelle %s et j'ai %d ans.\n", nom, age);
}

int main() {
    presenter("Alice", 17);
    presenter("Bob", 18);
    
    return 0;
}
```

### Fonction avec valeur de retour

```c
#include <stdio.h>

// Fonction qui retourne un résultat
int addition(int a, int b) {
    int resultat = a + b;
    return resultat;
}

int main() {
    int somme = addition(5, 3);
    printf("5 + 3 = %d\n", somme);
    
    // Ou directement :
    printf("10 + 20 = %d\n", addition(10, 20));
    
    return 0;
}
```

## 🧮 Exemples pratiques

### Calculer l'aire d'un rectangle

```c
#include <stdio.h>

double aire_rectangle(double longueur, double largeur) {
    return longueur * largeur;
}

double perimetre_rectangle(double longueur, double largeur) {
    return 2 * (longueur + largeur);
}

int main() {
    double l = 5.5, L = 3.2;
    
    printf("Aire : %.2f m²\n", aire_rectangle(l, L));
    printf("Périmètre : %.2f m\n", perimetre_rectangle(l, L));
    
    return 0;
}
```

### Trouver le maximum de deux nombres

```c
#include <stdio.h>

int maximum(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

// Version plus concise
int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    int x = 15, y = 23;
    
    printf("Le maximum entre %d et %d est : %d\n", 
           x, y, maximum(x, y));
    
    return 0;
}
```

## ⚠️ Points importants

!!! warning "Ordre des fonctions"
    - Déclarer la fonction **avant** de l'utiliser
    - Ou utiliser un **prototype** en haut du fichier

!!! info "Prototype de fonction"
    ```c
    // Prototype (déclaration)
    int addition(int a, int b);
    
    // Utilisation
    int main() {
        int resultat = addition(3, 4);
        return 0;
    }
    
    // Définition
    int addition(int a, int b) {
        return a + b;
    }
    ```