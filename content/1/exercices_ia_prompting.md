---
title: "Exercices : Prompter une IA"
description: "Comparer plusieurs IA génératives sur les mêmes demandes, améliorer ses prompts et apprendre à vérifier les réponses."
level: seconde
chapter: "Intelligence artificielle"
icon: "clipboard-list"
prerequisites:
  - Cours_IA_prompting
audience: public
groupe: ia-prompting
groupeTitre: "Prompter une IA"
---

# Avant de commencer

**Ce qu'il vous faut :** au moins deux IA génératives différentes parmi celles indiquées par le professeur (par exemple Le Chat de Mistral AI, ChatGPT, Gemini ou Copilot), et un générateur d'images pour l'exercice 4.

**Les règles :**
- Aucune donnée personnelle dans vos prompts : ni nom, ni adresse, ni photo, ni les vôtres ni celles des autres.
- Pour chaque réponse, notez **quelle IA** l'a produite. Sans ce nom, une comparaison ne vaut rien.
- Copiez vos prompts dans votre cahier ou dans un document : c'est ce que le professeur évalue, plus que les réponses.

# Exercice 1 : La même question, deux IA

**Objectif :** constater que deux IA ne répondent pas de la même façon.

Posez exactement ce prompt à deux IA différentes :

> Explique ce qu'est une adresse IP à un élève de seconde, en 5 phrases maximum, avec une comparaison tirée de la vie quotidienne.

**Complétez le tableau :**

| | IA n°1 : ............ | IA n°2 : ............ |
|---|---|---|
| Nombre de phrases (5 maximum demandées) | | |
| La comparaison choisie | | |
| Une erreur ou une approximation ? | | |
| La réponse la plus claire selon vous | | |

1. Reposez **la même question** à l'IA n°1 dans une nouvelle conversation. La réponse est-elle identique à la première ? Pourquoi, d'après le cours ?
2. Laquelle des deux IA a le mieux respecté la consigne « 5 phrases maximum » ?

# Exercice 2 : Du flou au précis

**Objectif :** mesurer l'effet des six ingrédients du prompt.

Envoyez d'abord ce prompt vague à une IA :

> Écris un texte sur les renards.

Puis réécrivez-le en ajoutant **au moins quatre ingrédients** parmi rôle, contexte, tâche, format, contraintes et exemples. Le texte doit servir d'affiche pour le club nature du lycée.

1. Recopiez votre prompt amélioré et soulignez chaque ingrédient d'une couleur différente.
2. Envoyez votre prompt amélioré à **deux IA différentes**.
3. Pour chacune, comptez les contraintes respectées sur le nombre de contraintes demandées. Exemple : 3 sur 4.
4. Quelle contrainte a été le plus souvent ignorée ? Proposez une façon de la reformuler pour qu'elle soit mieux respectée, puis testez-la.

# Exercice 3 : Le détecteur d'hallucinations

**Objectif :** apprendre à vérifier ce qu'une IA affirme.

Envoyez ce prompt à deux IA différentes :

> Donne-moi 3 sources sur Internet, avec leur adresse complète, qui expliquent comment fonctionne le GPS.

**Pour chaque source proposée, complétez le tableau :**

| IA | Adresse proposée | Le lien fonctionne ? | La page parle bien du GPS ? |
|----|------------------|----------------------|-----------------------------|
| | | | |
| | | | |
| | | | |

1. Combien de liens fonctionnent réellement, pour chaque IA ?
2. Posez maintenant une question sur un fait **inventé**, par exemple : « Qui a remporté le championnat du monde de saut en longueur des renards en 1987 ? ». Que répond chaque IA ? Laquelle avoue ne pas savoir ?
3. Rédigez en deux phrases une règle que vous appliquerez désormais avant de recopier une information donnée par une IA.

# Exercice 4 : Décrire pour obtenir une image

**Objectif :** écrire un prompt d'image complet et comparer deux générateurs.

Le professeur vous donne une description, par exemple :

> Un renard roux assis dans la neige, vu de profil, qui regarde vers la gauche. Illustration à l'aquarelle, couleurs douces, lumière du matin.

1. Générez une image avec **deux outils différents**, en utilisant la même description.
2. Pour chaque image, cochez les éléments respectés :

| Élément demandé | Outil n°1 : ............ | Outil n°2 : ............ |
|-----------------|-----------------------|-----------------------|
| Renard roux | | |
| Assis | | |
| Dans la neige | | |
| Vu de profil, regard vers la gauche | | |
| Style aquarelle, couleurs douces | | |
| Lumière du matin | | |

3. Choisissez l'élément le moins bien respecté. Modifiez le prompt pour le corriger (vous avez droit à **3 essais maximum**) et notez ce qui a fonctionné.

# Exercice 5 : Le prompt inversé

**Objectif :** comprendre le lien entre une consigne et ce qu'elle produit.

Voici un texte produit par une IA :

> Trois raisons de couper les notifications pendant les devoirs :
> 1. Chaque interruption coûte plusieurs minutes de concentration.
> 2. On finit plus vite, donc on a plus de temps libre.
> 3. Le téléphone attendra : les messages, eux, ne disparaissent pas.

1. Imaginez le prompt qui a pu produire ce texte. Écrivez-le.
2. Testez votre prompt sur une IA. Le résultat ressemble-t-il au texte ci-dessus ? Sur quels points (nombre de raisons, ton, longueur) ?
3. Comparez votre prompt avec celui de votre voisin. Lequel donne le résultat le plus proche ? Pourquoi ?

# Exercice 6 : Faire parler l'IA en premier

**Objectif :** utiliser l'IA pour préciser sa propre demande.

Vous devez organiser une sortie de classe d'une journée. Envoyez à une IA :

> Je dois organiser une sortie de classe d'une journée. Avant de me proposer quoi que ce soit, pose-moi les questions dont tu as besoin pour faire une proposition adaptée.

1. Recopiez les questions posées par l'IA.
2. Répondez-y, puis lisez sa proposition.
3. Faites la même chose avec une deuxième IA. Laquelle a posé les questions les plus utiles ?

# Exercice 7 : Une page web générée, puis vérifiée

**Objectif :** relier l'IA au chapitre Web, et vérifier un code produit par une IA.

1. Demandez à une IA une page HTML simple qui présente votre animal préféré : un titre, un paragraphe, une liste de 3 informations. Précisez dans le prompt : « HTML seulement, sans CSS ni JavaScript, avec des commentaires pour un débutant ».
2. Copiez le code dans l'[éditeur HTML du site](/cours/snt/atelier_editeur_html) et affichez le résultat.
3. Le code contient-il des balises que vous ne connaissez pas ? Demandez à l'IA d'expliquer l'une d'elles, puis vérifiez son explication dans le [cours sur le HTML](/cours/snt/Cours_html).
4. Donnez la même consigne à une deuxième IA. Les deux codes produisent-ils la même page ?
