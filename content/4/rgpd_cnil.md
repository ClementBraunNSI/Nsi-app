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

Un formulaire, un fichier de paie, une caméra ou un cookie sont concernés par le droit dès qu'une information permet de désigner une personne. Le **RGPD**, règlement général sur la protection des données, est le texte européen entré en application le **25 mai 2018**. Il encadre le traitement des données personnelles sur tout le territoire de l'Union. Il poursuit trois objectifs : redonner aux personnes le contrôle des informations qui les concernent, responsabiliser les organismes qui traitent ces données (entreprises, associations, administrations), et unifier les règles, pour que le marché numérique européen ne change pas de règles à chaque frontière.

## Données personnelles et traitements

Une **donnée personnelle** est toute information qui se rapporte à une personne physique identifiée ou identifiable. Elle peut l'identifier directement, comme un nom, un prénom ou une adresse électronique qui contient le nom, ou indirectement, comme un numéro de téléphone, une plaque d'immatriculation, un numéro de sécurité sociale ou un identifiant client. Un identifiant suffit donc : il n'est pas nécessaire de connaître le nom pour retrouver la personne.

Un **traitement** est toute opération sur ces données, automatisée ou sur papier, comme la collecte, l'enregistrement, l'organisation, la conservation, la modification, l'extraction, la consultation, l'utilisation, la communication, la diffusion, l'effacement ou la destruction. Un simple classeur Excel de clients est déjà un traitement, car le support ne change rien au droit.

Le règlement est **extraterritorial**. Il vise toute organisation établie dans l'Union. Il vise aussi une organisation hors de l'Union dès qu'elle propose des biens ou des services à des résidents européens, ou qu'elle suit leur comportement. Héberger le serveur hors de l'Union ne permet donc pas d'échapper au règlement.

Certaines données sont **sensibles**. Leur traitement est interdit par principe, sauf exceptions étroites : l'origine ethnique, les opinions politiques, les convictions religieuses, l'appartenance syndicale, les données génétiques, biométriques, de santé, ou celles qui concernent la vie sexuelle. Ces exceptions sont prévues par le texte et doivent être justifiées : elles ne s'appliquent pas simplement parce que ce serait pratique.

## La CNIL

La **CNIL**, Commission nationale de l'informatique et des libertés, est le régulateur français. C'est une autorité administrative indépendante, créée par la loi Informatique et Libertés du **6 janvier 1978**. Elle agit au nom de l'État sans recevoir d'ordres du gouvernement sur ses contrôles.

La CNIL a quatre missions. Elle **informe** et protège les droits : elle répond aux particuliers, reçoit plus de 14 000 plaintes par an et aide chacun à exercer ses droits. Elle **accompagne** les organismes dans leur mise en conformité, grâce à des boîtes à outils, des référentiels par secteur, des guides et des labels. Elle **anticipe** les évolutions, grâce à la veille de son laboratoire d'innovation, le LINC, sur les effets de l'IA, des téléphones et des objets connectés sur la vie privée. Enfin, elle **contrôle** et sanctionne, sur place ou en ligne.

Les contrôles prennent quatre formes. Les contrôles **en ligne**, menés depuis les locaux de la CNIL, portent sur les cookies, les mentions et les formulaires. Les contrôles **sur pièces** examinent des courriers, des registres ou des contrats de sous-traitance. Les contrôles **sur place** consistent en une visite, annoncée ou non, qui porte sur les serveurs et le personnel. Enfin, lors d'une **audition**, les responsables sont convoqués à la CNIL. Plusieurs centaines de contrôles ont lieu chaque année.

## Les acteurs du traitement

Le **responsable de traitement** est la personne, l'autorité ou l'organisme qui décide des finalités du traitement et des moyens utilisés. C'est lui qui assure la conformité, met en place les mesures de sécurité, répond aux demandes des personnes et signale les violations à la CNIL. Une entreprise qui gère la paie de ses salariés est responsable de ce traitement, puisque c'est elle qui a décidé de tenir ce fichier.

Le **sous-traitant** traite pour le compte du responsable, et sur ses instructions. C'est par exemple un hébergeur, un fournisseur de cloud ou un cabinet comptable externe. Il ne traite les données que sur instruction écrite, garantit leur confidentialité et leur sécurité, et aide le responsable pour la sécurité, l'analyse d'impact et les droits des personnes. À la fin du contrat, il supprime les données ou les restitue. Il ne décide pas de la finalité : s'il utilise les données pour un autre but, il devient responsable de ce nouveau traitement.

Le **délégué à la protection des données**, ou DPO, pilote la conformité. Sa désignation est obligatoire pour les organismes publics, ainsi que pour ceux qui traitent des données sensibles à grande échelle ou qui suivent des personnes de façon régulière et systématique. Il informe et conseille le responsable et les employés, contrôle le respect du règlement par des audits internes, et sert de point de contact pour la CNIL et pour les personnes. Il doit être indépendant, et un conflit d'intérêts l'empêche d'exercer : le directeur des systèmes d'information, qui choisit les moyens techniques, ne peut pas être en même temps celui qui les contrôle.

## Les grands principes

Un traitement conforme respecte six principes, auxquels s'ajoute un septième qui change la façon de travailler.

**Licéité, loyauté, transparence.** Le traitement repose sur une base légale, ne trompe pas la personne et lui est expliqué clairement. Collecter des adresses « pour un jeu » afin de les revendre ensuite, sans le dire, viole ces trois règles à la fois.

**Limitation des finalités.** Les données sont collectées pour un but précis, légitime et déterminé, et ne sont pas réutilisées pour un but incompatible. Les caméras d'un magasin servent par exemple à la sécurité : les utiliser pour chronométrer les employés constituerait un autre traitement, qui n'a pas été annoncé.

**Minimisation.** Seules les données strictement nécessaires sont collectées : le numéro de sécurité sociale n'a rien à faire sur une carte de fidélité.

**Exactitude.** Les données doivent être exactes et tenues à jour. Une adresse signalée comme fausse doit être corrigée, et continuer d'envoyer le courrier à l'ancienne adresse constitue un manquement.

**Limitation de la conservation.** On ne garde pas de données « au cas où » sans limite de temps : il faut fixer une durée de conservation, par exemple la durée du contrat augmentée du délai de prescription. Les CV des candidats non retenus se suppriment au bout de deux ans, sauf accord pour les garder plus longtemps.

**Intégrité et confidentialité.** Le responsable protège les données contre le vol, la perte et les accès non autorisés. Un dossier médical d'hôpital ne doit être consulté que par les soignants qui en ont besoin, et non par l'administration générale ou par un visiteur.

Le septième principe s'appelle **accountability**, ou responsabilité. L'organisme doit pouvoir prouver sa conformité à tout moment, grâce à sa documentation, ses registres et ses procédures. Les déclarations préalables d'avant 2018 ont laissé place à une responsabilité continue. Si rien n'est écrit, la conformité ne peut pas être démontrée lors d'un contrôle, même si les pratiques étaient correctes.

## Les bases légales

L'article 6 du RGPD fixe six **bases légales**, et un traitement licite doit s'appuyer sur l'une d'elles. Avant de choisir un logiciel, il faut donc se demander sur quelle base légale repose le traitement.

Le **consentement** (article 6.1.a). La personne a donné clairement son accord pour une finalité précise, comme une newsletter ou des cookies de publicité ciblée. Elle doit pouvoir le retirer aussi facilement qu'elle l'a donné.

Le **contrat** (6.1.b). Le traitement est nécessaire pour exécuter ou préparer un contrat avec la personne. L'adresse sert par exemple à livrer un colis, et les revenus à étudier une demande de prêt. Il est inutile de demander un consentement dans ce cas, puisque le service ne peut pas être rendu sans ces données.

L'**obligation légale** (6.1.c). Le traitement est imposé par la loi française ou européenne : l'employeur déclare les salaires à l'URSSAF, et la banque vérifie l'identité de ses clients pour lutter contre le blanchiment.

La **sauvegarde des intérêts vitaux** (6.1.d). Il s'agit de protéger la vie de la personne ou d'une autre personne, par exemple quand l'hôpital consulte le dossier d'un patient inconscient arrivé aux urgences.

La **mission d'intérêt public** (6.1.e). Le traitement sert une mission d'intérêt public ou l'exercice de l'autorité publique. C'est le cas des impôts gérés par la DGFiP ou de la scolarité dans une université publique.

L'**intérêt légitime** (6.1.f). L'organisme a un intérêt réel, qui ne doit pas porter une atteinte excessive aux droits des personnes, comme des caméras qui sécurisent les locaux sans filmer les postes de travail, ou la lutte contre la fraude à la carte bancaire. C'est la base la plus délicate, car elle suppose de comparer par écrit l'intérêt de l'organisme et les droits de la personne. La simple facilité n'est pas un intérêt légitime.

Un consentement n'est valable que s'il est **libre** (pas de pénalité si l'on refuse), **spécifique** (un oui par finalité, pas un oui global), **éclairé** (la personne sait à quoi elle dit oui) et **univoque** (un acte positif : une case cochée, un clic). Une case déjà cochée n'est donc pas un consentement valable.

## Les droits des personnes

Chaque personne (salarié, client, usager) exerce ses droits auprès du responsable de traitement.

Le **droit d'accès** (article 15) permet de demander si l'organisme détient des données sur soi, et d'en obtenir une copie lisible. C'est aussi le moyen de vérifier qu'elles sont exactes.

Le **droit de rectification** (article 16) corrige une donnée fausse ou complète une donnée incomplète, par exemple une faute d'orthographe dans un nom ou une adresse qui a changé.

Le **droit à l'effacement**, souvent appelé droit à l'oubli (article 17), permet de demander la suppression des données. Ce droit n'est pas absolu : il ne s'applique pas quand le traitement reste nécessaire, par exemple pour payer l'impôt ou exécuter un contrat en cours. Une demande d'effacement ne permet pas de supprimer un dossier que la loi oblige à conserver.

Le **droit à la limitation** (article 18) suspend l'utilisation des données le temps de vérifier une contestation. Les données sont conservées, mais elles ne sont plus utilisées pour la finalité contestée tant que le doute n'est pas levé.

Le **droit à la portabilité** (article 20) permet de récupérer ses données dans un format structuré, lisible par une machine (CSV, XML), pour pouvoir les transmettre à un autre organisme, par exemple pour changer d'opérateur ou de plateforme de musique en conservant son historique. Il s'applique surtout quand le traitement repose sur le consentement ou sur un contrat, et qu'il est automatisé.

Le **droit d'opposition** (article 21) permet de refuser un usage précis des données. Pour la prospection commerciale, il est absolu : on n'a pas à se justifier pour ne plus recevoir de publicité. Pour le reste, il faut un motif légitime, sauf si le traitement relève de l'intérêt public.

Le responsable répond dans un délai d'**un mois**, prolongeable de deux mois si la demande est complexe. L'exercice est **gratuit**. Un refus doit être motivé et indiquer les recours possibles, en particulier auprès de la CNIL.

## Les obligations de l'organisme

Le **registre des activités de traitement** est le document central. Il décrit chaque traitement : qui le réalise, quelles données il concerne, dans quel but, pendant combien de temps, avec quelles mesures de sécurité et vers quels destinataires. Il est obligatoire pour la plupart des organismes, et c'est le premier document demandé lors d'un contrôle.

L'**analyse d'impact**, ou AIPD (DPIA en anglais), est obligatoire quand le traitement présente un risque élevé pour les droits et libertés, comme pour des données de santé, une surveillance systématique ou un profilage. Elle décrit les risques et les mesures qui les réduisent, et doit être réalisée avant de lancer le traitement, et non après une plainte.

En cas de **violation** (vol, perte, accès non autorisé), le responsable notifie la CNIL dans les **72 heures**. Si le risque est élevé pour les personnes, il les prévient aussi, individuellement. Le délai court à partir du moment où l'on a connaissance de la violation. Il ne faut donc pas attendre d'avoir tout compris pour notifier la violation.

## Protection dès la conception et par défaut

La **protection dès la conception** (*privacy by design*) intègre la protection des données dès le début du projet. L'ajouter à la fin, sur un système déjà construit, laisse les données circuler par des chemins qui n'avaient pas été prévus.

La **protection par défaut** (*privacy by default*) impose que le réglage proposé au départ soit le plus protecteur, par exemple une case non cochée ou un profil privé sur un réseau social, tant que la personne n'a pas choisi autre chose.

Les mesures techniques que le règlement attend, adaptées au risque, sont concrètes. La **pseudonymisation** remplace les identifiants directs par des codes. Le **chiffrement** rend les données illisibles sans la clé. Les **sauvegardes** préservent la disponibilité. Des **tests** réguliers cherchent les vulnérabilités. Le **contrôle d'accès** authentifie les utilisateurs et limite leurs droits à ce dont ils ont besoin.

La sécurité est aussi une affaire de personnes. Une **charte** précise comment utiliser les outils, et des actions de **sensibilisation** rappellent les risques liés à l'hameçonnage et aux mots de passe. Les accès d'un salarié doivent être fermés le jour même de son **départ**, et les contrats comportent une **clause de confidentialité**. Le meilleur chiffrement ne sert à rien si le compte d'un salarié reste ouvert trois semaines après sa démission.

## Les transferts hors de l'Union européenne

Transférer des données personnelles hors de l'Union est interdit par principe, mais des exceptions encadrées existent.

La Commission européenne peut reconnaître qu'un pays offre un niveau **adéquat**, équivalent à celui de l'Union. C'est le cas de la Suisse, du Japon ou du Canada pour le secteur commercial. Vers ces pays, le transfert est libre.

Ailleurs, il faut des **garanties**. Les *Binding Corporate Rules*, règles d'entreprise contraignantes, lient les entités d'un groupe multinational. Les **clauses contractuelles types** sont des modèles rédigés par la Commission, signés entre l'exportateur et l'importateur.

Les États-Unis passent par le *Data Privacy Framework* , qui facilite le transfert vers les entreprises américaines certifiées, mais pas vers n'importe quelle société du pays. Pour le cloud (AWS, Azure, Google Cloud), la question est la localisation des serveurs et le droit qui s'y applique. Héberger des données sensibles hors de l'Union demande de savoir dans quel pays elles se trouvent, et sur quel outil juridique le transfert repose.

## Les amendes

Les sanctions de la CNIL peuvent être lourdes. Les amendes peuvent atteindre **10 millions d'euros** ou **2 %** du chiffre d'affaires mondial, le montant le plus élevé étant retenu, pour des manquements plutôt administratifs, et jusqu'à **20 millions d'euros** ou **4 %** du chiffre d'affaires mondial pour une violation des principes ou des droits des personnes. Ce calcul en pourcentage explique pourquoi les amendes des très grandes plateformes se comptent en centaines de millions d'euros, alors que celles des PME se comptent en dizaines de milliers d'euros.

## Les obligations sur un site web

Toute collecte en ligne s'accompagne d'une **politique de confidentialité**, accessible depuis toutes les pages, en général dans le pied de page. Elle doit être rédigée simplement, pour être comprise sans connaissances juridiques, et indiquer les finalités, les destinataires, les durées de conservation et les droits des personnes.

Les **cookies** non essentiels (publicité, mesure d'audience qui n'est pas strictement nécessaire, réseaux sociaux) ne se déposent qu'après un consentement. Le bandeau propose d'accepter, de refuser ou de personnaliser. Refuser doit être aussi simple qu'accepter. Le choix de l'utilisateur est conservé, et la CNIL recommande d'attendre six mois avant de lui reposer la question.

## Le formulaire de contact

Prenons l'exemple d'un formulaire de contact pour un site vitrine. Chaque élément doit être jugé au regard des principes du RGPD, et non selon l'idée que plus on collecte d'informations, mieux c'est.

| Élément | Conforme RGPD ? | Correction / Explication |
| :--- | :--- | :--- |
| Champ "Nom" (Obligatoire) | <Icone nom="circle-check" /> OUI | Nécessaire pour répondre (Minimisation). |
| Champ "Date de naissance" (Obligatoire) | <Icone nom="circle-x" /> NON | Inutile pour une simple prise de contact (Minimisation). |
| Case pré-cochée : "Je veux recevoir la newsletter" | <Icone nom="circle-x" /> NON | Le consentement doit être un acte positif. La case doit être vide par défaut. |
| Mention : "Les données sont conservées 3 ans après le dernier contact" | <Icone nom="circle-check" /> OUI | Durée de conservation définie et transparente. |
| Lien vers la "Politique de confidentialité" | <Icone nom="circle-check" /> OUI | Obligation de transparence (Information). |

Le nom sert à répondre : il est nécessaire, et donc compatible avec la minimisation. La date de naissance, en revanche, ne sert à rien pour envoyer un message. La case déjà cochée crée un consentement que la personne n'a pas donné. Enfin, l'indication de la durée de conservation et le lien vers la politique de confidentialité constituent le minimum de transparence. Un formulaire conforme est donc souvent plus court.
