---
title: "Mini-projets de synthèse"
description: "Mobiliser plusieurs notions du programme sur des projets courts"
level: TNSI
order: 250
chapter: Projets
icon: "🛠️"
badgeId: terminale_mini_projets
prerequisites:
  - entrainement_epreuve_pratique
audience: public
---

# Mini-projets de synthèse

Le but de ces quatre mini-projets est de réinvestir plusieurs chapitres du programme sur un travail de 2 à 6 heures.
Chaque sujet ci-dessous se suit comme un projet : données de départ, fonctions à écrire, exemple chiffré, puis fichier à rendre.

On en choisit un. Le programme principal affiche l'exemple du sujet, pour qu'on puisse contrôler le résultat sans tout retaper.

## 1. Réseau de villes 🛣️

Un graphe pondéré relie des villes. Le poids d'une arête est une distance en kilomètres. On calcule un plus court chemin avec l'algorithme de Dijkstra, puis on affiche le trajet et son coût.

Graphe de départ. Les arêtes ne sont pas orientées : Lyon–Paris vaut aussi Paris–Lyon.

| Arête | Distance (km) |
| --- | --- |
| Lyon–Paris | 460 |
| Lyon–Marseille | 310 |
| Paris–Lille | 220 |
| Paris–Marseille | 770 |
| Marseille–Lille | 1000 |

Le plus court chemin de Lyon à Lille passe par Paris : 460 + 220 = 680 km. Lyon–Marseille–Lille vaut 1310 km. Paris–Marseille–Lille n'est pas un chemin de Lyon vers Lille au départ.

```python
graphe = {
    "Lyon": {"Paris": 460, "Marseille": 310},
    "Paris": {"Lyon": 460, "Lille": 220, "Marseille": 770},
    "Marseille": {"Lyon": 310, "Paris": 770, "Lille": 1000},
    "Lille": {"Paris": 220, "Marseille": 1000},
}
```

<ExerciseTabs courseId="term_mini_villes" courseTitle="Réseau de villes">
  <ExerciseSection id="mini-villes-1" label="Le graphe" type="lecture">
    <Enonce>
      Écrivez `voisins(graphe, ville)` qui renvoie le dictionnaire des villes atteignables et de leurs distances. `voisins(graphe, "Lyon")` vaut `{"Paris": 460, "Marseille": 310}`. Ville absente : renvoyez `{}`.

      Écrivez `ajouter_route(graphe, a, b, km)`. Elle ajoute l'arête dans les deux sens. Une distance inférieure ou égale à 0 est refusée : la fonction renvoie `False` et le graphe ne change pas.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="mini-villes-2" label="Dijkstra" type="lecture">
    <Enonce>
      Écrivez `plus_court_chemin(graphe, depart, arrivee)`.

      1. La distance du départ vaut 0, les autres valent l'infini (`float("inf")`).
      2. Tant qu'il reste une ville non figée, choisissez celle dont la distance connue est la plus petite.
      3. Relâchez ses arêtes : si passer par elle raccourcit un voisin, mettez à jour la distance et le prédécesseur.
      4. Reconstruisez la liste des villes de `depart` vers `arrivee` en remontant les prédécesseurs.

      La fonction renvoie le couple `(trajet, cout)`. Sur l'exemple, `plus_court_chemin(graphe, "Lyon", "Lille")` vaut `(["Lyon", "Paris", "Lille"], 680)`.

      *Attention : si `arrivee` n'est pas atteignable, renvoyez `([], float("inf"))`. Ne renvoyez pas un chemin partiel.*

      Affichage attendu :

      ```text
      Lyon → Paris → Lille
      Coût : 680 km
      ```
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `villes.py` : le graphe de l'exemple, `voisins`, `ajouter_route`, `plus_court_chemin`, et un affichage du trajet Lyon–Lille. Commentaire d'en-tête avec le nom et la classe. En quelques lignes sous le résultat, dites pourquoi 680 est meilleur que 1310 : on compare des sommes de poids, pas le nombre de villes.

## 2. Catalogue de véhicules 🚗

Une petite base SQL décrit des véhicules. Une route d'API renvoie du JSON. Une page, ou un script, consulte ce catalogue.

Trois lignes de départ :

| immat | marque | modele | prix_jour | places | etat |
| --- | --- | --- | --- | --- | --- |
| AB-123-CD | Peugeot | 208 | 35 | 5 | disponible |
| EF-456-GH | Yamaha | MT-07 | 45 | 2 | maintenance |
| IJ-789-KL | Fiat | Ducato | 120 | 4 | disponible |

<ExerciseTabs courseId="term_mini_vehicules" courseTitle="Catalogue véhicules">
  <ExerciseSection id="mini-veh-1" label="La base" type="sql">
    <Enonce>
      Écrivez le `CREATE TABLE vehicule` avec les colonnes du tableau. `immat` est la clé primaire. `prix_jour` est un nombre strictement positif, `places` un entier supérieur ou égal à 1, `etat` vaut `disponible`, `maintenance` ou `loue`.

      Insérez les trois lignes. La requête des véhicules disponibles, triés par prix croissant, renvoie la Peugeot 208 (35) puis le Fiat Ducato (120). La Yamaha n'y est pas.

      ```sql
      SELECT immat, marque, modele, prix_jour
      FROM vehicule
      WHERE etat = 'disponible'
      ORDER BY prix_jour;
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="mini-veh-2" label="L'API" type="lecture">
    <Enonce>
      Exposez `GET /vehicules`. Sans paramètre, la réponse est la liste JSON des véhicules disponibles, dans l'ordre de la requête. Avec `?places=4`, seul le Ducato reste : on filtre `places >= 4`.

      Exemple de corps, prix en nombre, pas en texte :

      ```json
      [
        {"immat": "AB-123-CD", "marque": "Peugeot", "modele": "208", "prix_jour": 35, "places": 5}
      ]
      ```

      Une immatriculation inconnue sur `GET /vehicules/ZZ-000-ZZ` répond 404, avec `{"erreur": "Vehicule introuvable"}`. Le catalogue en mémoire ou en base ne change pas.

      L'interface affiche au minimum l'immatriculation, la marque, le modèle et le prix. Un champ de recherche redemande la liste filtrée. On ne reconstruit pas le HTML dans la requête SQL : la requête lit, la page affiche.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Le script SQL (`schema.sql` avec la création, les trois insertions et la requête), le code de la route `GET /vehicules`, et la page ou le script qui affiche la Peugeot et le Ducato. Commentaire d'en-tête avec le nom et la classe.

## 3. Analyse de logs 📜

Un fichier de logs du système est lu ligne à ligne. On en tire des indicateurs, puis on compare deux façons de les calculer.

Les lignes ont cette forme, une par événement :

```text
2026-03-12 08:01:02 INFO demarrage
2026-03-12 08:01:05 WARN disque
2026-03-12 08:02:10 ERROR reseau
2026-03-12 08:02:11 INFO requete
2026-03-12 08:03:40 ERROR disque
2026-03-12 08:04:00 INFO arret
```

Indicateurs attendus sur ce fichier : 6 lignes, 3 `INFO`, 1 `WARN`, 2 `ERROR`. Le mot `disque` apparaît 2 fois. La première erreur est à `08:02:10`.

<ExerciseTabs courseId="term_mini_logs" courseTitle="Analyse de logs">
  <ExerciseSection id="mini-logs-1" label="Une passe" type="lecture">
    <Enonce>
      Écrivez `analyser(chemin)` qui ouvre le fichier et, en une seule lecture, remplit un dictionnaire :

      ```python
      {"lignes": 6, "INFO": 3, "WARN": 1, "ERROR": 2}
      ```

      Une ligne vide est ignorée. Une ligne sans niveau parmi `INFO`, `WARN`, `ERROR` compte dans `lignes` et dans une clé `AUTRE`, sans faire planter la fonction.

      Écrivez `compter_mot(chemin, mot)` qui renvoie le nombre de lignes contenant `mot`. `compter_mot(chemin, "disque")` vaut `2`. La comparaison est exacte sur le mot isolé, pas sur un morceau : `dis` ne compte pas `disque`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="mini-logs-2" label="Deux stratégies" type="lecture">
    <Enonce>
      Deux façons d'obtenir les lignes `ERROR`, dans l'ordre du fichier.

      - Stratégie A : une passe, on ajoute la ligne dès qu'on voit `ERROR`. On lit n lignes une fois.
      - Stratégie B : on charge toutes les lignes, on les trie par l'heure, puis on filtre `ERROR`. Le tri domine.

      Sur le fichier d'exemple, les deux stratégies renvoient les deux lignes d'erreur, d'abord `08:02:10`, puis `08:03:40`. Le fichier est déjà trié : les résultats coïncident. Ils peuvent diverger si une ligne plus tardive est écrite avant une ligne plus ancienne : dites-le dans un commentaire.

      Sous le programme, justifiez les coûts. A est linéaire en le nombre de lignes. B coûte le tri, de l'ordre de n log n, plus la lecture. Pour ce fichier de 6 lignes l'écart ne se voit pas. Dites à partir de quel besoin B devient utile : quand l'ordre du fichier n'est pas l'ordre des heures.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** `logs.py`, le fichier `systeme.log` de l'exemple, les fonctions, l'affichage des indicateurs (6, 3, 1, 2 et le mot `disque`), et le commentaire qui compare les deux stratégies. Commentaire d'en-tête avec le nom et la classe.

## 4. Simulateur d'épreuve pratique 🎲

Une banque de questions est tirée au sort. Un test simple dit si la réponse proposée est celle attendue. Le sujet ne corrige pas une copie entière : il vérifie une réponse contre le jeu d'essai de la question.

Banque minimale, à écrire dans le fichier :

```python
banque = [
    {
        "id": "q1",
        "enonce": "Que renvoie len([1, 2, 2]) ?",
        "reponse": "3",
    },
    {
        "id": "q2",
        "enonce": "Quel algorithme de plus court chemin sur un graphe à poids positifs ?",
        "reponse": "Dijkstra",
    },
    {
        "id": "q3",
        "enonce": "Une clé primaire peut-elle être répétée ? (oui/non)",
        "reponse": "non",
    },
]
```

<ExerciseTabs courseId="term_mini_epreuve" courseTitle="Simulateur">
  <ExerciseSection id="mini-ep-1" label="La banque" type="python">
    <Enonce>
      Écrivez `ajouter_question(banque, identifiant, enonce, reponse)`. Identifiant déjà présent : renvoyez `False`, la banque ne change pas. Sinon ajoutez le dictionnaire et renvoyez `True`.

      Écrivez `tirer(banque, rng)` qui choisit une question. `rng` est un générateur dont vous fixez la graine (`random.Random(0)`), pour que deux lancements avec la même graine donnent la même question. Banque vide : renvoyez `None`.

      Avec la graine 0 et la banque ci-dessus, affichez l'`id` tiré et vérifiez qu'un second appel à `tirer` avec un nouveau `Random(0)` redonne le même `id`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="mini-ep-2" label="Le test" type="lecture">
    <Enonce>
      Écrivez `valider(question, proposition)`. Elle renvoie `True` si `proposition`, après `strip`, est égale à `question["reponse"]`. La comparaison des textes est exacte, majuscules comprises : `dijkstra` ne valide pas `Dijkstra`.

      ```python
      valider(banque[0], "3")    # True
      valider(banque[0], "2")    # False
      valider(banque[1], "Dijkstra")  # True
      ```

      Le programme principal tire une question, affiche l'énoncé, lit une réponse avec `input`, puis affiche `Juste.` ou `À revoir.` selon `valider`. Il affiche aussi, sans saisie, les trois appels ci-dessus, pour qu'on contrôle le fichier sans jouer le dialogue.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** `epreuve.py` : la banque d'au moins trois questions, `ajouter_question`, `tirer`, `valider`, le bloc de tests, et le dialogue. Commentaire d'en-tête avec le nom et la classe.

## 5. Ce qui est regardé sur les quatre sujets

1. Le résultat de l'exemple est celui annoncé (680 km, les deux véhicules disponibles, les compteurs du log, ou les trois `valider`).
2. Les fonctions se relisent : noms stables, cas refusé qui ne modifie pas les données.
3. Le choix d'algorithme est justifié sur l'exemple, pas seulement nommé.
4. Vous pouvez expliquer le déroulement à l'oral, sur votre jeu d'essai.
