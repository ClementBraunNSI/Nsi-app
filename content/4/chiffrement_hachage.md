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

La confidentialité, l'intégrité, l'authenticité et la non-répudiation ne se protègent pas avec le même outil. À chacune de ces quatre questions correspond une réponse différente.

La **confidentialité** veut que seules les personnes autorisées lisent l'information. Est-ce que quelqu'un d'autre peut lire le message ? La réponse technique est le **chiffrement**.

L'**intégrité** veut que l'information n'ait pas été modifiée entre l'envoi et la réception. Le message a-t-il été altéré en chemin ? La réponse est le **hachage**.

L'**authenticité** veut que l'émetteur soit bien celui qu'il prétend. Suis-je sûr que c'est Alice qui a envoyé ceci ? La réponse est la **signature numérique**.

La **non-répudiation** veut que l'émetteur ne puisse pas nier ensuite avoir envoyé. Alice peut-elle prétendre qu'elle n'a rien envoyé ? La signature numérique, appuyée sur un certificat, tient encore quand elle le nie.

Le chiffrement protège la confidentialité. Le hachage protège l'intégrité. La signature garantit l'authenticité et la non-répudiation. Les mélanger, c'est croire qu'un cadenas empêche aussi qu'on change le colis.

## Trois mots qu'on confond

La **cryptographie** est l'ensemble des techniques qui protègent les communications et les données : chiffrer, déchiffrer, hacher, signer.

Le **chiffrement** transforme un message clair, lisible, en un message illisible, à l'aide d'une **clé**. Sans la clé, « Bonjour » devient quelque chose comme `X8#mK@2pQ`. Le but n'est pas de cacher qu'un message a été envoyé. Le but est que celui qui l'intercepte ne puisse pas le lire.

```text
Message clair + Clé de chiffrement = Message chiffré
"Bonjour" + Clé -> "X8#mK@2pQ"
```

Le **déchiffrement** est l'opération légitime inverse. On possède la clé prévue, on retrouve le clair.

```text
Message chiffré + Clé de déchiffrement = Message clair
"X8#mK@2pQ" + Clé -> "Bonjour"
```

Le **décryptage** est autre chose. C'est retrouver le clair **sans** la clé : force brute, analyse des fréquences, exploitation d'une faille. C'est le travail de celui qui attaque. Déchiffrer, c'est avec la clé. Décrypter, c'est sans.

## Alice, Bob, et le message en clair

Alice est biologiste. Elle suit une colonie de renards roux et vient d'observer un comportement de communication qu'elle estime inédit. Elle veut envoyer le détail à Bob, un autre chercheur. Ils s'écrivent par courriel. Charlie, un concurrent, surveille le réseau et lit ce qui passe en clair.

Le message qu'elle voudrait envoyer :

```text
"Les renards utilisent 12 vocalisations distinctes pour coordonner 
la chasse nocturne. Comportement jamais observé auparavant. 
Données GPS attachées. Publication prévue dans Nature en mars."
```

En clair, Charlie le copie, publie avant elle, et des années d'observation changent de signature. Chiffrer ne l'empêche pas d'intercepter le courriel. Cela l'empêche de le lire : il ne récupère qu'une suite inutilisable, tant qu'il n'a pas la clé.

## Une lettre, toujours la même

Un chiffrement **monoalphabétique** remplace chaque lettre par une autre, selon une règle fixe. Un A clair donne toujours le même A chiffré, où qu'il soit dans le message.

Le **chiffre de César** décale chaque lettre d'un nombre fixe de places. Ce nombre est la clé. Avec un décalage de 3, l'alphabet clair

`A B C D E F G H I J K L M N O P Q R S T U V W X Y Z`

devient

`D E F G H I J K L M N O P Q R S T U V W X Y Z A B C`

`RENARD` donne `UHQDUG` : R devient U, E devient H, N devient Q, A devient D, R devient U, D devient G. Les deux R deviennent deux U. C'est précisément la faiblesse. En français, le E est la lettre la plus fréquente. Si une lettre domine le message chiffré, c'est souvent un E. L'**analyse de fréquence** reconstitue l'alphabet sans essayer les 26 clés une par une. César se casse à la main.

## Une lettre, plusieurs visages

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

`RENARD` devient `WSKFFA`. Les deux R ne donnent pas la même lettre : W puis F. Le mot-clé a changé entre les deux. C'est tout l'intérêt. La clé reste un secret court. Si elle est trop courte et le message trop long, des méthodes plus fines retrouvent la longueur du mot-clé. Vigenère résiste mieux que César. Il ne résiste pas à un ordinateur.

On peut écrire le même geste comme une fonction. On chiffre par `c = E_k(m)` : le chiffré `c` est l'image du clair `m` par la fonction de chiffrement contrôlée par la clé `k`. On déchiffre par `m = D_k(c)`. Les opérations sont déterministes : décalage modulo 26, XOR, arithmétique modulaire. La propriété qui doit tenir est `D_k(E_k(m)) = m`. Chiffrer puis déchiffrer avec la bonne clé rend le message. Si ce n'est pas le cas, l'algorithme est faux, ou la clé n'est pas la bonne.

## La même clé des deux côtés

Le chiffrement **symétrique** utilise **une seule clé** pour chiffrer et pour déchiffrer. C'est un cadenas dont la même clé ferme et ouvre.

Alice et Bob conviennent d'une clé secrète `K`, en privé. Alice chiffre avec `K`. Elle envoie le chiffré. Bob déchiffre avec la même `K`. C'est rapide, y compris sur de gros volumes : fichiers, disques, flux réseau.

Le problème est en amont. Comment se mettre d'accord sur `K` sans que Charlie, qui lit le réseau, lise aussi la clé ? Si la clé voyage en clair, le chiffrement qui suit ne protège plus rien.

## Trois exercices à la main

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

L'appliquer une seconde fois avec la même clé annule l'opération. Chiffrer et déchiffrer, c'est le même calcul.

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

13 n'est pas un caractère imprimable. En chiffrement, c'est normal : le chiffré n'a pas à se lire. Reste à terminer O⊕E et X⊕Y.

**César.** Chiffrer `RENARD ROUX` avec un décalage de 7. L'espace ne se décale pas. R+7 donne Y ; au-delà de Z, on reprend à A. Déchiffrer ensuite `ZLJHYL`, toujours avec 7 : on soustrait le décalage au lieu de l'ajouter.

**Vigenère.** Chiffrer `ALICE` avec la clé `BOB`. La clé se répète en `BOBBO`. A+B (décalage 1) donne B, L+O (14) donne Z, I+B donne J, C+B donne D, E+O donne S. Le chiffré est `BZJDS`. Refaire le tableau lettre par lettre avant de vérifier ce résultat : le cours donne la réponse pour contrôler le geste, pas pour le sauter.

## Ce qu'on utilise vraiment

**AES** (*Advanced Encryption Standard*) est le chiffrement symétrique de référence, adopté en 2001 par le gouvernement américain. Les clés font 128, 192 ou 256 bits. On le trouve dans le Wi-Fi (WPA2, WPA3), les VPN, HTTPS, les disques chiffrés. Avec les moyens actuels, une recherche exhaustive sur AES-256 se compte en milliards d'années. Quand un poste se connecte à un Wi-Fi protégé, le trafic qui suit est chiffré avec AES. La clé de ce trafic n'est pas le mot de passe tapé à la main : elle en est dérivée, puis négociée. Le mot de passe n'est pas la clé AES.

**DES** (*Data Encryption Standard*), standard de 1977, utilise une clé de 56 bits. Cette taille se parcourt aujourd'hui. DES est obsolète. **3DES** applique DES trois fois de suite. C'est plus résistant que DES seul, et il est en cours d'abandon au profit d'AES. Un système qui annonce encore 3DES se migre. Il ne se défend pas comme « encore assez bon ».

## Pourquoi la clé symétrique ne voyage pas

Si Alice envoie à Bob « utilisons la clé X7k#mP92 » sur le même canal que Charlie surveille, Charlie déchiffre tout ce qui suit. Bob a la clé. Charlie aussi.

Se voir pour échanger la clé ne passe pas à l'échelle. La poster est lent, et le pli peut être ouvert. Passer par un messager, c'est faire confiance à une personne de plus. Avec 1 000 employés qui doivent pouvoir s'écrire deux à deux, chaque paire a besoin de sa clé : 1000 × 999 / 2 = **499 500** clés à créer, à ranger, à révoquer quand quelqu'un part. Le chiffrement symétrique est rapide. La gestion de ses clés, à la main, ne l'est pas.

## Deux clés, des rôles contraires

Le chiffrement **asymétrique** donne à chaque personne une **paire**. La **clé publique** se diffuse. La **clé privée** ne quitte pas son propriétaire. Ce qui est chiffré avec l'une ne se déchiffre qu'avec l'autre. Chiffrer avec la publique de Bob ne se lit qu'avec la privée de Bob. Chiffrer avec la privée d'Alice ne se lit qu'avec la publique d'Alice. La seconde opération ne cache rien à qui possède la publique, tout le monde. Elle sert à signer, pas à rendre confidentiel.

Alice veut écrire à Bob sans secret préalable. Elle prend la clé publique de Bob, qui est publiée. Elle chiffre avec. Elle envoie le chiffré. Charlie peut le copier : sans la privée de Bob, il ne lit pas. Bob déchiffre avec sa privée, que lui seul a.

On n'a pas échangé de secret avant de parler. Les publiques circulent. Chacun n'a qu'une paire, pas une clé par correspondant. Le coût est la lenteur : de l'ordre de 100 à 1 000 fois plus lent que le symétrique. On ne chiffre pas un disque entier en RSA.

HTTPS combine les deux. L'asymétrique sert à se mettre d'accord, de façon sûre, sur une clé symétrique de session. Le symétrique, rapide, chiffre ensuite les données. On paie le coût lent une fois, au début. On paie le coût rapide pour tout le reste.

## RSA, puis les courbes

**RSA** (Rivest, Shamir, Adleman, 1977) est l'algorithme asymétrique le plus enseigné. Sa sécurité repose sur la difficulté de factoriser un très grand entier. Les clés courantes font 2048 ou 4096 bits. On le trouve dans HTTPS, SSH, les signatures, les certificats TLS.

Voici la génération des clés sur de petits nombres. Le but est de voir le geste, pas de protéger quoi que ce soit :

1. On choisit deux nombres premiers, p = 61 et q = 53.
2. n = p × q = 61 × 53 = 3233.
3. φ(n) = (p − 1) × (q − 1) = 60 × 52 = 3120.
4. On choisit un exposant e tel que 1 < e < φ(n) et premier avec φ(n). Ici e = 17.
5. On calcule l'exposant d tel que (d × e) mod φ(n) = 1. Ici d = 2753.

La clé publique est le couple (n, e) = (3233, 17). La clé privée est (n, d) = (3233, 2753). Dans un vrai RSA, p et q ont des centaines de chiffres. Retrouver p et q à partir d'un n de 2048 bits se compte, avec les machines actuelles, en milliards d'années. L'exemple 3233 se factorise en une minute : il explique la forme des clés, il ne chiffre rien de réel.

Les **courbes elliptiques** (ECC) obtiennent une sécurité comparable avec des clés bien plus courtes. Une clé ECC de 256 bits se compare à une clé RSA d'environ 3072 bits. Le calcul est plus rapide. On les trouve dans Bitcoin, les téléphones, les cartes à puce, là où la place et le temps comptent.

## La clé publique de qui ?

L'asymétrique règle l'échange du secret. Il ouvre une autre question : la clé publique que je tiens est-elle bien celle de Bob ?

Alice demande la publique de Bob. Charlie intercepte la demande et envoie **sa** publique, en se présentant comme Bob. Alice chiffre pour « Bob ». Charlie déchiffre avec sa privée, lit, puis rechiffre avec la vraie publique de Bob. Bob reçoit un message cohérent. Il ne voit pas le détour. Charlie a lu, et il a pu modifier.

C'est l'attaque de l'**homme du milieu**. Le chiffrement a tenu : le message n'a pas circulé en clair. L'authenticité n'a pas tenu : Alice n'a jamais vérifié à qui appartenait la clé. L'intégrité non plus, puisque Charlie peut réécrire avant de rechiffrer. Il manque un lien entre une clé publique et une identité, que Charlie ne puisse pas fabriquer.

## Le hachage ne chiffre pas

Une **fonction de hachage** transforme une donnée de taille quelconque en une empreinte de taille fixe, le **hash**. « Les renards roux chassent de nuit », passé à SHA-256, donne 256 bits, qu'on écrit souvent en hexadécimal : `a3f5b8c9e1d...`. L'empreinte ne remplace pas le message. On ne « déchiffre » pas un hash. Il n'y a pas de clé, et l'opération n'est pas faite pour s'inverser.

Cinq propriétés. Le calcul est **déterministe** : le même message donne toujours la même empreinte. Il est **rapide**. L'**effet avalanche** veut qu'un changement minime du message bouleverse l'empreinte. `RENARD` et `RENART` ne partagent pas un préfixe reconnaissable en SHA-256 : les deux empreintes, sur 64 caractères hexadécimaux, n'ont rien à voir. La fonction est **à sens unique** : l'empreinte ne permet pas de reconstruire le message. Elle **résiste aux collisions** : trouver deux messages différents de même empreinte doit être impraticable.

**SHA-256** produit 256 bits, soit 64 symboles hexadécimaux. C'est le standard qu'on retient : Bitcoin, certificats, signatures. **MD5** produit 128 bits, 32 symboles hexadécimaux. Des collisions sont connues. Il est obsolète pour la sécurité. On le croise encore comme contrôle d'intégrité sommaire d'un fichier, là où une collision volontaire n'est pas la menace. **SHA-1** produit 160 bits. Des collisions ont été publiées en 2017. Il est déprécié, remplacé par SHA-256. Un certificat ou une signature encore en SHA-1 se traite comme un avertissement, pas comme une preuve.

Alice envoie à Bob un fichier de relevés. Elle calcule le SHA-256, `a3f5b8c9e1d2...`, et elle transmet le fichier **et** l'empreinte, par deux canaux si elle peut. Bob recalcule l'empreinte du fichier reçu. Identiques : le fichier n'a pas bougé pendant le transfert. Différentes : il a été modifié ou corrompu, et Bob ne l'exploite pas. L'empreinte envoyée sur le même canal que le fichier, sans autre protection, ne protège pas contre Charlie : il peut modifier le fichier et remplacer l'empreinte par celle du fichier modifié. Le hachage détecte une altération accidentelle, ou une altération faite par quelqu'un qui ne peut pas remplacer l'empreinte. Seul, il ne signe pas l'expéditeur.

Sous Windows :

```powershell
Get-FileHash -Algorithm SHA256 nom_fichier.txt
```

Sous Linux ou macOS :

```bash
sha256sum nom_fichier.txt
```

Créer un fichier avec son nom, calculer l'empreinte, changer une lettre, recalculer. Les deux empreintes ne se ressemblent pas. C'est l'avalanche, visible.

On hache pour vérifier un téléchargement ou une sauvegarde. On hache les mots de passe : la base ne contient pas le secret, elle contient une empreinte, et la vérification recalcule. On signe l'empreinte d'un document plutôt que le document, parce que la signature asymétrique est lente et l'empreinte est courte. Une chaîne de blocs range dans chaque bloc l'empreinte du précédent : modifier un bloc ancien casse toutes les empreintes qui suivent. Deux fichiers identiques ont la même empreinte, ce qui détecte un doublon. Si deux fichiers différents avaient la même empreinte, ce serait une collision, et c'est précisément ce qu'un algorithme encore recommandé rend impraticable.

## Signer, ce n'est pas chiffrer

Une **signature numérique** joue le rôle d'une signature manuscrite, avec trois garanties que l'encre ne donne pas toute seule. L'**authenticité** : le message vient de celui qui possède la clé privée. L'**intégrité** : s'il a été modifié, la vérification échoue. La **non-répudiation** : l'auteur ne peut pas nier, parce que la privée qui a signé n'appartient qu'à lui, et qu'un certificat relie cette clé à son nom.

Alice signe ainsi. Elle calcule l'empreinte du message.

```text
Message : "Les renards roux..."
  | SHA-256
Hash : a3f5b8c9e1d2f4a7...
```

Elle chiffre cette empreinte avec **sa clé privée**. Le résultat est la signature. Elle envoie le message, en clair ou non, accompagné de la signature.

```text
Hash + clé privée d'Alice = signature
```

Bob recalcule l'empreinte du message reçu. Il déchiffre la signature avec la **clé publique d'Alice**, et il obtient l'empreinte qu'Alice avait calculée. Si les deux empreintes coïncident, le message est celui qu'Alice a signé, et il n'a pas changé. Sinon, le message a été modifié, ou la signature a été produite avec une autre clé.

Seule la privée d'Alice produit une signature que sa publique ouvre. D'où l'authenticité. Un message modifié donne une autre empreinte. D'où l'intégrité. Alice ne peut pas prétendre qu'une autre clé a signé à sa place, tant que sa privée n'a pas fuité. D'où la non-répudiation.

| | Chiffrement | Signature |
| :--- | :--- | :--- |
| Objectif | Confidentialité | Authenticité et intégrité |
| Clé qui produit | Clé publique du destinataire | Clé privée de l'émetteur |
| Clé qui vérifie ou lit | Clé privée du destinataire | Clé publique de l'émetteur |
| Contre quoi | La lecture par un tiers | L'usurpation et la modification |

On chiffre avec la publique du **destinataire**, pour que lui seul lise. On signe avec la privée de l'**émetteur**, pour prouver que c'est lui. Inverser les clés n'est pas une variante. C'est une autre opération, qui ne tient pas la promesse qu'on croit faire.

Alice veut les deux : que Bob seul lise, et que Bob sache que c'est elle. Deux ordres sont possibles.

Option A. Elle signe d'abord le message avec sa privée. Elle chiffre ensuite le message et la signature avec la publique de Bob.

Option B. Elle chiffre d'abord avec la publique de Bob. Elle signe ensuite le chiffré avec sa privée.

On retient l'**option A**. La signature porte sur le message clair : Bob, après déchiffrement, vérifie qu'Alice a signé ces mots-là. Chiffrer ensuite couvre le message et la signature. L'option B signe un chiffré. Cela prouve qu'Alice a vu ce chiffré, pas qu'elle assume le texte une fois déchiffré, et cela peut laisser un tiers rejouer la signature sur un autre contexte. On signe le contenu. On chiffre l'ensemble.

## Qui garantit la clé publique

Une signature prouve qu'une clé privée a signé. Elle ne prouve pas, à elle seule, que cette clé est celle d'Alice. Une **autorité de certification** vérifie l'identité de celui qui demande un certificat, puis émet un **certificat** qui lie cette identité à une clé publique, et elle signe ce certificat avec sa propre privée. DigiCert, Let's Encrypt, GlobalSign, Sectigo font ce métier.

Le certificat, au format **X.509**, porte l'identité (nom, organisation, nom de domaine), la clé publique, les dates de validité, et la signature de l'autorité.

La confiance se lit en chaîne. L'**autorité racine** est préinstallée dans le système ou le navigateur. Son certificat est auto-signé, et il est protégé en conséquence : s'il est faux, tout ce qui en descend l'est. Elle signe des **autorités intermédiaires**, qui signent au quotidien les certificats des sites. Le certificat de `www.banque.fr` contient la clé publique du site, son identité, et la signature de l'intermédiaire. Le navigateur remonte jusqu'à une racine qu'il connaît déjà. Il ne fait pas confiance au site parce que le site le dit. Il fait confiance parce qu'une racine déjà présente a signé quelqu'un qui a signé le site.

À l'ouverture d'une page HTTPS, le navigateur reçoit le certificat, vérifie la signature de l'intermédiaire, vérifie que cet intermédiaire remonte à une racine installée, vérifie les dates, vérifie que le nom de domaine du certificat est celui de l'adresse. Si la chaîne tient, le cadenas s'affiche. Sinon, le navigateur affiche un avertissement. Cet avertissement n'est pas un simple détail d'interface : il signale que la chaîne de confiance a cassé.

Ouvrir le cadenas d'un site HTTPS et lire le certificat : l'autorité, la date de fin, la clé publique. On y voit la chaîne, pas un logo.

## Ce que cela devient dans les protocoles

**HTTPS** est HTTP plus TLS. Pendant la poignée de main, le serveur envoie son certificat, donc sa clé publique. Le navigateur vérifie la chaîne. Il tire une clé de session symétrique, au hasard, la chiffre avec la publique du serveur, et l'envoie. Le serveur la déchiffre avec sa privée. À partir de là, les deux côtés chiffrent les échanges avec AES et cette clé de session. HTTPS assure la confidentialité du contenu, l'intégrité de ce qui passe, et l'authenticité du serveur, pour autant que le certificat soit le bon et que la racine qui l'a fait naître soit digne de confiance. Il n'anonymise pas : le nom du site visité peut encore se voir.

**WhatsApp** s'appuie sur le protocole Signal. Le chiffrement est de **bout en bout** : le message est chiffré sur le téléphone de l'émetteur et déchiffré sur celui du destinataire. Le service qui transporte ne lit pas le contenu. Chaque conversation a ses clés, et elles changent : c'est le *perfect forward secrecy*. Une clé compromise plus tard ne rouvre pas les messages déjà échangés. L'échange de clés utilise Diffie-Hellman, le chiffrement AES-256, les signatures sur la courbe Curve25519.

**Telegram**, dans les discussions ordinaires, chiffre entre le client et ses serveurs, pas de bout en bout. Le service peut techniquement lire les messages. C'est ce qui permet de les retrouver sur tous les appareils. Le mode « discussion secrète » passe en bout en bout, sans copie dans le cloud, avec des messages qui peuvent s'effacer, sur le protocole maison MTProto 2.0. Les deux modes n'offrent pas la même garantie. Le réglage par défaut est le premier.

**Signal** chiffre de bout en bout par défaut, pas dans un mode à activer. Le client est open source, donc auditable. Le service collecte peu de métadonnées. Le *perfect forward secrecy* est là aussi. Edward Snowden et une grande partie des spécialistes de la sécurité le recommandent quand la question est le contenu des messages, pas seulement le transport.

Le courriel classique ne fait rien de tout cela. **PGP** (et son implémentation GPG) ajoute une paire de clés à chaque personne. Les publiques se publient, y compris sur des serveurs de clés. On chiffre pour le destinataire, on signe comme émetteur. La mise en place reste lourde pour qui n'en fait pas son métier. ProtonMail propose un chiffrement de bout en bout déjà en place, sans que l'utilisateur gère les clés à la main. Le confort ne dispense pas de savoir où les clés sont, et qui peut les demander.

Un **VPN** ouvre un tunnel chiffré entre l'appareil et le serveur du fournisseur. Le trafic y passe. Le chiffrement est en général AES-256. Les protocoles courants sont OpenVPN, WireGuard, IKEv2/IPsec. L'adresse IP vue des sites visités est celle du VPN, pas celle du poste. Sur un Wi-Fi public, le voisin de borne ne lit pas le contenu. Un VPN ne chiffre pas « jusqu'au site » au-delà de son propre serveur : le fournisseur voit le trafic au sortir du tunnel. On choisit un VPN comme on choisit quelqu'un à qui l'on accepte de montrer où l'on va.

Dans une **chaîne de blocs** comme Bitcoin, SHA-256 enchaîne les blocs : chacun porte l'empreinte du précédent. Un portefeuille est une paire de clés. Une transaction est signée avec la clé privée, et n'importe qui la vérifie avec la publique. La preuve de travail demande de trouver une empreinte qui satisfait une contrainte, un certain nombre de zéros en tête par exemple. Modifier un bloc ancien oblige à refaire cette recherche pour lui et pour tous les suivants. L'empreinte n'est pas un ornement. C'est ce qui rend la réécriture coûteuse.
