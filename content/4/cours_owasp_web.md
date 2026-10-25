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

    L'**OWASP** (*Open Web Application Security Project*) publie un classement des familles de failles les plus graves dans les applications web. L'édition 2021 s'appuie sur l'analyse de plus de 500 000 applications. Ce n'est pas une liste de bugs à copier. C'est l'ordre dans lequel une application réelle se fait prendre, et ce que cela a déjà coûté. Chaque entrée ci-dessous dit le mécanisme, un cas, et ce qui aurait fermé la porte.

    ### A01:2021, Contrôle d'accès défaillant

    Le contrôle d'accès casse quand le serveur ne vérifie pas le droit, et se contente de cacher un bouton. L'attaquant change un identifiant, rejoue une requête, et agit comme un administrateur ou lit les données de quelqu'un d'autre. On appelle **IDOR** le cas précis où l'objet est désigné par un identifiant que l'on peut deviner : `/facture/123` devient `/facture/124`, et la facture d'un autre client s'affiche.

    En 2018, une faille dans la fonction « Voir en tant que » de Facebook a permis de voler les jetons d'accès d'environ **50 millions de comptes**. L'entreprise a risqué une amende RGPD de l'ordre de **1,6 milliard de dollars**, soit 4 % de son chiffre d'affaires mondial. L'action a perdu 3 % dès l'annonce.

    On ne fait pas confiance à l'identifiant qui arrive dans l'URL. À chaque lecture, le serveur vérifie que l'utilisateur authentifié a le droit sur cette ressource : si `user.id` n'est pas le propriétaire, on refuse. On coupe aussi l'accès direct aux fichiers qui n'ont rien à faire en ligne, `.git`, sauvegardes, dumps.

    **Questions**
    1. Si je change `id=123` par `id=124` dans l'URL et que j'accède à la facture d'un autre client, comment s'appelle cette vulnérabilité spécifique ?
    2. Quelle est la différence entre l'**authentification** (qui je suis) et l'**autorisation** (ce que j'ai le droit de faire) ?
    3. Pourquoi cacher un bouton « Admin » dans l'interface (CSS `display: none`) n'est-il pas une mesure de sécurité suffisante ?

    ### A02:2021, Défaillances cryptographiques

    Les données sensibles (mots de passe, cartes, santé) sont mal protégées au repos ou pendant le transport. HTTP au lieu de HTTPS. Un algorithme trop faible. Un mot de passe qu'on peut revenir en clair parce qu'on l'a chiffré au lieu de le hacher.

    En 2013, environ **153 millions** de comptes Adobe ont été compromis : les mots de passe étaient chiffrés, donc réversibles, et non hachés. Adobe a payé **1,1 million de dollars** de frais juridiques, plus un règlement dont le montant n'a pas été publié, sans compter l'atteinte à la réputation.

    Les mots de passe se stockent avec un hachage lent et salé : Argon2 ou bcrypt. Tout échange passe en HTTPS, donc TLS. On ne stocke pas un numéro de carte si l'on peut s'en passer.

    **Questions**
    1. Pourquoi l'algorithme de hachage MD5 est-il considéré comme obsolète pour stocker des mots de passe ?
    2. Quel protocole sécurisé (port 443) doit remplacer HTTP ?
    3. Qu'est-ce que le sel (*salt*), et pourquoi est-il indispensable quand on hache un mot de passe ?

    ### A03:2021, Injection

    Une donnée venue de l'utilisateur est recollée dans une commande, SQL, système ou LDAP. L'interpréteur ne distingue plus la donnée du code. Ce qui devait être une valeur devient une instruction.

    En 2015, une injection SQL sur une page obsolète de TalkTalk a exposé les données d'environ **157 000 clients**. L'opérateur a perdu **101 000 clients**, payé une amende de **400 000 livres**, record à l'époque, et le coût total de la remédiation a été estimé à **77 millions de livres**.

    En SQL, la défense qui tient est la **requête préparée** : la commande est fixée, les valeurs voyagent à part. On valide les entrées par une liste de ce qui est autorisé, pas par une liste de ce qu'on espère interdire. Un ORM (Entity Framework, Hibernate, Eloquent) fait cet échappement s'il est utilisé pour ce qu'il sait faire, pas si on lui passe une requête déjà concaténée.

    **Questions**
    1. Dans l'expression `' OR '1'='1`, quel est le rôle des guillemets simples ?
    2. Quelle instruction SQL permet souvent de combiner les résultats de deux tables lors d'une injection ?
    3. Pourquoi la validation côté client, en JavaScript, ne protège-t-elle pas contre les injections SQL ?

    ### A04:2021, Conception non sécurisée

    La faille est dans les règles métier, avant la première ligne. Une conception fragile ne devient pas sûre parce qu'on l'a bien codée. Le principe souvent cité : on ne sécurise pas par le code une conception qui est déjà fausse.

    En 2021, des données de Parler ont été aspirées en masse, de l'ordre de **99 %** du contenu, parce que les publications portaient des identifiants séquentiels, sans contrôle d'accès. Le service a fermé plusieurs semaines, la confiance des investisseurs a disparu, les boutiques Apple et Google ont retiré l'application.

    On pense la sécurité au moment du besoin, pas à la recette. On modélise les menaces avant de coder. On évite les identifiants qu'on devine en ajoutant un : un UUID ne se parcourt pas comme une suite d'entiers.

    **Questions**
    1. Quel est le principe de la défense en profondeur ?
    2. Donnez un exemple de fonctionnalité commode pour l'utilisateur et dangereuse par conception (la récupération de compte, par exemple).
    3. Qu'est-ce que le *rate limiting*, et quelle attaque de conception atténue-t-il ?

    ### A05:2021, Mauvaise configuration

    Le système est resté tel que l'installeur l'a livré. Compte d'administration par défaut. Stockage cloud ouvert au monde. Message d'erreur qui imprime la pile d'appels, les chemins, la version.

    En 2021, une erreur de configuration a exposé environ **125 Go** de données Twitch, dont le code source et les revenus des streamers. Le préjudice sur la propriété intellectuelle est difficile à chiffrer. Rendre les revenus publics a, en plus, tendu la communauté.

    On désactive comptes et services inutiles. On pose les en-têtes qui limitent ce que le navigateur accepte de faire : HSTS, `X-Frame-Options`. En production, l'utilisateur voit un message court. La trace technique reste dans le journal, pas dans la page.

    **Questions**
    1. Pourquoi changer les mots de passe par défaut des routeurs et des serveurs ?
    2. Quelle est la règle sur les messages d'erreur montrés à l'utilisateur ?
    3. Citez une pratique simple pour protéger l'accès à un dossier d'administration.

    ### A06:2021, Composants vulnérables ou obsolètes

    L'application embarque une bibliothèque dont la faille est déjà publique, un CVE. Le correctif existe. Il n'est pas appliqué.

    En 2017, Equifax a exposé les données d'environ **147 millions** de personnes à cause d'une faille d'Apache Struts, corrigée deux mois avant l'attaque, et non installée. Le règlement des poursuites a été accepté jusqu'à **700 millions de dollars**.

    On tient l'inventaire de ce qu'on embarque, c'est l'analyse de composition logicielle. On automatise la détection : `npm audit`, OWASP Dependency-Check. On met à jour. Une dépendance qu'on ne sait pas nommer est une dépendance qu'on ne saura pas corriger.

    **Questions**
    1. Qu'est-ce qu'une CVE (*Common Vulnerabilities and Exposures*) ?
    2. Pourquoi maintenir le système et les logiciels à jour ?
    3. Quel fichier liste souvent les dépendances d'un projet web, en PHP ou en JavaScript ?

    ### A07:2021, Identification et authentification défaillantes

    L'identité est mal vérifiée. Mots de passe trop courts. Pas de second facteur. Session qui ne meurt pas. Ou l'inverse : on accepte un mot de passe déjà volé ailleurs.

    En 2020, environ **300 000 comptes** Nintendo ont été repris par *credential stuffing* : des couples identifiant / mot de passe volés sur d'autres sites, rejoués ici, parce que les gens réutilisent le même secret. Le coût a été le remboursement des achats frauduleux sur l'eShop, et le support pour rendre les comptes à la main.

    On ajoute un second facteur. On refuse les mots de passe trop faibles ou déjà compromis, à commencer par les listes des plus courants. On limite les essais de connexion.

    **Questions**
    1. Qu'est-ce que le *credential stuffing* ?
    2. Pourquoi limiter le nombre de tentatives de connexion, par exemple à cinq ?
    3. Quel mécanisme, souvent sur le téléphone, ajoute une preuve au-delà du mot de passe ?

    ### A08:2021, Intégrité du logiciel et des données

    On exécute une mise à jour, un paquet, un objet désérialisé, sans avoir vérifié qu'il est bien celui qu'on croit. Le pipeline qui construit le logiciel peut être le point d'entrée.

    En 2020, une mise à jour officielle de SolarWinds, déjà corrompue, a atteint environ **18 000 clients**, dont des administrations américaines et Microsoft. Le coût global de remédiation pour les entreprises et les États a été estimé à plus de **100 milliards de dollars**.

    On signe le code et les artefacts. On vérifie l'intégrité de ce qu'on télécharge, par une empreinte ou une signature. On protège la chaîne d'intégration continue comme on protège la production : un attaquant qui y entre n'a plus besoin de forcer l'application.

    **Questions**
    1. Pourquoi vérifier la signature (GPG, par exemple) d'un logiciel avant de l'installer ?
    2. Dans une attaque de la chaîne d'approvisionnement, qui est visé en premier ?
    3. Qu'est-ce que la désérialisation d'un objet ?

    ### A09:2021, Journalisation et surveillance insuffisantes

    L'intrusion a eu lieu. Personne ne l'a vue, parce qu'aucun journal ne garde les événements utiles, ou parce que les journaux existent et ne sont jamais lus.

    Entre 2014 et 2018, des attaquants ont accédé aux données d'environ **500 millions** de clients Marriott pendant quatre ans sans être détectés. L'ICO britannique a infligé une amende de **18,4 millions de livres**. Les frais de procédure se sont ajoutés, en dizaines de millions.

    On centralise les journaux sur une machine qui n'est pas celle qu'on surveille : un attaquant qui efface les traces locales ne les efface pas toutes. On y écrit les échecs de connexion, les accès d'administration, les changements de droits. On alerte quand le motif sort de l'ordinaire, pas seulement quand on y repense le lundi.

    **Questions**
    1. Quels sont les quatre éléments qu'un journal utile doit porter (qui, et ensuite) ?
    2. Pourquoi envoyer les journaux vers un serveur distinct plutôt que de les laisser seulement sur la machine ?
    3. Quel est le risque principal si une intrusion n'est pas détectée vite ?

    ### A10:2021, Falsification de requête côté serveur (SSRF)

    L'application accepte une URL, et c'est le **serveur** qui va la chercher. L'attaquant lui donne une adresse interne, que lui ne peut pas joindre depuis l'extérieur : un service d'administration, les métadonnées d'un cloud, un port qui n'écoute que sur localhost.

    En 2019, une SSRF chez Capital One a permis d'emporter les données d'environ **100 millions** de clients stockées sur AWS S3. L'amende a été de **80 millions de dollars**, et les frais de remédiation et de notification d'environ **150 millions**.

    Toute URL fournie par l'utilisateur se valide. On n'autorise que des domaines prévus, une liste blanche. On coupe les redirections sur le composant qui fait la requête, pour qu'une adresse autorisée ne renvoie pas ensuite vers une adresse interne.

    **Questions**
    1. Dans une SSRF, qui envoie la requête : le navigateur du client, ou le serveur web ?
    2. Citez une ressource interne qu'un attaquant viserait ainsi, dans un cloud par exemple.
    3. Comment une liste blanche d'URL limite-t-elle cette faille ?
  </ExerciseSection>

  <ExerciseSection id="tech_focus" label="2. Focus Technique (E5)" type="autre">
    ## Injections SQL, XSS, CSRF

    Trois failles reviennent dans les sujets, parce qu'on peut les voir dans une ligne de code et dans un journal. On les reconnaît, on mesure ce qu'elles permettent, on les ferme.

    ### Injection SQL

    Elle apparaît quand une saisie est concaténée dans la requête. L'attaquant ne remplit plus un champ. Il réécrit la commande.

    ```php
    $id = $_GET['id'];
    // L'utilisateur entre : 1 OR 1=1
    $query = "SELECT * FROM users WHERE id = " . $id;
    // Résultat : SELECT * FROM users WHERE id = 1 OR 1=1
    // La condition 1=1 est toujours vraie -> Toute la table est retournée.
    ```

    `1 OR 1=1` n'est plus une valeur d'`id`. C'est une condition toujours vraie, collée à la suite du `WHERE`. La requête renvoie la table.

    Dans les journaux, on cherche les paramètres qui ne ressemblent pas à une saisie : guillemets, `--`, `#`, `;`, et les mots `UNION`, `SELECT`, `DROP`, `OR 1=1`, `SLEEP()`. Une réponse HTTP 500 qui affiche une erreur SQL confirme que le serveur a exécuté quelque chose qu'il n'a pas compris jusqu'au bout. Une ligne comme `GET /products.php?category=Gifts'--` suffit à ouvrir une investigation.

    La parade est la requête préparée. La phrase SQL est fixée. La valeur arrive à part, et ne peut plus changer la phrase.

    ```php
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = :id');
    $stmt->execute(['id' => $_GET['id']]);
    ```

    **Questions**
    1. Écrivez un payload SQL permettant de contourner une authentification (`WHERE user='...' AND pass='...'`).
    2. Expliquez pourquoi `htmlspecialchars()` ne protège pas contre les injections SQL.
    3. Dans une requête `UNION SELECT`, quelle contrainte porte sur les colonnes ?

    ### Cross-site scripting (XSS)

    Une XSS injecte du JavaScript dans une page lue par d'autres personnes. Le navigateur de la victime exécute ce script comme s'il venait du site.

    La XSS **réfléchie** est dans l'URL. Le serveur renvoie le script dans la page de réponse, et il s'exécute tout de suite. Il faut attirer la personne vers ce lien. La XSS **stockée** est enregistrée, dans un commentaire par exemple. Elle s'exécute à chaque affichage, sans nouveau lien.

    Avec ce script, on lit le cookie de session (`document.cookie`, par exemple `PHPSESSID`) et on l'envoie ailleurs : la session est volée. On peut rediriger vers une page d'hameçonnage. On peut aussi faire agir le navigateur déjà connecté : changer un mot de passe, publier un message.

    À l'affichage, on **échappe** : `<` devient `&lt;`, et le navigateur montre le texte au lieu de l'exécuter. Une **Content-Security-Policy** dit au navigateur de quelles origines un script a le droit de venir. Un script injecté dans la page n'est plus exécuté s'il n'est pas dans la liste.

    **Questions**
    1. Quelle fonction PHP native protège efficacement contre la XSS au moment de l'affichage ?
    2. Écrivez un court script JavaScript qui affiche le cookie de l'utilisateur dans une alerte.
    3. Quelle différence de persistance y a-t-il entre une XSS stockée et une XSS réfléchie ?

    ### Cross-site request forgery (CSRF)

    Le CSRF force le navigateur d'une personne **déjà connectée** à envoyer une requête que le site acceptera, parce qu'il reconnaît la session. L'attaquant n'a pas besoin du mot de passe. Il a besoin que la session soit encore vivante.

    La personne est connectée à `ma-banque.com`. Elle ouvre `site-piege.com`, qui contient une image de taille nulle :

    ```html
    <img src="http://ma-banque.com/virement?to=hacker&amount=1000" width="0" height="0" />
    ```

    Le navigateur charge l'image. Il envoie donc la requête de virement, avec le cookie de session. Si la banque ne vérifie pas d'où vient la requête, elle l'exécute. Le même schéma change un mot de passe, passe une commande, ou remplace l'adresse de récupération.

    Un `GET` qui modifie des données rend l'attaque triviale : une image, un lien, suffisent. Une action sensible se fait en `POST`, et le `POST` ne suffit pas tout seul.

    Le serveur émet un **jeton** aléatoire, lié à la session ou au formulaire, et le place dans un champ caché. À la soumission, il vérifie que le jeton reçu est celui qu'il attend. Le site piège peut déclencher la requête. Il ne peut pas lire le jeton d'un autre site, donc il ne peut pas le renvoyer.

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
    ## Impact, et ce que la loi demande ensuite

    En situation professionnelle, nommer la faille ne suffit pas. Il faut dire ce qu'elle coûte à l'activité, et quelles obligations s'ouvrent le jour où les données sont parties.

    On reprend la triade **DIC** (disponibilité, intégrité, confidentialité), le CIA des textes en anglais. Une injection SQL et une XSS ne pèsent pas le même poids sur chaque branche.

    | Critère | Impact d'une injection SQL | Impact d'une XSS |
    | :--- | :--- | :--- |
    | **Confidentialité** | **Critique** : vol de la base (clients, mots de passe). | **Élevé** : vol de cookies de session, données affichées à l'écran. |
    | **Intégrité** | **Critique** : prix modifiés, tables supprimées (`DROP`), compte administrateur ajouté. | **Moyen** : page défigurée, fausses informations affichées. |
    | **Disponibilité** | **Élevé** : données vitales supprimées, requêtes assez lourdes pour saturer le service. | **Faible** : le serveur tient en général ; le navigateur du client peut être bloqué. |

    La SQL touche les trois, parce qu'elle parle à la base. La XSS touche d'abord le navigateur de celui qui lit la page. Elle devient grave quand ce navigateur est celui d'un administrateur, ou quand le cookie volé ouvre le compte.

    **Scénario.** Une injection SQL a exfiltré la base clients (noms, adresses, mots de passe déjà hachés) et le dump est sur un forum. Les articles 33 et 34 du RGPD s'appliquent. On notifie la CNIL, au plus tard sous **72 heures**, parce que les droits des personnes sont en jeu. On notifie les personnes si le risque pour elles est élevé : un mot de passe haché avec un algorithme faible, ou réutilisé ailleurs, l'est souvent. On inscrit la violation au registre. Le hachage ne dispense pas de la notification. Il change l'analyse du risque, il ne l'annule pas.

    ### Exercice 1 : Alerte au DSI

    Rédigez le message technique au directeur des systèmes d'information après la découverte d'une XSS stockée dans les commentaires d'un site de vente.

    - **Objet :** Alerte sécurité critique, faille XSS, module commentaires
    - **Description :** un script malveillant persistant a été détecté
    - **Impact :** vol de session possible pour les visiteurs, clients et administrateurs
    - **Tout de suite :** désactiver le module de commentaires, purger les entrées suspectes

    ### Exercice 2 : Le score dépend du contexte

    Une injection SQL est découverte sur le site vitrine de la boulangerie du quartier. Le site montre des photos de pains et les horaires. Il n'a ni compte client, ni espace membre, ni donnée personnelle. La base ne contient que les tables `produits` et `horaires`.

    Discutez le score CVSS de cette faille à partir de ce contexte : la même injection, sur une base clients, n'a pas le même impact.

    ### Exercice 3 : Lire un journal

    Extrait Apache. Pour chaque ligne, dites s'il s'agit d'une tentative d'attaque et, si oui, laquelle.

    1. `192.168.1.15 - - [12/Mar/2024:10:00:00] "GET /login.php?user=admin'-- HTTP/1.1" 200 1542`
    2. `192.168.1.15 - - [12/Mar/2024:10:01:00] "GET /search.php?q=<script>alert(1)</script> HTTP/1.1" 200 542`
    3. `192.168.1.15 - - [12/Mar/2024:10:02:00] "GET /admin/config.xml HTTP/1.1" 403 202`
    4. `192.168.1.15 - - [12/Mar/2024:10:03:00] "POST /upload.php HTTP/1.1" 200 1542` (le fichier envoyé s'appelle `shell.php`)

    ### Exercice 4 : Une politique de mots de passe

    Règles actuelles d'une PME : 6 caractères minimum, aucune règle de composition, renouvellement obligatoire tous les 30 jours, aucun blocage après des échecs.

    Relevez trois faiblesses critiques, et proposez une version corrigée, conforme aux recommandations de l'ANSSI.
  </ExerciseSection>

</ExerciseTabs>
