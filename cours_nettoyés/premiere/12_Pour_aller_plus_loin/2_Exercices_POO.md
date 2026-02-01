---
title: Exercices POO
description: Exercices pratiques sur la POO. Création de classes, méthodes, héritage et encapsultation.
level: Première
chapter: 12
icon: material/pencil-ruler
---

# Exercices POO

## TP Guidé : Concessionnaire Automobile

### Partie 1 : La Classe `Voiture`

Nous reprenons la classe `Voiture` du cours.

```python
class Voiture:
    def __init__(self, immatriculation, marque, modele, annee, couleur):
        self.immatriculation = immatriculation
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.couleur = couleur
        self.est_demarre = False

    def __str__(self):
        # TODO 1: Afficher aussi si la voiture est démarrée
        return f"Voiture {self.immatriculation} : {self.marque} {self.modele}"

    def demarrer(self):
        if not self.est_demarre:
            self.est_demarre = True
            print(f"Vroum ! {self.immatriculation} démarre.")
        else:
            print("Déjà démarrée !")

    def arreter(self):
        self.est_demarre = False
        print("Moteur coupé.")
    
    # TODO 2: Ajouter la méthode repeindre(self, nouvelle_couleur)
```

!!! question "À faire"
    1.  **Méthode `__str__`** : Modifiez-la pour qu'elle indique si la voiture est (Démarrée) ou (Arrêtée).
    2.  **Méthode `repeindre`** : Créez une méthode qui change l'attribut `couleur` et affiche un message "La voiture passe de [ancienne] à [nouvelle]".
    3.  **Tests** : Créez 2 voitures, testez le démarrage, l'arrêt et la peinture.

### Partie 2 : La Classe `Concessionnaire`

Une classe pour gérer un stock de voitures.

```python
class Concessionnaire:
    def __init__(self, nom):
        self.nom = nom
        self.stock = [] # Liste vide pour stocker les objets Voiture

    def ajouter_voiture(self, voiture):
        # TODO 3
        pass

    def afficher_stock(self):
        # TODO 4
        pass
    
    def vendre_voiture(self, immatriculation):
        # TODO 5
        pass
```

!!! question "À faire"
    1.  **`ajouter_voiture(self, voiture)`** : Ajoute l'objet `voiture` à la liste `self.stock`.
    2.  **`afficher_stock(self)`** : Affiche toutes les voitures du stock (utilise leur `__str__`).
    3.  **`vendre_voiture(self, immatriculation)`** : Cherche la voiture dans la liste, la retire si trouvée et la renvoie. Sinon affiche "Non trouvée".

---

## Exercices d'application (Niveau Facile)

!!! question "Exercice 1 : Compte Bancaire"
    Écrire une classe `CompteBancaire` avec :
    
    *   Attributs : `titulaire` (str), `solde` (float).
    *   Méthodes : `deposer(montant)`, `retirer(montant)`, `afficher_solde()`.

??? success "Correction"
    ```python
    class CompteBancaire:
        def __init__(self, titulaire, solde_initial=0):
            self.titulaire = titulaire
            self.solde = solde_initial
        
        def deposer(self, montant):
            self.solde += montant
            print(f"{montant}€ déposés. Nouveau solde : {self.solde}€")
            
        def retirer(self, montant):
            if self.solde >= montant:
                self.solde -= montant
                print(f"{montant}€ retirés. Nouveau solde : {self.solde}€")
            else:
                print("Solde insuffisant !")
                
        def afficher_solde(self):
            print(f"Compte de {self.titulaire} : {self.solde}€")
    ```

!!! question "Exercice 2 : Rectangle"
    Écrire une classe `Rectangle` avec :
    
    *   Attributs : `longueur`, `largeur`.
    *   Méthodes : `aire()`, `perimetre()`, `est_carre()`.

---

## Exercices d'application (Niveau Intermédiaire)

!!! question "Exercice 3 : Héritage (Animal)"
    1.  Créer une classe `Animal` avec `nom` et une méthode `parler()` qui affiche "Je suis un animal".
    2.  Créer une classe `Chien` qui hérite d'`Animal` et redéfinit `parler()` pour afficher "Wouf !".
    3.  Créer une classe `Chat` qui hérite d'`Animal` et redéfinit `parler()` pour afficher "Miaou !".

??? success "Correction"
    ```python
    class Animal:
        def __init__(self, nom):
            self.nom = nom
            
        def parler(self):
            print("Je suis un animal.")

    class Chien(Animal):
        def parler(self):
            print(f"{self.nom} fait Wouf !")

    class Chat(Animal):
        def parler(self):
            print(f"{self.nom} fait Miaou !")
            
    rex = Chien("Rex")
    rex.parler() # Affiche : Rex fait Wouf !
    ```
