---
title: Arbres et Arbres Binaires
description: 'Structures hiérarchiques, vocabulaire et algorithmes de base.'
level: terminale
chapter: Structures de données
icon: "\U0001F333"
badgeId: terminale_arbres
prerequisites: []
---

# 🌳 Structures d'Arbres

Contrairement aux listes qui sont linéaires, les **arbres** sont des structures de données **hiérarchiques**. Ils sont fondamentaux en informatique (systèmes de fichiers, DOM HTML, analyse syntaxique, etc.).

## 1. Définitions et Vocabulaire

Un arbre est composé de **nœuds** reliés par des arêtes.

*   **Racine** : Le nœud unique tout en haut (sans parent).
*   **Feuille** : Un nœud qui n'a pas d'enfants.
*   **Nœud interne** : Un nœud qui a au moins un enfant.
*   **Taille** : Le nombre total de nœuds.
*   **Hauteur** (ou Profondeur max) : Le nombre d'arêtes sur le plus long chemin de la racine à une feuille. (Par convention, racine seule = hauteur 0 ou 1 selon les définitions, souvent 0 en NSI).

### Exemple (Système de fichiers)
```
/ (Racine)
├── home
│   ├── user (Nœud interne)
│   │   ├── documents
│   │   └── images (Feuille)
└── var
    └── log (Feuille)
```

## 2. Arbres Binaires

Un **Arbre Binaire** est un cas particulier très important où **chaque nœud possède au maximum 2 enfants** :
1.  Un enfant (ou sous-arbre) **gauche**.
2.  Un enfant (ou sous-arbre) **droit**.

### Implémentation en Python

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

<TreeVisualizer />

## 3. Algorithmes de Parcours

Comment visiter tous les nœuds d'un arbre ? Il existe plusieurs méthodes.

### 3.1 Parcours en Profondeur (DFS)
On explore une branche jusqu'au bout avant de revenir en arrière.
Il y a 3 variantes selon l'ordre de visite de la racine :

1.  **Préfixe** (Racine -> Gauche -> Droite)
    *   Utile pour copier un arbre.
2.  **Infixe** (Gauche -> Racine -> Droite)
    *   **TRÈS IMPORTANT** : Sur un Arbre Binaire de Recherche (ABR), ce parcours donne les valeurs triées !
3.  **Postfixe** (Gauche -> Droite -> Racine)
    *   Utile pour supprimer un arbre (on supprime les enfants avant le parent) ou évaluer des expressions mathématiques (`3 4 +`).

### 3.2 Parcours en Largeur (BFS)
On visite niveau par niveau (d'abord la racine, puis ses enfants, puis les petits-enfants...).
*   Nécessite une **File** (Queue) pour mémoriser les nœuds à visiter.

---

<ExerciseTabs courseId="terminale_arbres" courseTitle="Exercices Arbres">

  <ExerciseSection id="arbre-ex-1" label="Taille et Hauteur">
    <Enonce>
    ### Calculer la Taille et la Hauteur
    Écrivez deux fonctions récursives :
    1.  `taille(arbre)` : Renvoie le nombre de nœuds.
    2.  `hauteur(arbre)` : Renvoie la hauteur (0 pour un arbre vide, 1 pour racine seule, etc.).
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="arbre-ex-2" label="Parcours Infixe">
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
