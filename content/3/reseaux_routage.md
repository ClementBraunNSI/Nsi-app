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

Internet est un maillage de réseaux, reliés par des routeurs. Quand un paquet part, aucun routeur ne connaît le trajet complet jusqu'au destinataire. Chacun sait seulement à qui le passer ensuite. Les **protocoles de routage** servent à construire, et à tenir à jour, cette décision.

## La table de routage

Chaque routeur possède une **table de routage**. Pour une adresse, ou plutôt pour un réseau de destination, elle indique l'interface de sortie, ou le voisin à qui remettre le paquet. Sans ligne qui corresponde, le routeur ne devine pas. Il abandonne le paquet, ou il le confie à une route par défaut.

Cette table peut être écrite **à la main**. C'est le routage statique. Il convient à un tout petit réseau, dont les liens ne bougent pas. Si un câble tombe, la table ment jusqu'à ce que quelqu'un la corrige.

Elle peut aussi être **calculée** par les routeurs eux-mêmes. C'est le routage dynamique. Deux protocoles du programme illustrent deux façons très différentes de définir « le meilleur chemin ».

## RIP compte les sauts

RIP (*Routing Information Protocol*) est un protocole à **vecteur de distance**. Sa métrique est le **nombre de sauts** : combien de routeurs reste-t-il à traverser. Un lien, quel que soit son débit, compte pour 1.

Toutes les 30 secondes environ, chaque routeur envoie sa table à ses voisins. Chacun met à jour ses distances en ajoutant un saut. La simplicité est l'avantage. L'inconvénient est dans la métrique : RIP préfère un unique lien très lent à deux liens en fibre. Au-delà de 15 sauts, le réseau est déclaré injoignable. RIP n'est pas fait pour un grand maillage.

## OSPF regarde le débit

OSPF (*Open Shortest Path First*) est un protocole à **état de liens**. Chaque routeur finit par connaître la carte du réseau, pas seulement la distance annoncée par ses voisins. Il calcule ensuite le plus court chemin avec l'algorithme de Dijkstra.

La métrique n'est plus le nombre de sauts. C'est un **coût**, souvent inversement proportionnel au débit, de la forme $10^8 / \text{débit}$. Une liaison rapide coûte peu, une liaison lente coûte cher. OSPF choisit donc vraiment un chemin rapide, quitte à traverser un routeur de plus. Il demande plus de calcul, et plus de mémoire, puisque chaque routeur tient la topologie.

Le choix entre les deux n'est pas une question de mode. Si tous les liens se valent, compter les sauts suffit. Dès que les débits diffèrent beaucoup, la métrique de RIP ment.

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
