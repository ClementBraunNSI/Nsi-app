# Correction : TP Audit de Sécurité Web (SQLi & XSS)

**Document réservé à l'enseignant.**

## 1. Introduction
Ce TP vise à démontrer par la pratique la dangerosité des injections SQL et XSS. L'application `lab_securite.php` est volontairement vulnérable.

## 2. Injection SQL (SQLi) - L'Authentification

### Défi 1 : Le contournement
**Objectif :** Se connecter en admin sans mot de passe.

*   **Payload :** `' OR '1'='1`
*   **Explication technique :**
    Le code vulnérable ressemble à :
    `SELECT * FROM users WHERE password = '$password'`
    Avec l'injection, la requête devient :
    `SELECT * FROM users WHERE password = '' OR '1'='1'`
    La condition `OR '1'='1'` est toujours VRAIE. La base de données retourne donc la première ligne de la table, qui correspond généralement au compte administrateur.

### Défi 2 : Vol de base de données (UNION Based)
**Objectif :** Exfiltrer les données des utilisateurs.

*   **Payload :** `' UNION SELECT 1, username, password FROM users --`
*   **Explication technique :**
    *   `'` : Ferme la chaîne de caractères de la recherche initiale.
    *   `UNION` : Permet de combiner les résultats de la requête légitime (recherche de notes) avec une seconde requête arbitraire.
    *   `SELECT 1, username, password` : Sélectionne 3 colonnes pour correspondre au nombre de colonnes de la requête originale (id, titre, note).
    *   `--` : Commentaire SQL pour ignorer la fin de la requête originale (souvent un `ORDER BY` ou une limite).

## 3. Cross-Site Scripting (XSS)

### A. XSS Reflected (Non persistant)
**Objectif :** Exécuter du JS via l'URL.

*   **Payload :** `<script>alert("Hacked")</script>`
*   **Explication technique :**
    Le script est passé dans l'URL (`?search=<script>...`). Le serveur PHP récupère ce paramètre et l'affiche directement dans la page HTML sans aucun filtrage (`echo $_GET['search']`). Le navigateur de la victime interprète alors les balises `<script>`.

### B. XSS Stored (Persistant)
**Objectif :** Infecter la page de manière permanente.

*   **Payload :** `<script>window.location = "https://google.com"</script>`
*   **Explication technique :**
    Le script malveillant est stocké en base de données via le formulaire de commentaires.
    Lorsqu'un administrateur (ou tout autre visiteur) consulte le Livre d'or, le serveur récupère le commentaire depuis la BDD et l'injecte dans le HTML. Le code s'exécute alors dans le navigateur de la victime. C'est une faille critique (vol de session, redirection, keylogging).

## 4. Analyse et Remédiation (Pour SISR)

### Question 1 : Les Logs
**Question :** Quelles traces cela laisse-t-il dans les logs (Apache/Nginx) ?
**Réponse :**
On observera des requêtes `GET` avec des motifs d'attaque encodés en URL (URL Encoded).
Exemple de ligne de log :
`192.168.1.10 - - [Date] "GET /lab_securite.php?search=%27+UNION+SELECT+1,username,password+FROM+users+-- HTTP/1.1" 200 ...`
On repère les mots clés SQL (`UNION`, `SELECT`) ou les balises HTML (`%3Cscript%3E`).

### Question 2 : Protection Serveur (WAF)
**Question :** Quel équipement placer devant le serveur ?
**Réponse :** Un **WAF (Web Application Firewall)**.
Il analyse le trafic HTTP entrant et bloque les requêtes contenant des signatures d'attaques connues (SQLi, XSS) avant qu'elles n'atteignent le serveur web.
*   Exemples : ModSecurity (Open Source), Cloudflare WAF, AWS WAF.

### Question 3 : Correction du code (Patch)
**Question :** Comment corriger le code PHP ?

*   **Pour la SQLi :** Utiliser des **Requêtes Préparées** (Prepared Statements) avec `PDO` ou `MySQLi`. Les paramètres ne sont jamais concaténés mais envoyés séparément.
    ```php
    // MAUVAIS
    $sql = "SELECT * FROM users WHERE id = " . $_GET['id'];

    // BON (PDO)
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_GET['id']]);
    ```

*   **Pour la XSS :** Échapper les caractères spéciaux lors de l'affichage avec `htmlspecialchars()`.
    ```php
    // MAUVAIS
    echo $_GET['search'];

    // BON
    echo htmlspecialchars($_GET['search'], ENT_QUOTES, 'UTF-8');
    ```
    Cela transforme `<script>` en `&lt;script&gt;`, qui s'affiche comme du texte mais ne s'exécute pas.
