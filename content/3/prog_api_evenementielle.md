---
title: "API et programmation événementielle"
description: "Connecter interface utilisateur, événements et requêtes réseau"
level: TNSI
order: 210
chapter: Langages et Programmation
icon: "🔌"
badgeId: terminale_api_evenementielle
prerequisites:
  - prog_modularite_mise_au_point
audience: public
---

# API et programmation événementielle

Un programme de Première exécute ses lignes de haut en bas, puis s'arrête. Une application graphique attend. Elle ne sait pas quand la personne va cliquer, taper, ou quand la réponse du réseau va arriver. La **programmation événementielle** organise le code autour de ces moments. Une **API** est le contrat par lequel ce code va chercher, ou fournir, des données à un autre programme.

## Une API est un contrat, pas une page

**API** veut dire *Application Programming Interface*. C'est l'ensemble des requêtes qu'un service accepte, avec la forme des réponses. Une API météo prend une ville et renvoie des températures. Une API cartographique prend des coordonnées. Une application web a souvent sa propre API, sous des URL comme `/api/...`, que sa page appelle au lieu de recharger tout le HTML.

Le client envoie une requête HTTP. Le serveur renvoie un code de statut et, en cas de succès, un corps. Ici le corps est du **JSON** : un texte qui se lit comme un dictionnaire. `requests` fait l'appel. `timeout=3` abandonne si rien n'est revenu au bout de trois secondes, au lieu de bloquer l'interface.

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

`200` veut dire que le serveur a répondu et que la ressource est là. `404` veut dire que ce renard n'existe pas. `500` veut dire que le serveur a échoué. On teste le code avant de lire le JSON : un corps d'erreur n'a souvent pas la clé `"nom"`. Et `requests.get` peut lever une exception **avant** tout code HTTP, si le réseau est coupé ou si le délai est dépassé. Il n'y a alors pas de `reponse` du tout. C'est un cas pour `try` / `except`, pas pour un `if` sur le statut.

## L'interface réagit, elle ne boucle pas

Côté page, on n'écrit pas une boucle qui surveille le bouton. On abonne une fonction à un événement. Quand le clic arrive, la fonction part. `async` marque une fonction qui peut attendre la réponse du réseau sans figer le dessin de la page.

```javascript
const bouton = document.getElementById("charger");
const zone = document.getElementById("resultat");

bouton.addEventListener("click", async () => {
  zone.textContent = "Chargement...";
  // appel API
  // mise à jour de l'interface
});
```

Le texte « Chargement... » s'affiche **avant** l'appel. Sans lui, la page semble morte pendant que le réseau travaille, et la personne clique une deuxième fois. Le deuxième clic relance une requête dont la réponse peut arriver dans le désordre. On désactive le bouton le temps de l'attente, ou l'on ignore les clics tant que la première requête n'est pas revenue.

La chaîne est toujours la même. Un événement déclenche le traitement. L'application envoie la requête. Elle lit la réponse, code puis JSON. Elle met à jour l'affichage, ou elle écrit un message d'erreur compréhensible : « le catalogue ne répond pas », pas la trace brute de l'exception. La fonction qui dessine ne devrait pas construire l'URL, et la fonction qui appelle le réseau ne devrait pas connaître les identifiants des balises. On les sépare pour pouvoir changer l'API sans réécrire la page, et la page sans réécrire l'appel.

## Exercices

1. Écrire un pseudo-code "clic -> requête -> affichage".
2. Ajouter un `try/except` autour de `requests.get`.
3. Proposer un format JSON minimal pour un catalogue de véhicules.
