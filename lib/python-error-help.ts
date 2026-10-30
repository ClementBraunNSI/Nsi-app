import type { RunTest } from "./python-check";

/**
 * Explications en français des erreurs Python et des tests ratés, pour des élèves débutants.
 * Des règles fixes (pas d'IA) : la même erreur donne toujours la même explication.
 */
export type ErrorHelp = {
  /** Ce qui se passe, en une phrase. */
  title: string;
  /** Pourquoi, et ce qu'il faut regarder. */
  text: string;
  /** Piste concrète, souvent avec un exemple de code. */
  hint?: string;
  line?: number;
  lineText?: string;
};

type Context = {
  type: string;
  message: string;
  line?: number;
  lineText?: string;
  code: string;
  names: string[];
};

type Rule = {
  types: string[];
  match: RegExp;
  help: (m: RegExpMatchArray, ctx: Context) => Omit<ErrorHelp, "line" | "lineText"> | null;
};

const FRENCH_TYPES: [RegExp, string][] = [
  [/^Erreur de syntaxe/, "SyntaxError"],
  [/^Erreur d'indentation/, "IndentationError"],
  [/^Le nom « .+ » n'est pas défini/, "NameError"],
  [/^Nom introuvable/, "NameError"],
  [/^Erreur de type/, "TypeError"],
  [/^Division par zéro/, "ZeroDivisionError"],
  [/^Indice hors limites/, "IndexError"],
  [/^Clé absente/, "KeyError"],
  [/^Attribut manquant/, "AttributeError"],
  [/^Valeur incorrecte/, "ValueError"],
];

const KEYWORDS = new Set(
  "and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield True False None".split(" "),
);

const BUILTINS = [
  "print", "input", "len", "range", "int", "float", "str", "bool", "list", "dict", "tuple", "set",
  "sum", "min", "max", "abs", "round", "sorted", "reversed", "enumerate", "zip", "type", "append",
  "True", "False", "None",
];

function distance(a: string, b: string) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[b.length];
}

/** Nom le plus proche parmi ceux du programme et de Python : faute de frappe ou de majuscule. */
function closestName(name: string, names: string[]) {
  let best: string | null = null;
  let bestScore = Infinity;
  for (const candidate of new Set([...names, ...BUILTINS])) {
    if (candidate === name) continue;
    if (candidate.toLowerCase() === name.toLowerCase()) return candidate;
    const score = distance(candidate, name);
    const allowed = name.length <= 3 ? 1 : 2;
    if (score <= allowed && score < bestScore) {
      best = candidate;
      bestScore = score;
    }
  }
  return best;
}

function namesOf(code: string) {
  const withoutStrings = code.replace(/(["'])(?:\\.|(?!\1).)*\1/g, "");
  return [...new Set(withoutStrings.match(/[A-Za-z_]\w*/g) ?? [])].filter((name) => !KEYWORDS.has(name));
}

const q = (value: string) => `« ${value} »`;

const RULES: Rule[] = [
  // ---------- Syntaxe et indentation ----------
  {
    types: ["SyntaxError", "IndentationError"],
    match: /expected an indented block(?: after '(\w+)' statement on line (\d+))?/,
    help: (m) => ({
      title: "Le bloc qui suit n'est pas décalé.",
      text: `Après une ligne qui se termine par « : » (${m[1] ? `ici un ${q(m[1])}` : "if, for, while, def…"}), les instructions du bloc doivent être décalées de 4 espaces vers la droite.`,
      hint: "Ajouter 4 espaces au début des lignes du bloc, ou écrire « pass » si le bloc est encore vide.",
    }),
  },
  {
    types: ["SyntaxError", "IndentationError"],
    match: /unexpected indent/,
    help: () => ({
      title: "Une ligne est décalée sans raison.",
      text: "Cette ligne commence plus à droite que la précédente, alors qu'aucun bloc (if, for, def…) ne vient de s'ouvrir.",
      hint: "Aligner la ligne sur celles du même niveau.",
    }),
  },
  {
    types: ["SyntaxError", "IndentationError", "TabError"],
    match: /unindent does not match any outer indentation level|inconsistent use of tabs and spaces/,
    help: () => ({
      title: "Le retrait de cette ligne ne correspond à aucun niveau.",
      text: "En revenant vers la gauche, la ligne doit retomber exactement sous le début d'un bloc précédent. Le décalage est souvent d'un espace en trop ou en moins, ou d'un mélange d'espaces et de tabulations.",
      hint: "Effacer le retrait de la ligne et le refaire avec des espaces (4 par niveau).",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /expected ':'/,
    help: (_m, ctx) => {
      const keyword = ctx.lineText?.trim().match(/^(if|elif|else|for|while|def|class|try|except|finally|with)\b/)?.[1];
      return {
        title: "Il manque les deux-points « : ».",
        text: `Une ligne ${keyword ? q(keyword) : "if, elif, else, for, while ou def"} se termine toujours par « : » avant le bloc décalé.`,
        hint: keyword === "def" ? "Exemple : def carre(x):" : keyword === "for" ? "Exemple : for i in range(10):" : "Exemple : if age >= 18:",
      };
    },
  },
  {
    types: ["SyntaxError"],
    match: /Maybe you meant '==' or ':=' instead of '='|cannot assign to .*here\. Maybe you meant '=='/,
    help: () => ({
      title: "« = » est utilisé à la place de « == ».",
      text: "« = » range une valeur dans une variable ; pour comparer deux valeurs, il faut « == ».",
      hint: "Exemple : if note == 20:",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /'([(\[{])' was never closed/,
    help: (m) => ({
      title: `Une ${m[1] === "(" ? "parenthèse" : m[1] === "[" ? "crochet" : "accolade"} ${q(m[1])} n'est jamais fermée.`,
      text: "Chaque symbole ouvrant doit avoir son symbole fermant, sur la même instruction. Python s'en aperçoit parfois une ligne plus loin.",
      hint: "Compter les ( et les ) de la ligne indiquée et de la précédente.",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /unmatched '([)\]}])'|closing parenthesis '([)\]}])' does not match/,
    help: (m) => ({
      title: `Un ${q(m[1] || m[2])} ferme quelque chose qui n'a pas été ouvert.`,
      text: "Il y a un symbole fermant en trop, ou il ne correspond pas au symbole ouvrant : ( va avec ), [ avec ], { avec }.",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /unterminated (?:triple-quoted )?string literal|EOL while scanning string literal|EOF while scanning triple-quoted/,
    help: () => ({
      title: "Un texte n'est pas refermé par un guillemet.",
      text: "Un texte commence par un guillemet (\" ou ') et doit se terminer par le même, sur la même ligne.",
      hint: "Exemple : print(\"Bonjour\")",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /Missing parentheses in call to 'print'/,
    help: () => ({
      title: "print s'écrit avec des parenthèses.",
      text: "En Python 3, print est une fonction : ce qu'il faut afficher se met entre parenthèses.",
      hint: "Exemple : print(\"Bonjour\")",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /invalid character '(.)' \(U\+([0-9A-F]+)\)/,
    help: (m) => ({
      title: `Le caractère ${q(m[1])} n'est pas accepté dans le code.`,
      text: "Ce caractère vient souvent d'un copier-coller depuis un document : guillemets typographiques (« ’ » au lieu de « ' »), tirets longs, espaces spéciales.",
      hint: "Le retaper au clavier directement dans l'éditeur.",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /invalid decimal literal/,
    help: () => ({
      title: "Un nombre est collé à des lettres.",
      text: "Un nom de variable ne peut pas commencer par un chiffre, et une multiplication doit s'écrire avec « * ».",
      hint: "Écrire 2 * x au lieu de 2x.",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /Perhaps you forgot a comma/,
    help: () => ({
      title: "Il manque probablement une virgule.",
      text: "Dans une liste ou entre les paramètres d'une fonction, les éléments se séparent par des virgules.",
      hint: "Exemple : [1, 2, 3] ou print(\"total :\", total)",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /cannot assign to (function call|literal|expression)/,
    help: () => ({
      title: "L'affectation est écrite à l'envers.",
      text: "Dans « a = b », la variable qui reçoit la valeur est toujours à gauche du « = ».",
      hint: "Exemple : total = total + 1 (et non total + 1 = total).",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /'return' outside function/,
    help: () => ({
      title: "Le return est en dehors de la fonction.",
      text: "return ne peut servir qu'à l'intérieur d'une fonction : la ligne doit être décalée sous le def.",
      hint: "Vérifier le retrait de la ligne du return.",
    }),
  },
  {
    types: ["SyntaxError"],
    match: /'(break|continue)' (?:outside loop|not properly in loop)/,
    help: (m) => ({
      title: `${q(m[1])} est en dehors d'une boucle.`,
      text: `${m[1]} ne sert qu'à l'intérieur d'une boucle for ou while : la ligne doit être décalée dans la boucle.`,
    }),
  },
  {
    types: ["SyntaxError"],
    match: /invalid syntax/,
    help: (_m, ctx) => {
      const line = ctx.lineText?.trim() ?? "";
      if (/^(if|elif|while)\b[^=!<>]*[^=!<>]=[^=]/.test(line)) {
        return {
          title: "« = » est utilisé à la place de « == ».",
          text: "« = » range une valeur dans une variable ; pour comparer deux valeurs, il faut « == ».",
          hint: "Exemple : if note == 20:",
        };
      }
      if (/^else\s+\S/.test(line)) {
        return {
          title: "else ne prend pas de condition.",
          text: "else s'applique à tous les autres cas : il s'écrit seul, suivi de « : ». Pour une condition, utiliser elif.",
          hint: "Exemple : elif note >= 10:",
        };
      }
      return {
        title: "Python ne comprend pas cette ligne.",
        text: "La règle d'écriture n'est pas respectée près de l'endroit indiqué : symbole manquant (« : », virgule, parenthèse) ou mot mal placé. L'erreur est parfois sur la ligne juste au-dessus.",
      };
    },
  },
  // ---------- Noms ----------
  {
    types: ["NameError"],
    match: /name '([^']+)' is not defined|Le nom « ([^»]+) » n'est pas défini/,
    help: (m, ctx) => {
      const name = (m[1] || m[2]).trim();
      const constants: Record<string, string> = { true: "True", false: "False", none: "None", TRUE: "True", FALSE: "False", NONE: "None" };
      if (constants[name]) {
        return {
          title: `${q(name)} s'écrit ${q(constants[name])} en Python.`,
          text: "True, False et None prennent une majuscule.",
        };
      }
      const close = closestName(name, ctx.names);
      if (close) {
        return {
          title: `${q(name)} n'existe pas : peut-être ${q(close)} ?`,
          text: "Python distingue les majuscules et les minuscules, et chaque lettre compte.",
          hint: `Remplacer ${name} par ${close}.`,
        };
      }
      return {
        title: `${q(name)} n'a pas de valeur à ce moment du programme.`,
        text: "Ce nom est utilisé avant d'avoir reçu une valeur : variable pas encore créée, fonction définie plus bas, ou variable créée dans une autre fonction (elle n'existe pas en dehors).",
        hint: `S'il s'agit d'un texte, l'écrire entre guillemets : "${name}".`,
      };
    },
  },
  {
    types: ["UnboundLocalError"],
    match: /cannot access local variable '([^']+)'|local variable '([^']+)' referenced before assignment/,
    help: (m) => ({
      title: `${q(m[1] || m[2])} est utilisée dans la fonction avant d'y recevoir une valeur.`,
      text: "Une variable modifiée dans une fonction devient locale à cette fonction : celle du programme principal n'est plus visible.",
      hint: "Passer la valeur en paramètre de la fonction, ou créer la variable au début de la fonction.",
    }),
  },
  // ---------- Types ----------
  {
    types: ["TypeError"],
    match: /'NoneType' object (?:is not subscriptable|is not iterable|cannot be interpreted)|unsupported operand type\(s\) for .+: '(?:NoneType)'|unsupported operand type\(s\) for .+: '\w+' and 'NoneType'/,
    help: () => ({
      title: "Une valeur vaut None : une fonction ne renvoie probablement rien.",
      text: "Une fonction sans return (ou qui affiche avec print au lieu de renvoyer) donne None. Certaines méthodes comme liste.sort() ou liste.append() modifient la liste et renvoient None.",
      hint: "Vérifier que la fonction se termine par return, et ne pas écrire liste = liste.sort().",
    }),
  },
  {
    types: ["TypeError"],
    match: /unsupported operand type\(s\) for ([^:]+): '(int|float)' and 'str'|unsupported operand type\(s\) for ([^:]+): 'str' and '(int|float)'|can only concatenate str \(not "(int|float)"\) to str|must be str, not (int|float)/,
    help: () => ({
      title: "Un nombre et un texte sont mélangés dans un calcul.",
      text: "Python ne mélange pas les nombres et les textes : \"3\" + 2 n'a pas de sens. input() renvoie toujours un texte.",
      hint: "Convertir : int(input(\"Âge : \")) pour un nombre, ou str(total) pour l'ajouter à un texte.",
    }),
  },
  {
    types: ["TypeError"],
    match: /'(<|>|<=|>=)' not supported between instances of '(str|int|float)' and '(str|int|float)'/,
    help: () => ({
      title: "Un texte est comparé à un nombre.",
      text: "« < » et « > » ne comparent pas un texte et un nombre. Une valeur lue avec input() est un texte.",
      hint: "Convertir d'abord : age = int(input(\"Âge : \")).",
    }),
  },
  {
    types: ["TypeError"],
    match: /(\w+)\(\) missing (\d+) required positional argument/,
    help: (m) => ({
      title: `${q(m[1])} est appelée avec trop peu de valeurs.`,
      text: `Il manque ${m[2]} argument${Number(m[2]) > 1 ? "s" : ""} : il faut donner autant de valeurs entre parenthèses que de paramètres dans le def.`,
    }),
  },
  {
    types: ["TypeError"],
    match: /(\w+)\(\) takes (\d+) positional arguments? but (\d+) (?:were|was) given/,
    help: (m) => ({
      title: `${q(m[1])} reçoit ${m[3]} valeur${Number(m[3]) > 1 ? "s" : ""} au lieu de ${m[2]}.`,
      text: "Le nombre de valeurs entre parenthèses à l'appel doit correspondre au nombre de paramètres dans le def.",
    }),
  },
  {
    types: ["TypeError"],
    match: /'(int|float)' object is not iterable/,
    help: () => ({
      title: "Une boucle for parcourt un nombre.",
      text: "for parcourt une liste, un texte ou un range, pas un nombre seul.",
      hint: "Exemple : for i in range(n): au lieu de for i in n:",
    }),
  },
  {
    types: ["TypeError"],
    match: /'(\w+)' object is not callable/,
    help: (m) => ({
      title: `Une valeur de type ${q(m[1])} est utilisée comme une fonction.`,
      text: "Des parenthèses suivent une variable qui n'est pas une fonction. Cela arrive quand une variable porte le nom d'une fonction (sum = 0, puis sum(…)), ou quand un « * » manque (2(x + 1)).",
      hint: "Renommer la variable, ou écrire 2 * (x + 1).",
    }),
  },
  {
    types: ["TypeError"],
    match: /object of type '(\w+)' has no len\(\)/,
    help: (m) => ({
      title: `len() ne s'applique pas à une valeur de type ${q(m[1])}.`,
      text: "len() donne la longueur d'une liste, d'un texte ou d'un dictionnaire, pas d'un nombre.",
    }),
  },
  {
    types: ["TypeError"],
    match: /'(str|tuple)' object does not support item assignment/,
    help: (m) => ({
      title: m[1] === "str" ? "Un texte ne se modifie pas caractère par caractère." : "Un tuple ne se modifie pas.",
      text: m[1] === "str"
        ? "Les textes sont non modifiables : il faut construire un nouveau texte."
        : "Les tuples sont non modifiables : utiliser une liste [ ] pour pouvoir changer les éléments.",
      hint: m[1] === "str" ? "Exemple : mot = mot[:i] + \"x\" + mot[i + 1:]" : undefined,
    }),
  },
  {
    types: ["TypeError"],
    match: /(?:list|string|tuple) indices must be integers(?: or slices)?, not (float|str)/,
    help: (m) => ({
      title: m[1] === "float" ? "L'indice est un nombre à virgule." : "L'indice est un texte.",
      text: m[1] === "float"
        ? "Un indice de liste est un entier. « / » donne toujours un nombre à virgule."
        : "Un indice de liste est un entier ; un texte sert d'indice dans un dictionnaire, pas dans une liste.",
      hint: m[1] === "float" ? "Utiliser la division entière « // » : milieu = len(t) // 2" : undefined,
    }),
  },
  // ---------- Indices, clés, valeurs ----------
  {
    types: ["IndexError"],
    match: /(list|string|tuple) index out of range/,
    help: (m) => ({
      title: `Cet indice dépasse ${m[1] === "string" ? "la longueur du texte" : "la taille de la liste"}.`,
      text: `Les indices vont de 0 à len(...) - 1 : ${m[1] === "string" ? "un texte de 5 lettres" : "une liste de 5 éléments"} n'a pas d'indice 5. Une liste vide n'a aucun indice.`,
      hint: "Vérifier les bornes : range(len(t)) et non range(len(t) + 1), < plutôt que <=.",
    }),
  },
  {
    types: ["KeyError"],
    match: /.*/,
    help: (_m, ctx) => ({
      title: `La clé ${q(ctx.message.replace(/^.*?:\s*/, "").replace(/^['"]|['"]$/g, "") || "demandée")} n'est pas dans le dictionnaire.`,
      text: "On ne peut lire d['cle'] que si la clé existe. Attention aux majuscules et aux espaces dans le nom de la clé.",
      hint: "Tester d'abord : if cle in d:   ou utiliser d.get(cle, 0).",
    }),
  },
  {
    types: ["ZeroDivisionError"],
    match: /.*/,
    help: () => ({
      title: "Une division par zéro.",
      text: "Le diviseur vaut 0 à ce moment. Cela arrive souvent avec une moyenne calculée sur une liste vide.",
      hint: "Tester le cas à part : if len(notes) == 0: return 0",
    }),
  },
  {
    types: ["ValueError"],
    match: /invalid literal for int\(\) with base 10: '([^']*)'|could not convert string to float: '([^']*)'/,
    help: (m) => ({
      title: `${q(m[1] ?? m[2] ?? "")} ne peut pas devenir un nombre.`,
      text: "int() et float() ne convertissent que des textes qui ressemblent à des nombres : pas de lettres, d'espace, ni de virgule (le séparateur décimal est le point).",
    }),
  },
  {
    types: ["AttributeError"],
    match: /'NoneType' object has no attribute '(\w+)'/,
    help: () => ({
      title: "Une valeur vaut None : une fonction ne renvoie probablement rien.",
      text: "La variable a reçu le résultat d'une fonction sans return, ou d'une méthode comme sort() ou append() qui ne renvoie rien.",
      hint: "Écrire liste.sort() seul, sans liste = liste.sort().",
    }),
  },
  {
    types: ["AttributeError"],
    match: /'(\w+)' object has no attribute '(\w+)'/,
    help: (m) => {
      const known: Record<string, string> = {
        "list.add": "Pour une liste, on ajoute avec append : t.append(x).",
        "list.push": "Pour une liste, on ajoute avec append : t.append(x).",
        "str.append": "Un texte ne se complète pas avec append : mot = mot + \"x\".",
        "dict.append": "Pour un dictionnaire, on ajoute une clé ainsi : d[cle] = valeur.",
        "int.append": "Cette variable contient un nombre, pas une liste.",
        "list.lower": "lower() s'applique à un texte, pas à une liste : parcourir la liste pour l'appliquer à chaque élément.",
      };
      return {
        title: `Une valeur de type ${q(m[1])} n'a pas de méthode ${q(m[2])}.`,
        text: known[`${m[1]}.${m[2]}`] ?? "Cette méthode n'existe pas pour ce type de valeur : vérifier le nom de la méthode, ou le type de la variable.",
      };
    },
  },
  {
    types: ["RecursionError"],
    match: /maximum recursion depth exceeded/,
    help: () => ({
      title: "La fonction s'appelle elle-même sans jamais s'arrêter.",
      text: "Une fonction récursive a besoin d'un cas de base qui renvoie un résultat sans s'appeler, et chaque appel doit s'en rapprocher.",
      hint: "Exemple : if n == 0: return 1, puis return n * factorielle(n - 1).",
    }),
  },
  {
    types: ["EOFError"],
    match: /plus de saisies|EOF when reading a line/,
    help: () => ({
      title: "Le programme demande plus de saisies que prévu.",
      text: "input() est appelé plus de fois que de réponses fournies par le test : une boucle demande peut-être une saisie de trop.",
    }),
  },
];

/** Type et message d'une erreur, depuis la trace Python si elle existe, sinon depuis le message traduit. */
function readError(message: string, detail?: string): { type: string; message: string; line?: number } | null {
  const lineFromFrench = message.match(/\(ligne (\d+)\)/)?.[1];
  const traceLines = (detail ?? "").trim().split("\n");
  const last = traceLines[traceLines.length - 1] ?? "";
  const fromTrace = last.match(/^(\w+(?:Error|Exception|Exit)?):\s?(.*)$/);
  const programLines = [...(detail ?? "").matchAll(/File "<programme>", line (\d+)/g)];
  const line = lineFromFrench ? Number(lineFromFrench) : programLines.length ? Number(programLines[programLines.length - 1][1]) : undefined;
  if (fromTrace) return { type: fromTrace[1], message: fromTrace[2], line };

  const first = message.split("\n")[0].trim();
  const french = FRENCH_TYPES.find(([pattern]) => pattern.test(first));
  if (french) return { type: french[1], message: first.replace(/^[^:]*?(?:\(ligne \d+\))?\s*:\s*/, ""), line };
  const generic = first.match(/^(\w+Error)(?: \(ligne \d+\))?\s*:\s*(.*)$/);
  if (generic) return { type: generic[1], message: generic[2], line };
  return null;
}

/** Explication d'une erreur levée par le programme de l'élève (Exécuter, ou Vérifier avant les tests). */
export function explainPythonError(message: string, detail: string | undefined, code: string): ErrorHelp | null {
  const error = readError(message || "", detail);
  if (!error) return null;
  const lines = code.split("\n");
  const lineText = error.line ? lines[error.line - 1] : undefined;
  const ctx: Context = { ...error, lineText, code, names: namesOf(code) };
  for (const rule of RULES) {
    if (!rule.types.includes(error.type)) continue;
    const match = error.message.match(rule.match) ?? (message.match(rule.match) as RegExpMatchArray | null);
    if (!match) continue;
    const help = rule.help(match, ctx);
    if (help) return { ...help, line: error.line, lineText: lineText?.trim() ? lineText : undefined };
  }
  return null;
}

function parseValue(text: string | undefined): unknown {
  if (text === undefined) return undefined;
  const value = text.trim();
  if (value === "None") return null;
  if (value === "True") return true;
  if (value === "False") return false;
  if (/^-?\d+(\.\d+)?(e-?\d+)?$/i.test(value)) return Number(value);
  if (/^(['"])[\s\S]*\1$/.test(value)) return { text: value.slice(1, -1) };
  return { raw: value };
}

const isText = (value: unknown): value is { text: string } => typeof value === "object" && value !== null && "text" in value;

function fold(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
}

/** Piste pour un test raté : comparaison entre la valeur obtenue et la valeur attendue. */
export function explainFailedTest(test: RunTest, code: string): ErrorHelp | null {
  if (test.ok) return null;
  // Erreur levée pendant le test (et non simple résultat faux) : même explication qu'à l'exécution.
  if (test.detail && test.actual === undefined) {
    const help = explainPythonError(test.detail, undefined, code);
    if (help) return help;
  }
  if (test.actual === undefined || test.expected === undefined) return null;
  const actual = parseValue(test.actual);
  const expected = parseValue(test.expected);

  if (test.printCompare) {
    const got = test.actual.trim();
    const want = test.expected.trim();
    if (!got) {
      return {
        title: "Le programme n'affiche rien.",
        text: "Le test attend un affichage : il faut un print(...), et que la ligne soit bien exécutée (pas dans un bloc jamais atteint).",
      };
    }
    if (fold(got).replace(/[.!?:;,]/g, "") === fold(want).replace(/[.!?:;,]/g, "")) {
      return {
        title: "L'affichage est presque juste.",
        text: "Seuls les majuscules, les accents, les espaces ou la ponctuation diffèrent : le texte doit être recopié exactement.",
      };
    }
    return null;
  }

  if (actual === null && expected !== null) {
    const printsInstead = /\bprint\s*\(/.test(code) && !/\breturn\b/.test(code);
    return {
      title: "La fonction ne renvoie rien (None).",
      text: printsInstead
        ? "print affiche une valeur à l'écran mais ne la renvoie pas : le test reçoit None."
        : "Un chemin de la fonction se termine sans return : le test reçoit None.",
      hint: "Terminer la fonction par return resultat (et vérifier que chaque cas du if a son return).",
    };
  }
  if (isText(actual) && typeof expected === "number" && Number(actual.text) === expected) {
    return {
      title: "La fonction renvoie un texte au lieu d'un nombre.",
      text: `Elle renvoie "${actual.text}" (entre guillemets, donc un texte) alors que le nombre ${expected} est attendu.`,
      hint: "Convertir avec int(...) ou float(...), et ne pas utiliser str() sur le résultat.",
    };
  }
  if (typeof actual === "number" && isText(expected) && Number(expected.text) === actual) {
    return {
      title: "La fonction renvoie un nombre au lieu d'un texte.",
      text: `Le texte "${expected.text}" est attendu, entre guillemets.`,
      hint: "Convertir avec str(...).",
    };
  }
  if (typeof actual === "boolean" && typeof expected === "boolean") {
    return {
      title: `La fonction renvoie ${actual ? "True" : "False"} au lieu de ${expected ? "True" : "False"}.`,
      text: "La condition est sans doute inversée, ou fausse sur un cas limite.",
      hint: "Tester à la main la valeur du test, et regarder les bornes : > ou >=, < ou <=.",
    };
  }
  if (typeof actual === "number" && typeof expected === "number") {
    if (Number.isInteger(expected) && !Number.isInteger(actual) && Math.floor(actual) === expected) {
      return {
        title: "Le résultat a une virgule alors qu'un entier est attendu.",
        text: "« / » donne toujours un nombre à virgule ; « // » donne la division entière.",
        hint: "Remplacer / par // si le résultat doit être entier.",
      };
    }
    if (Number.isInteger(actual) && Number.isInteger(expected) && Math.abs(actual - expected) === 1) {
      return {
        title: `Le résultat est décalé de 1 (${actual} au lieu de ${expected}).`,
        text: "C'est presque toujours une question de borne : range(n) s'arrête avant n, < n'est pas <=, et les indices commencent à 0.",
        hint: "Tester la boucle à la main sur le premier et le dernier tour.",
      };
    }
    if (actual === 0 && expected !== 0) {
      return {
        title: "Le résultat vaut 0.",
        text: "La variable est peut-être remise à 0 dans la boucle, ou la boucle ne s'exécute jamais.",
        hint: "Créer la variable avant la boucle (total = 0), puis l'augmenter dans la boucle.",
      };
    }
  }
  // Les textes s'affichent sans guillemets : une valeur identique à l'écran mais refusée n'a pas le bon type.
  if (test.actual.trim() === test.expected.trim()) {
    return {
      title: "La valeur semble juste, mais ce n'est pas le bon type.",
      text: "Le texte \"5\" et le nombre 5 s'affichent pareil mais ne sont pas égaux ; de même pour une liste et un tuple.",
      hint: "Convertir avec int(...) ou float(...), ou retirer les guillemets autour du nombre.",
    };
  }
  if ((isText(actual) && isText(expected) && fold(actual.text) === fold(expected.text)) || fold(test.actual) === fold(test.expected)) {
    return {
      title: "Le texte renvoyé est presque juste.",
      text: "Seuls les majuscules, les accents ou les espaces diffèrent : le texte doit être exactement celui attendu.",
    };
  }
  const raw = (value: unknown) => (typeof value === "object" && value !== null && "raw" in value ? String((value as { raw: string }).raw) : "");
  const actualList = raw(actual);
  const expectedList = raw(expected);
  if (/^\[[\s\S]*\]$/.test(actualList) && /^\[[\s\S]*\]$/.test(expectedList)) {
    const items = (list: string) => list.slice(1, -1).split(",").map((item) => item.trim()).filter(Boolean);
    const got = items(actualList);
    const want = items(expectedList);
    if (got.length === want.length && [...got].sort().join("|") === [...want].sort().join("|")) {
      return {
        title: "Les bons éléments, mais pas dans le bon ordre.",
        text: "La liste contient exactement les éléments attendus : seul l'ordre diffère.",
      };
    }
    if (Math.abs(got.length - want.length) === 1) {
      return {
        title: `Il y a un élément ${got.length > want.length ? "de trop" : "en moins"} dans la liste.`,
        text: "La boucle fait sans doute un tour de trop ou de moins : vérifier ses bornes.",
      };
    }
  }
  return null;
}
