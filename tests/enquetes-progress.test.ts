import { beforeEach, describe, expect, it } from 'vitest';
import { caseStatus, clearCase, markSolved, readOutcome, readProgress, readSolved, saveOutcome, saveProgress } from '../lib/enquetes/progress';

/** Petit stockage local en mémoire, comme celui du navigateur. */
class MemoryStorage {
  private data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  key(index: number) {
    return [...this.data.keys()][index] ?? null;
  }
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, String(value));
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
  clear() {
    this.data.clear();
  }
}

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true, writable: true });
});

describe('avancée des enquêtes', () => {
  it('passe de « nouvelle » à « en cours » puis « résolue »', () => {
    expect(caseStatus('miel-envole')).toBe('new');
    saveProgress('miel-envole', { hints: 2 });
    expect(caseStatus('miel-envole')).toBe('started');
    expect(readProgress('miel-envole')).toMatchObject({ hints: 2, attempts: 0, answer: '' });
    markSolved('miel-envole', { culprit: 'Bourru', explanation: '…' });
    expect(caseStatus('miel-envole')).toBe('solved');
  });

  it('garde le dernier résultat, raccourci mais avec le vrai nombre de lignes', () => {
    const rows = Array.from({ length: 250 }, (_, index) => [index]);
    saveOutcome('barrage-perce', 'sql', { results: [{ columns: ['id'], rows }] });
    const saved = readOutcome('barrage-perce', 'sql');
    expect(saved?.results[0].rows).toHaveLength(200);
    expect(saved?.results[0].total).toBe(250);
    expect(readOutcome('barrage-perce', 'python')).toBeNull();
  });

  it('garde les coupables trouvés étape par étape, et « recommencer » les efface', () => {
    expect(readProgress('gland-d-or').found).toEqual([]);
    saveProgress('gland-d-or', { found: ['Roux'], hints: 0 });
    saveProgress('gland-d-or', { hints: 2 });
    expect(readProgress('gland-d-or')).toMatchObject({ found: ['Roux'], hints: 2 });
    expect(caseStatus('gland-d-or')).toBe('started');
    clearCase('gland-d-or');
    expect(readProgress('gland-d-or').found).toEqual([]);
  });

  it('« recommencer » efface une seule enquête, sans toucher aux autres', () => {
    saveProgress('oeufs-croques', { hints: 1 });
    localStorage.setItem('enquete-oeufs-croques-notes', 'Zélie ?');
    markSolved('oeufs-croques', { culprit: 'Zélie', explanation: '…' });
    saveProgress('miel-envole', { attempts: 3 });

    clearCase('oeufs-croques');

    expect(caseStatus('oeufs-croques')).toBe('new');
    expect(localStorage.getItem('enquete-oeufs-croques-notes')).toBeNull();
    expect(readSolved()).not.toContain('oeufs-croques');
    expect(readProgress('miel-envole').attempts).toBe(3);
  });
});
