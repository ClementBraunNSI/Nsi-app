---
title: "Révision — Structures & pointeurs"
description: "Fiche synthèse : struct, typedef, &, *"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "🏗️"
revisionSheet: true
---

# 🏗️ Révision — Structures et pointeurs

## `struct` : regrouper des données

```c
typedef struct {
    char nom[50];
    int age;
} Personne;

Personne p;
p.age = 20;
```

*   Accès aux champs avec **`.`** : `p.age`, `p.nom`.

## Pointeur : l'adresse d'une variable

*   **`&x`** : adresse de `x`.
*   **`int *p`** : `p` peut contenir l'adresse d'un `int`.
*   **`*p`** : la valeur pointée par `p`.

```c
int x = 5;
int *p = &x;
*p = 10;    /* x vaut maintenant 10 */
```

## Passage à une fonction

*   **Par valeur** : la fonction reçoit une **copie** (les modifications ne changent pas l'original).
*   **Par adresse (pointeur)** : la fonction peut **modifier** la variable d'origine.

```c
void incrementer(int *px) {
    (*px)++;
}
```

## Chaînes et tableaux

Souvent un `char *` ou un `char tab[]` pointe vers du texte ; attention aux **tailles** et au `'\0'` en fin de chaîne.

## Mini-checklist

*   Je sais lire un schéma « variable → adresse → valeur ».
*   Je n'oublie pas les parenthèses sur `(*px)++` si besoin.
*   Je relie ça au cours : structures + fonctions qui modifient des données « en place ».
