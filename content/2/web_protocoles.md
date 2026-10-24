---
title: Le Web et HTTP
description: 'Introduction au Web, architecture client-serveur, protocole HTTP et URL.'
level: premiere
chapter: Web et Interaction
icon: "\U0001F310"
badgeId: premiere_web_protocoles
prerequisites:
  - web_javascript_interactions
audience: public
---

# Le Web et HTTP

Vous avez écrit des pages. Il reste à voir comment elles voyagent. Le Web est une application : un **navigateur**, le client, demande une ressource à un **serveur**, qui répond. Le protocole de cet échange s'appelle **HTTP**, ou **HTTPS** quand l'échange est chiffré. Une **URL** nomme la ressource. Le **DNS** traduit le nom de domaine en adresse IP, parce que les routeurs acheminent des paquets, pas des noms.

Le Web date de 1989, au CERN. Tim Berners-Lee et Robert Cailliau ont proposé d'accéder à des documents par des **hyperliens**, plutôt que de savoir sur quelle machine le fichier était rangé. La première page est toujours en ligne : [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html).

Le geste n'a pas changé. La personne saisit une URL ou clique un lien. Le client envoie une **requête**. Le serveur renvoie une **réponse** : une page, une image, ou une erreur. Le navigateur affiche ce qu'il a reçu.

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

Le protocole dit quelles règles suivre. Le domaine est un nom. Le chemin est l'emplacement de la ressource sur ce serveur, comme un chemin de fichier. Le **DNS** convertit `www.example.com` en adresse IP. Sans lui, il faudrait retenir des adresses numériques, et les changer à la main chaque fois qu'un serveur déménage.

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

GET ne « cache » pas les données. Elles sont dans l'URL, donc dans l'historique et dans les journaux du serveur. Un mot de passe ou un formulaire sensible part en POST, et sur HTTPS.

La réponse commence par un **code** à trois chiffres. La centaine dit la famille.

| Famille | Sens | Exemples à connaître |
| --- | --- | --- |
| **2xx** | Succès | `200 OK`, `201 Created` |
| **3xx** | Redirection | `301` (déplacé), `304` (non modifié) |
| **4xx** | Erreur **client** | `404 Not Found`, `403 Forbidden` |
| **5xx** | Erreur **serveur** | `500 Internal Server Error` |

Un **404** veut dire que la ressource demandée n'existe pas à cette URL. C'est une erreur du côté de la requête, pas une panne de la machine. Un **500** veut dire que le serveur a échoué en traitant une requête pourtant recevable. Un **301** dit que la ressource a déménagé, et indique la nouvelle adresse. Un **304** dit que la copie déjà en cache est encore bonne.

## HTTPS, pages, cookies

**HTTPS** est HTTP transporté dans **TLS**. Le chiffrement protège la confidentialité : un intermédiaire voit du trafic, pas le contenu. Il protège aussi l'intégrité, et le certificat authentifie le serveur. Le cadenas du navigateur parle de ce canal, pas de la qualité du site.

<HttpsSimulator />

Une page **statique** est un fichier servi tel quel, identique pour tout le monde. Une page **dynamique** est produite au moment de la requête : une base, une session, un calcul. Le protocole reste HTTP dans les deux cas. Ce qui change, c'est le travail du serveur avant d'écrire la réponse.

Un **cookie** est un petit texte que le serveur demande au navigateur de garder, et que le navigateur renvoie ensuite avec les requêtes vers ce site. Il sert une session, ou une préférence. Un cookie de session disparaît à la fermeture du navigateur. Un cookie persistant a une date d'expiration. Les cookies tiers, déposés par un domaine que vous n'avez pas visité directement, servent souvent au suivi. On ne les pose pas « parce que c'est pratique » sans se demander qui les relit.

<CookieManager />

HTTP est un protocole de la **couche application**. En dessous, TCP assure le transport, IP l'acheminement. Le cours sur les réseaux a posé ces couches. Ici, on reste au message que le navigateur et le serveur s'échangent.

Pour fermer : le client demande, le serveur répond. Une URL assemble un protocole, un domaine et un chemin. Le DNS traduit le nom en IP. GET obtient, POST envoie dans le corps. Les codes 2xx disent le succès, 4xx une erreur côté client, 5xx une erreur côté serveur. HTTPS chiffre l'échange avec TLS. Un cookie est une petite mémoire dans le navigateur.

## Pour s'entraîner / Suite

Manipulez les interactifs (URL, DNS, méthodes, HTTPS, cookies). Reliez ce cours au modèle TCP/IP : HTTP est un protocole de la **couche application**.
