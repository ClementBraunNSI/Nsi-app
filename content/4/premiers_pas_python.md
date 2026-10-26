---
title: Premiers pas en Python
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: bts_python_intro
meta: 'Variables, Conditions, Fonctions, Boucles et Listes'
prerequisites:
  - introduction_cybersecurite
audience: public
---

<ExerciseTabs courseId="bts_python_intro" courseTitle="Badge Premiers Pas en Python">

<ExerciseSection id="python-variables-1" label="1.0 [Introduction] - Variables & Affichage : le cours" type="lecture">
<Enonce>

## Variables, affichage, saisie

`print` écrit dans le terminal. On peut lui passer plusieurs valeurs, séparées par des virgules : il les affiche à la suite, avec un espace entre elles.

```python
print("Hello World!")

prenom = "Maya"
print("Bonjour", prenom)
```

L'interpréteur ci-dessous exécute ce qui est tapé, sans quitter la page. Changer le message, relancer, et regarder ce qui sort.

<Admonition type="experiment" title="Tester son code en direct !">
Utiliser l'interpréteur ci-dessous pour tester les commandes Python sans quitter la page. Essayer de modifier le message !
</Admonition>

<PythonPlayground initialCode="print('Hello NSI !')
prenom = 'Maya'
print('Bonjour', prenom)" />

`input` pose une question et renvoie toujours une chaîne, un `str`, même quand la personne a tapé des chiffres. On range cette chaîne dans une variable pour s'en resservir. Pour calculer avec, on la convertit : `int` vers un entier, `float` vers un décimal. `str` fait le chemin inverse, d'un nombre vers une chaîne.

```python
# Demande de l'âge à l'utilisateur
age = input("Quel est votre âge ? ")

# l'utilisateur remplit 19
print(age)  # '19'
type(age)   # str

# convertir en entier
age = int(age)
```

Tant que `age` est la chaîne `'19'`, on peut l'afficher et la coller à une autre chaîne. On ne peut pas lui ajouter 1. Après `int(age)`, c'est l'entier 19, et le calcul devient possible. Oublier la conversion est la première erreur de ce chapitre : le programme ne se plaint pas à l'`input`, il se plaint à l'opération suivante.

</Enonce>
</ExerciseSection>

<ExerciseSection id="sio-py-1-1" label="1.1 [Introduction] - Mon premier message" type="python">
  <Enonce>

  ### Exercice 1.1 : Mon premier message
  **Créer un programme qui affiche "Bienvenue en Python !" dans le terminal.**

  <Correction>
  ```python
  print("Bienvenue en Python !")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert SORTIE.strip() == "Bienvenue en Python !", "Le programme affiche exactement : Bienvenue en Python !"
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-1-2" label="1.2 [Introduction] - Afficher mon prénom" type="python">
  <Enonce>

  ### Exercice 1.2 : Afficher mon prénom
  **Créer une variable `prenom` avec son prénom, puis l'afficher avec `print()`.**

  <Correction>
  ```python
  prenom = "Alice"
  print(prenom)
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert 'prenom' in globals() and isinstance(prenom, str) and prenom.strip() != "", "La variable prenom contient un prénom (une chaîne)."
  assert prenom in SORTIE, "Le programme affiche le prénom."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-1-3" label="1.3 [Introduction] - Dire bonjour" type="python">
  <Enonce>

  ### Exercice 1.3 : Dire bonjour
  **Demander le prénom de l'utilisateur avec `input()`, puis afficher "Bonjour" suivi de son prénom.**

  <Correction>
  ```python
  prenom = input("Quel est votre prénom ? ")
  print("Bonjour", prenom)
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["Maya"]
  assert "Bonjour" in SORTIE and "Maya" in SORTIE, "Pour la saisie Maya, afficher Bonjour Maya."
  variables, sortie = relancer(["Tom"])
  assert "Bonjour" in sortie and "Tom" in sortie, "Pour la saisie Tom, afficher Bonjour Tom."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-1-4" label="1.4 [Introduction] - Mon âge" type="python">
  <Enonce>

  ### Exercice 1.4 : Mon âge
  **Demander l'âge de l'utilisateur et afficher "Vous avez X ans" (où X est l'âge saisi).**

  <Correction>
  ```python
  age = input("Quel est votre âge ? ")
  print("Vous avez " + age + " ans")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["19"]
  assert "Vous avez 19 ans" in " ".join(SORTIE.split()), "Pour 19, afficher : Vous avez 19 ans"
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-1-5" label="1.5 [Introduction] - Deux informations" type="python">
  <Enonce>

  ### Exercice 1.5 : Deux informations
  **Demander le prénom et la ville de l'utilisateur, puis afficher les deux informations dans une seule phrase.**

  <Correction>
  ```python
  prenom = input("Votre prénom ? ")
  ville = input("Votre ville ? ")
  print("Je m'appelle " + prenom + " et j'habite " + ville)
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["Maya", "Lille"]
  derniere = SORTIE.strip().splitlines()[-1]
  assert "Maya" in derniere and "Lille" in derniere, "Le prénom et la ville apparaissent dans une seule phrase, sur la même ligne."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-1-6" label="1.6 [Introduction] - Animal préféré" type="python">
  <Enonce>

  ### Exercice 1.6 : Animal préféré
  **Demander l'animal préféré de l'utilisateur, le stocker dans une variable, puis afficher "Mon animal préféré est" suivi de l'animal.**

  <Correction>
  ```python
  animal = input("Votre animal préféré ? ")
  print("Mon animal préféré est " + animal)
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["renard"]
  assert "Mon animal préféré est renard" in " ".join(SORTIE.split()), "Pour renard, afficher : Mon animal préféré est renard"
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="python-conditions-2" label="2.0 [Facile] - Conditions : le cours" type="lecture">
<Enonce>

## Choisir selon une condition

Un programme qui fait toujours la même chose ne décide rien. `if` n'exécute le bloc indenté que lorsque la condition est vraie. Les deux-points annoncent le bloc. L'indentation le délimite : en Python, le décalage n'est pas décoratif, c'est la syntaxe.

```python
age = 18
if age >= 18:
    print("Vous êtes majeur")
```

`else` prend le cas restant, quand la condition est fausse. Un seul des deux blocs s'exécute.

```python
age = 15

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
```

Dès qu'il y a plus de deux issues, `elif` teste une condition suivante, seulement si les précédentes ont échoué. L'ordre compte. Une note de 17 satisfait aussi `>= 14` et `>= 12`. Si le test le plus exigeant n'est pas écrit en premier, il ne sera jamais atteint.

```python
note = 14

if note >= 16:
    print("Très bien")
elif note >= 14:
    print("Bien")
elif note >= 12:
    print("Assez bien")
elif note >= 10:
    print("Passable")
else:
    print("Insuffisant")
```

| Opérateur | Signification | Exemple |
| :---: | :--- | :--- |
| `>` | supérieur | `3 > 1` |
| `<` | inférieur | `3 < 1` |
| `>=` | supérieur ou égal | `3 >= 1` |
| `<=` | inférieur ou égal | `3 <= 1` |
| `==` | égal à | `3 == 1` |
| `!=` | différent de | `3 != 1` |

`=` affecte, `==` compare. `if age = 18` n'est pas une condition. C'est une erreur.

`and` exige que les deux côtés soient vrais. `or` se contente d'un seul. `not` inverse.

```python
age = 20
permis = True

if age >= 18 and permis == True:
    print("Vous pouvez conduire")
```

```python
jour = "samedi"

if jour == "samedi" or jour == "dimanche":
    print("C'est le week-end !")
```

```python
pluie = False

if not pluie:
    print("On peut sortir sans parapluie")
```

`permis == True` se simplifie souvent en `if permis`, puisque la variable est déjà un booléen. Les deux formes disent la même chose. Autant lire la plus courte une fois qu'elle ne surprend plus.

</Enonce>
</ExerciseSection>

<ExerciseSection id="sio-py-2-1" label="2.1 [Facile] - Comparaison de deux nombres" type="python">
  <Enonce>

  ### Exercice 2.1 : Comparaison de deux nombres
  **Demander deux nombres à l'utilisateur et afficher lequel est le plus grand. Si les deux nombres sont égaux, afficher "Les nombres sont égaux".**

  <Correction>
  ```python
  a = int(input("Premier nombre ? "))
  b = int(input("Deuxième nombre ? "))
  if a > b:
      print("Le plus grand est", a)
  elif b > a:
      print("Le plus grand est", b)
  else:
      print("Les nombres sont égaux")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  import re as _re
  def _nombres(texte):
      return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
  ENTREES = ["3", "8"]
  assert _nombres(SORTIE.strip().splitlines()[-1]) == [8], "Pour 3 et 8, afficher que le plus grand est 8."
  variables, sortie = relancer(["9", "2"])
  assert _nombres(sortie.strip().splitlines()[-1]) == [9], "Pour 9 et 2, le plus grand est 9."
  variables, sortie = relancer(["4", "4"])
  assert "Les nombres sont égaux" in sortie, "Pour 4 et 4, afficher : Les nombres sont égaux"
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-2-2" label="2.2 [Facile] - Vérification de longueur" type="python">
  <Enonce>

  ### Exercice 2.2 : Vérification de longueur
  **Demander un mot à l'utilisateur. Si le mot contient plus de 5 lettres, afficher "Mot long", sinon afficher "Mot court".**
  *Indice : `len(s)` renvoie la longueur de la chaîne `s`.*

  <Correction>
  ```python
  mot = input("Entrez un mot : ")
  if len(mot) > 5:
      print("Mot long")
  else:
      print("Mot court")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["renard"]
  assert SORTIE.strip().endswith("Mot long"), "renard a 6 lettres : Mot long."
  variables, sortie = relancer(["lapin"])
  assert sortie.strip().endswith("Mot court"), "lapin a 5 lettres, pas plus : Mot court."
  variables, sortie = relancer(["chat"])
  assert sortie.strip().endswith("Mot court"), "chat : Mot court."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-2-3" label="2.3 [Facile] - Catégorie d'âge" type="python">
  <Enonce>

  ### Exercice 2.3 : Catégorie d'âge
  **Demander l'âge de l'utilisateur et afficher sa catégorie : 0-12 : Enfant ; 13-17 : Adolescent ; 18-59 : Adulte ; 60+ : Senior.**

  <Correction>
  ```python
  age = int(input("Âge ? "))
  if age <= 12:
      print("Enfant")
  elif age <= 17:
      print("Adolescent")
  elif age <= 59:
      print("Adulte")
  else:
      print("Senior")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["12"]
  assert SORTIE.strip().endswith("Enfant"), "12 ans : Enfant."
  for age, categorie in (("0", "Enfant"), ("13", "Adolescent"), ("17", "Adolescent"), ("18", "Adulte"), ("59", "Adulte"), ("60", "Senior"), ("85", "Senior")):
      variables, sortie = relancer([age])
      assert sortie.strip().endswith(categorie), age + " ans : " + categorie + "."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-2-4" label="2.4 [Facile] - Calculatrice de moyenne" type="python">
  <Enonce>

  ### Exercice 2.4 : Calculatrice de moyenne
  **Demander deux notes à l'utilisateur et calculer leur moyenne. Si la moyenne ≥ 10 : afficher "Vous passez en classe supérieure" ; sinon : afficher "Vous devez redoubler".**

  <Correction>
  ```python
  a = float(input("Note 1 ? "))
  b = float(input("Note 2 ? "))
  m = (a + b) / 2
  if m >= 10:
      print("Vous passez en classe supérieure")
  else:
      print("Vous devez redoubler")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["12", "9"]
  assert SORTIE.strip().endswith("Vous passez en classe supérieure"), "Moyenne 10.5 : Vous passez en classe supérieure"
  variables, sortie = relancer(["10", "10"])
  assert sortie.strip().endswith("Vous passez en classe supérieure"), "Moyenne 10 : Vous passez en classe supérieure"
  variables, sortie = relancer(["8", "11"])
  assert sortie.strip().endswith("Vous devez redoubler"), "Moyenne 9.5 : Vous devez redoubler"
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-2-5" label="2.5 [Facile] - Prix du billet de train" type="python">
  <Enonce>

  ### Exercice 2.5 : Prix du billet de train
  **Demander l'âge de l'utilisateur et la distance du trajet (km). Calculer le prix avec : base = distance × 0.20€ ; enfant (< 12) : −50% ; senior (≥ 65) : −30% ; si distance > 200 : −10€ supplémentaires. Afficher le prix final.**

  <Correction>
  ```python
  age = int(input("Âge ? "))
  dist = float(input("Distance (km) ? "))
  prix = dist * 0.20
  if age < 12:
      prix = prix * 0.5
  elif age >= 65:
      prix = prix * 0.7
  if dist > 200:
      prix = prix - 10
  if prix < 0:
      prix = 0
  print("Prix:", prix)
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  import re as _re
  def _nombres(texte):
      return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
  ENTREES = ["30", "100"]
  assert abs(_nombres(SORTIE.strip().splitlines()[-1])[-1] - 20) < 0.01, "30 ans, 100 km : 20 €."
  for saisies, prix in ((["10", "100"], 10), (["70", "300"], 32), (["30", "250"], 40), (["65", "100"], 14)):
      variables, sortie = relancer(saisies)
      assert abs(_nombres(sortie.strip().splitlines()[-1])[-1] - prix) < 0.01, saisies[0] + " ans, " + saisies[1] + " km : " + str(prix) + " €."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="python-fonctions-3" label="3.0 [Moyen] - Fonctions : le cours" type="lecture">
<Enonce>

## Ranger un geste dans une fonction

Une **fonction** est un bloc qu'on nomme pour le rappeler. Elle évite de recopier le même code, et elle donne un nom au geste : `dire_bonjour` se lit mieux que trois `print` perdus au milieu du script. On la définit avec `def`, on l'appelle par son nom suivi de parenthèses.

```python
def dire_bonjour():
    print("Bonjour !")
    print("Comment allez-vous ?")

dire_bonjour()
```

Sans l'appel, la fonction existe et ne s'exécute pas. Définir n'est pas lancer.

Un **paramètre** est une valeur que l'appel fournit. Le même `saluer` sert pour Alice et pour Bob. Plusieurs paramètres se séparent par des virgules, et l'ordre de l'appel est l'ordre de la définition.

```python
def dire_bonjour(prenom):
    print("Bonjour", prenom)

dire_bonjour("Alice")
dire_bonjour("Bob")
```

```python
def additionner(a, b):
    resultat = a + b
    print("La somme est :", resultat)

additionner(5, 3)
```

`print` montre une valeur. Il ne la rend pas au reste du programme. `return` la renvoie : l'appel peut la stocker, la passer à une autre fonction, s'en servir dans un calcul. Une fonction qui affiche et une fonction qui calcule ne jouent pas le même rôle. On préfère calculer dans la fonction, et afficher là où l'on décide de montrer le résultat.

```python
def additionner(a, b):
    resultat = a + b
    return resultat

somme = additionner(10, 20)
print(somme)  # 30
```

```python
def calculer_double(nombre):
    return nombre * 2

resultat = calculer_double(5)
print("Le double est :", resultat)
```

</Enonce>
</ExerciseSection>

<ExerciseSection id="sio-py-3-1" label="3.1 [Moyen] - Ma première fonction" type="python">
  <Enonce>

  ### Exercice 3.1 : Ma première fonction
  **Créer une fonction `afficher_message()` qui affiche "Bienvenue dans mon programme !". Appeler cette fonction 3 fois.**

  <Correction>
  ```python
  def afficher_message():
      print("Bienvenue dans mon programme !")

  afficher_message()
  afficher_message()
  afficher_message()
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert callable(globals().get("afficher_message")), "La fonction afficher_message n'est pas définie."
  assert SORTIE.count("Bienvenue dans mon programme !") == 3, "La fonction est appelée 3 fois : le message apparaît 3 fois."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-3-2" label="3.2 [Moyen] - Fonction avec paramètre" type="python">
  <Enonce>

  ### Exercice 3.2 : Fonction avec paramètre
  **Créer une fonction `saluer(nom)` qui prend un nom et affiche "Bonjour" suivi du nom. Appeler avec différents noms.**

  <Correction>
  ```python
  def saluer(nom):
      print("Bonjour", nom)

  saluer("Alice")
  saluer("Bob")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  import io, contextlib
  def _sortie(fonction, *arguments):
      tampon = io.StringIO()
      with contextlib.redirect_stdout(tampon):
          valeur = fonction(*arguments)
      return valeur, tampon.getvalue()
  _, texte = _sortie(saluer, "Zoé")
  assert " ".join(texte.split()) == "Bonjour Zoé", "saluer('Zoé') affiche : Bonjour Zoé"
  assert SORTIE.count("Bonjour") >= 2, "Le programme appelle saluer avec au moins deux noms."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-3-3" label="3.3 [Moyen] - Calcul du carré" type="python">
  <Enonce>

  ### Exercice 3.3 : Calcul du carré
  **Créer une fonction `calculer_carre(nombre)` qui renvoie le carré de `nombre`. Demander un entier, utiliser la fonction et afficher le résultat.**

  <Correction>
  ```python
  def calculer_carre(nombre):
      return nombre * nombre

  n = int(input("Nombre ? "))
  print(calculer_carre(n))
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["7"]
  assert calculer_carre(5) == 25 and calculer_carre(-3) == 9 and calculer_carre(0) == 0, "calculer_carre renvoie le carré : 25, 9, 0."
  assert "49" in SORTIE, "Pour la saisie 7, afficher 49."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-3-4" label="3.4 [Moyen] - Vérification de parité" type="python">
  <Enonce>

  ### Exercice 3.4 : Vérification de parité
  **Créer une fonction `est_pair(nombre)` qui renvoie `True` si le nombre est pair et `False` sinon. Demander un nombre et afficher s'il est pair ou impair.**
  *Rappel : pair si `nombre % 2 == 0`.*

  <Correction>
  ```python
  def est_pair(nombre):
      return nombre % 2 == 0

  n = int(input("Nombre ? "))
  if est_pair(n):
      print("Pair")
  else:
      print("Impair")
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  ENTREES = ["8"]
  assert est_pair(4) is True and est_pair(7) is False and est_pair(0) is True, "est_pair renvoie True pour 4 et 0, False pour 7."
  assert SORTIE.strip().endswith("Pair"), "Pour 8, afficher Pair."
  variables, sortie = relancer(["7"])
  assert sortie.strip().endswith("Impair"), "Pour 7, afficher Impair."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-3-5" label="3.5 [Moyen] - Calcul de prix TTC" type="python">
  <Enonce>

  ### Exercice 3.5 : Calcul de prix TTC
  **Créer une fonction `calculer_ttc(prix_ht, taux_tva)` qui renvoie le prix TTC (HT × (1 + taux/100)). Demander les valeurs et afficher le prix TTC.**

  <Correction>
  ```python
  def calculer_ttc(prix_ht, taux_tva):
      return prix_ht * (1 + taux_tva / 100)

  ht = float(input("Prix HT ? "))
  tva = float(input("Taux TVA (%) ? "))
  print(calculer_ttc(ht, tva))
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  import re as _re
  def _nombres(texte):
      return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
  ENTREES = ["100", "20"]
  assert abs(calculer_ttc(100, 20) - 120) < 1e-9, "calculer_ttc(100, 20) vaut 120."
  assert abs(calculer_ttc(50, 5.5) - 52.75) < 1e-9, "calculer_ttc(50, 5.5) vaut 52.75."
  assert abs(_nombres(SORTIE.strip().splitlines()[-1])[-1] - 120) < 0.01, "Pour 100 € HT et 20 %, afficher 120."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-3-6" label="3.6 [Moyen] - Calculatrice complète" type="python">
  <Enonce>

  ### Exercice 3.6 : Calculatrice complète
  **Créer `addition`, `soustraction`, `multiplication`, `division` puis une fonction `calculatrice()` qui demande deux nombres et une opération, appelle la fonction appropriée et affiche le résultat.**

  <Correction>
  ```python
  def addition(a, b):
      return a + b

  def soustraction(a, b):
      return a - b

  def multiplication(a, b):
      return a * b

  def division(a, b):
      return a / b

  def calculatrice():
      a = float(input("Nombre 1 ? "))
      b = float(input("Nombre 2 ? "))
      op = input("Opération (+, -, *, /) ? ")
      if op == "+":
          print(addition(a, b))
      elif op == "-":
          print(soustraction(a, b))
      elif op == "*":
          print(multiplication(a, b))
      elif op == "/":
          print(division(a, b))
      else:
          print("Opération inconnue")

  calculatrice()
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  import re as _re
  def _nombres(texte):
      return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
  ENTREES = ["6", "3", "*"]
  assert addition(2, 3) == 5 and soustraction(2, 3) == -1, "addition et soustraction renvoient le résultat."
  assert multiplication(4, 2.5) == 10 and division(7, 2) == 3.5, "multiplication et division renvoient le résultat."
  assert abs(_nombres(SORTIE.strip().splitlines()[-1])[-1] - 18) < 0.01, "calculatrice() avec 6, 3 et * affiche 18."
  variables, sortie = relancer(["9", "2", "/"])
  assert abs(_nombres(sortie.strip().splitlines()[-1])[-1] - 4.5) < 0.01, "9 / 2 affiche 4.5."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="python-boucles-4" label="4.0 [Avancé] - Boucles : le cours" type="lecture">
<Enonce>

## Répéter

`for` parcourt une suite. `range(debut, fin)` produit les entiers de `debut` inclus à `fin` exclu : `range(1, 6)` donne 1, 2, 3, 4, 5. Un troisième argument est le pas. On parcourt aussi une liste directement : la variable de boucle prend chaque valeur, l'une après l'autre.

```python
# Parcourir une séquence de nombres de 1 à 5
for i in range(1, 6):
    print(i)

# Parcourir une liste
animaux = ["renard", "lapin", "hibou"]
for a in animaux:
    print(a)
```

`while` répète tant que la condition reste vraie. Il faut que quelque chose, dans le corps, la rende fausse un jour. Ici, `compteur` augmente. S'il n'augmentait pas, la condition `compteur < 3` resterait vraie, et la boucle ne s'arrêterait pas.

```python
# Répéter tant qu'une condition est vraie
compteur = 0
while compteur < 3:
    print("tour", compteur)
    compteur += 1
```

`break` sort de la boucle tout de suite. `continue` saute le reste du tour et passe à l'itération suivante. Dans l'exemple, les pairs sont sautés, et l'arrivée à 5 arrête tout. On affiche donc 1 et 3.

```python
for i in range(1, 10):
    if i == 5:
        break      # Arrête la boucle
    if i % 2 == 0:
        continue   # Passe à l'itération suivante
    print(i)
```

On prend `for` quand on sait quoi parcourir. On prend `while` quand l'arrêt dépend d'une condition qu'on ne sait pas compter à l'avance, une saisie, une valeur qui décroît.

</Enonce>
</ExerciseSection>

<ExerciseSection id="sio-py-4-1" label="4.1 [Avancé] - 1 à 100" type="python">
  <Enonce>

  ### Exercice 4.1 : 1 à 100
  **Écrire une fonction `liste_de_1_a_100()` qui renvoie la liste des nombres de 1 à 100.**

  <Correction>
  ```python
  def liste_de_1_a_100():
      nombres = []
      for i in range(1, 101):
          nombres.append(i)
      return nombres
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert liste_de_1_a_100() == list(range(1, 101)), "La liste va de 1 à 100 inclus."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-2" label="4.2 [Avancé] - Table de multiplication" type="python">
  <Enonce>

  ### Exercice 4.2 : Table de multiplication
  **Écrire une fonction `table_multiplication(n)` qui renvoie une liste de 10 chaînes sous la forme `"i x n = produit"` pour `i` allant de 1 à 10.** Par exemple, la première chaîne de `table_multiplication(7)` est `"1 x 7 = 7"`.

  <Correction>
  ```python
  def table_multiplication(n):
      lignes = []
      for i in range(1, 11):
          lignes.append(str(i) + " x " + str(n) + " = " + str(i * n))
      return lignes
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  t = table_multiplication(7)
  assert len(t) == 10, "La liste contient 10 chaînes."
  assert t[0] == "1 x 7 = 7" and t[9] == "10 x 7 = 70", "Première chaîne : 1 x 7 = 7, dernière : 10 x 7 = 70."
  assert table_multiplication(3)[4] == "5 x 3 = 15", "table_multiplication(3) contient 5 x 3 = 15."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-3" label="4.3 [Avancé] - Somme de 1 à 100" type="python">
  <Enonce>

  ### Exercice 4.3 : Somme de 1 à 100
  **Écrire une fonction `somme_1_a_100()` qui renvoie la somme des entiers de 1 à 100.**

  <Correction>
  ```python
  def somme_1_a_100():
      somme = 0
      for i in range(1, 101):
          somme = somme + i
      return somme
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert somme_1_a_100() == 5050, "La somme des entiers de 1 à 100 vaut 5050."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-4" label="4.4 [Avancé] - Pairs 1..100" type="python">
  <Enonce>

  ### Exercice 4.4 : Pairs 1..100
  **Écrire une fonction `pairs_1_a_100()` qui renvoie la liste des nombres pairs entre 1 et 100.**

  <Correction>
  ```python
  def pairs_1_a_100():
      pairs = []
      for i in range(1, 101):
          if i % 2 == 0:
              pairs.append(i)
      return pairs
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert pairs_1_a_100() == list(range(2, 101, 2)), "Les pairs de 2 à 100, dans l'ordre."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-5" label="4.5 [Avancé] - Compter les voyelles" type="python">
  <Enonce>

  ### Exercice 4.5 : Compter les voyelles
  **Écrire une fonction `compter_voyelles(chaine)` qui renvoie le nombre de voyelles dans `chaine`.**
  *Indice : utiliser un ensemble comme `voyelles = "aeiouyAEIOUY"`.*

  <Correction>
  ```python
  def compter_voyelles(chaine):
      voyelles = "aeiouyAEIOUY"
      total = 0
      for lettre in chaine:
          if lettre in voyelles:
              total = total + 1
      return total
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert compter_voyelles("bonjour") == 3, "bonjour contient 3 voyelles."
  assert compter_voyelles("Python") == 2, "Python contient 2 voyelles (y et o)."
  assert compter_voyelles("AEIOUY") == 6, "Les majuscules comptent."
  assert compter_voyelles("") == 0, "Chaîne vide : 0."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-6" label="4.6 [Avancé] - Inverser une chaîne" type="python">
  <Enonce>

  ### Exercice 4.6 : Inverser une chaîne
  **Écrire une fonction `inverser_chaine(chaine)` qui renvoie `chaine` inversée.**
  *Indice : l'opérateur + permet de mettre 2 chaînes de caractères à la suite.*
  ```python
  chaine1 = "bonjour"
  chaine2 = "au revoir"
  print(chaine1 + chaine2)  # bonjourau revoir
  print(chaine2 + chaine1)  # au revoirbonjour
  ```

  <Correction>
  ```python
  def inverser_chaine(chaine):
      resultat = ""
      for lettre in chaine:
          resultat = lettre + resultat
      return resultat
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert inverser_chaine("bonjour") == "ruojnob", "bonjour inversé : ruojnob."
  assert inverser_chaine("") == "", "Chaîne vide : chaîne vide."
  assert inverser_chaine("a") == "a", "Une lettre reste identique."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-7" label="4.7 [Avancé] - Somme des chiffres" type="python">
  <Enonce>

  ### Exercice 4.7 : Somme des chiffres
  **Écrire une fonction `somme_chiffres(n)` qui renvoie la somme des chiffres de l'entier `n`.**

  <Correction>
  ```python
  def somme_chiffres(n):
      somme = 0
      while n > 0:
          somme = somme + n % 10
          n = n // 10
      return somme
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert somme_chiffres(1234) == 10, "1 + 2 + 3 + 4 = 10."
  assert somme_chiffres(1005) == 6, "1 + 0 + 0 + 5 = 6."
  assert somme_chiffres(9) == 9 and somme_chiffres(0) == 0, "9 donne 9, 0 donne 0."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-8" label="4.8 [Avancé] - Jusqu'au premier négatif" type="python">
  <Enonce>

  ### Exercice 4.8 : Jusqu'au premier négatif
  **Écrire une fonction `compter_positifs_avant_negatif(entiers)` qui parcourt la liste `entiers` (ex: `[1,5,2,-5,1,2,6,-9]`) et retourne le nombre de valeurs lues avant de rencontrer le premier négatif (ou la longueur si aucun négatif).**

  <Correction>
  ```python
  def compter_positifs_avant_negatif(entiers):
      compteur = 0
      for valeur in entiers:
          if valeur < 0:
              return compteur
          compteur = compteur + 1
      return compteur
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert compter_positifs_avant_negatif([1, 5, 2, -5, 1, 2, 6, -9]) == 3, "Trois valeurs avant -5."
  assert compter_positifs_avant_negatif([1, 2]) == 2, "Aucun négatif : la longueur de la liste."
  assert compter_positifs_avant_negatif([-1, 4]) == 0, "Le premier est négatif : 0."
  assert compter_positifs_avant_negatif([]) == 0, "Liste vide : 0."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-9" label="4.9 [Avancé] - Multiples de 3" type="python">
  <Enonce>

  ### Exercice 4.9 : Multiples de 3
  **Écrire une fonction `multiples_de_trois(start, count)` qui renvoie une liste de `count` nombres : `start`, puis `start × 3`, puis `start × 9`, et ainsi de suite.** Par exemple `multiples_de_trois(2, 4)` renvoie `[2, 6, 18, 54]`.

  <Correction>
  ```python
  def multiples_de_trois(start, count):
      resultat = []
      valeur = start
      for i in range(count):
          resultat.append(valeur)
          valeur = valeur * 3
      return resultat
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert multiples_de_trois(2, 4) == [2, 6, 18, 54], "multiples_de_trois(2, 4) renvoie [2, 6, 18, 54]."
  assert multiples_de_trois(1, 1) == [1], "multiples_de_trois(1, 1) renvoie [1]."
  assert multiples_de_trois(5, 0) == [], "count vaut 0 : liste vide."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-10" label="4.10 [Avancé] - Divisions par 2" type="python">
  <Enonce>

  ### Exercice 4.10 : Divisions par 2
  **Écrire une fonction `nb_divisions_par_2(n)` qui renvoie le nombre de fois où `n` est divisible par 2 (division entière) jusqu'à devenir strictement inférieur à 2.**

  <Correction>
  ```python
  def nb_divisions_par_2(n):
      compteur = 0
      while n >= 2:
          n = n // 2
          compteur = compteur + 1
      return compteur
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert nb_divisions_par_2(8) == 3, "8, 4, 2, 1 : 3 divisions."
  assert nb_divisions_par_2(10) == 3, "10, 5, 2, 1 : 3 divisions."
  assert nb_divisions_par_2(2) == 1 and nb_divisions_par_2(1) == 0, "2 : 1 division ; 1 : aucune."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-11" label="4.11 [Avancé] - Diviseurs et primalité" type="python">
  <Enonce>

  ### Exercice 4.11 : Diviseurs et primalité
  **Écrire une fonction `diviseurs_propres(n)` qui renvoie la liste croissante des diviseurs de `n` (hors 1 et `n`). Puis écrire `est_premier(n)` qui renvoie `True` si `n` est premier.** 1 n'est pas premier ; 2 l'est.

  <Correction>
  ```python
  def diviseurs_propres(n):
      diviseurs = []
      for d in range(2, n):
          if n % d == 0:
              diviseurs.append(d)
      return diviseurs

  def est_premier(n):
      return n >= 2 and len(diviseurs_propres(n)) == 0
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert diviseurs_propres(12) == [2, 3, 4, 6], "Diviseurs propres de 12 : [2, 3, 4, 6]."
  assert diviseurs_propres(7) == [], "7 n'a pas de diviseur propre."
  assert est_premier(7) is True and est_premier(2) is True, "7 et 2 sont premiers."
  assert est_premier(12) is False and est_premier(1) is False, "12 et 1 ne sont pas premiers."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-12" label="4.12 [Avancé] - Conjecture de Syracuse" type="python">
  <Enonce>

  ### Exercice 4.12 : Conjecture de Syracuse
  **Écrire une fonction `sequence_syracuse(n)` qui renvoie la liste des termes de la suite de Syracuse en partant de `n` jusqu'à 1 (si pair: `n // 2`, sinon: `3*n + 1`).**

  <Correction>
  ```python
  def sequence_syracuse(n):
      termes = [n]
      while n != 1:
          if n % 2 == 0:
              n = n // 2
          else:
              n = 3 * n + 1
          termes.append(n)
      return termes
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert sequence_syracuse(6) == [6, 3, 10, 5, 16, 8, 4, 2, 1], "Syracuse de 6 : [6, 3, 10, 5, 16, 8, 4, 2, 1]."
  assert sequence_syracuse(1) == [1], "Syracuse de 1 : [1]."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-13" label="4.13 [Avancé] - Occurrences d'un caractère" type="python">
  <Enonce>

  ### Exercice 4.13 : Occurrences d'un caractère
  **Écrire une fonction `compter_occurrences_caractere(chaine, c)` qui renvoie le nombre d'occurrences de `c` dans `chaine` en parcourant la chaîne caractère par caractère.**

  <Correction>
  ```python
  def compter_occurrences_caractere(chaine, c):
      total = 0
      for caractere in chaine:
          if caractere == c:
              total = total + 1
      return total
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert compter_occurrences_caractere("banane", "a") == 2, "banane contient 2 fois a."
  assert compter_occurrences_caractere("banane", "z") == 0 and compter_occurrences_caractere("", "a") == 0, "Absent : 0."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-14" label="4.14 [Avancé] - Supprimer un caractère" type="python">
  <Enonce>

  ### Exercice 4.14 : Supprimer un caractère
  **Écrire une fonction `supprimer_caractere(chaine, c)` qui renvoie une nouvelle chaîne sans aucune occurrence de `c`.**

  <Correction>
  ```python
  def supprimer_caractere(chaine, c):
      resultat = ""
      for caractere in chaine:
          if caractere != c:
              resultat = resultat + caractere
      return resultat
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert supprimer_caractere("banane", "a") == "bnne", "banane sans a : bnne."
  assert supprimer_caractere("abc", "z") == "abc", "Caractère absent : chaîne inchangée."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-15" label="4.15 [Avancé] - Doubler chaque caractère" type="python">
  <Enonce>

  ### Exercice 4.15 : Doubler chaque caractère
  **Écrire une fonction `doubler_caracteres(chaine)` qui renvoie une chaîne où chaque caractère de `chaine` est répété deux fois (ex: `"abc" -> "aabbcc"`).**

  <Correction>
  ```python
  def doubler_caracteres(chaine):
      resultat = ""
      for caractere in chaine:
          resultat = resultat + caractere + caractere
      return resultat
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert doubler_caracteres("abc") == "aabbcc", "abc donne aabbcc."
  assert doubler_caracteres("") == "", "Chaîne vide : chaîne vide."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-4-16" label="4.16 [Avancé] - Alterner majuscules/minuscules" type="python">
  <Enonce>

  ### Exercice 4.16 : Alterner majuscules/minuscules
  **Écrire une fonction `alterner_casse(chaine)` qui renvoie la chaîne avec le caractère d'indice 0 en majuscule, celui d'indice 1 en minuscule, et ainsi de suite.** Par exemple `alterner_casse("renard")` renvoie `"ReNaRd"`.

  <Correction>
  ```python
  def alterner_casse(chaine):
      resultat = ""
      for i in range(len(chaine)):
          if i % 2 == 0:
              resultat = resultat + chaine[i].upper()
          else:
              resultat = resultat + chaine[i].lower()
      return resultat
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert alterner_casse("renard") == "ReNaRd", "renard donne ReNaRd."
  assert alterner_casse("PYTHON") == "PyThOn", "PYTHON donne PyThOn."
  assert alterner_casse("") == "", "Chaîne vide : chaîne vide."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="python-listes-5" label="5.0 [Difficile] - Listes & Tuples : le cours" type="lecture">
<Enonce>

## Listes et tuples

Une **liste** garde plusieurs valeurs dans l'ordre, sous un seul nom. L'indice commence à 0. L'indice `-1` désigne le dernier élément, sans qu'on ait à calculer `len` soi-même. `len` donne le nombre d'éléments.

```python
# Création
notes = [12, 15, 9, 18]

# Accès par indice
premiere = notes[0]   # 12
derniere = notes[-1]  # 18

# Longueur
taille = len(notes)   # 4

# Parcours par valeur
for n in notes:
    print(n)

# Parcours par indice
for i in range(len(notes)):
    print(i, notes[i])

# Compréhension de liste
carres = [x*x for x in range(5)]  # [0,1,4,9,16]
```

On parcourt par valeur quand seule la note compte. On parcourt par indice quand on a aussi besoin de la position. La compréhension de liste construit une nouvelle liste en une expression : ici, les carrés de 0 à 4.

Les méthodes modifient souvent la liste sur place. `append` ajoute un élément à la fin. `extend` ajoute ceux d'une autre liste. `insert` place un élément à un indice, et décale le reste. `remove` retire la première occurrence d'une valeur. `pop` retire et renvoie, par défaut le dernier, ou celui de l'indice donné. `count` et `index` interrogent sans modifier. `sort` et `reverse` réordonnent. Le découpage `liste[2:5]` fabrique une nouvelle liste, de l'indice 2 inclus à l'indice 5 exclu. `liste[::-1]` la renverse.

```python
liste = [3, 1, 4]

# Ajouter / étendre / insérer
liste.append(2)             # [3, 1, 4, 2]
liste.extend([5, 6])        # [3, 1, 4, 2, 5, 6]
liste.insert(1, 99)         # [3, 99, 1, 4, 2, 5, 6]

# Retirer / dépiler
liste.remove(99)            # supprime la première occurrence de 99
x = liste.pop()             # retire et retourne le dernier élément
y = liste.pop(2)            # retire à l'indice 2

# Compter / trouver indice
c = liste.count(3)          # nombre d'occurrences de 3
i = liste.index(4)          # première position de 4

# Trier / inverser
liste.sort()                # tri croissant
liste.sort(reverse=True)    # tri décroissant
liste.reverse()             # inversion

# Découpage (slicing)
milieu = liste[2:5]
inverse = liste[::-1]

# Copie (pour éviter les alias)
copie1 = liste[:]           # copie par slicing
copie2 = liste.copy()       # copie
```

Une liste est **mutable**. `autre = liste` ne copie pas : les deux noms désignent le même objet, et modifier l'un modifie l'autre. `liste[:]` ou `liste.copy()` fabrique une liste distincte. On copie quand on veut trier ou filtrer sans perdre l'original.

Un **tuple** se parcourt et s'indexe comme une liste. Il est **immuable** : on ne peut pas remplacer un élément, ni l'`append`. On s'en sert pour une valeur qui ne doit pas bouger, des coordonnées, une paire qu'on rend depuis une fonction.

```python
coord = (10, 20)
x = coord[0]  # 10
y = coord[1]  # 20
# coord[0] = 99  # Erreur : tuple immuable
```

</Enonce>
</ExerciseSection>

<ExerciseSection id="sio-py-5-1" label="5.1 [Difficile] - Somme des éléments" type="python">
  <Enonce>

  ### Exercice 5.1 : Somme des éléments
  **Écrire une fonction `somme_elements(liste)` qui renvoie la somme des éléments de `liste`.**

  <Correction>
  ```python
  def somme_elements(liste):
      somme = 0
      for valeur in liste:
          somme = somme + valeur
      return somme
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert somme_elements([1, 2, 3]) == 6 and somme_elements([]) == 0, "Somme de [1, 2, 3] : 6 ; liste vide : 0."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-2" label="5.2 [Difficile] - Compter les pairs" type="python">
  <Enonce>

  ### Exercice 5.2 : Compter les pairs
  **Écrire une fonction `compter_pairs(liste)` qui renvoie le nombre d'éléments pairs dans `liste`.**

  <Correction>
  ```python
  def compter_pairs(liste):
      total = 0
      for valeur in liste:
          if valeur % 2 == 0:
              total = total + 1
      return total
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert compter_pairs([1, 2, 3, 4, 6]) == 3 and compter_pairs([]) == 0, "[1, 2, 3, 4, 6] contient 3 pairs."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-3" label="5.3 [Difficile] - Longueurs des chaînes" type="python">
  <Enonce>

  ### Exercice 5.3 : Longueurs des chaînes
  **Écrire une fonction `longueur_chaines(liste)` qui renvoie une nouvelle liste contenant la longueur de chaque chaîne de `liste`.**

  <Correction>
  ```python
  def longueur_chaines(liste):
      return [len(chaine) for chaine in liste]
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert longueur_chaines(["a", "abc", ""]) == [1, 3, 0], "Longueurs de ['a', 'abc', ''] : [1, 3, 0]."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-4" label="5.4 [Difficile] - Produit des éléments" type="python">
  <Enonce>

  ### Exercice 5.4 : Produit des éléments
  **Écrire une fonction `produit_elements(liste)` qui renvoie le produit des éléments ; pour une liste vide, renvoyer `1`.**

  <Correction>
  ```python
  def produit_elements(liste):
      produit = 1
      for valeur in liste:
          produit = produit * valeur
      return produit
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert produit_elements([2, 3, 4]) == 24, "Produit de [2, 3, 4] : 24."
  assert produit_elements([]) == 1, "Liste vide : 1."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-5" label="5.5 [Difficile] - Occurrences" type="python">
  <Enonce>

  ### Exercice 5.5 : Occurrences
  **Écrire une fonction `compter_occurrences(liste, valeur)` qui renvoie le nombre d'occurrences de `valeur` dans `liste`.**

  <Correction>
  ```python
  def compter_occurrences(liste, valeur):
      total = 0
      for element in liste:
          if element == valeur:
              total = total + 1
      return total
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert compter_occurrences([1, 2, 1, 1], 1) == 3 and compter_occurrences([], 1) == 0, "[1, 2, 1, 1] contient 3 fois 1."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-6" label="5.6 [Difficile] - Inverser une liste" type="python">
  <Enonce>

  ### Exercice 5.6 : Inverser une liste
  **Écrire une fonction `inverser_liste(liste)` qui renvoie une nouvelle liste avec les éléments dans l'ordre inverse.**

  <Correction>
  ```python
  def inverser_liste(liste):
      return liste[::-1]
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  l = [1, 2, 3]
  assert inverser_liste(l) == [3, 2, 1], "[1, 2, 3] inversée : [3, 2, 1]."
  assert l == [1, 2, 3], "La liste d'origine ne change pas : une nouvelle liste est renvoyée."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-7" label="5.7 [Difficile] - Concaténation" type="python">
  <Enonce>

  ### Exercice 5.7 : Concaténation
  **Écrire une fonction `concatener_listes(a, b)` qui renvoie une nouvelle liste contenant les éléments de `a` suivis de ceux de `b`.**

  <Correction>
  ```python
  def concatener_listes(a, b):
      return a + b
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  a = [1, 2]
  b = [3]
  assert concatener_listes(a, b) == [1, 2, 3], "[1, 2] puis [3] : [1, 2, 3]."
  assert a == [1, 2] and b == [3], "Les listes d'origine ne changent pas."
  ```
  </Verification>
</ExerciseSection>

<ExerciseSection id="sio-py-5-8" label="5.8 [Difficile] - Premiers éléments" type="python">
  <Enonce>

  ### Exercice 5.8 : Premiers éléments
  **Écrire une fonction `premiers_elements(liste, n)` qui renvoie les `n` premiers éléments de `liste` (ou toute la liste si `n` est plus grand).**

  <Correction>
  ```python
  def premiers_elements(liste, n):
      return liste[:n]
  ```
  </Correction>
  </Enonce>
  <Verification>
  ```python
  assert premiers_elements([1, 2, 3, 4], 2) == [1, 2], "Les 2 premiers de [1, 2, 3, 4] : [1, 2]."
  assert premiers_elements([1, 2], 5) == [1, 2], "n plus grand que la liste : toute la liste."
  assert premiers_elements([1, 2], 0) == [], "n vaut 0 : liste vide."
  ```
  </Verification>
</ExerciseSection>

</ExerciseTabs>
