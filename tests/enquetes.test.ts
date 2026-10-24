import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { ENQUETES } from '../lib/enquetes/cases';
import { buildSqlScript, isCulprit, tableToCsv } from '../lib/enquetes/build';

const require = createRequire(import.meta.url);

type Db = { exec: (sql: string) => { columns: string[]; values: unknown[][] }[]; close: () => void };

async function openCase(script: string): Promise<Db> {
  const initSqlJs = require('sql.js/dist/sql-asm.js') as () => Promise<{ Database: new () => Db }>;
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.exec(script);
  return db;
}

describe('enquêtes de la forêt', () => {
  for (const enquete of ENQUETES) {
    it(`« ${enquete.title} » se résout et désigne un seul coupable`, async () => {
      const db = await openCase(buildSqlScript(enquete));
      for (const query of enquete.solutionSql) {
        expect(() => db.exec(query), query).not.toThrow();
      }
      const last = db.exec(enquete.solutionSql[enquete.solutionSql.length - 1]);
      const names = last[0]?.values.map((row) => row[0]);
      expect(names).toEqual([enquete.culprit]);
      db.close();
    });
  }

  it('reconnaît le coupable écrit de plusieurs façons, et rien d’autre', () => {
    const [oeufs] = ENQUETES;
    expect(isCulprit(oeufs, 'Zélie')).toBe(true);
    expect(isCulprit(oeufs, '  zelie la belette ')).toBe(true);
    expect(isCulprit(oeufs, 'Roux')).toBe(false);
    expect(isCulprit(oeufs, '')).toBe(false);
  });

  it('se résout aussi en Python avec le module csv', async () => {
    const { loadPyodide } = require('pyodide') as { loadPyodide: (options?: object) => Promise<any> };
    const pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} });
    const [oeufs] = ENQUETES;
    for (const table of oeufs.tables) pyodide.FS.writeFile(`${table.name}.csv`, tableToCsv(table));
    const found = pyodide.runPython(`
import csv
with open("animaux.csv", encoding="utf-8") as f:
    animaux = list(csv.DictReader(f))
suspects = [a["nom"] for a in animaux
            if a["pelage"] == "brun et blanc" and a["terrier"] == "Vieux Moulin" and 15 <= int(a["taille_cm"]) <= 35]
",".join(suspects)
`);
    expect(found).toBe(oeufs.culprit);
  }, 30000);

  it('échappe les virgules et guillemets dans les CSV', () => {
    const csv = tableToCsv({
      name: 't',
      description: '',
      columns: [{ name: 'a', type: 'TEXT', description: '' }],
      rows: [['bonjour, "toi"']],
    });
    expect(csv).toBe('a\n"bonjour, ""toi"""\n');
  });
});
