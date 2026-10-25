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

Une liste range des éléments à la suite. Un **arbre** les range en niveaux : chaque élément a un parent, sauf un, et peut avoir des enfants. Les systèmes de fichiers, le DOM d'une page HTML, l'analyse d'une expression : ce sont des arbres. On ne parle plus d'indice « le troisième », on parle de qui descend de qui.

## Le vocabulaire

Un arbre est un ensemble de **nœuds** reliés par des arêtes, sans cycle, avec un nœud distingué. La **racine** est ce nœud du haut, le seul qui n'a pas de parent. Une **feuille** n'a pas d'enfant. Un **nœud interne** en a au moins un. La **taille** est le nombre de nœuds.

La **hauteur** demande qu'on fixe une convention, parce que les énoncés ne s'accordent pas. Compter les **arêtes** du plus long chemin de la racine à une feuille donne une hauteur 0 à une racine seule. C'est la convention la plus fréquente en NSI. Les exercices de cette page comptent autrement : 0 pour l'arbre vide, 1 pour une racine seule, c'est-à-dire le nombre de nœuds sur le plus long chemin. On le dit ici pour que la fonction que vous écrirez réponde à l'énoncé, et pour que vous sachiez traduire si un autre cours annonce 0.

```
/ (Racine)
├── home
│   ├── user (Nœud interne)
│   │   ├── documents
│   │   └── images (Feuille)
└── var
    └── log (Feuille)
```

`images` et `log` sont des feuilles. `user` est interne : il a des enfants. `/` est la racine. La taille compte tout le monde, pas seulement les fichiers.

## Au plus deux enfants

Un **arbre binaire** est un arbre dont chaque nœud a **au plus deux** enfants, distingués : un sous-arbre **gauche** et un sous-arbre **droit**. Un enfant unique n'est pas « un enfant » : il est à gauche ou à droite, et l'autre côté vaut `None`. L'ordre des côtés fait partie de la structure. L'échange des deux enfants produit un autre arbre.

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

`gauche` et `droit` sont eux-mêmes des nœuds, ou `None` si le côté est vide. Un arbre, dans ce codage, c'est simplement une référence vers sa racine. L'arbre vide, c'est `None`.

<TreeVisualizer />

## Visiter tous les nœuds

Un **parcours en profondeur** suit une branche jusqu'à la feuille, puis remonte pour prendre la branche voisine. On le programme naturellement par récursivité : traiter un nœud, c'est s'occuper de ses sous-arbres. Selon le moment où l'on traite la racine du sous-arbre, on obtient trois ordres.

Le parcours **préfixe** traite la racine, puis le gauche, puis le droit. Il sert à recopier un arbre : on connaît le parent avant les enfants.

Le parcours **infixe** traite le gauche, puis la racine, puis le droit. Sur un arbre binaire de recherche, cet ordre donne les valeurs triées. C'est le parcours que l'on ressortira au chapitre suivant.

Le parcours **postfixe** traite le gauche, le droit, puis la racine. On supprime un arbre dans cet ordre, enfants avant le parent, sinon on perdrait les liens. On évalue aussi ainsi une expression écrite en notation postfixée, comme `3 4 +` : les opérandes d'abord, l'opérateur quand ses deux résultats sont prêts.

Un **parcours en largeur** visite niveau par niveau : la racine, puis ses enfants, puis les petits-enfants. La récursion ne donne pas cet ordre toute seule. On utilise une **file**. On enfile la racine. Tant que la file n'est pas vide, on défile un nœud, on le traite, et l'on enfile ses enfants. La file garantit qu'un niveau entier est vu avant le niveau d'en dessous.

<ExerciseTabs courseId="terminale_arbres" courseTitle="Exercices Arbres">

  <ExerciseSection id="arbre-ex-1" label="Taille et Hauteur" type="python">
    <Enonce>
    ### Calculer la Taille et la Hauteur
    Écrivez deux fonctions récursives :
    1.  `taille(arbre)` : Renvoie le nombre de nœuds.
    2.  `hauteur(arbre)` : Renvoie la hauteur (0 pour un arbre vide, 1 pour racine seule, etc.).
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="arbre-ex-2" label="Parcours Infixe" type="python">
    <Enonce>
    ### Affichage Infixe
    Écrivez une fonction récursive `afficher_infixe(noeud)` qui affiche les valeurs de l'arbre dans l'ordre infixe (Gauche - Racine - Droite).
    
    Testez avec l'arbre :
    ```
          10
         /  \
        5    15
    ```
    Cela devrait afficher : `5 10 15`
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
