---
title: 'Exercices : POO en Python'
description: Classes, encapsulation, composition et héritage en Python.
level: TNSI
order: 146
chapter: Langages et Programmation
icon: "construction"
badgeId: terminale_exercices_poo
prerequisites:
  - poo_classes_objets
  - poo_heritage_polymorphisme
audience: public
---

# Exercices : programmation orientée objet

Ces exercices reprennent la progression du cours : une classe, l'encapsulation, plusieurs classes qui collaborent, puis l'héritage. Les cours utiles sont [Classes et objets](/cours/tnsi/poo_classes_objets) et [Héritage et polymorphisme](/cours/tnsi/poo_heritage_polymorphisme).

Les méthodes demandées **renvoient** un résultat (`True` ou `False`, un nombre, une chaîne, une liste ou un dictionnaire). C'est ce résultat qui est évalué.

### Lecture seule

Un attribut en lecture seule se stocke avec un nom interne, et se lit à travers une propriété. L'affectation directe doit échouer.

```python
class Jauge:
    def __init__(self, valeur):
        self._valeur = valeur

    @property
    def valeur(self):
        return self._valeur
```

### Héritage

```python
class Personne:
    def __init__(self, nom):
        self.nom = nom

class Eleve(Personne):
    def __init__(self, nom, classe):
        super().__init__(nom)
        self.classe = classe
```

### Lire une ligne de données

```python
ligne = "REF;Nom;12.50;3"
colonnes = ligne.split(";")
prix = float(colonnes[2])
quantite = int(colonnes[3])
```

---

<ExerciseTabs courseId="terminale_exercices_poo" courseTitle="Exercices POO">

  <ExerciseSection id="tnsi-poo-compte" label="Facile - Compte bancaire" type="python">
    <Enonce>
    ## Compte bancaire

    Créer une classe `CompteBancaire`.

    - `CompteBancaire(titulaire, solde=0)` enregistre le titulaire et le solde de départ. Sans second argument, le solde vaut `0`.
    - `titulaire` est un attribut public.
    - `solde` se lit, mais une affectation `compte.solde = ...` doit lever une erreur. Seules les méthodes de la classe modifient le solde.
    - `deposer(montant)` ajoute `montant` au solde si `montant > 0`, et renvoie `True`. Sinon, le solde ne change pas et la méthode renvoie `False`.
    - `retirer(montant)` retire `montant` si `montant > 0` et si le solde est suffisant, puis renvoie `True`. Sinon, le solde ne change pas et la méthode renvoie `False`.
    - `afficher_infos()` renvoie le texte `Compte de {titulaire} : {solde}€`.

    ```python
    compte = CompteBancaire("Alice Dupont", 100)
    compte.deposer(50)
    compte.retirer(30)
    compte.retirer(200)
    compte.solde
    compte.afficher_infos()
    ```
    </Enonce>
    <Verification>
    ```python
    compte = CompteBancaire("Alice Dupont", 100)
    assert compte.titulaire == "Alice Dupont", "titulaire"
    assert compte.solde == 100, "solde initial"
    assert compte.afficher_infos() == "Compte de Alice Dupont : 100€", "infos initiales"

    bloque = False
    try:
        compte.solde = 1
    except Exception:
        bloque = True
    assert bloque, "solde en lecture seule"

    assert compte.deposer(50) is True, "dépôt accepté"
    assert compte.solde == 150, "solde après dépôt"
    assert compte.afficher_infos() == "Compte de Alice Dupont : 150€", "infos après dépôt"
    assert compte.deposer(0) is False, "dépôt nul refusé"
    assert compte.deposer(-10) is False, "dépôt négatif refusé"
    assert compte.solde == 150, "solde inchangé après dépôt invalide"

    assert compte.retirer(30) is True, "retrait accepté"
    assert compte.solde == 120, "solde après retrait"
    assert compte.retirer(200) is False, "retrait trop grand refusé"
    assert compte.retirer(0) is False, "retrait nul refusé"
    assert compte.retirer(-5) is False, "retrait négatif refusé"
    assert compte.solde == 120, "solde inchangé après retrait invalide"
    assert compte.retirer(120) is True, "retrait de tout le solde"
    assert compte.solde == 0, "solde à zéro"

    vide = CompteBancaire("Sam")
    assert vide.solde == 0, "solde par défaut"
    assert vide.deposer(15) is True, "dépôt sur un compte vide"
    assert vide.solde == 15, "solde du second compte"
    assert compte.solde == 0, "les comptes sont indépendants"
    ```
    </Verification>
    <Correction>
    ```python
    class CompteBancaire:
        def __init__(self, titulaire, solde=0):
            self.titulaire = titulaire
            self._solde = solde

        @property
        def solde(self):
            return self._solde

        def deposer(self, montant):
            if montant > 0:
                self._solde += montant
                return True
            return False

        def retirer(self, montant):
            if montant > 0 and montant <= self._solde:
                self._solde -= montant
                return True
            return False

        def afficher_infos(self):
            return f"Compte de {self.titulaire} : {self.solde}€"
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-livre" label="Facile - Bibliothèque" type="python">
    <Enonce>
    ## Bibliothèque

    Créer une classe `Livre`.

    - `Livre(titre, auteur, annee)` crée un livre disponible.
    - `titre`, `auteur` et `annee` sont lisibles.
    - `est_emprunte` est en lecture seule. Il vaut `False` à la création. Une affectation directe doit lever une erreur.
    - `emprunter()` marque le livre comme emprunté et renvoie `True`. Si le livre l'est déjà, elle renvoie `False` et ne change rien.
    - `retourner()` rend le livre disponible et renvoie `True`. S'il l'était déjà, elle renvoie `False`.
    - `calculer_age(annee)` renvoie l'écart entre l'année donnée et l'année du livre.
    - `afficher_infos()` renvoie `{titre} par {auteur} ({annee}) - Statut : Disponible` ou `Emprunté`.

    ```python
    livre = Livre("1984", "George Orwell", 1949)
    livre.calculer_age(2026)
    livre.emprunter()
    livre.afficher_infos()
    livre.est_emprunte
    ```
    </Enonce>
    <Verification>
    ```python
    livre = Livre("1984", "George Orwell", 1949)
    assert livre.titre == "1984", "titre"
    assert livre.auteur == "George Orwell", "auteur"
    assert livre.annee == 1949, "année"
    assert livre.est_emprunte is False, "disponible au départ"
    assert livre.calculer_age(2026) == 77, "âge en 2026"
    assert livre.calculer_age(1949) == 0, "âge l'année de publication"
    assert livre.afficher_infos() == "1984 par George Orwell (1949) - Statut : Disponible", "infos disponibles"

    bloque = False
    try:
        livre.est_emprunte = True
    except Exception:
        bloque = True
    assert bloque, "est_emprunte en lecture seule"
    assert livre.est_emprunte is False, "l'affectation n'a pas changé l'état"

    assert livre.retourner() is False, "retour inutile"
    assert livre.emprunter() is True, "emprunt"
    assert livre.est_emprunte is True, "livre emprunté"
    assert livre.afficher_infos() == "1984 par George Orwell (1949) - Statut : Emprunté", "infos emprunté"
    assert livre.emprunter() is False, "déjà emprunté"
    assert livre.est_emprunte is True, "toujours emprunté"
    assert livre.retourner() is True, "retour"
    assert livre.est_emprunte is False, "de nouveau disponible"
    assert livre.retourner() is False, "déjà disponible"

    autre = Livre("Le Petit Prince", "Antoine de Saint-Exupéry", 1943)
    assert autre.est_emprunte is False, "un autre livre reste disponible"
    assert livre.est_emprunte is False, "les livres sont indépendants"
    ```
    </Verification>
    <Correction>
    ```python
    class Livre:
        def __init__(self, titre, auteur, annee):
            self.titre = titre
            self.auteur = auteur
            self.annee = annee
            self._est_emprunte = False

        @property
        def est_emprunte(self):
            return self._est_emprunte

        def emprunter(self):
            if self._est_emprunte:
                return False
            self._est_emprunte = True
            return True

        def retourner(self):
            if not self._est_emprunte:
                return False
            self._est_emprunte = False
            return True

        def calculer_age(self, annee):
            return annee - self.annee

        def afficher_infos(self):
            statut = "Emprunté" if self._est_emprunte else "Disponible"
            return f"{self.titre} par {self.auteur} ({self.annee}) - Statut : {statut}"
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-etudiant" label="Moyen - Étudiants" type="python">
    <Enonce>
    ## Étudiants et moyenne

    Créer une classe `Etudiant`.

    - `Etudiant(nom, prenom, numero)` enregistre le nom, le prénom et le numéro.
    - `nom` et `prenom` sont lisibles.
    - `numero` est en lecture seule. Une affectation directe doit lever une erreur.
    - Les notes sont gardées dans la classe. À la création, il n'y en a aucune. Deux étudiants ne partagent pas leurs notes.
    - `ajouter_note(note)` ajoute la note si `0 <= note <= 20` et renvoie `True`. Sinon elle renvoie `False` et la liste ne change pas.
    - `nombre_de_notes()` renvoie le nombre de notes retenues.
    - `calculer_moyenne()` renvoie la moyenne des notes, ou `0` s'il n'y en a pas.
    - `obtenir_mention()` utilise cette moyenne :
      - `>= 16` : `Très bien`
      - `>= 14` : `Bien`
      - `>= 12` : `Assez bien`
      - `>= 10` : `Passable`
      - sinon : `Insuffisant`
    - `afficher_infos()` renvoie exactement trois lignes. La moyenne affichée est arrondie à deux décimales :
      - `Étudiant N°{numero} : {prenom} {nom}`
      - `Nombre de notes : {n}`
      - `Moyenne : {moyenne:.2f}/20 - Mention : {mention}`

    ```python
    etudiant = Etudiant("Martin", "Sophie", 12345)
    etudiant.ajouter_note(15)
    etudiant.ajouter_note(12)
    etudiant.ajouter_note(16.5)
    etudiant.ajouter_note(14)
    etudiant.ajouter_note(25)
    etudiant.calculer_moyenne()
    etudiant.obtenir_mention()
    etudiant.afficher_infos()
    ```
    </Enonce>
    <Verification>
    ```python
    etudiant = Etudiant("Martin", "Sophie", 12345)
    assert etudiant.nom == "Martin", "nom"
    assert etudiant.prenom == "Sophie", "prénom"
    assert etudiant.numero == 12345, "numéro"
    assert etudiant.nombre_de_notes() == 0, "aucune note"
    assert etudiant.calculer_moyenne() == 0, "moyenne vide"
    assert etudiant.obtenir_mention() == "Insuffisant", "mention sans note"
    assert etudiant.afficher_infos() == "Étudiant N°12345 : Sophie Martin\nNombre de notes : 0\nMoyenne : 0.00/20 - Mention : Insuffisant", "infos vides"

    bloque = False
    try:
        etudiant.numero = 1
    except Exception:
        bloque = True
    assert bloque, "numero en lecture seule"
    assert etudiant.numero == 12345, "numéro inchangé"

    assert etudiant.ajouter_note(15) is True, "note 15"
    assert etudiant.ajouter_note(12) is True, "note 12"
    assert etudiant.ajouter_note(16.5) is True, "note 16.5"
    assert etudiant.ajouter_note(14) is True, "note 14"
    assert etudiant.ajouter_note(25) is False, "note 25 refusée"
    assert etudiant.ajouter_note(-1) is False, "note négative refusée"
    assert etudiant.ajouter_note(20.1) is False, "note au-dessus de 20 refusée"
    assert etudiant.nombre_de_notes() == 4, "quatre notes"
    assert etudiant.calculer_moyenne() == 14.375, "moyenne 14.375"
    assert etudiant.obtenir_mention() == "Bien", "mention Bien"
    assert etudiant.afficher_infos() == "Étudiant N°12345 : Sophie Martin\nNombre de notes : 4\nMoyenne : 14.38/20 - Mention : Bien", "infos Sophie"

    autre = Etudiant("Dubois", "Thomas", 12346)
    assert autre.nombre_de_notes() == 0, "les notes ne sont pas partagées"
    assert autre.ajouter_note(18) is True, "note 18"
    assert autre.ajouter_note(17.5) is True, "note 17.5"
    assert autre.ajouter_note(16) is True, "note 16"
    assert autre.ajouter_note(0) is True, "note 0"
    assert autre.ajouter_note(20) is True, "note 20"
    assert abs(autre.calculer_moyenne() - (18 + 17.5 + 16 + 0 + 20) / 5) < 1e-9, "moyenne Thomas"
    assert etudiant.nombre_de_notes() == 4, "Sophie garde ses notes"

    def mention_de(note):
        eleve = Etudiant("Test", "Ada", 1)
        eleve.ajouter_note(note)
        return eleve.obtenir_mention()

    assert mention_de(16) == "Très bien", "seuil 16"
    assert mention_de(15.99) == "Bien", "juste sous 16"
    assert mention_de(14) == "Bien", "seuil 14"
    assert mention_de(12) == "Assez bien", "seuil 12"
    assert mention_de(10) == "Passable", "seuil 10"
    assert mention_de(9.99) == "Insuffisant", "sous 10"
    ```
    </Verification>
    <Correction>
    ```python
    class Etudiant:
        def __init__(self, nom, prenom, numero):
            self.nom = nom
            self.prenom = prenom
            self._numero = numero
            self._notes = []

        @property
        def numero(self):
            return self._numero

        def ajouter_note(self, note):
            if 0 <= note <= 20:
                self._notes.append(note)
                return True
            return False

        def nombre_de_notes(self):
            return len(self._notes)

        def calculer_moyenne(self):
            if not self._notes:
                return 0
            return sum(self._notes) / len(self._notes)

        def obtenir_mention(self):
            moyenne = self.calculer_moyenne()
            if moyenne >= 16:
                return "Très bien"
            if moyenne >= 14:
                return "Bien"
            if moyenne >= 12:
                return "Assez bien"
            if moyenne >= 10:
                return "Passable"
            return "Insuffisant"

        def afficher_infos(self):
            return (
                f"Étudiant N°{self.numero} : {self.prenom} {self.nom}\n"
                f"Nombre de notes : {self.nombre_de_notes()}\n"
                f"Moyenne : {self.calculer_moyenne():.2f}/20 - Mention : {self.obtenir_mention()}"
            )
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-concessionnaire" label="Avancé - Concessionnaire" type="python">
    <Enonce>
    ## Concessionnaire

    Deux classes travaillent ensemble : `Voiture` et `Concessionnaire`.

    ### Voiture

    - `Voiture(marque, modele, annee, prix, kilometrage)` crée une voiture disponible.
    - `marque`, `modele`, `annee`, `prix` et `kilometrage` sont lisibles. `prix` peut changer par une remise.
    - `est_vendue` est en lecture seule, `False` au départ. Une affectation directe doit lever une erreur.
    - `vendre()` passe `est_vendue` à `True` et renvoie `True`. Si la voiture est déjà vendue, elle renvoie `False`.
    - `calculer_age(annee)` renvoie l'écart entre l'année donnée et l'année de la voiture.
    - `appliquer_remise(pourcentage)` réduit le prix : `prix * (1 - pourcentage / 100)`. `10` signifie 10 %. La méthode renvoie le nouveau prix.
    - `afficher_infos()` renvoie `{marque} {modele} ({annee}) - {prix}€ - {kilometrage} km - Statut : Disponible` ou `Vendue`. Le prix affiché est celui qui est stocké.

    ### Concessionnaire

    - `Concessionnaire(nom, ville)` crée un stock vide. `nom` et `ville` sont lisibles.
    - `ajouter_voiture(voiture)` ajoute l'objet reçu.
    - `nombre_total()` renvoie le nombre de voitures du stock, vendues ou non.
    - `disponibles()` renvoie la liste des objets non vendus, dans l'ordre d'ajout.
    - `nombre_disponibles()` renvoie le nombre de voitures non vendues.
    - `valeur_stock()` renvoie la somme des prix des voitures non vendues, ou `0` si aucune n'est disponible.
    - `moins_chere()` renvoie l'objet du stock non vendu dont le prix est le plus bas, ou `None` s'il n'y en a pas.

    ```python
    concession = Concessionnaire("Auto Premium", "Paris")
    clio = Voiture("Renault", "Clio", 2020, 15000, 25000)
    peugeot = Voiture("Peugeot", "308", 2019, 18000, 35000)
    c3 = Voiture("Citroën", "C3", 2021, 14000, 15000)
    bmw = Voiture("BMW", "Série 3", 2022, 35000, 10000)
    concession.ajouter_voiture(clio)
    concession.ajouter_voiture(peugeot)
    concession.disponibles()
    concession.valeur_stock()
    concession.moins_chere()
    ```
    </Enonce>
    <Verification>
    ```python
    voiture = Voiture("Renault", "Clio", 2020, 15000, 25000)
    assert voiture.marque == "Renault", "marque"
    assert voiture.modele == "Clio", "modèle"
    assert voiture.annee == 2020, "année"
    assert voiture.prix == 15000, "prix"
    assert voiture.kilometrage == 25000, "kilométrage"
    assert voiture.est_vendue is False, "non vendue"
    assert voiture.calculer_age(2026) == 6, "âge"
    assert voiture.afficher_infos() == "Renault Clio (2020) - 15000€ - 25000 km - Statut : Disponible", "infos"

    bloque = False
    try:
        voiture.est_vendue = True
    except Exception:
        bloque = True
    assert bloque, "est_vendue en lecture seule"
    assert voiture.vendre() is True, "vente"
    assert voiture.est_vendue is True, "vendue"
    assert voiture.vendre() is False, "déjà vendue"
    assert voiture.afficher_infos() == "Renault Clio (2020) - 15000€ - 25000 km - Statut : Vendue", "infos vendue"

    remise = Voiture("Peugeot", "308", 2019, 18000, 35000)
    nouveau = remise.appliquer_remise(10)
    assert abs(nouveau - 16200) < 1e-6, "prix renvoyé"
    assert abs(remise.prix - 16200) < 1e-6, "prix stocké"
    assert remise.afficher_infos() == f"Peugeot 308 (2019) - {remise.prix}€ - 35000 km - Statut : Disponible", "infos après remise"

    vide = Concessionnaire("Auto Premium", "Paris")
    assert vide.nom == "Auto Premium", "nom"
    assert vide.ville == "Paris", "ville"
    assert vide.nombre_total() == 0, "stock vide"
    assert vide.disponibles() == [], "aucune disponible"
    assert vide.nombre_disponibles() == 0, "zéro disponible"
    assert vide.valeur_stock() == 0, "valeur nulle"
    assert vide.moins_chere() is None, "pas de voiture la moins chère"

    clio = Voiture("Renault", "Clio", 2020, 15000, 25000)
    peugeot = Voiture("Peugeot", "308", 2019, 18000, 35000)
    c3 = Voiture("Citroën", "C3", 2021, 14000, 15000)
    bmw = Voiture("BMW", "Série 3", 2022, 35000, 10000)
    stock = Concessionnaire("Auto Premium", "Paris")
    stock.ajouter_voiture(clio)
    stock.ajouter_voiture(peugeot)
    stock.ajouter_voiture(c3)
    stock.ajouter_voiture(bmw)
    assert stock.nombre_total() == 4, "quatre voitures"
    assert stock.nombre_disponibles() == 4, "toutes disponibles"
    assert stock.valeur_stock() == 82000, "valeur initiale"
    assert stock.moins_chere() is c3, "la C3 est la moins chère"
    assert [item.modele for item in stock.disponibles()] == ["Clio", "308", "C3", "Série 3"], "ordre d'ajout"

    assert peugeot.vendre() is True, "vente de la 308"
    assert abs(clio.appliquer_remise(10) - 13500) < 1e-6, "remise sur la Clio"
    assert stock.nombre_total() == 4, "la vente ne retire pas la voiture"
    assert stock.nombre_disponibles() == 3, "trois disponibles"
    assert abs(stock.valeur_stock() - (clio.prix + 14000 + 35000)) < 1e-6, "valeur après vente et remise"
    assert stock.moins_chere() is clio, "la Clio devient la moins chère"
    assert [item.modele for item in stock.disponibles()] == ["Clio", "C3", "Série 3"], "la 308 n'est plus disponible"
    assert vide.nombre_total() == 0, "les stocks sont indépendants"
    ```
    </Verification>
    <Correction>
    ```python
    class Voiture:
        def __init__(self, marque, modele, annee, prix, kilometrage):
            self.marque = marque
            self.modele = modele
            self.annee = annee
            self.prix = prix
            self.kilometrage = kilometrage
            self._est_vendue = False

        @property
        def est_vendue(self):
            return self._est_vendue

        def vendre(self):
            if self._est_vendue:
                return False
            self._est_vendue = True
            return True

        def calculer_age(self, annee):
            return annee - self.annee

        def appliquer_remise(self, pourcentage):
            self.prix = self.prix * (1 - pourcentage / 100)
            return self.prix

        def afficher_infos(self):
            statut = "Vendue" if self._est_vendue else "Disponible"
            return f"{self.marque} {self.modele} ({self.annee}) - {self.prix}€ - {self.kilometrage} km - Statut : {statut}"


    class Concessionnaire:
        def __init__(self, nom, ville):
            self.nom = nom
            self.ville = ville
            self._voitures = []

        def ajouter_voiture(self, voiture):
            self._voitures.append(voiture)

        def nombre_total(self):
            return len(self._voitures)

        def disponibles(self):
            return [voiture for voiture in self._voitures if not voiture.est_vendue]

        def nombre_disponibles(self):
            return len(self.disponibles())

        def valeur_stock(self):
            return sum(voiture.prix for voiture in self.disponibles())

        def moins_chere(self):
            choix = None
            for voiture in self.disponibles():
                if choix is None or voiture.prix < choix.prix:
                    choix = voiture
            return choix
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-csv" label="Avancé - Import CSV" type="python">
    <Enonce>
    ## Import CSV

    Un magasin reçoit ses produits dans un fichier texte. Chaque ligne a la forme `Référence;Nom;Prix;Quantité`.

    ```text
    A100;Ecran 24 pouces;150.00;10
    B200;Clavier mécanique;89.99;5
    C300;Souris sans fil;25.50;20
    D400;Tapis de souris;12.00;50
    ```

    ### Produit

    - `Produit(reference, nom, prix, quantite)` stocke ces quatre valeurs. `prix` est un flottant, `quantite` un entier.
    - `afficher()` renvoie `[{reference}] {nom} : {prix}€ (Quantité: {quantite})`, avec le prix et la quantité tels qu'ils sont stockés.

    ### Magasin

    - `Magasin()` démarre avec un stock vide.
    - `importer(chemin)` lit le fichier encodé en UTF-8.
      - Chaque ligne non vide est découpée sur `;`, convertie en `Produit` et ajoutée au stock.
      - Les lignes vides sont ignorées.
      - La méthode renvoie le nombre de produits ajoutés.
      - Si le fichier est introuvable, elle renvoie `-1` et le stock ne change pas.
    - `produits()` renvoie la liste des produits dans l'ordre d'import.

    ```python
    magasin = Magasin()
    magasin.importer("produits.csv")
    magasin.produits()
    ```
    </Enonce>
    <Verification>
    ```python
    from pathlib import Path

    contenu = "\n".join([
        "A100;Ecran 24 pouces;150.00;10",
        "B200;Clavier mécanique;89.99;5",
        "",
        "C300;Souris sans fil;25.50;20",
        "D400;Tapis de souris;12.00;50",
        "",
    ])
    Path("produits.csv").write_text(contenu, encoding="utf-8")

    magasin = Magasin()
    assert magasin.produits() == [], "stock vide"
    assert magasin.importer("fichier-absent.csv") == -1, "fichier absent"
    assert magasin.produits() == [], "stock inchangé"

    assert magasin.importer("produits.csv") == 4, "quatre produits"
    produits = magasin.produits()
    assert len(produits) == 4, "liste de quatre produits"
    assert [p.reference for p in produits] == ["A100", "B200", "C300", "D400"], "références"
    assert [p.nom for p in produits] == ["Ecran 24 pouces", "Clavier mécanique", "Souris sans fil", "Tapis de souris"], "noms"
    assert [p.prix for p in produits] == [150.0, 89.99, 25.5, 12.0], "prix"
    assert [p.quantite for p in produits] == [10, 5, 20, 50], "quantités"
    assert produits[0].afficher() == f"[{produits[0].reference}] {produits[0].nom} : {produits[0].prix}€ (Quantité: {produits[0].quantite})", "affichage"
    assert produits[2].afficher() == "[C300] Souris sans fil : 25.5€ (Quantité: 20)", "affichage souris"

    assert magasin.importer("produits.csv") == 4, "second import"
    assert len(magasin.produits()) == 8, "les imports s'ajoutent"

    Path("vide.csv").write_text("\n\n", encoding="utf-8")
    autre = Magasin()
    assert autre.importer("vide.csv") == 0, "fichier vide"
    assert autre.produits() == [], "rien ajouté"
    ```
    </Verification>
    <Correction>
    ```python
    class Produit:
        def __init__(self, reference, nom, prix, quantite):
            self.reference = reference
            self.nom = nom
            self.prix = prix
            self.quantite = quantite

        def afficher(self):
            return f"[{self.reference}] {self.nom} : {self.prix}€ (Quantité: {self.quantite})"


    class Magasin:
        def __init__(self):
            self._produits = []

        def produits(self):
            return list(self._produits)

        def importer(self, chemin):
            try:
                with open(chemin, encoding="utf-8") as fichier:
                    lignes = fichier.read().splitlines()
            except FileNotFoundError:
                return -1
            ajoutes = 0
            for ligne in lignes:
                ligne = ligne.strip()
                if not ligne:
                    continue
                reference, nom, prix, quantite = ligne.split(";")
                self._produits.append(Produit(reference, nom, float(prix), int(quantite)))
                ajoutes += 1
            return ajoutes
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-refuge" label="Difficile - Refuge" type="python">
    <Enonce>
    ## Refuge et héritage

    Un refuge accueille des chiens, des chats et des oiseaux. Les données communes sont dans une classe mère.

    ### Animal

    - `Animal(nom, age, poids)` crée un animal non adopté.
    - `nom`, `age` et `poids` sont lisibles.
    - `est_adopte` est en lecture seule, `False` au départ.
    - `adopter()` passe `est_adopte` à `True` et renvoie `True`. Si l'animal est déjà adopté, elle renvoie `False`.
    - `vieillir()` augmente `age` de 1 et renvoie le nouvel âge.
    - `afficher_infos()` renvoie `{nom} - {age} ans - {poids} kg - Statut : Disponible` ou `Adopté`.

    ### Chien, Chat, Oiseau

    Ces classes héritent d'`Animal` et appellent son constructeur.

    - `Chien(nom, age, poids, race)` ajoute `race`. `aboyer()` renvoie `Wouf wouf !`.
    - `Chat(nom, age, poids, couleur)` ajoute `couleur`. `miauler()` renvoie `Miaou !`.
    - `Oiseau(nom, age, poids, envergure)` ajoute `envergure`, en centimètres. `chanter()` renvoie `Cui cui !`.
    - Chaque classe redéfinit `afficher_infos()` :
      - chien : `Chien : {nom} ({race}) - {age} ans - {poids} kg - Statut : {statut}`
      - chat : `Chat : {nom} ({couleur}) - {age} ans - {poids} kg - Statut : {statut}`
      - oiseau : `Oiseau : {nom} - {age} ans - {poids} kg - Envergure : {envergure} cm - Statut : {statut}`

    ### Refuge

    - `Refuge(nom)` crée un refuge vide. `nom` est lisible.
    - `ajouter(animal)` ajoute l'objet reçu.
    - `animaux()` renvoie tous les animaux, dans l'ordre d'ajout.
    - `disponibles()` renvoie les animaux non adoptés, dans le même ordre.
    - `statistiques()` renvoie un dictionnaire. Les effectifs comptent tous les animaux, adoptés ou non. `disponibles` ne compte que ceux qui ne sont pas adoptés.

    ```python
    refuge = Refuge("Les Amis des Animaux")
    rex = Chien("Rex", 3, 25.5, "Berger Allemand")
    refuge.ajouter(rex)
    rex.aboyer()
    rex.adopter()
    rex.vieillir()
    refuge.animaux()
    refuge.disponibles()
    refuge.statistiques()
    # clés : total, chiens, chats, oiseaux, disponibles
    ```
    </Enonce>
    <Verification>
    ```python
    assert issubclass(Chien, Animal), "Chien hérite d'Animal"
    assert issubclass(Chat, Animal), "Chat hérite d'Animal"
    assert issubclass(Oiseau, Animal), "Oiseau hérite d'Animal"

    milou = Animal("Milou", 4, 12)
    assert milou.est_adopte is False, "non adopté"
    assert milou.afficher_infos() == "Milou - 4 ans - 12 kg - Statut : Disponible", "infos animal"
    assert milou.vieillir() == 5, "vieillir renvoie l'âge"
    assert milou.age == 5, "âge augmenté"
    assert milou.adopter() is True, "adoption"
    assert milou.adopter() is False, "déjà adopté"
    assert milou.est_adopte is True, "adopté"
    assert milou.afficher_infos() == "Milou - 5 ans - 12 kg - Statut : Adopté", "infos adopté"

    bloque = False
    try:
        milou.est_adopte = False
    except Exception:
        bloque = True
    assert bloque, "est_adopte en lecture seule"

    rex = Chien("Rex", 3, 25.5, "Berger Allemand")
    bella = Chien("Bella", 5, 18, "Labrador")
    minou = Chat("Minou", 2, 4.5, "Tigré")
    felix = Chat("Félix", 4, 5, "Noir")
    kiwi = Oiseau("Kiwi", 1, 0.3, 25)
    assert isinstance(rex, Animal) and isinstance(minou, Animal) and isinstance(kiwi, Animal), "instances d'Animal"
    assert rex.aboyer() == "Wouf wouf !", "aboyer"
    assert minou.miauler() == "Miaou !", "miauler"
    assert kiwi.chanter() == "Cui cui !", "chanter"
    assert rex.race == "Berger Allemand", "race"
    assert minou.couleur == "Tigré", "couleur"
    assert kiwi.envergure == 25, "envergure"
    assert rex.afficher_infos() == "Chien : Rex (Berger Allemand) - 3 ans - 25.5 kg - Statut : Disponible", "infos chien"

    refuge = Refuge("Les Amis des Animaux")
    assert refuge.nom == "Les Amis des Animaux", "nom du refuge"
    assert refuge.animaux() == [], "refuge vide"
    assert refuge.disponibles() == [], "aucun disponible"
    assert refuge.statistiques() == {"total": 0, "chiens": 0, "chats": 0, "oiseaux": 0, "disponibles": 0}, "stats vides"

    refuge.ajouter(rex)
    refuge.ajouter(bella)
    refuge.ajouter(minou)
    refuge.ajouter(felix)
    refuge.ajouter(kiwi)
    assert [animal.nom for animal in refuge.animaux()] == ["Rex", "Bella", "Minou", "Félix", "Kiwi"], "ordre d'ajout"
    assert rex.adopter() is True, "Rex adopté"
    assert minou.adopter() is True, "Minou adopté"
    assert bella.vieillir() == 6, "Bella vieillit"
    assert [animal.nom for animal in refuge.disponibles()] == ["Bella", "Félix", "Kiwi"], "disponibles"
    assert [animal.afficher_infos() for animal in refuge.disponibles()] == [
        "Chien : Bella (Labrador) - 6 ans - 18 kg - Statut : Disponible",
        "Chat : Félix (Noir) - 4 ans - 5 kg - Statut : Disponible",
        "Oiseau : Kiwi - 1 ans - 0.3 kg - Envergure : 25 cm - Statut : Disponible",
    ], "affichage polymorphique"
    assert minou.afficher_infos() == "Chat : Minou (Tigré) - 2 ans - 4.5 kg - Statut : Adopté", "chat adopté"
    assert refuge.statistiques() == {"total": 5, "chiens": 2, "chats": 2, "oiseaux": 1, "disponibles": 3}, "statistiques"
    ```
    </Verification>
    <Correction>
    ```python
    class Animal:
        def __init__(self, nom, age, poids):
            self.nom = nom
            self.age = age
            self.poids = poids
            self._est_adopte = False

        @property
        def est_adopte(self):
            return self._est_adopte

        def adopter(self):
            if self._est_adopte:
                return False
            self._est_adopte = True
            return True

        def vieillir(self):
            self.age += 1
            return self.age

        def afficher_infos(self):
            statut = "Adopté" if self._est_adopte else "Disponible"
            return f"{self.nom} - {self.age} ans - {self.poids} kg - Statut : {statut}"


    class Chien(Animal):
        def __init__(self, nom, age, poids, race):
            super().__init__(nom, age, poids)
            self.race = race

        def aboyer(self):
            return "Wouf wouf !"

        def afficher_infos(self):
            statut = "Adopté" if self.est_adopte else "Disponible"
            return f"Chien : {self.nom} ({self.race}) - {self.age} ans - {self.poids} kg - Statut : {statut}"


    class Chat(Animal):
        def __init__(self, nom, age, poids, couleur):
            super().__init__(nom, age, poids)
            self.couleur = couleur

        def miauler(self):
            return "Miaou !"

        def afficher_infos(self):
            statut = "Adopté" if self.est_adopte else "Disponible"
            return f"Chat : {self.nom} ({self.couleur}) - {self.age} ans - {self.poids} kg - Statut : {statut}"


    class Oiseau(Animal):
        def __init__(self, nom, age, poids, envergure):
            super().__init__(nom, age, poids)
            self.envergure = envergure

        def chanter(self):
            return "Cui cui !"

        def afficher_infos(self):
            statut = "Adopté" if self.est_adopte else "Disponible"
            return f"Oiseau : {self.nom} - {self.age} ans - {self.poids} kg - Envergure : {self.envergure} cm - Statut : {statut}"


    class Refuge:
        def __init__(self, nom):
            self.nom = nom
            self._animaux = []

        def ajouter(self, animal):
            self._animaux.append(animal)

        def animaux(self):
            return list(self._animaux)

        def disponibles(self):
            return [animal for animal in self._animaux if not animal.est_adopte]

        def statistiques(self):
            return {
                "total": len(self._animaux),
                "chiens": sum(1 for animal in self._animaux if isinstance(animal, Chien)),
                "chats": sum(1 for animal in self._animaux if isinstance(animal, Chat)),
                "oiseaux": sum(1 for animal in self._animaux if isinstance(animal, Oiseau)),
                "disponibles": len(self.disponibles()),
            }
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="tnsi-poo-vehicules" label="Difficile - Véhicules" type="python">
    <Enonce>
    ## Véhicules et héritage

    Le concessionnaire vend maintenant des voitures, des motos et des quads. Les comportements communs sont dans une classe mère.

    ### Vehicule

    - `Vehicule(marque, modele, annee, prix)` crée un véhicule disponible.
    - `marque`, `modele`, `annee` et `prix` sont lisibles.
    - `est_vendu` est en lecture seule, `False` au départ.
    - `vendre()` passe `est_vendu` à `True` et renvoie `True`, ou `False` s'il est déjà vendu.
    - `appliquer_remise(pourcentage)` remplace le prix par `prix * (1 - pourcentage / 100)` et renvoie le nouveau prix.
    - `afficher_infos()` renvoie `{marque} {modele} ({annee}) - {prix}€ - Statut : Disponible` ou `Vendu`.

    ### Voiture, Moto, Quad

    Ces classes héritent de `Vehicule` et appellent son constructeur. `vendre` et `appliquer_remise` restent celles du parent. Chacune redéfinit `afficher_infos()`.

    - `Voiture(marque, modele, annee, prix, kilometrage)` ajoute `kilometrage`.
      Texte : `Voiture : {marque} {modele} ({annee}) - {prix}€ - {kilometrage} km - Statut : {statut}`
    - `Moto(marque, modele, annee, prix, cylindree)` ajoute `cylindree`.
      Texte : `Moto : {marque} {modele} ({annee}) - {prix}€ - {cylindree} cm3 - Statut : {statut}`
    - `Quad(marque, modele, annee, prix, homologue_route)` ajoute `homologue_route` (`True` ou `False`).
      Texte : `Quad : {marque} {modele} ({annee}) - {prix}€ - Homologué route - Statut : {statut}` ou `Non homologué` à la place de `Homologué route`.

    ### Concessionnaire

    - `Concessionnaire(nom, ville)` crée un stock vide.
    - `ajouter(vehicule)` ajoute l'objet reçu, quelle que soit sa classe fille.
    - `disponibles()` renvoie les véhicules non vendus, dans l'ordre d'ajout.
    - `valeur_stock()` renvoie la somme des prix des véhicules non vendus.
    - `statistiques()` renvoie un dictionnaire. `voitures`, `motos` et `quads` comptent tous les véhicules de ce type. `disponibles` et `valeur` ignorent les véhicules vendus.

    ```python
    concession = Concessionnaire("Auto Premium", "Paris")
    clio = Voiture("Renault", "Clio", 2020, 15000, 25000)
    moto = Moto("Yamaha", "MT-07", 2021, 8000, 689)
    quad = Quad("Polaris", "Sportsman", 2018, 9000, False)
    concession.ajouter(clio)
    concession.ajouter(moto)
    concession.ajouter(quad)
    moto.appliquer_remise(10)
    clio.vendre()
    concession.disponibles()
    concession.valeur_stock()
    concession.statistiques()
    # clés : total, disponibles, valeur, voitures, motos, quads
    ```
    </Enonce>
    <Verification>
    ```python
    assert issubclass(Voiture, Vehicule), "Voiture hérite de Vehicule"
    assert issubclass(Moto, Vehicule), "Moto hérite de Vehicule"
    assert issubclass(Quad, Vehicule), "Quad hérite de Vehicule"

    base = Vehicule("Trek", "Domane", 2019, 2000)
    assert base.est_vendu is False, "non vendu"
    assert base.afficher_infos() == "Trek Domane (2019) - 2000€ - Statut : Disponible", "infos véhicule"
    bloque = False
    try:
        base.est_vendu = True
    except Exception:
        bloque = True
    assert bloque, "est_vendu en lecture seule"
    assert base.vendre() is True, "vente"
    assert base.vendre() is False, "déjà vendu"
    assert base.est_vendu is True, "vendu"
    assert base.afficher_infos() == "Trek Domane (2019) - 2000€ - Statut : Vendu", "infos vendu"

    clio = Voiture("Renault", "Clio", 2020, 15000, 25000)
    moto = Moto("Yamaha", "MT-07", 2021, 8000, 689)
    quad = Quad("Polaris", "Sportsman", 2018, 9000, False)
    route = Quad("Linc", "Farm", 2022, 11000, True)
    assert isinstance(clio, Vehicule) and isinstance(moto, Vehicule) and isinstance(quad, Vehicule), "instances de Vehicule"
    assert clio.kilometrage == 25000, "kilométrage"
    assert moto.cylindree == 689, "cylindrée"
    assert quad.homologue_route is False, "quad non homologué"
    assert clio.afficher_infos() == "Voiture : Renault Clio (2020) - 15000€ - 25000 km - Statut : Disponible", "infos voiture"
    assert moto.afficher_infos() == "Moto : Yamaha MT-07 (2021) - 8000€ - 689 cm3 - Statut : Disponible", "infos moto"
    assert quad.afficher_infos() == "Quad : Polaris Sportsman (2018) - 9000€ - Non homologué - Statut : Disponible", "infos quad"
    assert route.afficher_infos() == "Quad : Linc Farm (2022) - 11000€ - Homologué route - Statut : Disponible", "quad homologué"

    assert abs(moto.appliquer_remise(10) - 7200) < 1e-6, "remise héritée"
    assert abs(moto.prix - 7200) < 1e-6, "prix de la moto"
    assert moto.afficher_infos() == f"Moto : Yamaha MT-07 (2021) - {moto.prix}€ - 689 cm3 - Statut : Disponible", "infos après remise"
    assert clio.vendre() is True, "vente de la Clio"
    assert clio.afficher_infos() == "Voiture : Renault Clio (2020) - 15000€ - 25000 km - Statut : Vendu", "voiture vendue"

    vide = Concessionnaire("Auto Premium", "Paris")
    assert vide.nom == "Auto Premium" and vide.ville == "Paris", "identité"
    assert vide.disponibles() == [], "stock vide"
    assert vide.valeur_stock() == 0, "valeur nulle"
    assert vide.statistiques() == {"total": 0, "disponibles": 0, "valeur": 0, "voitures": 0, "motos": 0, "quads": 0}, "stats vides"

    stock = Concessionnaire("Auto Premium", "Paris")
    stock.ajouter(clio)
    stock.ajouter(moto)
    stock.ajouter(quad)
    stock.ajouter(route)
    assert [item.modele for item in stock.disponibles()] == ["MT-07", "Sportsman", "Farm"], "disponibles"
    assert abs(stock.valeur_stock() - (moto.prix + 9000 + 11000)) < 1e-6, "valeur du stock"
    stats = stock.statistiques()
    assert stats["total"] == 4, "total"
    assert stats["disponibles"] == 3, "disponibles"
    assert stats["voitures"] == 1, "voitures, vendue comprise"
    assert stats["motos"] == 1, "motos"
    assert stats["quads"] == 2, "quads"
    assert abs(stats["valeur"] - stock.valeur_stock()) < 1e-6, "valeur des stats"
    ```
    </Verification>
    <Correction>
    ```python
    class Vehicule:
        def __init__(self, marque, modele, annee, prix):
            self.marque = marque
            self.modele = modele
            self.annee = annee
            self.prix = prix
            self._est_vendu = False

        @property
        def est_vendu(self):
            return self._est_vendu

        def vendre(self):
            if self._est_vendu:
                return False
            self._est_vendu = True
            return True

        def appliquer_remise(self, pourcentage):
            self.prix = self.prix * (1 - pourcentage / 100)
            return self.prix

        def afficher_infos(self):
            statut = "Vendu" if self._est_vendu else "Disponible"
            return f"{self.marque} {self.modele} ({self.annee}) - {self.prix}€ - Statut : {statut}"


    class Voiture(Vehicule):
        def __init__(self, marque, modele, annee, prix, kilometrage):
            super().__init__(marque, modele, annee, prix)
            self.kilometrage = kilometrage

        def afficher_infos(self):
            statut = "Vendu" if self.est_vendu else "Disponible"
            return f"Voiture : {self.marque} {self.modele} ({self.annee}) - {self.prix}€ - {self.kilometrage} km - Statut : {statut}"


    class Moto(Vehicule):
        def __init__(self, marque, modele, annee, prix, cylindree):
            super().__init__(marque, modele, annee, prix)
            self.cylindree = cylindree

        def afficher_infos(self):
            statut = "Vendu" if self.est_vendu else "Disponible"
            return f"Moto : {self.marque} {self.modele} ({self.annee}) - {self.prix}€ - {self.cylindree} cm3 - Statut : {statut}"


    class Quad(Vehicule):
        def __init__(self, marque, modele, annee, prix, homologue_route):
            super().__init__(marque, modele, annee, prix)
            self.homologue_route = homologue_route

        def afficher_infos(self):
            statut = "Vendu" if self.est_vendu else "Disponible"
            homologation = "Homologué route" if self.homologue_route else "Non homologué"
            return f"Quad : {self.marque} {self.modele} ({self.annee}) - {self.prix}€ - {homologation} - Statut : {statut}"


    class Concessionnaire:
        def __init__(self, nom, ville):
            self.nom = nom
            self.ville = ville
            self._vehicules = []

        def ajouter(self, vehicule):
            self._vehicules.append(vehicule)

        def disponibles(self):
            return [vehicule for vehicule in self._vehicules if not vehicule.est_vendu]

        def valeur_stock(self):
            return sum(vehicule.prix for vehicule in self.disponibles())

        def statistiques(self):
            return {
                "total": len(self._vehicules),
                "disponibles": len(self.disponibles()),
                "valeur": self.valeur_stock(),
                "voitures": sum(1 for vehicule in self._vehicules if isinstance(vehicule, Voiture)),
                "motos": sum(1 for vehicule in self._vehicules if isinstance(vehicule, Moto)),
                "quads": sum(1 for vehicule in self._vehicules if isinstance(vehicule, Quad)),
            }
    ```
    </Correction>
  </ExerciseSection>

</ExerciseTabs>
