---
title: C - Fonctions
description: Organiser le code en fonctions réutilisables
level: particuliers
chapter: Programmation en C
icon: ⚙️
allowedStudents:
  - Cléo
prerequisites:
  - cours-affectations-types
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
void dire_bonjour_a(char *nom) {
    printf("Bonjour %s !\n", nom);
}

int main() {
    dire_bonjour_a("Alice");
    dire_bonjour_a("Bob");
    return 0;
}
```

### Fonction avec valeur de retour

```c
int addition(int a, int b) {
    return a + b;
}

int main() {
    int resultat = addition(5, 3);
    printf("5 + 3 = %d\n", resultat);
    return 0;
}
```

## 🧠 Portée des variables (Scope)

### Variables locales
Déclarées **dans une fonction**. Elles n'existent que dans cette fonction.

```c
void test() {
    int x = 10; // Variable locale
}
// x n'existe pas ici
```

### Variables globales
Déclarées **en dehors de toute fonction**. Accessibles partout (à utiliser avec modération !).

```c
int score = 0; // Variable globale

void augmenter_score() {
    score += 10;
}
```

## 📝 Exercices

### 1. Carré d'un nombre
Écrire une fonction `int carre(int n)` qui renvoie le carré de `n`.

### 2. Maximum de deux nombres
Écrire une fonction `int max(int a, int b)` qui renvoie le plus grand des deux.

### 3. Est pair ?
Écrire une fonction `int est_pair(int n)` qui renvoie 1 si `n` est pair, 0 sinon.
