---
title: "Chiffrement et Hachage"
description: "Fondamentaux de la cryptographie : chiffrement, hachage et signatures numériques"
level: "BTS"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
icon: "🔐"
---

## 🎯 Rappels : Les piliers de la sécurité

Avant de plonger dans le chiffrement et le hachage, rappelons les quatre propriétés fondamentales que nous cherchons à garantir :

> **🔒 Confidentialité**
>
> **Définition :** Garantir que seules les personnes autorisées peuvent lire l'information.
>
> **Question clé :** "Est-ce que quelqu'un d'autre peut lire mon message ?"
>
> **Solution technique :** Le **chiffrement**

> **🛡️ Intégrité**
>
> **Définition :** Garantir que l'information n'a pas été modifiée entre l'envoi et la réception.
>
> **Question clé :** "Mon message a-t-il été altéré en chemin ?"
>
> **Solution technique :** Le **hachage**

> **✅ Authenticité**
>
> **Définition :** Garantir l'identité de l'émetteur du message.
>
> **Question clé :** "Suis-je sûr que c'est bien Alice qui a envoyé ce message ?"
>
> **Solution technique :** La **signature numérique**

> **📜 Non-répudiation**
>
> **Définition :** Garantir que l'émetteur ne peut pas nier avoir envoyé le message.
>
> **Question clé :** "Alice peut-elle prétendre qu'elle n'a jamais envoyé ce message ?"
>
> **Solution technique :** La **signature numérique** avec certificats

> 💡 **À retenir :** Le chiffrement protège la **confidentialité**, le hachage protège l'**intégrité**, et la signature numérique garantit l'**authenticité** et la **non-répudiation**.

## 📚 Définitions essentielles

> **🔐 Cryptographie**
>
> Science qui regroupe l'ensemble des techniques permettant de protéger les communications et les données.
>
> Elle inclut : le chiffrement, le déchiffrement, le hachage, les signatures numériques, etc.

> **🔒 Chiffrement (Encryption)**
>
> **Définition :** Processus de transformation d'un message clair (lisible) en un message chiffré (illisible) à l'aide d'une **clé de chiffrement**.
>
> **Objectif :** Rendre le message incompréhensible pour quiconque ne possède pas la clé.
>
> ```text
> Message clair + Clé de chiffrement = Message chiffré
> "Bonjour" + Clé → "X8#mK@2pQ"
> ```

> **🔓 Déchiffrement (Decryption)**
>
> **Définition :** Processus **légitime** de transformation d'un message chiffré en message clair à l'aide de la **clé de déchiffrement appropriée**.
>
> **Important :** Le déchiffrement nécessite la **bonne clé**.
>
> ```text
> Message chiffré + Clé de déchiffrement = Message clair
> "X8#mK@2pQ" + Clé → "Bonjour"
> ```

> **🔨 Décryptage (Cryptanalysis)**
>
> **Définition :** Processus **illégitime** visant à retrouver le message clair **sans posséder la clé**.
>
> **C'est l'activité des attaquants !**
>
> Méthodes : force brute, analyse de fréquence, exploitation de failles, etc.

> ⚠️ **Distinction importante :**
> * **Déchiffrement** = avec la clé (légitime)
> * **Décryptage** = sans la clé (attaque)

## 🦊 Mise en situation : Alice et les renards

> **Contexte :**
>
> Alice est biologiste et étudie une colonie de renards roux dans une réserve naturelle. Elle a fait une découverte scientifique majeure : elle a observé un comportement de communication unique chez ces renards, qui pourrait révolutionner notre compréhension de l'intelligence animale.
>
> Elle souhaite partager ses observations détaillées avec son collègue Bob, un autre chercheur, mais elle a un problème...

> 🚨 **Le problème :**
> * Alice et Bob communiquent par email pour échanger leurs données de recherche
> * Un concurrent malveillant, Charlie, surveille le réseau et intercepte tous les emails
> * Si Charlie lit les découvertes d'Alice, il pourrait publier les résultats avant elle et s'attribuer la découverte
> * Les emails transitent en **clair** sur Internet : n'importe qui peut les lire !

**Schéma de la situation :**

```text
🦊 Alice (chercheuse)
    |
    | 📧 ⬇️
    |
+-----------------------------------+
| ⚠️ INTERNET (non sécurisé)        |
| 👤 Charlie (concurrent espion)    |
| Peut lire tous les messages !     |
+-----------------------------------+
    |
    | 📧 ⬇️
    |
👨‍🔬 Bob (collègue)
```

**Message qu'Alice veut envoyer :**

```text
"Les renards utilisent 12 vocalisations distinctes pour coordonner 
la chasse nocturne. Comportement jamais observé auparavant. 
Données GPS attachées. Publication prévue dans Nature en mars."
```

> ⚠️ **Pourquoi ne peut-on pas envoyer ce message en clair ?**
> * Charlie peut intercepter et lire le message
> * Il pourrait voler la découverte et publier avant Alice
> * Les années de recherche d'Alice seraient compromises
> * Sa réputation scientifique serait ruinée

> 💡 **La solution :** Alice doit **chiffrer** son message avant de l'envoyer !
> Même si Charlie intercepte l'email, il ne pourra lire qu'un charabia incompréhensible.

## 🔤 Les chiffrements monoalphabétique et polyalphabétique

### 1.1 Chiffrement monoalphabétique

> **Définition**
>
> Un **chiffrement monoalphabétique** remplace chaque lettre du message par une autre lettre selon une règle fixe.
>
> **Caractéristique :** Une même lettre est toujours remplacée par la même lettre chiffrée.

#### Exemple : Le chiffrement de César

Le chiffrement de César décale chaque lettre d'un nombre fixe de positions dans l'alphabet.
**Clé :** Le nombre de décalages (exemple : 3)

**Alphabet normal :**
`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`

⬇️ Décalage de 3 positions

**Alphabet chiffré :**
`D E F G H I J K L M N O P Q R S T U V W X Y Z A B C`

**Exemple de chiffrement :**
* Message clair : `RENARD`
* Avec décalage de 3 : `UHQDUG`

**Détail :**
* R → U (R + 3)
* E → H (E + 3)
* N → Q (N + 3)
* A → D (A + 3)
* R → U (R + 3)
* D → G (D + 3)

> 🚨 **Faiblesse du chiffrement monoalphabétique :**
> Très vulnérable à l'**analyse de fréquence** ! En français, la lettre "E" est la plus fréquente. Si on voit qu'une lettre apparaît souvent dans le message chiffré, c'est probablement le "E" chiffré.

### 1.2 Chiffrement polyalphabétique

> **Définition**
>
> Un **chiffrement polyalphabétique** utilise plusieurs alphabets de substitution.
>
> **Caractéristique :** Une même lettre peut être chiffrée différemment selon sa position dans le message.
>
> **Avantage :** Résiste beaucoup mieux à l'analyse de fréquence.

#### Exemple : Le chiffrement de Vigenère

Utilise un **mot-clé** qui se répète pour déterminer le décalage de chaque lettre.

**Exemple :**
* Message : `RENARD`
* Clé : `FOX` (qui se répète : FOXFOX)

| Lettre du message | Lettre de la clé | Décalage | Lettre chiffrée |
| :--- | :--- | :--- | :--- |
| R | F | +5 | W |
| E | O | +14 | S |
| N | X | +23 | K |
| A | F | +5 | F |
| R | O | +14 | F |
| D | X | +23 | A |

**Résultat :** `RENARD` devient `WSKFFA`

> 💡 **Remarque :** Notez que les deux "R" du mot RENARD sont chiffrés différemment (W et F) grâce au mot-clé qui change !

### 1.3 Chiffrement mathématique

> **Définition**
>
> Un **chiffrement mathématique** modélise le chiffrement comme une **fonction** appliquée au message, contrôlée par une **clé**.
>
> * **Chiffrement :** on note `c = E_k(m)` où `m` est le message clair, `k` la clé, `c` le message chiffré.
> * **Déchiffrement :** on note `m = D_k(c)` avec `D_k` la fonction inverse associée à la clé.
>
> Selon les algorithmes, `E_k` et `D_k` utilisent des opérations **déterministes** (décalage *modulo* 26, XOR, arithmétique modulaire, etc.).

> ✅ **Propriété fondamentale :** `D_k(E_k(m)) = m`

## 🔐 Le chiffrement symétrique

> **Principe**
>
> Le **chiffrement symétrique** utilise **la même clé** pour chiffrer et déchiffrer un message.
>
> **Analogie :** Comme un cadenas avec une seule clé qui peut à la fois verrouiller et déverrouiller.

**Fonctionnement :**

```text
🦊 Alice               CHARLIE (Espion)              👨‍🔬 Bob
Message clair                                      Message clair
    |                                                  ^
    | 🔒 Chiffrement (Clé K)                           | 🔓 Déchiffrement (Clé K)
    v                                                  |
Message chiffré  ----------------------------->  Message chiffré
(incompréhensible)      (Intercepté ?)
```

**Étapes :**
1. Alice et Bob se mettent d'accord sur une **clé secrète K** (en privé)
2. Alice chiffre son message avec la clé K
3. Alice envoie le message chiffré à Bob
4. Bob déchiffre le message avec la même clé K

> ✅ **Avantage :** Très rapide et efficace pour chiffrer de grandes quantités de données.

> ❌ **Inconvénient majeur :** Comment Alice et Bob peuvent-ils se mettre d'accord sur la clé secrète de manière sécurisée ? Si Charlie intercepte la clé, tout est compromis !

## 🛠️ Exercices pratiques de chiffrement

### Rappel : La table ASCII

ASCII (American Standard Code for Information Interchange) est une table qui associe chaque caractère à un nombre.

| Caractère | Valeur ASCII (décimale) |
| :--- | :--- |
| A | 65 |
| B | 66 |
| ... | ... |
| Z | 90 |
| a | 97 |
| b | 98 |
| ... | ... |
| z | 122 |
| 0 | 48 |
| 1 | 49 |
| Espace | 32 |

### Exercice 1 : Chiffrement XOR

> **Principe du XOR (OU exclusif)**
>
> L'opération XOR compare deux bits et retourne :
> * **0** si les bits sont identiques
> * **1** si les bits sont différents
>
> | A | B | A XOR B |
> | :--- | :--- | :--- |
> | 0 | 0 | 0 |
> | 0 | 1 | 1 |
> | 1 | 0 | 1 |
> | 1 | 1 | 0 |
>
> **Propriété magique :** Si on applique XOR deux fois avec la même clé, on retrouve le message original !
>
> ```text
> Message XOR Clé = Chiffré
> Chiffré XOR Clé = Message
> ```

#### 📝 Exercice : Chiffrer avec XOR

**Message :** `FOX`
**Clé :** `KEY`
**Consigne :** Chiffrer le message en utilisant l'opération XOR.

**Étape 1 : Convertir en ASCII**
* F = 70
* O = 79
* X = 88
* K = 75
* E = 69
* Y = 89

**Étape 2 : Convertir en binaire**
* F = 70 = 01000110
* K = 75 = 01001011

**Étape 3 : Appliquer XOR bit par bit**
```text
  01000110  (F)
⊕ 01001011  (K)
-----------
  00001101  = 13
```
Le caractère ASCII 13 n'est pas imprimable, mais c'est normal en chiffrement !

**Exercice à faire :** Complétez le chiffrement pour O⊕E et X⊕Y.

### Exercice 2 : Chiffrement de César

#### 📝 Exercice : César avec décalage

**Message à chiffrer :** `RENARD ROUX`
**Clé (décalage) :** 7
**Consigne :**
1. Chiffrer le message avec un décalage de 7
2. Déchiffrer le message : `ZLJHYL` (décalage de 7)

**Aide :**
Pour chiffrer, ajoutez 7 à chaque lettre. Si vous dépassez Z, revenez à A.
Exemple : R + 7 = Y

### Exercice 3 : Chiffrement de Vigenère

#### 📝 Exercice : Vigenère

**Message :** `ALICE`
**Clé :** `BOB`
**Consigne :** Chiffrer le message.

**Méthode :**
1. Répéter la clé : `ALICE` → `BOBBO`
2. Pour chaque lettre, ajouter le décalage correspondant :
   * A + B (décalage 1) = B
   * L + O (décalage 14) = Z
   * I + B (décalage 1) = J
   * C + B (décalage 1) = D
   * E + O (décalage 14) = S
3. Message chiffré : `BZJDS`

## 🔢 Algorithmes de chiffrement modernes

### AES (Advanced Encryption Standard)

> **Présentation**
>
> **AES** est l'algorithme de chiffrement symétrique le plus utilisé aujourd'hui.
> * **Adopté en 2001** par le gouvernement américain
> * **Tailles de clé :** 128, 192 ou 256 bits
> * **Utilisé partout :** WiFi (WPA2/WPA3), VPN, HTTPS, disques chiffrés
> * **Sécurité :** Considéré comme incassable avec les moyens actuels

> 💡 **Exemple :** Quand vous vous connectez à un réseau WiFi protégé, vos données sont chiffrées avec AES !

**Temps pour casser AES-256 par force brute :**
Avec les ordinateurs les plus puissants actuels : environ **plusieurs milliards d'années**

### DES et 3DES

> **DES (Data Encryption Standard)**
> * Ancien standard (1977)
> * Clé de 56 bits
> * ⚠️ **Obsolète :** Trop facile à casser aujourd'hui

> **3DES (Triple DES)**
> * Applique DES trois fois de suite
> * Plus sécurisé que DES
> * ⚠️ **En phase de dépréciation :** Remplacé par AES

## 🔑 Le problème du chiffrement symétrique : l'échange de clés

> 🚨 **Le grand problème :**
> Comment Alice et Bob peuvent-ils échanger la clé secrète de manière sécurisée ?

**Scénario problématique :**
1. 🦊 **Alice** : "Bob, utilisons la clé : 🔑 X7k#mP92"
2. 📧 ⬇️ (Transmission)
3. **👤 Charlie intercepte la clé !** Il peut maintenant déchiffrer TOUS les messages !
4. 📧 ⬇️
5. 👨‍🔬 **Bob** : "OK, j'ai la clé !"

**Solutions historiques (peu pratiques) :**
* **Rencontre physique :** Alice et Bob se rencontrent en personne → Impossible à grande échelle
* **Courrier sécurisé :** Envoyer la clé par voie postale → Lent et coûteux
* **Messager de confiance :** Utiliser un tiers → Risque de compromission

> ⚠️ **Problème d'échelle :**
> Imaginez une entreprise de 1000 employés. Avec le chiffrement symétrique, chaque paire d'employés doit avoir sa propre clé secrète.
> **Nombre de clés nécessaires :** 1000 × 999 / 2 = **499 500 clés** à gérer ! 😱

> 💡 **La solution :** Le chiffrement asymétrique !

## 🔐🔓 Le chiffrement asymétrique (ou à clé publique)

> **Principe révolutionnaire**
>
> Le **chiffrement asymétrique** utilise **deux clés différentes** :
> * Une **clé publique** 🔑 (peut être partagée avec tout le monde)
> * Une **clé privée** 🔒 (doit rester secrète)
>
> **Propriété magique :**
> * Ce qui est chiffré avec la clé **publique** ne peut être déchiffré qu'avec la clé **privée**
> * Ce qui est chiffré avec la clé **privée** ne peut être déchiffré qu'avec la clé **publique**

**Configuration des clés :**

* **Alice 🦊**
  * 🔑 Clé publique A (visible par tous)
  * 🔒 Clé privée A (secrète)
* **Bob 👨‍🔬**
  * 🔑 Clé publique B (visible par tous)
  * 🔒 Clé privée B (secrète)

### Comment Alice envoie un message confidentiel à Bob

1. **Étape 1 :** Alice récupère la **clé publique de Bob** 🔑 (disponible publiquement)
2. **Étape 2 :** Alice chiffre son message avec la clé publique de Bob
   `Message clair + 🔑 Clé publique Bob = Message chiffré`
3. **Étape 3 :** Alice envoie le message chiffré (même si Charlie l'intercepte, il ne peut rien faire !)
4. **Étape 4 :** Bob déchiffre avec sa **clé privée** 🔒 (lui seul la possède)
   `Message chiffré + 🔒 Clé privée Bob = Message clair`

> ✅ **Avantages :**
> * Pas besoin d'échanger de secret avant de communiquer
> * Les clés publiques peuvent être partagées librement
> * Chaque personne n'a besoin que d'une paire de clés (publique/privée)

> ❌ **Inconvénient :**
> **Beaucoup plus lent** que le chiffrement symétrique (100 à 1000 fois plus lent).

> 💡 **Solution hybride (utilisée dans HTTPS) :**
> 1. Utiliser le chiffrement asymétrique pour échanger une clé symétrique de manière sécurisée
> 2. Utiliser ensuite le chiffrement symétrique (rapide) pour les données
> **Le meilleur des deux mondes !**

## 🔢 RSA : L'algorithme de chiffrement asymétrique

> **Présentation**
>
> **RSA** (Rivest-Shamir-Adleman, 1977) est l'algorithme de chiffrement asymétrique le plus célèbre.
> * Basé sur la difficulté de factoriser de très grands nombres
> * Tailles de clés courantes : 2048 ou 4096 bits
> * Utilisé dans : HTTPS, SSH, signatures numériques, certificats SSL/TLS

### Principe mathématique simplifié

**Génération des clés (version très simplifiée) :**
1. Choisir deux **grands nombres premiers** p et q (exemple : p=61, q=53)
2. Calculer **n = p × q** (exemple : n = 61 × 53 = 3233)
3. Calculer φ(n) = (p-1) × (q-1) (exemple : φ(n) = 60 × 52 = 3120)
4. Choisir e tel que 1 < e < φ(n) et e soit premier avec φ(n) (exemple : e = 17)
5. Calculer d tel que (d × e) mod φ(n) = 1 (exemple : d = 2753)

**Résultat :**
* **Clé publique :** (n, e) = (3233, 17)
* **Clé privée :** (n, d) = (3233, 2753)

> ⚠️ **Important :** Dans la réalité, p et q sont des nombres premiers de plusieurs centaines de chiffres ! L'exemple ci-dessus est juste pour comprendre le principe.

**Sécurité de RSA :**
La sécurité repose sur le fait qu'il est **extrêmement difficile** de retrouver p et q à partir de n quand n est très grand.
Exemple : Factoriser un nombre de 2048 bits prendrait **des milliards d'années** avec les ordinateurs actuels.

### Autres algorithmes asymétriques

> **Courbes elliptiques (ECC - Elliptic Curve Cryptography)**
> * **Avantage :** Sécurité équivalente à RSA avec des clés beaucoup plus courtes
> * Exemple : Une clé ECC de 256 bits ≈ sécurité d'une clé RSA de 3072 bits
> * **Utilisé dans :** Bitcoin, appareils mobiles, cartes à puce
> * **Plus rapide** que RSA

## 👥 Le problème : Human-in-the-Middle

Nous avons vu que le chiffrement asymétrique résout le problème de l'échange de clés. Mais un nouveau problème apparaît : **Comment être sûr qu'on communique avec la bonne personne ?**

> 🚨 **Attaque Human-in-the-Middle (HITM)**

**Scénario d'attaque :**
1. 🦊 Alice demande la clé publique de Bob
2. 👤 **Charlie intercepte** et envoie **SA propre clé publique** à Alice en se faisant passer pour Bob
3. 🦊 Alice chiffre son message avec la clé publique de Charlie (qu'elle croit être celle de Bob)
4. 👤 **Charlie déchiffre** le message, le lit, puis le rechiffre avec la vraie clé publique de Bob
5. 👨‍🔬 Bob reçoit le message, sans se douter de rien

**Résultat :** Charlie peut lire et même **modifier** tous les messages entre Alice et Bob sans qu'ils s'en rendent compte !

> ⚠️ **Problème fondamental :**
> Le chiffrement asymétrique garantit la **confidentialité**, mais pas l'**authenticité** ni l'**intégrité** !
> **Comment être sûr que la clé publique appartient vraiment à Bob ?**

> 💡 **La solution :** Les signatures numériques et les certificats !

## #️⃣ Le hachage : garantir l'intégrité

> **Qu'est-ce qu'un hash (hachage) ?**
>
> Un **hash** (ou **empreinte numérique**) est le résultat d'une **fonction de hachage** appliquée à des données.
>
> **Fonction de hachage :** Transforme des données de taille quelconque en une chaîne de caractères de taille fixe.

**Exemple :**
* Donnée : "Les renards roux chassent de nuit"
* ⬇️ Fonction de hachage (SHA-256)
* Hash (256 bits) : `a3f5b8c9e1d...`

### Propriétés d'une bonne fonction de hachage

1. **Déterministe :** Le même message donne toujours le même hash
2. **Rapide à calculer**
3. **Effet avalanche :** Un changement minime dans le message change complètement le hash
4. **Irréversible :** Impossible de retrouver le message à partir du hash
5. **Résistance aux collisions :** Très difficile de trouver deux messages différents ayant le même hash

### Démonstration de l'effet avalanche

**Message 1 :** `RENARD`
**Hash SHA-256 :** `7a8f3e9c...` (64 caractères hexadécimaux)

**Message 2 :** `RENART` (une seule lettre changée !)
**Hash SHA-256 :** `b2d4c1f8...` (complètement différent !)

### Algorithmes de hachage courants

> **SHA-256 (Secure Hash Algorithm)**
> * Produit un hash de **256 bits** (64 caractères hexadécimaux)
> * **Standard actuel** recommandé
> * Utilisé dans : Bitcoin, certificats SSL, signatures

> **MD5 (Message Digest 5)**
> * Produit un hash de **128 bits** (32 caractères hexadécimaux)
> * ⚠️ **OBSOLÈTE :** Vulnérable aux collisions
> * Encore utilisé pour vérifier l'intégrité de fichiers (checksums)

> **SHA-1**
> * Produit un hash de **160 bits**
> * ⚠️ **Déprécié :** Collisions trouvées en 2017
> * Remplacé par SHA-256

### Exercice pratique : Calculer un hash

#### 📝 Exercice : Vérifier l'intégrité d'un fichier

**Contexte :** Alice veut envoyer un fichier de données sur les renards à Bob. Elle veut s'assurer que le fichier n'est pas corrompu pendant le transfert.

**Méthode :**
1. Alice calcule le hash SHA-256 du fichier : `a3f5b8c9e1d2...`
2. Alice envoie le fichier ET le hash à Bob (séparément)
3. Bob reçoit le fichier et calcule son hash
4. Bob compare les deux hash :
   * ✅ **Identiques** → Le fichier est intègre
   * ❌ **Différents** → Le fichier a été modifié ou corrompu

**Exercice pratique (Windows) :**
```powershell
# Ouvrir PowerShell et calculer le hash d'un fichier
Get-FileHash -Algorithm SHA256 nom_fichier.txt
```

**Exercice pratique (Linux/Mac) :**
```bash
# Dans le terminal
sha256sum nom_fichier.txt
```

**À faire :** Créez un fichier texte avec votre nom, calculez son hash, modifiez une seule lettre, recalculez le hash et observez la différence !

### Utilisations du hachage

* **Vérification d'intégrité :** Téléchargements, sauvegardes
* **Stockage de mots de passe :** On ne stocke jamais les mots de passe en clair, seulement leurs hash
* **Signatures numériques :** On signe le hash du document, pas le document entier
* **Blockchain :** Chaque bloc contient le hash du bloc précédent
* **Détection de doublons :** Deux fichiers identiques ont le même hash

## ✍️ La signature numérique

> **Principe**
>
> Une **signature numérique** est l'équivalent électronique d'une signature manuscrite.
>
> Elle permet de garantir :
> * **Authenticité :** Le message provient bien de l'expéditeur prétendu
> * **Intégrité :** Le message n'a pas été modifié
> * **Non-répudiation :** L'expéditeur ne peut pas nier avoir envoyé le message

### Comment fonctionne la signature numérique ?

**📝 ÉTAPE 1 : Alice signe son message**
1. Alice calcule le **hash** de son message
   ```text
   Message : "Les renards roux..."
   ↓ SHA-256
   Hash : a3f5b8c9e1d2f4a7...
   ```
2. Alice chiffre le hash avec sa **clé privée** 🔒
   ```text
   Hash + 🔒 Clé privée Alice = ✍️ SIGNATURE
   ```
3. Alice envoie : **Message + Signature**

**✅ ÉTAPE 2 : Bob vérifie la signature**
1. Bob calcule le **hash** du message reçu
   ```text
   Message reçu
   ↓ SHA-256
   Hash calculé : a3f5b8c9e1d2f4a7...
   ```
2. Bob déchiffre la signature avec la **clé publique d'Alice** 🔑
   ```text
   ✍️ Signature + 🔑 Clé publique Alice = Hash original
   ```
3. Bob compare les deux hash :
   ```text
   Hash calculé == Hash original ?
   ✅ OUI → Message authentique et intègre
   ❌ NON → Message modifié ou fausse signature
   ```

> ✅ **Garanties de la signature numérique :**
> * **Authenticité :** Seule Alice possède sa clé privée, donc seule elle peut créer cette signature
> * **Intégrité :** Si le message est modifié, le hash ne correspondra plus
> * **Non-répudiation :** Alice ne peut pas nier avoir signé (sa clé privée est unique)

### Différence entre chiffrement et signature

| Aspect | Chiffrement | Signature |
| :--- | :--- | :--- |
| **Objectif** | Confidentialité | Authenticité + Intégrité |
| **Clé utilisée pour créer** | 🔑 Clé publique du destinataire | 🔒 Clé privée de l'émetteur |
| **Clé utilisée pour lire** | 🔒 Clé privée du destinataire | 🔑 Clé publique de l'émetteur |
| **Protège contre** | Lecture non autorisée | Usurpation d'identité et modification |

> 💡 **Mnémotechnique :**
> * **Chiffrer** = Utiliser la clé publique du **DESTINATAIRE** (je veux que lui seul puisse lire)
> * **Signer** = Utiliser la clé privée de l'**ÉMETTEUR** (je prouve que c'est moi qui envoie)

### Exercice : Chiffrement ET Signature

#### 📝 Exercice : Combiner confidentialité et authenticité

**Contexte :** Alice veut envoyer un message à Bob qui soit à la fois **confidentiel** ET **authentifié**.
**Question :** Dans quel ordre Alice doit-elle effectuer les opérations ?

**Option A :**
1. Signer le message avec sa clé privée
2. Chiffrer le message (+ signature) avec la clé publique de Bob

**Option B :**
1. Chiffrer le message avec la clé publique de Bob
2. Signer le message chiffré avec sa clé privée

**Réponse :** **Option A** est la bonne pratique !
* On signe d'abord (pour prouver que c'est Alice)
* Puis on chiffre tout (pour la confidentialité)

## 🏛️ Les autorités de certification (CA)

Nous avons vu que les signatures numériques résolvent le problème d'authenticité. Mais une question demeure : **Comment être sûr que la clé publique d'Alice appartient vraiment à Alice ?**

> **Qu'est-ce qu'une Autorité de Certification ?**
>
> Une **Autorité de Certification (CA - Certificate Authority)** est une entité de confiance qui :
> * Vérifie l'identité des demandeurs
> * Émet des **certificats numériques** qui lient une clé publique à une identité
> * Signe ces certificats avec sa propre clé privée
>
> **Exemples de CA :** DigiCert, Let's Encrypt, GlobalSign, Sectigo

> **Qu'est-ce qu'un certificat numérique ?**
>
> Un **certificat numérique** est un document électronique qui contient :
> * L'identité du propriétaire (nom, organisation, domaine)
> * Sa clé publique
> * La période de validité
> * La signature de l'Autorité de Certification
>
> **Standard :** X.509

### Chaîne de confiance

1. **AC Racine (Root CA)**
   * Préinstallée dans votre navigateur/OS
   * Auto-signée, hautement sécurisée
   * ⬇️ Signe
2. **AC Intermédiaire**
   * Utilisée au quotidien pour émettre des certificats
   * ⬇️ Signe
3. **Certificat du site web**
   * Exemple : www.banque.fr
   * Contient : clé publique du site + identité + signature de l'AC

### Vérification d'un certificat

**Quand vous visitez un site HTTPS, votre navigateur :**
1. Reçoit le certificat du site
2. Vérifie la signature de l'AC intermédiaire
3. Vérifie la signature de l'AC racine (qui est dans votre navigateur)
4. Vérifie la date de validité
5. Vérifie que le nom de domaine correspond

* **Si tout est OK :** 🔒 Cadenas vert (ou icône de sécurité)
* **Si problème :** ⚠️ Avertissement de sécurité

> 💡 **Exercice pratique :**
> Dans votre navigateur, cliquez sur le cadenas à côté de l'URL d'un site HTTPS et explorez les informations du certificat !
> Vous verrez : l'autorité de certification, la date d'expiration, la clé publique, etc.

## 🌍 Exemples concrets dans la vie courante

### HTTPS (Navigation web sécurisée)

> **Comment fonctionne HTTPS ?**
>
> **HTTPS = HTTP + TLS/SSL**
>
> **Protocole TLS (Transport Layer Security) :**
> 1. **Handshake (poignée de main) :**
>    * Le serveur envoie son certificat (contenant sa clé publique)
>    * Le navigateur vérifie le certificat
>    * Le navigateur génère une **clé de session symétrique** aléatoire
>    * Le navigateur chiffre cette clé avec la clé publique du serveur
>    * Le serveur déchiffre avec sa clé privée
> 2. **Communication :**
>    * Tout le reste de la communication utilise le **chiffrement symétrique** (AES) avec la clé de session
>    * C'est rapide et sécurisé !

> ✅ **HTTPS garantit :**
> * **Confidentialité :** Personne ne peut lire vos données
> * **Intégrité :** Les données ne sont pas modifiées
> * **Authenticité :** Vous communiquez bien avec le bon site

### WhatsApp - Chiffrement de bout en bout

> **Comment fonctionne WhatsApp ?**
>
> WhatsApp utilise le **protocole Signal** :
> * **Chiffrement de bout en bout (E2EE) :** Seuls l'expéditeur et le destinataire peuvent lire les messages
> * Même WhatsApp ne peut pas lire vos messages !
> * Chaque conversation a ses propres clés de chiffrement
> * Les clés changent régulièrement (Perfect Forward Secrecy)
>
> **Technique :**
> * Échange de clés avec **Diffie-Hellman**
> * Chiffrement avec **AES-256**
> * Signatures avec **Curve25519**

**Schéma simplifié :**
`📱 → 🔒 → 🔐 → 🔓 → 📱`
Alice → Chiffré sur son téléphone → Transit → Déchiffré sur le téléphone de Bob
✅ WhatsApp ne peut pas lire les messages !

### Telegram - Chiffrement client-serveur (par défaut)

> **Différence avec WhatsApp**
>
> **Mode par défaut (discussions normales) :**
> * Chiffrement **client-serveur**, pas de bout en bout
> * Messages chiffrés entre vous et le serveur Telegram
> * Telegram peut techniquement lire vos messages
> * Avantage : Synchronisation sur tous vos appareils
>
> **Mode "Secret Chat" :**
> * Chiffrement de bout en bout (E2EE)
> * Pas de synchronisation cloud
> * Messages auto-destructibles
> * Protocole maison : MTProto 2.0

### Signal - Le champion de la confidentialité

> **Pourquoi Signal est recommandé ?**
> * **Chiffrement E2EE par défaut** (toujours actif)
> * **Open source :** Le code est public et auditable
> * **Métadonnées minimales :** Signal collecte très peu d'informations
> * **Perfect Forward Secrecy :** Si votre clé est compromise, les anciens messages restent sécurisés
> * Recommandé par Edward Snowden et les experts en sécurité

### Email - PGP/GPG

> **Pretty Good Privacy (PGP)**
>
> PGP permet de chiffrer et signer des emails :
> * Chaque utilisateur a une paire de clés (publique/privée)
> * Les clés publiques sont partagées (serveurs de clés)
> * Permet de chiffrer et signer des emails
> * **Problème :** Complexe à mettre en place pour les utilisateurs non techniques
>
> **Alternative moderne :** ProtonMail (chiffrement E2EE automatique)

### VPN (Virtual Private Network)

> **Comment fonctionne un VPN ?**
> * Crée un **tunnel chiffré** entre votre appareil et le serveur VPN
> * Tout votre trafic passe par ce tunnel
> * Chiffrement : généralement **AES-256**
> * Protocoles : OpenVPN, WireGuard, IKEv2/IPsec
>
> **Avantages :**
> * Cache votre adresse IP
> * Protège sur les réseaux WiFi publics
> * Contourne les restrictions géographiques
>
> ⚠️ **Important :** Vous devez faire confiance au fournisseur VPN (il peut voir votre trafic) !

### Blockchain et Bitcoin

> **Cryptographie dans la blockchain**
> * **Hachage SHA-256 :** Chaque bloc contient le hash du bloc précédent
> * **Clés publiques/privées :** Votre portefeuille = paire de clés
> * **Signatures numériques :** Chaque transaction est signée avec votre clé privée
> * **Preuve de travail :** Mining = trouver un hash avec des contraintes spécifiques
