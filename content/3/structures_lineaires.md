---
title: 'Structures Linéaires : Listes, Piles, Files'
description: 'Listes chaînées, piles et files : types abstraits, axiomes, implémentations et animations.'
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

Une structure linéaire range des éléments les uns derrière les autres. Chaque élément, sauf le dernier, a un successeur. Trois structures de ce genre sont au programme de Terminale : la **liste chaînée**, la **pile** et la **file**. Elles se distinguent par les opérations permises, c'est-à-dire par l'endroit où l'on ajoute un élément et par celui où on le retire.

## Type abstrait et implémentation

Un **type de données abstrait** décrit une structure par ses opérations, sans dire comment elle est programmée. Pour chaque opération, on donne sa **signature**, c'est-à-dire ce qu'elle reçoit et ce qu'elle renvoie. On écrit par exemple `empiler(p: Pile, x: Élément) → Pile`.

Les signatures ne suffisent pas à dire ce que font les opérations. On ajoute donc des **axiomes**, des égalités toujours vraies qui relient les opérations entre elles. Par exemple, l'axiome `est_vide(pile_vide()) = Vrai` dit qu'une pile qui vient d'être créée ne contient rien.

Une **implémentation** est un programme qui réalise ces opérations. Une même pile peut être programmée avec une liste Python ou avec des maillons chaînés. Un programme qui n'utilise que les opérations du type abstrait fonctionne avec n'importe quelle implémentation correcte.

| Structure | Ajout | Retrait | Principe |
| --- | --- | --- | --- |
| Liste chaînée | en tête | en tête | accès séquentiel depuis la tête |
| Pile | au sommet | au sommet | dernier entré, premier sorti (LIFO) |
| File | en queue | en tête | premier entré, premier sorti (FIFO) |

## 1. Les listes chaînées

### Le type abstrait Liste

Une liste est soit vide, soit formée d'un premier élément, la **tête**, suivi d'une autre liste, la **queue**. Cette définition est récursive : la queue d'une liste est elle-même une liste.

| Opération | Signature | Rôle |
| --- | --- | --- |
| `liste_vide` | `liste_vide() → Liste` | crée une liste vide |
| `est_vide` | `est_vide(l: Liste) → Booléen` | indique si la liste est vide |
| `ajouter_en_tete` | `ajouter_en_tete(l: Liste, x: Élément) → Liste` | renvoie la liste qui commence par `x` puis continue avec `l` |
| `tete` | `tete(l: Liste) → Élément` | renvoie le premier élément d'une liste non vide |
| `queue` | `queue(l: Liste) → Liste` | renvoie la liste privée de son premier élément, si elle n'est pas vide |

Les axiomes suivants valent pour toute liste `l` et tout élément `x` :

- `est_vide(liste_vide()) = Vrai` ;
- `est_vide(ajouter_en_tete(l, x)) = Faux` ;
- `tete(ajouter_en_tete(l, x)) = x` ;
- `queue(ajouter_en_tete(l, x)) = l` ;
- `tete(liste_vide())` et `queue(liste_vide())` ne sont pas définies.

Avec ces opérations, la liste `3, 1, 4` s'écrit `ajouter_en_tete(ajouter_en_tete(ajouter_en_tete(liste_vide(), 4), 1), 3)`. Le dernier élément ajouté se retrouve en tête.

### Une implémentation avec des maillons

Dans une liste Python, les éléments sont rangés dans des cases voisines de la mémoire. Une **liste chaînée** est faite de **maillons** dispersés en mémoire. Chaque maillon contient une valeur et une référence vers le maillon suivant. Le dernier maillon contient la référence `None`.

```text
tete
 │
 ▼
[3 | •]──►[1 | •]──►[4 | •]──► None
```

```python
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant


class ListeChainee:
    def __init__(self):
        self.tete = None          # liste vide : aucun maillon

    def est_vide(self):
        return self.tete is None

    def ajouter_en_tete(self, x):
        self.tete = Maillon(x, self.tete)

    def retirer_tete(self):
        assert not self.est_vide(), "liste vide"
        valeur = self.tete.valeur
        self.tete = self.tete.suivant
        return valeur

    def longueur(self):
        n = 0
        maillon = self.tete
        while maillon is not None:
            n = n + 1
            maillon = maillon.suivant
        return n
```

`ajouter_en_tete` crée un seul maillon et change une seule référence, quelle que soit la longueur de la liste : son coût est constant, en $O(1)$. Pour connaître la longueur ou atteindre le dernier maillon, il faut au contraire suivre les références une par une depuis la tête, ce qui coûte $O(n)$ pour une liste de $n$ éléments.

L'animation suivante montre les deux cas. L'ajout en tête est immédiat. L'ajout en queue parcourt d'abord tous les maillons avant de pouvoir accrocher le nouveau.

<LinearStructureVisualizer type="liste" initial="3 1 4" />

| Opération | Liste Python (tableau) | Liste chaînée |
| --- | --- | --- |
| lire l'élément d'indice `i` | $O(1)$ | $O(i)$ : parcours depuis la tête |
| ajouter ou retirer en tête | $O(n)$ : décalage de toutes les cases | $O(1)$ |
| ajouter à la fin | $O(1)$ en moyenne | $O(n)$, ou $O(1)$ si l'on garde une référence vers le dernier maillon |

## 2. Les piles

### Le principe LIFO

Dans une pile, on ajoute et on retire toujours au même endroit, le **sommet**. Le dernier élément empilé est donc le premier à sortir : c'est le principe **LIFO** (*Last In, First Out*). Une pile d'assiettes fonctionne ainsi.

L'animation montre qu'une suite de valeurs empilées ressort dans l'ordre inverse.

<LinearStructureVisualizer type="pile" initial="4 8 2" />

### Le type abstrait Pile

| Opération | Signature | Rôle |
| --- | --- | --- |
| `pile_vide` | `pile_vide() → Pile` | crée une pile vide |
| `est_vide` | `est_vide(p: Pile) → Booléen` | indique si la pile est vide |
| `empiler` | `empiler(p: Pile, x: Élément) → Pile` | place `x` au sommet de `p` |
| `depiler` | `depiler(p: Pile) → Élément` | retire le sommet d'une pile non vide et le renvoie |
| `sommet` | `sommet(p: Pile) → Élément` | renvoie le sommet d'une pile non vide sans le retirer |
| `taille` | `taille(p: Pile) → Entier` | renvoie le nombre d'éléments |

Les axiomes suivants valent pour toute pile `p` et tout élément `x` :

- `est_vide(pile_vide()) = Vrai` ;
- `est_vide(empiler(p, x)) = Faux` ;
- `sommet(empiler(p, x)) = x` ;
- `depiler(empiler(p, x)) = x`, et la pile retrouve ensuite exactement le contenu de `p` ;
- `taille(pile_vide()) = 0` et `taille(empiler(p, x)) = taille(p) + 1` ;
- `depiler(pile_vide())` et `sommet(pile_vide())` ne sont pas définis.

Le quatrième axiome résume le principe LIFO : un élément empilé puis aussitôt dépilé ressort tel quel, et le reste de la pile n'a pas bougé.

### Une implémentation avec une liste Python

Le sommet est placé à la **fin** de la liste. `append` et `pop()` sans argument agissent à la fin sans décaler les autres cases : toutes les opérations coûtent $O(1)$.

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        assert not self.est_vide(), "pile vide"
        return self.elements.pop()

    def sommet(self):
        assert not self.est_vide(), "pile vide"
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


p = Pile()
p.empiler(4)
p.empiler(8)
print(p.depiler())   # 8
print(p.sommet())    # 4
```

Une liste chaînée convient aussi : le sommet est alors la tête, et `empiler` revient à `ajouter_en_tete`.

### Utilisations

- La fonction « Annuler » d'un éditeur empile chaque modification et dépile la dernière.
- Le bouton « Précédent » d'un navigateur dépile la dernière page visitée.
- Lors d'appels récursifs, l'interpréteur empile un contexte par appel : c'est la **pile d'appels**.
- La vérification du parenthésage d'une expression empile chaque parenthèse ouvrante et la dépile à la fermante correspondante.

## 3. Les files

### Le principe FIFO

Dans une file, on ajoute à un bout, la **queue**, et on retire à l'autre bout, la **tête**. Le premier élément entré est donc le premier à sortir : c'est le principe **FIFO** (*First In, First Out*). Une file d'attente à la cantine fonctionne ainsi.

L'animation montre que les valeurs ressortent dans leur ordre d'arrivée.

<LinearStructureVisualizer type="file" initial="4 8 2" />

### Le type abstrait File

| Opération | Signature | Rôle |
| --- | --- | --- |
| `file_vide` | `file_vide() → File` | crée une file vide |
| `est_vide` | `est_vide(f: File) → Booléen` | indique si la file est vide |
| `enfiler` | `enfiler(f: File, x: Élément) → File` | place `x` en queue de `f` |
| `defiler` | `defiler(f: File) → Élément` | retire la tête d'une file non vide et la renvoie |
| `premier` | `premier(f: File) → Élément` | renvoie la tête d'une file non vide sans la retirer |
| `taille` | `taille(f: File) → Entier` | renvoie le nombre d'éléments |

Les axiomes suivants valent pour toute file `f` et tout élément `x` :

- `est_vide(file_vide()) = Vrai` ;
- `est_vide(enfiler(f, x)) = Faux` ;
- `defiler(enfiler(file_vide(), x)) = x`, et la file est de nouveau vide ;
- si `f` n'est pas vide, `defiler(enfiler(f, x)) = defiler(f)` : l'élément qui sort est le même que si `x` n'avait pas été ajouté ;
- `taille(file_vide()) = 0` et `taille(enfiler(f, x)) = taille(f) + 1` ;
- `defiler(file_vide())` et `premier(file_vide())` ne sont pas définis.

Le quatrième axiome résume le principe FIFO : un élément qui vient d'arriver attend derrière ceux qui étaient déjà là.

### Des implémentations

Avec une liste Python, la queue est à la fin et la tête à l'indice 0. `enfiler` utilise `append`, mais `defiler` doit utiliser `pop(0)`, qui décale toutes les cases suivantes : son coût est en $O(n)$.

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        assert not self.est_vide(), "file vide"
        return self.elements.pop(0)      # O(n) : décalage des cases

    def premier(self):
        assert not self.est_vide(), "file vide"
        return self.elements[0]

    def taille(self):
        return len(self.elements)
```

Pour que toutes les opérations soient en $O(1)$, plusieurs solutions existent :

- une **liste chaînée** avec deux références, l'une vers le maillon de tête (pour défiler) et l'autre vers le maillon de queue (pour enfiler) ;
- **deux piles** : on enfile sur une pile d'entrée, on défile depuis une pile de sortie, et la pile d'entrée n'est retournée dans la pile de sortie que lorsque celle-ci est vide ;
- le type `collections.deque` de Python, dont `append` et `popleft` coûtent $O(1)$.

```python
from collections import deque

f = deque()
f.append("A")        # enfiler
f.append("B")
print(f.popleft())   # défiler : A
```

### Utilisations

- Une imprimante partagée traite les documents dans leur ordre d'arrivée.
- Les tampons du clavier ou du réseau gardent les données dans l'ordre de réception.
- Un ordonnanceur de processus peut placer les tâches prêtes dans une file.
- Le parcours en largeur d'un graphe ou d'un arbre visite les sommets à l'aide d'une file.

## 4. Choisir une structure

Le choix dépend des opérations dont l'algorithme a besoin. Quand seul le dernier élément ajouté compte, on utilise une pile. Quand les éléments doivent être traités dans leur ordre d'arrivée, on utilise une file. Quand on ajoute et on retire souvent en tête, une liste chaînée est plus efficace qu'un tableau. Enfin, quand on a besoin de lire n'importe quel élément par son indice, un tableau reste le meilleur choix.

!!! tip "Pour s'entraîner"
    La fiche [Exercices : Piles et files](/cours/3/structures_lineaires_exercices) fait d'abord programmer les classes `Pile` et `File`, puis les utiliser pour résoudre des problèmes.

---

<ExerciseTabs courseId="terminale_structures_lineaires" courseTitle="Exercices Piles & Files">

  <ExerciseSection id="struct-ex-1" label="Parenthésage" type="python">
    <Enonce>
    ### Vérification de parenthèses (Pile)
    Une expression est bien parenthésée si chaque parenthèse fermante correspond à une ouvrante placée avant elle. Par exemple, `(a + b) * (c)` est bien parenthésée, mais pas `(a + b`.

    **Algorithme :**
    1.  Parcourir la chaîne caractère par caractère.
    2.  À chaque `(`, l'empiler.
    3.  À chaque `)`, dépiler. Si la pile est vide à ce moment, il y a une parenthèse fermante de trop.
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
    Un feu rouge est modélisé par une file. Les voitures arrivent et s'ajoutent à la file. Quand le feu passe au vert, la première voiture part.

    Utiliser `collections.deque`, plus efficace qu'une liste pour une file.
    1.  Créer une file vide nommée `file`.
    2.  Ajouter "Voiture A", puis "Voiture B".
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
