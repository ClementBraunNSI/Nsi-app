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

Le but de cette mission est de faire évoluer AutoRent, pas d'en changer le métier.
Durée : 12 h (4 h par semaine, 3 semaines), atelier de professionnalisation, semestre 2. Suite directe de la mission AP2.

L'AP2 a livré une console C# et une page PHP qui lit `disponibles.csv`. Deux évolutions sont obligatoires :

1. remplacer la page PHP procédurale par une architecture MVC ;
2. remplacer la console par une application graphique (WinForms, WPF, Avalonia, ou une technologie équivalente validée en classe).

Les véhicules, les états, le devis et l'export restent ceux de l'AP2. On ne recommence pas le sujet.

**Compétences :** B1.3 Développer la présence en ligne. B2.1 Concevoir et développer une solution applicative. B2.2 Assurer la maintenance corrective ou évolutive.

## 1. La veille, avant de toucher au code <Icone nom="paperclip" />

La note tient sur une page au maximum.

1. Rôle du modèle, de la vue et du contrôleur. Ce que le MVC change pour la maintenance, par rapport à une page PHP qui mélange la requête, le calcul et l'HTML. Quels points sécurisent l'architecture : échappement du HTML, requêtes qui ne collent pas une saisie brute, fichiers inclus par l'instruction prévue par le langage.
2. Dans l'application graphique : ce qui est métier (devis, filtre, export) et ce qui est interface (bouton, grille, message). Un clic appelle le métier. Il ne recalcule pas le devis dans le gestionnaire d'événement.

## 2. Le web en MVC <Icone nom="puzzle" />

La page d'accueil est la vitrine : tous les véhicules **disponibles**, en grille. Les véhicules en maintenance ou loués ne s'y affichent pas. Sur le jeu d'essai de l'AP2, la grille contient la Peugeot 208, pas la Yamaha MT-07, pas le Fiat Ducato.

<ExerciseTabs courseId="sio_ap3_mvc" courseTitle="MVC">
  <ExerciseSection id="ap3-mvc-1" label="Les trois couches" type="autre">
    <Enonce>
      Ranger le projet en modèle, vue et contrôleur.

      - Le modèle porte un véhicule (immatriculation, marque, modèle, prix, état, champs spécifiques) et refuse un prix négatif.
      - Le contrôleur lit la demande et choisit la vue. Il ne contient pas le CSS.
      - La vue affiche. Elle ne recalcule pas le devis et elle n'écrit pas dans le CSV.

      Quatre actions, et pas davantage pour le cœur du sujet :

      1. catalogue des disponibles ;
      2. filtre par type (voiture, moto, camping-car) ;
      3. fiche d'un véhicule, à partir de son immatriculation ;
      4. tri par prix croissant.

      Contrôle, dans cet ordre : la grille montre la 208 à 35 € ; le filtre moto affiche `Aucun véhicule disponible.` ; la fiche `AB-123-CD` montre 5 places et la climatisation ; le tri par prix, le jour où plusieurs véhicules sont disponibles, place le moins cher en premier.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap3-mvc-2" label="Sécurité de la page" type="autre">
    <Enonce>
      Une immatriculation ou un type tapé dans l'adresse ne s'imprime pas tel quel dans la page : les caractères HTML sont encodés. Le texte `<script>` saisi comme recherche s'affiche comme du texte, il ne s'exécute pas.

      Les fichiers externes (CSS, et le CSV s'il est lu côté serveur) sont appelés avec l'instruction prévue, pas collés dans une chaîne ouverte à une saisie. Le CSS est dans un fichier externe. Les composants qui se répètent (carte véhicule, badge) sont écrits une fois.

      Relire le cours sur les injections SQL et les failles XSS, et indiquer dans un commentaire de la vue où l'encodage a lieu.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. L'application graphique <Icone nom="image" />

L'écran principal montre la flotte, pas seulement les disponibles : c'est l'outil de l'agent. La vitrine web, elle, continue de ne montrer que les disponibles.

Au démarrage, les données sont chargées (fichier source, ou sauvegarde locale). L'écran contient : la liste ou la grille, une zone de recherche, les filtres de type et d'état, un bouton d'actualisation.

<ExerciseTabs courseId="sio_ap3_gui" courseTitle="Application graphique">
  <ExerciseSection id="ap3-gui-1" label="L'écran" type="autre">
    <Enonce>
      Le menu console de l'AP2 disparaît. Les mêmes traitements sont des actions de l'écran :

      - recherche par immatriculation : `AB-123-CD` sélectionne la 208, `ZZ-000-ZZ` affiche un message clair, pas une exception brute ;
      - filtres par type et par état : « moto » et « en maintenance » laisse voir la MT-07 ;
      - devis : 7 jours sur la 208 affichent 245, 10 jours affichent 315 (remise de 10 % au-delà de 7 jours, comme en AP2) ;
      - statistiques : 1 véhicule par type sur le fichier d'exemple, revenu potentiel d'une journée 200, plus cher le Ducato à 120, moins cher la 208 à 35 ;
      - export CSV vers le format lu par le MVC. Après export, la vitrine web montre la 208 et pas les deux autres.

      Un champ vide, un nombre de jours inférieur à 1, ou un fichier absent produisent un message pour l'agent. L'application reste ouverte.

      *Attention : le calcul du devis, le filtre et l'export sont des méthodes du métier. Le clic du bouton les appelle. Il ne contient pas la formule.*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Ce qu'on rend <Icone nom="package" />

- Le projet C# graphique, commenté, sans le menu console.
- Le site MVC : modèles, contrôleurs, vues, CSS externe.
- Le diagramme de classes, mis à jour par rapport à l'AP2 (les classes de véhicules restent, l'interface graphique s'y ajoute sans absorber le métier).
- Un guide utilisateur PDF, avec des captures : l'écran de la flotte, le devis à 315, la grille web de la 208.
- Une archive nommée `AP3_AutoRent_NOM1_NOM2.zip`.

L'archive qui ne porte pas ce nom perd 2 points.

*Toute suspicion d'utilisation d'une IA dans le seul but de générer le rendu entraîne la note de 0/20. L'IA ne rédige pas le code, les vues, ni le guide.*
