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

Les organisations font tourner leur activité sur des systèmes d'information : dossiers, messagerie, paiement, production. Plus ces systèmes sont reliés, plus un incident les atteint loin. La cybersécurité est l'ensemble des mesures qui protègent les données, les infrastructures et la confiance qu'on leur porte. Elle ne promet pas le risque zéro. Elle le ramène à un niveau que l'organisation accepte, en connaissance de cause.

## Confidentialité, intégrité, disponibilité

Le modèle **CIA** (en français on dit aussi **DIC**, en commençant par la disponibilité) tient en trois exigences. Un contrôle qui n'en sert qu'une peut en abîmer une autre. Chiffrer un disque protège la confidentialité. Perdre la clé détruit la disponibilité.

La **confidentialité** veut que l'information ne soit lisible que par les personnes et les processus autorisés. Données personnelles, secrets de fabrication, mots de passe. On chiffre au repos et pendant le transport, on authentifie puis on autorise, on classe les données selon ce qu'elles coûteraient si elles sortaient, on passe par un VPN quand l'accès se fait depuis l'extérieur.

L'**intégrité** veut que l'information reste exacte et complète, et qu'une modification non autorisée se voie. Une empreinte de hachage, par exemple SHA-256, résume un fichier : si le fichier change, l'empreinte change. Une signature numérique relie un document à une identité. Les journaux d'audit gardent la trace de qui a modifié quoi. Un checksum détecte une copie abîmée. Aucun de ces mécanismes n'empêche à lui seul l'écriture. Ils rendent la modification visible, ou ils la réservent à qui possède la clé.

La **disponibilité** veut que le service réponde au moment où les personnes autorisées en ont besoin. On met les équipements en redondance : disques en RAID, alimentations doubles. Un **PRA**, plan de reprise d'activité, dit comment revenir après un sinistre. Un **PCA**, plan de continuité, dit comment continuer pendant. On se protège des dénis de service, et l'on sauvegarde, y compris sur un support qui n'est pas en permanence relié au système qu'on protège.

Deux exigences s'ajoutent souvent au trio. L'**authenticité** : l'émetteur est bien celui qu'il prétend être. La **non-répudiation** : l'auteur d'une action ne peut pas nier ensuite l'avoir faite, parce qu'une preuve tient sans lui.

## De l'actif à l'impact

On ne protège pas « l'informatique » en général. On protège des **actifs** : ce qui a de la valeur. Une base clients, un serveur web, la réputation. Une **menace** est une cause possible d'incident : une personne qui attaque, un logiciel malveillant, un incendie, une erreur de manipulation. Une **vulnérabilité** est une faiblesse que cette menace peut exploiter : un logiciel non corrigé, un mot de passe trop simple, une porte laissée ouverte. L'**incident** est l'événement qui a déjà compromis la confidentialité, l'intégrité ou la disponibilité. L'**impact** est la conséquence pour l'organisation : argent, image, production arrêtée.

| Terme | Définition | Exemple |
| :--- | :--- | :--- |
| **Actif** | Ce qui a de la valeur et doit être protégé | Base clients, serveur web, réputation |
| **Menace** | Cause possible d'un incident | Attaquant, virus, incendie, erreur humaine |
| **Vulnérabilité** | Faiblesse qu'une menace peut exploiter | Logiciel non mis à jour, mot de passe faible |
| **Incident** | Événement qui compromet le CIA | Vol de données, rançongiciel, panne |
| **Impact** | Conséquence pour l'organisation | Perte financière, atteinte à l'image |

La menace sans vulnérabilité exploitable ne produit pas l'incident. La vulnérabilité sans menace ne le produit pas non plus ce jour-là. Le risque naît de la rencontre, et de ce que l'incident coûterait.

## Des menaces qu'il faut savoir nommer

Le **phishing**, l'hameçonnage, est une manipulation : un message imite un expéditeur légitime pour faire révéler un mot de passe ou un identifiant bancaire. On forme les utilisateurs, on filtre les messages, on ajoute une authentification multifacteur pour qu'un mot de passe volé ne suffise plus.

Le **rançongiciel** chiffre les données et demande une rançon contre la clé. La parade qui tient est une sauvegarde dont l'attaquant ne peut pas chiffrer la copie, plus les mises à jour et un outil de détection sur les postes.

L'attaque de l'**homme du milieu** s'insère dans un échange pour l'écouter ou le modifier. HTTPS, TLS, un VPN et une authentification des deux côtés rendent l'insertion visible ou inutile : le contenu ne circule pas en clair.

Le **déni de service distribué** noie un service sous un trafic venu de nombreuses machines, souvent un botnet, jusqu'à le rendre indisponible. C'est une attaque contre la disponibilité. On la traite par du filtrage et des services spécialisés, pas par une correction dans l'application seule.

L'**injection SQL** consiste à glisser une requête dans une saisie que l'application recolle dans une commande SQL. Les requêtes préparées séparent la commande et les données. Valider ce qui entre limite aussi ce qu'on accepte de transmettre.

Une faille **zero-day** est exploitée avant que l'éditeur ait publié un correctif, parfois avant même qu'il la connaisse. Il n'y a pas de mise à jour à appliquer le jour même. On compte sur la défense en profondeur, la détection de comportements anormaux, et la veille.

## Estimer, puis traiter

On estime un risque en croisant la **vraisemblance** qu'une menace exploite une vulnérabilité, et l'**impact** si cela arrive. Le cours le note :

$$ \text{Risque} = \text{Vraisemblance} \times \text{Impact} $$

Ce n'est pas une probabilité mathématique. C'est une grille pour comparer des risques entre eux. Faible, moyen, fort, critique : les mots servent à décider de l'ordre, pas à calculer une espérance.

| Vraisemblance / Impact | Faible | Moyen | Fort | Critique |
| :--- | :--- | :--- | :--- | :--- |
| **Forte** | Moyen | Élevé | Critique | Critique |
| **Moyenne** | Faible | Moyen | Élevé | Critique |
| **Faible** | Faible | Faible | Moyen | Élevé |

Quatre traitements. **Réduire** : une mesure diminue la vraisemblance ou l'impact, un pare-feu, une sauvegarde. **Accepter** : la protection coûterait plus cher que le dommage, et l'on assume, par écrit. **Transférer** : une assurance, ou un prestataire qui porte une partie du risque. **Éviter** : on supprime l'activité, par exemple on ne stocke pas les numéros de carte. Accepter n'est pas oublier. C'est un choix, revu quand le contexte change.

En France, **EBIOS Risk Manager**, publié par l'ANSSI, est la méthode de référence pour mener cette analyse et choisir les mesures. Elle part des événements redoutés et des parties prenantes, pas d'un catalogue de outils à installer.
