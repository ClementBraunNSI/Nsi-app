---
title: 'Projet : Chassse aux Ren Arts'
description: 'Création d''un site web : La chasse aux Ren-Arts'
level: '2'
chapter: Web
icon: "\U0001F409"
prerequisites:
  - activite_web_interactive
---

# 📚 Projet : Création du Bestiaire

> **📖 Préparation**

## Téléchargement des ressources

Pour la création du site, vous aurez besoin du code pré-fourni disponible ici (./Cours_Web.md)[code fourni].

Vous retrouverez :

- le code d'un fichier `index.html` qui correspond au site web à remplir
- le code d'un fichiern `style.css` qui contiendra tous les éléments de style de votre page

> **🏋️ Partie 1**

## Remplir le site comme la maquette

Voila à quoi ressemble l'affichage de la maquette lorsque vous l'ouvrez dans votre navigateur:

![base](/content/1/maquette_base.png)


Chacun des blocs de couleur correspond à une partie bien précise du site.
On les nomme `div` pour division d'une page web. Ils permettent de scinder la page en diverses parties.

Le site est aussi régi par une feuille de style qui n'est pas à modifier pour cette première étape.

À cause d'un soucis d'affichage, le Nom du monstre correspond au bloc violet.

**Consignes pour cette première partie :**

**Modifier le prénom de l'élève pour qu'il corresponde à un titre de niveau 1.**

**Dans le bloc rouge de gauche : Ajouter un paragraphe expliquant le contexte du tableau original.**

**Dans le bloc rouge de droite : Ajouter un paragraphe expliquant le contexte du tableau renardifié.**

**Dans le bloc bleu foncé : Ajouter chacune des caractéristiques du tableau : taille, année, lieu de conservation, technique, matériaux, etc.**

**Dans le bloc rose de gauche : Ajouter l'image de votre tableau original. En dessous, un titre de niveau 3 indiquant le nom du tableau, l'artiste, la date.**

**Dans le bloc rose de droite : Ajouter l'image de votre tableau renardifié. En dessous, ajouter un titre de niveau 3 indiquant le nom du tableau renardifié**

Pour se faire, vous rajouterez la balise suivante :

```html
    <img class = "image_principale" align="left" height="400px" width="400px" src="image/image.png" alt="nom_du_tableau"/>
```

Il faudra modifier image.png par le nom de votre image.
Attention, dans ce projet, il faut bien ranger ses fichiers. Toutes les images du site seront placées dans un dossier `images`.

Vous devrez avoir un rendu proche de celui-ci.

![base](/content/1/etape_1.png)

> **🏋️ Partie 2**

## Retirer les bordures

Le fichier `style.css` rassemble tous les éléments de style de la page.

La syntaxe est telle que :

```css
    .classe_de_l_element{
        propriete_1 : valeurs;
        propriete_2 : valeurs;
        ...
    }
```

Un des éléments de style présent sur votre maquette est l'ensemble des bordures délimitant les `div` pour que vous puissiez vous repérer.

**Consigne : Dans le fichier `style.css`, retirer l'ensemble des lignes qui ont un rapport avec les bordures.**

*Vous chercherez sur internet comment réaliser des bordures en CSS pour retrouver les mots-clefs correspondants.*

![final](/content/1/etape_2.png)

> **🏋️ Partie 3**

## Fond d'écran et couleurs de police d'écriture

La dernière étape de ce projet correspond à l'ajout du fond d'écran et de la modification de la police d'écriture en blanc.

La *classe* `container` est la classe qui contient le plus d'éléments sur lesquels on veut appliquer ces propriété.

**Consigne : Dans la classe container du fichier `style.css`, rajouter les propriétés permettant de changer le fond si vous le souhaitez, et de changer les polices ainsi que leurs couleurs par celles de votre choix.**

```css
    .container{
        background-image : url(../image/background.png); /* Si l'on veut un fond d'écran qui soit une image */
        background-color : #1F2A44 /* Si l'on veut un fond de couleur uni*/
        color : white; /* Couleur du texte */
        /* A vous de chercher le reste */
    }
```

Laissez parler votre créativité. On peut attendre un rendu proche de celui-ci :

![base](/content/1/etape_3.png)
