# Tutoriel Pas-à-Pas : Créer l'Agent de Veille SNT (Seconde)

Ce guide vous accompagne de zéro ("From Scratch") jusqu'à l'obtention d'un agent fonctionnel qui surveille l'actualité numérique pour vos cours de SNT.

## 🏁 Phase 1 : Préparation des Outils (5 min)

1.  **Ouvrez n8n** (votre instance Cloud ou locale).
2.  Créez un **nouveau Workflow** vide.
3.  Nommez-le : `Agent Veille SNT`.
4.  Assurez-vous d'avoir configuré vos identifiants (Credentials) pour :
    *   **Google Gemini** (Clé API).
    *   **GitHub** (Token d'accès).

---

## 📡 Phase 2 : La Collecte d'Information (10 min)

Nous allons récupérer les articles de "Le Monde - Pixels" et "Numerama".

1.  Ajoutez un nœud **RSS Read**.
    *   **URL :** `https://www.lemonde.fr/pixels/rss_full.xml`
    *   *Testez le nœud (Execute Node) : Vous devriez voir une liste d'articles.*
2.  Ajoutez un deuxième nœud **RSS Read**.
    *   **URL :** `https://www.numerama.com/feed/`
3.  Ajoutez un nœud **Merge**.
    *   Connectez les deux nœuds RSS en entrée.
    *   **Mode :** Append (Mettre les articles les uns à la suite des autres).
4.  Ajoutez un nœud **Code** (Optionnel mais recommandé) pour filtrer les doublons ou limiter à 10 articles.
    ```javascript
    // Garder uniquement les 10 derniers articles
    return $input.all().slice(0, 10);
    ```

---

## 📂 Phase 3 : Lire Vos Cours SNT (5 min)

L'agent doit connaître le contenu de vos cours pour savoir si l'actu est pertinente.

1.  Ajoutez un nœud **GitHub**.
    *   **Resource :** File.
    *   **Operation :** Get.
    *   **Owner :** `votre-pseudo-github`.
    *   **Repo :** `Nsi-app`.
    *   **File Path :** `content/1/Cours_Reseaux_Sociaux.md` (On commence par un seul cours pour tester).
    *   *Important :* Activez l'option "As Binary Property" : **OFF** (On veut le texte brut).

---

## 🧠 Phase 4 : Le Cerveau IA (15 min)

C'est ici que la magie opère.

1.  Ajoutez un nœud **Google Gemini Chat Model** (parfois appelé "Google PaLM" selon la version de n8n, ou utilisez "Basic LLM Chain" avec le modèle Google).
2.  Connectez votre Credential Google Gemini (API Key).
3.  **Connectez les entrées :**
    *   L'entrée principale vient du nœud **Merge** (les articles).
    *   L'entrée contextuelle vient du nœud **GitHub** (le cours).
4.  **Le Prompt (Copiez-collez ceci) :**

    ```text
    Tu es un professeur de SNT (Sciences Numériques et Technologie) en classe de Seconde.
    Ta mission est de vulgariser l'actualité numérique pour tes élèves.

    CONTEXTE (MON COURS ACTUEL) :
    {{ $('GitHub').item.json.content }}

    ACTUALITÉS RÉCENTES :
    {{ $json.title }} - {{ $json.description }} (Lien: {{ $json.link }})

    TÂCHE :
    Analyse si cette actualité est pertinente pour enrichir mon cours.
    Si OUI, rédige un court paragraphe "Actu 2024" à insérer dans le cours.
    Si NON, réponds simplement "RIEN".

    FORMAT DE SORTIE (Si pertinent) :
    ## 📰 Proposition d'ajout pour [Nom du Cours]
    **Sujet :** [Titre de l'actu]
    **Pourquoi c'est important :** [Explication pédagogique]
    **Texte à insérer :**
    > 💡 **Actualité :** [Résumé simple pour un élève de 15 ans].
    > *Source : [Lien]*
    ```

---

## 📝 Phase 5 : Sauvegarder le Rapport (5 min)

On ne modifie pas le cours directement (trop risqué). On crée un fichier de suggestions.

1.  Ajoutez un nœud **IF** après l'IA.
    *   Condition : Si le texte contient "RIEN", on arrête. Sinon on continue.
2.  Ajoutez un nœud **GitHub**.
    *   **Resource :** File.
    *   **Operation :** Create or Update.
    *   **File Path :** `TODO List/VEILLE_SNT.md`.
    *   **File Content :** `{{ $json.output_ia }}`.
    *   **Commit Message :** "Veille SNT auto".
    *   **Append :** Activez cette option pour ne pas écraser les veilles précédentes.

---

## ✅ Phase 6 : Test et Automatisation

1.  Cliquez sur **Execute Workflow** en bas.
2.  Allez voir sur votre repo GitHub si le fichier `TODO List/VEILLE_SNT.md` a été créé.
3.  Si tout fonctionne, ajoutez un nœud **Schedule Trigger** au tout début.
    *   **Interval :** Weeks.
    *   **Day :** Monday.
    *   **Time :** 08:00.
4.  Activez le workflow (Switch **Active** en haut à droite).

---

## 🎉 Bravo !
Vous avez votre premier agent autonome.
Désormais, chaque lundi, il lira Le Monde et Numerama, relira votre cours sur les réseaux sociaux, et vous dira : *"Hey, TikTok vient de changer ses règles, tu devrais en parler aux élèves ici !"*.
