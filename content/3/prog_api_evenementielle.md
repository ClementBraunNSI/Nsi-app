---
title: "API et programmation événementielle"
description: "Connecter interface utilisateur, événements et requêtes réseau"
level: TNSI
order: 210
chapter: Langages et Programmation
icon: "plug"
badgeId: terminale_api_evenementielle
prerequisites:
  - prog_modularite_mise_au_point
audience: public
---

# API et programmation événementielle

Les programmes écrits en Première exécutent leurs instructions de haut en bas, puis s'arrêtent. Une application graphique, elle, reste en attente : elle ne sait pas quand l'utilisateur va cliquer ou taper au clavier, ni quand la réponse du réseau va arriver. La **programmation événementielle** organise le code autour de ces événements. Une **API**, quant à elle, définit comment ce code peut obtenir des données d'un autre programme, ou lui en fournir.

## Qu'est-ce qu'une API ?

**API** signifie *Application Programming Interface*. C'est l'ensemble des requêtes qu'un service accepte, avec la forme des réponses qu'il renvoie. Une API météo prend une ville et renvoie des températures. Une API cartographique prend des coordonnées. Une application web a souvent sa propre API, sous des URL comme `/api/...`, que sa page appelle au lieu de recharger tout le HTML.

Le client envoie une requête HTTP, et le serveur renvoie un code de statut et, en cas de succès, un corps. Ici, le corps est écrit en **JSON**, un format texte qui se lit comme un dictionnaire. La bibliothèque `requests` effectue l'appel, et `timeout=3` abandonne la requête si aucune réponse n'est arrivée au bout de trois secondes, pour ne pas bloquer l'interface.

```python
import requests

url = "https://api.example.com/renards/42"
reponse = requests.get(url, timeout=3)

if reponse.status_code == 200:
    data = reponse.json()
    print(data["nom"])
else:
    print("Erreur HTTP :", reponse.status_code)
```

Le code `200` signifie que le serveur a répondu et que la ressource existe, `404` que ce renard n'existe pas, et `500` que le serveur a rencontré une erreur. Il faut tester le code avant de lire le JSON, car un corps d'erreur ne contient souvent pas la clé `"nom"`. De plus, `requests.get` peut lever une exception **avant** de recevoir un code HTTP, si le réseau est coupé ou si le délai est dépassé. Dans ce cas, la variable `reponse` n'existe pas du tout, et il faut utiliser `try` / `except` plutôt qu'un `if` sur le statut.

## Réagir aux événements de l'interface

Côté page, on n'écrit pas de boucle qui surveille le bouton : on associe une fonction à un événement, et cette fonction s'exécute quand le clic se produit. Le mot-clé `async` indique une fonction qui peut attendre la réponse du réseau sans bloquer l'affichage de la page.

```javascript
const bouton = document.getElementById("charger");
const zone = document.getElementById("resultat");

bouton.addEventListener("click", async () => {
  zone.textContent = "Chargement...";
  // appel API
  // mise à jour de l'interface
});
```

Le texte « Chargement... » s'affiche **avant** l'appel. Sans ce message, la page semble bloquée pendant l'attente, et l'utilisateur risque de cliquer une deuxième fois. Ce deuxième clic relance alors une requête, dont la réponse peut arriver dans le désordre. Pour l'éviter, on désactive le bouton pendant l'attente, ou on ignore les clics tant que la première requête n'a pas reçu de réponse.

Le déroulement est toujours le même. Un événement déclenche le traitement, puis l'application envoie la requête et lit la réponse, d'abord le code puis le JSON. Elle met enfin à jour l'affichage, ou affiche un message d'erreur compréhensible, comme « le catalogue ne répond pas », plutôt que le détail brut de l'exception. La fonction qui met à jour l'affichage ne devrait pas construire l'URL, et la fonction qui appelle le réseau ne devrait pas connaître les identifiants des balises. Les séparer permet de changer l'API sans réécrire la page, et la page sans réécrire l'appel.

## Exercices

1. Écrire un pseudo-code qui enchaîne le clic, la requête et l'affichage.
2. Ajouter un `try/except` autour de `requests.get`.
3. Proposer un format JSON minimal pour un catalogue de véhicules.
