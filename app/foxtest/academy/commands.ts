import type { ChapterId, CommandDef, CommandId } from "./types";

export const COMMANDS: Record<CommandId, CommandDef> = {
  avancer: {
    id: "avancer",
    code: "avancer()",
    insert: "avancer()",
    description: "Le renard avance d'une case dans la direction où il regarde.",
  },
  tourner_gauche: {
    id: "tourner_gauche",
    code: "tourner_gauche()",
    insert: "tourner_gauche()",
    description: "Le renard pivote d'un quart de tour vers la gauche.",
  },
  tourner_droite: {
    id: "tourner_droite",
    code: "tourner_droite()",
    insert: "tourner_droite()",
    description: "Le renard pivote d'un quart de tour vers la droite.",
  },
  avancer_de: {
    id: "avancer_de",
    code: "avancer_de(n)",
    insert: "avancer_de(n)",
    description: "Avance de n cases. n peut être un nombre ou une variable.",
  },
  lire_nombre: {
    id: "lire_nombre",
    code: "lire_nombre()",
    insert: "pas = lire_nombre()",
    description: "Lit le nombre écrit sur le panneau et le renvoie.",
  },
  lire_panneau: {
    id: "lire_panneau",
    code: "lire_panneau()",
    insert: 'sens = lire_panneau()',
    description: 'Lit le panneau et renvoie "gauche" ou "droite".',
  },
  mur_devant: {
    id: "mur_devant",
    code: "mur_devant()",
    insert: "mur_devant()",
    description: "Renvoie True s'il y a un rocher ou le bord de la carte devant le renard, sinon False.",
  },
  poule_atteinte: {
    id: "poule_atteinte",
    code: "poule_atteinte()",
    insert: "poule_atteinte()",
    description: "Renvoie True si le renard est sur la case de la poule.",
  },
};

export const CHAPTERS: Record<
  ChapterId,
  { label: string; concept: string; memo: { title: string; body: string }[] }
> = {
  sequence: {
    label: "1 · Appels de fonctions",
    concept: "Les instructions s'exécutent dans l'ordre, de haut en bas.",
    memo: [
      {
        title: "Appeler une fonction",
        body: "Une fonction se reconnaît à ses parenthèses. avancer() demande au renard d'avancer d'une case. Chaque appel est une action.",
      },
      {
        title: "Séquence",
        body: "Python lit le programme de haut en bas. La première ligne s'exécute, puis la deuxième, et ainsi de suite. L'ordre compte.",
      },
    ],
  },
  variables: {
    label: "2 · Variables",
    concept: "On mémorise une valeur pour la réutiliser.",
    memo: [
      {
        title: "Affectation",
        body: 'pas = lire_nombre() range le résultat dans une boîte nommée pas. Ensuite avancer_de(pas) utilise cette valeur.',
      },
      {
        title: "Types",
        body: "lire_nombre() renvoie un entier (3, 4, 5…). Une variable conserve ce nombre jusqu'à ce qu'on la change.",
      },
    ],
  },
  conditions: {
    label: "3 · Conditions",
    concept: "Le programme choisit une branche selon une situation.",
    memo: [
      {
        title: "if / else",
        body: 'if sens == "gauche":\n    tourner_gauche()\nelse:\n    tourner_droite()\n\nLe test == compare deux valeurs. N\'oublie pas les deux-points et l\'indentation.',
      },
    ],
  },
  for: {
    label: "4 · Boucle for",
    concept: "On répète un bloc un nombre connu de fois.",
    memo: [
      {
        title: "Répétition",
        body: "for _ in range(4):\n    avancer()\n\nLe _ signifie : on n'a pas besoin du compteur. range(4) répète 4 fois.",
      },
      {
        title: "Compteur",
        body: "for i in range(3):\n    avancer_de(i + 1)\n\nLa variable i vaut 0, puis 1, puis 2.",
      },
    ],
  },
  while: {
    label: "5 · Boucle while",
    concept: "On répète tant qu'une condition est vraie.",
    memo: [
      {
        title: "Tant que",
        body: "while not mur_devant():\n    avancer()\n\nLe programme avance tant qu'il n'y a pas de mur. Pense à une condition d'arrêt.",
      },
      {
        title: "Booléens",
        body: "mur_devant() et poule_atteinte() renvoient True ou False. not inverse la valeur.",
      },
    ],
  },
};
