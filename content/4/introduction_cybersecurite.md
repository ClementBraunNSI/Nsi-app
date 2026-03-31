---
title: Introduction à la cybersécurité
description: >-
  Introduction aux concepts fondamentaux de la cybersécurité, les piliers CIA,
  les menaces courantes et la gestion des risques.
level: '4'
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: premiers-pas-c-sharp
prerequisites: []
---

# Introduction à la cybersécurité

## 🌍 Contexte
La transformation numérique des entreprises et de la société a entraîné une dépendance accrue aux systèmes d'information. Cette hyper-connectivité s'accompagne d'une augmentation exponentielle des cybermenaces. La cybersécurité n'est plus une option, mais une nécessité vitale pour protéger les données, les infrastructures et la réputation des organisations.

---

## 🔒 Les trois piliers de la sécurité : Confidentialité – Intégrité – Disponibilité (CIA)

Le modèle **CIA** (ou DIC en français) est la pierre angulaire de la sécurité de l'information.

### 1. Confidentialité
**Définition :** La confidentialité garantit que l'information n'est accessible qu'aux personnes autorisées (et aux processus autorisés).
**Objectif :** Protéger contre la divulgation non autorisée d'informations sensibles (données personnelles, secrets industriels, mots de passe).
**Exemples de mesures :**
*   Chiffrement des données (au repos et en transit).
*   Contrôle d'accès strict (authentification, autorisation).
*   Classification des données.
*   Utilisation de VPN pour les accès distants.

### 2. Intégrité
**Définition :** L'intégrité assure que l'information est exacte, complète et n'a pas été altérée de manière non autorisée.
**Objectif :** Empêcher la modification ou la destruction non autorisée de l'information.
**Exemples de mesures :**
*   Fonctions de hachage (ex: SHA-256) pour vérifier l'empreinte des fichiers.
*   Signatures numériques.
*   Gestion des versions et journaux d'audit (logs).
*   Contrôles de redondance (checksums).

### 3. Disponibilité
**Définition :** La disponibilité garantit que l'information et les services sont accessibles aux utilisateurs autorisés au moment où ils en ont besoin.
**Objectif :** Assurer la continuité de service et prévenir les interruptions.
**Exemples de mesures :**
*   Redondance des équipements (serveurs, disques RAID, alimentations).
*   Plans de reprise d'activité (PRA) et de continuité d'activité (PCA).
*   Protection contre les attaques par déni de service (DDoS).
*   Sauvegardes régulières.

> **Note :** On ajoute souvent deux autres critères :
> *   **Authenticité :** Garantir l'identité de l'émetteur d'une information (l'utilisateur est bien qui il prétend être).
> *   **Non-répudiation :** Garantir qu'une action ne peut pas être niée par son auteur (preuve de l'action).

---

## 📚 Vocabulaire essentiel

Il est crucial de distinguer les termes suivants :

| Terme | Définition | Exemple |
| :--- | :--- | :--- |
| **Actif (Asset)** | Tout ce qui a de la valeur pour l'organisation et qui doit être protégé. | Base de données clients, serveur web, réputation. |
| **Menace (Threat)** | Cause potentielle d'un incident indésirable, qui peut causer des dommages à un système ou une organisation. | Hacker, virus, incendie, erreur humaine. |
| **Vulnérabilité** | Faiblesse d'un actif ou d'une mesure de contrôle qui peut être exploitée par une menace. | Logiciel non mis à jour, mot de passe faible, porte non verrouillée. |
| **Incident** | Événement de sécurité qui compromet la confidentialité, l'intégrité ou la disponibilité. | Vol de données, infection par un ransomware, panne serveur. |
| **Impact** | Conséquence d'un incident de sécurité sur l'organisation. | Perte financière, atteinte à l'image, arrêt de la production. |

---

## ☠️ Panorama des menaces courantes

### 1. Phishing (Hameçonnage)
**Description :** Technique d'ingénierie sociale consistant à envoyer des emails frauduleux semblant provenir d'une source légitime pour inciter la victime à révéler des informations sensibles (mots de passe, bancaires).
**Protection :** Sensibilisation des utilisateurs, filtres anti-spam, authentification multifacteur (MFA).

### 2. Ransomware (Rançongiciel)
**Description :** Logiciel malveillant qui chiffre les données de la victime et exige une rançon pour obtenir la clé de déchiffrement.
**Protection :** Sauvegardes déconnectées (hors ligne), mises à jour régulières, antivirus/EDR.

### 3. Man-in-the-Middle (MitM)
**Description :** L'attaquant s'intercepte secrètement les communications entre deux parties pour écouter ou modifier les échanges.
**Protection :** Chiffrement des communications (HTTPS, TLS, VPN), authentification mutuelle.

### 4. DDoS (Déni de Service Distribué)
**Description :** Attaque visant à rendre un service indisponible en le surchargeant de trafic provenant de multiples sources (botnet).
**Protection :** Services anti-DDoS (Cloudflare, Akamai), surdimensionnement, filtrage.

### 5. Injection SQL
**Description :** Insertion de code SQL malveillant dans un champ de saisie pour manipuler la base de données (lire, modifier ou supprimer des données).
**Protection :** Validation des entrées, utilisation de requêtes préparées (prepared statements).

### 6. Zero-day
**Description :** Exploitation d'une vulnérabilité logicielle inconnue de l'éditeur et pour laquelle aucun correctif n'existe encore.
**Protection :** Défense en profondeur, détection comportementale, veille sécurité.

---

## 📈 Gestion des Risques

La sécurité absolue n'existe pas. L'objectif est de ramener le risque à un niveau acceptable.

### La formule du risque
Le risque est généralement évalué selon la combinaison de deux facteurs :

$$ \text{Risque} = \text{Vraisemblance} \times \text{Impact} $$

*   **Vraisemblance (Probabilité) :** Probabilité qu'une menace exploite une vulnérabilité (Faible, Moyenne, Forte).
*   **Impact (Gravité) :** Conséquences pour l'organisation si le risque se réalise (Faible, Moyen, Fort, Critique).

### Matrice des risques
On utilise souvent une matrice pour visualiser et prioriser les risques :

| Vraisemblance / Impact | Faible | Moyen | Fort | Critique |
| :--- | :--- | :--- | :--- | :--- |
| **Forte** | Moyen | Élevé | Critique | Critique |
| **Moyenne** | Faible | Moyen | Élevé | Critique |
| **Faible** | Faible | Faible | Moyen | Élevé |

### Traitement du risque
Face à un risque identifié, quatre stratégies sont possibles :
1.  **Réduire (Atténuer) :** Mettre en place des mesures de sécurité pour diminuer la vraisemblance ou l'impact (ex: installer un pare-feu).
2.  **Accepter :** Le coût de la protection est supérieur au coût de l'impact (ex: risque minime).
3.  **Transférer (Partager) :** Souscrire une cyber-assurance ou externaliser.
4.  **Éviter (Refuser) :** Supprimer l'activité à risque (ex: ne pas stocker de données bancaires).

### Méthode EBIOS
En France, la méthode **EBIOS Risk Manager** (élaborée par l'ANSSI) est la référence pour la gestion des risques cyber. Elle permet d'apprécier les risques et de déterminer les mesures de sécurité adaptées.
