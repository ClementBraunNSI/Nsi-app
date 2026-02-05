# Devoir Surveillé – BTS SIO 1ere année (B3)

## RGPD & Conformité : Cadre Légal, Obligations et Audit

**Durée totale : 2 heures**  
**Partie 1** – Cadre juridique et principes fondamentaux (10 points)  
**Partie 2** – Obligations, Droits et Sécurité (10 points)  
**Partie 3** – Audit et mise en situation pratique (10 points)

**La justification, la rigueur, la rédaction et le soin de la copie entrent dans la notation (bonus/malus).**

---

## Partie 1 – Cadre juridique et principes (10 points)

### 1.1 Définitions et Acteurs (3 points)

#### Question 1 : Qualification (1 point)
Dans le cadre de la gestion administrative d'une entreprise :
a) Qui est juridiquement qualifié de **Responsable de Traitement (RT)** ?
b) Si cette entreprise confie l'hébergement de ses données à une société tierce, comment est qualifiée cette société tierce au sens du RGPD ?

#### Question 2 : Données personnelles (1 point)
Parmi les données suivantes, lesquelles sont considérées comme des **données personnelles** au sens du RGPD ? Justifiez brièvement pour chaque cas.
- Une adresse IP
- Un numéro de SIRET d'entreprise
- Une plaque d'immatriculation
- Des données statistiques anonymisées de manière irréversible

#### Question 3 : Données sensibles (1 point)
Citez **deux catégories** de données dites "sensibles" (Article 9) dont le traitement est par principe interdit (sauf exceptions strictes).

### 1.2 Principes Fondamentaux (4 points)

#### Question 1 : Finalité et Minimisation (2 points)
Une application de "Lampe Torche" sur smartphone demande l'accès à la géolocalisation précise et au carnet d'adresses de l'utilisateur pour fonctionner.
a) Quel principe fondamental du RGPD n'est **pas respecté** concernant l'usage prévu des données ?
b) Quel autre principe n'est pas respecté concernant la quantité de données collectées ? Expliquez pourquoi.

#### Question 2 : Durée de conservation (1 point)
Une entreprise conserve les CV des candidats non retenus pendant 10 ans dans sa base de données "au cas où un poste se libérerait".
Cette pratique est-elle conforme ? Quelle est la règle générale recommandée (durée raisonnable) pour la conservation des données de recrutement après un refus ?

#### Question 3 : Licéité et Loyauté (1 point)
Une entreprise collecte des adresses emails via un jeu-concours pour gagner une tablette, mais utilise ensuite ces emails pour revendre sa base de données à des partenaires tiers sans jamais en avoir informé les participants.
Quel principe de base (Art 5.1.a) est violé ici ?

### 1.3 Bases Légales (3 points)

#### Question 1 : Identification de la base légale (1,5 point)
Pour chaque traitement ci-dessous, indiquez la **base légale** la plus appropriée parmi les 6 prévues par le RGPD (Consentement, Contrat, Obligation légale, Intérêt légitime, etc.) :
1. Une banque vérifie l'identité d'un client et l'origine des fonds pour lutter contre le blanchiment d'argent.
2. Un site e-commerce transmet l'adresse du client au transporteur pour la livraison du colis commandé.
3. Une marque de vêtements envoie une newsletter promotionnelle à un prospect qui s'est inscrit volontairement via un formulaire dédié.

#### Question 2 : Validité du consentement (1,5 point)
Un formulaire d'inscription présente une case pré-cochée : *"☑ J'accepte de recevoir des offres partenaires"*.
Ce consentement est-il valide au sens du RGPD ? Citez les **4 critères** cumulatifs d'un consentement valide pour justifier votre réponse.

---

## Partie 2 – Obligations, Droits et Transferts (10 points)

### 2.1 Obligations de conformité (3 points)

#### Question 1 : Le Registre des traitements (1,5 point)
Le RGPD impose la tenue d'un registre des activités de traitement (obligatoire pour les organismes > 250 salariés ou traitements à risque).
a) Quel est l'objectif principal de ce document pour l'organisme ?
b) Citez **trois informations** qui doivent obligatoirement figurer dans ce registre pour chaque fiche de traitement.

#### Question 2 : Notification de violation (1,5 point)
En cas de fuite de données (ex: vol d'un fichier client non chiffré), le Responsable de Traitement a une obligation de notification.
a) Auprès de quelle autorité doit-il effectuer cette notification en priorité ?
b) Dans quel délai maximum après la découverte de la violation ?

### 2.2 Droits des personnes en action (3 points)

Identifiez le **droit spécifique** (nom précis) que la personne souhaite exercer dans les situations suivantes :

1.  *Situation A* : Un utilisateur change de plateforme de streaming musical et souhaite récupérer tout son historique d'écoute et ses playlists dans un format structuré (XML/CSV) pour les importer chez le concurrent.
2.  *Situation B* : Un ancien client demande à ne plus jamais recevoir d'appels téléphoniques de prospection commerciale de la part de l'entreprise (droit absolu).
3.  *Situation C* : Un candidat constate une erreur dans l'orthographe de son nom sur son espace personnel et demande à l'entreprise de la corriger.

### 2.3 Sécurité et Mesures Techniques (4 points)

Le RGPD impose des mesures techniques et organisationnelles appropriées pour garantir la sécurité des données personnelles.

#### Question 1 : Chiffrement et Pseudonymisation (2 points)
Expliquez la différence entre :
a) Le **chiffrement** des données
b) La **pseudonymisation** des données

Pour chaque technique, citez un exemple concret d'application dans un système informatique.

#### Question 2 : Sauvegardes et Haute Disponibilité (1 point)
Une entreprise héberge des données clients sur ses serveurs. Quelles mesures techniques doit-elle mettre en place pour garantir la **disponibilité** des données en cas de panne ou de catastrophe ?

#### Question 3 : Gestion des accès et habilitations (1 point)
Dans un système de gestion des données, pourquoi est-il important de mettre en place un **contrôle d'accès basé sur les rôles (RBAC)** ? Citez deux principes de sécurité fondamentaux.

---

## Partie 3 – Audit et mise en situation pratique (10 points)

*Cette partie s'appuie sur les compétences développées lors du TP "Audit RGPD d'un site web".*

### 3.1 Analyse d'un rapport d'audit (5 points)

Vous effectuez l'audit de conformité du site d'actualité "News-Tech-Daily.com". Voici un extrait de vos observations relevées lors de l'analyse technique (via *Cookie-Editor* et navigation).

**Pour chaque observation, indiquez si elle constitue une violation du RGPD et justifiez votre réponse.**

| # | Observation relevée sur le site | Conformité (Oui/Non) | Analyse et Justification |
|---|---------------------------------|----------------------|--------------------------|
| A | Dès l'arrivée sur le site, un bandeau indique : *"En poursuivant votre navigation, vous acceptez l'utilisation de cookies"*. Aucun bouton "Refuser" n'est visible au premier niveau. | | |
| B | L'outil *Cookie-Editor* révèle que des cookies *Google Analytics* et *Facebook Pixel* sont déposés avant même que l'utilisateur n'ait cliqué sur le bandeau. | | |
| C | Le formulaire de contact demande obligatoirement la date de naissance et le numéro de téléphone personnel pour poser une simple question au support. | | |
| D | Les mentions légales du site indiquent clairement l'identité de l'éditeur, de l'hébergeur et les coordonnées du DPO. | | |
| E | Dans la politique de confidentialité, il est écrit : *"Vos données de connexion sont conservées sans limitation de durée à des fins statistiques."* | | |

### 3.2 Méthodologie et Cookies (3 points)

#### Question 1 : Typologie (1,5 point)
Lors de votre audit, vous avez identifié différents types de cookies. Classez les cookies suivants en deux catégories : **"Exemptés de consentement"** ou **"Consentement obligatoire"**.
1. Cookie de panier d'achat (session e-commerce)
2. Cookie de mesure d'audience (statistiques anonymes strictes, ex: Matomo configuré sans traceur)
3. Cookie de ciblage publicitaire (Retargeting)

#### Question 2 : Outils d'audit (1,5 point)
Lors du TP, vous avez utilisé des outils comme *Cookiebot* ou *Cookie-Editor*.
À quoi sert principalement un **scanner de cookies automatique** (comme Cookiebot) par rapport à une vérification manuelle dans le navigateur ? Quel est l'avantage de l'outil automatique pour le Responsable de Traitement ?

### 3.3 Mise en conformité (2 points)

Suite à votre audit, le client vous demande de rédiger la **mention d'information** à placer sous son formulaire de collecte d'emails (Newsletter).
Rédigez une phrase (ou un court paragraphe) qui respecte le principe de **Transparence**, en précisant obligatoirement :
- La finalité (pourquoi on collecte l'email)
- La base légale (sur quoi on se fonde)
- Le droit des personnes (ce qu'elles peuvent faire)
- La durée de conservation (optionnel mais recommandé)

*Exemple de structure à compléter : "Vos données sont collectées par [Entreprise] afin de... sur la base de... Vous disposez d'un droit de..."*
