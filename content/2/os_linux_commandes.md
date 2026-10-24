---
title: "Commandes Linux"
description: "Guide des commandes essentielles pour naviguer et gérer un système Linux."
level: premiere
chapter: "Systèmes d'exploitation"
icon: "⌨️"
badgeId: "premiere_commandes_linux"
prerequisites:
  - os_systemes
audience: public
---

# Commandes Linux essentielles

Le cours sur les systèmes a décrit l'arborescence. Ici, on s'y déplace. Le **shell** est le programme qui lit une ligne, la découpe en commande, options et chemins, et lance le programme correspondant. Une option s'écrit souvent avec un tiret : `-l`, `-a`, `-r`. Tout chemin absolu part de la racine `/`. Un chemin relatif part du dossier où l'on se trouve déjà.

## Savoir où l'on est

`pwd` (*print working directory*) affiche le dossier courant, par exemple `/home/eleve`. `ls` en liste le contenu. `ls -l` ajoute les détails : droits, taille, date. `ls -a` montre aussi les noms qui commencent par un point, cachés par défaut. `cd` change de dossier.

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `pwd` | Affiche le dossier courant | `pwd` → `/home/eleve` |
| `ls` | Liste le contenu | `ls`, `ls -l` (détails), `ls -a` (cachés) |
| `cd` | Change de dossier | `cd Documents`, `cd ..`, `cd ~` |

Trois raccourcis reviennent dans tous les chemins. `~` est le dossier personnel. `..` est le dossier parent. `.` est le dossier courant. `cd ..` remonte d'un cran. `cd ~` rentre à la maison, quel que soit l'endroit d'où l'on part. `cd Documents` n'a de sens que si `Documents` est dans le dossier courant : c'est un chemin relatif. `cd /home/eleve/Documents` marche de n'importe où : c'est un chemin absolu.

## Créer, copier, déplacer, effacer

`mkdir` crée un dossier. `touch` crée un fichier vide, ou met à jour la date d'un fichier qui existe déjà. `cp` copie. `mv` déplace, et sert aussi à renommer : déplacer `old.txt` vers `new.txt` dans le même dossier, c'est changer son nom. `rm` supprime. `cat` affiche le contenu d'un fichier texte dans le terminal.

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `mkdir` | Créer un dossier | `mkdir NSI` |
| `touch` | Créer un fichier vide | `touch script.py` |
| `cp` | Copier | `cp a.txt b.txt`, `cp -r dossier/ backup/` |
| `mv` | Déplacer ou renommer | `mv old.txt new.txt`, `mv f.txt dossier/` |
| `rm` | Supprimer | `rm f.txt`, `rm -r dossier/` |
| `cat` | Afficher le contenu | `cat README.md` |

`cp` **duplique**. Après `cp a.txt b.txt`, les deux fichiers existent. `mv` **déplace** : l'original n'est plus à l'ancien endroit. Oublier cette différence, c'est croire avoir une sauvegarde alors qu'on a seulement renommé.

`-r` veut dire récursif : la commande descend dans le dossier. `cp -r dossier/ backup/` copie le dossier et ce qu'il contient. Sans `-r`, `cp` refuse de copier un dossier. `rm -r` descend aussi, et efface tout sur son passage.

!!! warning "Attention avec `rm`"
    `rm` efface **sans corbeille**. `rm -r` supprime un dossier entier : à utiliser avec prudence.

Il n'y a pas d'annulation. On relit la ligne avant de valider, surtout quand le chemin contient `*` ou `-r`.

## Les droits, en trois chiffres

`chmod` change les **permissions**. Chaque fichier a trois destinataires : le propriétaire, le groupe, les autres. Chacun peut avoir le droit de lire (`r`), d'écrire (`w`), d'exécuter (`x`). En notation octale, on résume un destinataire par un chiffre : 4 pour la lecture, 2 pour l'écriture, 1 pour l'exécution. On additionne. 7, c'est 4+2+1, donc `rwx`. 5, c'est 4+1, donc `r-x`. 6, c'est `rw-`. 4, c'est `r--`. 0, c'est rien.

| Chiffre | Droits | Signification |
| :---: | :--- | :--- |
| 7 | `rwx` | tout |
| 6 | `rw-` | lecture + écriture |
| 5 | `r-x` | lecture + exécution |
| 4 | `r--` | lecture seule |
| 0 | `---` | rien |

`chmod 755 script.sh` donne 7 au propriétaire et 5 au groupe comme aux autres. Le propriétaire peut modifier et lancer le script. Les autres peuvent le lire et l'exécuter, pas le modifier. Un script sans le bit `x` ne se lance pas, même si son contenu est correct : le système refuse, il ne « devine » pas que c'est un programme.

## Se connecter plus loin

**SSH** ouvre un terminal sur une autre machine, de façon chiffrée. Le nom avant `@` est le compte, après `@` c'est l'adresse.

```bash
ssh eleve@192.168.1.10
```

**SCP** copie un fichier en passant par ce même canal. On écrit la source, puis la destination. Une destination distante reprend la forme `compte@adresse:chemin`.

```bash
scp TP1.py eleve@192.168.1.10:/home/eleve/
```

Cette ligne envoie `TP1.py`, pris dans le dossier courant, vers `/home/eleve/` sur la machine `192.168.1.10`. Le fichier d'en face a le même nom, sauf si l'on en écrit un autre à la fin du chemin.

Pour fermer : `pwd`, `ls` et `cd` situent et déplacent. `mkdir`, `touch`, `cp`, `mv`, `rm` et `cat` font vivre les fichiers. `rm` est définitif, et `-r` agit sur tout un dossier. `chmod` règle `rwx`, souvent en octal, comme `755`. `ssh` connecte, `scp` transfère. Un chemin relatif part d'ici, un chemin absolu part de `/`.
