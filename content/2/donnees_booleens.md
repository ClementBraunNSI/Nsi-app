---
title: Booléens et Fonctions booléennes
description: L'algèbre de George Boole et la logique binaire
level: premiere
chapter: Représentation des données
icon: "\U0001F4A1"
badgeId: premiere_booleens
prerequisites: []
---


# 🔢 Booléens et Fonctions booléennes

## 🎯 Définitions Fondamentales

**Variable booléenne :** Une variable qui peut prendre **deux états** : **Vrai ou Faux**. Ces états peuvent être équivalents à des valeurs numériques : Vrai = 1 et Faux = 0.

**Fonction booléenne :** Une fonction qui prend en paramètre **des variables booléennes** et en ressort un résultat.

**Équation booléenne :** Un ensemble de fonctions booléenne prenant en paramètre un certain nombre de variables et renvoie un résultat en sortie.

!!! info "En machine"
    Ces états correspondent **à la présence du courant ou non**.

## 🔧 Fonctions booléennes

### 📚 Concept des Tables de Vérité

Il existe un certain nombre d'opérations booléennes. Ces fonctions donnent un résultat fini dépendant de l'état des variables en paramètre. On appelle cet ensemble de couples états/résultat **une table de vérité**.

### Fonction NOT (NON)

La fonction NOT prend en paramètre une variable booléenne et renvoie son opposé.

| a | s |
|:-:|:-:|
| 0 | 1 |
| 1 | 0 |

### Fonction AND (ET)

La fonction AND prend en paramètre deux variables booléennes et renvoie en sortie si les deux variables sont à l'état 1. L'opérateur est $\times$ ou $\cdot$.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

### Fonction OR (OU)

La fonction OR prend en paramètre deux variables et renvoie 1 si l'une ou les deux variables booléennes sont à l'état 1. L'opérateur est $+$.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

### Fonction XOR (OU Exclusif)

La fonction XOR correspond à une fonction booléenne OR mais qui renvoie 1 uniquement si un des deux paramètre est à l'état 1.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## 🧮 Équations booléennes

### 📖 L'Algèbre de George Boole

Une équation booléenne est un ensemble de fonctions booléennes. Ces fonctions répondent à l'algèbre booléenne créée par **George Boole** à la fin du XIXème siècle.

!!! tip "Priorités opératoires"
    Les équations booléennes se lisent de gauche à droite et dépendent des priorités opératoires PEMDAS comme en mathématiques.

### 🔍 Exemple d'Évaluation

**Équation :** $S = (a + b) \times c$ se lit "a ou b et c".

**Avec :** a = 1, b = 0 et c = 0

**Évaluation :**

1. On évalue d'abord l'opération OU : $(1+0) = 1$
2. Puis l'opération ET : $1 \times 0 = 0$
3. **Résultat :** $S = 0$

## 🐍 Implémentation en Python

### 💻 Opérateurs Python

Sur Python, on peut évaluer des équations booléennes avec des opérateurs transparents et des valeurs **True** (Vrai) et **False** (Faux).

- **or** : Fonction OU (Équivalent de +)
- **and** : Fonction ET (Équivalent de ×)
- **not** : Fonction NON (Négation logique)

### 💻 Exemple Pratique en Python

```python
a = True
b = False
c = False

# Évaluation de l'équation S = (a or b) and c
S = (a or b) and c
print(f"Résultat : {S}")  # Affiche : False

# Détail de l'évaluation
print(f"a or b = {a or b}")     # True
print(f"(a or b) and c = {S}")  # False
```

!!! success "Correspondance"
    True = 1 (Vrai) et False = 0 (Faux) - Python gère automatiquement la conversion entre les valeurs booléennes et numériques.
