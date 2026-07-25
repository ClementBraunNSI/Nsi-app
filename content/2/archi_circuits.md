---
title: Circuits électroniques
description: 'Portes logiques, transistors et tables de vérité'
level: premiere
chapter: Architecture matérielle
icon: "\U0001F50C"
badgeId: premiere_circuits
prerequisites:
  - archi_von_neumann
  - donnees_booleens
---

# Circuits électroniques

## Objectifs

- Relier **transistor**, **porte logique** et table de vérité
- Maîtriser NOT, AND, OR, XOR et leurs notations
- Lire une équation logique simple
- Appliquer la logique à un circuit (simulateur IoT)

## Idée clé

Le processeur est un assemblage de **portes logiques**, elles-mêmes réalisées avec des **transistors** (interrupteurs commandés). Chaque porte calcule une fonction booléenne sur des signaux 0/1.

![transistor](transistor.png)

## Du transistor à la porte

- **Transistor** : contrôle le passage du courant
- **Porte logique** : opération booléenne (ET, OU, NON…)
- **Circuit** : combinaison de portes pour une fonction plus riche

À chaque porte on associe une **table de vérité**.

## Portes de base

### NOT — $S = \overline{A}$

| Entrée | Sortie |
| :---: | :---: |
| 0 | 1 |
| 1 | 0 |

![rprnot](repr_not.png)

### AND (et) — $S = A \wedge B$ (aussi $A \cdot B$ ou $A \times B$)

Sortie à 1 **seulement** si toutes les entrées sont à 1.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

![rprand](repr_and.png)

### OR (ou) — $S = A \vee B$ (aussi $A + B$)

Sortie à 1 si **au moins une** entrée est à 1.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

![rpror](repr_or.png)

### XOR (ou exclusif) — $S = A \oplus B$

Sortie à 1 si **exactement une** entrée est à 1.

$$S = \overline{A}B + A\overline{B}$$

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

![rprxor](repr_xor.png)

## Équations logiques

On compose les opérateurs. Priorité usuelle : NON > ET > OU ; les parenthèses clarifient.

Exemple : $S = (A \vee B) \wedge C$ se lit « (A ou B) et C ».

Avec $A=1$, $B=0$, $C=0$ : $(1 \vee 0) \wedge 0 = 1 \wedge 0 = 0$.

## Application : logique combinatoire (IoT)

Simulateur d'alarme : capteurs + porte ET. Quelle combinaison déclenche l'alarme ?

<IotSimulator />

## Piège fréquent

Inverser les symboles : **AND = $\wedge$ (et)**, **OR = $\vee$ (ou)**. Autre erreur : lire $A \vee B \wedge C$ sans parenthèses — le ET est prioritaire, ce n'est pas « (A ou B) et C » sauf si on écrit $(A \vee B) \wedge C$.

## À retenir

- Portes = briques booléennes du CPU
- NOT inverse ; AND = $\wedge$ ; OR = $\vee$ ; XOR = $\oplus$
- Table de vérité = comportement complet de la porte
- Les portes se combinent en équations / circuits
- Priorité : parenthèses > NON > ET > OU
- Un même comportement peut s'écrire de plusieurs façons équivalentes

## Pour s'entraîner

[Exercices — circuits](/cours/2/archi_circuits_exercices)
