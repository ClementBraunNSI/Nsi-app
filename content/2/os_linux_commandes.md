---
title: "Commandes Linux"
description: "Guide des commandes essentielles pour naviguer et gérer un système Linux."
level: premiere
chapter: "Systèmes d'exploitation"
icon: "keyboard"
badgeId: "premiere_commandes_linux"
prerequisites:
  - os_systemes
audience: public
---

# Commandes Linux essentielles

Le cours sur les systèmes d'exploitation a décrit l'arborescence des fichiers, et ce cours montre comment s'y déplacer. Le **shell** est le programme qui lit une ligne de commande, la découpe en commande, options et chemins, puis lance le programme correspondant. Une option s'écrit souvent avec un tiret : `-l`, `-a`, `-r`. Tout chemin absolu part de la racine `/`. Un chemin relatif part du dossier où l'on se trouve déjà.

## Se repérer et se déplacer

`pwd` (*print working directory*) affiche le dossier courant, par exemple `/home/eleve`. `ls` en liste le contenu. `ls -l` ajoute les détails : droits, taille, date. `ls -a` montre aussi les noms qui commencent par un point, cachés par défaut. `cd` change de dossier.

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `pwd` | Affiche le dossier courant | `pwd` donne `/home/eleve` |
| `ls` | Liste le contenu | `ls`, `ls -l` (détails), `ls -a` (cachés) |
| `cd` | Change de dossier | `cd Documents`, `cd ..`, `cd ~` |

Trois raccourcis reviennent souvent dans les chemins : `~` désigne le dossier personnel, `..` le dossier parent et `.` le dossier courant. `cd ..` remonte donc d'un niveau, et `cd ~` ramène au dossier personnel, quel que soit le dossier de départ. `cd Documents` n'a de sens que si `Documents` est dans le dossier courant : c'est un chemin relatif. `cd /home/eleve/Documents` fonctionne depuis n'importe quel dossier : c'est un chemin absolu.

## Gérer les fichiers

`mkdir` crée un dossier. `touch` crée un fichier vide, ou met à jour la date d'un fichier qui existe déjà. `cp` copie. `mv` déplace un fichier, et sert aussi à le renommer : déplacer `old.txt` vers `new.txt` dans le même dossier revient à changer son nom. `rm` supprime. `cat` affiche le contenu d'un fichier texte dans le terminal.

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `mkdir` | Créer un dossier | `mkdir NSI` |
| `touch` | Créer un fichier vide | `touch script.py` |
| `cp` | Copier | `cp a.txt b.txt`, `cp -r dossier/ backup/` |
| `mv` | Déplacer ou renommer | `mv old.txt new.txt`, `mv f.txt dossier/` |
| `rm` | Supprimer | `rm f.txt`, `rm -r dossier/` |
| `cat` | Afficher le contenu | `cat README.md` |

`cp` **duplique** un fichier : après `cp a.txt b.txt`, les deux fichiers existent. `mv` le **déplace**, si bien que l'original n'est plus à son ancien emplacement. Confondre les deux peut faire croire qu'on a une sauvegarde alors qu'on a seulement renommé le fichier.

L'option `-r` signifie récursif : la commande s'applique au dossier et à tout son contenu. `cp -r dossier/ backup/` copie le dossier et ce qu'il contient. Sans `-r`, `cp` refuse de copier un dossier. `rm -r` agit de la même façon, et efface donc tout le contenu du dossier.

!!! warning "Attention avec `rm`"
    `rm` efface **sans corbeille**. `rm -r` supprime un dossier entier : à utiliser avec prudence.

Comme il n'y a pas d'annulation possible, il faut relire la ligne avant de valider, surtout quand le chemin contient `*` ou `-r`.

## Les droits d'accès

`chmod` change les **permissions**. Les droits d'un fichier sont définis pour trois catégories d'utilisateurs : le propriétaire, le groupe et les autres. Chaque catégorie peut avoir le droit de lire (`r`), d'écrire (`w`) et d'exécuter (`x`). En notation octale, les droits d'une catégorie sont résumés par un chiffre, obtenu en additionnant 4 pour la lecture, 2 pour l'écriture et 1 pour l'exécution. Ainsi, 7 = 4 + 2 + 1 correspond à `rwx`, 5 = 4 + 1 à `r-x`, 6 à `rw-`, 4 à `r--` et 0 à aucun droit.

| Chiffre | Droits | Signification |
| :---: | :--- | :--- |
| 7 | `rwx` | tout |
| 6 | `rw-` | lecture + écriture |
| 5 | `r-x` | lecture + exécution |
| 4 | `r--` | lecture seule |
| 0 | `---` | rien |

`chmod 755 script.sh` donne 7 au propriétaire et 5 au groupe comme aux autres. Le propriétaire peut modifier et lancer le script. Les autres peuvent le lire et l'exécuter, mais pas le modifier. Un script sans le droit `x` ne se lance pas, même si son contenu est correct, car le système ne peut pas deviner qu'il s'agit d'un programme.

## Travailler sur une machine distante

**SSH** ouvre un terminal sur une autre machine, de façon chiffrée. Le nom placé avant `@` est le compte, et ce qui suit `@` est l'adresse de la machine.

```bash
ssh eleve@192.168.1.10
```

**SCP** copie un fichier en passant par ce même canal. On écrit la source, puis la destination. Une destination distante reprend la forme `compte@adresse:chemin`.

```bash
scp TP1.py eleve@192.168.1.10:/home/eleve/
```

Cette ligne envoie `TP1.py`, pris dans le dossier courant, vers `/home/eleve/` sur la machine `192.168.1.10`. Le fichier copié garde le même nom, sauf si l'on en indique un autre à la fin du chemin.

En résumé, `pwd`, `ls` et `cd` permettent de se repérer et de se déplacer. `mkdir`, `touch`, `cp`, `mv`, `rm` et `cat` servent à créer, copier, déplacer, supprimer et afficher des fichiers. `rm` est définitif, et l'option `-r` agit sur tout un dossier. `chmod` règle les droits `rwx`, souvent en notation octale, comme `755`. `ssh` ouvre une connexion vers une machine distante et `scp` y transfère des fichiers. Enfin, un chemin relatif part du dossier courant, alors qu'un chemin absolu part de `/`.
