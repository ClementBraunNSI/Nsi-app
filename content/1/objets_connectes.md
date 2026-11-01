---
title: Objets Connectés
description: 'Comprendre l''Internet des Objets (IoT), les capteurs et les protocoles'
level: seconde
chapter: Micro-controleurs
icon: "wifi"
prerequisites: []
audience: public
---

# Objets connectés

> **Définition**
> Un **objet connecté**, ou objet de l'Internet des objets (*Internet of Things*, IoT), est un appareil physique équipé de capteurs, d'actionneurs et d'une connexion réseau. Il collecte des données et les échange par Internet, et il peut parfois agir sur son environnement.

On date souvent le mot de 1999, même si des machines reliées à un réseau existent dès les années 1980. Aujourd'hui, les montres, les enceintes, certaines voitures et une foule de capteurs industriels sont des objets connectés. Ils ne se contentent plus d'être allumés : ils mesurent quelque chose et transmettent ces mesures à d'autres machines.

## Les composants d'un objet connecté

Un objet connecté assemble quelques composants que l'on retrouve presque toujours.

| Composant | Rôle | Exemple |
|-----------|------|----------|
| **Capteurs** | Mesurent des grandeurs physiques | Température, mouvement, lumière |
| **Actionneurs** | Agissent sur l'environnement | Moteur, LED, écran |
| **Microprocesseur** | Traite les données | Arduino, Micro:bit, ESP32 |
| **Interface réseau** | Permet la communication | Wi-Fi, Bluetooth, LoRa |
| **Alimentation** | Fournit l'énergie | Batterie, secteur |

Le capteur mesure, l'actionneur agit, et le microcontrôleur (la carte Micro:bit par exemple) décide de l'action à partir des mesures. Sans liaison réseau, comme le Wi-Fi ou le Bluetooth, l'objet reste un simple automate qui fonctionne seul. Et sans alimentation, bien sûr, rien ne fonctionne.

![Carte Micro:bit - Face](/content/1/microbit.png)
![Carte Micro:bit - Dos](/content/1/microbit-back.png)

Les mêmes capteurs reviennent souvent. Une station météo mesure la température et l'humidité. Un accéléromètre et un gyroscope détectent le mouvement et la rotation : c'est grâce à eux que l'écran du téléphone pivote. Un capteur de lumière peut allumer les phares d'une voiture, et un microphone capte la voix pour un assistant vocal.

Les actionneurs, eux, permettent à l'objet d'afficher quelque chose ou d'agir. Il peut s'agir d'une LED, d'un écran, d'un haut-parleur, d'un moteur, d'un relais qui ouvre un circuit ou d'une vanne qui laisse passer l'eau.

## Les protocoles de communication

Tous les objets n'utilisent pas le même réseau. Le choix dépend de la distance, de la quantité de données à transmettre et surtout de l'autonomie de la batterie.

| Protocole | Portée | Consommation | Débit | Usage typique |
|-----------|--------|--------------|-------|---------------|
| **Wi-Fi** | 50-100 m | Élevée | Très haut | Prises, caméras à la maison |
| **Bluetooth** | 10-100 m | Moyenne | Moyen | Montres, écouteurs |
| **LoRaWAN** | 2-15 km | Très faible | Très faible | Compteurs, capteurs agricoles |
| **4G/5G** | Nationale | Élevée | Très haut | Voitures, téléphones |
| **NFC** | Moins de 10 cm | Très faible | Moyen | Paiement, badges |

Le Wi-Fi transmet beaucoup de données, mais il vide vite une pile. Le Bluetooth convient aux objets portés sur soi, parce qu'ils restent près du téléphone. Le NFC ne porte qu'à quelques centimètres, ce qui est voulu pour un paiement ou un badge. LoRaWAN est à l'opposé du Wi-Fi : il transmet peu de données mais consomme très peu. Il convient par exemple à un compteur d'eau qui envoie une mesure par jour sur plusieurs kilomètres, et qui doit tenir des années sur une batterie.

## Le trajet d'une mesure

Prenons l'exemple d'un chauffage. Le capteur lit 18 °C. Cette valeur part sur le réseau, souvent en Wi-Fi, vers un serveur qui la stocke. Un programme la compare à la consigne, disons 20 °C. Comme il fait trop froid, une commande revient vers l'actionneur, et le chauffage s'allume.

La donnée passe donc par cinq étapes : elle est collectée, transmise, stockée et analysée, puis elle déclenche une action. Si l'une de ces étapes manque, l'objet ne remplit plus son rôle.

## Les domaines d'utilisation

À la maison, la domotique règle le confort, la sécurité et parfois la consommation. En santé, une montre suit certaines constantes et peut signaler une chute. En ville, l'éclairage public et les feux s'adaptent au trafic, et les bennes préviennent quand elles sont pleines. Dans une usine, des capteurs annoncent une panne avant qu'elle n'arrête la chaîne : c'est une partie de ce qu'on appelle l'industrie 4.0. Dans un champ, l'arrosage se déclenche selon l'humidité du sol plutôt que selon une heure fixe.

## L'interface

L'objet a beau mesurer tout seul, quelqu'un doit pouvoir consulter les données ou lui donner un ordre. Cette **interface** peut être une application, un site qui sert de tableau de bord, des boutons sur le boîtier ou une commande vocale. Elle est indispensable, car sans elle l'utilisateur ne peut pas savoir ce que l'objet a décidé à sa place.

<IotInterface />

## La programmation événementielle

Les programmes écrits en cours s'exécutent souvent du début à la fin, puis s'arrêtent. Un objet connecté, lui, reste allumé. Son programme tourne dans une boucle et réagit à ce qui se passe, comme l'appui sur un bouton, un changement de température ou l'arrivée d'un message. On parle de programmation **événementielle**, dont le principe est le suivant : si tel événement se produit, alors telle action est exécutée.

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

Dans cet exemple, le programme ne s'arrête jamais. Tant que la carte est alimentée, elle surveille le bouton A et la température. Le sourire et le message d'alerte ne s'affichent que lorsque leur condition est remplie.

## Sécurité et vie privée

Ces objets sont souvent mal protégés, parce qu'on les installe et qu'on les oublie. En 2016, le logiciel **Mirai** a pris le contrôle de centaines de milliers de caméras et de routeurs. Les pirates s'en sont servis comme d'une armée, un **botnet**, pour noyer des sites sous les requêtes, dont Twitter et Netflix. La faille était pourtant très simple : beaucoup d'appareils avaient gardé le mot de passe d'usine, souvent `admin` / `admin`.

La vie privée est un autre enjeu important. Une montre sait où se trouve son porteur et à peu près comment il dort. Une enceinte entend ce qui se dit dans la pièce. Une caméra filme l'intérieur du logement. Ces données ne sont pas collectées par accident : ces objets en ont besoin pour fonctionner.

Quelques réflexes limitent les risques. Il faut changer le mot de passe par défaut dès l'installation, et faire les mises à jour même quand l'objet fonctionne très bien. Si la box le permet, il est aussi conseillé de placer ces appareils sur un réseau Wi-Fi invité, séparé de l'ordinateur de travail.
