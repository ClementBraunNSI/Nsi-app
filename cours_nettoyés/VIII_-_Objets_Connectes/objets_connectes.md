---
title: "Objets Connectés"
description: "Comprendre l'Internet des Objets (IoT), les capteurs et les protocoles"
level: "seconde"
chapter: 8
icon: "wifi"
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
