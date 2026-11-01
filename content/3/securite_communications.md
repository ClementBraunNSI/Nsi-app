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

Un paquet IP traverse des routeurs qui appartiennent à d'autres organisations, et une personne placée sur le chemin peut le copier : on parle d'attaque de l'homme du milieu. Le chiffrement ne cache pas qu'une conversation a lieu, ni toujours avec qui, mais il empêche de lire son contenu.

## Le chiffrement symétrique

Le chiffrement **symétrique** est le plus ancien. Le chiffre de César, la machine Enigma et, aujourd'hui, AES (*Advanced Encryption Standard*) en sont des exemples. La même clé sert à chiffrer et à déchiffrer. Ce chiffrement est rapide, c'est pourquoi AES protège l'essentiel du trafic une fois la conversation établie.

Le problème se pose avant : pour utiliser la clé, les deux correspondants doivent déjà la posséder, et donc l'avoir échangée sans qu'un tiers puisse la lire. Si la clé passe par le même canal que le message, celui qui écoute récupère les deux. C'est le problème de l'échange de clés.

## Le chiffrement asymétrique

Le chiffrement **asymétrique**, apparu dans les années 1970 avec notamment RSA, sépare les rôles. Chaque personne possède une **clé publique**, que tout le monde peut connaître, et une **clé privée**, qu'elle garde. Un message chiffré avec l'une des deux clés ne peut être déchiffré qu'avec l'autre.

Pour envoyer un secret à quelqu'un, on chiffre le message avec *sa* clé publique, et seule sa clé privée permet de le déchiffrer. Il n'y a donc rien de secret à échanger au préalable, puisque la clé publique peut être affichée à tous. C'est un peu comme un cadenas ouvert : n'importe qui peut le fermer sur une boîte, mais une seule personne a la clé qui permet de le rouvrir.

Ce chiffrement est en revanche beaucoup plus lent que le chiffrement symétrique. On ne chiffre donc pas une vidéo entière avec RSA : on s'en sert pour de petits secrets, en particulier pour se mettre d'accord sur une clé de session.

## Ce que fait HTTPS

Quand l'adresse commence par `https://`, le protocole TLS (autrefois SSL) combine les deux méthodes.

D'abord, le serveur prouve qui il est. Il envoie un **certificat**, qui contient sa clé publique et qui est signé par une autorité de certification. Le navigateur vérifie cette signature. Sans cela, n'importe qui pourrait présenter une clé en prétendant être le site, et le cadenas ne protégerait qu'une conversation avec l'attaquant.

Ensuite, le navigateur invente une clé de session, temporaire, et la chiffre avec la clé publique du serveur. Seul le serveur peut la lire, grâce à sa clé privée. Les deux possèdent alors le même secret, sans l'avoir écrit en clair sur le réseau.

Enfin, toute la suite de la conversation est chiffrée avec cette clé de session, en symétrique, souvent AES. Le chiffrement lent a donc servi à transmettre un secret court, et le chiffrement rapide sert pour tout le reste.

Le cadenas indique que ce mécanisme est en place, mais il ne garantit pas que le site est honnête. Il garantit seulement que l'échange se fait avec celui qui a obtenu le certificat, et que personne ne peut lire les données en chemin.

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
