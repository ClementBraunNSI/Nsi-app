---
title: 'Exercices : les conditions en Python aux champs'
description: 'Comparaisons, if, else, elif, and et or, pour prendre les décisions de la ferme.'
icon: "sprout"
chapter: Bases de Python
level: particuliers
audience:
  accounts:
    - cdd1d5bd-a779-478a-aa75-7c2fc47576a1
---

Sur une exploitation, on prend sans cesse des décisions : arroser ou non la serre, moissonner aujourd'hui ou attendre, sortir les vaches au pré ou les garder à l'étable. En Python, ces décisions s'écrivent avec des **conditions**. Cette fiche reprend `print`, `input` et les variables de la fiche précédente, et ajoute de quoi faire choisir le programme. Chaque partie commence par une explication et un exemple, puis viennent les exercices, du plus simple au moins simple.

## 1. Comparer deux valeurs

Une comparaison pose une question à laquelle Python répond par `True` (vrai) ou `False` (faux). Ces deux valeurs s'appellent des **booléens** (type `bool`).

| Comparaison | Symbole | Exemple | Résultat |
|---|---|---|---|
| Égal à | `==` | `12 == 12` | `True` |
| Différent de | `!=` | `"blé" != "orge"` | `True` |
| Strictement inférieur | `<` | `25 < 30` | `True` |
| Strictement supérieur | `>` | `25 > 30` | `False` |
| Inférieur ou égal | `<=` | `0 <= 0` | `True` |
| Supérieur ou égal | `>=` | `14 >= 15` | `False` |

Le résultat d'une comparaison se range dans une variable, comme un nombre ou un texte :

```python
temperature = 3
gel = temperature <= 0
print(gel)    # False : il fait 3 degrés, il ne gèle pas
```

Attention à ne pas confondre `=` et `==` : un seul `=` **range** une valeur dans une variable, deux `==` **testent** si deux valeurs sont égales.

<ExerciseTabs courseId="paul-conditions-comparer" courseTitle="Comparer à la ferme">

  <ExerciseSection id="paul-cond-1-1" label="1.1 [Introduction] - Risque de gel" type="python">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Risque de gel
    **Cette nuit, le thermomètre du verger indique -2 degrés. Créer la variable `temperature` qui vaut `-2`, puis ranger dans `gel` le résultat de la comparaison « la température est inférieure ou égale à 0 ». Afficher `gel`.**

    Le programme doit afficher `True` : il gèle bien.

    <PostIt>

    - `<=` : inférieur ou égal
    - `gel = temperature <= 0` : range `True` ou `False` dans `gel`
    - un nombre négatif s'écrit avec le signe moins : `-2`
    - `True` et `False` s'écrivent avec une majuscule, sans guillemets

    </PostIt>

    <Correction>
    ```python
    temperature = -2
    gel = temperature <= 0
    print(gel)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'temperature' in locals(), "La variable 'temperature' n'est pas définie."
assert 'gel' in locals(), "La variable 'gel' n'est pas définie."
assert temperature == -2, "La variable 'temperature' doit valoir -2."
assert isinstance(gel, bool), "'gel' doit contenir le résultat d'une comparaison (True ou False), pas un texte."
assert gel == True, "À -2 degrés, il gèle : 'gel' doit valoir True."
assert "<=" in PROGRAMME, "Utiliser la comparaison <= pour calculer 'gel'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-1-2" label="1.2 [Introduction] - Le rendement du blé" type="python">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Le rendement du blé
    **Cette année, la parcelle de blé a donné 72 quintaux par hectare. L'objectif était d'au moins 70 quintaux, et le record de la ferme est de 85 quintaux. Créer `rendement` (72), puis calculer :**
    - **`objectif_atteint` : le rendement est-il supérieur ou égal à 70 ?**
    - **`record_battu` : le rendement est-il strictement supérieur à 85 ?**

    **Afficher les deux variables.**

    <PostIt>

    - `>=` : supérieur ou égal (« au moins »)
    - `>` : strictement supérieur (« plus que »)
    - une comparaison par variable
    - le programme doit afficher `True` puis `False`

    </PostIt>

    <Correction>
    ```python
    rendement = 72
    objectif_atteint = rendement >= 70
    record_battu = rendement > 85
    print(objectif_atteint)
    print(record_battu)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'rendement' in locals(), "La variable 'rendement' n'est pas définie."
assert 'objectif_atteint' in locals(), "La variable 'objectif_atteint' n'est pas définie."
assert 'record_battu' in locals(), "La variable 'record_battu' n'est pas définie."
assert rendement == 72, "La variable 'rendement' doit valoir 72."
assert isinstance(objectif_atteint, bool) and isinstance(record_battu, bool), "Les deux variables doivent contenir le résultat d'une comparaison (True ou False)."
assert objectif_atteint == True, "72 quintaux, c'est au moins 70 : 'objectif_atteint' doit valoir True."
assert record_battu == False, "72 quintaux ne dépassent pas 85 : 'record_battu' doit valoir False."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-1-3" label="1.3 [Facile] - La race du troupeau" type="python">
    <Enonce>
    ### Exercice 1.3 [Facile] : La race du troupeau
    **Un éleveur de bovins viande a un troupeau de race Charolaise. Créer `race` qui vaut `"Charolaise"`, puis calculer :**
    - **`est_charolaise` : `race` est-elle égale à `"Charolaise"` ?**
    - **`pas_limousine` : `race` est-elle différente de `"Limousine"` ?**

    **Afficher les deux variables.**

    Deux textes sont égaux seulement s'ils ont exactement les mêmes lettres, majuscules comprises : `"charolaise" == "Charolaise"` vaut `False`.

    <PostIt>

    - `==` : est égal à ; `!=` : est différent de
    - `=` range une valeur, `==` compare deux valeurs
    - les textes comparés s'écrivent entre guillemets
    - majuscules et minuscules comptent

    </PostIt>

    <Correction>
    ```python
    race = "Charolaise"
    est_charolaise = race == "Charolaise"
    pas_limousine = race != "Limousine"
    print(est_charolaise)
    print(pas_limousine)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'race' in locals(), "La variable 'race' n'est pas définie."
assert 'est_charolaise' in locals(), "La variable 'est_charolaise' n'est pas définie."
assert 'pas_limousine' in locals(), "La variable 'pas_limousine' n'est pas définie."
assert race == "Charolaise", "La variable 'race' doit valoir \"Charolaise\"."
assert isinstance(est_charolaise, bool) and isinstance(pas_limousine, bool), "Les deux variables doivent contenir le résultat d'une comparaison (True ou False)."
assert est_charolaise == True, "'est_charolaise' doit valoir True."
assert pas_limousine == True, "Une Charolaise n'est pas une Limousine : 'pas_limousine' doit valoir True."
assert "!=" in PROGRAMME, "Utiliser != pour calculer 'pas_limousine'."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

## 2. Agir seulement si : `if`

`if` (« si » en anglais) exécute des instructions **seulement si** une condition est vraie.

```python
humidite = int(input("Humidité du sol (en %) ? "))
if humidite < 30:
    print("Le sol est sec.")
    print("Il faut arroser.")
print("Contrôle terminé.")
```

Trois règles à respecter :

- la ligne du `if` se termine par deux points `:` ;
- les instructions qui dépendent de la condition sont **décalées vers la droite** (4 espaces, ou la touche Tab) : c'est l'**indentation** ;
- la première ligne qui n'est plus décalée ne fait plus partie du `if` : ici, `Contrôle terminé.` s'affiche dans tous les cas.

## 3. Sinon : `else`

`else` (« sinon ») donne les instructions à exécuter quand la condition est fausse. Un des deux blocs est toujours exécuté, jamais les deux.

```python
carburant = int(input("Litres dans le réservoir du tracteur ? "))
if carburant < 20:
    print("Passer à la cuve de gazole.")
else:
    print("Le tracteur peut partir aux champs.")
```

`else` n'a pas de condition : il s'écrit seul, suivi des deux points, au même niveau que le `if`.

Comme dans la fiche précédente, le bouton **Exécuter** pose les questions dans une fenêtre, et le bouton **Vérifier** essaie le programme avec plusieurs réponses préparées à l'avance, pour contrôler chaque cas.

<ExerciseTabs courseId="paul-conditions-if" courseTitle="Si… sinon… aux champs">

  <ExerciseSection id="paul-cond-2-1" label="2.1 [Introduction] - Arroser la serre" type="python">
    <Enonce>
    ### Exercice 2.1 [Introduction] : Arroser la serre
    **Demander l'humidité du sol de la serre (un nombre entier, en %). Si elle est strictement inférieure à 30, afficher `Il faut arroser la serre.` Dans tous les cas, afficher ensuite `Contrôle terminé.`**

    Exemple d'exécution, avec un sol sec :
    ```text
    Humidité du sol (en %) ? 25
    Il faut arroser la serre.
    Contrôle terminé.
    ```

    Avec un sol humide :
    ```text
    Humidité du sol (en %) ? 45
    Contrôle terminé.
    ```

    <PostIt>

    ```python
    if condition:
        instruction_decalee
    instruction_normale
    ```
    - `:` à la fin de la ligne du `if`
    - les lignes décalées dépendent du `if`, les autres non
    - `int(input(...))` : lit un nombre entier

    </PostIt>

    <Correction>
    ```python
    humidite = int(input("Humidité du sol (en %) ? "))
    if humidite < 30:
        print("Il faut arroser la serre.")
    print("Contrôle terminé.")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["25"]
assert "Il faut arroser la serre." in SORTIE, "Avec 25 % d'humidité, afficher : Il faut arroser la serre."
assert SORTIE.strip().splitlines()[-1].strip() == "Contrôle terminé.", "La dernière ligne doit être : Contrôle terminé."
_, sortie = relancer(["45"])
assert "arroser" not in sortie, "Avec 45 % d'humidité, il ne faut pas arroser."
assert "Contrôle terminé." in sortie, "Avec 45 % d'humidité, afficher quand même : Contrôle terminé. (cette ligne ne doit pas être décalée)"
_, sortie = relancer(["30"])
assert "arroser" not in sortie, "Avec 30 % pile, on n'arrose pas : la condition est « strictement inférieure à 30 »."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-2-2" label="2.2 [Facile] - Le plein du tracteur" type="python">
    <Enonce>
    ### Exercice 2.2 [Facile] : Le plein du tracteur
    **Demander combien de litres de gazole il reste dans le réservoir du tracteur. Ranger dans `action` le texte `"faire le plein"` s'il reste moins de 20 litres, et `"partir aux champs"` sinon. Afficher `action`.**

    « Moins de 20 litres » veut dire strictement moins : avec 20 litres pile, le tracteur peut partir.

    <PostIt>

    ```python
    if condition:
        ...
    else:
        ...
    ```
    - `else` s'écrit sans condition, suivi de `:`
    - `if` et `else` sont alignés, leurs blocs sont décalés
    - un seul `print(action)`, après le `if` / `else`

    </PostIt>

    <Correction>
    ```python
    carburant = int(input("Litres dans le réservoir ? "))
    if carburant < 20:
        action = "faire le plein"
    else:
        action = "partir aux champs"
    print(action)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["12"]
assert 'action' in locals(), "La variable 'action' n'est pas définie."
assert action == "faire le plein", "Avec 12 litres : faire le plein."
for litres, attendu in [("20", "partir aux champs"), ("19", "faire le plein"), ("85", "partir aux champs"), ("0", "faire le plein")]:
    autre, _ = relancer([litres])
    assert autre.get("action") == attendu, f"Avec {litres} litres : {attendu}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-2-3" label="2.3 [Facile] - Le blé est-il prêt ?" type="python">
    <Enonce>
    ### Exercice 2.3 [Facile] : Le blé est-il prêt ?
    **Avant de moissonner, l'agriculteur mesure l'humidité du grain. Le blé se récolte quand elle vaut 15 % ou moins ; au-dessus, le grain risque de moisir dans le silo. Demander l'humidité du grain (un nombre entier), puis ranger dans `decision` le texte `"moissonner"` ou `"attendre"`. Afficher `decision`.**

    <PostIt>

    - « 15 % ou moins » : la comparaison est `<=`
    - `if` … `else` : un des deux blocs est toujours exécuté
    - même nom de variable dans les deux blocs : `decision`
    - les textes rangés s'écrivent entre guillemets

    </PostIt>

    <Correction>
    ```python
    humidite = int(input("Humidité du grain (en %) ? "))
    if humidite <= 15:
        decision = "moissonner"
    else:
        decision = "attendre"
    print(decision)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["14"]
assert 'decision' in locals(), "La variable 'decision' n'est pas définie."
assert decision == "moissonner", "Avec 14 % d'humidité : moissonner."
for h, attendu in [("15", "moissonner"), ("16", "attendre"), ("22", "attendre"), ("11", "moissonner")]:
    autre, _ = relancer([h])
    assert autre.get("decision") == attendu, f"Avec {h} % d'humidité : {attendu}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-2-4" label="2.4 [Moyen] - Les boîtes d'œufs" type="python">
    <Enonce>
    ### Exercice 2.4 [Moyen] : Les boîtes d'œufs
    **Au poulailler, les œufs ramassés sont rangés par boîtes de 6. Demander le nombre d'œufs ramassés. Si toutes les boîtes sont pleines, ranger dans `message` le texte `"Toutes les boîtes sont pleines."`, sinon le texte `"Une boîte reste entamée."` Afficher `message`.**

    Toutes les boîtes sont pleines quand il ne reste aucun œuf après le partage par 6. Reprendre le reste `%` de la fiche précédente : `48 % 6` vaut `0`, mais `50 % 6` vaut `2`.

    <PostIt>

    - `a % b` : ce qui reste après le partage de `a` en paquets de `b`
    - « aucun œuf ne reste » : `oeufs % 6 == 0`
    - `==` pour comparer, pas `=`
    - pas d'accent ni de `œ` dans un nom de variable : `oeufs`

    </PostIt>

    <Correction>
    ```python
    oeufs = int(input("Nombre d'œufs ramassés ? "))
    if oeufs % 6 == 0:
        message = "Toutes les boîtes sont pleines."
    else:
        message = "Une boîte reste entamée."
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["48"]
assert 'message' in locals(), "La variable 'message' n'est pas définie."
assert message == "Toutes les boîtes sont pleines.", "Avec 48 œufs (8 boîtes) : Toutes les boîtes sont pleines."
for n, attendu in [("50", "Une boîte reste entamée."), ("6", "Toutes les boîtes sont pleines."), ("13", "Une boîte reste entamée."), ("120", "Toutes les boîtes sont pleines.")]:
    autre, _ = relancer([n])
    assert autre.get("message") == attendu, f"Avec {n} œufs : {attendu}"
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

## 4. Plus de deux cas : `elif`

Quand il y a plus de deux possibilités, `elif` (contraction de « else if », « sinon si ») ajoute une condition à tester.

```python
temperature = int(input("Température dans la serre ? "))
if temperature < 10:
    print("Trop froid : allumer le chauffage.")
elif temperature > 28:
    print("Trop chaud : ouvrir les aérations.")
else:
    print("Température correcte.")
```

Python teste les conditions **dans l'ordre, de haut en bas**, et s'arrête à la première qui est vraie. Il peut y avoir autant de `elif` que nécessaire, et le `else` final, facultatif, traite tous les cas restants.

L'ordre compte : une fois le premier cas éliminé, le `elif` suivant n'a pas besoin de le tester à nouveau. Dans l'exemple, si Python arrive au `elif`, c'est déjà que la température est d'au moins 10 degrés.

<ExerciseTabs courseId="paul-conditions-elif" courseTitle="Plusieurs cas possibles">

  <ExerciseSection id="paul-cond-3-1" label="3.1 [Facile] - La serre" type="python">
    <Enonce>
    ### Exercice 3.1 [Facile] : La serre
    **Demander la température de la serre (un nombre entier). Ranger dans `consigne` :**
    - **`"chauffer"` si elle est strictement inférieure à 10 degrés ;**
    - **`"aérer"` si elle est strictement supérieure à 28 degrés ;**
    - **`"ne rien faire"` dans les autres cas.**

    **Afficher `consigne`.**

    <PostIt>

    ```python
    if condition1:
        ...
    elif condition2:
        ...
    else:
        ...
    ```
    - `elif` a sa propre condition, `else` n'en a pas
    - un seul des trois blocs est exécuté

    </PostIt>

    <Correction>
    ```python
    temperature = int(input("Température dans la serre ? "))
    if temperature < 10:
        consigne = "chauffer"
    elif temperature > 28:
        consigne = "aérer"
    else:
        consigne = "ne rien faire"
    print(consigne)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["5"]
assert 'consigne' in locals(), "La variable 'consigne' n'est pas définie."
assert consigne == "chauffer", "À 5 degrés : chauffer."
for t, attendu in [("32", "aérer"), ("20", "ne rien faire"), ("10", "ne rien faire"), ("28", "ne rien faire"), ("29", "aérer"), ("-3", "chauffer")]:
    autre, _ = relancer([t])
    assert autre.get("consigne") == attendu, f"À {t} degrés : {attendu}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-3-2" label="3.2 [Moyen] - Le calibre des œufs" type="python">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Le calibre des œufs
    **Avant la vente, chaque œuf est classé selon son poids :**

    | Poids de l'œuf | Calibre |
    |---|---|
    | moins de 53 g | `"S"` |
    | de 53 g à moins de 63 g | `"M"` |
    | de 63 g à moins de 73 g | `"L"` |
    | 73 g ou plus | `"XL"` |

    **Demander le poids d'un œuf en grammes (un nombre entier), ranger son calibre dans `calibre` et l'afficher.**

    Grâce à l'ordre des tests, chaque `elif` n'a besoin que d'une seule comparaison : si Python arrive au deuxième test, il sait déjà que l'œuf pèse au moins 53 g.

    <PostIt>

    - tester du plus petit au plus grand : `< 53`, puis `< 63`, puis `< 73`
    - Python s'arrête au premier test vrai
    - le dernier cas (`"XL"`) se traite avec `else`
    - `if` … `elif` … `elif` … `else`

    </PostIt>

    <Correction>
    ```python
    poids = int(input("Poids de l'œuf (en g) ? "))
    if poids < 53:
        calibre = "S"
    elif poids < 63:
        calibre = "M"
    elif poids < 73:
        calibre = "L"
    else:
        calibre = "XL"
    print(calibre)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["58"]
assert 'calibre' in locals(), "La variable 'calibre' n'est pas définie."
assert calibre == "M", "Un œuf de 58 g est de calibre M."
for p, attendu in [("45", "S"), ("52", "S"), ("53", "M"), ("62", "M"), ("63", "L"), ("72", "L"), ("73", "XL"), ("80", "XL")]:
    autre, _ = relancer([p])
    assert autre.get("calibre") == attendu, f"Un œuf de {p} g est de calibre {attendu}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-3-3" label="3.3 [Moyen] - Le pH du sol" type="python">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Le pH du sol
    **L'analyse de sol d'une parcelle donne son pH, un nombre à virgule. Demander ce pH, puis ranger dans `sol` :**
    - **`"acide"` si le pH est strictement inférieur à 6.5 ;**
    - **`"neutre"` s'il est compris entre 6.5 et 7.5 (inclus) ;**
    - **`"basique"` s'il est strictement supérieur à 7.5.**

    **Afficher `sol`. Si le sol est acide, afficher en plus `Prévoir un chaulage.` (un apport de chaux fait remonter le pH).**

    Le pH est un nombre à virgule : le lire avec `float(input(...))` et non `int(...)`.

    <PostIt>

    - `float(input(...))` : lit un nombre à virgule (`6.8`)
    - au clavier aussi, la virgule s'écrit avec un point : `6.8`
    - un bloc décalé peut contenir plusieurs instructions
    - « inclus » : la comparaison utilise `<=`

    </PostIt>

    <Correction>
    ```python
    ph = float(input("pH du sol ? "))
    if ph < 6.5:
        sol = "acide"
    elif ph <= 7.5:
        sol = "neutre"
    else:
        sol = "basique"
    print(sol)
    if sol == "acide":
        print("Prévoir un chaulage.")
    ```

    On peut aussi placer le `print("Prévoir un chaulage.")` directement dans le premier bloc, juste après `sol = "acide"` : les deux solutions sont justes.
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["5.8"]
assert 'sol' in locals(), "La variable 'sol' n'est pas définie."
assert sol == "acide", "Un pH de 5.8 est acide."
assert "Prévoir un chaulage." in SORTIE, "Pour un sol acide, afficher aussi : Prévoir un chaulage."
for v, attendu in [("6.5", "neutre"), ("7", "neutre"), ("7.5", "neutre"), ("7.6", "basique"), ("8.2", "basique"), ("6.4", "acide")]:
    autre, sortie = relancer([v])
    assert autre.get("sol") == attendu, f"Un pH de {v} : {attendu}."
    if attendu != "acide":
        assert "chaulage" not in sortie, f"Un sol {attendu} (pH {v}) n'a pas besoin de chaulage."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

## 5. Combiner des conditions : `and` et `or`

Une décision dépend souvent de plusieurs choses à la fois. Deux mots permettent d'assembler des conditions :

| Mot | Sens | Vrai quand… |
|---|---|---|
| `and` | et | les **deux** conditions sont vraies |
| `or` | ou | **au moins une** des deux conditions est vraie |

```python
temperature = int(input("Température ? "))
pluie = input("Pluie prévue (oui/non) ? ")

if temperature >= 15 and pluie == "non":
    print("Bonne journée pour faner.")

if temperature < 5 or pluie == "oui":
    print("Garder les bêtes à l'abri.")
```

Chaque côté du `and` ou du `or` doit être une comparaison complète : on écrit `pluie == "oui" or pluie == "orage"`, et non `pluie == "oui" or "orage"`.

Le mot `not` (« non ») inverse une condition : `not pluie == "oui"` est vrai quand il ne pleut pas. Il revient au même d'écrire `pluie != "oui"`.

<ExerciseTabs courseId="paul-conditions-logique" courseTitle="Et, ou : décider avec plusieurs critères">

  <ExerciseSection id="paul-cond-4-1" label="4.1 [Moyen] - Les vaches au pré" type="python">
    <Enonce>
    ### Exercice 4.1 [Moyen] : Les vaches au pré
    **Au printemps, l'éleveur sort les vaches au pré seulement si la température atteint au moins 10 degrés et si l'herbe mesure au moins 8 cm. Demander la température, puis la hauteur de l'herbe (deux entiers). Ranger dans `sortie` le texte `"au pré"` si les deux conditions sont remplies, et `"à l'étable"` sinon. Afficher `sortie`.**

    Exemple d'exécution :
    ```text
    Température ? 14
    Hauteur de l'herbe (en cm) ? 6
    à l'étable
    ```

    <PostIt>

    - `condition1 and condition2` : vrai si les deux sont vraies
    - chaque côté du `and` est une comparaison complète
    - « au moins » : `>=`
    - deux `input`, dans l'ordre : température, puis herbe

    </PostIt>

    <Correction>
    ```python
    temperature = int(input("Température ? "))
    herbe = int(input("Hauteur de l'herbe (en cm) ? "))
    if temperature >= 10 and herbe >= 8:
        sortie = "au pré"
    else:
        sortie = "à l'étable"
    print(sortie)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["14", "6"]
assert 'sortie' in locals(), "La variable 'sortie' n'est pas définie."
assert sortie == "à l'étable", "14 degrés mais 6 cm d'herbe : à l'étable."
for t, h, attendu in [("14", "10", "au pré"), ("8", "12", "à l'étable"), ("5", "3", "à l'étable"), ("10", "8", "au pré")]:
    autre, _ = relancer([t, h])
    assert autre.get("sortie") == attendu, f"{t} degrés et {h} cm d'herbe : {attendu}."
assert "and" in PROGRAMME, "Utiliser and pour combiner les deux conditions."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-4-2" label="4.2 [Moyen] - Traiter les vignes" type="python">
    <Enonce>
    ### Exercice 4.2 [Moyen] : Traiter les vignes
    **Un viticulteur veut pulvériser un traitement sur ses vignes. Le traitement est interdit si le vent dépasse 19 km/h (le produit serait emporté hors de la parcelle) ou si de la pluie est prévue (elle laverait le produit). Demander la vitesse du vent (un entier), puis s'il va pleuvoir (réponse `oui` ou `non`). Ranger dans `traitement` le texte `"interdit"` ou `"autorisé"`, puis l'afficher.**

    Exemple d'exécution :
    ```text
    Vent (en km/h) ? 12
    Pluie prévue (oui/non) ? oui
    interdit
    ```

    <PostIt>

    - `condition1 or condition2` : vrai si au moins une est vraie
    - « dépasse 19 » : strictement supérieur, `> 19`
    - la réponse sur la pluie est un texte : pas de `int(...)`
    - comparer avec `pluie == "oui"`

    </PostIt>

    <Correction>
    ```python
    vent = int(input("Vent (en km/h) ? "))
    pluie = input("Pluie prévue (oui/non) ? ")
    if vent > 19 or pluie == "oui":
        traitement = "interdit"
    else:
        traitement = "autorisé"
    print(traitement)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["12", "oui"]
assert 'traitement' in locals(), "La variable 'traitement' n'est pas définie."
assert traitement == "interdit", "Pluie prévue : traitement interdit, même avec peu de vent."
for v, p, attendu in [("12", "non", "autorisé"), ("25", "non", "interdit"), ("30", "oui", "interdit"), ("19", "non", "autorisé"), ("20", "non", "interdit")]:
    autre, _ = relancer([v, p])
    assert autre.get("traitement") == attendu, f"Vent à {v} km/h, pluie : {p} → {attendu}."
assert "or" in PROGRAMME, "Utiliser or pour combiner les deux conditions."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-4-3" label="4.3 [Difficile] - Les pommes au marché" type="python">
    <Enonce>
    ### Exercice 4.3 [Difficile] : Les pommes au marché
    **Au marché, l'arboriculteur vend ses pommes avec un tarif qui baisse quand on en achète beaucoup :**

    | Quantité achetée | Prix du kilo |
    |---|---|
    | moins de 5 kg | 2.50 € |
    | de 5 kg à moins de 10 kg | 2.20 € |
    | 10 kg ou plus | 2.00 € |

    **Demander la quantité achetée en kg (un nombre à virgule). Ranger le prix du kilo dans `tarif`, puis le prix à payer dans `prix`. Afficher `Prix à payer :` suivi de `prix`.**

    Exemple d'exécution :
    ```text
    Quantité de pommes (en kg) ? 6
    Prix à payer : 13.2
    ```

    <PostIt>

    - d'abord choisir le tarif avec `if` / `elif` / `else`
    - ensuite, après les conditions, calculer `prix = quantite * tarif`
    - `float(input(...))` : la quantité peut être à virgule
    - les prix s'écrivent avec un point : `2.50`

    </PostIt>

    <Correction>
    ```python
    quantite = float(input("Quantité de pommes (en kg) ? "))
    if quantite < 5:
        tarif = 2.50
    elif quantite < 10:
        tarif = 2.20
    else:
        tarif = 2.00
    prix = quantite * tarif
    print("Prix à payer :", prix)
    ```

    Le calcul de `prix` est écrit une seule fois, après les conditions : c'est plus court que de le répéter dans chaque bloc.
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["6"]
assert 'tarif' in locals(), "La variable 'tarif' n'est pas définie."
assert 'prix' in locals(), "La variable 'prix' n'est pas définie."
assert abs(tarif - 2.20) < 0.001, "Pour 6 kg, le tarif est de 2.20 € le kilo."
assert abs(prix - 13.2) < 0.001, "6 kg à 2.20 € : 13.2 €."
assert "Prix à payer" in SORTIE, "Afficher : Prix à payer : suivi du prix."
for q, t, p in [("3", 2.50, 7.5), ("4.9", 2.50, 12.25), ("5", 2.20, 11.0), ("9.5", 2.20, 20.9), ("10", 2.00, 20.0), ("12.5", 2.00, 25.0)]:
    autre, _ = relancer([q])
    assert abs(autre.get("tarif", 0) - t) < 0.001, f"Pour {q} kg, le tarif est de {t:.2f} € le kilo."
    assert abs(autre.get("prix", 0) - p) < 0.001, f"Pour {q} kg, le prix à payer est {p} €."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="paul-cond-4-4" label="4.4 [Difficile] - Le jour de la moisson" type="python">
    <Enonce>
    ### Exercice 4.4 [Difficile] : Le jour de la moisson
    **On reprend l'exercice 2.3, en tenant compte aussi de la météo : la moissonneuse ne sort pas sous la pluie. Demander l'humidité du grain (un entier), puis s'il pleut (`oui` ou `non`). Ranger dans `decision` :**
    - **`"moissonner"` si l'humidité vaut 15 % ou moins et qu'il ne pleut pas ;**
    - **`"attendre la fin de la pluie"` s'il pleut ;**
    - **`"attendre que le grain sèche"` dans les autres cas.**

    **Afficher `decision`.**

    Avant d'écrire le code, se demander dans quel ordre tester les cas : s'il pleut, la décision est toujours la même, quelle que soit l'humidité.

    <PostIt>

    - `and` et `elif` peuvent s'utiliser ensemble
    - Python s'arrête au premier test vrai : l'ordre des tests compte
    - deux `input` : humidité (entier), puis pluie (texte)
    - essayer les 4 cas à la main avec **Exécuter** avant de vérifier

    </PostIt>

    <Correction>
    ```python
    humidite = int(input("Humidité du grain (en %) ? "))
    pluie = input("Il pleut (oui/non) ? ")
    if humidite <= 15 and pluie == "non":
        decision = "moissonner"
    elif pluie == "oui":
        decision = "attendre la fin de la pluie"
    else:
        decision = "attendre que le grain sèche"
    print(decision)
    ```

    On peut aussi tester la pluie en premier, ce qui évite le `and` :

    ```python
    if pluie == "oui":
        decision = "attendre la fin de la pluie"
    elif humidite <= 15:
        decision = "moissonner"
    else:
        decision = "attendre que le grain sèche"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
ENTREES = ["14", "non"]
assert 'decision' in locals(), "La variable 'decision' n'est pas définie."
assert decision == "moissonner", "Grain à 14 % et pas de pluie : moissonner."
for h, p, attendu in [("14", "oui", "attendre la fin de la pluie"), ("18", "oui", "attendre la fin de la pluie"), ("18", "non", "attendre que le grain sèche"), ("15", "non", "moissonner"), ("16", "non", "attendre que le grain sèche")]:
    autre, _ = relancer([h, p])
    assert autre.get("decision") == attendu, f"Grain à {h} %, pluie : {p} → {attendu}."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
