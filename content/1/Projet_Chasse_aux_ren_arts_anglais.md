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
Dans ce projet, la recherche, les faits sur l'œuvre et la page se font en français. L'histoire du tableau se rédige en anglais.

Classe de **Seconde**. Cette année, le projet se mène avec le cours d'**anglais**.

**Répartition.** En SNT, l'œuvre est documentée et la page construite. En anglais, le récit est écrit à partir de cette œuvre, puis relu avant d'être collé dans le site. C'est la production d'expression écrite du cours d'anglais.

Dans le fichier HTML fourni, le modèle écrit parfois « renardisé ». Il s'agit du même objet : le tableau renardifié. Le renard n'a pas à figurer déjà dans l'œuvre : c'est la version renardifiée qui le fait entrer dans la scène.

**Ressources :**
- [Notice sur HTML](Cours_html.md) : titres, paragraphes, listes, images.
- [Code fourni](ressources_chasse_renarts.md) : `index.html` à remplir, et `style.css`.

## 1. La fiche de l'œuvre <Icone nom="search" />

Avant de remplir la page, une fiche est constituée sur un tableau réel. Elle alimente la liste du site, et le cours d'anglais : le récit s'appuie sur ces faits et sur l'image.

Choix de l'œuvre :

- une œuvre peinte ou dessinée, d'un artiste identifié, conservée dans un musée ou une collection publique ;
- l'image peut être montrée, avec le nom de la personne qui l'a faite ;
- entre deux œuvres, garder celle dont la notice de musée indique la date, le lieu de conservation et la technique.

Regarder l'image avant la notice, et noter cinq détails :

1. Qui ou quoi occupe le premier plan (personnage, animal, objet).
2. Le lieu, avec un indice visible : intérieur, rue ou paysage (fenêtre, sol, ciel, meuble).
3. Un objet précis.
4. La lumière ou les couleurs dominantes.
5. Une pose ou une action (quelqu'un lit, marche, se retourne, regarde hors du cadre).

Recopier cette fiche au cahier ou dans un fichier. L'apporter au cours d'anglais, avec l'image.

- **Artiste** : nom, prénom, dates de naissance et de mort si on les trouve, pays ou ville d'activité.
- **Titre** : titre dans la langue d'origine, et titre français s'il diffère.
- **Date** : année, ou fourchette du type « vers 1665 ». Indiquer quelle source donne cette date.
- **Mouvement** : nom du courant, plus la phrase qui le relie à ce tableau.
- **Lieu de conservation** : musée, ville, pays. Numéro d'inventaire si la notice le donne.
- **Technique et matériaux** : par exemple huile sur toile, tempera sur bois, pastel sur papier.
- **Dimensions** : hauteur × largeur, avec l'unité (cm).
- **Ce qui est représenté** : les cinq détails vus sur l'image.
- **Sources** : au moins deux. Pour chacune : nom du site ou de l'ouvrage, adresse de la page ou référence du livre, date de consultation, et ce qui y a été pris (la date, les dimensions, le mouvement). Une information absente se marque « non trouvé », avec la source de ce qui a été trouvé.

## 2. Le récit en anglais <Icone nom="pen-line" />

Un seul récit est écrit, découpé en trois parties. La fiche, le titre factuel de l'œuvre et la liste des caractéristiques restent en français.

1. La scène telle qu'elle est peinte : le lieu, les personnages, les objets. Au moins trois des cinq détails de la fiche apparaissent dans le texte.
2. Une action qui avance : quelqu'un entre, une porte s'ouvre, un regard change, un objet passe de main en main.
3. L'arrivée du renard, dans ce lieu et devant ces objets. Ce passage justifie l'image renardifiée. Le renard ne change pas de décor.

**Longueur : 100 à 150 mots** (*100 to 150 words*). Les deux paragraphes collés dans les blocs rouges, additionnés, comptent au moins 100 mots. Un texte un peu plus long reste recevable s'il explique des choses supplémentaires, tirées de ce tableau. Le français de la fiche, les balises et les attributs `alt` ne comptent pas.

Le temps choisi est tenu : passé (*past simple* / *past continuous*) ou présent de narration. Les phrases sont reliées. On comprend l'histoire.

## 3. Remplir la maquette <Icone nom="image" />

![base](/content/1/maquette_base.png)

Chaque bloc de couleur est une `div`. La feuille de style ne se modifie pas pendant cette étape. Le nom de l'élève correspond au bloc violet.

<ExerciseTabs courseId="snt_chasse_anglais" courseTitle="Out'Foxed">
  <ExerciseSection id="chasse-en-1" label="Les blocs" type="lecture">
    <Enonce>
      Dans `index.html` :

      1. Le prénom de l'élève devient un titre de niveau 1 (`h1`).
      2. Bloc rouge de gauche : la première partie du récit en anglais, celle qui décrit la scène du tableau original, dans un `p`.
      3. Bloc rouge de droite : la suite du récit en anglais, celle où le renard entre dans cette scène, dans un `p`. Les deux paragraphes forment un seul texte. Additionnés, ils comptent au moins 100 mots, visée 100 à 150.
      4. Bloc bleu foncé : la fiche, en français, en liste `ul` / `li`. Chaque puce est une caractéristique : artiste, titre, date, mouvement, lieu de conservation, technique, matériaux, dimensions, cinq détails vus, puis les deux sources (nom, page, date de consultation).
      5. Bloc rose de gauche : l'image du tableau original, puis un `h3` avec le nom du tableau, l'artiste et la date, tels qu'ils figurent sur la fiche.
      6. Bloc rose de droite : l'image du tableau renardifié, puis un `h3` avec le nom donné à cette version.

      ```html
      <img class="image_principale" src="images/image.png" alt="nom_du_tableau"/>
      ```

      Remplacer `image.png` par le fichier voulu, par exemple `images/original.png` et `images/renard.png`. Toutes les images sont dans le dossier `images`. `alt` reprend le titre de l'image et ne compte pas dans les 100 mots.

      Les noms, les dates, les sources et le récit sont les vôtres. On ne recopie pas un exemple trouvé ailleurs.

      ![base](/content/1/etape_1.png)

      Avant la suite : `h1` en place, deux images affichées, `src` exacts, récit en anglais dans les deux `p`, fiche en français dans la liste, cinq détails dans cette liste.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Retirer les bordures <Icone nom="scissors" />

Les bordures colorées servaient à voir les zones. Le contenu est placé : on les retire.

```css
border: solid;
border-color: red;
```

À reconnaître aussi : `border: 2px solid black;`, `border-width`, `border-style`, `border-color`.

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

## 5. Fond, texte, police <Icone nom="palette" />

Si `.container` apparaît deux fois, compléter celle qui contient déjà `display: flex;`.

<ExerciseTabs courseId="snt_chasse_anglais_fond" courseTitle="Fond">
  <ExerciseSection id="chasse-en-3" label="container" type="python">
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

      *Attention : le texte reste lisible, en français comme en anglais. Le fond ne cache pas les images. Les couleurs vont ensemble.*

      ![base](/content/1/etape_3.png)
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 6. Ce qu'on rend, et comment c'est lu <Icone nom="package" />

Le même site est évalué en SNT et en anglais. Chaque matière note ce qui relève de son cours. Le lien entre le récit et le tableau se vérifie dans les deux : la fiche et l'image sont sur la page.

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
- Le temps choisi est tenu.
- On comprend l'histoire. Des erreurs locales peuvent rester si elles n'empêchent pas de suivre la scène.

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

Archive du dossier entier `projet_site_eleve`. Le récit en anglais est déjà dans `index.html` : les deux cours évaluent cette même page.

Sous Windows 11 : clic droit sur le dossier, **Compresser dans un fichier ZIP** (ou **Afficher plus d'options**, puis **Envoyer vers** > **Dossier compressé**). Renommer, par exemple `NOM_Prenom_projet_site_eleve.zip`, et déposer sur Pronote.
