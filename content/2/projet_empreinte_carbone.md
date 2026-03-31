---
title: 'Variables : Calculateur d''Empreinte Carbone'
description: Créer un outil pour estimer l'impact écologique d'un trajet.
level: premiere
chapter: Projets
icon: "\U0001F331"
badgeId: premiere_projet_carbone
prerequisites:
  - projet_gestion_stock
---

# 🌱 Projet - Calculateur d'Empreinte Carbone

L'objectif de ce projet est de créer un programme interactif capable de calculer les émissions de CO2 d'un trajet en fonction du mode de transport choisi. C'est un excellent moyen de pratiquer les **variables**, les **entrées utilisateurs (`input`)**, et les **conditions (`if/elif/else`)**.

## 1. Cahier des Charges

Le programme doit :
1.  Demander à l'utilisateur la distance du trajet en kilomètres.
2.  Demander le mode de transport (Voiture, Train, Avion, Vélo).
3.  Calculer les émissions totales de CO2.
4.  Afficher le résultat avec un message de sensibilisation personnalisé.

### Données de référence (hypoyhétiques pour l'exercice)
*   🚗 **Voiture** : 120 g de CO2 / km
*   ✈️ **Avion** : 250 g de CO2 / km
*   🚄 **Train** : 10 g de CO2 / km
*   🚲 **Vélo** : 0 g de CO2 / km

## 2. Étapes de réalisation

### Étape 1 : Saisie des données
Utilisez la fonction `input()` pour récupérer la distance.
⚠️ **Attention** : `input()` renvoie toujours une chaîne de caractères (`str`). Pensez à convertir la distance en nombre (`float` ou `int`) pour faire des calculs !

```python
# Exemple
distance_str = input("Quelle est la distance en km ? ")
distance = float(distance_str)
```

### Étape 2 : Le Menu de choix
Affichez les options disponibles et demandez à l'utilisateur de choisir (par exemple en tapant 1, 2, 3 ou 4).

### Étape 3 : La Logique (Conditions)
Utilisez une structure conditionnelle pour définir le facteur d'émission.

```python
facteur = 0

if choix == "1":
    # Voiture
    facteur = 120
elif choix == "2":
    # ...
```

### Étape 4 : Calcul et Affichage
Multipliez la distance par le facteur. Si le résultat est en grammes, il peut être judicieux de le convertir en kilogrammes (diviser par 1000) pour l'affichage si la valeur est grande.

## 3. Pour aller plus loin (Bonus) 🚀

*   **Comparateur** : Affichez la différence avec le train si l'utilisateur choisit l'avion ou la voiture ("En prenant le train, vous auriez économisé X kg de CO2").
*   **Aller-Retour** : Demandez si c'est un aller simple ou un aller-retour.
*   **Covoiturage** : Si c'est une voiture, demandez le nombre de passagers et divisez les émissions par ce nombre.

---

<ExerciseTabs courseId="premiere_projet_carbone" courseTitle="Calculateur Carbone">
  <ExerciseSection id="proj-carb-1" label="À vous de jouer !">
    <Enonce>
    À vous de coder ! Suivez les étapes ci-dessus pour réaliser votre propre calculateur.
    N'hésitez pas à ajouter votre touche personnelle (couleurs, messages drôles, etc.).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
