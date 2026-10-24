---
title: Piles et Files
description: >-
  Piles (LIFO) et files (FIFO) : principe, opérations, et implantation avec des listes.
level: premiere
chapter: Structures de données linéaires
icon: "\U0001F95E"
badgeId: premiere_piles_files
prerequisites:
  - structures_lineaires_cours
audience: public
---

# Piles et files

Une liste Python laisse lire, insérer et retirer à peu près n'importe quelle place. C'est pratique, et parfois trop. Une **pile** et une **file** sont des listes dont on a volontairement restreint les opérations, pour qu'une règle d'accès reste vraie du début à la fin de l'algorithme. Sur une pile, on ne touche que le sommet. Sur une file, on ajoute d'un côté et l'on retire de l'autre. L'historique d'annulation d'un éditeur, la file d'attente d'une imprimante, le parcours d'un graphe : à chaque fois, la contrainte dit dans quel ordre les éléments doivent ressortir.

## La pile : dernier entré, premier sorti

**LIFO** (*Last In, First Out*) : le dernier déposé est le premier repris. L'image est une pile d'assiettes. On pose sur le dessus, on reprend le dessus. Aller chercher l'assiette du milieu, c'est casser la pile.

| Opération | Rôle |
| --- | --- |
| `empiler(e)` | ajoute au sommet |
| `depiler()` | retire et renvoie le sommet |
| `sommet()` | lit le sommet sans retirer |
| `est_vide()` | indique si la pile est vide |

```text
P vide        →  []
empiler(10)   →  [10]        sommet = 10
empiler(20)   →  [10, 20]    sommet = 20
depiler()     →  20 ; reste [10]
```

`sommet` regarde sans prendre. `depiler` prend. Sur une pile vide, les deux n'ont rien à rendre : on teste `est_vide` avant.

## La file : premier entré, premier sorti

**FIFO** (*First In, First Out*) : le premier arrivé est le premier servi. L'image est la file d'attente à la caisse. On entre en queue, on sort en tête. Doubler, ce serait retirer quelqu'un au milieu.

| Opération | Rôle |
| --- | --- |
| `enfiler(e)` | ajoute en queue |
| `defiler()` | retire et renvoie la tête |
| `tete()` | lit le premier sans retirer |
| `est_vide()` | indique si la file est vide |

```text
F vide        →  []
enfiler(A)    →  [A]         tête = A
enfiler(B)    →  [A, B]      tête = A, queue = B
defiler()     →  A ; reste [B]
```

A est entré avant B, A sort avant B. C'est l'inverse de la pile, où 20, entré après 10, sortait avant.

## Une liste, à condition de se tenir

On peut respecter ces interfaces sans classe : une liste, et des fonctions qui refusent les autres gestes. On place le sommet de la pile, et la queue de la file, à la **fin** de la liste. `append` et `pop()` sans argument y sont efficaces : ils ne décalent pas les autres éléments.

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

`depiler` renvoie 20, pas 10. Si l'on avait fait `pop(0)`, on aurait retiré le fond de la pile, et le LIFO serait cassé. Symétriquement, `pop()` sans argument sur une file retire la queue, donc le dernier entré : l'ordre FIFO est cassé. La tête de la file, dans cette implantation, est l'indice 0.

!!! tip "Variante avec classes"
    Si le chapitre POO est déjà vu, on peut encapsuler la même liste dans une classe `Pile` / `File` (`self.data = []`). Le principe LIFO/FIFO ne change pas — seule l'organisation du code change.

!!! warning "Coût de `pop(0)`"
    Retirer en tête d'une liste coûte cher (décalage des éléments). Pour une file performante en Python, on utilise `collections.deque` ; en cours, `pop(0)` suffit pour comprendre le modèle.

`pop(0)` recopie toutes les cases suivantes d'un cran. Pour quelques dizaines d'éléments, on ne le sent pas. Pour une longue file, le décalage domine. `collections.deque` retire en tête sans ce décalage. En Première, `pop(0)` suffit pour que le modèle soit juste. On n'ira pas non plus lire l'élément du milieu : à ce moment-là, ce n'est plus ni une pile ni une file, c'est redevenu une liste.

Pour fermer : la pile est LIFO, comme les assiettes. La file est FIFO, comme la caisse. On empile, on dépile, on regarde le sommet. On enfile, on défile, on regarde la tête. Une liste Python peut servir de support si les fonctions respectent l'interface. Sommet et queue en fin de liste rendent `append` et `pop()` naturels pour la pile. On ne dépile pas une structure vide.

## Pour s'entraîner

- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Révisions listes : [Structures de données linéaires](/cours/2/structures_lineaires_cours)
