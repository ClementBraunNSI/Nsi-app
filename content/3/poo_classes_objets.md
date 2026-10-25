---
title: 'POO : Classes et Objets'
description: Comprendre et appliquer la Programmation Orientée Objet en Python.
level: TNSI
order: 140
chapter: Structures de données
icon: "construction"
badgeId: terminale_poo
prerequisites:
  - prog_modularite_mise_au_point
audience: public
---

# Classes et objets

La programmation orientée objet organise un programme autour d'**objets** qui se parlent, plutôt qu'autour d'une longue suite de fonctions auxquelles on repasse les mêmes données. C'est le style dominant en Java, en C++, en C# et, pour une grande partie du code, en Python. L'idée n'est pas nouvelle après le cours de Première. On la reprend ici avec le vocabulaire de Terminale, et avec une question de plus : qu'est-ce qu'on a le droit de toucher depuis l'extérieur de l'objet.

Une **classe** est le moule. Elle décrit ce que tous les objets de cette famille ont en commun. Le plan d'une voiture ne roule pas. Une **instance**, l'objet, est une réalisation de ce plan : la voiture rouge de M. Dupont n'est pas la voiture bleue de Mme Martin, même si les deux sortent du même moule.

Les **attributs** sont les données attachées à l'objet, son état : une couleur, une vitesse, une marque. Les **méthodes** sont les fonctions attachées à l'objet, ce qu'il sait faire : démarrer, freiner, klaxonner. On les appelle sur l'objet, pas à côté.

## Écrire la classe

Le mot-clé est `class`. Par convention, le nom commence par une majuscule, en PascalCase, pour qu'on le distingue d'une fonction ou d'une variable.

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

`__init__` s'exécute à la naissance de l'objet. C'est là qu'on donne une valeur initiale aux attributs. `vitesse` n'est pas un paramètre : toute voiture neuve part de zéro, donc la classe le décide elle-même.

Créer l'objet, c'est appeler la classe. Python fabrique l'instance et appelle `__init__` automatiquement.

```python
# Instanciation (Création de l'objet)
ma_voiture = Voiture("Peugeot", "Rouge")

# Accès aux attributs
print(ma_voiture.marque)  # Affiche "Peugeot"

# Appel de méthodes
ma_voiture.accelerer(50)  # Affiche "La Peugeot accélère à 50 km/h."
```

`self` est l'objet en train d'exécuter la méthode. Il est obligatoire en premier paramètre, même si, à l'appel, il n'est pas passé : `ma_voiture.accelerer(50)` fournit `ma_voiture` comme `self`, et `50` comme `gain`. C'est grâce à `self` qu'on distingue `self.vitesse`, qui survit entre deux appels, d'une variable locale qui meurt à la fin de la fonction.

## Cacher le mécanisme

L'**encapsulation** consiste à ne pas laisser le reste du programme tripoter les détails internes. On lui offre une **interface** : quelques méthodes, dont le sens est clair. Comment le solde est stocké peut changer. `deposer` doit continuer à vouloir dire la même chose.

Python n'a pas de privé au sens strict de Java. La convention est un underscore : `_solde` signifie « n'y touchez pas directement, passez par les méthodes ». Rien ne l'empêche techniquement. Le underscore est un avertissement, pas un verrou.

On parle d'**accesseur** pour une méthode qui donne la valeur, et de **mutateur** pour une méthode qui la modifie en vérifiant que la modification a un sens.

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

`deposer` refuse un montant négatif. Si le reste du programme faisait `compte._solde += montant` directement, cette vérification disparaîtrait. L'encapsulation n'est pas une coquetterie de syntaxe. C'est l'endroit où l'objet protège ses invariants.

---

<ExerciseTabs courseId="terminale_poo" courseTitle="Exercices POO">

  <ExerciseSection id="poo-ex-1" label="Création de Classe" type="python">
    <Enonce>
    ### La Classe `Chien` <Icone nom="dog" />
    1.  Créer une classe `Chien` avec les attributs `nom` et `race`.
    2.  Ajouter une méthode `aboyer()` qui affiche "Wouaf ! Je suis [nom] !".
    3.  Créer un chien nommé "Rex", de race "Berger Allemand", et le faire aboyer.
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="poo-ex-2" label="RPG Simple" type="python">
    <Enonce>
    ### Personnage de Jeu <Icone nom="swords" />
    Créer une classe `Personnage` :
    1.  Attributs : `pseudo`, `pv` (points de vie, defaut 100), `force`.
    2.  Méthode `attaquer(self, cible)` : Enlève `self.force` aux PV de la `cible`.
    3.  Méthode `est_vivant(self)` : Renvoie `True` si PV > 0, sinon `False`.

    Simuler un combat entre deux personnages.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
