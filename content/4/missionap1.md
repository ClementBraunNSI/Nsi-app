---
title: "Mission AP1"
description: "Construction d'un SITE pour le GEI (HTML PHP)"
level: "4"
chapter: "BTS SIO 1 SLAM AP"
icon: "rocket"
audience: public
---

# Mission AP1 : Site du GEI

Le but de cette mission est de répondre à l'appel d'offres du Groupement des Entreprises d'Insertion : un site dynamique, consultable sur téléphone, branché sur une base de données.
Durée : 16 h (4 h par semaine, 4 semaines), atelier de professionnalisation, semestre 2. Travail en binôme.

**Compétences :** B1.3 Développer la présence en ligne de l'organisation. B1.4 Travailler en mode projet. B2.1 Concevoir et développer une solution applicative. B2.2 Assurer la maintenance corrective ou évolutive d'une solution applicative.

## 1. Le contexte <Icone nom="building-2" />

Le GEI, créé en 1988, représente 1 200 entreprises d'insertion en France. Elles emploient chaque année 65 000 salariés (collecte, tri, recyclage, environnement, tourisme, restauration, et d'autres secteurs). Le site doit installer cette identité : image actuelle, entreprises lisibles, communication cohérente, pages utilisables sur mobile.

Le site est à la fois une vitrine (présentation, missions, partenaires), un annuaire (illustrations, témoignages, chiffres), et un support qu'on ouvre sur téléphone comme sur grand écran.

Cinq rubriques, dans la navigation :

1. Contenus éditoriaux (c'est l'accueil)
2. Carte de France
3. Moteur de recherche
4. Contact
5. Mentions légales

*Attention à l'usage de l'IA : elle peut aider à comparer des pistes. Elle ne rédige pas le site à la place de l'équipe. Le code rendu est le vôtre, commenté en français.*

## 2. Les pages, avec un exemple à tenir <Icone nom="map" />

### Accueil : contenus éditoriaux

L'accueil affiche deux familles de contenus. Elles sont stockées en base, et non écrites en dur dans chaque page.

- Une actualité : titre, résumé, corps avec un lien, et au plus une pièce jointe (document, photo, son ou vidéo).
- Une page de présentation : offre de services, missions, organisation, chiffres clés. Un partenaire : logo, texte court, adresse du site.

Exemple d'actualité à insérer pour vérifier l'accueil. Elle est ensuite remplacée par des contenus GEI cherchés pour l'occasion. Ne pas inventer un chiffre d'affaires réel.

```text
titre   : Semaine du recyclage
resume  : Les entreprises du GEI ouvrent leurs ateliers.
corps   : Programme et inscription.
lien    : https://exemple.gei.invalid/semaine
```

L'accueil affiche le titre, le résumé, et le lien cliquable. Le corps s'ouvre au clic.

### Carte de France

La carte montre 18 régions : 13 métropolitaines et 5 d'outre-mer. Un clic sur le **nom** d'une des 13 régions métropolitaines ouvre, en pop-up ou dans un nouvel onglet, les entreprises de cette région, classées par nom, avec localisation, secteur, adresse, téléphone, e-mail, prénom et nom du dirigeant.

Ces informations viennent de la base. Prévoir deux entreprises par région, dans des secteurs variés. Les textes sont indicatifs : on ne réutilise pas un jeu de données déjà fourni par un autre sujet.

Aller plus loin, seulement quand le clic sur le nom fonctionne : rendre cliquables les 5 régions d'outre-mer, puis la zone de la région et plus seulement son nom.

### Moteur de recherche

Il est dans la barre de navigation. Il cherche dans les titres, les résumés et les corps, pour les actualités et pour les entreprises. Sans base, il ne peut pas répondre : la requête SQL utilise le mot tapé, et la page affiche les lignes trouvées.

Contrôle : le mot `recyclage` retrouve l'actualité d'exemple. Un mot absent affiche `Aucun résultat.`, pas une page blanche.

### Contact

Une entreprise s'inscrit une seule fois. Le formulaire PHP a deux parties.

- Entreprise : nom, adresse, code postal, e-mail, téléphone, secteur (liste déroulante).
- Dirigeant : nom, prénom, e-mail, téléphone.

La case de consentement n'est pas cochée par défaut. Les champs indispensables sont visibles comme tels. Les champs qui ne le sont pas ont une raison, écrite dans la politique de confidentialité. On ne demande pas une donnée dont la page ne se sert pas.

Contrôle : deux envois avec le même nom d'entreprise. Le second est refusé, la base ne gagne pas de doublon. Un envoi sans case cochée est refusé, rien n'est enregistré.

### Mentions légales

Un lien du pied de page y mène, par exemple `accéder aux mentions légales`. La page dit ce qui est collecté, pourquoi, et comment on demande la suppression ou la modification.

Informations du GEI à intégrer :

- RCS : 801 171 109
- TVA : FR3801171109
- Adresse : GEI Wallon, 22 avenue de l'explorateur de Kerguelen, 98412 France

Pour chaque mention obligatoire d'un site professionnel qui ne peut pas être remplie avec ces données (hébergeur, directeur de la publication, s'ils manquent), écrire que le site de démonstration ne correspond pas à cette catégorie, plutôt que d'inventer un nom.

<ExerciseTabs courseId="sio_ap1_pages" courseTitle="Pages du GEI">
  <ExerciseSection id="ap1-pages-1" label="Parcours de contrôle" type="autre">
    <Enonce>
      Avant de rendre, le site se parcourt dans cet ordre, sur un téléphone ou une fenêtre étroite, puis sur un écran large.

      1. L'accueil affiche l'actualité d'exemple, avec son lien.
      2. Un clic sur le nom d'une région métropolitaine liste ses deux entreprises.
      3. Le mot `recyclage` dans le moteur retrouve l'actualité. Un mot absent affiche `Aucun résultat.`
      4. Le formulaire refuse un doublon et refuse l'envoi sans consentement.
      5. Le pied de page ouvre les mentions, où figurent le RCS, la TVA et l'adresse ci-dessus.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Le déroulement, semaine après semaine <Icone nom="calendar-days" />

Chaque étape est validée en classe avant la suivante.

<ExerciseTabs courseId="sio_ap1_etapes" courseTitle="Étapes">
  <ExerciseSection id="ap1-etape-1" label="Répartition" type="autre">
    <Enonce>
      Écrire qui prend le HTML, le CSS, le PHP et le SQL. Estimer la durée de chaque tâche. Deux tâches peuvent avancer en parallèle. Mettre en place un outil (Gantt, Kanban ou Notion) et une capture, ou un export, fait partie du rendu.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap1-etape-2" label="Recherche" type="autre">
    <Enonce>
      Définir ce qu'est un template et ce qu'est un framework. En comparer au moins deux, avec les liens des sources, et dire lequel est retenu pour le squelette du site, et pourquoi il convient au GEI (pages répétables, formulaire, mobile).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap1-etape-3" label="Cahier des charges" type="autre">
    <Enonce>
      Rédiger le cahier des charges : charte graphique, technologies, utilité de chacune des cinq pages, où sont les liens et comment ils sont faits, arborescence des dossiers, nommage des fichiers, RGPD et mentions légales.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap1-etape-4" label="Base" type="autre">
    <Enonce>
      Chercher deux entreprises indicatives par région, secteurs variés. Ajouter les contenus d'accueil. Classer ce qui est public, interne, ou à accès restreint.

      Rendre le schéma relationnel et le dictionnaire des données : pour chaque champ, le nom, le type (texte, nombre, date) et la particularité (clé, obligatoire, unique). L'entreprise du formulaire ne peut apparaître qu'une fois : la contrainte est dans la base, pas seulement dans la page.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="ap1-etape-5" label="Site" type="autre">
    <Enonce>
      Construire le site dans un dossier partagé (drive, Notion ou GitHub). La charte vient du cahier des charges. Les pages sont en HTML5 et CSS, le formulaire en PHP, les lectures en SQL. Le site reste utilisable quand on rétrécit la fenêtre : le texte ne sort pas de l'écran, le menu reste atteignable.

      Commenter en français, simplement, les requêtes et les contrôles du formulaire.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Ce qu'on rend <Icone nom="package" />

- L'arborescence du site : noms de dossiers et de fichiers cohérents, code commenté en français, HTML5 et CSS tenus.
- Le cahier des charges.
- Les recherches, avec les liens des sources.
- Le schéma, le dictionnaire des données, et un jeu d'essai : l'actualité `Semaine du recyclage`, deux entreprises d'au moins une région, un refus de doublon.
- L'export ou la capture de l'outil de suivi (qui fait quoi, et pour combien de temps).
