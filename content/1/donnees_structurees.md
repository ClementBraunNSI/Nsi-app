---
title: Données Structurées
description: 'Comprendre les formats de données (CSV, JSON) et les bases de données'
level: seconde
chapter: Données structurées
icon: "database"
prerequisites: []
audience: public
groupe: donnees-structurees
groupeTitre: "Données structurées"
---

# Données structurées

Dès que les ordinateurs ont dû conserver autre chose que des résultats de calcul, il a fallu ranger l'information pour pouvoir la retrouver. Aujourd'hui, des applications, des sites et des systèmes d'intelligence artificielle s'appuient sur des quantités énormes de données. Ces données ne sont utiles que si une machine peut les lire sans ambiguïté.

> **Définition**
> Une **donnée structurée** est une information rangée selon un format décidé à l'avance. Ce format facilite le stockage, la recherche et le traitement automatique.

On distingue deux grandes familles. Les données **tabulaires** se lisent en lignes et en colonnes, comme un tableau, et le CSV en est l'exemple le plus simple. Les données **hiérarchiques** sont emboîtées les unes dans les autres, chaque élément pouvant en contenir d'autres. Le format JSON est conçu pour ce type de données.

## Les principaux formats

| Format | Rôle | Exemple d'usage |
|----------|-------------------------------|-----------------------|
| **CSV** | Tableau simple | Tableurs, exports |
| **JSON** | Structure emboîtée | API web, fichiers de configuration |
| **XML** | Document balisé | Échanges entre administrations |
| **SQL** | Langage d'interrogation | Requêtes sur une base |

Le CSV et le JSON sont des fichiers. SQL, en revanche, n'est pas un format de fichier : c'est le langage qui permet d'interroger une base de données. Il figure dans ce tableau parce qu'on l'utilise pour extraire des informations déjà rangées.

### Le format CSV

**CSV** signifie *Comma-Separated Values*, c'est-à-dire valeurs séparées par des virgules. En France, on utilise aussi souvent le point-virgule comme séparateur. La première ligne donne en général le nom des colonnes. Chaque ligne suivante est un enregistrement.

Voici une petite base de données sur des renards, dans laquelle la virgule sépare les champs.

```csv
Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61
```

Quand ce fichier est ouvert dans un tableur, chaque virgule marque le passage à une nouvelle colonne. Le format s'arrête là. Il est donc très simple, mais il convient mal à une information qui contient elle-même des sous-parties.

### Le format JSON

**JSON** (*JavaScript Object Notation*) décrit des objets par des paires **clé-valeur**. Une valeur peut elle-même être un objet, ou une liste. On s'en sert beaucoup sur le Web parce que le fichier reste léger et qu'un humain peut encore le lire.

La fiche de Rusty ne tient pas dans une seule ligne de tableau, car le poids, l'habitat et l'alimentation ne sont pas au même niveau. Le JSON permet de représenter cette organisation.

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

`alimentation` est une liste. `habitat` est un objet, qui contient encore un objet `coordonnees`. Le CSV ne permet pas de représenter simplement ce type d'imbrication.

## Les bases relationnelles

Quand les données deviennent nombreuses, et surtout quand elles se recoupent, un fichier ne suffit plus. On passe à une **base de données**. Le **modèle relationnel** range l'information dans des **tables** reliées entre elles.

Une **table** est un tableau : les lignes sont les enregistrements, les colonnes sont les champs. Une **relation** relie deux tables, en général grâce à une clé : le numéro qui permet de retrouver, dans une autre table, la fiche qui correspond. **SQL** est le langage standard pour interroger ces tables et les modifier.

| ID | Nom | Espèce | Habitat | Poids (kg) | Région |
|----|-----|--------|---------|------------|--------|
| 1 | Rusty | Vulpes vulpes | Forêt | 6.5 | Europe |
| 2 | Arctic | Vulpes lagopus | Toundra | 3.2 | Arctique |
| 3 | Fennec | Vulpes zerda | Désert | 1.5 | Afrique |
| 4 | Silver | Vulpes vulpes | Forêt | 7.1 | Amérique |

La colonne `ID` est essentielle : elle permet à une autre table de désigner un animal précis sans recopier toutes ses informations.

## Trier, filtrer, calculer

Une fois la table remplie, on ne la relit pas ligne par ligne : on lui applique des opérations.

**Trier** consiste à ranger les lignes dans un certain ordre, par exemple du plus léger au plus lourd. **Filtrer** consiste à ne garder que les lignes utiles, comme les renards qui vivent en forêt ou, dans une autre base, les monstres de type Feu. **Calculer** consiste à produire un nombre que la table ne contient pas encore, comme une moyenne.

La base ci-dessous se manipule directement. Essayer un tri, puis un filtre, et regarder ce qui reste.

<DataProcessor />

## Le cloud

> **Définition**
> Le **cloud computing**, l'informatique en nuage, consiste à utiliser des serveurs distants, via Internet, pour stocker des données ou exécuter des programmes, plutôt que de tout faire sur son propre disque.

Sur un ordinateur personnel, un fichier perdu avec la machine est perdu. Dans un data center, les mêmes fichiers sont copiés plusieurs fois, justement pour qu'une panne de disque ne les efface pas. Le cloud n'a donc rien d'immatériel : il repose sur des bâtiments, sur des machines qui appartiennent à des entreprises, et sur beaucoup d'électricité.

<CloudArchitecture />

La plupart des très gros acteurs, comme Google, Amazon ou Microsoft, sont américains. Il faut donc se demander si les fichiers sont en sécurité, mais aussi qui a le droit de les consulter. Le *Cloud Act* américain permet, dans certains cas, à la justice des États-Unis d'exiger des données détenues par ces entreprises, y compris lorsque les serveurs sont ailleurs.

## Le RGPD

> **RGPD**
> Depuis 2018, le règlement général sur la protection des données encadre, en Europe, la collecte et l'usage des données personnelles.

Le règlement n'interdit pas à une entreprise de connaître le nom d'une personne. Il fixe les conditions dans lesquelles elle peut le faire, et les droits que garde la personne : elle peut accéder aux données stockées, les faire corriger et, dans certains cas, les faire effacer. Le schéma ci-dessous reprend ces droits.

<RgpdRights />

## Big data et open data

On parle de **big data** lorsque le volume de données devient trop grand pour les outils habituels, comme un tableur. Ces données viennent des téléphones, des réseaux sociaux, des objets connectés ou des satellites. On les décrit souvent avec la règle des trois V.

Le **volume** désigne la quantité de données, qui se compte en téraoctets ou en pétaoctets. YouTube reçoit par exemple environ 500 heures de vidéo chaque minute. La **variété** rappelle que ces données ne sont pas toutes des tableaux bien rangés : il peut s'agir de texte, de photos, de son, de positions ou de clics. La **vélocité** est la vitesse à laquelle il faut les traiter. Un algorithme de trading, par exemple, doit prendre ses décisions en quelques millisecondes.

L'**open data** est une autre démarche. Il s'agit de publier des données numériques gratuitement, sans restriction de droit d'auteur qui en empêcherait la réutilisation. Ce sont souvent l'État ou les collectivités qui ouvrent leurs fichiers, pour la transparence et pour que d'autres construisent des services dessus.

La RATP publie les horaires de bus en temps réel, et une application comme Citymapper s'en sert pour guider ses utilisateurs. La base des produits alimentaires nourrit une application comme Yuka. Dans les deux cas, des données publiques sont réutilisées par d'autres acteurs.

Le portail officiel des données publiques françaises est [data.gouv.fr](https://www.data.gouv.fr).
