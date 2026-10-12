---
title: "Projet : Out'Foxed in the Gallery"
description: 'Site web Chasse aux Ren-Arts, classe de Seconde, récit en anglais avec votre professeur.e d''anglais.'
image: /images/fox_chasse_renard_anglais_v2.png
level: '2'
chapter: Web
icon: "\U0001F409"
prerequisites:
  - activite_web_interactive
---

# 🦊 Projet : Out'Foxed in the Gallery

Classe de **Seconde**. Cette année, le projet se mène avec votre professeur.e d'**anglais**.

Vous réalisez la chasse aux Ren'Arts : choisir une œuvre réelle, puis en proposer une version **renardifiée**, où un renard entre dans la scène. La recherche, les faits sur l'œuvre et la page web se font en français. **L'histoire du tableau se rédige en anglais** : c'est la production d'expression écrite du cours d'anglais.

Dans le fichier HTML fourni, le modèle écrit parfois « renardisé ». Il s'agit du même objet : votre tableau renardifié.

**Répartition.** En SNT, vous documentez l'œuvre et vous construisez la page. En anglais, vous écrivez le récit à partir de cette œuvre, puis vous le faites relire avant de le coller dans le site.

> **📖 Préparation**

Avant de commencer, relire la [notice sur HTML](Cours_html.md), notamment les parties sur les titres, les paragraphes, les listes et les images.

## Téléchargement des ressources

Pour la création du site, vous aurez besoin du code pré-fourni disponible ici : [code fourni](ressources_chasse_renarts.md).

Vous retrouverez :

- le code d'un fichier `index.html` qui correspond au site web à remplir
- le code d'un fichier `style.css` qui contiendra tous les éléments de style de votre page

> **🔎 Recherche de l'œuvre**

Avant de remplir la page, vous constituez une fiche sur **un tableau réel**. Le renard n'a pas à figurer déjà dans l'œuvre : c'est la version renardifiée qui le fait entrer dans la scène. La fiche alimente la liste de caractéristiques du site. Elle sert aussi au cours d'anglais : le récit s'appuie sur ces faits et sur l'image, pas sur un souvenir flou.

## Choisir le tableau

- Une œuvre peinte ou dessinée, d'un artiste identifié, conservée dans un musée ou une collection publique.
- Vous devez pouvoir montrer l'image et nommer la personne qui l'a faite.
- Entre deux œuvres, gardez celle dont la notice de musée indique la date, le lieu de conservation et la technique.

## Regarder l'image avant la notice

Quelques idées d'informations importantes sur le tableau :

1. Qui ou quoi occupe le premier plan (personnage, animal, objet).
2. Le lieu, avec un indice visible : intérieur, rue ou paysage (fenêtre, sol, ciel, meuble).
3. Un objet précis.
4. La lumière ou les couleurs dominantes.
5. Une pose ou une action (quelqu'un lit, marche, se retourne, regarde hors du cadre).

## La fiche à garder

Recopiez cette fiche au cahier ou dans un fichier. Apportez-la au cours d'anglais, avec l'image du tableau.

- **Artiste** : nom, prénom, dates de naissance et de mort si on les trouve, pays ou ville d'activité.
- **Titre** : titre dans la langue d'origine, et titre français s'il diffère.
- **Date** : année, ou fourchette du type « vers 1665 ». Indiquer quelle source donne cette date.
- **Mouvement** : nom du courant, plus la phrase qui le relie à ce tableau.
- **Lieu de conservation** : musée, ville, pays. Numéro d'inventaire si la notice le donne.
- **Technique et matériaux** : par exemple huile sur toile, tempera sur bois, pastel sur papier.
- **Dimensions** : hauteur × largeur, avec l'unité (cm).
- **Ce qui est représenté** : les cinq détails vus sur l'image.
- **Sources** : au moins deux. Pour chacune : nom du site ou de l'ouvrage, adresse de la page ou référence du livre, date de consultation, et ce que vous y avez pris (la date, les dimensions, le mouvement…).

> **✍️ Rédaction de l'histoire du tableau**

## Le récit se rédige en anglais

Ce texte est la production du **cours d'anglais**. Vous le rédigez en anglais, avec votre professeur.e d'anglais. La fiche, le titre factuel de l'œuvre et la liste des caractéristiques restent en français.

Un seul récit en trois parties :

1. La scène telle qu'elle est peinte : le lieu, les personnages, les objets. Au moins **trois** des cinq détails de la fiche apparaissent dans le texte.
2. Une action qui avance : quelqu'un entre, une porte s'ouvre, un regard change, un objet passe de main en main.
3. L'arrivée du renard, dans **ce** lieu et devant **ces** objets. Ce passage justifie l'image renardifiée. Le renard ne change pas de décor.

## Longueur : au moins 100 mots

La production se situe autour de **100 à 150 mots** (*100 to 150 words*). Un texte un peu plus long reste recevable s'il explique des choses supplémentaires, tirée de ce tableau.
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

**Dans le bloc rouge de gauche : coller la première partie du récit en anglais, celle qui décrit la scène du tableau original.**

**Dans le bloc rouge de droite : coller la suite du récit en anglais, celle où le renard entre dans cette scène.**

Les deux paragraphes forment un seul texte. Additionnés, ils comptent au moins 100 mots.

**Dans le bloc bleu foncé : ajouter la fiche, en français, sous forme de liste.** Chaque puce est une caractéristique : artiste, titre, date, mouvement, lieu de conservation, technique, matériaux, dimensions, cinq détails vus, puis les deux sources (nom, page, date de consultation).

**Dans le bloc rose de gauche : ajouter l'image du tableau original. En dessous, un titre de niveau 3 avec le nom du tableau, l'artiste et la date, tels qu'ils figurent sur la fiche.**

**Dans le bloc rose de droite : ajouter l'image du tableau renardifié. En dessous, un titre de niveau 3 avec le nom que vous donnez à cette version.**

Pour les images, vous rajouterez la balise suivante :

```html
    <img class="image_principale" src="images/image.png" alt="nom_du_tableau"/>
```

Il faudra remplacer `image.png` par le nom de votre fichier, par exemple `images/original.png` et `images/renard.png`.
Toutes les images du site sont placées dans un dossier `images`. L'attribut `alt` reprend le titre de l'image. Il ne compte pas dans les 100 mots.

Vous devrez avoir un rendu proche de celui-ci.

![base](/content/1/etape_1.png)

### Correction possible de la partie 1

Les noms, les dates, les sources et les fichiers images sont ceux de votre tableau. Le récit en anglais est le vôtre.

À vérifier avant de passer à la suite :

- le titre principal est bien écrit avec une balise `<h1>` ;
- les deux images s'affichent correctement ;
- les noms des fichiers dans `src="images/..."` correspondent exactement aux noms des images ;
- le récit en anglais est écrit dans des balises `<p>`, réparti dans les deux blocs rouges ;
- la fiche en français est une liste `<ul>` / `<li>`, avec les deux sources ;
- les cinq détails vus figurent dans cette liste.

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

**Consigne : dans le fichier `style.css`, retirer toutes les lignes qui ont un rapport avec les bordures.**

*Vous chercherez sur internet comment réaliser des bordures en CSS pour retrouver les mots-clefs correspondants.*

Méthode conseillée :

1. Ouvrir le fichier `style.css`.
2. Repérer toutes les lignes qui contiennent le mot `border`.
3. Supprimer uniquement ces lignes.
4. Conserver les lignes qui organisent la page, comme `display`, `flex-direction`, `gap`, `text-align`, `width`, `height` ou `object-fit`.
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

**Consigne : dans la classe `.container` du fichier `style.css`, rajouter les propriétés permettant de changer le fond, la couleur du texte et la police d'écriture.**

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

- le texte reste lisible, en français comme en anglais ;
- le fond ne cache pas les images du tableau ;
- toutes les couleurs choisies vont bien ensemble ;
- les images sont toujours rangées dans le dossier `images` ;
- la page fonctionne après avoir actualisé le navigateur.

Laissez parler votre créativité. On peut attendre un rendu proche de celui-ci :

![base](/content/1/etape_3.png)

> **✅ Critères d'évaluation**

Deux professeurs lisent le même site. Chacun note ce qui relève de son cours. Le lien entre le récit et le tableau se vérifie à deux : la fiche et l'image sont sur la page.

### Traces de recherche (SNT)

- Artiste, titre, date, mouvement, lieu de conservation, technique, matériaux et dimensions figurent dans la liste.
- Cinq détails vus sur l'image figurent dans la liste, en français, comme des constats.
- Au moins deux sources sont nommées (site ou ouvrage, page ou référence, date de consultation).
- Une information absente est marquée « non trouvé », avec la source de ce qui a été trouvé.
- Le titre de niveau 3 de l'œuvre originale reprend le titre, l'artiste et la date de la fiche.

### Longueur du récit (anglais)

- Les deux paragraphes en anglais, additionnés, comptent au moins 100 mots.
- La visée de fin de seconde rappelée plus haut est un texte d'environ 100 à 150 mots. Le seuil de ce projet est 100.
- Le français de la fiche, les balises et les attributs `alt` ne comptent pas.

### Langue (anglais)

- Le récit est en anglais. C'est la production d'expression écrite du cours d'anglais.
- Les phrases sont reliées (connecteurs, fil de l'histoire).
- Le temps choisi est tenu : passé (*past simple* / *past continuous*) ou présent de narration.
- On comprend l'histoire. Des erreurs locales peuvent rester si elles n'empêchent pas de suivre la scène.

### Lien entre le récit et le tableau (SNT et anglais)

- Au moins trois des cinq détails listés sur la fiche apparaissent dans le récit en anglais.
- Le renard entre dans le lieu et parmi les objets de cette œuvre, et ce passage correspond à l'image renardifiée.
- Si le récit mentionne un fait de la notice (nom, date, lieu), ce fait est celui de la fiche.

### Page web (SNT)

- Le titre de la page est un `<h1>`.
- Les deux images s'affichent depuis le dossier `images`.
- Les bordures de repérage ont été retirées du CSS, sans supprimer la mise en page (`display`, `gap`, tailles).
- Le fond, la couleur du texte et la police sont réglés dans `.container`, et le texte reste lisible.
- L'archive rendue contient `index.html`, `style.css` et le dossier `images`.

## Rendu du projet

Pour rendre votre travail, vous devez envoyer une archive compressée de votre dossier `projet_site_eleve`.

Avant de créer l'archive, vérifiez que votre dossier contient bien :

- le fichier `index.html` ;
- le fichier `style.css` ;
- le dossier `images` avec toutes les images utilisées dans votre site.

Le récit en anglais est déjà dans `index.html`. votre professeur.e d'anglais et le cours de SNT évaluent cette même page, avec les critères ci-dessus.

### Créer l'archive sous Windows 11

1. Ouvrez l'explorateur de fichiers.
2. Retrouvez le dossier `projet_site_eleve`.
3. Faites un clic droit sur le dossier `projet_site_eleve`.
4. Cliquez sur **Compresser dans un fichier ZIP**.
5. Si cette option n'apparaît pas, cliquez sur **Afficher plus d'options**, puis sur **Envoyer vers** > **Dossier compressé**.
6. Windows crée alors un fichier nommé `projet_site_eleve.zip`.
7. Renommez l'archive avec votre nom et votre prénom, par exemple `NOM_Prenom_projet_site_eleve.zip`.
8. Déposez le projet sur Pronote.

Il faut compresser le dossier entier `projet_site_eleve`, pas seulement le fichier `index.html`. Sinon, les images et le fichier CSS manquent à l'ouverture.
