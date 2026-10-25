---
title: Mission AP2
description: Développement d'une application de gestion de flotte (C# / CSV / Web)
level: '4'
chapter: BTS SIO 1 SLAM AP
icon: "car"
prerequisites:
  - missionap1
audience: public
---

# Mission AP2 : Gestion de flotte AutoRent

Le but de cette mission est de moderniser la gestion du parc d'AutoRent, une agence de location.
Durée : 16 h (4 h par semaine, 4 semaines), atelier de professionnalisation, semestre 2.

Le siège envoie chaque jour un CSV brut. Deux outils sont à construire, qui se parlent par un fichier :

1. une application console C#, qui lit, contrôle et structure les véhicules ;
2. une page web (HTML, CSS, PHP), qui montre aux clients uniquement les véhicules disponibles.

**Compétences :** B1.2 Recenser et identifier les ressources numériques. B1.3 Développer la présence en ligne. B2.1 Concevoir et développer une solution applicative. B2.2 Assurer la maintenance corrective ou évolutive.

**Ressources :**
- [Fichier flotte.csv](/assets/ap2/flotte.csv)

## 1. La veille, avant le code <Icone nom="paperclip" />

La note tient sur une page au maximum et se rend avec le projet.

1. Héritage en C# : à quoi sert `:`, quelle est la différence entre la classe de base et la classe dérivée, peut-on hériter de plusieurs classes.
2. Polymorphisme : à quoi servent `virtual` et `override`, et comment une `List<Vehicule>` contient à la fois des voitures et des motos.
3. Un schéma, même crayonné, où `Voiture` et `Moto` héritent de `Vehicule`. Le camping-car s'y ajoute dans la section suivante.

## 2. Les données <Icone nom="car" />

Le CSV source utilise le point-virgule comme séparateur. `Divers1` et `Divers2` changent de sens selon le type : il faut les ranger dans les bonnes propriétés.

```csv
Type;Immatriculation;Marque;Modele;Prix;Km;Etat;Divers1;Divers2
Voiture;AB-123-CD;Peugeot;208;35;12000;Disponible;5;Oui
Moto;EF-456-GH;Yamaha;MT-07;45;5000;En maintenance;689;A
CampingCar;IJ-789-KL;Fiat;Ducato;120;45000;Loué;7.2;4
```

Lecture de la première ligne de données : une `Voiture`, immatriculation `AB-123-CD`, marque Peugeot, modèle 208, prix 35, 12 000 km, état Disponible, 5 places, climatisation Oui.

La moto : cylindrée 689, permis A. Le camping-car : longueur 7,2 m, 4 couchages.

<ExerciseTabs courseId="sio_ap2_modele" courseTitle="Modèle AutoRent">
  <ExerciseSection id="ap2-modele-1" label="Les classes" type="autre">
    <Enonce>
      Classe de base `Vehicule` : immatriculation, marque, modèle, prix par jour, kilométrage, état (`Disponible`, `En maintenance`, `Loué`).

      - `Voiture` : nombre de places, climatisation (oui ou non).
      - `Moto` : cylindrée en cm³, permis (A ou A2).
      - `CampingCar` : longueur en mètres, capacité de couchage.

      La colonne `Type` choisit la classe à construire. Une ligne `Voiture` ne devient pas une `Moto`.

      *Attention : un prix négatif est refusé, la ligne n'entre pas dans la liste. Une immatriculation qui n'a pas la forme deux lettres, trois chiffres, deux lettres (comme `AB-123-CD`) est refusée aussi. Afficher la ligne rejetée, et continuer le fichier.*

      Après chargement de l'exemple : 3 véhicules, dont 1 disponible (la 208). La moto est en maintenance, le camping-car est loué.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap2-modele-2" label="AfficherDetails" type="autre">
    <Enonce>
      `AfficherDetails()` est `virtual` sur `Vehicule` et `override` dans chaque classe. Une voiture affiche les places et la climatisation. Une moto affiche la cylindrée et le permis. Un camping-car affiche la longueur et les couchages. Le reste (immatriculation, marque, modèle, prix, état) est commun : il est écrit une fois, dans la classe de base.

      Contrôle sur la 208 : on lit `AB-123-CD`, `Peugeot`, `208`, `35`, `Disponible`, `5` places, climatisation `Oui`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. La console du gestionnaire <Icone nom="monitor" />

Au démarrage, l'application charge `flotte.csv`. Le menu ne plante pas sur un choix invalide : il réaffiche les options.

```text
1. Afficher le parc complet
2. Filtrer par type et par état
3. Rechercher par immatriculation
4. Simuler un devis
5. Statistiques
6. Exporter les disponibles
7. Quitter
```

<ExerciseTabs courseId="sio_ap2_console" courseTitle="Console">
  <ExerciseSection id="ap2-console-1" label="Filtres et recherche" type="autre">
    <Enonce>
      Le choix 1 liste les véhicules groupés par type : voitures, puis motos, puis camping-cars. Chacun passe par `AfficherDetails()`.

      Le choix 2 demande le type et l'état. « Motos disponibles » sur le fichier d'exemple n'affiche rien : la MT-07 est en maintenance. « Voitures disponibles » affiche la 208.

      Le choix 3 demande une immatriculation. `AB-123-CD` affiche la 208. `ZZ-000-ZZ` affiche `Véhicule introuvable.`
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap2-console-2" label="Devis et statistiques" type="autre">
    <Enonce>
      Le devis multiplie le prix par jour par le nombre de jours. Au-delà de 7 jours, une remise de 10 % s'applique sur le total. 7 jours tout juste : pas de remise.

      ```text
      AB-123-CD, 7 jours : 35 * 7 = 245
      AB-123-CD, 10 jours : 35 * 10 = 350, remise 35, à payer 315
      ```

      Un nombre de jours inférieur à 1 est refusé, le menu revient.

      Les statistiques affichent : le nombre de véhicules par type (1, 1 et 1 sur l'exemple), le revenu potentiel du parc si chaque véhicule était loué un jour (35 + 45 + 120 = 200), le plus cher (Ducato, 120) et le moins cher (208, 35).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap2-console-3" label="Export" type="autre">
    <Enonce>
      Le choix 6 écrit `disponibles.csv`, uniquement les véhicules à l'état Disponible. Sur l'exemple, une seule ligne de données : la 208. Les colonnes spécifiques suivent : places et climatisation pour une voiture, cylindrée et permis pour une moto, longueur et couchages pour un camping-car. L'en-tête nomme ces colonnes. Le site web lira ce fichier, pas `flotte.csv`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. La vitrine web <Icone nom="globe" />

`index.php` lit `disponibles.csv`. Chaque type a une icône (<Icone nom="car" />, <Icone nom="bike" /> ou <Icone nom="bus" />). Les caractéristiques spécifiques sont des badges : par exemple `Permis A` pour une moto, `5 places` pour la 208. Les cartes sont en grille, le CSS est dans un fichier à part.

Des boutons filtrent l'affichage : Tout, Voitures, Motos, Camping-cars. Sur l'export d'exemple, Tout et Voitures montrent la 208. Motos ne montre rien.

<ExerciseTabs courseId="sio_ap2_web" courseTitle="Vitrine">
  <ExerciseSection id="ap2-web-1" label="La grille" type="autre">
    <Enonce>
      La page ouverte après l'export affiche la Peugeot 208, son prix 35, l'icône voiture, et le badge des 5 places. La Yamaha et le Fiat n'apparaissent pas : ils ne sont pas disponibles.

      Le filtre Motos laisse la grille vide, avec le texte `Aucun véhicule dans cette catégorie.` Revenir sur Tout réaffiche la 208. Les chemins du CSV fonctionnent quand on ouvre la page depuis le dossier rendu.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 5. Ce qu'on rend <Icone nom="package" />

- Le projet C# (solution complète, code commenté), qui charge l'exemple et dont le devis 10 jours de la 208 affiche 315.
- Le diagramme de classes, avec les trois héritages et `AfficherDetails`.
- Les fichiers PHP et CSS, et le `disponibles.csv` produit par l'export.
- Un guide utilisateur PDF : comment lancer la console, exporter, puis ouvrir la page.

Le back-office prépare les données, le front-office les montre. Le format de `disponibles.csv` est décrit dans le guide : une personne qui n'a pas écrit le C# doit pouvoir le relire.
