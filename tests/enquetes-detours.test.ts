import { createRequire } from 'node:module';
import * as Blockly from 'blockly/core';
import { describe, expect, it } from 'vitest';
import { defineEnqueteBlocks, setBlocklySchema, workspaceToSql } from '../lib/enquetes/blockly';
import { accuse, buildSqlScript, solvedCount, tableToCsv } from '../lib/enquetes/build';
import { getEnquete } from '../lib/enquetes/cases';
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

async function query(index: number, sql: string) {
  const db = await openStage(toPublic(detours, index));
  const [result] = db.exec(sql);
  db.close();
  return result?.values ?? [];
}

const detours = getEnquete('bois-des-detours')!;
const culprits = stagesOf(detours).map((stage) => stage.culprit);

describe('« Le Bois des Détours »', () => {
  it('compte quatre étapes, avec un rebondissement entre chacune', () => {
    const stages = stagesOf(detours);
    expect(culprits).toEqual(['Ambre', 'Sanglou', 'Musc', 'Pépin']);
    stages.slice(0, -1).forEach((stage) => expect(stage.twist).toBeTruthy());
    expect(stages[3].twist).toBeUndefined();
  });

  it('chaque coupable trouvé ouvre l’étape suivante, jusqu’au retour au point de départ', () => {
    const found: string[] = [];
    culprits.forEach((culprit, index) => {
      expect(accuse(detours, found, 'Roux').correct).toBe(false);
      const result = accuse(detours, found, culprit.toLowerCase());
      expect(result.correct).toBe(true);
      if (!result.correct) return;
      if (index < culprits.length - 1) {
        expect(result.next?.stage).toMatchObject({ index: index + 1, total: 4 });
        expect(result.next?.objective).toBe(stagesOf(detours)[index + 1].objective);
      } else {
        expect(result.next).toBeUndefined();
      }
      found.push(culprit);
    });
    expect(solvedCount(detours, found)).toBe(4);
    // Accents et majuscules ne comptent pas, la réponse peut être une phrase.
    expect(accuse(detours, culprits.slice(0, 3), 'pepin le lievre').correct).toBe(true);
  });

  it('ne laisse pas sauter d’étape', () => {
    expect(accuse(detours, [], 'Pépin').correct).toBe(false);
    expect(accuse(detours, ['Ambre'], 'Musc').correct).toBe(false);
    expect(solvedCount(detours, ['Sanglou', 'Ambre'])).toBe(0);
  });

  it('étape 1 : les panneaux menteurs font revenir à la Clairière', async () => {
    const menteurs = await query(0, 'SELECT panneaux.carrefour, panneaux.indique, sentiers.arrivee FROM panneaux JOIN sentiers ON sentiers.id = panneaux.sentier_id WHERE panneaux.indique <> sentiers.arrivee');
    expect(menteurs).toHaveLength(4);
    // Suivre « Carrefour du Hêtre » depuis la Clairière, puis « Pont de Pierre » : retour au départ.
    const suivre = async (lieu: string, panneau: string) =>
      (await query(0, `SELECT sentiers.arrivee FROM panneaux JOIN sentiers ON sentiers.id = panneaux.sentier_id WHERE panneaux.carrefour = '${lieu}' AND panneaux.indique = '${panneau}'`))[0][0];
    const etape = await suivre('Clairière', 'Carrefour du Hêtre');
    expect(etape).toBe('Mare aux Iris');
    expect(await suivre(String(etape), 'Pont de Pierre')).toBe('Clairière');
  });

  it('étape 1 : Roux et Piquet n’ont pas touché tous les panneaux menteurs', async () => {
    const parAnimal = await query(
      0,
      'SELECT animaux.nom, COUNT(DISTINCT panneaux.id) FROM traces JOIN panneaux ON panneaux.id = traces.panneau_id JOIN sentiers ON sentiers.id = panneaux.sentier_id JOIN animaux ON animaux.id = traces.animal_id WHERE panneaux.indique <> sentiers.arrivee GROUP BY animaux.nom ORDER BY animaux.nom',
    );
    // SQLite trie octet par octet : « Piquet » passe avant « Pépin ».
    expect(parAnimal).toEqual([['Ambre', 4], ['Piquet', 3], ['Pépin', 1], ['Roux', 1]]);
  });

  it('étape 2 : sans corriger l’heure d’été, la piste mène à Cerise', async () => {
    const naif = await query(
      1,
      "SELECT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Clairière' AND passages.date = '2026-10-27' AND passages.heure BETWEEN '07:00' AND '08:00' AND animaux.taille_cm >= 100",
    );
    expect(naif).toEqual([['Cerise']]);
    const erreurs = await query(1, 'SELECT carte.sentier_id FROM carte JOIN sentiers ON sentiers.id = carte.sentier_id WHERE carte.arrivee <> sentiers.arrivee ORDER BY carte.sentier_id');
    expect(erreurs).toEqual([[1], [3], [4], [13]]);
  });

  it('étape 3 : le Coin aux Cèpes a disparu de la carte, et sans filtre de date il y a plusieurs suspects', async () => {
    expect(await query(2, 'SELECT DISTINCT arrivee FROM sentiers WHERE arrivee NOT IN (SELECT arrivee FROM carte)')).toEqual([['Coin aux Cèpes']]);
    const tous = await query(2, "SELECT DISTINCT animaux.nom FROM passages JOIN animaux ON animaux.id = passages.animal_id WHERE passages.lieu = 'Coin aux Cèpes' ORDER BY animaux.nom");
    expect(tous.length).toBeGreaterThan(1);
  });

  it('étape 4 : trois baisses du comptage, et le piège du Coin aux Cèpes ne voit que le nord', async () => {
    const baisses = await query(3, stagesOf(detours)[3].solutionSql[0]);
    expect(baisses.map(([date, avant, apres]) => `${date} ${avant}-${apres}`)).toEqual(['2026-10-28 10:00-12:00', '2026-10-29 08:00-10:00', '2026-10-30 10:00-12:00']);
    const piege = toPublic(detours, 3).tables.find((table) => table.name === 'pieges')!;
    expect(piege.rows.find((row) => row[0] === 'Coin aux Cèpes')?.[2]).toContain('nord');
    // Pendant ses « errances », Pépin est photographié au Vieux Moulin.
    expect(await query(3, "SELECT COUNT(*) FROM passages WHERE animal_id = 23 AND lieu = 'Vieux Moulin'")).toEqual([[3]]);
  });

  it('n’envoie ni la solution ni la suite au navigateur', () => {
    stagesOf(detours).forEach((stage, index) => {
      const view = toPublic(detours, index);
      expect(view).not.toHaveProperty('culprit');
      expect(view).not.toHaveProperty('solutionSql');
      expect(view.solvedStages?.map((done) => done.culprit) ?? []).toEqual(culprits.slice(0, index));
      const json = JSON.stringify(view);
      expect(json).not.toContain(stage.explanation);
      if (stage.twist) expect(json).not.toContain(stage.twist);
    });
    // Le piège du Coin aux Cèpes ne révèle son angle mort qu'à la dernière étape.
    expect(JSON.stringify(toPublic(detours, 2))).not.toContain('sentier nord');
  });

  it('se résout aussi en Python à la dernière étape', async () => {
    const { loadPyodide } = require('pyodide') as { loadPyodide: (options?: object) => Promise<any> };
    const pyodide = await loadPyodide({ stdout: () => {}, stderr: () => {} });
    for (const table of toPublic(detours, 3).tables) pyodide.FS.writeFile(`${table.name}.csv`, tableToCsv(table));
    const found = pyodide.runPython(`
import csv
def lire(nom):
    with open(nom + ".csv", encoding="utf-8") as f:
        return list(csv.DictReader(f))
comptages = lire("comptages")
baisses = []
for avant, apres in zip(comptages, comptages[1:]):
    if avant["date"] == apres["date"] and int(apres["cepes"]) < int(avant["cepes"]):
        baisses.append((avant["date"], avant["heure"], apres["heure"]))
perdu = {}
for d in lire("declarations"):
    for date, debut, fin in baisses:
        if d["date"] == date and d["debut"] <= debut and d["fin"] >= fin:
            perdu[d["animal_id"]] = perdu.get(d["animal_id"], 0) + 1
",".join(a["nom"] for a in lire("animaux") if perdu.get(a["id"]) == len(baisses))
`);
    expect(found).toBe('Pépin');
  }, 30000);
});

describe('« Le Bois des Détours » en mode Blocs', () => {
  type Clause = { type: string; fields?: Record<string, unknown>; inputs?: Record<string, unknown> };

  function stack(clauses: Clause[]): unknown {
    const [first, ...rest] = clauses;
    if (!first) return undefined;
    const next = stack(rest);
    return { ...first, ...(next ? { next: { block: next } } : {}) };
  }

  async function blocks(index: number, table: string, clauses: Clause[]) {
    const view = toPublic(detours, index);
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
    return result?.values ?? [];
  }

  const filtre = (COL: string, OP: string, VALUE: string | number): Clause => ({ type: 'enquete_filtre', fields: { COL, OP, VALUE: String(VALUE) } });
  const relier = (TABLE: string, LEFT: string, RIGHT: string): Clause => ({ type: 'enquete_relier', fields: { TABLE, LEFT, RIGHT } });
  const colonne = (COL: string): Clause => ({ type: 'enquete_colonne', fields: { COL } });

  it('étape 1 : compter les traces sur les quatre panneaux menteurs', async () => {
    const condition = (id: number): Clause => ({ type: 'enquete_condition', fields: { COL: 'traces.panneau_id', OP: '=', VALUE: String(id) } });
    const values = await blocks(0, 'traces', [
      relier('animaux', 'traces.animal_id', 'animaux.id'),
      { type: 'enquete_ou', inputs: { CONDS: { block: stack([condition(101), condition(103), condition(104), condition(113)]) } } },
      { type: 'enquete_compter', fields: { COL: 'animaux.nom' } },
      { type: 'enquete_au_moins', fields: { N: 4 } },
    ]);
    expect(values.map(([nom]) => nom)).toEqual(['Ambre']);
  });

  it('étape 2 : la Clairière entre 08:00 et 09:00 à l’horloge du piège', async () => {
    const values = await blocks(1, 'passages', [
      relier('animaux', 'passages.animal_id', 'animaux.id'),
      filtre('passages.lieu', '=', 'Clairière'),
      filtre('passages.date', '=', '2026-10-27'),
      filtre('passages.heure', '>=', '08:00'),
      filtre('passages.heure', '<=', '09:00'),
      filtre('animaux.taille_cm', '>=', 100),
      colonne('animaux.nom'),
    ]);
    expect(values).toEqual([['Sanglou']]);
  });

  it('étape 3 : les passages au Coin aux Cèpes depuis le 27', async () => {
    const values = await blocks(2, 'passages', [
      relier('animaux', 'passages.animal_id', 'animaux.id'),
      filtre('passages.lieu', '=', 'Coin aux Cèpes'),
      filtre('passages.date', '>=', '2026-10-27'),
      colonne('animaux.nom'),
    ]);
    expect(new Set(values.map(([nom]) => nom))).toEqual(new Set(['Musc']));
  });
});
