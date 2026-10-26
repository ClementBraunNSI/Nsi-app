---
title: 'TP SLAM : Création d''une mini blockchain'
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: bts_sql_blockchain
meta: 'Durée : 4 heures. Objectif : Attaquer, Comprendre, Réparer'
prerequisites:
  - tp_injections_web
audience: public
---

<ExerciseTabs courseId="bts_sql_blockchain" courseTitle="TP Blockchain">

  <ExerciseSection id="tp-blockchain-hashing" label="Partie 1 - Hachage [Introduction]" type="lecture">
    <Enonce>
      ## Objectifs Pédagogiques
      1.  **Cybersécurité :**
          *   Comprendre le hachage (SHA-256) et l'effet avalanche.
          *   Comprendre l'intégrité des données par chaînage de blocs.
          *   Comprendre le principe de "Proof of Work" (Preuve de travail).
      2.  **Programmation (Python) :**
          *   Pratiquer la POO : Classes, Constructeurs, Méthodes d'instance, Méthodes spéciales (`__str__`).
          *   Manipuler des librairies standards (`hashlib`, `time`).
          *   Algorithmie : Boucles de validation et de recherche (minage).

      ---

      ## Introduction : Le Grand Livre Numérique

      Une blockchain est une base de données distribuée et sécurisée. Imaginer un grand cahier où tout le monde peut écrire, mais :
      1.  **Immuable :** Une fois écrit, on ne peut plus effacer ni modifier une ligne sans que cela se voie.
      2.  **Chronologique :** Chaque page est liée à la précédente.
      3.  **Sécurisé :** Pour valider une page, il faut résoudre un problème mathématique complexe.

      Ce TP construit ce mécanisme de zéro.

      ---

      ## Partie 1 : Le Hachage (Les fondations)

      Pour sécuriser la chaîne, il faut une empreinte digitale numérique unique pour chaque bloc. C'est le rôle des fonctions de hachage.

      ### <Icone nom="library" /> Tutoriel : Le module `hashlib`

      En Python, le hachage se fait en 3 étapes strictes :
      1.  **Encoder** la chaîne en octets (`.encode()`).
      2.  **Hacher** avec l'algorithme (`hashlib.sha256()`).
      3.  **Convertir** en hexadécimal pour la lecture (`.hexdigest()`).

      **Exemple complet :**
      ```python
      import hashlib

      texte = "Bonjour BTS SIO"
      # 1. Encodage (String -> Bytes)
      texte_bytes = texte.encode('utf-8')
      # 2. Hachage
      hash_object = hashlib.sha256(texte_bytes)
      # 3. Conversion (Bytes -> Hex String)
      empreinte = hash_object.hexdigest()

      print(empreinte)
      # Résultat : a2c4e... (64 caractères)
      ```

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-1-1" label="1.1 [Introduction] - Premier Hash" type="python">
    <Enonce>
      ### Exercice 1.1 : Premier Hash

      1.  Importer les modules `hashlib` et `time`.
      2.  Créer une fonction `test_hachage()` qui demande une saisie avec `input`, calcule son SHA-256, l'affiche et le renvoie.
      3.  Appeler `test_hachage()` à la fin du programme.

      <Correction>
      ```python
      import hashlib
      import time

      def test_hachage():
          texte = input("Texte à hacher : ")
          empreinte = hashlib.sha256(texte.encode("utf-8")).hexdigest()
          print(empreinte)
          return empreinte

      test_hachage()
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Bonjour BTS SIO"]
    import hashlib
    attendu = hashlib.sha256("Bonjour BTS SIO".encode("utf-8")).hexdigest()
    assert attendu in SORTIE, "Pour Bonjour BTS SIO, afficher son SHA-256 en hexadécimal (64 caractères)."
    variables, sortie = relancer(["renard"])
    assert hashlib.sha256("renard".encode("utf-8")).hexdigest() in sortie, "Le hash dépend de la saisie."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-1-2" label="1.2 [Introduction] - L'Effet Avalanche" type="python">
    <Enonce>
      ### Exercice 1.2 : L'Effet Avalanche

      L'effet avalanche signifie qu'une modification minime de l'entrée change radicalement la sortie.

      1.  Hacher le mot `"Blockchain"` et ranger l'empreinte dans `h1`.
      2.  Hacher le mot `"blockchain"` (minuscule) et ranger l'empreinte dans `h2`.
      3.  Afficher les deux empreintes, puis le nombre de positions où elles ont le même caractère, dans `communs`.

      Se ressemblent-elles ? *Réponse attendue : non, elles sont totalement différentes.*

      <Correction>
      ```python
      import hashlib

      h1 = hashlib.sha256("Blockchain".encode("utf-8")).hexdigest()
      h2 = hashlib.sha256("blockchain".encode("utf-8")).hexdigest()
      print(h1)
      print(h2)
      communs = 0
      for i in range(len(h1)):
          if h1[i] == h2[i]:
              communs = communs + 1
      print(communs)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    import hashlib
    a = hashlib.sha256("Blockchain".encode("utf-8")).hexdigest()
    b = hashlib.sha256("blockchain".encode("utf-8")).hexdigest()
    assert h1 == a and h2 == b, "h1 et h2 sont les SHA-256 de Blockchain et de blockchain."
    assert communs == sum(1 for x, y in zip(a, b) if x == y), "communs compte les positions où les deux empreintes ont le même caractère."
    assert a in SORTIE and b in SORTIE, "Le programme affiche les deux empreintes."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tp-blockchain-block" label="Partie 2 - Le Bloc [Facile]" type="lecture">
    <Enonce>
      ## Partie 2 : La Brique Élémentaire (Classe `Block`)

      Un bloc est un conteneur qui regroupe des informations. Dans une blockchain, il contient obligatoirement une référence au bloc précédent.

      ### <Icone nom="library" /> Théorie : Structure d'un bloc
      Un bloc contient généralement :
      *   `index` : Sa position (0, 1, 2...).
      *   `timestamp` : Sa date de création.
      *   `data` : Les données stockées (ex: "Alice doit 10€ à Bob").
      *   `previous_hash` : L'empreinte du bloc d'avant (le lien !).
      *   `hash` : Sa propre empreinte (calculée à partir de tout le reste).

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-2-1" label="2.1 [Facile] - Le Constructeur" type="python">
    <Enonce>
      ### Exercice 2.1 : Le Constructeur

      Créer la classe `Block`. Son constructeur `__init__(self, index, timestamp, data, previous_hash)` range les quatre valeurs dans les attributs du même nom.

      <Correction>
      ```python
      import hashlib
      import time

      class Block:
          def __init__(self, index, timestamp, data, previous_hash):
              self.index = index
              self.timestamp = timestamp
              self.data = data
              self.previous_hash = previous_hash
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    b = Block(1, 1700000000.0, "Alice doit 10€ à Bob", "abc")
    assert (b.index, b.timestamp, b.data, b.previous_hash) == (1, 1700000000.0, "Alice doit 10€ à Bob", "abc"), "Le constructeur range index, timestamp, data et previous_hash."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-2-2" label="2.2 [Facile] - Calculer l'empreinte" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 2.2 : Calculer l'empreinte

      Ajouter la méthode `calculate_hash(self)` à la classe `Block`.

      1.  Concaténer tous les attributs (`index`, `timestamp`, `data`, `previous_hash`), dans cet ordre, en une seule chaîne de caractères.
      2.  Renvoyer le hash SHA-256 de cette chaîne.

      À la fin du constructeur, ajouter `self.hash = self.calculate_hash()`.

      *Astuce : utiliser `str(self.index)` pour convertir les nombres en texte avant concaténation.*

      <Correction>
      ```python
      import hashlib
      import time

      class Block:
          def __init__(self, index, timestamp, data, previous_hash):
              self.index = index
              self.timestamp = timestamp
              self.data = data
              self.previous_hash = previous_hash
              self.hash = self.calculate_hash()

          def calculate_hash(self):
              contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
              return hashlib.sha256(contenu.encode("utf-8")).hexdigest()
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    import hashlib
    b = Block(1, 1700000000.0, "Alice doit 10€ à Bob", "abc")
    attendu = hashlib.sha256(("1" + "1700000000.0" + "Alice doit 10€ à Bob" + "abc").encode("utf-8")).hexdigest()
    assert b.calculate_hash() == attendu, "calculate_hash renvoie le SHA-256 de index, timestamp, data et previous_hash mis bout à bout."
    assert b.hash == attendu, "Le constructeur range le hash dans self.hash."
    b.data = "Alice doit 1000€ à Bob"
    assert b.calculate_hash() != attendu, "Changer les données change le hash."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-2-3" label="2.3 [Facile] - Un affichage propre (`__str__`)" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 2.3 : Un affichage propre (`__str__`)

      Pour faciliter le débogage, ajouter la méthode spéciale `__str__` :

      ```python
          def __str__(self):
              return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
      ```

      Créer un bloc à la main et l'afficher avec `print(mon_bloc)`.

      <Correction>
      ```python
      import hashlib
      import time

      class Block:
          def __init__(self, index, timestamp, data, previous_hash):
              self.index = index
              self.timestamp = timestamp
              self.data = data
              self.previous_hash = previous_hash
              self.hash = self.calculate_hash()

          def calculate_hash(self):
              contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
              return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

          def __str__(self):
              return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

      mon_bloc = Block(1, time.time(), "Alice doit 10€ à Bob", "0")
      print(mon_bloc)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    b = Block(2, 1.0, "B envoie à C", "xyz")
    assert str(b) == f"Block #2 [Data: B envoie à C] [Hash: {b.hash}] [Prev: xyz]", "__str__ renvoie Block #2 [Data: …] [Hash: …] [Prev: …]"
    assert "Block #" in SORTIE, "Le programme affiche un bloc créé à la main."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tp-blockchain-chain" label="Partie 3 - La Chaîne [Moyen]" type="lecture">
    <Enonce>
      ## Partie 3 : La Chaîne (Classe `Blockchain`)

      La Blockchain est le gestionnaire. C'est une liste ordonnée de blocs.

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-3-1" label="3.1 [Moyen] - Le Genesis Block" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.1 : Le Genesis Block

      Le premier bloc est spécial : il n'a pas de prédécesseur, son `previous_hash` vaut `"0"`. On l'appelle le « Genesis Block ».

      Créer la classe `Blockchain`. Son constructeur crée l'attribut `chain`, une liste qui contient un seul bloc : indice `0`, horodatage `time.time()`, données `"Genesis Block"`, `previous_hash` `"0"`.

      <Correction>
      ```python
      class Blockchain:
          def __init__(self):
              self.chain = [Block(0, time.time(), "Genesis Block", "0")]
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    bc = Blockchain()
    assert isinstance(bc.chain, list) and len(bc.chain) == 1, "chain est une liste qui contient seulement le Genesis Block."
    g = bc.chain[0]
    assert isinstance(g, Block), "Le Genesis Block est un Block."
    assert g.index == 0 and g.data == "Genesis Block" and g.previous_hash == "0", "Genesis : indice 0, données Genesis Block, previous_hash 0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-3-2" label="3.2 [Moyen] - Ajouter un maillon" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

    class Blockchain:
        def __init__(self):
            self.chain = [Block(0, time.time(), "Genesis Block", "0")]
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.2 : Ajouter un maillon

      Pour ajouter un bloc, il faut respecter la règle d'or : **le `previous_hash` du nouveau bloc doit être le `hash` du dernier bloc de la chaîne.**

      Ajouter la méthode `add_block(self, new_data)` :

      1.  Récupérer le dernier bloc de la liste `self.chain` (le « parent »).
      2.  Créer un nouvel objet `Block` avec : indice du parent + 1, `time.time()`, `new_data`, hash du parent.
      3.  Ajouter ce nouveau bloc à la liste `self.chain`.

      <Correction>
      ```python
      class Blockchain:
          def __init__(self):
              self.chain = [Block(0, time.time(), "Genesis Block", "0")]

          def add_block(self, new_data):
              parent = self.chain[-1]
              self.chain.append(Block(parent.index + 1, time.time(), new_data, parent.hash))
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    bc = Blockchain()
    bc.add_block("A envoie à B")
    bc.add_block("B envoie à C")
    assert len(bc.chain) == 3, "Deux ajouts : la chaîne compte 3 blocs."
    assert [b.index for b in bc.chain] == [0, 1, 2], "Les indices se suivent : 0, 1, 2."
    assert bc.chain[2].data == "B envoie à C", "Le dernier bloc contient les dernières données."
    assert bc.chain[1].previous_hash == bc.chain[0].hash and bc.chain[2].previous_hash == bc.chain[1].hash, "Chaque previous_hash est le hash du bloc précédent."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-3-3" label="3.3 [Moyen] - Visualisation" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

    class Blockchain:
        def __init__(self):
            self.chain = [Block(0, time.time(), "Genesis Block", "0")]

        def add_block(self, new_data):
            parent = self.chain[-1]
            self.chain.append(Block(parent.index + 1, time.time(), new_data, parent.hash))
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.3 : Visualisation

      Dans le programme principal, simuler une utilisation :

      1.  Instancier la `Blockchain` dans une variable `mon_coin`.
      2.  Ajouter 3 blocs avec des transactions fictives (`"A envoie à B"`, `"B envoie à C"`…).
      3.  Parcourir la liste `chain` avec une boucle et afficher chaque bloc.
      4.  Vérifier visuellement que le `Prev` du bloc N correspond au `Hash` du bloc N-1.

      <Correction>
      ```python
      mon_coin = Blockchain()
      mon_coin.add_block("A envoie à B")
      mon_coin.add_block("B envoie à C")
      mon_coin.add_block("C envoie à A")
      for bloc in mon_coin.chain:
          print(bloc)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert len(mon_coin.chain) == 4, "Le Genesis Block et 3 blocs ajoutés : 4 blocs."
    lignes = [l for l in SORTIE.strip().splitlines() if l.startswith("Block #")]
    assert len(lignes) == 4, "Le programme affiche les 4 blocs."
    assert all(f"[Prev: {mon_coin.chain[i - 1].hash}]" in lignes[i] for i in range(1, 4)), "Le Prev de chaque bloc est le Hash du bloc d'avant."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tp-blockchain-security" label="Partie 4 - Sécurité [Avancé]" type="lecture">
    <Enonce>
      ## Partie 4 : Sécurité et Attaque (Le cœur du sujet)

      C'est ici que l'on comprend pourquoi la blockchain est sécurisée.

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-4-1" label="4.1 [Avancé] - L'Inspecteur (`is_chain_valid`)" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

    class Blockchain:
        def __init__(self):
            self.chain = [Block(0, time.time(), "Genesis Block", "0")]

        def add_block(self, new_data):
            parent = self.chain[-1]
            self.chain.append(Block(parent.index + 1, time.time(), new_data, parent.hash))
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 4.1 : L'Inspecteur (`is_chain_valid`)

      Ajouter une méthode `is_chain_valid(self)` qui renvoie `True` ou `False`.

      Elle parcourt la chaîne à partir du bloc 1 (pas 0) et vérifie deux conditions pour chaque bloc :

      1.  **Intégrité des données :** le hash recalculé du bloc courant est identique à celui stocké dans `bloc.hash`. Sinon, les données ont été altérées.
      2.  **Intégrité du lien :** le `previous_hash` du bloc courant est identique au `hash` du bloc précédent. Sinon, la chaîne est brisée.

      <Correction>
      ```python
      class Blockchain:
          def __init__(self):
              self.chain = [Block(0, time.time(), "Genesis Block", "0")]

          def add_block(self, new_data):
              parent = self.chain[-1]
              self.chain.append(Block(parent.index + 1, time.time(), new_data, parent.hash))

          def is_chain_valid(self):
              for i in range(1, len(self.chain)):
                  bloc = self.chain[i]
                  precedent = self.chain[i - 1]
                  if bloc.hash != bloc.calculate_hash():
                      return False
                  if bloc.previous_hash != precedent.hash:
                      return False
              return True
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    bc = Blockchain()
    for d in ("A", "B", "C"):
        bc.add_block(d)
    assert bc.is_chain_valid() is True, "Une chaîne intacte est valide."
    bc.chain[1].data = "fraude"
    assert bc.is_chain_valid() is False, "Des données modifiées rendent la chaîne invalide."
    bc.chain[1].hash = bc.chain[1].calculate_hash()
    assert bc.is_chain_valid() is False, "Un hash recalculé casse le lien avec le bloc suivant."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-4-2" label="4.2 [Avancé] - Scénario d'attaque complet" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

    class Blockchain:
        def __init__(self):
            self.chain = [Block(0, time.time(), "Genesis Block", "0")]

        def add_block(self, new_data):
            parent = self.chain[-1]
            self.chain.append(Block(parent.index + 1, time.time(), new_data, parent.hash))

        def is_chain_valid(self):
            for i in range(1, len(self.chain)):
                bloc = self.chain[i]
                precedent = self.chain[i - 1]
                if bloc.hash != bloc.calculate_hash():
                    return False
                if bloc.previous_hash != precedent.hash:
                    return False
            return True
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 4.2 : Scénario d'attaque complet

      Dans le programme principal, à partir d'une chaîne `mon_coin` de 3 blocs ajoutés après le Genesis Block, réaliser le scénario suivant.

      **Étape A : tout va bien.** Afficher `Chaîne valide ?` suivi du résultat de `is_chain_valid()` : `True`.

      **Étape B : le vol (attaque naïve).** Le hacker modifie une donnée dans le passé :
      `mon_coin.chain[1].data = "Hacker s'est donné 1000 BTC"`
      Afficher `Chaîne valide après attaque ?` suivi du résultat : `False`. Le hash stocké dans le bloc 1 ne correspond plus à ses nouvelles données.

      **Étape C : la dissimulation (attaque intelligente).** Le hacker recalcule le hash du bloc 1 :
      `mon_coin.chain[1].hash = mon_coin.chain[1].calculate_hash()`
      Afficher `Chaîne valide après tentative de correction ?` suivi du résultat : `False`. Le bloc 2 pointe toujours vers l'ancien hash du bloc 1.

      **Conclusion :** pour réussir, le hacker devrait recalculer le bloc 1, puis le bloc 2, puis le bloc 3… jusqu'à la fin. C'est possible, sauf si on ajoute du **minage**.

      <Correction>
      ```python
      mon_coin = Blockchain()
      mon_coin.add_block("A envoie à B")
      mon_coin.add_block("B envoie à C")
      mon_coin.add_block("C envoie à A")
      print("Chaîne valide ?", mon_coin.is_chain_valid())
      mon_coin.chain[1].data = "Hacker s'est donné 1000 BTC"
      print("Chaîne valide après attaque ?", mon_coin.is_chain_valid())
      mon_coin.chain[1].hash = mon_coin.chain[1].calculate_hash()
      print("Chaîne valide après tentative de correction ?", mon_coin.is_chain_valid())
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    lignes = [" ".join(l.split()) for l in SORTIE.strip().splitlines()]
    assert "Chaîne valide ? True" in lignes, "Étape A : Chaîne valide ? True"
    assert "Chaîne valide après attaque ? False" in lignes, "Étape B : Chaîne valide après attaque ? False"
    assert "Chaîne valide après tentative de correction ? False" in lignes, "Étape C : Chaîne valide après tentative de correction ? False"
    assert mon_coin.chain[1].data == "Hacker s'est donné 1000 BTC", "Le bloc 1 a été modifié par le hacker."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tp-blockchain-mining" label="Partie 5 - Minage [Difficile]" type="lecture">
    <Enonce>
      ## Partie 5 : Proof of Work (Le Minage)

      Pour empêcher le recalcul rapide de toute la chaîne, on impose une contrainte de temps : le minage. Il faut trouver un hash qui commence par un certain nombre de zéros (la "difficulté").


      ### Pour finir : le temps de minage
      Tester le temps de minage :
      *   Avec difficulté = 2 (Instantané)
      *   Avec difficulté = 4 (Quelques secondes)
      *   Avec difficulté = 5 (Peut prendre 10-30 secondes)
      *   Avec difficulté = 6 (Très long... ne pas lancer en cours sauf si PC puissant !)

      Cela prouve qu'il est impossible pour un hacker de recalculer toute une chaîne de milliers de blocs : cela prendrait des années.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-5-1" label="5.1 [Difficile] - Le Nonce" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 5.1 : Le Nonce

      Le `nonce` est un nombre arbitraire qu'on modifie jusqu'à trouver le bon hash.

      1.  Ajouter `self.nonce = 0` dans le `__init__` de `Block`, avant le calcul du hash.
      2.  Ajouter `self.nonce` à la fin de la concaténation dans `calculate_hash`.

      <Correction>
      ```python
      import hashlib
      import time

      class Block:
          def __init__(self, index, timestamp, data, previous_hash):
              self.index = index
              self.timestamp = timestamp
              self.data = data
              self.previous_hash = previous_hash
              self.nonce = 0
              self.hash = self.calculate_hash()

          def calculate_hash(self):
              contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash) + str(self.nonce)
              return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

          def __str__(self):
              return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    import hashlib
    b = Block(1, 1.0, "x", "0")
    assert b.nonce == 0, "Le nonce vaut 0 au départ."
    attendu = hashlib.sha256(("1" + "1.0" + "x" + "0" + "0").encode("utf-8")).hexdigest()
    assert b.hash == attendu, "Le nonce est ajouté à la fin de la concaténation."
    b.nonce = 1
    assert b.calculate_hash() != attendu, "Changer le nonce change le hash."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-5-2" label="5.2 [Difficile] - La Pioche (`mine_block`)" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.nonce = 0
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash) + str(self.nonce)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 5.2 : La Pioche (`mine_block`)

      Ajouter la méthode `mine_block(self, difficulty)` dans `Block`.

      1.  Définir la cible : autant de `"0"` que `difficulty` (`"0000"` si la difficulté vaut 4).
      2.  Tant que `self.hash` ne commence pas par la cible : augmenter `self.nonce` de 1, puis recalculer `self.hash`.
      3.  Quand c'est trouvé, afficher `Bloc miné !` et le hash.

      <Correction>
      ```python
      import hashlib
      import time

      class Block:
          def __init__(self, index, timestamp, data, previous_hash):
              self.index = index
              self.timestamp = timestamp
              self.data = data
              self.previous_hash = previous_hash
              self.nonce = 0
              self.hash = self.calculate_hash()

          def calculate_hash(self):
              contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash) + str(self.nonce)
              return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

          def __str__(self):
              return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

          def mine_block(self, difficulty):
              cible = "0" * difficulty
              while not self.hash.startswith(cible):
                  self.nonce = self.nonce + 1
                  self.hash = self.calculate_hash()
              print("Bloc miné !", self.hash)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    b = Block(1, 1.0, "x", "0")
    b.mine_block(2)
    assert b.hash.startswith("00"), "Après mine_block(2), le hash commence par 00."
    assert b.hash == b.calculate_hash(), "Le hash trouvé correspond au nonce final."
    assert b.nonce > 0, "Le nonce a été augmenté pour trouver le hash."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-chain-5-3" label="5.3 [Difficile] - Intégration" type="python">
    <CodeDepart>
    ```python
    import hashlib
    import time

    class Block:
        def __init__(self, index, timestamp, data, previous_hash):
            self.index = index
            self.timestamp = timestamp
            self.data = data
            self.previous_hash = previous_hash
            self.nonce = 0
            self.hash = self.calculate_hash()

        def calculate_hash(self):
            contenu = str(self.index) + str(self.timestamp) + str(self.data) + str(self.previous_hash) + str(self.nonce)
            return hashlib.sha256(contenu.encode("utf-8")).hexdigest()

        def __str__(self):
            return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

        def mine_block(self, difficulty):
            cible = "0" * difficulty
            while not self.hash.startswith(cible):
                self.nonce = self.nonce + 1
                self.hash = self.calculate_hash()
            print("Bloc miné !", self.hash)
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 5.3 : Intégration

      Modifier la classe `Blockchain` :

      *   dans `__init__`, ranger la difficulté dans `self.difficulty` (4 par défaut) ;
      *   dans `add_block`, appeler `new_block.mine_block(self.difficulty)` avant d'ajouter le bloc à la liste.

      Le test règle `self.difficulty` à 2 pour aller vite.

      <Correction>
      ```python
      class Blockchain:
          def __init__(self, difficulty=4):
              self.difficulty = difficulty
              self.chain = [Block(0, time.time(), "Genesis Block", "0")]

          def add_block(self, new_data):
              parent = self.chain[-1]
              new_block = Block(parent.index + 1, time.time(), new_data, parent.hash)
              new_block.mine_block(self.difficulty)
              self.chain.append(new_block)

          def is_chain_valid(self):
              for i in range(1, len(self.chain)):
                  bloc = self.chain[i]
                  precedent = self.chain[i - 1]
                  if bloc.hash != bloc.calculate_hash():
                      return False
                  if bloc.previous_hash != precedent.hash:
                      return False
              return True
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    bc = Blockchain()
    assert bc.difficulty == 4, "La difficulté vaut 4 par défaut."
    bc.difficulty = 2
    bc.add_block("A envoie à B")
    bc.add_block("B envoie à C")
    assert all(b.hash.startswith("00") for b in bc.chain[1:]), "Chaque bloc ajouté est miné : son hash commence par 00."
    assert bc.is_chain_valid() is True, "La chaîne minée reste valide."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
