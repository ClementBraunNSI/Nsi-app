import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { ENQUETES } from '../lib/enquetes/cases';
import { buildSqlScript, isCulprit, tableToCsv } from '../lib/enquetes/build';
import { friendlySqlError, runStatements, type SqlDb } from '../lib/enquetes/engines';

const require = createRequire(import.meta.url);

async function openCase(script: string): Promise<SqlDb> {
  const initSqlJs = require('sql.js/dist/sql-asm.js') as () => Promise<{ Database: new () => SqlDb }>;
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

describe('erreurs SQL', () => {
  async function run(query: string) {
    const db = await openCase(buildSqlScript(ENQUETES[0]));
    try {
      return runStatements(db, query);
    } finally {
      db.close();
    }
  }

  it('affichent le mot fautif et sa ligne', async () => {
    const cases: [string, string, number][] = [
      ['SELEC * FROM rapports', 'près de « SELEC »', 1],
      // Le premier « date » est correct : c'est celui de la ligne 3 qui bloque.
      ['SELECT date, lieu\nFROM rapports\nORDER date', 'près de « date »', 3],
      ['SELECT * FROM rapports;\nSELECT * FROM temoignage', 'La table « temoignage »', 2],
      ['SELECT nom2\nFROM rapports', 'La colonne « nom2 »', 1],
      ["SELECT * FROM rapports\nWHERE lieu = 'x", "Le texte « 'x »", 2],
      ['SELECT * FROM rapports\nWHERE', 'après « WHERE »', 2],
      ['SELECT * FROM rapports WHERE id IN (\n  SELECT rapport_id FROM temoignages', 'parenthèse « ( »', 1],
      ['SELECT rapports.id\nFROM rapports JOIN temoignages\nON id = rapport_id', 'La colonne « id »', 3],
      ["-- SELEC\nSELECT * FROM rapports WHERE lieu = 'SELEC'\nAND SELEC", 'La colonne « SELEC »', 3],
    ];
    for (const [query, message, line] of cases) {
      const outcome = await run(query);
      expect(outcome.error, query).toContain(message);
      expect(outcome.errorLine, query).toBe(line);
    }
  });

  it('gardent le message brut quand il n’y a pas de traduction', () => {
    expect(friendlySqlError('datatype mismatch')).toBe('Erreur SQL : datatype mismatch');
    expect(friendlySqlError('')).toBe('Erreur SQL inconnue.');
  });

  it('n’empêchent pas d’exécuter chaque instruction', async () => {
    const outcome = await run('SELECT COUNT(*) FROM rapports;; SELECT 1 AS un');
    expect(outcome.error).toBeUndefined();
    expect(outcome.results.map((result) => result.columns)).toEqual([['COUNT(*)'], ['un']]);
  });
});
