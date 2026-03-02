---
title: "Structures Linéaires : Listes, Piles, Files"
description: "Implémentation et utilisation des structures de données linéaires."
level: terminale
chapter: "Structures de données"
icon: "📚"
badgeId: "terminale_structures_lineaires"
---

# 📚 Structures de Données Linéaires

Pour organiser les données, nous avons besoin de structures adaptées. En Terminale, nous étudions trois structures abstraites fondamentales : les **Listes**, les **Piles** et les **Files**.

## 1. Les Listes Chaînées (Linked Lists)

Contrairement aux tableaux (tableaux dynamiques de Python `list`) où les éléments sont contigus en mémoire, une **liste chaînée** est composée de **maillons**.
Chaque maillon contient :
1.  Une **valeur** (la donnée).
2.  Une **référence** (lien) vers le maillon suivant.

### Structure
`[Tête | •] -> [Maillon 2 | •] -> [Maillon 3 | None]`

*   **Avantage** : Insertion/Suppression en tête très rapide (O(1)).
*   **Inconvénient** : Accès au i-ème élément lent (O(n), il faut tout parcourir).

### Implémentation

```python
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant

# Création manuelle de la liste 1 -> 2 -> 3
m3 = Maillon(3)
m2 = Maillon(2, m3)
tete = Maillon(1, m2)
```

## 2. Les Piles (Stacks)

Le principe est **LIFO** (Last In, First Out) : **Dernier Arrivé, Premier Sorti**.
C'est comme une pile d'assiettes. On ne peut ajouter ou retirer que sur le dessus.

### Interface (Opérations)
*   `empiler(e)` (push) : Ajoute un élément au sommet.
*   `depiler()` (pop) : Retire et renvoie l'élément du sommet.
*   `est_vide()` : Renvoie Vrai si la pile est vide.

### Utilisations
*   Gestion des appels de fonctions (récursivité).
*   Fonction "Annuler" (Ctrl+Z) des éditeurs de texte.
*   Vérification de parenthésage : `(( ))`.

```python
# Implémentation simple avec une liste Python
pile = []
pile.append(1) # Empiler
pile.append(2)
sommet = pile.pop() # Dépiler (renvoie 2)
```

## 3. Les Files (Queues)

Le principe est **FIFO** (First In, First Out) : **Premier Arrivé, Premier Sorti**.
C'est comme une file d'attente à la cantine. On ajoute à la fin (queue), on retire au début (tête).

### Interface (Opérations)
*   `enfiler(e)` (enqueue) : Ajoute un élément à la queue.
*   `defiler()` (dequeue) : Retire et renvoie l'élément de tête.
*   `est_vide()` : Renvoie Vrai si la file est vide.

### Utilisations
*   File d'attente d'impression.
*   Tampon (buffer) de clavier ou de réseau.
*   Parcours en largeur (BFS) d'un graphe.

---

<ExerciseTabs courseId="terminale_structures_lineaires" courseTitle="Exercices Piles & Files">

  <ExerciseSection id="struct-ex-1" label="Parenthésage">
    <Enonce>
    ### Vérification de parenthèses (Pile)
    On veut vérifier si une expression est bien parenthésée : `(a + b) * (c)` est bon, `(a + b` est mauvais.
    
    **Algorithme :**
    1.  Parcourir la chaîne caractère par caractère.
    2.  Si on voit `(`, on l'empile.
    3.  Si on voit `)`, on dépile.
        *   Si la pile est vide avant de dépiler -> Erreur (trop de fermantes).
    4.  À la fin, la pile doit être vide.
    
    Écrivez la fonction `verifier_parentheses(expression)`.
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="struct-ex-2" label="Croisement Routier">
    <Enonce>
    ### Simulation de croisement (File)
    On modélise un feu rouge avec une File. Les voitures arrivent et s'ajoutent à la file. Quand le feu passe au vert, la première voiture part.
    
    Utilisez `collections.deque` (plus efficace que list pour les files).
    1.  Créez une file vide.
    2.  Ajoutez "Voiture A", "Voiture B".
    3.  Faites partir une voiture.
    4.  Ajoutez "Voiture C".
    5.  Affichez la prochaine voiture à partir.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
