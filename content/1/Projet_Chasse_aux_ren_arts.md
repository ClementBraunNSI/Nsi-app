---
title: 'Projet : Chasse aux Ren Arts'
description: 'Création d''un site web : La chasse aux Ren-Arts'
level: '2'
chapter: Web
icon: "flame"
prerequisites:
  - activite_web_interactive
audience: public
groupe: chasse-renarts
groupeTitre: "Projet : Chasse aux Ren'Arts"
version: "Français"
versionCode: "FR"
image: /images/fox_chasse_renard.png
---

# <Renard /> Projet : Chasse aux Ren'Arts

Le but de ce projet est de créer la page web de votre tableau pour la chasse aux Ren'Arts.
Dans ce projet, nous allons remplir la maquette HTML, retirer les bordures de repérage, puis choisir le fond, la couleur du texte et la police.

**Ressources :**
- [Notice sur HTML](Cours_html.md) : titres, paragraphes, listes, images.
- [Code fourni](ressources_chasse_renarts.md) : `index.html` à remplir, et `style.css` pour tout le style.

Les images du site vont dans un dossier `images`. Le nom dans `src` doit être exactement celui du fichier.

## 1. Remplir la maquette <Icone nom="image" />

Voilà la maquette ouverte dans le navigateur. Chaque bloc de couleur est une `div` : une division de la page. La feuille de style ne se modifie pas pendant cette étape.

![base](/content/1/maquette_base.png)

À cause d'un souci d'affichage, le nom de l'élève correspond au bloc violet.

<ExerciseTabs courseId="snt_chasse_renarts" courseTitle="Chasse aux Ren'Arts">
  <ExerciseSection id="chasse-fr-1" label="Les blocs" type="lecture">
    <Enonce>
      Dans `index.html` :

      1. Le prénom de l'élève devient un titre de niveau 1 (`h1`).
      2. Bloc rouge de gauche : un paragraphe (`p`) qui explique le contexte du tableau original (qui a peint, ce qu'on voit, où c'est conservé).
      3. Bloc rouge de droite : un paragraphe qui explique le contexte du tableau renardifié (ce qui a changé, où le renard entre dans la scène).
      4. Bloc bleu foncé : une liste (`ul` / `li`) des caractéristiques. Au minimum : taille, année, lieu de conservation, technique, matériaux.
      5. Bloc rose de gauche : l'image du tableau original, puis un titre de niveau 3 (`h3`) avec le nom du tableau, l'artiste et la date.
      6. Bloc rose de droite : l'image du tableau renardifié, puis un `h3` avec le nom que vous donnez à cette version.

      Balise à adapter. Remplacez `image.png` par le nom de votre fichier, par exemple `images/original.png` et `images/renard.png`.

      ```html
      <img class="image_principale" src="images/image.png" alt="nom_du_tableau"/>
      ```

      *Attention : `alt` décrit l'image. Il ne remplace pas le paragraphe.*

      Le rendu se rapproche de celui-ci :

      ![base](/content/1/etape_1.png)

      Avant la suite : le titre est un `h1`, les deux images s'affichent, les `src` correspondent aux fichiers du dossier `images`, les descriptions sont des `p`, les caractéristiques sont une liste.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

Voici un exemple de liste, à réécrire à partir de votre tableau. On ne recopie pas ces noms si ce n'est pas votre œuvre.

```html
<ul>
  <li>Artiste : Marie Nom</li>
  <li>Année : 1889</li>
  <li>Lieu de conservation : musée, ville</li>
  <li>Technique : huile sur toile</li>
  <li>Dimensions : 73 cm × 92 cm</li>
</ul>
```

## 2. Retirer les bordures <Icone nom="scissors" />

`style.css` rassemble le style. Une classe s'écrit ainsi :

```css
.classe_de_l_element {
    propriete_1: valeurs;
    propriete_2: valeurs;
}
```

Les bordures colorées servaient à voir les zones. Le contenu est placé : on les retire pour un rendu plus propre.

```css
border: solid;
border-color: red;
```

Variantes à reconnaître aussi : `border: 2px solid black;`, `border-width`, `border-style`, `border-color`.

<ExerciseTabs courseId="snt_chasse_renarts_css" courseTitle="Bordures">
  <ExerciseSection id="chasse-fr-2" label="border" type="lecture">
    <Enonce>
      Dans `style.css` :

      1. Ouvrez le fichier.
      2. Repérez toutes les lignes qui contiennent le mot `border`. La classe `.container` peut apparaître plusieurs fois : lisez le fichier du début à la fin.
      3. Supprimez uniquement ces lignes.
      4. Conservez `display`, `flex-direction`, `gap`, `text-align`, `width`, `height` et `object-fit`.
      5. Enregistrez, puis actualisez la page.

      ```css
      .image {
          border: solid;
          border-color: pink;
      }
      ```

      devient :

      ```css
      .image {
      }
      ```

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

## 3. Fond, texte, police <Icone nom="palette" />

La classe `container` contient toute la page. La modifier change presque tout le site. Si elle apparaît deux fois, complétez celle qui contient déjà `display: flex;`.

<ExerciseTabs courseId="snt_chasse_renarts_fond" courseTitle="Fond">
  <ExerciseSection id="chasse-fr-3" label="container" type="python">
    <Enonce>
      Dans `.container`, ajoutez le fond, la couleur du texte et la police. Point de départ :

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

      Propriétés utiles :

      - `background-color` : couleur de fond ;
      - `background-size: cover;` : l'image de fond remplit l'espace ;
      - `background-position: center;` : centre l'image ;
      - `color` : couleur du texte ;
      - `font-family` : police ;
      - `text-shadow` : ombre, pour garder le texte lisible sur une image.

      ```css
      .container {
          display: flex;
          flex-direction: column;
          gap: 13px;
          color: white;
          font-family: Arial, sans-serif;
          text-shadow: 1px 1px 3px black;
      }
      ```

      *Attention : le texte reste lisible, le fond ne cache pas les images du tableau, les couleurs vont ensemble, les images sont toujours dans `images`.*

      Le rendu peut se rapprocher de celui-ci. La palette est la vôtre.

      ![base](/content/1/etape_3.png)
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Ce qu'on rend <Icone nom="package" />

On rend une archive du dossier entier `projet_site_eleve`, et pas seulement `index.html` : sans le dossier, les images et le CSS manquent à l'ouverture.

Le dossier contient :

- `index.html` ;
- `style.css` ;
- le dossier `images`, avec toutes les images utilisées.

Sous Windows 11 :

1. Ouvrez l'explorateur de fichiers.
2. Retrouvez le dossier `projet_site_eleve`.
3. Clic droit sur le dossier.
4. **Compresser dans un fichier ZIP**.
5. Si l'option n'apparaît pas : **Afficher plus d'options**, puis **Envoyer vers** > **Dossier compressé**.
6. Windows crée `projet_site_eleve.zip`.
7. Renommez l'archive, par exemple `NOM_Prenom_projet_site_eleve.zip`.
8. Déposez-la sur Pronote.
