# Corrigé – Devoir Surveillé RGPD & Conformité

## Partie 1 – Cadre juridique et principes (10 points)

### 1.1 Définitions et Acteurs (3 points)

#### Question 1 : Qualification (1 point)
a) **Responsable de Traitement (RT)** : C'est l'entreprise (personne morale) ou son représentant légal. C'est elle qui détermine les **finalités** (pourquoi) et les **moyens** (comment) du traitement.
b) **Sous-traitant** : La société d'hébergement est qualifiée de sous-traitant car elle traite les données **pour le compte et sur instruction** du responsable de traitement, sans décider de l'usage des données.

#### Question 2 : Données personnelles (1 point)
*   **Une adresse IP** : **OUI**. Elle permet d'identifier indirectement une personne physique (via le FAI).
*   **Un numéro de SIRET** : **NON**. C'est une donnée relative à une personne morale (entreprise), pas une personne physique.
*   **Une plaque d'immatriculation** : **OUI**. Elle permet d'identifier le propriétaire du véhicule via le fichier des immatriculations.
*   **Des données statistiques anonymisées irréversibles** : **NON**. Si la ré-identification est impossible, ce ne sont plus des données personnelles (hors champ RGPD).

#### Question 3 : Données sensibles (1 point)
Exemples attendus (2 parmi la liste) :
*   Données de santé
*   Opinions politiques
*   Convictions religieuses
*   Origine raciale ou ethnique
*   Orientation sexuelle
*   Données biométriques (si utilisées pour identification unique)
*   Appartenance syndicale

### 1.2 Principes Fondamentaux (4 points)

#### Question 1 : Finalité et Minimisation (2 points)
a) **Limitation des finalités** : Une lampe torche a pour finalité d'éclairer. Accéder à la localisation ou aux contacts est incompatible et sans lien avec cette finalité.
b) **Minimisation des données** : On ne doit collecter que ce qui est **strictement nécessaire**. La localisation précise n'est pas nécessaire pour allumer le flash du téléphone.

#### Question 2 : Durée de conservation (1 point)
**Non conforme**. "Au cas où" n'est pas une durée déterminée et 10 ans est excessif.
**Règle recommandée** : 2 ans après le dernier contact avec le candidat (recommandation CNIL).

#### Question 3 : Licéité et Loyauté (1 point)
Principe de **Loyauté** et **Transparence**. Les participants ont été trompés sur l'usage réel de leurs données (collecte déloyale). Le détournement de finalité est également une réponse acceptée.

### 1.3 Bases Légales (3 points)

#### Question 1 : Identification de la base légale (1,5 point)
1.  **Obligation Légale** (Code Monétaire et Financier impose la vigilance bancaire).
2.  **Contrat** (Nécessaire à l'exécution du contrat de vente/livraison).
3.  **Consentement** (Prospection commerciale B2C nécessite un opt-in).

#### Question 2 : Validité du consentement (1,5 point)
**NON Valide**.
Les 4 critères sont :
1.  **Libre** (sans contrainte).
2.  **Spécifique** (pour une finalité précise).
3.  **Éclairé** (information claire).
4.  **Univoque** (acte positif clair). **La case pré-cochée ne constitue pas un acte positif**, c'est de l'opt-out déguisé.

---

## Partie 2 – Obligations, Droits et Transferts (10 points)

### 2.1 Obligations de conformité (3 points)

#### Question 1 : Le Registre des traitements (1,5 point)
a) **Objectif** : Cartographier les données pour piloter la conformité et prouver le respect du RGPD en cas de contrôle (Outil de l'**Accountability**).
b) **3 informations obligatoires** :
    *   Finalité du traitement.
    *   Catégories de données traitées.
    *   Catégories de personnes concernées.
    *   Destinataires des données.
    *   Durée de conservation.
    *   Mesures de sécurité (générales).
    *   Transferts hors UE.

#### Question 2 : Notification de violation (1,5 point)
a) **Autorité** : La **CNIL** (en France).
b) **Délai** : Maximum **72 heures** après en avoir pris connaissance.

### 2.2 Droits des personnes en action (3 points)

1.  *Situation A* : Droit à la **Portabilité**.
2.  *Situation B* : Droit d'**Opposition** (Opposition sans motif légitime car prospection).
3.  *Situation C* : Droit de **Rectification**.

### 2.3 Transferts hors UE (4 points)

#### Question 1 : Pays adéquats (1 point)
Un pays dont la législation offre un niveau de protection **essentiellement équivalent** à celui de l'UE.
Exemples : Suisse, Royaume-Uni, Japon, Canada (secteur commercial), Israël, Argentine, Nouvelle-Zélande...

#### Question 2 : Garanties appropriées (2 points)
Les **CCT (Clauses Contractuelles Types)** sont des modèles de contrats rédigés par la Commission Européenne. En les signant, l'importateur de données (hors UE) s'engage contractuellement à respecter les standards européens de protection des données, compensant ainsi l'absence de loi locale protectrice.

#### Question 3 : Le cas des États-Unis (1 point)
Le **Data Privacy Framework** (Cadre de protection des données UE-États-Unis), adopté en juillet 2023.

---

## Partie 3 – Audit et mise en situation pratique (10 points)

### 3.1 Analyse d'un rapport d'audit (5 points)

| # | Conformité | Analyse et Justification |
|---|------------|--------------------------|
| **A** | **NON** | **Consentement non valide**. Poursuivre la navigation n'est pas un acte positif clair (Univoque). Le refus doit être aussi simple que l'acceptation (bouton "Tout refuser" manquant). |
| **B** | **NON** | **Absence de consentement préalable**. Les cookies non essentiels (traceurs Analytics/Pixel) ne doivent pas être déposés avant le clic sur "Accepter". |
| **C** | **NON** | **Non-respect de la Minimisation**. Date de naissance et téléphone ne sont pas nécessaires pour répondre à une simple question support (l'email suffit). |
| **D** | **OUI** | Respect de l'obligation de **Transparence** et des mentions légales (LCEN). |
| **E** | **NON** | **Non-respect de la Limitation de conservation**. On ne peut pas conserver des données personnelles indéfiniment ("sans limitation"). |

### 3.2 Méthodologie et Cookies (3 points)

#### Question 1 : Typologie (1,5 point)
1.  **Cookie de panier d'achat** : **Exempté** (Strictement nécessaire au service demandé).
2.  **Cookie de mesure d'audience** (anonyme) : **Exempté** (Sous conditions strictes CNIL/Matomo).
3.  **Cookie de ciblage publicitaire** : **Consentement obligatoire**.

#### Question 2 : Outils d'audit (1,5 point)
*   **Scanner automatique** (Cookiebot) : Permet de scanner toutes les pages du site rapidement, de détecter les cookies cachés ou dynamiques et de générer un rapport exhaustif.
*   **Avantage** : Gain de temps et vision globale de la conformité technique du site entier.

### 3.3 Mise en conformité (2 points)

**Proposition de rédaction (exemple) :**

> "Votre adresse email est collectée par la société News-Tech-Daily **(Responsable)** afin de vous envoyer notre newsletter hebdomadaire **(Finalité)**. Ce traitement est fondé sur votre consentement **(Base légale)**.
> Vous pouvez retirer votre consentement et vous désinscrire à tout moment via le lien en bas de chaque email. Vous disposez d'un droit d'accès, de rectification et d'effacement de vos données **(Droits)**. Vos données sont conservées jusqu'à votre désinscription **(Durée)**."
