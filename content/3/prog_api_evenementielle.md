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
---

# API et programmation événementielle

## Introduction

Dans une application moderne, le code ne s'exécute pas toujours en séquence.
Il réagit à des événements (clic, saisie, timer), puis échange des données via une API.

## 1. Qu'est-ce qu'une API ?

Une **API** (Application Programming Interface) est une interface qui permet à un programme d'accéder à un service distant.

Exemples :

- API météo ;
- API cartographique ;
- API interne (`/api/...`) d'une application web.

## 2. Appel d'API en Python

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

!!! tip "Bon réflexe"
    Toujours vérifier le code HTTP et traiter les erreurs réseau.

## 3. Programmation événementielle côté interface

```javascript
const bouton = document.getElementById("charger");
const zone = document.getElementById("resultat");

bouton.addEventListener("click", async () => {
  zone.textContent = "Chargement...";
  // appel API
  // mise à jour de l'interface
});
```

## 4. Chaîne de traitement classique

1. L'utilisateur déclenche un événement.
2. L'application envoie une requête.
3. La réponse est traitée.
4. L'affichage est mis à jour.

## 5. Bonnes pratiques

- Afficher un état de chargement.
- Empêcher les clics multiples inutiles.
- Afficher des messages d'erreur compréhensibles.
- Séparer la logique réseau de la logique d'affichage.

## Exercices

1. Écrire un pseudo-code "clic -> requête -> affichage".
2. Ajouter un `try/except` autour de `requests.get`.
3. Proposer un format JSON minimal pour un catalogue de véhicules.
