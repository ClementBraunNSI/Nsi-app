---
title: 'Exercices : Dictionnaires'
description: 'Création, accès, modification et parcours des dictionnaires — fiche progressive par niveau.'
icon: "\U0001F4D6"
chapter: Dictionnaires et Tables
badgeId: premiere_exercices_dictionnaires
meta: 'Dictionnaires Python : clés, valeurs, parcours et dictionnaires imbriqués'
level: premiere
prerequisites:
  - python_exercices_listes
---

<ExerciseTabs courseId="les-dictionnaires-python" courseTitle="Les dictionnaires">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : INTRODUCTION (1.1 à 1.6)      */}
  {/* ========================================== */}

  <ExerciseSection id="dict-1-1" label="1.1 [Introduction] - Création d'un dictionnaire">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Création d'un dictionnaire
    **Écrire une fonction `creer_notes` qui renvoie le dictionnaire `{'Alice': 15, 'Bob': 12}`.**

    <Correction>
    ```python
    def creer_notes() -> dict:
        return {'Alice': 15, 'Bob': 12}
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'creer_notes' in locals(), "La fonction 'creer_notes' n'est pas définie."
assert creer_notes() == {'Alice': 15, 'Bob': 12}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-1-2" label="1.2 [Introduction] - Lire une valeur">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Lire une valeur
    **Écrire une fonction `lire_valeur` qui prend un dictionnaire `d` et une clé `cle`, et renvoie la valeur associée.**

    <Correction>
    ```python
    def lire_valeur(d: dict, cle):
        return d[cle]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'lire_valeur' in locals(), "La fonction 'lire_valeur' n'est pas définie."
notes = {'Alice': 15, 'Bob': 12}
assert lire_valeur(notes, 'Alice') == 15
assert lire_valeur(notes, 'Bob') == 12
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-1-3" label="1.3 [Introduction] - Ajouter une paire">
    <Enonce>
    ### Exercice 1.3 [Introduction] : Ajouter une paire
    **Écrire une fonction `ajouter_paire` qui prend un dictionnaire `d`, une clé et une valeur, ajoute la paire clé-valeur dans `d`, et renvoie `d`.**

    <Correction>
    ```python
    def ajouter_paire(d: dict, cle, valeur) -> dict:
        d[cle] = valeur
        return d
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ajouter_paire' in locals(), "La fonction 'ajouter_paire' n'est pas définie."
d = {'a': 1}
assert ajouter_paire(d, 'b', 2) == {'a': 1, 'b': 2}
assert d == {'a': 1, 'b': 2}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-1-4" label="1.4 [Introduction] - Présence d'une clé">
    <Enonce>
    ### Exercice 1.4 [Introduction] : Présence d'une clé
    **Écrire une fonction `contient_cle` qui prend un dictionnaire `d` et une clé, et renvoie `True` si la clé est présente, `False` sinon (avec l'opérateur `in`).**

    <Correction>
    ```python
    def contient_cle(d: dict, cle) -> bool:
        return cle in d
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'contient_cle' in locals(), "La fonction 'contient_cle' n'est pas définie."
d = {'x': 1, 'y': 2}
assert contient_cle(d, 'x') is True
assert contient_cle(d, 'z') is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-1-5" label="1.5 [Introduction] - Nombre de clés">
    <Enonce>
    ### Exercice 1.5 [Introduction] : Nombre de clés
    **Écrire une fonction `nb_cles` qui prend un dictionnaire et renvoie son nombre de clés (avec `len()`).**

    <Correction>
    ```python
    def nb_cles(d: dict) -> int:
        return len(d)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nb_cles' in locals(), "La fonction 'nb_cles' n'est pas définie."
assert nb_cles({'a': 1, 'b': 2, 'c': 3}) == 3
assert nb_cles({}) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-1-6" label="1.6 [Introduction] - Liste des clés">
    <Enonce>
    ### Exercice 1.6 [Introduction] : Liste des clés
    **Écrire une fonction `liste_cles` qui prend un dictionnaire et renvoie la liste de ses clés (avec une boucle `for` sur `d`, sans utiliser `list(d.keys())`).**

    <Correction>
    ```python
    def liste_cles(d: dict) -> list:
        cles = []
        for cle in d:
            cles.append(cle)
        return cles
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'liste_cles' in locals(), "La fonction 'liste_cles' n'est pas définie."
assert sorted(liste_cles({'b': 2, 'a': 1})) == ['a', 'b']
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : FACILE (2.1 à 2.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="dict-2-1" label="2.1 [Facile] - Ajouter un élève">
    <Enonce>
    ### Exercice 2.1 [Facile] : Ajouter un élève
    **Écrire une fonction `ajouter_eleve` qui prend un dictionnaire `notes` (nom → moyenne), un `nom` et une `moyenne`. Si le nom n'existe pas encore, l'ajoute et renvoie `True` ; sinon renvoie `False` sans modifier la moyenne existante.**

    <Correction>
    ```python
    def ajouter_eleve(notes: dict, nom: str, moyenne: int) -> bool:
        if nom in notes:
            return False
        notes[nom] = moyenne
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ajouter_eleve' in locals(), "La fonction 'ajouter_eleve' n'est pas définie."
notes = {'Alice': 15}
assert ajouter_eleve(notes, 'Eve', 16) is True
assert notes['Eve'] == 16
assert ajouter_eleve(notes, 'Alice', 0) is False
assert notes['Alice'] == 15
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-2-2" label="2.2 [Facile] - Modifier une moyenne">
    <Enonce>
    ### Exercice 2.2 [Facile] : Modifier une moyenne
    **Écrire une fonction `modifier_moyenne` qui prend un dictionnaire `notes`, un `nom` et une `nouvelle_moyenne`. Met à jour la moyenne si l'élève existe (`True`), sinon renvoie `False`.**

    <Correction>
    ```python
    def modifier_moyenne(notes: dict, nom: str, nouvelle_moyenne: int) -> bool:
        if nom not in notes:
            return False
        notes[nom] = nouvelle_moyenne
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'modifier_moyenne' in locals(), "La fonction 'modifier_moyenne' n'est pas définie."
notes = {'Alice': 15, 'Bob': 10}
assert modifier_moyenne(notes, 'Alice', 18) is True
assert notes['Alice'] == 18
assert modifier_moyenne(notes, 'Inconnu', 20) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-2-3" label="2.3 [Facile] - Élèves au-dessus d'un seuil">
    <Enonce>
    ### Exercice 2.3 [Facile] : Élèves au-dessus d'un seuil
    **Écrire une fonction `eleves_mention` qui prend un dictionnaire `notes` et un `seuil`, et renvoie la liste des noms d'élèves dont la moyenne est ≥ `seuil`.**

    <Correction>
    ```python
    def eleves_mention(notes: dict, seuil: int) -> list:
        resultat = []
        for eleve in notes:
            if notes[eleve] >= seuil:
                resultat.append(eleve)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'eleves_mention' in locals(), "La fonction 'eleves_mention' n'est pas définie."
notes = {'Alice': 15, 'Bob': 10}
assert 'Alice' in eleves_mention(notes, 12)
assert 'Bob' not in eleves_mention(notes, 12)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-2-4" label="2.4 [Facile] - Voitures par couleur">
    <Enonce>
    ### Exercice 2.4 [Facile] : Voitures par couleur
    Un dictionnaire `voitures` associe chaque modèle à un sous-dictionnaire `{'prix': ..., 'couleur': ...}`.
    **Écrire une fonction `voitures_par_couleur` qui renvoie la liste des modèles de la couleur demandée.**

    <Correction>
    ```python
    def voitures_par_couleur(voitures: dict, couleur: str) -> list:
        resultat = []
        for modele, infos in voitures.items():
            if infos['couleur'] == couleur:
                resultat.append(modele)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'voitures_par_couleur' in locals(), "La fonction 'voitures_par_couleur' n'est pas définie."
voitures = {
    'A': {'prix': 10000, 'couleur': 'rouge'},
    'B': {'prix': 20000, 'couleur': 'bleu'},
    'C': {'prix': 15000, 'couleur': 'rouge'}
}
assert set(voitures_par_couleur(voitures, 'rouge')) == {'A', 'C'}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-2-5" label="2.5 [Facile] - Voitures dans un budget">
    <Enonce>
    ### Exercice 2.5 [Facile] : Voitures dans un budget
    **Écrire une fonction `voitures_budget` qui prend un dictionnaire `voitures` (modèle → `{'prix': ...}`) et un `budget`, et renvoie la liste des modèles dont le prix est ≤ `budget`.**

    <Correction>
    ```python
    def voitures_budget(voitures: dict, budget: int) -> list:
        resultat = []
        for modele, infos in voitures.items():
            if infos['prix'] <= budget:
                resultat.append(modele)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'voitures_budget' in locals(), "La fonction 'voitures_budget' n'est pas définie."
voitures = {
    'A': {'prix': 10000, 'couleur': 'rouge'},
    'B': {'prix': 20000, 'couleur': 'bleu'},
    'C': {'prix': 15000, 'couleur': 'rouge'}
}
assert set(voitures_budget(voitures, 16000)) == {'A', 'C'}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-2-6" label="2.6 [Facile] - Produits en rupture">
    <Enonce>
    ### Exercice 2.6 [Facile] : Produits en rupture
    **Écrire une fonction `produits_en_rupture` qui prend un dictionnaire `inventaire` (produit → `{'prix': ..., 'stock': ...}`) et renvoie la liste des produits dont le stock est ≤ 10.**

    <Correction>
    ```python
    def produits_en_rupture(inventaire: dict) -> list:
        rupture = []
        for produit, infos in inventaire.items():
            if infos['stock'] <= 10:
                rupture.append(produit)
        return rupture
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'produits_en_rupture' in locals(), "La fonction 'produits_en_rupture' n'est pas définie."
inventaire = {
    'pommes': {'prix': 2.5, 'stock': 50},
    'oranges': {'prix': 3.0, 'stock': 5}
}
assert 'oranges' in produits_en_rupture(inventaire)
assert 'pommes' not in produits_en_rupture(inventaire)
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : MOYEN (3.1 à 3.6)             */}
  {/* ========================================== */}

  <ExerciseSection id="dict-3-1" label="3.1 [Moyen] - Livres disponibles">
    <Enonce>
    ### Exercice 3.1 [Moyen] : Livres disponibles
    **Écrire une fonction `livres_disponibles` qui prend un dictionnaire `bibliotheque` (titre → `{'disponible': bool}`) et renvoie la liste des titres disponibles.**

    <Correction>
    ```python
    def livres_disponibles(bibliotheque: dict) -> list:
        resultat = []
        for titre, infos in bibliotheque.items():
            if infos['disponible']:
                resultat.append(titre)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'livres_disponibles' in locals(), "La fonction 'livres_disponibles' n'est pas définie."
bib = {'A': {'disponible': True}, 'B': {'disponible': False}}
assert livres_disponibles(bib) == ['A']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-3-2" label="3.2 [Moyen] - Emprunter un livre">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Emprunter un livre
    **Écrire une fonction `emprunter_livre` qui prend `bibliotheque` et un `titre`.**
    - Livre trouvé et disponible → passe `disponible` à `False`, renvoie `"emprunte"`.
    - Livre trouvé mais indisponible → renvoie `"deja_emprunte"`.
    - Livre absent → renvoie `"introuvable"`.

    <Correction>
    ```python
    def emprunter_livre(bibliotheque: dict, titre: str) -> str:
        if titre not in bibliotheque:
            return "introuvable"
        if bibliotheque[titre]['disponible']:
            bibliotheque[titre]['disponible'] = False
            return "emprunte"
        return "deja_emprunte"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'emprunter_livre' in locals(), "La fonction 'emprunter_livre' n'est pas définie."
bib = {'A': {'disponible': True}, 'B': {'disponible': False}}
assert emprunter_livre(bib, 'A') == "emprunte"
assert bib['A']['disponible'] is False
assert emprunter_livre(bib, 'B') == "deja_emprunte"
assert emprunter_livre(bib, 'Z') == "introuvable"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-3-3" label="3.3 [Moyen] - Contacts par ville">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Contacts par ville
    **Écrire une fonction `contacts_par_ville` qui prend un dictionnaire `contacts` (nom → `{'ville': ...}`) et une `ville`, et renvoie la liste des noms dans cette ville.**

    <Correction>
    ```python
    def contacts_par_ville(contacts: dict, ville: str) -> list:
        resultat = []
        for nom, infos in contacts.items():
            if infos['ville'] == ville:
                resultat.append(nom)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'contacts_par_ville' in locals(), "La fonction 'contacts_par_ville' n'est pas définie."
contacts = {
    'Alice': {'telephone': '01', 'ville': 'Paris'},
    'Bob': {'telephone': '02', 'ville': 'Lyon'}
}
assert contacts_par_ville(contacts, 'Paris') == ['Alice']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-3-4" label="3.4 [Moyen] - Moyenne par matière">
    <Enonce>
    ### Exercice 3.4 [Moyen] : Moyenne par matière
    Un dictionnaire `classe` associe chaque élève à un sous-dictionnaire matière → liste de notes.
    **Écrire une fonction `moyenne_matiere` qui renvoie la moyenne arrondie à 2 décimales de l'élève dans la matière, ou `0` si l'élève ou la matière est absente.**

    <Correction>
    ```python
    def moyenne_matiere(classe: dict, eleve: str, matiere: str) -> float:
        if eleve not in classe or matiere not in classe[eleve]:
            return 0
        notes = classe[eleve][matiere]
        if not notes:
            return 0
        return round(sum(notes) / len(notes), 2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne_matiere' in locals(), "La fonction 'moyenne_matiere' n'est pas définie."
classe = {'Test': {'M1': [10, 20]}}
assert moyenne_matiere(classe, 'Test', 'M1') == 15
assert moyenne_matiere(classe, 'Test', 'M2') == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-3-5" label="3.5 [Moyen] - Ventes totales par mois">
    <Enonce>
    ### Exercice 3.5 [Moyen] : Ventes totales par mois
    Un dictionnaire `ventes` associe chaque mois à un sous-dictionnaire produit → quantité vendue.
    **Écrire une fonction `ventes_totales_mois` qui renvoie la somme des ventes du mois demandé, ou `0` si le mois est absent.**

    <Correction>
    ```python
    def ventes_totales_mois(ventes: dict, mois: str) -> int:
        if mois not in ventes:
            return 0
        total = 0
        for quantite in ventes[mois].values():
            total += quantite
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ventes_totales_mois' in locals(), "La fonction 'ventes_totales_mois' n'est pas définie."
ventes = {'J': {'A': 10, 'B': 5}, 'F': {'A': 5, 'B': 5}}
assert ventes_totales_mois(ventes, 'J') == 15
assert ventes_totales_mois(ventes, 'M') == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-3-6" label="3.6 [Moyen] - Valeur totale du stock">
    <Enonce>
    ### Exercice 3.6 [Moyen] : Valeur totale du stock
    **Écrire une fonction `valeur_totale_stock` qui prend un dictionnaire `inventaire` (produit → `{'prix': ..., 'stock': ...}`) et renvoie la valeur totale du stock (somme de `prix × stock`).**

    <Correction>
    ```python
    def valeur_totale_stock(inventaire: dict) -> float:
        total = 0
        for infos in inventaire.values():
            total += infos['prix'] * infos['stock']
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'valeur_totale_stock' in locals(), "La fonction 'valeur_totale_stock' n'est pas définie."
inventaire = {
    'pommes': {'prix': 2.5, 'stock': 50},
    'oranges': {'prix': 3.0, 'stock': 5}
}
assert valeur_totale_stock(inventaire) == (2.5 * 50 + 3.0 * 5)
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : AVANCÉ (4.1 à 4.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="dict-4-1" label="4.1 [Avancé] - Ventes totales par produit">
    <Enonce>
    ### Exercice 4.1 [Avancé] : Ventes totales par produit
    **Écrire une fonction `ventes_totales_produit` qui prend un dictionnaire `ventes` (mois → {produit → quantité}) et un `produit`, et renvoie le total vendu sur tous les mois.**

    <Correction>
    ```python
    def ventes_totales_produit(ventes: dict, produit: str) -> int:
        total = 0
        for mois in ventes:
            if produit in ventes[mois]:
                total += ventes[mois][produit]
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ventes_totales_produit' in locals(), "La fonction 'ventes_totales_produit' n'est pas définie."
ventes = {'J': {'A': 10, 'B': 5}, 'F': {'A': 5, 'B': 5}}
assert ventes_totales_produit(ventes, 'A') == 15
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-4-2" label="4.2 [Avancé] - Produit le plus vendu">
    <Enonce>
    ### Exercice 4.2 [Avancé] : Produit le plus vendu
    **Écrire une fonction `produit_le_plus_vendu` qui prend un dictionnaire `ventes` et renvoie un tuple `(produit, total)` du produit ayant le plus de ventes cumulées.**

    <Correction>
    ```python
    def produit_le_plus_vendu(ventes: dict) -> tuple:
        cumul = {}
        for mois in ventes:
            for produit, quantite in ventes[mois].items():
                cumul[produit] = cumul.get(produit, 0) + quantite

        meilleur = None
        max_ventes = -1
        for produit, total in cumul.items():
            if total > max_ventes:
                max_ventes = total
                meilleur = produit
        return meilleur, max_ventes
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'produit_le_plus_vendu' in locals(), "La fonction 'produit_le_plus_vendu' n'est pas définie."
ventes = {'J': {'A': 10, 'B': 5}, 'F': {'A': 5, 'B': 5}}
assert produit_le_plus_vendu(ventes) == ('A', 15)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-4-3" label="4.3 [Avancé] - Valeur totale de l'inventaire">
    <Enonce>
    ### Exercice 4.3 [Avancé] : Valeur totale de l'inventaire
    **Écrire une fonction `valeur_totale_inventaire` qui prend un dictionnaire `inventaire` (produit → `{'quantite': ..., 'prix': ...}`) et renvoie la valeur totale (`quantite × prix` pour chaque produit).**

    <Correction>
    ```python
    def valeur_totale_inventaire(inventaire: dict) -> float:
        total = 0
        for infos in inventaire.values():
            total += infos['quantite'] * infos['prix']
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'valeur_totale_inventaire' in locals(), "La fonction 'valeur_totale_inventaire' n'est pas définie."
inv = {
    'A': {'quantite': 10, 'prix': 100, 'categorie': 'X'},
    'B': {'quantite': 5, 'prix': 200, 'categorie': 'Y'}
}
assert valeur_totale_inventaire(inv) == 2000
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-4-4" label="4.4 [Avancé] - Produits par catégorie">
    <Enonce>
    ### Exercice 4.4 [Avancé] : Produits par catégorie
    **Écrire une fonction `produits_par_categorie` qui prend un dictionnaire `inventaire` (produit → `{'categorie': ...}`) et une `categorie`, et renvoie la liste des produits de cette catégorie.**

    <Correction>
    ```python
    def produits_par_categorie(inventaire: dict, categorie: str) -> list:
        resultat = []
        for nom, infos in inventaire.items():
            if infos['categorie'] == categorie:
                resultat.append(nom)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'produits_par_categorie' in locals(), "La fonction 'produits_par_categorie' n'est pas définie."
inv = {
    'A': {'quantite': 10, 'prix': 100, 'categorie': 'X'},
    'B': {'quantite': 5, 'prix': 200, 'categorie': 'Y'}
}
assert produits_par_categorie(inv, 'X') == ['A']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-4-5" label="4.5 [Avancé] - Mention d'un élève">
    <Enonce>
    ### Exercice 4.5 [Avancé] : Mention d'un élève
    **Écrire une fonction `mention` qui prend une moyenne sur 20 et renvoie :**
    - `"Excellent"` si moyenne ≥ 16
    - `"Bien"` si 12 ≤ moyenne ≤ 15
    - `"À améliorer"` sinon

    <Correction>
    ```python
    def mention(moyenne: int) -> str:
        if moyenne >= 16:
            return "Excellent"
        if moyenne >= 12:
            return "Bien"
        return "À améliorer"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mention' in locals(), "La fonction 'mention' n'est pas définie."
assert mention(17) == "Excellent"
assert mention(14) == "Bien"
assert mention(9) == "À améliorer"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-4-6" label="4.6 [Avancé] - Fusionner deux dictionnaires">
    <Enonce>
    ### Exercice 4.6 [Avancé] : Fusionner deux dictionnaires
    **Écrire une fonction `fusionner` qui prend deux dictionnaires `d1` et `d2` et renvoie un **nouveau** dictionnaire contenant toutes les paires des deux. En cas de clé commune, la valeur de `d2` prévaut.**

    <Correction>
    ```python
    def fusionner(d1: dict, d2: dict) -> dict:
        resultat = {}
        for cle, valeur in d1.items():
            resultat[cle] = valeur
        for cle, valeur in d2.items():
            resultat[cle] = valeur
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'fusionner' in locals(), "La fonction 'fusionner' n'est pas définie."
assert fusionner({'a': 1, 'b': 2}, {'b': 9, 'c': 3}) == {'a': 1, 'b': 9, 'c': 3}
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : DIFFICILE (5.1 à 5.6)         */}
  {/* ========================================== */}

  <ExerciseSection id="dict-5-1" label="5.1 [Difficile] - Compter les mots">
    <Enonce>
    ### Exercice 5.1 [Difficile] : Compter les mots
    **Écrire une fonction `compter_mots` qui prend un texte et renvoie un dictionnaire {mot: fréquence}.**
    Ignorer la casse (tout en minuscules) et la ponctuation.
    *Exemple : `"Salut salut!"` → `{'salut': 2}`.*

    <Correction>
    ```python
    import string

    def compter_mots(texte: str) -> dict:
        texte = texte.lower()
        for ponctuation in string.punctuation:
            texte = texte.replace(ponctuation, '')
        freq = {}
        for mot in texte.split():
            freq[mot] = freq.get(mot, 0) + 1
        return freq
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_mots' in locals(), "La fonction 'compter_mots' n'est pas définie."
res = compter_mots("Bonjour, le monde! Bonjour le monde.")
assert res['bonjour'] == 2
assert res['monde'] == 2
assert res['le'] == 2
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-5-2" label="5.2 [Difficile] - Mot le plus fréquent">
    <Enonce>
    ### Exercice 5.2 [Difficile] : Mot le plus fréquent
    **Écrire une fonction `mot_plus_frequent` qui prend un texte et renvoie le mot le plus fréquent (en minuscules, sans ponctuation). En cas d'égalité, renvoyer le premier rencontré.**

    <Correction>
    ```python
    import string

    def mot_plus_frequent(texte: str) -> str:
        texte = texte.lower()
        for ponctuation in string.punctuation:
            texte = texte.replace(ponctuation, '')
        freq = {}
        for mot in texte.split():
            freq[mot] = freq.get(mot, 0) + 1
        meilleur_mot = None
        meilleur_score = -1
        for mot, score in freq.items():
            if score > meilleur_score:
                meilleur_score = score
                meilleur_mot = mot
        return meilleur_mot
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mot_plus_frequent' in locals(), "La fonction 'mot_plus_frequent' n'est pas définie."
assert mot_plus_frequent("chat chien chat") == "chat"
assert mot_plus_frequent("a b c") == "a"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-5-3" label="5.3 [Difficile] - Inverser un dictionnaire">
    <Enonce>
    ### Exercice 5.3 [Difficile] : Inverser un dictionnaire
    **Écrire une fonction `inverser_dictionnaire` qui prend un dictionnaire dont les valeurs sont uniques et renvoie un nouveau dictionnaire où clés et valeurs sont échangées.**

    <Correction>
    ```python
    def inverser_dictionnaire(d: dict) -> dict:
        inverse = {}
        for cle, valeur in d.items():
            inverse[valeur] = cle
        return inverse
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'inverser_dictionnaire' in locals(), "La fonction 'inverser_dictionnaire' n'est pas définie."
assert inverser_dictionnaire({'a': 1, 'b': 2}) == {1: 'a', 2: 'b'}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-5-4" label="5.4 [Difficile] - Filtrer par valeur">
    <Enonce>
    ### Exercice 5.4 [Difficile] : Filtrer par valeur
    **Écrire une fonction `filtrer_cles_par_valeur` qui prend un dictionnaire `d` et un `seuil`, et renvoie la liste des clés dont la valeur est ≥ `seuil`.**

    <Correction>
    ```python
    def filtrer_cles_par_valeur(d: dict, seuil: int) -> list:
        resultat = []
        for cle, valeur in d.items():
            if valeur >= seuil:
                resultat.append(cle)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'filtrer_cles_par_valeur' in locals(), "La fonction 'filtrer_cles_par_valeur' n'est pas définie."
notes = {'Alice': 15, 'Bob': 10, 'Charlie': 18}
assert sorted(filtrer_cles_par_valeur(notes, 12)) == ['Alice', 'Charlie']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-5-5" label="5.5 [Difficile] - Moyenne des notes">
    <Enonce>
    ### Exercice 5.5 [Difficile] : Moyenne des notes
    **Écrire une fonction `moyenne_notes` qui prend un dictionnaire `notes` (nom → moyenne) et renvoie la moyenne de toutes les moyennes, arrondie à 2 décimales. Renvoie `0` si le dictionnaire est vide.**

    <Correction>
    ```python
    def moyenne_notes(notes: dict) -> float:
        if not notes:
            return 0
        total = 0
        for moyenne in notes.values():
            total += moyenne
        return round(total / len(notes), 2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne_notes' in locals(), "La fonction 'moyenne_notes' n'est pas définie."
assert moyenne_notes({'Alice': 15, 'Bob': 12}) == 13.5
assert moyenne_notes({}) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-5-6" label="5.6 [Difficile] - Compter par catégorie">
    <Enonce>
    ### Exercice 5.6 [Difficile] : Compter par catégorie
    **Écrire une fonction `compter_categories` qui prend un dictionnaire `inventaire` (produit → `{'categorie': ...}`) et renvoie un dictionnaire {catégorie: nombre de produits}.**

    <Correction>
    ```python
    def compter_categories(inventaire: dict) -> dict:
        compteur = {}
        for infos in inventaire.values():
            categorie = infos['categorie']
            compteur[categorie] = compteur.get(categorie, 0) + 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_categories' in locals(), "La fonction 'compter_categories' n'est pas définie."
inv = {
    'pommes': {'categorie': 'fruits'},
    'bananes': {'categorie': 'fruits'},
    'carottes': {'categorie': 'legumes'}
}
assert compter_categories(inv) == {'fruits': 2, 'legumes': 1}
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 6 : EXPERT (6.1 à 6.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="dict-6-1" label="6.1 [Expert] - Index par auteur">
    <Enonce>
    ### Exercice 6.1 [Expert] : Index par auteur
    **Écrire une fonction `index_par_auteur` qui prend un dictionnaire `bibliotheque` (titre → `{'auteur': ...}`) et renvoie un dictionnaire {auteur: [liste des titres]}.**

    <Correction>
    ```python
    def index_par_auteur(bibliotheque: dict) -> dict:
        index = {}
        for titre, infos in bibliotheque.items():
            auteur = infos['auteur']
            if auteur not in index:
                index[auteur] = []
            index[auteur].append(titre)
        return index
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'index_par_auteur' in locals(), "La fonction 'index_par_auteur' n'est pas définie."
bib = {
    'Le Petit Prince': {'auteur': 'Saint-Exupery'},
    '1984': {'auteur': 'Orwell'},
    'Animal Farm': {'auteur': 'Orwell'}
}
index = index_par_auteur(bib)
assert sorted(index['Orwell']) == ['1984', 'Animal Farm']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-6-2" label="6.2 [Expert] - Ventes cumulées par produit">
    <Enonce>
    ### Exercice 6.2 [Expert] : Ventes cumulées par produit
    **Écrire une fonction `ventes_cumulees` qui prend un dictionnaire `ventes` (mois → {produit → quantité}) et renvoie un dictionnaire {produit: total sur tous les mois}.**

    <Correction>
    ```python
    def ventes_cumulees(ventes: dict) -> dict:
        cumul = {}
        for mois in ventes:
            for produit, quantite in ventes[mois].items():
                cumul[produit] = cumul.get(produit, 0) + quantite
        return cumul
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ventes_cumulees' in locals(), "La fonction 'ventes_cumulees' n'est pas définie."
ventes = {'J': {'A': 10, 'B': 5}, 'F': {'A': 5, 'B': 8}}
assert ventes_cumulees(ventes) == {'A': 15, 'B': 13}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="dict-6-3" label="6.3 [Expert] - Moyenne générale d'un élève">
    <Enonce>
    ### Exercice 6.3 [Expert] : Moyenne générale d'un élève
    Un dictionnaire `classe` associe chaque élève à un sous-dictionnaire matière → liste de notes.
    **Écrire une fonction `moyenne_generale` qui renvoie la moyenne des moyennes par matière de l'élève, arrondie à 2 décimales, ou `0` si l'élève est absent ou n'a aucune note.**

    <Correction>
    ```python
    def moyenne_generale(classe: dict, eleve: str) -> float:
        if eleve not in classe:
            return 0
        moyennes = []
        for matiere in classe[eleve]:
            notes = classe[eleve][matiere]
            if notes:
                moyennes.append(sum(notes) / len(notes))
        if not moyennes:
            return 0
        return round(sum(moyennes) / len(moyennes), 2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne_generale' in locals(), "La fonction 'moyenne_generale' n'est pas définie."
classe = {
    'Alice': {'Maths': [15, 12], 'Francais': [14]},
    'Bob': {'Maths': [10], 'Francais': [13, 11]}
}
assert moyenne_generale(classe, 'Alice') == 13.75
assert moyenne_generale(classe, 'Bob') == 11.0
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
