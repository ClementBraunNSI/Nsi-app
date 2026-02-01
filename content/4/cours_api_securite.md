# Sécurité des API

## Introduction : Qu'est-ce qu'une API ?

Une **API** (Application Programming Interface, ou Interface de Programmation d'Application) est un ensemble de définitions et de protocoles qui permet à deux applications logicielles de communiquer entre elles.

Pour comprendre le concept, on utilise souvent l'analogie du **restaurant** :
- **Le client** (l'application utilisatrice) souhaite commander un plat.
- **La cuisine** (le serveur/système) prépare le plat, mais le client n'y a pas accès direct.
- **Le serveur** (l'API) fait l'intermédiaire : il prend la commande du client, la transmet à la cuisine, et ramène le plat préparé.

Concrètement, une API permet d'abstraire la complexité d'un système. Le développeur n'a pas besoin de savoir *comment* le système fonctionne en interne, il a juste besoin de savoir *comment* lui demander quelque chose (la requête) et *ce que* le système va renvoyer (la réponse).

Les API sont aujourd'hui omniprésentes et constituent l'épine dorsale du web moderne et des architectures microservices. Elles exposent des données et des fonctionnalités critiques, ce qui en fait une cible privilégiée pour les cyberattaques.
