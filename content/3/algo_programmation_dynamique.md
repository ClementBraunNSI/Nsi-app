---
title: Programmation Dynamique
description: 'Optimisation de problèmes complexes (Rendu de monnaie, Fibonacci).'
level: TNSI
order: 130
chapter: Algorithmique
icon: "zap"
badgeId: terminale_prog_dynamique
prerequisites:
  - algo_diviser_pour_regner
audience: public
---

# Programmation dynamique

Diviser pour régner découpe un problème et résout les morceaux. Cela devient ruineux quand les morceaux se recoupent : on recalcule dix fois la même chose, par des chemins différents. La **programmation dynamique** fait le même découpage, et elle **range** le résultat de chaque sous-problème. La prochaine fois qu'on le rencontre, on le lit au lieu de le recalculer.

Il faut pour cela deux propriétés. Des **sous-problèmes qui se chevauchent** : la même question revient. Et une **sous-structure optimale** : la meilleure solution du problème se construit à partir des meilleures solutions de problèmes plus petits. Si l'une des deux manque, stocker des résultats ne suffit pas à garantir l'optimum.

## Fibonacci, calculé une fois

La définition $F_0 = 0$, $F_1 = 1$, $F_n = F_{n-1} + F_{n-2}$ se traduit par deux appels récursifs. `fib(5)` appelle `fib(4)` et `fib(3)`. `fib(4)` appelle encore `fib(3)` et `fib(2)`. `fib(3)` est donc calculé deux fois, `fib(2)` davantage, et l'arbre des appels grossit comme une exponentielle. Les résultats sont corrects. Le temps ne l'est pas.

La **mémoïsation** range les valeurs déjà obtenues, en partant de $n$ et en descendant. C'est l'approche *top-down* : le même schéma récursif, plus un dictionnaire.

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

Le premier appel qui demande `fib(3)` le calcule et le stocke. Le second le trouve dans `memoire` et s'arrête. Chaque valeur de 0 à $n$ est calculée une fois. Le coût devient linéaire, au prix d'un dictionnaire de taille $n$.

On peut aussi construire dans l'autre sens, *bottom-up* : remplir un tableau de 0 jusqu'à $n$, en s'appuyant seulement sur des cases déjà écrites. Il n'y a plus d'appels récursifs, donc plus de pile.

```python
def fib_tab(n):
    if n <= 1:
        return n
    tab = [0] * (n + 1)
    tab[1] = 1
    for i in range(2, n + 1):
        tab[i] = tab[i - 1] + tab[i - 2]
    return tab[n]
```

`tab[i]` est $F_i$. Au moment où on l'écrit, `tab[i - 1]` et `tab[i - 2]` sont déjà les bonnes valeurs. On peut même ne garder que les deux dernières cases : le tableau entier n'est pas nécessaire pour Fibonacci. Il le devient pour des problèmes où chaque case dépend de beaucoup de cases précédentes, pas seulement des deux dernières.

## Le rendu de monnaie, quand le glouton se trompe

En Première, le glouton rend la monnaie en prenant toujours la plus grosse pièce possible. Avec `{1, 3, 4}` et une somme de 6, il prend 4, puis 1, puis 1 : trois pièces. Or 3 + 3 font 6 avec deux pièces. Le choix local n'est pas optimal, et comme le glouton ne revient pas en arrière, il ne le saura pas.

La programmation dynamique cherche, pour chaque somme $i$ de 0 à 6, le nombre minimal de pièces. On note ce nombre `min_pieces[i]`. La somme 0 coûte 0 pièce. Pour une somme $i > 0$, on essaie chaque pièce $p$ qui ne dépasse pas $i$, et l'on regarde `min_pieces[i - p] + 1` : le coût optimal du reste, plus la pièce qu'on vient de poser. On garde le minimum de ces essais.

Ainsi `min_pieces[1]` ne peut utiliser que la pièce 1, et vaut 1. La case 2 s'appuie sur la case 1. Quand on arrive à 6, les cases plus petites sont déjà optimales, et le minimum parmi « 6 − 1 », « 6 − 3 » et « 6 − 4 » donne la vraie réponse, pas seulement le choix glouton. On a testé les combinaisons utiles, sans les énumérer toutes : chaque somme n'est résolue qu'une fois.

<ExerciseTabs courseId="terminale_prog_dynamique" courseTitle="Exos Prog Dynamique">

  <ExerciseSection id="dyn-ex-1" label="Rendu de Monnaie" type="lecture">
    <Enonce>
    ### Rendu de Monnaie (Approche Bottom-Up)
    On a un système de pièces `P = [1, 3, 4]`.
    On veut rendre `S = 6`.
    
    On construit un tableau `min_pieces` où `min_pieces[i]` est le nombre minimal de pièces pour rendre la somme `i`.
    *   `min_pieces[0] = 0`
    *   Pour `i` de 1 à 6, on cherche `min(min_pieces[i - piece]) + 1`.
    
    Remplir le tableau à la main.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
