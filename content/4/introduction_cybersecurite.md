---
title: Introduction à la cybersécurité
description: >-
  Introduction aux concepts fondamentaux de la cybersécurité, les piliers CIA,
  les menaces courantes et la gestion des risques.
level: '4'
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: premiers-pas-c-sharp
prerequisites: []
audience: public
---

# Introduction à la cybersécurité

Les organisations s'appuient sur des systèmes d'information pour leurs dossiers, leur messagerie, leurs paiements ou leur production. Plus ces systèmes sont reliés entre eux, plus un incident peut se propager loin. La **cybersécurité** regroupe les mesures qui protègent les données, les infrastructures et la confiance qu'on leur accorde. Elle ne garantit pas un risque nul, mais elle le ramène à un niveau que l'organisation accepte en connaissance de cause.

## Confidentialité, intégrité, disponibilité

Le modèle **CIA** (en français on dit aussi **DIC**, en commençant par la disponibilité) repose sur trois exigences. Une mesure qui protège l'une d'elles peut en fragiliser une autre : chiffrer un disque protège la confidentialité, mais perdre la clé rend les données indisponibles.

La **confidentialité** exige que l'information, comme des données personnelles, des secrets de fabrication ou des mots de passe, ne soit lisible que par les personnes et les processus autorisés. Pour cela, on chiffre les données stockées et transmises, on authentifie puis on autorise les accès, on classe les données selon le coût qu'aurait leur divulgation, et on utilise un VPN pour les accès depuis l'extérieur.

L'**intégrité** exige que l'information reste exacte et complète, et qu'une modification non autorisée se voie. Une empreinte de hachage, par exemple SHA-256, résume un fichier : si le fichier change, l'empreinte change. Une signature numérique relie un document à une identité. Les journaux d'audit gardent la trace de qui a modifié quoi. Un checksum détecte une copie abîmée. Aucun de ces mécanismes n'empêche à lui seul une modification : ils la rendent visible, ou la réservent à ceux qui possèdent la clé.

La **disponibilité** exige que le service réponde au moment où les personnes autorisées en ont besoin. On met pour cela les équipements en redondance, avec par exemple des disques en RAID ou des alimentations doubles. Un **PRA** (plan de reprise d'activité) indique comment reprendre l'activité après un sinistre, et un **PCA** (plan de continuité d'activité) comment continuer à travailler pendant le sinistre. Il faut aussi se protéger des dénis de service et faire des sauvegardes, y compris sur un support qui n'est pas relié en permanence au système protégé.

Deux exigences s'ajoutent souvent à ces trois-là. L'**authenticité** garantit que l'émetteur est bien celui qu'il prétend être. La **non-répudiation** garantit que l'auteur d'une action ne peut pas nier l'avoir faite, car il existe une preuve indépendante de lui.

## Actifs, menaces et vulnérabilités

On ne protège pas « l'informatique » en général, mais des **actifs**, c'est-à-dire ce qui a de la valeur. Ce peut être une base clients, un serveur web ou même la réputation de l'entreprise. Une **menace** est une cause possible d'incident : une personne qui attaque, un logiciel malveillant, un incendie, une erreur de manipulation. Une **vulnérabilité** est une faiblesse que cette menace peut exploiter : un logiciel non corrigé, un mot de passe trop simple, une porte laissée ouverte. L'**incident** est l'événement qui a déjà compromis la confidentialité, l'intégrité ou la disponibilité. L'**impact** est la conséquence pour l'organisation, comme une perte d'argent, une atteinte à l'image ou un arrêt de la production.

| Terme | Définition | Exemple |
| :--- | :--- | :--- |
| **Actif** | Ce qui a de la valeur et doit être protégé | Base clients, serveur web, réputation |
| **Menace** | Cause possible d'un incident | Attaquant, virus, incendie, erreur humaine |
| **Vulnérabilité** | Faiblesse qu'une menace peut exploiter | Logiciel non mis à jour, mot de passe faible |
| **Incident** | Événement qui compromet le CIA | Vol de données, rançongiciel, panne |
| **Impact** | Conséquence pour l'organisation | Perte financière, atteinte à l'image |

Une menace sans vulnérabilité exploitable ne provoque pas d'incident, et une vulnérabilité sans menace non plus. Le risque naît de la rencontre entre les deux, et il se mesure à ce que coûterait l'incident.

## Les principales menaces

Le **phishing**, l'hameçonnage, est une manipulation : un message imite un expéditeur légitime pour faire révéler un mot de passe ou un identifiant bancaire. On forme les utilisateurs, on filtre les messages, on ajoute une authentification multifacteur pour qu'un mot de passe volé ne suffise plus.

Le **rançongiciel** chiffre les données et demande une rançon contre la clé. La protection la plus efficace est une sauvegarde que l'attaquant ne peut pas chiffrer, complétée par les mises à jour et par un outil de détection sur les postes.

L'attaque de l'**homme du milieu** s'insère dans un échange pour l'écouter ou le modifier. HTTPS, TLS, un VPN et une authentification des deux côtés rendent l'insertion visible ou inutile : le contenu ne circule pas en clair.

Le **déni de service distribué** noie un service sous un trafic venu de nombreuses machines, souvent un botnet, jusqu'à le rendre indisponible. C'est une attaque contre la disponibilité, qui se traite par du filtrage et des services spécialisés, et non par une simple correction de l'application.

L'**injection SQL** consiste à glisser une requête dans une saisie que l'application recolle dans une commande SQL. Les requêtes préparées séparent la commande et les données. Valider les saisies limite aussi ce qui peut être transmis à la base.

Une faille **zero-day** est exploitée avant que l'éditeur ait publié un correctif, parfois avant même qu'il la connaisse. Comme aucune mise à jour n'est encore disponible, on compte sur la défense en profondeur, la détection des comportements anormaux et la veille.

## Estimer et traiter les risques

On estime un risque en croisant la **vraisemblance** qu'une menace exploite une vulnérabilité et l'**impact** si cela arrive :

$$ \text{Risque} = \text{Vraisemblance} \times \text{Impact} $$

Ce n'est pas une probabilité au sens mathématique, mais une grille qui permet de comparer les risques entre eux. Les niveaux faible, moyen, fort et critique servent à décider de l'ordre de traitement.

| Vraisemblance / Impact | Faible | Moyen | Fort | Critique |
| :--- | :--- | :--- | :--- | :--- |
| **Forte** | Moyen | Élevé | Critique | Critique |
| **Moyenne** | Faible | Moyen | Élevé | Critique |
| **Faible** | Faible | Faible | Moyen | Élevé |

Il existe quatre façons de traiter un risque. On peut le **réduire**, grâce à une mesure qui diminue sa vraisemblance ou son impact, comme un pare-feu ou une sauvegarde. On peut l'**accepter**, quand la protection coûterait plus cher que le dommage, en l'assumant par écrit. On peut le **transférer**, par exemple à une assurance ou à un prestataire. On peut enfin l'**éviter**, en supprimant l'activité concernée, par exemple en ne stockant pas les numéros de carte. Accepter un risque ne signifie pas l'oublier : c'est un choix, qu'il faut revoir quand le contexte change.

En France, **EBIOS Risk Manager**, publié par l'ANSSI, est la méthode de référence pour mener cette analyse et choisir les mesures. Elle part des événements redoutés et des parties prenantes, et non d'un catalogue d'outils à installer.
