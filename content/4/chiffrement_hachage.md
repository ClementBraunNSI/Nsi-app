---
title: Chiffrement et Hachage
description: >-
  Fondamentaux de la cryptographie : chiffrement, hachage et signatures
  numériques
level: BTS
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
icon: "lock-keyhole"
prerequisites:
  - rgpd_cnil
audience: public
---

# Chiffrement et hachage

La confidentialité, l'intégrité, l'authenticité et la non-répudiation ne se protègent pas avec les mêmes outils : chacune de ces exigences demande une réponse différente.

La **confidentialité** exige que seules les personnes autorisées puissent lire l'information. Pour empêcher d'autres personnes de lire un message, la réponse technique est le **chiffrement**.

L'**intégrité** exige que l'information n'ait pas été modifiée entre l'envoi et la réception. Pour vérifier qu'un message n'a pas été altéré en chemin, on utilise le **hachage**.

L'**authenticité** exige que l'émetteur soit bien celui qu'il prétend être. Pour s'assurer qu'un message vient bien d'Alice, on utilise la **signature numérique**.

La **non-répudiation** exige que l'émetteur ne puisse pas nier avoir envoyé un message. Si Alice prétend ne rien avoir envoyé, la signature numérique, appuyée sur un certificat, permet de prouver le contraire.

En résumé, le chiffrement protège la confidentialité, le hachage protège l'intégrité, et la signature garantit l'authenticité et la non-répudiation. Il ne faut pas les confondre : un message chiffré peut très bien avoir été modifié.

## Chiffrer, déchiffrer, décrypter

La **cryptographie** est l'ensemble des techniques qui protègent les communications et les données, comme le chiffrement, le déchiffrement, le hachage ou la signature.

Le **chiffrement** transforme un message clair, lisible, en un message illisible, à l'aide d'une **clé**. Sans la clé, « Bonjour » devient quelque chose comme `X8#mK@2pQ`. Le but n'est pas de cacher qu'un message a été envoyé, mais d'empêcher celui qui l'intercepte de le lire.

```text
Message clair + Clé de chiffrement = Message chiffré
"Bonjour" + Clé -> "X8#mK@2pQ"
```

Le **déchiffrement** est l'opération inverse, réalisée par celui qui possède la clé prévue : il retrouve ainsi le message clair.

```text
Message chiffré + Clé de déchiffrement = Message clair
"X8#mK@2pQ" + Clé -> "Bonjour"
```

Le **décryptage** est différent : il consiste à retrouver le message clair **sans** la clé, par force brute, par analyse des fréquences ou en exploitant une faille. C'est le travail de l'attaquant. On déchiffre donc avec la clé, et on décrypte sans elle.

## Un exemple : Alice et Bob

Alice est biologiste. Elle suit une colonie de renards roux et vient d'observer un comportement de communication qu'elle estime inédit. Elle veut envoyer le détail à Bob, un autre chercheur. Ils s'écrivent par courriel. Charlie, un concurrent, surveille le réseau et lit ce qui passe en clair.

Voici le message qu'elle voudrait envoyer :

```text
"Les renards utilisent 12 vocalisations distinctes pour coordonner 
la chasse nocturne. Comportement jamais observé auparavant. 
Données GPS attachées. Publication prévue dans Nature en mars."
```

Si le message circule en clair, Charlie peut le copier et publier la découverte avant elle, s'appropriant des années d'observation. Le chiffrement n'empêche pas Charlie d'intercepter le courriel, mais il l'empêche de le lire : tant qu'il n'a pas la clé, il ne récupère qu'une suite de caractères inutilisable.

## Le chiffrement monoalphabétique

Un chiffrement **monoalphabétique** remplace chaque lettre par une autre, selon une règle fixe. Un A clair donne toujours le même A chiffré, où qu'il soit dans le message.

Le **chiffre de César** décale chaque lettre d'un nombre fixe de places. Ce nombre est la clé. Avec un décalage de 3, l'alphabet clair

`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`

devient

`D E F G H I J K L M N O P Q R S T U V W X Y Z A B C`

`RENARD` donne `UHQDUG` : R devient U, E devient H, N devient Q, A devient D, R devient U, D devient G. Les deux R deviennent deux U, et c'est justement la faiblesse de ce chiffrement. En français, le E est la lettre la plus fréquente : si une lettre domine dans le message chiffré, il s'agit souvent d'un E. L'**analyse de fréquence** permet ainsi de reconstituer l'alphabet sans essayer les 26 clés une par une, et le chiffre de César se casse facilement à la main.

## Le chiffrement polyalphabétique

Un chiffrement **polyalphabétique** utilise plusieurs alphabets de substitution. La même lettre claire peut donner des lettres chiffrées différentes, selon sa position. L'analyse de fréquence simple ne suffit plus.

**Vigenère** répète un mot-clé, et chaque lettre du mot-clé donne le décalage de la lettre du message qui lui fait face. Pour `RENARD` avec la clé `FOX`, la clé se déroule `FOXFOX`.

| Lettre du message | Lettre de la clé | Décalage | Lettre chiffrée |
| :--- | :--- | :--- | :--- |
| R | F | +5 | W |
| E | O | +14 | S |
| N | X | +23 | K |
| A | F | +5 | F |
| R | O | +14 | F |
| D | X | +23 | A |

`RENARD` devient `WSKFFA`. Les deux R ne donnent pas la même lettre (W puis F), car la lettre de la clé a changé entre les deux : c'est tout l'intérêt de ce chiffrement. La clé reste un secret court. Mais si elle est trop courte et le message trop long, des méthodes plus fines permettent de retrouver la longueur du mot-clé. Vigenère résiste donc mieux que César, mais pas à un ordinateur.

On peut décrire le chiffrement comme une fonction. On chiffre par `c = E_k(m)` : le chiffré `c` est l'image du clair `m` par la fonction de chiffrement contrôlée par la clé `k`. On déchiffre par `m = D_k(c)`. Les opérations sont déterministes : décalage modulo 26, XOR, arithmétique modulaire. La propriété qui doit tenir est `D_k(E_k(m)) = m`. Chiffrer puis déchiffrer avec la bonne clé doit redonner le message de départ. Si ce n'est pas le cas, l'algorithme est faux, ou la clé n'est pas la bonne.

## Le chiffrement symétrique

Le chiffrement **symétrique** utilise **une seule clé** pour chiffrer et pour déchiffrer. C'est comme un cadenas que la même clé permet de fermer et d'ouvrir.

Alice et Bob conviennent en privé d'une clé secrète `K`. Alice chiffre le message avec `K` et l'envoie, puis Bob le déchiffre avec la même clé. Ce chiffrement est rapide, même sur de gros volumes de données comme des fichiers, des disques ou des flux réseau.

Le problème se pose avant : comment se mettre d'accord sur `K` sans que Charlie, qui surveille le réseau, lise aussi la clé ? Si la clé circule en clair, le chiffrement ne protège plus rien.

## Exercices à faire à la main

ASCII associe chaque caractère à un entier. On s'en sert dès qu'on chiffre autrement que lettre par lettre.

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

Le **XOR** (ou exclusif) compare deux bits. Il rend 0 s'ils sont identiques, 1 s'ils diffèrent.

| A | B | A XOR B |
| :--- | :--- | :--- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

Appliquer une seconde fois le XOR avec la même clé annule l'opération : chiffrer et déchiffrer reviennent donc au même calcul.

```text
Message XOR Clé = Chiffré
Chiffré XOR Clé = Message
```

Pour `FOX` avec la clé `KEY`, les codes sont F=70, O=79, X=88, K=75, E=69, Y=89. En binaire, F vaut `01000110` et K vaut `01001011`.

```text
  01000110  (F)
⊕ 01001011  (K)
-----------
  00001101  = 13
```

13 n'est pas un caractère imprimable, ce qui est normal, car le message chiffré n'a pas à être lisible. Il reste à calculer O⊕E et X⊕Y.

**César.** Chiffrer `RENARD ROUX` avec un décalage de 7. L'espace n'est pas décalé. R+7 donne Y, et au-delà de Z, on reprend à A. Déchiffrer ensuite `ZLJHYL`, toujours avec 7 : on soustrait le décalage au lieu de l'ajouter.

**Vigenère.** Chiffrer `ALICE` avec la clé `BOB`. La clé se répète en `BOBBO`. A+B (décalage 1) donne B, L+O (14) donne Z, I+B donne J, C+B donne D, E+O donne S. Le chiffré est `BZJDS`. Refaire le tableau lettre par lettre avant de vérifier ce résultat : la réponse est donnée pour contrôler la méthode, et non pour éviter de l'appliquer.

## Les algorithmes utilisés aujourd'hui

**AES** (*Advanced Encryption Standard*) est le chiffrement symétrique de référence, adopté en 2001 par le gouvernement américain. Les clés font 128, 192 ou 256 bits. On le trouve dans le Wi-Fi (WPA2, WPA3), les VPN, HTTPS et les disques chiffrés. Avec les moyens actuels, essayer toutes les clés d'AES-256 prendrait des milliards d'années. Quand un poste se connecte à un Wi-Fi protégé, le trafic est chiffré avec AES. La clé utilisée n'est pas le mot de passe saisi : elle est dérivée de ce mot de passe, puis négociée.

**DES** (*Data Encryption Standard*), standard de 1977, utilise une clé de 56 bits. Toutes les clés de cette taille peuvent aujourd'hui être essayées, si bien que DES est obsolète. **3DES** applique DES trois fois de suite. Il est plus résistant que DES seul, mais il est lui aussi abandonné au profit d'AES. Un système qui utilise encore 3DES doit donc être migré.

## Le problème de l'échange des clés

Si Alice envoie à Bob « utilisons la clé X7k#mP92 » sur le même canal que Charlie surveille, Charlie peut déchiffrer tous les messages suivants, puisqu'il possède la clé tout comme Bob.

Se rencontrer pour échanger la clé devient impossible dès que les correspondants sont nombreux. L'envoyer par la poste est lent, et le courrier peut être ouvert. Passer par un messager oblige à faire confiance à une personne de plus. Avec 1 000 employés qui doivent pouvoir s'écrire deux à deux, chaque paire a besoin de sa clé : 1000 × 999 / 2 = **499 500** clés à créer, à ranger, à révoquer quand quelqu'un part. Le chiffrement symétrique est rapide, mais la gestion manuelle de ses clés est très lourde.

## Le chiffrement asymétrique

Le chiffrement **asymétrique** donne à chaque personne une **paire**. La **clé publique** est diffusée à tous, alors que la **clé privée** reste chez son propriétaire. Ce qui est chiffré avec l'une ne peut être déchiffré qu'avec l'autre. Un message chiffré avec la clé publique de Bob ne peut donc être lu qu'avec la clé privée de Bob. À l'inverse, un message chiffré avec la clé privée d'Alice se déchiffre avec sa clé publique. Cette seconde opération ne cache rien, puisque tout le monde possède la clé publique : elle sert à signer, et non à rendre un message confidentiel.

Alice veut écrire à Bob sans avoir échangé de secret avec lui. Elle utilise la clé publique de Bob, qui est publiée, pour chiffrer son message, puis elle l'envoie. Charlie peut copier le message chiffré, mais sans la clé privée de Bob, il ne peut pas le lire. Bob, lui, le déchiffre avec sa clé privée, qu'il est le seul à posséder.

Aucun secret n'a donc été échangé au préalable : seules les clés publiques circulent, et chacun n'a besoin que d'une paire de clés, au lieu d'une clé par correspondant. L'inconvénient est la lenteur, puisque ce chiffrement est de 100 à 1 000 fois plus lent que le chiffrement symétrique. On ne chiffre donc pas un disque entier avec RSA.

HTTPS combine les deux méthodes. Le chiffrement asymétrique sert à se mettre d'accord de façon sûre sur une clé symétrique de session, puis le chiffrement symétrique, plus rapide, chiffre les données. L'opération lente n'est ainsi faite qu'une seule fois, au début de l'échange.

## RSA et les courbes elliptiques

**RSA** (Rivest, Shamir, Adleman, 1977) est l'algorithme asymétrique le plus enseigné. Sa sécurité repose sur la difficulté de factoriser un très grand entier. Les clés courantes font 2048 ou 4096 bits. On le trouve dans HTTPS, SSH, les signatures, les certificats TLS.

Voici la génération des clés avec de petits nombres. L'objectif est de comprendre la méthode, et non de protéger réellement des données :

1. On choisit deux nombres premiers, p = 61 et q = 53.
2. n = p × q = 61 × 53 = 3233.
3. φ(n) = (p − 1) × (q − 1) = 60 × 52 = 3120.
4. On choisit un exposant e tel que 1 < e < φ(n) et premier avec φ(n). Ici e = 17.
5. On calcule l'exposant d tel que (d × e) mod φ(n) = 1. Ici d = 2753.

La clé publique est le couple (n, e) = (3233, 17). La clé privée est (n, d) = (3233, 2753). Dans un vrai RSA, p et q ont des centaines de chiffres. Retrouver p et q à partir d'un n de 2048 bits se compte, avec les machines actuelles, en milliards d'années. L'exemple 3233, lui, se factorise en une minute : il sert à expliquer la forme des clés, et non à chiffrer de vraies données.

Les **courbes elliptiques** (ECC) obtiennent une sécurité comparable avec des clés bien plus courtes. Une clé ECC de 256 bits se compare à une clé RSA d'environ 3072 bits. Le calcul est aussi plus rapide. On les trouve dans Bitcoin, les téléphones et les cartes à puce, où la place et le temps de calcul sont limités.

## À qui appartient la clé publique ?

Le chiffrement asymétrique résout le problème de l'échange du secret, mais il soulève une autre question : comment être sûr que la clé publique reçue est bien celle de Bob ?

Alice demande la clé publique de Bob. Charlie intercepte la demande et envoie **sa propre** clé publique en se faisant passer pour Bob. Alice chiffre son message pour « Bob ». Charlie le déchiffre avec sa clé privée, le lit, puis le rechiffre avec la vraie clé publique de Bob. Bob reçoit un message cohérent et ne remarque rien, alors que Charlie a pu le lire et le modifier.

C'est l'attaque de l'**homme du milieu**. Le chiffrement a bien fonctionné, puisque le message n'a pas circulé en clair. Mais l'authenticité n'est pas garantie, car Alice n'a jamais vérifié à qui appartenait la clé, et l'intégrité non plus, puisque Charlie peut modifier le message avant de le rechiffrer. Il manque un lien entre une clé publique et une identité, que Charlie ne puisse pas falsifier.

## Le hachage

Une **fonction de hachage** transforme une donnée de taille quelconque en une empreinte de taille fixe, le **hash**. « Les renards roux chassent de nuit », passé à SHA-256, donne 256 bits, qu'on écrit souvent en hexadécimal : `a3f5b8c9e1d...`. L'empreinte ne remplace pas le message, et on ne peut pas « déchiffrer » un hash : il n'y a pas de clé, et l'opération n'est pas conçue pour être inversée.

Une fonction de hachage a cinq propriétés. Le calcul est **déterministe** : le même message donne toujours la même empreinte. Il est **rapide**. L'**effet avalanche** fait qu'un changement minime du message modifie complètement l'empreinte. `RENARD` et `RENART` ne partagent pas un préfixe reconnaissable en SHA-256 : les deux empreintes, sur 64 caractères hexadécimaux, n'ont rien à voir. La fonction est **à sens unique** : l'empreinte ne permet pas de reconstruire le message. Elle **résiste aux collisions** : trouver deux messages différents de même empreinte doit être impraticable.

**SHA-256** produit 256 bits, soit 64 symboles hexadécimaux. C'est le standard actuel, utilisé par Bitcoin, les certificats et les signatures. **MD5** produit 128 bits, soit 32 symboles hexadécimaux. Comme des collisions sont connues, il est obsolète pour la sécurité, même s'il sert encore à un contrôle d'intégrité sommaire, quand une collision volontaire n'est pas à craindre. **SHA-1** produit 160 bits. Des collisions ont été publiées en 2017, et il est désormais remplacé par SHA-256. Un certificat ou une signature qui utilise encore SHA-1 doit être considéré avec méfiance.

Alice envoie à Bob un fichier de relevés. Elle calcule son empreinte SHA-256, `a3f5b8c9e1d2...`, puis elle transmet le fichier **et** l'empreinte, si possible par deux canaux différents. Bob recalcule l'empreinte du fichier reçu. Si les deux empreintes sont identiques, le fichier n'a pas été modifié pendant le transfert. Si elles sont différentes, il a été modifié ou abîmé, et Bob ne l'utilise pas. L'empreinte envoyée sur le même canal que le fichier, sans autre protection, ne protège pas contre Charlie : il peut modifier le fichier et remplacer l'empreinte par celle du fichier modifié. Le hachage détecte donc une altération accidentelle, ou une altération faite par quelqu'un qui ne peut pas remplacer l'empreinte, mais il ne prouve pas à lui seul l'identité de l'expéditeur.

Sous Windows :

```powershell
Get-FileHash -Algorithm SHA256 nom_fichier.txt
```

Sous Linux ou macOS :

```bash
sha256sum nom_fichier.txt
```

Créer un fichier contenant son nom, calculer son empreinte, changer une lettre, puis recalculer l'empreinte. Les deux empreintes n'ont rien à voir : c'est l'effet avalanche.

Le hachage sert à vérifier un téléchargement ou une sauvegarde. Il sert aussi à stocker les mots de passe : la base ne contient pas le mot de passe lui-même, mais son empreinte, qui est recalculée lors de la vérification. On signe aussi l'empreinte d'un document plutôt que le document entier, car la signature asymétrique est lente et l'empreinte est courte. Dans une chaîne de blocs, chaque bloc contient l'empreinte du précédent, si bien que modifier un bloc ancien change toutes les empreintes suivantes. Enfin, deux fichiers identiques ont la même empreinte, ce qui permet de détecter les doublons. Si deux fichiers différents avaient la même empreinte, il s'agirait d'une collision, ce qu'un algorithme encore recommandé rend impossible en pratique.

## La signature numérique

Une **signature numérique** joue le rôle d'une signature manuscrite, avec trois garanties supplémentaires. Elle garantit l'**authenticité**, car le message vient de celui qui possède la clé privée, et l'**intégrité**, car la vérification échoue si le message a été modifié. Elle garantit enfin la **non-répudiation** : l'auteur ne peut pas nier, car la clé privée qui a signé n'appartient qu'à lui, et un certificat relie cette clé à son nom.

Pour signer, Alice commence par calculer l'empreinte du message.

```text
Message : "Les renards roux..."
  | SHA-256
Hash : a3f5b8c9e1d2f4a7...
```

Elle chiffre ensuite cette empreinte avec **sa clé privée** : le résultat est la signature. Elle envoie le message, chiffré ou non, accompagné de cette signature.

```text
Hash + clé privée d'Alice = signature
```

Bob recalcule l'empreinte du message reçu. Il déchiffre la signature avec la **clé publique d'Alice**, et il obtient l'empreinte qu'Alice avait calculée. Si les deux empreintes coïncident, le message est celui qu'Alice a signé, et il n'a pas changé. Sinon, le message a été modifié, ou la signature a été produite avec une autre clé.

Seule la clé privée d'Alice peut produire une signature que sa clé publique permet de vérifier, ce qui garantit l'authenticité. Un message modifié donne une autre empreinte, ce qui garantit l'intégrité. Enfin, tant que sa clé privée n'a pas été volée, Alice ne peut pas prétendre qu'une autre clé a signé à sa place, ce qui garantit la non-répudiation.

| | Chiffrement | Signature |
| :--- | :--- | :--- |
| Objectif | Confidentialité | Authenticité et intégrité |
| Clé qui produit | Clé publique du destinataire | Clé privée de l'émetteur |
| Clé qui vérifie ou lit | Clé privée du destinataire | Clé publique de l'émetteur |
| Contre quoi | La lecture par un tiers | L'usurpation et la modification |

On chiffre avec la clé publique du **destinataire**, pour qu'il soit le seul à pouvoir lire le message. On signe avec la clé privée de l'**émetteur**, pour prouver que le message vient de lui. Inverser les clés ne donne pas une variante, mais une autre opération, qui n'apporte pas la garantie recherchée.

Alice veut les deux : que Bob seul lise, et que Bob sache que c'est elle. Deux ordres sont possibles.

Option A : elle signe d'abord le message avec sa clé privée, puis elle chiffre le message et la signature avec la clé publique de Bob.

Option B : elle chiffre d'abord le message avec la clé publique de Bob, puis elle signe le message chiffré avec sa clé privée.

On retient l'**option A**. La signature porte alors sur le message clair : après le déchiffrement, Bob vérifie qu'Alice a bien signé ce texte, et le chiffrement protège à la fois le message et la signature. Dans l'option B, Alice signe un message chiffré : cela prouve seulement qu'elle a vu ce message chiffré, et non qu'elle assume son contenu, et un tiers pourrait réutiliser la signature dans un autre contexte. On signe donc le contenu, puis on chiffre l'ensemble.

## Les certificats

Une signature prouve qu'une certaine clé privée a signé, mais elle ne prouve pas à elle seule que cette clé est celle d'Alice. Une **autorité de certification** vérifie l'identité de celui qui demande un certificat, puis émet un **certificat** qui lie cette identité à une clé publique, et elle signe ce certificat avec sa propre privée. DigiCert, Let's Encrypt, GlobalSign, Sectigo font ce métier.

Le certificat, au format **X.509**, porte l'identité (nom, organisation, nom de domaine), la clé publique, les dates de validité, et la signature de l'autorité.

La confiance se lit en chaîne. L'**autorité racine** est préinstallée dans le système ou le navigateur. Son certificat est auto-signé et très protégé, car s'il était falsifié, tous les certificats qui en dépendent le seraient aussi. Cette autorité signe des **autorités intermédiaires**, qui signent au quotidien les certificats des sites. Le certificat de `www.banque.fr` contient la clé publique du site, son identité, et la signature de l'intermédiaire. Le navigateur remonte cette chaîne jusqu'à une racine qu'il connaît déjà. Il ne fait donc pas confiance au site sur sa seule parole, mais parce qu'une autorité racine déjà installée a signé l'autorité qui a signé le certificat du site.

À l'ouverture d'une page HTTPS, le navigateur reçoit le certificat, vérifie la signature de l'intermédiaire, vérifie que cet intermédiaire remonte à une racine installée, vérifie les dates, vérifie que le nom de domaine du certificat est celui de l'adresse. Si la chaîne tient, le cadenas s'affiche. Sinon, le navigateur affiche un avertissement. Cet avertissement n'est pas un simple détail : il signale que la chaîne de confiance est rompue.

Cliquer sur le cadenas d'un site HTTPS et lire son certificat, en repérant l'autorité de certification, la date d'expiration et la clé publique : on y voit toute la chaîne de confiance.

## Les applications dans les protocoles

**HTTPS** est HTTP plus TLS. Au début de la connexion, le serveur envoie son certificat, et donc sa clé publique. Le navigateur vérifie la chaîne de confiance, tire au hasard une clé de session symétrique, la chiffre avec la clé publique du serveur et l'envoie. Le serveur la déchiffre avec sa clé privée. Ensuite, les deux côtés chiffrent leurs échanges avec AES et cette clé de session. HTTPS assure la confidentialité du contenu, l'intégrité de ce qui passe, et l'authenticité du serveur, à condition que le certificat soit le bon et que l'autorité racine soit digne de confiance. HTTPS ne rend pas anonyme : le nom du site visité reste visible.

**WhatsApp** s'appuie sur le protocole Signal. Le chiffrement est de **bout en bout** : le message est chiffré sur le téléphone de l'émetteur et déchiffré sur celui du destinataire. Le service qui transporte les messages ne peut pas lire leur contenu. Chaque conversation a ses propres clés, qui changent régulièrement : c'est la confidentialité persistante (*perfect forward secrecy*). Une clé volée plus tard ne permet donc pas de lire les messages déjà échangés. L'échange de clés utilise Diffie-Hellman, le chiffrement AES-256, les signatures sur la courbe Curve25519.

**Telegram**, dans les discussions ordinaires, chiffre les messages entre le client et ses serveurs, mais pas de bout en bout : le service peut techniquement lire les messages, ce qui permet de les retrouver sur tous les appareils. Le mode « discussion secrète » chiffre de bout en bout, sans copie dans le cloud, avec des messages qui peuvent s'effacer, grâce au protocole MTProto 2.0 développé par Telegram. Les deux modes n'offrent donc pas la même protection, et c'est le premier qui est activé par défaut.

**Signal** chiffre de bout en bout par défaut, sans mode particulier à activer. Son application est open source, donc vérifiable, et le service collecte peu de métadonnées. Il assure lui aussi la confidentialité persistante. Edward Snowden et une grande partie des spécialistes de la sécurité le recommandent quand il s'agit de protéger le contenu des messages, et pas seulement leur transport.

Le courriel classique n'offre aucune de ces protections. **PGP** (et son implémentation GPG) donne une paire de clés à chaque personne, et les clés publiques sont publiées, notamment sur des serveurs de clés. On chiffre pour le destinataire et on signe en tant qu'émetteur, mais la mise en place reste lourde pour un non-spécialiste. ProtonMail propose un chiffrement de bout en bout déjà configuré, sans que l'utilisateur ait à gérer les clés. Il reste toutefois utile de savoir où sont stockées les clés et qui peut y accéder.

Un **VPN** ouvre un tunnel chiffré entre l'appareil et le serveur du fournisseur. Tout le trafic passe par ce tunnel, en général chiffré avec AES-256. Les protocoles courants sont OpenVPN, WireGuard, IKEv2/IPsec. Les sites visités voient l'adresse IP du VPN, et non celle du poste. Sur un Wi-Fi public, les autres utilisateurs ne peuvent donc pas lire le trafic. En revanche, le VPN ne chiffre pas les données au-delà de son propre serveur : le fournisseur voit le trafic à la sortie du tunnel. Il faut donc choisir un fournisseur de VPN à qui l'on fait confiance.

Dans une **chaîne de blocs** comme Bitcoin, SHA-256 enchaîne les blocs : chacun porte l'empreinte du précédent. Un portefeuille est une paire de clés. Une transaction est signée avec la clé privée, et n'importe qui la vérifie avec la publique. La preuve de travail demande de trouver une empreinte qui respecte une contrainte, par exemple commencer par un certain nombre de zéros. Modifier un bloc ancien oblige à refaire cette recherche pour ce bloc et pour tous les suivants : c'est l'empreinte qui rend la falsification de la chaîne si coûteuse.
