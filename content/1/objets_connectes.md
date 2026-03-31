---
title: Objets Connectés
description: 'Comprendre l''Internet des Objets (IoT), les capteurs et les protocoles'
level: seconde
chapter: Micro-controleurs
icon: "\U0001F4F6"
prerequisites: []
---

# 1. Introduction

> **Définition** : Un **objet connecté** (ou IoT pour *Internet of Things*) est un dispositif physique équipé de capteurs, d'actionneurs et d'une connexion réseau qui lui permet de collecter, échanger et traiter des données via Internet.

L'histoire commence dans les années 1980, mais le terme "Internet of Things" est inventé en 1999. Aujourd'hui, on compte des milliards d'objets connectés (montres, enceintes, voitures, capteurs industriels...).

# 2. Les composants d'un objet connecté

Pour fonctionner, un objet connecté a besoin de plusieurs éléments :

| Composant | Rôle | Exemple |
|-----------|------|----------|
| **Capteurs** | Mesurent des grandeurs physiques | Température, mouvement, lumière |
| **Actionneurs** | Agissent sur l'environnement | Moteur, LED, écran |
| **Microprocesseur** | Traite les données (le "cerveau") | Arduino, Micro:bit, ESP32 |
| **Interface** | Permet la communication | WiFi, Bluetooth, LoRa |
| **Alimentation** | Fournit l'énergie | Batterie, secteur |

![Carte Micro:bit - Face](/content/1/microbit.png)
![Carte Micro:bit - Dos](/content/1/microbit-back.png)
*Exemple de microcontrôleur : La carte BBC Micro:bit*

## 2.1 Capteurs et Actionneurs

**Capteurs courants :**
- **Température/Humidité** (Station météo)
- **Accéléromètre/Gyroscope** (Mouvement, rotation)
- **Luminosité** (Allumage automatique des feux)
- **Microphone** (Assistant vocal)

**Actionneurs courants :**
- **LED/Écran** (Affichage visuel)
- **Haut-parleur** (Sortie sonore)
- **Moteur** (Mouvement mécanique)
- **Relais/Vanne** (Contrôle électrique ou hydraulique)

# 3. Protocoles de communication

Les objets doivent communiquer entre eux ou avec un serveur. On utilise différents protocoles selon les besoins (portée, consommation, débit).

| Protocole | Portée | Consommation | Débit | Usage typique |
|-----------|--------|--------------|-------|---------------|
| **WiFi** | 50-100m | Élevée | Très haut | Objets domestiques (prises, caméras) |
| **Bluetooth** | 10-100m | Moyenne | Moyen | Objets personnels (montres, écouteurs) |
| **LoRaWAN** | 2-15km | Très faible | Très faible | Capteurs ville/agriculture (longue distance) |
| **4G/5G** | National | Élevée | Très haut | Objets mobiles (voitures, smartphones) |
| **NFC** | < 10cm | Très faible | Moyen | Paiement sans contact, badges |

> **Focus LoRaWAN** : Idéal pour les objets sur batterie devant envoyer peu de données (ex: relevé de compteur d'eau une fois par jour) sur de très longues distances.

# 4. Fonctionnement d'un système IoT

Le cycle de vie de la donnée IoT se décompose en 5 étapes :

1.  **Collecte** : Le capteur mesure une donnée (ex: 18°C).
2.  **Transmission** : La donnée est envoyée via un réseau (ex: WiFi).
3.  **Traitement** : Un serveur/cloud reçoit et stocke la donnée.
4.  **Analyse** : Un algorithme analyse la donnée (ex: 18°C < consigne 20°C).
5.  **Action** : Une commande est envoyée à l'actionneur (ex: allumer le chauffage).

# 5. Domaines d'application

- **Domotique** (Maison intelligente) : Confort, sécurité, économie d'énergie.
- **Santé** (e-santé) : Suivi des constantes, alertes chute, télémédecine.
- **Ville intelligente** (Smart City) : Gestion du trafic, éclairage public adaptatif, gestion des déchets.
- **Industrie 4.0** : Maintenance prédictive, robotique, logistique.
- **Agriculture** : Arrosage piloté, surveillance des cultures et du bétail.

# 6. L'Interface Homme-Machine (IHM)

Pour qu'un humain puisse interagir avec l'objet connecté (voir les données ou envoyer des commandes), il faut une **interface**.
Elle peut prendre plusieurs formes :
- Une application mobile (Smartphone).
- Un site web (Tableau de bord).
- Des boutons physiques sur l'objet.
- La voix (Assistant vocal).

<IotInterface />

# 7. La Programmation "Événementielle"

Contrairement à un programme classique qui s'exécute du début à la fin, un objet connecté fonctionne souvent en **boucle infinie** en attendant des **événements** (un clic, une température qui dépasse un seuil, un message reçu).

### Exemple en Python (pour Micro:bit) :

```python
from microbit import *

while True:  # Boucle infinie
    if button_a.is_pressed():  # ÉVÉNEMENT : Si on appuie sur A
        display.show(Image.HAPPY)  # ACTION : Sourire
    elif temperature() > 30:   # ÉVÉNEMENT : Si trop chaud
        display.scroll("ALERTE")   # ACTION : Message d'alerte
    else:
        display.clear()        # Sinon, rien
```

> **Structure typique :** `SI (Événement) ALORS (Action)`

# 8. Risques et Sécurité

Les objets connectés sont souvent le maillon faible de la sécurité informatique.

### 🦠 Les Botnets (ex: Mirai)
En 2016, le virus **Mirai** a infecté des centaines de milliers de caméras de surveillance et de routeurs mal sécurisés.
Les pirates ont utilisé ces objets comme une "armée de zombies" (**Botnet**) pour lancer des attaques massives et faire tomber des sites comme Twitter ou Netflix.
*Cause principale : Les utilisateurs n'avaient pas changé le mot de passe par défaut ("admin/admin").*

### 🕵️ Vie Privée
*   Une **montre connectée** sait où vous êtes et si vous dormez bien.
*   Une **enceinte intelligente** écoute ce qui se dit dans votre salon.
*   Une **caméra connectée** filme l'intérieur de chez vous.

> **Conseil de sécurité** :
> 1.  Changez toujours le mot de passe par défaut.
> 2.  Faites les mises à jour de sécurité.
> 3.  Isolez vos objets connectés sur un réseau WiFi "Invité" si possible.
