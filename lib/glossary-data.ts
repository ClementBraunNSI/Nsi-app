export interface GlossaryTerm {
  term: string;
  definition: string;
  category?: 'Réseau' | 'Algo' | 'Web' | 'Python' | 'Général';
}

export const glossaryTerms: Record<string, GlossaryTerm> = {
  "DNS": {
    term: "DNS",
    definition: "Domain Name System. C'est l'annuaire d'Internet qui traduit les noms de domaine (ex: google.com) en adresses IP (ex: 142.250.178.14).",
    category: "Réseau"
  },
  "TCP": {
    term: "TCP",
    definition: "Transmission Control Protocol. Protocole de transport fiable qui s'assure que tous les paquets de données arrivent dans l'ordre et sans erreur.",
    category: "Réseau"
  },
  "IP": {
    term: "IP",
    definition: "Internet Protocol. Protocole qui gère l'adressage et le routage des paquets de données sur le réseau.",
    category: "Réseau"
  },
  "Algorithme": {
    term: "Algorithme",
    definition: "Suite finie et non ambiguë d'instructions permettant de résoudre un problème ou d'obtenir un résultat.",
    category: "Algo"
  },
  "Variable": {
    term: "Variable",
    definition: "Espace mémoire nommé permettant de stocker une valeur (nombre, texte, etc.) qui peut changer au cours de l'exécution du programme.",
    category: "Python"
  },
  "Fonction": {
    term: "Fonction",
    definition: "Bloc de code réutilisable qui effectue une tâche spécifique. Elle peut prendre des paramètres en entrée et retourner un résultat.",
    category: "Python"
  },
  "Boucle": {
    term: "Boucle",
    definition: "Structure de contrôle permettant de répéter un bloc d'instructions plusieurs fois (ex: for, while).",
    category: "Python"
  },
  "HTML": {
    term: "HTML",
    definition: "HyperText Markup Language. Langage de balisage utilisé pour structurer le contenu des pages web.",
    category: "Web"
  },
  "CSS": {
    term: "CSS",
    definition: "Cascading Style Sheets. Langage utilisé pour décrire la présentation (style, couleurs, mise en page) d'un document HTML.",
    category: "Web"
  },
  "Client": {
    term: "Client",
    definition: "Ordinateur ou logiciel (ex: navigateur web) qui demande des ressources ou des services à un serveur.",
    category: "Réseau"
  },
  "Serveur": {
    term: "Serveur",
    definition: "Ordinateur ou logiciel qui fournit des ressources ou des services aux clients sur un réseau.",
    category: "Réseau"
  }
};
