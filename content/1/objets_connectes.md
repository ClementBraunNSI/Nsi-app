---
title: Objets Connectés
description: 'Comprendre l''Internet des Objets (IoT), les capteurs et les protocoles'
level: seconde
chapter: Micro-controleurs
icon: "\U0001F4F6"
prerequisites: []
audience: public
---

# Objets connectés

> **Définition**
> Un **objet connecté**, ou objet de l'Internet des objets (*Internet of Things*, IoT), est un appareil physique équipé de capteurs, d'actionneurs et d'une connexion réseau. Il collecte des données, les échange, et parfois agit, en passant par Internet.

On date souvent le mot de 1999, même si des machines reliées à un réseau existent dès les années 1980. Aujourd'hui, les montres, les enceintes, certaines voitures et une foule de capteurs industriels en font partie. L'objet n'est plus seulement un outil qu'on allume. Il mesure quelque chose, et il en parle à une autre machine.

## Ce qu'il y a dedans

Un objet connecté n'est pas « une puce magique ». Il assemble quelques rôles, que vous retrouvez presque toujours.

| Composant | Rôle | Exemple |
|-----------|------|----------|
| **Capteurs** | Mesurent des grandeurs physiques | Température, mouvement, lumière |
| **Actionneurs** | Agissent sur l'environnement | Moteur, LED, écran |
| **Microprocesseur** | Traite les données | Arduino, Micro:bit, ESP32 |
| **Interface réseau** | Permet la communication | Wi-Fi, Bluetooth, LoRa |
| **Alimentation** | Fournit l'énergie | Batterie, secteur |

Le capteur observe. L'actionneur agit. Le microcontrôleur, la carte Micro:bit par exemple, décide entre les deux. Sans liaison, Wi-Fi, Bluetooth ou autre, l'objet reste un petit automate local. Sans énergie, rien de tout cela ne tourne.

![Carte Micro:bit - Face](/content/1/microbit.png)
![Carte Micro:bit - Dos](/content/1/microbit-back.png)

Vous croiserez souvent les mêmes capteurs. Une station météo mesure la température et l'humidité. Un accéléromètre et un gyroscope sentent le mouvement et la rotation, c'est ce qui retourne l'écran du téléphone. Un capteur de lumière allume les phares, un microphone écoute pour un assistant vocal.

En face, les actionneurs sont ce que l'objet fait voir ou faire : une LED, un écran, un haut-parleur, un moteur, un relais qui ouvre un circuit, une vanne qui laisse passer l'eau.

## Comment ils se parlent

Tous les objets n'utilisent pas le même réseau. On choisit selon la distance, la quantité de données, et surtout la batterie.

| Protocole | Portée | Consommation | Débit | Usage typique |
|-----------|--------|--------------|-------|---------------|
| **Wi-Fi** | 50-100 m | Élevée | Très haut | Prises, caméras à la maison |
| **Bluetooth** | 10-100 m | Moyenne | Moyen | Montres, écouteurs |
| **LoRaWAN** | 2-15 km | Très faible | Très faible | Compteurs, capteurs agricoles |
| **4G/5G** | Nationale | Élevée | Très haut | Voitures, téléphones |
| **NFC** | Moins de 10 cm | Très faible | Moyen | Paiement, badges |

Le Wi-Fi envoie beaucoup, mais il vide une pile. Le Bluetooth convient aux objets que vous portez, parce qu'ils restent près du téléphone. Le NFC ne porte que sur quelques centimètres : c'est voulu, pour un paiement ou un badge. LoRaWAN fait l'inverse du Wi-Fi. Un compteur d'eau qui envoie une mesure par jour, sur plusieurs kilomètres, n'a pas besoin d'un gros débit. Il a besoin de tenir des années sur une batterie. C'est pour ce genre de cas qu'on le choisit.

## Le trajet d'une mesure

Prenons un chauffage. Le capteur lit 18 °C. Cette valeur part sur le réseau, souvent en Wi-Fi, vers un serveur qui la stocke. Un programme la compare à la consigne, disons 20 °C. Comme il fait trop froid, une commande revient vers l'actionneur, et le chauffage s'allume.

On peut donc suivre la donnée en cinq temps : elle est collectée, transmise, stockée, analysée, puis elle déclenche une action. Si l'une de ces étapes manque, l'objet mesure peut-être, mais il ne sert plus à rien.

## Où on les trouve

À la maison, la domotique règle le confort, la sécurité et parfois la consommation. En santé, une montre suit des constantes, une alerte peut signaler une chute. En ville, l'éclairage public et les feux s'adaptent au trafic, les bennes préviennent quand elles sont pleines. Dans une usine, des capteurs annoncent une panne avant qu'elle n'arrête la chaîne : c'est une partie de ce qu'on appelle l'industrie 4.0. Dans un champ, l'arrosage se déclenche selon l'humidité du sol plutôt que selon une heure fixe.

## L'interface, le morceau que vous voyez

L'objet a beau mesurer tout seul, quelqu'un doit pouvoir regarder les données ou donner un ordre. Cette **interface** peut être une application, un site qui sert de tableau de bord, des boutons sur le boîtier, ou la voix. Ce n'est pas un détail de confort. Sans interface, vous ne savez pas ce que l'objet a décidé à votre place.

<IotInterface />

## Il attend des événements

Un programme de cours s'exécute souvent du début à la fin, puis s'arrête. Un objet connecté, lui, reste allumé. Il tourne dans une boucle et réagit à ce qui arrive : un bouton, une température, un message. On parle de programmation **événementielle**. La forme tient en une phrase : si tel événement se produit, alors fais cette action.

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

Dans cet exemple, la carte ne « finit » jamais. Tant qu'elle est alimentée, elle regarde le bouton A et la température. Le sourire et le message d'alerte ne sont pas au milieu d'une liste d'instructions : ils attendent leur condition.

## Le maillon faible

Ces objets sont souvent mal protégés, parce qu'on les installe et qu'on les oublie. En 2016, le logiciel **Mirai** a pris le contrôle de centaines de milliers de caméras et de routeurs. Les pirates s'en sont servis comme d'une armée, un **botnet**, pour noyer des sites sous les requêtes, dont Twitter et Netflix. La faille n'était pas sophistiquée : beaucoup d'appareils avaient gardé le mot de passe d'usine, souvent `admin` / `admin`.

La vie privée est l'autre enjeu. Une montre sait où vous êtes et à peu près comment vous dormez. Une enceinte entend ce qui se dit dans la pièce. Une caméra filme l'intérieur du logement. Ce ne sont pas des effets secondaires rares : ce sont les données dont ces objets ont besoin pour fonctionner.

Trois réflexes limitent les dégâts. Changez le mot de passe par défaut dès l'installation. Faites les mises à jour, même quand l'objet « marche très bien ». Si la box le permet, placez ces appareils sur un réseau Wi-Fi invité, séparé de l'ordinateur où vous travaillez.
