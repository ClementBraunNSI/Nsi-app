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
---

## Objectifs

- Expliquer les principes **LIFO** (pile) et **FIFO** (file).
- Citer les opérations d'une pile et d'une file.
- Simuler une suite d'empilements / dépilements (ou enfilements / défilements).
- Implanter ces structures avec une liste Python.

## Idée clé

Les listes Python autorisent presque tout. Une **pile** ou une **file** restreint volontairement les opérations pour respecter une règle d'accès : seulement le sommet (pile) ou seulement la tête (file). La contrainte clarifie l'algorithme (historique « undo », file d'attente, parcours, etc.).

## La pile — LIFO

**LIFO** (*Last In, First Out*) : dernier entré, premier sorti.  
Analogie : une **pile d'assiettes** — on ne prend que celle du dessus.

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

## La file — FIFO

**FIFO** (*First In, First Out*) : premier entré, premier sorti.  
Analogie : une **file d'attente** à la caisse.

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

## Implantation avec des listes

On peut respecter l'interface **sans** écrire de classe : une liste + des fonctions. Le sommet de pile (ou la queue de file) correspond à la **fin** de la liste, ce qui rend `append` / `pop()` efficaces.

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

!!! tip "Variante avec classes"
    Si le chapitre POO est déjà vu, on peut encapsuler la même liste dans une classe `Pile` / `File` (`self.data = []`). Le principe LIFO/FIFO ne change pas — seule l'organisation du code change.

!!! warning "Coût de `pop(0)`"
    Retirer en tête d'une liste coûte cher (décalage des éléments). Pour une file performante en Python, on utilise `collections.deque` ; en cours, `pop(0)` suffit pour comprendre le modèle.

## Piège fréquent

- Utiliser `pop()` (fin) pour défiler alors que la tête est au début → ordre FIFO cassé.
- Dépiler / défiler une structure vide : toujours tester `est_vide()` avant.

## À retenir

- Pile = **LIFO** (assiettes) ; file = **FIFO** (file d'attente).
- Pile : `empiler`, `depiler`, `sommet`, `est_vide`.
- File : `enfiler`, `defiler`, `tete`, `est_vide`.
- Une liste Python peut servir de support si on respecte l'interface.
- Sommet / queue en fin de liste → `append` et `pop()` naturels pour la pile.
- Ne pas accéder aux éléments du « milieu » : ce n'est plus une pile ni une file.

## Pour s'entraîner

- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Révisions listes : [Structures de données linéaires](/cours/2/structures_lineaires_cours)
