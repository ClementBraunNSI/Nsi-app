/**
 * Une section <ExerciseSection> n'est un exercice d'éditeur que si l'élève
 * doit produire du Python ou du SQL. Les points de cours (explication, schéma,
 * exemple traité, illustration) et les langages hors éditeur (C#, C, JavaScript,
 * fiches BTS) restent lisibles mais ne se valident pas dans l'IDE.
 */

export type EditorRuntime = 'python' | 'sql';
export type ExternalRuntime = 'bts' | 'csharp' | 'c' | 'javascript';

export type SectionClass =
  | { role: 'exercise'; runtime: EditorRuntime }
  | { role: 'external'; runtime: ExternalRuntime }
  | { role: 'course' };

const BUILTINS = new Set([
  'abs', 'all', 'any', 'assert', 'bin', 'bool', 'callable', 'chr', 'classmethod',
  'compile', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
  'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help',
  'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list',
  'locals', 'map', 'max', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow',
  'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr',
  'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type',
  'vars', 'zip', 'Exception', 'ValueError', 'TypeError', 'IndexError', 'KeyError',
  'ZeroDivisionError', 'AssertionError', 'True', 'False', 'None', 'NotImplemented',
]);

export function classifySection(input: {
  label: string;
  body: string;
  levelFolder: string;
  courseId?: string;
  courseTitle?: string;
}): SectionClass {
  if (input.levelFolder === '4') return { role: 'external', runtime: 'bts' };

  const visible = stripCorrection(input.body);
  const sql = isSqlContext(input.body, input.courseId, input.courseTitle);

  if (verificationTestsStudent(visible)) {
    return { role: 'exercise', runtime: sql ? 'sql' : 'python' };
  }

  // La correction indique le langage attendu (C, C#, JavaScript) même si l'énoncé est en français.
  const external = externalLanguage(input.body);
  if (external) return { role: 'external', runtime: external };

  if (isCourseLabel(input.label)) return { role: 'course' };

  if (assignsCodingTask(visible, sql)) {
    return { role: 'exercise', runtime: sql ? 'sql' : 'python' };
  }

  // Fiche sans jeu de tests : la correction Python est le programme que l'élève doit écrire.
  if (!hasVerificationTag(visible) && hasPythonCorrection(input.body)) {
    return { role: 'exercise', runtime: sql ? 'sql' : 'python' };
  }

  return { role: 'course' };
}

export function isEditorExercise(section: SectionClass): section is { role: 'exercise'; runtime: EditorRuntime } {
  return section.role === 'exercise';
}

/** Ajoute embeddable={true|false} pour que la fiche n'affiche le bouton que sur un vrai exercice. */
export function markEmbeddableSections(content: string, levelFolder: string): string {
  return content.replace(/<ExerciseSection\b([^>]*?)>/g, (full, attrs: string, offset: number) => {
    if (/\bembeddable=/.test(attrs)) return full;
    const id = attrs.match(/\bid="([^"]*)"/)?.[1];
    const label = attrs.match(/\blabel="([^"]*)"/)?.[1];
    if (!id || !label) return full;
    const rest = content.slice(offset + full.length);
    const closeAt = rest.search(/<\/ExerciseSection>/);
    const body = closeAt === -1 ? rest : rest.slice(0, closeAt);
    const course = courseContextBefore(content, offset);
    const section = classifySection({
      label,
      body,
      levelFolder,
      courseId: course.courseId,
      courseTitle: course.courseTitle,
    });
    return `<ExerciseSection${attrs} embeddable="${section.role === 'exercise' ? 'yes' : 'no'}">`;
  });
}

function courseContextBefore(content: string, index: number) {
  const before = content.slice(0, index);
  const openings = [...before.matchAll(/<ExerciseTabs\b([^>]*)>/g)];
  const attrs = openings.at(-1)?.[1] ?? '';
  return {
    courseId: attrs.match(/\bcourseId="([^"]*)"/)?.[1] ?? '',
    courseTitle: attrs.match(/\bcourseTitle="([^"]*)"/)?.[1] ?? '',
  };
}

function stripCorrection(body: string) {
  return body.replace(/<Correction>[\s\S]*?<\/Correction>/g, '');
}

function isSqlContext(body: string, courseId?: string, courseTitle?: string) {
  return /sql/i.test(courseId || '') || /sql/i.test(courseTitle || '') || /```sql\b/i.test(body);
}

function isCourseLabel(label: string) {
  const normalized = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  return (
    /\bcours\b/.test(normalized) ||
    /avant de commencer/.test(normalized) ||
    /consignes importantes/.test(normalized) ||
    /visualisation/.test(normalized) ||
    normalized.trim() === 'configuration'
  );
}

function fold(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function assignsCodingTask(body: string, sql: boolean) {
  const text = fold(
    body
      .replace(/<Verification>[\s\S]*?<\/Verification>/g, '')
      .replace(/```[\s\S]*?```/g, ' '),
  );
  const writesCode = /\b(ecrivez|ecrire)\b[^.\n]{0,50}\b(fonction|programme|script|methode|classe|requete|code|instruction)/;
  if (
    writesCode.test(text) ||
    /\bimplementez\b/.test(text) ||
    /\bimplementer\b/.test(text) ||
    /\ba vous de (jouer|coder)\b/.test(text) ||
    /(^|\n)\s*(\d+\.\s*)?(creez|creer)\b/.test(text) ||
    /\bdefinissez\b/.test(text) ||
    /\bajoutez\b/.test(text) ||
    /\bcompletez\b/.test(text) ||
    /\bcodez\b/.test(text) ||
    /\bmodifiez\b/.test(text) ||
    /\bprogrammez\b/.test(text) ||
    /\btestez votre\b/.test(text) ||
    /\bpour la verification\b/.test(text) ||
    /\bstockez\b[^.\n]{0,100}\b(variable|dans)\b/.test(text)
  ) {
    return true;
  }
  if (!sql) return false;
  return /\b(afficher|inserez|requetes?|selectionnez|mettez a jour|supprimez)\b/.test(text);
}

function hasVerificationTag(body: string) {
  return /<Verification>[\s\S]*?<\/Verification>/.test(body);
}

function hasPythonCorrection(body: string) {
  const corrections = body.match(/<Correction>[\s\S]*?<\/Correction>/g) ?? [];
  return corrections.some((block) => /```python\b/i.test(block));
}

function externalLanguage(body: string): ExternalRuntime | null {
  const fences = [...body.matchAll(/```([a-z0-9#+]+)/gi)].map((match) => match[1].toLowerCase());
  const has = (lang: string) => fences.includes(lang);
  const python = has('python') || has('py');
  if (!python && (has('csharp') || has('cs') || /\bConsole\.Write(Line)?\b/.test(body) || /\bpublic\s+(static|class)\b/.test(body))) {
    return 'csharp';
  }
  if (!python && (has('c') || /\bprogramme en C\b/.test(body) || /\b#include\s*<stdio\.h>/.test(body))) {
    return 'c';
  }
  if (!python && (has('javascript') || has('js') || /\baddEventListener\b/.test(body) || /\bdocument\.getElementById\b/.test(body))) {
    return 'javascript';
  }
  return null;
}

function verificationBlock(body: string) {
  return body.match(/<Verification>([\s\S]*?)<\/Verification>/)?.[1] ?? '';
}

function verificationSource(block: string) {
  return block
    .replace(/```[a-z0-9#+]*\s*/gi, '')
    .replace(/```/g, '');
}

function isTrivialVerification(code: string) {
  const cleaned = code
    .replace(/#.*$/gm, '')
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/"""[\s\S]*?"""/g, '')
    .replace(/'''[\s\S]*?'''/g, '')
    .trim();
  if (!cleaned) return true;
  const lines = cleaned.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.every((line) => /^assert\s+True\b/i.test(line) || line === 'pass');
}

function definedNames(code: string) {
  const names = new Set<string>();
  for (const match of code.matchAll(/^\s*def\s+([A-Za-z_]\w*)/gm)) names.add(match[1]);
  for (const match of code.matchAll(/^\s*class\s+([A-Za-z_]\w*)/gm)) names.add(match[1]);
  for (const match of code.matchAll(/^\s*([A-Za-z_]\w*)\s*=/gm)) names.add(match[1]);
  for (const match of code.matchAll(/^\s*for\s+([A-Za-z_]\w*)\s+in\b/gm)) names.add(match[1]);
  for (const match of code.matchAll(/^\s*import\s+([A-Za-z_]\w*)(?:\s+as\s+([A-Za-z_]\w*))?/gm)) {
    names.add(match[2] || match[1]);
  }
  for (const match of code.matchAll(/^\s*from\s+\S+\s+import\s+([^\n]+)/gm)) {
    for (const part of match[1].split(',')) {
      const piece = part.trim();
      const alias = piece.match(/([A-Za-z_]\w*)\s+as\s+([A-Za-z_]\w*)/);
      if (alias) names.add(alias[2]);
      else {
        const name = piece.match(/([A-Za-z_]\w*)/)?.[1];
        if (name && name !== 'as') names.add(name);
      }
    }
  }
  return names;
}

function verificationTestsStudent(body: string) {
  const code = verificationSource(verificationBlock(body));
  if (isTrivialVerification(code)) return false;
  if (/\b(SELECT|INSERT|UPDATE|DELETE|CREATE\s+TABLE)\b/i.test(code)) return true;

  const defined = definedNames(code);
  const scanned = code
    .replace(/#.*$/gm, '')
    .replace(/[rubfRUBF]{0,2}(['"])(?:\\.|(?!\1).)*\1/g, ' ');
  const syntax = new Set([
    'and', 'or', 'not', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'is',
    'lambda', 'except', 'with', 'yield', 'assert', 'class', 'def', 'import', 'from',
    'as', 'pass', 'raise', 'try', 'finally', 'del', 'global', 'nonlocal', 'await', 'async',
  ]);
  for (const match of code.matchAll(/['"]([A-Za-z_]\w*)['"]\s+in\s+locals\(\)/g)) {
    if (!defined.has(match[1])) return true;
  }
  for (const match of scanned.matchAll(/\b([A-Za-z_]\w*)\s*\(/g)) {
    const name = match[1];
    if (syntax.has(name) || defined.has(name) || BUILTINS.has(name)) continue;
    return true;
  }

  const keywords = new Set(['assert', 'and', 'or', 'not', 'in', 'is', 'if', 'else', 'elif', 'for', 'lambda', 'return', 'with', 'as']);
  for (const line of scanned.split('\n')) {
    if (!/\bassert\b/.test(line)) continue;
    for (const match of line.matchAll(/\b([A-Za-z_]\w*)\b/g)) {
      const name = match[1];
      if (keywords.has(name) || BUILTINS.has(name) || defined.has(name)) continue;
      return true;
    }
  }
  return false;
}
