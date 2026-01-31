---
title: "Sécurité Web : OWASP, SQLi & XSS"
description: "Cours complet sur le Top 10 OWASP, avec un focus technique sur les injections SQL et XSS (Préparation E5/E6)."
level: "BTS SIO"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_owasp_web"
icon: "🛡️"
---

# Sécurité des Applications Web : OWASP & Attaques Majeures

## Contexte et Objectifs

Ce cours couvre les compétences essentielles pour sécuriser les applications web, en se basant sur le standard industriel **OWASP Top 10**.
Il est structuré pour préparer aux épreuves :
*   **E5 (Production de services)** : Identification technique, exploitation et correction des failles.
*   **E6 (Parcours de professionnalisation)** : Analyse des risques, impacts métier et obligations légales.

<ExerciseTabs courseId="bts_owasp_web" courseTitle="Badge Sécurité Web">

  <ExerciseSection id="owasp_intro" label="1. OWASP Top 10">
    ## 1. Le Standard OWASP Top 10 (2021)

    L'**OWASP** (Open Web Application Security Project) publie tous les quelques années le "Top 10" des vulnérabilités les plus critiques pour les applications web. C'est la référence mondiale pour les développeurs et auditeurs.

    ### La Liste 2021
    Voici les 10 catégories de risques les plus critiques :

    1.  **A01:2021 - Broken Access Control** (Contrôle d'accès défaillant) : Un utilisateur accède à des données ou fonctionnalités non autorisées (ex: un utilisateur lambda accède à l'admin).
    2.  **A02:2021 - Cryptographic Failures** (Défaillances cryptographiques) : Données sensibles non chiffrées ou mal chiffrées (ex: mots de passe en clair, algorithmes obsolètes).
    3.  **A03:2021 - Injection** : Des données non fiables sont envoyées à un interpréteur (SQL, OS, LDAP) comme une commande (ex: SQLi, XSS était ici avant 2021).
    4.  **A04:2021 - Insecure Design** (Conception non sécurisée) : Failles liées à l'absence de contrôles de sécurité dès la conception (ex: pas de limite de tentatives de connexion).
    5.  **A05:2021 - Security Misconfiguration** (Mauvaise configuration de sécurité) : Configurations par défaut, messages d'erreurs trop verbeux, stockage cloud ouvert.
    6.  **A06:2021 - Vulnerable and Outdated Components** : Utilisation de bibliothèques ou frameworks avec des failles connues (ex: vieille version de Log4j).
    7.  **A07:2021 - Identification and Authentication Failures** : Problèmes de gestion de session, mots de passe faibles, absence de MFA.
    8.  **A08:2021 - Software and Data Integrity Failures** : Mises à jour logicielles non signées, désérialisation non sécurisée.
    9.  **A09:2021 - Security Logging and Monitoring Failures** : Absence de logs ou de surveillance permettant de détecter une intrusion.
    10. **A10:2021 - Server-Side Request Forgery (SSRF)** : Le serveur est forcé de faire des requêtes HTTP vers des ressources internes inaccessibles.

    > **Note :** Dans la version 2021, les attaques **XSS (Cross-Site Scripting)** sont désormais incluses dans la catégorie **Injection**.

    ### Exercice de réflexion
    *Pourquoi l'ordre du Top 10 change-t-il d'une version à l'autre ?*
    *(Réponse attendue : Évolution des technologies, nouvelles méthodes d'attaque, meilleure sensibilisation sur certaines failles).*
  </ExerciseSection>

  <ExerciseSection id="tech_focus" label="2. Focus Technique (E5)">
    ## 2. Injections SQL et XSS (Préparation E5)

    Cette partie se concentre sur l'identification technique, l'exploitation et la correction des deux failles les plus emblématiques.

    ### A. Injection SQL (SQLi)

    **1. Le Mécanisme**
    L'injection SQL se produit lorsqu'une donnée utilisateur est concaténée directement dans une requête SQL sans validation. L'attaquant peut alors manipuler la structure de la requête.

    *Code vulnérable (PHP) :*
    ```php
    $id = $_GET['id'];
    // L'utilisateur entre : 1 OR 1=1
    $query = "SELECT * FROM users WHERE id = " . $id;
    // Résultat : SELECT * FROM users WHERE id = 1 OR 1=1
    // La condition 1=1 est toujours vraie -> Toute la table est retournée.
    ```

    **2. Identification & Logs**
    Comment repérer une SQLi dans les logs du serveur ? Cherchez des motifs suspects dans les paramètres d'URL ou les formulaires :
    *   Caractères spéciaux : `'`, `"`, `--`, `#`, `;`
    *   Mots-clés SQL : `UNION`, `SELECT`, `DROP`, `OR 1=1`, `SLEEP()`
    *   Erreurs SQL visibles dans les réponses HTTP (Code 500).

    *Exemple de log suspect :*
    `GET /products.php?category=Gifts'--`

    **3. Défense : Requêtes Préparées**
    La seule défense robuste est l'utilisation de **requêtes préparées**. La structure SQL est définie à l'avance, et les données sont traitées strictement comme des valeurs, jamais comme du code.

    *Code sécurisé (PDO) :*
    ```php
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_GET['id']]);
    ```

    ---

    ### B. Cross-Site Scripting (XSS)

    **1. Le Mécanisme**
    Une faille XSS permet à un attaquant d'injecter du code JavaScript malveillant dans une page web consultée par d'autres utilisateurs.
    *   **XSS Reflected** : Le script est dans l'URL et exécuté immédiatement (piège à clic).
    *   **XSS Stored** : Le script est stocké en base de données (ex: commentaire) et exécuté à chaque affichage.

    **2. Impact Technique**
    *   **Vol de session** : Récupération du cookie `PHPSESSID` via `document.cookie`.
    *   **Redirection** : Renvoyer l'utilisateur vers un site de phishing.
    *   **Actions à l'insu de l'utilisateur** : Changer un mot de passe, poster un message.

    **3. Identification**
    Tester les champs de saisie avec des balises HTML/JS simples :
    *   `<script>alert('XSS')</script>`
    *   `<img src=x onerror=alert(1)>`

    **4. Défense**
    *   **Échappement (Escaping)** : Convertir les caractères spéciaux en entités HTML (`<` devient `&lt;`).
    *   **Content Security Policy (CSP)** : En-tête HTTP qui restreint les sources de scripts autorisées.

    ### Exercice TD : Analyse de Code
    **Identifier la faille dans ce snippet :**
    ```php
    echo "Bonjour " . $_GET['name'];
    ```
    *Réponse : Faille XSS Reflected. Si `name` contient `<script>...`, il sera exécuté.*
  </ExerciseSection>

  <ExerciseSection id="risk_analysis" label="3. Analyse Risques (E6)">
    ## 3. Analyse des Risques et Aspects Légaux (Préparation E6)

    En mission professionnelle, vous devez évaluer l'impact métier et gérer la conformité.

    ### A. Caractérisation des Risques (Critères DIC/CIA)

    L'impact d'une attaque s'évalue selon trois critères fondamentaux (Triade CIA) :

    | Critère | Impact d'une Injection SQL (SQLi) | Impact d'une faille XSS |
    | :--- | :--- | :--- |
    | **Confidentialité** | **Critique** : Vol de toute la base de données (clients, mots de passe). | **Élevé** : Vol de cookies de session, données personnelles affichées à l'écran. |
    | **Intégrité** | **Critique** : Modification de prix, suppression de tables (`DROP`), ajout d'admin. | **Moyen** : Modification de l'apparence de la page (Defacement), fausses informations. |
    | **Disponibilité** | **Élevé** : Suppression de données vitales, déni de service via requêtes lourdes. | **Faible** : Généralement pas d'impact serveur, mais peut bloquer le client. |

    ### B. Scénario de Crise & Obligations Légales

    **Scénario :**
    Suite à une injection SQL, la base de données clients (noms, emails, mots de passe hashés) de votre entreprise a été exfiltrée et publiée sur un forum.

    **Obligations RGPD (Articles 33 & 34) :**
    1.  **Notification à l'autorité (CNIL)** :
        *   **Obligatoire ?** OUI, car il y a un risque pour les droits et libertés des personnes.
        *   **Délai ?** 72 heures maximum après le constat.
    2.  **Notification aux personnes concernées** :
        *   **Obligatoire ?** OUI, si le risque est élevé (ex: mots de passe faibles, données bancaires).
    3.  **Documentation** : Inscrire l'incident au registre des violations.

    ### Exercice TD : Rédaction d'une alerte
    Rédigez le mail d'alerte technique à envoyer au DSI suite à la découverte d'une faille XSS Stored dans le module de commentaires du site e-commerce.
    *   **Objet :** Alerte Sécurité Critique - Faille XSS Module Commentaires
    *   **Description :** Script malveillant persistant détecté.
    *   **Impact :** Risque de vol de session pour tous les visiteurs (clients et admins).
    *   **Recommandation immédiate :** Désactiver le module de commentaires / Purger les entrées suspectes.
  </ExerciseSection>

</ExerciseTabs>
