---
title: "Arbres binaires de recherche et Algorithmes"
description: "Révision ABR, implémentations et complexité"
level: TNSI
order: 170
chapter: "Structures de données"
icon: "🌳"
badgeId: terminale_abr
prerequisites:
  - structures_arbres
---

# 🌳 Arbres binaires de recherche et Algorithmes

## Révision ABR, implémentations et complexité

## 1. Rappels théoriques

### 1.1 Définitions

**Un arbre binaire de recherche (ABR) est un arbre binaire qui respecte la propriété suivante :**

- Pour tout nœud, toutes les valeurs du sous-arbre gauche sont strictement inférieures à la valeur du nœud
- Pour tout nœud, toutes les valeurs du sous-arbre droit sont supérieures ou égales à la valeur du nœud

**Vocabulaire important :**

- **Nœud** : élément de l'arbre contenant une valeur (clé)
- **Racine** : nœud au sommet de l'arbre
- **Feuille** : nœud sans enfants
- **Taille** : nombre total de nœuds dans l'arbre
- **Hauteur** : longueur du plus long chemin de la racine à une feuille

### 1.2 Complexité

Dans un ABR équilibré, les opérations de recherche, insertion et suppression ont une complexité en **O(log₂ n)**.

Dans le pire des cas (arbre dégénéré en liste chaînée), la complexité devient **O(n)**.

<TreeVisualizer />

## 2. Exercice 1 : Construction et propriétés

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

## 3. Exercice 2 : Implémentation Python

### 3.1 Classe Noeud

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

### 3.2 Classe ABR

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

## 4. Exercice 3 : Applications avancées

### 4.1 Trouver le minimum et le maximum

**Implémentez deux méthodes pour trouver :**
- La valeur minimale dans l'ABR
- La valeur maximale dans l'ABR

**Quelle est la complexité de ces opérations ?**

### 4.2 Suppression d'un nœud

**Implémentez la méthode de suppression d'un nœud en tenant compte des 3 cas :**
1. Le nœud est une feuille
2. Le nœud a un seul enfant
3. Le nœud a deux enfants

**Pour le cas 3, utilisez la méthode du prédécesseur infixe.**

### 4.3 Validation d'ABR

**Écrivez une fonction qui vérifie qu'un arbre binaire donné est bien un ABR.**

**Indice :** Utilisez un parcours infixe et vérifiez que les valeurs sont dans l'ordre croissant.

## 5. Exercice 4 : Complexité et optimisation

### 5.1 Cas dégénéré

**Donnez un exemple de séquence d'insertions qui produit un ABR dégénéré (en liste chaînée).**

**Quelle est la hauteur de cet arbre ? Quelle est sa complexité pour les opérations ?**

### 5.2 Arbres équilibrés

**Expliquez pourquoi l'équilibrage est important pour maintenir de bonnes performances.**

**Nommez deux types d'arbres équilibrés et leurs caractéristiques principales.**

## 6. Pour aller plus loin

### 6.1 Parcours par niveau

**Implémentez un parcours en largeur (BFS) pour visiter tous les nœuds niveau par niveau.**

### 6.2 Conversion en liste chaînée

**Écrivez une fonction qui "aplatit" un ABR en une liste chaînée triée en utilisant uniquement les pointeurs existants.**

### 6.3 Arbre miroir

**Créez une fonction qui génère l'arbre miroir d'un ABR donné (gauche et droite inversés).**

!!! success "Conseils"
    - Commencez par dessiner les arbres pour visualiser les opérations
    - Testez votre code avec des exemples simples
    - Vérifiez que les propriétés d'ABR sont maintenues après chaque opération
    - Utilisez le parcours infixe pour vérifier l'ordre des éléments