---
title: "L'IA générative et l'art du prompt"
description: "Comprendre ce que fait une IA générative, écrire des consignes précises, vérifier ce qu'elle produit et l'utiliser de façon responsable."
level: seconde
chapter: "Intelligence artificielle"
icon: "bot"
audience: public
groupe: ia-prompting
groupeTitre: "Prompter une IA"
---

# L'IA générative et l'art du prompt

Une IA générative écrit un texte, dessine une image ou compose une musique à partir d'une simple phrase. Elle donne l'impression de comprendre, mais en réalité elle se contente de prolonger le texte qu'on lui fournit, du mieux qu'elle peut. La façon dont la demande est écrite compte donc énormément. Ce cours explique comment fonctionne une IA générative et comment bien rédiger une demande. Il montre aussi pourquoi il faut toujours relire ce qu'elle produit.

> **Définition**
> Une **IA générative** est un programme qui produit un contenu nouveau (texte, image, son, code) à partir d'une consigne, en s'appuyant sur ce qu'il a appris dans une très grande quantité d'exemples.

## Comment fonctionne un assistant comme ChatGPT

Un assistant comme ChatGPT, Le Chat ou Gemini repose sur un **grand modèle de langage**. Ce modèle a été entraîné sur des milliards de phrases tirées de livres, de sites et d'articles. Il n'a pas mémorisé une liste de faits : il a appris quels mots ont l'habitude de se suivre.

Quand une question lui est posée, il calcule le mot le plus probable pour commencer sa réponse, puis le suivant, puis encore le suivant. Une réponse complète est donc une longue suite de prédictions. La plupart du temps, ces prédictions sont justes, parce que le modèle a vu beaucoup de textes corrects. Quand elles ne le sont pas, il continue malgré tout avec la même assurance.

Les générateurs d'images fonctionnent autrement. Ils partent d'une image faite de pixels tirés au hasard, puis la corrigent par petites touches, guidés par le prompt, jusqu'à obtenir une image qui correspond à la description.

La même question posée deux fois peut donner deux réponses différentes, car une part de hasard est volontairement laissée dans le choix des mots. De même, deux IA entraînées sur des textes différents ne donnent pas la même réponse.

## Qu'est-ce qu'un prompt ?

> **Définition**
> Un **prompt** est le texte que l'on donne à une IA générative pour obtenir un résultat. Il peut contenir une question, une consigne, un contexte ou des exemples.

Écrire un prompt ressemble à donner une consigne à quelqu'un d'inconnu, qui ne sait rien du cours et qui ne peut pas demander ce qu'on voulait dire. Tout ce qui n'est pas précisé est choisi par l'IA à la place de l'auteur du prompt, souvent de la façon la plus banale.

Comparer ces deux demandes.

| Prompt | Ce qu'on obtient en général |
|--------|-----------------------------|
| « Écris un poème sur les renards. » | Un poème long, assez plat, avec des rimes attendues. |
| « Écris un poème de 4 vers en rimes croisées, pour des élèves de seconde, sur un renard qui découvre le Wi-Fi. Ton humoristique. Pas de mot plus long que 10 lettres. » | Un texte court et ciblé, qui respecte une forme précise. |

## Les six ingrédients d'un bon prompt

On n'a pas besoin de tous les ingrédients à chaque fois. Plus la tâche est précise, plus on en utilise.

| Ingrédient | La question qu'il règle | Exemple |
|------------|-------------------------|---------|
| **Rôle** | Qui doit parler ? | « Tu es un professeur de SNT patient. » |
| **Contexte** | Pour qui, dans quelle situation ? | « Je suis en seconde, je découvre les réseaux. » |
| **Tâche** | Que faut-il faire, exactement ? | « Explique ce qu'est une adresse IP. » |
| **Format** | Sous quelle forme ? | « En 5 phrases, puis un exemple chiffré. » |
| **Contraintes** | Qu'est-ce qui est interdit ou imposé ? | « Sans le mot "protocole", sans anglicisme. » |
| **Exemples** | À quoi doit ressembler le résultat ? | « Comme ceci : "Une adresse IP, c'est comme..." » |

**Activité : décortiquer un prompt**

**Dans le prompt suivant, retrouver chacun des six ingrédients. Lesquels manquent ?**

> Tu es un guide touristique. Présente la ville de Lille à une classe de seconde qui la visite pour la première fois. Fais une liste de 5 lieux, avec une phrase pour chacun.

## Améliorer la réponse en plusieurs échanges

On obtient rarement le bon résultat du premier coup, et c'est tout à fait normal. Il suffit de lire la réponse, de repérer ce qui ne va pas, puis de préciser la demande.

- « Trop long : garde seulement 3 lieux. »
- « Le ton est trop sérieux, rends-le plus drôle. »
- « Remplace la phrase sur le beffroi, elle contient une erreur de date. »

Une astuce marche très bien quand on ne sait pas par où commencer : demander à l'IA de poser ses questions avant de répondre. « Avant d'écrire, pose-moi les 3 questions dont tu as besoin pour bien faire ce travail. » Ces questions obligent à préciser ce qu'on avait en tête.

## Décrire une image avec des mots

Pour une image, le prompt doit décrire ce qu'on verrait. L'IA ne devine pas un style ou un cadrage qui n'ont pas été nommés.

| Élément | Exemple |
|---------|---------|
| **Sujet** | un renard roux assis |
| **Action, attitude** | qui regarde vers la gauche, l'air curieux |
| **Décor** | dans une forêt enneigée |
| **Style** | illustration à l'aquarelle, couleurs douces |
| **Cadrage** | vu de profil, plan rapproché |
| **Lumière** | lumière du matin, rasante |

Une fois ces éléments mis bout à bout, on obtient : « Un renard roux assis, qui regarde vers la gauche, l'air curieux, dans une forêt enneigée. Illustration à l'aquarelle, couleurs douces. Vu de profil, plan rapproché, lumière du matin rasante. »

Certains outils acceptent aussi ce qu'on ne veut pas voir : « sans texte, sans personnage humain ». C'est souvent plus efficace que de corriger après coup.

## Les erreurs de l'IA

> **Définition**
> On parle d'**hallucination** quand une IA générative affirme quelque chose de faux, en l'inventant, avec le même ton assuré que pour une information exacte.

Le modèle produit un texte plausible, qui n'est pas forcément vrai. Il peut inventer une date, une citation, un titre de livre ou l'adresse d'un site, et la présenter de façon très convaincante. Il arrive même que les sources qu'il cite n'existent pas.

Quelques réflexes évitent la plupart des pièges. On vérifie tout fait important dans une source fiable : un manuel, un site officiel, une encyclopédie reconnue. On ouvre les liens proposés pour voir s'ils existent vraiment. On se méfie des chiffres très précis donnés sans source. Enfin, on garde en tête que le modèle a appris jusqu'à une certaine date : il peut ignorer ce qui s'est passé depuis.

Une IA reproduit aussi les **biais** des textes qu'elle a lus. Si, dans ces textes, les médecins sont presque toujours des hommes, elle aura tendance à écrire « le médecin, il ». Elle ne fait que répéter ce qu'elle a lu le plus souvent.

## L'utiliser sans se mettre en danger

Ce qui est tapé dans un assistant part sur les serveurs de l'entreprise qui le fait fonctionner. Ce texte peut être conservé et relu, et il sert parfois à entraîner les modèles suivants.

| Règle | Pourquoi |
|-------|----------|
| Ne jamais donner son nom complet, son adresse, son numéro, ni ceux d'un camarade | Ce sont des données personnelles, et personne ne sait ce qu'elles deviendront. |
| Ne jamais téléverser la photo de quelqu'un sans son accord | Le droit à l'image s'applique aussi aux IA. Fabriquer une fausse image de quelqu'un peut être une infraction. |
| Utiliser les outils indiqués en classe, avec un compte autorisé | Chaque service fixe un âge minimum dans ses conditions d'utilisation. Avant 15 ans, l'accord d'un parent est nécessaire en France pour le traitement de ses données. |
| Dire quand un travail a été fait avec une IA | Rendre un texte généré comme si on l'avait écrit soi-même, c'est tricher. |

> **Définition**
> Un **hypertrucage** (en anglais *deepfake*) est une image, une vidéo ou un son fabriqué par une IA pour faire croire qu'une personne réelle a dit ou fait quelque chose.

Générer un texte ou une image a aussi un coût matériel. Chaque requête fait travailler des serveurs dans des centres de données, qui consomment de l'électricité et de l'eau pour se refroidir. Une recherche simple dans un moteur de recherche coûte bien moins. On réserve donc l'IA aux tâches où elle aide vraiment, et on évite de lancer vingt générations au hasard en espérant que l'une soit bonne.