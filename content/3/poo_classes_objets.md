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

La programmation orientée objet organise un programme autour d'**objets** qui se parlent, plutôt qu'autour d'une longue suite de fonctions auxquelles on transmet sans cesse les mêmes données. C'est le style dominant en Java, en C++, en C# et, pour une grande partie du code, en Python. Cette idée a déjà été vue en Première. Ce cours la reprend avec le vocabulaire de Terminale, en ajoutant une question : à quelles données a-t-on le droit d'accéder depuis l'extérieur de l'objet ?

Une **classe** sert de moule : elle décrit ce que tous les objets de cette famille ont en commun. C'est un peu comme le plan d'une voiture, qui ne roule pas lui-même. Une **instance**, ou objet, est une réalisation de ce plan : la voiture rouge de M. Dupont et la voiture bleue de Mme Martin sont deux objets différents, même s'ils viennent du même moule.

Les **attributs** sont les données attachées à l'objet, qui forment son état, comme une couleur, une vitesse ou une marque. Les **méthodes** sont les fonctions attachées à l'objet, c'est-à-dire ce qu'il sait faire, comme démarrer, freiner ou klaxonner. Une méthode s'appelle toujours sur un objet.

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

`__init__` s'exécute à la création de l'objet. C'est là qu'on donne une valeur initiale aux attributs. `vitesse` n'est pas un paramètre : toute voiture neuve commence à l'arrêt, donc la classe fixe elle-même sa valeur à zéro.

Pour créer un objet, on appelle la classe. Python fabrique l'instance et appelle `__init__` automatiquement.

```python
# Instanciation (Création de l'objet)
ma_voiture = Voiture("Peugeot", "Rouge")

# Accès aux attributs
print(ma_voiture.marque)  # Affiche "Peugeot"

# Appel de méthodes
ma_voiture.accelerer(50)  # Affiche "La Peugeot accélère à 50 km/h."
```

`self` est l'objet en train d'exécuter la méthode. Il est obligatoire en premier paramètre, même si, à l'appel, il n'est pas passé : `ma_voiture.accelerer(50)` fournit `ma_voiture` comme `self`, et `50` comme `gain`. C'est grâce à `self` qu'on distingue `self.vitesse`, qui est conservé entre deux appels, d'une variable locale, qui disparaît à la fin de la fonction.

## L'encapsulation

L'**encapsulation** consiste à empêcher le reste du programme de manipuler directement les détails internes d'un objet. On lui propose à la place une **interface**, formée de quelques méthodes au rôle clair. La façon dont le solde est stocké peut alors changer, tant que `deposer` garde le même sens.

Python n'a pas d'attributs privés au sens strict, comme en Java. Par convention, un nom qui commence par un tiret bas, comme `_solde`, signale qu'il ne faut pas y accéder directement, mais passer par les méthodes. Rien ne l'interdit techniquement : le tiret bas est un simple avertissement.

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

`deposer` refuse un montant négatif. Si le reste du programme faisait `compte._solde += montant` directement, cette vérification disparaîtrait. L'encapsulation permet ainsi à l'objet de garantir que ses données restent cohérentes.

---

<ExerciseTabs courseId="terminale_poo" courseTitle="Exercices POO">

  <ExerciseSection id="poo-ex-1" label="Création de Classe" type="python">
    <Enonce>
    ### La Classe `Chien` <Icone nom="dog" />
    1.  Créer une classe `Chien` avec les attributs `nom` et `race`.
    2.  Ajouter une méthode `aboyer()` qui affiche "Wouaf ! Je suis [nom] !".
    3.  Créer un chien nommé "Rex", de race "Berger Allemand", et le faire aboyer.

    <Correction>
    ```python
    class Chien:
        def __init__(self, nom, race):
            self.nom = nom
            self.race = race

        def aboyer(self):
            print("Wouaf ! Je suis " + self.nom + " !")

    rex = Chien("Rex", "Berger Allemand")
    rex.aboyer()
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    assert 'Chien' in globals() and isinstance(Chien, type), "La classe Chien n'est pas définie."
    medor = Chien("Médor", "Caniche")
    assert medor.nom == "Médor", "L'attribut nom doit contenir le nom donné."
    assert medor.race == "Caniche", "L'attribut race doit contenir la race donnée."
    sortie = io.StringIO()
    with contextlib.redirect_stdout(sortie):
        medor.aboyer()
    assert sortie.getvalue().strip() == "Wouaf ! Je suis Médor !", "aboyer() doit afficher Wouaf ! Je suis Médor !"
    chiens = [v for v in globals().values() if isinstance(v, Chien) and v is not medor]
    assert any(c.nom == "Rex" and c.race == "Berger Allemand" for c in chiens), "Un chien Rex, de race Berger Allemand, doit être créé."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="poo-ex-2" label="RPG Simple" type="python">
    <Enonce>
    ### Personnage de Jeu <Icone nom="swords" />
    Créer une classe `Personnage` :
    1.  Attributs : `pseudo`, `pv` (points de vie, defaut 100), `force`.
    2.  Méthode `attaquer(self, cible)` : Enlève `self.force` aux PV de la `cible`.
    3.  Méthode `est_vivant(self)` : Renvoie `True` si PV > 0, sinon `False`.

    Simuler un combat entre deux personnages.

    <Correction>
    ```python
    class Personnage:
        def __init__(self, pseudo, force, pv=100):
            self.pseudo = pseudo
            self.pv = pv
            self.force = force

        def attaquer(self, cible):
            cible.pv = cible.pv - self.force

        def est_vivant(self):
            return self.pv > 0

    guerrier = Personnage("Guerrier", 30)
    mage = Personnage("Mage", 25)
    while guerrier.est_vivant() and mage.est_vivant():
        guerrier.attaquer(mage)
        if mage.est_vivant():
            mage.attaquer(guerrier)
    print(guerrier.pseudo, guerrier.pv, mage.pseudo, mage.pv)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'Personnage' in globals() and isinstance(Personnage, type), "La classe Personnage n'est pas définie."
    a = Personnage(pseudo="A", force=30)
    b = Personnage(pseudo="B", force=10)
    assert a.pv == 100, "Les PV valent 100 par défaut."
    assert a.pseudo == "A" and a.force == 30, "Les attributs pseudo et force doivent contenir les valeurs données."
    a.attaquer(b)
    assert b.pv == 70, "Après une attaque de force 30, la cible passe de 100 à 70 PV."
    assert a.pv == 100, "L'attaquant ne perd pas de PV en attaquant."
    assert b.est_vivant() is True, "Avec 70 PV, le personnage est vivant."
    a.attaquer(b); a.attaquer(b); a.attaquer(b)
    assert b.est_vivant() is False, "Avec 0 PV ou moins, le personnage n'est plus vivant."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
