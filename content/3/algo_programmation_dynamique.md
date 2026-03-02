---
title: "Programmation Dynamique"
description: "Optimisation de problèmes complexes (Rendu de monnaie, Fibonacci)."
level: terminale
chapter: "Algorithmique"
icon: "⚡"
badgeId: "terminale_prog_dynamique"
---

# ⚡ Programmation Dynamique

La programmation dynamique est une méthode pour résoudre des problèmes complexes en les décomposant en sous-problèmes... mais en **stockant les résultats** pour ne jamais recalculer deux fois la même chose.

## 1. Exemple : Fibonacci (Optimisation)

La version récursive naïve de Fibonacci est catastrophique :
`fib(5)` appelle `fib(4)` et `fib(3)`.
`fib(4)` appelle `fib(3)` et `fib(2)`.
-> On calcule `fib(3)` deux fois, `fib(2)` trois fois... C'est exponentiel !

### Solution "Mémoïsation" (Top-Down)
On garde un dictionnaire (mémoire) des valeurs déjà calculées.

```python
memoire = {}

def fib_memo(n):
    if n in memoire:
        return memoire[n] # Hop, on a déjà la réponse !
    
    if n <= 1:
        return n
    
    res = fib_memo(n-1) + fib_memo(n-2)
    memoire[n] = res # On stocke pour la prochaine fois
    return res
```

### Solution "Iterative" (Bottom-Up)
On part de 0 et 1, et on construit le tableau jusqu'à n. C'est encore plus efficace en mémoire.

## 2. Le Rendu de Monnaie

Problème : On veut rendre 6€ avec des pièces de 1€, 3€, 4€.
L'algorithme glouton (prendre la plus grosse pièce possible) ferait :
*   Prendre 4€ (reste 2€)
*   Prendre 1€ (reste 1€)
*   Prendre 1€ (reste 0)
*   -> Total : 3 pièces.

Mais la solution optimale est : 3€ + 3€ -> **2 pièces** !
L'algorithme glouton échoue ici. La programmation dynamique permet de trouver la solution optimale à coup sûr en testant toutes les combinaisons intelligemment.

---

<ExerciseTabs courseId="terminale_prog_dynamique" courseTitle="Exos Prog Dynamique">

  <ExerciseSection id="dyn-ex-1" label="Rendu de Monnaie">
    <Enonce>
    ### Rendu de Monnaie (Approche Bottom-Up)
    On a un système de pièces `P = [1, 3, 4]`.
    On veut rendre `S = 6`.
    
    On construit un tableau `min_pieces` où `min_pieces[i]` est le nombre minimal de pièces pour rendre la somme `i`.
    *   `min_pieces[0] = 0`
    *   Pour `i` de 1 à 6, on cherche `min(min_pieces[i - piece]) + 1`.
    
    Remplissez le tableau à la main.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
