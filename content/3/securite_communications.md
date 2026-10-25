---
title: Sécurité des Communications
description: 'Chiffrement symétrique, asymétrique et protocoles sécurisés.'
level: TNSI
order: 40
chapter: 'Architectures matérielles, OS & Réseaux'
icon: "lock"
badgeId: terminale_securite
prerequisites:
  - reseaux_routage
audience: public
---

# Sécuriser les communications

Un paquet IP traverse des routeurs qui ne vous appartiennent pas. Quelqu'un placé sur le chemin peut le copier. On appelle cela une attaque de l'homme du milieu. Le chiffrement ne cache pas qu'une conversation a lieu, ni toujours vers qui. Il empêche de lire le contenu.

## Une seule clé

Le chiffrement **symétrique** est le plus ancien. Le chiffre de César, la machine Enigma, et aujourd'hui AES (*Advanced Encryption Standard*) en font partie. La même clé sert à chiffrer et à déchiffrer. C'est rapide, et c'est pour cela qu'AES protège l'essentiel du trafic une fois la conversation lancée.

Le problème est en amont. Pour utiliser la clé, les deux correspondants doivent déjà la posséder, et l'échanger sans qu'un tiers la lise. Si vous envoyez la clé dans le même canal que le message, celui qui écoute prend les deux. C'est le problème de l'échange de clés.

## Une paire de clés

Le chiffrement **asymétrique**, dont RSA dans les années 1970, sépare les rôles. Chaque personne possède une **clé publique**, que tout le monde peut connaître, et une **clé privée**, qu'elle garde. Ce qu'une clé ferme, l'autre l'ouvre.

Pour écrire un secret à quelqu'un, on chiffre avec *sa* clé publique. Seule sa clé privée peut déchiffrer. Vous n'avez rien de secret à lui envoyer au préalable : sa clé publique peut être affichée. L'image utile est le cadenas ouvert. N'importe qui peut le fermer sur une boîte. Une seule personne a la clé qui le rouvre.

C'est beaucoup plus lent que le symétrique. On ne chiffre donc pas une vidéo entière avec RSA. On s'en sert pour les petits secrets, en particulier pour se mettre d'accord sur une clé de session.

## Ce que fait HTTPS

Quand l'adresse commence par `https://`, le protocole TLS (autrefois SSL) combine les deux méthodes.

D'abord, le serveur prouve qui il est. Il envoie un **certificat**, qui contient sa clé publique et qui est signé par une autorité de certification. Votre navigateur vérifie cette signature. Sans cela, n'importe qui pourrait présenter une clé en prétendant être le site, et votre cadenas ne protégerait qu'une conversation avec l'attaquant.

Ensuite, le navigateur invente une clé de session, temporaire, et la chiffre avec la clé publique du serveur. Seul le serveur peut la lire, grâce à sa clé privée. Les deux possèdent alors le même secret, sans l'avoir écrit en clair sur le réseau.

Enfin, toute la suite de la conversation est chiffrée avec cette clé de session, en symétrique, souvent AES. On a utilisé le lent pour transmettre un secret court, et le rapide pour le reste.

Le cadenas dit que ce mécanisme est en place. Il ne dit pas que le site est honnête. Il dit que vous parlez bien à celui qui a obtenu le certificat, et que le trajet est illisible.

---

<ExerciseTabs courseId="terminale_securite" courseTitle="Exercices Crypto">

  <ExerciseSection id="secu-ex-1" label="Alice et Bob" type="lecture">
    <Enonce>
    ### Scénario RSA
    Alice veut envoyer un message secret à Bob.
    Chacun possède sa paire de clés (Publique/Privée).
    
    1.  Quelle clé Alice doit-elle utiliser pour chiffrer le message ?
    2.  Quelle clé Bob doit-il utiliser pour lire le message ?
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
