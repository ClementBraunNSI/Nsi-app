---
title: "Introduction POO"
description: "Découverte de la Programmation Orientée Objet (POO) en Python. Classes, Objets, Attributs et Méthodes."
level: premiere
chapter: "Programmation Orientée Objet"
icon: "📦"
badgeId: "premiere_introduction_poo"
---


# Introduction à la Programmation Orientée Objet (POO)

## 1. Qu'est-ce que la POO ?

La **Programmation Orientée Objet (POO)** est un paradigme de programmation (une manière de penser et de structurer le code).

Au lieu de penser uniquement en termes de fonctions et de procédures (programmation impérative/procédurale), on pense en termes d'**objets**.

!!! info "Définition : Objet"
    Un **objet** est une entité qui regroupe :
    
    *   Des **attributs** (données/variables) qui le caractérisent.
    *   Des **méthodes** (fonctions/actions) qu'il peut effectuer.

## 2. Les Classes : Le "Moule" des Objets

Pour créer des objets, on définit d'abord une **classe**.
Une classe est un plan, un modèle ou un "moule" qui définit la structure et le comportement des futurs objets.

### Exemple : La classe `Voiture`

Imaginons que nous voulons représenter des voitures.

```python
class Voiture:
    # Le constructeur (__init__) est appelé à la création de l'objet
    def __init__(self, immatriculation, marque, modele, annee, couleur):
        # Initialisation des attributs
        self.immatriculation = immatriculation
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.couleur = couleur
        self.est_demarre = False # Attribut avec valeur par défaut
    
    # Méthode spéciale pour l'affichage (print)
    def __str__(self):
        return f"Voiture {self.immatriculation} : {self.marque} {self.modele}"

    # Une méthode (action) pour démarrer
    def demarrer(self):
        self.est_demarre = True
        print(f"La voiture {self.immatriculation} démarre.")

    # Une méthode pour arrêter
    def arreter(self):
        self.est_demarre = False
        print(f"La voiture {self.immatriculation} s'arrête.")
```

!!! abstract "Vocabulaire essentiel"
    *   **`class Voiture:`** : Définit la classe. Par convention, le nom commence par une majuscule.
    *   **`__init__`** : Le **constructeur**. Méthode spéciale exécutée automatiquement à la création d'une instance.
    *   **`self`** : Représente l'objet lui-même (l'instance courante) à l'intérieur de la classe. Il permet d'accéder aux attributs et méthodes de l'objet.
    *   **`self.attribut = valeur`** : Définit un attribut pour l'objet.

## 3. Créer et Utiliser des Objets (Instanciation)

Une fois la classe définie, on peut créer des objets concrets. On appelle cela l'**instanciation**.

```python
# 1. Création d'objets (Instances)
ma_clio = Voiture("AB-123-CD", "Renault", "Clio", 2020, "Bleu")
ta_peugeot = Voiture("XY-999-ZZ", "Peugeot", "208", 2022, "Rouge")

# 2. Accès aux attributs
print(ma_clio.couleur)      # Affiche : Bleu
print(ta_peugeot.annee)     # Affiche : 2022

# 3. Appel des méthodes
ma_clio.demarrer()          # Affiche : La voiture AB-123-CD démarre.
print(ma_clio.est_demarre)  # Affiche : True

ta_peugeot.arreter()        # Affiche : La voiture XY-999-ZZ s'arrête.
```

## 4. Pourquoi utiliser la POO ?

| Avantage | Description |
| :--- | :--- |
| **Organisation** | Regroupe logiquement les données et les traitements liés. |
| **Réutilisabilité** | Une classe peut être utilisée pour créer une infinité d'objets. |
| **Modularité** | Chaque objet est indépendant. On peut modifier le fonctionnement interne d'une classe sans casser tout le programme. |
| **Abstraction** | On utilise des objets complexes (comme `voiture.demarrer()`) sans avoir besoin de connaître tous les détails mécaniques internes. |
