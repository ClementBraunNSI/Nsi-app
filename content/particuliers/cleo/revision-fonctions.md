---
title: "Révision — Fonctions"
description: "Fiche synthèse : prototype, paramètres, return, void"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "⚙️"
revisionSheet: true
---

# ⚙️ Révision — Fonctions

## Idée principale

Une **fonction** regroupe du code sous un nom. On l'**appelle** quand on en a besoin, avec des **arguments**, et elle peut **renvoyer** une valeur.

## Modèle à connaître

```c
type_retour nom_fonction(/* paramètres */) {
    /* instructions */
    return valeur;   /* si type_retour n'est pas void */
}
```

*   **`void`** : la fonction ne renvoie rien (pas de `return` avec valeur, ou `return;` seul).
*   **Paramètres** : variables locales à la fonction, reçues à l'appel.

## Exemple minimal

```c
int carre(int x) {
    return x * x;
}

int main(void) {
    int a = carre(5);   /* a vaut 25 */
    return 0;
}
```

## Ordre des déclarations

En C, le compilateur doit connaître une fonction **avant** son utilisation, sauf si tu fournis un **prototype** en haut du fichier :

```c
int carre(int x);   /* prototype */

int main(void) {
    return carre(3);
}

int carre(int x) {
    return x * x;
}
```

## Mini-checklist

*   Je sais écrire une fonction qui prend des `int` et renvoie un `int`.
*   Je ne confonds pas **paramètre** (définition) et **argument** (valeur à l'appel).
*   Le type de `return` correspond au type de retour déclaré.
