---
title: Types de données en Python
subtitle: Les types fondamentaux pour structurer vos données
level: '2'
chapter: Introduction à Python
icon: "\U0001F522"
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

---

### 2.Fonctions

---
title: "Fonctions en Python"
subtitle: "Modularité et réutilisabilité du code"
level: "Niveau 2"
icon: "🔢"
---

# 📚 Fonctions en Python
> Apprendre à modulariser et réutiliser son code.

## 🎯 Définition

Une fonction est un bloc de code réutilisable qui effectue une tâche spécifique. Elle permet d'éviter les répétitions et de rendre le code plus lisible.

- ⚙️ **Fonction** : Le bloc de code lui-même.
- 📥 **Paramètre** : La variable d'entrée dont la fonction a besoin.
- 📤 **Valeur de Retour** : Le résultat renvoyé par `return`.

## 📋 Structure d'une Fonction

Voici la syntaxe standard pour définir une fonction propre et documentée :

```python
def nom_de_fonction(variable_1: type, variable_2: type) -> type_renvoi:
    """
    Documentation (Docstring) :
    Explique ici ce que fait la fonction.
    """
    resultat = variable_1 + variable_2
    return resultat

```

## 🌍 Variables Locales et Globales

La **portée** d'une variable définit où elle est accessible :

1. **Variable Locale** : Définie à l'intérieur d'une fonction. Elle "meurt" dès que la fonction s'arrête.
2. **Variable Globale** : Définie à la racine du fichier. Elle est accessible partout.

> 💡 **Astuce :** Pour modifier une variable globale depuis l'intérieur d'une fonction, vous devez utiliser le mot-clé `global`.

## 💡 Bonnes Pratiques

* **Noms clairs** : Utilisez des verbes (ex: `calculer_moyenne` au lieu de `calc`).
* **Une tâche par fonction** : Une fonction ne doit faire qu'une seule chose.
* **Documentez** : Utilisez toujours les triples guillemets `"""` pour expliquer vos paramètres.
