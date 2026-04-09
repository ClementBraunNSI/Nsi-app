---
title: "Révision — Structures de contrôle"
description: "Fiche synthèse : if / else, switch, for, while"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "🔀"
revisionSheet: true
---

# 🔀 Révision — Structures de contrôle

## Conditions : `if` / `else`

```c
if (condition) {
    /* ... */
} else if (autre) {
    /* ... */
} else {
    /* ... */
}
```

*   **Attention** : `=` (affectation) n'est pas `==` (égalité). En condition, tu veux presque toujours `==`.

## `switch` (choix multiples)

Utile quand tu compares **une variable** à plusieurs **valeurs entières** ou caractères :

```c
switch (choix) {
    case 1:
        /* ... */
        break;
    case 2:
        /* ... */
        break;
    default:
        /* ... */
        break;
}
```

!!! warning "Oublier break"
    Sans `break`, l'exécution **continue** dans le `case` suivant (effet de chute).

## Boucles

| Boucle | Usage typique |
| :--- | :--- |
| `for` | nombre d'itérations connu (parcours de tableau) |
| `while` | répéter tant qu'une condition est vraie |
| `do { ... } while (cond);` | au moins **une** exécution du corps |

## Exemple `for` tableau

```c
for (int i = 0; i < n; i++) {
    /* tab[i] */
}
```

## Mini-checklist

*   Je sais choisir entre `for` et `while`.
*   Je vérifie que la condition de boucle **progresse** vers la fin (éviter boucle infinie).
*   Je maîtrise `break` / `continue` si le cours les utilise.
