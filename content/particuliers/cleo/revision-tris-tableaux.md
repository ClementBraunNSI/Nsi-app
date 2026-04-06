---
title: "Révision — Tris de tableaux en C"
description: "Bulles, cocktail, sélection, insertion : idées, code et complexité"
level: particuliers
chapter: "Programmation en C — Révisions"
icon: "🔄"
allowedStudents:
  - Cléo
revisionSheet: true
---

# 🔄 Révision — Tris de tableaux en C

## Rappel

On trie un tableau **sur place** (on modifie `tab`) ou on en construit un nouveau. En cours, on travaille surtout **sur place** avec la **taille** `n`.

!!! tip "Échange de deux cases"
    Toujours utile pour les tris :

```c
void echanger(int tab[], int i, int j) {
    int tmp = tab[i];
    tab[i] = tab[j];
    tab[j] = tmp;
}
```

---

## 1. Tri à bulles (*bubble sort*)

**Idée :** faire remonter les plus grandes valeurs comme des bulles, en comparant des **paires voisines** et en échangeant si l'ordre est mauvais. On répète tant qu'il y a eu au moins un échange.

```c
void tri_bulles(int tab[], int n) {
    int echange;
    do {
        echange = 0;
        for (int i = 0; i < n - 1; i++) {
            if (tab[i] > tab[i + 1]) {
                echanger(tab, i, i + 1);
                echange = 1;
            }
        }
    } while (echange);
}
```

*   **Complexité** : en général **O(n²)** ; si le tableau est **déjà trié**, une variante avec drapeau peut s'arrêter tôt (**O(n)** meilleur cas avec la version ci-dessus une fois qu'aucun échange n'a lieu).

---

## 2. Tri cocktail (*shaker sort*)

**Idée :** comme bulles, mais on balaie le tableau **dans les deux sens** : une passe gauche → droite, puis droite → gauche. Cela peut déplacer plus vite de « gros » éléments coincés au milieu.

```c
void tri_cocktail(int tab[], int n) {
    int debut = 0;
    int fin = n - 1;
    int echange = 1;
    while (echange) {
        echange = 0;
        for (int i = debut; i < fin; i++) {
            if (tab[i] > tab[i + 1]) {
                echanger(tab, i, i + 1);
                echange = 1;
            }
        }
        fin--;
        if (!echange) break;
        echange = 0;
        for (int i = fin; i > debut; i--) {
            if (tab[i - 1] > tab[i]) {
                echanger(tab, i - 1, i);
                echange = 1;
            }
        }
        debut++;
    }
}
```

*   **Complexité** : toujours de l'ordre **O(n²)** dans le pire cas, mais parfois un peu plus efficace que bulles naïf en pratique sur certains cas.

---

## 3. Tri par sélection

**Idée :** à la position `i`, on cherche le **minimum** dans la partie non triée `[i .. n-1]` et on l'échange avec `tab[i]`.

*   Très simple à expliquer à l'oral.
*   **Nombre d'échanges** au plus **n − 1**.

*   **Complexité** : **O(n²)** (double boucle).

*(Tu as déjà le détail dans les exercices `exercices-tris`.)*

---

## 4. Tri par insertion

**Idée :** comme des cartes à jouer : on insère chaque élément dans la partie déjà triée à gauche.

*   Souvent efficace si le tableau est **presque trié**.
*   **Complexité** : **O(n²)** pire cas, **O(n)** si déjà trié.

---

## 5. Tri par dénombrement (*counting sort*)

**Idée :** si les valeurs sont des **entiers positifs bornés** (ex. notes entre 0 et 20), on **compte** chaque valeur puis on reconstruit le tableau trié.

*   **Complexité** : O(n + k) avec k l'amplitude des valeurs — **très efficace** quand k est petit.
*   Ne convient pas si les valeurs sont très grandes ou non entières.

---

## Tableau récapitulatif

| Algorithme | Idée en une phrase | Pire cas (souvent) |
| :--- | :--- | :--- |
| Bulles | Compare voisins, répète | O(n²) |
| Cocktail | Bulles aller-retour | O(n²) |
| Sélection | Min du reste, swap | O(n²) |
| Insertion | Insère dans partie triée | O(n²) |
| Dénombrement | Compte par valeur | O(n + k) |

## Lien avec ton fichier `tris.c`

Réutilise les prototypes du cours : mêmes conventions de noms (`triSelection`, etc.) pour rester cohérente avec les exercices corrigés.

## Mini-checklist avant un DS

*   Je sais expliquer **une passe** à la main sur un petit tableau.
*   Je sais justifier **pourquoi** la boucle s'arrête (tri fini, ou plus d'échanges).
*   Je connais au moins **deux** tris O(n²) par cœur (ex. sélection + bulles ou insertion).
