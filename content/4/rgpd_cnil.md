---
title: "Attendus RGPD & CNIL"
description: "Politique de collecte et protection des données personnelles : RGPD, CNIL et droits des citoyens"
level: "BTS"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
icon: "⚖️"
---

## 1. Comprendre le cadre légal

### 1.1 Qu'est-ce que le RGPD ?

> **RGPD (Règlement Général sur la Protection des Données)**
>
> Texte réglementaire européen entré en vigueur le **25 mai 2018**. Il encadre le traitement des données personnelles sur tout le territoire de l'Union Européenne.
>
> **Objectifs :**
> * Redonner aux citoyens le contrôle de leurs données personnelles.
> * Responsabiliser les acteurs (entreprises, associations, administration).
> * Unifier la réglementation à travers l'Europe (marché unique numérique).

#### Notions clés

> **Donnée Personnelle**
>
> Toute information se rapportant à une personne physique identifiée ou identifiable :
> * **Directement** : Nom, Prénom, Email nominatif.
> * **Indirectement** : Numéro de téléphone, Plaque d'immatriculation, Numéro Sécurité Sociale, Identifiant client.

> **Traitement de données**
>
> Toute opération effectuée sur des données personnelles, quel que soit le procédé utilisé (automatisé ou papier) : collecte, enregistrement, organisation, conservation, modification, extraction, consultation, utilisation, communication, diffusion, effacement ou destruction.
>
> *Exemple : Un simple fichier Excel avec des noms de clients EST un traitement.*

> 🌍 **Portée territoriale (Extraterritorialité)** : Le RGPD s'applique à toute organisation établie dans l'UE, mais aussi aux organisations **hors UE** si elles ciblent des résidents européens (offre de biens/services ou suivi de comportement).

> ⚠️ **Données Sensibles** : Le traitement de certaines données est par principe **INTERDIT** (sauf exceptions strictes) : origine ethnique, opinions politiques, convictions religieuses, appartenance syndicale, données génétiques, biométriques, de santé ou concernant la vie sexuelle.

### 1.2 La CNIL : Le régulateur français

> **Qu'est-ce que la CNIL ?**
>
> La **Commission Nationale de l'Informatique et des Libertés** est une **Autorité Administrative Indépendante (AAI)** créée par la loi Informatique et Libertés du 6 janvier 1978. Elle est le régulateur des données personnelles en France. Elle agit au nom de l'État mais sans être soumise à l'autorité du gouvernement.

#### Les 4 missions principales

La CNIL remplit 4 missions essentielles pour la protection des données :

* **1. Informer et protéger les droits :** Elle répond aux demandes des particuliers, reçoit les plaintes (plus de 14 000 par an) et aide les citoyens à exercer leurs droits.
* **2. Accompagner la conformité :** Elle aide les entreprises et organismes publics à se mettre en conformité via des boîtes à outils, des référentiels sectoriels, des guides pratiques et des labels.
* **3. Anticiper et innover :** Elle mène une veille technologique (via le *LINC*, son laboratoire d'innovation) pour évaluer les conséquences des nouvelles technologies (IA, smartphones, objets connectés) sur la vie privée.
* **4. Contrôler et sanctionner :** Elle vérifie le respect de la loi sur le terrain ou en ligne et peut punir les infractions constatées.

#### Les pouvoirs de contrôle

La CNIL effectue plusieurs centaines de contrôles par an pour vérifier la conformité des organismes.

> **Types de contrôles**
>
> * **Contrôle en ligne :** Vérification à distance depuis les locaux de la CNIL (cookies, mentions légales, formulaires web).
> * **Contrôle sur pièces :** Échanges de courriers et demandes de documents (registres, contrats de sous-traitance).
> * **Contrôle sur place :** Visite inopinée ou programmée dans les locaux de l'entreprise (accès aux serveurs, audition du personnel).
> * **Audition :** Convocation des responsables à la CNIL.

### 1.3 Les acteurs clés

> **Responsable de Traitement (RT)**
>
> C'est la personne (morale ou physique), l'autorité publique ou l'organisme qui **détermine les finalités et les moyens** du traitement.
>
> **Missions principales :**
> * Assurer la conformité globale au RGPD.
> * Mettre en œuvre les mesures de sécurité appropriées.
> * Répondre aux demandes d'exercice de droits.
> * Notifier les violations de données à la CNIL.
>
> *Exemple : Une entreprise qui gère la paie de ses salariés est RT.*

> **Sous-traitant (ST)**
>
> C'est la personne ou l'organisme qui traite des données **pour le compte et sur instruction** du responsable de traitement.
>
> **Missions principales :**
> * Ne traiter les données que sur instruction documentée du RT.
> * Garantir la confidentialité et la sécurité des données.
> * Aider le RT à respecter ses obligations (sécurité, AIPD, droits des personnes).
> * Supprimer ou renvoyer les données à la fin du contrat.
>
> *Exemple : Un hébergeur web, un service cloud, un cabinet comptable externe.*

> **Délégué à la Protection des Données (DPO)**
>
> Le "pilote" de la conformité. Sa désignation est **obligatoire** pour les organismes publics et ceux traitant des données sensibles ou faisant du suivi régulier à grande échelle.
>
> **Missions principales :**
> * **Informer et conseiller** le RT et les employés.
> * **Contrôler** le respect du RGPD (audits internes).
> * Être le **point de contact** avec la CNIL et les personnes concernées.
> * Il doit être indépendant et ne pas avoir de conflit d'intérêts (ex: le DSI ne peut pas être DPO car il définit les moyens techniques).

## 2. Les Principes Fondamentaux

Pour être conforme, tout traitement de données doit respecter 6 grands principes (plus le principe de responsabilité).

> **1. Licéité, Loyauté, Transparence**
>
> Le traitement doit avoir une base légale, ne pas tromper les personnes et être expliqué clairement.
>
> *Exemple : Ne pas collecter d'emails sous prétexte d'un jeu-concours pour les revendre ensuite sans le dire.*

> **2. Limitation des finalités**
>
> Les données sont collectées pour un but précis, légitime et déterminé. Pas de réutilisation incompatible ("détournement de finalité").
>
> *Exemple : Les caméras de vidéosurveillance d'un magasin sont là pour la sécurité, pas pour surveiller la productivité des employés.*

> **3. Minimisation des données**
>
> Ne collecter que les données **strictement nécessaires** à l'objectif visé.
>
> *Exemple : Ne pas demander le numéro de Sécurité Sociale pour une carte de fidélité de supermarché.*

> **4. Exactitude**
>
> Les données doivent être exactes et tenues à jour. Les données incorrectes doivent être corrigées ou effacées.
>
> *Exemple : Si un client déménage et signale sa nouvelle adresse, l'entreprise doit mettre à jour sa base et ne plus envoyer de courrier à l'ancienne.*

> **5. Limitation de la conservation**
>
> Les données ne peuvent pas être conservées indéfiniment. Une **durée de conservation** doit être définie (ex: durée du contrat + prescription légale).
>
> *Exemple : Les CV des candidats non retenus doivent être supprimés après 2 ans (sauf accord contraire).*

> **6. Intégrité et Confidentialité**
>
> Le responsable doit garantir la sécurité des données (protection contre le vol, la perte, l'accès non autorisé).
>
> *Exemple : Les dossiers médicaux à l'hôpital ne doivent être accessibles qu'aux soignants, pas à l'administration ou aux visiteurs.*

> 🚨 **Accountability** (Responsabilité) : L'entreprise doit être capable de **prouver** à tout moment sa conformité (documentation, registres, procédures). On passe d'une logique de formalités préalables à une logique de responsabilité continue.

## 3. Les Bases Légales

Pour qu'un traitement soit licite, il doit **obligatoirement** se fonder sur l'une des 6 bases légales prévues par l'article 6 du RGPD. C'est la première question à se poser : "De quel droit je traite ces données ?"

> **1. Le Consentement (Art. 6.1.a)**
>
> La personne a donné son accord clair pour une finalité spécifique.
>
> **Exemple :** S'abonner à une newsletter, accepter les cookies de publicité ciblée.
>
> *Nota : Le consentement doit pouvoir être retiré aussi facilement qu'il a été donné.*

> **2. Le Contrat (Art. 6.1.b)**
>
> Le traitement est nécessaire à l'exécution ou à la préparation d'un contrat avec la personne.
>
> **Exemple :** Un site e-commerce a besoin de l'adresse pour livrer un colis. Une banque a besoin des revenus pour accorder un prêt.
>
> *Pas besoin de demander le consentement ici, car sans données, pas de service !*

> **3. L'Obligation Légale (Art. 6.1.c)**
>
> Le traitement est imposé par la loi (française ou européenne).
>
> **Exemple :** Un employeur doit déclarer les salaires à l'URSSAF. Une banque doit vérifier l'identité pour lutter contre le blanchiment.

> **4. La Sauvegarde des Intérêts Vitaux (Art. 6.1.d)**
>
> Nécessaire pour protéger la vie de la personne concernée ou d'une autre personne physique.
>
> **Exemple :** Un hôpital accède au dossier médical d'un patient inconscient arrivé aux urgences après un accident.

> **5. La Mission d'Intérêt Public (Art. 6.1.e)**
>
> Nécessaire à l'exécution d'une mission d'intérêt public ou relevant de l'autorité publique.
>
> **Exemple :** La gestion des impôts par la DGFIP, la gestion des étudiants par une université publique.

> **6. L'Intérêt Légitime (Art. 6.1.f)**
>
> Nécessaire aux intérêts de l'organisme, à condition de ne pas déséquilibrer les droits fondamentaux des personnes.
>
> **Exemple :** Une entreprise installe des caméras pour sécuriser ses locaux (son intérêt) sans filmer les postes de travail (droits des employés). La lutte contre la fraude à la carte bancaire.
>
> *Attention : C'est la base la plus complexe, elle nécessite souvent une "mise en balance" des intérêts.*

### Le Consentement valide

Pour être valide, le consentement doit être :
* **Libre** : Pas de contrainte ni de conséquence négative en cas de refus.
* **Spécifique** : Un consentement par finalité.
* **Éclairé** : La personne sait à quoi elle consent.
* **Univoque** : Acte positif clair (case à cocher, clic). Pas de case pré-cochée !

## 4. Les Droits des Personnes

Le RGPD renforce les droits des citoyens sur leurs données. Chaque personne (salarié, client, usager) dispose de droits qu'elle peut exercer à tout moment auprès du responsable de traitement.

> **1. Droit d'accès (Art. 15)**
>
> Toute personne peut demander à un organisme s'il détient des données sur elle et, si oui, en obtenir une copie lisible.
> *Cela permet de vérifier l'exactitude des données.*

> **2. Droit de rectification (Art. 16)**
>
> Permet de corriger des données inexactes ou de compléter des données incomplètes.
> *Exemple : Corriger une erreur dans l'orthographe d'un nom ou mettre à jour une adresse.*

> **3. Droit à l'effacement ("Droit à l'oubli" - Art. 17)**
>
> Permet de demander la suppression de ses données.
> **Attention, ce n'est pas un droit absolu !** On ne peut pas demander l'effacement si le traitement est nécessaire (ex: pour payer des impôts, pour exécuter un contrat en cours).

> **4. Droit à la limitation du traitement (Art. 18)**
>
> Permet de "geler" l'utilisation des données temporairement (par exemple, le temps de vérifier leur exactitude suite à une contestation).

> **5. Droit à la portabilité (Art. 20)**
>
> Permet de récupérer ses données dans un format structuré et lisible par machine (ex: CSV, XML) pour les transmettre à un autre organisme.
> *Exemple : Changer d'opérateur téléphonique ou de plateforme de streaming musical en gardant son historique.*

> **6. Droit d'opposition (Art. 21)**
>
> Permet de refuser qu'un organisme utilise ses données pour un objectif précis.
> **Absolu pour la prospection commerciale :** On peut toujours s'opposer à recevoir de la pub, sans justification.
> **Sous conditions pour les autres cas :** Il faut un motif légitime (sauf si le traitement est d'intérêt public).

> ⏱️ **Délais et Modalités** :
> * Le responsable doit répondre dans un délai de **1 mois** (prolongeable de 2 mois si complexe).
> * L'exercice des droits doit être **gratuit** pour le demandeur.
> * En cas de refus, le responsable doit motiver sa décision et informer des voies de recours (CNIL).

## 5. Obligations et Conformité

### 5.1 Le Registre des activités de traitement

C'est le document central de la conformité. Il recense tous les traitements effectués par l'organisme (Qui ? Quoi ? Pourquoi ? Combien de temps ? Sécurité ?). Il est obligatoire pour la plupart des entreprises.

### 5.2 L'Analyse d'Impact (AIPD / DPIA)

Obligatoire pour les traitements à **risque élevé** pour les droits et libertés (ex: données de santé, surveillance systématique, profilage). C'est une étude qui vise à identifier les risques et les mesures pour les atténuer.

### 5.3 Notification des violations

> En cas de fuite de données (vol, perte, accès non autorisé), le responsable doit notifier la CNIL dans les **72 heures**. Si le risque est élevé pour les personnes, il faut aussi les informer individuellement.

## 6. Sécurité et Concepts Avancés

### Privacy by Design & by Default

> **Privacy by Design (Protection dès la conception)**
>
> La protection des données doit être intégrée dès le début du projet informatique, et non ajoutée à la fin comme une "verrue".

> **Privacy by Default (Protection par défaut)**
>
> Par défaut, le système doit offrir le plus haut niveau de protection (ex: case non cochée, profil privé par défaut sur un réseau social).

### Sécurité des données

Le RGPD impose des mesures techniques et organisationnelles appropriées :
* **Pseudonymisation** : Remplacer les identifiants par des codes.
* **Chiffrement** : Rendre les données illisibles sans clé.
* **Sauvegardes** : Garantir la disponibilité.
* **Tests réguliers** de vulnérabilité.
* **Contrôle d'accès** : Authentification forte et gestion des droits.

### Mesures organisationnelles

> **Politique et Humain**
>
> La sécurité n'est pas que technique, elle est aussi humaine :
> * **Charte informatique** : Règles d'utilisation des outils.
> * **Sensibilisation** : Formation régulière du personnel (phishing, mots de passe).
> * **Gestion des départs** : Suppression immédiate des accès.
> * **Clauses de confidentialité** dans les contrats de travail.

## 7. Transferts de données hors UE

Le transfert de données personnelles en dehors de l'Union Européenne est par principe interdit, sauf exceptions encadrées.

### 7.1 Encadrement des transferts

> **Pays à niveau de protection adéquat**
>
> La Commission Européenne reconnaît que certains pays offrent un niveau de protection équivalent à celui de l'UE (ex: Suisse, Japon, Canada - secteur commercial). Les transferts vers ces pays sont libres.

> **Garanties appropriées**
>
> Pour les autres pays, il faut mettre en place des outils juridiques :
> * **BCR (Binding Corporate Rules)** : Règles internes d'entreprise pour les groupes multinationaux.
> * **Clauses Contractuelles Types (CCT)** : Modèles de contrats rédigés par la Commission Européenne.

### 7.2 Cas particuliers

* **États-Unis** : Le "Data Privacy Framework" facilite les échanges avec les entreprises américaines certifiées.
* **Cloud Computing** : Attention à la localisation des serveurs (AWS, Azure, Google Cloud). Héberger des données sensibles hors UE nécessite une vigilance accrue.

## 8. Sanctions

La CNIL dispose d'un pouvoir de sanction dissuasif. Les amendes peuvent aller jusqu'à :

> 💰 **10 millions d'euros** ou **2% du CA mondial** (manquements administratifs).
> 💰 **20 millions d'euros** ou **4% du CA mondial** (violation des droits, principes fondamentaux).

## 9. Cas pratiques et applications

### 9.1 Politique de confidentialité

Document obligatoire sur tout site web collectant des données. Elle doit être :
* **Accessible** depuis toutes les pages (footer).
* **Compréhensible** (langage clair, pas de jargon juridique).
* **Complète** (finalités, destinataires, durée, droits).

### 9.2 Gestion des cookies

> **Bandeau Cookies**
>
> * Le dépôt de cookies non essentiels (pub, réseaux sociaux) nécessite un **consentement préalable**.
> * Boutons obligatoires : "Tout accepter", "Tout refuser", "Personnaliser".
> * Il doit être aussi facile de refuser que d'accepter.
> * Durée de validité du choix : 6 mois recommandé.

## 📝 Cas Pratique : Le formulaire de contact

Vous développez un formulaire de contact pour un site vitrine. Analysez les éléments suivants :

| Élément | Conforme RGPD ? | Correction / Explication |
| :--- | :--- | :--- |
| Champ "Nom" (Obligatoire) | ✅ OUI | Nécessaire pour répondre (Minimisation). |
| Champ "Date de naissance" (Obligatoire) | ❌ NON | Inutile pour une simple prise de contact (Minimisation). |
| Case pré-cochée : "Je veux recevoir la newsletter" | ❌ NON | Le consentement doit être un acte positif. La case doit être vide par défaut. |
| Mention : "Vos données sont conservées 3 ans après le dernier contact" | ✅ OUI | Durée de conservation définie et transparente. |
| Lien vers la "Politique de confidentialité" | ✅ OUI | Obligation de transparence (Information). |
