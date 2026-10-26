---
title: TP - Chiffrement et Déchiffrement
description: 'Implémentation des chiffrements de César, Vigenère et RSA en Python.'
level: BTS SIO
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
icon: "lock-keyhole"
prerequisites:
  - chiffrement_hachage
audience: public
---

<ExerciseTabs courseId="tp-cesar-vigenere" courseTitle="TP Chiffrement">

  <ExerciseSection id="intro" label="Introduction & Rappels [Introduction]" type="lecture">
    <Enonce>
      ## Introduction
      Le chiffrement est une technique fondamentale en cybersécurité qui permet de protéger des informations en les rendant illisibles sans une clé de déchiffrement. Ce TP présente deux méthodes historiques de chiffrement par substitution et une méthode moderne de chiffrement asymétrique.

      ## Contraintes du TP
      *   Des **lettres majuscules** (A à Z)
      *   **Sans accents** ni caractères spéciaux
      *   Une chaîne de caractères `ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"`
      *   L'opérateur `% 26` pour revenir au début de l'alphabet

      ## Rappels utiles
      *   Longueur d'une chaîne : `len("BONJOUR")` donne 7
      *   Accès à un caractère : `"BONJOUR"[0]` donne 'B'
      *   Position d'un caractère : `"BONJOUR".index('N')` donne 2
      *   L'opérateur `%` permet de faire des calculs circulaires

      ### Aide-mémoire : opérateur %
      L'opérateur modulo `%` retourne le reste de la division. Il est très utile pour revenir au début d'une séquence :
      ```python
      # Exemples avec % 26 pour l'alphabet
      25 % 26 = 25  # Z reste Z
      26 % 26 = 0   # Retour à A
      27 % 26 = 1   # Retour à B
      30 % 26 = 4   # Retour à E

      # Avec des nombres négatifs (pour le déchiffrement)
      -1 % 26 = 25  # Avant A, c'est Z
      -2 % 26 = 24  # Avant A de 2, c'est Y
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="partie-1-cesar" label="Partie 1 : César [Facile]" type="lecture">
    <Enonce>
      ## Partie 1 : Chiffrement de César

      ### Principe
      Le chiffre de César consiste à décaler chaque lettre de l'alphabet d'un nombre fixe de positions (la clé).
      *   A devient D
      *   B devient E
      *   Z devient C (retour au début grâce à % 26)

      #### Exemple
      ```
      Message : BONJOUR
      Clé : 3
      Chiffré : ERQMRXU
      ```

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-1-1" label="1.1 [Facile] - Fonction indice_dans_alphabet" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 1.1 : Fonction indice_dans_alphabet
      Écrire une fonction `indice_dans_alphabet(lettre)` qui prend une lettre majuscule, renvoie son indice dans `ALPHABET`, et `-1` si ce n'est pas une lettre.
      ```python
      ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      print(indice_dans_alphabet('A'))  # Attendu : 0
      print(indice_dans_alphabet('Z'))  # Attendu : 25
      print(indice_dans_alphabet('M'))  # Attendu : 12
      print(indice_dans_alphabet(' '))  # Attendu : -1
      ```


      <Correction>
      ```python
      def indice_dans_alphabet(lettre):
          if len(lettre) == 1 and lettre in ALPHABET:
              return ALPHABET.index(lettre)
          return -1
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert indice_dans_alphabet("A") == 0 and indice_dans_alphabet("Z") == 25 and indice_dans_alphabet("M") == 12, "A : 0, Z : 25, M : 12."
    assert indice_dans_alphabet(" ") == -1 and indice_dans_alphabet("é") == -1 and indice_dans_alphabet("a") == -1, "Un caractère hors de ALPHABET : -1."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-1-2" label="1.2 [Facile] - Chiffrement d'un caractère" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 1.2 : Chiffrement d'un caractère
      Écrire `chiffrer_caractere_cesar(caractere, cle)`. Formule : `(indice_actuel + cle) % 26`.
      ```python
      print(chiffrer_caractere_cesar('A', 3))  # D
      print(chiffrer_caractere_cesar('Z', 3))  # C
      print(chiffrer_caractere_cesar('X', 5))  # C
      print(chiffrer_caractere_cesar(' ', 3))  # ' '
      ```


      <Correction>
      ```python
      def chiffrer_caractere_cesar(caractere, cle):
          indice = indice_dans_alphabet(caractere)
          if indice == -1:
              return caractere
          return ALPHABET[(indice + cle) % 26]
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert chiffrer_caractere_cesar("A", 3) == "D", "A décalé de 3 : D."
    assert chiffrer_caractere_cesar("Z", 3) == "C", "Z décalé de 3 : C (retour au début)."
    assert chiffrer_caractere_cesar("X", 5) == "C", "X décalé de 5 : C."
    assert chiffrer_caractere_cesar(" ", 3) == " ", "Un espace reste un espace."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-1-3" label="1.3 [Facile] - Message complet" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1

    def chiffrer_caractere_cesar(caractere, cle):
        indice = indice_dans_alphabet(caractere)
        if indice == -1:
            return caractere
        return ALPHABET[(indice + cle) % 26]
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 1.3 : Message complet
      Écrire `chiffrer_cesar(message, cle)` en utilisant la fonction précédente.
      ```python
      print(chiffrer_cesar("BONJOUR", 3))           # ERQMRXU
      print(chiffrer_cesar("HELLO WORLD", 5))       # MJQQT BTWQI
      print(chiffrer_cesar("ABC XYZ", 1))           # BCD YZA
      ```


      <Correction>
      ```python
      def chiffrer_cesar(message, cle):
          resultat = ""
          for caractere in message:
              resultat = resultat + chiffrer_caractere_cesar(caractere, cle)
          return resultat
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert chiffrer_cesar("BONJOUR", 3) == "ERQMRXU", "BONJOUR, clé 3 : ERQMRXU."
    assert chiffrer_cesar("HELLO WORLD", 5) == "MJQQT BTWQI", "HELLO WORLD, clé 5 : MJQQT BTWQI."
    assert chiffrer_cesar("ABC XYZ", 1) == "BCD YZA", "ABC XYZ, clé 1 : BCD YZA."
    assert chiffrer_cesar("", 4) == "", "Message vide : message vide."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-1-4" label="1.4 [Facile] - Déchiffrement" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1

    def chiffrer_caractere_cesar(caractere, cle):
        indice = indice_dans_alphabet(caractere)
        if indice == -1:
            return caractere
        return ALPHABET[(indice + cle) % 26]

    def chiffrer_cesar(message, cle):
        resultat = ""
        for caractere in message:
            resultat = resultat + chiffrer_caractere_cesar(caractere, cle)
        return resultat
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 1.4 : Déchiffrement
      Écrire `dechiffrer_cesar(message, cle)`. Pour déchiffrer, soustraire la clé : `(indice_actuel - cle) % 26`.
      ```python
      message = "BONJOUR"
      chiffre = chiffrer_cesar(message, 3)
      print(chiffre)           # ERQMRXU
      dechiffre = dechiffrer_cesar(chiffre, 3)
      print(dechiffre)         # BONJOUR
      ```


      <Correction>
      ```python
      def dechiffrer_cesar(message, cle):
          return chiffrer_cesar(message, -cle)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert dechiffrer_cesar("ERQMRXU", 3) == "BONJOUR", "ERQMRXU, clé 3 : BONJOUR."
    assert dechiffrer_cesar("CDE", 3) == "ZAB", "Avant A, on repart de Z."
    assert dechiffrer_cesar(chiffrer_cesar("HELLO WORLD", 11), 11) == "HELLO WORLD", "Déchiffrer annule le chiffrement."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-1-5" label="1.5 [Facile] - Cassage par force brute" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1

    def chiffrer_caractere_cesar(caractere, cle):
        indice = indice_dans_alphabet(caractere)
        if indice == -1:
            return caractere
        return ALPHABET[(indice + cle) % 26]

    def chiffrer_cesar(message, cle):
        resultat = ""
        for caractere in message:
            resultat = resultat + chiffrer_caractere_cesar(caractere, cle)
        return resultat

    def dechiffrer_cesar(message, cle):
        return chiffrer_cesar(message, -cle)
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 1.5 : Cassage par force brute
      Écrire `casser_cesar(message)`, qui teste toutes les clés (0 à 25) et affiche chaque résultat avec la clé, une ligne par clé, sous la forme `Cle 3 : BONJOUR`.
      ```
      Cle 0 : ERQMRXU
      Cle 1 : DQPLQWT
      Cle 2 : CPOKPVS
      Cle 3 : BONJOUR
      Cle 4 : ANMINTQ
      ...
      ```
      ```python
      casser_cesar("ERQMRXU")
      # Identifier visuellement que la clé 3 donne BONJOUR
      ```

      <Correction>
      ```python
      def casser_cesar(message):
          for cle in range(26):
              print("Cle", cle, ":", dechiffrer_cesar(message, cle))
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
    _, texte = _sortie(casser_cesar, "ERQMRXU")
    lignes = [" ".join(l.split()) for l in texte.strip().splitlines()]
    assert len(lignes) == 26, "26 lignes : une par clé, de 0 à 25."
    assert lignes[0] == "Cle 0 : ERQMRXU", "Première ligne : Cle 0 : ERQMRXU"
    assert lignes[3] == "Cle 3 : BONJOUR", "La clé 3 donne BONJOUR : Cle 3 : BONJOUR"
    assert lignes[4] == "Cle 4 : ANMINTQ", "Cle 4 : ANMINTQ"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="partie-2-vigenere" label="Partie 2 : Vigenère [Moyen]" type="lecture">
    <Enonce>
      ## Partie 2 : Chiffrement de Vigenère

      ### Principe
      Le chiffre de Vigenère utilise une clé composée de lettres. Chaque lettre de la clé détermine le décalage de la lettre correspondante du message. La clé se répète si nécessaire.

      ```
      Message : BONJOUR (indices: 1,14,13,9,14,20,17)
      Clé :     CLE     (indices: 2,11,4 répétés)
      Calcul :  (1+2)%26=3->D, (14+11)%26=25->Z, (13+4)%26=17->R,
                (9+2)%26=11->L, (14+11)%26=25->Z, (20+4)%26=24->Y,
                (17+2)%26=19->T
      Résultat : DZRLZYT
      ```

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-2-1" label="2.1 [Moyen] - Conversion lettre, donc décalage" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 2.1 : Conversion lettre, donc décalage
      Écrire `lettre_vers_decalage(lettre)` en utilisant `indice_dans_alphabet()`.
      ```python
      print(lettre_vers_decalage('A'))  # 0
      print(lettre_vers_decalage('C'))  # 2
      print(lettre_vers_decalage('Z'))  # 25
      ```


      <Correction>
      ```python
      def lettre_vers_decalage(lettre):
          return indice_dans_alphabet(lettre)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert lettre_vers_decalage("A") == 0 and lettre_vers_decalage("C") == 2 and lettre_vers_decalage("Z") == 25, "A : 0, C : 2, Z : 25."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-2-2" label="2.2 [Moyen] - Chiffrement de Vigenère" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1

    def lettre_vers_decalage(lettre):
        return indice_dans_alphabet(lettre)
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 2.2 : Chiffrement de Vigenère
      Écrire `chiffrer_vigenere(message, cle)`. Ignorer les caractères non alphabétiques, répéter la clé, et calculer `(indice_lettre + decalage) % 26`.

      ```python
      print(chiffrer_vigenere("BONJOUR", "CLE"))      # DZRLZYT
      print(chiffrer_vigenere("HELLO WORLD", "KEY"))  # RIJVS UYVJN
      print(chiffrer_vigenere("AAA", "BCD"))          # BCD
      ```

      **Pseudo-code :**
      ```
      function chiffrer_vigenere(message, clef)
          "" -> res
          0 -> indice_clef
          pour chaque lettre dans message
              indice de la lettre dans l'alphabet -> indice_lettre
              si indice == -1
                  res += lettre
              sinon
                  indice_dans_clef = indice_dans_alphabet(clef[indice_clef])
                  indice_dans_mot = indice_dans_alphabet(lettre)
                  res += ALPHABET[(indice_dans_mot + indice_dans_clef) % 26]
                  indice_clef = (indice_clef + 1) % len(clef)
          renvoyer res
      ```

      <Correction>
      ```python
      def chiffrer_vigenere(message, cle):
          resultat = ""
          indice_cle = 0
          for lettre in message:
              indice = indice_dans_alphabet(lettre)
              if indice == -1:
                  resultat = resultat + lettre
              else:
                  decalage = lettre_vers_decalage(cle[indice_cle])
                  resultat = resultat + ALPHABET[(indice + decalage) % 26]
                  indice_cle = (indice_cle + 1) % len(cle)
          return resultat
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert chiffrer_vigenere("BONJOUR", "CLE") == "DZRLZYT", "BONJOUR, clé CLE : DZRLZYT."
    assert chiffrer_vigenere("HELLO WORLD", "KEY") == "RIJVS UYVJN", "HELLO WORLD, clé KEY : RIJVS UYVJN (l'espace ne consomme pas de lettre de la clé)."
    assert chiffrer_vigenere("AAA", "BCD") == "BCD", "AAA, clé BCD : BCD."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="partie-3-rsa" label="Partie 3 : RSA [Avancé]" type="lecture">
    <Enonce>
      ## Partie 3 : Chiffrement RSA

      ### Principe
      Le chiffrement RSA est un algorithme de chiffrement asymétrique. Il utilise deux clés différentes.
      *   Clé publique pour chiffrer (peut être partagée)
      *   Clé privée pour déchiffrer (doit rester secrète)

      RSA repose sur des opérations mathématiques avec de grands nombres premiers.

      ### Concepts mathématiques de base
      **Les nombres premiers :** Un nombre premier n'est divisible que par 1 et par lui-même.

      #### Algorithme RSA simplifié
      1.  Choisir deux nombres premiers p et q
      2.  Calculer n = p × q
      3.  Calculer φ(n) = (p - 1) × (q - 1)
      4.  Choisir e tel que 1 < e < φ(n) et e est premier avec φ(n)
      5.  Calculer d tel que (d × e) % φ(n) = 1

      **Clé publique :** (e, n)
      **Clé privée :** (d, n)

      **Chiffrement d'un nombre m :** c = (m^e) % n
      **Déchiffrement d'un nombre c :** m = (c^d) % n

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-1" label="3.1 [Avancé] - Vérifier si un nombre est premier" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.1 : Vérifier si un nombre est premier
      Écrire une fonction `est_premier(n)` qui renvoie True si le nombre est premier, False sinon.

      **Algorithme :**
      *   Si n ≤ 1, renvoier False
      *   Si n = 2, renvoier True
      *   Si n est pair, renvoier False
      *   Tester la divisibilité par tous les nombres impairs de 3 à √n

      ```python
      print(est_premier(2))    # Attendu : True
      print(est_premier(17))   # Attendu : True
      print(est_premier(20))   # Attendu : False
      print(est_premier(97))   # Attendu : True
      ```


      <Correction>
      ```python
      def est_premier(n):
          if n <= 1:
              return False
          if n == 2:
              return True
          if n % 2 == 0:
              return False
          d = 3
          while d * d <= n:
              if n % d == 0:
                  return False
              d = d + 2
          return True
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert est_premier(2) and est_premier(17) and est_premier(97), "2, 17 et 97 sont premiers."
    assert not est_premier(20) and not est_premier(1) and not est_premier(0) and not est_premier(9), "20, 1, 0 et 9 ne sont pas premiers."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-2" label="3.2 [Avancé] - Calculer le PGCD" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.2 : Calculer le PGCD
      Écrire une fonction `pgcd(a, b)` qui calcule le Plus Grand Commun Diviseur de deux nombres (algorithme d'Euclide).

      **Algorithme d'Euclide :**
      ```
      Tant que b ≠ 0 :
          r = a % b
          a = b
          b = r
      Retourner a
      ```

      ```python
      print(pgcd(48, 18))   # Attendu : 6
      print(pgcd(17, 13))   # Attendu : 1
      print(pgcd(100, 50))  # Attendu : 50
      ```


      <Correction>
      ```python
      def pgcd(a, b):
          while b != 0:
              a, b = b, a % b
          return a
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert pgcd(48, 18) == 6 and pgcd(17, 13) == 1 and pgcd(100, 50) == 50, "pgcd : 6, 1 et 50."
    assert pgcd(18, 48) == 6, "L'ordre des nombres ne change pas le pgcd."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-3" label="3.3 [Avancé] - Calculer l'inverse modulaire" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.3 : Calculer l'inverse modulaire
      Écrire une fonction `inverse_modulaire(e, phi)` qui renvoie d tel que (d × e) % phi = 1, et None si aucun inverse n'existe.

      **Algorithme (méthode simple) :**
      ```
      Pour d allant de 2 à phi :
          Si (d * e) % phi == 1 :
              Retourner d
      Retourner None
      ```

      ```python
      print(inverse_modulaire(7, 3120))    # Attendu : 1783
      print(inverse_modulaire(17, 3120))   # Attendu : 2753
      ```


      <Correction>
      ```python
      def inverse_modulaire(e, phi):
          for d in range(2, phi + 1):
              if (d * e) % phi == 1:
                  return d
          return None
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert inverse_modulaire(7, 3120) == 1783, "inverse_modulaire(7, 3120) vaut 1783."
    assert inverse_modulaire(17, 3120) == 2753, "inverse_modulaire(17, 3120) vaut 2753."
    assert inverse_modulaire(4, 8) is None, "4 n'a pas d'inverse modulo 8 : None."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-4" label="3.4 [Avancé] - Générer les clés RSA" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def pgcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    def inverse_modulaire(e, phi):
        for d in range(2, phi + 1):
            if (d * e) % phi == 1:
                return d
        return None
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.4 : Générer les clés RSA
      Écrire une fonction `generer_cles_rsa(p, q)` qui renvoie `((e, n), (d, n))`.

      1.  Calculer n = p × q
      2.  Calculer phi = (p - 1) × (q - 1)
      3.  Trouver le plus petit e supérieur à 1 tel que pgcd(e, phi) = 1
      4.  Calculer d avec `inverse_modulaire(e, phi)`
      5.  Retourner ((e, n), (d, n))

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      print("Clé publique:", cle_pub)    # Exemple : (7, 3233)
      print("Clé privée:", cle_priv)     # Exemple : (1783, 3233)
      ```
      *Note :* Utiliser de petits nombres premiers pour l'exercice.


      <Correction>
      ```python
      def generer_cles_rsa(p, q):
          n = p * q
          phi = (p - 1) * (q - 1)
          e = 2
          while pgcd(e, phi) != 1:
              e = e + 1
          d = inverse_modulaire(e, phi)
          return ((e, n), (d, n))
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    pub, priv = generer_cles_rsa(61, 53)
    assert pub == (7, 3233) and priv == (1783, 3233), "Pour p = 61 et q = 53 : clé publique (7, 3233), clé privée (1783, 3233)."
    pub, priv = generer_cles_rsa(11, 13)
    assert pub[1] == 143 and (pub[0] * priv[0]) % 120 == 1, "Pour 11 et 13 : n = 143 et d × e ≡ 1 modulo φ(n) = 120."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-5" label="3.5 [Avancé] - Chiffrer un nombre avec RSA" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def pgcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    def inverse_modulaire(e, phi):
        for d in range(2, phi + 1):
            if (d * e) % phi == 1:
                return d
        return None

    def generer_cles_rsa(p, q):
        n = p * q
        phi = (p - 1) * (q - 1)
        e = 2
        while pgcd(e, phi) != 1:
            e = e + 1
        d = inverse_modulaire(e, phi)
        return ((e, n), (d, n))
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.5 : Chiffrer un nombre avec RSA
      Écrire une fonction `chiffrer_nombre_rsa(m, cle_publique)` qui calcule `(m^e) % n`. Utiliser `pow(m, e, n)`.

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      message_num = 123
      chiffre = chiffrer_nombre_rsa(message_num, cle_pub)
      print(f"Message {message_num} chiffré : {chiffre}")
      ```


      <Correction>
      ```python
      def chiffrer_nombre_rsa(m, cle_publique):
          e, n = cle_publique
          return pow(m, e, n)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert chiffrer_nombre_rsa(123, (7, 3233)) == pow(123, 7, 3233), "123 chiffré avec (7, 3233) : (123^7) % 3233."
    assert chiffrer_nombre_rsa(65, (17, 3233)) == 2790, "65 chiffré avec (17, 3233) : 2790."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-6" label="3.6 [Avancé] - Déchiffrer un nombre avec RSA" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def pgcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    def inverse_modulaire(e, phi):
        for d in range(2, phi + 1):
            if (d * e) % phi == 1:
                return d
        return None

    def generer_cles_rsa(p, q):
        n = p * q
        phi = (p - 1) * (q - 1)
        e = 2
        while pgcd(e, phi) != 1:
            e = e + 1
        d = inverse_modulaire(e, phi)
        return ((e, n), (d, n))

    def chiffrer_nombre_rsa(m, cle_publique):
        e, n = cle_publique
        return pow(m, e, n)
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.6 : Déchiffrer un nombre avec RSA
      Écrire une fonction `dechiffrer_nombre_rsa(c, cle_privee)` qui calcule `(c^d) % n`.

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      message_num = 123
      chiffre = chiffrer_nombre_rsa(message_num, cle_pub)
      dechiffre = dechiffrer_nombre_rsa(chiffre, cle_priv)
      print(f"Message déchiffré : {dechiffre}")  # Attendu : 123
      ```


      <Correction>
      ```python
      def dechiffrer_nombre_rsa(c, cle_privee):
          d, n = cle_privee
          return pow(c, d, n)
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    assert dechiffrer_nombre_rsa(2790, (2753, 3233)) == 65, "2790 déchiffré avec (2753, 3233) : 65."
    assert dechiffrer_nombre_rsa(chiffrer_nombre_rsa(123, (7, 3233)), (1783, 3233)) == 123, "Chiffrer puis déchiffrer redonne 123."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="sio-crypto-3-7" label="3.7 [Avancé] - Chiffrer un message texte avec RSA" type="python">
    <CodeDepart>
    ```python
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

    def indice_dans_alphabet(lettre):
        if len(lettre) == 1 and lettre in ALPHABET:
            return ALPHABET.index(lettre)
        return -1

    def pgcd(a, b):
        while b != 0:
            a, b = b, a % b
        return a

    def inverse_modulaire(e, phi):
        for d in range(2, phi + 1):
            if (d * e) % phi == 1:
                return d
        return None

    def generer_cles_rsa(p, q):
        n = p * q
        phi = (p - 1) * (q - 1)
        e = 2
        while pgcd(e, phi) != 1:
            e = e + 1
        d = inverse_modulaire(e, phi)
        return ((e, n), (d, n))

    def chiffrer_nombre_rsa(m, cle_publique):
        e, n = cle_publique
        return pow(m, e, n)

    def dechiffrer_nombre_rsa(c, cle_privee):
        d, n = cle_privee
        return pow(c, d, n)
    ```
    </CodeDepart>
    <Enonce>
      ### Exercice 3.7 : Chiffrer un message texte avec RSA
      `chiffrer_message_rsa` convertit chaque lettre en indice dans `ALPHABET` et renvoie la liste des indices chiffrés. `dechiffrer_message_rsa` déchiffre chaque nombre et reconstitue le texte.

      **Fonctions attendues :**
      *   `chiffrer_message_rsa(message, cle_publique)`
      *   `dechiffrer_message_rsa(liste_chiffree, cle_privee)`

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      message = "HELLO"
      liste_chiffree = chiffrer_message_rsa(message, cle_pub)
      print("Message chiffré:", liste_chiffree)
      message_dechiffre = dechiffrer_message_rsa(liste_chiffree, cle_priv)
      print("Message déchiffré:", message_dechiffre)  # Attendu : HELLO
      ```

      <Correction>
      ```python
      def chiffrer_message_rsa(message, cle_publique):
          return [chiffrer_nombre_rsa(indice_dans_alphabet(lettre), cle_publique) for lettre in message]

      def dechiffrer_message_rsa(liste_chiffree, cle_privee):
          texte = ""
          for c in liste_chiffree:
              texte = texte + ALPHABET[dechiffrer_nombre_rsa(c, cle_privee)]
          return texte
      ```
      </Correction>
    </Enonce>
    <Verification>
    ```python
    pub, priv = (7, 3233), (1783, 3233)
    liste = chiffrer_message_rsa("HELLO", pub)
    assert isinstance(liste, list) and len(liste) == 5, "chiffrer_message_rsa renvoie une liste d'un nombre par lettre."
    assert liste[0] == pow(7, 7, 3233), "H (indice 7) est chiffré en (7^7) % 3233."
    assert dechiffrer_message_rsa(liste, priv) == "HELLO", "Déchiffrer la liste redonne HELLO."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
