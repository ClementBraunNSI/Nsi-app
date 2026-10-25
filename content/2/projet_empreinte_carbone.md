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
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-carb-2" label="Le dialogue" type="python">
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
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-carb-3" label="Bonus" type="lecture">
    <Enonce>
      Trois ajouts, chacun dans une fonction, une fois le dialogue juste.

      - `distance_effective(distance, aller_retour)` : si `aller_retour` vaut `True`, renvoyer le double. Question : `Aller-retour ? (oui/non)`. Seul `oui` met le booléen à `True`. 100 km en voiture aller-retour donnent 24 kg.
      - `economie_train(distance, choix)` : kilogrammes que l'on éviterait en prenant le train à la place. Pour 250 km en avion, le train émet 2,5 kg, l'avion 62,5 kg, l'économie affichée est `60.00 kg`. Pour le train et le vélo, afficher `Déjà le mode le plus sobre du comparateur.` et ne pas donner une économie négative.
      - `part_voiture(kg, passagers)` : uniquement si le choix est la voiture. `passagers` compte le conducteur et vaut au moins 1, sinon on redemande. 100 km en voiture à 4 donnent `3.00 kg` par personne.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `carbone.py` : commentaire d'en-tête avec le nom et la classe, les quatre fonctions, et le programme principal qui reproduit le dialogue. Les bonus viennent après, dans le même fichier.
