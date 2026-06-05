---
title: Types de données en Python
subtitle: Les types fondamentaux pour structurer vos données
level: premiere
chapter: Introduction à Python
icon: "\U0001F522"
badgeId: premiere_types_base
prerequisites:
  - python_constructions_elementaires
---

## 🔘 Les Booléens

Le type booléen représente des valeurs de vérité avec seulement deux états possibles : **True** (vrai) et **False** (faux). Essentiel pour les conditions et le contrôle de flux.

### Valeurs de base

- ✅ **True** : Valeur vraie. Utilisée quand une condition est satisfaite.
- ❌ **False** : Valeur fausse. Utilisée quand une condition n'est pas satisfaite.

```python
est_jeune = True
a_termine_cours = False
```

### Opérateurs Logiques

* **and** : Retourne `True` seulement si les deux conditions sont vraies.
* **or** : Retourne `True` si au moins une des conditions est vraie.
* **not** : Inverse la valeur booléenne.

## 🔢 Les Nombres

Python propose deux types principaux pour représenter les nombres :

| Type | Nom | Description |
| --- | --- | --- |
| `int` | Entiers | Nombres sans virgule (positifs ou négatifs). |
| `float` | Flottants | Nombres décimaux (ex: 3.14). |

> ⚠️ **Attention :** Utilisez le **point (.)** et non la virgule pour les décimales. Les flottants peuvent parfois générer de légères erreurs d'arrondi dues à la norme IEEE754.

## 📝 Caractères et Chaînes (str)

En Python, les lettres et les textes utilisent le même type : `str`.

* **Indexation** : On accède aux caractères en commençant par l'index **0**.
* **Concaténation** : On assemble des chaînes avec l'opérateur `+`.

```python
nom = "Alice"
premiere_lettre = nom[0]   # 'A'
derniere_lettre = nom[-1]  # 'e'
```

Pour aller plus loin sur la modularité du code, consultez le cours [Fonctions en Python](/cours/2/python_fonctions).
