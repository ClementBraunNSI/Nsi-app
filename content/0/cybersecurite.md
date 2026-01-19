---
title: "Cybersécurité"
description: "Introduction aux enjeux de la sécurité informatique, chiffrement et bonnes pratiques."
level: "0"
chapter: "Cybersecurite"
icon: "🔒"
---

## Introduction

La **cybersécurité** désigne l'ensemble des techniques et pratiques visant à protéger les systèmes informatiques, les réseaux et les données contre les attaques, les dommages ou les accès non autorisés. À l'ère du numérique, où nous partageons constamment des informations en ligne, comprendre les enjeux de la cybersécurité est devenu essentiel.

## Les enjeux de la sécurisation des échanges sur Internet

### Pourquoi sécuriser les échanges ?

Chaque jour, des milliards de données circulent sur Internet :
- Messages personnels
- Informations bancaires
- Données médicales
- Photos et vidéos privées
- Identifiants et mots de passe

**Sans sécurisation, ces données peuvent être :**
- **Interceptées** (lues par des personnes non autorisées)
- **Modifiées** (changées en cours de route)
- **Volées** (copiées sans autorisation)
- **Détruites** (supprimées ou rendues inaccessibles)

### Les risques quotidiens

**Pour les individus :**
- Vol d'identité
- Usurpation de compte
- Harcèlement en ligne
- Perte de données personnelles
- Fraude bancaire

**Pour les organisations :**
- Espionnage industriel
- Sabotage de systèmes
- Rançongiciels (ransomware)
- Perte de confiance des clients
- Amendes légales (RGPD)

### Exemple concret

**Situation sans sécurisation :**
```
Vous → [Mot de passe : 1234] → Site web
         ↑
    Pirate qui intercepte : "J'ai ton mot de passe !"
```

**Situation avec sécurisation (HTTPS) :**
```
Vous → [Mot de passe chiffré : %Kj#9@mL] → Site web
         ↑
    Pirate qui intercepte : "Je ne comprends rien !"
```

## Le chiffrement : principe de base

### Qu'est-ce que le chiffrement ?

Le **chiffrement** est une technique qui transforme un message clair en message codé illisible, sauf pour la personne qui possède la **clé** de déchiffrement.

**Vocabulaire :**
- **Message clair** : le message original, lisible
- **Chiffrement** : transformation du message clair en message codé
- **Message chiffré** : le message codé, illisible
- **Clé** : information secrète permettant de chiffrer/déchiffrer
- **Déchiffrement** : transformation du message chiffré en message clair

**Schéma :**
```
Message clair → [CHIFFREMENT avec CLÉ] → Message chiffré
Message chiffré → [DÉCHIFFREMENT avec CLÉ] → Message clair
```

## Méthodes de chiffrement simples

### 1. Le code de César

Le **code de César** est l'une des plus anciennes méthodes de chiffrement. Elle consiste à décaler chaque lettre de l'alphabet d'un nombre fixe de positions.

**Principe avec un décalage de 3 :**
```
A → D
B → E
C → F
...
X → A
Y → B
Z → C
```

**Exemple :**
```
Message clair :  BONJOUR
Clé (décalage) : 3
Message chiffré : ERQMRXU
```

**Activité pratique :**
