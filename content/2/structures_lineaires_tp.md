---
title: "TP Piles et Files"
description: "Implémentation de Piles et Files et applications (parenthésage, file d'attente)."
level: premiere
chapter: "Structures de données linéaires"
icon: "📥"
badgeId: "premiere_tp_piles_files"
---


# TP : Implémentation et Applications

## Objectif

Implémenter les structures de données Pile et File en POO et les utiliser pour résoudre des problèmes classiques.

## Partie 1 : Implémentation

!!! question "À faire"
    Implémentez les classes `Pile` et `File` vues en cours.
    Ajoutez une méthode `__str__` pour visualiser le contenu de la structure (ex: `[1, 2, 3]`).

## Partie 2 : Application des Piles - Vérification de parenthèses

On veut vérifier si une expression mathématique est bien parenthésée.
Exemple valide : `(a + (b * c))`
Exemple invalide : `(a + b))`, `((a+b)`, `)a+b(`

**Algorithme :**
1.  Parcourir la chaîne de caractères.
2.  Si on rencontre `(`, on l'empile.
3.  Si on rencontre `)`, on dépile.
    *   Si la pile est vide (rien à dépiler), c'est une erreur (parenthèse fermante en trop).
4.  À la fin, la pile doit être vide (toutes les parenthèses ouvertes ont été fermées).

!!! question "Exercice"
    Écrivez la fonction `verifier_parentheses(expression)` qui retourne `True` ou `False`.

```python
def verifier_parentheses(expression):
    p = Pile()
    for caractere in expression:
        if caractere == '(':
            p.empiler(caractere)
        elif caractere == ')':
            if p.est_vide():
                return False
            p.depiler()
    return p.est_vide()

# Tests
print(verifier_parentheses("(a+b)"))      # True
print(verifier_parentheses("((a+b)*c)"))  # True
print(verifier_parentheses("(a+b))"))     # False
print(verifier_parentheses("((a+b)"))     # False
```

## Partie 3 : Application des Files - Simulation

On veut simuler une file d'attente d'impression.
Des documents arrivent (nom du fichier) et sont mis en file d'attente. L'imprimante traite les documents un par un.

!!! question "Exercice"
    1.  Créez une file `imprimante`.
    2.  Ajoutez ("enfilez") 3 documents : "Doc1.pdf", "Image.jpg", "Rapport.docx".
    3.  Simulez l'impression en défilant les documents un par un et en affichant "Impression de [nom]...".

```python
imprimante = File()
imprimante.enfiler("Doc1.pdf")
imprimante.enfiler("Image.jpg")
imprimante.enfiler("Rapport.docx")

while not imprimante.est_vide():
    doc = imprimante.defiler()
    print(f"Impression de {doc}...")
```
