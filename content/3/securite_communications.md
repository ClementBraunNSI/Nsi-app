---
title: Sécurité des Communications
description: 'Chiffrement symétrique, asymétrique et protocoles sécurisés.'
level: terminale
chapter: 'Architectures matérielles, OS & Réseaux'
icon: "\U0001F512"
badgeId: terminale_securite
prerequisites:
  - reseaux_routage
---

# 🔒 Sécurisation des Communications

Sur Internet, les données transitent par de nombreux routeurs. N'importe qui sur le chemin pourrait intercepter les paquets ("Man in the Middle"). Il est donc crucial de **chiffrer** les données.

## 1. Chiffrement Symétrique

C'est la méthode la plus ancienne (ex: Code de César, Enigma, AES).
*   **Principe** : La **MÊME clé** sert à chiffrer et à déchiffrer.
*   **Problème** : Comment échanger la clé secrète sans se la faire voler ? (Problème de l'échange de clés).
*   **Exemple** : AES (Advanced Encryption Standard). Très rapide.

## 2. Chiffrement Asymétrique

Inventé dans les années 70 (RSA).
*   **Principe** : On utilise une **paire de clés** :
    1.  **Clé Publique** : Distribuée à tout le monde. Sert à **CHIFFRER**.
    2.  **Clé Privée** : Gardée secrète. Sert à **DÉCHIFFRER**.
*   **Analogie** : La clé publique est un cadenas ouvert. Tout le monde peut mettre un message dans une boîte et fermer le cadenas. Mais seul celui qui a la clé privée peut l'ouvrir.
*   **Avantage** : Plus besoin d'échanger un secret !
*   **Inconvénient** : Beaucoup plus lent que le symétrique.

## 3. HTTPS et Certificats

Quand vous allez sur un site en `https://` (cadenas vert), le protocole TLS/SSL est utilisé. Il combine les deux méthodes pour le meilleur des deux mondes :

1.  **Authentification** : Le serveur envoie son **Certificat** (contenant sa clé publique), signé par une autorité de confiance (CA), pour prouver qu'il est bien `google.com` et pas un pirate.
2.  **Échange de clé (Asymétrique)** : Le navigateur utilise la clé publique du serveur pour chiffrer une "clé de session" temporaire et l'envoyer au serveur.
3.  **Communication (Symétrique)** : Une fois que les deux possèdent cette clé de session, ils l'utilisent avec AES pour chiffrer toute la conversation (car c'est plus rapide).

---

<ExerciseTabs courseId="terminale_securite" courseTitle="Exercices Crypto">

  <ExerciseSection id="secu-ex-1" label="Alice et Bob">
    <Enonce>
    ### Scénario RSA
    Alice veut envoyer un message secret à Bob.
    Chacun possède sa paire de clés (Publique/Privée).
    
    1.  Quelle clé Alice doit-elle utiliser pour chiffrer le message ?
    2.  Quelle clé Bob doit-il utiliser pour lire le message ?
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
