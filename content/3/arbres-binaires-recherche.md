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

Un arbre binaire range des nœuds avec un gauche et un droit. Un **arbre binaire de recherche** ajoute une règle sur les valeurs. Pour tout nœud, les valeurs du sous-arbre gauche sont **strictement inférieures** à la sienne, et les valeurs du sous-arbre droit sont **supérieures ou égales**. Les doublons, dans cette convention, partent à droite. La règle vaut pour chaque nœud, pas seulement pour la racine : un petit-enfant à gauche reste inférieur à tous ses ancêtres sur le chemin.

Le vocabulaire est celui des arbres. Un **nœud** porte une clé. La **racine** est le nœud sans parent. Une **feuille** n'a pas d'enfant. La **taille** compte les nœuds. La **hauteur**, ici, est le nombre d'**arêtes** du plus long chemin de la racine à une feuille : une racine seule a donc une hauteur 0. Ce n'est pas le décompte de la page précédente, où l'exercice comptait 1 pour une racine seule. On le fixe maintenant, et on s'y tient pour les complexités.

Cette règle rend le parcours infixe trié. Gauche, puis nœud, puis droit : tout ce qui est plus petit sort avant, tout ce qui est plus grand ou égal sort après. Si l'on affiche un arbre dans cet ordre et que les valeurs ne croissent pas, ce n'est pas un ABR, même si « ça ressemble » à un arbre bien dessiné.

<TreeVisualizer />

## Chercher, insérer, et ce que ça coûte

Pour chercher une clé, on la compare à la racine. Plus petite : on descend à gauche. Plus grande ou égale : on descend à droite. On s'arrête quand on trouve la clé, ou quand le lien vaut `None`. On n'explore pas l'autre côté. Chaque comparaison élimine un sous-arbre entier.

L'insertion suit le même chemin. On descend jusqu'à un lien vide, et l'on y accroche un nouveau nœud. On ne réorganise rien. C'est pour cela que l'ordre d'arrivée des clés change la forme de l'arbre. Insérer 5, puis 3, puis 8 donne une racine 5 avec 3 à gauche et 8 à droite. Insérer déjà trié, 1 puis 2 puis 3 puis 4, descend toujours à droite : l'arbre dégénère en liste chaînée.

Dans un ABR **équilibré**, la hauteur est de l'ordre de $\log_2 n$. Recherche, insertion et suppression coûtent alors $O(\log_2 n)$ : un nombre de comparaisons proportionnel à la hauteur. Dans le pire des cas, l'arbre-liste, la hauteur vaut $n - 1$ et le coût redevient $O(n)$, comme un parcours de liste. L'équilibrage (arbres AVL, arbres rouge-noir) réorganise après les insertions pour que la hauteur reste logarithmique. On n'en écrit pas le code ici. On retient pourquoi il existe : sans lui, le coût annoncé n'est qu'un espoir sur l'ordre des données.

Le minimum est le nœud qu'on atteint en descendant toujours à gauche. Le maximum s'obtient de la même façon, en descendant toujours à droite. Leur recherche coûte aussi la hauteur, pas la taille : on suit un seul chemin.

Supprimer dépend du nœud visé. Une feuille se décroche. Un nœud avec un seul enfant se fait remplacer par cet enfant. Un nœud avec deux enfants se fait remplacer par son **prédécesseur infixe**, le plus grand nœud de son sous-arbre gauche, qui a au plus un enfant, et que l'on sait donc retirer. La règle gauche-inférieur, droit-supérieur doit rester vraie après coup. Le parcours infixe croissant est le test : s'il décroît quelque part, la suppression a cassé l'ABR.

## Exercice 1 : Construction et propriétés

### Question 1 : Dessiner l'arbre

**Construisez l'ABR obtenu par insertion successive des valeurs suivantes :**

`[50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]`

**Dessinez l'arbre final et indiquez pour chaque nœud :**
- Sa profondeur (niveau dans l'arbre, la racine étant niveau 0)
- Si c'est une feuille ou non

### Question 2 : Parcours

**Donnez l'ordre de visite des nœuds pour les parcours suivants :**
- **Parcours préfixe** (racine, gauche, droite)
- **Parcours infixe** (gauche, racine, droite)
- **Parcours postfixe** (gauche, droite, racine)

### Question 3 : Recherche

**Recherchez la valeur 35 dans l'arbre construit. Détaillez le chemin parcouru.**

**Quelle est la complexité de cette recherche dans le meilleur et le pire des cas ?**

## Exercice 2 : Implémentation Python

### Classe Noeud

**Implémentez une classe `Noeud` représentant un nœud d'ABR avec :**
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

**Implémentez une classe `ABR` avec les méthodes suivantes :**

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

**Implémentez deux méthodes pour trouver :**
- La valeur minimale dans l'ABR
- La valeur maximale dans l'ABR

**Quelle est la complexité de ces opérations ?**

### Suppression d'un nœud

**Implémentez la méthode de suppression d'un nœud en tenant compte des 3 cas :**
1. Le nœud est une feuille
2. Le nœud a un seul enfant
3. Le nœud a deux enfants

**Pour le cas 3, utilisez la méthode du prédécesseur infixe.**

### Validation d'ABR

**Écrivez une fonction qui vérifie qu'un arbre binaire donné est bien un ABR.**

**Indice :** Utilisez un parcours infixe et vérifiez que les valeurs sont dans l'ordre croissant.

## Exercice 4 : Complexité et optimisation

### Cas dégénéré

**Donnez un exemple de séquence d'insertions qui produit un ABR dégénéré (en liste chaînée).**

**Quelle est la hauteur de cet arbre ? Quelle est sa complexité pour les opérations ?**

### Arbres équilibrés

**Expliquez pourquoi l'équilibrage est important pour maintenir de bonnes performances.**

**Nommez deux types d'arbres équilibrés et leurs caractéristiques principales.**

## Pour aller plus loin

### Parcours par niveau

**Implémentez un parcours en largeur (BFS) pour visiter tous les nœuds niveau par niveau.**

### Conversion en liste chaînée

**Écrivez une fonction qui "aplatit" un ABR en une liste chaînée triée en utilisant uniquement les pointeurs existants.**

### Arbre miroir

**Créez une fonction qui génère l'arbre miroir d'un ABR donné (gauche et droite inversés).**

!!! success "Conseils"
    - Commencez par dessiner les arbres pour visualiser les opérations
    - Testez votre code avec des exemples simples
    - Vérifiez que les propriétés d'ABR sont maintenues après chaque opération
    - Utilisez le parcours infixe pour vérifier l'ordre des éléments
