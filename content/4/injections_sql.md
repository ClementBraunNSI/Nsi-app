---
title: "TP - Sécurité Web : Injections SQL"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
meta: "Durée : 2 heures · Objectif : Comprendre pour mieux protéger"
---

### Contexte
Les injections SQL restent l'une des vulnérabilités les plus critiques du web (Top 10 OWASP). Ce TP vous place dans la peau d'un attaquant éthique pour comprendre les mécanismes, puis dans celle d'un administrateur système pour analyser les traces et sécuriser l'infrastructure.

<ExerciseTabs>
  <ExerciseSection id="part1" label="1. Découverte (25')">
    ## Partie 1 : Découverte de l'injection SQL
    Objectif : Manipuler une base de données via un formulaire web vulnérable.

    ### Exercice 1.1 : Tutoriel interactif (15 min)
    **Se connecter au site d'entraînement :**
    * URL : [https://www.hacksplaining.com/exercises/sql-injection](https://www.hacksplaining.com/exercises/sql-injection)
    * Cliquer sur "Start lesson"
    * Suivre le tutoriel interactif

    **À noter dans le compte rendu :**
    1. **Quel payload est utilisé dans l'exemple ?**
    2. **Quel est l'impact démontré ?**
    3. **Capture d'écran :** Insérer la page finale "Lesson Complete"

    ### Exercice 1.2 : Tester sur un environnement sécurisé
    **Site à utiliser :** [https://portswigger.net/web-security/sql-injection](https://portswigger.net/web-security/sql-injection)

    **Mission :**
    1. Cliquer sur "Access the lab" pour le premier exercice
    2. Lire les instructions (traduction possible avec clic droit)
    3. Essayer de résoudre le premier lab (niveau apprentice)

    **Aide :** L'objectif est de modifier l'URL pour voir tous les produits.

    **À noter dans le compte rendu :**
    1. **Quelle URL a été modifiée ?**
    2. **Combien de produits s'affichent maintenant ?**
    3. **Expliquer le fonctionnement (avec vos mots) :** Pourquoi l'ajout de caractères spéciaux modifie le comportement de la requête SQL ?
  </ExerciseSection>

  <ExerciseSection id="part2" label="2. Analyse Logs (40')">
    ## Partie 2 : Analyse de logs d'attaque
    Objectif : Repérer les traces d'une attaque dans les fichiers journaux du serveur web (Apache/Nginx).

    ### Exercice 2.1 : Identifier des attaques dans des logs (25 min)
    **Voici des extraits de logs Apache (fichier d'accès web) :**

    ```text
    192.168.1.100 - - [18/Jan/2025:10:23:45] "GET /search.php?q=laptop HTTP/1.1" 200 1234
    192.168.1.105 - - [18/Jan/2025:10:24:12] "GET /search.php?q=admin' OR '1'='1 HTTP/1.1" 200 5678
    192.168.1.100 - - [18/Jan/2025:10:25:33] "GET /search.php?q=smartphone HTTP/1.1" 200 890
    192.168.1.105 - - [18/Jan/2025:10:26:01] "GET /search.php?q=' UNION SELECT password FROM users-- HTTP/1.1" 200 3456
    192.168.1.110 - - [18/Jan/2025:10:27:15] "GET /contact.php HTTP/1.1" 200 456
    192.168.1.105 - - [18/Jan/2025:10:28:42] "GET /search.php?q='; DROP TABLE products-- HTTP/1.1" 500 234
    192.168.1.100 - - [18/Jan/2025:10:29:10] "GET /index.php HTTP/1.1" 200 2345
    192.168.1.105 - - [18/Jan/2025:10:30:05] "GET /search.php?q=admin'-- HTTP/1.1" 200 1890
    ```

    **Analyser ces logs :**
    1. **Combien de lignes au total ?**
    2. **Combien de requêtes sont suspectes (tentatives d'injection) ?**
    3. **Comment fonctionnent chacune de ces requêtes ?**
    4. **Quelle est l'adresse IP de l'attaquant ?**
    5. **Compléter le tableau des attaques :**

    | Ligne n° | Payload utilisé | Type d'attaque | Code HTTP |
    | :--- | :--- | :--- | :--- |
    | 2 | `admin' OR '1'='1` | Bypass authentification | 200 |
    | 4 | | | |
    | 6 | | | |
    | 8 | | | |

    **6. Quelle attaque a provoqué une erreur serveur (code 500) ?**
    * Ligne n° :
    * Payload :
    * Pourquoi c'est dangereux ?

    ### Exercice 2.2 : Proposer des actions (15 min)
    **En tant qu'administrateur système, définir les actions à entreprendre et justifier :**
    * [ ] Bloquer l'IP 192.168.1.105
    * [ ] Ne rien faire, c'est normal
    * [ ] Alerter l'équipe de développement
    * [ ] Installer un pare-feu applicatif (WAF)
    * [ ] Supprimer le site web
    * [ ] Analyser tous les logs pour chercher d'autres attaques
    * [ ] Redémarrer le serveur
  </ExerciseSection>

  <ExerciseSection id="part3" label="3. Protection (40')">
    ## Partie 3 : Solutions de protection
    Objectif : Mettre en place des contre-mesures techniques (WAF) et organisationnelles.

    ### Exercice 3.1 : Découvrir ModSecurity (15 min)
    **Rechercher des informations sur ModSecurity :**
    * Documentation : [https://github.com/SpiderLabs/ModSecurity](https://github.com/SpiderLabs/ModSecurity)
    * Ou vidéo YouTube : "ModSecurity Tutorial" (5-10 min)

    **À noter dans le compte rendu :**
    1. **Qu'est ce que ModSecurity? Comment fonctionne-t-il?**
    2. **Que signifie OWASP CRS ?**
    3. **Donner 3 types d'attaques que ModSecurity peut bloquer :**

    ### Exercice 3.2 : Simulation de configuration (15 min)
    **Scénario :** Il faut protéger le site web de l'entreprise.
    **Compléter cette configuration ModSecurity (remplacer les ___), justifier les choix :**

    ```text
    # Configuration ModSecurity

    # Activer le moteur de règles
    SecRuleEngine ___          (Choix : On / Off / DetectionOnly)

    # Bloquer les injections SQL
    SecRule ARGS "@contains ___" \     (Choix : SELECT / DELETE / admin)
        "id:1001,\
        phase:2,\
        block,\
        msg:'Tentative injection SQL détectée'"

    # Niveau de sévérité des logs
    SecAuditLogType ___        (Choix : Serial / Concurrent / None)
    ```

    ### Exercice 3.3 : Défense en profondeur (10 min)
    **Le principe de "défense en profondeur" = plusieurs couches de protection.**
    **Classer ces mesures par ordre (1 = première ligne, 5 = dernière) :**

    | Mesure | Ordre |
    | :--- | :--- |
    | WAF (ModSecurity) | |
    | Code sécurisé (requêtes préparées) | |
    | Pare-feu réseau | |
    | Surveillance des logs (SIEM) | |
    | Politique de mots de passe forts | |

    **Dans le compte rendu :** Schématiser la défense en profondeur : dessiner les couches depuis Internet jusqu'à la base de données.
    `[Internet] → [ ? ] → [ ? ] → [ ? ] → [ ? ] → [Base de données]`

    ### Exercice 3.4 (Bonus) : Automatisation
    **Contexte :** Bloquer manuellement les IP (comme vu dans l'exercice 2.2) est impossible à grande échelle.
    1. Quel outil Linux open-source permet de bannir automatiquement (via iptables) une IP qui génère trop d'erreurs ou de comportements suspects dans les logs ?
    2. Comment s'appelle le mécanisme utilisé par cet outil pour repérer les motifs d'attaque (ex: "UNION SELECT") dans les fichiers logs ?
  </ExerciseSection>

  <ExerciseSection id="part4" label="4. Rapport (15')">
    ## Partie 4 : Mini-rapport (15 min)
    Objectif : Rédiger un rapport professionnel synthétique pour la direction technique.

    ### Exercice 4.1 : Rapport d'incident
    **Contexte :** En tant que technicien SISR, le responsable IT vous demande un rapport suite aux logs suspects identifiés en partie 2.
    **Rédiger un court rapport (1/2 page) avec cette structure :**

    **RAPPORT D'INCIDENT DE SÉCURITÉ**
    * **Date :** _____________
    * **Rédigé par :** _____________

    **1. RÉSUMÉ DE L'INCIDENT** (En 2-3 lignes, que s'est-il passé ?)

    **2. ANALYSE TECHNIQUE**
    * Nombre d'attaques détectées : _______
    * Adresse IP source : _______
    * Type d'attaque : _______
    * Gravité (Faible/Moyenne/Élevée) : _______

    **3. IMPACT POTENTIEL** (Que pourrait-il se passer si ces attaques réussissaient ?)

    **4. RECOMMANDATIONS IMMÉDIATES**

    **5. RECOMMANDATIONS À MOYEN TERME**
  </ExerciseSection>

  <ExerciseSection id="livrables" label="Livrables & Barème">
    ## Livrables à rendre
    **Format :** Fichier PDF unique nommé `NOM_Prenom_TP_B3_SQL.pdf`
    * Réponses Partie 1 (capture tutoriel + questions)
    * Tableau analyse logs complété (Partie 2)
    * Actions proposées justifiées
    * Réponses sur ModSecurity (Partie 3)
    * Configuration ModSecurity complétée
    * Schéma défense en profondeur
    * Rapport d'incident (Partie 4)

    ### Barème (/20)
    | Partie | Points |
    | :--- | :--- |
    | Partie 1 - Découverte injection SQL | /5 |
    | Partie 2 - Analyse de logs | /6 |
    | Partie 3 - Solutions de protection | /6 |
    | Partie 4 - Rapport d'incident | /3 |
    | **TOTAL** | **/20** |

    **Rappels importants :**
    * Ces techniques sont enseignées à des fins défensives uniquement
    * Tester des injections SQL sans autorisation est illégal
  </ExerciseSection>
</ExerciseTabs>