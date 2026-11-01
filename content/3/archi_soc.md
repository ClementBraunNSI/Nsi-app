---
title: "Architecture : SoC et Processus"
description: "Architecture matérielle (SoC) et Système d'Exploitation (Processus)."
level: TNSI
order: 20
chapter: "Architectures matérielles, OS & Réseaux"
icon: "settings"
badgeId: "terminale_archi_os"
prerequisites: []
audience: public
---

# Systèmes sur puce et processus

L'architecture de von Neumann sépare le processeur, la mémoire et les entrées-sorties, reliés par des bus sur une carte mère. Sur un ordinateur de bureau, on peut ainsi changer la barrette de mémoire ou la carte graphique. Un téléphone, lui, ne se démonte pas de cette façon, car il repose sur un **système sur puce** (*System on Chip*).

## Le système sur puce

Un **SoC** rassemble, sur un même circuit intégré, des composants qui occupaient autrefois plusieurs boîtiers. On y trouve le processeur central (CPU), le processeur graphique (GPU), les contrôleurs Wi-Fi, Bluetooth ou cellulaire, et souvent un DSP, un processeur spécialisé dans le traitement du son ou des photos. La mémoire vive se trouve dans le même boîtier, parfois gravée avec le reste, parfois empilée juste au-dessus. Elle ne peut donc pas être retirée comme une barrette.

Comme les distances entre ces blocs sont minuscules, les échanges sont plus rapides et consomment moins d'énergie : la batterie dure plus longtemps, et l'appareil tient dans une poche. En contrepartie, cette intégration réduit l'**évolutivité** : on ne peut pas remplacer seulement la mémoire ou le GPU, et quand l'un d'eux devient insuffisant, il faut changer l'ensemble. Un ordinateur de bureau, avec ses bus et ses connecteurs, prend plus de place et consomme davantage, mais ses composants peuvent évoluer séparément.

## Les processus

Un **processus** est un programme en cours d'exécution. Il comprend le code, mais aussi son état, ses registres et la mémoire qui lui est allouée. Le système d'exploitation en fait tourner plusieurs alors que la puce n'a que quelques cœurs. L'**ordonnancement** décide lequel occupe le processeur, et pendant combien de temps.

Un processus passe par trois états. Il est **élu** quand un cœur exécute ses instructions. Il est **prêt** quand il pourrait s'exécuter, et qu'il attend qu'un cœur se libère. Il est **bloqué** quand il attend autre chose que le processeur, par exemple une lecture sur le disque, une frappe au clavier ou une réponse du réseau. Le remettre parmi les processus prêts avant que cette ressource soit disponible ne le ferait pas avancer.

Le **tourniquet**, ou *round robin*, est un ordonnancement simple. Les processus prêts forment une file. Chacun reçoit le processeur pendant un **quantum**, une durée fixe (par exemple 10 ms). À la fin du quantum, s'il lui reste du travail, il retourne à la fin de la file, à l'état prêt. S'il demande une ressource lente avant la fin, il passe à l'état bloqué, et le processus suivant est élu immédiatement. Ainsi, aucun processus ne garde un cœur jusqu'à la fin de son travail si d'autres sont prêts.

## L'interblocage

L'**interblocage** est une attente circulaire dont personne ne sort. Le processus A tient l'imprimante et demande le scanner. Le processus B tient le scanner et demande l'imprimante. A ne lâchera pas l'imprimante tant qu'il n'a pas le scanner. B ne lâchera pas le scanner tant qu'il n'a pas l'imprimante. Les deux processus restent bloqués indéfiniment, puisque chacun attend une ressource détenue par l'autre.

Le système évite cette situation en contrôlant l'allocation, par exemple en imposant un ordre sur les ressources, ou en refusant une demande qui fermerait un cycle. Il est possible de détecter un interblocage après coup, mais il est plus difficile d'en sortir : il faut retirer une ressource à un processus, et donc annuler une partie de son travail.

<ExerciseTabs courseId="terminale_archi_os" courseTitle="Exercices OS">

  <ExerciseSection id="os-ex-1" label="Commandes Unix" type="lecture">
    <Enonce>
    ### Gestion des processus sous Linux
    Quelles commandes permettent de :
    1.  Voir les processus en cours ?
    2.  Tuer un processus bloqué ?
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="os-ex-2" label="Ordonnancement" type="lecture">
    <Enonce>
    ### Round Robin (Tourniquet)
    Imaginer 3 processus P1, P2, P3 prêts. L'OS leur donne le CPU chacun leur tour pendant 10ms (quantum).
    P1 a besoin de 25ms, P2 de 15ms, P3 de 30ms.
    
    Décrire l'ordre d'exécution.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
