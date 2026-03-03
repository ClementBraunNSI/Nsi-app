---
title: "Construire son Portfolio Professionnel"
description: "Méthodologie pour l'épreuve E4 : Structure, Méthode STAR et choix technologiques."
level: "4"
chapter: "BTS SIO 2 : E4 - Support et mise à disposition de services informatiques"
icon: "💼"
---

# Préparation à l'épreuve E4 : Construire son Portfolio Professionnel

> **Objectif de l'épreuve**
>
> Le portfolio n'est pas un simple CV en ligne ou un blog personnel. C'est un **dossier d'ingénierie et de preuves professionnelles** qui servira de support principal lors de votre épreuve E4 (Support et mise à disposition de services informatiques).

Voici les lignes directrices pour le construire, l'héberger et le rédiger de manière professionnelle.

## 1. La Structure Idéale : Que mettre dans son portfolio ?

> **Les Incontournables**
>
> Votre portfolio doit comporter au minimum les sections suivantes pour être conforme aux attentes du jury.

*   **Page d'accueil :** Une présentation claire de votre profil (Spécialité SLAM ou SISR), de vos technologies de prédilection, un lien vers votre CV (PDF) et vers vos dépôts Git (GitHub/GitLab).
*   **Le Tableau de Synthèse E4 :** C'est le document officiel du référentiel. Il doit croiser vos réalisations avec les compétences du Bloc 1.
    *   *Astuce :* Rendez chaque croix du tableau cliquable vers la mission correspondante.
*   **Les Situations Professionnelles (Vos missions) :** Une page par mission importante réalisée en stage, en alternance ou en TP/AP.
*   **La Veille Technologique :** Une présentation de vos outils de curation (Feedly, alertes, etc.) et une synthèse analytique de la thématique que vous suivez.

## 2. Rédiger ses missions : La méthode STAR et le Contexte

Le jury ne connaît ni votre entreprise, ni vos tuteurs. Avant de montrer votre code ou vos configurations, vous devez **planter le décor**. Ne rentrez pas directement dans la technique, expliquez le "pourquoi".

> **Méthode Recommandée**
>
> Pour structurer chaque mission, utilisez **la méthode STAR** (Situation, Tâche, Action, Résultat). Cela permet de raconter une histoire logique et professionnelle.

### 🦊 Exemple concret d'une mission présentée avec STAR (Profil SISR)

> **Mission : Déploiement d'une infrastructure pour un refuge animalier**
>
> *   **(S) Situation :** J'ai effectué un projet pour "FoxSave", un refuge associatif de protection de renards situé en zone rurale. Ils possèdent un bâtiment administratif et une clinique vétérinaire située à 100 mètres, sans connexion entre les deux.
> *   **(T) Tâche :** L'association avait besoin d'étendre le réseau jusqu'à la clinique pour que les vétérinaires accèdent aux dossiers médicaux, et de centraliser les données des bénévoles qui étaient dispersées sur des clés USB. J'étais en totale autonomie sur ce projet.
> *   **(A) Action :** J'ai déployé un pont Wi-Fi (antennes Ubiquiti) entre les deux bâtiments. J'ai ensuite installé et configuré un NAS Synology avec une gestion stricte des droits d'accès (ACL) : un dossier chiffré pour les vétérinaires et un espace partagé pour les bénévoles. Enfin, j'ai scripté des sauvegardes incrémentales vers le cloud.
> *   **(R) Résultat :** Les vétérinaires accèdent désormais aux dossiers en temps réel depuis les enclos. Aucune perte de données n'a été signalée depuis 6 mois grâce aux sauvegardes automatisées.

### 🦊 Exemple concret d'une mission présentée avec STAR (Profil SLAM)

> **Mission : Digitalisation des parrainages d'animaux**
>
> *   **(S) Situation :** J'ai travaillé avec "FoxSave", un refuge de protection de renards. Jusqu'à présent, ils géraient les parrainages de renards par le public uniquement via des formulaires papier et des chèques, ce qui prenait énormément de temps à la secrétaire.
> *   **(T) Tâche :** L'objectif était de concevoir une application web permettant de digitaliser ce processus pour augmenter les dons et soulager le pôle administratif.
> *   **(A) Action :** J'ai modélisé la base de données (MCD) pour lier les "Donateurs" aux "Renards" via des "Parrainages". J'ai développé le back-end en PHP/Symfony, créé une interface d'administration pour la secrétaire, et intégré l'API de paiement sécurisé Stripe.
> *   **(R) Résultat :** L'application a permis d'augmenter les parrainages de 30% le premier mois, et la secrétaire économise environ 5 heures de saisie par semaine.

## 3. Choix Technologiques et Hébergement

!!! warning "Attention aux outils grand public"
    L'utilisation de constructeurs de sites "No-Code" grand public (Wix, Jimdo, Shopify) est fortement déconseillée car elle masque vos compétences techniques.

| Option | Recommandation | Avantages pour l'épreuve E4 |
| :--- | :--- | :--- |
| **Sites Statiques (HTML/JS, React, Astro)** | **Idéal pour SLAM** | Démontre la maîtrise du code front-end. Hébergement gratuit via GitHub Pages / Vercel (prouve la maîtrise de Git). |
| **Frameworks Back-end (Symfony, Laravel)** | **Excellent pour SLAM** | Démontre des compétences en architecture MVC et BDD. Hébergement sur AlwaysData ou O2Switch. |
| **CMS auto-hébergé (WordPress, Ghost)** | **Idéal pour SISR** | Démontre la capacité à déployer un serveur Web. Le code importe peu, mais vous devez configurer le VPS, le serveur (Apache/Nginx), la BDD et le certificat SSL. |

> **Conseil Pro**
>
> L'achat d'un nom de domaine professionnel (ex: `prenom-nom.fr`) est un gros plus pour votre crédibilité.

## 4. Mettre en valeur vos missions (Les Preuves)

Ne vous contentez pas de raconter ce que vous avez fait : **prouvez-le !**

### 💻 Pour les profils SLAM
Intégrez des "snippets" de code propres, affichez vos schémas de base de données (MCD/UML), montrez l'évolution de vos maquettes Figma vers le résultat final, et liez vos dépôts Git.

### 🔌 Pour les profils SISR
Utilisez des schémas réseaux (Packet Tracer, Draw.io) pour illustrer la topologie (VLANs, routeurs). Mettez en valeur vos scripts d'automatisation (PowerShell, Bash) et intégrez des captures d'écran de vos interfaces d'administration (Règles pfSense, GPO, dashboard Grafana).
