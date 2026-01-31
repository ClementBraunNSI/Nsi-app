---
title: "TP SISR : Injections SQL et failles XSS"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_sql_audit_rgpd"
meta: "Durée : 2 heures · Objectif : Comprendre pour mieux protéger"
---

## 1. Mise en place du Lab

Pour ce TP, nous n'allons pas installer une usine à gaz. Nous utiliserons un "micro-site" vulnérable conçu spécifiquement pour l'exercice.

### Installation
1.  Récupérez le fichier `lab_cybersecurite.php`.
2.  Lancez un serveur PHP local.
    *   **Option A (Ligne de commande) :** Ouvrez un terminal dans le dossier du fichier et tapez :
        ```bash
        php -S localhost:8000
        ```
    *   **Option B (XAMPP/WAMP) :** Placez le fichier dans `htdocs` ou `www`.
3.  Ouvrez votre navigateur sur `http://localhost:8000/lab_securite.php`.

> **Scénario :** Vous êtes administrateur système. Le développeur stagiaire a créé une petite application de "Gestion de Notes" pour l'équipe. Il affirme que c'est sécurisé car "il y a un mot de passe". Votre mission : prouver le contraire.

---

## 2. Injection SQL (SQLi) - L'Authentification

L'application possède une page de login. Le développeur vérifie le mot de passe en base de données.

**Défi 1 : Le contournement**
Essayez de vous connecter en tant qu'**admin** sans connaître le mot de passe.

*   **Indice :** L'application construit la requête SQL en collant votre texte directement.
*   **Payload à tester : comparaison OR**
*   **Question :** Que se passe-t-il ? Pourquoi cela fonctionne-t-il ? (Analysez la requête SQL affichée en bas de page).

**Défi 2 : Vol de base de données (UNION Based)**
Une fois connecté, vous avez un champ de recherche de notes.
Essayez d'injecter une commande `UNION` pour récupérer la liste des utilisateurs et leurs mots de passe.

*   **Indice :** Il faut deviner le nombre de colonnes.
*   **Objectif :** Récupérer le mot de passe de l'utilisateur "Toto".

---

## 3. Cross-Site Scripting (XSS)

### A. XSS Reflected (Non persistant)
Le moteur de recherche affiche ce que vous avez tapé : *"Résultats pour : [votre recherche]"*.

**Défi 3 : Le test du script**
Faites apparaître une fenêtre d'alerte (pop-up) JavaScript en utilisant le champ de recherche.

*   **Payload :** `<script>alert('Hacked')</script>`
*   **Analyse :** Regardez le code source de la page (Ctrl+U). Où se trouve votre script ? Pourquoi le navigateur l'exécute-t-il ?

### B. XSS Stored (Persistant) - Le plus dangereux
Il y a un "Livre d'or" ou une zone de commentaires sur le dashboard.

**Défi 4 : Le piège permanent**
Postez un commentaire contenant un script qui redirige l'utilisateur vers Google.

*   **Payload :** `<script>window.location = "https://google.com"</script>`
*   **Conséquence :** Rechargez la page. Que se passe-t-il ? Que se passera-t-il pour l'administrateur s'il vient modérer les commentaires ?

---

## 4. Analyse et Remédiation (Pour SISR)

En tant qu'admin système, vous ne développez pas l'app, mais vous devez sécuriser le serveur.

**Question 1 : Les Logs**
Si un attaquant utilise `sqlmap` ou tente des injections manuelles, quelles traces cela laisse-t-il dans les logs d'accès du serveur web (Apache/Nginx) ?

**Question 2 : Protection Serveur (WAF)**
Citez un équipement ou un logiciel qu'on pourrait placer *devant* le serveur web pour bloquer ces requêtes automatiquement, même si le code est mal fait.

**Question 3 : Correction du code (Patch)**
Regardez le code source de `lab_securite.php`.
On souhaite protéger ce formulaire.
Trouver sur internet comment protéger ce formulaire des injections SQL et des failles XSS.
Voici quelques indices :
*   Pour la SQLi : Quelle fonction PHP permet d'utiliser des "Requêtes Préparées" (la solution) ?
*   Pour la XSS : Quelle fonction PHP permet de transformer les `<` et `>` en texte inoffensif ? (`htmlspecialchars`)
