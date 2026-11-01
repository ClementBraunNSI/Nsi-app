export type StatementParts = {
  enonce: string;
  consignes?: string;
  indice?: string;
  indiceTitle?: string;
  exemples?: string;
  /** <Indices> : indices révélés un par un, le dernier est le pseudo-code. */
  hints?: string[];
};

type SectionKind = 'consignes' | 'indice' | 'exemples' | 'correction';

function fold(text: string) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function sectionOf(line: string): { kind: SectionKind; rest: string; hintTitle?: string } | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  const heading = trimmed.match(/^#{1,6}\s+(.+)$/);
  const bold = trimmed.match(/^(?:[-*+]\s+)?\*\*([^*]+)\*\*(.*)$/);
  if (!heading && !bold) return null;

  const rawLabel = (heading?.[1] ?? bold?.[1] ?? '').trim();
  const label = rawLabel.replace(/[:.\s]+$/g, '').trim();
  const key = fold(label);
  if (!/^(consignes?|indices?|astuces?|exemples?|correction)$/.test(key)) return null;

  const rest = (heading ? '' : (bold?.[2] ?? '')).replace(/^[:.\s]+/, '').trim();
  if ((key === 'exemple' || key === 'exemples') && rest) return null;

  if (key === 'consigne' || key === 'consignes') return { kind: 'consignes', rest };
  if (key === 'exemple' || key === 'exemples') return { kind: 'exemples', rest };
  if (key === 'correction') return { kind: 'correction', rest };
  return { kind: 'indice', rest, hintTitle: key.startsWith('astuce') ? 'Astuce' : 'Indice' };
}

function pack(lines: string[]) {
  const text = lines.join('\n').trim();
  return text || undefined;
}

function stripRepeatedTitle(enonce: string, label: string) {
  const match = enonce.match(/^\s*#{1,6}\s+([^\n]+)\n+([\s\S]*)$/);
  if (!match) return enonce.trim();
  const heading = fold(match[1]).replace(/[^a-z0-9]+/g, ' ').trim();
  const expected = fold(label).replace(/[^a-z0-9]+/g, ' ').trim();
  const rest = match[2].trim();
  if (!rest || !expected) return enonce.trim();
  if (heading.includes(expected) || expected.includes(heading)) return rest;
  return enonce.trim();
}

/** Drop solution, test source and editor starter code before markdown is sent to the browser. The énoncé stays. */
export function stripHiddenExerciseBlocks(markdown: string, options: { keepCorrection?: boolean } = {}) {
  // La correction n'est gardée que pour le mode projection d'un compte enseignant (révélée au clic).
  const withoutCorrection = options.keepCorrection ? (markdown || '') : (markdown || '').replace(/<Correction>[\s\S]*?<\/Correction>/gi, '');
  return withoutCorrection
    .replace(/<Verification>[\s\S]*?<\/Verification>/gi, '')
    .replace(/<CodeDepart>[\s\S]*?<\/CodeDepart>/gi, '')
    .replace(/<BaseSQL>[\s\S]*?<\/BaseSQL>/gi, '');
}

/**
 * L'IDE lit l'énoncé en Markdown, pas en MDX : les composants du site (`<Renards n="1" />`,
 * `<Icone nom="star" />`, un visualiseur…) et les commentaires MDX entre accolades s'y afficheraient en texte brut.
 * Les blocs de code restent intacts.
 */
export function stripSiteComponents(markdown: string) {
  return (markdown || '')
    .split(/(```[\s\S]*?```)/g)
    .map((part) => (part.startsWith('```')
      ? part
      : part
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        .replace(/[ \t]*<[A-Z][A-Za-z0-9]*\b[^<>]*\/>/g, '')))
    .join('');
}

function dedentBlock(text: string) {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indents = lines.filter((line) => line.trim()).map((line) => line.search(/\S/));
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(Math.min(min, line.search(/\S|$/)))).join('\n').trim();
}

/** Sort les blocs <Indices> de l'énoncé : chaque <Indice> devient un texte Markdown. */
export function extractHints(markdown: string): { rest: string; hints: string[] } {
  const hints: string[] = [];
  const rest = (markdown || '').replace(/<Indices>([\s\S]*?)<\/Indices>/g, (_, block: string) => {
    for (const hint of block.matchAll(/<Indice>([\s\S]*?)<\/Indice>/g)) {
      const text = stripSiteComponents(dedentBlock(hint[1]));
      if (text) hints.push(text);
    }
    return '';
  });
  return { rest, hints };
}

/** Split an énoncé into the blocks the sheet actually wrote. Correction and hidden solutions are dropped. */
export function splitStatement(content: string, label = ''): StatementParts {
  const { rest, hints } = extractHints(stripHiddenExerciseBlocks(content));
  const source = stripSiteComponents(rest);
  const buckets: Record<'enonce' | 'consignes' | 'indice' | 'exemples', string[]> = {
    enonce: [],
    consignes: [],
    indice: [],
    exemples: [],
  };
  let current: keyof typeof buckets | 'drop' = 'enonce';
  let indiceTitle: string | undefined;

  for (const line of source.split('\n')) {
    const hit = sectionOf(line);
    if (hit) {
      if (hit.kind === 'correction') {
        current = hit.rest ? 'enonce' : 'drop';
        continue;
      }
      if (hit.kind === 'indice' && hit.hintTitle) {
        indiceTitle = indiceTitle === 'Indice' ? 'Indice' : hit.hintTitle;
        if (hit.hintTitle === 'Indice') indiceTitle = 'Indice';
      }
      if (hit.rest) {
        buckets[hit.kind].push(hit.rest);
        current = 'enonce';
      } else {
        current = hit.kind;
      }
      continue;
    }
    if (current === 'drop') continue;
    buckets[current].push(line);
  }

  const indice = pack(buckets.indice);
  return {
    enonce: stripRepeatedTitle(pack(buckets.enonce) || '', label),
    consignes: pack(buckets.consignes),
    indice,
    indiceTitle: indice ? indiceTitle || 'Indice' : undefined,
    exemples: pack(buckets.exemples),
    hints: hints.length ? hints : undefined,
  };
}
