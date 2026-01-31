<?php
// Configuration et Initialisation de la DB SQLite (Automatique)
$db = new SQLite3(':memory:'); // Base de données en mémoire vive (disparait au reboot)

// Création de la table USERS
$db->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
$db->exec("INSERT INTO users (username, password) VALUES ('admin', 'SuperSecretPassword!123')");
$db->exec("INSERT INTO users (username, password) VALUES ('toto', 'ilovepizza')");

// Création de la table MESSAGES (Pour XSS Stored)
$db->exec("CREATE TABLE messages (id INTEGER PRIMARY KEY, content TEXT)");

// Désactiver les protections XSS du navigateur pour l'exercice
header("X-XSS-Protection: 0");

session_start();

// Traitement du Login
$login_error = "";
if (isset($_POST['login'])) {
    $u = $_POST['username'];
    $p = $_POST['password'];

    // FAILLE SQL INJECTION ICI : Pas de préparation, concaténation directe
    $sql = "SELECT * FROM users WHERE username = '$u' AND password = '$p'";
    
    // On exécute la requête (vulnérable)
    $result = $db->query($sql);
    
    // Si on trouve une ligne, c'est gagné
    if ($row = $result->fetchArray()) {
        $_SESSION['user'] = $row['username'];
    } else {
        $login_error = "Identifiants incorrects. <br><small>Requête exécutée : " . htmlspecialchars($sql) . "</small>";
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
    // FAILLE XSS ICI : Pas de htmlspecialchars()
    $msg = $_POST['content'];
    $db->exec("INSERT INTO messages (content) VALUES ('$msg')");
}

?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Lab Sécurité Vulnerable</title>
    <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; background: #f0f2f5; }
        .container { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #e74c3c; }
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
    <h1>💀 Lab Sécurité : SQLi & XSS</h1>

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

        <hr>
        <h3>Indice pour l'exercice :</h3>
        <p>Le code PHP ressemble à ceci :</p>
        <code>$sql = "SELECT * FROM users WHERE username = '$u' AND password = '$p'";</code>

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
            // FAILLE XSS ICI : on affiche directement $_GET['q']
            echo "<p>Résultats pour : <b>" . $_GET['q'] . "</b></p>";
            echo "<p><i>Aucun résultat trouvé dans la base.</i></p>";
        }
        ?>

        <hr>

        <!-- SECTION XSS STORED -->
        <h3>📢 Livre d'or (XSS Stored)</h3>
        <p>Laissez un message à l'administrateur.</p>
        
        <form method="POST">
            <input type="text" name="content" placeholder="Votre message..." required>
            <button type="submit" name="new_message">Envoyer</button>
        </form>

        <div style="margin-top: 20px;">
            <?php
            $msgs = $db->query("SELECT * FROM messages ORDER BY id DESC");
            while ($m = $msgs->fetchArray()) {
                // FAILLE XSS ICI : on affiche le contenu de la DB sans nettoyage
                echo "<div class='message-box'>" . $m['content'] . "</div>";
            }
            ?>
        </div>

    <?php endif; ?>
</div>

</body>
</html>
