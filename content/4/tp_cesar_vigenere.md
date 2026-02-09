---
title: "TP - Chiffrement et Déchiffrement"
description: "Implémentation des chiffrements de César, Vigenère et RSA en Python."
level: "BTS SIO"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
icon: "🔐"
---

<ExerciseTabs courseId="tp-cesar-vigenere" courseTitle="TP Chiffrement">

  <ExerciseSection id="intro" label="Introduction & Rappels">
    <Enonce>
      ## Introduction
      Le chiffrement est une technique fondamentale en cybersécurité qui permet de protéger des informations en les rendant illisibles sans une clé de déchiffrement. Ce TP présente deux méthodes historiques de chiffrement par substitution et une méthode moderne de chiffrement asymétrique.

      ## Contraintes du TP
      *   Des **lettres majuscules** (A à Z)
      *   **Sans accents** ni caractères spéciaux
      *   Une chaîne de caractères `ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"`
      *   L'opérateur `% 26` pour revenir au début de l'alphabet

      ## Rappels utiles
      *   Longueur d'une chaîne : `len("BONJOUR")` → 7
      *   Accès à un caractère : `"BONJOUR"[0]` → 'B'
      *   Position d'un caractère : `"BONJOUR".index('N')` → 2
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

  <ExerciseSection id="partie-1-cesar" label="Partie 1 : César">
    <Enonce>
      ## Partie 1 : Chiffrement de César

      ### Principe
      Le chiffre de César consiste à décaler chaque lettre de l'alphabet d'un nombre fixe de positions (la clé).
      *   A → D
      *   B → E
      *   Z → C (retour au début grâce à % 26)

      #### Exemple
      ```
      Message : BONJOUR
      Clé : 3
      Chiffré : ERQMRXU
      ```

      ### Exercice 1.1 · Fonction indice_dans_alphabet
      Écrire une fonction qui prend une lettre majuscule, retourne son indice dans ALPHABET, et -1 si ce n'est pas une lettre.
      ```python
      ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      print(indice_dans_alphabet('A'))  # Attendu : 0
      print(indice_dans_alphabet('Z'))  # Attendu : 25
      print(indice_dans_alphabet('M'))  # Attendu : 12
      print(indice_dans_alphabet(' '))  # Attendu : -1
      ```

      ### Exercice 1.2 · Chiffrement d'un caractère
      Écrire `chiffrer_caractere_cesar(caractere, cle)`. Formule : `(indice_actuel + cle) % 26`.
      ```python
      print(chiffrer_caractere_cesar('A', 3))  # D
      print(chiffrer_caractere_cesar('Z', 3))  # C
      print(chiffrer_caractere_cesar('X', 5))  # C
      print(chiffrer_caractere_cesar(' ', 3))  # ' '
      ```

      ### Exercice 1.3 · Message complet
      Écrire `chiffrer_cesar(message, cle)` en utilisant la fonction précédente.
      ```python
      print(chiffrer_cesar("BONJOUR", 3))           # ERQMRXU
      print(chiffrer_cesar("HELLO WORLD", 5))       # MJQQT BTWQI
      print(chiffrer_cesar("ABC XYZ", 1))           # BCD YZA
      ```

      ### Exercice 1.4 · Déchiffrement
      Pour déchiffrer, soustraire la clé : `(indice_actuel - cle) % 26`.
      ```python
      message = "BONJOUR"
      chiffre = chiffrer_cesar(message, 3)
      print(chiffre)           # ERQMRXU
      dechiffre = dechiffrer_cesar(chiffre, 3)
      print(dechiffre)         # BONJOUR
      ```

      ### Exercice 1.5 · Cassage par force brute
      Tester toutes les clés (0 à 25) et afficher chaque résultat avec la clé.
      ```
      Cle 0 : ERQMRXU
      Cle 1 : DQPLQWT
      Cle 2 : CPOKPVS
      Cle 3 : BONJOUR
      Cle 4 : ANMINNT
      ...
      ```
      ```python
      casser_cesar("ERQMRXU")
      # Identifier visuellement que la clé 3 donne BONJOUR
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="partie-2-vigenere" label="Partie 2 : Vigenère">
    <Enonce>
      ## Partie 2 : Chiffrement de Vigenère

      ### Principe
      Le chiffre de Vigenère utilise une clé composée de lettres. Chaque lettre de la clé détermine le décalage de la lettre correspondante du message. La clé se répète si nécessaire.

      ```
      Message : BONJOUR (indices: 1,14,13,9,14,20,17)
      Clé :     CLE     (indices: 2,11,4 répétés)
      Calcul :  (1+2)%26=3→D, (14+11)%26=25→Z, (13+4)%26=17→R,
                (9+2)%26=11→L, (14+11)%26=25→Z, (20+4)%26=24→Y,
                (17+2)%26=19→T
      Résultat : DZRLZYT
      ```

      ### Exercice 2.1 · Conversion lettre → décalage
      Écrire `lettre_vers_decalage(lettre)` en utilisant `indice_dans_alphabet()`.
      ```python
      print(lettre_vers_decalage('A'))  # 0
      print(lettre_vers_decalage('C'))  # 2
      print(lettre_vers_decalage('Z'))  # 25
      ```

      ### Exercice 2.2 · Chiffrement de Vigenère
      Écrire `chiffrer_vigenere(message, cle)`. Ignorer les caractères non alphabétiques, répéter la clé, et calculer `(indice_lettre + decalage) % 26`.

      ```python
      print(chiffrer_vigenere("BONJOUR", "CLE"))      # DZRLZYT
      print(chiffrer_vigenere("HELLO WORLD", "KEY"))  # RIJVS UYVJN
      print(chiffrer_vigenere("AAA", "BCD"))          # BDF
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
                  indice_dans_clef = indice_dans_alphabet(clef[indice_clef], ALPHABET)
                  indice_dans_mot = indice_dans_alphabet(lettre, ALPHABET)
                  res += ALPHABET[(indice_dans_mot + indice_dans_clef) % 26]
                  indice_clef = (indice_clef + 1) % len(clef)
          renvoyer res
      ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="partie-3-rsa" label="Partie 3 : RSA">
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

      ### Exercice 3.1 · Vérifier si un nombre est premier
      Écrire une fonction `est_premier(n)` qui retourne True si le nombre est premier, False sinon.

      **Algorithme :**
      *   Si n ≤ 1, retourner False
      *   Si n = 2, retourner True
      *   Si n est pair, retourner False
      *   Tester la divisibilité par tous les nombres impairs de 3 à √n

      ```python
      print(est_premier(2))    # Attendu : True
      print(est_premier(17))   # Attendu : True
      print(est_premier(20))   # Attendu : False
      print(est_premier(97))   # Attendu : True
      ```

      ### Exercice 3.2 · Calculer le PGCD
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

      ### Exercice 3.3 · Calculer l'inverse modulaire
      Écrire une fonction `inverse_modulaire(e, phi)` qui retourne d tel que (d × e) % phi = 1, et None si aucun inverse n'existe.

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

      ### Exercice 3.4 · Générer les clés RSA
      Écrire une fonction `generer_cles_rsa(p, q)` qui retourne `((e, n), (d, n))`.

      1.  Calculer n = p × q
      2.  Calculer phi = (p - 1) × (q - 1)
      3.  Trouver e tel que pgcd(e, phi) = 1
      4.  Calculer d avec `inverse_modulaire(e, phi)`
      5.  Retourner ((e, n), (d, n))

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      print("Clé publique:", cle_pub)    # Exemple : (7, 3233)
      print("Clé privée:", cle_priv)     # Exemple : (1783, 3233)
      ```
      *Note :* Utiliser de petits nombres premiers pour l'exercice.

      ### Exercice 3.5 · Chiffrer un nombre avec RSA
      Écrire une fonction `chiffrer_nombre_rsa(m, cle_publique)` qui calcule `(m^e) % n`. Utiliser `pow(m, e, n)`.

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      message_num = 123
      chiffre = chiffrer_nombre_rsa(message_num, cle_pub)
      print(f"Message {message_num} chiffré : {chiffre}")
      ```

      ### Exercice 3.6 · Déchiffrer un nombre avec RSA
      Écrire une fonction `dechiffrer_nombre_rsa(c, cle_privee)` qui calcule `(c^d) % n`.

      ```python
      cle_pub, cle_priv = generer_cles_rsa(61, 53)
      message_num = 123
      chiffre = chiffrer_nombre_rsa(message_num, cle_pub)
      dechiffre = dechiffrer_nombre_rsa(chiffre, cle_priv)
      print(f"Message déchiffré : {dechiffre}")  # Attendu : 123
      ```

      ### Exercice 3.7 · Chiffrer un message texte avec RSA
      Convertir chaque lettre en indice dans ALPHABET, chiffrer ces indices, puis reconstituer le message.

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
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
