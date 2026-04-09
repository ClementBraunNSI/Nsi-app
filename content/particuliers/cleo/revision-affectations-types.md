---
title: "Révision — Affectations & types"
description: "Fiche synthèse : variables, opérateurs, printf / scanf"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "🔧"
revisionSheet: true
---

# 🔧 Révision — Affectations & types

## Ce qu'il faut retenir

- Chaque variable a un **type** (`int`, `float`, `double`, `char`).
- L'**affectation** `=` stocke une valeur dans une variable.
- Les **opérateurs** classiques : `+`, `-`, `*`, `/`, `%` (modulo pour les entiers).

## Opérateurs utiles

| Opérateur | Exemple | Rôle |
| :--- | :--- | :--- |
| `=` | `x = 5;` | affectation |
| `+=` | `x += 2;` | `x = x + 2` |
| `++` | `i++;` | incrémente de 1 |

!!! warning "Division entière"
    En C, `7 / 2` avec des `int` donne **3**. Pour avoir 3.5, utilise des `double` ou casts : `(double)7 / 2`.

## Affichage et lecture

| Format `printf` / `scanf` | Type |
| :--- | :--- |
| `%d` | `int` |
| `%f` | `float` / `double` (pour `scanf` un `float` utilise souvent `%f`, un `double` `%lf`) |
| `%c` | `char` |

```c
int n;
scanf("%d", &n);   // ne pas oublier & pour une variable simple
```

## Mini-checklist avant un contrôle

*   Je sais déclarer et initialiser une variable.
*   Je sais lire une valeur avec `scanf` et le bon format.
*   Je fais attention au type pour la division et au modulo (`%` uniquement sur entiers).
