# Guide d'Intégration N8N : Git, Supabase et Vercel

Ce guide vous explique comment connecter vos outils de développement (Git, Supabase, Vercel) à n8n pour automatiser vos processus et créer des agents IA intelligents.

## 1. Prérequis

*   Une instance **n8n** fonctionnelle (Cloud ou Self-hosted).
*   Un compte **GitHub** (ou GitLab/Bitbucket) avec accès au dépôt.
*   Un projet **Supabase** configuré.
*   Un compte **Vercel** avec votre projet déployé.

---

## 2. Connecter votre Répo Git (GitHub/GitLab)

L'intégration Git permet à n8n de réagir aux changements de code (push, pull request) ou d'automatiser des mises à jour de contenu (commit, merge).

### Étape 1 : Créer un Token d'accès (PAT)
1.  Allez dans les paramètres de votre compte GitHub/GitLab.
2.  Générez un **Personal Access Token (PAT)** avec les scopes suivants :
    *   `repo` (pour lire/écrire dans les dépôts privés).
    *   `admin:repo_hook` (pour gérer les webhooks).

### Étape 2 : Configurer les Identifiants dans n8n
1.  Dans n8n, allez dans **Credentials** > **New Credential**.
2.  Cherchez **GitHub API** (ou GitLab).
3.  Sélectionnez **Access Token** comme méthode d'authentification.
4.  Collez votre PAT et sauvegardez.

### Étape 3 : Utiliser les Nœuds
*   **GitHub Trigger** : Pour déclencher un workflow lors d'un `push`, d'une `issue` ou d'une `pull request`.
*   **GitHub** : Pour effectuer des actions comme :
    *   Créer un fichier (ex: ajouter un article de blog généré par IA).
    *   Créer une Pull Request automatiquement.
    *   Ajouter un label ou un commentaire.

---

## 3. Connecter votre Base de Données Supabase

Supabase est basé sur PostgreSQL, ce qui rend l'intégration très puissante avec n8n.

### Étape 1 : Récupérer les clés API
1.  Dans votre dashboard Supabase, allez dans **Project Settings** > **API**.
2.  Notez l'URL du projet (`https://xyz.supabase.co`).
3.  Récupérez la clé **`service_role`** (attention, cette clé a tous les droits, ne la partagez jamais côté client).

### Étape 2 : Configurer les Identifiants dans n8n
1.  Dans n8n, créez un nouveau credential de type **Supabase API**.
2.  Remplissez l'URL et la clé `service_role`.

### Étape 3 : Utiliser le Nœud Supabase
Le nœud Supabase permet de faire des opérations CRUD (Create, Read, Update, Delete) facilement.
*   **Opération "Get All"** : Récupérer des données pour les traiter.
*   **Opération "Create"** : Insérer des résultats d'analyse ou de logs.
*   **Opération "Execute Query"** : Pour des requêtes SQL complexes (via le nœud Postgres si besoin).

*Astuce : Vous pouvez aussi utiliser le nœud **Postgres** standard en utilisant les identifiants de connexion directe (Settings > Database > Connection pooling).*

---

## 4. Connecter Vercel

L'intégration Vercel permet de déclencher des déploiements ou de récupérer des informations sur vos builds.

### Étape 1 : Créer un Token Vercel
1.  Allez dans **Account Settings** > **Tokens**.
2.  Créez un token avec un nom explicite (ex: `n8n-automation`).

### Étape 2 : Configurer n8n
1.  N8N ne possède pas toujours un nœud Vercel natif à jour. Le plus simple est d'utiliser le nœud **HTTP Request**.
2.  Authentification : **Header Auth**.
    *   Name: `Authorization`
    *   Value: `Bearer VOTRE_TOKEN_VERCEL`

### Étape 3 : Exemples d'Actions (API Vercel)
*   **Déclencher un déploiement** :
    *   POST `https://api.vercel.com/v13/deployments`
    *   Body : `{ "name": "mon-projet", "target": "production" }`
*   **Récupérer le statut du dernier déploiement** :
    *   GET `https://api.vercel.com/v6/deployments?limit=1`

---

## 5. Exemple de Workflow "Agent IA" Complet

Voici comment lier le tout pour créer un agent autonome :

**Scénario :** Un utilisateur remplit un formulaire (Supabase), une IA analyse la demande, met à jour le site (Git) et déploie (Vercel).

1.  **Trigger (Supabase)** :
    *   Utilisez le nœud **Supabase Trigger** (écoute les `INSERT` sur la table `demandes`).
2.  **Traitement (IA Agent)** :
    *   Utilisez un nœud **OpenAI** ou **LangChain** dans n8n.
    *   Prompt : "Analyse cette demande et génère le contenu HTML pour une nouvelle page".
3.  **Action (Git)** :
    *   Nœud **GitHub** > "File" > "Create or Update".
    *   Chemin : `content/nouvelle-page.md`.
    *   Contenu : Le résultat de l'IA.
    *   Message de commit : "Ajout automatique via n8n".
4.  **Déploiement (Vercel)** :
    *   Vercel détectera automatiquement le commit sur Git et lancera le build.
    *   Optionnel : Nœud **HTTP Request** pour forcer un redéploiement si besoin.
5.  **Notification (Supabase/Slack)** :
    *   Mettre à jour le statut de la demande dans Supabase (`status: 'published'`).
    *   Envoyer une notification sur Slack/Discord.

---

## 6. Conseils pour les Agents IA (N8N + LangChain)

N8N intègre désormais des fonctionnalités avancées pour les agents IA :
*   **Basic LLM Chain** : Pour des tâches simples (résumé, classification).
*   **Agent** : Capable d'utiliser des outils (Tools).
    *   Vous pouvez donner à l'agent l'outil "Supabase" et l'outil "GitHub".
    *   L'agent pourra décider lui-même : "Je dois d'abord lire la base de données, puis si c'est validé, je commit le code".

**Ressources utiles :**
*   [Documentation n8n](https://docs.n8n.io/)
*   [API Supabase](https://supabase.com/docs/reference/javascript/introduction)
*   [API Vercel](https://vercel.com/docs/rest-api)
