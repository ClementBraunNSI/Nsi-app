---
title: Mission AP3
description: Evolution de la mission AP2 vers une architecture MVC et une application graphique C#
level: '4'
chapter: BTS SIO 1 SLAM AP
icon: "puzzle"
prerequisites:
  - missionap2
audience: public
---

# Mission AP3 : AutoRent en MVC et en application graphique

Le but de cette mission est de faire évoluer AutoRent, sans en changer le métier.
Cette mission dure 12 h (4 h par semaine pendant 3 semaines) et se déroule en atelier de professionnalisation, au semestre 2. Elle fait directement suite à la mission AP2.

L'AP2 a livré une console C# et une page PHP qui lit `disponibles.csv`. Deux évolutions sont obligatoires :

1. remplacer la page PHP procédurale par une architecture MVC ;
2. remplacer la console par une application graphique (WinForms, WPF, Avalonia, ou une technologie équivalente validée en classe).

Les véhicules, les états, le devis et l'export restent ceux de l'AP2. Il ne s'agit pas de recommencer le sujet.

**Compétences :** B1.3 Développer la présence en ligne. B2.1 Concevoir et développer une solution applicative. B2.2 Assurer la maintenance corrective ou évolutive.

## 1. La veille, avant de coder <Icone nom="paperclip" />

La note tient sur une page au maximum.

1. Expliquer le rôle du modèle, de la vue et du contrôleur, et ce que le MVC change pour la maintenance par rapport à une page PHP qui mélange la requête, le calcul et le HTML. Indiquer aussi les points qui sécurisent l'architecture : l'échappement du HTML, des requêtes qui n'intègrent jamais une saisie brute, et l'inclusion des fichiers avec l'instruction prévue par le langage.
2. Distinguer, dans l'application graphique, ce qui relève du métier (devis, filtre, export) et ce qui relève de l'interface (bouton, grille, message). Un clic appelle une méthode métier, mais le devis n'est pas recalculé dans le gestionnaire d'événement.

## 2. Le web en MVC <Icone nom="puzzle" />

La page d'accueil sert de vitrine : elle affiche en grille tous les véhicules **disponibles**, sans les véhicules en maintenance ou loués. Sur le jeu d'essai de l'AP2, la grille contient donc la Peugeot 208, mais ni la Yamaha MT-07 ni le Fiat Ducato.

<ExerciseTabs courseId="sio_ap3_mvc" courseTitle="MVC">
  <ExerciseSection id="ap3-mvc-1" label="Les trois couches" type="autre">
    <Enonce>
      Ranger le projet en modèle, vue et contrôleur.

      - Le modèle représente un véhicule (immatriculation, marque, modèle, prix, état, champs spécifiques) et refuse un prix négatif.
      - Le contrôleur lit la demande et choisit la vue. Il ne contient pas le CSS.
      - La vue affiche. Elle ne recalcule pas le devis et elle n'écrit pas dans le CSV.

      Le cœur du sujet comporte quatre actions, et pas davantage :

      1. catalogue des disponibles ;
      2. filtre par type (voiture, moto, camping-car) ;
      3. fiche d'un véhicule, à partir de son immatriculation ;
      4. tri par prix croissant.

      Vérifier, dans cet ordre, que la grille montre la 208 à 35 €, que le filtre moto affiche `Aucun véhicule disponible.` et que la fiche `AB-123-CD` indique 5 places et la climatisation. Quand plusieurs véhicules sont disponibles, le tri par prix doit placer le moins cher en premier.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap3-mvc-2" label="Sécurité de la page" type="autre">
    <Enonce>
      Une immatriculation ou un type saisi dans l'adresse ne doit pas être affiché tel quel dans la page : les caractères HTML doivent être encodés. Ainsi, le texte `<script>` saisi dans une recherche s'affiche comme du texte, sans être exécuté.

      Les fichiers externes (CSS, et le CSV s'il est lu côté serveur) sont inclus avec l'instruction prévue à cet effet, et jamais à partir d'une chaîne construite avec une saisie. Le CSS est dans un fichier externe. Les composants qui se répètent (carte véhicule, badge) sont écrits une fois.

      Relire le cours sur les injections SQL et les failles XSS, et indiquer dans un commentaire de la vue où l'encodage a lieu.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. L'application graphique <Icone nom="image" />

L'écran principal montre toute la flotte, et pas seulement les véhicules disponibles, car c'est l'outil de travail de l'agent. La vitrine web, elle, continue de n'afficher que les véhicules disponibles.

Au démarrage, les données sont chargées (fichier source, ou sauvegarde locale). L'écran contient : la liste ou la grille, une zone de recherche, les filtres de type et d'état, un bouton d'actualisation.

<ExerciseTabs courseId="sio_ap3_gui" courseTitle="Application graphique">
  <ExerciseSection id="ap3-gui-1" label="L'écran" type="autre">
    <Enonce>
      Le menu console de l'AP2 disparaît, et les mêmes traitements deviennent des actions de l'écran :

      - recherche par immatriculation : `AB-123-CD` sélectionne la 208, `ZZ-000-ZZ` affiche un message clair, et non une exception brute ;
      - filtres par type et par état : les filtres « moto » et « en maintenance » laissent voir la MT-07 ;
      - devis : 7 jours sur la 208 affichent 245, 10 jours affichent 315 (remise de 10 % au-delà de 7 jours, comme en AP2) ;
      - statistiques : sur le fichier d'exemple, on compte 1 véhicule par type, le revenu potentiel d'une journée est de 200, le véhicule le plus cher est le Ducato (120) et le moins cher la 208 (35) ;
      - export CSV vers le format lu par le MVC. Après l'export, la vitrine web montre la 208, mais pas les deux autres véhicules.

      Un champ vide, un nombre de jours inférieur à 1, ou un fichier absent produisent un message pour l'agent. L'application reste ouverte.

      *Attention : le calcul du devis, le filtre et l'export sont des méthodes du métier. Le gestionnaire du clic les appelle, mais il ne contient pas la formule.*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Le travail à rendre <Icone nom="package" />

- Le projet C# graphique, commenté, sans le menu console.
- Le site MVC : modèles, contrôleurs, vues, CSS externe.
- Le diagramme de classes, mis à jour par rapport à l'AP2 (les classes de véhicules restent, l'interface graphique s'y ajoute sans absorber le métier).
- Un guide utilisateur PDF, avec des captures : l'écran de la flotte, le devis à 315, la grille web de la 208.
- Une archive nommée `AP3_AutoRent_NOM1_NOM2.zip`.

L'archive qui ne porte pas ce nom perd 2 points.

*Toute suspicion d'utilisation d'une IA dans le seul but de générer le rendu entraîne la note de 0/20. L'IA ne doit rédiger ni le code, ni les vues, ni le guide.*
