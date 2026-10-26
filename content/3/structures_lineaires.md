---
title: 'Structures Linéaires : Listes, Piles, Files'
description: Implémentation et utilisation des structures de données linéaires.
level: TNSI
order: 150
chapter: Structures de données
icon: "library"
badgeId: terminale_structures_lineaires
prerequisites:
  - poo_classes_objets
audience: public
---

# <Icone nom="library" /> Structures de Données Linéaires

Pour organiser les données, il faut des structures adaptées. En Terminale, trois structures abstraites fondamentales sont étudiées : les **Listes**, les **Piles** et les **Files**.

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

  <ExerciseSection id="struct-ex-1" label="Parenthésage" type="python">
    <Enonce>
    ### Vérification de parenthèses (Pile)
    On veut vérifier si une expression est bien parenthésée : `(a + b) * (c)` est bon, `(a + b` est mauvais.
    
    **Algorithme :**
    1.  Parcourir la chaîne caractère par caractère.
    2.  Si on voit `(`, on l'empile.
    3.  Si on voit `)`, on dépile.
        *   Si la pile est vide avant de dépiler -> Erreur (trop de fermantes).
    4.  À la fin, la pile doit être vide.
    
    Écrire la fonction `verifier_parentheses(expression)`.

    <Correction>
    ```python
    def verifier_parentheses(expression):
        pile = []
        for caractere in expression:
            if caractere == "(":
                pile.append(caractere)
            elif caractere == ")":
                if len(pile) == 0:
                    return False
                pile.pop()
        return len(pile) == 0
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert verifier_parentheses("(a + b) * (c)") is True, "(a + b) * (c) est bien parenthésée."
    assert verifier_parentheses("(a + b") is False, "(a + b : il manque une parenthèse fermante."
    assert verifier_parentheses("a + b)") is False, "a + b) : une fermante n'a pas d'ouvrante."
    assert verifier_parentheses(")(") is False, ")( : la fermante arrive avant l'ouvrante."
    assert verifier_parentheses("") is True, "Une expression vide est bien parenthésée."
    assert verifier_parentheses("((x))()") is True, "((x))() est bien parenthésée."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="struct-ex-2" label="Croisement Routier" type="python">
    <Enonce>
    ### Simulation de croisement (File)
    On modélise un feu rouge avec une File. Les voitures arrivent et s'ajoutent à la file. Quand le feu passe au vert, la première voiture part.
    
    Utiliser `collections.deque` (plus efficace que list pour les files).
    1.  Créer une file vide.
    2.  Ajouter "Voiture A", "Voiture B".
    3.  Faire partir une voiture.
    4.  Ajouter "Voiture C".
    5.  Afficher la prochaine voiture à partir.

    <Correction>
    ```python
    from collections import deque

    file = deque()
    file.append("Voiture A")
    file.append("Voiture B")
    file.popleft()
    file.append("Voiture C")
    print(file[0])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    from collections import deque
    assert 'file' in globals(), "La file doit s'appeler file."
    assert isinstance(file, deque), "file doit être une collections.deque."
    assert list(file) == ["Voiture B", "Voiture C"], "La file doit contenir Voiture B puis Voiture C."
    assert SORTIE.strip().splitlines()[-1] == "Voiture B", "Le programme doit afficher la prochaine voiture à partir : Voiture B."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
