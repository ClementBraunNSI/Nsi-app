<?php
// Configuration et Initialisation de la DB SQLite (Automatique)
$db = new SQLite3(':memory:'); // Base de données en mémoire vive (disparait au reboot)

// [CORRECTION 5.3] Hachage des mots de passe (Défi 4.2)
// On ne stocke jamais les mots de passe en clair.
// On génère le hash du mot de passe admin
$pass_admin_hash = password_hash('SuperSecretPassword!123', PASSWORD_DEFAULT);
$pass_toto_hash = password_hash('ilovepizza', PASSWORD_DEFAULT);

// Création de la table USERS
$db->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
// Insertion des hashs au lieu des mots de passe en clair
$stmt = $db->prepare("INSERT INTO users (username, password) VALUES ('admin', :p)");
$stmt->bindValue(':p', $pass_admin_hash, SQLITE3_TEXT);
$stmt->execute();

$stmt = $db->prepare("INSERT INTO users (username, password) VALUES ('toto', :p)");
$stmt->bindValue(':p', $pass_toto_hash, SQLITE3_TEXT);
$stmt->execute();

// Création de la table NOTES (Pour SQLi UNION Based)
$db->exec("CREATE TABLE notes (id INTEGER PRIMARY KEY, student TEXT, grade INTEGER)");
$db->exec("INSERT INTO notes (student, grade) VALUES ('Alice', 18)");
$db->exec("INSERT INTO notes (student, grade) VALUES ('Bob', 12)");
$db->exec("INSERT INTO notes (student, grade) VALUES ('Charlie', 15)");

// Création de la table MESSAGES (Pour XSS Stored)
$db->exec("CREATE TABLE messages (id INTEGER PRIMARY KEY, content TEXT)");

// Désactiver les protections XSS du navigateur pour l'exercice
header("X-XSS-Protection: 0");

// Démarre la session ET crée automatiquement un cookie 'PHPSESSID' sur le navigateur
// C'est ce cookie qui permet au serveur de vous reconnaître d'une page à l'autre.
// (Cible du Défi 3.2 : Vol de Session)
session_start();

// [CORRECTION 5.4] Protection CSRF (Défi 4.1)
// Génération d'un token unique par session s'il n'existe pas encore
if (empty($_SESSION['token'])) {
    $_SESSION['token'] = bin2hex(random_bytes(32));
}

// Traitement du Login
$login_error = "";
if (isset($_POST['login'])) {
    $u = $_POST['username'];
    $p = $_POST['password'];

    // [CORRECTION 5.2] Protection contre SQLi (Défi 2.1 - Contournement d'authentification)
    // Au lieu de concaténer les variables ("... WHERE username = '$u' ..."), 
    // on utilise prepare() + bindValue().
    // La base de données traite ainsi les entrées comme du texte pur, jamais comme du code SQL executable.
    
    // [CORRECTION 5.3] Hachage des mots de passe
    // On ne vérifie plus le mot de passe dans le SQL. On récupère l'utilisateur par son login uniquement.
    $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
    $stmt->bindValue(':username', $u, SQLITE3_TEXT);
    
    $result = $stmt->execute();
    $row = $result->fetchArray();
    
    // Ensuite, on vérifie le hash avec password_verify()
    if ($row && password_verify($p, $row['password'])) {
        $_SESSION['user'] = $row['username'];
    } else {
        $login_error = "Identifiants incorrects.";
    }
}

// Traitement du Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: " . $_SERVER['PHP_SELF']);
    exit;
}

// Traitement Nouveau Message (XSS Stored)
if (isset($_POST['new_message'])) {
    
    // [CORRECTION 5.4] Vérification CSRF
    // On vérifie que le token envoyé par le formulaire correspond à celui en session
    if (!hash_equals($_SESSION['token'], $_POST['token'])) {
        die("Erreur CSRF : Tentative de forge de requête détectée !");
    }

    // [BONNE PRATIQUE] Même si l'injection SQL n'était pas le but ici, 
    // on sécurise toujours les insertions en base.
    $msg = $_POST['content'];
    $stmt = $db->prepare("INSERT INTO messages (content) VALUES (:content)");
    $stmt->bindValue(':content', $msg, SQLITE3_TEXT);
    $stmt->execute();
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Lab Sécurité Sécurisé (Complet)</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; background: #f0f2f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #27ae60; }
        .success { color: #27ae60; font-weight: bold; }
        .error { color: #c0392b; background: #fadbd8; padding: 10px; border-radius: 4px; }
        input[type="text"], input[type="password"] { width: 100%; padding: 8px; margin: 5px 0; }
        button { background: #3498db; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
        button:hover { background: #2980b9; }
        .message-box { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; background: #fafafa; }
        code { background: #333; color: #0f0; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>

<div class="container">
    <h1>🛡️ Lab Sécurité : Corrigé Complet</h1>

    <?php if (!isset($_SESSION['user'])): ?>
        <!-- PAGE DE LOGIN -->
        <h2>Authentification</h2>
        <p>Connectez-vous pour accéder aux notes confidentielles.</p>
        
        <?php if ($login_error) echo "<div class='error'>$login_error</div>"; ?>

        <form method="POST">
            <label>Utilisateur :</label>
            <input type="text" name="username" placeholder="admin">
            <label>Mot de passe :</label>
            <input type="password" name="password" placeholder="???">
            <button type="submit" name="login">Se connecter</button>
        </form>

    <?php else: ?>
        <!-- DASHBOARD (Connecté) -->
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 class="success">Bienvenue, <?php echo htmlspecialchars($_SESSION['user']); ?> !</h2>
            <a href="?logout=1" style="color:red">Déconnexion</a>
        </div>

        <hr>

        <!-- SECTION XSS REFLECTED -->
        <h3>🔍 Recherche (XSS Reflected)</h3>
        <form method="GET">
            <input type="text" name="q" placeholder="Rechercher une note...">
            <button type="submit">Rechercher</button>
        </form>
        
        <?php
        if (isset($_GET['q'])) {
            $q = $_GET['q'];
            
            // [CORRECTION 5.1] Protection contre XSS Reflected (Défi 3.1 & 3.2)
            // La fonction htmlspecialchars() transforme les caractères spéciaux en entités HTML.
            // Ex: "<script>" devient "&lt;script&gt;"
            // Le navigateur affiche donc le code au lieu de l'exécuter.
            echo "<p>Résultats pour : <b>" . htmlspecialchars($q) . "</b></p>";
            
            // [CORRECTION 5.2] Protection contre SQLi UNION (Défi 2.2 - Vol de données)
            // Ici aussi, on utilise une requête préparée pour empêcher l'injection ' UNION SELECT ...
            $stmt = $db->prepare("SELECT * FROM notes WHERE student LIKE :query");
            $stmt->bindValue(':query', '%' . $q . '%', SQLITE3_TEXT);
            
            $results = $stmt->execute();
            
            if ($results) {
                echo "<ul>";
                while ($row = $results->fetchArray()) {
                    $val = isset($row['grade']) ? $row['grade'] : '?';
                    $name = isset($row['student']) ? $row['student'] : '?';
                    
                    // Sécurisation de l'affichage des données provenant de la base (Défense en profondeur)
                    echo "<li>" . htmlspecialchars($name) . " : " . htmlspecialchars($val) . "</li>";
                }
                echo "</ul>";
            } else {
                 echo "<p><i>Erreur dans la requête.</i></p>";
            }
        }
        ?>

        <hr>

        <!-- SECTION XSS STORED -->
        <h3>📢 Livre d'or (XSS Stored)</h3>
        <p>Laissez un message à l'administrateur.</p>
        
        <form method="POST">
            <!-- [CORRECTION 5.4] Protection CSRF -->
            <!-- On inclut le token en champ caché -->
            <input type="hidden" name="token" value="<?php echo $_SESSION['token']; ?>">
            
            <input type="text" name="content" placeholder="Votre message..." required>
            <button type="submit" name="new_message">Envoyer</button>
        </form>

        <div style="margin-top: 20px;">
            <?php
            $msgs = $db->query("SELECT * FROM messages ORDER BY id DESC");
            while ($m = $msgs->fetchArray()) {
                // [CORRECTION 5.1] Protection contre XSS Stored (Défi 3.3)
                // C'est le moment critique : on affiche une donnée stockée en base.
                // Si l'attaquant a stocké du JS, htmlspecialchars() le neutralise ici.
                echo "<div class='message-box'>" . htmlspecialchars($m['content']) . "</div>";
            }
            ?>
        </div>

    <?php endif; ?>
</div>

</body>
</html>