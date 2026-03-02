---
title: "Architecture : SoC et Processus"
description: "Architecture matérielle (SoC) et Système d'Exploitation (Processus)."
level: terminale
chapter: "Architectures matérielles, OS & Réseaux"
icon: "⚙️"
badgeId: "terminale_archi_os"
---

# ⚙️ Architecture & OS

## 1. Architecture Matérielle : Le SoC

L'architecture classique de Von Neumann séparait CPU, Mémoire et Entrées/Sorties reliés par des bus sur une carte mère.
Aujourd'hui, notamment dans les smartphones et tablettes, on utilise des **SoC (System on Chip)**.

### Qu'est-ce qu'un SoC ?
C'est une puce unique qui intègre **tous** les composants essentiels :
*   CPU (Processeur central)
*   GPU (Processeur graphique)
*   RAM (Mémoire vive)
*   Contrôleurs WiFi/Bluetooth/4G
*   DSP (Traitement du signal, audio/photo)

### Avantages vs Inconvénients
*   ✅ **Performance** : Communication ultra-rapide entre composants (distances réduites).
*   ✅ **Consommation** : Moins d'énergie dissipée (batterie dure plus longtemps).
*   ✅ **Taille** : Gain de place énorme.
*   ❌ **Évolutivité** : Impossible de changer juste la RAM ou le GPU (tout est soudé/gravé ensemble).

## 2. Système d'Exploitation : Gestion des Processus

Un **processus** est un programme en cours d'exécution.
Le système d'exploitation (OS) doit gérer plusieurs processus en même temps (Multitâche) sur un nombre limité de cœurs CPU. C'est l'**ordonnancement** (Scheduling).

### 2.1 États d'un processus
Un processus passe par 3 états principaux :
1.  **Élu (Running)** : Le CPU exécute ses instructions.
2.  **Prêt (Ready)** : Il attend que le CPU se libère.
3.  **Bloqué (Waiting)** : Il attend une ressource externe (lecture disque, frappe clavier, réseau).

### 2.2 L'Interblocage (Deadlock)
Une situation critique où des processus s'attendent mutuellement indéfiniment.

*Exemple* :
*   Processus A tient la ressource `Imprimante` et demande le `Scanner`.
*   Processus B tient la ressource `Scanner` et demande l'`Imprimante`.
*   -> **Blocage total !** Personne ne peut avancer.

Pour éviter cela, l'OS utilise des algorithmes complexes d'allocation de ressources.

---

<ExerciseTabs courseId="terminale_archi_os" courseTitle="Exercices OS">

  <ExerciseSection id="os-ex-1" label="Commandes Unix">
    <Enonce>
    ### Gestion des processus sous Linux
    Quelles commandes permettent de :
    1.  Voir les processus en cours ?
    2.  Tuer un processus bloqué ?
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="os-ex-2" label="Ordonnancement">
    <Enonce>
    ### Round Robin (Tourniquet)
    Imaginez 3 processus P1, P2, P3 prêts. L'OS leur donne le CPU chacun leur tour pendant 10ms (quantum).
    P1 a besoin de 25ms, P2 de 15ms, P3 de 30ms.
    
    Décrivez l'ordre d'exécution.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
