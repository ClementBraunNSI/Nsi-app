# 📊 Analyse des Manques - Cours NSI Première

## 🎬 Animations TSX à intégrer (Disponibles)

Voici la liste des composants interactifs prêts à l'emploi à insérer dans les cours correspondants :

*   **Web & HTTP** :
    *   `HtmlStructureExplorer.tsx` -> `web_html.md` (Exploration du DOM)
    *   `WebPreview.tsx` -> `web_html.md` (Éditeur HTML en direct)
    *   `HttpMethodVisualizer.tsx` -> `web_protocoles.md` (GET vs POST)
    *   `UrlBuilder.tsx` -> `web_protocoles.md` (Structure d'une URL)
    *   `DnsResolver.tsx` -> `reseaux_cours.md` ou `web_protocoles.md` (Résolution de noms)
    *   `HttpsSimulator.tsx` -> `web_protocoles.md` (Chiffrement HTTPS)
    *   `CookieManager.tsx` -> `web_protocoles.md` (Cookies)

*   **Données & Images** :
    *   `PixelManipulator.tsx` -> `donnees_entiers_positifs.md` (Couleurs RVB et hexadécimal)
    *   `ImageCompression.tsx` -> `donnees_types_base.md` ou nouveau cours `donnees_images.md` (Compression)
    *   `CsvDetective.tsx` -> `python_csv.md` (Enquête interactive sur CSV)
    *   `DataProcessor.tsx` -> `python_csv.md` (Manipulation de données)

*   **Algorithmique** :
    *   `AlgorithmRace.tsx` -> `algo_tris.md` (Course de tri à bulles)
    *   `BinaryPixelArt.tsx` -> `donnees_entiers_positifs.md` (Dessin binaire)

*   **Réseaux & IoT** :
    *   `IotSimulator.tsx` -> `archi_von_neumann.md` (Logique capteurs/actionneurs) ou `reseaux_cours.md`
    *   `PacketTracer.tsx` -> `reseaux_cours.md` (Routage de paquets)
    *   `TcpIpLayers.tsx` -> `reseaux_cours.md` (Modèle en couches)
    *   `EncapsulationVisualizer.tsx` -> `reseaux_cours.md` (Encapsulation)

### 🛠️ Animations TSX à développer (Manquantes)

*   [ ] **`VonNeumannArchitecture.tsx`** : Simulation interactive du cycle FDE (Fetch-Decode-Execute) avec visualisation des registres (PC, IR), de la mémoire et des bus.
*   [ ] **`LogicGatesSimulator.tsx`** : Atelier de construction de circuits logiques (AND, OR, NOT, XOR, NAND) avec tables de vérité en temps réel.
*   [ ] **`BinaryConverter.tsx`** : Convertisseur bidirectionnel interactif pour les entiers (non signés, complément à 2) et les flottants (IEEE 754 avec manipulation des bits de signe/exposant/mantisse).
*   [ ] **`LinuxTerminalSimulator.tsx`** : Un terminal simulé sécurisé pour s'exercer aux commandes de base (`ls`, `cd`, `mkdir`, `chmod`, `cat`) avec visualisation de l'arborescence de fichiers.
*   [ ] **`KnnVisualizer.tsx`** : Carte 2D interactive pour l'algorithme des **K Plus Proches Voisins**. L'élève place un point et voit la classification changer selon K.
*   [ ] **`DichotomySearch.tsx`** : Visualisation de la recherche dichotomique dans une liste triée (mise en évidence de l'intervalle de recherche qui se réduit).
*   [ ] **`GreedyChange.tsx`** : Algorithme glouton du rendu de monnaie. L'élève choisit un montant et voit le système choisir les pièces optimales (ou non, selon le système de pièces).

---

**Note importante sur la progression :**
Les cours identifiés ci-dessous comme "Hors Programme" (POO, SQL, Récursivité) sont maintenus intentionnellement. Ils servent d'**ouvertures et de ponts vers la Terminale** pour les élèves les plus rapides ou désireux d'approfondir. Ils ne doivent pas être supprimés mais peuvent être marqués comme "Pour aller plus loin".

---

Ce fichier recense l'état des lieux du contenu pédagogique pour la classe de Première NSI, basé sur le Bulletin Officiel.

> **Légende :**
> - [ ] 🔴 **Manquant** : Point du programme absent.
> - [ ] 🟠 **À améliorer** : Présent mais incomplet ou peu approfondi.
> - [x] 🟢 **Validé** : Contenu conforme et complet.
> - [ ] ⚠️ **Hors Programme** : Contenu de Terminale présent dans le dossier Première.

---

## 1. 📜 Histoire de l'informatique
*Transversal tout au long de l'année, mais nécessite des repères.*

*   [x] 🟢 **Frise chronologique** : Cours créé `histoire_informatique.md` avec frise interactive.
*   [ ] 🟠 **Évolution des architectures** : Mentionné dans Von Neumann, mais pourrait être étoffé.

## 2. 💾 Représentation des données : Types de base
*Entiers, Flottants, Booléens, Caractères.*

*   [x] 🟢 **Entiers positifs (Binaire/Hexa)** : `donnees_entiers_positifs.md`.
*   [x] 🟢 **Entiers relatifs (Complément à 2)** : `donnees_entiers_relatifs.md`.
*   [x] 🟢 **Réels (Flottants)** : `donnees_reels.md`.
*   [x] 🟢 **Booléens** : `donnees_booleens.md`.
*   [x] 🟢 **Caractères (ASCII/Unicode)** : `donnees_caracteres.md`.

## 3. 📦 Représentation des données : Types construits
*Tuples, Tableaux, Dictionnaires.*

*   [x] 🟢 **Tuples et Listes** : `structures_lineaires_cours.md` (Attention au titre trompeur, le contenu est bon).
*   [x] 🟢 **Dictionnaires** : `python_dictionnaires.md`.
*   [ ] ⚠️ **POO (Classes/Objets)** : `poo_introduction.md` est du programme de **Terminale**. À déplacer.

## 4. 🗄️ Traitement de données en tables
*CSV, Tri, Filtrage.*

*   [x] 🟢 **Fichiers CSV** : `python_csv.md`.
*   [x] 🟢 **Tri et Filtrage** : Traité via les exercices CSV.
*   [ ] ⚠️ **SQL** : `bdd_sql_introduction.md` est du programme de **Terminale**. À déplacer.

## 5. 🌐 Interactions Homme-Machine sur le Web
*HTTP, HTML, Événements.*

*   [x] 🟢 **HTML/CSS** : `web_html.md`.
*   [x] 🟢 **Protocole HTTP** : `web_protocoles.md`.
*   [x] 🟢 **Formulaires** : Abordé dans `web_html.md`.
*   [x] 🟢 **JavaScript & Événements** : Cours créé `web_javascript_interactions.md` (DOM, événements, exercice compteur).

## 6. 🖥️ Architectures matérielles et OS
*Von Neumann, Langage Machine, OS, Linux.*

*   [x] 🟢 **Modèle Von Neumann** : `archi_von_neumann.md`.
*   [x] 🟢 **Systèmes d'exploitation** : `os_systemes.md`.
*   [x] 🟢 **Commandes Linux** : `os_linux_commandes.md`.
*   [ ] 🟠 **Langage Machine / Assembleur** : Présent dans Von Neumann mais mériterait un petit TP interactif (simulateur).
*   [x] 🟢 **Circuits logiques** : `archi_circuits.md`.

## 7. 🐍 Langages et Programmation
*Python, Spécifications, Tests.*

*   [x] 🟢 **Constructions élémentaires** : Boucles, Fonctions, Conditionnelles.
*   [x] 🟢 **Spécifications (Docstrings)** : `python_exercices_specifications.md`.
*   [ ] 🟠 **Tests et Assertions** : `assert` est utilisé dans les corrections, mais un cours dédié au "Test défensif" serait un plus.
*   [ ] ⚠️ **Récursivité** : Souvent abordé avec le Tri Fusion (`algo_tris_exercices_fusion.md`), c'est au programme de **Terminale**.

## 8. 🧩 Algorithmique
*Parcours, Tri, Gloutons, KNN, Dichotomie.*

*   [x] 🟢 **Tri Insertion / Sélection** : `algo_tris.md`.
*   [x] 🟢 **KNN** : `algo_knn.md`.
*   [x] 🟢 **Gloutons** : `algo_gloutons.md`.
*   [x] 🟢 **Dichotomie** : `algo_dichotomie.md`.
*   [ ] ⚠️ **Tri Fusion** : `algo_tris_exercices_fusion.md` est du programme de **Terminale** (Récursivité).

## 9. 💡 Projets & Pratique
*   [x] 🟢 **Idées de projets** : Fichier créé `Manuel scolaire/PROJETS_PREMIERE.md` avec 15 idées classées par niveau.

---

## 🛠️ Plan d'action recommandé

1.  **Nettoyage (Déplacer vers Terminale)** :
    *   `poo_*` (Programmation Orientée Objet).
    *   `bdd_*` (SQL).
    *   `algo_tris_exercices_fusion.md` (Tri fusion).
    
2.  **Création de contenus manquants** :
    *   **JavaScript (Interactions)** : Créer `web_javascript_interactions.md` (DOM, événements).
    *   **Histoire** : Créer `histoire_informatique.md` avec une frise chronologique.

3.  **Renommage / Clarification** :
    *   Renommer `structures_lineaires_cours.md` en `python_listes_tuples.md` pour éviter la confusion avec les structures de données abstraites de Terminale.
