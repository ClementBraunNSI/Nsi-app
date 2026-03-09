# Architecture Multi-Agents de Veille Pédagogique (N8N)

Pour couvrir efficacement tous les niveaux (Seconde à BTS), une architecture **modulaire** avec un "Agent Coordinateur" et des "Agents Spécialistes" est recommandée.

## 🎯 Pourquoi séparer par niveau ?
*   **Pertinence :** Un article sur "Les pointeurs en C" n'a aucun intérêt pour un élève de Seconde (SNT), mais est crucial pour un étudiant de BTS SISR.
*   **Tonalité :** L'explication pour une Terminale NSI doit être rigoureuse (académique), tandis que pour la Seconde, elle doit être vulgarisatrice.
*   **Volume :** Analyser tous les cours d'un coup dépasserait les limites de tokens des modèles IA.

---

## 🛠️ Le Workflow "Chef d'Orchestre" (Master Workflow)

Ce workflow principal se déclenche **une fois par jour** (ex: 03h00 du matin) et orchestre les sous-agents.

1.  **Schedule Trigger** (Daily @ 3am).
2.  **Git List Files** : Récupère la liste de tous les fichiers `.md` dans `content/`.
3.  **Switch (Routeur)** : Trie les fichiers selon leur dossier parent :
    *   Si `content/0/` ou `content/1/` -> Route vers **Agent SNT/Seconde**.
    *   Si `content/2/` -> Route vers **Agent Première NSI**.
    *   Si `content/3/` -> Route vers **Agent Terminale NSI**.
    *   Si `content/4/` -> Route vers **Agent BTS SIO**.
4.  **Execute Workflow** : Appelle le sous-workflow correspondant en lui passant le chemin du fichier.

---

## 🤖 Les 4 Agents Spécialistes (Sous-Workflows)

Chaque agent possède sa propre "personnalité" (System Prompt) et ses propres sources de veille.

### 1. Agent SNT (Seconde) & Culture Numérique
*   **Cible :** Grand public, débutants, culture générale.
*   **Sources RSS :** LeMonde Pixel, Numerama, Korben, CNIL Actus.
*   **Prompt System :** "Tu es un professeur de SNT (Sciences Numériques et Technologie). Tu dois vulgariser l'actualité. Cherche des liens avec la vie quotidienne des élèves (Réseaux sociaux, Smartphone, GPS)."
*   **Exemple d'action :** Si TikTok change son algorithme, l'agent propose d'ajouter un encart "Actu 2024" dans le cours `reseaux_sociaux.md`.

### 2. Agent Première NSI (Fondamentaux)
*   **Cible :** Élèves scientifiques qui découvrent la programmation.
*   **Sources RSS :** Real Python, MDN Web Docs, Planet Python.
*   **Prompt System :** "Tu es un professeur de NSI. Tu te concentres sur les bases : Python, HTML/CSS, Algorithmique. Vérifie que les exemples de code utilisent les dernières bonnes pratiques (ex: f-strings en Python)."
*   **Exemple d'action :** Si une nouvelle méthode de tri est popularisée, il suggère un exercice de comparaison d'algorithmes.

### 3. Agent Terminale NSI (Approfondissement)
*   **Cible :** Préparation au Bac, concepts abstraits (Récursivité, POO, BDD).
*   **Sources RSS :** Inria, Interstices, DB-Engines Blog.
*   **Prompt System :** "Tu es un expert en informatique théorique. Tu dois relier les concepts abstraits (Graphes, Arbres) à des applications réelles complexes (Routage internet, IA)."
*   **Exemple d'action :** Lier le cours sur les Graphes à une actualité sur l'optimisation des trajets GPS ou des réseaux sociaux.

### 4. Agent BTS SIO (Pro & Cyber)
*   **Cible :** Futurs professionnels, technique, cybersécurité, infrastructure.
*   **Sources RSS :** ANSSI (CERT-FR), TheHackerNews, OWASP Blog, Microsoft Security, CVE Details.
*   **Prompt System :** "Tu es un auditeur en cybersécurité senior. Tu es intransigeant sur la sécurité. Tu cherches des CVE récentes pour créer des TP réalistes."
*   **Exemple d'action :** Comme vu précédemment, détecter la faille Log4J et proposer un TP d'audit de logs.

---

## 📝 Le Rapport Quotidien Unifié

Plutôt que d'avoir 50 commits éparpillés, les agents envoient leurs suggestions à une **Base de Données (Supabase)** temporaire.

1.  Chaque agent écrit dans la table `veille_suggestions` :
    *   `cours_concerne`: "cours_owasp_web.md"
    *   `niveau`: "BTS"
    *   `suggestion`: "Ajouter CVE-2024-xyz..."
    *   `source_url`: "https://..."

2.  À la fin de l'exécution (ex: 04h00), un dernier workflow **"Rapporteur"** :
    *   Lit toutes les suggestions du jour dans Supabase.
    *   Compile un seul fichier Markdown `VEILLE_DU_JOUR_12_MARS.md`.
    *   Le poste sur GitHub ou vous l'envoie par email/Slack.

## 🚀 Mise en Place Progressive

Ne lancez pas tout d'un coup !
1.  **Semaine 1 :** Configurez uniquement l'**Agent BTS** (c'est là où la veille est la plus critique).
2.  **Semaine 2 :** Ajoutez le "Routeur" pour scanner les fichiers, mais sans activer les autres agents.
3.  **Semaine 3 :** Activez l'**Agent SNT** pour la culture numérique.

---

## 💡 Exemple de Rapport Généré (Multi-Niveaux)

```markdown
# 📅 Rapport de Veille Pédagogique - 12 Mars 2024

## �️ BTS SIO (Cyber)
*   **Cours :** `cours_owasp_web.md`
*   **Alerte :** Nouvelle technique d'injection SQL via JSON découverte.
*   **Action :** Ajouter un encart "SQLi moderne" dans le chapitre 3.

## 📱 Seconde SNT (Réseaux Sociaux)
*   **Cours :** `reseaux_sociaux.md`
*   **Actu :** Le "Digital Services Act" (DSA) impose de nouvelles règles aux plateformes.
*   **Action :** Mettre à jour la section "Loi et Numérique".

## 🐍 Première NSI (Python)
*   *R.A.S. Aucune mise à jour majeure détectée aujourd'hui.*
```
