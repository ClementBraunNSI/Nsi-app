---
title: "Correction TP SISR : Audit et Sécurisation d'une Application Web"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
icon: "🛡️"
---

# Correction : Audit et Sécurisation d'une Application Web

> **Avertissement** : Ce document contient les solutions détaillées des vulnérabilités. Il est destiné à l'enseignant ou à l'auto-correction après avoir tenté le TP.

## Partie 2 : Injection SQL (SQLi) - "L'Effraction"

### Analyse du Code (Login)
L'insertion n'est pas sécurisée car les variables `$u` et `$p` sont concaténées directement dans la chaîne SQL sans échappement ni préparation.
```php
$sql = "SELECT * FROM users WHERE username = '$u' AND password = '$p'";
```

### Défi 2.1 : Contournement d'authentification
Le payload classique pour contourner le login est :
`admin' OR 1=1 --`

**Explication :**
La requête devient :
```sql
SELECT * FROM users WHERE username = 'admin' OR 1=1 --' AND password = '...'
```
*   `'admin'` ferme la chaîne du nom d'utilisateur.
*   `OR 1=1` est une condition toujours vraie.
*   `--` commente le reste de la requête (la vérification du mot de passe).

### Défi 2.2 : Vol de données (UNION Based)
1.  **Colonnes à utiliser :** La table `notes` contient 3 colonnes (`id`, `student`, `grade`). Pour que le `UNION` fonctionne, il faut impérativement que la deuxième requête ait le même nombre de colonnes.
2.  **Payload final :**
    `' UNION SELECT id, username, password FROM users --`
    *(Ou si l'ID n'est pas important : `' UNION SELECT 1, username, password FROM users --`)*

**Explication :**
La requête devient :
```sql
SELECT * FROM notes WHERE student LIKE '%' UNION SELECT id, username, password FROM users --%'
```
*   La première partie (`SELECT * FROM notes`) sélectionne 3 colonnes.
*   La deuxième partie (`SELECT id, username, password FROM users`) doit aussi en sélectionner 3.
*   Cela fusionne les résultats : les noms d'utilisateurs apparaîtront dans la colonne `student` et les mots de passe dans la colonne `grade`.

---

## Partie 3 : Cross-Site Scripting (XSS) - "Le Piège"

### Défi 3.1 : XSS Reflected
Payload : `<script>alert("Hacked")</script>`
Une fenêtre d'alerte apparaît car le navigateur exécute le code JavaScript injecté.

### Défi 3.2 : Vol de Session
Payload : `<script>alert(document.cookie)</script>`
La chaîne affichée est l'identifiant de session PHP (ex: `PHPSESSID=a1b2c3d4...`). C'est la "clé" qui permet au serveur de reconnaître l'utilisateur connecté. Si un attaquant vole cette clé, il peut se connecter sans mot de passe.

### Défi 3.3 : XSS Stored
Payload : `Bonjour ! <script>window.location = "https://google.com"</script>`
Dès que le message est enregistré en base, il est réaffiché à chaque visiteur. Le navigateur exécute le script de redirection immédiatement. C'est une attaque persistante très dangereuse.

---

## Partie 4 : Cross-Site Request Forgery (CSRF)

### Défi 4.1 : Création du piège
**Constat :** En retournant sur le Lab, on voit que le message "J aime les renards (HACKED BY CSRF)" a été posté.
**L'utilisateur l'a-t-il écrit ?** Non, c'est le formulaire caché dans `piege.html` qui a envoyé la requête POST automatiquement grâce au JavaScript `document.forms[0].submit()`. Comme l'utilisateur était déjà connecté (session active), le serveur a accepté la requête.

### Défi 4.2 : Audit des mots de passe
1.  En utilisant l'injection SQL, on voit les mots de passe en clair (ex: `admin123`).
2.  **Question 1 :** Les mots de passe sont stockés en clair (texte brut).
3.  **Question 2 :** C'est un risque critique car si la base de données est compromise (volée), tous les comptes sont immédiatement accessibles. En RGPD, c'est une violation majeure de l'obligation de sécurité des données personnelles (Article 32).

---

## Partie 5 : Remédiation (Patching)

### Correction 5.1 : Protection contre les XSS
3.  **Intérêt :** `htmlspecialchars()` convertit les caractères spéciaux en entités HTML (`<` devient `&lt;`). Le navigateur affiche alors le code au lieu de l'exécuter.

**Code corrigé :**
```php
// Ligne 122
echo "<p>Résultats pour : <b>" . htmlspecialchars($q) . "</b></p>";

// Ligne 164
echo "<div class='message-box'>" . htmlspecialchars($m['content']) . "</div>";
```

### Correction 5.2 : Protection contre les SQLi
5.  **Requêtes préparées :** Elles séparent la structure SQL des données. La base de données compile d'abord la requête avec des "trous" (`?` ou `:param`), puis insère les données en les traitant strictement comme du contenu, jamais comme des commandes SQL.

6.  **Code corrigé (Recherche) :**
```php
// Avant : $db->query("SELECT * FROM notes WHERE matiere LIKE '%$q%'");

// Après :
$stmt = $db->prepare("SELECT * FROM notes WHERE matiere LIKE :search");
$stmt->bindValue(':search', '%' . $q . '%');
$result = $stmt->execute();
```

**Question :** L'injection `' OR 1=1 --` ne fonctionne plus car elle est traitée comme une simple chaîne de caractères littérale. La base cherche une matière qui s'appelle littéralement `' OR 1=1 --`.

### Correction 5.3 : Hachage des mots de passe
7.  **Création des users :**
```php
$pass_admin = password_hash('SuperSecretPassword!123', PASSWORD_DEFAULT);
$db->exec("INSERT INTO users (username, password) VALUES ('admin', '$pass_admin')");
```

8.  **Login sécurisé :**
```php
$stmt = $db->prepare("SELECT * FROM users WHERE username = :u");
$stmt->bindValue(':u', $u);
$result = $stmt->execute();

if ($row = $result->fetchArray()) {
    if (password_verify($p, $row['password'])) {
        $_SESSION['user'] = $u;
        // ...
    }
}
```

### Correction 5.4 : Protection CSRF
**Question :** Avec le token, l'attaque `piege.html` échoue et affiche "Erreur CSRF !".
**Pourquoi ?** Le fichier `piege.html` est sur le bureau (ou un autre site), il ne peut pas lire la variable `$_SESSION['token']` du serveur. Il envoie donc le formulaire sans token (ou avec un mauvais token), et le serveur rejette la demande.

---

## Partie 6 : Challenges (Bonus)

### Challenge 6.1 : Cartographie (Injection SQL avancée)
Payload : `' UNION SELECT tbl_name, sql FROM sqlite_master --`
Cela affiche la structure interne de la base.
**Table trouvée :** `users` (ou parfois `user_credentials` selon la version du lab).

### Challenge 6.2 : Cracking
1.  Extraction du hash de Toto (si haché) ou mot de passe en clair.
2.  Connexion avec `toto`.
3.  Sa moyenne est visible sur son tableau de bord.

### Challenge 6.3 : Security Hardening
4.  **X-XSS-Protection: 0** : Cette ligne **désactive** le filtre anti-XSS intégré aux vieux navigateurs. C'est dangereux car cela enlève une couche de défense (même si elle est imparfaite).
5.  **Headers recommandés :**
    *   `Content-Security-Policy (CSP)` : Pour restreindre les sources de scripts autorisées (le plus efficace contre XSS).
    *   `Strict-Transport-Security (HSTS)` : Pour forcer le HTTPS.
    *   `X-Frame-Options: DENY` : Pour empêcher le Clickjacking (site affiché dans une iframe).
    *   `X-Content-Type-Options: nosniff` : Pour empêcher le navigateur de deviner le type MIME.
