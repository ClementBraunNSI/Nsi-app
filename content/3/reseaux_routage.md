---
title: 'Réseaux : Protocoles de Routage'
description: 'Comment les paquets trouvent leur chemin sur Internet (RIP, OSPF).'
level: TNSI
order: 30
chapter: 'Architectures matérielles, OS & Réseaux'
icon: "globe"
badgeId: terminale_routage
prerequisites:
  - archi_soc
audience: public
---

# Protocoles de routage

Internet est un maillage de réseaux, reliés par des routeurs. Quand un paquet part, aucun routeur ne connaît le trajet complet jusqu'au destinataire. Chaque routeur sait seulement à quel voisin le transmettre. Les **protocoles de routage** servent à établir ces choix et à les tenir à jour.

## La table de routage

Chaque routeur possède une **table de routage**. Pour une adresse, ou plutôt pour un réseau de destination, elle indique l'interface de sortie, ou le voisin à qui remettre le paquet. Si aucune ligne ne correspond, le routeur abandonne le paquet, ou le confie à une route par défaut.

Cette table peut être écrite **à la main** : c'est le routage statique. Il convient à un tout petit réseau, dont les liens ne changent pas. Si un câble est coupé, la table devient fausse jusqu'à ce que quelqu'un la corrige.

Elle peut aussi être **calculée** par les routeurs eux-mêmes : c'est le routage dynamique. Deux protocoles du programme illustrent deux façons très différentes de définir « le meilleur chemin ».

## Le protocole RIP

RIP (*Routing Information Protocol*) est un protocole à **vecteur de distance**. Sa métrique est le **nombre de sauts**, c'est-à-dire le nombre de routeurs à traverser. Un lien, quel que soit son débit, compte pour 1.

Toutes les 30 secondes environ, chaque routeur envoie sa table à ses voisins. Chaque routeur met alors à jour ses distances en ajoutant un saut à celles de ses voisins. Ce protocole a l'avantage d'être simple, mais sa métrique pose problème : RIP préfère un unique lien très lent à deux liens en fibre optique. De plus, au-delà de 15 sauts, le réseau est déclaré injoignable, si bien que RIP ne convient pas aux grands réseaux.

## Le protocole OSPF

OSPF (*Open Shortest Path First*) est un protocole à **état de liens**. Chaque routeur finit par connaître la carte complète du réseau, et pas seulement les distances annoncées par ses voisins. Il calcule ensuite le plus court chemin avec l'algorithme de Dijkstra.

Sa métrique n'est plus le nombre de sauts, mais un **coût**, souvent inversement proportionnel au débit, de la forme $10^8 / \text{débit}$. Une liaison rapide coûte peu et une liaison lente coûte cher. OSPF choisit donc vraiment un chemin rapide, quitte à traverser un routeur de plus. Il demande en revanche plus de calcul et plus de mémoire, puisque chaque routeur garde toute la topologie du réseau.

Le choix entre les deux dépend du réseau. Si tous les liens ont le même débit, compter les sauts suffit. Mais dès que les débits sont très différents, la métrique de RIP donne une image faussée du réseau.

---

<ExerciseTabs courseId="terminale_routage" courseTitle="Exercices Routage">

  <ExerciseSection id="routage-ex-1" label="Comparaison RIP/OSPF" type="lecture">
    <Enonce>
    ### Choix du chemin
    On veut aller de A à B.
    *   Chemin 1 : Passe par R1 (1 saut), débit 56 kbps (très lent).
    *   Chemin 2 : Passe par R2 et R3 (2 sauts), débit 1 Gbps (fibre optique).
    
    1.  Quel chemin choisit RIP ?
    2.  Quel chemin choisit OSPF ?
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
