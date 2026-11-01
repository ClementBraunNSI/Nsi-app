---
title: Piles et Files
description: >-
  Piles (LIFO) et files (FIFO) : principe, opérations, et implantation avec des listes.
level: premiere
chapter: Structures de données linéaires
icon: "layers"
badgeId: premiere_piles_files
prerequisites:
  - structures_lineaires_cours
audience: public
groupe: piles-files
groupeTitre: "Piles et files"
---

# Piles et files

Une liste Python permet de lire, d'insérer et de retirer un élément à presque n'importe quelle position. C'est pratique, mais parfois trop permissif. Une **pile** et une **file** sont des structures dont on a volontairement limité les opérations, pour qu'une règle d'accès soit respectée tout au long de l'algorithme. Sur une pile, on n'accède qu'au sommet. Sur une file, on ajoute d'un côté et on retire de l'autre. Ces structures servent par exemple pour l'historique d'annulation d'un éditeur, la file d'attente d'une imprimante ou le parcours d'un graphe. Dans chaque cas, la contrainte fixe l'ordre dans lequel les éléments ressortent.

## La pile : dernier entré, premier sorti

Dans une pile, le dernier élément déposé est le premier repris : on parle de structure **LIFO** (*Last In, First Out*). C'est le principe d'une pile d'assiettes, où l'on pose et reprend toujours l'assiette du dessus. Prendre une assiette au milieu ferait tomber la pile.

| Opération | Rôle |
| --- | --- |
| `empiler(e)` | ajoute au sommet |
| `depiler()` | retire et renvoie le sommet |
| `sommet()` | lit le sommet sans retirer |
| `est_vide()` | indique si la pile est vide |

```text
P vide        ->  []
empiler(10)   ->  [10]        sommet = 10
empiler(20)   ->  [10, 20]    sommet = 20
depiler()     ->  20 ; reste [10]
```

`sommet` lit le sommet sans le retirer, alors que `depiler` le retire. Sur une pile vide, aucune des deux n'a d'élément à renvoyer : il faut donc tester `est_vide` avant.

## La file : premier entré, premier sorti

Dans une file, le premier arrivé est le premier servi : on parle de structure **FIFO** (*First In, First Out*). C'est le principe d'une file d'attente à la caisse, où l'on entre en queue et où l'on sort en tête. Personne ne peut doubler, c'est-à-dire sortir du milieu de la file.

| Opération | Rôle |
| --- | --- |
| `enfiler(e)` | ajoute en queue |
| `defiler()` | retire et renvoie la tête |
| `tete()` | lit le premier sans retirer |
| `est_vide()` | indique si la file est vide |

```text
F vide        ->  []
enfiler(A)    ->  [A]         tête = A
enfiler(B)    ->  [A, B]      tête = A, queue = B
defiler()     ->  A ; reste [B]
```

A est entré avant B, donc A sort avant B. C'est l'inverse de la pile, où 20, entré après 10, sortait avant lui.

## Implémenter une pile et une file avec une liste

On peut respecter ces interfaces sans écrire de classe, avec une liste et des fonctions qui n'autorisent que les opérations prévues. On place le sommet de la pile, et la queue de la file, à la **fin** de la liste. `append` et `pop()` sans argument y sont efficaces : ils ne décalent pas les autres éléments.

```python
# --- Pile via une liste ---
def pile_vide():
    return []

def est_vide(p):
    return len(p) == 0

def empiler(p, e):
    p.append(e)

def depiler(p):
    return p.pop()          # sommet = fin de liste

def sommet(p):
    return p[-1]


# --- File via une liste ---
def file_vide():
    return []

def enfiler(f, e):
    f.append(e)             # queue = fin

def defiler(f):
    return f.pop(0)         # tête = début
```

Exemple d'usage :

```python
p = pile_vide()
empiler(p, 10)
empiler(p, 20)
print(depiler(p))  # 20
```

`depiler` renvoie 20, et non 10. Avec `pop(0)`, on aurait retiré le fond de la pile, ce qui ne respecterait plus le principe LIFO. De la même façon, `pop()` sans argument sur une file retirerait la queue, c'est-à-dire le dernier entré, ce qui ne respecterait plus l'ordre FIFO. Dans cette implémentation, la tête de la file est à l'indice 0.

!!! tip "Variante avec classes"
    Si le chapitre POO est déjà vu, on peut encapsuler la même liste dans une classe `Pile` / `File` (`self.data = []`). Le principe LIFO/FIFO ne change pas, seule l'organisation du code change.

!!! warning "Coût de `pop(0)`"
    Retirer en tête d'une liste coûte cher (décalage des éléments). Pour une file performante en Python, on utilise `collections.deque`. En cours, `pop(0)` suffit pour comprendre le modèle.

`pop(0)` décale d'un cran toutes les cases suivantes. Pour quelques dizaines d'éléments, la différence ne se voit pas, mais pour une longue file, ces décalages prennent l'essentiel du temps. `collections.deque` permet de retirer la tête sans décalage. En Première, `pop(0)` suffit pour que le modèle soit juste. Il ne faut pas non plus aller lire l'élément du milieu : la structure ne serait alors plus une pile ni une file, mais de nouveau une simple liste.

En résumé, la pile suit le principe LIFO, comme une pile d'assiettes, et la file le principe FIFO, comme une file d'attente à la caisse. Sur une pile, on empile, on dépile et on lit le sommet. Sur une file, on enfile, on défile et on lit la tête. Une liste Python peut servir de support, à condition que les fonctions respectent l'interface. Placer le sommet de la pile en fin de liste permet d'utiliser simplement `append` et `pop()`. Enfin, on ne dépile jamais une structure vide.

## Pour s'entraîner

- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Révisions listes : [Structures de données linéaires](/cours/2/structures_lineaires_cours)
