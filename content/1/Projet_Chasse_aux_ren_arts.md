---
title: 'Projet : Chasse aux Ren Arts'
description: 'Création d''un site web : La chasse aux Ren-Arts'
level: '2'
chapter: Web
icon: "\U0001F409"
prerequisites:
  - activite_web_interactive
---

# 📚 Projet : Chasse aux Ren'Arts

> **📖 Préparation**

Avant de commencer le projet, il est conseillé de relire la [notice sur HTML](Cours_html.md), notamment les parties sur les titres, les paragraphes, les listes et les images.

## Téléchargement des ressources

Pour la création du site, vous aurez besoin du code pré-fourni disponible ici : [code fourni](ressources_chasse_renarts.md).

Vous retrouverez :

- le code d'un fichier `index.html` qui correspond au site web à remplir
- le code d'un fichier `style.css` qui contiendra tous les éléments de style de votre page

> **🏋️ Partie 1**

## Remplir le site comme la maquette

Voilà à quoi ressemble l'affichage de la maquette lorsque vous l'ouvrez dans votre navigateur :

![base](/content/1/maquette_base.png)


Chacun des blocs de couleur correspond à une partie bien précise du site.
On les nomme `div` pour division d'une page web. Ils permettent de scinder la page en diverses parties.

Le site est aussi régi par une feuille de style qui n'est pas à modifier pour cette première étape.

À cause d'un souci d'affichage, le nom de l'élève correspond au bloc violet.

**Consignes pour cette première partie :**

**Modifier le prénom de l'élève pour qu'il corresponde à un titre de niveau 1.**

**Dans le bloc rouge de gauche : Ajouter un paragraphe expliquant le contexte du tableau original.**

**Dans le bloc rouge de droite : Ajouter un paragraphe expliquant le contexte du tableau renardifié.**

**Dans le bloc bleu foncé : Ajouter chacune des caractéristiques du tableau : taille, année, lieu de conservation, technique, matériaux, etc.**

**Dans le bloc rose de gauche : Ajouter l'image de votre tableau original. En dessous, un titre de niveau 3 indiquant le nom du tableau, l'artiste, la date.**

**Dans le bloc rose de droite : Ajouter l'image de votre tableau renardifié. En dessous, ajouter un titre de niveau 3 indiquant le nom du tableau renardifié**

Pour ce faire, vous rajouterez la balise suivante :

```html
    <img class="image_principale" src="images/image.png" alt="nom_du_tableau"/>
```

Il faudra modifier image.png par le nom de votre image.
Attention, dans ce projet, il faut bien ranger ses fichiers. Toutes les images du site seront placées dans un dossier `images`.

Vous devrez avoir un rendu proche de celui-ci.

![base](/content/1/etape_1.png)

### Correction possible de la partie 1

Voici un exemple de correction pour la première partie. Il ne faut pas recopier exactement le texte : remplacez les noms, les dates et les fichiers images par ceux de votre tableau.

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Chasse aux Ren'Arts</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <meta charset="utf-8">
    </head>
    <body>
        <div class="container">
            <div class="nom_eleve">
                <h1>Prénom NOM</h1>
            </div>

            <div class="presentation">
                <div class="image">
                    <div>
                        <img class="image_principale" src="images/joconde.jpg" alt="La Joconde"/>
                    </div>
                    <div>
                        <h3>La Joconde - Léonard de Vinci - vers 1503</h3>
                    </div>
                    <div class="div_tableau_description">
                        <p>
                            La Joconde est un portrait peint par Léonard de Vinci au début du XVIe siècle.
                            Ce tableau est célèbre pour le sourire mystérieux de son personnage et pour la
                            précision du regard. Il est aujourd'hui conservé au musée du Louvre, à Paris.
                        </p>
                    </div>
                </div>

                <div class="image">
                    <div>
                        <img class="image_principale" src="images/joconde_renard.jpg" alt="La Joconde renardifiée"/>
                    </div>
                    <div>
                        <h3>La Joconde renardifiée</h3>
                    </div>
                    <div class="div_tableau_description">
                        <p>
                            Dans cette version détournée, le personnage du tableau original a été transformé
                            en renard. L'objectif est de reconnaître l'oeuvre de départ tout en ajoutant une
                            touche humoristique et personnelle.
                        </p>
                    </div>
                </div>

                <div class="caracteristiques">
                    <h2>Caractéristiques du tableau original</h2>
                    <ul>
                        <li><strong>Titre :</strong> La Joconde</li>
                        <li><strong>Artiste :</strong> Léonard de Vinci</li>
                        <li><strong>Date :</strong> vers 1503-1506</li>
                        <li><strong>Technique :</strong> peinture à l'huile</li>
                        <li><strong>Support :</strong> bois de peuplier</li>
                        <li><strong>Dimensions :</strong> 77 cm x 53 cm</li>
                        <li><strong>Lieu de conservation :</strong> musée du Louvre, Paris</li>
                    </ul>
                </div>
            </div>
        </div>
    </body>
</html>
```

À vérifier avant de passer à la suite :

- le titre principal est bien écrit avec une balise `<h1>` ;
- les deux images s'affichent correctement ;
- les noms des fichiers dans `src="images/..."` correspondent exactement aux noms des images ;
- les descriptions sont écrites dans des balises `<p>` ;
- les caractéristiques sont présentées sous forme de liste avec `<ul>` et `<li>`.

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

Les bordures étaient utiles au début du projet : elles permettaient de voir les différentes zones de la page. Maintenant que le contenu est placé, on peut les retirer pour obtenir un rendu plus propre.

En CSS, les bordures sont généralement créées avec les propriétés suivantes :

```css
border: solid;
border-color: red;
```

On peut aussi rencontrer des variantes comme :

```css
border: 2px solid black;
border-width: 2px;
border-style: solid;
border-color: pink;
```

**Consigne : Dans le fichier `style.css`, retirer toutes les lignes qui ont un rapport avec les bordures.**

*Vous chercherez sur internet comment réaliser des bordures en CSS pour retrouver les mots-clefs correspondants.*

Méthode conseillée :

1. Ouvrir le fichier `style.css`.
2. Repérer toutes les lignes qui contiennent le mot `border`.
3. Supprimer uniquement ces lignes.
4. Ne pas supprimer les lignes qui organisent la page, comme `display`, `flex-direction`, `gap`, `text-align`, `width`, `height` ou `object-fit`.
5. Enregistrer le fichier puis actualiser la page dans le navigateur.

Par exemple, si vous avez :

```css
.image{
    border: solid;
    border-color: pink;
}
```

vous devez obtenir :

```css
.image{
}
```

Et si vous avez :

```css
.presentation{
    display: flex;
    gap: 16px;
    border: solid;
    border-color: yellow;
}
```

vous devez conserver :

```css
.presentation{
    display: flex;
    gap: 16px;
}
```

Attention : la classe `.container` peut apparaître plusieurs fois dans le fichier CSS. Il faut donc bien vérifier tout le fichier, du début à la fin.

![final](/content/1/etape_2.png)

> **🏋️ Partie 3**

## Fond d'écran et couleurs de police d'écriture

La dernière étape de ce projet correspond à l'ajout du fond d'écran et à la modification de la couleur de la police d'écriture.

La *classe* `container` est la classe qui contient toute la page. Si on modifie cette classe, les changements peuvent donc s'appliquer à presque tout le site.

**Consigne : Dans la classe `.container` du fichier `style.css`, rajouter les propriétés permettant de changer le fond, la couleur du texte et la police d'écriture.**

Si votre fichier contient déjà une classe `.container`, il faut ajouter les nouvelles propriétés à l'intérieur de cette classe. Si elle apparaît deux fois, choisissez celle qui contient déjà `display: flex;` et complétez-la.

```css
.container{
    display: flex;
    flex-direction: column;
    gap: 13px;

    background-color: #1F2A44; /* fond de couleur uni */
    color: white; /* couleur du texte */
    font-family: Arial, sans-serif; /* police d'écriture */
}
```

Quelques propriétés utiles pour personnaliser votre page :

- `background-color` permet de choisir une couleur de fond ;
- `background-size: cover;` permet à l'image de remplir l'espace disponible ;
- `background-position: center;` permet de centrer l'image ;
- `color` permet de modifier la couleur du texte ;
- `font-family` permet de modifier la police d'écriture ;
- `text-shadow` peut aider à rendre le texte plus lisible sur une image.

Exemple avec une ombre sur le texte :

```css
.container{
    display: flex;
    flex-direction: column;
    gap: 13px;
    color: white;
    font-family: Arial, sans-serif;
    text-shadow: 1px 1px 3px black;
}
```

À vérifier avant de terminer :

- le texte reste lisible ;
- le fond ne cache pas les images du tableau ;
- toutes les couleurs choisies vont bien ensemble ;
- les images sont toujours rangées dans le dossier `images` ;
- la page fonctionne après avoir actualisé le navigateur.

Laissez parler votre créativité. On peut attendre un rendu proche de celui-ci :

![base](/content/1/etape_3.png)
