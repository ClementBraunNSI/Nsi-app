---
title: "Arbres binaires de recherche et Algorithmes"
description: "Révision ABR, implémentations et complexité"
level: TNSI
order: 170
chapter: "Structures de données"
icon: "tree-deciduous"
badgeId: terminale_abr
prerequisites:
  - structures_arbres
audience: public
---

# Arbres binaires de recherche

Dans un arbre binaire, chaque nœud a un sous-arbre gauche et un sous-arbre droit. Un **arbre binaire de recherche** ajoute une règle sur les valeurs. Pour tout nœud, les valeurs du sous-arbre gauche sont **strictement inférieures** à la sienne, et les valeurs du sous-arbre droit sont **supérieures ou égales**. Les doublons, dans cette convention, partent à droite. Cette règle s'applique à chaque nœud, et pas seulement à la racine.

On utilise le vocabulaire des arbres. Un **nœud** porte une clé, la **racine** est le nœud sans parent et une **feuille** est un nœud sans enfant. La **taille** est le nombre de nœuds. La **hauteur** est ici le nombre d'**arêtes** du plus long chemin entre la racine et une feuille : une racine seule a donc une hauteur de 0. Attention, ce n'est pas la convention de la page précédente, dont l'exercice comptait 1 pour une racine seule. Cette convention est conservée dans la suite pour les calculs de complexité.

Grâce à cette règle, le parcours infixe d'un ABR donne les valeurs triées : en visitant le sous-arbre gauche, puis le nœud, puis le sous-arbre droit, les valeurs plus petites sortent avant et les valeurs plus grandes ou égales après. Si les valeurs affichées dans cet ordre ne sont pas croissantes, l'arbre n'est pas un ABR, même s'il semble bien construit.

<TreeVisualizer />

## Recherche, insertion et complexité

Pour chercher une clé, on la compare à la racine. Si elle est plus petite, on descend à gauche, et si elle est plus grande ou égale, on descend à droite. On s'arrête quand on trouve la clé, ou quand le lien vaut `None`. L'autre côté n'est jamais exploré : chaque comparaison élimine donc un sous-arbre entier.

L'insertion suit le même chemin : on descend jusqu'à un lien vide, et on y accroche un nouveau nœud, sans rien réorganiser. C'est pourquoi l'ordre d'arrivée des clés change la forme de l'arbre. Insérer 5, puis 3, puis 8 donne une racine 5 avec 3 à gauche et 8 à droite. En revanche, insérer des valeurs déjà triées, comme 1, 2, 3 puis 4, fait toujours descendre à droite : l'arbre dégénère alors en liste chaînée.

Dans un ABR **équilibré**, la hauteur est de l'ordre de $\log_2 n$. Recherche, insertion et suppression coûtent alors $O(\log_2 n)$ , car le nombre de comparaisons est proportionnel à la hauteur. Dans le pire des cas, quand l'arbre a la forme d'une liste, la hauteur vaut $n - 1$ et le coût redevient $O(n)$, comme pour un parcours de liste. Les techniques d'équilibrage (arbres AVL, arbres rouge-noir) réorganisent l'arbre après les insertions pour que sa hauteur reste logarithmique. Leur code n'est pas au programme, mais il faut comprendre leur utilité : sans équilibrage, le coût logarithmique dépend de l'ordre d'arrivée des données.

Le minimum est le nœud que l'on atteint en descendant toujours à gauche, et le maximum s'obtient de la même façon, en descendant toujours à droite. Leur recherche dépend aussi de la hauteur, et non de la taille, puisqu'on suit un seul chemin.

La suppression dépend du nœud visé. Une feuille est simplement retirée, et un nœud qui n'a qu'un enfant est remplacé par cet enfant. Un nœud qui a deux enfants est remplacé par son **prédécesseur infixe**, c'est-à-dire le plus grand nœud de son sous-arbre gauche, qui a au plus un enfant et que l'on sait donc retirer. Après la suppression, la règle de l'ABR doit toujours être respectée. Pour le vérifier, il suffit de faire un parcours infixe : si les valeurs ne sont pas croissantes, la suppression a rompu la propriété de l'ABR.

## Exercice 1 : Construction et propriétés

### Question 1 : Dessiner l'arbre

**Construire l'ABR obtenu par insertion successive des valeurs suivantes :**

`[50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]`

**Dessiner l'arbre final et indiquer pour chaque nœud :**
- Sa profondeur (niveau dans l'arbre, la racine étant niveau 0)
- Si c'est une feuille ou non

### Question 2 : Parcours

**Donner l'ordre de visite des nœuds pour les parcours suivants :**
- **Parcours préfixe** (racine, gauche, droite)
- **Parcours infixe** (gauche, racine, droite)
- **Parcours postfixe** (gauche, droite, racine)

### Question 3 : Recherche

**Rechercher la valeur 35 dans l'arbre construit. Détailler le chemin parcouru.**

**Quelle est la complexité de cette recherche dans le meilleur et le pire des cas ?**

## Exercice 2 : Implémentation Python

### Classe Noeud

**Implémenter une classe `Noeud` représentant un nœud d'ABR avec :**
- Un attribut `valeur`
- Un attribut `gauche` (initialisé à None)
- Un attribut `droit` (initialisé à None)

```python
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droit = None
```

### Classe ABR

**Implémenter une classe `ABR` avec les méthodes suivantes :**

#### Insertion
```python
def inserer(self, valeur):
    """Insère une valeur dans l'ABR"""
    # À implémenter
    pass
```

#### Recherche
```python
def rechercher(self, valeur):
    """Recherche une valeur dans l'ABR, retourne True si trouvée"""
    # À implémenter
    pass
```

#### Parcours infixe
```python
def parcours_infixe(self):
    """Retourne la liste des valeurs dans l'ordre croissant"""
    # À implémenter
    pass
```

#### Calcul de la hauteur
```python
def hauteur(self):
    """Calcule la hauteur de l'arbre"""
    # À implémenter
    pass
```

## Exercice 3 : Applications avancées

### Trouver le minimum et le maximum

**Implémenter deux méthodes pour trouver :**
- La valeur minimale dans l'ABR
- La valeur maximale dans l'ABR

**Quelle est la complexité de ces opérations ?**

### Suppression d'un nœud

**Implémenter la méthode de suppression d'un nœud en tenant compte des 3 cas :**
1. Le nœud est une feuille
2. Le nœud a un seul enfant
3. Le nœud a deux enfants

**Pour le cas 3, utiliser la méthode du prédécesseur infixe.**

### Validation d'ABR

**Écrire une fonction qui vérifie qu'un arbre binaire donné est bien un ABR.**

**Indice :** Utiliser un parcours infixe et vérifier que les valeurs sont dans l'ordre croissant.

## Exercice 4 : Complexité et optimisation

### Cas dégénéré

**Donner un exemple de séquence d'insertions qui produit un ABR dégénéré (en liste chaînée).**

**Quelle est la hauteur de cet arbre ? Quelle est sa complexité pour les opérations ?**

### Arbres équilibrés

**Expliquer pourquoi l'équilibrage est important pour maintenir de bonnes performances.**

**Nommer deux types d'arbres équilibrés et leurs caractéristiques principales.**

## Pour aller plus loin

### Parcours par niveau

**Implémenter un parcours en largeur (BFS) pour visiter tous les nœuds niveau par niveau.**

### Conversion en liste chaînée

**Écrire une fonction qui "aplatit" un ABR en une liste chaînée triée en utilisant uniquement les pointeurs existants.**

### Arbre miroir

**Créer une fonction qui génère l'arbre miroir d'un ABR donné (gauche et droite inversés).**

!!! success "Conseils"
    - Commencer par dessiner les arbres pour visualiser les opérations
    - Tester le code avec des exemples simples
    - Vérifier que les propriétés d'ABR sont maintenues après chaque opération
    - Utiliser le parcours infixe pour vérifier l'ordre des éléments
