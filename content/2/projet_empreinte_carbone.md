---
title: 'Variables : Calculateur d''Empreinte Carbone'
description: Créer un outil pour estimer l'impact écologique d'un trajet.
level: premiere
chapter: Projets
icon: "sprout"
badgeId: premiere_projet_carbone
prerequisites:
  - projet_gestion_stock
audience: public
---

# <Icone nom="sprout" /> Projet - Calculateur d'Empreinte Carbone

Le but de ce projet est de créer un programme qui estime les émissions de CO2 d'un trajet selon le mode de transport.
Ce projet consiste à travailler les variables, `input`, les conversions de type et les conditions.

Les facteurs ci-dessous sont des ordres de grandeur pour l'exercice, pas un bilan carbone officiel.

## 1. Les facteurs <Icone nom="bike" />

| Choix | Mode | Facteur |
| --- | --- | --- |
| `"1"` | Voiture | 120 g de CO2 / km |
| `"2"` | Train | 10 g de CO2 / km |
| `"3"` | Avion | 250 g de CO2 / km |
| `"4"` | Vélo | 0 g de CO2 / km |

Émissions en grammes = distance × facteur. Pour passer en kilogrammes, on divise par 1000.

Messages, selon les kilogrammes :

*   0 kg : `Bravo, pas d'émission directe sur ce trajet.`
*   plus de 0 et strictement moins de 10 kg : `Trajet raisonnable.`
*   10 kg ou plus : `Trajet émetteur.`

<ExerciseTabs courseId="premiere_projet_carbone" courseTitle="Calculateur Carbone">
  <ExerciseSection id="proj-carb-1" label="Les fonctions" type="python">
    <Enonce>
      Écrire les quatre fonctions, et les vérifier avec des appels directs, avant d'écrire le dialogue.

      ```python
      def facteur_emission(choix: str) -> float:
          """Grammes de CO2 par km. Renvoie -1.0 si le choix est inconnu."""

      def emissions_g(distance: float, choix: str) -> float:
          """Grammes émis. Renvoie -1.0 si le choix est inconnu
          ou si la distance est inférieure ou égale à 0."""

      def emissions_kg(grammes: float) -> float:
          """Convertit des grammes en kilogrammes."""

      def message(kg: float) -> str:
          """Renvoie l'une des trois phrases, selon le barème."""
      ```

      Le choix `"1"` donne le facteur 120, `"2"` donne 10, `"3"` donne 250, `"4"` donne 0. Tout autre texte donne `-1.0`.

      `emissions_g` renvoie `distance * facteur`, ou `-1.0` si le facteur est inconnu ou si la distance est inférieure ou égale à 0.

      Contrôles : `facteur_emission("3")` vaut `250`, `facteur_emission("9")` vaut `-1.0`, `emissions_g(100, "1")` vaut `12000`, `emissions_kg(12000)` vaut `12.0`. `message(0)` renvoie la phrase du vélo, `message(0.5)` renvoie `Trajet raisonnable.`, `message(12)` renvoie `Trajet émetteur.`

      | Distance | Choix | Grammes | Kilogrammes | Message |
      | --- | --- | --- | --- | --- |
      | 100 | `"1"` voiture | 12 000 | 12 | Trajet émetteur. |
      | 100 | `"4"` vélo | 0 | 0 | Bravo, pas d'émission directe sur ce trajet. |
      | 250 | `"3"` avion | 62 500 | 62,5 | Trajet émetteur. |
      | 50 | `"2"` train | 500 | 0,5 | Trajet raisonnable. |

    <Correction>
    ```python
    def facteur_emission(choix):
        if choix == "1":
            return 120
        if choix == "2":
            return 10
        if choix == "3":
            return 250
        if choix == "4":
            return 0
        return -1.0

    def emissions_g(distance, choix):
        facteur = facteur_emission(choix)
        if facteur == -1.0 or distance <= 0:
            return -1.0
        return distance * facteur

    def emissions_kg(grammes):
        return grammes / 1000

    def message(kg):
        if kg == 0:
            return "Bravo, pas d'émission directe sur ce trajet."
        if kg < 10:
            return "Trajet raisonnable."
        return "Trajet émetteur."
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert facteur_emission("1") == 120 and facteur_emission("2") == 10 and facteur_emission("3") == 250 and facteur_emission("4") == 0, "Facteurs : 120, 10, 250 et 0."
    assert facteur_emission("9") == -1.0, "Un choix inconnu donne -1.0."
    assert emissions_g(100, "1") == 12000, "emissions_g(100, '1') vaut 12000."
    assert emissions_g(50, "2") == 500, "emissions_g(50, '2') vaut 500."
    assert emissions_g(100, "9") == -1.0, "Choix inconnu : -1.0."
    assert emissions_g(0, "1") == -1.0 and emissions_g(-3, "1") == -1.0, "Distance nulle ou négative : -1.0."
    assert emissions_kg(12000) == 12.0 and emissions_kg(62500) == 62.5, "emissions_kg divise par 1000."
    assert message(0) == "Bravo, pas d'émission directe sur ce trajet.", "0 kg : la phrase du vélo."
    assert message(0.5) == "Trajet raisonnable." and message(9.99) == "Trajet raisonnable.", "Moins de 10 kg : Trajet raisonnable."
    assert message(10) == "Trajet émetteur." and message(12) == "Trajet émetteur.", "10 kg ou plus : Trajet émetteur."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="proj-carb-2" label="Le dialogue" type="python">
    <CodeDepart>
    ```python
    def facteur_emission(choix):
        if choix == "1":
            return 120
        if choix == "2":
            return 10
        if choix == "3":
            return 250
        if choix == "4":
            return 0
        return -1.0

    def emissions_g(distance, choix):
        facteur = facteur_emission(choix)
        if facteur == -1.0 or distance <= 0:
            return -1.0
        return distance * facteur

    def emissions_kg(grammes):
        return grammes / 1000

    def message(kg):
        if kg == 0:
            return "Bravo, pas d'émission directe sur ce trajet."
        if kg < 10:
            return "Trajet raisonnable."
        return "Trajet émetteur."
    ```
    </CodeDepart>
    <Enonce>
      Écrire le programme principal du fichier `carbone.py`.

      1. Demander `Distance (km) : `. `input` renvoie un `str` : le convertir en `float`. Tant que la distance est inférieure ou égale à 0, reposer la question. Une distance `-3` ou `0` ne passe pas.
      2. Afficher les quatre lignes du menu, puis lire `Votre choix : `. Tant que `facteur_emission(choix)` vaut `-1.0`, réafficher le menu. Un choix `"9"` ne passe pas.
      3. Calculer les grammes, puis les kilogrammes.
      4. Afficher `Émissions : X.XX kg de CO2.` puis la phrase renvoyée par `message`.

      Le trajet 100 km / choix `1` produit :

      ```text
      Distance (km) : 100
      1. Voiture
      2. Train
      3. Avion
      4. Vélo
      Votre choix : 1
      Émissions : 12.00 kg de CO2.
      Trajet émetteur.
      ```

      Le trajet 100 km / choix `4` affiche `0.00` kg et la phrase du vélo.

    <Correction>
    ```python
    distance = float(input("Distance (km) : "))
    while distance <= 0:
        distance = float(input("Distance (km) : "))
    print("1. Voiture")
    print("2. Train")
    print("3. Avion")
    print("4. Vélo")
    choix = input("Votre choix : ")
    while facteur_emission(choix) == -1.0:
        print("1. Voiture")
        print("2. Train")
        print("3. Avion")
        print("4. Vélo")
        choix = input("Votre choix : ")
    kg = emissions_kg(emissions_g(distance, choix))
    print("Émissions : " + format(kg, ".2f") + " kg de CO2.")
    print(message(kg))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["-3", "0", "100", "9", "1"]
    assert distance == 100, "Les distances -3 et 0 sont refusées : la question est reposée jusqu'à 100."
    assert SORTIE.count("1. Voiture") == 2, "Le choix 9 est refusé : le menu est réaffiché."
    assert "Émissions : 12.00 kg de CO2." in SORTIE, "100 km en voiture : Émissions : 12.00 kg de CO2."
    assert SORTIE.strip().splitlines()[-1].strip() == "Trajet émetteur.", "La dernière ligne est la phrase de message : Trajet émetteur."
    variables, sortie = relancer(["100", "4"])
    assert "Émissions : 0.00 kg de CO2." in sortie and "Bravo" in sortie, "100 km à vélo : 0.00 kg et la phrase du vélo."
    variables, sortie = relancer(["50", "2"])
    assert "Émissions : 0.50 kg de CO2." in sortie and "Trajet raisonnable." in sortie, "50 km en train : 0.50 kg, Trajet raisonnable."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="proj-carb-3" label="Bonus" type="python">
    <CodeDepart>
    ```python
    def facteur_emission(choix):
        if choix == "1":
            return 120
        if choix == "2":
            return 10
        if choix == "3":
            return 250
        if choix == "4":
            return 0
        return -1.0

    def emissions_g(distance, choix):
        facteur = facteur_emission(choix)
        if facteur == -1.0 or distance <= 0:
            return -1.0
        return distance * facteur

    def emissions_kg(grammes):
        return grammes / 1000

    def message(kg):
        if kg == 0:
            return "Bravo, pas d'émission directe sur ce trajet."
        if kg < 10:
            return "Trajet raisonnable."
        return "Trajet émetteur."
    ```
    </CodeDepart>
    <Enonce>
      Trois ajouts, chacun dans une fonction, une fois le dialogue juste.

      - `distance_effective(distance, aller_retour)` : si `aller_retour` vaut `True`, renvoyer le double. Question : `Aller-retour ? (oui/non)`. Seul `oui` met le booléen à `True`. 100 km en voiture aller-retour donnent 24 kg.
      - `economie_train(distance, choix)` : renvoie les kilogrammes que l'on éviterait en prenant le train à la place. Pour 250 km en avion, le train émet 2,5 kg, l'avion 62,5 kg, l'économie vaut `60.0`. Pour le train et le vélo, afficher `Déjà le mode le plus sobre du comparateur.` et renvoyer `0.0`, jamais une économie négative.
      - `part_voiture(kg, passagers)` : renvoie les kilogrammes par personne, uniquement si le choix est la voiture. `passagers` compte le conducteur et vaut au moins 1, sinon on redemande. 100 km en voiture à 4 donnent `3.0` kg par personne.

    <Correction>
    ```python
    def distance_effective(distance, aller_retour):
        if aller_retour:
            return 2 * distance
        return distance

    def economie_train(distance, choix):
        if choix == "2" or choix == "4":
            print("Déjà le mode le plus sobre du comparateur.")
            return 0.0
        return emissions_kg(emissions_g(distance, choix)) - emissions_kg(emissions_g(distance, "2"))

    def part_voiture(kg, passagers):
        return kg / passagers

    print(emissions_kg(emissions_g(distance_effective(100, True), "1")))
    print(economie_train(250, "3"))
    print(part_voiture(12.0, 4))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    assert distance_effective(100, True) == 200 and distance_effective(100, False) == 100, "Aller-retour : la distance double."
    assert emissions_kg(emissions_g(distance_effective(100, True), "1")) == 24, "100 km en voiture aller-retour donnent 24 kg."
    valeur, _ = _sortie(economie_train, 250, "3")
    assert abs(valeur - 60.0) < 1e-9, "250 km en avion : l'économie vaut 60.0 kg."
    valeur, texte = _sortie(economie_train, 100, "2")
    assert valeur == 0.0 and "Déjà le mode le plus sobre du comparateur." in texte, "En train : afficher le message et renvoyer 0.0."
    valeur, texte = _sortie(economie_train, 100, "4")
    assert valeur == 0.0, "À vélo : pas d'économie négative, 0.0."
    assert part_voiture(12.0, 4) == 3.0, "12 kg à 4 passagers : 3.0 kg par personne."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `carbone.py` : commentaire d'en-tête avec le nom et la classe, les quatre fonctions, et le programme principal qui reproduit le dialogue. Les bonus viennent après, dans le même fichier.
