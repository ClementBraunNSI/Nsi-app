---
title: "Architecture : SoC et Processus"
description: "Architecture matérielle (SoC) et Système d'Exploitation (Processus)."
level: TNSI
order: 20
chapter: "Architectures matérielles, OS & Réseaux"
icon: "⚙️"
badgeId: "terminale_archi_os"
prerequisites: []
audience: public
---

# Systèmes sur puce et processus

L'architecture de von Neumann sépare le processeur, la mémoire et les entrées-sorties, reliés par des bus sur une carte mère. On peut changer la barrette de mémoire, ou la carte graphique. Un téléphone ne se démonte pas ainsi. Il repose sur un **système sur puce**, un *System on Chip*.

## Tout tenir sur une puce

Un **SoC** rassemble, sur un même circuit intégré, les composants qui faisaient autrefois plusieurs boîtiers. On y trouve le processeur central, le CPU, le processeur graphique, le GPU, les contrôleurs Wi-Fi, Bluetooth ou cellulaire, et souvent un DSP, un processeur spécialisé dans le signal audio ou photo. La mémoire vive est dans le même boîtier, parfois gravée avec le reste, parfois empilée juste au-dessus. Du point de vue de la machine, elle n'est pas une barrette qu'on retire.

Les distances entre ces blocs sont minuscules. Les échanges sont plus rapides, et l'énergie perdue dans les pistes l'est moins : la batterie dure davantage, et l'appareil tient dans une poche. Le prix de cette intégration est l'**évolutivité**. On ne remplace pas la mémoire ou le GPU seuls. Quand l'un vieillit, c'est l'ensemble qu'on change. Un ordinateur de bureau, avec ses bus et ses connecteurs, paie en place et en consommation le droit de faire évoluer les pièces.

## Plusieurs programmes, peu de cœurs

Un **processus** est un programme en cours d'exécution : le code, mais aussi l'état, les registres, la mémoire qui lui est allouée. Le système d'exploitation en fait tourner plusieurs alors que la puce n'a que quelques cœurs. L'**ordonnancement** décide lequel occupe le processeur, et pendant combien de temps.

Un processus passe par trois états. Il est **élu** quand un cœur exécute ses instructions. Il est **prêt** quand il pourrait s'exécuter, et qu'il attend qu'un cœur se libère. Il est **bloqué** quand il attend autre chose que le processeur : une lecture disque, une frappe, une réponse réseau. Le replacer parmi les prêts avant que cette ressource arrive ne le ferait pas avancer.

Le **tourniquet**, ou *round robin*, est un ordonnancement simple. Les processus prêts forment une file. Chacun reçoit le processeur pendant un **quantum**, une durée fixe, par exemple 10 ms. À la fin du quantum, s'il lui reste du travail, il retourne en fin de file, à l'état prêt. S'il demande une ressource lente avant la fin, il passe bloqué, et le suivant est élu tout de suite. Personne ne garde le cœur jusqu'à avoir fini, si d'autres sont prêts.

## Quand chacun attend l'autre

L'**interblocage** est une attente circulaire dont personne ne sort. Le processus A tient l'imprimante et demande le scanner. Le processus B tient le scanner et demande l'imprimante. A ne lâchera pas l'imprimante tant qu'il n'a pas le scanner. B ne lâchera pas le scanner tant qu'il n'a pas l'imprimante. Les deux sont bloqués, et rester prêts ou élus ne changerait rien : la ressource qu'ils attendent est tenue par l'autre.

Le système évite cette situation en contrôlant l'allocation, par exemple en imposant un ordre sur les ressources, ou en refusant une demande qui fermerait un cycle. Détecter l'interblocage après coup est possible. Le défaire l'est moins : il faut retirer une ressource à quelqu'un, donc annuler une partie de son travail.

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
    Imaginez 3 processus P1, P2, P3 prêts. L'OS leur donne le CPU chacun leur tour pendant 10ms (quantum).
    P1 a besoin de 25ms, P2 de 15ms, P3 de 30ms.
    
    Décrivez l'ordre d'exécution.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
