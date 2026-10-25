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

Une IA générative écrit un texte, dessine une image ou compose une musique à partir d'une simple phrase. Elle donne l'impression de comprendre. En réalité, elle prolonge ce que vous lui donnez, du mieux qu'elle peut. Ce que vous écrivez au départ compte donc énormément. On va voir comment elle fonctionne, comment lui parler, et pourquoi il faut toujours relire ce qu'elle produit.

> **Définition**
> Une **IA générative** est un programme qui produit un contenu nouveau (texte, image, son, code) à partir d'une consigne, en s'appuyant sur ce qu'il a appris dans une très grande quantité d'exemples.

## Elle devine le mot suivant

Un assistant comme ChatGPT, Le Chat ou Gemini repose sur un **grand modèle de langage**. On l'a entraîné sur des milliards de phrases tirées de livres, de sites et d'articles. Il n'a pas appris des faits rangés dans des tiroirs. Il a appris quels mots ont l'habitude de se suivre.

Quand vous posez une question, il calcule le mot le plus probable pour commencer sa réponse, puis le suivant, puis encore le suivant. Une réponse entière est une longue suite de paris. La plupart du temps, ces paris tombent juste, parce que le modèle a vu beaucoup de textes corrects. Parfois non, et il continue avec la même assurance.

Les générateurs d'images fonctionnent autrement, mais l'idée est voisine. Ils partent d'un brouillard de pixels au hasard et le corrigent par petites touches, guidés par votre phrase, jusqu'à obtenir une image qui lui correspond.

Deux conséquences sont utiles à retenir. La même question posée deux fois peut donner deux réponses différentes, car une part de hasard est volontairement laissée dans le choix des mots. Et deux IA différentes, entraînées sur des textes différents, ne répondent pas pareil.

## Le prompt, c'est la consigne

> **Définition**
> Un **prompt** est le texte que l'on donne à une IA générative pour obtenir un résultat : une question, une consigne, un contexte, des exemples.

Écrire un prompt ressemble à donner une consigne à quelqu'un qui ne vous connaît pas, qui ne sait rien de votre cours et qui ne peut pas vous demander ce que vous vouliez dire. Tout ce que vous ne précisez pas, l'IA le choisit à votre place, souvent de la façon la plus banale.

Comparez ces deux demandes.

| Prompt | Ce qu'on obtient en général |
|--------|-----------------------------|
| « Écris un poème sur les renards. » | Un poème long, assez plat, avec des rimes attendues. |
| « Écris un poème de 4 vers en rimes croisées, pour des élèves de seconde, sur un renard qui découvre le Wi-Fi. Ton humoristique. Pas de mot plus long que 10 lettres. » | Un texte court, ciblé, qui respecte une forme précise. |

La seconde demande est plus longue, mais elle laisse beaucoup moins de place au hasard.

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

**Dans le prompt suivant, retrouvez chacun des six ingrédients. Lesquels manquent ?**

> Tu es un guide touristique. Présente la ville de Lille à une classe de seconde qui la visite pour la première fois. Fais une liste de 5 lieux, avec une phrase pour chacun.

## Une conversation, pas une commande

On obtient rarement le bon résultat du premier coup. Ce n'est pas un échec : c'est le fonctionnement normal. On lit la réponse, on repère ce qui ne va pas, et on précise.

- « Trop long : garde seulement 3 lieux. »
- « Le ton est trop sérieux, rends-le plus drôle. »
- « Remplace la phrase sur le beffroi, elle contient une erreur de date. »

Une astuce marche très bien quand on ne sait pas par où commencer : demander à l'IA de poser ses questions avant de répondre. « Avant d'écrire, pose-moi les 3 questions dont tu as besoin pour bien faire ce travail. » Elle vous oblige alors à préciser ce que vous aviez en tête.

## Décrire une image avec des mots

Pour une image, le prompt doit décrire ce qu'on verrait. L'IA ne devine pas un style ou un cadrage que vous n'avez pas nommés.

| Élément | Exemple |
|---------|---------|
| **Sujet** | un renard roux assis |
| **Action, attitude** | qui regarde vers la gauche, l'air curieux |
| **Décor** | dans une forêt enneigée |
| **Style** | illustration à l'aquarelle, couleurs douces |
| **Cadrage** | vu de profil, plan rapproché |
| **Lumière** | lumière du matin, rasante |

Mis bout à bout : « Un renard roux assis, qui regarde vers la gauche, l'air curieux, dans une forêt enneigée. Illustration à l'aquarelle, couleurs douces. Vu de profil, plan rapproché, lumière du matin rasante. »

Certains outils acceptent aussi ce qu'on ne veut pas voir : « sans texte, sans personnage humain ». C'est souvent plus efficace que de corriger après coup.

## Elle peut se tromper avec aplomb

> **Définition**
> On parle d'**hallucination** quand une IA générative affirme quelque chose de faux, en l'inventant, avec le même ton assuré que pour une information exacte.

Le modèle produit ce qui est plausible, pas ce qui est vrai. Une date, une citation, un titre de livre, une adresse de site : tout cela peut être inventé, et présenté proprement. Les sources qu'il cite peuvent ne pas exister.

Quelques réflexes évitent la plupart des pièges. On vérifie tout fait important dans une source fiable : un manuel, un site officiel, une encyclopédie reconnue. On ouvre les liens proposés pour voir s'ils existent vraiment. On se méfie des chiffres très précis donnés sans source. Enfin, on garde en tête que le modèle a appris jusqu'à une certaine date : il peut ignorer ce qui s'est passé depuis.

Une IA reproduit aussi les **biais** des textes qu'elle a lus. Si, dans ces textes, les médecins sont presque toujours des hommes, elle aura tendance à écrire « le médecin, il ». Elle ne pense pas cela. Elle répète ce qu'elle a vu le plus souvent.

## L'utiliser sans se mettre en danger

Ce que vous tapez dans un assistant part sur les serveurs de l'entreprise qui le fait fonctionner. Il peut être conservé, relu, et parfois servir à entraîner les modèles suivants.

| Règle | Pourquoi |
|-------|----------|
| Ne jamais donner son nom complet, son adresse, son numéro, ni ceux d'un camarade | Ce sont des données personnelles, on ne sait pas ce qu'elles deviennent. |
| Ne jamais téléverser la photo de quelqu'un sans son accord | Le droit à l'image s'applique aussi aux IA. Fabriquer une fausse image de quelqu'un peut être une infraction. |
| Utiliser les outils indiqués par le professeur, avec un compte autorisé | Chaque service fixe un âge minimum dans ses conditions d'utilisation. Avant 15 ans, l'accord d'un parent est nécessaire en France pour le traitement de ses données. |
| Dire quand un travail a été fait avec une IA | Rendre un texte généré comme si on l'avait écrit soi-même, c'est tricher. |

> **Définition**
> Un **hypertrucage** (en anglais *deepfake*) est une image, une vidéo ou un son fabriqué par une IA pour faire croire qu'une personne réelle a dit ou fait quelque chose.

Générer un texte ou une image a aussi un coût matériel. Chaque requête fait travailler des serveurs dans des centres de données, qui consomment de l'électricité et de l'eau pour se refroidir. Une recherche simple dans un moteur de recherche coûte bien moins. On réserve donc l'IA aux tâches où elle aide vraiment, et on évite de lancer vingt générations au hasard en espérant que l'une soit bonne.

## Pour fermer

Une IA générative prolonge ce qu'on lui donne en choisissant, à chaque étape, ce qui est le plus probable. Elle ne sait pas si c'est vrai. Un bon prompt réduit la part de hasard : il précise le rôle, le contexte, la tâche, le format, les contraintes, et donne des exemples si besoin. On avance par essais successifs, on relit, on vérifie les faits dans une source fiable, et on ne confie jamais de données personnelles.

Dans les exercices, vous allez comparer plusieurs IA sur les mêmes demandes. Le TP final est un concours : par binômes, il faudra obtenir le résultat le plus proche possible d'une cible imposée.
