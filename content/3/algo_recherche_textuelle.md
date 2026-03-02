---
title: "Algorithmes de Recherche Textuelle"
description: "Recherche de motifs dans un texte : Naïf et Boyer-Moore."
level: terminale
chapter: "Algorithmique"
icon: "🔍"
badgeId: "terminale_algo_texte"
---

# 🔍 Recherche Textuelle

Le problème : Trouver toutes les occurrences d'un **motif** (mot) dans un **texte** (chaîne de caractères).
C'est ce que fait `Ctrl+F` ou `grep`.

## 1. Recherche Naïve

On fait glisser le motif le long du texte, caractère par caractère.

### Principe
1.  On aligne le motif avec le début du texte.
2.  On compare les lettres une par une.
3.  Si ça ne correspond pas, on décale le motif de **1 cran** vers la droite.

### Complexité
Si le texte a une longueur $N$ et le motif une longueur $M$.
Dans le pire des cas (ex: Texte "AAAAAAAA", Motif "AAAB"), on fait $M$ comparaisons à chaque position.
Complexité : **O(N × M)**. C'est lent si le texte est très long (ex: génome humain).

## 2. Algorithme de Boyer-Moore (Simplifié)

L'idée de génie : **Commencer la comparaison par la fin du motif**.
Cela permet de faire des sauts plus grands que 1 !

### Le décalage (Règle du mauvais caractère)
Si on compare la dernière lettre du motif avec le texte et que ça ne correspond pas (lettre X dans le texte) :
1.  Si X n'est **pas du tout** dans le motif : On peut sauter directement toute la longueur du motif ! (Inutile de tester les positions intermédiaires).
2.  Si X est dans le motif : On décale le motif pour aligner le X du texte avec le X du motif.

### Exemple
Texte : `L'ALGORITHME`
Motif : `RITHME`

1.  On compare la fin du motif (`E`) avec le texte (`L`).
    *   Ça ne matche pas.
    *   `L` est-il dans `RITHME` ? Non.
    *   -> On peut décaler de 6 crans d'un coup !

### Complexité
Dans le meilleur des cas (souvent le cas pratique), la complexité est **sub-linéaire** : **O(N/M)**.
Plus le motif est long, plus ça va vite !

---

<ExerciseTabs courseId="terminale_algo_texte" courseTitle="Exercices Boyer-Moore">

  <ExerciseSection id="texte-ex-1" label="Prétraitement">
    <Enonce>
    ### Table des sauts
    Pour Boyer-Moore, on pré-calcule un dictionnaire donnant la dernière position de chaque lettre dans le motif.
    
    Motif : `"BANANA"`
    Longueur : 6
    
    Remplissez la table :
    *   `"A"` : dernière position ?
    *   `"N"` : dernière position ?
    *   `"B"` : dernière position ?
    *   Autres lettres : -1
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
