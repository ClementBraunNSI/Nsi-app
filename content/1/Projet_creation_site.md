---
title: 'Projet : Création du Bestiaire'
description: 'Création d''un site web de bestiaire en 3 parties : HTML, CSS, et finalisation.'
level: '2'
chapter: Web
icon: "flame"
prerequisites:
  - activite_web_interactive
audience: public
---

# <Icone nom="library" /> Projet : Création du Bestiaire

Le but de ce projet est de créer la page d'un monstre dans le bestiaire de la classe.
Ce projet consiste à remplir la maquette HTML, retirer les bordures de repérage, puis poser le fond d'écran et la couleur du texte.

**Ressources :**
- [Maquette vide](projet_site_eleve.zip) : un fichier `index.html`, un dossier `image` pour l'image du monstre, un dossier `style` pour la feuille CSS.

Avant de commencer, relire la [notice sur HTML](Cours_html.md) : titres, paragraphes, listes, images.

## 1. Remplir la maquette <Icone nom="flame" />

Voici ce que la première séance doit reproduire :

![a_reproduire](/content/1/a_reproduire.png)

Chaque bloc de couleur est une `div` : une division de la page. La feuille de style ne se modifie pas pendant cette étape. Elle sert seulement à voir les zones.

![base](/content/1/base.png)

À cause d'un souci d'affichage, le nom du monstre correspond au bloc violet.

<ExerciseTabs courseId="snt_bestiaire" courseTitle="Bestiaire">
  <ExerciseSection id="bestiaire-1" label="Le contenu" type="python">
    <Enonce>
      Dans `index.html` :

      1. Remplacer le nom du monstre par un titre de niveau 1 (`h1`).
      2. Dans le bloc bleu, ajouter un paragraphe qui raconte la rivalité ou l'amitié entre son monstre et ses rivaux ou ses amis.
      3. Dans le bloc turquoise, garder une liste des lieux où on le trouve, ou la remplacer par un paragraphe si une liste ne convient pas.
      4. Dans le même bloc, ajouter une liste à puces de statistiques (si ce bestiaire doit servir de jeu de rôle) ou un paragraphe sur son habitat.
      5. Dans le bloc de la description, ajouter un titre de niveau 3, puis un paragraphe qui raconte l'histoire du monstre.

      Les images des rivaux s'ajoutent quand son monstre est disponible [ici](monstres.md).

      À la place du texte `image du monstre`, placer son image. Le fichier est dans le dossier `image`, et il porte le prénom de l'élève :

      ```html
      <img class="image_principale" align="left" height="400px" width="400px" src="image/votre_prenom.png" alt="nom_du_monstre"/>
      ```

      L'image du rival :

      ```html
      <img class="image_rival" width="30%" src="image/rival2.png" alt="Rival 2"/>
      ```

      *Attention : `src` et le nom du fichier doivent être identiques, y compris les majuscules. `alt` décrit l'image : ce n'est pas le chemin du fichier.*

      Contrôle : le `h1` est le nom du monstre, les deux images s'affichent, l'histoire est sous un `h3`, et on comprend qui est le rival.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Retirer les bordures <Icone nom="scissors" />

Le fichier `style.css` rassemble le style de la page. Une classe s'écrit ainsi :

```css
.classe_de_l_element {
    propriete_1: valeurs;
    propriete_2: valeurs;
}
```

Les bordures colorées servaient à voir les `div`. Le contenu est en place : on les retire.

En CSS, une bordure s'écrit souvent :

```css
border: solid;
border-color: red;
```

On rencontre aussi `border: 2px solid black;`, `border-width`, `border-style`.

<ExerciseTabs courseId="snt_bestiaire" courseTitle="Bestiaire">
  <ExerciseSection id="bestiaire-2" label="Le CSS" type="lecture">
    <Enonce>
      Dans `style.css`, supprimer toutes les lignes qui contiennent `border`. Chercher le mot dans tout le fichier : la classe `.container` peut apparaître plusieurs fois.

      Conserver `display`, `flex-direction`, `gap`, `text-align`, `width`, `height` et `object-fit`. Ces lignes organisent la page.

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

      Enregistrer, puis actualiser le navigateur. Le rendu se rapproche de celui-ci :

      ![final](/content/1/presque_fini.png)
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Fond et texte <Icone nom="palette" />

La classe `container` englobe la page. C'est là qu'on pose le fond et la couleur du texte.

<ExerciseTabs courseId="snt_bestiaire" courseTitle="Bestiaire">
  <ExerciseSection id="bestiaire-3" label="Le fond" type="python">
    <Enonce>
      Dans la classe `.container` de `style.css`, ajouter le fond et le texte blanc. Si la classe existe déjà, la compléter. Ne pas créer une deuxième classe du même nom à la fin du fichier en oubliant la première.

      ```css
      .container {
          background-image: url(../image/background.png);
          color: white;
      }
      ```

      Le chemin `../image/background.png` part du dossier `style` et remonte d'un cran pour entrer dans `image`.

      *Attention : le texte blanc doit rester lisible sur le fond. Si le fond est clair, changer `color`, pas la structure HTML.*

      Contrôle : le fond s'affiche, le texte est blanc, les images du monstre et du rival sont toujours là, les bordures de repérage ont disparu.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Le dossier de la maquette, complet :

- `index.html`, avec le `h1`, les textes, et les deux images ;
- `style/style.css`, sans les bordures de repérage, avec le fond et le texte blanc dans `.container` ;
- le dossier `image`, avec l'image du monstre, celle du rival, et le fond.

On ouvre `index.html` depuis ce dossier : les images suivent, sans qu'on les remette à la main.
