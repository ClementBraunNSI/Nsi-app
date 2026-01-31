---
title: "Sécurité Web : OWASP, SQLi & XSS"
description: "Cours complet sur le Top 10 OWASP, avec un focus technique sur les injections SQL et XSS (Préparation E5/E6)."
level: "BTS SIO"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_owasp_web"
icon: "🛡️"
---

# Sécurité des Applications Web : OWASP & Attaques Majeures

<ExerciseTabs courseId="bts_owasp_web" courseTitle="Badge Sécurité Web">

  <ExerciseSection id="owasp_intro" label="1. OWASP Top 10">
    ## 1. Le Standard OWASP Top 10 (2021) - Analyse Approfondie

    L'**OWASP** (Open Web Application Security Project) publie le "Top 10" des vulnérabilités critiques, basé sur l'analyse de plus de **500 000 applications**.
    
    Ci-dessous, chaque vulnérabilité est décortiquée : mécanisme, détection et cas historique.

    ### A01:2021 - Broken Access Control (Contrôle d'accès défaillant)
    **1. Le Mécanisme**
    La faille survient quand les restrictions d'accès ne sont pas appliquées côté serveur. L'attaquant peut agir en tant qu'administrateur ou accéder aux données d'autrui.
    *   **Technique :** IDOR (Insecure Direct Object Reference). Modifier `id=123` en `id=124` dans l'URL.
    *   **Exemple :** Forcer la navigation vers une page cachée (`/admin/deleteUser`).
    
    **2. Comment la détecter ?**
    *   **Tests d'intrusion (Pentest) :** Tenter d'accéder aux pages admin avec un compte utilisateur standard.
    *   **Revue de code :** Vérifier que chaque contrôleur/route vérifie les permissions (`@PreAuthorize`, `is_admin()`).
    
    **3. Cas Historique : Facebook (2018)**
    Une faille dans la fonctionnalité "Voir en tant que" (View As) a permis à des attaquants de voler les tokens d'accès de **50 millions de comptes**. Le code ne vérifiait pas correctement si l'utilisateur avait le droit de générer un token pour la vue simulée, permettant une élévation de privilèges massive.

    ---

    ### A02:2021 - Cryptographic Failures (Défaillances cryptographiques)
    **1. Le Mécanisme**
    Protection insuffisante des données sensibles (mots de passe, CB, santé) au repos ou en transit.
    *   **Erreurs classiques :** Utilisation de HTTP (pas de TLS), algorithmes obsolètes (MD5, SHA1), clés cryptographiques codées en dur dans le code.
    
    **2. Comment la détecter ?**
    *   **Scanners de vulnérabilités :** Détectent les certificats SSL/TLS faibles ou expirés.
    *   **Analyse statique (SAST) :** Recherche de mots-clés comme `MD5`, `base64` (pour cacher des secrets), ou de clés API dans le code source.
    
    **3. Cas Historique : Adobe (2013)**
    **153 millions** de comptes compromis. Les mots de passe étaient chiffrés (et non hashés) avec l'algorithme 3DES en mode ECB. Ce mode conserve les motifs : deux mots de passe identiques avaient le même résultat chiffré. Les attaquants ont pu deviner les mots de passe les plus fréquents (ex: "123456") et trouver tous les comptes associés.

    ---

    ### A03:2021 - Injection
    **1. Le Mécanisme**
    Des données non fiables sont envoyées à un interpréteur (SQL, OS, LDAP) comme une commande. L'interpréteur ne distingue pas la donnée du code.
    *   **Exemple :** `SELECT * FROM users WHERE name = '` + `$input` + `'`. Si `$input` vaut `' OR '1'='1`, la condition est toujours vraie.
    
    **2. Comment la détecter ?**
    *   **Fuzzing (DAST) :** Envoyer des caractères spéciaux (`'`, `"`, `;`, `--`) dans tous les champs de saisie et analyser les erreurs.
    *   **Analyse de logs :** Repérer des requêtes avec des syntaxes SQL anormales.
    
    **3. Cas Historique : TalkTalk (2015)**
    Le fournisseur d'accès britannique a subi une injection SQL massive via une page legacy négligée. Les attaquants ont utilisé des outils automatisés (SQL Map) pour extraire les données de **157 000 clients**. L'amende et les coûts de remédiation ont atteint 77 millions de livres.

    ---

    ### A04:2021 - Insecure Design (Conception non sécurisée)
    **1. Le Mécanisme**
    Il ne s'agit pas d'un bug de code, mais d'une lacune dans l'architecture ou les règles métier. "On ne peut pas coder de manière sécurisée une conception défaillante".
    *   **Exemple :** Un système de récupération de mot de passe qui pose des "Questions Secrètes" dont les réponses sont publiques sur les réseaux sociaux.
    
    **2. Comment la détecter ?**
    *   **Threat Modeling (Modélisation des menaces) :** Analyse de l'architecture avant même de coder (ex: méthode STRIDE).
    *   **Tests de logique métier :** Essayer de contourner les flux (ex: passer directement à l'étape "Paiement validé" sans payer).
    
    **3. Cas Historique : Parler (2021)**
    Le réseau social a été intégralement aspiré (70 To de données) par des hacktivistes. La cause ? Une conception non sécurisée des URLs : les posts avaient des ID séquentiels (`/post/1`, `/post/2`...) et aucune limitation de vitesse (Rate Limiting) n'était en place. Ce n'était pas un bug complexe, mais une absence totale de barrières de conception.

    ---

    ### A05:2021 - Security Misconfiguration (Mauvaise configuration)
    **1. Le Mécanisme**
    La faille la plus courante. Systèmes installés avec les paramètres par défaut, stockage cloud ouvert à tous, messages d'erreurs verbeux (Stack Trace) affichés aux utilisateurs.
    *   **Exemple :** Un bucket AWS S3 configuré en "Public Read".
    
    **2. Comment la détecter ?**
    *   **Scanners d'infrastructure :** Outils comme Nessus ou des outils Cloud (AWS Config, Azure Policy).
    *   **Google Dorking :** Recherche de pages par défaut indexées par Google.
    
    **3. Cas Historique : Twitch (2021)**
    Une erreur de configuration serveur a permis le leak de **125 Go** de données ("The Golden Twitch Leak"), incluant l'intégralité du code source, les SDKs propriétaires et les revenus exacts des streamers depuis 2019.

    ---

    ### A06:2021 - Vulnerable and Outdated Components
    **1. Le Mécanisme**
    Utilisation de bibliothèques, frameworks ou modules tiers (npm, pip, maven) contenant des failles connues (CVE).
    *   **Problème :** Vous codez bien, mais la librairie que vous importez est une passoire.
    
    **2. Comment la détecter ?**
    *   **SCA (Software Composition Analysis) :** Outils comme `npm audit`, `OWASP Dependency Check` ou `Snyk` qui scannent le fichier `package.json` ou `pom.xml`.
    
    **3. Cas Historique : Equifax (2017)**
    L'une des plus graves brèches de l'histoire (**147 millions** d'américains). Causée par une faille connue (CVE-2017-5638) dans le framework **Apache Struts**. Le correctif était disponible depuis 2 mois, mais Equifax ne l'avait pas appliqué. Les attaquants ont simplement scanné le web à la recherche de serveurs non patchés.

    ---

    ### A07:2021 - Identification and Authentication Failures
    **1. Le Mécanisme**
    Faiblesses dans la vérification de l'identité : mots de passe faibles, absence de MFA (Multi-Factor Auth), gestion de session défaillante.
    *   **Attaque phare :** Credential Stuffing (Bourrage d'identifiants). Tester des millions de couples user/password volés ailleurs.
    
    **2. Comment la détecter ?**
    *   **Tests de force brute :** Vérifier si le compte se bloque après 5 tentatives.
    *   **Audit de politique de mot de passe :** Vérifier si "123456" est accepté.
    
    **3. Cas Historique : Nintendo (2020)**
    300 000 comptes "Nintendo Network ID" piratés via du Credential Stuffing. Les attaquants ont utilisé des identifiants volés sur d'autres services pour se connecter et effectuer des achats via PayPal. Nintendo a dû forcer la réinitialisation des mots de passe et désactiver cette méthode de connexion.

    ---

    ### A08:2021 - Software and Data Integrity Failures
    **1. Le Mécanisme**
    Nouveau en 2021. Concerne le code et l'infrastructure : mises à jour logicielles non signées, pipelines CI/CD compromis, désérialisation non sécurisée.
    *   **Concept :** Faire confiance à une source corrompue.
    
    **2. Comment la détecter ?**
    *   **Vérification de signature :** Toujours vérifier les signatures GPG/PGP des paquets installés.
    *   **Sécurisation CI/CD :** Audit des droits d'accès au dépôt de code et au serveur de build.
    
    **3. Cas Historique : SolarWinds (2020)**
    L'attaque "Supply Chain" ultime. Des attaquants étatiques ont pénétré le réseau de SolarWinds et ont injecté une porte dérobée (backdoor) directement dans le code source de la mise à jour officielle du logiciel Orion. **18 000 clients** (dont le gouvernement US et Microsoft) ont téléchargé la mise à jour "officielle" signée, installant le malware chez eux.

    ---

    ### A09:2021 - Security Logging and Monitoring Failures
    **1. Le Mécanisme**
    L'incapacité à détecter une intrusion. Absence de logs sur les événements critiques (login échoué, accès admin), ou logs stockés localement et effaçables par l'attaquant.
    *   **Conséquence :** Les attaquants restent dans le système pendant des mois (Moyenne mondiale : 200+ jours).
    
    **2. Comment la détecter ?**
    *   **Tests de réponse à incident :** Simuler une attaque et voir si le SOC (Security Operations Center) reçoit une alerte.
    *   **Audit des logs :** Vérifier si les logs contiennent : Qui, Quoi, Quand, Où.
    
    **3. Cas Historique : Marriott (2018)**
    Les attaquants ont eu accès au système de réservation Starwood pendant **4 ans** avant d'être détectés. Ils ont exfiltré les données de 500 millions de clients petit à petit. Un système de monitoring efficace aurait dû alerter sur des requêtes de base de données anormalement volumineuses ou des accès depuis des IP suspectes.

    ---

    ### A10:2021 - Server-Side Request Forgery (SSRF)
    **1. Le Mécanisme**
    L'attaquant force le serveur à effectuer des requêtes HTTP vers une destination qu'il choisit. Souvent utilisé pour accéder à des services internes non exposés au public (métadonnées Cloud, bases de données internes).
    *   **Exemple :** Demander à une application de charger une image de profil depuis `http://169.254.169.254/latest/meta-data/` (IP magique AWS).
    
    **2. Comment la détecter ?**
    *   **Revue de code :** Analyser toutes les fonctions qui prennent une URL en entrée et font une requête HTTP (`curl`, `file_get_contents`, `requests.get`).
    *   **Sortie réseau :** Surveiller les connexions sortantes du serveur web vers le réseau interne.
    
    **3. Cas Historique : Capital One (2019)**
    Une ex-employée d'AWS a exploité une faille SSRF dans un pare-feu d'application web (WAF) mal configuré. Elle a forcé le serveur à requêter le service de métadonnées AWS (IMDSv1) pour récupérer les identifiants temporaires du rôle IAM du serveur. Avec ces identifiants, elle a pu synchroniser (télécharger) tous les buckets S3 contenant les demandes de crédit de **100 millions** de personnes.

    ---

    ### Exercice de réflexion
    *Pourquoi l'ordre du Top 10 change-t-il d'une version à l'autre ?*

    ### Exercice TD : Identification de failles
    **Associer chaque situation à la faille OWASP correspondante (A01 à A10) :**
    1.  "J'ai laissé le fichier `config.php.bak` accessible à la racine du site web."
    2.  "Mon application utilise une librairie de génération de PDF qui n'a pas été mise à jour depuis 3 ans."
    3.  "Je peux voir les factures d'un autre client simplement en changeant le numéro de facture dans l'URL."
    4.  "Le formulaire de contact n'a pas de CAPTCHA et permet d'envoyer 1000 messages par seconde."
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
    
    > **Le ver Samy (2005)** : Samy Kamkar a utilisé une faille XSS Stored sur **MySpace** pour forcer chaque personne visitant son profil à l'ajouter en ami et à afficher "Samy is my hero". En 20 heures, il avait **1 million d'amis**. C'est l'exemple historique du XSS viral.

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

  <ExerciseSection id="risk_analysis" label="3. Analyse Risques (E6)">
    ### Exercice TD 1 : Rédaction d'une alerte
    Rédigez le mail d'alerte technique à envoyer au DSI suite à la découverte d'une faille XSS Stored dans le module de commentaires du site e-commerce.
    *   **Objet :** Alerte Sécurité Critique - Faille XSS Module Commentaires
    *   **Description :** Script malveillant persistant détecté.
    *   **Impact :** Risque de vol de session pour tous les visiteurs (clients et admins).
    *   **Recommandation immédiate :** Désactiver le module de commentaires / Purger les entrées suspectes.

    ### Exercice TD 2 : Analyse de Contexte (Score CVSS)
    **Contexte :** Une faille d'Injection SQL (SQLi) est découverte sur le site "vitrine" de la boulangerie du quartier. Le site présente uniquement des photos de pains et les horaires. Il n'y a pas de compte client, pas d'espace membre, et pas de données personnelles stockées. La base de données ne contient que la table `produits` et `horaires`.

    **Question :** Évaluez la gravité réelle de cette faille pour la boulangerie (Critique, Élevée, Moyenne, Faible). Justifiez en utilisant les critères Confidentialité, Intégrité, Disponibilité.
  </ExerciseSection>

</ExerciseTabs>
