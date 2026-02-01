---
title: Piles et Files
description: Structures de données linéaires avancées. Piles (LIFO) et Files (FIFO). Implémentation POO.
level: Première
chapter: 12
icon: material/stack-overflow
---

# Piles et Files

## 1. Introduction

Les listes Python sont très souples, mais en informatique, on a souvent besoin de structures plus contraintes pour gérer des données de manière spécifique.
Deux structures fondamentales sont :

*   La **Pile** (Stack)
*   La **File** (Queue)

## 2. La Pile (Stack) - LIFO

!!! info "Principe LIFO"
    **LIFO** = **L**ast **I**n, **F**irst **O**ut (Dernier Entré, Premier Sorti).
    
    *Imaginez une pile d'assiettes : vous ne pouvez prendre que celle du dessus (la dernière posée).*

### Opérations (Interface)

Une Pile doit permettre de :

*   `empiler(e)` (push) : Ajouter un élément au sommet.
*   `depiler()` (pop) : Retirer l'élément du sommet.
*   `sommet()` (peek) : Regarder l'élément du sommet sans le retirer.
*   `est_vide()` : Savoir si la pile est vide.

### Exemple d'exécution

```text
P = Pile()      # []
P.empiler(10)   # [10]
P.empiler(20)   # [10, 20] (Sommet = 20)
x = P.depiler() # x vaut 20, P redevient [10]
```

## 3. La File (Queue) - FIFO

!!! info "Principe FIFO"
    **FIFO** = **F**irst **I**n, **F**irst **O**ut (Premier Entré, Premier Sorti).
    
    *Imaginez une file d'attente à la caisse : le premier arrivé est le premier servi.*

### Opérations (Interface)

Une File doit permettre de :

*   `enfiler(e)` (enqueue) : Ajouter un élément à la queue.
*   `defiler()` (dequeue) : Retirer l'élément de la tête.
*   `tete()` : Regarder le premier élément.
*   `est_vide()` : Savoir si la file est vide.

### Exemple d'exécution

```text
F = File()      # []
F.enfiler(A)    # [A]
F.enfiler(B)    # [A, B] (Tête = A, Queue = B)
x = F.defiler() # x vaut A, F devient [B]
```

## 4. Implémentation en Python (POO)

Bien que les listes Python puissent servir de piles/files, il est pédagogique de créer nos propres classes pour respecter strictement l'interface.

### Classe Pile

```python
class Pile:
    def __init__(self):
        self.data = []
        
    def est_vide(self):
        return len(self.data) == 0
        
    def empiler(self, element):
        self.data.append(element)
        
    def depiler(self):
        if not self.est_vide():
            return self.data.pop()
        return None
```

### Classe File

```python
class File:
    def __init__(self):
        self.data = []
        
    def est_vide(self):
        return len(self.data) == 0
        
    def enfiler(self, element):
        self.data.append(element)
        
    def defiler(self):
        if not self.est_vide():
            # pop(0) retire le premier élément (indice 0)
            return self.data.pop(0) 
        return None
```

!!! warning "Note sur la performance"
    `pop(0)` sur une liste Python est lent ($O(n)$) car il faut décaler tous les autres éléments.
    Pour une vraie File performante en Python, on utilise `collections.deque`.
