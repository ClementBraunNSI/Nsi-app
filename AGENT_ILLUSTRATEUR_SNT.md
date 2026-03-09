# Agent Illustrateur SNT (Seconde)

Cet agent a pour mission de rendre vos cours de Seconde plus visuels et engageants en générant automatiquement des illustrations là où elles manquent.

## 🎯 Objectif
1.  **Analyser** vos cours existants pour repérer les "murs de texte" (longs paragraphes sans image).
2.  **Imaginer** l'illustration idéale (schéma explicatif, illustration ludique, métaphore visuelle).
3.  **Générer** l'image via une IA (DALL-E 3, Midjourney via API, ou Stable Diffusion).
4.  **Proposer** l'insertion de l'image dans le cours.

---

## 🛠️ Architecture du Workflow N8N

### 1. Le Déclencheur (Trigger)
*   **Manual Trigger** : On lance l'analyse cours par cours, ou sur tout le dossier `content/1/`.

### 2. L'Analyse du Contenu (Le Critique d'Art)
*   **GitHub** > **Get File** : Lit le fichier Markdown.
*   **Google Gemini (Chat Model)** :
    *   **Prompt System :** "Tu es un designer pédagogique. Ton rôle est d'identifier les concepts abstraits qui nécessitent une visualisation pour des élèves de 15 ans."
    *   **Task :** "Analyse ce cours. Identifie les 3 sections les plus arides/difficiles. Pour chacune, décris précisément une illustration qui aiderait à comprendre (Prompt de génération d'image)."

### 3. La Génération d'Image (L'Artiste)
*   **OpenAI (DALL-E 3)** ou **Stability AI** :
    *   Utilise les descriptions générées par Gemini pour créer les images.
    *   *Astuce :* Ajoutez "Style flat design, éducatif, coloré, adapté à un manuel scolaire" au prompt pour avoir une cohérence graphique.

### 4. Le Stockage (L'Archiviste)
*   **HTTP Request** : Télécharge l'image générée.
*   **GitHub** > **Create File** :
    *   Sauvegarde l'image dans `public/content/1/generated/`.
    *   Nom de fichier : `illustration_[concept]_[date].png`.

### 5. La Proposition (Le Rédacteur)
*   **GitHub** > **Create or Update File** :
    *   Crée un fichier `TODO List/PROPOSITIONS_ILLUSTRATIONS_SNT.md`.
    *   Contenu :
        ```markdown
        ## Proposition pour [Nom du Cours]
        **Concept :** Le fonctionnement du DNS.
        **Image générée :** ![DNS](public/content/1/generated/dns_schema.png)
        **Code à insérer :** `![Schéma DNS](/content/1/generated/dns_schema.png)`
        ```

---

## 🚀 Mise en Place Pas-à-Pas

### Étape 1 : Le Nœud Gemini (Le Cerveau)
*   Connectez votre clé API Google Gemini.
*   **Prompt :**
    ```text
    Voici le cours : {{ $json.content }}
    
    Trouve le concept le plus difficile à comprendre sans image.
    Génère un prompt DALL-E pour l'illustrer.
    Le prompt doit être en anglais, très descriptif.
    Exemple de prompt : "A simple vector flat illustration showing how DNS works like a phonebook..."
    ```

### Étape 2 : Le Nœud de Génération (DALL-E 3)
*   Utilisez le nœud **OpenAI**.
*   **Resource :** Image.
*   **Operation :** Generate.
*   **Prompt :** `{{ $json.prompt_image }} + ", educational style, flat design, vector art, white background"`

### Étape 3 : Sauvegarde sur GitHub
*   Le nœud OpenAI renvoie une URL binaire.
*   Utilisez le nœud **GitHub** pour uploader ce binaire dans votre dossier `public/`.

---

## 💡 Idées d'Illustrations pour vos Cours SNT

Voici ce que l'agent pourrait générer pour vos fichiers actuels :

*   **`Cours_Internet.md` :**
    *   *Idée :* Une métaphore du "Réseau de réseaux" sous forme de plan de métro ou de toile d'araignée interconnectée.
    *   *Prompt :* "Isometric illustration of the internet as interconnected cities with fiber optic cables glowing underground."

*   **`Cours_Localisation.md` :**
    *   *Idée :* Le principe de la trilatération GPS (3 satellites + 1 smartphone).
    *   *Prompt :* "Educational diagram showing GPS trilateration, 3 satellites orbiting earth beaming signals to a smartphone, flat vector style."

*   **`Cours_Reseaux_Sociaux.md` :**
    *   *Idée :* Un schéma montrant le graphe social (nœuds et arêtes) d'un petit groupe d'amis.
    *   *Prompt :* "Social network graph visualization, nodes representing smiling diverse teenagers, lines showing connections, colorful icons."

*   **`Binaire_Decimal.md` :**
    *   *Idée :* Des interrupteurs ON/OFF pour expliquer les bits 0 et 1.
    *   *Prompt :* "Cartoon illustration of a row of light switches, some ON (1) some OFF (0), labeled 'Binary Code', fun educational style."
