---
title: "Commandes Linux"
description: "Guide des commandes essentielles pour naviguer et gérer un système Linux."
level: premiere
chapter: "Systèmes d'exploitation"
icon: "⌨️"
badgeId: "premiere_commandes_linux"
prerequisites:
  - os_systemes
---

# Commandes Linux essentielles

## Objectifs

- Se déplacer dans l'arborescence (`pwd`, `ls`, `cd`)
- Créer, copier, déplacer, supprimer fichiers et dossiers
- Lire un fichier et modifier des **permissions** (`chmod`)
- Se connecter à une machine distante (`ssh`, `scp`)

## Idée clé

Le **shell** exécute des commandes textuelles : on indique *quoi faire*, éventuellement avec des options (`-l`, `-a`, `-r`…) et des chemins. Tout part de la racine `/` (voir le cours sur les OS).

## Se repérer et se déplacer

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `pwd` | Affiche le dossier courant | `pwd` → `/home/eleve` |
| `ls` | Liste le contenu | `ls`, `ls -l` (détails), `ls -a` (cachés) |
| `cd` | Change de dossier | `cd Documents`, `cd ..`, `cd ~` |

`~` = dossier personnel ; `..` = dossier parent ; `.` = dossier courant.

## Créer et manipuler des fichiers

| Commande | Rôle | Exemples |
| :--- | :--- | :--- |
| `mkdir` | Créer un dossier | `mkdir NSI` |
| `touch` | Créer un fichier vide | `touch script.py` |
| `cp` | Copier | `cp a.txt b.txt`, `cp -r dossier/ backup/` |
| `mv` | Déplacer ou renommer | `mv old.txt new.txt`, `mv f.txt dossier/` |
| `rm` | Supprimer | `rm f.txt`, `rm -r dossier/` |
| `cat` | Afficher le contenu | `cat README.md` |

!!! warning "Attention avec `rm`"
    `rm` efface **sans corbeille**. `rm -r` supprime un dossier entier : à utiliser avec prudence.

## Gérer les permissions (`chmod`)

Notation octale courante (propriétaire / groupe / autres) :

| Chiffre | Droits | Signification |
| :---: | :--- | :--- |
| 7 | `rwx` | tout |
| 6 | `rw-` | lecture + écriture |
| 5 | `r-x` | lecture + exécution |
| 4 | `r--` | lecture seule |
| 0 | `---` | rien |

Exemple : `chmod 755 script.sh`

- propriétaire : `7` (`rwx`)
- groupe et autres : `5` (`r-x`)

## Travailler à distance

**SSH** — connexion sécurisée :

```bash
ssh eleve@192.168.1.10
```

**SCP** — copie de fichiers via SSH :

```bash
scp TP1.py eleve@192.168.1.10:/home/eleve/
```

## Piège fréquent

Confondre `cp` et `mv` : `cp` **duplique**, `mv` **déplace** (ou renomme). Oublier `-r` pour un dossier (`cp -r`, `rm -r`) provoque une erreur ou un refus.

## À retenir

- `pwd` / `ls` / `cd` : se situer et naviguer
- `mkdir`, `touch`, `cp`, `mv`, `rm`, `cat` : cycle de vie des fichiers
- `rm` est définitif ; `-r` agit sur les dossiers
- `chmod` règle `rwx` (souvent en octal : `755`, `644`…)
- `ssh` pour se connecter ; `scp` pour transférer
- Chemins relatifs (depuis le dossier courant) vs absolus (depuis `/`)
