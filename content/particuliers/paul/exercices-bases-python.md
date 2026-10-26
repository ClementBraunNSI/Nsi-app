---
title: 'Exercices : les bases de Python à la ferme laitière'
description: 'Variables, print, input, nombres et textes, autour du troupeau et de la traite.'
icon: "milk"
chapter: Bases de Python
level: particuliers
audience:
  accounts:
    - cdd1d5bd-a779-478a-aa75-7c2fc47576a1
---

Cette fiche reprend les tout premiers outils de Python avec une exploitation laitière : un troupeau de vaches, la traite du matin et du soir, les bidons de lait. Chaque partie commence par une explication et un exemple, puis viennent les exercices, du plus simple au moins simple.

## 1. Afficher avec `print`

`print` affiche à l'écran ce qui est écrit entre ses parenthèses. Un texte s'écrit entre guillemets ; un nombre s'écrit sans guillemets.

```python
print("La traite commence à 6 heures.")
print(45)
print("Nombre de vaches :", 45)
```

Avec une virgule, `print` affiche plusieurs éléments à la suite, séparés par une espace.

## 2. Ranger une valeur dans une variable

Une variable est une boîte qui porte un nom. Le signe `=` range la valeur de droite dans la boîte de gauche ; ensuite, le nom de la variable suffit pour retrouver la valeur.

```python
vaches = 45                 # un nombre entier (int)
litres_par_vache = 28.5     # un nombre à virgule (float) : on écrit un point, pas une virgule
race = "Prim'Holstein"      # un texte (str), entre guillemets

print(vaches)
print(race)
```

Le nom d'une variable ne contient ni espace ni accent : `litres_matin` et non `litres du matin`.

## 3. Calculer

| Opération | Symbole | Exemple | Résultat |
|---|---|---|---|
| Addition | `+` | `420 + 380` | `800` |
| Soustraction | `-` | `45 - 3` | `42` |
| Multiplication | `*` | `20 * 3` | `60` |
| Division | `/` | `800 / 40` | `20.0` |
| Division entière | `//` | `130 // 40` | `3` |
| Reste de la division | `%` | `130 % 40` | `10` |

Le résultat d'un calcul se range lui aussi dans une variable :

```python
litres_matin = 420
litres_soir = 380
total = litres_matin + litres_soir
print("Lait de la journée :", total, "litres")
```

`//` et `%` servent à remplir des bidons : avec 130 litres et des bidons de 40 litres, `130 // 40` donne 3 bidons pleins et `130 % 40` donne les 10 litres qui restent.

## 4. Manipuler du texte

Deux textes se collent avec `+` : on parle de concaténation. Les espaces ne s'ajoutent pas toutes seules, il faut les écrire dans les guillemets.

```python
nom = "Marguerite"
phrase = "La vache " + nom + " est au pré."
print(phrase)
```

On ne peut pas coller directement un texte et un nombre : `str(...)` transforme d'abord le nombre en texte.

```python
vaches = 45
print("Le troupeau compte " + str(vaches) + " vaches.")
```

Deux outils utiles sur un texte : `len(texte)` donne son nombre de caractères, et `texte.upper()` le recopie en majuscules.

```python
race = "normande"
print(len(race))      # 8
print(race.upper())   # NORMANDE
```

<ExerciseTabs courseId="paul-bases-python" courseTitle="Bases de Python à la ferme laitière">

  <ExerciseSection id="paul-1-1" label="1.1 [Introduction] - Bienvenue à la ferme" type="python">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Bienvenue à la ferme
    **Créer une variable `message` qui contient le texte `"Bienvenue à la ferme laitière"`, puis l'afficher avec `print`.**

    Rappel : un texte s'écrit entre guillemets, et `print(message)` affiche le contenu de la variable.

    <Correction>
    ```python
    message = "Bienvenue à la ferme laitière"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'message' in locals(), "La variable 'message' n'est pas définie."
assert message == "Bienvenue à la ferme laitière", "Le texte doit être exactement : Bienvenue à la ferme laitière"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-1-2" label="1.2 [Introduction] - La fiche de Marguerite" type="python">
    <Enonce>
    ### Exercice 1.2 [Introduction] : La fiche de Marguerite
    **Créer trois variables qui décrivent une vache : `nom` vaut `"Marguerite"`, `age` vaut `6` et `race` vaut `"Montbéliarde"`. Afficher ensuite les trois variables, chacune avec son propre `print`.**

    Attention : `age` est un nombre, il s'écrit donc sans guillemets.

    <Correction>
    ```python
    nom = "Marguerite"
    age = 6
    race = "Montbéliarde"
    print(nom)
    print(age)
    print(race)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nom' in locals(), "La variable 'nom' n'est pas définie."
assert 'age' in locals(), "La variable 'age' n'est pas définie."
assert 'race' in locals(), "La variable 'race' n'est pas définie."
assert nom == "Marguerite", "La variable 'nom' doit valoir \"Marguerite\"."
assert age == 6, "La variable 'age' doit valoir 6."
assert isinstance(age, int), "L'âge est un nombre : il s'écrit sans guillemets."
assert race == "Montbéliarde", "La variable 'race' doit valoir \"Montbéliarde\"."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-1-3" label="1.3 [Introduction] - Le troupeau grandit" type="python">
    <Enonce>
    ### Exercice 1.3 [Introduction] : Le troupeau grandit
    **Le troupeau compte 45 vaches. Créer la variable `vaches` qui vaut `45`. Trois veaux naissent et deviennent des vaches du troupeau : ajouter 3 à `vaches`, puis afficher `"Nombre de vaches :"` suivi de la nouvelle valeur.**

    Pour ajouter 3 à une variable, on écrit `vaches = vaches + 3` : Python calcule d'abord la droite, puis range le résultat dans `vaches`.

    <Correction>
    ```python
    vaches = 45
    vaches = vaches + 3
    print("Nombre de vaches :", vaches)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'vaches' in locals(), "La variable 'vaches' n'est pas définie."
assert vaches == 48, "Après l'arrivée des 3 veaux, 'vaches' doit valoir 48."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-2-1" label="2.1 [Facile] - La traite du jour" type="python">
    <Enonce>
    ### Exercice 2.1 [Facile] : La traite du jour
    **La traite du matin donne 420 litres et celle du soir 380 litres. Créer les variables `litres_matin` et `litres_soir`, calculer leur somme dans la variable `total`, puis afficher `total`.**

    <Correction>
    ```python
    litres_matin = 420
    litres_soir = 380
    total = litres_matin + litres_soir
    print("Lait de la journée :", total, "litres")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'litres_matin' in locals(), "La variable 'litres_matin' n'est pas définie."
assert 'litres_soir' in locals(), "La variable 'litres_soir' n'est pas définie."
assert 'total' in locals(), "La variable 'total' n'est pas définie."
assert litres_matin == 420 and litres_soir == 380, "Les traites valent 420 litres le matin et 380 litres le soir."
assert total == 800, "Le total de la journée doit faire 800 litres."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-2-2" label="2.2 [Facile] - Le lait de chaque vache" type="python">
    <Enonce>
    ### Exercice 2.2 [Facile] : Le lait de chaque vache
    **Ce jour-là, 40 vaches ont donné 800 litres de lait. Créer `total_litres` (800) et `vaches` (40), puis calculer dans `moyenne` le nombre de litres donnés en moyenne par une vache. Afficher `moyenne`.**

    La moyenne s'obtient en divisant le total par le nombre de vaches, avec `/`.

    <Correction>
    ```python
    total_litres = 800
    vaches = 40
    moyenne = total_litres / vaches
    print("Litres par vache :", moyenne)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne' in locals(), "La variable 'moyenne' n'est pas définie."
assert moyenne == 20, "Avec 800 litres pour 40 vaches, la moyenne doit faire 20 litres."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-2-3" label="2.3 [Facile] - Remplir les bidons" type="python">
    <Enonce>
    ### Exercice 2.3 [Facile] : Remplir les bidons
    **La laiterie récupère le lait dans des bidons de 40 litres. Il y a 1250 litres dans la cuve. Créer la variable `lait` (1250), puis calculer :**
    - **`bidons_pleins` : le nombre de bidons complètement remplis ;**
    - **`reste` : le nombre de litres qui restent dans la cuve.**

    Utiliser la division entière `//` et le reste `%`, comme dans l'exemple de la partie 3.

    <Correction>
    ```python
    lait = 1250
    bidons_pleins = lait // 40
    reste = lait % 40
    print(bidons_pleins, "bidons pleins, il reste", reste, "litres")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'bidons_pleins' in locals(), "La variable 'bidons_pleins' n'est pas définie."
assert 'reste' in locals(), "La variable 'reste' n'est pas définie."
assert bidons_pleins == 31, "Avec 1250 litres, on remplit 31 bidons de 40 litres."
assert reste == 10, "Après 31 bidons, il reste 10 litres."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-2-4" label="2.4 [Facile] - Vendre le lait" type="python">
    <Enonce>
    ### Exercice 2.4 [Facile] : Vendre le lait
    **La laiterie paie le lait 0.45 euro le litre. Créer `prix_litre` (0.45) et `litres` (800), puis calculer dans `recette` l'argent gagné avec ces 800 litres. Afficher `recette`.**

    Un nombre à virgule s'écrit avec un point en Python : `0.45`.

    <Correction>
    ```python
    prix_litre = 0.45
    litres = 800
    recette = litres * prix_litre
    print("Recette :", recette, "euros")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'recette' in locals(), "La variable 'recette' n'est pas définie."
assert abs(recette - 360) < 0.001, "800 litres à 0.45 euro font 360 euros."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-3-1" label="3.1 [Moyen] - L'étiquette du collier" type="python">
    <Enonce>
    ### Exercice 3.1 [Moyen] : L'étiquette du collier
    **Chaque vache porte un collier avec une étiquette. Créer `nom` (`"Marguerite"`) et `numero` (`"FR4512"`), puis construire dans `etiquette` le texte `"Vache Marguerite, numéro FR4512"` en collant les morceaux avec `+`. Afficher `etiquette`.**

    Penser aux espaces et à la virgule : ils font partie des textes entre guillemets.

    <Correction>
    ```python
    nom = "Marguerite"
    numero = "FR4512"
    etiquette = "Vache " + nom + ", numéro " + numero
    print(etiquette)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'etiquette' in locals(), "La variable 'etiquette' n'est pas définie."
assert etiquette == "Vache Marguerite, numéro FR4512", "Le texte attendu est : Vache Marguerite, numéro FR4512 (vérifier les espaces et la virgule)."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-3-2" label="3.2 [Moyen] - Une phrase avec un nombre" type="python">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Une phrase avec un nombre
    **Créer `vaches` qui vaut `45`, puis construire dans `phrase` le texte `"La ferme compte 45 vaches."` à partir de la variable `vaches`. Afficher `phrase`.**

    Un nombre ne se colle pas directement à un texte : le transformer d'abord avec `str(vaches)`.

    <Correction>
    ```python
    vaches = 45
    phrase = "La ferme compte " + str(vaches) + " vaches."
    print(phrase)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'vaches' in locals(), "La variable 'vaches' n'est pas définie."
assert 'phrase' in locals(), "La variable 'phrase' n'est pas définie."
assert phrase == "La ferme compte " + str(vaches) + " vaches.", "La phrase doit être construite avec la variable 'vaches'."
assert phrase == "La ferme compte 45 vaches.", "Le texte attendu est : La ferme compte 45 vaches."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-3-3" label="3.3 [Moyen] - Le panneau de la race" type="python">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Le panneau de la race
    **Un panneau à l'entrée de l'étable affiche la race du troupeau en majuscules. Créer `race` qui vaut `"normande"`, puis calculer :**
    - **`panneau` : la race en majuscules, avec `upper()` ;**
    - **`lettres` : le nombre de lettres de la race, avec `len`.**

    **Afficher `panneau` puis `lettres`.**

    <Correction>
    ```python
    race = "normande"
    panneau = race.upper()
    lettres = len(race)
    print(panneau)
    print(lettres)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'panneau' in locals(), "La variable 'panneau' n'est pas définie."
assert 'lettres' in locals(), "La variable 'lettres' n'est pas définie."
assert panneau == "NORMANDE", "Le panneau doit afficher NORMANDE."
assert lettres == 8, "Le mot normande compte 8 lettres."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

## 5. Poser une question avec `input`

`input` affiche une question, attend la réponse tapée au clavier et la renvoie. La réponse se range dans une variable.

```python
prenom = input("Prénom du fermier ? ")
print("Bonjour", prenom)
```

`input` renvoie toujours du texte, même si la réponse est un nombre. Pour calculer avec, il faut la transformer en nombre entier avec `int(...)` :

```python
vaches = int(input("Combien de vaches ? "))
print("Le lendemain, avec un veau de plus :", vaches + 1)
```

Les exercices suivants se lancent avec le bouton **Exécuter** : une fenêtre pose chaque question, il suffit d'y taper la réponse. Ils n'ont pas de vérification automatique, la correction permet de comparer.

<ExerciseTabs courseId="paul-bases-python-input" courseTitle="Questions au fermier">

  <ExerciseSection id="paul-4-1" label="4.1 [Introduction] - Saluer le fermier" type="python">
    <Enonce>
    ### Exercice 4.1 [Introduction] : Saluer le fermier
    **Demander le prénom du fermier avec `input`, puis afficher `Bonjour` suivi de ce prénom.**

    Exemple d'exécution, si le fermier répond Jean :
    ```text
    Prénom du fermier ? Jean
    Bonjour Jean
    ```

    <Correction>
    ```python
    prenom = input("Prénom du fermier ? ")
    print("Bonjour", prenom)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="paul-4-2" label="4.2 [Facile] - Le nom de la vache" type="python">
    <Enonce>
    ### Exercice 4.2 [Facile] : Le nom de la vache
    **Demander le nom d'une vache, puis sa race, et afficher une seule phrase de la forme `Marguerite est une vache de race Montbéliarde.`**

    Construire la phrase avec `+`, comme dans l'exercice 3.1.

    <Correction>
    ```python
    nom = input("Nom de la vache ? ")
    race = input("Race de la vache ? ")
    print(nom + " est une vache de race " + race + ".")
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="paul-4-3" label="4.3 [Moyen] - Litres par vache" type="python">
    <Enonce>
    ### Exercice 4.3 [Moyen] : Litres par vache
    **Demander le nombre de litres traits dans la journée, puis le nombre de vaches traites. Afficher le nombre moyen de litres par vache.**

    Les deux réponses servent à un calcul : les transformer en nombres avec `int(...)`.

    Exemple d'exécution :
    ```text
    Litres traits aujourd'hui ? 900
    Nombre de vaches traites ? 45
    Litres par vache : 20.0
    ```

    <Correction>
    ```python
    litres = int(input("Litres traits aujourd'hui ? "))
    vaches = int(input("Nombre de vaches traites ? "))
    print("Litres par vache :", litres / vaches)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="paul-4-4" label="4.4 [Moyen] - Combien de bidons ?" type="python">
    <Enonce>
    ### Exercice 4.4 [Moyen] : Combien de bidons ?
    **Demander combien de litres contient la cuve. Afficher le nombre de bidons de 40 litres remplis complètement, puis les litres qui restent.**

    Reprendre `//` et `%` de l'exercice 2.3, avec la réponse transformée par `int(...)`.

    Exemple d'exécution :
    ```text
    Litres dans la cuve ? 1250
    Bidons pleins : 31
    Litres restants : 10
    ```

    <Correction>
    ```python
    lait = int(input("Litres dans la cuve ? "))
    print("Bidons pleins :", lait // 40)
    print("Litres restants :", lait % 40)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
