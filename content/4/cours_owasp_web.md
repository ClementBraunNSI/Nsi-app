---
title: 'Sécurité Web : OWASP, SQLi & XSS'
description: >-
  Cours complet sur le Top 10 OWASP, avec un focus technique sur les injections
  SQL et XSS (Préparation E5/E6).
level: BTS SIO
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: bts_owasp_web
icon: "\U0001F6E1️"
prerequisites:
  - premiers_pas_python
---

# Sécurité des Applications Web : OWASP & Attaques Majeures

<ExerciseTabs courseId="bts_owasp_web" courseTitle="Badge Sécurité Web">

  <ExerciseSection id="owasp_top10" label="1. OWASP Top 10">
    ## 1. Le Standard OWASP Top 10 (2021) - Analyse Approfondie

    L'**OWASP** (Open Web Application Security Project) publie le "Top 10" des vulnérabilités critiques, basé sur l'analyse de plus de **500 000 applications**.
    
    Ci-dessous, chaque vulnérabilité est décortiquée avec son contexte historique et son impact financier.

    ### A01:2021 - Broken Access Control (Contrôle d'accès défaillant)
    **Mécanisme :** La faille survient quand les restrictions d'accès ne sont pas appliquées côté serveur. L'attaquant peut agir en tant qu'administrateur ou accéder aux données d'autrui (IDOR).
    
    > **💡 Cas Historique : Facebook (2018)**
    > Une faille dans la fonctionnalité "Voir en tant que" a permis de voler les tokens d'accès de **50 millions de comptes**.
    > 💰 **Coût estimé :** Facebook a risqué une amende RGPD de **1,6 milliard de dollars** (4% de son CA mondial). L'action a chuté de 3% immédiatement après l'annonce.

    **Comment s'en prémunir ?**
    *   Ne jamais faire confiance aux ID dans l'URL (`/user/123`).
    *   Vérifier systématiquement les droits d'accès côté serveur (ex: `if (user.id != resource.owner_id) deny()`).
    *   Désactiver l'accès direct aux répertoires et fichiers sensibles (`.git`, `backup`).

    **Questions de compréhension :**
    1.  Si je change `id=123` par `id=124` dans l'URL et que j'accède à la facture d'un autre client, comment s'appelle cette vulnérabilité spécifique ?
    2.  Quelle est la différence entre l'**authentification** (qui je suis) et l'**autorisation** (ce que j'ai le droit de faire) ?
    3.  Pourquoi cacher un bouton "Admin" dans l'interface (CSS `display: none`) n'est-il pas une mesure de sécurité suffisante ?

    ---

    ### A02:2021 - Cryptographic Failures (Défaillances cryptographiques)
    **Mécanisme :** Protection insuffisante des données sensibles (mots de passe, CB, santé) au repos ou en transit (HTTP, algorithmes faibles).
    
    > **💡 Cas Historique : Adobe (2013)**
    > **153 millions** de comptes compromis car les mots de passe étaient chiffrés (réversibles) au lieu d'être hachés.
    > 💰 **Coût estimé :** Adobe a payé **1,1 million de dollars** en frais juridiques et une somme non divulguée pour régler les plaintes des clients, sans compter l'impact massif sur sa réputation.

    **Comment s'en prémunir ?**
    *   Stocker les mots de passe avec des algorithmes de hachage lents et robustes (Argon2, bcrypt).
    *   Utiliser systématiquement HTTPS (TLS) pour tous les échanges.
    *   Ne jamais stocker de données sensibles (CB) si ce n'est pas indispensable.

    **Questions de compréhension :**
    1.  Pourquoi l'algorithme de hachage MD5 est-il considéré comme obsolète pour stocker des mots de passe ?
    2.  Quel protocole sécurisé (utilisant le port 443) doit impérativement remplacer HTTP ?
    3.  Qu'est-ce que le "Salt" (sel) et pourquoi est-il indispensable lors du hachage des mots de passe ?

    ---

    ### A03:2021 - Injection
    **Mécanisme :** Des données non fiables sont envoyées à un interpréteur (SQL, OS, LDAP) comme une commande. L'interpréteur ne distingue pas la donnée du code.
    
    > **💡 Cas Historique : TalkTalk (2015)**
    > Une injection SQL sur une page web obsolète a permis le vol des données de **157 000 clients**.
    > 💰 **Coût estimé :** L'entreprise a perdu **101 000 clients** et a dû payer une amende record de **400 000 £** à l'époque, pour un coût total de remédiation de **77 millions de livres**.

    **Comment s'en prémunir ?**
    *   Utiliser des **requêtes préparées** (Prepared Statements) en SQL.
    *   Valider strictement les entrées utilisateurs (Allowlist).
    *   Utiliser un ORM (Entity Framework, Hibernate, Eloquent) qui gère l'échappement automatiquement.

    **Questions de compréhension :**
    1.  Dans l'expression `' OR '1'='1`, quel est le rôle des guillemets simples ?
    2.  Quelle instruction SQL permet souvent de combiner les résultats de deux tables lors d'une injection ?
    3.  Pourquoi la validation côté client (Javascript) ne protège-t-elle pas contre les injections SQL ?

    ---

    ### A04:2021 - Insecure Design (Conception non sécurisée)
    **Mécanisme :** Lacune dans l'architecture ou les règles métier. "On ne peut pas coder de manière sécurisée une conception défaillante".
    
    > **💡 Cas Historique : Parler (2021)**
    > Des hacktivistes ont aspiré **99% des données** du site car les posts avaient des IDs séquentiels non protégés.
    > 💰 **Coût estimé :** Fermeture complète du service pendant plusieurs semaines, perte totale de confiance des investisseurs et retrait des stores Apple/Google.

    **Comment s'en prémunir ?**
    *   Adopter une approche "Security by Design" dès le début du projet.
    *   Modéliser les menaces (Threat Modeling) avant de coder.
    *   Éviter les ID séquentiels prévisibles (utiliser des UUID).

    **Questions de compréhension :**
    1.  Quel est le principe de la "défense en profondeur" (Defense in Depth) ?
    2.  Donnez un exemple de fonctionnalité "pratique" pour l'utilisateur mais dangereuse par conception (ex: récupération de compte).
    3.  Qu'est-ce que le "Rate Limiting" et quelle attaque de conception permet-il d'atténuer ?

    ---

    ### A05:2021 - Security Misconfiguration (Mauvaise configuration)
    **Mécanisme :** Systèmes installés avec les paramètres par défaut, stockage cloud ouvert, messages d'erreurs verbeux.
    
    > **💡 Cas Historique : Twitch (2021)**
    > Une erreur de configuration serveur a exposé **125 Go de données**, incluant tout le code source et les revenus des streamers.
    > 💰 **Coût estimé :** Impact inestimable sur la propriété intellectuelle. Les revenus des streamers étant publics, cela a créé des tensions majeures au sein de la communauté.

    **Comment s'en prémunir ?**
    *   Désactiver les comptes et services par défaut inutilisés.
    *   Configurer les headers de sécurité HTTP (HSTS, X-Frame-Options).
    *   Ne jamais exposer les messages d'erreur détaillés (Stack Trace) en production.

    **Questions de compréhension :**
    1.  Pourquoi est-il crucial de changer les mots de passe par défaut des équipements (routeurs, serveurs) ?
    2.  Quelle est la règle d'or concernant les messages d'erreur affichés aux utilisateurs ?
    3.  Citez une "bonne pratique" simple pour sécuriser l'accès à un dossier d'administration.

    ---

    ### A06:2021 - Vulnerable and Outdated Components
    **Mécanisme :** Utilisation de bibliothèques tierces contenant des failles connues (CVE).
    
    > **💡 Cas Historique : Equifax (2017)**
    > **147 millions de clients** impactés par une faille dans le framework Apache Struts, patchée 2 mois avant l'attaque mais non appliquée.
    > 💰 **Coût estimé :** Equifax a accepté de payer jusqu'à **700 millions de dollars** pour régler les poursuites judiciaires liées à cette négligence.

    **Comment s'en prémunir ?**
    *   Faire un inventaire des composants (SCA - Software Composition Analysis).
    *   Automatiser la détection des vulnérabilités (ex: `npm audit`, `OWASP Dependency Check`).
    *   Mettre à jour régulièrement les dépendances.

    **Questions de compréhension :**
    1.  Qu'est-ce qu'une CVE (Common Vulnerabilities and Exposures) ?
    2.  Pourquoi faut-il maintenir son système (OS et logiciels) à jour régulièrement ?
    3.  Quel fichier liste souvent les dépendances d'un projet web (PHP ou JS) ?

    ---

    ### A07:2021 - Identification and Authentication Failures
    **Mécanisme :** Faiblesses dans la vérification de l'identité : mots de passe faibles, absence de MFA, gestion de session.
    
    > **💡 Cas Historique : Nintendo (2020)**
    > **300 000 comptes** piratés via du "Credential Stuffing" (utilisation de mots de passe volés sur d'autres sites).
    > 💰 **Coût estimé :** Remboursement massif des achats frauduleux effectués sur l'eShop et coût de support technique pour réinitialiser les comptes manuellement.

    **Comment s'en prémunir ?**
    *   Mettre en place l'authentification multifacteur (MFA/2FA).
    *   Interdire les mots de passe faibles ou compromis (liste des 10 000 pires mots de passe).
    *   Limiter le nombre de tentatives de connexion (Rate Limiting).

    **Questions de compréhension :**
    1.  Qu'est-ce que l'attaque par "Credential Stuffing" ?
    2.  Pourquoi limiter le nombre de tentatives de connexion (ex: 5 essais max) est-il crucial ?
    3.  Quel mécanisme (souvent via smartphone) ajoute une couche de sécurité au-delà du mot de passe ?

    ---

    ### A08:2021 - Software and Data Integrity Failures
    **Mécanisme :** Mises à jour non signées, pipelines CI/CD compromis, désérialisation non sécurisée.
    
    > **💡 Cas Historique : SolarWinds (2020)**
    > Une mise à jour officielle corrompue a infecté **18 000 clients**, dont le Trésor américain et Microsoft.
    > 💰 **Coût estimé :** Coût global de remédiation pour les entreprises et gouvernements estimé à plus de **100 milliards de dollars**.

    **Comment s'en prémunir ?**
    *   Signer numériquement tout code ou artefact produit.
    *   Vérifier l'intégrité des logiciels téléchargés (checksums, signatures GPG).
    *   Sécuriser la chaîne CI/CD (intégration continue).

    **Questions de compréhension :**
    1.  Pourquoi est-il important de vérifier la signature numérique (GPG) d'un logiciel avant de l'installer ?
    2.  Dans une attaque "Supply Chain" (chaîne d'approvisionnement), qui est la cible initiale de l'attaquant ?
    3.  Qu'est-ce que la désérialisation d'un objet ?

    ---

    ### A09:2021 - Security Logging and Monitoring Failures
    **Mécanisme :** Absence de logs sur les événements critiques ou logs inexploitables.
    
    > **💡 Cas Historique : Marriott (2018)**
    > Des attaquants ont eu accès aux données de **500 millions de clients** pendant **4 ans** sans être détectés.
    > 💰 **Coût estimé :** Marriott a été condamné à une amende de **18,4 millions de livres** par l'ICO (UK) et a dépensé des dizaines de millions en frais de justice.

    **Comment s'en prémunir ?**
    *   Centraliser les logs sur un serveur sécurisé et indépendant.
    *   Logger les événements critiques (échecs de connexion, accès admin).
    *   Mettre en place des alertes en temps réel.

    **Questions de compréhension :**
    1.  Quels sont les 4 éléments clés qu'un bon log doit contenir (Qui... ?) ?
    2.  Pourquoi faut-il envoyer les logs vers un serveur externe sécurisé plutôt que de les garder uniquement en local ?
    3.  Quel est le risque principal si une intrusion n'est pas détectée rapidement ?

    ---

    ### A10:2021 - Server-Side Request Forgery (SSRF)
    **Mécanisme :** L'attaquant force le serveur à effectuer des requêtes HTTP vers une destination interne non exposée.
    
    > **💡 Cas Historique : Capital One (2019)**
    > Une faille SSRF a permis de voler les données de **100 millions de clients** sur des serveurs AWS S3.
    > 💰 **Coût estimé :** L'entreprise a écopé d'une amende de **80 millions de dollars** et a dépensé environ **150 millions** en frais de remédiation et de notification.

    **Comment s'en prémunir ?**
    *   Valider et filtrer toutes les URL fournies par l'utilisateur.
    *   Utiliser une liste blanche (Allowlist) de domaines autorisés.
    *   Désactiver les redirections HTTP sur le serveur qui effectue les requêtes.

    **Questions de compréhension :**
    1.  Dans une faille SSRF, qui effectue la requête malveillante : le navigateur du client ou le serveur web ?
    2.  Citez une ressource interne sensible qu'un attaquant pourrait viser via SSRF (ex: Cloud).
    3.  Comment le filtrage des URL en entrée (Allowlist) peut-il protéger contre cette faille ?

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
    
    ### Questions E5 (SQLi)
    1.  Écrivez un payload SQL permettant de contourner une authentification (`WHERE user='...' AND pass='...'`).
    2.  Expliquez pourquoi la fonction `htmlspecialchars()` ne protège PAS contre les injections SQL.
    3.  Dans une requête `UNION SELECT`, quelle est la contrainte principale concernant les colonnes ?

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

    **3. Défense**
    *   **Échappement (Escaping)** : Convertir les caractères spéciaux en entités HTML (`<` devient `&lt;`).
    *   **Content Security Policy (CSP)** : En-tête HTTP qui restreint les sources de scripts autorisées.

    ### Questions E5 (XSS)
    1.  Quelle fonction PHP native permet de se protéger efficacement contre les XSS à l'affichage ?
    2.  Écrivez un petit script JS malveillant qui affiche le cookie de l'utilisateur dans une alerte.
    3.  Quelle est la différence fondamentale entre une XSS Stored et une XSS Reflected en termes de persistance ?

    ---

    ### C. Cross-Site Request Forgery (CSRF)

    **1. Le Mécanisme**
    Le CSRF (parfois prononcé "Sea-Surf") force l'utilisateur à exécuter des actions indésirables sur une application web où il est actuellement authentifié. L'attaquant n'a pas besoin de connaître les identifiants de la victime, il utilise simplement sa session active.

    *Exemple :*
    1.  L'utilisateur est connecté sur sa banque (`ma-banque.com`).
    2.  Il visite un site malveillant (`site-piege.com`) qui contient une image invisible :
        `<img src="http://ma-banque.com/virement?to=hacker&amount=1000" width="0" height="0" />`
    3.  Le navigateur de l'utilisateur charge l'image, envoyant ainsi la requête de virement à la banque. Comme l'utilisateur est connecté, la banque accepte la requête (si elle ne vérifie pas l'origine).

    **2. Impact Technique**
    *   Modification de mot de passe.
    *   Achats ou virements frauduleux.
    *   Changement d'adresse email de récupération.

    **3. Défense : Le Jeton (Token) Anti-CSRF**
    Le serveur doit générer un jeton aléatoire unique pour chaque session (ou chaque formulaire) et l'inclure dans les formulaires HTML en tant que champ caché.
    Lors de la soumission, le serveur vérifie si le jeton envoyé correspond à celui attendu. Le site de l'attaquant ne peut pas connaître ce jeton.

    *Code sécurisé (Concept) :*
    ```html
    <form action="/virement" method="POST">
        <input type="hidden" name="csrf_token" value="aF87d...3jK9" />
        ...
    </form>
    ```

    ### Questions E5 (CSRF)
    1.  Pour qu'une attaque CSRF fonctionne, quelle est la condition préalable concernant l'état de l'utilisateur sur le site cible ?
    2.  Pourquoi l'utilisation de `GET` pour des actions sensibles (suppression, virement) facilite-t-elle les attaques CSRF ?
    3.  Expliquez brièvement comment le Token Anti-CSRF empêche l'attaque.
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
    1.  **Notification à l'autorité (CNIL)** : Obligatoire (72h max) car risque pour les droits et libertés.
    2.  **Notification aux personnes concernées** : Obligatoire si le risque est élevé.
    3.  **Documentation** : Inscrire l'incident au registre des violations.

    ### Exercice TD 1 : Rédaction d'une alerte
    Rédigez le mail d'alerte technique à envoyer au DSI suite à la découverte d'une faille XSS Stored dans le module de commentaires du site e-commerce.
    *   **Objet :** Alerte Sécurité Critique - Faille XSS Module Commentaires
    *   **Description :** Script malveillant persistant détecté.
    *   **Impact :** Risque de vol de session pour tous les visiteurs (clients et admins).
    *   **Recommandation immédiate :** Désactiver le module de commentaires / Purger les entrées suspectes.

    ### Exercice TD 2 : Analyse de Contexte (Score CVSS)
    **Contexte :** Une faille d'Injection SQL (SQLi) est découverte sur le site "vitrine" de la boulangerie du quartier. Le site présente uniquement des photos de pains et les horaires. Il n'y a pas de compte client, pas d'espace membre, et pas de données personnelles stockées. La base de données ne contient que la table `produits` et `horaires`.

    ### Exercice TD 3 : Analyse de Logs (Identification)
    Voici un extrait de logs d'un serveur web Apache. Pour chaque ligne, identifiez s'il s'agit d'une tentative d'attaque et si oui, laquelle.

    1.  `192.168.1.15 - - [12/Mar/2024:10:00:00] "GET /login.php?user=admin'-- HTTP/1.1" 200 1542`
    2.  `192.168.1.15 - - [12/Mar/2024:10:01:00] "GET /search.php?q=<script>alert(1)</script> HTTP/1.1" 200 542`
    3.  `192.168.1.15 - - [12/Mar/2024:10:02:00] "GET /admin/config.xml HTTP/1.1" 403 202`
    4.  `192.168.1.15 - - [12/Mar/2024:10:03:00] "POST /upload.php HTTP/1.1" 200 1542` (Le fichier envoyé s'appelle `shell.php`)

    ### Exercice TD 4 : Politique de Mots de Passe (Audit)
    Vous auditez la politique de sécurité d'une PME. Voici leurs règles actuelles :
    *   Longueur minimale : 6 caractères.
    *   Complexité : Aucune (chiffres/lettres non obligatoires).
    *   Renouvellement : Obligatoire tous les 30 jours.
    *   Verrouillage : Aucun blocage après échecs.

    **Question :** Identifiez 3 faiblesses critiques dans cette politique et proposez une version corrigée conforme aux recommandations de l'ANSSI.
  </ExerciseSection>

</ExerciseTabs>
