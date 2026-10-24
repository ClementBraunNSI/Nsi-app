---
title: Données Structurées
description: 'Comprendre les formats de données (CSV, JSON) et les bases de données'
level: seconde
chapter: Données structurées
icon: "\U0001F5C4️"
prerequisites: []
audience: public
groupe: donnees-structurees
groupeTitre: "Données structurées"
---

# Données structurées

Dès que les ordinateurs ont eu à garder autre chose qu'un calcul, il a fallu ranger l'information pour la retrouver. Aujourd'hui, des applications, des sites et des systèmes d'intelligence artificielle s'appuient sur des quantités énormes de données. Elles ne sont utiles que si une machine peut les lire sans deviner.

> **Définition**
> Une **donnée structurée** est une information rangée selon un format décidé à l'avance. Ce format facilite le stockage, la recherche et le traitement automatique.

Deux familles reviennent sans cesse. Les données **tabulaires** se lisent en lignes et en colonnes, comme un tableau : le CSV en est l'exemple le plus simple. Les données **hiérarchiques** s'emboîtent, un élément contenant d'autres éléments : le JSON est fait pour cela.

## Quatre formats, quatre usages

| Format | Rôle | Exemple d'usage |
|----------|-------------------------------|-----------------------|
| **CSV** | Tableau simple | Tableurs, exports |
| **JSON** | Structure emboîtée | API web, fichiers de configuration |
| **XML** | Document balisé | Échanges entre administrations |
| **SQL** | Langage d'interrogation | Requêtes sur une base |

Le CSV et le JSON sont des fichiers. SQL n'est pas un format de fichier au même sens : c'est le langage avec lequel on interroge une base. On le met dans le même tableau parce que vous le croiserez au moment de « sortir » une information déjà rangée.

### Le CSV, un tableau dans un fichier texte

**CSV** veut dire *Comma-Separated Values* : des valeurs séparées par des virgules, ou souvent, en France, par des points-virgules. La première ligne donne en général le nom des colonnes. Chaque ligne suivante est un enregistrement.

Voici une petite base sur des renards. La virgule sépare les champs, pas les phrases.

```csv
Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61
```

Si vous ouvrez ce fichier dans un tableur, chaque virgule devient une frontière de colonne. C'est tout le format : rien de caché, et justement pour cela il supporte mal une information qui contient elle-même des sous-parties.

### Le JSON, quand une fiche a des tiroirs

**JSON** (*JavaScript Object Notation*) décrit des objets par des paires **clé-valeur**. Une valeur peut elle-même être un objet, ou une liste. On s'en sert beaucoup sur le Web parce que le fichier reste léger et qu'un humain peut encore le lire.

La fiche de Rusty ne tient pas dans une seule ligne de tableau : le poids, l'habitat et le menu ne sont pas au même niveau. Le JSON le montre.

```json
{
  "renard": {
    "nom": "Rusty",
    "espece": "Vulpes vulpes",
    "caracteristiques": {
      "poids": 6.5,
      "longueur": 58,
      "couleur": "roux",
      "age": 3
    },
    "habitat": {
      "type": "Forêt tempérée",
      "region": "Europe",
      "coordonnees": {
        "latitude": 48.8566,
        "longitude": 2.3522
      }
    },
    "alimentation": ["rongeurs", "oiseaux", "insectes", "fruits"]
  }
}
```

`alimentation` est une liste. `habitat` est un objet, qui contient encore un objet `coordonnees`. C'est cette imbrication que le CSV ne sait pas écrire sans se tordre.

## Les bases relationnelles

Quand les données deviennent nombreuses, et surtout quand elles se recoupent, un fichier ne suffit plus. On passe à une **base de données**. Le **modèle relationnel** range l'information dans des **tables** reliées entre elles.

Une **table** est un tableau : les lignes sont les enregistrements, les colonnes sont les champs. Une **relation** relie deux tables, en général grâce à une clé : le numéro qui permet de retrouver, dans une autre table, la fiche qui correspond. **SQL** est le langage standard pour interroger ces tables et les modifier.

| ID | Nom | Espèce | Habitat | Poids (kg) | Région |
|----|-----|--------|---------|------------|--------|
| 1 | Rusty | Vulpes vulpes | Forêt | 6.5 | Europe |
| 2 | Arctic | Vulpes lagopus | Toundra | 3.2 | Arctique |
| 3 | Fennec | Vulpes zerda | Désert | 1.5 | Afrique |
| 4 | Silver | Vulpes vulpes | Forêt | 7.1 | Amérique |

L'`ID` n'est pas un détail. C'est lui qui permettra, plus tard, de dire « cet animal » sans recopier tout son nom à chaque fois qu'une autre table en parle.

## Trier, filtrer, calculer

Une fois la table remplie, on ne la relit pas ligne à ligne. On lui pose des opérations.

**Trier**, c'est ranger : du plus léger au plus lourd, par exemple. **Filtrer**, c'est ne garder que ce qui nous intéresse, les renards de forêt, ou, dans une autre base, les monstres de type Feu. **Calculer**, c'est produire un nombre que la table ne contient pas encore, comme une moyenne.

La base ci-dessous se manipule directement. Essayez un tri, puis un filtre, et regardez ce qui reste.

<DataProcessor />

## Le cloud

> **Définition**
> Le **cloud computing**, l'informatique en nuage, consiste à utiliser des serveurs distants, via Internet, pour stocker des données ou exécuter des programmes, plutôt que de tout faire sur son propre disque.

Sur votre ordinateur, un fichier perdu avec la machine est perdu. Dans un data center, les mêmes fichiers sont copiés plusieurs fois, justement pour qu'une panne de disque ne les efface pas. Ce n'est pas immatériel : ce sont des bâtiments, de l'électricité, et des machines qui appartiennent à quelqu'un.

<CloudArchitecture />

La plupart des très gros acteurs, Google, Amazon, Microsoft, sont américains. La question n'est donc pas seulement « est-ce que mes fichiers sont en sécurité », mais « qui a le droit de les regarder ». Le *Cloud Act* américain permet, dans certains cas, à la justice des États-Unis d'exiger des données détenues par ces entreprises, y compris lorsque les serveurs sont ailleurs.

## Vos données, et le RGPD

> **RGPD**
> Depuis 2018, le règlement général sur la protection des données encadre, en Europe, la collecte et l'usage des données personnelles.

Le règlement ne dit pas qu'une entreprise n'a pas le droit de connaître votre nom. Il dit à quelles conditions elle peut le faire, et quels droits vous gardez : accéder à ce qui est stocké, le faire corriger, parfois le faire effacer. Le schéma ci-dessous reprend ces droits.

<RgpdRights />

## Quand il y en a trop, et quand on les ouvre

On parle de **big data** lorsque le volume devient trop grand pour les outils habituels, un tableur par exemple. Ces données viennent des téléphones, des réseaux sociaux, des objets connectés, des satellites. On les résume souvent par trois V.

Le **volume** est la quantité : des téraoctets, des pétaoctets. YouTube reçoit environ 500 heures de vidéo chaque minute. La **variété** rappelle que tout n'est pas un tableau propre : du texte, des photos, du son, une position, un clic. La **vélocité** est la vitesse à laquelle il faut les traiter. Un algorithme de trading décide en quelques millisecondes ; il ne peut pas attendre le lendemain.

L'**open data** est une autre démarche. Il s'agit de publier des données numériques gratuitement, sans restriction de droit d'auteur qui en empêcherait la réutilisation. Ce sont souvent l'État ou les collectivités qui ouvrent leurs fichiers, pour la transparence et pour que d'autres construisent des services dessus.

La RATP publie les horaires de bus en temps réel, et une application comme Citymapper s'en sert pour vous guider. La base des produits alimentaires nourrit une application comme Yuka. Le geste est le même : une donnée publique, réutilisée par quelqu'un d'autre.

Le portail officiel des données publiques françaises est [data.gouv.fr](https://www.data.gouv.fr).
