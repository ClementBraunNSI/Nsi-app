# Correction du Devoir Surveillé – Sécurité Web (OWASP)

## Partie 1 – Connaissances de base (10 points)

### 1.1 Association de concepts (4 points)

*   **1 - D** : **A01 Broken Access Control** correspond à l'accès non autorisé à une page admin (le serveur ne vérifie pas le statut).
*   **2 - C** : **A03 Injection** correspond à l'insertion de code SQL malveillant.
*   **3 - A** : **A05 Security Misconfiguration** correspond à l'affichage de messages d'erreur techniques (information disclosure).
*   **4 - B** : **A07 Identification Failures** correspond à l'absence de protection contre le brute-force (10 000 essais).

### 1.2 Cryptographie et Authentification (3 points)

1.  **Stockage des mots de passe (1 pt)** :
    Il ne faut jamais stocker en clair car si la base de données est volée (dump SQL), l'attaquant a accès immédiat à tous les comptes. Il faut stocker une **empreinte chiffrée (hash)** du mot de passe (idéalement salée).

2.  **RSA (1 pt)** :
    *   **Nombre de clés** : 2 clés par utilisateur (une paire).
    *   **Rôle** : Une clé **publique** (pour chiffrer les messages destinés à l'utilisateur) et une clé **privée** (que l'utilisateur garde secrète pour déchiffrer).
    *   *Note : On peut aussi utiliser la clé privée pour signer et la publique pour vérifier la signature.*

3.  **MFA (1 pt)** :
    *   **Définition** : Authentification Multi-Facteurs (Multi-Factor Authentication). C'est l'utilisation de **deux preuves d'identité de nature différente** pour se connecter.
    *   **Exemple** : Un mot de passe (ce que je sais) **ET** un code reçu par SMS ou généré par une application sur mon téléphone (ce que je possède).

### 1.3 Vulnérabilités et Mises à jour (3 points)

1.  **CVE (1 pt)** :
    **Common Vulnerabilities and Exposures**. C'est un dictionnaire public (une liste standardisée) qui référence les failles de sécurité connues dans les logiciels. Chaque faille a un identifiant unique (ex: CVE-2021-44228).

2.  **Mises à jour (2 pts)** :
    Les mises à jour corrigent les failles connues (CVE). Une fois qu'une faille est publiée, les pirates disposent souvent de scripts automatiques pour scanner et attaquer les serveurs non mis à jour. Ne pas appliquer les patchs revient à laisser une porte ouverte connue de tous.

---

## Partie 2 – Analyse de cas simples (10 points)

### Cas Pratique n°1 : L'URL curieuse (5 points)

1.  **Nom de la vulnérabilité (1 pt)** :
    C'est une **IDOR** (Insecure Direct Object Reference) ou, en français, une **Référence Directe à un Objet Non Sécurisée**. Elle fait partie de la catégorie **A01 : Broken Access Control**.

2.  **Origine du problème (1 pt)** :
    Le problème vient du **code sur le serveur**. Le navigateur ne fait qu'envoyer une requête standard. C'est le serveur qui accepte de renvoyer la facture n°106 sans vérifier si elle appartient bien à l'utilisateur connecté (Alice).

3.  **Logique de correction (3 pts)** :
    Le développeur ne doit pas se contenter de récupérer l'ID dans l'URL.
    Avant d'afficher la facture, le code doit :
    1.  Récupérer l'ID de l'utilisateur actuellement connecté (via sa session).
    2.  Int erroger la base de données pour vérifier qui est le **propriétaire** de la facture n°106.
    3.  Comparer les deux ID. Si ce ne sont pas les mêmes, refuser l'accès (erreur 403 Forbidden).
    *En résumé : "Est-ce que la facture demandée appartient bien à l'utilisateur qui la demande ?"*

### Cas Pratique n°2 : Le formulaire de connexion (5 points)

1.  **Catégorie OWASP (1 pt)** :
    C'est une **Injection SQL** (Catégorie **A03 : Injection**).

2.  **Mécanisme de l'attaque (2 pts)** :
    La requête devient :
    `SELECT * FROM utilisateurs WHERE email = '' OR '1'='1' AND ...`
    Le morceau `' OR '1'='1` est une condition qui est **toujours vraie** (tautologie).
    Dans le langage SQL, l'opérateur `OR` rend la condition globale vraie dès qu'une partie est vraie. La base de données valide donc la requête et connecte l'utilisateur (souvent en tant que premier utilisateur de la table, c'est-à-dire l'administrateur).

3.  **La règle d'or (2 pts)** :
    Il faut utiliser des **Requêtes Préparées** (Prepared Statements) ou des **Requêtes Paramétrées**.
    Cela permet de séparer le code SQL des données saisies par l'utilisateur. Les données ne sont jamais interprétées comme des commandes.
