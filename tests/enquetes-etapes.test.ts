import { createRequire } from 'node:module';
import * as Blockly from 'blockly/core';
import { describe, expect, it } from 'vitest';
import { defineEnqueteBlocks, setBlocklySchema, workspaceToSql } from '../lib/enquetes/blockly';
import { accuse, buildSqlScript, solvedCount, tableToCsv } from '../lib/enquetes/build';
import { ENQUETES, getEnquete } from '../lib/enquetes/cases';
import { stagesOf, toPublic, type PublicEnquete } from '../lib/enquetes/types';

const require = createRequire(import.meta.url);

type Db = { exec: (sql: string) => { columns: string[]; values: unknown[][] }[]; close: () => void };

async function openStage(view: PublicEnquete): Promise<Db> {
  const initSqlJs = require('sql.js/dist/sql-asm.js') as () => Promise<{ Database: new () => Db }>;
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.exec(buildSqlScript(view));
  return db;
}

const gland = getEnquete('gland-d-or')!;
const culprits = stagesOf(gland).map((stage) => stage.culprit);

describe('enquêtes en plusieurs étapes', () => {
  for (const enquete of ENQUETES.filter((item) => stagesOf(item).length > 1)) {
    stagesOf(enquete).forEach((stage, index) => {
      it(`« ${enquete.title} », étape ${index + 1} (${stage.title}) se résout avec ses registres`, async () => {
        const db = await openStage(toPublic(enquete, index));
        for (const query of stage.solutionSql) expect(() => db.exec(query), query).not.toThrow();
        const last = db.exec(stage.solutionSql[stage.solutionSql.length - 1]);
        expect(last[0]?.values.map((row) => row[0])).toEqual([stage.culprit]);
        db.close();
      });
    });
  }

  it('« L’affaire du Gland d’Or » compte au moins trois rebondissements, avec un coupable différent à chaque étape', () => {
    const stages = stagesOf(gland);
    expect(stages.length).toBeGreaterThanOrEqual(4);
    expect(new Set(culprits).size).toBe(stages.length);
    stages.slice(0, -1).forEach((stage) => expect(stage.twist).toBeTruthy());
    expect(stages[stages.length - 1].twist).toBeUndefined();
  });

  it('chaque coupable trouvé ouvre l’étape suivante, jusqu’au dénouement', () => {
    const found: string[] = [];
    culprits.forEach((culprit, index) => {
      const result = accuse(gland, found, culprit.toLowerCase());
      expect(result.correct).toBe(true);
      if (!result.correct) return;
      expect(result.culprit).toBe(culprit);
      if (index < culprits.length - 1) {
        expect(result.twist).toBe(stagesOf(gland)[index].twist);
        expect(result.next?.stage).toMatchObject({ index: index + 1, total: culprits.length });
        expect(result.next?.solvedStages?.map((stage) => stage.culprit)).toEqual(culprits.slice(0, index + 1));
      } else {
        expect(result.next).toBeUndefined();
        expect(result.twist).toBeUndefined();
      }
      found.push(culprit);
    });
    expect(solvedCount(gland, found)).toBe(culprits.length);
  });

  it('refuse le coupable d’une autre étape et ne se laisse pas sauter d’étape', () => {
    expect(accuse(gland, [], culprits[1]).correct).toBe(false);
    expect(accuse(gland, [culprits[0]], culprits[0]).correct).toBe(false);
    // Des réponses inventées ne font pas avancer : on reste à la première étape.
    expect(solvedCount(gland, ['Zélie', culprits[1]])).toBe(0);
    expect(accuse(gland, ['Zélie', culprits[1]], culprits[2]).correct).toBe(false);
  });

  it('n’envoie au navigateur ni la solution ni la suite de l’étape en cours', () => {
    stagesOf(gland).forEach((stage, index) => {
      const view = toPublic(gland, index);
      expect(view).not.toHaveProperty('culprit');
      expect(view).not.toHaveProperty('solutionSql');
      expect(view).not.toHaveProperty('next');
      expect(view.solvedStages).toHaveLength(index);
      const json = JSON.stringify(view);
      expect(json).not.toContain(stage.explanation);
      if (stage.twist) expect(json).not.toContain(stage.twist);
    });
  });

  it('ouvre de nouveaux registres à chaque étape, et en remplace certains', () => {
    const names = stagesOf(gland).map((_, index) => toPublic(gland, index).tables.map((table) => table.name));
    names.forEach((tables, index) => {
      expect(tables[tables.length - 1]).toBe('animaux');
      if (index > 0) expect(tables.length).toBeGreaterThan(names[index - 1].length);
    });
    const passages = (index: number) => toPublic(gland, index).tables.find((table) => table.name === 'passages')!.rows.length;
    expect(passages(1)).toBeGreaterThan(passages(0));
  });

  it('se résout aussi en Python à la dernière étape', async () => {
    const { loadPyodide } = require('pyodide') as { loadPyodide: (options?: object) => Promise<any> };
    const pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} });
    for (const table of toPublic(gland, 3).tables) pyodide.FS.writeFile(`${table.name}.csv`, tableToCsv(table));
    const found = pyodide.runPython(`
import csv
def lire(nom):
    with open(nom + ".csv", encoding="utf-8") as f:
        return list(csv.DictReader(f))
comptes = {c["intitule"]: c for c in lire("comptes")}
hermes, filou = comptes["Hermès"]["id"], comptes["Filou"]["id"]
total, plus_gros, payeurs_filou = {}, {}, set()
for v in lire("virements"):
    if v["vers_compte"] == hermes:
        total[v["de_compte"]] = total.get(v["de_compte"], 0) + int(v["montant"])
        plus_gros[v["de_compte"]] = max(plus_gros.get(v["de_compte"], 0), int(v["montant"]))
    if v["vers_compte"] == filou:
        payeurs_filou.add(v["de_compte"])
suspects = [c for c in total if total[c] == 200 and plus_gros[c] <= 50 and c in payeurs_filou]
titulaires = [c["titulaire_id"] for c in comptes.values() if c["id"] in suspects]
",".join(a["nom"] for a in lire("animaux") if a["id"] in titulaires)
`);
    expect(found).toBe(culprits[3]);
  }, 30000);
});

describe('« L’affaire du Gland d’Or » en mode Blocs', () => {
  type Clause = { type: string; fields?: Record<string, unknown> };

  function stack(clauses: Clause[]): unknown {
    const [first, ...rest] = clauses;
    if (!first) return undefined;
    const next = stack(rest);
    return { ...first, ...(next ? { next: { block: next } } : {}) };
  }

  async function blocks(index: number, table: string, clauses: Clause[]) {
    const view = toPublic(gland, index);
    defineEnqueteBlocks();
    setBlocklySchema(view);
    const workspace = new Blockly.Workspace();
    Blockly.serialization.workspaces.load(
      { blocks: { languageVersion: 0, blocks: [{ type: 'enquete_requete', x: 0, y: 0, fields: { TABLE: table }, inputs: { CLAUSES: { block: stack(clauses) } } }] } },
      workspace,
    );
    const sql = workspaceToSql(workspace);
    workspace.dispose();
    const db = await openStage(view);
    const [result] = db.exec(sql ?? '');
    db.close();
    return { sql, values: result?.values ?? [] };
  }

  const filtre = (COL: string, OP: string, VALUE: string | number = ''): Clause => ({ type: 'enquete_filtre', fields: { COL, OP, VALUE: String(VALUE) } });
  const relier = (TABLE: string, LEFT: string, RIGHT: string): Clause => ({ type: 'enquete_relier', fields: { TABLE, LEFT, RIGHT } });
  const colonne = (COL: string): Clause => ({ type: 'enquete_colonne', fields: { COL } });

  it('étape 2 : « est vide » retrouve la lettre sans signature', async () => {
    const { sql, values } = await blocks(1, 'courrier', [filtre('courrier.destinataire_id', '=', 1), filtre('courrier.expediteur_id', 'NULL', 'valeur'), colonne('courrier.id')]);
    expect(sql).toContain('courrier.expediteur_id IS NULL');
    expect(values).toEqual([[6]]);
  });

  it('étape 4 : compter les petits virements reçus par Hermès, puis croiser avec ceux reçus par Filou', async () => {
    const habitues = await blocks(3, 'virements', [
      relier('comptes', 'virements.de_compte', 'comptes.id'),
      relier('animaux', 'comptes.titulaire_id', 'animaux.id'),
      filtre('virements.vers_compte', '=', 103),
      filtre('virements.montant', '<=', 50),
      { type: 'enquete_compter', fields: { COL: 'animaux.nom' } },
      { type: 'enquete_au_moins', fields: { N: 3 } },
    ]);
    const payeursFilou = await blocks(3, 'virements', [
      relier('comptes', 'virements.de_compte', 'comptes.id'),
      relier('animaux', 'comptes.titulaire_id', 'animaux.id'),
      filtre('virements.vers_compte', '=', 102),
      colonne('animaux.nom'),
    ]);
    const suspects = habitues.values.map(([nom]) => nom).filter((nom) => payeursFilou.values.some(([autre]) => autre === nom));
    expect(suspects).toEqual([culprits[3]]);
  });
});
