---
title: Fonctions en Python
description: >-
  Apprendre à modulariser et réutiliser son code pour créer des programmes plus
  clairs et efficaces.
level: premiere
chapter: Introduction à Python
icon: "\U0001F40D"
prerequisites:
  - python_types_base
---

## 🎯 Définitions

Une fonction est un bloc de code réutilisable qui effectue une tâche spécifique. Elle permet de **modulariser** le code et d'éviter les répétitions inutiles.

* ⚙️ **Fonction** : Bloc de code réutilisable effectuant une tâche précise, pouvant recevoir des données et retourner un résultat.
* 📥 **Paramètre** : Variable d'entrée permettant à la fonction de recevoir des données pour son fonctionnement.
* 📤 **Valeur de Retour** : Résultat que la fonction renvoie à l'utilisateur après avoir effectué ses traitements.

### 📋 Structure d'une Fonction

```python
def nom_de_fonction(variable_1: type, variable_2: type) -> type_renvoi:
    """
    Documentation de la fonction (Docstring) :
    - Explications du rôle de la fonction
    - Description des paramètres et du retour
    """
    # Corps de la fonction
    resultat = # calculs ou traitements
    return resultat 

```

> ⚠️ **Attention :** Une fonction sans instruction `return` renvoie la valeur `None` par défaut.

---

## 🌍 Variables Locales et Globales

En Python, la **portée** d'une variable détermine la zone du programme où elle est accessible.

* 🏠 **Variable Locale** : Définie **à l'intérieur** d'une fonction, elle n'est accessible que dans celle-ci.
* 🌐 **Variable Globale** : Définie **en dehors** de toute fonction, elle est accessible partout dans le programme.

### 🔧 Modification avec `global`

Pour modifier une variable globale depuis l'intérieur d'une fonction, il est obligatoire d'utiliser le mot-clé `global`.

```python
compteur = 0  # Variable globale

def incrementer():
    global compteur  # Autorise la modification de la variable globale
    compteur += 1

```

---

## 💡 Bonnes Pratiques

Pour écrire du code professionnel et maintenable, suivez ces règles :

* 📝 **Documentation** : Utilisez systématiquement des **docstrings** (triples guillemets) pour expliquer le rôle de vos fonctions.
* 🏷️ **Noms Explicites** : Choisissez des noms décrivant clairement l'action réalisée (ex: `calculer_moyenne` plutôt que `calc`).
* 🎯 **Spécialisation** : Une fonction doit être courte et n'accomplir qu'**une seule tâche** à la fois.

### Exemple de fonction bien structurée

```python
def calculer_aire_rectangle(longueur: float, largeur: float) -> float:
    """
    Calcule l'aire d'un rectangle à partir de sa longueur et largeur.
    """
    return longueur * largeur

```

> 🚀 **Conseil :** Une fonction bien écrite est beaucoup plus facile à tester et à réutiliser dans d'autres projets !
