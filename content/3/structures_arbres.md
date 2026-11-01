---
title: Arbres et Arbres Binaires
description: 'Structures hiérarchiques, vocabulaire et algorithmes de base.'
level: TNSI
order: 160
chapter: Structures de données
icon: "tree-deciduous"
badgeId: terminale_arbres
prerequisites:
  - structures_lineaires
audience: public
---

# Structures d'arbres

Une liste range des éléments les uns à la suite des autres. Un **arbre**, lui, les organise en niveaux : chaque élément a un parent, sauf un seul, et peut avoir des enfants. Les systèmes de fichiers, le DOM d'une page HTML ou l'analyse d'une expression sont des exemples d'arbres. On ne repère plus un élément par son indice, mais par sa position dans la hiérarchie.

## Le vocabulaire

Un arbre est un ensemble de **nœuds** reliés par des arêtes, sans cycle, avec un nœud distingué. La **racine** est ce nœud du haut, le seul qui n'a pas de parent. Une **feuille** n'a pas d'enfant. Un **nœud interne** en a au moins un. La **taille** est le nombre de nœuds.

Pour la **hauteur**, il faut choisir une convention, car les énoncés ne s'accordent pas tous. Si l'on compte les **arêtes** du plus long chemin entre la racine et une feuille, une racine seule a une hauteur de 0 : c'est la convention la plus fréquente en NSI. Les exercices de cette page comptent cependant autrement, en donnant une hauteur de 0 à l'arbre vide et de 1 à une racine seule, c'est-à-dire en comptant le nombre de nœuds sur le plus long chemin. Il faut donc toujours vérifier la convention de l'énoncé.

```
/ (Racine)
├── home
│   ├── user (Nœud interne)
│   │   ├── documents
│   │   └── images (Feuille)
└── var
    └── log (Feuille)
```

`images` et `log` sont des feuilles. `user` est interne : il a des enfants. `/` est la racine. La taille compte tous les nœuds, et pas seulement les fichiers.

## Les arbres binaires

Un **arbre binaire** est un arbre dont chaque nœud a **au plus deux** enfants, distingués : un sous-arbre **gauche** et un sous-arbre **droit**. Un enfant unique est donc soit à gauche, soit à droite, et l'autre côté vaut `None`. L'ordre des côtés fait partie de la structure : échanger les deux enfants donne un autre arbre.

```python
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droit = None

# Construction de l'arbre :
#       A
#      / \
#     B   C

racine = Noeud("A")
racine.gauche = Noeud("B")
racine.droit = Noeud("C")
```

`gauche` et `droit` sont eux-mêmes des nœuds, ou `None` si le côté est vide. Dans ce codage, un arbre est simplement une référence vers sa racine, et l'arbre vide est représenté par `None`.

<TreeVisualizer />

## Les parcours d'arbres

Un **parcours en profondeur** suit une branche jusqu'à la feuille, puis remonte pour prendre la branche voisine. On le programme naturellement de façon récursive, puisque traiter un nœud revient à traiter ses sous-arbres. Selon le moment où l'on traite la racine du sous-arbre, on obtient trois ordres.

Le parcours **préfixe** traite la racine, puis le gauche, puis le droit. Il sert par exemple à recopier un arbre, puisque le parent est traité avant ses enfants.

Le parcours **infixe** traite le gauche, puis la racine, puis le droit. Sur un arbre binaire de recherche, cet ordre donne les valeurs triées. Ce parcours sera utilisé dans le chapitre suivant.

Le parcours **postfixe** traite le gauche, le droit, puis la racine. On supprime un arbre dans cet ordre, en traitant les enfants avant le parent pour ne pas perdre les liens. C'est aussi l'ordre utilisé pour évaluer une expression en notation postfixée, comme `3 4 +` : les opérandes sont traités d'abord, puis l'opérateur, une fois ses deux opérandes connus.

Un **parcours en largeur** visite l'arbre niveau par niveau : la racine, puis ses enfants, puis ses petits-enfants. La récursivité ne permet pas d'obtenir directement cet ordre : on utilise donc une **file**. On enfile d'abord la racine, puis, tant que la file n'est pas vide, on défile un nœud, on le traite et on enfile ses enfants. La file garantit qu'un niveau entier est visité avant le niveau suivant.

<ExerciseTabs courseId="terminale_arbres" courseTitle="Exercices Arbres">

  <ExerciseSection id="arbre-ex-1" label="Taille et Hauteur" type="python">
    <CodeDepart>
    ```python
    class Noeud:
        def __init__(self, valeur):
            self.valeur = valeur
            self.gauche = None
            self.droit = None
    ```
    </CodeDepart>
    <Enonce>
    ### Calculer la Taille et la Hauteur
    Écrire deux fonctions récursives :
    1.  `taille(arbre)` : Renvoie le nombre de nœuds.
    2.  `hauteur(arbre)` : Renvoie la hauteur (0 pour un arbre vide, 1 pour racine seule, etc.).

    <Correction>
    ```python
    def taille(arbre):
        if arbre is None:
            return 0
        return 1 + taille(arbre.gauche) + taille(arbre.droit)

    def hauteur(arbre):
        if arbre is None:
            return 0
        return 1 + max(hauteur(arbre.gauche), hauteur(arbre.droit))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    racine = Noeud(10)
    racine.gauche = Noeud(5)
    racine.droit = Noeud(15)
    racine.gauche.gauche = Noeud(2)
    racine.gauche.gauche.droit = Noeud(3)
    assert taille(None) == 0, "L'arbre vide a une taille de 0."
    assert hauteur(None) == 0, "L'arbre vide a une hauteur de 0."
    assert taille(Noeud(1)) == 1, "Une racine seule a une taille de 1."
    assert hauteur(Noeud(1)) == 1, "Une racine seule a une hauteur de 1."
    assert taille(racine) == 5, "L'arbre de test a 5 nœuds."
    assert hauteur(racine) == 4, "L'arbre de test a une hauteur de 4 (10, 5, 2, 3)."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="arbre-ex-2" label="Parcours Infixe" type="python">
    <CodeDepart>
    ```python
    class Noeud:
        def __init__(self, valeur):
            self.valeur = valeur
            self.gauche = None
            self.droit = None

    racine = Noeud(10)
    racine.gauche = Noeud(5)
    racine.droit = Noeud(15)
    ```
    </CodeDepart>
    <Enonce>
    ### Affichage Infixe
    Écrire une fonction récursive `afficher_infixe(noeud)` qui affiche les valeurs de l'arbre dans l'ordre infixe (Gauche - Racine - Droite).
    
    Tester avec l'arbre :
    ```
          10
         /  \
        5    15
    ```
    Cela devrait afficher : `5 10 15`

    <Correction>
    ```python
    def afficher_infixe(noeud):
        if noeud is not None:
            afficher_infixe(noeud.gauche)
            print(noeud.valeur, end=" ")
            afficher_infixe(noeud.droit)

    afficher_infixe(racine)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def __sortie(arbre):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            afficher_infixe(arbre)
        return tampon.getvalue().split()
    petit = Noeud(10)
    petit.gauche = Noeud(5)
    petit.droit = Noeud(15)
    assert __sortie(petit) == ["5", "10", "15"], "L'arbre 10 / 5 / 15 doit afficher 5 10 15."
    grand = Noeud(8)
    grand.gauche = Noeud(3)
    grand.gauche.droit = Noeud(6)
    grand.droit = Noeud(12)
    assert __sortie(grand) == ["3", "6", "8", "12"], "Ordre infixe : sous-arbre gauche, racine, sous-arbre droit."
    assert __sortie(None) == [], "L'arbre vide n'affiche rien."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
