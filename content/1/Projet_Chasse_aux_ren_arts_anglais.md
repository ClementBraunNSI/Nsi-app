---
title: "Projet : Out'Foxed in the Gallery"
description: 'Site web Chasse aux Ren-Arts, classe de Seconde, récit écrit en cours d''anglais.'
image: /images/fox_chasse_renard_anglais_v2.png
level: '2'
chapter: Web
icon: "flame"
prerequisites:
  - activite_web_interactive
audience: public
groupe: chasse-renarts
groupeTitre: "Projet : Chasse aux Ren'Arts"
version: "Anglais"
versionCode: "EN"
---

# <Renard /> Projet : Out'Foxed in the Gallery

Le but de ce projet est de créer la page web d'une œuvre réelle, puis d'y faire entrer un renard.
Dans ce projet, la recherche sur l'œuvre et la page web se font en français, mais l'histoire du tableau se rédige en anglais.

Ce projet s'adresse aux élèves de **Seconde**. Cette année, il est mené avec le cours d'**anglais**.

**Répartition.** En SNT, les élèves se documentent sur l'œuvre et construisent la page. En anglais, ils écrivent le récit à partir de cette œuvre, le font relire, puis le collent dans le site. Ce récit sert de production d'expression écrite pour le cours d'anglais.

Dans le fichier HTML fourni, le modèle écrit parfois « renardisé ». Il s'agit du même objet : le tableau renardifié. Le renard n'a pas à figurer déjà dans l'œuvre : c'est la version renardifiée qui le fait entrer dans la scène.

**Ressources :**
- [Notice sur HTML](Cours_html.md) : les titres, les paragraphes, les listes et les images.
- [Code fourni](ressources_chasse_renarts.md) : le fichier `index.html` à remplir et la feuille `style.css`.

## 1. La fiche de l'œuvre <Icone nom="search" />

Avant de remplir la page, il faut constituer une fiche sur un tableau réel. Cette fiche sert à remplir la liste du site, et elle est utilisée en cours d'anglais, où le récit s'appuie sur ces faits et sur l'image.

L'œuvre choisie doit respecter quelques critères :

- elle est peinte ou dessinée par un artiste identifié, et conservée dans un musée ou une collection publique ;
- l'image peut être montrée, avec le nom de la personne qui l'a faite ;
- entre deux œuvres, garder celle dont la notice de musée indique la date, le lieu de conservation et la technique.

Regarder l'image avant la notice, et noter cinq détails :

1. Qui ou quoi occupe le premier plan (personnage, animal, objet).
2. Le lieu (intérieur, rue ou paysage), avec un indice visible comme une fenêtre, le sol, le ciel ou un meuble.
3. Un objet précis.
4. La lumière ou les couleurs dominantes.
5. Une pose ou une action (quelqu'un lit, marche, se retourne, regarde hors du cadre).

Recopier cette fiche au cahier ou dans un fichier. L'apporter au cours d'anglais, avec l'image.

- **Artiste** : nom, prénom, dates de naissance et de mort si on les trouve, pays ou ville d'activité.
- **Titre** : titre dans la langue d'origine, et titre français s'il diffère.
- **Date** : année, ou fourchette du type « vers 1665 ». Indiquer quelle source donne cette date.
- **Mouvement** : nom du courant, et une phrase qui explique le lien avec ce tableau.
- **Lieu de conservation** : musée, ville, pays. Numéro d'inventaire si la notice le donne.
- **Technique et matériaux** : par exemple huile sur toile, tempera sur bois, pastel sur papier.
- **Dimensions** : hauteur × largeur, avec l'unité (cm).
- **Ce qui est représenté** : les cinq détails vus sur l'image.
- **Sources** : au moins deux. Pour chacune, indiquer le nom du site ou de l'ouvrage, l'adresse de la page ou la référence du livre, la date de consultation, et les informations qui en sont tirées (la date, les dimensions, le mouvement). Une information introuvable est notée « non trouvé », en citant tout de même les sources consultées.

## 2. Le récit en anglais <Icone nom="pen-line" />

Un seul récit est écrit, découpé en trois parties. La fiche, le titre factuel de l'œuvre et la liste des caractéristiques restent en français.

1. La scène telle qu'elle est peinte, avec le lieu, les personnages et les objets. Au moins trois des cinq détails de la fiche doivent apparaître dans le texte.
2. Une action qui fait avancer l'histoire : quelqu'un entre, une porte s'ouvre, un regard change ou un objet passe de main en main.
3. L'arrivée du renard dans ce lieu, au milieu de ces objets. Ce passage explique l'image renardifiée, et le renard reste dans le décor du tableau.

**Longueur : 100 à 150 mots** (*100 to 150 words*). Ensemble, les deux paragraphes collés dans les blocs rouges doivent compter au moins 100 mots. Un texte un peu plus long est accepté s'il apporte des éléments supplémentaires tirés du tableau. Le français de la fiche, les balises et les attributs `alt` ne comptent pas.

Le récit est écrit au passé (*past simple* / *past continuous*) ou au présent de narration, et le temps choisi est conservé jusqu'au bout. Les phrases sont reliées entre elles, et l'histoire se comprend facilement.

## 3. Remplir la maquette <Icone nom="image" />

![base](/content/1/maquette_base.png)

Chaque bloc de couleur est une `div`. La feuille de style ne se modifie pas pendant cette étape. Le nom de l'élève correspond au bloc violet.

<ExerciseTabs courseId="snt_chasse_anglais" courseTitle="Out'Foxed">
  <ExerciseSection id="chasse-en-1" label="Les blocs" type="lecture">
    <Enonce>
      Dans `index.html` :

      1. Le prénom de l'élève devient un titre de niveau 1 (`h1`).
      2. Bloc rouge de gauche : la première partie du récit en anglais, celle qui décrit la scène du tableau original, dans un `p`.
      3. Bloc rouge de droite : la suite du récit en anglais, celle où le renard entre dans cette scène, dans un `p`. Les deux paragraphes forment un seul texte. Ensemble, ils comptent au moins 100 mots, l'objectif étant de 100 à 150 mots.
      4. Bloc bleu foncé : la fiche, en français, sous forme de liste `ul` / `li`. Chaque puce est une caractéristique : artiste, titre, date, mouvement, lieu de conservation, technique, matériaux, dimensions, cinq détails vus, puis les deux sources (nom, page, date de consultation).
      5. Bloc rose de gauche : l'image du tableau original, puis un `h3` avec le nom du tableau, l'artiste et la date, tels qu'ils figurent sur la fiche.
      6. Bloc rose de droite : l'image du tableau renardifié, puis un `h3` avec le nom donné à cette version.

      ```html
      <img class="image_principale" src="images/image.png" alt="nom_du_tableau"/>
      ```

      Remplacer `image.png` par le fichier voulu, par exemple `images/original.png` et `images/renard.png`. Toutes les images sont dans le dossier `images`. `alt` reprend le titre de l'image et ne compte pas dans les 100 mots.

      Les noms, les dates, les sources et le récit doivent venir du travail de l'élève, sans recopier un exemple trouvé ailleurs.

      ![base](/content/1/etape_1.png)

      Avant de passer à la suite, vérifier que le `h1` est en place, que les deux images s'affichent et que les `src` sont exacts. Le récit en anglais doit se trouver dans les deux `p`, et la fiche en français, avec les cinq détails, dans la liste.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Retirer les bordures <Icone nom="scissors" />

Les bordures colorées servaient à repérer les zones. Maintenant que le contenu est en place, on les retire.

```css
border: solid;
border-color: red;
```

Il faut aussi reconnaître les variantes suivantes : `border: 2px solid black;`, `border-width`, `border-style`, `border-color`.

<ExerciseTabs courseId="snt_chasse_anglais_css" courseTitle="Bordures">
  <ExerciseSection id="chasse-en-2" label="border" type="lecture">
    <Enonce>
      Dans `style.css` :

      1. Repérer toutes les lignes qui contiennent `border`. La classe `.container` peut apparaître plusieurs fois.
      2. Supprimer uniquement ces lignes.
      3. Conserver `display`, `flex-direction`, `gap`, `text-align`, `width`, `height` et `object-fit`.
      4. Enregistrer, puis actualiser.

      ```css
      .presentation {
          display: flex;
          gap: 16px;
          border: solid;
          border-color: yellow;
      }
      ```

      devient :

      ```css
      .presentation {
          display: flex;
          gap: 16px;
      }
      ```

      ![final](/content/1/etape_2.png)
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 5. Fond, couleur du texte et police <Icone nom="palette" />

Si `.container` apparaît deux fois, compléter celle qui contient déjà `display: flex;`.

<ExerciseTabs courseId="snt_chasse_anglais_fond" courseTitle="Fond">
  <ExerciseSection id="chasse-en-3" label="container" type="autre">
    <Enonce>
      Ajouter le fond, la couleur du texte et la police.

      ```css
      .container {
          display: flex;
          flex-direction: column;
          gap: 13px;
          background-color: #1F2A44;
          color: white;
          font-family: Arial, sans-serif;
      }
      ```

      `background-size: cover;` et `background-position: center;` servent si le fond est une image. `text-shadow: 1px 1px 3px black;` garde un texte clair lisible.

      *Attention : le texte doit rester lisible, en français comme en anglais, le fond ne doit pas cacher les images, et les couleurs doivent aller ensemble.*

      ![base](/content/1/etape_3.png)
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 6. Le rendu et l'évaluation <Icone nom="package" />

Le même site est évalué en SNT et en anglais, et chaque matière note ce qui relève de son cours. Le lien entre le récit et le tableau est vérifié dans les deux matières, puisque la fiche et l'image figurent sur la page.

### Traces de recherche (SNT)

- Artiste, titre, date, mouvement, lieu de conservation, technique, matériaux et dimensions figurent dans la liste.
- Cinq détails vus sur l'image figurent dans la liste, en français.
- Au moins deux sources sont nommées (site ou ouvrage, page ou référence, date de consultation).
- Une information absente est marquée « non trouvé ».
- Le `h3` de l'œuvre originale reprend le titre, l'artiste et la date de la fiche.

### Longueur du récit (anglais)

- Les deux paragraphes en anglais, additionnés, comptent au moins 100 mots.
- La visée est un texte d'environ **100 à 150 mots**.
- Le français de la fiche, les balises et les `alt` ne comptent pas.

### Langue (anglais)

- Le récit est en anglais, relu en cours d'anglais.
- Les phrases sont reliées.
- Le temps choisi est conservé jusqu'au bout.
- L'histoire se comprend. Des erreurs locales sont acceptées si elles n'empêchent pas de suivre la scène.

### Lien entre le récit et le tableau

- Au moins trois des cinq détails de la fiche apparaissent dans le récit en anglais.
- Le renard entre dans le lieu et parmi les objets de cette œuvre, et ce passage correspond à l'image renardifiée.
- Un fait de notice cité dans le récit est celui de la fiche.

### Page web (SNT)

- Le titre de la page est un `h1`.
- Les deux images s'affichent depuis le dossier `images`.
- Les bordures de repérage ont été retirées, sans supprimer `display`, `gap` ni les tailles.
- Le fond, la couleur du texte et la police sont dans `.container`.
- L'archive contient `index.html`, `style.css` et le dossier `images`.

Il faut rendre une archive du dossier entier `projet_site_eleve`. Le récit en anglais se trouve déjà dans `index.html`, et les deux matières évaluent cette même page.

Sous Windows 11 : clic droit sur le dossier, **Compresser dans un fichier ZIP** (ou **Afficher plus d'options**, puis **Envoyer vers** > **Dossier compressé**). Renommer ensuite l'archive, par exemple `NOM_Prenom_projet_site_eleve.zip`, puis la déposer sur Pronote.
