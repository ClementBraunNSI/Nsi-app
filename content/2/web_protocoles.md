---
title: Le Web et HTTP
description: 'Introduction au Web, architecture client-serveur, protocole HTTP et URL.'
level: premiere
chapter: Web et Interaction
icon: "globe"
badgeId: premiere_web_protocoles
prerequisites:
  - web_javascript_interactions
audience: public
groupe: web-http
groupeTitre: "Le Web et HTTP"
---

# Le Web et HTTP

Après avoir écrit des pages, il reste à comprendre comment elles circulent. Le Web est une application dans laquelle un **navigateur**, le client, demande une ressource à un **serveur**, qui lui répond. Cet échange suit le protocole **HTTP**, ou **HTTPS** quand il est chiffré. Une **URL** désigne la ressource demandée, et le **DNS** traduit le nom de domaine en adresse IP, car les routeurs acheminent les paquets à partir d'adresses et non de noms.

Le Web date de 1989, au CERN. Tim Berners-Lee et Robert Cailliau ont proposé d'accéder à des documents par des **hyperliens**, plutôt que de savoir sur quelle machine le fichier était rangé. La première page est toujours en ligne : [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html).

Le principe n'a pas changé depuis. La personne saisit une URL ou clique sur un lien, et le client envoie une **requête**. Le serveur renvoie alors une **réponse**, qui peut être une page, une image ou une erreur, et le navigateur affiche ce qu'il a reçu.

!!! tip "Première page web"
    Toujours accessible : [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html)

## Lire une URL

```
https://www.example.com/dossier/page.html
```

<UrlBuilder />

| Partie | Exemple | Rôle |
| --- | --- | --- |
| Protocole | `https://` | Comment communiquer |
| Domaine | `www.example.com` | Quel serveur (nom lisible) |
| Chemin | `/dossier/page.html` | Quelle ressource sur le serveur |

Le protocole indique les règles à suivre, le domaine est le nom du serveur, et le chemin donne l'emplacement de la ressource sur ce serveur, comme un chemin de fichier. Le **DNS** convertit `www.example.com` en adresse IP. Sans lui, il faudrait retenir des adresses numériques, et les changer à la main chaque fois qu'un serveur déménage.

<DnsResolver />

## La requête et la réponse

Un message HTTP a une ligne de départ, des **en-têtes**, et parfois un **corps**. La ligne de départ de la requête porte la **méthode**, le chemin, et la version du protocole. Deux méthodes suffisent pour commencer.

**GET** demande une ressource. Les paramètres, quand il y en a, voyagent dans l'URL, après un `?`, comme `?id=123`. GET ne doit pas modifier l'état du serveur : relancer la même requête doit redonner la même page. **POST** envoie des données, un formulaire ou une création, dans le **corps** de la requête. Elles n'apparaissent pas dans la barre d'adresse.

<HttpMethodVisualizer />

```http
GET /utilisateurs/profil?id=123 HTTP/1.1
Host: www.example.com
```

```http
POST /utilisateurs/inscription HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded

nom=Dupont&prenom=Jean
```

GET ne cache donc pas les données : elles apparaissent dans l'URL, et donc dans l'historique et dans les journaux du serveur. Un mot de passe ou un formulaire sensible doit être envoyé avec POST, et sur HTTPS.

La réponse commence par un **code** à trois chiffres, dont le premier indique la famille.

| Famille | Sens | Exemples à connaître |
| --- | --- | --- |
| **2xx** | Succès | `200 OK`, `201 Created` |
| **3xx** | Redirection | `301` (déplacé), `304` (non modifié) |
| **4xx** | Erreur **client** | `404 Not Found`, `403 Forbidden` |
| **5xx** | Erreur **serveur** | `500 Internal Server Error` |

Un **404** signifie que la ressource demandée n'existe pas à cette URL : l'erreur vient de la requête, et non d'une panne de la machine. Un **500** signifie que le serveur a échoué en traitant une requête pourtant correcte. Un **301** indique que la ressource a changé d'adresse et donne la nouvelle, et un **304** que la copie déjà en cache est toujours valable.

## HTTPS, pages dynamiques et cookies

**HTTPS** est HTTP transporté dans **TLS**. Le chiffrement protège la confidentialité, car un intermédiaire voit passer du trafic sans pouvoir lire son contenu. Il garantit aussi l'intégrité des données, et le certificat permet d'authentifier le serveur. Le cadenas du navigateur indique seulement que la connexion est sécurisée : il ne dit rien de la fiabilité du site.

<HttpsSimulator />

Une page **statique** est un fichier servi tel quel, identique pour tout le monde. Une page **dynamique** est produite au moment de la requête, par exemple à partir d'une base de données, d'une session ou d'un calcul. Le protocole reste HTTP dans les deux cas : seul change le travail fait par le serveur avant d'écrire la réponse.

Un **cookie** est un petit texte que le serveur demande au navigateur de garder, et que le navigateur renvoie ensuite avec les requêtes vers ce site. Il sert à garder une session ouverte ou à mémoriser une préférence. Un cookie de session disparaît à la fermeture du navigateur. Un cookie persistant a une date d'expiration. Les cookies tiers, déposés par un domaine qui n'a pas été visité directement, servent souvent au suivi. Avant d'en déposer, un site doit donc se demander qui pourra les lire.

<CookieManager />

HTTP est un protocole de la **couche application**. En dessous, TCP assure le transport des données et IP leur acheminement. Ces couches ont été présentées dans le cours sur les réseaux, et ce cours se limite aux messages échangés entre le navigateur et le serveur.

En résumé, le client envoie une requête et le serveur répond. Une URL est formée d'un protocole, d'un domaine et d'un chemin, et le DNS traduit le nom de domaine en adresse IP. GET permet d'obtenir une ressource, alors que POST envoie des données dans le corps de la requête. Les codes 2xx indiquent un succès, les codes 4xx une erreur côté client et les codes 5xx une erreur côté serveur. HTTPS chiffre l'échange avec TLS, et un cookie permet au navigateur de mémoriser une information.

## Pour s'entraîner / Suite

Manipuler les animations interactives sur les URL, le DNS, les méthodes, HTTPS et les cookies. Relier ce cours au modèle TCP/IP : HTTP est un protocole de la **couche application**.
