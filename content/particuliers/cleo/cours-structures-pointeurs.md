---
title: "Introduction aux Structures en C"
description: "Les bases de la programmation structurée en C : struct, typedef et pointeurs."
level: "1"
chapter: "C : Programmation Structurée"
icon: "🏗️"
---

## 🌟 Introduction

Le langage C n'est pas un langage orienté objet comme C# ou Java. Il ne possède pas de "classes". Cependant, il permet de regrouper des données liées entre elles grâce aux **structures**.

C'est l'ancêtre direct de la notion d'objet.

> **Pourquoi utiliser des structures ?**
>
> - ✅ **Organisation** : Regrouper des variables qui ont un sens ensemble (ex: x et y pour un Point).
> - ✅ **Clarté** : Manipuler une seule variable (`personne`) au lieu de plusieurs (`nom`, `age`, `taille`).
> - ✅ **Modularité** : Passer des paquets de données complexes à vos fonctions.

---

## 📦 Le Concept de Structure (`struct`)

Une structure est un type de données personnalisé qui permet de stocker plusieurs variables de types différents sous un même nom.

### Définition d'une Structure

```c
struct Personne {
    char nom[50];
    char prenom[50];
    int age;
    float taille;
};
```

Ici, nous avons créé un nouveau type appelé `struct Personne`.

### Utilisation avec `typedef`

Pour éviter d'écrire le mot-clé `struct` à chaque fois, on utilise souvent `typedef` pour créer un alias.

```c
typedef struct {
    char nom[50];
    int age;
} Etudiant;

// Maintenant, on peut écrire :
Etudiant e1;
// Au lieu de :
struct Etudiant e1;
```

---

## 🏗️ Créer et Utiliser des Structures

### Exemple Concret : Un Point Géométrique

```c
#include <stdio.h>

// Définition
typedef struct {
    int x;
    int y;
} Point;

int main() {
    // Création et initialisation
    Point p1;
    p1.x = 10;
    p1.y = 20;

    // Autre façon d'initialiser (plus rapide)
    Point p2 = {5, 15};

    printf("Point 1 : (%d, %d)\n", p1.x, p1.y);
    printf("Point 2 : (%d, %d)\n", p2.x, p2.y);

    return 0;
}
```

---

## 🔄 Structures et Fonctions (Passage par Valeur vs Adresse)

C'est ici que la différence avec la POO (C#) est la plus flagrante.

En C, par défaut, les arguments sont passés **par valeur** (copie). Si vous modifiez une structure dans une fonction, l'original n'est pas modifié !

### Problème : Modification impossible par défaut

```c
void vieillir(Etudiant e) {
    e.age += 1; // Modifie SEULEMENT la copie locale 'e'
    printf("Age dans la fonction : %d\n", e.age);
}

int main() {
    Etudiant tom = {"Tom", 20};
    vieillir(tom); 
    printf("Age dans le main : %d\n", tom.age); // Affiche toujours 20 !
}
```

### Solution : Les Pointeurs (Passage par Adresse)

Pour modifier la structure originale, il faut passer son **adresse** (pointeur) à la fonction.

> **Notation Flèche `->`**
> Quand on manipule un **pointeur vers une structure**, on utilise `->` au lieu de `.` pour accéder aux champs.
> `ptr->age` est un raccourci pour `(*ptr).age`.

```c
// La fonction prend un POINTEUR vers Etudiant
void vieillir_ptr(Etudiant *e) {
    e->age += 1; // Modifie la variable pointée (l'originale)
}

int main() {
    Etudiant tom = {"Tom", 20};
    
    // On passe l'ADRESSE de tom avec &
    vieillir_ptr(&tom);
    
    printf("Age dans le main : %d\n", tom.age); // Affiche 21 ! Victoire !
}
```

---

## 🛠️ Exemple Complet : Gestion d'un rectangle

Voici l'équivalent C d'une classe `Rectangle` simple.

```c
#include <stdio.h>

typedef struct {
    float largeur;
    float hauteur;
} Rectangle;

// "Constructeur" (Fonction qui retourne une structure initialisée)
Rectangle creer_rectangle(float l, float h) {
    Rectangle r;
    r.largeur = l;
    r.hauteur = h;
    return r;
}

// Méthode d'affichage (Lecture seule -> Passage par valeur possible, 
// mais const pointeur est mieux pour la performance)
void afficher(Rectangle r) {
    printf("Rectangle [%.2f x %.2f]\n", r.largeur, r.hauteur);
}

// Méthode de calcul (Lecture seule)
float aire(Rectangle r) {
    return r.largeur * r.hauteur;
}

// Méthode de modification (Écriture -> Pointeur OBLIGATOIRE)
void redimensionner(Rectangle *r, float facteur) {
    r->largeur *= facteur;
    r->hauteur *= facteur;
}

int main() {
    // Création
    Rectangle rect = creer_rectangle(10.0, 5.0);
    
    afficher(rect);
    printf("Aire : %.2f\n", aire(rect));
    
    // Modification
    printf("On double la taille...\n");
    redimensionner(&rect, 2.0); // Attention au & !
    
    afficher(rect);
    printf("Nouvelle aire : %.2f\n", aire(rect));
    
    return 0;
}
```

## ⚠️ Pièges Courants

1.  **Oublier le `&`** lors de l'appel d'une fonction qui attend un pointeur.
2.  **Utiliser `.` au lieu de `->`** avec un pointeur (le compilateur va râler).
3.  **Copie involontaire** : Passer une très grosse structure par valeur recopie toutes ses données, ce qui est lent. Préférez passer un pointeur `const` si vous ne voulez pas modifier les données.

```c
// Efficace et sûr (lecture seule sans copie)
void afficher_gros_objet(const GrosObjet *obj) {
    printf("%s", obj->nom);
    // obj->nom = "Test"; // Interdit par 'const'
}
```
