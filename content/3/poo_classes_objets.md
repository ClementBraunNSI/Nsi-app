---
title: 'POO : Classes et Objets'
description: Comprendre et appliquer la Programmation Orientée Objet en Python.
level: terminale
chapter: Structures de données
icon: "\U0001F3D7️"
badgeId: terminale_poo
prerequisites:
  - structures_graphes
---

# 🏗️ Programmation Orientée Objet (POO)

La **Programmation Orientée Objet (POO)** est un paradigme de programmation qui consiste à structurer ses programmes autour d'entités appelées **objets**, qui interagissent entre elles. C'est le standard dans l'industrie (Java, C++, C#, Python, etc.).

## 1. Concepts Fondamentaux

### 1.1 Classe vs Objet
*   **Classe (`class`)** : C'est le **moule** ou le **plan**. Elle définit les caractéristiques communes.
    *   *Exemple* : Le plan de fabrication d'une voiture.
*   **Objet** (ou **Instance**) : C'est une **réalisation concrète** de la classe.
    *   *Exemple* : La voiture rouge de M. Dupont, la voiture bleue de Mme Martin.

### 1.2 Attributs et Méthodes
*   **Attributs** : Ce sont les **variables** liées à l'objet (son état).
    *   *Exemple* : `couleur`, `vitesse`, `marque`.
*   **Méthodes** : Ce sont les **fonctions** liées à l'objet (son comportement).
    *   *Exemple* : `demarrer()`, `freiner()`, `klaxonner()`.

## 2. Syntaxe Python

### 2.1 Définir une classe

On utilise le mot-clé `class`. Par convention, le nom d'une classe commence par une **Majuscule** (PascalCase).

```python
class Voiture:
    # Le constructeur __init__ est appelé à la création de l'objet
    def __init__(self, marque, couleur):
        self.marque = marque      # Attribut
        self.couleur = couleur    # Attribut
        self.vitesse = 0          # Attribut par défaut

    # Une méthode (fonction dans la classe)
    def accelerer(self, gain):
        self.vitesse += gain
        print(f"La {self.marque} accélère à {self.vitesse} km/h.")
```

### 2.2 Créer et utiliser un objet

```python
# Instanciation (Création de l'objet)
ma_voiture = Voiture("Peugeot", "Rouge")

# Accès aux attributs
print(ma_voiture.marque)  # Affiche "Peugeot"

# Appel de méthodes
ma_voiture.accelerer(50)  # Affiche "La Peugeot accélère à 50 km/h."
```

### 2.3 Le mot-clé `self`
*   `self` représente **l'objet lui-même**.
*   Il est **obligatoire** comme premier paramètre de toutes les méthodes d'instance.
*   Il permet de différencier les variables de l'objet (`self.vitesse`) des variables locales de la fonction.

## 3. Encapsulation (Interface et Implémentation)

L'encapsulation est le principe de **cacher les détails internes** d'implémentation et de ne fournir qu'une **interface publique** pour interagir avec l'objet.

En Python, on n'a pas de "privé" strict comme en Java (`private`), mais on utilise une convention :
*   `_attribut` (un underscore) : Signifie "Ne touchez pas à ça directement, c'est interne".

Pour accéder proprement aux attributs protégés, on utilise des **Assesseurs (Getters)** et des **Mutateurs (Setters)**.

```python
class CompteBancaire:
    def __init__(self, solde_initial):
        self._solde = solde_initial  # _solde est "protégé"

    def get_solde(self):
        return self._solde

    def deposer(self, montant):
        if montant > 0:
            self._solde += montant
```

---

<ExerciseTabs courseId="terminale_poo" courseTitle="Exercices POO">

  <ExerciseSection id="poo-ex-1" label="Création de Classe">
    <Enonce>
    ### La Classe `Chien` 🐶
    1.  Créez une classe `Chien` avec les attributs `nom` et `race`.
    2.  Ajoutez une méthode `aboyer()` qui affiche "Wouaf ! Je suis [nom] !".
    3.  Créez un chien nommé "Rex", de race "Berger Allemand", et faites-le aboyer.
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poo-ex-2" label="RPG Simple">
    <Enonce>
    ### Personnage de Jeu ⚔️
    Créez une classe `Personnage` :
    1.  Attributs : `pseudo`, `pv` (points de vie, defaut 100), `force`.
    2.  Méthode `attaquer(self, cible)` : Enlève `self.force` aux PV de la `cible`.
    3.  Méthode `est_vivant(self)` : Renvoie `True` si PV > 0, sinon `False`.

    Simulez un combat entre deux personnages.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
