---
title: 'Sécurité Web : OWASP, SQLi & XSS'
description: >-
  Cours complet sur le Top 10 OWASP, avec un focus technique sur les injections
  SQL et XSS (Préparation E5/E6).
level: BTS SIO
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: bts_owasp_web
icon: "shield"
prerequisites:
  - premiers_pas_python
audience: public
---

# Sécurité des applications web : OWASP

<ExerciseTabs courseId="bts_owasp_web" courseTitle="Badge Sécurité Web">

  <ExerciseSection id="owasp_top10" label="1. OWASP Top 10" type="autre">
    ## Le Top 10 OWASP, édition 2021

    L'**OWASP** (*Open Web Application Security Project*) publie un classement des familles de failles les plus graves dans les applications web. L'édition 2021 s'appuie sur l'analyse de plus de 500 000 applications. Ce classement indique les failles les plus souvent exploitées dans les applications réelles, et ce qu'elles ont déjà coûté. Chaque entrée ci-dessous présente le mécanisme de la faille, un cas réel et les mesures qui auraient permis de l'éviter.

    ### A01:2021, Contrôle d'accès défaillant

    Le contrôle d'accès est défaillant quand le serveur ne vérifie pas les droits de l'utilisateur et se contente de cacher un bouton. L'attaquant peut alors changer un identifiant ou rejouer une requête pour agir comme un administrateur ou lire les données de quelqu'un d'autre. On appelle **IDOR** le cas précis où l'objet est désigné par un identifiant que l'on peut deviner : `/facture/123` devient `/facture/124`, et la facture d'un autre client s'affiche.

    En 2018, une faille dans la fonction « Voir en tant que » de Facebook a permis de voler les jetons d'accès d'environ **50 millions de comptes**. L'entreprise a risqué une amende RGPD de l'ordre de **1,6 milliard de dollars**, soit 4 % de son chiffre d'affaires mondial. L'action a perdu 3 % dès l'annonce.

    Il ne faut pas faire confiance à l'identifiant reçu dans l'URL. À chaque lecture, le serveur doit vérifier que l'utilisateur authentifié a des droits sur cette ressource, et refuser l'accès si `user.id` ne correspond pas au propriétaire. Il faut aussi bloquer l'accès direct aux fichiers qui n'ont rien à faire en ligne, comme le dossier `.git`, les sauvegardes ou les exports de base de données.

    **Questions**
    1. Si je change `id=123` par `id=124` dans l'URL et que j'accède à la facture d'un autre client, comment s'appelle cette vulnérabilité spécifique ?
    2. Quelle est la différence entre l'**authentification** (qui je suis) et l'**autorisation** (ce que j'ai le droit de faire) ?
    3. Pourquoi cacher un bouton « Admin » dans l'interface (CSS `display: none`) n'est-il pas une mesure de sécurité suffisante ?

    ### A02:2021, Défaillances cryptographiques

    Les données sensibles (mots de passe, cartes bancaires, données de santé) sont mal protégées, que ce soit lors de leur stockage ou de leur transport. C'est le cas quand un site utilise HTTP au lieu de HTTPS, quand l'algorithme est trop faible, ou quand un mot de passe a été chiffré au lieu d'être haché, ce qui permet de le retrouver en clair.

    En 2013, environ **153 millions** de comptes Adobe ont été compromis : les mots de passe étaient chiffrés, donc réversibles, et non hachés. Adobe a payé **1,1 million de dollars** de frais juridiques, plus un règlement dont le montant n'a pas été publié, sans compter l'atteinte à la réputation.

    Les mots de passe doivent être stockés avec un algorithme de hachage lent et salé, comme Argon2 ou bcrypt. Tous les échanges doivent passer par HTTPS, donc par TLS, et il ne faut pas stocker de numéro de carte si l'on peut s'en passer.

    **Questions**
    1. Pourquoi l'algorithme de hachage MD5 est-il considéré comme obsolète pour stocker des mots de passe ?
    2. Quel protocole sécurisé (port 443) doit remplacer HTTP ?
    3. Qu'est-ce que le sel (*salt*), et pourquoi est-il indispensable quand on hache un mot de passe ?

    ### A03:2021, Injection

    Une donnée fournie par l'utilisateur est insérée directement dans une commande SQL, système ou LDAP. L'interpréteur ne distingue alors plus la donnée du code, et ce qui devait être une simple valeur devient une instruction.

    En 2015, une injection SQL sur une page obsolète de TalkTalk a exposé les données d'environ **157 000 clients**. L'opérateur a perdu **101 000 clients**, payé une amende de **400 000 livres**, record à l'époque, et le coût total de la remédiation a été estimé à **77 millions de livres**.

    En SQL, la protection efficace est la **requête préparée** : la commande est fixée, et les valeurs sont transmises séparément. Les entrées doivent être validées à partir d'une liste de ce qui est autorisé, plutôt que d'une liste de ce qui est interdit. Un ORM (Entity Framework, Hibernate, Eloquent) protège aussi contre les injections, à condition de l'utiliser normalement, et non en lui passant une requête déjà construite par concaténation.

    **Questions**
    1. Dans l'expression `' OR '1'='1`, quel est le rôle des guillemets simples ?
    2. Quelle instruction SQL permet souvent de combiner les résultats de deux tables lors d'une injection ?
    3. Pourquoi la validation côté client, en JavaScript, ne protège-t-elle pas contre les injections SQL ?

    ### A04:2021, Conception non sécurisée

    La faille se situe dans les règles métier, avant même l'écriture du code. Une conception fragile ne devient pas sûre parce qu'elle est bien programmée : le code ne peut pas corriger une conception qui est déjà mauvaise.

    En 2021, des données de Parler ont été aspirées en masse, de l'ordre de **99 %** du contenu, parce que les publications portaient des identifiants séquentiels, sans contrôle d'accès. Le service a fermé pendant plusieurs semaines, les investisseurs ont perdu confiance, et Apple et Google ont retiré l'application de leurs boutiques.

    La sécurité doit être pensée dès l'expression du besoin, et non au moment de la recette. Il faut modéliser les menaces avant de coder, et éviter les identifiants que l'on peut deviner en ajoutant un : contrairement à une suite d'entiers, un UUID ne peut pas être parcouru.

    **Questions**
    1. Quel est le principe de la défense en profondeur ?
    2. Donner un exemple de fonctionnalité commode pour l'utilisateur et dangereuse par conception (la récupération de compte, par exemple).
    3. Qu'est-ce que le *rate limiting*, et quelle attaque de conception atténue-t-il ?

    ### A05:2021, Mauvaise configuration

    Le système est resté tel qu'il a été installé, avec par exemple un compte d'administration par défaut, un espace de stockage cloud accessible à tous, ou des messages d'erreur qui affichent la pile d'appels, les chemins des fichiers et les versions des logiciels.

    En 2021, une erreur de configuration a exposé environ **125 Go** de données Twitch, dont le code source et les revenus des streamers. Le préjudice pour la propriété intellectuelle est difficile à chiffrer, et la publication des revenus a en plus créé des tensions dans la communauté.

    Il faut désactiver les comptes et les services inutiles, et ajouter les en-têtes HTTP qui limitent ce que le navigateur accepte de faire, comme HSTS ou `X-Frame-Options`. En production, l'utilisateur ne doit voir qu'un message court, et les détails techniques doivent rester dans le journal, et non dans la page.

    **Questions**
    1. Pourquoi changer les mots de passe par défaut des routeurs et des serveurs ?
    2. Quelle est la règle sur les messages d'erreur montrés à l'utilisateur ?
    3. Citer une pratique simple pour protéger l'accès à un dossier d'administration.

    ### A06:2021, Composants vulnérables ou obsolètes

    L'application utilise une bibliothèque dont la faille est déjà connue publiquement, sous la forme d'une CVE. Le correctif existe, mais il n'a pas été appliqué.

    En 2017, Equifax a exposé les données d'environ **147 millions** de personnes à cause d'une faille d'Apache Struts, corrigée deux mois avant l'attaque, et non installée. Le règlement des poursuites a été accepté jusqu'à **700 millions de dollars**.

    Il faut tenir l'inventaire des composants utilisés (c'est l'analyse de composition logicielle), automatiser la détection des failles avec des outils comme `npm audit` ou OWASP Dependency-Check, et faire les mises à jour. Une dépendance que l'on ne connaît pas ne pourra pas être corrigée.

    **Questions**
    1. Qu'est-ce qu'une CVE (*Common Vulnerabilities and Exposures*) ?
    2. Pourquoi maintenir le système et les logiciels à jour ?
    3. Quel fichier liste souvent les dépendances d'un projet web, en PHP ou en JavaScript ?

    ### A07:2021, Identification et authentification défaillantes

    L'identité des utilisateurs est mal vérifiée, par exemple à cause de mots de passe trop courts, de l'absence de second facteur ou de sessions qui n'expirent jamais. Le site peut aussi accepter un mot de passe déjà volé sur un autre site.

    En 2020, environ **300 000 comptes** Nintendo ont été repris par *credential stuffing* : des couples identifiant / mot de passe volés sur d'autres sites, rejoués ici, parce que les gens réutilisent le même secret. Le coût a été le remboursement des achats frauduleux sur l'eShop, et le support pour rendre les comptes à la main.

    Il faut ajouter un second facteur d'authentification, refuser les mots de passe trop faibles ou déjà compromis, à commencer par les plus courants, et limiter le nombre de tentatives de connexion.

    **Questions**
    1. Qu'est-ce que le *credential stuffing* ?
    2. Pourquoi limiter le nombre de tentatives de connexion, par exemple à cinq ?
    3. Quel mécanisme, souvent sur le téléphone, ajoute une preuve au-delà du mot de passe ?

    ### A08:2021, Intégrité du logiciel et des données

    Une mise à jour, un paquet ou un objet désérialisé est exécuté sans vérification de son origine. La chaîne qui construit le logiciel peut alors servir de point d'entrée à l'attaquant.

    En 2020, une mise à jour officielle de SolarWinds, déjà corrompue, a atteint environ **18 000 clients**, dont des administrations américaines et Microsoft. Le coût global de remédiation pour les entreprises et les États a été estimé à plus de **100 milliards de dollars**.

    Il faut signer le code et les fichiers produits, et vérifier l'intégrité de ce que l'on télécharge grâce à une empreinte ou à une signature. La chaîne d'intégration continue doit être protégée comme l'environnement de production, car un attaquant qui y accède n'a plus besoin d'attaquer l'application elle-même.

    **Questions**
    1. Pourquoi vérifier la signature (GPG, par exemple) d'un logiciel avant de l'installer ?
    2. Dans une attaque de la chaîne d'approvisionnement, qui est visé en premier ?
    3. Qu'est-ce que la désérialisation d'un objet ?

    ### A09:2021, Journalisation et surveillance insuffisantes

    Une intrusion a lieu sans que personne ne la remarque, soit parce qu'aucun journal n'enregistre les événements utiles, soit parce que les journaux existent mais ne sont jamais consultés.

    Entre 2014 et 2018, des attaquants ont accédé aux données d'environ **500 millions** de clients Marriott pendant quatre ans sans être détectés. L'ICO britannique a infligé une amende de **18,4 millions de livres**. Des frais de procédure de plusieurs dizaines de millions s'y sont ajoutés.

    Il faut centraliser les journaux sur une machine distincte de celle que l'on surveille, pour qu'un attaquant qui efface les traces locales ne puisse pas toutes les supprimer. Ces journaux doivent enregistrer les échecs de connexion, les accès d'administration et les changements de droits, et déclencher une alerte dès qu'un comportement inhabituel apparaît.

    **Questions**
    1. Quels sont les quatre éléments qu'un journal utile doit porter (qui, et ensuite) ?
    2. Pourquoi envoyer les journaux vers un serveur distinct plutôt que de les laisser seulement sur la machine ?
    3. Quel est le risque principal si une intrusion n'est pas détectée vite ?

    ### A10:2021, Falsification de requête côté serveur (SSRF)

    L'application accepte une URL, et c'est le **serveur** qui va chercher la ressource correspondante. L'attaquant lui fournit alors une adresse interne, inaccessible depuis l'extérieur, comme un service d'administration, les métadonnées d'un service cloud ou un port qui n'écoute que sur localhost.

    En 2019, une SSRF chez Capital One a permis d'emporter les données d'environ **100 millions** de clients stockées sur AWS S3. L'amende a été de **80 millions de dollars**, et les frais de remédiation et de notification d'environ **150 millions**.

    Toute URL fournie par l'utilisateur doit être validée, en n'autorisant que les domaines prévus dans une liste blanche. Il faut aussi désactiver les redirections dans le composant qui fait la requête, pour qu'une adresse autorisée ne renvoie pas ensuite vers une adresse interne.

    **Questions**
    1. Dans une SSRF, qui envoie la requête : le navigateur du client, ou le serveur web ?
    2. Citer une ressource interne qu'un attaquant viserait ainsi, dans un cloud par exemple.
    3. Comment une liste blanche d'URL limite-t-elle cette faille ?
  </ExerciseSection>

  <ExerciseSection id="tech_focus" label="2. Focus Technique (E5)" type="autre">
    ## Injections SQL, XSS, CSRF

    Trois failles reviennent souvent dans les sujets, car elles se repèrent facilement dans une ligne de code et dans un journal. Il faut savoir les reconnaître, mesurer leurs conséquences et les corriger.

    ### Injection SQL

    Elle apparaît quand une saisie est concaténée dans la requête : au lieu de remplir un champ, l'attaquant réécrit la commande.

    ```php
    $id = $_GET['id'];
    // L'utilisateur entre : 1 OR 1=1
    $query = "SELECT * FROM users WHERE id = " . $id;
    // Résultat : SELECT * FROM users WHERE id = 1 OR 1=1
    // La condition 1=1 est toujours vraie -> Toute la table est retournée.
    ```

    `1 OR 1=1` n'est plus une valeur d'`id`, mais une condition toujours vraie, ajoutée à la suite du `WHERE` : la requête renvoie toute la table.

    Dans les journaux, on cherche les paramètres qui ne ressemblent pas à une saisie : guillemets, `--`, `#`, `;`, et les mots `UNION`, `SELECT`, `DROP`, `OR 1=1`, `SLEEP()`. Une réponse HTTP 500 qui affiche une erreur SQL confirme que le serveur a tenté d'exécuter une requête modifiée. Une ligne comme `GET /products.php?category=Gifts'--` suffit à ouvrir une investigation.

    La protection consiste à utiliser une requête préparée : la requête SQL est fixée, et la valeur, transmise à part, ne peut plus la modifier.

    ```php
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_GET['id']]);
    ```

    **Questions**
    1. Écrire un payload SQL permettant de contourner une authentification (`WHERE user='...' AND pass='...'`).
    2. Expliquer pourquoi `htmlspecialchars()` ne protège pas contre les injections SQL.
    3. Dans une requête `UNION SELECT`, quelle contrainte porte sur les colonnes ?

    ### Cross-site scripting (XSS)

    Une XSS injecte du JavaScript dans une page lue par d'autres personnes. Le navigateur de la victime exécute ce script comme s'il venait du site.

    La XSS **réfléchie** est placée dans l'URL : le serveur renvoie le script dans la page de réponse, où il s'exécute immédiatement, à condition que la victime ait cliqué sur le lien. La XSS **stockée** est enregistrée sur le site, par exemple dans un commentaire, et s'exécute à chaque affichage de la page, sans qu'un lien soit nécessaire.

    Ce script peut lire le cookie de session (`document.cookie`, par exemple `PHPSESSID`) et l'envoyer à l'attaquant, qui vole ainsi la session. Il peut aussi rediriger la victime vers une page d'hameçonnage, ou faire agir son navigateur déjà connecté, par exemple pour changer un mot de passe ou publier un message.

    La protection consiste à **échapper** les données à l'affichage : `<` devient `&lt;`, et le navigateur affiche le texte au lieu de l'exécuter. Une **Content-Security-Policy** indique aussi au navigateur de quelles origines les scripts ont le droit de provenir, si bien qu'un script injecté dans la page n'est pas exécuté s'il ne vient pas d'une origine autorisée.

    **Questions**
    1. Quelle fonction PHP native protège efficacement contre la XSS au moment de l'affichage ?
    2. Écrire un court script JavaScript qui affiche le cookie de l'utilisateur dans une alerte.
    3. Quelle différence de persistance y a-t-il entre une XSS stockée et une XSS réfléchie ?

    ### Cross-site request forgery (CSRF)

    Le CSRF force le navigateur d'une personne **déjà connectée** à envoyer une requête que le site acceptera, parce qu'il reconnaît la session. L'attaquant n'a pas besoin du mot de passe : il lui suffit que la session de la victime soit encore ouverte.

    La personne est connectée à `ma-banque.com`. Elle ouvre `site-piege.com`, qui contient une image de taille nulle :

    ```html
    <img src="http://ma-banque.com/virement?to=hacker&amount=1000" width="0" height="0" />
    ```

    Pour charger l'image, le navigateur envoie la requête de virement, accompagnée du cookie de session. Si la banque ne vérifie pas l'origine de la requête, elle l'exécute. Le même principe permet de changer un mot de passe, de passer une commande ou de remplacer l'adresse de récupération d'un compte.

    Un `GET` qui modifie des données rend l'attaque très facile, puisqu'une simple image ou un lien suffisent. Une action sensible doit donc se faire en `POST`, mais cela ne suffit pas.

    Le serveur émet un **jeton** aléatoire, lié à la session ou au formulaire, et le place dans un champ caché. À l'envoi du formulaire, il vérifie que le jeton reçu est bien celui qu'il attend. Le site piège peut toujours déclencher la requête, mais comme il ne peut pas lire le jeton d'un autre site, il ne peut pas le renvoyer.

    ```html
    <form action="/virement" method="POST">
        <input type="hidden" name="csrf_token" value="aF87d...3jK9" />
        ...
    </form>
    ```

    **Questions**
    1. Pour qu'un CSRF fonctionne, dans quel état l'utilisateur doit-il être sur le site visé ?
    2. Pourquoi un `GET` sur une action sensible (suppression, virement) facilite-t-il le CSRF ?
    3. Comment le jeton anti-CSRF empêche-t-il l'attaque ?
  </ExerciseSection>

  <ExerciseSection id="risk_analysis" label="3. Analyse Risques (E6)" type="autre">
    ## Impact et obligations légales

    En situation professionnelle, il ne suffit pas de nommer la faille. Il faut aussi évaluer ce qu'elle coûte à l'activité, et connaître les obligations qui s'appliquent quand des données ont été volées.

    On reprend pour cela la triade **DIC** (disponibilité, intégrité, confidentialité), appelée CIA dans les textes en anglais. Une injection SQL et une XSS n'ont pas le même impact sur chacun de ces critères.

    | Critère | Impact d'une injection SQL | Impact d'une XSS |
    | :--- | :--- | :--- |
    | **Confidentialité** | **Critique** : vol de la base (clients, mots de passe). | **Élevé** : vol de cookies de session, données affichées à l'écran. |
    | **Intégrité** | **Critique** : prix modifiés, tables supprimées (`DROP`), compte administrateur ajouté. | **Moyen** : page défigurée, fausses informations affichées. |
    | **Disponibilité** | **Élevé** : données vitales supprimées, requêtes assez lourdes pour saturer le service. | **Faible** : le serveur tient en général ; le navigateur du client peut être bloqué. |

    L'injection SQL touche les trois critères, car elle agit directement sur la base de données. La XSS touche d'abord le navigateur de la personne qui consulte la page. Elle devient grave quand ce navigateur est celui d'un administrateur, ou quand le cookie volé donne accès au compte.

    **Scénario.** Une injection SQL a exfiltré la base clients (noms, adresses, mots de passe déjà hachés) et le dump est sur un forum. Les articles 33 et 34 du RGPD s'appliquent. Il faut notifier la CNIL dans un délai de **72 heures** au plus, car les droits des personnes sont en jeu. Les personnes concernées doivent aussi être prévenues si le risque est élevé pour elles, ce qui est souvent le cas quand les mots de passe sont hachés avec un algorithme faible ou réutilisés ailleurs. La violation doit enfin être inscrite au registre. Le hachage ne dispense pas de la notification : il modifie l'analyse du risque, mais ne le supprime pas.

    ### Exercice 1 : Alerte au DSI

    Rédiger le message technique au directeur des systèmes d'information après la découverte d'une XSS stockée dans les commentaires d'un site de vente.

    - **Objet :** Alerte sécurité critique, faille XSS, module commentaires
    - **Description :** un script malveillant persistant a été détecté
    - **Impact :** vol de session possible pour les visiteurs, clients et administrateurs
    - **Tout de suite :** désactiver le module de commentaires, purger les entrées suspectes

    ### Exercice 2 : Un score qui dépend du contexte

    Une injection SQL est découverte sur le site vitrine de la boulangerie du quartier. Le site montre des photos de pains et les horaires. Il n'a ni compte client, ni espace membre, ni donnée personnelle. La base ne contient que les tables `produits` et `horaires`.

    Discuter le score CVSS de cette faille à partir de ce contexte : la même injection, sur une base clients, n'a pas le même impact.

    ### Exercice 3 : Lire un journal

    Voici un extrait de journal Apache. Pour chaque ligne, dire s'il s'agit d'une tentative d'attaque et, si oui, laquelle.

    1. `192.168.1.15 - - [12/Mar/2024:10:00:00] "GET /login.php?user=admin'-- HTTP/1.1" 200 1542`
    2. `192.168.1.15 - - [12/Mar/2024:10:01:00] "GET /search.php?q=<script>alert(1)</script> HTTP/1.1" 200 542`
    3. `192.168.1.15 - - [12/Mar/2024:10:02:00] "GET /admin/config.xml HTTP/1.1" 403 202`
    4. `192.168.1.15 - - [12/Mar/2024:10:03:00] "POST /upload.php HTTP/1.1" 200 1542` (le fichier envoyé s'appelle `shell.php`)

    ### Exercice 4 : Une politique de mots de passe

    Règles actuelles d'une PME : 6 caractères minimum, aucune règle de composition, renouvellement obligatoire tous les 30 jours, aucun blocage après des échecs.

    Relever trois faiblesses critiques, et proposer une version corrigée, conforme aux recommandations de l'ANSSI.
  </ExerciseSection>

</ExerciseTabs>
