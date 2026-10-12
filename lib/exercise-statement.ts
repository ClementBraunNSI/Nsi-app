export type StatementParts = {
  enonce: string;
  consignes?: string;
  indice?: string;
  indiceTitle?: string;
  exemples?: string;
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

function withoutHiddenSolution(content: string) {
  return (content || '')
    .replace(/<Correction>[\s\S]*?<\/Correction>/gi, '')
    .replace(/<Verification>[\s\S]*?<\/Verification>/gi, '');
}

/** Split an énoncé into the blocks the sheet actually wrote. Correction and hidden solutions are dropped. */
export function splitStatement(content: string, label = ''): StatementParts {
  const source = withoutHiddenSolution(content);
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
  };
}
