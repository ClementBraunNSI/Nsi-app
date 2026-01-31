---
title: "TP : Audit RGPD d'un site web réel"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_sql_audit_rgpd"
meta: "Durée : 2 heures · Objectif : Comprendre pour mieux protéger"
---

<ExerciseTabs courseId="bts_cyber_rgpd_audit" courseTitle="TP Cybersécurité - Audit RGPD">

  <ExerciseSection id="tp-rgpd-partie1" label="1. Outils & Découverte">
    <Enonce>
    ## 🔍 Partie 1 : Découverte des outils d'audit (20 min)

    ### Contexte
    Avant de réaliser un audit complet, vous devez prendre en main les outils qui permettent d'analyser la conformité technique d'un site web.

    ### 🛠 Outils à utiliser

    **1. Extension navigateur : Cookie-Editor**
    - **Installation :** Recherchez "Cookie-Editor" sur le Web Store de votre navigateur.
    - **Usage :** Permet d'observer en temps réel les cookies déposés, leur nom et leur durée de vie.

    **2. Outil en ligne : Cookiebot Cookie Scanner**
    - **Lien :** https://www.cookiebot.com/fr/cookie-checker/
    - **Usage :** Génère un rapport automatique sur la conformité du bandeau de consentement et la classification des cookies.

    ### 📋 Exercice de prise en main
    **Site de démonstration :** `https://www.lemonde.fr`

    **Étape 1 : Analyse manuelle (Cookie-Editor)**
    - Ouvrez le site en navigation privée.
    - Listez le nombre de cookies déposés avant toute interaction.
    - Identifiez 3 cookies (Nom et Durée de vie).

    **Étape 2 : Analyse automatisée (Cookiebot)**
    - Lancez un scan sur l'URL du site.
    - Relevez le nombre de cookies par catégorie : Essentiels, Analytiques, Marketing.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-rgpd-partie2" label="2. Audit Complet">
    <Enonce>
    ## 🛡️ Partie 2 : Audit complet d'un site web (50 min)

    ### Contexte
    Choisissez un site parmi la liste suivante pour réaliser votre audit :
    - *E-commerce :* fnac.com, cdiscount.com
    - *Média :* 20minutes.fr, lequipe.fr
    - *Institutionnel :* ameli.fr, service-public.fr

    ### 📋 Grille d'audit à compléter

    #### A. Inventaire des Cookies
    | Critère | Résultat |
    | :--- | :--- |
    | Nombre total de cookies | |
    | Cookies essentiels | |
    | Cookies marketing/publicitaires | |

    #### B. Analyse du Bandeau de Consentement
    - Un bandeau apparaît-il dès l'arrivée ?
    - Le bouton "Refuser" est-il aussi visible que le bouton "Accepter" ?
    - Peut-on personnaliser ses choix par catégorie ?

    #### C. Formulaires et Collecte
    Trouvez un formulaire (contact ou inscription) et vérifiez :
    - La présence d'une mention d'information RGPD.
    - Si les cases de consentement (newsletter) sont pré-cochées (Interdit).
    - La présence d'un lien vers la politique de confidentialité.

    #### D. Politique de Confidentialité
    - Le document est-il accessible en moins de 2 clics ?
    - L'identité du responsable de traitement est-elle précisée ?
    - La durée de conservation des données est-elle indiquée ?
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-rgpd-partie3" label="3. Recommandations">
    <Enonce>
    ## 📋 Partie 3 : Recommandations de mise en conformité (40 min)

    ### Contexte
    Suite à votre audit, vous devez proposer des solutions techniques et organisationnelles pour corriger les violations identifiées.

    ### 💡 Catalogue des solutions
    | Violation détectée | Solution recommandée | Complexité |
    | :--- | :--- | :--- |
    | Cookies déposés avant consentement | Implémenter une CMP (Axeptio, Didomi) | Moyenne |
    | Pas de protocole HTTPS | Installer un certificat SSL (Let's Encrypt) | Faible |
    | Case newsletter pré-cochée | Modifier le formulaire (décoché par défaut) | Faible |
    | Conservation illimitée | Définir une politique de rétention + purge | Moyenne |

    ### 📋 Travail à faire
    **Sélectionnez les 3 violations les plus graves** constatées lors de votre audit et complétez pour chacune :
    1. **Nature de la violation**
    2. **Risque associé** (pour l'entreprise ou l'utilisateur)
    3. **Solution préconisée** (issue du catalogue)
    4. **Priorité** (Haute / Moyenne / Basse)
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-rgpd-partie4" label="4. Mentions Légales">
    <Enonce>
    ## ⚖️ Partie 4 : Rédaction des mentions légales (30 min)

    ### Contexte
    Votre client, l'association **"Le Refuge des Renards Polaires"**, lance son site. Vous devez rédiger la structure HTML de ses mentions légales.

    **Informations Client :**
    - **Statut :** Association loi 1901
    - **Siège :** Port-aux-Français, 98417 Îles Kerguelen, TAAF
    - **Directrice :** Marie Dubois
    - **Hébergeur :** OVH, 2 rue Kellermann, 59100 Roubaix

    ### 📋 Exercice de Code
    Rédigez le code HTML5 sémantique de la page.

    **Structure attendue :**
    - `<header>` avec le titre principal.
    - `<section>` pour l'identité de l'éditeur.
    - `<section>` pour les coordonnées de l'hébergeur.
    - `<section>` pour la protection des données (RGPD).

    ```html
    <article>
      <h1>Mentions Légales</h1>
      <section>
        <h2>Éditeur du site</h2>
        <address>
          </address>
      </section>
    </article>
    ```
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>