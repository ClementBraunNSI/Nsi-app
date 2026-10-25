---
title: Attendus RGPD & CNIL
description: >-
  Politique de collecte et protection des données personnelles : RGPD, CNIL et
  droits des citoyens
level: BTS
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
icon: "scale"
prerequisites:
  - cours_owasp_web
audience: public
---

# RGPD et CNIL

Un formulaire, un fichier de paie, une caméra, un cookie : dès qu'une information désigne une personne, le droit s'en mêle. Le **RGPD**, règlement général sur la protection des données, est le texte européen entré en application le **25 mai 2018**. Il encadre le traitement des données personnelles sur tout le territoire de l'Union. Trois intentions. Rendre aux personnes un contrôle sur ce qu'on sait d'elles. Responsabiliser ceux qui traitent : entreprises, associations, administrations. Unifier les règles, pour qu'un même marché numérique ne change pas de régime à chaque frontière.

## Ce qu'on traite, et où le texte s'applique

Une **donnée personnelle** est toute information qui se rapporte à une personne physique identifiée ou identifiable. Directement : un nom, un prénom, une adresse électronique qui porte le nom. Indirectement : un numéro de téléphone, une plaque d'immatriculation, un numéro de sécurité sociale, un identifiant client. L'identifiant suffit. On n'a pas besoin du nom en clair pour que la personne soit retrouvable.

Un **traitement** est toute opération sur ces données, automatisée ou sur papier : collecter, enregistrer, organiser, conserver, modifier, extraire, consulter, utiliser, communiquer, diffuser, effacer, détruire. Un classeur Excel de clients est déjà un traitement. Le support ne change rien au droit.

Le règlement est **extraterritorial**. Il vise toute organisation établie dans l'Union. Il vise aussi une organisation hors de l'Union dès qu'elle propose des biens ou des services à des résidents européens, ou qu'elle suit leur comportement. Héberger le serveur ailleurs ne sort pas du texte.

Certaines données sont **sensibles**. Leur traitement est interdit par principe, sauf exceptions étroites : l'origine ethnique, les opinions politiques, les convictions religieuses, l'appartenance syndicale, les données génétiques, biométriques, de santé, ou celles qui concernent la vie sexuelle. « Sauf exception » ne veut pas dire « si c'est pratique ». L'exception est écrite, et elle se justifie.

## La CNIL

La **CNIL**, Commission nationale de l'informatique et des libertés, est le régulateur français. C'est une autorité administrative indépendante, créée par la loi Informatique et Libertés du **6 janvier 1978**. Elle agit au nom de l'État sans recevoir d'ordres du gouvernement sur ses contrôles.

Quatre missions. Elle **informe** et protège les droits : elle répond aux particuliers, reçoit les plaintes, plus de 14 000 par an, et aide à exercer les droits. Elle **accompagne** la conformité : boîtes à outils, référentiels de secteur, guides, labels. Elle **anticipe**, par la veille de son laboratoire d'innovation, le LINC, sur ce que l'IA, les téléphones et les objets connectés font à la vie privée. Elle **contrôle** et sanctionne, sur place ou en ligne.

Les contrôles prennent quatre formes. En **ligne**, depuis les locaux de la CNIL : cookies, mentions, formulaires. Sur **pièces** : courriers, registres, contrats de sous-traitance. Sur **place** : une visite, inopinée ou annoncée, les serveurs, le personnel. En **audition** : les responsables sont convoqués à la CNIL. Plusieurs centaines de contrôles ont lieu chaque année.

## Trois rôles à ne pas confondre

Le **responsable de traitement** est la personne, l'autorité ou l'organisme qui décide pourquoi on traite et avec quels moyens. C'est lui qui assure la conformité, met les mesures de sécurité, répond aux demandes de droits, et notifie les violations à la CNIL. L'entreprise qui gère la paie de ses salariés est responsable de ce traitement. Elle a choisi d'avoir un fichier de paie.

Le **sous-traitant** traite pour le compte du responsable, et sur ses instructions. C'est par exemple un hébergeur, un fournisseur de cloud ou un cabinet comptable externe. Il ne traite que sur instruction documentée. Il garantit la confidentialité et la sécurité. Il aide le responsable sur la sécurité, l'analyse d'impact et les droits des personnes. À la fin du contrat, il supprime les données ou les renvoie. Il ne décide pas de la finalité. S'il s'en invente une, il devient responsable de ce nouveau traitement.

Le **délégué à la protection des données**, le DPO, pilote la conformité. Le désigner est obligatoire pour les organismes publics, et pour ceux qui traitent des données sensibles à grande échelle ou qui suivent des personnes de façon régulière et systématique. Il informe et conseille le responsable et les employés. Il contrôle le respect du règlement, par des audits internes. Il est le point de contact de la CNIL et des personnes. Il doit être indépendant. Un conflit d'intérêts le disqualifie : le directeur des systèmes d'information, qui choisit les moyens techniques, ne peut pas être en même temps celui qui les contrôle.

## Six principes, et la preuve

Tout traitement conforme tient sur six principes, plus un septième qui change la façon de travailler.

**Licéité, loyauté, transparence.** Il existe une base légale. On ne trompe pas la personne. On explique clairement. Collecter des adresses « pour un jeu » afin de les revendre ensuite, sans le dire, casse les trois d'un coup.

**Limitation des finalités.** On collecte pour un but précis, légitime, déterminé. On ne réutilise pas les données pour un but incompatible. Les caméras d'un magasin sont là pour la sécurité. S'en servir pour chronométrer les employés, c'est un autre traitement, qui n'était pas annoncé.

**Minimisation.** On ne prend que ce qui est strictement nécessaire. Le numéro de sécurité sociale n'a rien à faire sur une carte de fidélité.

**Exactitude.** Les données sont justes et tenues à jour. Une adresse signalée comme fausse se corrige. Continuer d'envoyer le courrier à l'ancienne, c'est un manquement, pas une négligence sans nom.

**Limitation de la conservation.** Rien ne se garde « au cas où », sans durée. On fixe une durée : le temps du contrat, plus le délai de prescription, par exemple. Les CV des candidats non retenus se suppriment au bout de deux ans, sauf accord pour les garder plus longtemps.

**Intégrité et confidentialité.** Le responsable protège les données contre le vol, la perte, l'accès non autorisé. Un dossier médical d'hôpital se lit par les soignants qui en ont besoin, pas par l'administration générale ni par un visiteur.

Le septième principe s'appelle **accountability**, la responsabilité. L'organisme doit pouvoir prouver sa conformité à tout moment : documentation, registres, procédures. On n'est plus dans les déclarations préalables d'avant 2018. On est dans une responsabilité continue. Si rien n'est écrit, la conformité n'existe pas aux yeux du contrôleur, même si les gestes étaient justes.

## De quel droit

L'article 6 du RGPD pose six **bases légales**. Un traitement licite s'appuie sur l'une d'elles. La première question n'est pas « quel logiciel », c'est « de quel droit ».

Le **consentement** (article 6.1.a). La personne a dit oui, clairement, pour une finalité précise : une newsletter, des cookies de publicité ciblée. Elle doit pouvoir retirer ce oui aussi facilement qu'elle l'a donné.

Le **contrat** (6.1.b). Le traitement est nécessaire pour exécuter ou préparer un contrat avec la personne. L'adresse sert à livrer le colis. Les revenus servent à instruire le prêt. On ne demande pas un consentement décoratif : sans la donnée, le service n'existe pas.

L'**obligation légale** (6.1.c). La loi française ou européenne l'impose. L'employeur déclare les salaires à l'URSSAF. La banque vérifie l'identité contre le blanchiment.

La **sauvegarde des intérêts vitaux** (6.1.d). Il s'agit de protéger la vie de la personne ou d'une autre. L'hôpital ouvre le dossier d'un patient inconscient arrivé aux urgences.

La **mission d'intérêt public** (6.1.e). Le traitement sert une mission d'intérêt public ou l'exercice de l'autorité publique. Les impôts à la DGFiP. La scolarité dans une université publique.

L'**intérêt légitime** (6.1.f). L'organisme a un intérêt réel, qui ne doit pas écraser les droits des personnes. Des caméras pour sécuriser les locaux, sans filmer les postes de travail. La lutte contre la fraude à la carte. C'est la base la plus délicate : elle suppose une mise en balance, écrite, entre l'intérêt de l'organisme et les droits de la personne. « C'est plus simple pour nous » n'est pas un intérêt légitime.

Un consentement n'est valable que s'il est **libre** (pas de pénalité si l'on refuse), **spécifique** (un oui par finalité, pas un oui global), **éclairé** (la personne sait à quoi elle dit oui) et **univoque** (un acte positif : une case cochée, un clic). Une case déjà cochée n'est pas un consentement. C'est un silence qu'on a déguisé.

## Ce que la personne peut exiger

Chaque personne (salarié, client, usager) exerce ses droits auprès du responsable de traitement.

Le **droit d'accès** (article 15) permet de demander si l'organisme détient des données sur soi, et d'en obtenir une copie lisible. C'est aussi le moyen de vérifier qu'elles sont exactes.

Le **droit de rectification** (article 16) corrige une donnée fausse ou complète une donnée incomplète. Une lettre mal orthographiée dans un nom, une adresse qui a changé.

Le **droit à l'effacement**, souvent appelé droit à l'oubli (article 17), demande la suppression. Il n'est pas absolu. On ne l'obtient pas quand le traitement reste nécessaire : payer l'impôt, exécuter un contrat en cours. « Effacez tout » ne ferme pas un dossier que la loi oblige à garder.

Le **droit à la limitation** (article 18) gèle l'usage, le temps de vérifier une contestation. Les données restent. On ne s'en sert plus pour la finalité contestée, tant que le doute n'est pas levé.

Le **droit à la portabilité** (article 20) rend les données dans un format structuré, lisible par une machine (CSV, XML) pour les transmettre à un autre organisme. Changer d'opérateur, ou de plateforme de musique, en emportant son historique. Il joue surtout quand le traitement repose sur le consentement ou le contrat, et qu'il est automatisé.

Le **droit d'opposition** (article 21) refuse un usage précis. Pour la prospection commerciale, il est absolu : on n'a pas à se justifier pour ne plus recevoir de publicité. Pour le reste, il faut un motif légitime, sauf si le traitement relève de l'intérêt public.

Le responsable répond dans un délai d'**un mois**, prolongeable de deux mois si la demande est complexe. L'exercice est **gratuit**. Un refus se motive, et il indique le recours, en particulier la CNIL.

## Ce que l'organisme doit tenir

Le **registre des activités de traitement** est le document central. Il décrit chaque traitement : qui, quoi, pourquoi, combien de temps, avec quelle sécurité, vers qui les données partent. Il est obligatoire pour la plupart des organismes. C'est la première pièce qu'un contrôle demande.

L'**analyse d'impact**, AIPD ou DPIA, est obligatoire quand le traitement présente un risque élevé pour les droits et libertés : données de santé, surveillance systématique, profilage. On y décrit les risques et les mesures qui les réduisent, avant de lancer, pas après la plainte.

En cas de **violation** (vol, perte, accès non autorisé), le responsable notifie la CNIL dans les **72 heures**. Si le risque est élevé pour les personnes, il les prévient aussi, individuellement. Le délai court à partir du moment où l'on a connaissance de la violation. Attendre d'avoir tout compris n'arrête pas l'horloge.

## Dès la conception, pas en rustine

La **protection dès la conception** (*privacy by design*) intègre la protection au début du projet. L'ajouter à la fin, comme une couche posée sur un système déjà ouvert, laisse les données circuler par des chemins qu'on n'a pas prévus.

La **protection par défaut** (*privacy by default*) veut que le réglage livré soit le plus protecteur. Case non cochée. Profil privé sur un réseau social, tant que la personne n'a pas choisi le contraire.

Les mesures techniques que le règlement attend, adaptées au risque, sont concrètes. La **pseudonymisation** remplace les identifiants directs par des codes. Le **chiffrement** rend les données illisibles sans la clé. Les **sauvegardes** préservent la disponibilité. Des **tests** réguliers cherchent les vulnérabilités. Le **contrôle d'accès** authentifie et limite les droits au besoin.

La sécurité est aussi une affaire de personnes. Une **charte** dit comment les outils s'utilisent. La **sensibilisation** revient sur l'hameçonnage et les mots de passe. Le **départ** d'un salarié ferme ses accès le jour même. Les contrats portent une **clause de confidentialité**. Un chiffrement parfait ne corrige pas un compte encore ouvert trois semaines après une démission.

## Sortir de l'Union

Transférer des données personnelles hors de l'Union est interdit par principe. Des exceptions existent, encadrées.

La Commission européenne peut reconnaître qu'un pays offre un niveau **adéquat**, équivalent à celui de l'Union. La Suisse, le Japon, le Canada pour le secteur commercial en sont des exemples. Vers ces pays, le transfert est libre.

Ailleurs, il faut des **garanties**. Les *Binding Corporate Rules*, règles d'entreprise contraignantes, lient les entités d'un groupe multinational. Les **clauses contractuelles types** sont des modèles rédigés par la Commission, signés entre l'exportateur et l'importateur.

Les États-Unis passent par le *Data Privacy Framework* : le transfert est facilité vers les entreprises américaines qui y sont certifiées, pas vers n'importe quelle société du pays. Pour le cloud (AWS, Azure, Google Cloud), la question est la localisation des serveurs et le droit qui s'y applique. Héberger des données sensibles hors de l'Union demande de savoir dans quel pays elles se trouvent, et sur quel outil juridique le transfert repose.

## Les amendes

La CNIL sanctionne. Les plafonds sont faits pour compter dans un bilan. Jusqu'à **10 millions d'euros** ou **2 %** du chiffre d'affaires mondial, le plus élevé des deux, pour des manquements plus administratifs. Jusqu'à **20 millions d'euros** ou **4 %** du chiffre d'affaires mondial pour une violation des principes ou des droits des personnes. Le pourcentage explique pourquoi une très grande plateforme parle en centaines de millions, là où une PME parle en dizaines de milliers. Le taux est le même. L'assiette change.

## Sur un site

Toute collecte en ligne s'accompagne d'une **politique de confidentialité**. Elle est accessible depuis toutes les pages, en général dans le pied de page. Elle est écrite pour être comprise, pas pour être déchiffrée par un juriste. Elle dit les finalités, les destinataires, les durées, les droits.

Les **cookies** non essentiels (publicité, mesure d'audience qui n'est pas strictement nécessaire, réseaux sociaux) ne se déposent qu'après un consentement. Le bandeau propose d'accepter, de refuser ou de personnaliser. Refuser doit être aussi simple qu'accepter. Le choix se conserve ; six mois est la durée que la CNIL recommande avant de redemander.

## Le formulaire de contact

Un formulaire est à écrire pour un site vitrine. Chaque ligne se juge au principe, pas au réflexe « plus on en sait, mieux c'est ».

| Élément | Conforme RGPD ? | Correction / Explication |
| :--- | :--- | :--- |
| Champ "Nom" (Obligatoire) | <Icone nom="circle-check" /> OUI | Nécessaire pour répondre (Minimisation). |
| Champ "Date de naissance" (Obligatoire) | <Icone nom="circle-x" /> NON | Inutile pour une simple prise de contact (Minimisation). |
| Case pré-cochée : "Je veux recevoir la newsletter" | <Icone nom="circle-x" /> NON | Le consentement doit être un acte positif. La case doit être vide par défaut. |
| Mention : "Les données sont conservées 3 ans après le dernier contact" | <Icone nom="circle-check" /> OUI | Durée de conservation définie et transparente. |
| Lien vers la "Politique de confidentialité" | <Icone nom="circle-check" /> OUI | Obligation de transparence (Information). |

Le nom sert à répondre : il est nécessaire, donc compatible avec la minimisation. La date de naissance ne sert à rien pour un message. La case déjà cochée fabrique un consentement que la personne n'a pas donné. La durée écrite et le lien vers la politique sont le minimum de transparence. Un formulaire juste est souvent un formulaire plus court.
