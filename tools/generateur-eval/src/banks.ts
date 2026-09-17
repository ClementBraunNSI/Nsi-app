import yaml from 'js-yaml';
import type { BankQuestion } from '@nsi-tools/shared/types';

interface BankYaml {
  id?: string;
  label?: string;
  questions?: BankQuestion[];
}

export interface BankEntry {
  id: string;
  label: string;
  questions: BankQuestion[];
}

const bankModules = import.meta.glob('../../banques/**/*.yaml', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function parseBank(path: string, raw: string): BankEntry {
  const parsed = yaml.load(raw) as BankYaml;
  const fallbackId = path.replace(/^.*\/([^/]+)\.yaml$/, '$1');
  return {
    id: parsed.id ?? fallbackId,
    label: parsed.label ?? fallbackId,
    questions: parsed.questions ?? [],
  };
}

export const BANK_LIST: BankEntry[] = Object.entries(bankModules).map(([path, raw]) =>
  parseBank(path, raw),
);

export function parseBankYaml(raw: string): BankEntry {
  const parsed = yaml.load(raw) as BankYaml;
  const id = parsed.id ?? 'import';
  return {
    id,
    label: parsed.label ?? id,
    questions: parsed.questions ?? [],
  };
}
